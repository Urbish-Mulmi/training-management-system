import React, { useEffect, useState } from "react";
import { getOneCourse, editCourse } from "../../api/course.service";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const [courseData, setCourseData] = useState({
    coursename: "",
    coursedescription: "",
    duration: "",
    unit: "month",
    fee: "",
    prerequisite: "",
  });

  // Load course once page opens
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getOneCourse(id);
        setCourseData(res.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };

    fetchCourse();
  }, [id]);

  // Update form fields
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit edited course
  const handleEditCourse = async (e) => {
    e.preventDefault();

    try {
      const res = await editCourse(id, courseData);

      toast.success(res.message);

      navigate("/admin/courses");
    } catch (error) {
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Course update failed");
    }
  };

  return (
    <div>
      <h1>Edit Course</h1>

      <form onSubmit={handleEditCourse}>
        <input
          type="text"
          name="coursename"
          placeholder="Course Name"
          value={courseData.coursename}
          onChange={handleChange}
        />

        <br /><br />

        <textarea
          name="coursedescription"
          placeholder="Course Description"
          value={courseData.coursedescription}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="duration"
          placeholder="Duration"
          value={courseData.duration}
          onChange={handleChange}
        />

        <select
          name="unit"
          value={courseData.unit}
          onChange={handleChange}
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>

        <br /><br />

        <input
          type="number"
          name="fee"
          placeholder="Fee"
          value={courseData.fee}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="prerequisite"
          placeholder="Prerequisite"
          value={courseData.prerequisite}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Update Course
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default EditCourse;