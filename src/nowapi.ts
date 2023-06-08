import signale from "signale";
import {getAccessToken} from "./github";

const HOST = 'http://localhost:3000';

export async function createHost() {
    const accessToken = await getAccessToken();
    if (accessToken) {
        const endpoint = `${HOST}/api/host/create`;
        const headers = {"Accept": "application/json", 'Authorization':  `Bearer ${accessToken}`}
        const res = await fetch(endpoint, {method: 'POST', headers: headers});
        const json = await res.json();
        signale.info(`Host created: ${json['host']}`);
    }
}

export async function listHosts() {
    const accessToken = await getAccessToken();
    if (accessToken) {
        const endpoint = `${HOST}/api/host/list`;
        const headers = {"Accept": "application/json", 'Authorization':  `Bearer ${accessToken}`}
        const res = await fetch(endpoint, {headers: headers});
        const json = await res.json();
        for (const host of json) {
            signale.info(`Host: ${host}`);
        }
    }
}

export async function deleteHost(host: string) {
    const accessToken = await getAccessToken();
    if (accessToken) {
        const endpoint = `${HOST}/api/host/delete`;
        const headers = {"Content-Type": "application/json", 'Authorization':  `Bearer ${accessToken}`}
        const body = JSON.stringify({name: host});
        await fetch(endpoint, {method: 'POST', headers: headers, body: body});
        signale.success(`Host deleted: ${host}`);
    }
}