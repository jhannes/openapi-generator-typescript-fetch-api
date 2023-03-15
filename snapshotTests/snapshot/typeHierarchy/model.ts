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

export interface AddressDto {
    addressLine1?: string;
    addressLine2?: string;
    city: string;
    country: string;
}

export interface CatDto extends PetBaseDto {
    pet_type: "Cat";
    hunts?: boolean;
    readonly age?: number;
}

export interface DogDto extends PetBaseDto {
    pet_type: "Dog";
    bark?: boolean;
    breed?: DogDtoBreedEnum;
}

export const DogDtoBreedEnumValues = [
    "Dingo",
    "Husky",
    "Retriever",
    "Shepherd",
] as const;

export type DogDtoBreedEnum = typeof DogDtoBreedEnumValues[number];

export interface PetBaseDto {
    readonly id?: string;
    pet_type: string;
    name?: string;
    birth_date?: string;
    ownerAddress?: AddressDto;
}

export type PetDto =
    { pet_type: "Cat" } & CatDto |
    { pet_type: "Dog" } & DogDto;

export const PetDtoDescriminators = [
    "Cat",
    "Dog",
] as const;

export type PetDtoDescriminator = typeof PetDtoDescriminators[number];
