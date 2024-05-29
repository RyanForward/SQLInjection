const db = require('./_database');

async function createData() {
  try {
    await db.connect();
    // await db.query(`CREATE TYPE gender_enum AS ENUM ('male', 'female')`)
    await db.query(`CREATE TABLE users (
      id VARCHAR(30) PRIMARY KEY,
      email VARCHAR(50) UNIQUE NOT NULL,
      name VARCHAR(30) UNIQUE NOT NULL,
      password VARCHAR(50) NOT NULL,
      gender gender_enum NOT NULL
    )`);


    await db.end();
  } catch (e) {
    console.error("Erro ao tentar realizar query: ", e);
  }
}

createData();
