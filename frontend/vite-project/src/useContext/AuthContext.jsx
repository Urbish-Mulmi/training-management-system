import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/user.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Global authentication state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch currently logged-in user
  const fetchCurrentUser = async () => {
    try {
      const data = await getMe();
      

      if (data.success) {

        setUser(data.verifiedUserDetails);                
        return data.verifiedUserDetails;
      } else {
        setUser(null);
        return null;
      }

    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Runs once when the app starts
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,        
        loading,
        fetchCurrentUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};