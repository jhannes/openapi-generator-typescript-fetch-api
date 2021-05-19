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
    PetDto,
} from "../model";

import {
    ApplicationApis,
    DefaultApiInterface,
} from "../api";

function reject(operation: string) {
    return () => Promise.reject(new Error("Unexpected function call " + operation));
}

export function mockApplicationApis({
    defaultApi = mockDefaultApi(),
}: Partial<ApplicationApis>): ApplicationApis {
    return { defaultApi };
}

export function mockDefaultApi(operations: {
    addPet?: () => Promise<void>;
    addPetWithForm?: () => Promise<void>;
    listPets?: () => Promise<PetDto>;
} = {}): DefaultApiInterface {
    return {
        addPet: operations.addPet || reject("DefaultApi.addPet"),
        addPetWithForm: operations.addPetWithForm || reject("DefaultApi.addPetWithForm"),
        listPets: operations.listPets || reject("DefaultApi.listPets"),
    };
}
