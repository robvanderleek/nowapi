import signale from "signale";
import {apiGet, apiPost} from "./api";


export async function createEndpoint(host: string) {
    const path = 'hello';
    const statusCode = 200;
    const body = 'world';
    const result = await apiPost('endpoint/create', {host, path, statusCode, body});
    signale.info(`Endpoint created: ${result['endpoint']}`);
}

export async function listEndpoints(host: string) {
    const result = await apiGet(`endpoint/list?host=${host}`);
    for (const endpoint of result) {
        signale.info(`Endpoint: ${endpoint}`);
    }
}

export async function deleteEndpoint(host: string, path: string) {
    await apiPost('endpoint/delete', {host: host, path: path});
    signale.success(`Endpoint deleted: ${host}`);
}