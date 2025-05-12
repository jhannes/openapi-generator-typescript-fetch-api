import {
    ChangeTrackedDto,
    CreatePersonCommandDto,
    PersonDto,
    PersonDtoGenderEnumValues,
    PersonNameDto,
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
    ChangeTrackedDto?: ModelFactory<ChangeTrackedDto>;
    CreatePersonCommandDto?: ModelFactory<CreatePersonCommandDto>;
    PersonDto?: ModelFactory<PersonDto>;
    PersonNameDto?: ModelFactory<PersonNameDto>;
    PersonSnapshotDto?: ModelFactory<PersonSnapshotDto>;
    RecipientDto?: ModelFactory<RecipientDto>;
    StringSnapshotDto?: ModelFactory<StringSnapshotDto>;
    SubscribeDto?: ModelFactory<SubscribeDto>;
    UnsubscribeDto?: ModelFactory<UnsubscribeDto>;
    UpdatePersonCommandDto?: ModelFactory<UpdatePersonCommandDto>;
    WebSocketCommandDto?: ModelFactory<WebSocketCommandDto>;
    WebSocketMessageDto?: ModelFactory<WebSocketMessageDto>;
    WebSocketRequestDto?: ModelFactory<WebSocketRequestDto>;
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
            case "ChangeTrackedDto":
                return this.sampleChangeTrackedDto();
            case "Array<ChangeTrackedDto>":
                return this.sampleArrayChangeTrackedDto();
            case "CreatePersonCommandDto":
                return this.sampleCreatePersonCommandDto();
            case "Array<CreatePersonCommandDto>":
                return this.sampleArrayCreatePersonCommandDto();
            case "PersonDto":
                return this.samplePersonDto();
            case "Array<PersonDto>":
                return this.sampleArrayPersonDto();
            case "PersonNameDto":
                return this.samplePersonNameDto();
            case "Array<PersonNameDto>":
                return this.sampleArrayPersonNameDto();
            case "PersonSnapshotDto":
                return this.samplePersonSnapshotDto();
            case "Array<PersonSnapshotDto>":
                return this.sampleArrayPersonSnapshotDto();
            case "RecipientDto":
                return this.sampleRecipientDto();
            case "Array<RecipientDto>":
                return this.sampleArrayRecipientDto();
            case "StringSnapshotDto":
                return this.sampleStringSnapshotDto();
            case "Array<StringSnapshotDto>":
                return this.sampleArrayStringSnapshotDto();
            case "SubscribeDto":
                return this.sampleSubscribeDto();
            case "Array<SubscribeDto>":
                return this.sampleArraySubscribeDto();
            case "UnsubscribeDto":
                return this.sampleUnsubscribeDto();
            case "Array<UnsubscribeDto>":
                return this.sampleArrayUnsubscribeDto();
            case "UpdatePersonCommandDto":
                return this.sampleUpdatePersonCommandDto();
            case "Array<UpdatePersonCommandDto>":
                return this.sampleArrayUpdatePersonCommandDto();
            case "WebSocketCommandDto":
                return this.sampleWebSocketCommandDto();
            case "Array<WebSocketCommandDto>":
                return this.sampleArrayWebSocketCommandDto();
            case "WebSocketMessageDto":
                return this.sampleWebSocketMessageDto();
            case "Array<WebSocketMessageDto>":
                return this.sampleArrayWebSocketMessageDto();
            case "WebSocketRequestDto":
                return this.sampleWebSocketRequestDto();
            case "Array<WebSocketRequestDto>":
                return this.sampleArrayWebSocketRequestDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleChangeTrackedDto(template?: Factory<ChangeTrackedDto>): ChangeTrackedDto {
        const containerClass = "ChangeTrackedDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            createdAt: this.generate(
                template?.createdAt,
                { containerClass, propertyName: "createdAt", example: "null", isNullable: false },
                () => this.sampleDate()
            ),
            createdBy: this.generate(
                template?.createdBy,
                { containerClass, propertyName: "createdBy", isNullable: false },
                () => this.sampleString("username", "null")
            ),
            updatedAt: this.generate(
                template?.updatedAt,
                { containerClass, propertyName: "updatedAt", example: "null", isNullable: false },
                () => this.sampleDate()
            ),
            updatedBy: this.generate(
                template?.updatedBy,
                { containerClass, propertyName: "updatedBy", isNullable: false },
                () => this.sampleString("username", "null")
            ),
        };
    }

    sampleArrayChangeTrackedDto(
        length?: number,
        template?: Factory<ChangeTrackedDto>
    ): ChangeTrackedDto[] {
        return this.randomArray(
            () => this.sampleChangeTrackedDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleCreatePersonCommandDto(template?: Factory<CreatePersonCommandDto>): CreatePersonCommandDto {
        const containerClass = "CreatePersonCommandDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            command: "createPerson",
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            person: this.generate(
                template?.person,
                { containerClass, propertyName: "person", example: "null", isNullable: false },
                () => this.samplePersonDto()
            ),
        };
    }

    sampleArrayCreatePersonCommandDto(
        length?: number,
        template?: Factory<CreatePersonCommandDto>
    ): CreatePersonCommandDto[] {
        return this.randomArray(
            () => this.sampleCreatePersonCommandDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePersonDto(template?: Factory<PersonDto>): PersonDto {
        const containerClass = "PersonDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            ...this.sampleRecipientDto(template),
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
                { containerClass, propertyName: "name", example: "null", isNullable: false },
                () => this.samplePersonNameDto()
            ),
            phone: this.generate(
                template?.phone,
                { containerClass, propertyName: "phone", isNullable: false },
                () => this.sampleString("phone", "null")
            ),
            birthDate: this.generate(
                template?.birthDate,
                { containerClass, propertyName: "birthDate", example: "null", isNullable: false },
                () => this.sampleLocalDate()
            ),
            gender: this.generate(
                template?.gender,
                { containerClass, propertyName: "gender", example: "null", isNullable: false },
                () => this.pickOne(PersonDtoGenderEnumValues)
            ),
        };
    }

    sampleArrayPersonDto(
        length?: number,
        template?: Factory<PersonDto>
    ): PersonDto[] {
        return this.randomArray(
            () => this.samplePersonDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePersonNameDto(template?: Factory<PersonNameDto>): PersonNameDto {
        const containerClass = "PersonNameDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
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
        };
    }

    sampleArrayPersonNameDto(
        length?: number,
        template?: Factory<PersonNameDto>
    ): PersonNameDto[] {
        return this.randomArray(
            () => this.samplePersonNameDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePersonSnapshotDto(template?: Factory<PersonSnapshotDto>): PersonSnapshotDto {
        const containerClass = "PersonSnapshotDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            ...this.sampleChangeTrackedDto(template),
            ...this.samplePersonDto(template),
            type: this.generate(
                template?.type,
                { containerClass, propertyName: "type", isNullable: false },
                () => this.sampleString("", "null")
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", example: "null", isNullable: false },
                () => this.samplePersonNameDto()
            ),
            extra: this.generate(
                template?.extra,
                { containerClass, propertyName: "extra", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayPersonSnapshotDto(
        length?: number,
        template?: Factory<PersonSnapshotDto>
    ): PersonSnapshotDto[] {
        return this.randomArray(
            () => this.samplePersonSnapshotDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleRecipientDto(template?: Factory<RecipientDto>): RecipientDto {
        const containerClass = "RecipientDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            email: this.generate(
                template?.email,
                { containerClass, propertyName: "email", isNullable: false },
                () => this.sampleString("email", "null")
            ),
        };
    }

    sampleArrayRecipientDto(
        length?: number,
        template?: Factory<RecipientDto>
    ): RecipientDto[] {
        return this.randomArray(
            () => this.sampleRecipientDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleStringSnapshotDto(template?: Factory<StringSnapshotDto>): StringSnapshotDto {
        const containerClass = "StringSnapshotDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            ...this.sampleChangeTrackedDto(template),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            type: this.generate(
                template?.type,
                { containerClass, propertyName: "type", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayStringSnapshotDto(
        length?: number,
        template?: Factory<StringSnapshotDto>
    ): StringSnapshotDto[] {
        return this.randomArray(
            () => this.sampleStringSnapshotDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleSubscribeDto(template?: Factory<SubscribeDto>): SubscribeDto {
        const containerClass = "SubscribeDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            request: "Subscribe",
        };
    }

    sampleArraySubscribeDto(
        length?: number,
        template?: Factory<SubscribeDto>
    ): SubscribeDto[] {
        return this.randomArray(
            () => this.sampleSubscribeDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUnsubscribeDto(template?: Factory<UnsubscribeDto>): UnsubscribeDto {
        const containerClass = "UnsubscribeDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            request: "Unsubscribe",
        };
    }

    sampleArrayUnsubscribeDto(
        length?: number,
        template?: Factory<UnsubscribeDto>
    ): UnsubscribeDto[] {
        return this.randomArray(
            () => this.sampleUnsubscribeDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUpdatePersonCommandDto(template?: Factory<UpdatePersonCommandDto>): UpdatePersonCommandDto {
        const containerClass = "UpdatePersonCommandDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            command: "updatePerson",
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            person: this.generate(
                template?.person,
                { containerClass, propertyName: "person", example: "null", isNullable: false },
                () => this.samplePersonDto()
            ),
        };
    }

    sampleArrayUpdatePersonCommandDto(
        length?: number,
        template?: Factory<UpdatePersonCommandDto>
    ): UpdatePersonCommandDto[] {
        return this.randomArray(
            () => this.sampleUpdatePersonCommandDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleWebSocketCommandDto(
        factory?: (sampleData: TestSampleData) => WebSocketCommandDto
    ): WebSocketCommandDto {
        const containerClass = "WebSocketCommandDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const command = this.pickOneString(["createPerson", "updatePerson"])
        switch (command) {
            case "createPerson":
                return {
                    ...this.sampleCreatePersonCommandDto(),
                    command,
                };
            case "updatePerson":
                return {
                    ...this.sampleUpdatePersonCommandDto(),
                    command,
                };
        }
    }

    sampleArrayWebSocketCommandDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => WebSocketCommandDto
    ): WebSocketCommandDto[] {
        return this.randomArray(
            () => this.sampleWebSocketCommandDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleWebSocketMessageDto(
        factory?: (sampleData: TestSampleData) => WebSocketMessageDto
    ): WebSocketMessageDto {
        const containerClass = "WebSocketMessageDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            () => this.sampleWebSocketCommandDto(),
            () => this.sampleWebSocketRequestDto(),
        ])();
    }

    sampleArrayWebSocketMessageDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => WebSocketMessageDto
    ): WebSocketMessageDto[] {
        return this.randomArray(
            () => this.sampleWebSocketMessageDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleWebSocketRequestDto(
        factory?: (sampleData: TestSampleData) => WebSocketRequestDto
    ): WebSocketRequestDto {
        const containerClass = "WebSocketRequestDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const request = this.pickOneString(["Subscribe"])
        switch (request) {
            case "Subscribe":
                return {
                    ...this.sampleSubscribeDto(),
                    request,
                };
        }
    }

    sampleArrayWebSocketRequestDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => WebSocketRequestDto
    ): WebSocketRequestDto[] {
        return this.randomArray(
            () => this.sampleWebSocketRequestDto(factory),
            length ?? this.arrayLength()
        );
    }
}
