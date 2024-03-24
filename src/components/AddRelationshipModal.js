import React, { useState } from "react";

function AddRelationshipModal({ onClose, onSave, relationshipChoices }) {
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedMember] = useState("");

  const handleSave = async () => {
    try {
      // Check if selectedMember and selectedRelationship are defined
      if (!selectedMember || !selectedRelationship) {
        throw new Error("Selected member or relationship is undefined");
      }

      // Call the onSave function passed from the parent component
      onSave(selectedMember, selectedRelationship);
      onClose();
    } catch (error) {
      console.error("Error adding relationship:", error);
      // Optionally, you can display an error message to the user
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Add Relationship</h2>
        <select
          value={selectedRelationship}
          onChange={(e) => setSelectedRelationship(e.target.value)}
        >
          <option value="">Select Relationship</option>
          {relationshipChoices.map((relationship) => (
            <option key={relationship} value={relationship}>
              {relationship}
            </option>
          ))}
        </select>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}

export default AddRelationshipModal;
