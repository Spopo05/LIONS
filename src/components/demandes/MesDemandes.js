import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDemandes } from './DemandesContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { addDemandNotification } from '../../components/Notifications/Notifications';

const MesDemandes = () => {
  const { demandes, loading, deleteDemande } = useDemandes();
  const user = useSelector((state) => state);
  
  const [canceling, setCanceling] = useState(null);
  
  // Filter demandes for current user
  const mesDemandes = demandes.filter(d => d.userId === user.id);
  
  // Count by status
  const enAttente = mesDemandes.filter(d => d.etat === 'en attente').length;
  const approuvees = mesDemandes.filter(d => d.etat === 'approuvé').length;
  const rejetees = mesDemandes.filter(d => d.etat === 'rejeté').length;

  const getEtatStyle = (etat) => {
    switch(etat) {
      case 'approuvé': return { backgroundColor: '#d4edda', color: '#155724' };
      case 'rejeté': return { backgroundColor: '#f8d7da', color: '#721c24' };
      case 'en attente': return { backgroundColor: '#fff3cd', color: '#856404' };
      default: return { backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  // Cancel pending demande with notification
  const handleCancelDemande = async (demandeId, demandeTitle) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette demande ?')) {
      return;
    }

    setCanceling(demandeId);
    
    try {
      // Delete the demande using context
      await deleteDemande(demandeId, user.email, demandeTitle);
      
      // ADD NOTIFICATION FOR USER with their ID
      addDemandNotification(
        user.email,
        demandeTitle,
        'cancelled',
        false, // isAdmin
        user.id // Target current user's notifications
      );
      
      // Show success message
      alert('Demande annulée avec succès! Une notification a été enregistrée.');
      
    } catch (error) {
      console.error('Error deleting demande:', error);
      alert('Erreur lors de l\'annulation de la demande');
    } finally {
      setCanceling(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Chargement des demandes...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Mes Demandes</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          <Link 
            to="/creer-demande"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="fas fa-plus"></i>
            Nouvelle Demande
          </Link>
        </div>
      </div>

      {/* Notification Banner */}
      {/* <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px',
        borderLeft: '4px solid #2196f3'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="fas fa-info-circle" style={{ color: '#2196f3', fontSize: '20px' }}></i>
          <div>
            <strong style={{ color: '#1976d2' }}>Système de notifications personnelles</strong>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
              Vous recevrez une notification uniquement pour vos propres demandes:
              <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
                <li>Vous soumettez une nouvelle demande ✓</li>
                <li>Votre demande est approuvée/rejetée par l'admin ✓</li>
                <li>Vous annulez une demande en attente ✓</li>
              </ul>
              <span style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: '#2196f3' }}>
                <i className="fas fa-bell" style={{ marginRight: '5px' }}></i>
                Vérifiez vos notifications personnelles dans la cloche
              </span>
            </p>
          </div>
        </div>
      </div> */}

      {/* Statistics */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ 
          flex: 1, 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '8px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <h3 style={{ margin: '0', color: '#856404' }}>{enAttente}</h3>
          <p style={{ margin: '5px 0 0 0', color: '#856404' }}>En Attente</p>
          {enAttente > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#ffc107',
              color: '#856404',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              !
            </div>
          )}
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '15px', 
          backgroundColor: '#d4edda', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0', color: '#155724' }}>{approuvees}</h3>
          <p style={{ margin: '5px 0 0 0', color: '#155724' }}>Approuvées</p>
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0', color: '#721c24' }}>{rejetees}</h3>
          <p style={{ margin: '5px 0 0 0', color: '#721c24' }}>Rejetées</p>
        </div>
        
        <div style={{ 
          flex: 1, 
          padding: '15px', 
          backgroundColor: '#e2e3e5', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0', color: '#383d41' }}>{mesDemandes.length}</h3>
          <p style={{ margin: '5px 0 0 0', color: '#383d41' }}>Total</p>
        </div>
      </div>

      {/* Demandes List */}
      {mesDemandes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#6c757d' }}>Aucune demande</h3>
          <p style={{ color: '#6c757d' }}>Vous n'avez pas encore créé de demandes.</p>
          <Link 
            to="/creer-demande"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: 'fit-content',
              margin: '20px auto 0'
            }}
          >
            <i className="fas fa-plus"></i>
            Créer ma première demande
          </Link>
        </div>
      ) : (
        <div>
          {mesDemandes.map((demande) => (
            <div 
              key={demande.id}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px',
                backgroundColor: 'white',
                position: 'relative',
                transition: 'all 0.3s ease',
                ':hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ marginTop: '0', marginBottom: '0' }}>{demande.titre}</h3>
                    {demande.etat === 'en attente' && (
                      <span style={{
                        fontSize: '11px',
                        backgroundColor: '#ffc107',
                        color: '#856404',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: 'bold'
                      }}>
                        <i className="fas fa-clock" style={{ marginRight: '3px' }}></i>
                        Notification envoyée
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#6c757d', marginBottom: '15px' }}>{demande.description}</p>
                  
                  <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#6c757d' }}>
                    <div>
                      <strong>Créée le:</strong> {new Date(demande.date).toLocaleDateString('fr-FR')}
                    </div>
                    <div>
                      <strong>ID:</strong> {demande.id}
                    </div>
                    <div>
                      <strong>Dernière mise à jour:</strong> {new Date(demande.date).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                  <span 
                    style={{
                      padding: '5px 15px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      ...getEtatStyle(demande.etat),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {demande.etat === 'approuvé' && <i className="fas fa-check-circle"></i>}
                    {demande.etat === 'rejeté' && <i className="fas fa-times-circle"></i>}
                    {demande.etat === 'en attente' && <i className="fas fa-clock"></i>}
                    {demande.etat}
                  </span>
                  
                  {/* CANCEL BUTTON FOR PENDING DEMANDES */}
                  {demande.etat === 'en attente' && (
                    <button
                      onClick={() => handleCancelDemande(demande.id, demande.titre)}
                      disabled={canceling === demande.id}
                      style={{
                        padding: '5px 15px',
                        backgroundColor: canceling === demande.id ? '#6c757d' : '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: canceling === demande.id ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.3s ease',
                        minWidth: '100px',
                        justifyContent: 'center'
                      }}
                      title="Annuler cette demande (notification sera envoyée)"
                    >
                      {canceling === demande.id ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Annulation...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-times"></i>
                          Annuler
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Notification Status */}
              <div style={{ 
                marginTop: '15px', 
                paddingTop: '15px', 
                borderTop: '1px dashed #dee2e6',
                fontSize: '12px',
                color: '#6c757d',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className="fas fa-bell" style={{ color: '#ffc107' }}></i>
                <span>
                  {demande.etat === 'en attente' 
                    ? 'Notification envoyée à l\'administrateur pour approbation'
                    : demande.etat === 'approuvé'
                    ? 'Vous avez été notifié de l\'approbation'
                    : demande.etat === 'rejeté'
                    ? 'Vous avez été notifié du rejet'
                    : 'Statut de notification inconnu'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* How to use notifications */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h4 style={{ marginTop: '0', color: '#495057' }}>
          <i className="fas fa-question-circle" style={{ marginRight: '8px', color: '#17a2b8' }}></i>
          Comment suivre vos demandes
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '15px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ color: '#28a745', fontSize: '18px' }}>✓</div>
            <div>
              <strong>Créez une demande</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6c757d' }}>Notification envoyée immédiatement</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ color: '#ffc107', fontSize: '18px' }}>⏱</div>
            <div>
              <strong>Attendez l'approbation</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6c757d' }}>L'admin sera notifié et décidera</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ color: '#2196f3', fontSize: '18px' }}>🔔</div>
            <div>
              <strong>Recevez la décision</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6c757d' }}>Notification dès que l'admin décide</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ color: '#dc3545', fontSize: '18px' }}>✕</div>
            <div>
              <strong>Annulez si besoin</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#6c757d' }}>Annulez les demandes en attente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MesDemandes;