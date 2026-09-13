import React, { useState, useEffect } from 'react';
import { getBatchResources, addResource, deleteResource } from '../../api/resource.service.js';
import toast from 'react-hot-toast';

export default function ResourceSection({ courseId, canManage = false }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formState, setFormState] = useState({
    resourcename: "",
    resourcecategory: "Notes",
    resourcetype: "pdf",
    folderUrl: "",
    file: null
  });

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await getBatchResources(courseId);
      setResources(res.resources || res || []);
    } catch (err) {
      console.error("Failed to fetch resources", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchResources();
  }, [courseId]);

  const handleUpload = async () => {
    const isLinkOrFolder = formState.resourcecategory === "video_folder" || formState.resourcecategory === "video_link";
    
    if (isLinkOrFolder && !formState.folderUrl?.trim()) {
      toast.error("Please provide a valid URL.");
      return;
    }
    if (!isLinkOrFolder && !formState.file) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      toast.loading("Processing resource...");

      const formData = new FormData();
      formData.append("resourcename", formState.resourcename.trim() || (isLinkOrFolder ? "Link Resource" : formState.file?.name));
      formData.append("resourcecategory", formState.resourcecategory);
      formData.append("resourcetype", isLinkOrFolder ? "link" : formState.resourcetype);

      if (isLinkOrFolder) {
        formData.append("folderUrl", formState.folderUrl.trim());
        formData.append("resourceurl", formState.folderUrl.trim());
      } else {
        formData.append("resourcefile", formState.file);
      }

      await addResource(courseId, formData);
      toast.dismiss();
      toast.success("Resource added successfully!");
      
      setFormState({ resourcename: "", resourcecategory: "Notes", resourcetype: "pdf", folderUrl: "", file: null });
      fetchResources();
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    try {
      toast.loading("Deleting...");
      await deleteResource(resourceId);
      toast.dismiss();
      toast.success("Deleted successfully!");
      fetchResources();
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const isLinkCat = formState.resourcecategory === "video_folder" || formState.resourcecategory === "video_link";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800">Course Resources</h3>

      {loading ? (
        <p className="text-sm text-gray-500 italic">Loading resources...</p>
      ) : resources.length > 0 ? (
        <div className="space-y-2 divide-y divide-gray-100">
          {resources.map((res) => {
            const url = res.resourceurl || res.folderUrl || res.fileUrl;
            return (
              <div key={res._id} className="pt-2 flex justify-between items-center text-sm">
                <div>
                  <span className="font-semibold text-gray-800 block">{res.resourcename}</span>
                  <span className="text-xs text-gray-400 uppercase">{res.resourcecategory} • {res.resourcetype || "file"}</span>
                </div>
                <div className="flex items-center gap-3">
                  {url && (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium text-xs">
                      View
                    </a>
                  )}
                  {canManage && (
                    <button onClick={() => handleDelete(res._id)} className="text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs font-medium transition">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No resources available for this course.</p>
      )}

      {/* Upload Form - Rendered only when canManage is true */}
      {canManage && (
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg space-y-3 mt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">Add New Resource</h4>
          
          <input 
            type="text"
            placeholder="Resource Name (Optional)"
            value={formState.resourcename}
            onChange={(e) => setFormState({ ...formState, resourcename: e.target.value })}
            className="w-full text-xs p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-2">
            <select 
              value={formState.resourcecategory}
              onChange={(e) => setFormState({ ...formState, resourcecategory: e.target.value, resourcetype: e.target.value.includes("video") ? "link" : "pdf" })}
              className="text-xs p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Notes">Notes</option>
              <option value="Assignment">Assignment</option>
              <option value="Syllabus">Syllabus</option>
              <option value="video_link">Video Link</option>
              <option value="video_folder">Video Folder</option>
            </select>

            <select 
              value={isLinkCat ? "link" : formState.resourcetype}
              disabled={isLinkCat}
              onChange={(e) => setFormState({ ...formState, resourcetype: e.target.value })}
              className="text-xs p-2 border border-gray-300 rounded-md bg-white disabled:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
            </select>
          </div>

          {isLinkCat ? (
            <input 
              type="url"
              placeholder="https://..."
              value={formState.folderUrl}
              onChange={(e) => setFormState({ ...formState, folderUrl: e.target.value })}
              className="w-full text-xs p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <input 
              type="file"
              onChange={(e) => setFormState({ ...formState, file: e.target.files[0] })}
              className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          )}

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-md transition"
          >
            {uploading ? "Processing..." : "Submit Upload"}
          </button>
        </div>
      )}
    </div>
  );
}