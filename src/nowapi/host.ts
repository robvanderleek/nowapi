import signale from "signale";
import {apiGet, apiPost} from "./api";

export async function createHost() {
    const result = await apiPost('host/create');
    signale.info(`Host created: ${result['host']}`);
}

export async function listHosts() {
    const result = await apiGet('host/list');
    for (const host of result) {
        signale.info(`Host: ${host}`);
    }
}

export async function deleteHost(host: string) {
    await apiPost('host/delete', {name: host});
    signale.success(`Host deleted: ${host}`);
}