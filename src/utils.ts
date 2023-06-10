import os from "os";
import path from "path";
import fs from "fs";
import signale from "signale";
import chalk from "chalk";

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

export function readCredentialsFile(): {accessToken: string, refreshToken: string} {
    const nowapiFolder = initNowapiFolder();
    const credentialsFile = path.join(nowapiFolder, 'credentials.json');
    if (!fs.existsSync(credentialsFile)) {
        throw new Error('Could not find credentials file')
    }
    const content = fs.readFileSync(credentialsFile).toString();
    return JSON.parse(content) as {accessToken: string, refreshToken: string};
}

export function clearNowapiFolder() {
    const folder = initNowapiFolder();
    fs.readdirSync(folder).forEach(f => f.endsWith(".json") && fs.rmSync(`${folder}/${f}`));
}

export function getHost() {
    return process.env.NOWAPI_HOST || 'https://nowapi.vercel.app';
}

export function printInfo(text: string) {
    console.log(chalk.bold(text));
}

export function printSuccess(text: string) {
    console.log(chalk.green(text));
}

export function printError(text: string) {
    console.log(chalk.red(text));
}

