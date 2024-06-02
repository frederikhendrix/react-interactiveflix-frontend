import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getIdToken } from "firebase/auth";
import "./adminpage.css";

const AdminPage = () => {
  const { currentUser, role } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileURL, setSelectedFileURL] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [retrievedVideos, setRetrievedVideos] = useState([]);
  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    cast: "",
    crew: "",
    keywords: "",
    genres: "",
    rating: 0,
    releaseDate: "",
    director: "",
    viewCount: 0,
    videoName: "",
    blobContainer: "flixblobstorage1",
    videoHeaderName: "",
  });

  useEffect(() => {
    async function Grabvideos() {
      try {
        const token = await getIdToken(currentUser);

        const videosResponse = await fetch(
          "http://localhost:5245/get/videometa",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-User-Role": role,
            },
          }
        );
        const videos = await videosResponse.json();
        console.log("Fetched videos:", videos);
        setRetrievedVideos(videos);
      } catch (error) {
        console.error("Error retrieving videos try catch:", error);
      }
    }
    Grabvideos();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "video/mp4") {
      setSelectedFile(file);
      setSelectedFileURL(URL.createObjectURL(file));
    } else {
      alert("Please select a valid MP4 file.");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const token = await getIdToken(currentUser);
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:5245/blob/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-User-Role": role,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setMetadata((prevMetadata) => ({
          ...prevMetadata,
          videoName: result.blobName, // Use the new blob name
        }));
        setUploadStatus("File uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("An error occurred during file upload.");
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (["cast", "crew", "keywords", "genres"].includes(name)) {
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        [name]: value.split(",").map((item) => item.trim()), // Convert to array and trim whitespace
      }));
    } else {
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = await getIdToken(currentUser);
      const response = await fetch("http://localhost:5245/post/videometa", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-User-Role": role,
        },
        body: JSON.stringify(metadata),
      });

      if (response.ok) {
        const videosResponse = await fetch(
          "http://localhost:5245/get/videometa",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-User-Role": role,
            },
          }
        );
        const videos = await videosResponse.json();
        console.log("Fetched videos:", videos);
        setUploadStatus("Metadata submitted successfully!");
      } else {
        setUploadStatus("Failed to submit metadata.");
      }
    } catch (error) {
      console.error("Error submitting metadata:", error);
      setUploadStatus("An error occurred during metadata submission.");
    }
  };

  const handleDelete = async (videoId, videoName) => {
    try {
      const token = await getIdToken(currentUser);

      // Delete video metadata
      await fetch(`http://localhost:5245/videometa/${videoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-User-Role": role,
        },
      });

      // Delete video blob
      await fetch("http://localhost:5245/blob/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-User-Role": role,
        },
        body: JSON.stringify({
          ContainerName: "flixblobstorage1",
          BlobName: videoName,
        }),
      });

      setUploadStatus("Video deleted successfully!");

      // Refresh the video list
      const videosResponse = await fetch(
        "http://localhost:5245/get/videometa",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-User-Role": role,
          },
        }
      );
      const videos = await videosResponse.json();
      setRetrievedVideos(videos);
    } catch (error) {
      console.error("Error deleting video:", error);
      setUploadStatus("An error occurred during video deletion.");
    }
  };

  return (
    <div className="adminpage-container">
      {currentUser ? (
        <div className="adminloaded-container">
          <div className="adminpage-title">
            Admin Dashboard Upload or Delete Videos
          </div>

          {/* Video Upload Section */}
          <div className="addvideo">
            <div className="adminpage-title">Upload Video</div>
            <label htmlFor="file-upload" className="adminpage-button">
              Choose File
            </label>
            <input
              id="file-upload"
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {selectedFileURL && (
              <div className="video-preview">
                <h3>Video Preview:</h3>
                <video width="640" height="480" controls>
                  <source src={selectedFileURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            <button className="adminpage-button" onClick={handleUpload}>
              Upload
            </button>
            {uploadStatus && <p>{uploadStatus}</p>}
            {/* Metadata Form */}
            <form onSubmit={handleSubmit} className="metadata-form">
              <div className="formMetadata-variable">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={metadata.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formMetadata-variable">
                <label>Description</label>
                <textarea
                  name="description"
                  value={metadata.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formMetadata-variable">
                <label>Cast (comma-separated)</label>
                <input
                  type="text"
                  name="cast"
                  value={metadata.cast}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formMetadata-variable">
                <label>Crew (comma-separated)</label>
                <input
                  type="text"
                  name="crew"
                  value={metadata.crew}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formMetadata-variable">
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  name="keywords"
                  value={metadata.keywords}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formMetadata-variable">
                <label>Genres (comma-separated)</label>
                <input
                  type="text"
                  name="genres"
                  value={metadata.genres}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formMetadata-variable">
                <label>Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={metadata.releaseDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="formMetadata-variable">
                <label>Director</label>
                <input
                  type="text"
                  name="director"
                  value={metadata.director}
                  onChange={handleInputChange}
                />
              </div>
              <div className="formMetadata-variable">
                <label>Video Header Name</label>
                <input
                  type="text"
                  name="videoHeaderName"
                  value={metadata.videoHeaderName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="adminpage-button">
                Submit Metadata
              </button>
            </form>
          </div>

          {/* Additional sections like delete video can be added here */}
          <div className="deletevideo">
            <div className="adminpage-title">Delete Video</div>
            <div className="addvideo">
              {retrievedVideos.map((video) => {
                return (
                  <div className="container-delete-video" key={video.id}>
                    <div className="video-name-cool">
                      {video.videoHeaderName}
                    </div>
                    <div
                      className="deletevideo-button"
                      onClick={() => handleDelete(video.id, video.videoName)}
                    >
                      Delete {video.videoHeaderName}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className="Loading">Loading...</p>
      )}
    </div>
  );
};

export default AdminPage;
