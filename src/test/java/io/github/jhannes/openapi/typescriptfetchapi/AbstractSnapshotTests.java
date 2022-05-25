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

public class AbstractSnapshotTests {
    public static final Path SNAPSHOT_ROOT = Paths.get("snapshotTests");
    public static final Path LOCAL_SNAPSHOT_ROOT = Paths.get("localSnapshotTests");

    protected static void generate(Path spec, String modelName, Path projectDir) {
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
                .setOutputDir(projectDir.toString());

        final ClientOptInput clientOptInput = configurator.toClientOptInput();
        DefaultGenerator generator = new DefaultGenerator();
        generator.opts(clientOptInput).generate();
    }

    protected static String getModelName(Path file) {
        String filename = file.getFileName().toString();
        int lastDot = filename.lastIndexOf('.');
        return lastDot < 0 ? filename : filename.substring(0, lastDot);
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
}
