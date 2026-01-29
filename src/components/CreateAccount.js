import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Icons for show/hide password
import logo2 from "../assets/lion1.png";
import './CreateAccount.css';

const CreateAccount = () => {
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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.MotDePasse !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (
      !formData.nom ||
      !formData.age ||
      !formData.MotDePasse ||
      !formData.pseudo ||
      !formData.prenom ||
      !formData.couleur ||
      !formData.Devise ||
      !formData.Pays ||
      !formData.email
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "https://67719603ee76b92dd49017b3.mockapi.io/louriga2mehdi/users",
        formData
      );
      if (response.data) {
        setIsSuccess(true);
        setError("");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-form">
        <img src={logo2} alt="logo2" className="logo2" />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-gridc">
            <div className="form-groupc">
              <label>Nom</label>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-groupc">
              <label>Age</label>
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-groupc">
              <label>Pseudo</label>
              <input
                type="text"
                name="pseudo"
                placeholder="Pseudo"
                value={formData.pseudo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-groupc">
              <label>Prénom</label>
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-groupc">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-groupc">
  <label>Password</label>
  <div className="password-container">
    <input
      type={showPassword ? "text" : "password"}
      name="MotDePasse"
      placeholder="Password"
      value={formData.MotDePasse}
      onChange={handleChange}
      required
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="password-toggle"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

<div className="form-groupc">
  <label>Confirm Password</label>
  <div className="password-container">
    <input
      type={showConfirmPassword ? "text" : "password"}
      placeholder="Confirm Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="password-toggle"
    >
      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

            {/* Preferences */}
            <div className="form-groupc">
              <label>Couleur préférée</label>
              <input
                type="text"
                name="couleur"
                placeholder="Couleur préférée"
                value={formData.couleur}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-groupc">
              <label>Devise</label>
              <input
                type="text"
                name="Devise"
                placeholder="Devise"
                value={formData.Devise}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-groupc">
              <label>Pays</label>
              <input
                type="text"
                name="Pays"
                placeholder="Pays"
                value={formData.Pays}
                onChange={handleChange}
                required
              />
            </div>

            {/* Optional Information */}
            <div className="form-groupc">
              <label>Avatar URL</label>
              <input
                type="text"
                name="avatar"
                placeholder="Avatar URL"
                value={formData.avatar}
                onChange={handleChange}
              />
            </div>
            <div className="form-groupc">
              <label>Photo URL</label>
              <input
                type="text"
                name="photo"
                placeholder="Photo URL"
                value={formData.photo}
                onChange={handleChange}
              />
            </div>
            <div className="form-groupc">
              <label>
                <input
                  type="checkbox"
                  name="admin"
                  checked={formData.admin}
                  onChange={handleChange}
                />
                Admin
              </label>
            </div>
          </div>

          <button className="btnc" type="submit">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
