import React, { useState, useEffect } from "react";

function FamilyTree() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch family members data from the API
    const fetchFamilyMembers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/family-members",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setFamilyMembers(data);
        } else {
          setError("Failed to fetch family members");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch family members. Please try again later.");
      }
    };

    fetchFamilyMembers();
  }, []);

  return (
    <div className="family-tree-wrapper">
      <h2 className="family-tree-title">Khalid's Family Tree</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {familyMembers.map((member) => (
          <li key={member.id}>
            {member.name} - {member.relationship}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FamilyTree;
