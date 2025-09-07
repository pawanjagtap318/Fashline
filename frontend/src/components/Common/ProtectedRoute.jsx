import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children, role }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Check if token exists & expired
  const token = localStorage.getItem("userToken");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        // Token expired → force logout
        dispatch(logout());
        return <Navigate to="/login" replace />;
      }
    } catch (err) {
      dispatch(logout());
      return <Navigate to="/login" replace />;
    }
  }

  // Normal role/user check
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
