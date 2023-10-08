/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * Poly API
 * An example of a polymorphic API
 *
 * The version of the OpenAPI document: 0.1.0
 * Contact: johannes@brodwall.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    AnyPartyDto,
    CreationErrorDto,
    DuplicateIdentifierErrorDto,
    GeneralErrorDto,
    IllegalEmailAddressErrorDto,
    LogMessageDto,
    NotFoundErrorDto,
    OrganizationDto,
    PersonDto,
    UpdateErrorDto,
} from "./model";

import { BaseAPI, RequestCallOptions, SecurityScheme } from "./base";

export interface ApplicationApis {
    defaultApi: DefaultApiInterface;
}

/**
 * DefaultApi - object-oriented interface
 */
export interface DefaultApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    logMessage(params?: {
        logMessageDto?: LogMessageDto;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @throws {HttpError}
     */
    partiesGet(params?: RequestCallOptions): Promise<AnyPartyDto|undefined>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    partiesIdPut(params: {
        pathParams: { id: string };
        anyPartyDto?: AnyPartyDto;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    partiesPost(params?: {
        anyPartyDto?: AnyPartyDto;
    } & RequestCallOptions): Promise<void>;
}

/**
 * DefaultApi - object-oriented interface
 */
export class DefaultApi extends BaseAPI implements DefaultApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async logMessage(params?: {
        logMessageDto?: LogMessageDto;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/log",
            {
                ...params,
                method: "POST",
                body: params?.logMessageDto ? JSON.stringify(params.logMessageDto) : undefined,
                headers: {
                    ...this.removeEmpty(params?.headers),
                    "Content-Type": "application/json",
                },
            }
        );
    }
    /**
     *
     * @throws {HttpError}
     */
    public async partiesGet(params: RequestCallOptions = {}): Promise<AnyPartyDto|undefined> {
        return await this.fetch(
            this.basePath + "/parties", params
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async partiesIdPut(params: {
        pathParams: { id: string };
        anyPartyDto?: AnyPartyDto;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/parties/{id}", params.pathParams),
            {
                ...params,
                method: "PUT",
                body: JSON.stringify(params.anyPartyDto),
                headers: {
                    ...this.removeEmpty(params.headers),
                    "Content-Type": "application/json",
                },
            }
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async partiesPost(params?: {
        anyPartyDto?: AnyPartyDto;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/parties",
            {
                ...params,
                method: "POST",
                body: params?.anyPartyDto ? JSON.stringify(params.anyPartyDto) : undefined,
                headers: {
                    ...this.removeEmpty(params?.headers),
                    "Content-Type": "application/json",
                },
            }
        );
    }
}

type ServerNames =
    | "default";

export const servers: Record<ServerNames, ApplicationApis> = {
    default: {
        defaultApi: new DefaultApi(""),
    },
};

