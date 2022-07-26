[![Apache 2.0 License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Maven Central](https://maven-badges.herokuapp.com/maven-central/io.github.jhannes.openapi/openapi-generator-typescript-fetch-api/badge.svg)](https://maven-badges.herokuapp.com/maven-central/io.github.jhannes.openapi/openapi-generator-typescript-fetch-api)

# OpenAPI Generator for TypeScript client library using Fetch API and API interfaces

## Features

* Generates code that resembles plain `fetch` calls
* Supports `fetch` options like `cache`, `credentials`, `headers` and abort `signal`
* Supports `oneOf`-polymorphism with union types and discriminators
* Implements `enum` with union types, with single element enums becoming constants
* Supports `query` parameter options `explode` and `style`
* Supports `securitySchemes`
* Support blob response types
* Generates sample model data generators for test purposes
* Generated code have no eslint or prettier warnings except long lines

## Overview

This is a plugin to [OpenApi Generator](https://openapi-generator.tech/) which generates Typescript client libraries from openapi specifications using the native `fetch` method. The generated code has no dependencies.

The output contains both interfaces and classes for each `tag` in the input specification, [for example](https://github.com/jhannes/openapi-generator-typescript-fetch-api/blob/main/snapshotTests/snapshot/petstore/api.ts):

```typescript
/**
 * PetApi - object-oriented interface
 */
export interface PetApiInterface {
    /**
     *
     * @summary Add a new pet to the store
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    addPet(params: {
        petDto?: PetDto;
        security: petstore_auth;
    } & RequestCallOptions): Promise<void>;
}

/**
 * PetApi - object-oriented interface
 */
export class PetApi extends BaseAPI implements PetApiInterface {
    /**
     *
     * @summary Add a new pet to the store
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async addPet(params: {
        petDto?: PetDto;
        security: petstore_auth;
    } & RequestCallOptions): Promise<void> {
        return await this.fetch(
            this.basePath + "/pet",
            {
                ...params,
                method: "POST",
                body: JSON.stringify(params.petDto),
                headers: {
                    ...this.removeEmpty(params.headers),
                    ...params.security?.headers(),
                    "Content-Type": "application/json",
                },
            }
        );
    }
}
```

The generated code is straightforward to use:

```typescript
const petApi = new PetApi();
try {
    await petApi.addPet({
        petDto: { category: "dog", name: "Fido" },
        security: new petstore_auth(bearerToken)
    })
} catch (error) {
    console.error(error);
}
```

#### Example input

This is the fragment of the specification used to generate the code above:

```json
{
  "paths": {
    "/pet": {
      "post": {
        "tags": [
          "pet"
        ],
        "summary": "Add a new pet to the store",
        "operationId": "addPet",
        "security": [
          {
            "petstore_auth": [
              "write:pets"
            ]
          }
        ],
        "requestBody": {
          "$ref": "#/components/requestBodies/Pet"
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "petstore_auth": {
        "type": "oauth2",
        "flows": {
          "implicit": {
            "authorizationUrl": "http://petstore.swagger.io/api/oauth/dialog",
            "scopes": {
              "write:pets": "modify pets in your account"
            }
          }
        }
      }
    }
  }
}
```


### Generated test support code

To facilitate testing, the code ships which interface test stubs and test generators. [For example](https://github.com/jhannes/openapi-generator-typescript-fetch-api/blob/main/snapshotTests/snapshot/petstore/test/modelTest.ts):

```typescript
export function mockPetApi(operations: {
    addPet?: () => Promise<void>;
    getPetById?: () => Promise<PetDto>;
} = {}): PetApiInterface {
    return {
        addPet: operations.addPet || reject("PetApi.addPet"),
        getPetById: operations.getPetById || reject("PetApi.getPetById"),
    };
}

export class TestSampleData {
    samplePetDto(template?: Factory<PetDto>): PetDto {
        const containerClass = "PetDto";
        if (!template && typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                {containerClass, propertyName: "id", example: "null", isNullable: false},
                () => this.samplenumber()
            ),
            category: this.generate(
                template?.category,
                {containerClass, propertyName: "category", example: "null", isNullable: false},
                () => this.sampleCategoryDto()
            )
        };
    }
}
```

This can be used while testing. For example with React:

```typescript jsx
import {render, unmountComponentAtNode} from "react-dom";

it("shows pets", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const testData = new TestSampleData({seed: 300});

    await render(
        <ApisContext.Provider values={{petApi: mockPetApi({
            getPetById: () => testData.samplePetDto()
        })}}>
            <PetDisplayScreen />
        </ApisContext.Provider>,
        container
    );

    expect(pretty(container.outerHTML)).toMatchSnapshot();
})
```

## How do I use this?

### From the command line

1. Download openapi jar. On Linux/mac
    * `wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/5.4.0/openapi-generator-cli-5.4.0.jar -O openapi-generator-cli.jar`
2. Download the Typescript-fetch-api generator
    * `wget https://repo1.maven.org/maven2/io/github/jhannes/openapi/openapi-generator-typescript-fetch-api/0.2.9/openapi-generator-typescript-fetch-api-0.2.9.jar -O openapi-generator-typescript-fetch-api.jar`
3. Generate the code from your OpenAPI spec:
    * `java -cp openapi-generator-typescript-fetch-api.jar:openapi-generator-cli.jar org.openapitools.codegen.OpenAPIGenerator generate -g typescript-fetch-api -i <open api file>`

### In a Maven project

Add to your `pom.xml`:

```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.openapitools</groupId>
                <artifactId>openapi-generator-maven-plugin</artifactId>
                <version>5.4.0</version>
                <executions>
                    <execution>
                        <id>petstore-typescript-fetch-api</id>
                        <goals>
                            <goal>generate</goal>
                        </goals>
                        <configuration>
                            <inputSpec>${project.basedir}/src/main/openapi-spec/petstore.yaml</inputSpec>
                            <generatorName>typescript-fetch-api</generatorName>
                            <modelNameSuffix>Dto</modelNameSuffix>
                            <output>target/generated-sources/openapi-typescript-fetch-api-petstore</output>
                            <configOptions>
                                <supportsES6>true</supportsES6>
                                <withInterfaces>withInterfaces</withInterfaces>
                                <generateModelTests>true</generateModelTests>
                            </configOptions>
                        </configuration>
                    </execution>
                </executions>
                <dependencies>
                    <dependency>
                        <groupId>io.github.jhannes.openapi</groupId>
                        <artifactId>openapi-generator-typescript-fetch-api</artifactId>
                        <version>0.3.0</version>
                    </dependency>
                </dependencies>
            </plugin>
        </plugins>
    </build>

```


## Developer notes

If you want to contribute this project, please be aware of the following two powerful tests:

### io.github.jhannes.openapi.typescriptfetchapi.SnapshotTests

Generates code from `snapshotTests/input/*.json` to `snapshotTests/output` and compares with `snapshotTests/snapshot`. The test will fail on any changes. This test is great to check that any changes didn't have unintended effects.

When changes to the generated code are desired, one approach is to manually change the snapshots and then run this tests and tweak the generator until the desired result.

In addition to `snapshotTests`, this test also runs on files in the `.gitignore`d directory `localSnapshotTests`. This is great if you want to verify changes using your private project specifications.

### io.github.jhannes.openapi.typescriptfetchapi.VerifyOutputTests

Generates code from `snapshotTests/input/*.json` to `snapshotTests/verify` and runs `npm install` and `npm run verify` on each output directory to verify that there are no Typescript or Eslint errors.


