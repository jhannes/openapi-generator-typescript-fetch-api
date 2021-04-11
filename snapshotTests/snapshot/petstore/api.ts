/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * OpenAPI Petstore
 * This is a sample server Petstore server. For this sample, you can use the api key \"special-key\" to test the authorization filters
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    CategoryDto,
    InlineObject1Dto,
    InlineObjectDto,
    OrderDto,
    PetDto,
    TagDto,
    UserDto,
} from "./model";

import { BaseAPI, SecurityScheme } from "./base";

export interface ApplicationApis {
    petApi: PetApiInterface;
    storeApi: StoreApiInterface;
    userApi: UserApiInterface;
}

/**
 * PetApi - object-oriented interface
 */
export interface PetApiInterface {
    /**
     *
     * @summary Add a new pet to the store
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof PetApi
     */
    addPet(params: {
        petDto?: PetDto;
        security: petstore_auth;
    }): Promise<void>;
    /**
     *
     * @summary Deletes a pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof PetApi
     */
    deletePet(params: {
        pathParams: { petId: number };
        headers: { "api_key": string };
        security: petstore_auth;
    }): Promise<void>;
    /**
     *
     * @summary Finds Pets by status
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof PetApi
     */
    findPetsByStatus(params: {
        queryParams?: { status?: Array<"available" | "pending" | "sold">,  };
        security: petstore_auth;
    }): Promise<Array<PetDto>>;
    /**
     *
     * @summary Finds Pets by tags
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof PetApi
     */
    findPetsByTags(params: {
        queryParams?: { tags?: Array<string>,  };
        security: petstore_auth;
    }): Promise<Array<PetDto>>;
    /**
     *
     * @summary Find pet by ID
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof PetApi
     */
    getPetById(params: {
        pathParams: { petId: number };
        security: api_key | petstore_auth;
    }): Promise<PetDto>;
    /**
     *
     * @summary Update an existing pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof PetApi
     */
    updatePet(params: {
        petDto?: PetDto;
        security: petstore_auth;
    }): Promise<void>;
    /**
     *
     * @summary Updates a pet in the store with form data
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof PetApi
     */
    updatePetWithForm(params: {
        pathParams: { petId: string };
        formParams: { name: string; status: string; }
        security: petstore_auth;
    }): Promise<void>;
    /**
     *
     * @summary uploads an image
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof PetApi
     */
    uploadFile(params: {
        pathParams: { petId: number };
        formParams: { additionalMetadata: string; file: Blob; }
        security: petstore_auth;
    }): Promise<void>;
}

/**
 * PetApi - object-oriented interface
 */
export class PetApi extends BaseAPI implements PetApiInterface {
    /**
     *
     * @summary Add a new pet to the store
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async addPet(params: {
        petDto?: PetDto;
        security: petstore_auth;
    }): Promise<void> {
        return await this.POST(
            this.basePath + "/pet",
            JSON.stringify(params.petDto),
            {
                ...params.security?.headers(),
                "Content-Type": "application/json",
            }
        );
    }
    /**
     *
     * @summary Deletes a pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async deletePet(params: {
        pathParams: { petId: number };
        headers: { "api_key": string };
        security: petstore_auth;
    }): Promise<void> {
        return await this.DELETE(
            this.url("/pet/{petId}", params.pathParams),
            undefined,
            {
                ...params.security?.headers(),
                ...params.headers,}
        );
    }
    /**
     *
     * @summary Finds Pets by status
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async findPetsByStatus(params: {
        queryParams?: { status?: Array<"available" | "pending" | "sold">,  };
        security: petstore_auth;
    }): Promise<Array<PetDto>> {
        return await this.GET(
            this.url("/pet/findByStatus", {}, params?.queryParams, {}),
            undefined,
            {
                ...params.security?.headers(),}
        );
    }
    /**
     *
     * @summary Finds Pets by tags
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async findPetsByTags(params: {
        queryParams?: { tags?: Array<string>,  };
        security: petstore_auth;
    }): Promise<Array<PetDto>> {
        return await this.GET(
            this.url("/pet/findByTags", {}, params?.queryParams, {}),
            undefined,
            {
                ...params.security?.headers(),}
        );
    }
    /**
     *
     * @summary Find pet by ID
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getPetById(params: {
        pathParams: { petId: number };
        security: api_key | petstore_auth;
    }): Promise<PetDto> {
        return await this.GET(
            this.url("/pet/{petId}", params.pathParams),
            undefined,
            {
                ...params.security?.headers(),}
        );
    }
    /**
     *
     * @summary Update an existing pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async updatePet(params: {
        petDto?: PetDto;
        security: petstore_auth;
    }): Promise<void> {
        return await this.PUT(
            this.basePath + "/pet",
            JSON.stringify(params.petDto),
            {
                ...params.security?.headers(),
                "Content-Type": "application/json",
            }
        );
    }
    /**
     *
     * @summary Updates a pet in the store with form data
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async updatePetWithForm(params: {
        pathParams: { petId: string };
        formParams: { name: string; status: string; }
        security: petstore_auth;
    }): Promise<void> {
        return await this.POST(
            this.url("/pet/{petId}", params.pathParams),
            this.formData(params.formParams),
            {
                ...params.security?.headers(),
                "Content-Type": "application/x-www-form-urlencoded",
            }
        );
    }
    /**
     *
     * @summary uploads an image
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async uploadFile(params: {
        pathParams: { petId: number };
        formParams: { additionalMetadata: string; file: Blob; }
        security: petstore_auth;
    }): Promise<void> {
        return await this.POST(
            this.url("/pet/{petId}/uploadImage", params.pathParams),
            this.formData(params.formParams),
            {
                ...params.security?.headers(),
                "Content-Type": "multipart/form-data",
            }
        );
    }
}
/**
 * StoreApi - object-oriented interface
 */
export interface StoreApiInterface {
    /**
     *
     * @summary Delete purchase order by ID
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof StoreApi
     */
    deleteOrder(params: {
        pathParams: { orderId: string };
    }): Promise<void>;
    /**
     *
     * @summary Returns pet inventories by status
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof StoreApi
     */
    getInventory(params: {
        security: api_key;
    }): Promise<{ [key: string]: number; }>;
    /**
     *
     * @summary Find purchase order by ID
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof StoreApi
     */
    getOrderById(params: {
        pathParams: { orderId: string };
    }): Promise<OrderDto>;
    /**
     *
     * @summary Place an order for a pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof StoreApi
     */
    placeOrder(params: {
        orderDto?: OrderDto;
    }): Promise<OrderDto>;
}

/**
 * StoreApi - object-oriented interface
 */
export class StoreApi extends BaseAPI implements StoreApiInterface {
    /**
     *
     * @summary Delete purchase order by ID
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async deleteOrder(params: {
        pathParams: { orderId: string };
    }): Promise<void> {
        return await this.DELETE(
            this.url("/store/order/{orderId}", params.pathParams),
            undefined,
            {}
        );
    }
    /**
     *
     * @summary Returns pet inventories by status
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getInventory(params: {
        security: api_key;
    }): Promise<{ [key: string]: number; }> {
        return await this.GET(
            this.basePath + "/store/inventory",
            undefined,
            {
                ...params.security?.headers(),}
        );
    }
    /**
     *
     * @summary Find purchase order by ID
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getOrderById(params: {
        pathParams: { orderId: string };
    }): Promise<OrderDto> {
        return await this.GET(
            this.url("/store/order/{orderId}", params.pathParams),
            undefined,
            {}
        );
    }
    /**
     *
     * @summary Place an order for a pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async placeOrder(params: {
        orderDto?: OrderDto;
    }): Promise<OrderDto> {
        return await this.POST(
            this.basePath + "/store/order",
            JSON.stringify(params.orderDto),
            {
                "Content-Type": "application/json",
            }
        );
    }
}
/**
 * UserApi - object-oriented interface
 */
export interface UserApiInterface {
    /**
     *
     * @summary Create user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof UserApi
     */
    createUser(params: {
        userDto?: UserDto;
    }): Promise<void>;
    /**
     *
     * @summary Creates list of users with given input array
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof UserApi
     */
    createUsersWithArrayInput(params: {
        userDto?: Array<UserDto>;
    }): Promise<void>;
    /**
     *
     * @summary Creates list of users with given input array
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof UserApi
     */
    createUsersWithListInput(params: {
        userDto?: Array<UserDto>;
    }): Promise<void>;
    /**
     *
     * @summary Delete user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof UserApi
     */
    deleteUser(params: {
        pathParams: { username: string };
    }): Promise<void>;
    /**
     *
     * @summary Get user by user name
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof UserApi
     */
    getUserByName(params: {
        pathParams: { username: string };
    }): Promise<UserDto>;
    /**
     *
     * @summary Logs user into the system
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof UserApi
     */
    loginUser(params: {
        queryParams?: { username?: string, password?: string,  };
    }): Promise<string>;
    /**
     *
     * @summary Logs out current logged in user session
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof UserApi
     */
    logoutUser(): Promise<void>;
    /**
     *
     * @summary Updated user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof UserApi
     */
    updateUser(params: {
        pathParams: { username: string };
        userDto?: UserDto;
    }): Promise<void>;
}

/**
 * UserApi - object-oriented interface
 */
export class UserApi extends BaseAPI implements UserApiInterface {
    /**
     *
     * @summary Create user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async createUser(params: {
        userDto?: UserDto;
    }): Promise<void> {
        return await this.POST(
            this.basePath + "/user",
            JSON.stringify(params.userDto),
            {
                "Content-Type": "application/json",
            }
        );
    }
    /**
     *
     * @summary Creates list of users with given input array
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async createUsersWithArrayInput(params: {
        userDto?: Array<UserDto>;
    }): Promise<void> {
        return await this.POST(
            this.basePath + "/user/createWithArray",
            JSON.stringify(params.userDto),
            {
                "Content-Type": "application/json",
            }
        );
    }
    /**
     *
     * @summary Creates list of users with given input array
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async createUsersWithListInput(params: {
        userDto?: Array<UserDto>;
    }): Promise<void> {
        return await this.POST(
            this.basePath + "/user/createWithList",
            JSON.stringify(params.userDto),
            {
                "Content-Type": "application/json",
            }
        );
    }
    /**
     *
     * @summary Delete user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async deleteUser(params: {
        pathParams: { username: string };
    }): Promise<void> {
        return await this.DELETE(
            this.url("/user/{username}", params.pathParams),
            undefined,
            {}
        );
    }
    /**
     *
     * @summary Get user by user name
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getUserByName(params: {
        pathParams: { username: string };
    }): Promise<UserDto> {
        return await this.GET(
            this.url("/user/{username}", params.pathParams),
            undefined,
            {}
        );
    }
    /**
     *
     * @summary Logs user into the system
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async loginUser(params: {
        queryParams?: { username?: string, password?: string,  };
    }): Promise<string> {
        return await this.GET(
            this.url("/user/login", {}, params?.queryParams, {}),
            undefined,
            {}
        );
    }
    /**
     *
     * @summary Logs out current logged in user session
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async logoutUser(): Promise<void> {
        return await this.GET(
            this.basePath + "/user/logout",
            undefined,
            {}
        );
    }
    /**
     *
     * @summary Updated user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async updateUser(params: {
        pathParams: { username: string };
        userDto?: UserDto;
    }): Promise<void> {
        return await this.PUT(
            this.url("/user/{username}", params.pathParams),
            JSON.stringify(params.userDto),
            {
                "Content-Type": "application/json",
            }
        );
    }
}

type ServerNames =
    | "default";

export const servers: Record<ServerNames, ApplicationApis> = {
    default: {
        petApi: new PetApi("http://petstore.swagger.io/v2"),
        storeApi: new StoreApi("http://petstore.swagger.io/v2"),
        userApi: new UserApi("http://petstore.swagger.io/v2"),
    },
};


export class api_key implements SecurityScheme {
    constructor(private bearerToken: string) {}

    headers(): Record<string, string> {
        return {
            "Authorization": `Bearer ${this.bearerToken}`,
        }
    }
}

export class petstore_auth implements SecurityScheme {
    constructor(private bearerToken: string) {}

    headers(): Record<string, string> {
        return {
            "Authorization": `Bearer ${this.bearerToken}`,
        }
    }
}
