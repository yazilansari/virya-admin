import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost', // Database host (or your remote host)
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'virya' // Your database name
});

export default connection;