"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

// Modal component for showing extra data
const Modal = ({ isOpen, onClose, data, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/2 max-h-[80vh] overflow-y-auto">
        {isLoading ? (
          <div className="text-center">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        ) : (
          <>
            {/* Close Button */}
            <button className="float-right bg-transparent border-none text-2xl cursor-pointer text-black hover:text-red-500" onClick={onClose}>
              &times;
            </button>
            <h2 className="text-xl font-bold mb-5">Package Details</h2>
            {data &&
              data.itinerary.map((value, key) => (
                <div key={key}>
                  <h2 className="text-md font-bold mb-1">Day <span className="text-sm font-bold">{value.day}</span>: <span className="text-sm font-bold">{value.date.split("T")[0]}</span></h2>
                  <h2 className="text-md font-bold mb-1">Description: <span className="text-sm font-bold">{value.description}</span></h2>
                  <table className="border border-gray-400 border-collapse overflow-x-auto">
                    <thead>
                      <tr className="border-b">
                        <th className="border border-gray-400 px-4 py-2">#</th>
                        <th className="border border-gray-400 px-4 py-2">Activity:</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        value.activities.map((val, k) => (
                          <tr key={k} className="border-b">
                            <td className="border border-gray-400 px-4 py-2">{k + 1}</td>
                            <td className="border border-gray-400 px-4 py-2">{val.activity}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                  <h2 className="text-md font-bold mb-1">Accommodations:</h2>
                    <table className="w-full border border-gray-400 border-collapse mb-5 overflow-x-auto">
                      <thead>
                        <tr className="border-b">
                          <th className="border border-gray-400 px-4 py-2">Hotel Name</th>
                          <th className="border border-gray-400 px-4 py-2">Rating</th>
                          <th className="border border-gray-400 px-4 py-2">Website</th>
                          <th className="border border-gray-400 px-4 py-2">Meals</th>
                          <th className="border border-gray-400 px-4 py-2">Room Types</th>
                          <th className="border border-gray-400 px-4 py-2">Image</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          value.accommodation.map((v, i) => (
                            <tr key={i} className="border-b">
                              <td className="border border-gray-400 px-4 py-2">{v.name}</td>
                              <td className="border border-gray-400 px-4 py-2">{v.rating}</td>
                              <td className="border border-gray-400 px-4 py-2"><a className="text-blue-600" href={v.link} target="_blank">Visit</a></td>
                              <td className="border border-gray-400 px-4 py-2">{v.meals.map((va, ind) => <p key={ind}>{va.type},</p>) }</td>
                              <td className="border border-gray-400 px-4 py-2">{v.roomTypes.map((valu, index) => <p key={index}>{valu.type},</p>) }</td>
                              <td className="border border-gray-400 px-4 py-2"><a href={`/uploads/safariPackages/${v.imageUrl}`} download={v.imageUrl}><img src={`/uploads/safariPackages/${v.imageUrl}`} alt={v.hotelName} height={100} width={100}/></a></td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                </div>
              ))}
            {/* <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Close
            </button> */}
          </>
        )}
      </div>
    </div>
  );
};

const DataTablePage = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [selectedRowData, setSelectedRowData] = useState({}); // Data for the modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false); // Loading state for the modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/safariPackage");
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleView = async (row) => {
    setModalOpen(true);
    setLoading(true);

    try {
      // Fetch additional details using the row's ID
      const response = await fetch(`/api/safariPackage/${row.id}`);
      const result = await response.json();
      console.log(result);
      setSelectedRowData(result); // Set the fetched data for the modal
    } catch (error) {
      console.error("Error fetching row details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    window.location.href = '/safari-packages/edit/' + row.id;
  };

  const handleDelete = async(row) => {
    if (confirm(`Are you sure you want to delete ${row.name}?`)) {
      try {
        // Fetch additional details using the row's ID
        const response = await fetch(`/api/safariPackage/${row.id}`, {
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

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);

    const filtered = data.filter(
      (row) =>
        row.name.toLowerCase().includes(value) ||
        row.duration.toString().includes(value) ||
        row.from_date.toLowerCase().includes(value) ||
        row.to_date.toLowerCase().includes(value) ||
        row.national_park.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Duration",
      selector: (row) => row.duration,
      sortable: true,
    },
    {
      name: "From Date",
      selector: (row) => row.from_date.split("T")[0],
      sortable: true,
    },
    {
      name: "To Date",
      selector: (row) => row.to_date.split("T")[0],
      sortable: true,
    },
    {
      name: "National Park",
      selector: (row) => row.national_park,
      sortable: true,
    },
    {
      name: "Available",
      selector: (row) => (row.available == 1 ? "Available" : "Not Available"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button
            className="inline-flex items-center justify-center rounded-full bg-black px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90"
            onClick={() => handleView(row)}
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
      ignoreRowClick: true,
    },
  ];

  return (
    <>
      <div className="w-full xl:w-1/2 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={handleSearch}
          className="w-50 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
        />
      </div>

      <div className="max-w-full overflow-x-auto">
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

      {/* Modal for extra data */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        data={selectedRowData}
        isLoading={isLoading}
      />
    </>
  );
};

export default DataTablePage;
