import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getIdToken } from "firebase/auth";

const AdminPage = () => {
  const { currentUser } = useAuth();
  const [adminData, setAdminData] = useState(null);

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

  return (
    <div>
      <h1>Admin Page</h1>
      {adminData ? (
        <pre>{JSON.stringify(adminData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminPage;
