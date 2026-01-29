import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDemandes } from './DemandesContext';
import axios from 'axios';
import { addDemandNotification } from '../../components/Notifications/Notifications';

const AdminDemandes = () => {
  const { demandes, loading, loadDemandes } = useDemandes();
  const user = useSelector((state) => state);
  
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch all users when component loads
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await axios.get(
          'https://67719603ee76b92dd49017b3.mockapi.io/louriga2mehdi/users'
        );
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchAllUsers();
    loadDemandes();
  }, []);

  // Check if user is admin
  if (!user.admin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#dc3545' }}>Accès Refusé</h2>
        <p>Seuls les administrateurs peuvent accéder à cette page.</p>
      </div>
    );
  }

  // Function to get user name by ID
  const getUserNameById = (userId) => {
    if (!userId) {
      return 'Utilisateur inconnu';
    }
    
    const cleanUserId = userId.toString().replace('userId ', '').trim();
    
    const foundUser = allUsers.find(u => {
      if (!u || !u.id) return false;
      
      return (
        u.id === cleanUserId || 
        u.id.toString() === cleanUserId ||
        `userId ${u.id}` === userId ||
        u.id.toString() === userId
      );
    });
    
    if (foundUser) {
      const firstName = foundUser.prenom || '';
      const lastName = foundUser.nom || '';
      return `${firstName} ${lastName}`.trim() || `ID: ${cleanUserId}`;
    }
    
    return `ID: ${cleanUserId}`;
  };

  // Function to get user email by ID
  const getUserEmailById = (userId) => {
    if (!userId) {
      return 'unknown@email.com';
    }
    
    const cleanUserId = userId.toString().replace('userId ', '').trim();
    
    const foundUser = allUsers.find(u => {
      if (!u || !u.id) return false;
      return (
        u.id === cleanUserId || 
        u.id.toString() === cleanUserId ||
        `userId ${u.id}` === userId ||
        u.id.toString() === userId
      );
    });
    
    return foundUser?.email || 'unknown@email.com';
  };

  // Function to get user by ID
  const getUserById = (userId) => {
    if (!userId) return null;
    
    const cleanUserId = userId.toString().replace('userId ', '').trim();
    return allUsers.find(u => u.id === cleanUserId || u.id.toString() === cleanUserId);
  };

  // Filter demandes based on selected filter
  const filteredDemandes = demandes.filter(demande => {
    if (!demande) return false;
    
    if (filter === 'all') return true;
    if (filter === 'pending') return demande.etat === 'en attente';
    if (filter === 'approved') return demande.etat === 'approuvé';
    if (filter === 'rejected') return demande.etat === 'rejeté';
    return true;
  });

  // Update demande status with notification
  const updateDemandeStatus = async (demandeId, newStatus) => {
    setUpdating(demandeId);
    try {
      const demandeToUpdate = demandes.find(d => d.id === demandeId);
      
      if (!demandeToUpdate) {
        throw new Error('Demande not found');
      }

      // Update demande status
      await axios.put(
        `https://67719603ee76b92dd49017b3.mockapi.io/louriga2mehdi/Demandes/${demandeId}`,
        { 
          etat: newStatus,
          date: new Date().toISOString()
        }
      );
      
      // Get user info
      const userEmail = getUserEmailById(demandeToUpdate.userId);
      const targetUser = getUserById(demandeToUpdate.userId);
      const targetUserId = targetUser ? targetUser.id : demandeToUpdate.userId;
      
      // MAP FRENCH STATUS TO ENGLISH
      let notificationStatus;
      if (newStatus === 'approuvé') {
        notificationStatus = 'approved';
      } else if (newStatus === 'rejeté') {
        notificationStatus = 'rejected';
      } else if (newStatus === 'en attente') {
        notificationStatus = 'pending';
      } else {
        notificationStatus = newStatus;
      }
      
      // Send notification to ADMIN (current admin user)
      addDemandNotification(
        userEmail,
        demandeToUpdate.titre || 'Sans titre',
        notificationStatus,
        true, // isAdmin
        user.id // Target admin's notifications
      );
      
      // Send notification to USER (target the specific user)
      if (targetUserId) {
        addDemandNotification(
          userEmail,
          demandeToUpdate.titre || 'Sans titre',
          notificationStatus,
          false, // isAdmin
          targetUserId // Target the specific user who owns the demand
        );
      }
      
      // Show success message
      alert(`Demande ${newStatus === 'approuvé' ? 'approuvée' : newStatus === 'rejeté' ? 'rejetée' : 'mise en attente'} avec succès!`);
      
      // Reload demandes
      await loadDemandes();
      
    } catch (error) {
      console.error('Error updating demande:', error);
      alert('Erreur lors de la mise à jour de la demande');
    } finally {
      setUpdating(null);
    }
  };

  // Get status badge style
  const getStatusStyle = (etat) => {
    if (!etat) return { backgroundColor: '#6c757d', color: 'white' };
    
    switch(etat) {
      case 'approuvé': 
        return { backgroundColor: '#28a745', color: 'white' };
      case 'rejeté': 
        return { backgroundColor: '#dc3545', color: 'white' };
      case 'en attente': 
        return { backgroundColor: '#ffc107', color: '#212529' };
      default: 
        return { backgroundColor: '#6c757d', color: 'white' };
    }
  };

  // Count statistics
  const stats = {
    total: demandes.length,
    pending: demandes.filter(d => d && d.etat === 'en attente').length,
    approved: demandes.filter(d => d && d.etat === 'approuvé').length,
    rejected: demandes.filter(d => d && d.etat === 'rejeté').length,
  };

  if (loading || loadingUsers) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h3>Chargement des données...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2>Gestion des Demandes (Admin: <strong> {user?.nom || user?.username || "Administrateur"}</strong>)</h2>

      
      {/* Statistics */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div 
          style={{ 
            flex: '1', 
            minWidth: '150px',
            padding: '15px', 
            backgroundColor: '#17a2b8', 
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center'
          }}
          onClick={() => setFilter('all')}
        >
          <h3 style={{ margin: '0' }}>{stats.total}</h3>
          <p style={{ margin: '5px 0 0 0' }}>Total</p>
        </div>
        
        <div 
          style={{ 
            flex: '1', 
            minWidth: '150px',
            padding: '15px', 
            backgroundColor: '#ffc107', 
            borderRadius: '8px',
            color: '#212529',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('pending')}
        >
          <h3 style={{ margin: '0' }}>{stats.pending}</h3>
          <p style={{ margin: '5px 0 0 0' }}>En Attente</p>
          {stats.pending > 0 && (
            <div style={{ 
              marginTop: '5px', 
              fontSize: '12px',
              backgroundColor: 'rgba(0,0,0,0.1)',
              padding: '2px 6px',
              borderRadius: '10px',
              display: 'inline-block'
            }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '3px' }}></i>
              Action requise
            </div>
          )}
        </div>
        
        <div 
          style={{ 
            flex: '1', 
            minWidth: '150px',
            padding: '15px', 
            backgroundColor: '#28a745', 
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('approved')}
        >
          <h3 style={{ margin: '0' }}>{stats.approved}</h3>
          <p style={{ margin: '5px 0 0 0' }}>Approuvées</p>
        </div>
        
        <div 
          style={{ 
            flex: '1', 
            minWidth: '150px',
            padding: '15px', 
            backgroundColor: '#dc3545', 
            borderRadius: '8px',
            color: 'white',
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setFilter('rejected')}
        >
          <h3 style={{ margin: '0' }}>{stats.rejected}</h3>
          <p style={{ margin: '5px 0 0 0' }}>Rejetées</p>
        </div>
      </div>

      {/* Filter buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: filter === 'all' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Toutes
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: filter === 'pending' ? '#ffc107' : '#6c757d',
            color: filter === 'pending' ? '#212529' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          En Attente
        </button>
        <button
          onClick={() => setFilter('approved')}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            backgroundColor: filter === 'approved' ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Approuvées
        </button>
        <button
          onClick={() => setFilter('rejected')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'rejected' ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Rejetées
        </button>
      </div>

      {/* Demandes Table */}
      {filteredDemandes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3 style={{ color: '#6c757d' }}>Aucune demande</h3>
          <p style={{ color: '#6c757d' }}>
            {filter === 'all' 
              ? "Il n'y a aucune demande dans le système." 
              : `Il n'y a aucune demande "${filter}".`}
          </p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          overflow: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Utilisateur</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Titre</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>État</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemandes.map((demande, index) => {
                const userEmail = getUserEmailById(demande.userId);
                
                return (
                  <tr 
                    key={demande.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #dee2e6'
                    }}
                  >
                    <td style={{ padding: '12px' }}>{demande.id}</td>
                    <td style={{ padding: '12px' }}>
                      {demande.userId ? getUserNameById(demande.userId) : 'N/A'}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#666' }}>
                      {userEmail}
                    </td>
                    <td style={{ padding: '12px' }}>{demande.titre || 'Sans titre'}</td>
                    <td style={{ padding: '12px' }}>{demande.description || 'Pas de description'}</td>
                    <td style={{ padding: '12px' }}>
                      {demande.date ? new Date(demande.date).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span 
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          ...getStatusStyle(demande.etat)
                        }}
                      >
                        {demande.etat || 'Inconnu'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => updateDemandeStatus(demande.id, 'approuvé')}
                          disabled={updating === demande.id || demande.etat === 'approuvé'}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: demande.etat === 'approuvé' ? '#ccc' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: demande.etat === 'approuvé' ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title={`Approuver la demande (Notification sera envoyée à ${userEmail})`}
                        >
                          {updating === demande.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fas fa-check"></i>
                              Approuver
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => updateDemandeStatus(demande.id, 'rejeté')}
                          disabled={updating === demande.id || demande.etat === 'rejeté'}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: demande.etat === 'rejeté' ? '#ccc' : '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: demande.etat === 'rejeté' ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title={`Rejeter la demande (Notification sera envoyée à ${userEmail})`}
                        >
                          {updating === demande.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fas fa-times"></i>
                              Rejeter
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => updateDemandeStatus(demande.id, 'en attente')}
                          disabled={updating === demande.id || demande.etat === 'en attente'}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: demande.etat === 'en attente' ? '#ccc' : '#ffc107',
                            color: demande.etat === 'en attente' ? '#666' : '#212529',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: demande.etat === 'en attente' ? 'not-allowed' : 'pointer',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title={`Mettre en attente (Notification sera envoyée à ${userEmail})`}
                        >
                          {updating === demande.id ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <>
                              <i className="fas fa-clock"></i>
                              En Attente
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Notification info */}
                      <div style={{ 
                        marginTop: '8px', 
                        fontSize: '11px', 
                        color: '#666',
                        fontStyle: 'italic'
                      }}>
                        <i className="fas fa-bell" style={{ marginRight: '3px' }}></i>
                        Notifications envoyées à: {userEmail} et administrateur
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDemandes;