const db = require('./_database');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

async function question(promptText) {
    return new Promise((resolve) => {
    readline.question(promptText, (answer) => {
        resolve(answer);
    });
    });
}

async function getUser(name, password) {
    await db.connect();
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE name = $1 AND password = $2`;
      db.query(query, [name, password], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

async function main(){
    const nome = await question('Digite o nome do usuário que deseja buscar: ');
    const password = await question('Digite a senha do usuário que deseja buscar: ');
    const usuario = await getUser(nome, password);
    if (usuario) {
        usuario.rows.map((row)=>{
            console.log(`Nome: ${row.name}`);
            console.log(`Email: ${row.email}`);
            console.log(`Gênero: ${row.gender}`);
            console.log(`-------------------------`);
        })
      } else {
        console.log('Usuário não encontrado.');
      }
}

main()