import {
    CategoryDto,
    OrderDto,
    OrderDtoStatusEnum,
    OrderDtoStatusEnumValues,
    PetDto,
    PetDtoStatusEnum,
    PetDtoStatusEnumValues,
    TagDto,
    UserDto,
} from "../model";

export class Random {
    seed: number;
    constructor(seed: number) {
        this.seed = seed % 2147483647;
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

    pickOne<T>(options: Array<T>): T {
        return options[this.nextInt(options.length)];
    }

    pickSome<T>(options: Array<T>, n?: number): T[] {
        const shuffled = options.sort(() => 0.5 - this.next());
        return shuffled.slice(0, n || this.nextInt(options.length));
    }

    uuidv4(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = this.nextInt(16) | 0;
            const v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

type Factory<T> = {
    [P in keyof T]?: ((sampleData: TestSampleData) => T[P]) | T[P];
};

type ModelFactory<T> = Factory<T> | ((testData: TestSampleData) => T);

export interface SampleModelFactories {
    CategoryDto?: ModelFactory<CategoryDto>;
    OrderDto?: ModelFactory<OrderDto>;
    PetDto?: ModelFactory<PetDto>;
    TagDto?: ModelFactory<TagDto>;
    UserDto?: ModelFactory<UserDto>;
}

export interface SamplePropertyValues {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (sampleData: TestSampleData) => any;
}

export interface TestData {
    seed?: number;
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
        this.now = now || new Date(2019, 1, seed);
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

    pickOne<T>(options: Array<T>): T {
        return this.random.pickOne(options);
    }

    pickOneString<T extends string>(options: Array<T>): T {
        return this.random.pickOne(options);
    }

    pickSome<T>(options: Array<T>): T[] {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sampleany(): any {
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

    sampleArrayArray<T>(length?: number): Array<Array<T>> {
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
            case "CategoryDto":
                return this.sampleCategoryDto();
            case "Array<CategoryDto>":
                return this.sampleArrayCategoryDto();
            case "OrderDto":
                return this.sampleOrderDto();
            case "Array<OrderDto>":
                return this.sampleArrayOrderDto();
            case "PetDto":
                return this.samplePetDto();
            case "Array<PetDto>":
                return this.sampleArrayPetDto();
            case "TagDto":
                return this.sampleTagDto();
            case "Array<TagDto>":
                return this.sampleArrayTagDto();
            case "UserDto":
                return this.sampleUserDto();
            case "Array<UserDto>":
                return this.sampleArrayUserDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleCategoryDto(template?: Factory<CategoryDto>): CategoryDto {
        const containerClass = "CategoryDto";
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
        };
    }

    sampleArrayCategoryDto(
        template: Factory<CategoryDto> = {},
        length?: number
    ): Array<CategoryDto> {
        return this.randomArray(
            () => this.sampleCategoryDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleOrderDto(template?: Factory<OrderDto>): OrderDto {
        const containerClass = "OrderDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            petId: this.generate(
                template?.petId,
                { containerClass, propertyName: "petId", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            quantity: this.generate(
                template?.quantity,
                { containerClass, propertyName: "quantity", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            shipDate: this.generate(
                template?.shipDate,
                { containerClass, propertyName: "shipDate", example: "null", isNullable: false },
                () => this.sampleDate()
            ),
            status: this.generate(
                template?.status,
                { containerClass, propertyName: "status", example: "null", isNullable: false },
                () => this.pickOne(OrderDtoStatusEnumValues)
            ),
            complete: this.generate(
                template?.complete,
                { containerClass, propertyName: "complete", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
        };
    }

    sampleArrayOrderDto(
        template: Factory<OrderDto> = {},
        length?: number
    ): Array<OrderDto> {
        return this.randomArray(
            () => this.sampleOrderDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePetDto(template?: Factory<PetDto>): PetDto {
        const containerClass = "PetDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            category: this.generate(
                template?.category,
                { containerClass, propertyName: "category", example: "null", isNullable: false },
                () => this.sampleCategoryDto()
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "doggie")
            ),
            photoUrls: this.generate(
                template?.photoUrls,
                { containerClass, propertyName: "photoUrls", example: null, isNullable: false },
                () => this.sampleArrayString()
            ),
            tags: this.generate(
                template?.tags,
                { containerClass, propertyName: "tags", example: null, isNullable: false },
                () => this.sampleArrayTagDto()
            ),
            status: this.generate(
                template?.status,
                { containerClass, propertyName: "status", example: "null", isNullable: false },
                () => this.pickOne(PetDtoStatusEnumValues)
            ),
        };
    }

    sampleArrayPetDto(
        template: Factory<PetDto> = {},
        length?: number
    ): Array<PetDto> {
        return this.randomArray(
            () => this.samplePetDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleTagDto(template?: Factory<TagDto>): TagDto {
        const containerClass = "TagDto";
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
        };
    }

    sampleArrayTagDto(
        template: Factory<TagDto> = {},
        length?: number
    ): Array<TagDto> {
        return this.randomArray(
            () => this.sampleTagDto(template),
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
            username: this.generate(
                template?.username,
                { containerClass, propertyName: "username", isNullable: false },
                () => this.sampleString("", "null")
            ),
            firstName: this.generate(
                template?.firstName,
                { containerClass, propertyName: "firstName", isNullable: false },
                () => this.sampleString("", "null")
            ),
            lastName: this.generate(
                template?.lastName,
                { containerClass, propertyName: "lastName", isNullable: false },
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
            phone: this.generate(
                template?.phone,
                { containerClass, propertyName: "phone", isNullable: false },
                () => this.sampleString("", "null")
            ),
            userStatus: this.generate(
                template?.userStatus,
                { containerClass, propertyName: "userStatus", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
        };
    }

    sampleArrayUserDto(
        template: Factory<UserDto> = {},
        length?: number
    ): Array<UserDto> {
        return this.randomArray(
            () => this.sampleUserDto(template),
            length ?? this.arrayLength()
        );
    }
}
