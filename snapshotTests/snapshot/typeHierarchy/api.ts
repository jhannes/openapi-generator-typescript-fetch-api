/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * Sample API
 * Optional multiline or single-line description in [CommonMark](http://commonmark.org/help/) or HTML.
 *
 * The version of the OpenAPI document: 0.1.9
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    AddressDto,
    CatDto,
    CatDtoRequest,
    DogDto,
    DogDtoRequest,
    GenericDogDto,
    GenericDogDtoRequest,
    GoldfishDto,
    PetBaseDto,
    PetBaseDtoRequest,
    PetDto,
    WorkingDogCapabilityDto,
    WorkingDogDto,
    WorkingDogDtoRequest,
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
    petsPost(params?: {
        petDto?: PetDto;
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
    public async petsPost(params?: {
        petDto?: PetDto;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/pets",
            {
                ...params,
                method: "POST",
                body: params?.petDto ? JSON.stringify(params.petDto) : undefined,
                headers: {
                    ...this.removeEmpty(params?.headers),
                    "Content-Type": "application/json",
                },
            }
        );
    }
}

type ServerNames =
    | "Optional server description, e.g. Main (production) server"
    | "Optional server description, e.g. Internal staging server for testing";

export const servers: Record<ServerNames, ApplicationApis> = {
    "Optional server description, e.g. Main (production) server": {
        defaultApi: new DefaultApi("http://api.example.com/v1"),
    },
    "Optional server description, e.g. Internal staging server for testing": {
        defaultApi: new DefaultApi("http://staging-api.example.com"),
    },
};

