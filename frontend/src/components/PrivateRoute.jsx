import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // assumes user is null when not logged in

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
