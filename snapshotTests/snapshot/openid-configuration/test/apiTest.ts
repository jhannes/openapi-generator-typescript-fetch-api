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
} from "../model";

import {
    ApplicationApis,
    DiscoveryApiInterface,
    IdentityClientApiInterface,
    IdentityProviderApiInterface,
} from "../api";

function reject(operation: string) {
    return () => Promise.reject(new Error("Unexpected function call " + operation));
}

export function mockApplicationApis({
    discoveryApi = mockDiscoveryApi(),
    identityClientApi = mockIdentityClientApi(),
    identityProviderApi = mockIdentityProviderApi(),
}: Partial<ApplicationApis> = {}): ApplicationApis {
    return { discoveryApi, identityClientApi, identityProviderApi };
}

export function mockDiscoveryApi(
    operations: Partial<DiscoveryApiInterface> = {}
): DiscoveryApiInterface {
    return {
        getDiscoveryDocument: operations.getDiscoveryDocument || reject("DiscoveryApi.getDiscoveryDocument"),
        getJwksDocument: operations.getJwksDocument || reject("DiscoveryApi.getJwksDocument"),
    };
}

export function mockIdentityClientApi(
    operations: Partial<IdentityClientApiInterface> = {}
): IdentityClientApiInterface {
    return {
        handleCallback: operations.handleCallback || reject("IdentityClientApi.handleCallback"),
    };
}

export function mockIdentityProviderApi(
    operations: Partial<IdentityProviderApiInterface> = {}
): IdentityProviderApiInterface {
    return {
        fetchToken: operations.fetchToken || reject("IdentityProviderApi.fetchToken"),
        getUserinfo: operations.getUserinfo || reject("IdentityProviderApi.getUserinfo"),
        startAuthorization: operations.startAuthorization || reject("IdentityProviderApi.startAuthorization"),
    };
}
