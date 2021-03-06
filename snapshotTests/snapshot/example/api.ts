/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * Sample API
 * A small example to demonstrate individual problems
 *
 * The version of the OpenAPI document: 0.1.9
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    InlineObjectDto,
    PetDto,
} from "./model";

import { BaseAPI, SecurityScheme } from "./base";

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
    addPet(params: {
        pathParams: { storeId: string };
        petDto?: PetDto;
    }): Promise<void>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    addPetWithForm(params: {
        pathParams: { petId: string };
        formParams: { name: string; status: string; }
    }): Promise<void>;
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    listPets(params: {
        pathParams: { storeId: string };
        queryParams?: { status?: Array<string>, tags?: Array<string>, bornAfter?: Date, };
    }): Promise<PetDto>;
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
    public async addPet(params: {
        pathParams: { storeId: string };
        petDto?: PetDto;
    }): Promise<void> {
        return await this.fetch(
            this.url("/{storeId}/pets", params.pathParams),
            {
                method: "POST",
                body: JSON.stringify(params.petDto),
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
    public async addPetWithForm(params: {
        pathParams: { petId: string };
        formParams: { name: string; status: string; }
    }): Promise<void> {
        return await this.fetch(
            this.url("/pets/{petId}", params.pathParams),
            {
                method: "POST",
                body: this.formData(params.formParams),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );
    }
    /**
     *
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async listPets(params: {
        pathParams: { storeId: string };
        queryParams?: { status?: Array<string>, tags?: Array<string>, bornAfter?: Date,  };
    }): Promise<PetDto> {
        return await this.fetch(
            this.url("/{storeId}/pets", params.pathParams, params?.queryParams, {
                status: { delimiter: " " },
                bornAfter: { format: "date" },
            })
        );
    }
}

type ServerNames =
    | "Server";

export const servers: Record<ServerNames, ApplicationApis> = {
    "Server": {
        defaultApi: new DefaultApi("/v1"),
    },
};

