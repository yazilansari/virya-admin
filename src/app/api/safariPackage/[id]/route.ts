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

    // Process itineraries
    const formattedItineraries = await Promise.all(
      itineraries.map(async (itinerary: any) => {
        // Fetch activities
        const [activities] = await connection.promise().query(
          'SELECT id, activity FROM activities WHERE itinerary_id = ?',
          [itinerary.id]
        );

        // Fetch accommodations
        const [accommodations] = await connection.promise().query(
          'SELECT id, name, rating, link, image_url FROM accommodations WHERE itinerary_id = ?',
          [itinerary.id]
        );

        // Add detailed data for accommodations
        const formattedAccommodations = await Promise.all(
          accommodations.map(async (accommodation: any) => {
            // Fetch meals
            const [meals] = await connection.promise().query(
              'SELECT id, type FROM meals WHERE accommodation_id = ?',
              [accommodation.id]
            );

            // Fetch room types
            const [roomTypes] = await connection.promise().query(
              'SELECT id, type FROM room_types WHERE accommodation_id = ?',
              [accommodation.id]
            );

            // Return formatted accommodation
            return {
              id: accommodation.id,
              name: accommodation.name,
              rating: accommodation.rating,
              link: accommodation.link,
              meals: meals,
              roomTypes: roomTypes,
              imageUrl: accommodation.image_url,
            };
          })
        );

        // Return formatted itinerary
        return {
          id: itinerary.id,
          day: itinerary.day,
          date: itinerary.date,
          description: itinerary.description,
          activities: activities,
          accommodation: formattedAccommodations,
        };
      })
    );

    // Return the formatted itineraries
    return NextResponse.json({ itinerary: formattedItineraries });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    // Delete child records first
    connection.query("DELETE FROM room_types WHERE safari_package_id = ?", [id]);
    connection.query("DELETE FROM meals WHERE safari_package_id = ?", [id]);
    connection.query("DELETE FROM accommodations WHERE safari_package_id = ?", [id]);
    connection.query("DELETE FROM activities WHERE safari_package_id = ?", [id]);
    connection.query("DELETE FROM itineraries WHERE safari_package_id = ?", [id]);

    // Now delete the parent record
    const [safariPackageResult] = await connection.promise().query<ResultSetHeader>(
      "DELETE FROM safari_packages WHERE id = ?",
      [id]
    );

    // Check if a row was deleted
    if (safariPackageResult.affectedRows > 0) {
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
  const safariPackage = await req.json(); // Use await to wait for the promise to resolve

  const { id } = params;

  const { itinerary } = safariPackage;

  console.log(itinerary, id);  // Debugging: log the incoming request data

  try {
    // await connection.promise().query("DELETE FROM meals WHERE safari_package_id = ?", [id]);
    // await connection.promise().query("DELETE FROM room_types WHERE safari_package_id = ?", [id]);
    
    // Update the itinerary and associated data into the itinerary, activities, and accommodations tables
    for (const day of itinerary) {
      const [itineraryResult] = await connection.promise().query<ResultSetHeader>(
        'UPDATE itineraries SET description = ? WHERE safari_package_id = ? AND id = ?',
        [day.description, id, day.id]
      );

      // Update activities for this day
      for (const activity of day.activities) {
        // console.log('Activity:', activity);
        if(activity.id != '-1') {
          await connection.promise().query(
            'UPDATE activities SET activity = ? WHERE safari_package_id = ? AND itinerary_id = ? AND id = ?',
            [activity.activity, id, day.id, activity.id]
          );
        } else {
          await connection.promise().query(
            'INSERT INTO activities (safari_package_id, itinerary_id, activity) VALUES (?, ?, ?)',
            [id, day.id, activity.activity]
          );
        }
      }      

      // Update accommodations for this day
      for (const accommodation of day.accommodation) {
        if(accommodation.id && accommodation.id != "-1") {
          // console.log('if');
          await connection.promise().query<ResultSetHeader>(
            'UPDATE accommodations SET name = ?, rating = ?, link = ?, image_url = ? WHERE safari_package_id = ? AND itinerary_id = ? AND id = ?',
            [
              accommodation.name,
              accommodation.rating,
              accommodation.link,
              accommodation.imageUrl,
              id,
              day.id,
              accommodation.id
            ]
          );

          for (const meal of accommodation.meals) {
            // console.log('Meal:', meal);
            // console.log('accommodationId:', accommodation.id);
            // console.log('itineraryId:', day.id);
            // console.log('id:', id);
            if(meal.id && meal.id != "-1") {
              await connection.promise().query(
                'UPDATE meals SET type = ? WHERE safari_package_id = ? AND itinerary_id = ? AND accommodation_id = ? AND id = ?',
                [
                  meal.type,                
                  id,
                  day.id,
                  accommodation.id,
                  meal.id
                ]
              );
            } else {
              await connection.promise().query(
                'INSERT INTO meals (safari_package_id, itinerary_id, accommodation_id, type) VALUES (?, ?, ?, ?)',
                [
                  id,
                  day.id,
                  accommodation.id,
                  meal.type
                ]
              );
            }
          }

          for (const roomType of accommodation.roomTypes) {
            if(roomType.id && roomType.id != "-1") {
              await connection.promise().query(
                'UPDATE room_types SET type = ? WHERE safari_package_id = ? AND itinerary_id = ? AND accommodation_id = ? AND id = ?',
                [
                  roomType.type,
                  id,
                  day.id,
                  accommodation.id,
                  roomType.id
                ]
              );
            } else {
              await connection.promise().query(
                'INSERT INTO room_types (safari_package_id, itinerary_id, accommodation_id, type) VALUES (?, ?, ?, ?)',
                [
                  id,
                  day.id,
                  accommodation.id,
                  roomType.type
                ]
              );
            }    
          }
        } else {
          const [accommodationResult] = await connection.promise().query<ResultSetHeader>(
            'INSERT INTO accommodations (safari_package_id, itinerary_id, name, rating, link, image_url) VALUES (?, ?, ?, ?, ?, ?)',
            [
              id,
              day.id,
              accommodation.name,
              accommodation.rating,
              accommodation.link,
              accommodation.imageUrl
            ]
          );

          const accommodationId = accommodationResult.insertId;

          for (const meal of accommodation.meals) {
            // console.log('Meal:', meal);
            // console.log('accommodationId:', accommodation.id);
            // console.log('itineraryId:', day.id);
            // console.log('id:', id);
            if(meal.id && meal.id != "-1") {
              await connection.promise().query(
                'UPDATE meals SET type = ? WHERE safari_package_id = ? AND itinerary_id = ? AND accommodation_id = ? AND id = ?',
                [
                  meal.type,                
                  id,
                  day.id,
                  accommodationId,
                  meal.id
                ]
              );
            } else {
              await connection.promise().query(
                'INSERT INTO meals (safari_package_id, itinerary_id, accommodation_id, type) VALUES (?, ?, ?, ?)',
                [
                  id,
                  day.id,
                  accommodationId,
                  meal.type
                ]
              );
            }
          }

          for (const roomType of accommodation.roomTypes) {
            if(roomType.id && roomType.id != "-1") {
              await connection.promise().query(
                'UPDATE room_types SET type = ? WHERE safari_package_id = ? AND itinerary_id = ? AND accommodation_id = ? AND id = ?',
                [
                  roomType.type,
                  id,
                  day.id,
                  accommodationId,
                  roomType.id
                ]
              );
            } else {
              await connection.promise().query(
                'INSERT INTO room_types (safari_package_id, itinerary_id, accommodation_id, type) VALUES (?, ?, ?, ?)',
                [
                  id,
                  day.id,
                  accommodationId,
                  roomType.type
                ]
              );
            }    
          }
        }
      }
    }

    return NextResponse.json({ message: 'Safari package updated successfully' });
  } catch (error) {
    console.error('Error inserting safari package:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
};
