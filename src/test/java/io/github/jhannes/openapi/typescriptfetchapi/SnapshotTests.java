package io.github.jhannes.openapi.typescriptfetchapi;

import io.github.jhannes.openapi.typescriptfetchapi.testsupport.GeneratorTestFactory;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;

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
        return new GeneratorTestFactory(createConfigurator(getModelName(spec)), spec, getOutputDir(spec))
                .createSnapshotTests(getSnapshotDir(spec), false);
    }

}
