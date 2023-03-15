import {
    AddressDto,
    CatDto,
    DogDto,
    DogDtoBreedEnumValues,
    PetBaseDto,
    PetDto,
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
    AddressDto?: ModelFactory<AddressDto>;
    CatDto?: ModelFactory<CatDto>;
    DogDto?: ModelFactory<DogDto>;
    PetBaseDto?: ModelFactory<PetBaseDto>;
    PetDto?: ModelFactory<PetDto>;
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
            case "AddressDto":
                return this.sampleAddressDto();
            case "Array<AddressDto>":
                return this.sampleArrayAddressDto();
            case "CatDto":
                return this.sampleCatDto();
            case "Array<CatDto>":
                return this.sampleArrayCatDto();
            case "DogDto":
                return this.sampleDogDto();
            case "Array<DogDto>":
                return this.sampleArrayDogDto();
            case "PetBaseDto":
                return this.samplePetBaseDto();
            case "Array<PetBaseDto>":
                return this.sampleArrayPetBaseDto();
            case "PetDto":
                return this.samplePetDto();
            case "Array<PetDto>":
                return this.sampleArrayPetDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleAddressDto(template?: Factory<AddressDto>): AddressDto {
        const containerClass = "AddressDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            addressLine1: this.generate(
                template?.addressLine1,
                { containerClass, propertyName: "addressLine1", isNullable: false },
                () => this.sampleString("", "null")
            ),
            addressLine2: this.generate(
                template?.addressLine2,
                { containerClass, propertyName: "addressLine2", isNullable: false },
                () => this.sampleString("", "null")
            ),
            city: this.generate(
                template?.city,
                { containerClass, propertyName: "city", isNullable: false },
                () => this.sampleString("", "null")
            ),
            country: this.generate(
                template?.country,
                { containerClass, propertyName: "country", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayAddressDto(
        length?: number,
        template?: Factory<AddressDto>
    ): readonly AddressDto[] {
        return this.randomArray(
            () => this.sampleAddressDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleCatDto(template?: Factory<CatDto>): CatDto {
        const containerClass = "CatDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("", "null")
            ),
            pet_type: "Cat",
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            birth_date: this.generate(
                template?.birth_date,
                { containerClass, propertyName: "birth_date", isNullable: false },
                () => this.sampleString("", "null")
            ),
            ownerAddress: this.generate(
                template?.ownerAddress,
                { containerClass, propertyName: "ownerAddress", example: "null", isNullable: false },
                () => this.sampleAddressDto()
            ),
            hunts: this.generate(
                template?.hunts,
                { containerClass, propertyName: "hunts", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
            age: this.generate(
                template?.age,
                { containerClass, propertyName: "age", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
        };
    }

    sampleArrayCatDto(
        length?: number,
        template?: Factory<CatDto>
    ): readonly CatDto[] {
        return this.randomArray(
            () => this.sampleCatDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleDogDto(template?: Factory<DogDto>): DogDto {
        const containerClass = "DogDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("", "null")
            ),
            pet_type: "Dog",
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            birth_date: this.generate(
                template?.birth_date,
                { containerClass, propertyName: "birth_date", isNullable: false },
                () => this.sampleString("", "null")
            ),
            ownerAddress: this.generate(
                template?.ownerAddress,
                { containerClass, propertyName: "ownerAddress", example: "null", isNullable: false },
                () => this.sampleAddressDto()
            ),
            bark: this.generate(
                template?.bark,
                { containerClass, propertyName: "bark", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
            breed: this.generate(
                template?.breed,
                { containerClass, propertyName: "breed", example: "null", isNullable: false },
                () => this.pickOne(DogDtoBreedEnumValues)
            ),
        };
    }

    sampleArrayDogDto(
        length?: number,
        template?: Factory<DogDto>
    ): readonly DogDto[] {
        return this.randomArray(
            () => this.sampleDogDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePetBaseDto(template?: Factory<PetBaseDto>): PetBaseDto {
        const containerClass = "PetBaseDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("", "null")
            ),
            pet_type: this.generate(
                template?.pet_type,
                { containerClass, propertyName: "pet_type", isNullable: false },
                () => this.sampleString("", "null")
            ),
            name: this.generate(
                template?.name,
                { containerClass, propertyName: "name", isNullable: false },
                () => this.sampleString("", "null")
            ),
            birth_date: this.generate(
                template?.birth_date,
                { containerClass, propertyName: "birth_date", isNullable: false },
                () => this.sampleString("", "null")
            ),
            ownerAddress: this.generate(
                template?.ownerAddress,
                { containerClass, propertyName: "ownerAddress", example: "null", isNullable: false },
                () => this.sampleAddressDto()
            ),
        };
    }

    sampleArrayPetBaseDto(
        length?: number,
        template?: Factory<PetBaseDto>
    ): readonly PetBaseDto[] {
        return this.randomArray(
            () => this.samplePetBaseDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePetDto(
        factory?: (sampleData: TestSampleData) => PetDto
    ): PetDto {
        const containerClass = "PetDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const pet_type = this.pickOneString(["Cat", "Dog"])
        switch (pet_type) {
            case "Cat":
                return {
                    ...this.sampleCatDto(),
                    pet_type,
                };
            case "Dog":
                return {
                    ...this.sampleDogDto(),
                    pet_type,
                };
        }
    }

    sampleArrayPetDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => PetDto
    ): readonly PetDto[] {
        return this.randomArray(
            () => this.samplePetDto(factory),
            length ?? this.arrayLength()
        );
    }
}
