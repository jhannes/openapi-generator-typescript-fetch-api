package io.github.jhannes.openapi.typescriptfetchapi;

import io.github.jhannes.openapi.typescriptfetchapi.testsupport.GeneratorTestFactory;
import org.junit.jupiter.api.DynamicNode;
import org.junit.jupiter.api.TestFactory;

import java.nio.file.Path;
import java.nio.file.Paths;

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
public class FocusedExampleTest extends AbstractSnapshotTest {

    public static final Path SPEC;

    static {
        String spec = System.getenv("SPEC");
        SPEC = spec != null ? Paths.get(spec) : SNAPSHOT_ROOT.resolve("input/websockets.yaml");
    }

    @TestFactory
    DynamicNode snapshotShouldVerify() {
        return VerifyOutputTests.verifyGeneratedCode(SPEC, getSnapshotDir(SPEC));
    }

    @TestFactory
    DynamicNode outputShouldMatchSnapshot() {
        return new GeneratorTestFactory(createConfigurator(getModelName(SPEC)), SPEC, getOutputDir(SPEC)).createSnapshotTests(getSnapshotDir(SPEC), false);
    }

    @TestFactory
    DynamicNode outputShouldVerify() {
        return VerifyOutputTests.createTestsForSpec(SPEC);
    }
}
