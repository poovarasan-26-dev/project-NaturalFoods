import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return <Loader text="Checking authentication..." />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
