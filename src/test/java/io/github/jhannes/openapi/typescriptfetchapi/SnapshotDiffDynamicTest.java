package io.github.jhannes.openapi.typescriptfetchapi;

import difflib.DeleteDelta;
import difflib.Delta;
import difflib.DiffUtils;
import difflib.InsertDelta;
import difflib.Patch;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.function.Executable;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

public class SnapshotDiffDynamicTest implements Executable {
    public static final Pattern WHITESPACE = Pattern.compile("\\s*");
    private final Path file;
    private final Path outputDir;
    private final Path snapshotDir;

    public SnapshotDiffDynamicTest(Path file, Path outputDir, Path snapshotDir) {
        this.file = file;
        this.outputDir = outputDir;
        this.snapshotDir = snapshotDir;
    }

    public static DynamicTest createSnapshotDiffTest(Path file, Path outputDir, Path snapshotDir) {
        return dynamicTest(file.getFileName() + " in " + outputDir.relativize(file).getParent(), new SnapshotDiffDynamicTest(file, outputDir, snapshotDir));
    }

    static DynamicNode compareDirectories(Path spec, Path outputDir, Path snapshotDir) {
        List<Path> files;
        try (Stream<Path> list = Files.walk(outputDir)) {
            files = list.filter(SnapshotDiffDynamicTest::isTextOutput).collect(Collectors.toList());
        } catch (IOException e) {
            return dynamicTest(spec.getFileName() + " in " + spec.getParent(), () -> assertNull(e));
        }
        return dynamicContainer(spec.getFileName() + " in " + spec, Stream.of(
                dynamicTest("Files", () -> compareFiles(outputDir, snapshotDir)),
                dynamicContainer("Files in " + outputDir.getFileName() + " in " + outputDir.getParent(), files.stream().map(file ->
                        createSnapshotDiffTest(file, outputDir, snapshotDir)
                ))));
    }

    private static void compareFiles(Path outputDir, Path snapshotDir) throws IOException {
        String outputFiles = listFiles(outputDir);
        String snapshotFiles = listFiles(snapshotDir);
        assertEquals(snapshotFiles, outputFiles);
    }

    private static String listFiles(Path outputDir) throws IOException {
        try (Stream<Path> walk = Files.walk(outputDir)) {
            return walk.map(path -> outputDir.relativize(path).toString()).collect(Collectors.joining("\n"));
        }
    }

    private static boolean isTextOutput(Path path) {
        return Files.isRegularFile(path) && !path.toString().endsWith(".jar");
    }

    @Override
    public void execute() throws Throwable {
        diff(snapshotDir.resolve(outputDir.relativize(file)), file);
    }

    private void diff(Path file, Path snapshot) throws IOException {
        assertTrue(Files.exists(snapshot), "Missing " + snapshot);
        Patch<String> diff = DiffUtils.diff(Files.readAllLines(file), Files.readAllLines(snapshot));
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
            return delta.getRevised().getLines().stream().allMatch(s -> s == null || WHITESPACE.matcher(s).matches());
        } else if (delta instanceof DeleteDelta) {
            return delta.getOriginal().getLines().stream().allMatch(s -> s == null || WHITESPACE.matcher(s).matches());
        } else {
            return false;
        }
    }

}
