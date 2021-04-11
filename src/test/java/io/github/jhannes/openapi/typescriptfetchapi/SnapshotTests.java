package io.github.jhannes.openapi.typescriptfetchapi;

import difflib.DiffUtils;
import difflib.Patch;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;
import org.openapitools.codegen.ClientOptInput;
import org.openapitools.codegen.DefaultGenerator;
import org.openapitools.codegen.config.CodegenConfigurator;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

public class SnapshotTests {

    @TestFactory
    Stream<DynamicNode> typescriptFetchApi() throws IOException {
        return Stream.of(
                snapshots(Paths.get("snapshotTests"), "typescript-fetch-api", Paths.get("snapshotTests").resolve("output"), Paths.get("snapshotTests").resolve("snapshot")),
                snapshots(Paths.get("localSnapshotTests"), "typescript-fetch-api", Paths.get("localSnapshotTests").resolve("output"), Paths.get("localSnapshotTests").resolve("snapshot"))
        );
    }

    private DynamicNode snapshots(Path testDir, String generatorName, Path outputDir, Path snapshotDir) throws IOException {
        Path inputDir = testDir.resolve("input");
        if (!Files.isDirectory(inputDir)) {
            return dynamicTest("No snapshots for " + testDir, () -> {});
        }
        cleanDirectory(outputDir);
        return dynamicContainer(
                "Snapshots of " + testDir,
                Files.list(inputDir).map(spec -> createTestsForSpec(spec, generatorName, outputDir, snapshotDir))
        );
    }

    private DynamicNode createTestsForSpec(Path spec, String generatorName, Path outputDir, Path snapshotDir) {
        try {
            generate(spec, generatorName, outputDir, getModelName(spec));
        } catch (Exception e) {
            return dynamicTest("Generator for " + spec, () -> assertNull(e));
        }

        List<Path> files;
        try (Stream<Path> list = Files.walk(outputDir.resolve(getModelName(spec)))) {
            files = list.filter(this::isTextOutput).collect(Collectors.toList());
        } catch (IOException e) {
            return dynamicTest("Snapshots for " + spec, () -> assertNull(e));
        }
        return dynamicContainer("Snapshots for " + spec, Stream.of(
                dynamicTest("Files", () -> compareFiles(outputDir, snapshotDir, getModelName(spec))),
                dynamicContainer("File contents in " + outputDir, files.stream().map(file ->
                        dynamicTest("file " + outputDir.relativize(file), () -> diff(file, snapshotDir.resolve(outputDir.relativize(file))))
                ))));
    }

    private void compareFiles(Path output, Path snapshotDir, String modelName) throws IOException {
        String outputFiles = Files.walk(output.resolve(modelName))
                .filter(file -> !file.startsWith(output.resolve(modelName).resolve("node_modules")))
                .filter(file -> !file.startsWith(output.resolve(modelName).resolve("package-lock.json")))
                .filter(file -> !file.startsWith(output.resolve(modelName).resolve("dist")))
                .map(path -> output.relativize(path).toString())
                .collect(Collectors.joining("\n"));
        String snapshotFiles = Files.walk(snapshotDir.resolve(modelName))
                .filter(file -> !file.startsWith(snapshotDir.resolve(modelName).resolve("node_modules")))
                .filter(file -> !file.startsWith(snapshotDir.resolve(modelName).resolve("package-lock.json")))
                .filter(file -> !file.startsWith(snapshotDir.resolve(modelName).resolve("dist")))
                .map(path -> snapshotDir.relativize(path).toString())
                .collect(Collectors.joining("\n"));
        assertEquals(snapshotFiles, outputFiles);
    }

    private boolean isTextOutput(Path path) {
        return Files.isRegularFile(path) && !path.toString().endsWith(".jar");
    }

    private void diff(Path file, Path snapshot) throws IOException {
        assertTrue(Files.exists(snapshot), "Missing " + snapshot);
        Patch<String> diff = DiffUtils.diff(Files.readAllLines(file), Files.readAllLines(snapshot));
        assertEquals("", diff.getDeltas().stream().map(Object::toString).collect(Collectors.joining("\n")));
    }

    private void generate(Path file, String generatorName, Path output, String modelName) {
        final CodegenConfigurator configurator = new CodegenConfigurator()
                .setGeneratorName(generatorName)
                .setInputSpec(file.toString())
                .setModelNameSuffix("Dto")
                .addAdditionalProperty("npmName", modelName)
                .addAdditionalProperty("withInterfaces", "true")
                .addAdditionalProperty("generateModelTests", "true")
                .setOutputDir(output.resolve(modelName).toString());

        final ClientOptInput clientOptInput = configurator.toClientOptInput();
        DefaultGenerator generator = new DefaultGenerator();
        generator.opts(clientOptInput).generate();
    }

    private String getModelName(Path file) {
        String filename = file.getFileName().toString();
        int lastDot = filename.lastIndexOf('.');
        return lastDot < 0 ? filename : filename.substring(0, lastDot);
    }


    private void cleanDirectory(Path directory) throws IOException {
        if (Files.isDirectory(directory)) {
            try (Stream<Path> walk = Files.walk(directory)) {
                walk.sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }
        }
    }
}
