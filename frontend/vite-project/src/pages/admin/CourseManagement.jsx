import React, { useState, useEffect } from 'react';
import { getAllCourse, addCourse, getOneCourse, editCourse, deleteCourse } from '../../api/course.service';
import toast from 'react-hot-toast';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState(null);

  const [courseData, setCourseData] = useState({
    coursename: "",
    coursedescription: "",
    duration: "",
    unit: "month",
    fee: "",
    prerequisite: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await getAllCourse();
      setCourses(res.courses || res.data || []);
    } catch (err) {
      toast.error("Failed to load courses.");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value
    });
  };

  const handleOpenAdd = () => {
    setEditingCourseId(null);
    setSyllabus(null);
    setCourseData({
      coursename: "",
      coursedescription: "",
      duration: "",
      unit: "month",
      fee: "",
      prerequisite: "",
    });
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = async (id) => {
    setEditingCourseId(id);
    setSyllabus(null);

    try {
      setLoading(true);

      const res = await getOneCourse(id);
      const data = res.data || res.course || res;

      setCourseData({
        coursename: data.coursename || "",
        coursedescription: data.coursedescription || "",
        duration: data.duration || "",
        unit: data.unit || "month",
        fee: data.fee || "",
        prerequisite: data.prerequisite || "",
      });

      setIsDrawerOpen(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to load course details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("coursename", courseData.coursename);
      formData.append("coursedescription", courseData.coursedescription);
      formData.append("duration", courseData.duration);
      formData.append("unit", courseData.unit);
      formData.append("fee", courseData.fee);
      formData.append("prerequisite", courseData.prerequisite);

      if (syllabus) {
        formData.append("syllabus", syllabus);
      }

      if (editingCourseId) {
        const res = await editCourse(editingCourseId, formData);
        toast.success(res.message || "Course updated successfully!");
      } else {
        const res = await addCourse(formData);
        toast.success(res.message || "Course created successfully!");
      }

      setIsDrawerOpen(false);
      setSyllabus(null);
      fetchCourses();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Operation failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully.");
      fetchCourses();
    } catch (err) {
      toast.error("Failed to delete course.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 relative">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Course Management
          </h1>
          <p className="text-sm text-gray-500">
            Create and manage courses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Course
        </button>
      </div>

      {/* Course List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div
            key={course._id}
            className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start gap-3">
              <h2 className="text-lg font-semibold text-gray-800">
                {course.coursename}
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(course._id)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(course._id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-3">
              {course.coursedescription}
            </p>

            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {course.duration} {course.unit}
              </p>

              <p>
                <span className="font-medium">Fee:</span>{" "}
                {course.fee}
              </p>

              <p>
                <span className="font-medium">Prerequisite:</span>{" "}
                {course.prerequisite || "None"}
              </p>
            </div>

            {course.syllabus?.url && (
              <a
                href={course.syllabus.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-blue-600 text-sm hover:underline"
              >
                View Syllabus
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-50">
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl overflow-y-auto">

            <div className="p-6">

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingCourseId ? "Edit Course" : "Add New Course"}
                </h2>

                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-gray-500 hover:text-gray-800 text-xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Course Name */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Course Name
                  </label>

                  <input
                    type="text"
                    name="coursename"
                    value={courseData.coursename}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm"
                  />
                </div>

                {/* Prerequisite */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Prerequisite
                  </label>

                  <input
                    type="text"
                    name="prerequisite"
                    value={courseData.prerequisite}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>

                  <textarea
                    name="coursedescription"
                    value={courseData.coursedescription}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Duration
                  </label>

                  <input
                    type="number"
                    name="duration"
                    value={courseData.duration}
                    onChange={handleChange}
                    min="1"
                     step="0.1"
                    required
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Unit
                  </label>

                  <select
                    name="unit"
                    value={courseData.unit}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm"
                  >
                    <option value="month">Month</option>
                    <option value="week">Week</option>
                  </select>
                </div>

                {/* Fee */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fee
                  </label>

                  <input
                    type="number"
                    name="fee"
                    value={courseData.fee}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm"
                  />
                </div>

                {/* Syllabus */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Syllabus PDF
                  </label>

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    required={!editingCourseId}
                    onChange={(e) => setSyllabus(e.target.files[0])}
                    className="w-full border border-gray-300 p-2.5 rounded-lg text-sm"
                  />

                  {editingCourseId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to keep the existing syllabus.
                    </p>
                  )}
                </div>

                {/* Drawer Footer Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : editingCourseId
                      ? "Update Course"
                      : "Create Course"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}