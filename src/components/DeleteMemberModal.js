import React from "react";

function DeleteMemberModal({ member, onClose, onDeleteMember }) {
  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/family-members/${member.id}/delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        onDeleteMember();
        onClose();
      } else {
        throw new Error("Error deleting family member");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="modal">
      <h2>Delete Family Member</h2>
      <p>Are you sure you want to delete {member.name}?</p>
      <button onClick={handleDelete}>Delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default DeleteMemberModal;
