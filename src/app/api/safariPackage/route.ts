import { NextRequest, NextResponse } from "next/server";
import connection from '../../../lib/mysql';
import { ResultSetHeader } from 'mysql2';

// Define the TypeScript interface for the request body
interface Accommodation {
  name: string;
  rating: string;
  link: string;
  imageUrl: string;
  meals: string[];
  roomTypes: string[];
}

interface ItineraryDay {
  day: number;
  date: string;
  description: string;
  activities: string[];
  accommodation: Accommodation[];
}

interface SafariPackage {
  name: string;
  duration: string;
  fromDate: string;
  toDate: string;
  nationalParkId: string;
  itinerary: ItineraryDay[];
  available: boolean;
}

export const POST = async (req: NextRequest, res: NextResponse) => {
  const safariPackage = await req.json(); // Use await to wait for the promise to resolve

  const { name, duration, fromDate, toDate, nationalParkId, itinerary, available } = safariPackage;

  console.log(name, duration, fromDate, toDate, nationalParkId, itinerary, available);  // Debugging: log the incoming request data

  try {
    // Insert the safari package into the safari_packages table
    const [safariPackageResult] = await connection.promise().query<ResultSetHeader>(
      'INSERT INTO safari_packages (name, duration, from_date, to_date, national_park_id, available) VALUES (?, ?, ?, ?, ?, ?)',
      [name, duration, fromDate, toDate, nationalParkId, available]
    );

    const safariPackageId = safariPackageResult.insertId;

    console.log('Safari package inserted, ID:', safariPackageId); // Debugging: log the insert ID

    // Insert the itinerary and associated data into the itinerary, activities, and accommodations tables
    for (const day of itinerary) {
      const [itineraryResult] = await connection.promise().query<ResultSetHeader>(
        'INSERT INTO itineraries (safari_package_id, day, date, description) VALUES (?, ?, ?, ?)',
        [safariPackageId, day.day, day.date, day.description]
      );

      const itineraryId = itineraryResult.insertId;

      // Insert activities for this day
      for (const activity of day.activities.split(',')) {
        console.log('Activity:', activity);
        await connection.promise().query(
          'INSERT INTO activities (safari_package_id, itinerary_id, activity) VALUES (?, ?, ?)',
          [safariPackageId, itineraryId, activity]
        );
      }

      // Insert accommodations for this day
      for (const accommodation of day.accommodation) {
        const [accommodationResult] = await connection.promise().query<ResultSetHeader>(
          'INSERT INTO accommodations (safari_package_id, itinerary_id, name, rating, link, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          [
            safariPackageId,
            itineraryId,
            accommodation.name,
            accommodation.rating,
            accommodation.link,
            accommodation.imageUrl
          ]
        );

        const accommodationId = accommodationResult.insertId;

        // Insert meals for this accomodation
        for (const meal of accommodation.meals.split(',')) {
          await connection.promise().query(
            'INSERT INTO meals (safari_package_id, itinerary_id, accommodation_id, type) VALUES (?, ?, ?, ?)',
            [
              safariPackageId,
              itineraryId,
              accommodationId,
              meal
            ]
          );
        }

        // Insert room types for this accomodation
        for (const roomType of accommodation.roomTypes.split(',')) {
          await connection.promise().query(
            'INSERT INTO room_types (safari_package_id, itinerary_id, accommodation_id, type) VALUES (?, ?, ?, ?)',
            [
              safariPackageId,
              itineraryId,
              accommodationId,
              roomType
            ]
          );
        }
      }
    }

    return NextResponse.json({ message: 'Safari package created successfully' });
  } catch (error) {
    console.error('Error inserting safari package:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
};

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const [rows] = await connection.promise().query('SELECT safari_packages.id, safari_packages.name, safari_packages.duration, safari_packages.from_date, safari_packages.to_date, national_parks.name as national_park, safari_packages.available FROM safari_packages LEFT JOIN national_parks ON safari_packages.national_park_id = national_parks.id ORDER BY safari_packages.id DESC'); // Replace `your_table_name` with your table
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
};
