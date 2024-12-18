import { NextRequest, NextResponse } from "next/server";
import connection from '../../../lib/mysql';
import { ResultSetHeader } from 'mysql2';

// Define the TypeScript interface for the request body
interface nationalPark {
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  month: string;
  river: string;
  season: string;
  state: string;
}


export const POST = async (req: NextRequest, res: NextResponse) => {
  const nationalPark = await req.json(); // Use await to wait for the promise to resolve

  const { name, location, description, image, month, river, season, state } = nationalPark;

  console.log(name, location, description, image, month, river, season, state);  // Debugging: log the incoming request data

  try {
    // Insert the national park into the national_parks table
    const [nationalParkResult] = await connection.promise().query<ResultSetHeader>(
      'INSERT INTO national_parks (name, location, description, image, month, river, season, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, location, description, image, month, river, season, state]
    );

    return NextResponse.json({ message: 'National park created successfully' });
  } catch (error) {
    console.error('Error inserting national park:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
};

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const [rows] = await connection.promise().query('SELECT id, name, location, description, image, month, river, season, state FROM national_parks ORDER BY id DESC'); // Replace `your_table_name` with your table
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
};
