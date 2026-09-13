import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">

        <div className="text-7xl font-semibold tracking-tight text-gray-900">
          404
        </div>

        <h1 className="mt-4 text-xl font-semibold text-gray-900">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-gray-500 leading-6">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <Link
          to="/"
          className="inline-flex mt-6 items-center justify-center bg-gray-900 hover:bg-gray-800 text-white text-xs font-medium px-4 py-2.5 rounded-md transition shadow-xs"
        >
          Return to Home
        </Link>

      </div>
    </div>
  );
}