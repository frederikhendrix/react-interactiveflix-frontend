import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { getIdToken } from "firebase/auth";
import SignOut from "./SignOut";
// import CryptoJS from "crypto-js";
import "./dashboard.css";

const Dashboard = () => {
  const { currentUser, role } = useAuth();
  const [videoData, setVideoData] = useState([]);
  const navigate = useNavigate();

  // const key = CryptoJS.enc.Base64.parse("bXlzZWNyZXRrZXkxMjM0NQ==");
  // const iv = CryptoJS.enc.Base64.parse("bXlzZWNyZXRpdjEyMzQ1Ng==");

  // const encrypt = (text) => {
  //   return CryptoJS.AES.encrypt(text, key, { iv: iv }).toString();
  // };

  // const decrypt = (cipherText) => {
  //   const bytes = CryptoJS.AES.decrypt(cipherText, key, { iv: iv });
  //   return bytes.toString(CryptoJS.enc.Utf8);
  // };

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);

          const response = await fetch("http://57.153.128.195/get/videometa", {
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
          fetchVideoUrls(data, token);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    const fetchVideoUrls = async (videos, token) => {
      try {
        const videoPromises = videos.map(async (video) => {
          // const encryptedVideoName = encodeURIComponent(
          //   encrypt(video.videoName)
          // );

          const response = await fetch(
            `http://57.153.128.195/blob/${video.videoName}`,
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
          //const decryptedVideoUrl = decrypt(data.videoUrl);
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

  const handleProfilePageNav = () => {
    navigate("/profile");
  };

  return (
    <div className="dashboard-container">
      <div className="top-navbar-dashboard">
        <SignOut />
        {role === "Admin" && (
          <button onClick={handleAdminNavigation}>Go to Admin Page</button>
        )}
        <button onClick={handleProfilePageNav}>Profile Page</button>
      </div>
      <div className="moviesyoumightlike-button">Movies You Might Like</div>
      <div className="video-list">
        {videoData.map((video) => (
          <div
            className="video-item"
            key={video.id}
            onClick={() => handleVideoClick(video.id, video.videoName)}
          >
            <video width="320" height="240" controlsList="nodownload">
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-title">{video.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
