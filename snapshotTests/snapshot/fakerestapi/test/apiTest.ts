/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * FakeRESTApi.Web V1
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    ActivityDto,
    AuthorDto,
    BookDto,
    CoverPhotoDto,
    UserDto,
} from "../model";

import {
    ApplicationApis,
    ActivitiesApiInterface,
    AuthorsApiInterface,
    BooksApiInterface,
    CoverPhotosApiInterface,
    UsersApiInterface,
} from "../api";

function reject(operation: string) {
    return () => Promise.reject(new Error("Unexpected function call " + operation));
}

export function mockApplicationApis({
    activitiesApi = mockActivitiesApi(),
    authorsApi = mockAuthorsApi(),
    booksApi = mockBooksApi(),
    coverPhotosApi = mockCoverPhotosApi(),
    usersApi = mockUsersApi(),
}: Partial<ApplicationApis> = {}): ApplicationApis {
    return { activitiesApi, authorsApi, booksApi, coverPhotosApi, usersApi };
}

export function mockActivitiesApi(
    operations: Partial<ActivitiesApiInterface> = {}
): ActivitiesApiInterface {
    return {
        apiV1ActivitiesGet: operations.apiV1ActivitiesGet || reject("ActivitiesApi.apiV1ActivitiesGet"),
        apiV1ActivitiesIdDelete: operations.apiV1ActivitiesIdDelete || reject("ActivitiesApi.apiV1ActivitiesIdDelete"),
        apiV1ActivitiesIdGet: operations.apiV1ActivitiesIdGet || reject("ActivitiesApi.apiV1ActivitiesIdGet"),
        apiV1ActivitiesIdPut: operations.apiV1ActivitiesIdPut || reject("ActivitiesApi.apiV1ActivitiesIdPut"),
        apiV1ActivitiesPost: operations.apiV1ActivitiesPost || reject("ActivitiesApi.apiV1ActivitiesPost"),
    };
}

export function mockAuthorsApi(
    operations: Partial<AuthorsApiInterface> = {}
): AuthorsApiInterface {
    return {
        apiV1AuthorsAuthorsBooksIdBookGet: operations.apiV1AuthorsAuthorsBooksIdBookGet || reject("AuthorsApi.apiV1AuthorsAuthorsBooksIdBookGet"),
        apiV1AuthorsGet: operations.apiV1AuthorsGet || reject("AuthorsApi.apiV1AuthorsGet"),
        apiV1AuthorsIdDelete: operations.apiV1AuthorsIdDelete || reject("AuthorsApi.apiV1AuthorsIdDelete"),
        apiV1AuthorsIdGet: operations.apiV1AuthorsIdGet || reject("AuthorsApi.apiV1AuthorsIdGet"),
        apiV1AuthorsIdPut: operations.apiV1AuthorsIdPut || reject("AuthorsApi.apiV1AuthorsIdPut"),
        apiV1AuthorsPost: operations.apiV1AuthorsPost || reject("AuthorsApi.apiV1AuthorsPost"),
    };
}

export function mockBooksApi(
    operations: Partial<BooksApiInterface> = {}
): BooksApiInterface {
    return {
        apiV1BooksGet: operations.apiV1BooksGet || reject("BooksApi.apiV1BooksGet"),
        apiV1BooksIdDelete: operations.apiV1BooksIdDelete || reject("BooksApi.apiV1BooksIdDelete"),
        apiV1BooksIdGet: operations.apiV1BooksIdGet || reject("BooksApi.apiV1BooksIdGet"),
        apiV1BooksIdPut: operations.apiV1BooksIdPut || reject("BooksApi.apiV1BooksIdPut"),
        apiV1BooksPost: operations.apiV1BooksPost || reject("BooksApi.apiV1BooksPost"),
    };
}

export function mockCoverPhotosApi(
    operations: Partial<CoverPhotosApiInterface> = {}
): CoverPhotosApiInterface {
    return {
        apiV1CoverPhotosBooksCoversIdBookGet: operations.apiV1CoverPhotosBooksCoversIdBookGet || reject("CoverPhotosApi.apiV1CoverPhotosBooksCoversIdBookGet"),
        apiV1CoverPhotosGet: operations.apiV1CoverPhotosGet || reject("CoverPhotosApi.apiV1CoverPhotosGet"),
        apiV1CoverPhotosIdDelete: operations.apiV1CoverPhotosIdDelete || reject("CoverPhotosApi.apiV1CoverPhotosIdDelete"),
        apiV1CoverPhotosIdGet: operations.apiV1CoverPhotosIdGet || reject("CoverPhotosApi.apiV1CoverPhotosIdGet"),
        apiV1CoverPhotosIdPut: operations.apiV1CoverPhotosIdPut || reject("CoverPhotosApi.apiV1CoverPhotosIdPut"),
        apiV1CoverPhotosPost: operations.apiV1CoverPhotosPost || reject("CoverPhotosApi.apiV1CoverPhotosPost"),
    };
}

export function mockUsersApi(
    operations: Partial<UsersApiInterface> = {}
): UsersApiInterface {
    return {
        apiV1UsersGet: operations.apiV1UsersGet || reject("UsersApi.apiV1UsersGet"),
        apiV1UsersIdDelete: operations.apiV1UsersIdDelete || reject("UsersApi.apiV1UsersIdDelete"),
        apiV1UsersIdGet: operations.apiV1UsersIdGet || reject("UsersApi.apiV1UsersIdGet"),
        apiV1UsersIdPut: operations.apiV1UsersIdPut || reject("UsersApi.apiV1UsersIdPut"),
        apiV1UsersPost: operations.apiV1UsersPost || reject("UsersApi.apiV1UsersPost"),
    };
}
