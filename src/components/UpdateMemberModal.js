import React, { useState, useEffect } from "react";

function UpdateMemberModal({ member, onClose, onUpdateMember }) {
  const [name, setName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [isAlive, setIsAlive] = useState(true);
  const [dateOfDeath, setDateOfDeath] = useState(null);
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [occupation, setOccupation] = useState("");
  const [biographicalInformation, setBiographicalInformation] = useState("");

  useEffect(() => {
    if (member) {
      setName(member.name || "");
      setDateOfBirth(member.date_of_birth || "");
      setGender(member.gender || "");
      setIsAlive(member.is_alive || true);
      setDateOfDeath(member.date_of_death || null);
      setPlaceOfBirth(member.place_of_birth || "");
      setOccupation(member.occupation || "");
      setBiographicalInformation(member.biographical_information || "");
    }
  }, [member]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/family-members/${member.id}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name,
            date_of_birth: dateOfBirth,
            gender,
            is_alive: isAlive,
            date_of_death: dateOfDeath,
            place_of_birth: placeOfBirth,
            occupation,
            biographical_information: biographicalInformation,
          }),
        }
      );
      if (response.ok) {
        const updatedMember = await response.json(); // Get the updated member data
        onUpdateMember(updatedMember); // Pass the updated member data to the onUpdateMember function
        onClose();
      } else {
        throw new Error("Error updating family member");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal">
      <h2>Update Family Member</h2>
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
      <button onClick={handleUpdate}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default UpdateMemberModal;
