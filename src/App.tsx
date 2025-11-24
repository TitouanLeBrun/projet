import React, { useState, useEffect } from 'react';
import { GoalForm } from './components/GoalForm';
import { AssetsPage } from './pages/AssetsPage';
import { SnapshotsPage } from './pages/SnapshotsPage';
import './App.css';

type Page = 'goal' | 'assets' | 'snapshots';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('goal');
  const [goalSaved, setGoalSaved] = useState(false);
  const [savedGoal, setSavedGoal] = useState<{ amount: number; date: Date } | null>(null);
  const [loading, setLoading] = useState(true);
  // Charger l'objectif existant au démarrage
  useEffect(() => {
    const loadGoal = async () => {
      try {
        // Vérifier que l'API Electron est disponible
        if (!window.electronAPI) {
          console.error('[App] electronAPI non disponible!');
          console.log('[App] window:', Object.keys(window));
          setLoading(false);
          return;
        }
        
        console.log('[App] Chargement de l\'objectif...');
        const response = await window.electronAPI.goal.get();
        console.log('[App] Réponse:', response);
        
        if (response.success && response.data) {
          setSavedGoal({
            amount: response.data.targetAmount,
            date: new Date(response.data.targetDate),
          });
          setGoalSaved(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'objectif:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGoal();
  }, []);
  const handleSaveGoal = async (targetAmount: number, targetDate: Date) => {
    try {
      const response = await window.electronAPI.goal.save(targetAmount, targetDate);
      
      if (response.success) {
        setSavedGoal({ amount: targetAmount, date: targetDate });
        setGoalSaved(true);
        // Message supprimé - l'interface indique déjà que l'objectif est sauvegardé
      } else {
        throw new Error(response.error || 'Erreur inconnue');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde de l\'objectif');
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <h2>💎 Chargement...</h2>
        </div>
      </div>
    );
  }
  return (
    <div className="app">
      <header className="app-header">
        <h1>💎 WealthTracker</h1>
        <p className="tagline">Le Cockpit de Pilotage Patrimonial Prévisionnel</p>
      </header>      <nav className="app-nav">
        <button
          onClick={() => setCurrentPage('goal')}
          className={currentPage === 'goal' ? 'nav-btn active' : 'nav-btn'}
        >
          🎯 Objectif
        </button>
        <button
          onClick={() => setCurrentPage('assets')}
          className={currentPage === 'assets' ? 'nav-btn active' : 'nav-btn'}
        >
          📊 Actifs
        </button>
        <button
          onClick={() => setCurrentPage('snapshots')}
          className={currentPage === 'snapshots' ? 'nav-btn active' : 'nav-btn'}
        >
          📸 Valorisation
        </button>
      </nav>

      <main className="app-main">
        {currentPage === 'goal' && (
          !goalSaved ? (
            <GoalForm 
              key={savedGoal ? `edit-${savedGoal.amount}` : 'new'}
              onSave={handleSaveGoal}
              initialAmount={savedGoal?.amount}
              initialDate={savedGoal?.date}
            />
          ) : (
            <div className="goal-saved">
              <h2>✅ Objectif Défini</h2>
              <div className="saved-goal-card">
                <p>
                  🎯 Montant Cible : <strong>{savedGoal?.amount.toLocaleString('fr-FR')} €</strong>
                </p>
                <p>
                  📅 Date Cible : <strong>{savedGoal?.date.toLocaleDateString('fr-FR')}</strong>
                </p>
                <button 
                  onClick={() => setGoalSaved(false)}
                  className="btn-secondary"
                >
                  ✏️ Modifier l'Objectif
                </button>
              </div>
            </div>
          )
        )}        {currentPage === 'assets' && <AssetsPage />}
        
        {currentPage === 'snapshots' && <SnapshotsPage />}
      </main>

      <footer className="app-footer">
        <p>
          {currentPage === 'goal' && 'UC-01 : Objectif Patrimonial'}
          {currentPage === 'assets' && 'UC-02 : Gestion des Actifs'}
          {currentPage === 'snapshots' && 'UC-03 : Valorisation du Patrimoine'}
          {' 🎯'}
        </p>
      </footer>
    </div>
  );
}

export default App;
