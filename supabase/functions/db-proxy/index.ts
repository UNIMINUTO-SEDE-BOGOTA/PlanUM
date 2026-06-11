// Supabase Edge Function: db-proxy

// Definir las cabeceras CORS directamente
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
}

Deno.serve(async (req: Request) => {
  // Manejar CORS para peticiones desde el navegador
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Crear cliente de Supabase con credenciales automáticas
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    
    // Importar dinámicamente el cliente de Supabase
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2')
    
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Obtener la operación a realizar
    const body = await req.json()
    const { operation, table, data, match, select = '*' } = body

    // Validar que la tabla existe
    if (!table) {
      return new Response(
        JSON.stringify({ error: 'Table name is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let query = supabaseClient.from(table)

    // Ejecutar la operación solicitada
    switch (operation) {
      case 'select':
        // CONSULTA: SELECT * FROM table WHERE match
        let selectQuery = query.select(select)
        if (match && Object.keys(match).length > 0) {
          selectQuery = selectQuery.match(match)
        }
        const { data: selectData, error: selectError } = await selectQuery
        if (selectError) throw selectError
        return new Response(
          JSON.stringify({ data: selectData, success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'insert':
        // CREACIÓN: INSERT INTO table (data)
        const { data: insertData, error: insertError } = await query.insert(data).select()
        if (insertError) throw insertError
        return new Response(
          JSON.stringify({ data: insertData, success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'update':
        // ACTUALIZACIÓN: UPDATE table SET data WHERE match
        if (!match || Object.keys(match).length === 0) {
          return new Response(
            JSON.stringify({ error: 'Match condition required for update' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }
        const { data: updateData, error: updateError } = await query.update(data).match(match).select()
        if (updateError) throw updateError
        return new Response(
          JSON.stringify({ data: updateData, success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid operation. Use: select, insert, update' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
    }
  } catch (error) {
    console.error('Error in db-proxy:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})