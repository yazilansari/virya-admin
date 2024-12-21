import { NextRequest, NextResponse } from "next/server";
import connection from '../../../../lib/mysql';
import { ResultSetHeader } from 'mysql2';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params; // Destructuring `id` from `params`

  try {
    // Fetch itineraries for the given safari package
    const [itineraries] = await connection.promise().query(
      'SELECT id, day, date, description FROM itineraries WHERE safari_package_id = ?',
      [id]
    );

    // For each itinerary, fetch its associated activities and accommodations concurrently
    const itinerariesWithDetails = await Promise.all(itineraries.map(async (itinerary) => {
      // Fetch activities
      const [activities] = await connection.promise().query(
        'SELECT activity FROM activities WHERE itinerary_id = ?',
        [itinerary.id]
      );

      // Fetch accommodations
      const [accommodations] = await connection.promise().query(
        'SELECT id, name, rating, link, image_url FROM accommodations WHERE itinerary_id = ?',
        [itinerary.id]
      );

      // For each accommodation, fetch multiple meals and room types
      const accommodationsWithDetails = await Promise.all(accommodations.map(async (accommodation) => {
        // Fetch meals for the accommodation
        const [meals] = await connection.promise().query(
          'SELECT type FROM meals WHERE accommodation_id = ?',
          [accommodation.id]
        );

        // Fetch room types for the accommodation
        const [roomTypes] = await connection.promise().query(
          'SELECT type FROM room_types WHERE accommodation_id = ?',
          [accommodation.id]
        );

        // Add meals and room types to accommodation
        accommodation.meals = meals;
        accommodation.room_types = roomTypes;

        return accommodation;
      }));

      // Add activities and accommodations with details to the itinerary
      itinerary.activities = activities;
      itinerary.accommodations = accommodationsWithDetails;

      return itinerary;
    }));

    // Return the updated itineraries with their activities and accommodations
    return NextResponse.json(itinerariesWithDetails);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    // Now delete the parent record
    const [nationalParkResult] = await connection.promise().query<ResultSetHeader>(
      "DELETE FROM national_parks WHERE id = ?",
      [id]
    );

    // Check if a row was deleted
    if (nationalParkResult.affectedRows > 0) {
      return NextResponse.json(
        { message: "Record deleted successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting record:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the record" },
      { status: 500 }
    );
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  const nationalPark = await req.json(); // Use await to wait for the promise to resolve

  const { name, location, description, image, month, river, season, state } = nationalPark;

  console.log(id, name, location, description, image, month, river, season, state);  // Debugging: log the incoming request data

  try {
    // Now updated the parent record
    const [nationalParkResult] = await connection.promise().query<ResultSetHeader>(
      "UPDATE national_parks SET name = ?, location = ?, description = ?, image = ?, month = ?, river = ?, season = ?, state = ? WHERE id = ?",
      [name, location, description, image, month, river, season, state, id]
    );

    // Check if a row was updated
    if (nationalParkResult.affectedRows > 0) {
      return NextResponse.json(
        { message: "National park updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the record" },
      { status: 500 }
    );
  }
};
