import * as path from "path";
import * as dotenv from "dotenv";
import * as fs from "fs";

const local = path.join(__dirname, '/../../.env.local');
const original = dotenv.load({
    path: path.join(__dirname, '/../../.env')
}).parsed || {};
if (fs.existsSync(local)) {
    process.env = {
        ...process.env,
        ...original,
        ...dotenv.load({path: local}).parsed
    };
}