import signale from "signale";
import {apiGet, apiPost} from "./api";
import {getHost, printHeader} from "../utils";
import chalk from "chalk";


export async function createEndpoint(host: string, path: string, statusCode: number, body: string) {
    const result = await apiPost('endpoint/create', {host, path, statusCode, body});
    signale.info(`Endpoint created: ${result['endpoint']}`);
}

export async function listEndpoints(host: string) {
    const result = await apiGet(`endpoint/list?host=${host}`);
    printHeader(`Endpoints on host ${host}:`);
    const baseUrl = `${getHost()}/api/hosts/${host}`;
    for (const endpoint of result) {
        console.log(`- ${chalk.green(endpoint)}`);
        console.log(`  ${baseUrl}/${endpoint}`);
    }
}

export async function deleteEndpoint(host: string, path: string) {
    await apiPost('endpoint/delete', {host: host, path: path});
    signale.success(`Endpoint deleted: ${host}`);
}