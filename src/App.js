import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Layout from "./components/Layout";
import CreateAccount from "./components/CreateAccount";
import AdminPage from "./components/admin/AdminPage";
import AddUser from "./components/admin/AddUser";
import EditUser from "./components/admin/EditUser";
import Accueil from "./components/nav/Accueil";
import profile from './components/nav/profile';
import ChangeColor from './components/nav/changeColor';

// Import demandes components
import SimpleDemandesTest from "./components/demandes/SimpleDemandesTest";
import CreateDemande from "./components/demandes/CreateDemande";
import MesDemandes from "./components/demandes/MesDemandes";
import AdminDemandes from "./components/demandes/AdminDemandes";
import { DemandesProvider } from "./components/demandes/DemandesContext";

import Style from "./App.css";

const App = () => {
  return (
    <DemandesProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          
          {/* Protected routes */}
          <Route element={<Layout />}>
            {/* Admin-only routes */}
            <Route element={<ProtectedRoute adminOnly />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/add-user" element={<AddUser />} />
              <Route path="/edit-user/:id" element={<EditUser />} />
              <Route path="/admin/demandes" element={<AdminDemandes />} /> {/* ADDED */}
            </Route>
            
            {/* Regular authenticated routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<profile />} />
              <Route path="/accueil" element={<Accueil />} />
              <Route path="/ChangeColor" element={<ChangeColor/>} />
              
              {/* Demandes routes */}
              <Route path="/test-demandes" element={<SimpleDemandesTest />} />
              <Route path="/creer-demande" element={<CreateDemande />} />
              <Route path="/mes-demandes" element={<MesDemandes />} />
            </Route>
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </DemandesProvider>
  );
};

export default App;