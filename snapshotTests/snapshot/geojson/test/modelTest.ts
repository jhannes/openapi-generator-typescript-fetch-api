import {
    GeometryCollectionDto,
    GeometryDto,
    LineStringDto,
    PointDto,
    PolygonDto,
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

    hash(s: string | number): number {
        if (typeof s === "number") {
            return s;
        }
        return s.split("").reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0);
            return a & a;
        }, 0);
    }
}

type Factory<T> = {
    [P in keyof T]?: ((sampleData: TestSampleData) => T[P]) | T[P];
};

type ModelFactory<T> = Factory<T> | ((testData: TestSampleData) => T);

export interface SampleModelFactories {
    GeometryCollectionDto?: ModelFactory<GeometryCollectionDto>;
    GeometryDto?: ModelFactory<GeometryDto>;
    LineStringDto?: ModelFactory<LineStringDto>;
    PointDto?: ModelFactory<PointDto>;
    PolygonDto?: ModelFactory<PolygonDto>;
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
        this.now = now || new Date(2019, 1, this.random.hash(seed || 100));
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
            case "GeometryCollectionDto":
                return this.sampleGeometryCollectionDto();
            case "Array<GeometryCollectionDto>":
                return this.sampleArrayGeometryCollectionDto();
            case "GeometryDto":
                return this.sampleGeometryDto();
            case "Array<GeometryDto>":
                return this.sampleArrayGeometryDto();
            case "LineStringDto":
                return this.sampleLineStringDto();
            case "Array<LineStringDto>":
                return this.sampleArrayLineStringDto();
            case "PointDto":
                return this.samplePointDto();
            case "Array<PointDto>":
                return this.sampleArrayPointDto();
            case "PolygonDto":
                return this.samplePolygonDto();
            case "Array<PolygonDto>":
                return this.sampleArrayPolygonDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleGeometryCollectionDto(template?: Factory<GeometryCollectionDto>): GeometryCollectionDto {
        const containerClass = "GeometryCollectionDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            type: "GeometryCollection",
            geometries: this.generate(
                template?.geometries,
                { containerClass, propertyName: "geometries", example: null, isNullable: false },
                () => this.sampleArrayGeometryDto()
            ),
        };
    }

    sampleArrayGeometryCollectionDto(
        template: Factory<GeometryCollectionDto> = {},
        length?: number
    ): Array<GeometryCollectionDto> {
        return this.randomArray(
            () => this.sampleGeometryCollectionDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleGeometryDto(
        factory?: (sampleData: TestSampleData) => GeometryDto
    ): GeometryDto {
        const containerClass = "GeometryDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const type = this.pickOneString(["Point", "Polygon", "LineString"])
        switch (type) {
            case "Point":
                return {
                    ...this.samplePointDto(),
                    type,
                };
            case "Polygon":
                return {
                    ...this.samplePolygonDto(),
                    type,
                };
            case "LineString":
                return {
                    ...this.sampleLineStringDto(),
                    type,
                };
        }
    }

    sampleArrayGeometryDto(
        factory?: (sampleData: TestSampleData) => GeometryDto,
        length?: number
    ): Array<GeometryDto> {
        return this.randomArray(
            () => this.sampleGeometryDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleLineStringDto(template?: Factory<LineStringDto>): LineStringDto {
        const containerClass = "LineStringDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            type: "LineString",
            coordinates: this.generate(
                template?.coordinates,
                { containerClass, propertyName: "coordinates", example: null, isNullable: false },
                () => {
                    throw new Error("Can't automatically generate for Array<Array<number>>");
                }
            ),
        };
    }

    sampleArrayLineStringDto(
        template: Factory<LineStringDto> = {},
        length?: number
    ): Array<LineStringDto> {
        return this.randomArray(
            () => this.sampleLineStringDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePointDto(template?: Factory<PointDto>): PointDto {
        const containerClass = "PointDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            type: "Point",
            coordinates: this.generate(
                template?.coordinates,
                { containerClass, propertyName: "coordinates", example: null, isNullable: false },
                () => this.sampleArraynumber()
            ),
        };
    }

    sampleArrayPointDto(
        template: Factory<PointDto> = {},
        length?: number
    ): Array<PointDto> {
        return this.randomArray(
            () => this.samplePointDto(template),
            length ?? this.arrayLength()
        );
    }

    samplePolygonDto(template?: Factory<PolygonDto>): PolygonDto {
        const containerClass = "PolygonDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            type: "Polygon",
            coordinates: this.generate(
                template?.coordinates,
                { containerClass, propertyName: "coordinates", example: null, isNullable: false },
                () => {
                    throw new Error("Can't automatically generate for Array<Array<Array<number>>>");
                }
            ),
        };
    }

    sampleArrayPolygonDto(
        template: Factory<PolygonDto> = {},
        length?: number
    ): Array<PolygonDto> {
        return this.randomArray(
            () => this.samplePolygonDto(template),
            length ?? this.arrayLength()
        );
    }
}
