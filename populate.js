const fs = require('fs');
const requestDb = require("./db");
const blacklist = require("./frontend/src/constants/blacklist")

async function main() {
    console.log("Populating suspected forms.");
    const obj = JSON.parse(fs.readFileSync('pii_with_substr.json', 'utf8'));
    for await (const [key, value] of Object.entries(obj)) {
        if(value.length === 0)
            continue;

        let formWeight = 0;
        for( const entity of value){
            if(!blacklist.BLACKLIST.includes(entity.type)){
                formWeight += 1;
            }
            // Actually, we have to retrieve the particular weight for each entity-score pair and sum them up
                             // But, as the system is not under use, we put default value 1
        }
        await requestDb.createSuspectForm(key, value, formWeight);
    }
}

main().then(() => {console.log("sa")});