import { useState, useEffect } from 'react';
import './GoalForm.css';

interface GoalFormProps {
  onSave: (targetAmount: number, targetDate: Date) => void;
  initialAmount?: number;
  initialDate?: Date;
}

export function GoalForm({ onSave, initialAmount, initialDate }: GoalFormProps) {
  const [targetAmount, setTargetAmount] = useState<string>(
    initialAmount ? initialAmount.toString() : '1000000'
  );
  const [targetDate, setTargetDate] = useState<string>(
    initialDate ? initialDate.toISOString().split('T')[0] : '2035-01-01'
  );

  // Mettre à jour les valeurs si les props changent
  useEffect(() => {
    if (initialAmount !== undefined) {
      setTargetAmount(initialAmount.toString());
    }
    if (initialDate !== undefined) {
      setTargetDate(initialDate.toISOString().split('T')[0]);
    }
  }, [initialAmount, initialDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(targetAmount);
    const date = new Date(targetDate);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Veuillez entrer un montant cible valide');
      return;
    }
    
    if (isNaN(date.getTime()) || date <= new Date()) {
      alert('Veuillez entrer une date cible future');
      return;
    }
    
    onSave(amount, date);
  };

  return (
    <div className="goal-form-container">
      <h2>🎯 Définir votre Objectif Patrimonial</h2>
      <p className="subtitle">Configurez votre "Road to 1M"</p>
      
      <form onSubmit={handleSubmit} className="goal-form">
        <div className="form-group">
          <label htmlFor="targetAmount">
            💰 Montant Cible (€)
          </label>          
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => {
              console.log(e.target.value); 
              setTargetAmount(e.target.value);
            }}
            placeholder="1000000"
            step="1000"
            min="0"
            required
          />
          <small>Exemple : 1 000 000 € pour le "Road to 1M"</small>
        </div>

        <div className="form-group">
          <label htmlFor="targetDate">
            📅 Date Cible
          </label>
          <input
            type="date"
            id="targetDate"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            required
          />
          <small>La date à laquelle vous souhaitez atteindre votre objectif</small>
        </div>

        <button type="submit" className="btn-primary">
          💾 Enregistrer l'Objectif
        </button>
      </form>      <div className="goal-preview">
        <h3>Aperçu</h3>
        <p>
          Objectif : <strong>{targetAmount ? parseFloat(targetAmount).toLocaleString('fr-FR') : '0'} €</strong>
        </p>
        <p>
          Date cible : <strong>{targetDate ? new Date(targetDate).toLocaleDateString('fr-FR') : '-'}</strong>
        </p>
      </div>
    </div>
  );
}
