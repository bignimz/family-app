import React, { useState, useEffect } from "react";
import AddMemberModal from "./AddMemberModal";
import UpdateMemberModal from "./UpdateMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";

function FlashMessage({ message, duration = 3000, onTimeout }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onTimeout();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onTimeout]);

  return visible ? <div className="flash-message">{message}</div> : null;
}

function FamilyTree() {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/family-members"
        );
        if (response.ok) {
          const data = await response.json();
          setFamilyMembers(data);
        } else {
          throw new Error("Failed to fetch family members");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchFamilyMembers();
  }, []);

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedMember(null);
  };

  const handleAddRootMember = () => {
    // Logic to add a root member
    setIsAddModalOpen(true);
  };

  const handleAddChild = () => {
    setIsAddModalOpen(true);
    setIsModalOpen(false);
  };

  const handleUpdateMember = () => {
    setIsUpdateModalOpen(true);
    setIsModalOpen(false);
  };

  const handleDeleteMember = () => {
    setIsDeleteModalOpen(true);
    setIsModalOpen(false);
  };

  const confirmDeleteMember = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/family-members/${selectedMember.id}/delete/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const updatedFamilyMembers = familyMembers.filter(
          (member) => member.id !== selectedMember.id
        );
        setFamilyMembers(updatedFamilyMembers);
        setFlashMessage("Member deleted successfully");
        handleCloseModal();
      } else {
        throw new Error("Failed to delete family member");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddMember = async (newMember) => {
    // Update the family members list with the newly added member
    setFamilyMembers([...familyMembers, newMember]);
    setFlashMessage("Member added successfully");
    setIsModalOpen(false);
  };

  const handleUpdateMemberDetails = async (updatedMember) => {
    // Update the family members list with the updated member
    const updatedFamilyMembers = familyMembers.map((member) =>
      member.id === updatedMember.id ? updatedMember : member
    );
    setFamilyMembers(updatedFamilyMembers);
    setFlashMessage("Member updated successfully");
    setIsModalOpen(false);
  };

  return (
    <div className="family-tree-wrapper">
      {flashMessage && <div className="flash-message">{flashMessage}</div>}
      {familyMembers.length === 0 && (
        <button onClick={handleAddRootMember}>Add Root Member</button>
      )}
      {familyMembers.map((member) => (
        <div
          className="member"
          key={member.id}
          onClick={() => handleMemberClick(member)}
        >
          <h3>{member.name}</h3>
          <p>Date of Birth: {member.date_of_birth}</p>
          <p>Gender: {member.gender}</p>
        </div>
      ))}
      {isModalOpen && selectedMember && (
        <div className="modal">
          <h2>Actions for {selectedMember.name}</h2>
          <button onClick={handleAddChild}>Add Member</button>
          <button onClick={handleUpdateMember}>Update Member</button>
          <button onClick={handleDeleteMember}>Delete Member</button>
          <button onClick={handleCloseModal}>Close</button>
        </div>
      )}
      {isAddModalOpen && (
        <AddMemberModal
          parentMemberId={selectedMember ? selectedMember.id : null}
          onClose={handleCloseModal}
          onSubmit={handleAddMember}
          setFamilyMembers={setFamilyMembers}
        />
      )}
      {isUpdateModalOpen && (
        <UpdateMemberModal
          member={selectedMember}
          onClose={handleCloseModal}
          onUpdateMember={handleUpdateMemberDetails}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteMemberModal
          member={selectedMember}
          onClose={handleCloseModal}
          onDeleteMember={confirmDeleteMember}
        />
      )}
    </div>
  );
}

export default FamilyTree;
