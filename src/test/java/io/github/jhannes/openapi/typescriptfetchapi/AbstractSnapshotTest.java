package io.github.jhannes.openapi.typescriptfetchapi;

import org.openapitools.codegen.config.CodegenConfigurator;

import java.nio.file.Path;
import java.nio.file.Paths;

import static io.github.jhannes.openapi.typescriptfetchapi.testsupport.GeneratorTestFactory.getBasePath;

public class AbstractSnapshotTest {
    static {
        System.setProperty("org.slf4j.simpleLogger.defaultLogLevel", "WARN");
    }

    public static final Path SNAPSHOT_ROOT = Paths.get("snapshotTests");
    public static final Path LOCAL_SNAPSHOT_ROOT = Paths.get("localSnapshotTests");

    protected static CodegenConfigurator createConfigurator(String modelName) {
        return new CodegenConfigurator()
                .setModelNameSuffix("Dto")
                .addAdditionalProperty("hideGenerationTimestamp", "true")
                .setGeneratorName("typescript-fetch-api")
                .setPackageName("io.github.jhannes.openapi." + modelName)
                .addAdditionalProperty("npmName", modelName)
                .addAdditionalProperty("withInterfaces", "true")
                .addAdditionalProperty("generateModelTests", "true");
    }

    static Path getSnapshotDir(Path spec) {
        return getBasePath(spec).map(p -> p.resolve("snapshot"))
                .orElse(spec.getParent().getParent().resolve("snapshot").resolve(SnapshotTests.getModelName(spec)));
    }

    static Path getVerifyDir(Path spec) {
        return getBasePath(spec).map(p -> p.resolve("verify"))
                .orElse(spec.getParent().getParent().resolve("verify").resolve(SnapshotTests.getModelName(spec)));
    }

    static Path getOutputDir(Path spec) {
        return getBasePath(spec).map(p -> p.resolve("output"))
                .orElse(spec.getParent().getParent().resolve("output").resolve(getModelName(spec)));
    }

    protected static String getModelName(Path file) {
        String filename = file.getFileName().toString();
        int lastDot = filename.lastIndexOf('.');
        return lastDot < 0 ? filename : filename.substring(0, lastDot);
    }
}
