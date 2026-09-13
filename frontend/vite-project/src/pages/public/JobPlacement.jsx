import React from "react";
import PlacementAssistance from "../../components/jobPlacement/PlacementAssistance";
import JobListings from "../../components/jobPlacement/JobListings";
import AlumniTestimonials from "../../components/jobPlacement/AlumniTestimonials";

const JobPlacement = () => {
  return (
    <div>
      <PlacementAssistance />
      <JobListings />
      <AlumniTestimonials />
    </div>
  );
};

export default JobPlacement;

