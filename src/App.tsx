import { GameProvider } from './state/GameProvider';
import { AppShell } from './components/layout/AppShell';
import { GameScreen } from './components/GameScreen';
import './App.css';

function App() {
  return (
    <GameProvider>
      <AppShell>
        <GameScreen />
      </AppShell>
    </GameProvider>
  );
}

export default App;
