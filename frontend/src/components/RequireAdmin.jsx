import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to='/' replace />;
  }
  return children;
};

export default RequireAdmin;
