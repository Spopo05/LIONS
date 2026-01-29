import React from 'react';
import { useDemandes } from './DemandesContext';
import { useSelector } from 'react-redux';

const SimpleDemandesTest = () => {
  const { demandes, loading } = useDemandes();
  const user = useSelector((state) => state);

  console.log("=== DEBUG ===");
  console.log("Full Redux State:", user);
  console.log("User ID:", user.id);
  console.log("Users array exists:", user.users ? 'Yes' : 'No');
  console.log("Demandes from Context:", demandes);
  console.log("=============");

  // Filter demandes for current user
  const userDemandes = demandes.filter(d => d.userId === user.id);

  return (
    <div style={{ padding: '20px', border: '2px solid green' }}>
      <h2>Simple Demandes Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>User Info:</h3>
        <p>ID: {user.id || 'No ID'}</p>
        <p>Name: {user.prenom} {user.nom}</p>
      </div>

      <div>
        <h3>Your Demandes:</h3>
        {loading ? (
          <p>Loading demandes...</p>
        ) : (
          <>
            <p>Total demandes in API: {demandes.length}</p>
            <p>Your demandes: {userDemandes.length}</p>
            
            {userDemandes.length === 0 ? (
              <p style={{ color: 'red' }}>You have no demandes yet.</p>
            ) : (
              <div>
                {userDemandes.map((demande) => (
                  <div key={demande.id} style={{ 
                    border: '1px solid #ccc', 
                    padding: '10px', 
                    margin: '5px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    <p><strong>Title:</strong> {demande.titre}</p>
                    <p><strong>State:</strong> {demande.etat}</p>
                    <p><strong>Date:</strong> {new Date(demande.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleDemandesTest;