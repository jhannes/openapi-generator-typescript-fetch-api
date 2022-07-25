import { servers } from "../../snapshot/infectionTracker";

async function callApi() {
    const caseWorkers = await servers.current.caseWorkersApi.listCaseWorkers();

    const signal = new AbortSignal();
    await servers.current.caseWorkersApi.listCaseWorkers({ signal });

    await servers.current.casesApi.newCase({
        infectionInformationDto: undefined,
        signal,
    });
}
