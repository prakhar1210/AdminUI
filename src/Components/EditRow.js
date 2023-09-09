import React, { useState, useEffect } from "react";
import "./EditRow.css";
import { saveItemToTheData } from "../controller.js/controller";

const EditRow = ({
  selectedItem,
  openEditModal,
  setOpenEditModal,
  data,
  setData,
}) => {
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  const saveEditItem = (name, email, role, id) => {
    setOpenEditModal(!openEditModal);
    const updatedData = saveItemToTheData(name, email, role, id, data, setData);
    const dataArray = Object.values(updatedData);
    setData(dataArray);
  };

  const closeEditModal = () => {
    setOpenEditModal(!openEditModal);
  };
  useEffect(() => {
    setName(selectedItem.name);
    setEmail(selectedItem.email);
    setRole(selectedItem.role);
    setId(selectedItem.id);
  }, []);

  return (
    <div className="EditRowContainer">
      <button onClick={(e) => closeEditModal()} className="Cross">
        X
      </button>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <button
        className="SaveButton"
        onClick={(e) => saveEditItem(name, email, role, id)}
      >
        Save
      </button>
    </div>
  );
};

export default EditRow;
