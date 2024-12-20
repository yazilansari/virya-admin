'use client';
import { useState } from 'react';
// import { redirect } from 'next/navigation';

// const nationalParks = [
//   { id: '1', name: 'Gir National Park' },
//   { id: '2', name: 'Serengeti National Park' },
//   { id: '3', name: 'Kruger National Park' },
// ];

const nationalParkFrom = () => {
  const [nationalPark, setnationalPark] = useState({
    name: '',
    location: '',
    description: '',
    image: '',
    month: '',
    river: '',
    season: '',
    state: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
      setnationalPark({
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
        setnationalPark((prev) => ({
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
    const response = await fetch('/api/nationalPark', {
      method: 'POST',
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
    if(data.message && data.message == 'National park created successfully') {
        window.location.href='/national-parks';
        // redirect('/national-parks');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", nationalPark);
    submitNationalPark({
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

  return (
    <div>
      {/* <h1>Create National Package</h1> */}
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
            value={nationalPark.loction}
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
            required
            placeholder='To Date'
            className="mb-4.5 w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          />
          {nationalPark.image && <img src={`/uploads/nationalParks/${nationalPark.image}`} width={200} alt="National Park" />}
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
        <button type="submit" className='inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10'>Submit National Park</button>
      </form>
    </div>
  );
};

export default nationalParkFrom;
