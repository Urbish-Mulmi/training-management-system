import React from "react";

const ContactInfo = () => {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Contact Us
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Get in touch with us
          </h1>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Have a question about our courses, training programs, or placement
            opportunities? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900">Visit Us</h3>
            <p className="text-sm text-gray-600 mt-3">
              Kathmandu, Nepal
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900">Email Us</h3>
            <p className="text-sm text-gray-600 mt-3">
              info@example.com
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900">Call Us</h3>
            <p className="text-sm text-gray-600 mt-3">
              +977 9800000000
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-gray-900 mb-4">
            Follow Us
          </h3>

          <div className="flex justify-center gap-4 text-sm">
            <a href="#" className="text-blue-600 hover:underline">
              Facebook
            </a>

            <a href="#" className="text-blue-600 hover:underline">
              Instagram
            </a>

            <a href="#" className="text-blue-600 hover:underline">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;