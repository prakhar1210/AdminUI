import React, { useState, useEffect } from "react";
import SearchBar from "./Search";
import axios from "axios";
import "./Table.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import EditRow from "./EditRow";
import { sortItemsPerPage } from "../controller.js/controller";
const Table = () => {
  const [data, setData] = useState([]); // local copy
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // New state for total pages
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectRowEdit, setSelectRowEdit] = useState({});
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectAllOnPage, setSelectAllOnPage] = useState(false);
  const itemsPerPage = 10;

  // Stores data for that page
  const [dataPerPage, setDataPerPage] = useState("");

  useEffect(() => {
    // console.log(selectedRows);
  }, [selectedRows]);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        setData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(totalPages);
    sortItemsPerPage(setDataPerPage, filteredData, itemsPerPage);
    setCurrentPage(1);
  }, [filteredData]);

  const handleSearch = (query) => {
    if (query.trim() === "") {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.email.toLowerCase().includes(query.toLowerCase()) ||
          item.role.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    }
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(totalPages);
    setCurrentPage(1);
    setSelectedRows([]);
  };

  // ... Existing event handlers and rendering logic ...

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleData = filteredData.slice(startIndex, endIndex);
  // console.log(visibleData);

  const handleSelectAllOnPageChange = () => {
    if (selectAllOnPage) {
      // If all items on the page are selected, unselect all of them
      setSelectedRows([]);
    } else {
      // If not all items on the page are selected, select all of them
      const itemsOnPage = visibleData.map((item) => item.id);
      setSelectedRows(itemsOnPage);
    }
    // Toggle the selectAllOnPage state
    setSelectAllOnPage(!selectAllOnPage);
  };

  const handleRowSelect = (itemId) => {
    if (selectedRows.includes(itemId)) {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((id) => id !== itemId)
      );
    } else {
      setSelectedRows((prevSelected) => [...prevSelected, itemId]);
    }
  };

  const handleDeleteSelected = () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRows.length} selected item(s)?`
    );
    if (confirmDelete) {
      setFilteredData((prevData) =>
        prevData.filter((item) => !selectedRows.includes(item.id))
      );
      setSelectedRows([]);
    }
  };

  const handleDelete = (itemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmDelete) {
      setFilteredData((prevData) =>
        prevData.filter((item) => item.id !== itemId)
      );
    }
  };

  const setEditingItemId = (item) => {
    setOpenEditModal(true);
    setSelectRowEdit(item);
  };

  return (
    <div>
      {openEditModal ? (
        <EditRow
          selectedItem={selectRowEdit}
          setOpenEditModal={setOpenEditModal}
          openEditModal={openEditModal}
          data={data}
          setData={setData}
        />
      ) : (
        ""
      )}

      <div className="totalItems">Total Items: {filteredData.length}</div>
      <SearchBar onSearch={handleSearch} />
      {error ? (
        <p>An error occurred: {error.message}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                Select{" "}
                <input
                  type="checkbox"
                  checked={selectAllOnPage}
                  onChange={handleSelectAllOnPageChange}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((item) => (
              <tr
                key={item.id}
                className={selectedRows.includes(item.id) ? "selected" : ""}
              >
                <td style={{ paddingLeft: "2rem" }}>
                  {visibleData.includes(item.id)}
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={() => handleRowSelect(item.id)}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>
                  <i
                    className="bi bi-pencil-square"
                    style={{ cursor: "pointer" }}
                    onClick={() => setEditingItemId(item)}
                  ></i>
                  <i
                    className="bi bi-trash"
                    onClick={() => handleDelete(item.id)}
                    style={{ cursor: "pointer" }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="pagination">
        <button
          className="paginationBtn"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          className="paginationBtn"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="paginationBtn"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          className="paginationBtn"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
      <button
        className="deleteBtn"
        onClick={handleDeleteSelected}
        disabled={selectedRows.length === 0}
      >
        Delete Selected
      </button>
    </div>
  );
};

export default Table;
