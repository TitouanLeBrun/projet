import { useState } from 'react';
import type { Asset } from '../types/electron';
import './AssetList.css';

interface AssetListProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: number) => void;
}

const CATEGORY_CONFIG: Record<string, { icon: string; color: string }> = {
  Crypto: { icon: '🟡', color: '#f59e0b' },
  Bourse: { icon: '📈', color: '#3b82f6' },
  Immo: { icon: '🏠', color: '#10b981' },
  Cash: { icon: '💵', color: '#6b7280' },
  Autre: { icon: '🔷', color: '#8b5cf6' },
};

export function AssetList({ assets, onEdit, onDelete }: AssetListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (asset: Asset) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${asset.name}" ?`)) {
      onDelete(asset.id);
    }
  };

  if (assets.length === 0) {
    return (
      <div className="asset-list-empty">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Aucun actif pour le moment</h3>
          <p>Commencez par ajouter votre premier actif patrimonial !</p>
        </div>
      </div>
    );
  }

  return (
    <div className="asset-list">
      <div className="asset-grid">
        {assets.map((asset) => {
          const config = CATEGORY_CONFIG[asset.category] || CATEGORY_CONFIG.Autre;
          
          return (
            <div
              key={asset.id}
              className="asset-card"
              style={{ borderLeftColor: config.color }}
            >
              <div className="asset-header">
                <div className="asset-title">
                  <span className="asset-icon">{config.icon}</span>
                  <h3>{asset.name}</h3>
                </div>
                <span
                  className="asset-category-badge"
                  style={{ backgroundColor: config.color }}
                >
                  {asset.category}
                </span>
              </div>

              <div className="asset-roi">
                <span className="roi-label">ROI Espéré</span>
                <span className="roi-value" style={{ color: config.color }}>
                  {asset.expectedRoi.toFixed(1)}%
                </span>
              </div>

              <div className="asset-actions">
                <button
                  onClick={() => onEdit(asset)}
                  className="btn-edit"
                  title="Modifier"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => handleDelete(asset)}
                  className="btn-delete"
                  title="Supprimer"
                  disabled={deletingId === asset.id}
                >
                  🗑️ Supprimer
                </button>
              </div>

              <div className="asset-meta">
                <small>
                  Créé le {new Date(asset.createdAt).toLocaleDateString('fr-FR')}
                </small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
