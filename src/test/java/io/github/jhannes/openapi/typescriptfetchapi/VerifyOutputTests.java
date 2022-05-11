package io.github.jhannes.openapi.typescriptfetchapi;

import org.junit.jupiter.api.DynamicContainer;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;
import org.openapitools.codegen.ClientOptInput;
import org.openapitools.codegen.DefaultGenerator;
import org.openapitools.codegen.config.CodegenConfigurator;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

public class VerifyOutputTests {

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
                        .map(VerifyOutputTests::createTestsFromSpec));
    }

    static DynamicContainer createTestsFromSpec(Path spec) {
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

    static private void generate(Path spec, Path output, String modelName) {
        try {
            if (spec.getFileName().toString().endsWith(".link")) {
                spec = Paths.get(Files.readAllLines(spec).get(0));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        final CodegenConfigurator configurator = new CodegenConfigurator()
                .setGeneratorName("typescript-fetch-api")
                .setInputSpec(spec.toString().replaceAll("\\\\", "/"))
                .setModelNameSuffix("Dto")
                .addAdditionalProperty("npmName", modelName)
                .addAdditionalProperty("withInterfaces", "true")
                .addAdditionalProperty("generateModelTests", "true")
                .setOutputDir(output.resolve(modelName).toString());

        final ClientOptInput clientOptInput = configurator.toClientOptInput();
        DefaultGenerator generator = new DefaultGenerator();
        generator.opts(clientOptInput).generate();
    }

    private static String getModelName(Path file) {
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
