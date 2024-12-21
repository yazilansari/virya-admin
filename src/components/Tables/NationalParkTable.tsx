"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

// Sample data
// const data = [
//   { id: 1, name: "John Doe", age: 28, email: "john@example.com" },
//   { id: 2, name: "Jane Smith", age: 34, email: "jane@example.com" },
//   { id: 3, name: "Sam Green", age: 22, email: "sam@example.com" },
//   { id: 4, name: "Alex Brown", age: 25, email: "alex@example.com" },
// ];
const Modal = ({ isOpen, onClose, data }) => {
  console.log('000', data);
  const [nationalPark, setNationalPark] = useState({
    id: '',
    name: '',
    location: '',
    description: '',
    image: '',
    month: '',
    river: '',
    season: '',
    state: '',
  });

  useEffect(() => {
    if (data) {
      setNationalPark({
        id: data.id || '',
        name: data.name || '',
        location: data.location || '',
        description: data.description || '',
        image: data.image || '',
        month: data.month || '',
        river: data.river || '',
        season: data.season || '',
        state: data.state || '',
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setNationalPark({
        ...nationalPark,
        [name]: value,
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'nationalParks');
  
    try {
      // Send the file to the backend API route
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.imageUrl) {
        // Update the accommodation with the local image URL
        setNationalPark((prev) => ({
         ...prev,
          image: data.imageUrl,
        }));
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  
  const submitNationalPark = async (nationalPark) => {
    const response = await fetch(`/api/nationalPark/${nationalPark.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nationalPark),
    });

    if (!response.ok) {
      throw new Error('Failed to submit National park');
    }

    const data = await response.json();
    console.log(data);
    if(data.message && data.message == 'National park updated successfully') {
        window.location.href='/national-parks';
        // redirect('/national-parks');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", nationalPark);
    submitNationalPark({
      id: nationalPark.id,
      name: nationalPark.name,
      location: nationalPark.location,
      description: nationalPark.description,
      image: nationalPark.image,
      month: nationalPark.month,
      river: nationalPark.river,
      season: nationalPark.season,
      state: nationalPark.state
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-6 w-1/2 max-h-[80vh] overflow-y-auto">
          {/* Close Button */}
          <button className="float-right bg-transparent border-none text-2xl cursor-pointer text-black hover:text-red-500" onClick={onClose}>
            &times;
          </button>
          <h2 className="text-2xl font-semibold mb-4">Edit National Park</h2>
          <form onSubmit={handleSubmit}>
            {/* National Package Name */}
            <div className="mb-4.5">
              <label htmlFor="name" className="mb-3 block text-sm font-medium text-black dark:text-white">National Park Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={nationalPark.name}
                onChange={handleInputChange}
                required
                placeholder='National Park Name'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>

            {/* Duration */}
            <div className="mb-4.5">
              <label htmlFor="location" className="mb-3 block text-sm font-medium text-black dark:text-white">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={nationalPark.location}
                onChange={handleInputChange}
                required
                placeholder='Location'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>

            {/* From Date */}
            <div className="mb-4.5">
              <label htmlFor="description" className="mb-3 block text-sm font-medium text-black dark:text-white">Description</label>
              <textarea
                id="description"
                name="description"
                value={nationalPark.description}
                onChange={handleInputChange}
                required
                placeholder='Description'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>

            {/* To Date */}
            <div className="mb-4.5">
              <label htmlFor="image" className="mb-3 block text-sm font-medium text-black dark:text-white">Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => handleImageUpload(e)}
                placeholder='To Date'
                className="mb-4.5 w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
              {nationalPark.image && <a download={nationalPark.image} href={`/uploads/nationalParks/${nationalPark.image}`}><img src={`/uploads/nationalParks/${nationalPark.image}`} width={200} alt="National Park" /></a>}
            </div>

            <div className="mb-4.5">
              <label htmlFor="month" className="mb-3 block text-sm font-medium text-black dark:text-white">Month</label>
              <input
                type="text"
                id="month"
                name="month"
                value={nationalPark.month}
                onChange={handleInputChange}
                required
                placeholder='Month'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>

            <div className="mb-4.5">
              <label htmlFor="river" className="mb-3 block text-sm font-medium text-black dark:text-white">River</label>
              <input
                type="text"
                id="river"
                name="river"
                value={nationalPark.river}
                onChange={handleInputChange}
                required
                placeholder='River'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>

            <div className="mb-4.5">
              <label htmlFor="season" className="mb-3 block text-sm font-medium text-black dark:text-white">Season</label>
              <input
                type="text"
                id="season"
                name="season"
                value={nationalPark.season}
                onChange={handleInputChange}
                required
                placeholder='Season'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>

            <div className="mb-4.5">
              <label htmlFor="state" className="mb-3 block text-sm font-medium text-black dark:text-white">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={nationalPark.state}
                onChange={handleInputChange}
                required
                placeholder='State'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>
            <button type="submit" className='inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10'>Update National Park</button>
          </form>
          {/* <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button> */}
        </div>
      </div>
    </>
  );
};

const DataTablePage = () => {
  const [data, setData] = useState([]); // State for fetched data
  const [filterText, setFilterText] = useState(""); // State for search input
  const [filteredData, setFilteredData] = useState(data); // State for filtered data
  const [selectedRowData, setSelectedRowData] = useState({}); // Data for the modal
  const [isModalOpen, setModalOpen] = useState(false);

   // Fetch data from API
   useEffect(() => {
    const fetchData = async () => {
    try {
      const response = await fetch("/api/nationalPark"); // Replace with your API endpoint
      const result = await response.json();
      setData(result); // Update data state with fetched data
      setFilteredData(result); // Initialize filteredData with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []); // Empty dependency array ensures this runs once

  // Handlers for actions
  const handleEdit = (row) => {
    setModalOpen(true);
    // console.log(row);
    setSelectedRowData(row); // Set the fetched data for the modal
  };

  const handleDelete = async(row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        // Fetch additional details using the row's ID
        const response = await fetch(`/api/nationalPark/${row.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert("Record deleted successfully!");
          // Optionally, update the UI to reflect the deletion
          setData((prevData) => prevData.filter((item) => item.id !== row.id));
          setFilteredData((prevData) => prevData.filter((item) => item.id !== row.id));
        } else {
          const error = await response.json();
          alert(`Failed to delete: ${error.message}`);
        }
      } catch (error) {
        console.error("Error fetching row details:", error);
        alert("An error occurred while deleting the record.");
      }
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
        row.location.toString().includes(value) ||
        row.description.toLowerCase().includes(value) ||
        row.month.toLowerCase().includes(value) ||
        row.river.toLowerCase().includes(value) ||
        row.season.toLowerCase().includes(value) ||
        row.state.toLowerCase().includes(value)
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
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Image",
      selector: (row) => row.image,
      cell: (row) => (
        <><a download={row.image} href={`/uploads/nationalParks/${row.image}`}>
          <img
            src={`/uploads/nationalParks/${row.image}`}
            alt='Safari Package' // Use a meaningful alt text
            className="h-16 w-16 rounded object-cover" // Adjust size and styling as needed
          />
          </a></>
      ),
      sortable: true,
    },
    {
      name: "Month",
      selector: (row) => row.month,
      sortable: true,
    },
    {
      name: "River",
      selector: (row) => row.river,
      sortable: true,
    },
    {
      name: "Season",
      selector: (row) => row.season,
      sortable: true,
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="">
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
            title="National Park Information"
            columns={columns}
            data={filteredData}
            pagination
            paginationRowsPerPageOptions={[10, 30, 50, 100, 500]}
            highlightOnHover
            striped
          />
        </div>
      </div>

      {/* Modal for extra data */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedRowData}
      />
    </>
  );
};

export default DataTablePage;
