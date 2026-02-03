import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import logo from "../assets/lion1.png"; 
import Notifications from "../components/Notifications/Notifications"; // Import notifications

const Layout = ({ children }) => {
  const user = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Use user.couleur directly - no need for separate state
  const currentColor = user.couleur || 'maroon';

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('user');
    dispatch(logoutUser());
    navigate('/login');
  };

  // Helper function to determine text color based on background
  const getContrastColor = (hexColor) => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  // Get text color for logout button
  const buttonTextColor = getContrastColor(currentColor);

  return (
    <div className="layout-container">
      <header style={{ 
        backgroundColor: currentColor,
        color: getContrastColor(currentColor),
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={logo} alt="Logo" className="logo" style={{ height: '45px' }} />
          <div style={{ 
            width: '4px', 
            height: '50px', 
            borderRadius: '2px',
            opacity: 0.5
          }} />
        </div>
        
        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link 
            to="/Accueil" 
            style={{ 
              color: getContrastColor(currentColor),
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Home
          </Link>
          
          <Link 
            to="/changeColor" 
            style={{ 
              color: getContrastColor(currentColor),
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Edit Color
          </Link>
          
          <Link 
            to="/mes-demandes" 
            style={{ 
              color: getContrastColor(currentColor),
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Mes Demandes
          </Link>
          
          {user.admin && (
            <>
              <Link 
                to="/admin" 
                style={{ 
                  color: getContrastColor(currentColor),
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0px)';
                }}
              >
                Admin Users
              </Link>
              
              <Link 
                to="/admin/demandes" 
                style={{ 
                  color: getContrastColor(currentColor),
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Gérer Demandes
              </Link>
            </>
          )}
        </nav>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* NOTIFICATIONS COMPONENT */}
          <Notifications />
          
          <button 
            className='deconn' 
            onClick={handleLogout} 
            style={{ 
              backgroundColor: getContrastColor(currentColor),
              color: currentColor,
              border: `2px solid ${getContrastColor(currentColor)}`,
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
            Se Déconnecter
          </button>
        </div>
      </header>
      
      <main style={{ 
        minHeight: 'calc(100vh - 200px)',
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}> 
        <Outlet /> 
      </main>
      
      <footer style={{ 
        backgroundColor: currentColor,
        color: getContrastColor(currentColor),
        padding: '3rem 2rem 1.5rem',
        marginTop: 'auto',
        width: '100%'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3rem',
            marginBottom: '2rem',
            paddingBottom: '2rem',
            borderBottom: `1px solid ${getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`
          }}>
            <div>
              <h3 style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                opacity: '0.9'
              }}>
                Company
              </h3>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/about" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: '0.8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    About Us
                  </Link>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/contact" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: '0.8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    Contact
                  </Link>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/careers" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: '0.8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    Careers
                  </Link>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/blog" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: '0.8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                opacity: '0.9'
              }}>
                Support
              </h3>
              <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/help" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: '0.8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    Help Center
                  </Link>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/faq" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: '0.8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    FAQ
                  </Link>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/privacy" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: '0.8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li style={{ marginBottom: '0.75rem' }}>
                  <Link 
                    to="/terms" 
                    style={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      opacity: '0.8',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '1.25rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                opacity: '0.9'
              }}>
                Contact Info
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', opacity: '0.8' }}>📍</span>
                  <span style={{ fontSize: '0.95rem', opacity: '0.8' }}>
                    Hay Salam, Morocco
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', opacity: '0.8' }}>📞</span>
                  <span style={{ fontSize: '0.95rem', opacity: '0.8' }}>
                    +212 538 387 83
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', opacity: '0.8' }}>📧</span>
                  <span style={{ fontSize: '0.95rem', opacity: '0.8' }}>
                    lion@gmail.com
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1.25rem',
            marginBottom: '2rem',
            padding: '2rem 0'
          }}>
            <a 
              href="https://facebook.com" 
              style={{ 
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '1.1rem',
                opacity: '0.8',
                transition: 'all 0.3s ease'
              }}
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(-3px) scale(1.1)';
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
              }}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href="https://twitter.com" 
              style={{ 
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '1.1rem',
                opacity: '0.8',
                transition: 'all 0.3s ease'
              }}
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(-3px) scale(1.1)';
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
              }}
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a 
              href="https://instagram.com" 
              style={{ 
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '1.1rem',
                opacity: '0.8',
                transition: 'all 0.3s ease'
              }}
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(-3px) scale(1.1)';
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
              }}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="https://linkedin.com" 
              style={{ 
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'inherit',
                textDecoration: 'none',
                fontSize: '1.1rem',
                opacity: '0.8',
                transition: 'all 0.3s ease'
              }}
              target="_blank" 
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(-3px) scale(1.1)';
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = '0.8';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.background = getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)';
              }}
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
          
          <div style={{ 
            textAlign: 'center',
            paddingTop: '1.5rem',
            borderTop: `1px solid ${getContrastColor(currentColor) === '#000000' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
            fontSize: '0.875rem',
            opacity: '0.7'
          }}>
            <p style={{ margin: 0, marginBottom: '0.75rem' }}>
              © {new Date().getFullYear()} Lion Platform. All rights reserved.
            </p>
            <div style={{ 
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              Made with <span style={{ color: '#ff4d4d' }}>❤️</span> in Morocco
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;