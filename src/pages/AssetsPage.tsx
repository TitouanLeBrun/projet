import { useState, useEffect } from 'react';
import { AssetForm } from '../components/AssetForm';
import { AssetList } from '../components/AssetList';
import type { Asset } from '../types/electron';
import './AssetsPage.css';

export function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const response = await window.electronAPI.asset.list();
      
      if (response.success && response.data) {
        setAssets(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des actifs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async (name: string, category: string, expectedRoi: number) => {
    try {
      const response = await window.electronAPI.asset.create({
        name,
        category,
        expectedRoi,
      });

      if (response.success) {
        setShowForm(false);
        await loadAssets();
      } else {
        alert('❌ Erreur lors de la création de l\'actif');
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('❌ Erreur lors de la création de l\'actif');
    }
  };

  const handleUpdateAsset = async (name: string, category: string, expectedRoi: number) => {
    if (!editingAsset) return;

    try {
      const response = await window.electronAPI.asset.update(
        editingAsset.id.toString(),
        { name, category, expectedRoi }
      );

      if (response.success) {
        setEditingAsset(null);
        setShowForm(false);
        await loadAssets();
      } else {
        alert('❌ Erreur lors de la mise à jour de l\'actif');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('❌ Erreur lors de la mise à jour de l\'actif');
    }
  };

  const handleDeleteAsset = async (id: number) => {
    try {
      const response = await window.electronAPI.asset.delete(id.toString());

      if (response.success) {
        await loadAssets();
      } else {
        alert('❌ Erreur lors de la suppression de l\'actif');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('❌ Erreur lors de la suppression de l\'actif');
    }
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAsset(null);
  };

  if (loading) {
    return (
      <div className="assets-page">
        <div className="loading">
          <h2>💎 Chargement des actifs...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="assets-page">
      <div className="assets-header">
        <div className="header-content">
          <h2>📊 Mes Actifs Patrimoniaux</h2>
          <p className="subtitle">
            {assets.length === 0
              ? 'Ajoutez vos premiers actifs pour commencer'
              : `${assets.length} actif${assets.length > 1 ? 's' : ''} enregistré${assets.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-add-asset"
        >
          ➕ Ajouter un Actif
        </button>
      </div>

      <AssetList
        assets={assets}
        onEdit={handleEdit}
        onDelete={handleDeleteAsset}
      />

      {showForm && (
        <AssetForm
          onSave={editingAsset ? handleUpdateAsset : handleCreateAsset}
          onCancel={handleCancelForm}
          initialData={
            editingAsset
              ? {
                  name: editingAsset.name,
                  category: editingAsset.category,
                  expectedRoi: editingAsset.expectedRoi,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
