/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * ReqRes API
 * Fake data CRUD API
 *
 * The version of the OpenAPI document: 1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    LoginPost200ResponseDto,
    LoginPost400ResponseDto,
    LoginPostRequestDto,
    RegisterPost200ResponseDto,
    UnknownResourceDto,
    UserDto,
    UsersGet200ResponseDto,
    UsersIdGet200ResponseDto,
    UsersIdPut200ResponseDto,
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
     * @summary Creates a session
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    loginPost(params: {
        loginPostRequestDto: LoginPostRequestDto;
    } & RequestCallOptions): Promise<LoginPost200ResponseDto>;
    /**
     *
     * @summary Ends a session
     * @throws {HttpError}
     */
    logoutPost(params?: RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Creates a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    registerPost(params: {
        loginPostRequestDto: LoginPostRequestDto;
    } & RequestCallOptions): Promise<RegisterPost200ResponseDto>;
    /**
     *
     * @summary Fetches a user list
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    usersGet(params?: {
        queryParams?: { page?: number; per_page?: number };
    } & RequestCallOptions): Promise<UsersGet200ResponseDto>;
    /**
     *
     * @summary Deletes a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    usersIdDelete(params: {
        pathParams: { id: number };
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Fetches a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    usersIdGet(params: {
        pathParams: { id: number };
    } & RequestCallOptions): Promise<UsersIdGet200ResponseDto>;
    /**
     *
     * @summary Updates a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    usersIdPatch(params: {
        pathParams: { id: number };
    } & RequestCallOptions): Promise<UsersIdPut200ResponseDto>;
    /**
     *
     * @summary Updates a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    usersIdPut(params: {
        pathParams: { id: number };
    } & RequestCallOptions): Promise<UsersIdPut200ResponseDto>;
}

/**
 * DefaultApi - object-oriented interface
 */
export class DefaultApi extends BaseAPI implements DefaultApiInterface {
    /**
     *
     * @summary Creates a session
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async loginPost(params: {
        loginPostRequestDto: LoginPostRequestDto;
    } & RequestCallOptions): Promise<LoginPost200ResponseDto> {
        return await this.fetch(
            this.basePath + "/login",
            {
                ...params,
                method: "POST",
                body: JSON.stringify(params.loginPostRequestDto),
                headers: {
                    ...this.removeEmpty(params.headers),
                    "Content-Type": "application/json",
                },
            }
        );
    }
    /**
     *
     * @summary Ends a session
     * @throws {HttpError}
     */
    public async logoutPost(params: RequestCallOptions = {}): Promise<void> {
        return await this.fetch(
            this.basePath + "/logout",
            {
                ...params,
                method: "POST",
            }
        );
    }
    /**
     *
     * @summary Creates a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async registerPost(params: {
        loginPostRequestDto: LoginPostRequestDto;
    } & RequestCallOptions): Promise<RegisterPost200ResponseDto> {
        return await this.fetch(
            this.basePath + "/register",
            {
                ...params,
                method: "POST",
                body: JSON.stringify(params.loginPostRequestDto),
                headers: {
                    ...this.removeEmpty(params.headers),
                    "Content-Type": "application/json",
                },
            }
        );
    }
    /**
     *
     * @summary Fetches a user list
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async usersGet(params?: {
        queryParams?: { page?: number; per_page?: number };
    } & RequestCallOptions): Promise<UsersGet200ResponseDto> {
        return await this.fetch(
            this.url("/users", {}, params?.queryParams, {}), params
        );
    }
    /**
     *
     * @summary Deletes a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async usersIdDelete(params: {
        pathParams: { id: number };
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/users/{id}", params.pathParams),
            {
                ...params,
                method: "DELETE",
            }
        );
    }
    /**
     *
     * @summary Fetches a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async usersIdGet(params: {
        pathParams: { id: number };
    } & RequestCallOptions): Promise<UsersIdGet200ResponseDto> {
        return await this.fetch(
            this.url("/users/{id}", params.pathParams), params
        );
    }
    /**
     *
     * @summary Updates a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async usersIdPatch(params: {
        pathParams: { id: number };
    } & RequestCallOptions): Promise<UsersIdPut200ResponseDto> {
        return await this.fetch(
            this.url("/users/{id}", params.pathParams),
            {
                ...params,
                method: "PATCH",
            }
        );
    }
    /**
     *
     * @summary Updates a user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async usersIdPut(params: {
        pathParams: { id: number };
    } & RequestCallOptions): Promise<UsersIdPut200ResponseDto> {
        return await this.fetch(
            this.url("/users/{id}", params.pathParams),
            {
                ...params,
                method: "PUT",
            }
        );
    }
}

type ServerNames =
    | "default";

export const servers: Record<ServerNames, ApplicationApis> = {
    default: {
        defaultApi: new DefaultApi("https://reqres.in/api"),
    },
};

