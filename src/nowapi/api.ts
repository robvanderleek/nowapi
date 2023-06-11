import {getHost} from "../utils.js";
import {getAccessToken} from "../github.js";

export async function apiPost(endpoint: string, data?: object) {
    const accessToken = await getAccessToken();
    const url = `${getHost()}/api/${endpoint}`;
    let res;
    if (data) {
        const headers = {"Accept": "application/json", 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`};
        const body = JSON.stringify(data);
        res = await fetch(url, {method: 'POST', headers: headers, body: body});
    } else {
        const headers = {"Accept": "application/json", 'Authorization': `Bearer ${accessToken}`};
        res = await fetch(url, {method: 'POST', headers: headers});
    }
    if (res.ok) {
        return await res.json();
    } else {
        throw Error(res.statusText);
    }
}

export async function apiGet(endpoint: string) {
    const accessToken = await getAccessToken();
    const url = `${getHost()}/api/${endpoint}`;
    const headers = {"Accept": "application/json", 'Authorization': `Bearer ${accessToken}`}
    const res = await fetch(url, {headers: headers});
    if (res.ok) {
        return await res.json();
    } else {
        throw Error(res.statusText);
    }
}