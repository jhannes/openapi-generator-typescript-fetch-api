import {
    LoginPost200ResponseDto,
    LoginPost400ResponseDto,
    LoginPostRequestDto,
    RegisterPost200ResponseDto,
    UnknownResourceDto,
    UserDto,
    UsersGet200ResponseDto,
    UsersIdGet200ResponseDto,
    UsersIdPut200ResponseDto,
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
    LoginPost200ResponseDto?: ModelFactory<LoginPost200ResponseDto>;
    LoginPost400ResponseDto?: ModelFactory<LoginPost400ResponseDto>;
    LoginPostRequestDto?: ModelFactory<LoginPostRequestDto>;
    RegisterPost200ResponseDto?: ModelFactory<RegisterPost200ResponseDto>;
    UnknownResourceDto?: ModelFactory<UnknownResourceDto>;
    UserDto?: ModelFactory<UserDto>;
    UsersGet200ResponseDto?: ModelFactory<UsersGet200ResponseDto>;
    UsersIdGet200ResponseDto?: ModelFactory<UsersIdGet200ResponseDto>;
    UsersIdPut200ResponseDto?: ModelFactory<UsersIdPut200ResponseDto>;
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

    randomArray<T>(generator: (n: number) => T, length?: number): T[] {
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

    sampleLocalDate(): string {
        return this.randomPastDateTime(this.now).toISOString().substring(0, 10);
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

    generate<T>(
        template: ((sampleData: TestSampleData) => T) | T | undefined,
        propertyDefinition: PropertyDefinition | undefined,
        generator: () => T
    ): T {
        if (template != undefined) {
            return (typeof template === "function")
                ? (template as (sampleData: TestSampleData) => T)(this)
                : template;
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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (example && example !== "null") return example as any;
        }
        return generator();
    }

    arrayLength(): number {
        return this.nextInt(3) + 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sample(modelName: string): any {
        switch (modelName) {
            case "LoginPost200ResponseDto":
                return this.sampleLoginPost200ResponseDto();
            case "Array<LoginPost200ResponseDto>":
                return this.sampleArrayLoginPost200ResponseDto();
            case "LoginPost400ResponseDto":
                return this.sampleLoginPost400ResponseDto();
            case "Array<LoginPost400ResponseDto>":
                return this.sampleArrayLoginPost400ResponseDto();
            case "LoginPostRequestDto":
                return this.sampleLoginPostRequestDto();
            case "Array<LoginPostRequestDto>":
                return this.sampleArrayLoginPostRequestDto();
            case "RegisterPost200ResponseDto":
                return this.sampleRegisterPost200ResponseDto();
            case "Array<RegisterPost200ResponseDto>":
                return this.sampleArrayRegisterPost200ResponseDto();
            case "UnknownResourceDto":
                return this.sampleUnknownResourceDto();
            case "Array<UnknownResourceDto>":
                return this.sampleArrayUnknownResourceDto();
            case "UserDto":
                return this.sampleUserDto();
            case "Array<UserDto>":
                return this.sampleArrayUserDto();
            case "UsersGet200ResponseDto":
                return this.sampleUsersGet200ResponseDto();
            case "Array<UsersGet200ResponseDto>":
                return this.sampleArrayUsersGet200ResponseDto();
            case "UsersIdGet200ResponseDto":
                return this.sampleUsersIdGet200ResponseDto();
            case "Array<UsersIdGet200ResponseDto>":
                return this.sampleArrayUsersIdGet200ResponseDto();
            case "UsersIdPut200ResponseDto":
                return this.sampleUsersIdPut200ResponseDto();
            case "Array<UsersIdPut200ResponseDto>":
                return this.sampleArrayUsersIdPut200ResponseDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleLoginPost200ResponseDto(template?: Factory<LoginPost200ResponseDto>): LoginPost200ResponseDto {
        const containerClass = "LoginPost200ResponseDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            token: this.generate(
                template?.token,
                { containerClass, propertyName: "token", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayLoginPost200ResponseDto(
        length?: number,
        template?: Factory<LoginPost200ResponseDto>
    ): LoginPost200ResponseDto[] {
        return this.randomArray(
            () => this.sampleLoginPost200ResponseDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleLoginPost400ResponseDto(template?: Factory<LoginPost400ResponseDto>): LoginPost400ResponseDto {
        const containerClass = "LoginPost400ResponseDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            error: this.generate(
                template?.error,
                { containerClass, propertyName: "error", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayLoginPost400ResponseDto(
        length?: number,
        template?: Factory<LoginPost400ResponseDto>
    ): LoginPost400ResponseDto[] {
        return this.randomArray(
            () => this.sampleLoginPost400ResponseDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleLoginPostRequestDto(template?: Factory<LoginPostRequestDto>): LoginPostRequestDto {
        const containerClass = "LoginPostRequestDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            username: this.generate(
                template?.username,
                { containerClass, propertyName: "username", isNullable: false },
                () => this.sampleString("", "null")
            ),
            email: this.generate(
                template?.email,
                { containerClass, propertyName: "email", isNullable: false },
                () => this.sampleString("", "null")
            ),
            password: this.generate(
                template?.password,
                { containerClass, propertyName: "password", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayLoginPostRequestDto(
        length?: number,
        template?: Factory<LoginPostRequestDto>
    ): LoginPostRequestDto[] {
        return this.randomArray(
            () => this.sampleLoginPostRequestDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleRegisterPost200ResponseDto(template?: Factory<RegisterPost200ResponseDto>): RegisterPost200ResponseDto {
        const containerClass = "RegisterPost200ResponseDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("", "null")
            ),
            token: this.generate(
                template?.token,
                { containerClass, propertyName: "token", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayRegisterPost200ResponseDto(
        length?: number,
        template?: Factory<RegisterPost200ResponseDto>
    ): RegisterPost200ResponseDto[] {
        return this.randomArray(
            () => this.sampleRegisterPost200ResponseDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUnknownResourceDto(template?: Factory<UnknownResourceDto>): UnknownResourceDto {
        const containerClass = "UnknownResourceDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            year: this.generate(
                template?.year,
                { containerClass, propertyName: "year", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            color: this.generate(
                template?.color,
                { containerClass, propertyName: "color", isNullable: false },
                () => this.sampleString("", "null")
            ),
            pantone_value: this.generate(
                template?.pantone_value,
                { containerClass, propertyName: "pantone_value", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayUnknownResourceDto(
        length?: number,
        template?: Factory<UnknownResourceDto>
    ): UnknownResourceDto[] {
        return this.randomArray(
            () => this.sampleUnknownResourceDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUserDto(template?: Factory<UserDto>): UserDto {
        const containerClass = "UserDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            email: this.generate(
                template?.email,
                { containerClass, propertyName: "email", isNullable: false },
                () => this.sampleString("", "null")
            ),
            first_name: this.generate(
                template?.first_name,
                { containerClass, propertyName: "first_name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            last_name: this.generate(
                template?.last_name,
                { containerClass, propertyName: "last_name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            avatar: this.generate(
                template?.avatar,
                { containerClass, propertyName: "avatar", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayUserDto(
        length?: number,
        template?: Factory<UserDto>
    ): UserDto[] {
        return this.randomArray(
            () => this.sampleUserDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUsersGet200ResponseDto(template?: Factory<UsersGet200ResponseDto>): UsersGet200ResponseDto {
        const containerClass = "UsersGet200ResponseDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            page: this.generate(
                template?.page,
                { containerClass, propertyName: "page", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            per_page: this.generate(
                template?.per_page,
                { containerClass, propertyName: "per_page", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            total: this.generate(
                template?.total,
                { containerClass, propertyName: "total", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            total_pages: this.generate(
                template?.total_pages,
                { containerClass, propertyName: "total_pages", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            data: this.generate(
                template?.data,
                { containerClass, propertyName: "data", example: null, isNullable: false },
                () => this.sampleArrayUserDto()
            ),
        };
    }

    sampleArrayUsersGet200ResponseDto(
        length?: number,
        template?: Factory<UsersGet200ResponseDto>
    ): UsersGet200ResponseDto[] {
        return this.randomArray(
            () => this.sampleUsersGet200ResponseDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUsersIdGet200ResponseDto(template?: Factory<UsersIdGet200ResponseDto>): UsersIdGet200ResponseDto {
        const containerClass = "UsersIdGet200ResponseDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            data: this.generate(
                template?.data,
                { containerClass, propertyName: "data", example: "null", isNullable: false },
                () => this.sampleUserDto()
            ),
        };
    }

    sampleArrayUsersIdGet200ResponseDto(
        length?: number,
        template?: Factory<UsersIdGet200ResponseDto>
    ): UsersIdGet200ResponseDto[] {
        return this.randomArray(
            () => this.sampleUsersIdGet200ResponseDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUsersIdPut200ResponseDto(template?: Factory<UsersIdPut200ResponseDto>): UsersIdPut200ResponseDto {
        const containerClass = "UsersIdPut200ResponseDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            updatedAt: this.generate(
                template?.updatedAt,
                { containerClass, propertyName: "updatedAt", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayUsersIdPut200ResponseDto(
        length?: number,
        template?: Factory<UsersIdPut200ResponseDto>
    ): UsersIdPut200ResponseDto[] {
        return this.randomArray(
            () => this.sampleUsersIdPut200ResponseDto(template),
            length ?? this.arrayLength()
        );
    }
}
