import { useEffect, useState } from "react";
import { getMe } from "../../api/user.service";
// import { debug } from "../../config/debug";

const GetMe = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [result, setResult] = useState(null);

  useEffect(() => {

    const fetchProfile = async () => {

      try {

        setLoading(true);
        setError("");

        const user = await getMe();

        console.log("Profile fetched:", user.success);

        setResult(user.verifiedUserDetails);

      } catch (error) {

        console.error(
          "Profile fetching error:",
          error.response?.data || error.message
        );

        setError(
          `No profile found. Consider signing up or logging in.\nError: ${
            error.response?.data?.message || error.message
          }`
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

  }, []);


  return (
    <div className="min-h-[70vh] bg-gray-50 px-4 py-12 flex items-center justify-center">

      <div className="w-full max-w-lg">

        {/* Page heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            View your account information
          </p>
        </div>


        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>

            <p className="text-gray-600">
              Loading profile...
            </p>
          </div>
        )}


        {/* Error */}
        {error && (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <span className="text-2xl">!</span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Profile unavailable
            </h2>

            <p className="text-sm text-gray-500 whitespace-pre-line">
              {error}
            </p>

          </div>
        )}


        {/* Profile */}
        {result && !loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold text-blue-600 shadow-md">
                {result.fullname?.charAt(0)?.toUpperCase()}
              </div>

              <h2 className="mt-4 text-2xl font-semibold text-white">
                {result.fullname}
              </h2>

              <span className="inline-block mt-2 rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white capitalize">
                {result.role}
              </span>

            </div>


            {/* Information */}
            <div className="p-6">

              <div className="border-b border-gray-100 pb-5 mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Full Name
                </p>

                <p className="mt-1 text-gray-800 font-medium">
                  {result.fullname}
                </p>
              </div>


              <div className="border-b border-gray-100 pb-5 mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Email Address
                </p>

                <p className="mt-1 text-gray-800 font-medium break-all">
                  {result.email}
                </p>
              </div>


              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Account Role
                </p>

                <p className="mt-1 text-gray-800 font-medium capitalize">
                  {result.role}
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default GetMe;