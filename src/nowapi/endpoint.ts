import chalk from "chalk";
import {getHost, loadingSpinner, printInfo} from "../utils.js";
import {apiGet, apiPost} from "./api.js";
import ora from "ora";


export async function createEndpoint(host: string, path: string, statusCode: number, body: string) {
    const spinner = ora({spinner: 'earth', text: 'Setting path...', color: 'white'}).start();
    const result: any = await apiPost('endpoint/create', {host, path, statusCode, body});
    spinner.succeed(`Endpoint updated: ${result['endpoint']}`);
}

export async function listEndpoints(host: string) {
    const spinner = ora({spinner: 'earth', text: 'Loading endpoints', color: 'white'}).start();
    const result: Array<any> = await apiGet(`endpoint/list?host=${host}`);
    spinner.succeed();
    if (result && result.length > 0) {
        printInfo(`Endpoints on host ${host}:`);
        const baseUrl = `${getHost()}/api/hosts/${host}`;
        for (const endpoint of result) {
            console.log(`- ${chalk.green(endpoint)}`);
            console.log(`  ${baseUrl}/${endpoint}`);
        }
    } else {
        printInfo('No endpoints found');
    }
}

export async function showEndpoint(host: string, endpoint: string) {
    const spinner = loadingSpinner('Loading endpoint')
    const result = await apiGet(`endpoint/show?` + new URLSearchParams({host: host, endpoint: endpoint}));
    spinner.succeed();
    if (result) {
    } else {
        printInfo('Endpoint not found');
    }
}

export async function deleteEndpoint(host: string, path: string) {
    const spinner = ora({spinner: 'earth', text: 'Deleting path...', color: 'white'}).start();
    await apiPost('endpoint/delete', {host: host, path: path});
    spinner.succeed(`Path deleted: ${path} on host: ${host}`);
}