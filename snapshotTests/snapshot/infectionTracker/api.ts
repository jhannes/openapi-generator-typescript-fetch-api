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
} from "./model";

import { BaseAPI, SecurityScheme } from "./base";

export interface ApplicationApis {
    caseWorkersApi: CaseWorkersApiInterface;
    casesApi: CasesApiInterface;
    exposuresApi: ExposuresApiInterface;
}

/**
 * CaseWorkersApi - object-oriented interface
 */
export interface CaseWorkersApiInterface {
    /**
     *
     * @throws {HttpError}
     */
    listCaseWorkers(): Promise<CaseWorkerDto>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    registerCaseWorker(params: {
        caseWorkerDto?: CaseWorkerDto;
    }): Promise<void>;
}

/**
 * CaseWorkersApi - object-oriented interface
 */
export class CaseWorkersApi extends BaseAPI implements CaseWorkersApiInterface {
    /**
     *
     * @throws {HttpError}
     */
    public async listCaseWorkers(): Promise<CaseWorkerDto> {
        return await this.fetch(
            this.basePath + "/api/caseWorkers"
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async registerCaseWorker(params: {
        caseWorkerDto?: CaseWorkerDto;
    }): Promise<void> {
        return await this.fetch(
            this.basePath + "/api/caseWorkers",
            {
                method: "POST",
                body: JSON.stringify(params.caseWorkerDto),
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
    }
}
/**
 * CasesApi - object-oriented interface
 */
export interface CasesApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    getCaseDetails(params: {
        pathParams: { caseId: string };
    }): Promise<InfectionDto>;
    /**
     *
     * @throws {HttpError}
     */
    listCases(): Promise<InfectionDto>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    newCase(params: {
        infectionInformationDto?: InfectionInformationDto;
    }): Promise<void>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    registerExposure(params: {
        pathParams: { caseId: string };
        exposureDto?: ExposureDto;
    }): Promise<void>;
}

/**
 * CasesApi - object-oriented interface
 */
export class CasesApi extends BaseAPI implements CasesApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getCaseDetails(params: {
        pathParams: { caseId: string };
    }): Promise<InfectionDto> {
        return await this.fetch(
            this.url("/api/cases/{caseId}", params.pathParams)
        );
    }
    /**
     *
     * @throws {HttpError}
     */
    public async listCases(): Promise<InfectionDto> {
        return await this.fetch(
            this.basePath + "/api/cases"
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async newCase(params: {
        infectionInformationDto?: InfectionInformationDto;
    }): Promise<void> {
        return await this.fetch(
            this.basePath + "/api/cases",
            {
                method: "POST",
                body: JSON.stringify(params.infectionInformationDto),
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async registerExposure(params: {
        pathParams: { caseId: string };
        exposureDto?: ExposureDto;
    }): Promise<void> {
        return await this.fetch(
            this.url("/api/cases/{caseId}/exposures", params.pathParams),
            {
                method: "POST",
                body: JSON.stringify(params.exposureDto),
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
    }
}
/**
 * ExposuresApi - object-oriented interface
 */
export interface ExposuresApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    listExposures(params: {
        queryParams?: { exposureDate?: Array<Date>, };
    }): Promise<ExposureDto>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    updateExposure(params: {
        pathParams: { exposureId: string };
        exposureDto?: ExposureDto;
    }): Promise<void>;
}

/**
 * ExposuresApi - object-oriented interface
 */
export class ExposuresApi extends BaseAPI implements ExposuresApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async listExposures(params: {
        queryParams?: { exposureDate?: Array<Date>,  };
    }): Promise<ExposureDto> {
        return await this.fetch(
            this.url("/api/exposures", {}, params?.queryParams, {
                exposureDate: { delimiter: "|", format: "date" },})
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async updateExposure(params: {
        pathParams: { exposureId: string };
        exposureDto?: ExposureDto;
    }): Promise<void> {
        return await this.fetch(
            this.url("/api/exposures/{exposureId}", params.pathParams),
            {
                method: "PUT",
                body: JSON.stringify(params.exposureDto),
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
    }
}

type ServerNames =
    | "current"
    | "production";

export const servers: Record<ServerNames, ApplicationApis> = {
    "current": {
        caseWorkersApi: new CaseWorkersApi("/api"),
        casesApi: new CasesApi("/api"),
        exposuresApi: new ExposuresApi("/api"),
    },
    "production": {
        caseWorkersApi: new CaseWorkersApi("https://infectiontracker.example.gov/api"),
        casesApi: new CasesApi("https://infectiontracker.example.gov/api"),
        exposuresApi: new ExposuresApi("https://infectiontracker.example.gov/api"),
    },
};

