import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">

          {/* Failure Icon */}
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <span className="text-2xl text-red-600">
              ×
            </span>
          </div>

          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mt-6">
            Payment Failed
          </p>

          <h1 className="text-2xl font-semibold text-gray-900 mt-2">
            Payment was not completed
          </h1>

          <p className="text-sm text-gray-500 leading-6 mt-3">
            Your payment could not be completed. No successful
            payment has been recorded for this enrollment.
          </p>

          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-md p-4">
            <p className="text-xs text-gray-500 leading-5">
              You can return to the course and try the enrollment
              and payment process again.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-6 py-3 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>

        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;

