package io.github.jhannes.openapi.typescriptfetchapi.testsupport;

import org.junit.jupiter.api.DynamicNode;
import org.openapitools.codegen.ClientOptInput;
import org.openapitools.codegen.DefaultGenerator;
import org.openapitools.codegen.config.CodegenConfigurator;
import org.opentest4j.AssertionFailedError;

import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import static org.junit.jupiter.api.DynamicContainer.dynamicContainer;
import static org.junit.jupiter.api.DynamicTest.dynamicTest;

public class GeneratorTestFactory {

    private final CodegenConfigurator configurator;
    private final Path spec;
    private final Path outputDir;

    public GeneratorTestFactory(CodegenConfigurator configurator, Path spec, Path outputDir) {
        this.configurator = configurator;
        this.spec = spec;
        this.outputDir = outputDir;
    }

    public DynamicNode createSnapshotTests(Path snapshotDir, boolean ignoreWhitespace) {
        try {
            cleanDirectory(outputDir);
            generate();
        } catch (Exception e) {
            return dynamicTest("Generator for " + spec, () -> {
                throw e;
            });
        }
        var name = spec + " in " + outputDir.getParent();
        return new DirectoryDiffTestFactory(name, outputDir, snapshotDir).compareDirectories(ignoreWhitespace);
    }

    public void generate() {
        configurator.setInputSpec(getInputSpec(spec));
        configurator.setOutputDir(outputDir.toString());
        generate(configurator);
    }

    public DynamicNode createCompileTests() {
        configurator.setInputSpec(getInputSpec(spec));
        configurator.setOutputDir(outputDir.toString());
        return dynamicContainer("Compile " + spec, Arrays.asList(
                dynamicTest("Clean " + outputDir, () -> cleanDirectory(outputDir)),
                dynamicTest("Generate " + outputDir, this::generate),
                dynamicTest("javac " + outputDir, () -> compile(outputDir))
        ));
    }

    public static DynamicNode createCompileTest(Path sourceDir) {
        return dynamicTest("Compile " + sourceDir, () -> compile(sourceDir));
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

    private static void generate(CodegenConfigurator configurator) {
        try {
            NumberFormat.getInstance().parse("-1000");
        } catch (ParseException e) {
            throw new AssertionFailedError(
                    "Can't parse enums with negative numbers when Locale is " + Locale.getDefault(Locale.Category.FORMAT)
                            + ". Run with -Duser.language.format=en to avoid this error. "
                            + "The error is due to a bug in swagger: https://github.com/swagger-api/swagger-core/pull/4178"
            );
        }
        final ClientOptInput clientOptInput = configurator.toClientOptInput();
        DefaultGenerator generator = new DefaultGenerator();
        generator.opts(clientOptInput).generate();
    }


    public static String getInputSpec(Path input) {
        if (!input.getFileName().toString().endsWith(".link")) {
            return input.toString();
        }
        String path = readFirstLine(input).trim();
        if (path.matches("https?://.*")) {
            return path;
        }
        String[] parts = path.split("\\s+");
        if (parts.length == 1) {
            return Paths.get(path).toString().replaceAll("\\\\", "/");
        } else {
            return Paths.get(parts[0]).resolve(parts[1]).toString().replaceAll("\\\\", "/");
        }
    }

    public static Optional<Path> getBasePath(Path spec) {
        if (!spec.getFileName().toString().endsWith(".link")) {
            return Optional.empty();
        }
        String path = readFirstLine(spec).trim();
        if (path.matches("https?://.*")) {
            return Optional.empty();
        }
        String[] parts = path.split("\\s+");
        if (parts.length == 1) {
            return Optional.empty();
        } else {
            return Optional.of(Paths.get(parts[0]));
        }
    }

    public static String readFirstLine(Path spec) {
        try {
            return Files.readAllLines(spec).get(0);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static void compile(Path path) throws IOException {
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        try (StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null)) {

            List<Path> files = Files.find(
                    path.resolve("src/main/java"),
                    999,
                    (p, fa) -> p.getFileName().toString().endsWith(".java") && fa.isRegularFile()
            ).collect(Collectors.toList());

            String classpath = Stream.of(
                            System.getProperty("java.class.path").split(File.pathSeparator)
                    ).filter(p -> p.contains("projectlombok"))
                    .collect(Collectors.joining(File.pathSeparator));
            List<String> options = List.of(
                    "-Xlint:deprecation",
                    "-d", "target/testCompile/" + path.getFileName(),
                    "-proc:full",
                    "-classpath", classpath
            );
            System.out.println("javac " + String.join(" ", options) + " " + files.stream().map(Path::toString).collect(Collectors.joining(" ")));

            DiagnosticCollector<JavaFileObject> diagnosticListener = new DiagnosticCollector<>();
            JavaCompiler.CompilationTask task = compiler.getTask(
                    null,
                    fileManager,
                    diagnosticListener,
                    options,
                    null,
                    fileManager.getJavaFileObjectsFromPaths(files)
            );
            Boolean result = task.call();
            if (!diagnosticListener.getDiagnostics().isEmpty()) {
                fail(diagnosticListener.getDiagnostics().toString());
            }
            assertTrue(result);
        }
    }
}
