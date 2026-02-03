import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo1 from "../assets/lion1.png";
import './Login.css';


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.get("https://67719603ee76b92dd49017b3.mockapi.io/louriga2mehdi/users");
      const user = response.data.find(u => u.pseudo === username && u.MotDePasse === password);
      
      if (user) {
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        dispatch(loginUser(user));
        navigate(user.admin ? "/admin" : "/accueil");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="container">
        <div className="login-container">
            <div className="login-form">
                 <img src={logo1} alt="Logo" className="logo1" />
                     <h2>Login</h2>
                        <input
                             type="text"
                                placeholder="Username"
                                  value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                        />
                                        <div className="password-container">
                                           <input
                                              type={showPassword ? "text" : "password"}
                                                placeholder="Password"
                                                  value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                      />
                                                      <button
                                                        type="button"
                                                          onClick={() => setShowPassword(!showPassword)}
                                                            className="password-toggle"
                                                      >
                                                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                      </button>
                                                  </div>
                                              <button className="btnc" onClick={handleLogin} disabled={attempts >= 3}>
                                            LOGIN
                                       </button>
                                    {error && <ul style={{ color: "red" }}><li>{error}</li></ul>}
                                  <p>
                                  Don't have an account? <Link to="/create-account">Create an account</Link>
                              </p>
                    </div>
              </div>
      </div>
  );
};

export default Login;