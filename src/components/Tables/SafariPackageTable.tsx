"use client";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

// Modal component for showing extra data
const Modal = ({ isOpen, onClose, data, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-1/2">
        {isLoading ? (
          <div className="text-center">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4">Package Details</h2>
            <table className="table-auto w-full border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Field</th>
                  <th className="border px-4 py-2">Value</th>
                </tr>
              </thead>
              <tbody>{ JSON.stringify(data) }
                {/* {data &&
                  data.map((value, key) => (
                    <tr key={key}>
                      <td className="border px-4 py-2">{value}</td>
                    </tr>
                  ))} */}
              </tbody>
            </table>
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
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
      selector: (row) => row.from_date,
      sortable: true,
    },
    {
      name: "To Date",
      selector: (row) => row.to_date,
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
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary"
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
