import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDemandes } from './DemandesContext';
import { useNavigate } from 'react-router-dom';

const CreateDemande = () => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const user = useSelector((state) => state);
  const { addDemande } = useDemandes();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!titre.trim() || !description.trim()) {
      setError('Titre et description sont obligatoires');
      return;
    }

    setLoading(true);
    
    try {
      const nouvelleDemande = {
        userId: user.id,
        titre: titre.trim(),
        description: description.trim(),
        etat: 'en attente',
        date: new Date().toISOString(),
      };

      // PASS USER EMAIL AND ID TO SEND NOTIFICATIONS
      await addDemande(nouvelleDemande, user.email, user.id);
      
      // Reset form
      setTitre('');
      setDescription('');
      
      // Show success message with notification info
      alert('Demande créée avec succès! Des notifications ont été envoyées.');
      
      // Redirect to my demandes
      navigate('/mes-demandes');
      
    } catch (err) {
      setError('Erreur lors de la création de la demande');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
      <h2>Créer une Nouvelle Demande</h2>
      
      {/* Notification Info */}
      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        borderLeft: '4px solid #2196f3'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-bell" style={{ color: '#2196f3', fontSize: '20px' }}></i>
          <div>
            <strong>Notifications personnelles</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Vous recevrez une notification immédiatement après la création.
              Seul l'administrateur sera notifié pour approbation.
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Titre *
          </label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            placeholder="Ex: Problème de connexion"
            maxLength={100}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              minHeight: '150px',
              resize: 'vertical'
            }}
            placeholder="Décrivez votre demande en détail..."
            maxLength={500}
            disabled={loading}
          />
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Création...' : 'Créer la Demande'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/mes-demandes')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDemande;