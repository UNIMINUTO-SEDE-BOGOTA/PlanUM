import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import PlanForm from './components/PlanForm';
import AIPanel from './components/AIPanel';
import SuccessScreen from './components/SuccessScreen';

export type AppState = 'splash' | 'welcome' | 'form' | 'success';

export interface PlanData {
  area: string;
  objetivo: string;
  problematica: string;
  acciones: string;
  descripcion: string;
}

function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [planData, setPlanData] = useState<PlanData | null>(null);

  return (
    <div className="min-h-screen print:min-h-0 print:block bg-[radial-gradient(circle_at_center,_#2e1065_0%,_#050505_60%,_#000000_100%)] print:bg-none print:bg-white text-white print:text-black flex flex-col font-sans font-light relative">
      {appState === 'splash' && <SplashScreen onComplete={() => setAppState('welcome')} />}
      
      {appState !== 'splash' && (
        <div className="flex flex-1 overflow-hidden print:overflow-visible print:block relative">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto print:overflow-visible p-4 md:p-12 print:p-0 relative z-10 w-full h-screen print:h-auto">
            <div className="max-w-4xl mx-auto h-full print:h-auto flex flex-col print:block">
              {appState === 'welcome' && <WelcomeScreen onStart={() => setAppState('form')} />}
              {appState === 'form' && <PlanForm onSubmit={(data) => {
                setPlanData(data);
                setAppState('success');
              }} />}
              {appState === 'success' && planData && <SuccessScreen data={planData} onBack={() => {
                setAppState('welcome');
                setPlanData(null);
              }} />}
            </div>
          </main>
          
          {/* Right Panel: AI Suggestions */}
          {(appState === 'welcome' || appState === 'form') && (
            <div className="print:hidden h-full">
              <AIPanel />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
