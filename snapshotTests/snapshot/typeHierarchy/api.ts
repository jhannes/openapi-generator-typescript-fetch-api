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
    AnyPetDto,
    CatAllOfDto,
    CatDto,
    DogAllOfDto,
    DogDto,
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
     * @memberof DefaultApi
     */
    petsPatch(params: {
        anyPetDto?: AnyPetDto;
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
    public async petsPatch(params: {
        anyPetDto?: AnyPetDto;
    }): Promise<void> {
        return await this.PATCH(
            "/pets",
            {},
            { body: params.anyPetDto, contentType: "application/json" },
            {
            }
        );
    }
}

export const servers: Record<string, ApplicationApis> = {
    "Optional server description, e.g. Main (production) server": {
        defaultApi: new DefaultApi("http://api.example.com/v1")
    },
    "Optional server description, e.g. Internal staging server for testing": {
        defaultApi: new DefaultApi("http://staging-api.example.com")
    }
};

