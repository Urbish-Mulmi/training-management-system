import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "../useContext/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Wait until authentication check finishes
  if (loading) {
    return <p>Loading...</p>;
  }

  // User is not logged in
  if (!user) {
    toast.error("You must be admin logged in to access this page");
    return <Navigate to="/login" replace />;
  }

  // Role-based protection
  if (requiredRole && user.role !== requiredRole) {
    toast.error(`Your are ${user.role}, only ${requiredRole} can access this page`,
      {duration:2300}
    );

    return <Navigate to="/" replace />;
  }

  // User is authorized
  return children;
};

export default ProtectedRoute;