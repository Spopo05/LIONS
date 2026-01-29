import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, deleteUser } from '../../redux/actions';
import { 
  Users, 
  Shield, 
  UserCheck, 
  Clock, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Download,
  Play,
  Pause,
  ChevronRight as NextIcon,
  ChevronLeft as PrevIcon,
  Mail,
  Calendar,
  Palette,
  Globe,
  CreditCard,
  Flag
} from 'lucide-react';
import './AdminPage.css';

const AdminPage = () => {
  const users = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    nom: "",
    age: "",
    admin: false,
    MotDePasse: "",
    pseudo: "",
    prenom: "",
    couleur: "",
    Devise: "",
    Pays: "",
    avatar: "",
    email: "",
    photo: "",
  });
  
  // Slideshow states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const autoPlayRef = useRef(null);

  const itemsPerPage = 8;
  const slidesPerView = 4;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Calculate statistics
  const userCount = users.length;
  const adminCount = users.filter(user => user.admin).length;
  const activeCount = users.length;

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === "" || 
      user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.pseudo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prenom?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === "all" || 
      (statusFilter === "admin" && user.admin) ||
      (statusFilter === "regular" && !user.admin);
    
    return matchesSearch && matchesFilter;
  });

  // Slideshow calculations
  const totalSlides = Math.max(1, Math.ceil(filteredUsers.length / slidesPerView));
  const slideUsers = filteredUsers.slice(
    currentSlide * slidesPerView,
    (currentSlide + 1) * slidesPerView
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Auto-play slideshow
  useEffect(() => {
    if (isAutoPlay && isPlaying && filteredUsers.length > 0 && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000);
      
      return () => clearInterval(autoPlayRef.current);
    }
  }, [isAutoPlay, isPlaying, filteredUsers.length, totalSlides]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      nom: user.nom || "",
      age: user.age || "",
      admin: user.admin || false,
      MotDePasse: user.MotDePasse || "",
      pseudo: user.pseudo || "",
      prenom: user.prenom || "",
      couleur: user.couleur || "",
      Devise: user.Devise || "",
      Pays: user.Pays || "",
      avatar: user.avatar || "",
      email: user.email || "",
      photo: user.photo || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        await axios.put(
          `https://67719603ee76b92dd49017b3.mockapi.io/louriga2mehdi/users/${selectedUser.id}`,
          formData
        );
      } else {
        await axios.post(
          "https://67719603ee76b92dd49017b3.mockapi.io/louriga2mehdi/users",
          formData
        );
      }
      dispatch(fetchUsers());
      setShowModal(false);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // Slideshow functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    const newAutoPlay = !isAutoPlay;
    setIsAutoPlay(newAutoPlay);
    
    if (!newAutoPlay) {
      clearInterval(autoPlayRef.current);
    } else if (isPlaying) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000);
    }
  };

  const togglePlayPause = () => {
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    
    clearInterval(autoPlayRef.current);
    
    if (newPlaying && isAutoPlay && filteredUsers.length > 0 && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 4000);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset slideshow when search/filter changes
  useEffect(() => {
    setCurrentSlide(0);
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  return (
    <div className="admin-dashboard-pro">
      {/* Professional Header */}
      <div className="dashboard-header-pro">
        <div className="dashboard-title-pro">
          <h1> User Management</h1>
          <div className="header-stats-pro">
            <span className="stat-badge-pro total">{userCount} Users</span>
            <span className="stat-badge-pro admin">{adminCount} Admins</span>
          </div>
        </div>
        
        <div className="dashboard-actions-pro">
          <button className="btn-icon-pro" title="Export">
            <Download size={18} />
          </button>
          <button 
            className="btn-primary-pro"
            onClick={() => {
              setSelectedUser(null);
              setFormData({
                nom: "",
                age: "",
                admin: false,
                MotDePasse: "",
                pseudo: "",
                prenom: "",
                couleur: "",
                Devise: "",
                Pays: "",
                avatar: "",
                email: "",
                photo: "",
              });
              setShowModal(true);
            }}
          >
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="quick-stats-pro">
        <div className="stat-card-pro users">
          <div className="stat-icon-pro">
            <Users size={24} />
          </div>
          <div className="stat-value-pro">{userCount}</div>
          <div className="stat-label-pro">Total Users</div>
        </div>

        <div className="stat-card-pro admins">
          <div className="stat-icon-pro">
            <Shield size={24} />
          </div>
          <div className="stat-value-pro">{adminCount}</div>
          <div className="stat-label-pro">Admin Users</div>
        </div>

        <div className="stat-card-pro active">
          <div className="stat-icon-pro">
            <UserCheck size={24} />
          </div>
          <div className="stat-value-pro">{activeCount}</div>
          <div className="stat-label-pro">Active Users</div>
        </div>

        <div className="stat-card-pro pending">
          <div className="stat-icon-pro">
            <Clock size={24} />
          </div>
          <div className="stat-value-pro">0</div>
          <div className="stat-label-pro">Pending</div>
        </div>
      </div>

      {/* Professional Slideshow Section */}
      {filteredUsers.length > 0 && (
        <div className="user-slideshow-pro">
          <div className="slideshow-header-pro">
            <div className="slideshow-title-pro">
              <span> User Slideshow</span>
              <span className="slideshow-info">Slide {currentSlide + 1} of {totalSlides}</span>
            </div>
            
            <div className="slideshow-controls-pro">
              <div className="auto-toggle-pro">
                <label className="toggle-switch-pro">
                  <input 
                    type="checkbox" 
                    checked={isAutoPlay}
                    onChange={toggleAutoPlay}
                  />
                  <span className="toggle-slider-pro"></span>
                </label>
                <span>Auto Play</span>
              </div>
              
              <button 
                className="slideshow-btn-pro"
                onClick={togglePlayPause}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <button 
                className="slideshow-btn-pro"
                onClick={prevSlide}
                disabled={currentSlide === 0 || totalSlides <= 1}
              >
                <PrevIcon size={16} />
              </button>
              
              <button 
                className="slideshow-btn-pro"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1 || totalSlides <= 1}
              >
                <NextIcon size={16} />
              </button>
            </div>
          </div>
          
          <div className="slideshow-container-pro">
            <div 
              className="slideshow-track-pro"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {[...Array(totalSlides)].map((_, slideIndex) => {
                const startIdx = slideIndex * slidesPerView;
                const endIdx = startIdx + slidesPerView;
                const usersInSlide = filteredUsers.slice(startIdx, endIdx);
                
                return (
                  <div key={slideIndex} className="slide-item-pro">
                    {usersInSlide.map((user) => (
                      <div key={user.id} className="user-slide-card-pro">
                        <div className="slide-avatar-pro">
                          <img 
                            src={user.avatar || user.photo || `https://ui-avatars.com/api/?name=${user.nom}+${user.prenom}&background=8a0503&color=fff`}
                            alt={`${user.nom} ${user.prenom}`}
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${user.nom}+${user.prenom}&background=8a0503&color=fff`;
                            }}
                          />
                          <div className={`slide-badge-pro ${user.admin ? 'admin' : 'user'}`}>
                            {user.admin ? 'Admin' : 'User'}
                          </div>
                        </div>
                        
                        <div className="slide-user-info-pro">
                          <div className="slide-name-pro">
                            {user.prenom} {user.nom}
                          </div>
                          <div className="slide-username-pro">
                            @{user.pseudo}
                          </div>
                          
                          <div className="slide-details-pro">
                            <div className="detail-item-pro">
                              <Mail size={12} />
                              <span>{user.email}</span>
                            </div>
                            
                            {user.age && (
                              <div className="detail-item-pro">
                                <Calendar size={12} />
                                <span>Age: {user.age}</span>
                              </div>
                            )}
                            
                            {user.Pays && (
                              <div className="detail-item-pro">
                                <Globe size={12} />
                                <span>{user.Pays}</span>
                              </div>
                            )}
                            
                            {user.couleur && (
                              <div className="detail-item-pro">
                                <Palette size={12} />
                                <div 
                                  className="color-dot-pro"
                                  style={{ backgroundColor: user.couleur }}
                                />
                                <span>{user.couleur}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="slideshow-indicators-pro">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                className={`indicator-dot-pro ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                title={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Professional Table Section */}
      <div className="table-section-pro">
        <div className="table-header-pro">
          <h2>📋 Users List</h2>
          
          <div className="table-controls-pro">
            <div className="search-container-pro">
              <Search className="search-icon-pro" size={18} />
              <input
                type="text"
                className="search-input-pro"
                placeholder="Search users by name, username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-group-pro">
              <button 
                className={`filter-btn-pro ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All Users
              </button>
              <button 
                className={`filter-btn-pro ${statusFilter === "admin" ? "active" : ""}`}
                onClick={() => setStatusFilter("admin")}
              >
                Administrators
              </button>
              <button 
                className={`filter-btn-pro ${statusFilter === "regular" ? "active" : ""}`}
                onClick={() => setStatusFilter("regular")}
              >
                Regular Users
              </button>
            </div>
          </div>
        </div>

        <div className="table-container-pro">
          <table className="users-table-pro">
            <thead>
              <tr>
                <th>User</th>
                <th>Age</th>
                <th>Username</th>
                <th>Country</th>
                <th>Currency</th>
                <th>Color</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell-pro">
                        <img 
                          src={user.avatar || user.photo || `https://ui-avatars.com/api/?name=${user.nom}+${user.prenom}&background=8a0503&color=fff`}
                          alt={`${user.nom} ${user.prenom}`}
                          className="user-avatar-pro"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${user.nom}+${user.prenom}&background=8a0503&color=fff`;
                          }}
                        />
                        <div className="user-info-pro">
                          <div className="user-name-pro">
                            {user.prenom} {user.nom}
                          </div>
                          <div className="user-email-pro">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{user.age || "—"}</td>
                    <td>
                      <strong>@{user.pseudo}</strong>
                    </td>
                    <td>
                      <div className="country-cell-pro">
                        <Globe size={14} />
                        <span>{user.Pays || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="currency-cell-pro">
                        <CreditCard size={14} />
                        <span>{user.Devise || "—"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="color-cell-pro">
                        <div 
                          className="color-preview-pro"
                          style={{ backgroundColor: user.couleur || "#8a0503" }}
                        />
                        <span className="color-value-pro">
                          {user.couleur || "#8a0503"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className={`status-badge-pro ${user.admin ? 'admin' : 'user'}`}>
                        {user.admin ? 'Administrator' : 'Regular User'}
                      </div>
                    </td>
                    <td>
                      <div className="action-cell-pro">
                        <button 
                          className="btn-icon-pro view"
                          title="View Details"
                          onClick={() => handleEdit(user)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="btn-icon-pro edit"
                          title="Edit User"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="btn-icon-pro delete"
                          title="Delete User"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="empty-state-pro">
                      <h3>No users found</h3>
                      <p>
                        {searchTerm 
                          ? `No users match "${searchTerm}"` 
                          : "Start by adding your first user"}
                      </p>
                      <button 
                        className="btn-primary-pro"
                        onClick={() => {
                          setSelectedUser(null);
                          setShowModal(true);
                        }}
                      >
                        <Plus size={18} />
                        Add First User
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="pagination-pro">
            <div className="pagination-info-pro">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            <div className="pagination-controls-pro">
              <button 
                className="pagination-btn-pro"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} />
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  className={`pagination-btn-pro ${currentPage === index + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                className="pagination-btn-pro"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Professional Modal */}
      {showModal && (
        <div className="modal-overlay-pro">
          <div className="modal-pro">
            <div className="modal-header-pro">
              <h3>{selectedUser ? "Edit User" : "Create New User"}</h3>
              <button 
                className="modal-close-pro"
                onClick={() => setShowModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body-pro">
              <form onSubmit={handleSubmit}>
                <div className="form-grid-pro">
                  <div className="form-group-pro">
                    <label>First Name *</label>
                    <input
                      type="text"
                      className="form-control-pro"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      required
                      placeholder="John"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      className="form-control-pro"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      required
                      placeholder="Doe"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Username *</label>
                    <input
                      type="text"
                      className="form-control-pro"
                      value={formData.pseudo}
                      onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                      required
                      placeholder="johndoe"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Age</label>
                    <input
                      type="number"
                      className="form-control-pro"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="30"
                      min="0"
                      max="120"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      className="form-control-pro"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Password *</label>
                    <input
                      type="password"
                      className="form-control-pro"
                      value={formData.MotDePasse}
                      onChange={(e) => setFormData({ ...formData, MotDePasse: e.target.value })}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Color Theme</label>
                    <input
                      type="color"
                      value={formData.couleur || "#8a0503"}
                      onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      className="form-control-pro"
                      value={formData.couleur}
                      onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
                      placeholder="#8a0503"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Currency</label>
                    <input
                      type="text"
                      className="form-control-pro"
                      value={formData.Devise}
                      onChange={(e) => setFormData({ ...formData, Devise: e.target.value })}
                      placeholder="USD"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Country</label>
                    <input
                      type="text"
                      className="form-control-pro"
                      value={formData.Pays}
                      onChange={(e) => setFormData({ ...formData, Pays: e.target.value })}
                      placeholder="United States"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Avatar URL</label>
                    <input
                      type="text"
                      className="form-control-pro"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label>Photo URL</label>
                    <input
                      type="text"
                      className="form-control-pro"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  
                  <div className="form-group-pro">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="checkbox"
                        checked={formData.admin}
                        onChange={(e) => setFormData({ ...formData, admin: e.target.checked })}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span>Grant Admin Privileges</span>
                    </label>
                  </div>
                </div>
                
                <div className="modal-footer-pro">
                  <button 
                    type="button" 
                    className="btn-secondary-pro"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary-pro"
                  >
                    {selectedUser ? "Update User" : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;