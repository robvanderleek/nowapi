import {clearNowapiFolder, initNowapiFolder, readCredentialsFile, sleep} from "./utils";
import fs from "fs";
import path from "path";
import signale from "signale";

const CLIENT_ID = 'Iv1.e3052d750bc19d80';

async function fetchDeviceCode() {
    const endpoint = 'https://github.com/login/device/code';
    const parameters = new URLSearchParams({client_id: CLIENT_ID});
    const headers = {"Accept": "application/json"};
    const res = await fetch(endpoint + '?' + parameters.toString(), {method: 'POST', headers: headers});
    return await res.json();
}

async function fetchRequestToken(deviceCode: string) {
    const endpoint = 'https://github.com/login/oauth/access_token';
    const parameters = new URLSearchParams({
        client_id: CLIENT_ID,
        device_code: deviceCode,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code'
    });
    const headers = {"Accept": "application/json"};
    const res = await fetch(endpoint + '?' + parameters.toString(), {method: 'POST', headers: headers});
    return await res.json();
}

async function fetchAccessToken(refreshToken: string) {
    const endpoint = 'https://github.com/login/oauth/access_token';
    const parameters = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });
    const headers = {"Accept": "application/json"};
    const res = await fetch(endpoint + '?' + parameters.toString(), {method: 'POST', headers: headers});
    return await res.json();
}

export async function login() {
    const {device_code, verification_uri, user_code, interval} = await fetchDeviceCode();
    signale.info(`Please visit: ${verification_uri}`);
    signale.info(`and enter code: ${user_code}`);
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
                signale.error('Device code expired, please run `login` again.');
                process.exit(1);
                break;
            case 'access_denied':
                signale.error('Access denied.');
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
    signale.success('Authenticated!');
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
    const res = await fetch('https://api.github.com/users/codertocat', {headers: headers});
    const headerField = res.headers.get('X-RateLimit-Limit')
    if (headerField) {
        return parseInt(headerField) === 5000;
    }
    return false;
}

export async function me() {
    const accessToken = await getAccessToken();
    if (accessToken) {
        const endpoint = 'https://api.github.com/user';
        const headers = {"Accept": "application/json", 'Authorization': `Bearer ${accessToken}`}
        const res = await fetch(endpoint, {headers: headers});
        const json = await res.json();
        signale.info(`Logged in user: ${json['login']}`);
    }
}

export function logout() {
    clearNowapiFolder();
    signale.success('Logged out!');
}