import { useState, useEffect } from 'react';
import './AssetForm.css';

interface AssetFormProps {
  onSave: (name: string, category: string, expectedRoi: number) => void;
  onCancel: () => void;
  initialData?: {
    name: string;
    category: string;
    expectedRoi: number;
  };
}

const CATEGORIES = [
  { value: 'Crypto', label: '🟡 Crypto', color: '#f59e0b' },
  { value: 'Bourse', label: '📈 Bourse', color: '#3b82f6' },
  { value: 'Immo', label: '🏠 Immobilier', color: '#10b981' },
  { value: 'Cash', label: '💵 Cash', color: '#6b7280' },
  { value: 'Autre', label: '🔷 Autre', color: '#8b5cf6' },
];

export function AssetForm({ onSave, onCancel, initialData }: AssetFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [category, setCategory] = useState(initialData?.category || 'Bourse');
  const [expectedRoi, setExpectedRoi] = useState(
    initialData?.expectedRoi?.toString() || '8'
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setCategory(initialData.category);
      setExpectedRoi(initialData.expectedRoi.toString());
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Veuillez entrer un nom pour l\'actif');
      return;
    }

    const roi = parseFloat(expectedRoi);
    if (isNaN(roi)) {
      alert('Veuillez entrer un ROI valide');
      return;
    }

    onSave(name.trim(), category, roi);
  };

  return (
    <div className="asset-form-overlay">
      <div className="asset-form-container">
        <h2>{initialData ? '✏️ Modifier l\'Actif' : '➕ Ajouter un Actif'}</h2>

        <form onSubmit={handleSubmit} className="asset-form">
          <div className="form-group">
            <label htmlFor="assetName">📝 Nom de l'Actif</label>
            <input
              type="text"
              id="assetName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Bitcoin, PEA ETF World, Livret A..."
              required
            />
            <small>Donnez un nom identifiable à votre actif</small>
          </div>

          <div className="form-group">
            <label htmlFor="assetCategory">🏷️ Catégorie</label>
            <select
              id="assetCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <small>Type d'investissement</small>
          </div>

          <div className="form-group">
            <label htmlFor="expectedRoi">📊 ROI Espéré (%)</label>
            <input
              type="number"
              id="expectedRoi"
              value={expectedRoi}
              onChange={(e) => setExpectedRoi(e.target.value)}
              placeholder="8.5"
              step="0.1"
              min="-100"
              max="1000"
              required
            />
            <small>Rendement annuel moyen attendu (ex: 8.5 pour 8.5%)</small>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              ❌ Annuler
            </button>
            <button type="submit" className="btn-primary">
              💾 {initialData ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
