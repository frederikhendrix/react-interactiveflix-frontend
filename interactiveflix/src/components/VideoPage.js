import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIdToken } from "firebase/auth";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

import "./videopage.css";

const VideoPage = () => {
  const { id } = useParams();
  const { currentUser, role } = useAuth();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoData = async () => {
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);
          const response = await fetch(`http://localhost:5245/blob/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-User-Role": role,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
          }

          const data = await response.json();
          setVideoUrl(data.videoUrl);
          setVideoTitle(data.title); // Assuming the title is also returned
        } catch (error) {
          console.error("Error fetching video data:", error);
        }
      }
    };

    fetchVideoData();
  }, [currentUser, id, role]);

  const handleNavigateBack = () => {
    navigate(`/dashboard`);
  };

  return (
    <div className="video-page-container">
      <div className="back-button-navbar" onClick={handleNavigateBack}>
        Back
      </div>
      {videoUrl ? (
        <div className="video-container">
          <video className="videostyling" controls controlsList="nodownload">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="reviews-container">
            <div className="review-wrap">ReviewNumber1</div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VideoPage;
