/**
 * Poly API
 * An example of a polymorphic API
 *
 * The version of the OpenAPI document: 0.1.0
 * Contact: johannes@brodwall.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export type AnyPartyDto =
    { type: "organization" } & OrganizationDto |
    { type: "person" } & PersonDto;

export const AnyPartyDtoDiscriminators = [
    "organization",
    "person",
] as const;

export type AnyPartyDtoDiscriminator = typeof AnyPartyDtoDiscriminators[number];

export type CreationErrorDto =
    { code: "duplicateIdentifier" } & DuplicateIdentifierErrorDto |
    { code: "generalError" } & GeneralErrorDto |
    { code: "illegalAddress" } & IllegalEmailAddressErrorDto |
    { code: "networkError" } & GeneralErrorDto;

export const CreationErrorDtoDiscriminators = [
    "duplicateIdentifier",
    "generalError",
    "illegalAddress",
    "networkError",
] as const;

export type CreationErrorDtoDiscriminator = typeof CreationErrorDtoDiscriminators[number];

export interface DuplicateIdentifierErrorDto {
    code: string;
    identifierValue?: string;
    entityType: string;
}

export interface GeneralErrorDto {
    code: string;
    description: string;
}

export interface IllegalEmailAddressErrorDto {
    code: string;
    inputEmailAddress: string;
    validDomains: Array<string>;
}

export interface LogMessageDto {
    message: string;
    error?: unknown;
}

export interface NotFoundErrorDto {
    code: string;
    identifierValue?: string;
    entityType: string;
}

export interface OrganizationDto {
    readonly id?: string;
    type: string;
    name: string;
    organizationId?: string;
    url?: string;
    email?: string;
    readonly emailDomains?: Array<string>;
    phone?: string;
}

export interface PersonDto {
    readonly id?: string;
    type: string;
    givenName: string;
    familyName: string;
    email?: string;
    phone?: string;
    birthDate?: string;
}

export type UpdateErrorDto =
    { code: "duplicateIdentifier" } & DuplicateIdentifierErrorDto |
    { code: "generalError" } & GeneralErrorDto |
    { code: "illegalAddress" } & IllegalEmailAddressErrorDto |
    { code: "networkError" } & GeneralErrorDto |
    { code: "notFound" } & NotFoundErrorDto;

export const UpdateErrorDtoDiscriminators = [
    "duplicateIdentifier",
    "generalError",
    "illegalAddress",
    "networkError",
    "notFound",
] as const;

export type UpdateErrorDtoDiscriminator = typeof UpdateErrorDtoDiscriminators[number];
