import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDemandes } from '../demandes/DemandesContext';

// Helper function to get contrasting text color
const getContrastColor = (hexColor) => {
  if (!hexColor) return '#000000';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

const Accueil = () => {
  const user = useSelector((state) => state);
  const { demandes, loading } = useDemandes();
  
  // Get user's demandes
  const userDemandes = demandes.filter(d => d.userId === user.id);
  
  // Get recent demandes (last 3)
  const recentDemandes = [...userDemandes]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  
  // Statistics
  const stats = {
    total: userDemandes.length,
    pending: userDemandes.filter(d => d.etat === 'en attente').length,
    approved: userDemandes.filter(d => d.etat === 'approuvé').length,
    rejected: userDemandes.filter(d => d.etat === 'rejeté').length,
  };

  // Get status color
  const getStatusColor = (etat) => {
    switch(etat) {
      case 'approuvé': return '#28a745';
      case 'rejeté': return '#dc3545';
      case 'en attente': return '#ffc107';
      default: return '#6c757d';
    }
  };

  // Get user color and text color
  const userColor = user.couleur || 'maroon';
  const textColor = getContrastColor(userColor);

  return (
    <div className="accueil-container" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      {/* Welcome Section */}
      <div style={{ 
        backgroundColor: userColor, 
        color: textColor,
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>Bienvenue, {user.prenom} {user.nom}!</h1>
        <p style={{ margin: '0', fontSize: '18px', opacity: '0.9' }}>
          Heureux de vous revoir sur notre plateforme
        </p>
        {user.avatar && (
          <img
            src={user.avatar}
            alt="User Avatar"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              marginTop: '20px',
              border: '3px solid white'
            }}
          />
        )}
      </div>

      {/* Quick Stats */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        flexWrap: 'wrap' 
      }}>
        <div style={{ 
          flex: '1',
          minWidth: '200px',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>Vos Demandes</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: userColor }}>
                {stats.total}
              </div>
              <div style={{ color: '#6c757d' }}>Total</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffc107' }}>
                {stats.pending}
              </div>
              <div style={{ color: '#6c757d' }}>En attente</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          flex: '1',
          minWidth: '200px',
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Actions Rapides</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link 
              to="/creer-demande"
              style={{
                display: 'block',
                padding: '10px 15px',
                backgroundColor: userColor,
                color: textColor,
                textDecoration: 'none',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: `2px solid ${textColor}`
              }}
            >
              + Nouvelle Demande
            </Link>
            <Link 
              to="/mes-demandes"
              style={{
                display: 'block',
                padding: '10px 15px',
                backgroundColor: '#6c757d',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              Voir toutes mes demandes
            </Link>
            {user.admin && (
              <Link 
                to="/admin/demandes"
                style={{
                  display: 'block',
                  padding: '10px 15px',
                  backgroundColor: '#17a2b8',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}
              >
                Gérer les demandes
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Demandes */}
      {recentDemandes.length > 0 && (
        <div style={{ 
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: '0', color: '#333' }}>Demandes Récentes</h3>
            <Link 
              to="/mes-demandes"
              style={{
                color: userColor,
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              Voir tout →
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {recentDemandes.map((demande) => (
              <div 
                key={demande.id}
                style={{
                  backgroundColor: 'white',
                  padding: '15px',
                  borderRadius: '6px',
                  borderLeft: `4px solid ${getStatusColor(demande.etat)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{demande.titre}</h4>
                    <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>
                      {demande.description.length > 100 
                        ? demande.description.substring(0, 100) + '...' 
                        : demande.description}
                    </p>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#6c757d' }}>
                      <span>ID: {demande.id}</span>
                      <span>Créée le: {new Date(demande.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    backgroundColor: getStatusColor(demande.etat),
                    color: demande.etat === 'en attente' ? '#212529' : 'white'
                  }}>
                    {demande.etat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {userDemandes.length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <h3 style={{ color: '#6c757d' }}>Aucune demande pour le moment</h3>
          <p style={{ color: '#6c757d', marginBottom: '20px' }}>
            Commencez par créer votre première demande
          </p>
          <Link 
            to="/creer-demande"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: userColor,
              color: textColor,
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              border: `2px solid ${textColor}`
            }}
          >
            Créer ma première demande
          </Link>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Chargement de vos données...</p>
        </div>
      )}

      {/* User Info */}
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <p style={{ margin: '0' }}>
          Connecté en tant que <strong>{user.pseudo}</strong> • 
          Email: <strong>{user.email}</strong> • 
          Couleur préférée: <span style={{ 
            color: userColor, 
            backgroundColor: textColor === '#000000' ? '#f8f9fa' : '#333',
            padding: '2px 8px',
            borderRadius: '4px',
            fontWeight: 'bold' 
          }}>{userColor}</span>
        </p>
      </div>
    </div>
  );
};

export default Accueil;