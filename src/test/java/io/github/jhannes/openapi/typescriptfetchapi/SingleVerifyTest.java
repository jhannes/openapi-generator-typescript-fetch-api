package io.github.jhannes.openapi.typescriptfetchapi;

import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;

import java.nio.file.Path;

public class SingleVerifyTest {

    @TestFactory
    DynamicNode javaAnnotationFreeSnapshots() {
        Path spec = SnapshotTests.SNAPSHOT_ROOT.resolve("input/infectionTracker.json");
        return VerifyOutputTests.createTestsForSpec(spec);
    }

}
