import React, { useState } from 'react';
import CreateIdea from './components/CreateIdea';
import IdeaList from './components/IdeaList';
import { FaLightbulb } from 'react-icons/fa';

function App() {
  const [refresh, setRefresh] = useState(0);

  const handleIdeaCreated = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <FaLightbulb color="var(--primary)" />
          IdeaFlow
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Streamlined Innovation Management System</p>
      </header>

      <main>
        <CreateIdea onIdeaCreated={handleIdeaCreated} />
        <IdeaList refreshTrigger={refresh} />
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', paddingBottom: '2rem' }}>
        <p>&copy; 2026 IdeaFlow Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
