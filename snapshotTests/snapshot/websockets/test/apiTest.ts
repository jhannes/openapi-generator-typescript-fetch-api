/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * WebSockets
 * An example of sending requests and commands
 *
 * The version of the OpenAPI document: 0.1.0
 * Contact: johannes@brodwall.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    ChangeTrackedDto,
    CreatePersonCommandDto,
    PersonDto,
    PersonNameDto,
    PersonSnapshotAllOfDto,
    PersonSnapshotDto,
    RecipientDto,
    StringSnapshotDto,
    SubscribeDto,
    UnsubscribeDto,
    UpdatePersonCommandDto,
    WebSocketCommandDto,
    WebSocketMessageDto,
    WebSocketRequestDto,
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
}: Partial<ApplicationApis> = {}): ApplicationApis {
    return { defaultApi };
}

export function mockDefaultApi(
    operations: Partial<DefaultApiInterface> = {}
): DefaultApiInterface {
    return {
        commandsGet: operations.commandsGet || reject("DefaultApi.commandsGet"),
    };
}
