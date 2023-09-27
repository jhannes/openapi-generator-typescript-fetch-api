package io.github.jhannes.openapi.typescriptfetchapi;

import org.junit.jupiter.api.DynamicContainer;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;

import java.nio.file.Path;
import java.util.Arrays;

/**
 * Use this test to fix bugs and develop new features:
 *
 * <ol>
 *     <li>Decide what {@link #SPEC} to use</li>
 *     <li>Run the test class to verify the baseline</li>
 *     <li>Update files under <code>snapshotTests/snapshots/&lt;SPEC&gt;/</code> to match your desired output</li>
 *     <li>The test {@link #snapshotShouldVerify()} will fail if your changes resulted in syntax error</li>
 *     <li>
 *         The test {@link #outputShouldMatchSnapshot()} will fail until the output matches your desired snapshot.
 *         Update the templates under <code>src/main/resources</code> to make it pass
 *     </li>
 * </ol>
 */
public class FocusedExampleTest {

    public static final Path SPEC = SnapshotTests.SNAPSHOT_ROOT.resolve("input/readOnlyWriteOnly.yaml");

    @TestFactory
    DynamicNode snapshotShouldVerify() {
        Path snapshotDirectory = VerifyOutputTests.targetDirectory(SPEC, "snapshot");
        return DynamicContainer.dynamicContainer("Verify " + snapshotDirectory, Arrays.asList(
                VerifyOutputTests.runNpmInstall(SPEC, snapshotDirectory),
                VerifyOutputTests.verifyGeneratedCode(SPEC, snapshotDirectory)
        ));
    }

    @TestFactory
    DynamicNode outputShouldMatchSnapshot() {
        return SnapshotTests.createTestsForSpec(SPEC);
    }

    @TestFactory
    DynamicNode outputShouldVerify() {
        return VerifyOutputTests.createTestsForSpec(SPEC);
    }
}
