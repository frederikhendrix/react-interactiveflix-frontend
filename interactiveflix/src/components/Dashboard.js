import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getIdToken } from "firebase/auth";

const Dashboard = () => {
  const { currentUser, role } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const token = await getIdToken(currentUser);
          const response = await fetch("http://localhost:5245/get/review", {
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
              `HTTP error! status: ${response.status}, body: ${responseText}`
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

  return (
    <div>
      <h1>Dashboard</h1>
      {userData ? (
        <pre>{JSON.stringify(userData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
