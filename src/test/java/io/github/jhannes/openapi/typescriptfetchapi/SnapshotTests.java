package io.github.jhannes.openapi.typescriptfetchapi;

import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;
import org.openapitools.codegen.config.CodegenConfigurator;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static io.github.jhannes.openapi.typescriptfetchapi.SnapshotDiffDynamicTest.compareDirectories;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

public class SnapshotTests extends AbstractSnapshotTest {

    @TestFactory
    Stream<DynamicNode> typescriptFetchApi() throws IOException {
        List<DynamicNode> testSuites = new ArrayList<>();
        testSuites.add(snapshots(SNAPSHOT_ROOT));
        if (Files.isDirectory(LOCAL_SNAPSHOT_ROOT.resolve("input"))) {
            testSuites.add(snapshots(LOCAL_SNAPSHOT_ROOT));
        }
        return testSuites.stream();
    }

    protected DynamicNode snapshots(Path testDir) throws IOException {
        return dynamicContainer(
                "Snapshots of " + testDir,
                Files.list(testDir.resolve("input"))
                        .filter(p -> p.toFile().isFile())
                        .map(this::createTests)
        );
    }

    protected DynamicNode createTests(Path spec) {
        return createTestNode(spec);
    }

    public static DynamicNode createTestNode(Path spec) {
        return createTestNode(spec, createConfigurator(getModelName(spec)), getOutputDir(spec), getSnapshotDir(spec));
    }

    protected static DynamicNode createTestNode(Path spec, CodegenConfigurator configurator, Path outputDir, Path snapshotDir) {
        configurator.setInputSpec(getInputSpec(spec));
        configurator.setOutputDir(outputDir.toString());
        try {
            cleanDirectory(outputDir);
            generate(configurator);
        } catch (Exception e) {
            if (e.getCause() != null) {
                return dynamicTest("Generator for " + spec, () -> {throw e.getCause();});
            }
            return dynamicTest("Generator for " + spec, () -> {throw e;});
        }
        return compareDirectories(spec, outputDir, snapshotDir);
    }

}
