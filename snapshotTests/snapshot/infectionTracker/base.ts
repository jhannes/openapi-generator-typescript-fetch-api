/* eslint @typescript-eslint/no-explicit-any: off */

/* eslint @typescript-eslint/explicit-module-boundary-types: off */
/**
 * Infection Tracker
 * Infection Tracker - A case management system for tracking the spread of diseases
 *
 * The version of the OpenAPI document: 1.0.0-draft
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export class BaseAPI {
    constructor(protected basePath: string = window.location.origin) {}

    protected async GET(
        url: string,
        requestBody: undefined,
        headers: Record<string, string> = {}
    ): Promise<any> {
        return await this.fetch(url, { headers });
    }

    protected async PUT(
        url: string,
        body?: BodyInit,
        headers: Record<string, string> = {}
    ): Promise<any> {
        return await this.fetch(url, {
            method: "PUT",
            headers,
            body,
        });
    }

    protected async POST(
        url: string,
        body?: BodyInit,
        headers: Record<string, string> = {}
    ): Promise<any> {
        return await this.fetch(url, {
            method: "POST",
            headers,
            body,
        });
    }

    protected async PATCH(
        url: string,
        body?: BodyInit,
        headers: Record<string, string> = {}
    ): Promise<any> {
        return await this.fetch(url, {
            method: "PATCH",
            headers,
            body,
        });
    }

    protected async DELETE(
        url: string,
        body?: BodyInit,
        headers: Record<string, string> = {}
    ): Promise<void> {
        return await this.fetch(url, {
            method: "DELETE",
            headers,
            body,
        });
    }

    protected async fetch(url: string, options: RequestInit): Promise<any> {
        const result = await fetch(url, {
            credentials: "same-origin",
            ...options,
        });
        return await this.handleResponse(result);
    }

    protected formData(form: any): string {
        return Object.keys(form)
            .map((key) => key + "=" + encodeURIComponent(form[key]))
            .join("&");
    }

    protected async handleResponse(response: Response): Promise<any> {
        const contentType = response.headers.get("Content-type");
        if (response.redirected) {
            window.location.href = response.url;
            throw new RedirectedError(response);
        }
        if (response.ok) {
            if (contentType && contentType.startsWith("application/json")) {
                return response.json();
            }
            return response;
        }
        const body: any =
            contentType && contentType.startsWith("application/json") && (await response.json());
        if (response.status == 401) {
            throw new LoggedOutError(response, body);
        } else if (response.status == 404) {
            throw new NotFoundError(response, body);
        } else if (response.status >= 500) {
            throw new ServerError(response, body);
        } else {
            throw new RequestError(response, body);
        }
    }

    protected url(
        pathTemplate: string,
        params: any,
        queryParams?: QueryParams,
        queryOptions?: QueryOptions
    ): string {
        return (
            this.expandPathTemplate(pathTemplate, params) + this.query(queryParams, queryOptions)
        );
    }

    private expandPathTemplate(pathTemplate: string, params: any): string {
        return pathTemplate.replace(/{(\w+)}/g, (match, g) => params[g]);
    }

    protected query(queryParams?: QueryParams, queryOptions?: QueryOptions): string {
        if (!queryParams || !Object.keys(queryParams).length) {
            return "";
        }
        const query = new URLSearchParams();
        for (const key of Object.keys(queryParams)) {
            const value = queryParams[key];
            if (Array.isArray(value)) {
                const options = queryOptions ? queryOptions[key] : undefined;
                if (!options || options.explode) {
                    for (const item of value) {
                        query.append(key, item);
                    }
                } else {
                    query.append(key, value.join(options.delimiter || ","));
                }
            } else if (value !== undefined) {
                query.append(key, value.toString());
            }
        }
        return "?" + query;
    }
}

type QueryParams = Record<string, string | string[] | Date | boolean>;
type QueryOptions = Record<string, { explode?: boolean; delimiter?: "," | " " | "|" }>;

export class HttpError extends Error {
    readonly response: Response;
    readonly body: any;

    constructor(response: Response, body?: any) {
        super(response.statusText);
        this.response = response;
        this.body = body;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export class ServerError extends HttpError {
    constructor(response: Response, body: any) {
        super(response, body);
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}

export class RequestError extends HttpError {
    constructor(response: Response, body: any) {
        super(response, body);
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}

export class LoggedOutError extends RequestError {
    constructor(response: Response, body: any) {
        super(response, body);
        Object.setPrototypeOf(this, LoggedOutError.prototype);
    }
}

export class NotFoundError extends RequestError {
    constructor(response: Response, body: any) {
        super(response, body);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

export class RedirectedError extends HttpError {
    constructor(response: Response) {
        super(response);
        Object.setPrototypeOf(this, RedirectedError.prototype);
    }
}

export interface SecurityScheme {
    headers(): Record<string, string>;
}