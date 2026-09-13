import { useState } from "react";
import { signUpUser } from "../../api/auth.service";
import { useNavigate, useLocation } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await signUpUser(form);

      setMessage(response.message);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create your account
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Register to start your training journey.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-7">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Full name
              </label>

              <input
                id="fullname"
                type="text"
                placeholder="Enter your full name"
                value={form.fullname}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullname: e.target.value,
                  })
                }
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition"
              />
            </div>

            {/* Message */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2">
                <p className="text-xs text-green-700">
                  {message}
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <p className="text-xs text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition"
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Already have an account?{" "}

              <button
                type="button"
                onClick={() =>
                  navigate("/login", {
                    state: {
                      from: location.state?.from || "/",
                    },
                  })
                }
                className="font-medium text-gray-900 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-gray-400 mt-5">
          Training Management System
        </p>
      </div>
    </div>
  );
}

export default Register;

