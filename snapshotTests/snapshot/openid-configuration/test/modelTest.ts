import {
    DiscoveryDocumentDto,
    JwksDocumentDto,
    JwksKeyDto,
    JwtHeaderDto,
    JwtPayloadDto,
    TokenResponseDto,
} from "../model";

export class Random {
    seed: number;
    constructor(seed: number | string) {
        this.seed = this.hash(seed) % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }

    next(): number {
        this.seed = (this.seed * 16807) % 2147483647;
        return this.seed;
    }

    nextFloat(): number {
        return (this.next() - 1) / 2147483646;
    }

    nextInt(limit: number): number {
        return this.next() % limit;
    }

    nextnumber(limit: number): number {
        return this.next() % limit;
    }

    nextBoolean(): boolean {
        return this.nextInt(2) == 0;
    }

    pickOne<T>(options: readonly T[]): T {
        return options[this.nextInt(options.length)];
    }

    pickSome<T>(options: readonly T[], n?: number): T[] {
        const shuffled = [...options].sort(() => 0.5 - this.next());
        return shuffled.slice(0, n || this.nextInt(options.length));
    }

    uuidv4(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = this.nextInt(16) | 0;
            const v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    hash(seed: string | number): number {
        if (typeof seed === "number") {
            return seed < 0 ? Math.floor(seed*1000) : Math.floor(seed);
        }
        return seed.split("").reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);
    }
}

export type Factory<T> = {
    [P in keyof T]?: ((sampleData: TestSampleData) => T[P]) | T[P];
};

type ModelFactory<T> = Factory<T> | ((testData: TestSampleData) => T);

export interface SampleModelFactories {
    DiscoveryDocumentDto?: ModelFactory<DiscoveryDocumentDto>;
    JwksDocumentDto?: ModelFactory<JwksDocumentDto>;
    JwksKeyDto?: ModelFactory<JwksKeyDto>;
    JwtHeaderDto?: ModelFactory<JwtHeaderDto>;
    JwtPayloadDto?: ModelFactory<JwtPayloadDto>;
    TokenResponseDto?: ModelFactory<TokenResponseDto>;
}

export interface SamplePropertyValues {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (sampleData: TestSampleData) => any;
}

export interface TestData {
    seed?: number | string;
    sampleModelProperties?: SampleModelFactories;
    samplePropertyValues?: SamplePropertyValues;
    now?: Date;
}

export interface PropertyDefinition {
    containerClass: string;
    propertyName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    example?: string | null | Array<any>;
    isNullable?: boolean;
}

export class TestSampleData {
    random: Random;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sampleModelProperties: any;
    samplePropertyValues: SamplePropertyValues;
    now: Date;

    constructor({ seed, sampleModelProperties, samplePropertyValues, now }: TestData) {
        this.random = new Random(seed || 100);
        this.now = now || new Date(2019, 1, this.random.nextInt(2000));
        this.sampleModelProperties = sampleModelProperties || {};
        this.samplePropertyValues = samplePropertyValues || {};
    }

    nextFloat(): number {
        return this.random.nextFloat();
    }

    nextInt(limit: number): number {
        return this.random.nextInt(limit);
    }

    nextBoolean(): boolean {
        return this.random.nextBoolean();
    }

    sampleboolean(): boolean {
        return this.random.nextBoolean();
    }

    pickOne<T>(options: readonly T[]): T {
        return this.random.pickOne(options);
    }

    pickOneString<T extends string>(options: readonly T[]): T {
        return this.random.pickOne(options);
    }

    pickSome<T>(options: readonly T[]): T[] {
        return this.random.pickSome(options);
    }

    uuidv4(): string {
        return this.random.uuidv4();
    }

    randomString(): string {
        return this.pickOne(["foo", "bar", "baz"]);
    }

    randomArray<T>(generator: (n: number) => T, length?: number): readonly T[] {
        if (!length) length = this.nextInt(3) + 1;
        return Array.from({ length }).map((_, index) => generator(index));
    }

    randomEmail(): string {
        return (
            this.randomFirstName().toLowerCase() +
            "." +
            this.randomLastName().toLowerCase() +
            "@" +
            this.randomDomain()
        );
    }

    randomFirstName(): string {
        return this.pickOne(["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Linda"]);
    }

    randomLastName(): string {
        return this.pickOne(["Smith", "Williams", "Johnson", "Jones", "Brown", "Davis", "Wilson"]);
    }

    randomFullName(): string {
        return this.randomFirstName() + " " + this.randomLastName();
    }

    randomDomain(): string {
        return (
            this.pickOne(["a", "b", "c", "d", "e"]) +
            ".example." +
            this.pickOne(["net", "com", "org"])
        );
    }

    randomPastDateTime(now: Date): Date {
        return new Date(now.getTime() - this.nextInt(4 * 7 * 24 * 60 * 60 * 1000));
    }

    sampleDateTime(): Date {
        return this.randomPastDateTime(this.now);
    }

    samplenumber(): number {
        return this.nextInt(10000);
    }

    sampleunknown(): unknown {
        return {
            [this.randomString()]: this.randomString(),
        }
    }

    sampleDate(): Date {
        return this.randomPastDateTime(this.now);
    }

    sampleString(dataFormat?: string, example?: string): string {
        if (dataFormat === "uuid") {
            return this.uuidv4();
        }
        if (dataFormat === "uri") {
            return "https://" + this.randomDomain() + "/" + this.randomFirstName().toLowerCase();
        }
        if (dataFormat === "email") {
            return this.randomEmail();
        }
        if (example && example !== "null") return example;
        return this.randomString();
    }

    sampleArrayString(length?: number): Array<string> {
        return Array.from({ length: length || this.arrayLength() }).map(() => this.sampleString());
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sampleArrayArray<T>(length?: number): readonly T[] {
        return [];
    }

    sampleArraynumber(length?: number): Array<number> {
        return Array.from({ length: length || this.arrayLength() }).map(() => this.samplenumber());
    }

    generate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        template?: ((sampleData: TestSampleData) => any) | any,
        propertyDefinition?: PropertyDefinition,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generator?: () => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        if (template != undefined) {
            return typeof template === "function" ? template(this) : template;
        }
        if (propertyDefinition) {
            const { containerClass, propertyName, example } = propertyDefinition;
            if (this.sampleModelProperties[containerClass]) {
                const propertyFactory = this.sampleModelProperties[containerClass][propertyName];
                if (propertyFactory && typeof propertyFactory === "function") {
                    return propertyFactory(this);
                } else if (propertyFactory !== undefined) {
                    return propertyFactory;
                }
            }
            if (this.samplePropertyValues[propertyName] !== undefined) {
                return this.samplePropertyValues[propertyName](this);
            }
            if (example && example !== "null") return example;
        }
        return generator && generator();
    }

    arrayLength(): number {
        return this.nextInt(3) + 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sample(modelName: string): any {
        switch (modelName) {
            case "DiscoveryDocumentDto":
                return this.sampleDiscoveryDocumentDto();
            case "Array<DiscoveryDocumentDto>":
                return this.sampleArrayDiscoveryDocumentDto();
            case "JwksDocumentDto":
                return this.sampleJwksDocumentDto();
            case "Array<JwksDocumentDto>":
                return this.sampleArrayJwksDocumentDto();
            case "JwksKeyDto":
                return this.sampleJwksKeyDto();
            case "Array<JwksKeyDto>":
                return this.sampleArrayJwksKeyDto();
            case "JwtHeaderDto":
                return this.sampleJwtHeaderDto();
            case "Array<JwtHeaderDto>":
                return this.sampleArrayJwtHeaderDto();
            case "JwtPayloadDto":
                return this.sampleJwtPayloadDto();
            case "Array<JwtPayloadDto>":
                return this.sampleArrayJwtPayloadDto();
            case "TokenResponseDto":
                return this.sampleTokenResponseDto();
            case "Array<TokenResponseDto>":
                return this.sampleArrayTokenResponseDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleDiscoveryDocumentDto(template?: Factory<DiscoveryDocumentDto>): DiscoveryDocumentDto {
        const containerClass = "DiscoveryDocumentDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            issuer: this.generate(
                template?.issuer,
                { containerClass, propertyName: "issuer", isNullable: false },
                () => this.sampleString("", "null")
            ),
            authorization_endpoint: this.generate(
                template?.authorization_endpoint,
                { containerClass, propertyName: "authorization_endpoint", isNullable: false },
                () => this.sampleString("url", "null")
            ),
            token_endpoint: this.generate(
                template?.token_endpoint,
                { containerClass, propertyName: "token_endpoint", isNullable: false },
                () => this.sampleString("url", "null")
            ),
            end_session_endpoint: this.generate(
                template?.end_session_endpoint,
                { containerClass, propertyName: "end_session_endpoint", isNullable: false },
                () => this.sampleString("url", "null")
            ),
            jwks_uri: this.generate(
                template?.jwks_uri,
                { containerClass, propertyName: "jwks_uri", isNullable: false },
                () => this.sampleString("url", "null")
            ),
            response_types_supported: this.generate(
                template?.response_types_supported,
                { containerClass, propertyName: "response_types_supported", example: null, isNullable: false },
                () => this.sampleArrayString()
            ),
            response_modes_supported: this.generate(
                template?.response_modes_supported,
                { containerClass, propertyName: "response_modes_supported", example: null, isNullable: false },
                () => this.sampleArrayString()
            ),
            subject_types_supported: this.generate(
                template?.subject_types_supported,
                { containerClass, propertyName: "subject_types_supported", example: null, isNullable: false },
                () => this.sampleArrayString()
            ),
            code_challenge_methods_supported: this.generate(
                template?.code_challenge_methods_supported,
                { containerClass, propertyName: "code_challenge_methods_supported", example: null, isNullable: false },
                () => this.sampleArrayString()
            ),
            id_token_signing_alg_values_supported: this.generate(
                template?.id_token_signing_alg_values_supported,
                { containerClass, propertyName: "id_token_signing_alg_values_supported", example: null, isNullable: false },
                () => this.sampleArrayString()
            ),
            x_sso_frame: this.generate(
                template?.x_sso_frame,
                { containerClass, propertyName: "x_sso_frame", isNullable: false },
                () => this.sampleString("url", "null")
            ),
        };
    }

    sampleArrayDiscoveryDocumentDto(
        length?: number,
        template?: Factory<DiscoveryDocumentDto>
    ): readonly DiscoveryDocumentDto[] {
        return this.randomArray(
            () => this.sampleDiscoveryDocumentDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleJwksDocumentDto(template?: Factory<JwksDocumentDto>): JwksDocumentDto {
        const containerClass = "JwksDocumentDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            keys: this.generate(
                template?.keys,
                { containerClass, propertyName: "keys", example: null, isNullable: false },
                () => this.sampleArrayJwksKeyDto()
            ),
        };
    }

    sampleArrayJwksDocumentDto(
        length?: number,
        template?: Factory<JwksDocumentDto>
    ): readonly JwksDocumentDto[] {
        return this.randomArray(
            () => this.sampleJwksDocumentDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleJwksKeyDto(template?: Factory<JwksKeyDto>): JwksKeyDto {
        const containerClass = "JwksKeyDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            kty: this.generate(
                template?.kty,
                { containerClass, propertyName: "kty", isNullable: false },
                () => this.sampleString("", "RSA")
            ),
            use: this.generate(
                template?.use,
                { containerClass, propertyName: "use", isNullable: false },
                () => this.sampleString("", "sig")
            ),
            kid: this.generate(
                template?.kid,
                { containerClass, propertyName: "kid", isNullable: false },
                () => this.sampleString("", "null")
            ),
            x5c: this.generate(
                template?.x5c,
                { containerClass, propertyName: "x5c", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayJwksKeyDto(
        length?: number,
        template?: Factory<JwksKeyDto>
    ): readonly JwksKeyDto[] {
        return this.randomArray(
            () => this.sampleJwksKeyDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleJwtHeaderDto(template?: Factory<JwtHeaderDto>): JwtHeaderDto {
        const containerClass = "JwtHeaderDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            typ: this.generate(
                template?.typ,
                { containerClass, propertyName: "typ", isNullable: false },
                () => this.sampleString("", "JWT")
            ),
            kid: this.generate(
                template?.kid,
                { containerClass, propertyName: "kid", isNullable: false },
                () => this.sampleString("", "null")
            ),
            alg: this.generate(
                template?.alg,
                { containerClass, propertyName: "alg", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayJwtHeaderDto(
        length?: number,
        template?: Factory<JwtHeaderDto>
    ): readonly JwtHeaderDto[] {
        return this.randomArray(
            () => this.sampleJwtHeaderDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleJwtPayloadDto(template?: Factory<JwtPayloadDto>): JwtPayloadDto {
        const containerClass = "JwtPayloadDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            iss: this.generate(
                template?.iss,
                { containerClass, propertyName: "iss", isNullable: false },
                () => this.sampleString("url", "null")
            ),
            sub: this.generate(
                template?.sub,
                { containerClass, propertyName: "sub", isNullable: false },
                () => this.sampleString("", "null")
            ),
            aud: this.generate(
                template?.aud,
                { containerClass, propertyName: "aud", isNullable: false },
                () => this.sampleString("", "null")
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            email: this.generate(
                template?.email,
                { containerClass, propertyName: "email", isNullable: false },
                () => this.sampleString("", "null")
            ),
            orgId: this.generate(
                template?.orgId,
                { containerClass, propertyName: "orgId", isNullable: false },
                () => this.sampleString("", "null")
            ),
            org: this.generate(
                template?.org,
                { containerClass, propertyName: "org", isNullable: false },
                () => this.sampleString("", "null")
            ),
            pid: this.generate(
                template?.pid,
                { containerClass, propertyName: "pid", isNullable: false },
                () => this.sampleString("", "24079420405")
            ),
        };
    }

    sampleArrayJwtPayloadDto(
        length?: number,
        template?: Factory<JwtPayloadDto>
    ): readonly JwtPayloadDto[] {
        return this.randomArray(
            () => this.sampleJwtPayloadDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleTokenResponseDto(template?: Factory<TokenResponseDto>): TokenResponseDto {
        const containerClass = "TokenResponseDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            access_token: this.generate(
                template?.access_token,
                { containerClass, propertyName: "access_token", isNullable: false },
                () => this.sampleString("", "null")
            ),
            token_type: this.generate(
                template?.token_type,
                { containerClass, propertyName: "token_type", isNullable: false },
                () => this.sampleString("", "bearer")
            ),
            expires_in: this.generate(
                template?.expires_in,
                { containerClass, propertyName: "expires_in", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            scope: this.generate(
                template?.scope,
                { containerClass, propertyName: "scope", isNullable: false },
                () => this.sampleString("", "null")
            ),
            id_token: this.generate(
                template?.id_token,
                { containerClass, propertyName: "id_token", isNullable: false },
                () => this.sampleString("", "null")
            ),
            refresh_token: this.generate(
                template?.refresh_token,
                { containerClass, propertyName: "refresh_token", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayTokenResponseDto(
        length?: number,
        template?: Factory<TokenResponseDto>
    ): readonly TokenResponseDto[] {
        return this.randomArray(
            () => this.sampleTokenResponseDto(template),
            length ?? this.arrayLength()
        );
    }
}
