import fs from "fs";
import path from "path";
import {
    clearNowapiFolder,
    initNowapiFolder,
    printError,
    printInfo,
    printSuccess,
    readCredentialsFile,
    sleep
} from "./utils.js";
import chalk from "chalk";
import nodefetch from 'node-fetch';

const CLIENT_ID = 'Iv1.e3052d750bc19d80';

interface DeviceCodeResponse {
    device_code: string;
    verification_uri: string;
    user_code: string;
    interval: number;
}

async function fetchDeviceCode(): Promise<DeviceCodeResponse> {
    const endpoint = 'https://github.com/login/device/code';
    const parameters = new URLSearchParams({client_id: CLIENT_ID});
    const headers = {"Accept": "application/json"};
    const res = await nodefetch(endpoint + '?' + parameters.toString(), {method: 'POST', headers: headers});
    if (res.ok) {
        return await res.json() as DeviceCodeResponse;
    } else {
        throw "Cloud not fetch device code from GitHub!";
    }
}

interface RequestTokenResponse {
    access_token?: string;
    refresh_token?: string;
    error?: string;
}

async function fetchRequestToken(deviceCode: string): Promise<RequestTokenResponse> {
    const endpoint = 'https://github.com/login/oauth/access_token';
    const parameters = new URLSearchParams({
        client_id: CLIENT_ID,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
    });
    const headers = {"Accept": "application/json"};
    const res = await nodefetch(endpoint + '?' + parameters.toString(), {method: 'POST', headers: headers});
    if (res.ok) {
        return await res.json() as RequestTokenResponse;
    } else {
        throw "Cloud not fetch request token from GitHub!";
    }
}

interface FetchAccessTokenResponse {
    access_token?: string;
    refresh_token?: string;
}

async function fetchAccessToken(refreshToken: string): Promise<FetchAccessTokenResponse> {
    const endpoint = 'https://github.com/login/oauth/access_token';
    const parameters = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });
    const headers = {"Accept": "application/json"};
    const res = await nodefetch(endpoint + '?' + parameters.toString(), {method: 'POST', headers: headers});
    if (res.ok) {
        return await res.json() as FetchAccessTokenResponse;
    } else {
        throw "Cloud not fetch access token from GitHub!";
    }
}

export async function login() {
    const {device_code, verification_uri, user_code, interval} = await fetchDeviceCode();
    console.log(`Please visit: ${chalk.bold(verification_uri)}`);
    console.log(`and enter code: ${chalk.bold(user_code)}`);
    let response = await fetchRequestToken(device_code);
    let accessToken = response['access_token'];
    let refreshToken = response['refresh_token'];
    while (accessToken === undefined) {
        const error = response['error'];
        switch (error) {
            case 'authorization_pending':
                await sleep(interval);
                break;
            case 'slow_down':
                await sleep(interval);
                break;
            case 'expired_token':
                printError('Device code expired, please run `login` again.');
                process.exit(1);
                break;
            case 'access_denied':
                printError('Access denied.');
                process.exit(1);
                break;
            default:
        }
        response = await fetchRequestToken(device_code);
        accessToken = response['access_token'];
        refreshToken = response['refresh_token'];
    }
    const nowapiFolder = initNowapiFolder();
    fs.writeFileSync(path.join(nowapiFolder, 'credentials.json'), JSON.stringify({
        'refreshToken': refreshToken,
        'accessToken': accessToken
    }));
    printSuccess('Authenticated!');
}

export async function getAccessToken(): Promise<string | undefined> {
    const {accessToken, refreshToken} = readCredentialsFile();
    if (accessToken) {
        if (await isAccessTokenValid(accessToken)) {
            return accessToken;
        } else {
            const response = await fetchAccessToken(refreshToken);
            const newAccessToken = response['access_token'];
            const newRefreshToken = response['refresh_token'];
            const nowapiFolder = initNowapiFolder();
            fs.writeFileSync(path.join(nowapiFolder, 'credentials.json'), JSON.stringify({
                'refreshToken': newRefreshToken,
                'accessToken': newAccessToken
            }));
            return newAccessToken;
        }
    }
}

async function isAccessTokenValid(accessToken: string): Promise<boolean> {
    const headers = {'Authorization': `Bearer ${accessToken}`};
    const res = await nodefetch('https://api.github.com/users/codertocat', {headers: headers});
    const headerField = res.headers.get('X-RateLimit-Limit')
    if (headerField) {
        return parseInt(headerField) === 5000;
    }
    return false;
}

export async function showStatus() {
    const accessToken = await getAccessToken();
    if (accessToken) {
        const endpoint = 'https://api.github.com/user';
        const headers = {"Accept": "application/json", 'Authorization': `Bearer ${accessToken}`}
        const res = await nodefetch(endpoint, {headers: headers});
        const json = await res.json() as { login: string };
        printInfo(`Logged in user: ${json['login']}`);
    }
}

export function logout() {
    clearNowapiFolder();
    printSuccess('Logged out!');
}