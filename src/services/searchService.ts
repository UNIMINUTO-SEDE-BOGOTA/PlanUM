// services/searchService.ts

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export interface SearchResult {
  id: string;
  text: string;
  category?: string;
}

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${ANON_KEY}`,
};

export const searchIndicators = async (
  query: string,
  limit: number = 10
): Promise<SearchResult[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    // Traer TODOS los indicadores (sin filtro)
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        operation: 'select',
        schema: 'pum',
        table: 'plan_um',
        select: 'id, "Indicador"',
        match: {},
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      console.error('Error en búsqueda:', json.error);
      return [];
    }

    if (!json.data || json.data.length === 0) {
      return [];
    }

    // Filtrar en el cliente (porque la Edge Function no soporta ilike)
    const searchTerm = query.trim().toLowerCase();
    const filtered = json.data
      .filter((item: any) => {
        const indicador = (item.Indicador || '').toLowerCase();
        return indicador.includes(searchTerm);
      })
      .slice(0, limit);

    return filtered.map((item: any) => ({
      id: String(item.id),
      text: item.Indicador || '',
      category: 'General',
    }));

  } catch (error) {
    console.error('Error en searchIndicators:', error);
    return [];
  }
};

export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        operation: 'select',
        schema: 'pum',
        table: 'plan_um',
        select: '"Indicador"',
        match: {},
      }),
    });

    const json = await res.json();

    if (!res.ok || !json.success || !json.data) {
      return [];
    }

    const searchTerm = query.trim().toLowerCase();
    const suggestions = json.data
      .map((item: any) => item.Indicador || '')
      .filter((text: string) => text.toLowerCase().includes(searchTerm))
      .slice(0, 5);

    return suggestions;

  } catch (error) {
    console.error('Error en getSearchSuggestions:', error);
    return [];
  }
};