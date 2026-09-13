import React from "react";

const ContactMap = () => {
  return (
    <section className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="max-w-2xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Find Us
          </h2>

          <p className="text-gray-600 mt-3">
            Visit us at our office in Kathmandu, Nepal.
          </p>
        </div>

        <div className="max-w-4xl mx-auto h-96 rounded-xl overflow-hidden border border-gray-200">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.4810592043887!2d85.3431703753224!3d27.671522976203118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190536c1caa7%3A0xf92fcf603dac3960!2sSipalaya%20Info%20Tech%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1789020052074!5m2!1sen!2snp" 
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            title="Our location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default ContactMap;