import {
    CaseWorkerDto,
    ExposureDto,
    ExposureDtoStatusDtoEnum,
    InfectionDto,
    InfectionInformationDto,
    UserRoleDto,
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

export interface SampleModelFactories {
    CaseWorkerDto?: Factory<CaseWorkerDto> | ((testData: TestSampleData) => CaseWorkerDto);
    ExposureDto?: Factory<ExposureDto> | ((testData: TestSampleData) => ExposureDto);
    InfectionDto?: Factory<InfectionDto> | ((testData: TestSampleData) => InfectionDto);
    InfectionInformationDto?: Factory<InfectionInformationDto> | ((testData: TestSampleData) => InfectionInformationDto);
    UserRoleDto?: Factory<UserRoleDto> | ((testData: TestSampleData) => UserRoleDto);
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

    pickSome<T>(options: Array<T>): T[] {
        return this.random.pickSome(options);
    }

    uuidv4(): string {
        return this.random.uuidv4();
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
        return "foo";
    }

    sampleArrayString(length?: number): Array<string> {
        return Array.from({ length: length || this.arrayLength() }).map(() => this.sampleString());
    }

    generate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        template?: ((sampleData: TestSampleData) => any) | any,
        propertyDefinition?: PropertyDefinition,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generator?: () => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        if (template) {
            return typeof template === "function" ? template(this) : template;
        }
        if (propertyDefinition) {
            const { containerClass, propertyName, example } = propertyDefinition;
            if (this.sampleModelProperties[containerClass]) {
                const propertyFactory = this.sampleModelProperties[containerClass][propertyName];
                if (propertyFactory && typeof propertyFactory === "function") {
                    return propertyFactory(this);
                } else if (propertyFactory) {
                    return propertyFactory;
                }
            }
            if (this.samplePropertyValues[propertyName]) {
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
            case "CaseWorkerDto":
                return this.sampleCaseWorkerDto();
            case "Array<CaseWorkerDto>":
                return this.sampleArrayCaseWorkerDto();
            case "ExposureDto":
                return this.sampleExposureDto();
            case "Array<ExposureDto>":
                return this.sampleArrayExposureDto();
            case "InfectionDto":
                return this.sampleInfectionDto();
            case "Array<InfectionDto>":
                return this.sampleArrayInfectionDto();
            case "InfectionInformationDto":
                return this.sampleInfectionInformationDto();
            case "Array<InfectionInformationDto>":
                return this.sampleArrayInfectionInformationDto();
            case "UserRoleDto":
                return this.sampleUserRoleDto();
            case "Array<UserRoleDto>":
                return this.sampleArrayUserRoleDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleCaseWorkerDto(template: Factory<CaseWorkerDto> = {}): CaseWorkerDto {
        const containerClass = "CaseWorkerDto";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            fullName: this.generate(
                template?.fullName,
                { containerClass, propertyName: "fullName", isNullable: false },
                () => this.sampleString("", "Florence Nightingale")
            ),
            email: this.generate(
                template?.email,
                { containerClass, propertyName: "email", isNullable: false },
                () => this.sampleString("email", "null")
            ),
            role: this.generate(
                template?.role,
                { containerClass, propertyName: "role", example: "null", isNullable: false },
                () => this.sampleUserRoleDto()
            ),
        };
    }

    sampleArrayCaseWorkerDto(
        template: Factory<CaseWorkerDto> = {},
        length?: number
    ): Array<CaseWorkerDto> {
        return this.randomArray(
            () => this.sampleCaseWorkerDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleExposureDto(template: Factory<ExposureDto> = {}): ExposureDto {
        const containerClass = "ExposureDto";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            exposedPersonName: this.generate(
                template?.exposedPersonName,
                { containerClass, propertyName: "exposedPersonName", isNullable: false },
                () => this.sampleString("", "Jane Doe")
            ),
            exposedPersonPhoneNumber: this.generate(
                template?.exposedPersonPhoneNumber,
                { containerClass, propertyName: "exposedPersonPhoneNumber", isNullable: false },
                () => this.sampleString("phone", "null")
            ),
            exposedDate: this.generate(
                template?.exposedDate,
                { containerClass, propertyName: "exposedDate", example: "null", isNullable: false },
                () => this.sampleDate()
            ),
            exposureLocation: this.generate(
                template?.exposureLocation,
                { containerClass, propertyName: "exposureLocation", isNullable: false },
                () => this.sampleString("", "null")
            ),
            notes: this.generate(
                template?.notes,
                { containerClass, propertyName: "notes", isNullable: false },
                () => this.sampleString("", "null")
            ),
            caseWorker: this.generate(
                template?.caseWorker,
                { containerClass, propertyName: "caseWorker", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            status: this.generate(
                template?.status,
                { containerClass, propertyName: "status", example: "null", isNullable: false },
                () =>
                    this.pickOne([
                        ExposureDtoStatusDtoEnum.Unidentified,
                        ExposureDtoStatusDtoEnum.Identified,
                        ExposureDtoStatusDtoEnum.Contacted,
                        ExposureDtoStatusDtoEnum.Tested,
                        ExposureDtoStatusDtoEnum.Infected,
                    ])
            ),
        };
    }

    sampleArrayExposureDto(
        template: Factory<ExposureDto> = {},
        length?: number
    ): Array<ExposureDto> {
        return this.randomArray(
            () => this.sampleExposureDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleInfectionDto(template: Factory<InfectionDto> = {}): InfectionDto {
        const containerClass = "InfectionDto";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            information: this.generate(
                template?.information,
                { containerClass, propertyName: "information", example: "null", isNullable: false },
                () => this.sampleInfectionInformationDto()
            ),
            registeredExposures: this.generate(
                template?.registeredExposures,
                { containerClass, propertyName: "registeredExposures", example: null, isNullable: false },
                () => this.sampleArrayExposureDto()
            ),
        };
    }

    sampleArrayInfectionDto(
        template: Factory<InfectionDto> = {},
        length?: number
    ): Array<InfectionDto> {
        return this.randomArray(
            () => this.sampleInfectionDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleInfectionInformationDto(template: Factory<InfectionInformationDto> = {}): InfectionInformationDto {
        const containerClass = "InfectionInformationDto";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            patientName: this.generate(
                template?.patientName,
                { containerClass, propertyName: "patientName", isNullable: false },
                () => this.sampleString("", "John Smith")
            ),
            patientPhoneNumber: this.generate(
                template?.patientPhoneNumber,
                { containerClass, propertyName: "patientPhoneNumber", isNullable: false },
                () => this.sampleString("phone", "null")
            ),
            likelyInfectionDate: this.generate(
                template?.likelyInfectionDate,
                { containerClass, propertyName: "likelyInfectionDate", example: "null", isNullable: false },
                () => this.sampleDate()
            ),
            notes: this.generate(
                template?.notes,
                { containerClass, propertyName: "notes", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayInfectionInformationDto(
        template: Factory<InfectionInformationDto> = {},
        length?: number
    ): Array<InfectionInformationDto> {
        return this.randomArray(
            () => this.sampleInfectionInformationDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUserRoleDto(): UserRoleDto {
        const containerClass = "UserRoleDto";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            UserRoleDto.Administrator,
            UserRoleDto.Interviewer,
            UserRoleDto.Followup,
        ]);
    }

    sampleArrayUserRoleDto(length?: number): Array<UserRoleDto> {
        return this.randomArray(
            () => this.sampleUserRoleDto(),
            length ?? this.arrayLength()
        );
    }
}
