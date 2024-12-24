import { NextRequest, NextResponse } from "next/server";
import connection from '../../../../../lib/mysql';
import { ResultSetHeader } from 'mysql2';

// export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
//   const { id } = params; // Destructuring `id` from `params`

//   try {
//     // Fetch itineraries for the given safari package
//     const [itineraries] = await connection.promise().query(
//       'SELECT id, day, date, description FROM itineraries WHERE safari_package_id = ?',
//       [id]
//     );

//     // Process itineraries
//     const formattedItineraries = await Promise.all(
//       itineraries.map(async (itinerary: any) => {
//         // Fetch activities
//         const [activities] = await connection.promise().query(
//           'SELECT id, activity FROM activities WHERE itinerary_id = ?',
//           [itinerary.id]
//         );

//         // Fetch accommodations
//         const [accommodations] = await connection.promise().query(
//           'SELECT id, name, rating, link, image_url FROM accommodations WHERE itinerary_id = ?',
//           [itinerary.id]
//         );

//         // Add detailed data for accommodations
//         const formattedAccommodations = await Promise.all(
//           accommodations.map(async (accommodation: any) => {
//             // Fetch meals
//             const [meals] = await connection.promise().query(
//               'SELECT type FROM meals WHERE accommodation_id = ?',
//               [accommodation.id]
//             );

//             // Fetch room types
//             const [roomTypes] = await connection.promise().query(
//               'SELECT type FROM room_types WHERE accommodation_id = ?',
//               [accommodation.id]
//             );

//             // Return formatted accommodation
//             return {
//               name: accommodation.name,
//               rating: accommodation.rating,
//               link: accommodation.link,
//               meals: meals.map((meal: any) => meal.type),
//               roomTypes: roomTypes.map((roomType: any) => roomType.type),
//               imageUrl: accommodation.image_url,
//             };
//           })
//         );

//         // Return formatted itinerary
//         return {
//           day: itinerary.day,
//           date: itinerary.date,
//           description: itinerary.description,
//           activities: activities,
//           accommodation: formattedAccommodations,
//         };
//       })
//     );

//     // Return the formatted itineraries
//     return NextResponse.json({ itinerary: formattedItineraries });
//   } catch (error) {
//     console.error('Database query error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// };

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    const [activityResult] = await connection.promise().query<ResultSetHeader>(
      "DELETE FROM meals WHERE id = ?",
      [id]
    );

    // Check if a row was deleted
    if (activityResult.affectedRows > 0) {
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
