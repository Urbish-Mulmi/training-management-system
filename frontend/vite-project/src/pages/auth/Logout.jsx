import toast from "react-hot-toast";
import { useEffect } from "react";
import { logOutUser } from "../../api/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../useContext/AuthContext.jsx";

const LogOut = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await logOutUser();

        setUser(null);

        toast.success("Logged out successfully", {position: "top-center",style: {marginTop: "70px",},});

        navigate("/");
      } catch (error) {
        toast.error("Logout Error");
        console.error(error);
      }
    };

    logout();
  }, []);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-8 py-7 text-center max-w-sm w-full">
        <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin"></div>
        </div>

        <h1 className="text-sm font-semibold text-gray-900 mt-4">
          Signing you out
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Please wait while we securely end your session.
        </p>
      </div>
    </div>
  );
};

export default LogOut;