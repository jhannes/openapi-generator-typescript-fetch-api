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
    NotFoundErrorDto,
    OrganizationDto,
    PersonDto,
    UpdateErrorDto,
} from "./model";

import { BaseAPI } from "./base";

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
     * @memberof DefaultApi
     */
    partiesGet(): Promise<AnyPartyDto>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    partiesIdPut(params?: {
        pathParams: { id: string };
        anyPartyDto?: AnyPartyDto;
    }): Promise<void>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    partiesPost(params?: {
        anyPartyDto?: AnyPartyDto;
    }): Promise<void>;
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
    public async partiesGet(): Promise<AnyPartyDto> {
        return await this.GET(
            "/parties",
            {},
            undefined
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
    }): Promise<void> {
        return await this.PUT(
            this.path("/parties/{id}", params.pathParams),
            {},
            { body: params.anyPartyDto, contentType: "application/json" }
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async partiesPost(params: {
        anyPartyDto?: AnyPartyDto;
    }): Promise<void> {
        return await this.POST(
            "/parties",
            {},
            { body: params.anyPartyDto, contentType: "application/json" }
        );
    }
}

export const servers: ApplicationApis[] = [
    {
        defaultApi: new DefaultApi("/"),
    },
];

