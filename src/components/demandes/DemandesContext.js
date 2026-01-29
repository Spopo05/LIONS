import React, { createContext, useState, useContext, useEffect } from 'react';
import DemandesAPI from './DemandesAPI';
import { addDemandNotification } from '../../components/Notifications/Notifications';

const DemandesContext = createContext();

export const useDemandes = () => {
  const context = useContext(DemandesContext);
  if (!context) {
    throw new Error('useDemandes must be used within a DemandesProvider');
  }
  return context;
};

export const DemandesProvider = ({ children }) => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDemandes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await DemandesAPI.getAll();
      setDemandes(data);
    } catch (error) {
      console.error("Failed to load demandes:", error);
      setError("Erreur lors du chargement des demandes");
    } finally {
      setLoading(false);
    }
  };

  const addDemande = async (newDemande, userEmail = null, userId = null) => {
    setError(null);
    try {
      const created = await DemandesAPI.create(newDemande);
      setDemandes(prev => [...prev, created]);
      
      // ADD NOTIFICATIONS WITH USER IDs
      if (userEmail && userId) {
        // Notify user (target the user who created it)
        addDemandNotification(
          userEmail,
          newDemande.titre,
          'submitted',
          false, // isAdmin
          userId // Target user's notifications
        );
        
        // Notify admin (target admin users)
        addDemandNotification(
          userEmail,
          newDemande.titre,
          'pending',
          true, // isAdmin
          'admin' // Admin notifications key
        );
      }
      
      return created;
    } catch (error) {
      console.error("Failed to add demande:", error);
      setError("Erreur lors de la création de la demande");
      throw error;
    }
  };

  // DELETE demande function
  const deleteDemande = async (id, userEmail = null, demandeTitle = null, userId = null) => {
    setError(null);
    try {
      await DemandesAPI.delete(id);
      // Remove the demande from state
      setDemandes(prev => prev.filter(d => d.id !== id));
      
      // ADD NOTIFICATION FOR CANCELLATION
      if (userEmail && demandeTitle && userId) {
        addDemandNotification(
          userEmail,
          demandeTitle,
          'cancelled',
          false, // isAdmin
          userId // Target user's notifications
        );
      }
      
      return true;
    } catch (error) {
      console.error("Failed to delete demande:", error);
      setError("Erreur lors de la suppression de la demande");
      throw error;
    }
  };

  // UPDATE demande function (for admin)
  const updateDemande = async (id, updates, userEmail = null, demandeTitle = null, userId = null) => {
    setError(null);
    try {
      const updated = await DemandesAPI.update(id, updates);
      // Update the demande in state
      setDemandes(prev => prev.map(d => d.id === id ? updated : d));
      
      // ADD NOTIFICATION FOR STATUS CHANGE
      if (userEmail && demandeTitle && userId) {
        const notificationStatus = updates.etat === 'approuvé' ? 'approved' : 
                                 updates.etat === 'rejeté' ? 'rejected' : 
                                 updates.etat === 'en attente' ? 'pending' : updates.etat;
        
        // Notify user
        addDemandNotification(
          userEmail,
          demandeTitle,
          notificationStatus,
          false, // isAdmin
          userId // Target user's notifications
        );
        
        // Notify admin (admin ID would need to be passed separately)
        // This would be handled in AdminDemandes.js
      }
      
      return updated;
    } catch (error) {
      console.error("Failed to update demande:", error);
      setError("Erreur lors de la mise à jour de la demande");
      throw error;
    }
  };

  // Load demandes on component mount
  useEffect(() => {
    loadDemandes();
  }, []);

  return (
    <DemandesContext.Provider value={{
      demandes,
      loading,
      error,
      loadDemandes,
      addDemande,
      deleteDemande,
      updateDemande
    }}>
      {children}
    </DemandesContext.Provider>
  );
};