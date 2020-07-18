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
    Stream<DynamicNode> snapshots() throws IOException {
        return Stream.of(
                snapshots(Paths.get("snapshotTests")),
                snapshots(Paths.get("localSnapshotTests"))
        );
    }

    private DynamicNode snapshots(Path testDir) throws IOException {
        Path inputDir = testDir.resolve("input");
        if (!Files.isDirectory(inputDir)) {
            return dynamicTest("No snapshots for " + testDir, () -> {});
        }
        Path output = testDir.resolve("output");
        cleanDirectory(output);
        return dynamicContainer("Snapshots of " + testDir, Files.list(inputDir).map(this::createTestsForSpec));
    }

    private DynamicNode createTestsForSpec(Path spec) {
        generate(spec);

        Path output = spec.getParent().getParent().resolve("output");
        Path snapshotDir = spec.getParent().getParent().resolve("snapshot");
        List<Path> files;
        try (Stream<Path> list = Files.walk(output.resolve(getModelName(spec)))) {
            files = list.filter(this::isTextOutput).collect(Collectors.toList());
        } catch (IOException e) {
            return dynamicTest("Snapshot for " + spec, () -> assertNull(e));
        }
        return dynamicContainer("Snapshots for " + spec, Stream.of(
                dynamicTest("Files", () -> compareFiles(spec)),
                dynamicContainer("File contents in " + output, files.stream().map(file ->
                        dynamicTest("file " + output.relativize(file), () -> diff(file, snapshotDir.resolve(output.relativize(file))))
                ))));
    }

    private void compareFiles(Path spec) throws IOException {
        Path output = spec.getParent().getParent().resolve("output");
        Path snapshotDir = spec.getParent().getParent().resolve("snapshot");
        String outputFiles = Files.walk(output.resolve(getModelName(spec))).map(path -> output.relativize(path).toString()).collect(Collectors.joining("\n"));
        String snapshotFiles = Files.walk(snapshotDir.resolve(getModelName(spec))).map(path -> snapshotDir.relativize(path).toString()).collect(Collectors.joining("\n"));
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

    private void generate(Path file) {
        Path output = file.getParent().getParent().resolve("output");
        String modelName = getModelName(file);

        final CodegenConfigurator configurator = new CodegenConfigurator()
                .setGeneratorName("typescript-fetch-api")
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
