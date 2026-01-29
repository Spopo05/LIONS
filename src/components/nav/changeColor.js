import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginUser } from '../../redux/actions';
import { 
  Palette, 
  Check, 
  RefreshCw,
  Eye,
  Sparkles,
  Zap,
  Droplets,
  Sliders,
  PaintBucket
} from 'lucide-react';

const ChangeColor = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state);
  const [selectedColor, setSelectedColor] = useState(user.couleur || '#800000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [customColor, setCustomColor] = useState('#800000');
  const [brightness, setBrightness] = useState(50);
  const [saturation, setSaturation] = useState(70);
  const [viewMode, setViewMode] = useState('grid');

  // Color palettes
  const colorPalettes = {
    'Classique': [
      { name: 'Bordeaux', value: '#800000' },
      { name: 'Bleu Royal', value: '#1e3a8a' },
      { name: 'Émeraude', value: '#047857' },
      { name: 'Violet Profond', value: '#5b21b6' },
      { name: 'Orange Vif', value: '#ea580c' },
      { name: 'Rose Passion', value: '#db2777' }
    ],
    'Pastel': [
      { name: 'Rose Doux', value: '#fce7f3' },
      { name: 'Bleu Ciel', value: '#dbeafe' },
      { name: 'Vert Menthe', value: '#d1fae5' },
      { name: 'Lavande', value: '#ede9fe' },
      { name: 'Pêche', value: '#ffedd5' },
      { name: 'Jaune Pâle', value: '#fef3c7' }
    ],
    'Moderne': [
      { name: 'Noir Mat', value: '#171717' },
      { name: 'Gris Anthracite', value: '#374151' },
      { name: 'Bleu Électrique', value: '#3b82f6' },
      { name: 'Vert Néon', value: '#10b981' },
      { name: 'Magenta', value: '#ec4899' },
      { name: 'Ambre', value: '#f59e0b' }
    ]
  };

  // Get text color based on background
  const getTextColor = (bgColor) => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  // Save color to API
  const saveColor = async () => {
    if (!user.id) {
      setError('Utilisateur non connecté');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.put(
        `https://67719603ee76b92dd49017b3.mockapi.io/louriga2mehdi/users/${user.id}`,
        { couleur: selectedColor }
      );
      
      dispatch(loginUser(response.data));
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError('Erreur lors de la sauvegarde');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset to default
  const resetToDefault = () => {
    setSelectedColor('#800000');
    setCustomColor('#800000');
    setBrightness(50);
    setSaturation(70);
  };

  // Apply custom color
  const applyCustomColor = () => {
    if (/^#[0-9A-F]{6}$/i.test(customColor)) {
      setSelectedColor(customColor);
    }
  };

  // Preview component
  const PreviewBox = ({ title, color }) => (
    <div style={{
      backgroundColor: color,
      borderRadius: '12px',
      padding: '20px',
      color: getTextColor(color),
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s'
    }}>
      <div>
        <h4 style={{ margin: '0 0 10px 0' }}>{title}</h4>
        <p style={{ opacity: 0.9, fontSize: '14px', margin: 0 }}>
          {color.toUpperCase()}
        </p>
      </div>
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '10px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Eye size={12} />
        </div>
        <div style={{
          width: '24px',
          height: '24px',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={12} />
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          backgroundColor: selectedColor,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: getTextColor(selectedColor)
        }}>
          <Palette size={30} />
        </div>
        <div>
          <h1 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>
            Personnalisation des Couleurs
          </h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Choisissez la couleur qui représentera votre style dans l'application
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 400px',
        gap: '30px'
      }}>
        {/* Left Column - Color Selection */}
        <div>
          {/* View Mode Tabs */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '25px',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '10px'
          }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '10px 20px',
                backgroundColor: viewMode === 'grid' ? selectedColor : '#f3f4f6',
                color: viewMode === 'grid' ? getTextColor(selectedColor) : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Palettes
            </button>
            <button
              onClick={() => setViewMode('custom')}
              style={{
                padding: '10px 20px',
                backgroundColor: viewMode === 'custom' ? selectedColor : '#f3f4f6',
                color: viewMode === 'custom' ? getTextColor(selectedColor) : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
            >
              Personnalisé
            </button>
          </div>

          {/* Color Selection Area */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: '25px'
          }}>
            {viewMode === 'grid' && (
              <>
                <h3 style={{ marginTop: 0, color: '#1f2937' }}>Palettes de Couleurs</h3>
                {Object.entries(colorPalettes).map(([paletteName, colors]) => (
                  <div key={paletteName} style={{ marginBottom: '30px' }}>
                    <h4 style={{ color: '#4b5563', marginBottom: '15px' }}>{paletteName}</h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: '12px'
                    }}>
                      {colors.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color.value)}
                          style={{
                            backgroundColor: color.value,
                            border: selectedColor === color.value ? 
                              `3px solid ${getTextColor(color.value)}` : '3px solid transparent',
                            borderRadius: '10px',
                            height: '60px',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all 0.2s'
                          }}
                          title={`${color.name} - ${color.value}`}
                        >
                          {selectedColor === color.value && (
                            <div style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              backgroundColor: 'rgba(255,255,255,0.9)',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Check size={12} color={color.value} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {viewMode === 'custom' && (
              <>
                <h3 style={{ marginTop: 0, color: '#1f2937' }}>Couleur Personnalisée</h3>
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  marginBottom: '25px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: customColor,
                    borderRadius: '12px',
                    border: `3px solid ${getTextColor(customColor)}`
                  }} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                      <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        style={{
                          width: '50px',
                          height: '50px',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                      />
                      <input
                        type="text"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        placeholder="#000000"
                        style={{
                          flex: 1,
                          padding: '12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                      <button
                        onClick={applyCustomColor}
                        style={{
                          padding: '12px 20px',
                          backgroundColor: selectedColor,
                          color: getTextColor(selectedColor),
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <Droplets size={16} />
                        Appliquer
                      </button>
                    </div>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                      Entrez une valeur hexadécimale ou utilisez le sélecteur de couleur
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '15px',
            justifyContent: 'space-between'
          }}>
            <button
              onClick={resetToDefault}
              style={{
                padding: '15px 25px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={20} />
              Réinitialiser
            </button>
            
            <button
              onClick={saveColor}
              disabled={loading}
              style={{
                padding: '15px 30px',
                backgroundColor: loading ? '#9ca3af' : selectedColor,
                color: getTextColor(selectedColor),
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                flex: 1,
                justifyContent: 'center'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={20} />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Zap size={20} />
                  Appliquer cette Couleur
                </>
              )}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '10px',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#d1fae5',
              color: '#059669',
              borderRadius: '10px',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <Check size={20} />
              Couleur appliquée avec succès !
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '25px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            position: 'sticky',
            top: '20px'
          }}>
            <h3 style={{ marginTop: 0, color: '#1f2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} />
              Aperçu
            </h3>
            
            <div style={{ marginBottom: '25px' }}>
              <h4 style={{ color: '#4b5563', marginBottom: '15px' }}>Couleur Sélectionnée</h4>
              <div style={{
                backgroundColor: selectedColor,
                height: '100px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getTextColor(selectedColor),
                fontSize: '18px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {selectedColor.toUpperCase()}
              </div>
              <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', margin: 0 }}>
                Cette couleur sera appliquée à votre interface
              </p>
            </div>

            <h4 style={{ color: '#4b5563', marginBottom: '15px' }}>Prévisualisation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <PreviewBox title="En-tête" color={selectedColor} />
              <PreviewBox title="Boutons" color={selectedColor} />
              <PreviewBox title="Arrière-plan" color={selectedColor} />
            </div>

            <div style={{
              marginTop: '25px',
              padding: '15px',
              backgroundColor: '#f9fafb',
              borderRadius: '10px',
              border: '1px solid #e5e7eb'
            }}>
              {/* <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                <strong>💡 Conseil :</strong> Les couleurs vives fonctionnent mieux pour les boutons, 
                tandis que les tons plus doux sont idéaux pour les arrière-plans.
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeColor;