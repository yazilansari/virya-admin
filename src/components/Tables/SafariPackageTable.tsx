"use client";
import React, { useState } from "react";
import DataTable from "react-data-table-component";

// Sample data
const data = [
  { id: 1, name: "John Doe", age: 28, email: "john@example.com" },
  { id: 2, name: "Jane Smith", age: 34, email: "jane@example.com" },
  { id: 3, name: "Sam Green", age: 22, email: "sam@example.com" },
  { id: 4, name: "Alex Brown", age: 25, email: "alex@example.com" },
];

const DataTablePage = () => {
  const [filterText, setFilterText] = useState(""); // State for search input
  const [filteredData, setFilteredData] = useState(data); // State for filtered data

  // Handlers for actions
  const handleView = (row) => {
    alert(`Viewing details of ${row.name}`);
  };

  const handleEdit = (row) => {
    alert(`Editing details of ${row.name}`);
  };

  const handleDelete = (row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      setFilteredData((prevData) => prevData.filter((item) => item.id !== row.id));
    }
  };

  // Handle search input change
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);

    // Filter data based on the input text
    const filtered = data.filter(
      (row) =>
        row.name.toLowerCase().includes(value) ||
        row.age.toString().includes(value) ||
        row.email.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  // Define columns for the table
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Age",
      selector: (row) => row.age,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="inline-flex items-center justify-center rounded-full bg-black px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90"
            onClick={() => handleView(row)} // Inline function to call handleView
          >
            View
          </button>

          <button
            className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90"
            onClick={() => handleEdit(row)} // Inline function to call handleEdit
          >
            Edit
          </button>

          <button
            className="inline-flex items-center justify-center rounded-full bg-red px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90"
            onClick={() => handleDelete(row)} // Inline function to call handleDelete
          >
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true, // Prevent triggering row click event
    },
  ];

  return (
    <>
      {/* Search Input */}
      <div className="w-full xl:w-1/2">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={handleSearch}
          className="w-50 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
      </div>

      {/* Data Table */}
      <div className="max-w-full overflow-x-auto">
        <div className="w-full table-auto">
          <DataTable
            title="Safari Package Information"
            columns={columns}
            data={filteredData}
            pagination
            paginationRowsPerPageOptions={[10, 30, 50, 100, 500]}
            highlightOnHover
            striped
          />
        </div>
      </div>
    </>
  );
};

export default DataTablePage;
