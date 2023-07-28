package io.github.jhannes.openapi.typescriptfetchapi;

import org.junit.jupiter.api.DynamicContainer;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.TestFactory;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

public class VerifyOutputTests extends AbstractSnapshotTest {

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
            return dynamicTest("No test for " + testDir, () -> {
            });
        }
        return dynamicContainer(
                "Verifications of " + testDir,
                Files.list(inputDir)
                        .filter(p -> p.toFile().isFile())
                        .map(VerifyOutputTests::createTestsForSpec));
    }

    static DynamicContainer createTestsForSpec(Path spec) {
        Path projectDir = targetDirectory(spec, "verify");
        return dynamicContainer("Verify " + spec, Arrays.asList(
                generateOutput(spec, projectDir),
                runNpmInstall(spec, projectDir),
                verifyGeneratedCode(spec, projectDir)
        ));
    }

    static Path targetDirectory(Path spec, String directoryName) {
        return spec.getParent().getParent().resolve(directoryName).resolve(getModelName(spec));
    }

    static DynamicTest verifyGeneratedCode(Path spec, Path projectDir) {
        return dynamicTest(
                "npm verify " + spec,
                () -> runCommand(projectDir, new String[]{NPM_PATH, "run", "verify"})
        );
    }

    static DynamicTest runNpmInstall(Path spec, Path projectDir) {
        return dynamicTest("npm install " + spec, () -> npmInstall(projectDir));
    }

    static DynamicTest generateOutput(Path spec, Path projectDir) {
        return dynamicTest("Generate " + spec, () -> generate(spec, getModelName(spec), projectDir));
    }

    private static void npmInstall(Path projectDir) throws IOException, InterruptedException {
        Files.copy(projectDir.resolve("package.json"), projectDir.getParent().getParent().resolve("package.json"), StandardCopyOption.REPLACE_EXISTING);
        runCommand(projectDir.getParent().getParent(), new String[] {NPM_PATH, "install"});
    }

    private static void runCommand(Path workingDir, String[] commandLine) throws IOException, InterruptedException {
        Process command = Runtime.getRuntime().exec(commandLine, null, workingDir.toFile());
        startTransferThread(command.getInputStream(), System.out, commandLine[0] + "-to-stdout");
        startTransferThread(command.getInputStream(), System.err, commandLine[0] + "-to-stderr");
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
