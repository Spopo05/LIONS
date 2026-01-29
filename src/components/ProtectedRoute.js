import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { loginUser } from '../redux/actions'; // Import the action

const ProtectedRoute = ({ adminOnly = false }) => {
  const dispatch = useDispatch(); // Initialize dispatch
  const user = useSelector((state) => state);
  
  // Check localStorage first
  const persistedUser = JSON.parse(localStorage.getItem('user'));
  
  if (!persistedUser?.id) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !persistedUser.admin) {
    return <Navigate to="/Accuiel" replace />;
  }

  // Sync Redux with localStorage
  if (!user.id) {
    dispatch(loginUser(persistedUser)); // Use the imported action
  }

  return <Outlet />;
};

export default ProtectedRoute;