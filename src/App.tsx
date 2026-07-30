import { useState } from 'react'
import { AuthGate } from './components/AuthGate'
import { RouteExplorer } from './components/RouteExplorer'
import { IdeasBoard } from './components/IdeasBoard'
import './App.css'

type Tab = 'adventure' | 'ideas'

function App() {
  const [tab, setTab] = useState<Tab>('adventure')

  return (
    <AuthGate>
      {(profile, signOut) => (
        <div className="shell">
          <header className="topbar">
            <div className="topbar-brand">🏍️ Norwegen Roadtrip</div>
            <div className="topbar-tabs">
              <button
                className={tab === 'adventure' ? 'active' : ''}
                onClick={() => setTab('adventure')}
              >
                🗺️ Abenteuer-Routen
              </button>
              <button className={tab === 'ideas' ? 'active' : ''} onClick={() => setTab('ideas')}>
                💡 Ideen & Anmerkungen
              </button>
            </div>
            <div className="topbar-user">
              <span>
                {profile.avatar} {profile.display_name}
              </span>
              <button className="topbar-signout" onClick={signOut}>
                Abmelden
              </button>
            </div>
          </header>
          <main className="shell-body">
            {tab === 'adventure' ? <RouteExplorer profile={profile} /> : <IdeasBoard profile={profile} />}
          </main>
        </div>
      )}
    </AuthGate>
  )
}

export default App
