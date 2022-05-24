package io.github.jhannes.openapi.typescriptfetchapi;

import org.junit.jupiter.api.DynamicContainer;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

public class VerifyOutputTests extends AbstractSnapshotTests {

    public static final String NPM_PATH = System.getProperty("os.name").startsWith("Windows") ? "npm.cmd" : "npm";

    @TestFactory
    Stream<DynamicNode> typescriptFetchApi() throws IOException {
        return Stream.of(
                verify(SnapshotTests.SNAPSHOT_ROOT),
                verify(SnapshotTests.LOCAL_SNAPSHOT_ROOT)
        );
    }

    private DynamicNode verify(Path testDir) throws IOException {
        Path inputDir = testDir.resolve("input");
        if (!Files.isDirectory(inputDir)) {
            return dynamicTest("No test for " + testDir, () -> {});
        }
        cleanDirectory(testDir.resolve("verify"));
        return dynamicContainer(
                "Verifications of " + testDir,
                Files.list(inputDir)
                        .filter(p -> p.toFile().isFile())
                        .map(VerifyOutputTests::createTestsForSpec));
    }

    static DynamicContainer createTestsForSpec(Path spec) {
        Path outputDir = spec.getParent().getParent().resolve("verify");
        return dynamicContainer("Verify " + spec, Arrays.asList(
                dynamicTest("Generate " + spec, () -> generate(spec, outputDir, getModelName(spec))),
                dynamicTest("npm install " + spec, () -> runCommand(outputDir.resolve(getModelName(spec)), new String[]{NPM_PATH, "install"})),
                dynamicTest("npm build " + spec, () -> runCommand(outputDir.resolve(getModelName(spec)), new String[]{NPM_PATH, "run", "build"}))
        ));
    }

    private static void runCommand(Path outputDir, String[] npmCommand) throws IOException, InterruptedException {
        Process command = Runtime.getRuntime().exec(npmCommand, null, outputDir.toFile());
        startTransferThread(command.getInputStream(), System.out, outputDir + "-to-stdout");
        startTransferThread(command.getErrorStream(), System.err, outputDir + "-to-stderr");
        command.waitFor(60, TimeUnit.SECONDS);
        assertEquals(0, command.exitValue());
    }

    private static void startTransferThread(InputStream input, OutputStream output, String threadName) {
        Thread transferThread = new Thread(() -> {
            try {
                byte[] buffer = new byte[8192];
                while (true) {
                    int available = input.available();
                    if (available > 0) {
                        int bytesRead = input.read(buffer, 0, Math.min(buffer.length, available));
                        if (bytesRead == -1) {
                            return;
                        }
                        output.write(buffer, 0, bytesRead);
                    } else {
                        Thread.sleep(100);
                    }
                }
            } catch (IOException | InterruptedException e) {
                e.printStackTrace();
            }
        });
        transferThread.setName(threadName);
        transferThread.start();
    }
}
