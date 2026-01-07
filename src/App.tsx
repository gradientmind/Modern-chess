import { useState, useEffect } from 'react';
import { HomeView } from './components/views/HomeView';
import { RulesView } from './components/views/RulesView';
import { OnlineMenu } from './components/views/OnlineMenu';
import { Game } from './components/views/Game';
import { auth, initAuth, onAuthStateChanged, isFirebaseConfigured, type User } from './config/firebase';
import type { ViewState, OnlineConfig, BotDifficulty } from './types';

function App() {
  const [view, setView] = useState<ViewState>('home');
  const [onlineConfig, setOnlineConfig] = useState<OnlineConfig | null>(null);
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>(1);
  const [_user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      initAuth().catch(console.error);
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
    }
  }, []);

  const startGame = (mode: string, config?: { difficulty?: BotDifficulty } | OnlineConfig) => {
    if (mode === 'online' && config && 'gameId' in config) {
      setOnlineConfig(config);
      setView('game-online');
      return;
    }
    if (mode === 'bot' && config && 'difficulty' in config && config.difficulty) {
      setBotDifficulty(config.difficulty);
    }
    if (mode === 'online-menu') {
      setView('online-menu');
    } else {
      setView(`game-${mode}` as ViewState);
    }
  };

  return (
    <>
      {view === 'home' && (
        <HomeView
          onStartGame={startGame}
          onRules={() => setView('rules')}
          isOnlineEnabled={isFirebaseConfigured}
        />
      )}
      {view === 'online-menu' && (
        <OnlineMenu onBack={() => setView('home')} onStartGame={startGame} />
      )}
      {view === 'game-pvp' && <Game mode="pvp" onExit={() => setView('home')} />}
      {view === 'game-bot' && (
        <Game mode="bot" botDifficulty={botDifficulty} onExit={() => setView('home')} />
      )}
      {view === 'game-online' && onlineConfig && (
        <Game mode="online" onlineConfig={onlineConfig} onExit={() => setView('home')} />
      )}
      {view === 'rules' && <RulesView onBack={() => setView('home')} />}
    </>
  );
}

export default App;
