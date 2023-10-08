/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * Open ID Connect
 * Open ID Connect Discovery
 *
 * The version of the OpenAPI document: 1.0.0-draft
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    DiscoveryDocumentDto,
    GrantTypeDto,
    JwksDocumentDto,
    JwksKeyDto,
    JwtHeaderDto,
    JwtPayloadDto,
    OauthErrorDto,
    ResponseTypeDto,
    TokenResponseDto,
    UserinfoDto,
} from "./model";

import { BaseAPI, RequestCallOptions, SecurityScheme } from "./base";

export interface ApplicationApis {
    discoveryApi: DiscoveryApiInterface;
    identityClientApi: IdentityClientApiInterface;
    identityProviderApi: IdentityProviderApiInterface;
}

/**
 * DiscoveryApi - object-oriented interface
 */
export interface DiscoveryApiInterface {
    /**
     *
     * @throws {HttpError}
     */
    getDiscoveryDocument(params?: RequestCallOptions): Promise<DiscoveryDocumentDto>;
    /**
     *
     * @throws {HttpError}
     */
    getJwksDocument(params?: RequestCallOptions): Promise<JwksDocumentDto>;
}

/**
 * DiscoveryApi - object-oriented interface
 */
export class DiscoveryApi extends BaseAPI implements DiscoveryApiInterface {
    /**
     *
     * @throws {HttpError}
     */
    public async getDiscoveryDocument(params: RequestCallOptions = {}): Promise<DiscoveryDocumentDto> {
        return await this.fetch(
            this.basePath + "/.well-known/openid-configuration", params
        );
    }
    /**
     *
     * @throws {HttpError}
     */
    public async getJwksDocument(params: RequestCallOptions = {}): Promise<JwksDocumentDto> {
        return await this.fetch(
            this.basePath + "/.well-known/keys", params
        );
    }
}

/**
 * IdentityClientApi - object-oriented interface
 */
export interface IdentityClientApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    handleCallback(params?: {
        queryParams?: { state?: string; code?: string; error?: string; error_description?: string };
    } & RequestCallOptions): Promise<void>;
}

/**
 * IdentityClientApi - object-oriented interface
 */
export class IdentityClientApi extends BaseAPI implements IdentityClientApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async handleCallback(params?: {
        queryParams?: { state?: string; code?: string; error?: string; error_description?: string };
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/callback", {}, params?.queryParams, {}), params
        );
    }
}

/**
 * IdentityProviderApi - object-oriented interface
 */
export interface IdentityProviderApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    fetchToken(params: {
        formParams: { grant_type: GrantTypeDto; code: string; client_id: string; client_secret?: string; redirect_uri?: string; subject_token?: string; audience?: string };
        headers: { "Authorization"?: string };
    } & RequestCallOptions): Promise<TokenResponseDto>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    getUserinfo(params: {
        headers: { "Authorization": string };
    } & RequestCallOptions): Promise<UserinfoDto>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    startAuthorization(params: {
        queryParams?: { response_type?: ResponseTypeDto; client_id: string; state?: string; redirect_uri?: string; scope?: string };
    } & RequestCallOptions): Promise<void>;
}

/**
 * IdentityProviderApi - object-oriented interface
 */
export class IdentityProviderApi extends BaseAPI implements IdentityProviderApiInterface {
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async fetchToken(params: {
        formParams: { grant_type: GrantTypeDto; code: string; client_id: string; client_secret?: string; redirect_uri?: string; subject_token?: string; audience?: string };
        headers: { "Authorization"?: string };
    } & RequestCallOptions): Promise<TokenResponseDto> {
        return await this.fetch(
            this.basePath + "/token",
            {
                ...params,
                method: "POST",
                body: this.formData(params.formParams),
                headers: {
                    ...this.removeEmpty(params.headers),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getUserinfo(params: {
        headers: { "Authorization": string };
    } & RequestCallOptions): Promise<UserinfoDto> {
        return await this.fetch(
            this.basePath + "/userinfo",
            {
                ...params,
            }
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async startAuthorization(params: {
        queryParams?: { response_type?: ResponseTypeDto; client_id: string; state?: string; redirect_uri?: string; scope?: string };
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/authorize", {}, params?.queryParams, {}), params
        );
    }
}

type ServerNames =
    | "default";

export const servers: Record<ServerNames, ApplicationApis> = {
    default: {
        discoveryApi: new DiscoveryApi(""),
        identityClientApi: new IdentityClientApi(""),
        identityProviderApi: new IdentityProviderApi(""),
    },
};

