package io.github.jhannes.openapi.typescriptfetchapi.testsupport;

import com.github.difflib.DiffUtils;
import com.github.difflib.patch.AbstractDelta;
import com.github.difflib.patch.DeleteDelta;
import com.github.difflib.patch.InsertDelta;
import com.github.difflib.patch.Patch;
import org.junit.jupiter.api.DynamicNode;

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

public class DirectoryDiffTestFactory {
    public static final Pattern WHITESPACE = Pattern.compile("\\s*");
    private final String name;
    private final Path outputDir;
    private final Path snapshotDir;

    public DirectoryDiffTestFactory(String name, Path outputDir, Path snapshotDir) {
        this.name = name;
        this.outputDir = outputDir;
        this.snapshotDir = snapshotDir;
    }

    public DynamicNode compareDirectories(boolean ignoreWhitespace) {
        List<Path> files;
        try (Stream<Path> list = Files.walk(outputDir)) {
            files = list.filter(DirectoryDiffTestFactory::isTextOutput).collect(Collectors.toList());
        } catch (IOException e) {
            return dynamicTest(name, () -> assertNull(e));
        }
        return dynamicContainer(name, Stream.of(
                dynamicTest("Files", () -> compareFiles(outputDir, snapshotDir)),
                dynamicContainer("Files in " + outputDir.getFileName() + " in " + outputDir.getParent(), files.stream().map(file ->
                        dynamicTest(file.getFileName() + " in " + outputDir.relativize(file).getParent(), () -> diff(snapshotDir.resolve(outputDir.relativize(file)), file, ignoreWhitespace))
                ))));
    }

    private static void compareFiles(Path outputDir, Path snapshotDir) throws IOException {
        String outputFiles = listFiles(outputDir);
        String snapshotFiles = listFiles(snapshotDir);
        assertEquals(snapshotFiles, outputFiles);
    }

    private static String listFiles(Path outputDir) throws IOException {
        try (Stream<Path> walk = Files.walk(outputDir)) {
            return walk.map(path -> outputDir.relativize(path).toString()).filter(p -> !p.startsWith("target")).collect(Collectors.joining("\n"));
        }
    }

    private static boolean isTextOutput(Path path) {
        return Files.isRegularFile(path) && !path.toString().endsWith(".jar");
    }

    private void diff(Path output, Path snapshot, boolean ignoreWhitespace) throws IOException {
        assertTrue(Files.exists(output), "Missing " + output);
        assertTrue(Files.exists(snapshot), "Missing " + snapshot);
        Patch<String> diff = DiffUtils.diff(readLines(output, ignoreWhitespace), readLines(snapshot, ignoreWhitespace));
        if (!diff.getDeltas().isEmpty()) {
            List<AbstractDelta<String>> significantDiff = diff.getDeltas().stream().filter(delta -> !whitespaceOnly(delta)).toList();
            if (!significantDiff.isEmpty()) {
                fail("significant difference: " + significantDiff.stream().map(Object::toString).collect(Collectors.joining("\n")));
            } else if (!ignoreWhitespace) {
                fail("whitespace difference: " + diff.getDeltas());
            }
        }
    }

    private static List<String> readLines(Path file, boolean ignoreWhitespace) throws IOException {
        if (ignoreWhitespace) return Files.readAllLines(file).stream().map(String::stripTrailing).toList();
        return Files.readAllLines(file);
    }

    private static boolean whitespaceOnly(AbstractDelta<String> delta) {
        if (delta instanceof InsertDelta) {
            return delta.getTarget().getLines().stream().allMatch(s -> s == null || WHITESPACE.matcher(s).matches());
        } else if (delta instanceof DeleteDelta) {
            return delta.getSource().getLines().stream().allMatch(s -> s == null || WHITESPACE.matcher(s).matches());
        } else {
            return false;
        }
    }

}