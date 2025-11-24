import { useState, useEffect } from 'react';
import type { AssetWithLatestSnapshot } from '../types/electron';
import './SnapshotForm.css';

interface SnapshotFormProps {
  assetsWithSnapshots: AssetWithLatestSnapshot[];
  onSave: (snapshots: Array<{ assetId: number; value: number }>) => void;
  onCancel: () => void;
}

export function SnapshotForm({ assetsWithSnapshots, onSave, onCancel }: SnapshotFormProps) {
  const [values, setValues] = useState<Record<number, string>>({});
  const [total, setTotal] = useState(0);

  // Initialiser avec les dernières valeurs connues
  useEffect(() => {
    const initialValues: Record<number, string> = {};
    assetsWithSnapshots.forEach((item) => {
      if (item.snapshot) {
        initialValues[item.asset.id] = item.snapshot.value.toString();
      }
    });
    setValues(initialValues);
  }, [assetsWithSnapshots]);

  // Calculer le total en temps réel
  useEffect(() => {
    const newTotal = Object.values(values).reduce((sum, val) => {
      const num = parseFloat(val);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
    setTotal(newTotal);
  }, [values]);

  const handleValueChange = (assetId: number, value: string) => {
    setValues((prev) => ({
      ...prev,
      [assetId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const snapshots = assetsWithSnapshots
      .map((item) => {
        const value = parseFloat(values[item.asset.id] || '0');
        return {
          assetId: item.asset.id,
          value,
        };
      })
      .filter((s) => s.value > 0);

    if (snapshots.length === 0) {
      alert('Veuillez saisir au moins une valeur');
      return;
    }

    onSave(snapshots);
  };

  return (
    <div className="snapshot-form-overlay">
      <div className="snapshot-form-container">
        <h2>📸 Saisir les Valeurs Actuelles</h2>
        <p className="subtitle">
          Enregistrez la valeur actuelle de chaque actif pour suivre votre progression
        </p>

        <form onSubmit={handleSubmit} className="snapshot-form">
          <div className="assets-input-list">
            {assetsWithSnapshots.map((item) => {
              const hasSnapshot = item.snapshot !== null;
              const lastValue = item.snapshot?.value;

              return (
                <div key={item.asset.id} className="asset-input-row">
                  <div className="asset-info">
                    <div className="asset-name">
                      <strong>{item.asset.name}</strong>
                      {!hasSnapshot && <span className="badge-new">Nouveau</span>}
                    </div>
                    {hasSnapshot && (
                      <small className="last-value">
                        Dernière valeur : {lastValue?.toLocaleString('fr-FR')} €
                        {item.snapshot && (
                          <span className="last-date">
                            {' '}
                            ({new Date(item.snapshot.date).toLocaleDateString('fr-FR')})
                          </span>
                        )}
                      </small>
                    )}
                  </div>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      value={values[item.asset.id] || ''}
                      onChange={(e) => handleValueChange(item.asset.id, e.target.value)}
                      placeholder={hasSnapshot ? lastValue?.toString() : '0'}
                      step="0.01"
                      min="0"
                    />
                    <span className="currency">€</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="total-section">
            <div className="total-label">💰 Valeur Totale du Patrimoine</div>
            <div className="total-value">{total.toLocaleString('fr-FR')} €</div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              ❌ Annuler
            </button>
            <button type="submit" className="btn-primary">
              💾 Enregistrer les Valeurs
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
