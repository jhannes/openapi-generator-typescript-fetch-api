package io.github.jhannes.openapi.typescriptfetchapi;

import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;

import java.io.IOException;
import java.nio.file.Path;

public class SingleSnapshotTest {

    @TestFactory
    DynamicNode javaAnnotationFreeSnapshots() throws IOException {
        Path spec = SnapshotTests.SNAPSHOT_ROOT.resolve("input/websockets.yaml");
        SnapshotTests.cleanDirectory(spec.getParent().getParent().resolve("output"));
        return SnapshotTests.createTestsForSpec(spec);
    }

}
