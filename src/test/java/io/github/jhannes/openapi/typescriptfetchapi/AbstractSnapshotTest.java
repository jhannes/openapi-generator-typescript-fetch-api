package io.github.jhannes.openapi.typescriptfetchapi;

import org.openapitools.codegen.ClientOptInput;
import org.openapitools.codegen.DefaultGenerator;
import org.openapitools.codegen.config.CodegenConfigurator;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.stream.Stream;

public class AbstractSnapshotTest {
    public static final Path SNAPSHOT_ROOT = Paths.get("snapshotTests");
    public static final Path LOCAL_SNAPSHOT_ROOT = Paths.get("localSnapshotTests");

    protected static void generate(Path spec, String modelName, Path projectDir) {
        try {
            cleanDirectory(projectDir);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        CodegenConfigurator configurator = createConfigurator(modelName, spec, projectDir);
        final ClientOptInput clientOptInput = configurator.toClientOptInput();
        DefaultGenerator generator = new DefaultGenerator();
        generator.opts(clientOptInput).generate();
    }

    private static CodegenConfigurator createConfigurator(String modelName, Path input, Path projectDir) {
        return createBaseConfigurator(modelName, input, projectDir)
                .setGeneratorName("typescript-fetch-api");
    }

    private static CodegenConfigurator createBaseConfigurator(String modelName, Path input, Path outputDir) {
        return createBaseConfigurator(modelName)
                .setInputSpec(getInputSpec(input))
                .setOutputDir(outputDir.toString());
    }

    private static CodegenConfigurator createBaseConfigurator(String modelName) {
        return new CodegenConfigurator()
                .setModelNameSuffix("Dto")
                .addAdditionalProperty("npmName", modelName)
                .addAdditionalProperty("withInterfaces", "true")
                .addAdditionalProperty("generateModelTests", "true");
    }

    private static String getInputSpec(Path input) {
        String spec = input.toString();
        try {
            if (input.getFileName().toString().endsWith(".link")) {
                String path = Files.readAllLines(input).get(0);
                if (path.matches("https?://.*")) {
                    spec = path;
                } else {
                    spec = Paths.get(path).toString();
                }
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return spec.replaceAll("\\\\", "/");
    }

    static void cleanDirectory(Path directory) throws IOException {
        if (Files.isDirectory(directory)) {
            try (Stream<Path> walk = Files.walk(directory)) {
                walk.sorted(Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(File::delete);
            }
        }
    }

    protected static String getModelName(Path file) {
        String filename = file.getFileName().toString();
        int lastDot = filename.lastIndexOf('.');
        return lastDot < 0 ? filename : filename.substring(0, lastDot);
    }

}
