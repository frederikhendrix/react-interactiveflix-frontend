import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIdToken } from "firebase/auth";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

import "./videopage.css";

const VideoPage = () => {
  const { id, videoName } = useParams();
  const { currentUser, role } = useAuth();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewScore, setReviewScore] = useState(0);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const fetchReviews = async () => {
    if (currentUser) {
      try {
        const token = await getIdToken(currentUser);
        const response = await fetch(`http://localhost:5245/get/review/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-User-Role": role,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
  };

  useEffect(() => {
    const fetchVideoData = async () => {
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);
          const response = await fetch(
            `http://localhost:5245/blob/${videoName}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-User-Role": role,
              },
            }
          );

          if (!response.ok) {
            navigate("/dashboard");
            throw new Error(`HTTP error status: ${response.status}`);
          }

          const data = await response.json();
          setVideoUrl(data.videoUrl);
          setVideoTitle(data.title);
        } catch (error) {
          console.error("Error fetching video data:", error);
        }
      }
    };

    fetchVideoData();
    fetchReviews();
  }, [currentUser, id, videoName, role]);

  const handleNavigateBack = () => {
    navigate(`/dashboard`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getIdToken(currentUser);
      const response = await fetch(`http://localhost:5245/post/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-User-Role": role,
        },
        body: JSON.stringify({
          UserId: currentUser.uid,
          MovieId: id,
          Text: reviewText,
          Score: reviewScore,
          IsVisible: true,
          ReviewedById: id,
        }),
      });

      if (response.ok) {
        setReviewText("");
        setReviewScore(0);
        const newReview = await response.json();
        setReviews([...reviews, newReview]);
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const token = await getIdToken(currentUser);
      const response = await fetch(
        `http://localhost:5245/get/review/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-User-Role": role,
          },
        }
      );

      if (response.ok) {
        await fetchReviews(); // This line refetches the reviews and triggers a rerender
      } else {
        console.error("Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
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
            <div className="text-form">Reviews</div>
            {reviews.map((review) => (
              <div className="review-wrap" key={review.reviewId}>
                <p>{review.text}</p>
                <p>Score: {review.score}</p>
                {role === "Admin" && (
                  <button
                    className="submit-button-review"
                    onClick={() => handleDeleteReview(review.reviewId)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <div className="review-form">
              <div className="text-form">Leave a Review</div>
              <form className="form-review" onSubmit={handleReviewSubmit}>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here"
                  required
                />
                <input
                  type="number"
                  value={reviewScore}
                  onChange={(e) => setReviewScore(parseInt(e.target.value))}
                  placeholder="Score"
                  min="0"
                  max="10"
                  required
                />
                <button className="submit-button-review" type="submit">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default VideoPage;
