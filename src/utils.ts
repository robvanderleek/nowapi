import os from "os";
import path from "path";
import fs, {readFileSync} from "fs";
import signale from "signale";

export async function sleep(seconds: number) {
    return new Promise((r) => setTimeout(r, seconds * 1000));
}

function getNowapiFolderLocation() {
    const homedir = os.homedir();
    if (process.platform === 'win32') {
        return path.join(homedir, 'AppData', 'Local', 'nowapi', 'Data');
    } else {
        return path.join(homedir, '.local', 'share', 'nowapi');
    }
}

export function initNowapiFolder() {
    const folderLocation = getNowapiFolderLocation();
    if (!fs.existsSync(folderLocation)) {
        fs.mkdirSync(folderLocation, {recursive: true});
        signale.log(`Created NowAPI cache folder: ${folderLocation}`);
    }
    return folderLocation;
}

export function readAccessToken(): string | undefined {
    const nowapiFolder = initNowapiFolder();
    const credentialsFile = path.join(nowapiFolder, 'credentials.json');
    if (!fs.existsSync(credentialsFile)) {
        signale.error('Could not find credentials file');
        return undefined;
    }
    const content = fs.readFileSync(credentialsFile).toString();
    return JSON.parse(content)['access_token'];
}

export function clearNowapiFolder() {
    const folder = initNowapiFolder();
    fs.readdirSync(folder).forEach(f => f.endsWith(".json") && fs.rmSync(`${folder}/${f}`));
}