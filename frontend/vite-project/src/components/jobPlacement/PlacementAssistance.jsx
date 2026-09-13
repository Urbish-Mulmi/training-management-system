
import React from "react";

const PlacementAssistance = () => {
  const services = [
    {
      number: "01",
      title: "Career Guidance",
      description:
        "Get practical guidance on career paths, in-demand skills, and opportunities in the IT industry.",
    },
    {
      number: "02",
      title: "Interview Preparation",
      description:
        "Prepare for technical interviews, improve communication skills, and build confidence for your next opportunity.",
    },
    {
      number: "03",
      title: "Job Opportunities",
      description:
        "Access relevant IT job openings shared through our placement network and industry connections.",
    },
  ];

  return (
    <section className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Career Support
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            From learning to your next opportunity
          </h1>

          <p className="text-gray-600 mt-4 leading-relaxed">
            Our placement support helps students turn their technical training
            into real career opportunities through guidance, preparation, and
            access to relevant job openings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.number}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-semibold text-blue-600">
                  {service.number}
                </span>

                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <span className="text-blue-600 text-sm">→</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {service.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlacementAssistance;

