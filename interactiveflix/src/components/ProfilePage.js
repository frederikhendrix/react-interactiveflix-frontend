import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { deleteUser, getIdToken } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./profilepage.css";

const ProfilePage = () => {
  const { currentUser, role } = useAuth();
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        await deleteUser(currentUser);
        navigate("/");
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  useEffect(() => {
    const fetchMovieNames = async (reviews) => {
      try {
        const token = await getIdToken(currentUser);
        const movieDataPromises = reviews.map(async (review) => {
          const response = await fetch(
            `http://57.153.128.195/videometa/${review.movieId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-User-Role": role,
              },
            }
          );

          if (response.ok) {
            const movieData = await response.json();
            return { ...review, movieName: movieData.title };
          } else {
            throw new Error(
              `Error fetching movie data for movieId ${review.movieId}`
            );
          }
        });

        const reviewsWithMovieNames = await Promise.all(movieDataPromises);
        setReviews(reviewsWithMovieNames);
      } catch (error) {
        console.error("Error fetching movie names:", error);
      }
    };

    const fetchReviews = async () => {
      if (currentUser) {
        try {
          const userId = currentUser.uid;
          const token = await getIdToken(currentUser);
          const response = await fetch(
            `http://57.153.128.195/get/reviews/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "X-User-Role": role,
              },
            }
          );

          if (response.ok) {
            const reviews = await response.json();
            await fetchMovieNames(reviews);
          } else {
            throw new Error(`Error fetching reviews for userId ${userId}`);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      }
    };

    fetchReviews();
  }, [currentUser, role]);

  const handleNavigateBack = () => {
    navigate(`/dashboard`);
  };

  return (
    <div className="profile-container">
      <div className="back-button-navbar" onClick={handleNavigateBack}>
        Back
      </div>
      <div className="profile-header">
        <h1>Profile Information</h1>
      </div>
      <div className="profile-details">
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <p>
          <strong>UID:</strong> {currentUser.uid}
        </p>
        <div className="text-form">Reviews</div>
        {reviews.map((review) => (
          <div className="review-wrap" key={review.reviewId}>
            <p>Movie Name: {review.movieName}</p>
            <p>Review: {review.text}</p>

            <p>Score: {review.score}</p>
          </div>
        ))}
      </div>
      <button className="delete-profile-button" onClick={handleDeleteProfile}>
        Delete Profile
      </button>
    </div>
  );
};

export default ProfilePage;
