import {getHost} from "../utils.js";
import {getAccessToken} from "../github.js";
import fetch from 'node-fetch';

export async function apiPost<T>(endpoint: string, data?: object) {
    const accessToken = await getAccessToken();
    const url = `${getHost()}/api/${endpoint}`;
    let res;
    if (data) {
        const headers = {
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        };
        const body = JSON.stringify(data);
        res = await fetch(url, {method: 'POST', headers: headers, body: body});
    } else {
        const headers = {"Accept": "application/json", 'Authorization': `Bearer ${accessToken}`};
        res = await fetch(url, {method: 'POST', headers: headers});
    }
    if (res.ok) {
        return await res.json() as T;
    } else {
        throw Error(res.statusText);
    }
}

export async function apiGet<T>(endpoint: string): Promise<T> {
    const accessToken = await getAccessToken();
    const url = `${getHost()}/api/${endpoint}`;
    const headers = {"Accept": "application/json", 'Authorization': `Bearer ${accessToken}`}
    const res = await fetch(url, {headers: headers});
    if (res.ok) {
        return await res.json() as T;
    } else {
        throw Error(res.statusText);
    }
}