import { useState, useEffect, useCallback } from "react";
import { getInstructorBatches } from "../../api/batch.service";
import { 
  getBatchResources, 
  addResource, 
  deleteResource, 
  toggleResourceVisibility 
} from "../../api/resource.service";
import toast from "react-hot-toast";

export default function InstructorCourseManagement() {
  const [batches, setBatches] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("resources");
  const [loading, setLoading] = useState(false);

  // Active Batch Sub-States
  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editedDesc, setEditedDesc] = useState("");

  const activeBatch = batches.find((b) => b._id === expandedId);
  const activeCourse = activeBatch?.course || {};

  // Fetch initial batch list
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getInstructorBatches();
        setBatches(res.batches || res || []);
      } catch (err) {
        toast.error("Failed to load batches.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch resources using batch ID
  const fetchResources = useCallback(async (batchId) => {
    if (!batchId) return;
    setResourcesLoading(true);
    try {
      const res = await getBatchResources(batchId);
      setResources(res.resources || res || []);
    } catch {
      setResources([]);
    } finally {
      setResourcesLoading(false);
    }
  }, []);

  // Toggle Accordion & Reset UI States
  const handleToggleBatch = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setActiveSubTab("resources");
    setIsEditingDesc(false);

    const target = batches.find((b) => b._id === id);
    if (target) {
      setEditedDesc(target.course?.coursedescription || "");
      fetchResources(id);
    }
  };

  // Add Resource Handler
  const handleCreateResource = async (formDataPayload) => {
    if (!expandedId) return;
    try {
      await addResource(expandedId, formDataPayload);
      toast.success("Resource created successfully");
      setShowResourceModal(false);
      fetchResources(expandedId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create resource");
    }
  };

  // Toggle Visibility Handler
  const handleToggleVisibility = async (resourceId) => {
    try {
      const res = await toggleResourceVisibility(resourceId);
      toast.success(res.message || "Visibility updated");
      fetchResources(expandedId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update visibility");
    }
  };

  // Delete Resource Handler
  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      await deleteResource(resourceId);
      toast.success("Resource deleted");
      fetchResources(expandedId);
    } catch (err) {
      toast.error("Failed to delete resource");
    }
  };

  if (loading && !batches.length) {
    return <div className="p-12 text-center text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Assigned Courses & Batches</h1>
        <p className="text-sm text-gray-500">Manage resources, view students, and update course information.</p>
      </div>

      <div className="space-y-4">
        {batches.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-400">
            No assigned batches found.
          </div>
        ) : (
          batches.map((batch) => {
            const isExpanded = expandedId === batch._id;
            const course = batch.course || {};
            const students = batch.students || [];

            return (
              <div
                key={batch._id}
                className={`bg-white border rounded-2xl shadow-sm transition-all overflow-hidden ${
                  isExpanded ? "border-indigo-500 ring-2 ring-indigo-500/10" : "border-gray-200"
                }`}
              >
                {/* Header Toggle */}
                <div
                  onClick={() => handleToggleBatch(batch._id)}
                  className="p-6 cursor-pointer flex justify-between items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                        {batch.batchname}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                        {batch.status || "Active"}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{course.coursename || "Unnamed Course"}</h2>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-gray-500 font-medium">{students.length} Students</span>
                    <span className="text-gray-400 text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded Management View */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50/50 p-6 space-y-4">
                    {/* Sub-tab Navigation */}
                    <div className="flex justify-between items-center bg-white p-1.5 rounded-xl border border-gray-200">
                      <div className="flex gap-1">
                        {["resources", "students", "settings"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveSubTab(tab)}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                              activeSubTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      {activeSubTab === "resources" && (
                        <button
                          onClick={() => setShowResourceModal(true)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                        >
                          + Add Resource
                        </button>
                      )}
                    </div>

                    {/* Sub-tab Contents */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      {activeSubTab === "resources" && (
                        <ResourcesTab
                          loading={resourcesLoading}
                          resources={resources}
                          onToggleVisibility={handleToggleVisibility}
                          onDelete={handleDeleteResource}
                        />
                      )}
                      {activeSubTab === "students" && <StudentsTab students={students} />}
                      {activeSubTab === "settings" && (
                        <SettingsTab
                          course={course}
                          isEditing={isEditingDesc}
                          setIsEditing={setIsEditingDesc}
                          editedDesc={editedDesc}
                          setEditedDesc={setEditedDesc}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {showResourceModal && (
        <ResourceModal onClose={() => setShowResourceModal(false)} onSubmit={handleCreateResource} />
      )}
    </div>
  );
}

/* --- Sub-Components --- */

function ResourcesTab({ loading, resources, onToggleVisibility, onDelete }) {
  if (loading) return <p className="text-xs text-gray-400 text-center py-6">Loading resources...</p>;
  if (!resources.length) return <p className="text-xs text-gray-400 text-center py-6">No resources found.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {resources.map((res) => (
        <div key={res._id} className="border rounded-xl p-4 flex justify-between items-center bg-gray-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-xs">{res.resourcename}</h4>
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium uppercase">
                {res.resourcetype}
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded font-medium">
                {res.resourcecategory}
              </span>
            </div>
            {res.resourceurl && (
              <a
                href={res.resourceurl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline block truncate max-w-xs"
              >
                View Resource &rarr;
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleVisibility(res._id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors ${
                res.isvisible
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                  : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
              }`}
            >
              {res.isvisible ? "Visible" : "Hidden"}
            </button>
            <button
              onClick={() => onDelete(res._id)}
              className="text-xs text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StudentsTab({ students }) {
  if (!students.length) return <p className="text-xs text-gray-400 text-center py-6">No enrolled students.</p>;

  return (
    <div className="divide-y divide-gray-100 text-xs">
      {students.map((student, i) => (
        <div key={student._id || i} className="py-2.5 flex justify-between items-center">
          <span className="font-medium text-gray-800">{student.fullname || student.name}</span>
          <span className="text-gray-500">{student.email}</span>
        </div>
      ))}
    </div>
  );
}

function SettingsTab({ course, isEditing, setIsEditing, editedDesc, setEditedDesc }) {
  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Edit request submitted for admin approval.");
    setIsEditing(false);
  };

  return (
    <div className="space-y-3 text-xs">
      <div className="font-semibold text-gray-900 text-sm">{course.coursename}</div>
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-2">
          <textarea
            rows="3"
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="w-full border rounded-lg p-2.5 outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 text-gray-600">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded-lg">
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="flex justify-between items-start gap-4">
          <p className="text-gray-600">{course.coursedescription || "No description available."}</p>
          <button onClick={() => setIsEditing(true)} className="text-indigo-600 font-semibold whitespace-nowrap">
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

// Modal Component with Validation & Full Form Controls
function ResourceModal({ onClose, onSubmit }) {
  const [sourceMode, setSourceMode] = useState("file"); // "file" | "link"
  const [resourcename, setResourcename] = useState("");
  const [resourcecategory, setResourcecategory] = useState("Notes");
  const [resourcetype, setResourcetype] = useState("pdf");
  const [resourceurl, setResourceurl] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Helper validation matching backend rules
  const isValidLinkDomain = (url) => {
    try {
      const host = new URL(url).hostname.toLowerCase();
      const isYouTube = host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be";
      const isDrive = host === "drive.google.com" || host.endsWith(".google.com");
      return isYouTube || isDrive;
    } catch {
      return false;
    }
  };

  const handleModeChange = (mode) => {
    setSourceMode(mode);
    if (mode === "file") {
      setResourcecategory("Notes");
      setResourcetype("pdf");
      setResourceurl("");
    } else {
      setResourcecategory("video_link");
      setResourcetype("link");
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      toast.error("Direct video file uploads are not permitted. Please attach a YouTube or Drive link instead.");
      e.target.value = "";
      setFile(null);
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sourceMode === "file" && !file) {
      toast.error("Please choose a file to upload.");
      return;
    }

    if (sourceMode === "link") {
      if (!resourceurl.trim()) {
        toast.error("Please enter a link URL.");
        return;
      }
      if (!isValidLinkDomain(resourceurl)) {
        toast.error("Only official YouTube and Google Drive/Docs links are allowed.");
        return;
      }
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("resourcename", resourcename);
    formData.append("resourcecategory", resourcecategory);
    formData.append("resourcetype", resourcetype);

    if (sourceMode === "file" && file) {
      formData.append("document", file);
    } else if (sourceMode === "link" && resourceurl) {
      formData.append("resourceurl", resourceurl);
    }

    await onSubmit(formData);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="font-bold text-gray-900 text-sm">Add New Resource</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">
            ✕
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => handleModeChange("file")}
            className={`py-2 rounded-lg transition-all ${
              sourceMode === "file" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📄 Upload Document
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("link")}
            className={`py-2 rounded-lg transition-all ${
              sourceMode === "link" ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🔗 External Link / Video
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Resource Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Resource Name *</label>
            <input
              required
              placeholder={sourceMode === "file" ? "e.g. Chapter 1 Lecture Notes" : "e.g. Tutorial Video Link"}
              value={resourcename}
              onChange={(e) => setResourcename(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Resource Category *</label>
            <select
              value={resourcecategory}
              onChange={(e) => setResourcecategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white"
            >
              <option value="Notes">Notes</option>
              <option value="Syllabus">Syllabus</option>
              <option value="video_folder">video_folder</option>
              <option value="video_link">video_link</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Type Selection */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Resource Type *</label>
            {sourceMode === "file" ? (
              <select
                value={resourcetype}
                onChange={(e) => setResourcetype(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:border-indigo-500 bg-white"
              >
                <option value="pdf">PDF</option>
                <option value="doc">Document (DOC/DOCX)</option>
                <option value="ppt">Presentation (PPT)</option>
                <option value="xls">Spreadsheet (XLS)</option>
                <option value="zip">Archive (ZIP)</option>
              </select>
            ) : (
              <input
                disabled
                value="link"
                className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-gray-500 capitalize"
              />
            )}
          </div>

          {/* File Input or Link Input */}
          {sourceMode === "file" ? (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Document File *</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full text-gray-600 border border-gray-300 p-2 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          ) : (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">URL Link *</label>
              <input
                type="url"
                required
                placeholder="https://youtube.com/... or https://drive.google.com/..."
                value={resourceurl}
                onChange={(e) => setResourceurl(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Adding..." : "Add Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}