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
    addressTypes?: Array<AddressDtoAddressTypesEnum>;
}

export const AddressDtoAddressTypesEnumValues = [
    "SHIPPING",
    "BILLING",
] as const;

export type AddressDtoAddressTypesEnum = typeof AddressDtoAddressTypesEnumValues[number];

export interface CatDto extends PetBaseDto {
    pet_type: "Cat";
    hunts?: boolean;
    readonly age?: number;
}

export interface DogDto extends GenericDogDto {
    pet_type: "Dog";
}

export interface GenericDogDto extends PetBaseDto {
    bark?: boolean;
    breed?: GenericDogDtoBreedEnum;
}

export const GenericDogDtoBreedEnumValues = [
    "Dingo",
    "Husky",
    "Retriever",
    "Shepherd",
] as const;

export type GenericDogDtoBreedEnum = typeof GenericDogDtoBreedEnumValues[number];

export interface GoldfishDto {
    pet_type: "Goldfish";
    name?: string;
    species?: string;
}

export interface PetBaseDto {
    readonly id?: string;
    name: string;
    birth_date?: string;
    ownerAddress?: AddressDto;
}

export type PetDto =
    { pet_type: "WorkingDog" } & WorkingDogDto |
    { pet_type: "Cat" } & CatDto |
    { pet_type: "Goldfish" } & GoldfishDto |
    { pet_type: "Dog" } & DogDto;

export const PetDtoDiscriminators = [
    "WorkingDog",
    "Cat",
    "Goldfish",
    "Dog",
] as const;

export type PetDtoDiscriminator = typeof PetDtoDiscriminators[number];
export const WorkingDogCapabilityDtoValues = [
    "Guide",
    "Rescue",
    "Search",
] as const;

export type WorkingDogCapabilityDto = typeof WorkingDogCapabilityDtoValues[number];

export interface WorkingDogDto extends GenericDogDto {
    pet_type: "WorkingDog";
    capabilities: Array<WorkingDogCapabilityDto>;
}
