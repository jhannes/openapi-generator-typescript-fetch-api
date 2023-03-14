import {
    AnyPartyDto,
    CreationErrorDto,
    DuplicateIdentifierErrorDto,
    GeneralErrorDto,
    IllegalEmailAddressErrorDto,
    LogMessageDto,
    NotFoundErrorDto,
    OrganizationDto,
    PersonDto,
    UpdateErrorDto,
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
    AnyPartyDto?: ModelFactory<AnyPartyDto>;
    CreationErrorDto?: ModelFactory<CreationErrorDto>;
    DuplicateIdentifierErrorDto?: ModelFactory<DuplicateIdentifierErrorDto>;
    GeneralErrorDto?: ModelFactory<GeneralErrorDto>;
    IllegalEmailAddressErrorDto?: ModelFactory<IllegalEmailAddressErrorDto>;
    LogMessageDto?: ModelFactory<LogMessageDto>;
    NotFoundErrorDto?: ModelFactory<NotFoundErrorDto>;
    OrganizationDto?: ModelFactory<OrganizationDto>;
    PersonDto?: ModelFactory<PersonDto>;
    UpdateErrorDto?: ModelFactory<UpdateErrorDto>;
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
            case "AnyPartyDto":
                return this.sampleAnyPartyDto();
            case "Array<AnyPartyDto>":
                return this.sampleArrayAnyPartyDto();
            case "CreationErrorDto":
                return this.sampleCreationErrorDto();
            case "Array<CreationErrorDto>":
                return this.sampleArrayCreationErrorDto();
            case "DuplicateIdentifierErrorDto":
                return this.sampleDuplicateIdentifierErrorDto();
            case "Array<DuplicateIdentifierErrorDto>":
                return this.sampleArrayDuplicateIdentifierErrorDto();
            case "GeneralErrorDto":
                return this.sampleGeneralErrorDto();
            case "Array<GeneralErrorDto>":
                return this.sampleArrayGeneralErrorDto();
            case "IllegalEmailAddressErrorDto":
                return this.sampleIllegalEmailAddressErrorDto();
            case "Array<IllegalEmailAddressErrorDto>":
                return this.sampleArrayIllegalEmailAddressErrorDto();
            case "LogMessageDto":
                return this.sampleLogMessageDto();
            case "Array<LogMessageDto>":
                return this.sampleArrayLogMessageDto();
            case "NotFoundErrorDto":
                return this.sampleNotFoundErrorDto();
            case "Array<NotFoundErrorDto>":
                return this.sampleArrayNotFoundErrorDto();
            case "OrganizationDto":
                return this.sampleOrganizationDto();
            case "Array<OrganizationDto>":
                return this.sampleArrayOrganizationDto();
            case "PersonDto":
                return this.samplePersonDto();
            case "Array<PersonDto>":
                return this.sampleArrayPersonDto();
            case "UpdateErrorDto":
                return this.sampleUpdateErrorDto();
            case "Array<UpdateErrorDto>":
                return this.sampleArrayUpdateErrorDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleAnyPartyDto(
        factory?: (sampleData: TestSampleData) => AnyPartyDto
    ): AnyPartyDto {
        const containerClass = "AnyPartyDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const type = this.pickOneString(["organization", "person"])
        switch (type) {
            case "organization":
                return {
                    ...this.sampleOrganizationDto(),
                    type,
                };
            case "person":
                return {
                    ...this.samplePersonDto(),
                    type,
                };
        }
    }

    sampleArrayAnyPartyDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => AnyPartyDto
    ): readonly AnyPartyDto[] {
        return this.randomArray(
            () => this.sampleAnyPartyDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleCreationErrorDto(
        factory?: (sampleData: TestSampleData) => CreationErrorDto
    ): CreationErrorDto {
        const containerClass = "CreationErrorDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const code = this.pickOneString(["IllegalEmailAddressError", "DuplicateIdentifierError", "GeneralError"])
        switch (code) {
            case "IllegalEmailAddressError":
                return {
                    ...this.sampleIllegalEmailAddressErrorDto(),
                    code,
                };
            case "DuplicateIdentifierError":
                return {
                    ...this.sampleDuplicateIdentifierErrorDto(),
                    code,
                };
            case "GeneralError":
                return {
                    ...this.sampleGeneralErrorDto(),
                    code,
                };
        }
    }

    sampleArrayCreationErrorDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => CreationErrorDto
    ): readonly CreationErrorDto[] {
        return this.randomArray(
            () => this.sampleCreationErrorDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleDuplicateIdentifierErrorDto(template?: Factory<DuplicateIdentifierErrorDto>): DuplicateIdentifierErrorDto {
        const containerClass = "DuplicateIdentifierErrorDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            code: this.generate(
                template?.code,
                { containerClass, propertyName: "code", isNullable: false },
                () => this.sampleString("", "null")
            ),
            identifierValue: this.generate(
                template?.identifierValue,
                { containerClass, propertyName: "identifierValue", isNullable: false },
                () => this.sampleString("", "null")
            ),
            entityType: this.generate(
                template?.entityType,
                { containerClass, propertyName: "entityType", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayDuplicateIdentifierErrorDto(
        length?: number,
        template?: Factory<DuplicateIdentifierErrorDto>
    ): readonly DuplicateIdentifierErrorDto[] {
        return this.randomArray(
            () => this.sampleDuplicateIdentifierErrorDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleGeneralErrorDto(template?: Factory<GeneralErrorDto>): GeneralErrorDto {
        const containerClass = "GeneralErrorDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            code: this.generate(
                template?.code,
                { containerClass, propertyName: "code", isNullable: false },
                () => this.sampleString("", "null")
            ),
            description: this.generate(
                template?.description,
                { containerClass, propertyName: "description", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayGeneralErrorDto(
        length?: number,
        template?: Factory<GeneralErrorDto>
    ): readonly GeneralErrorDto[] {
        return this.randomArray(
            () => this.sampleGeneralErrorDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleIllegalEmailAddressErrorDto(template?: Factory<IllegalEmailAddressErrorDto>): IllegalEmailAddressErrorDto {
        const containerClass = "IllegalEmailAddressErrorDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            code: this.generate(
                template?.code,
                { containerClass, propertyName: "code", isNullable: false },
                () => this.sampleString("", "null")
            ),
            inputEmailAddress: this.generate(
                template?.inputEmailAddress,
                { containerClass, propertyName: "inputEmailAddress", isNullable: false },
                () => this.sampleString("", "null")
            ),
            validDomains: this.generate(
                template?.validDomains,
                { containerClass, propertyName: "validDomains", example: null, isNullable: false },
                () => this.sampleArrayString()
            ),
        };
    }

    sampleArrayIllegalEmailAddressErrorDto(
        length?: number,
        template?: Factory<IllegalEmailAddressErrorDto>
    ): readonly IllegalEmailAddressErrorDto[] {
        return this.randomArray(
            () => this.sampleIllegalEmailAddressErrorDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleLogMessageDto(template?: Factory<LogMessageDto>): LogMessageDto {
        const containerClass = "LogMessageDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            message: this.generate(
                template?.message,
                { containerClass, propertyName: "message", isNullable: false },
                () => this.sampleString("", "null")
            ),
            error: this.generate(
                template?.error,
                { containerClass, propertyName: "error", example: "null", isNullable: false },
                () => this.sampleunknown()
            ),
        };
    }

    sampleArrayLogMessageDto(
        length?: number,
        template?: Factory<LogMessageDto>
    ): readonly LogMessageDto[] {
        return this.randomArray(
            () => this.sampleLogMessageDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleNotFoundErrorDto(template?: Factory<NotFoundErrorDto>): NotFoundErrorDto {
        const containerClass = "NotFoundErrorDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            code: this.generate(
                template?.code,
                { containerClass, propertyName: "code", isNullable: false },
                () => this.sampleString("", "null")
            ),
            identifierValue: this.generate(
                template?.identifierValue,
                { containerClass, propertyName: "identifierValue", isNullable: false },
                () => this.sampleString("", "null")
            ),
            entityType: this.generate(
                template?.entityType,
                { containerClass, propertyName: "entityType", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayNotFoundErrorDto(
        length?: number,
        template?: Factory<NotFoundErrorDto>
    ): readonly NotFoundErrorDto[] {
        return this.randomArray(
            () => this.sampleNotFoundErrorDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleOrganizationDto(template?: Factory<OrganizationDto>): OrganizationDto {
        const containerClass = "OrganizationDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            type: this.generate(
                template?.type,
                { containerClass, propertyName: "type", isNullable: false },
                () => this.sampleString("", "null")
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            organizationId: this.generate(
                template?.organizationId,
                { containerClass, propertyName: "organizationId", isNullable: false },
                () => this.sampleString("", "null")
            ),
            url: this.generate(
                template?.url,
                { containerClass, propertyName: "url", isNullable: false },
                () => this.sampleString("uri", "null")
            ),
            email: this.generate(
                template?.email,
                { containerClass, propertyName: "email", isNullable: false },
                () => this.sampleString("email", "null")
            ),
            emailDomains: this.generate(
                template?.emailDomains,
                { containerClass, propertyName: "emailDomains", example: null, isNullable: false },
                () => this.sampleArrayString()
            ),
            phone: this.generate(
                template?.phone,
                { containerClass, propertyName: "phone", isNullable: false },
                () => this.sampleString("phone", "null")
            ),
        };
    }

    sampleArrayOrganizationDto(
        length?: number,
        template?: Factory<OrganizationDto>
    ): readonly OrganizationDto[] {
        return this.randomArray(
            () => this.sampleOrganizationDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePersonDto(template?: Factory<PersonDto>): PersonDto {
        const containerClass = "PersonDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            type: this.generate(
                template?.type,
                { containerClass, propertyName: "type", isNullable: false },
                () => this.sampleString("", "null")
            ),
            givenName: this.generate(
                template?.givenName,
                { containerClass, propertyName: "givenName", isNullable: false },
                () => this.sampleString("", "null")
            ),
            familyName: this.generate(
                template?.familyName,
                { containerClass, propertyName: "familyName", isNullable: false },
                () => this.sampleString("", "null")
            ),
            email: this.generate(
                template?.email,
                { containerClass, propertyName: "email", isNullable: false },
                () => this.sampleString("email", "null")
            ),
            phone: this.generate(
                template?.phone,
                { containerClass, propertyName: "phone", isNullable: false },
                () => this.sampleString("phone", "null")
            ),
            birthDate: this.generate(
                template?.birthDate,
                { containerClass, propertyName: "birthDate", example: "null", isNullable: false },
                () => this.sampleDate()
            ),
        };
    }

    sampleArrayPersonDto(
        length?: number,
        template?: Factory<PersonDto>
    ): readonly PersonDto[] {
        return this.randomArray(
            () => this.samplePersonDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUpdateErrorDto(
        factory?: (sampleData: TestSampleData) => UpdateErrorDto
    ): UpdateErrorDto {
        const containerClass = "UpdateErrorDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const code = this.pickOneString(["IllegalEmailAddressError", "DuplicateIdentifierError", "GeneralError", "NotFoundError"])
        switch (code) {
            case "IllegalEmailAddressError":
                return {
                    ...this.sampleIllegalEmailAddressErrorDto(),
                    code,
                };
            case "DuplicateIdentifierError":
                return {
                    ...this.sampleDuplicateIdentifierErrorDto(),
                    code,
                };
            case "GeneralError":
                return {
                    ...this.sampleGeneralErrorDto(),
                    code,
                };
            case "NotFoundError":
                return {
                    ...this.sampleNotFoundErrorDto(),
                    code,
                };
        }
    }

    sampleArrayUpdateErrorDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => UpdateErrorDto
    ): readonly UpdateErrorDto[] {
        return this.randomArray(
            () => this.sampleUpdateErrorDto(factory),
            length ?? this.arrayLength()
        );
    }
}
