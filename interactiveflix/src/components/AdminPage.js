import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getIdToken } from "firebase/auth";
import "./adminpage.css";

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [adminData, setAdminData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);
          const response = await fetch("http://localhost:5245/admin-data", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setAdminData(data);
        } catch (error) {
          console.error("Error fetching admin data:", error);
        }
      }
    };

    fetchAdminData();
  }, [currentUser]);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "video/mp4") {
      setSelectedFile(file);
    } else {
      alert("Please select a valid MP4 file.");
    }
  };

  // Handle file upload to Azure Blob Storage
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const token = await getIdToken(currentUser);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5245/upload-video", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("File uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred during file upload.");
    }
  };

  return (
    <div className="adminpage-container">
      {currentUser ? (
        <div className="adminloaded-container">
          <div className="adminpage-title">Admin Page</div>

          {/* Video Upload Section */}
          <div className="addvideo">
            <h2>Upload Video</h2>
            <input type="file" accept="video/mp4" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>

          {/* Additional sections like delete video can be added here */}
          <div className="deletevideo">
            {/* Placeholder for delete video functionality */}
          </div>
        </div>
      ) : (
        <p className="Loading">Loading...</p>
      )}
    </div>
  );
};

export default AdminPage;
