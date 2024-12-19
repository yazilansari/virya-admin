import { NextRequest, NextResponse } from "next/server";
import connection from '../../../../lib/mysql';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params; // Destructuring `id` from `params`

  try {
    // Fetch itineraries for the given safari package
    const [itineraries] = await connection.promise().query(
      'SELECT id, day, date, description FROM itinerary WHERE safari_package_id = ?',
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
