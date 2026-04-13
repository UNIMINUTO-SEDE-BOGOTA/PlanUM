import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import PlanForm from './components/PlanForm';
import AIPanel from './components/AIPanel';
import SuccessScreen from './components/SuccessScreen';

export type AppState = 'splash' | 'welcome' | 'form' | 'success';

function App() {
  const [appState, setAppState] = useState<AppState>('splash');

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_center,_#2e1065_0%,_#050505_60%,_#000000_100%)] text-white flex flex-col font-sans font-light relative">
      {appState === 'splash' && <SplashScreen onComplete={() => setAppState('welcome')} />}
      
      {appState !== 'splash' && (
        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-12 relative z-10 w-full h-screen">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              {appState === 'welcome' && <WelcomeScreen onStart={() => setAppState('form')} />}
              {appState === 'form' && <PlanForm onSubmit={() => setAppState('success')} />}
              {appState === 'success' && <SuccessScreen />}
            </div>
          </main>
          
          {/* Right Panel: AI Suggestions */}
          {(appState === 'welcome' || appState === 'form') && (
            <AIPanel />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
