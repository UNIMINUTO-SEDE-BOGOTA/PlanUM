import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import PlanForm from './components/PlanForm';
import SuccessScreen from './components/SuccessScreen';

export type AppState = 'splash' | 'welcome' | 'form' | 'success';

export interface PlanData {
  // Nuevos campos
  tipoPlan: string;
  año: string;
  
  // Campos existentes
  frentePDI: string;
  nivel1: string;
  nivel2: string;
  prioridad: string;
  vicerrectoria: string;
  areaPrograma: string;
  cargoResponsable: string;
  iniciativa: string;
  
  // Indicadores
  indicador: string;
  lineaBase: string;
  medicion: string;
  
  // IA
  accionMejora: string;
  meta: string;
  actividad: string;
  
  // Fechas
  fechaInicio: string;
  fechaCierre: string;
  
  // Avance y evidencia
  avance: string;
  evidencia: string;
  evidenciaUrl?: string;
  evidenciaUrls?: string[];
}

function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [planData, setPlanData] = useState<PlanData | null>(null);

  return (
    <div className="min-h-screen print:min-h-0 print:block print:bg-white text-white print:text-black flex flex-col font-sans font-light relative"
      style={{ backgroundColor: '#0d1f29' }}>

      {appState === 'splash' && (
        <SplashScreen onComplete={() => setAppState('welcome')} />
      )}

      {/* Welcome: sin padding, ocupa toda la pantalla */}
      {appState === 'welcome' && (
        <div className="flex-1 w-full min-h-screen">
          <WelcomeScreen onStart={() => setAppState('form')} />
        </div>
      )}

      {/* Form y Success: con padding y ancho limitado */}
      {(appState === 'form' || appState === 'success') && (
        <main className="flex-1 overflow-y-auto p-4 md:p-12 print:p-0 w-full min-h-screen print:min-h-0">
          <div className="max-w-3xl mx-auto print:max-w-none">

            {appState === 'form' && (
              <PlanForm
                initialData={planData}
                onGoHome={() => { setPlanData(null); setAppState('welcome'); }}
                onSubmit={(data) => {
                  setPlanData(data);
                  setAppState('success');
                }}
              />
            )}

            {appState === 'success' && planData && (
              <SuccessScreen
                data={planData}
                onBack={() => setAppState('form')}
                onNew={() => {
                  setPlanData(null);
                  setAppState('form');
                }}
              />
            )}
          </div>
        </main>
      )}
    </div>
  );
}

export default App;