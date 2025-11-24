import React, { useState } from 'react';
import { GoalForm } from './components/GoalForm';
import './App.css';

function App() {
  const [goalSaved, setGoalSaved] = useState(false);
  const [savedGoal, setSavedGoal] = useState<{ amount: number; date: Date } | null>(null);

  const handleSaveGoal = async (targetAmount: number, targetDate: Date) => {
    try {
      // TODO: Appeler l'API Electron pour sauvegarder dans Prisma
      console.log('Sauvegarde de l\'objectif:', { targetAmount, targetDate });
      
      setSavedGoal({ amount: targetAmount, date: targetDate });
      setGoalSaved(true);
      
      alert('✅ Objectif sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de la sauvegarde de l\'objectif');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>💎 WealthTracker</h1>
        <p className="tagline">Le Cockpit de Pilotage Patrimonial Prévisionnel</p>
      </header>

      <main className="app-main">
        {!goalSaved ? (
          <GoalForm onSave={handleSaveGoal} />
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
        )}
      </main>

      <footer className="app-footer">
        <p>UC-01 : Définir l'Objectif Patrimonial 🎯</p>
      </footer>
    </div>
  );
}

export default App;
