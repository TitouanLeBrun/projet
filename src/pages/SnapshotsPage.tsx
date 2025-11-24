import { useState, useEffect } from 'react';
import { SnapshotForm } from '../components/SnapshotForm';
import type { AssetWithLatestSnapshot } from '../types/electron';
import './SnapshotsPage.css';

export function SnapshotsPage() {
  const [assetsWithSnapshots, setAssetsWithSnapshots] = useState<AssetWithLatestSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [lastUpdateDate, setLastUpdateDate] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Charger les actifs avec leurs derniers snapshots
      const response = await window.electronAPI.snapshot.getLatest();
      
      if (response.success && response.data) {
        setAssetsWithSnapshots(response.data);
        
        // Calculer la valeur totale
        const total = response.data.reduce((sum, item) => {
          return sum + (item.snapshot?.value || 0);
        }, 0);
        setTotalValue(total);
        
        // Trouver la date du dernier snapshot
        const dates = response.data
          .map((item) => item.snapshot?.date)
          .filter((date): date is Date | string => date !== null && date !== undefined);
        
        if (dates.length > 0) {
          const lastDate = new Date(Math.max(...dates.map((d) => new Date(d).getTime())));
          setLastUpdateDate(lastDate);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSnapshots = async (snapshots: Array<{ assetId: number; value: number }>) => {
    try {
      const response = await window.electronAPI.snapshot.createBatch(snapshots);
      
      if (response.success) {
        setShowForm(false);
        await loadData();
      } else {
        alert('❌ Erreur lors de l\'enregistrement des valeurs');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('❌ Erreur lors de l\'enregistrement des valeurs');
    }
  };

  if (loading) {
    return (
      <div className="snapshots-page">
        <div className="loading">
          <h2>💎 Chargement...</h2>
        </div>
      </div>
    );
  }

  if (assetsWithSnapshots.length === 0) {
    return (
      <div className="snapshots-page">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>Aucun actif disponible</h3>
          <p>Vous devez d'abord créer des actifs avant de saisir des valeurs.</p>
          <p>Rendez-vous dans l'onglet "📊 Actifs" pour commencer.</p>
        </div>
      </div>
    );
  }

  const hasAnySnapshot = assetsWithSnapshots.some((item) => item.snapshot !== null);

  return (
    <div className="snapshots-page">
      <div className="snapshots-header">
        <div className="header-content">
          <h2>📸 Valorisation du Patrimoine</h2>
          <p className="subtitle">
            {hasAnySnapshot
              ? `Dernière mise à jour : ${lastUpdateDate?.toLocaleDateString('fr-FR')}`
              : 'Aucune valeur enregistrée pour le moment'}
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-add-snapshot">
          ➕ Saisir les Valeurs
        </button>
      </div>

      <div className="snapshots-content">
        {hasAnySnapshot && (
          <div className="total-card">
            <div className="total-card-header">
              <h3>💰 Patrimoine Total</h3>
              <span className="total-date">
                {lastUpdateDate?.toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div className="total-amount">{totalValue.toLocaleString('fr-FR')} €</div>
          </div>
        )}

        <div className="assets-snapshot-grid">
          {assetsWithSnapshots.map((item) => (
            <div key={item.asset.id} className="asset-snapshot-card">
              <div className="card-header">
                <h4>{item.asset.name}</h4>
                <span className="category-badge">{item.asset.category}</span>
              </div>
              
              {item.snapshot ? (
                <>
                  <div className="card-value">
                    {item.snapshot.value.toLocaleString('fr-FR')} €
                  </div>
                  <div className="card-meta">
                    <small>
                      Dernière saisie : {new Date(item.snapshot.date).toLocaleDateString('fr-FR')}
                    </small>
                  </div>
                </>
              ) : (
                <div className="card-empty">
                  <span className="badge-new">Pas encore de valeur</span>
                  <small>Cliquez sur "Saisir les Valeurs" pour commencer</small>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <SnapshotForm
          assetsWithSnapshots={assetsWithSnapshots}
          onSave={handleSaveSnapshots}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
