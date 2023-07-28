package io.github.jhannes.openapi.typescriptfetchapi;

import difflib.*;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

public class SnapshotTests extends AbstractSnapshotTest {

    @TestFactory
    Stream<DynamicNode> typescriptFetchApi() throws IOException {
        return Stream.of(snapshots(SNAPSHOT_ROOT), snapshots(LOCAL_SNAPSHOT_ROOT));
    }

    private DynamicNode snapshots(Path testDir) throws IOException {
        Path inputDir = testDir.resolve("input");
        if (!Files.isDirectory(inputDir)) {
            return dynamicTest("No snapshots for " + testDir, () -> {});
        }
        return dynamicContainer(
                "Snapshots of " + testDir,
                Files.list(inputDir).filter(p -> p.toFile().isFile()).map(SnapshotTests::createTestsForSpec)
        );
    }

    static DynamicNode createTestsForSpec(Path spec) {
        Path outputDir = spec.getParent().getParent().resolve("output");
        Path snapshotDir = spec.getParent().getParent().resolve("snapshot");
        try {
            cleanDirectory(outputDir.resolve(getModelName(spec)));
            generate(spec, getModelName(spec), outputDir.resolve(getModelName(spec)));
        } catch (Exception e) {
            if (e.getCause() != null) {
                return dynamicTest("Generator for " + spec, () -> {throw e.getCause();});
            }
            return dynamicTest("Generator for " + spec, () -> {throw e;});
        }

        List<Path> files;
        try (Stream<Path> list = Files.walk(outputDir.resolve(getModelName(spec)))) {
            files = list.filter(SnapshotTests::isTextOutput).collect(Collectors.toList());
        } catch (IOException e) {
            return dynamicTest("Snapshots for " + spec, () -> assertNull(e));
        }
        return dynamicContainer("Snapshots for " + spec, Stream.of(
                dynamicTest("Files", () -> compareFiles(outputDir, snapshotDir, getModelName(spec))),
                dynamicContainer("File contents in " + outputDir, files.stream().map(file ->
                        dynamicTest("file " + outputDir.relativize(file), () -> diff(file, snapshotDir.resolve(outputDir.relativize(file))))
                ))));
    }

    private static void compareFiles(Path output, Path snapshotDir, String modelName) throws IOException {
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

    private static boolean isTextOutput(Path path) {
        return Files.isRegularFile(path) && !path.toString().endsWith(".jar");
    }

    private static void diff(Path file, Path snapshot) throws IOException {
        assertTrue(Files.exists(snapshot), "Missing " + snapshot);
        Patch<String> diff = DiffUtils.diff(Files.readAllLines(snapshot), Files.readAllLines(file));
        if (!diff.getDeltas().isEmpty()) {
            List<Delta<String>> significantDiff = diff.getDeltas().stream().filter(delta -> !whitespaceOnly(delta)).collect(Collectors.toList());
            if (significantDiff.isEmpty()) {
                fail("whitespace difference: " + diff.getDeltas());
            } else {
                fail("significant difference: " + significantDiff.stream().map(Object::toString).collect(Collectors.joining("\n")));
            }
        }
    }

    private static boolean whitespaceOnly(Delta<String> delta) {
        if (delta instanceof InsertDelta) {
            return delta.getRevised().getLines().stream().allMatch(s -> s == null || s.trim().length() == 0);
        } else if (delta instanceof DeleteDelta) {
            return delta.getOriginal().getLines().stream().allMatch(s -> s == null || s.trim().length() == 0);
        } else {
            return false;
        }
    }


}
