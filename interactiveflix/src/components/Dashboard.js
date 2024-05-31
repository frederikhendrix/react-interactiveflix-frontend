import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { getIdToken } from "firebase/auth";
import SignOut from "./SignOut";
import "./dashboard.css";

const Dashboard = () => {
  const { currentUser, role } = useAuth();
  const [userData, setUserData] = useState([]);
  const [videoData, setVideoData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);
          const response = await fetch("http://localhost:5245/get/videometa", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-User-Role": role,
            },
          });

          if (!response.ok) {
            throw new Error(
              `HTTP error status: ${
                response.status
              }, body: ${await response.text()}`
            );
          }

          const data = await response.json();
          setUserData(data);
          fetchVideoUrls(data, token);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const fetchVideoUrls = async (videos, token) => {
      try {
        const videoPromises = videos.map(async (video) => {
          const response = await fetch(
            `http://localhost:5245/blob/${encodeURIComponent(video.videoName)}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-User-Role": role,
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `HTTP error status: ${
                response.status
              }, body: ${await response.text()}`
            );
          }
          const data = await response.json();
          return { ...video, videoUrl: data.videoUrl };
        });

        const videosWithUrls = await Promise.all(videoPromises);
        setVideoData(videosWithUrls);
      } catch (error) {
        console.error("Error fetching video URLs:", error);
      }
    };

    fetchUserData();
  }, [currentUser, role]);

  const handleAdminNavigation = () => {
    navigate("/admin");
  };

  const handleVideoClick = (id, videoName) => {
    navigate(`/video/${id}/${videoName}`);
  };

  return (
    <div className="dashboard-container">
      <div className="top-navbar-dashboard">
        <SignOut />
        <div>
          {role === "Admin" && (
            <button
              className="gotoadmin-button"
              onClick={handleAdminNavigation}
            >
              Go to Admin Page
            </button>
          )}
        </div>
      </div>
      <div className="moviesyoumightlike-button">Movies You Might Like</div>
      <div className="video-list">
        {videoData.map((video) => (
          <div
            className="video-item"
            key={video.id}
            onClick={() => handleVideoClick(video.id, video.videoName)}
          >
            <video
              width="320"
              height="240"
              controlsList="nodownload noremoteplayback"
              className="non-interactive"
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-title non-interactive">{video.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
