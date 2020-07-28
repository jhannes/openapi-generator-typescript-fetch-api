/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * Infection Tracker
 * Infection Tracker - A case management system for tracking the spread of diseases
 *
 * The version of the OpenAPI document: 1.0.0-draft
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    CaseWorkerDto,
    ExposureDto,
    InfectionDto,
    InfectionInformationDto,
    UserRoleDto,
} from "../model";

import {
    ApplicationApis,
    CaseWorkersApiInterface,
    CasesApiInterface,
    ExposuresApiInterface,
} from "../api";

function reject(operation: string) {
    return () => Promise.reject(new Error("Unexpected function call " + operation));
}

export function mockApplicationApis({
    caseWorkersApi = mockCaseWorkersApi(),
    casesApi = mockCasesApi(),
    exposuresApi = mockExposuresApi(),
}: Partial<ApplicationApis>): ApplicationApis {
    return { caseWorkersApi, casesApi, exposuresApi };
}

export function mockCaseWorkersApi(operations: {
    listCaseWorkers?: () => Promise<CaseWorkerDto>;
    registerCaseWorker?: () => Promise<void>;
} = {}): CaseWorkersApiInterface {
    return {
        listCaseWorkers: operations.listCaseWorkers || reject("CaseWorkersApi.listCaseWorkers"),
        registerCaseWorker: operations.registerCaseWorker || reject("CaseWorkersApi.registerCaseWorker"),
    };
}

export function mockCasesApi(operations: {
    getCaseDetails?: () => Promise<InfectionDto>;
    listCases?: () => Promise<InfectionDto>;
    newCase?: () => Promise<void>;
    registerExposure?: () => Promise<void>;
} = {}): CasesApiInterface {
    return {
        getCaseDetails: operations.getCaseDetails || reject("CasesApi.getCaseDetails"),
        listCases: operations.listCases || reject("CasesApi.listCases"),
        newCase: operations.newCase || reject("CasesApi.newCase"),
        registerExposure: operations.registerExposure || reject("CasesApi.registerExposure"),
    };
}

export function mockExposuresApi(operations: {
    listExposures?: () => Promise<ExposureDto>;
    updateExposure?: () => Promise<void>;
} = {}): ExposuresApiInterface {
    return {
        listExposures: operations.listExposures || reject("ExposuresApi.listExposures"),
        updateExposure: operations.updateExposure || reject("ExposuresApi.updateExposure"),
    };
}