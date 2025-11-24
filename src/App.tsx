import React, { useState, useEffect } from 'react';
import { GoalForm } from './components/GoalForm';
import './App.css';

function App() {
  const [goalSaved, setGoalSaved] = useState(false);
  const [savedGoal, setSavedGoal] = useState<{ amount: number; date: Date } | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger l'objectif existant au démarrage
  useEffect(() => {
    const loadGoal = async () => {
      try {
        const response = await window.electronAPI.goal.get();
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
        alert('✅ Objectif sauvegardé avec succès !');
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
