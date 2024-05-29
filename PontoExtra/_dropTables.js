const db = require('./_database');

async function dropTables() {
  try {
    await db.connect();

    await db.query(`DROP TABLE users`);

    await db.end();
  } catch (e) {
    console.error("Erro ao tentar realizar query: ", e);
  }
}

dropTables();
