'use client';
import { useState, useEffect } from 'react';
// import { redirect } from 'next/navigation';

// const nationalParks = [
//   { id: '1', name: 'Gir National Park' },
//   { id: '2', name: 'Serengeti National Park' },
//   { id: '3', name: 'Kruger National Park' },
// ];

const SafariPackageFrom = () => {
  const [safariPackage, setSafariPackage] = useState({
    name: '',
    duration: '',
    fromDate: '',
    toDate: '',
    nationalParkId: '',
    itinerary: [
      {
        day: 1,
        date: '',
        description: '',
        activities: [''],
        accommodation: [
          { name: '', rating: '', link: '', meals: [''], roomTypes: [''], imageUrl: '' },
        ],
      },
    ],
    available: true,
  });

  const handleInputChange = (e, index = null, field = null, activityIndex = null) => {
    const { name, value } = e.target;

    if (index !== null && field !== null) {
      if (activityIndex !== null) {
        const updatedItinerary = [...safariPackage.itinerary];
        updatedItinerary[index].activities[activityIndex] = value;
        setSafariPackage((prev) => ({
          ...prev,
          itinerary: updatedItinerary,
        }));
      } else {
        const updatedItinerary = [...safariPackage.itinerary];
        updatedItinerary[index][field] = value;
        setSafariPackage((prev) => ({
          ...prev,
          itinerary: updatedItinerary,
        }));
      }
    } else {
      setSafariPackage({
        ...safariPackage,
        [name]: value,
      });
    }
  };

  const [nationalParks, setNationalParks] = useState([]);

  // Fetch data from API
     useEffect(() => {
      const fetchData = async () => {
      try {
        const response = await fetch("/api/nationalPark"); // Replace with your API endpoint
        const result = await response.json();
        setNationalParks(result); // Update data state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []); // Empty dependency array ensures this runs once

  const handleAccommodationChange = (e, dayIndex, accommodationIndex, field) => {
    const { name, value } = e.target;

    if (field === 'meals' || field === 'roomTypes') {
      // Split the input value into an array by commas
      const updatedItinerary = [...safariPackage.itinerary];
      updatedItinerary[dayIndex].accommodation[accommodationIndex][field] = value
        .split(',')
        .map((item) => item.trim()); // Trim spaces after commas
      setSafariPackage((prev) => ({
        ...prev,
        itinerary: updatedItinerary,
      }));
    } else {
      const updatedItinerary = [...safariPackage.itinerary];
      updatedItinerary[dayIndex].accommodation[accommodationIndex][field] = value;

      setSafariPackage((prev) => ({
        ...prev,
        itinerary: updatedItinerary,
      }));
    }
  };

  const handleAddActivity = (index) => {
    const updatedItinerary = [...safariPackage.itinerary];
    updatedItinerary[index].activities.push('');
    setSafariPackage((prev) => ({
      ...prev,
      itinerary: updatedItinerary,
    }));
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    const updatedItinerary = [...safariPackage.itinerary];
    updatedItinerary[dayIndex].activities.splice(activityIndex, 1);
    setSafariPackage((prev) => ({
      ...prev,
      itinerary: updatedItinerary,
    }));
  };

  const handleAddAccommodation = (index) => {
    const updatedItinerary = [...safariPackage.itinerary];
    updatedItinerary[index].accommodation.push({ name: '', rating: '', link: '', meals: [''], roomTypes: [''] });
    setSafariPackage((prev) => ({
      ...prev,
      itinerary: updatedItinerary,
    }));
  };

  const handleRemoveAccommodation = (dayIndex, accIndex) => {
    const updatedItinerary = [...safariPackage.itinerary];
    updatedItinerary[dayIndex].accommodation.splice(accIndex, 1);
    setSafariPackage((prev) => ({
      ...prev,
      itinerary: updatedItinerary,
    }));
  };

  const handleAddRoomType = (dayIndex, accIndex) => {
    const updatedItinerary = [...safariPackage.itinerary];
    updatedItinerary[dayIndex].accommodation[accIndex].roomTypes.push('');
    setSafariPackage((prev) => ({
      ...prev,
      itinerary: updatedItinerary,
    }));
  };

  const handleRemoveRoomType = (dayIndex, accIndex, roomTypeIndex) => {
    const updatedItinerary = [...safariPackage.itinerary];
    updatedItinerary[dayIndex].accommodation[accIndex].roomTypes.splice(roomTypeIndex, 1);
    setSafariPackage((prev) => ({
      ...prev,
      itinerary: updatedItinerary,
    }));
  };

  const handleImageUpload = async (e, dayIndex, accIndex) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'safariPackages');
  
    try {
      // Send the file to the backend API route
      const response = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (data.imageUrl) {
        // Update the accommodation with the local image URL
        const updatedItinerary = [...safariPackage.itinerary];
        updatedItinerary[dayIndex].accommodation[accIndex].imageUrl = data.imageUrl;
        setSafariPackage((prev) => ({
          ...prev,
          itinerary: updatedItinerary,
        }));
      } else {
        console.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  
  const submitSafariPackage = async (safariPackage) => {
    const response = await fetch('/api/safariPackage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(safariPackage),
    });

    if (!response.ok) {
      throw new Error('Failed to submit safari package');
    }

    const data = await response.json();
    console.log(data);
    if(data.message && data.message == 'Safari package created successfully') {
        window.location.href='/safari-packages';
        // redirect('/safari-packages');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", safariPackage);
    submitSafariPackage({
      name: safariPackage.name,
      duration: safariPackage.duration,
      fromDate: safariPackage.fromDate,
      toDate: safariPackage.toDate,
      nationalParkId: safariPackage.nationalParkId,
      itinerary: safariPackage.itinerary.map((day) => ({
        ...day,
        activities: day.activities.join(", "),  // Join activities as comma-separated string
        accommodation: day.accommodation.map((acc) => ({
          ...acc,
          meals: acc.meals.join(", "),  // Join meals as comma-separated string
          roomTypes: acc.roomTypes.join(", "),  // Join room types as comma-separated string
          imageUrl: acc.imageUrl || '',
        })),
      })),
      available: safariPackage.available,
    });
  };

  return (
    <div>
      {/* <h1>Create Safari Package</h1> */}
      <form onSubmit={handleSubmit}>
        {/* Safari Package Name */}
        <div className="mb-4.5">
          <label htmlFor="name" className="mb-3 block text-sm font-medium text-black dark:text-white">Safari Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={safariPackage.name}
            onChange={handleInputChange}
            required
            placeholder='Safari Name'
            className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          />
        </div>

        {/* Duration */}
        <div className="mb-4.5">
          <label htmlFor="duration" className="mb-3 block text-sm font-medium text-black dark:text-white">Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={safariPackage.duration}
            onChange={handleInputChange}
            required
            placeholder='Duration'
            className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          />
        </div>

        {/* From Date */}
        <div className="mb-4.5">
          <label htmlFor="fromDate" className="mb-3 block text-sm font-medium text-black dark:text-white">From Date</label>
          <input
            type="date"
            id="fromDate"
            name="fromDate"
            value={safariPackage.fromDate}
            onChange={handleInputChange}
            required
            placeholder='From Date'
            className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          />
        </div>

        {/* To Date */}
        <div className="mb-4.5">
          <label htmlFor="toDate" className="mb-3 block text-sm font-medium text-black dark:text-white">To Date</label>
          <input
            type="date"
            id="toDate"
            name="toDate"
            value={safariPackage.toDate}
            onChange={handleInputChange}
            required
            placeholder='To Date'
            className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          />
        </div>

        {/* National Park */}
        <div className="mb-4.5">
          <label htmlFor="nationalParkId" className="mb-3 block text-sm font-medium text-black dark:text-white">National Park</label>
          <select
            id="nationalParkId"
            name="nationalParkId"
            value={safariPackage.nationalParkId}
            onChange={handleInputChange}
            required
            className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
          >
            <option value="">Select National Park</option>
            {nationalParks.map((park) => (
              <option key={park.id} value={park.id}>
                {park.name}
              </option>
            ))}
          </select>
        </div>

        {/* Itinerary */}
        {safariPackage.itinerary.map((day, index) => (
          <div key={index} className="mb-4.5 flex flex-col gap-2">
            <h3 className="mb-3 block text-xl font-bold text-black dark:text-white">Day {day.day}</h3>
            <div>
              <label htmlFor={`date${index}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Date</label>
              <input
                type="date"
                id={`date${index}`}
                name="date"
                value={day.date}
                onChange={(e) => handleInputChange(e, index, 'date')}
                required
                placeholder='Date'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>

            <div>
              <label htmlFor={`description${index}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Description</label>
              <textarea
                id={`description${index}`}
                name="description"
                value={day.description}
                onChange={(e) => handleInputChange(e, index, 'description')}
                required
                placeholder='Description'
                className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
              />
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">Activities</label>
              {day.activities.map((activity, activityIndex) => (
                <div key={activityIndex}>
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => handleInputChange(e, index, 'activities', activityIndex)}
                    placeholder={`Activity ${activityIndex + 1}`}
                    className="w-100 mx-1 mb-4.5 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                  <button type="button"className="mb-4.5 inline-flex items-center justify-center rounded-full bg-red px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90" onClick={() => handleRemoveActivity(index, activityIndex)}>
                    Remove Activity
                  </button>
                </div>
              ))}
              <button type="button" className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90" onClick={() => handleAddActivity(index)}>
                Add Activity
              </button>
            </div>

            {/* Accommodation */}
            {day.accommodation.map((accommodation, accIndex) => (
              <div key={accIndex} className="mb-4.5 flex flex-col gap-2">
                <h3 className="mb-3 block text-lg font-bold text-black dark:text-white">Accommodation {accIndex + 1}</h3>
                <div>
                  <label htmlFor={`accommodationName${index}${accIndex}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Accommodation Name</label>
                  <input
                    type="text"
                    id={`accommodationName${index}${accIndex}`}
                    value={accommodation.name}
                    onChange={(e) =>
                      handleAccommodationChange(e, index, accIndex, 'name')
                    }
                    required
                    placeholder='Accommodation Name'
                    className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor={`rating${index}${accIndex}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Rating</label>
                  <input
                    type="text"
                    id={`rating${index}${accIndex}`}
                    value={accommodation.rating}
                    onChange={(e) =>
                      handleAccommodationChange(e, index, accIndex, 'rating')
                    }
                    required
                    placeholder='Rating'
                    className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor={`link${index}${accIndex}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Link</label>
                  <input
                    type="url"
                    id={`link${index}${accIndex}`}
                    value={accommodation.link}
                    onChange={(e) =>
                      handleAccommodationChange(e, index, accIndex, 'link')
                    }
                    required
                    placeholder='Link'
                    className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">Room Types (comma separated)</label>
                  <input
                    type="text"
                    value={accommodation.roomTypes.join(', ')} // Join array with commas
                    onChange={(e) =>
                      handleAccommodationChange(e, index, accIndex, 'roomTypes')
                    }
                    required
                    placeholder="Room Type 1, Room Type 2"
                    className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">Meals (comma separated)</label>
                  <input
                    type="text"
                    value={accommodation.meals.join(', ')} // Join array with commas
                    onChange={(e) =>
                      handleAccommodationChange(e, index, accIndex, 'meals')
                    }
                    required
                    placeholder="Meal 1, Meal 2"
                    className="w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label htmlFor={`image${index}${accIndex}`} className="mb-3 block text-sm font-medium text-black dark:text-white">Accommodation Image</label>
                  <input
                    type="file"
                    id={`image${index}${accIndex}`}
                    onChange={(e) => handleImageUpload(e, index, accIndex)}
                    accept="image/*"
                    required
                    className="mb-4.5 w-100 rounded-lg border-[1.5px] border-primary bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                  />
                  {/* <br/><br/> */}
                  {accommodation.imageUrl && <img src={`/uploads/safariPackages/${accommodation.imageUrl}`} width={200} alt="Accommodation" />}
                </div>

                <button type="button" className="w-50 inline-flex items-center justify-center rounded-full bg-red px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90" onClick={() => handleRemoveAccommodation(index, accIndex)}>
                  Remove Accommodation
                </button>
              </div>
            ))}
            <div className="mb-4.5">
                <button type="button" className="w-50 inline-flex items-center justify-center rounded-full bg-primary px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90" onClick={() => handleAddAccommodation(index)}>
                Add Accommodation
                </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="mb-4.5 w-50 inline-flex items-center justify-center rounded-full bg-meta-3 px-3 py-1 text-center text-sm font-medium text-white hover:bg-opacity-90"
          onClick={() =>
            setSafariPackage({
              ...safariPackage,
              itinerary: [
                ...safariPackage.itinerary,
                {
                  day: safariPackage.itinerary.length + 1,
                  date: '',
                  description: '',
                  activities: [''],
                  accommodation: [{ name: '', rating: '', link: '', meals: [''], roomTypes: [''] }],
                },
              ],
            })
          }
        >
          Add Day
        </button>

        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            <input
              type="checkbox"
              checked={safariPackage.available}
              onChange={() =>
                setSafariPackage({ ...safariPackage, available: !safariPackage.available })
              }
              className="mr-3"
            />
            Available
          </label>
        </div>

        <button type="submit" className='inline-flex items-center justify-center rounded-md border border-primary px-10 py-4 text-center font-medium text-primary hover:bg-opacity-90 lg:px-8 xl:px-10'>Submit Safari Package</button>
      </form>
    </div>
  );
};

export default SafariPackageFrom;
