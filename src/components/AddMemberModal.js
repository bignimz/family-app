import React, { useState } from "react";

function AddMemberModal({ parentMemberId, onClose, setFamilyMembers }) {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isAlive, setIsAlive] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [occupation, setOccupation] = useState("");
  const [biographicalInformation, setBiographicalInformation] = useState("");

  const handleSave = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/family-members/add/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name,
            date_of_birth: dateOfBirth,
            gender,
            relationship,
            is_alive: isAlive,
            date_of_death: isAlive ? null : dateOfDeath,
            place_of_birth: placeOfBirth,
            occupation,
            biographical_information: biographicalInformation,
            parent_member_id: parentMemberId,
          }),
        }
      );
      if (response.ok) {
        const updatedResponse = await fetch(
          "http://localhost:8000/api/family-members"
        );
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setFamilyMembers(updatedData);
          onClose();
        } else {
          throw new Error("Failed to fetch updated family members");
        }
      } else {
        throw new Error("Error adding family member");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal">
      <h2>Add Family Member</h2>
      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Date of Birth:</label>
      <input
        type="date"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
      />
      <label>Gender:</label>
      <input
        type="text"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />
      <label>Relationship:</label>
      <select
        value={relationship}
        onChange={(e) => setRelationship(e.target.value)}
      >
        <option value="Child">Child</option>
        <option value="Spouse">Spouse</option>
      </select>
      <label>Is Alive:</label>
      <input
        type="checkbox"
        checked={isAlive}
        onChange={(e) => setIsAlive(e.target.checked)}
      />
      {!isAlive && (
        <>
          <label>Date of Death:</label>
          <input
            type="date"
            value={dateOfDeath}
            onChange={(e) => setDateOfDeath(e.target.value)}
          />
        </>
      )}
      <label>Place of Birth:</label>
      <input
        type="text"
        value={placeOfBirth}
        onChange={(e) => setPlaceOfBirth(e.target.value)}
      />
      <label>Occupation:</label>
      <input
        type="text"
        value={occupation}
        onChange={(e) => setOccupation(e.target.value)}
      />
      <label>Biographical Information:</label>
      <textarea
        value={biographicalInformation}
        onChange={(e) => setBiographicalInformation(e.target.value)}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default AddMemberModal;
