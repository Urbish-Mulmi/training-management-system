import React, { useState } from 'react';

export default function StudentRoster({ students = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = students.filter(student => 
    student.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3 shadow-sm">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-800 text-sm">
          Enrolled Students ({students.length})
        </p>
        {students.length > 5 && (
          <input 
            type="text"
            placeholder="Search student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        )}
      </div>

      {students.length > 0 ? (
        <div className="max-h-48 overflow-y-auto pr-2 space-y-1 divide-y divide-gray-100">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student._id || student.email} className="pt-2 pb-1 text-sm text-gray-600 flex justify-between items-center">
                <span className="font-medium text-gray-800">{student.fullname}</span>
                <span className="text-xs text-gray-500">{student.email}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 italic py-2">No matching students found.</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">No students enrolled yet.</p>
      )}
    </div>
  );
}