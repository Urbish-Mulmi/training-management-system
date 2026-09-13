
import React from "react";

const AlumniTestimonials = () => {
  const testimonials = [
    {
      name: "Alumni Student",
      role: "Software Developer",
      message:
        "The training helped me develop practical skills and gave me the confidence to start my career in IT.",
    },
    {
      name: "Alumni Student",
      role: "Frontend Developer",
      message:
        "The career guidance and placement support helped me prepare for interviews and find the right opportunity.",
    },
    {
      name: "Alumni Student",
      role: "Web Developer",
      message:
        "I gained practical experience during the training and was able to apply those skills in a professional environment.",
    },
  ];

  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Student Experiences
          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-2">
            Alumni Success Stories
          </h2>

          <p className="text-gray-600 mt-2">
            Hear how our alumni used their training and support to take the
            next step in their careers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
            >
              <div className="text-3xl text-blue-200 font-serif leading-none">
                “
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mt-2">
                {testimonial.message}
              </p>

              <div className="border-t border-gray-100 mt-6 pt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-0.5">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlumniTestimonials;

