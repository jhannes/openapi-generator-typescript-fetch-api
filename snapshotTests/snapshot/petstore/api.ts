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
    OrderDto,
    PetDto,
    TagDto,
    UserDto,
} from "./model";

import { BaseAPI, RequestCallOptions, SecurityScheme } from "./base";

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
     */
    addPet(params: {
        petDto?: PetDto;
        security: petstore_auth;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Deletes a pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    deletePet(params: {
        pathParams: { petId: number };
        headers: { "api_key"?: string };
        security: petstore_auth;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Finds Pets by status
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    findPetsByStatus(params: {
        queryParams?: { status?: Array<"available" | "pending" | "sold"> };
        security: petstore_auth;
    } & RequestCallOptions): Promise<Array<PetDto>>;
    /**
     *
     * @summary Finds Pets by tags
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    findPetsByTags(params: {
        queryParams?: { tags?: Array<string> };
        security: petstore_auth;
    } & RequestCallOptions): Promise<Array<PetDto>>;
    /**
     *
     * @summary Find pet by ID
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    getPetById(params: {
        pathParams: { petId: number };
        security: petstore_auth | api_key;
    } & RequestCallOptions): Promise<PetDto>;
    /**
     *
     * @summary Update an existing pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    updatePet(params: {
        petDto?: PetDto;
        security: petstore_auth;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Updates a pet in the store with form data
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    updatePetWithForm(params: {
        pathParams: { petId: string };
        formParams: { name?: string; status?: string };
        security: petstore_auth;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary uploads an image
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    uploadFile(params: {
        pathParams: { petId: number };
        formParams: { additionalMetadata?: string; file?: Blob };
        security: petstore_auth;
    } & RequestCallOptions): Promise<void>;
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
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/pet",
            {
                ...params,
                method: "POST",
                body: JSON.stringify(params.petDto),
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                    "Content-Type": "application/json",
                },
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
        headers: { "api_key"?: string };
        security: petstore_auth;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/pet/{petId}", params.pathParams),
            {
                ...params,
                method: "DELETE",
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                },
            }
        );
    }
    /**
     *
     * @summary Finds Pets by status
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async findPetsByStatus(params: {
        queryParams?: { status?: Array<"available" | "pending" | "sold"> };
        security: petstore_auth;
    } & RequestCallOptions): Promise<Array<PetDto>> {
        return await this.fetch(
            this.url("/pet/findByStatus", {}, params?.queryParams, {}),
            {
                ...params,
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                },
            }
        );
    }
    /**
     *
     * @summary Finds Pets by tags
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async findPetsByTags(params: {
        queryParams?: { tags?: Array<string> };
        security: petstore_auth;
    } & RequestCallOptions): Promise<Array<PetDto>> {
        return await this.fetch(
            this.url("/pet/findByTags", {}, params?.queryParams, {}),
            {
                ...params,
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                },
            }
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
        security: petstore_auth | api_key;
    } & RequestCallOptions): Promise<PetDto> {
        return await this.fetch(
            this.url("/pet/{petId}", params.pathParams),
            {
                ...params,
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                },
            }
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
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/pet",
            {
                ...params,
                method: "PUT",
                body: JSON.stringify(params.petDto),
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                    "Content-Type": "application/json",
                },
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
        formParams: { name?: string; status?: string };
        security: petstore_auth;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/pet/{petId}", params.pathParams),
            {
                ...params,
                method: "POST",
                body: this.formData(params.formParams),
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                    "Content-Type": "application/x-www-form-urlencoded",
                },
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
        formParams: { additionalMetadata?: string; file?: Blob };
        security: petstore_auth;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/pet/{petId}/uploadImage", params.pathParams),
            {
                ...params,
                method: "POST",
                body: this.formData(params.formParams),
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                    "Content-Type": "multipart/form-data",
                },
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
     */
    deleteOrder(params: {
        pathParams: { orderId: string };
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Returns pet inventories by status
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    getInventory(params: {
        queryParams?: { effectiveDateTime?: Date };
        security: api_key;
    } & RequestCallOptions): Promise<{ [key: string]: number; }>;
    /**
     *
     * @summary Find purchase order by ID
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    getOrderById(params: {
        pathParams: { orderId: string };
    } & RequestCallOptions): Promise<OrderDto>;
    /**
     *
     * @summary Place an order for a pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    placeOrder(params?: {
        orderDto?: OrderDto;
    } & RequestCallOptions): Promise<OrderDto>;
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
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/store/order/{orderId}", params.pathParams),
            {
                ...params,
                method: "DELETE",
            }
        );
    }
    /**
     *
     * @summary Returns pet inventories by status
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getInventory(params: {
        queryParams?: { effectiveDateTime?: Date };
        security: api_key;
    } & RequestCallOptions): Promise<{ [key: string]: number; }> {
        return await this.fetch(
            this.url("/store/inventory", {}, params?.queryParams, {}),
            {
                ...params,
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                },
            }
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
    } & RequestCallOptions): Promise<OrderDto> {
        return await this.fetch(
            this.url("/store/order/{orderId}", params.pathParams), params
        );
    }
    /**
     *
     * @summary Place an order for a pet
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async placeOrder(params?: {
        orderDto?: OrderDto;
    } & RequestCallOptions): Promise<OrderDto> {
        return await this.fetch(
            this.basePath + "/store/order",
            {
                ...params,
                method: "POST",
                body: params?.orderDto ? JSON.stringify(params.orderDto) : undefined,
                headers: {
                    ...this.removeEmpty(params?.headers),
                    "Content-Type": "application/json",
                },
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
     */
    createUser(params?: {
        userDto?: UserDto;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Creates list of users with given input array
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    createUsersWithArrayInput(params?: {
        userDto?: Array<UserDto>;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Creates list of users with given input array
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    createUsersWithListInput(params?: {
        userDto?: Array<UserDto>;
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Delete user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    deleteUser(params: {
        pathParams: { username: string };
    } & RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Get the currently logged in user
     * @throws {HttpError}
     */
    getCurrentUser(params: {
        security: petstore_auth;
    } & RequestCallOptions): Promise<UserDto>;
    /**
     *
     * @summary Get user by user name
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    getUserByName(params: {
        pathParams: { username: string };
    } & RequestCallOptions): Promise<UserDto>;
    /**
     *
     * @summary Logs user into the system
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    loginUser(params?: {
        queryParams?: { username?: string; password?: string };
    } & RequestCallOptions): Promise<string>;
    /**
     *
     * @summary Logs out current logged in user session
     * @throws {HttpError}
     */
    logoutUser(params?: RequestCallOptions): Promise<void>;
    /**
     *
     * @summary Updated user
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    updateUser(params: {
        pathParams: { username: string };
        userDto?: UserDto;
    } & RequestCallOptions): Promise<void>;
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
    public async createUser(params?: {
        userDto?: UserDto;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/user",
            {
                ...params,
                method: "POST",
                body: params?.userDto ? JSON.stringify(params.userDto) : undefined,
                headers: {
                    ...this.removeEmpty(params?.headers),
                    "Content-Type": "application/json",
                },
            }
        );
    }
    /**
     *
     * @summary Creates list of users with given input array
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async createUsersWithArrayInput(params?: {
        userDto?: Array<UserDto>;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/user/createWithArray",
            {
                ...params,
                method: "POST",
                body: params?.userDto ? JSON.stringify(params.userDto) : undefined,
                headers: {
                    ...this.removeEmpty(params?.headers),
                    "Content-Type": "application/json",
                },
            }
        );
    }
    /**
     *
     * @summary Creates list of users with given input array
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async createUsersWithListInput(params?: {
        userDto?: Array<UserDto>;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/user/createWithList",
            {
                ...params,
                method: "POST",
                body: params?.userDto ? JSON.stringify(params.userDto) : undefined,
                headers: {
                    ...this.removeEmpty(params?.headers),
                    "Content-Type": "application/json",
                },
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
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/user/{username}", params.pathParams),
            {
                ...params,
                method: "DELETE",
            }
        );
    }
    /**
     *
     * @summary Get the currently logged in user
     * @throws {HttpError}
     */
    public async getCurrentUser(params: {
        security: petstore_auth;
    } & RequestCallOptions): Promise<UserDto> {
        return await this.fetch(
            this.basePath + "/user",
            {
                ...params,
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                },
            }
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
    } & RequestCallOptions): Promise<UserDto> {
        return await this.fetch(
            this.url("/user/{username}", params.pathParams), params
        );
    }
    /**
     *
     * @summary Logs user into the system
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async loginUser(params?: {
        queryParams?: { username?: string; password?: string };
    } & RequestCallOptions): Promise<string> {
        return await this.fetch(
            this.url("/user/login", {}, params?.queryParams, {}), params
        );
    }
    /**
     *
     * @summary Logs out current logged in user session
     * @throws {HttpError}
     */
    public async logoutUser(params: RequestCallOptions = {}): Promise<void> {
        return await this.fetch(
            this.basePath + "/user/logout", params
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
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.url("/user/{username}", params.pathParams),
            {
                ...params,
                method: "PUT",
                body: JSON.stringify(params.userDto),
                headers: {
                    ...this.removeEmpty(params.headers),
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
