// import { useState, useEffect } from "react";
// import {
//   getAllUser,
//   roleUpdateUser,
//   deleteUser,
// } from "../../api/user.service";
// import {
//   getPendingPaidEnrollments,
//   getBatchesForCourse,
//   approveEnrollment,
// } from "../../api/enrollment.service";
// import toast from "react-hot-toast";

// const UserManagement = () => {
//   const [display, setDisplay] = useState("");
//   const [error, setError] = useState("");
//   const [viewdata, setViewdata] = useState([]);
//   const [activeFilter, setActiveFilter] = useState("enrollment");
//   const [loading, setLoading] = useState(false);

//   const [enrollments, setEnrollments] = useState([]);
//   const [enrollmentLoading, setEnrollmentLoading] = useState(false);
//   const [batches, setBatches] = useState({});
//   const [selectedBatch, setSelectedBatch] = useState({});
//   const [loadingBatches, setLoadingBatches] = useState({});
//   const [approving, setApproving] = useState({});

//   useEffect(() => {
//     handleGetEnrollments();
//   }, []);

//   const handleGetUsers = async (role = "") => {
//     try {
//       setLoading(true);
//       setError("");
//       setActiveFilter(role || "all");

//       const queryRole = role && role !== "all" ? role : undefined;
//       const data = await getAllUser(queryRole);

//       console.log("Users fetched:", data);
//       setDisplay(data.message);
//       setViewdata(data.users || []);
//     } catch (error) {
//       console.error("Error in get users component:", error.response?.data || error.message);
//       setError(error.response?.data?.message || error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGetEnrollments = async () => {
//     try {
//       setEnrollmentLoading(true);
//       setError("");
//       setActiveFilter("enrollment");

//       const data = await getPendingPaidEnrollments();

//       console.log("Pending enrollments:", data);
//       setEnrollments(data.enrollments || []);
//     } catch (error) {
//       console.error("Error fetching enrollments:", error.response?.data || error.message);
//       setError(error.response?.data?.message || error.message || "Failed to load enrollments.");
//     } finally {
//       setEnrollmentLoading(false);
//     }
//   };

//   const handleDeleteUser = async (id) => {
//     try {
//       setError("");
//       const data = await deleteUser(id);

//       console.log("Delete function triggered:", data);
//       setDisplay(data.message);
//       toast.success(data.message || "User deleted successfully");

//       await handleGetUsers(activeFilter === "all" ? "" : activeFilter);
//     } catch (error) {
//       console.error("Error in delete user component:", error.response?.data || error.message);
//       setError(error.response?.data?.message || error.message);
//     }
//   };

//   const handleRoleChange = async (id, newRole) => {
//     try {
//       const res = await roleUpdateUser(id, newRole);

//       toast.success(res.message);
//       setError("");
//       console.log("Role update:", res);
//       setDisplay(res.message);

//       await handleGetUsers(activeFilter === "all" ? "" : activeFilter);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.error ||
//         error.response?.data?.message ||
//         "Role update failed"
//       );

//       console.error("Error in role update:", error.response?.data || error.message);
//       setError(error.response?.data?.message || error.message);
//     }
//   };

//   const handleLoadBatches = async (courseId) => {
//     if (batches[courseId]) return;

//     try {
//       setLoadingBatches(prev => ({ ...prev, [courseId]: true }));
//       setError("");

//       const data = await getBatchesForCourse(courseId);

//       console.log("Batches for course:", data);
//       setBatches(prev => ({ ...prev, [courseId]: data.batches || [] }));
//     } catch (error) {
//       console.error("Error fetching batches:", error.response?.data || error.message);
//       setError(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to load batches."
//       );
//     } finally {
//       setLoadingBatches(prev => ({ ...prev, [courseId]: false }));
//     }
//   };

//   const handleBatchChange = (enrollmentId, batchId) => {
//     setSelectedBatch(prev => ({
//       ...prev,
//       [enrollmentId]: batchId,
//     }));
//   };

//   const handleApproveEnrollment = async (enrollment) => {
//     const enrollmentId = enrollment._id;
//     const batchId = selectedBatch[enrollmentId];

//     if (!batchId) {
//       toast.error("Please select a batch first.");
//       return;
//     }

//     try {
//       setApproving(prev => ({ ...prev, [enrollmentId]: true }));
//       setError("");

//       const response = await approveEnrollment(enrollmentId, batchId);

//       console.log("Enrollment approved:", response);
//       toast.success(response.message || "Enrollment approved successfully.");

//       setEnrollments(prev =>
//         prev.filter(item => item._id !== enrollmentId)
//       );

//       setSelectedBatch(prev => {
//         const updated = { ...prev };
//         delete updated[enrollmentId];
//         return updated;
//       });
//     } catch (error) {
//       console.error("Error approving enrollment:", error.response?.data || error.message);

//       toast.error(
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to approve enrollment."
//       );
//     } finally {
//       setApproving(prev => ({ ...prev, [enrollmentId]: false }));
//     }
//   };

//   const getRoleBadgeColor = (role) => {
//     switch (role) {
//       case "admin":
//         return "bg-purple-100 text-purple-700 border-purple-200";
//       case "instructor":
//         return "bg-blue-100 text-blue-700 border-blue-200";
//       case "student":
//         return "bg-emerald-100 text-emerald-700 border-emerald-200";
//       default:
//         return "bg-gray-100 text-gray-700 border-gray-200";
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             {activeFilter === "enrollment" ? "Enrollment Management" : "User Management"}
//           </h1>
//           <p className="text-sm text-gray-500">
//             {activeFilter === "enrollment"
//               ? "Review paid enrollments, assign batches, and approve students."
//               : "Manage user accounts, roles, and permissions."}
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-xl">
//           {[
//             { label: "Enrollments", value: "enrollment" },
//             { label: "All", value: "all" },
//             { label: "Students", value: "student" },
//             { label: "Instructors", value: "instructor" },
//             { label: "Admins", value: "admin" },
//             { label: "Guests", value: "guest" },
//           ].map((tab) => (
//             <button
//               key={tab.value}
//               onClick={() => {
//                 if (tab.value === "enrollment") {
//                   handleGetEnrollments();
//                 } else {
//                   handleGetUsers(tab.value === "all" ? "" : tab.value);
//                 }
//               }}
//               className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
//                 activeFilter === tab.value
//                   ? "bg-white text-gray-900 shadow-sm"
//                   : "text-gray-600 hover:text-gray-900"
//               }`}
//             >
//               {tab.label}
//               {tab.value === "enrollment" && enrollments.length > 0 && (
//                 <span className="ml-1.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px]">
//                   {enrollments.length}
//                 </span>
//               )}
//             </button>
//           ))}
//         </div>
//       </div>

//       {error && (
//         <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
//           <span className="font-semibold">Error:</span> {error}
//         </div>
//       )}

//       {activeFilter === "enrollment" ? (
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/75">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm font-semibold text-gray-900">
//                   Pending Enrollments
//                 </h2>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                   Paid enrollments waiting for admin approval and batch assignment.
//                 </p>
//               </div>
//               <span className="text-xs font-medium text-gray-500">
//                 {enrollments.length} pending
//               </span>
//             </div>
//           </div>

//           {enrollmentLoading ? (
//             <div className="py-12 text-center text-gray-400 text-sm">
//               Loading enrollments...
//             </div>
//           ) : enrollments.length === 0 ? (
//             <div className="py-12 text-center">
//               <p className="text-sm text-gray-500">
//                 No pending enrollments.
//               </p>
//               <p className="text-xs text-gray-400 mt-1">
//                 Paid enrollments will appear here after successful payment.
//               </p>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-200">
//               {enrollments.map((enrollment) => {
//                 const student = enrollment.student;
//                 const course = enrollment.course;
//                 const courseId = course?._id;
//                 const courseBatches = batches[courseId] || [];
//                 const isLoadingBatches = loadingBatches[courseId];
//                 const isApproving = approving[enrollment._id];

//                 return (
//                   <div
//                     key={enrollment._id}
//                     className="p-6 hover:bg-gray-50/50 transition-colors"
//                   >
//                     <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
//                           Student
//                         </p>
//                         <div className="font-medium text-sm text-gray-900">
//                           {student?.fullname || "Unknown student"}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {student?.email || "No email"}
//                         </div>
//                       </div>

//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
//                           Course
//                         </p>
//                         <div className="font-medium text-sm text-gray-900">
//                           {course?.coursename || "Unknown course"}
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           Fee: Rs.{" "}
//                           {Number(
//                             course?.fee || enrollment.paymentPaid || 0
//                           ).toLocaleString()}
//                         </div>
//                       </div>

//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
//                           Payment
//                         </p>
//                         <div className="flex items-center gap-2">
//                           <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200">
//                             Paid
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-2">
//                           Rs.{" "}
//                           {Number(
//                             enrollment.paymentPaid || 0
//                           ).toLocaleString()}
//                         </div>
//                       </div>

//                       <div>
//                         <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">
//                           Batch Assignment
//                         </p>

//                         {!batches[courseId] && (
//                           <button
//                             type="button"
//                             onClick={() => handleLoadBatches(courseId)}
//                             disabled={isLoadingBatches}
//                             className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white px-3 py-2 rounded-md text-xs font-medium transition"
//                           >
//                             {isLoadingBatches
//                               ? "Loading batches..."
//                               : "Load Available Batches"}
//                           </button>
//                         )}

//                         {batches[courseId] && (
//                           <>
//                             <select
//                               value={selectedBatch[enrollment._id] || ""}
//                               onChange={(e) =>
//                                 handleBatchChange(
//                                   enrollment._id,
//                                   e.target.value
//                                 )
//                               }
//                               disabled={isApproving}
//                               className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
//                             >
//                               <option value="">
//                                 -- Select Batch --
//                               </option>

//                               {courseBatches.map((batch) => (
//                                 <option
//                                   key={batch._id}
//                                   value={batch._id}
//                                 >
//                                   {batch.batchname}
//                                 </option>
//                               ))}
//                             </select>

//                             {courseBatches.length === 0 && (
//                               <p className="text-xs text-red-500 mt-2">
//                                 No active batches available for this course.
//                               </p>
//                             )}

//                             {courseBatches.length > 0 && (
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   handleApproveEnrollment(enrollment)
//                                 }
//                                 disabled={
//                                   isApproving ||
//                                   !selectedBatch[enrollment._id]
//                                 }
//                                 className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md text-xs font-medium transition"
//                               >
//                                 {isApproving
//                                   ? "Approving..."
//                                   : "Approve Enrollment"}
//                               </button>
//                             )}
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                   <th className="py-3.5 px-6">User Details</th>
//                   <th className="py-3.5 px-6">Role</th>
//                   <th className="py-3.5 px-6">User ID</th>
//                   <th className="py-3.5 px-6 text-right">Actions</th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200 text-sm">
//                 {loading ? (
//                   <tr>
//                     <td colSpan="4" className="py-12 text-center text-gray-400">
//                       Loading users...
//                     </td>
//                   </tr>
//                 ) : viewdata.length === 0 ? (
//                   <tr>
//                     <td colSpan="4" className="py-12 text-center text-gray-400">
//                       No users found for this filter. Click "All" or filter buttons above.
//                     </td>
//                   </tr>
//                 ) : (
//                   viewdata.map((user) => (
//                     <tr
//                       key={user._id}
//                       className="hover:bg-gray-50/50 transition-colors"
//                     >
//                       <td className="py-4 px-6">
//                         <div className="font-medium text-gray-900">
//                           {user.fullname}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {user.email}
//                         </div>
//                       </td>

//                       <td className="py-4 px-6">
//                         <div className="flex items-center gap-3">
//                           <span
//                             className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${getRoleBadgeColor(
//                               user.role
//                             )}`}
//                           >
//                             {user.role}
//                           </span>

//                           <select
//                             value={user.role}
//                             onChange={(e) =>
//                               handleRoleChange(
//                                 user._id,
//                                 e.target.value
//                               )
//                             }
//                             className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
//                           >
//                             <option value="student">Student</option>
//                             <option value="instructor">Instructor</option>
//                             <option value="admin">Admin</option>
//                             <option value="guest">Guest</option>
//                           </select>
//                         </div>
//                       </td>

//                       <td className="py-4 px-6 font-mono text-xs text-gray-400">
//                         {user._id}
//                       </td>

//                       <td className="py-4 px-6 text-right">
//                         <button
//                           onClick={() => handleDeleteUser(user._id)}
//                           className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserManagement;
import { useState, useEffect } from "react";
import {
  getAllUser,
  roleUpdateUser,
  deleteUser,
  getUserDetails,
} from "../../api/user.service";
import {
  getPendingPaidEnrollments,
  getBatchesForCourse,
  approveEnrollment,
} from "../../api/enrollment.service";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [display, setDisplay] = useState("");
  const [error, setError] = useState("");
  const [viewdata, setViewdata] = useState([]);
  const [activeFilter, setActiveFilter] = useState("enrollment");
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [batches, setBatches] = useState({});
  const [selectedBatch, setSelectedBatch] = useState({});
  const [loadingBatches, setLoadingBatches] = useState({});
  const [approving, setApproving] = useState({});

  // Selected user ko details modal ma dekhauna
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    handleGetEnrollments();
  }, []);

  const handleGetUsers = async (role = "") => {
    try {
      setLoading(true);
      setError("");
      setActiveFilter(role || "all");
      const queryRole = role && role !== "all" ? role : undefined;
      const data = await getAllUser(queryRole);
      console.log("Users fetched:", data);
      setDisplay(data.message);
      setViewdata(data.users || []);
    } catch (error) {
      console.error("Error in get users component:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetEnrollments = async () => {
    try {
      setEnrollmentLoading(true);
      setError("");
      setActiveFilter("enrollment");
      const data = await getPendingPaidEnrollments();
      console.log("Pending enrollments:", data);
      setEnrollments(data.enrollments || []);
    } catch (error) {
      console.error("Error fetching enrollments:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || "Failed to load enrollments.");
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      setError("");
      const data = await deleteUser(id);
      console.log("Delete function triggered:", data);
      setDisplay(data.message);
      toast.success(data.message || "User deleted successfully");
      await handleGetUsers(activeFilter === "all" ? "" : activeFilter);
    } catch (error) {
      console.error("Error in delete user component:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await roleUpdateUser(id, newRole);
      toast.success(res.message);
      setError("");
      console.log("Role update:", res);
      setDisplay(res.message);
      await handleGetUsers(activeFilter === "all" ? "" : activeFilter);
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || "Role update failed");
      console.error("Error in role update:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message);
    }
  };

  // User ko details backend bata fetch garne
  const handleViewUser = async (id) => {
    try {
      setError("");
      const data = await getUserDetails(id);
      console.log("User details:", data);

      // Data ayepachi modal open huncha
      setSelectedUser(data.user);
    } catch (error) {
      console.error("Error fetching user details:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch user details");
    }
  };

  // Modal close garne
  const handleCloseUserDetails = () => {
    setSelectedUser(null);
  };

  const handleLoadBatches = async (courseId) => {
    if (batches[courseId]) return;
    try {
      setLoadingBatches(prev => ({ ...prev, [courseId]: true }));
      setError("");
      const data = await getBatchesForCourse(courseId);
      console.log("Batches for course:", data);
      setBatches(prev => ({ ...prev, [courseId]: data.batches || [] }));
    } catch (error) {
      console.error("Error fetching batches:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || "Failed to load batches.");
    } finally {
      setLoadingBatches(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const handleBatchChange = (enrollmentId, batchId) => {
    setSelectedBatch(prev => ({ ...prev, [enrollmentId]: batchId }));
  };

  const handleApproveEnrollment = async (enrollment) => {
    const enrollmentId = enrollment._id;
    const batchId = selectedBatch[enrollmentId];

    if (!batchId) {
      toast.error("Please select a batch first.");
      return;
    }

    try {
      setApproving(prev => ({ ...prev, [enrollmentId]: true }));
      setError("");
      const response = await approveEnrollment(enrollmentId, batchId);
      console.log("Enrollment approved:", response);
      toast.success(response.message || "Enrollment approved successfully.");
      setEnrollments(prev => prev.filter(item => item._id !== enrollmentId));
      setSelectedBatch(prev => {
        const updated = { ...prev };
        delete updated[enrollmentId];
        return updated;
      });
    } catch (error) {
      console.error("Error approving enrollment:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || error.message || "Failed to approve enrollment.");
    } finally {
      setApproving(prev => ({ ...prev, [enrollmentId]: false }));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "instructor":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "student":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {activeFilter === "enrollment" ? "Enrollment Management" : "User Management"}
          </h1>
          <p className="text-sm text-gray-500">
            {activeFilter === "enrollment"
              ? "Review paid enrollments, assign batches, and approve students."
              : "Manage user accounts, roles, and permissions."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-xl">
          {[
            { label: "Enrollments", value: "enrollment" },
            { label: "All", value: "all" },
            { label: "Students", value: "student" },
            { label: "Instructors", value: "instructor" },
            { label: "Admins", value: "admin" },
            { label: "Guests", value: "guest" },
          ].map(tab => (
            <button
              key={tab.value}
              onClick={() => {
                if (tab.value === "enrollment") handleGetEnrollments();
                else handleGetUsers(tab.value === "all" ? "" : tab.value);
              }}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeFilter === tab.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
              {tab.value === "enrollment" && enrollments.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[9px]">
                  {enrollments.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      {activeFilter === "enrollment" ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/75">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Pending Enrollments</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Paid enrollments waiting for admin approval and batch assignment.
                </p>
              </div>
              <span className="text-xs font-medium text-gray-500">{enrollments.length} pending</span>
            </div>
          </div>

          {enrollmentLoading ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading enrollments...</div>
          ) : enrollments.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">No pending enrollments.</p>
              <p className="text-xs text-gray-400 mt-1">
                Paid enrollments will appear here after successful payment.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {enrollments.map(enrollment => {
                const student = enrollment.student;
                const course = enrollment.course;
                const courseId = course?._id;
                const courseBatches = batches[courseId] || [];
                const isLoadingBatches = loadingBatches[courseId];
                const isApproving = approving[enrollment._id];

                return (
                  <div key={enrollment._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Student</p>
                        <div className="font-medium text-sm text-gray-900">{student?.fullname || "Unknown student"}</div>
                        <div className="text-xs text-gray-500 mt-1">{student?.email || "No email"}</div>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Course</p>
                        <div className="font-medium text-sm text-gray-900">{course?.coursename || "Unknown course"}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Fee: Rs. {Number(course?.fee || enrollment.paymentPaid || 0).toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Payment</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200">
                            Paid
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Rs. {Number(enrollment.paymentPaid || 0).toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-2">Batch Assignment</p>
                        {!batches[courseId] && (
                          <button
                            type="button"
                            onClick={() => handleLoadBatches(courseId)}
                            disabled={isLoadingBatches}
                            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white px-3 py-2 rounded-md text-xs font-medium transition"
                          >
                            {isLoadingBatches ? "Loading batches..." : "Load Available Batches"}
                          </button>
                        )}

                        {batches[courseId] && (
                          <>
                            <select
                              value={selectedBatch[enrollment._id] || ""}
                              onChange={e => handleBatchChange(enrollment._id, e.target.value)}
                              disabled={isApproving}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                            >
                              <option value="">-- Select Batch --</option>
                              {courseBatches.map(batch => (
                                <option key={batch._id} value={batch._id}>
                                  {batch.batchname}
                                </option>
                              ))}
                            </select>

                            {courseBatches.length === 0 && (
                              <p className="text-xs text-red-500 mt-2">
                                No active batches available for this course.
                              </p>
                            )}

                            {courseBatches.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleApproveEnrollment(enrollment)}
                                disabled={isApproving || !selectedBatch[enrollment._id]}
                                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-2 rounded-md text-xs font-medium transition"
                              >
                                {isApproving ? "Approving..." : "Approve Enrollment"}
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">User Details</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">User ID</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : viewdata.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-gray-400">
                      No users found for this filter. Click "All" or filter buttons above.
                    </td>
                  </tr>
                ) : (
                  viewdata.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{user.fullname}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                          <select
                            value={user.role}
                            onChange={e => handleRoleChange(user._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded-lg px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          >
                            <option value="student">Student</option>
                            <option value="instructor">Instructor</option>
                            <option value="admin">Admin</option>
                            <option value="guest">Guest</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-4 px-6 font-mono text-xs text-gray-400">{user._id}</td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2">
                          {/* View click garda user details modal open huncha */}
                          <button
                            onClick={() => handleViewUser(user._id)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* selectedUser bhaye matra yo profile details popup dekhincha */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
              {/* X click garda modal close huncha */}
              <button
                onClick={handleCloseUserDetails}
                className="text-xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{selectedUser.fullname}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{selectedUser.email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{selectedUser.phone || "Not provided"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Batches Assigned</p>
                {selectedUser.batches?.length > 0 ? (
                  <div className="mt-1 space-y-1">
                    {selectedUser.batches.map((batch, index) => (
                      <p key={index} className="font-medium text-gray-900">
                        {batch.batch || "Not assigned"}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="font-medium text-gray-900">Not assigned</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseUserDetails}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;