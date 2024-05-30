import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { getIdToken } from "firebase/auth";
import SignOut from "./SignOut";
import "./dashboard.css";

const Dashboard = () => {
  const { currentUser, role } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);

          //currentUser.uid is a string
          console.log(currentUser.uid);
          //http:localhost:5245/get/videometa
          //http://apigateway/get/videometa
          const response = await fetch("http://localhost:5245/get/videometa", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "X-User-Role": role,
            },
          });

          const contentType = response.headers.get("content-type");
          console.log("Response Content-Type:", contentType);
          const responseText = await response.text();
          console.log("Response Text:", responseText);

          if (!response.ok) {
            throw new Error(
              `HTTP error status: ${response.status}, body: ${responseText}`
            );
          }

          if (!contentType || !contentType.includes("application/json")) {
            console.error("Expected JSON but got:", responseText);
            throw new TypeError("Expected JSON but got non-JSON response");
          }

          const data = JSON.parse(responseText);
          console.log("Fetched data:", data);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [currentUser, role]);

  const handleAdminNavigation = () => {
    navigate("/admin"); // Navigate to the Admin page
  };

  return (
    <div className="dashboard-container">
      <SignOut />
      <h1>Dashboard</h1>
      {userData ? (
        <div>
          {role === "Admin" && ( // Conditionally render the Admin Page button
            <button onClick={handleAdminNavigation}>Go to Admin Page</button>
          )}
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
