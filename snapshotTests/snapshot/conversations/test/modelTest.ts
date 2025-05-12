import {
    AddMessageToConversationDeltaDto,
    ChangeTrackedDto,
    CommandToServerDto,
    ConversationInfoDto,
    ConversationMessageDto,
    ConversationMessageSnapshotDto,
    ConversationSnapshotDto,
    CreateConversationDeltaDto,
    DeltaDto,
    EventFromServerDto,
    MessageFromServerDto,
    MessageToServerDto,
    RequestToServerDto,
    SnapshotSetDto,
    SubscribeRequestDto,
    UpdateConversationDeltaDto,
    UpdateConversationSummaryDeltaDto,
    UpdateConversationTitleDeltaDto,
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
    AddMessageToConversationDeltaDto?: ModelFactory<AddMessageToConversationDeltaDto>;
    ChangeTrackedDto?: ModelFactory<ChangeTrackedDto>;
    CommandToServerDto?: ModelFactory<CommandToServerDto>;
    ConversationInfoDto?: ModelFactory<ConversationInfoDto>;
    ConversationMessageDto?: ModelFactory<ConversationMessageDto>;
    ConversationMessageSnapshotDto?: ModelFactory<ConversationMessageSnapshotDto>;
    ConversationSnapshotDto?: ModelFactory<ConversationSnapshotDto>;
    CreateConversationDeltaDto?: ModelFactory<CreateConversationDeltaDto>;
    DeltaDto?: ModelFactory<DeltaDto>;
    EventFromServerDto?: ModelFactory<EventFromServerDto>;
    MessageFromServerDto?: ModelFactory<MessageFromServerDto>;
    MessageToServerDto?: ModelFactory<MessageToServerDto>;
    RequestToServerDto?: ModelFactory<RequestToServerDto>;
    SnapshotSetDto?: ModelFactory<SnapshotSetDto>;
    SubscribeRequestDto?: ModelFactory<SubscribeRequestDto>;
    UpdateConversationDeltaDto?: ModelFactory<UpdateConversationDeltaDto>;
    UpdateConversationSummaryDeltaDto?: ModelFactory<UpdateConversationSummaryDeltaDto>;
    UpdateConversationTitleDeltaDto?: ModelFactory<UpdateConversationTitleDeltaDto>;
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
            case "AddMessageToConversationDeltaDto":
                return this.sampleAddMessageToConversationDeltaDto();
            case "Array<AddMessageToConversationDeltaDto>":
                return this.sampleArrayAddMessageToConversationDeltaDto();
            case "ChangeTrackedDto":
                return this.sampleChangeTrackedDto();
            case "Array<ChangeTrackedDto>":
                return this.sampleArrayChangeTrackedDto();
            case "CommandToServerDto":
                return this.sampleCommandToServerDto();
            case "Array<CommandToServerDto>":
                return this.sampleArrayCommandToServerDto();
            case "ConversationInfoDto":
                return this.sampleConversationInfoDto();
            case "Array<ConversationInfoDto>":
                return this.sampleArrayConversationInfoDto();
            case "ConversationMessageDto":
                return this.sampleConversationMessageDto();
            case "Array<ConversationMessageDto>":
                return this.sampleArrayConversationMessageDto();
            case "ConversationMessageSnapshotDto":
                return this.sampleConversationMessageSnapshotDto();
            case "Array<ConversationMessageSnapshotDto>":
                return this.sampleArrayConversationMessageSnapshotDto();
            case "ConversationSnapshotDto":
                return this.sampleConversationSnapshotDto();
            case "Array<ConversationSnapshotDto>":
                return this.sampleArrayConversationSnapshotDto();
            case "CreateConversationDeltaDto":
                return this.sampleCreateConversationDeltaDto();
            case "Array<CreateConversationDeltaDto>":
                return this.sampleArrayCreateConversationDeltaDto();
            case "DeltaDto":
                return this.sampleDeltaDto();
            case "Array<DeltaDto>":
                return this.sampleArrayDeltaDto();
            case "EventFromServerDto":
                return this.sampleEventFromServerDto();
            case "Array<EventFromServerDto>":
                return this.sampleArrayEventFromServerDto();
            case "MessageFromServerDto":
                return this.sampleMessageFromServerDto();
            case "Array<MessageFromServerDto>":
                return this.sampleArrayMessageFromServerDto();
            case "MessageToServerDto":
                return this.sampleMessageToServerDto();
            case "Array<MessageToServerDto>":
                return this.sampleArrayMessageToServerDto();
            case "RequestToServerDto":
                return this.sampleRequestToServerDto();
            case "Array<RequestToServerDto>":
                return this.sampleArrayRequestToServerDto();
            case "SnapshotSetDto":
                return this.sampleSnapshotSetDto();
            case "Array<SnapshotSetDto>":
                return this.sampleArraySnapshotSetDto();
            case "SubscribeRequestDto":
                return this.sampleSubscribeRequestDto();
            case "Array<SubscribeRequestDto>":
                return this.sampleArraySubscribeRequestDto();
            case "UpdateConversationDeltaDto":
                return this.sampleUpdateConversationDeltaDto();
            case "Array<UpdateConversationDeltaDto>":
                return this.sampleArrayUpdateConversationDeltaDto();
            case "UpdateConversationSummaryDeltaDto":
                return this.sampleUpdateConversationSummaryDeltaDto();
            case "Array<UpdateConversationSummaryDeltaDto>":
                return this.sampleArrayUpdateConversationSummaryDeltaDto();
            case "UpdateConversationTitleDeltaDto":
                return this.sampleUpdateConversationTitleDeltaDto();
            case "Array<UpdateConversationTitleDeltaDto>":
                return this.sampleArrayUpdateConversationTitleDeltaDto();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleAddMessageToConversationDeltaDto(template?: Factory<AddMessageToConversationDeltaDto>): AddMessageToConversationDeltaDto {
        const containerClass = "AddMessageToConversationDeltaDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            delta: "AddMessageToConversationDelta",
            conversationId: this.generate(
                template?.conversationId,
                { containerClass, propertyName: "conversationId", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            messageId: this.generate(
                template?.messageId,
                { containerClass, propertyName: "messageId", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            message: this.generate(
                template?.message,
                { containerClass, propertyName: "message", example: "null", isNullable: false },
                () => this.sampleConversationMessageDto()
            ),
        };
    }

    sampleArrayAddMessageToConversationDeltaDto(
        length?: number,
        template?: Factory<AddMessageToConversationDeltaDto>
    ): AddMessageToConversationDeltaDto[] {
        return this.randomArray(
            () => this.sampleAddMessageToConversationDeltaDto(template),
            length ?? this.arrayLength()
        );
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
            updatedAt: this.generate(
                template?.updatedAt,
                { containerClass, propertyName: "updatedAt", example: "null", isNullable: false },
                () => this.sampleDate()
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

    sampleCommandToServerDto(template?: Factory<CommandToServerDto>): CommandToServerDto {
        const containerClass = "CommandToServerDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            clientTime: this.generate(
                template?.clientTime,
                { containerClass, propertyName: "clientTime", example: "null", isNullable: false },
                () => this.sampleDate()
            ),
            delta: this.generate(
                template?.delta,
                { containerClass, propertyName: "delta", example: "null", isNullable: false },
                () => this.sampleDeltaDto()
            ),
        };
    }

    sampleArrayCommandToServerDto(
        length?: number,
        template?: Factory<CommandToServerDto>
    ): CommandToServerDto[] {
        return this.randomArray(
            () => this.sampleCommandToServerDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleConversationInfoDto(template?: Factory<ConversationInfoDto>): ConversationInfoDto {
        const containerClass = "ConversationInfoDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            title: this.generate(
                template?.title,
                { containerClass, propertyName: "title", isNullable: false },
                () => this.sampleString("", "null")
            ),
            summary: this.generate(
                template?.summary,
                { containerClass, propertyName: "summary", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayConversationInfoDto(
        length?: number,
        template?: Factory<ConversationInfoDto>
    ): ConversationInfoDto[] {
        return this.randomArray(
            () => this.sampleConversationInfoDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleConversationMessageDto(template?: Factory<ConversationMessageDto>): ConversationMessageDto {
        const containerClass = "ConversationMessageDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            text: this.generate(
                template?.text,
                { containerClass, propertyName: "text", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayConversationMessageDto(
        length?: number,
        template?: Factory<ConversationMessageDto>
    ): ConversationMessageDto[] {
        return this.randomArray(
            () => this.sampleConversationMessageDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleConversationMessageSnapshotDto(template?: Factory<ConversationMessageSnapshotDto>): ConversationMessageSnapshotDto {
        const containerClass = "ConversationMessageSnapshotDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            ...this.sampleChangeTrackedDto(template),
            ...this.sampleConversationMessageDto(template),
        };
    }

    sampleArrayConversationMessageSnapshotDto(
        length?: number,
        template?: Factory<ConversationMessageSnapshotDto>
    ): ConversationMessageSnapshotDto[] {
        return this.randomArray(
            () => this.sampleConversationMessageSnapshotDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleConversationSnapshotDto(template?: Factory<ConversationSnapshotDto>): ConversationSnapshotDto {
        const containerClass = "ConversationSnapshotDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            ...this.sampleChangeTrackedDto(template),
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            info: this.generate(
                template?.info,
                { containerClass, propertyName: "info", example: "null", isNullable: false },
                () => this.sampleConversationInfoDto()
            ),
            messages: this.generate(
                template?.messages,
                { containerClass, propertyName: "messages", example: null, isNullable: false },
                () => this.sampleArrayConversationMessageSnapshotDto()
            ),
        };
    }

    sampleArrayConversationSnapshotDto(
        length?: number,
        template?: Factory<ConversationSnapshotDto>
    ): ConversationSnapshotDto[] {
        return this.randomArray(
            () => this.sampleConversationSnapshotDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleCreateConversationDeltaDto(template?: Factory<CreateConversationDeltaDto>): CreateConversationDeltaDto {
        const containerClass = "CreateConversationDeltaDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            delta: "CreateConversationDelta",
            conversationId: this.generate(
                template?.conversationId,
                { containerClass, propertyName: "conversationId", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            info: this.generate(
                template?.info,
                { containerClass, propertyName: "info", example: "null", isNullable: false },
                () => this.sampleConversationInfoDto()
            ),
        };
    }

    sampleArrayCreateConversationDeltaDto(
        length?: number,
        template?: Factory<CreateConversationDeltaDto>
    ): CreateConversationDeltaDto[] {
        return this.randomArray(
            () => this.sampleCreateConversationDeltaDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleDeltaDto(
        factory?: (sampleData: TestSampleData) => DeltaDto
    ): DeltaDto {
        const containerClass = "DeltaDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const delta = this.pickOneString(["AddMessageToConversationDelta", "UpdateConversationDelta", "CreateConversationDelta"])
        switch (delta) {
            case "AddMessageToConversationDelta":
                return {
                    ...this.sampleAddMessageToConversationDeltaDto(),
                    delta,
                };
            case "UpdateConversationDelta":
                return this.sampleUpdateConversationDeltaDto();
            case "CreateConversationDelta":
                return {
                    ...this.sampleCreateConversationDeltaDto(),
                    delta,
                };
        }
    }

    sampleArrayDeltaDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => DeltaDto
    ): DeltaDto[] {
        return this.randomArray(
            () => this.sampleDeltaDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleEventFromServerDto(template?: Factory<EventFromServerDto>): EventFromServerDto {
        const containerClass = "EventFromServerDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            ...this.sampleCommandToServerDto(template),
            serverTime: this.generate(
                template?.serverTime,
                { containerClass, propertyName: "serverTime", example: "null", isNullable: false },
                () => this.sampleDate()
            ),
            username: this.generate(
                template?.username,
                { containerClass, propertyName: "username", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayEventFromServerDto(
        length?: number,
        template?: Factory<EventFromServerDto>
    ): EventFromServerDto[] {
        return this.randomArray(
            () => this.sampleEventFromServerDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleMessageFromServerDto(
        factory?: (sampleData: TestSampleData) => MessageFromServerDto
    ): MessageFromServerDto {
        const containerClass = "MessageFromServerDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            () => this.sampleSnapshotSetDto(),
            () => this.sampleEventFromServerDto(),
        ])();
    }

    sampleArrayMessageFromServerDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => MessageFromServerDto
    ): MessageFromServerDto[] {
        return this.randomArray(
            () => this.sampleMessageFromServerDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleMessageToServerDto(
        factory?: (sampleData: TestSampleData) => MessageToServerDto
    ): MessageToServerDto {
        const containerClass = "MessageToServerDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            () => this.sampleCommandToServerDto(),
            () => this.sampleRequestToServerDto(),
        ])();
    }

    sampleArrayMessageToServerDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => MessageToServerDto
    ): MessageToServerDto[] {
        return this.randomArray(
            () => this.sampleMessageToServerDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleRequestToServerDto(
        factory?: (sampleData: TestSampleData) => RequestToServerDto
    ): RequestToServerDto {
        const containerClass = "RequestToServerDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const request = this.pickOneString(["SubscribeRequest"])
        switch (request) {
            case "SubscribeRequest":
                return {
                    ...this.sampleSubscribeRequestDto(),
                    request,
                };
        }
    }

    sampleArrayRequestToServerDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => RequestToServerDto
    ): RequestToServerDto[] {
        return this.randomArray(
            () => this.sampleRequestToServerDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleSnapshotSetDto(template?: Factory<SnapshotSetDto>): SnapshotSetDto {
        const containerClass = "SnapshotSetDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            conversations: this.generate(
                template?.conversations,
                { containerClass, propertyName: "conversations", example: null, isNullable: false },
                () => this.sampleArrayConversationSnapshotDto()
            ),
        };
    }

    sampleArraySnapshotSetDto(
        length?: number,
        template?: Factory<SnapshotSetDto>
    ): SnapshotSetDto[] {
        return this.randomArray(
            () => this.sampleSnapshotSetDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleSubscribeRequestDto(template?: Factory<SubscribeRequestDto>): SubscribeRequestDto {
        const containerClass = "SubscribeRequestDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            request: "SubscribeRequest",
            clientId: this.generate(
                template?.clientId,
                { containerClass, propertyName: "clientId", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
        };
    }

    sampleArraySubscribeRequestDto(
        length?: number,
        template?: Factory<SubscribeRequestDto>
    ): SubscribeRequestDto[] {
        return this.randomArray(
            () => this.sampleSubscribeRequestDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUpdateConversationDeltaDto(
        factory?: (sampleData: TestSampleData) => UpdateConversationDeltaDto
    ): UpdateConversationDeltaDto {
        const containerClass = "UpdateConversationDeltaDto";
        if (factory) {
            return factory(this);
        }
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        const delta = this.pickOneString(["UpdateConversationTitleDelta", "UpdateConversationSummaryDelta"])
        switch (delta) {
            case "UpdateConversationTitleDelta":
                return {
                    ...this.sampleUpdateConversationTitleDeltaDto(),
                    delta,
                };
            case "UpdateConversationSummaryDelta":
                return {
                    ...this.sampleUpdateConversationSummaryDeltaDto(),
                    delta,
                };
        }
    }

    sampleArrayUpdateConversationDeltaDto(
        length?: number,
        factory?: (sampleData: TestSampleData) => UpdateConversationDeltaDto
    ): UpdateConversationDeltaDto[] {
        return this.randomArray(
            () => this.sampleUpdateConversationDeltaDto(factory),
            length ?? this.arrayLength()
        );
    }

    sampleUpdateConversationSummaryDeltaDto(template?: Factory<UpdateConversationSummaryDeltaDto>): UpdateConversationSummaryDeltaDto {
        const containerClass = "UpdateConversationSummaryDeltaDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            delta: "UpdateConversationSummaryDelta",
            conversationId: this.generate(
                template?.conversationId,
                { containerClass, propertyName: "conversationId", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            summary: this.generate(
                template?.summary,
                { containerClass, propertyName: "summary", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayUpdateConversationSummaryDeltaDto(
        length?: number,
        template?: Factory<UpdateConversationSummaryDeltaDto>
    ): UpdateConversationSummaryDeltaDto[] {
        return this.randomArray(
            () => this.sampleUpdateConversationSummaryDeltaDto(template),
            length ?? this.arrayLength()
        );
    }

    sampleUpdateConversationTitleDeltaDto(template?: Factory<UpdateConversationTitleDeltaDto>): UpdateConversationTitleDeltaDto {
        const containerClass = "UpdateConversationTitleDeltaDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            delta: "UpdateConversationTitleDelta",
            conversationId: this.generate(
                template?.conversationId,
                { containerClass, propertyName: "conversationId", isNullable: false },
                () => this.sampleString("uuid", "null")
            ),
            title: this.generate(
                template?.title,
                { containerClass, propertyName: "title", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayUpdateConversationTitleDeltaDto(
        length?: number,
        template?: Factory<UpdateConversationTitleDeltaDto>
    ): UpdateConversationTitleDeltaDto[] {
        return this.randomArray(
            () => this.sampleUpdateConversationTitleDeltaDto(template),
            length ?? this.arrayLength()
        );
    }
}
