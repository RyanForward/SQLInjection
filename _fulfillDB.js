const api = 'randomuser.me';
const https = require('https');
const db = require('./_database');

async function fulfillDB() {
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

    let qtd = await question('Digite quantos usuários quer no banco: ');
    if( qtd < 1){
        console.log("Digite uma quantidade válida")
        qtd = await question('Digite quantos usuários quer no banco: ');
    }

    const options = {
        hostname: api,
        port: 443,
        path: `/api/?results=${qtd}`,
        method: 'GET',
    };
    
    let rawData = '';
    let users = []

    const req = https.request(options, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        
        res.on('data', (chunk) => {
            rawData += chunk;
        });
        
        res.on('end', () => {
            try {
                const jsonData = JSON.parse(rawData);
                const jsonResults = jsonData.results
                jsonResults.forEach((user)=>{
                    if(user.id.value){
                        users.push({
                            id: user.id.value,
                            email: user.email,
                            name: user.name.first,
                            password: user.login.password,
                            gender: user.gender,
                        });
                    }
                });

                console.log(users);
                console.log(users.length);
                insert(users);
            } catch (error) {
                console.error("Erro ao analisar JSON:", error);
            }
        });
    });
    
    req.on('error', (e) => {
        console.error(e);
    });
        
    req.end();
}

async function insert(users) {
    try {
        await db.connect();
        for (const user of users) {
            await db.query(`
                INSERT INTO users (id, email, name, password, gender)
                VALUES ($1, $2, $3, $4, $5)
            `, [user.id, user.email, user.name, user.password, user.gender]);
        }
        console.log("Dados inseridos com sucesso!");
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
}

fulfillDB();
