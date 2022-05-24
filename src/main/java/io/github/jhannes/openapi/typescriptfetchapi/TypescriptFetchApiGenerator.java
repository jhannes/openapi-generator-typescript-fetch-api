package io.github.jhannes.openapi.typescriptfetchapi;

import io.swagger.v3.parser.util.SchemaTypeUtil;
import org.apache.commons.lang3.StringUtils;
import org.openapitools.codegen.CliOption;
import org.openapitools.codegen.CodegenDiscriminator;
import org.openapitools.codegen.CodegenModel;
import org.openapitools.codegen.CodegenOperation;
import org.openapitools.codegen.CodegenProperty;
import org.openapitools.codegen.SupportingFile;
import org.openapitools.codegen.api.TemplatingEngineAdapter;
import org.openapitools.codegen.languages.AbstractTypeScriptClientCodegen;
import org.openapitools.codegen.meta.features.DocumentationFeature;
import org.openapitools.codegen.meta.features.SecurityFeature;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static org.openapitools.codegen.CodegenConstants.GENERATE_API_TESTS;
import static org.openapitools.codegen.CodegenConstants.GENERATE_MODEL_TESTS;

public class TypescriptFetchApiGenerator extends AbstractTypeScriptClientCodegen {

    public static final String NPM_REPOSITORY = "npmRepository";
    public static final String WITH_INTERFACES = "withInterfaces";
    public static final String SEPARATE_MODELS_AND_API = "withSeparateModelsAndApi";
    public static final String WITHOUT_PREFIX_ENUMS = "withoutPrefixEnums";

    protected String npmRepository = null;

    private String tsModelPackage = "";

    public TypescriptFetchApiGenerator() {
        super();

        modifyFeatureSet(features -> features
                .includeSecurityFeatures(SecurityFeature.ApiKey, SecurityFeature.BasicAuth, SecurityFeature.BearerToken, SecurityFeature.OpenIDConnect)
                .includeDocumentationFeatures(DocumentationFeature.Readme));

        // clear import mapping (from default generator) as TS does not use it
        // at the moment
        importMapping.clear();

        outputFolder = "generated-code/typescript-fetch-api";
        embeddedTemplateDir = templateDir = "typescript-fetch-api";

        typeMapping.put("DateTime", "Date");
        typeMapping.put("date", "Date");

        this.cliOptions.add(new CliOption(NPM_REPOSITORY, "Use this property to set an url of your private npmRepo in the package.json"));
        this.cliOptions.add(new CliOption(WITH_INTERFACES, "Setting this property to true will generate interfaces next to the default class implementations.", SchemaTypeUtil.BOOLEAN_TYPE).defaultValue(Boolean.FALSE.toString()));
        this.cliOptions.add(new CliOption(SEPARATE_MODELS_AND_API, "Put the model and api in separate folders and in separate classes", SchemaTypeUtil.BOOLEAN_TYPE).defaultValue(Boolean.FALSE.toString()));
        this.cliOptions.add(new CliOption(WITHOUT_PREFIX_ENUMS, "Don't prefix enum names with class names", SchemaTypeUtil.BOOLEAN_TYPE).defaultValue(Boolean.FALSE.toString()));

        super.setTemplatingEngine(new FixedHandlebarsEngineAdapter());
    }

    @Override
    public void setTemplatingEngine(TemplatingEngineAdapter templatingEngine) {
    }

    @Override
    public String getName() {
        return "typescript-fetch-api";
    }

    @Override
    public String getHelp() {
        return "Generates a TypeScript client library using Fetch API (beta) and API interfaces";
    }

    public void setNpmRepository(String npmRepository) {
        this.npmRepository = npmRepository;
    }

    private static String getRelativeToRoot(String path) {
        StringBuilder sb = new StringBuilder();
        int slashCount = path.split("/").length;
        if (slashCount == 0) {
            sb.append("./");
        } else {
            for (int i = 0; i < slashCount; ++i) {
                sb.append("../");
            }
        }
        return sb.toString();
    }

    @Override
    public void processOpts() {
        super.processOpts();

        tsModelPackage = modelPackage.replaceAll("\\.", "/");
        String tsApiPackage = apiPackage.replaceAll("\\.", "/");

        String modelRelativeToRoot = getRelativeToRoot(tsModelPackage);
        String apiRelativeToRoot = getRelativeToRoot(tsApiPackage);

        additionalProperties.put("tsModelPackage", tsModelPackage);
        additionalProperties.put("tsApiPackage", tsApiPackage);
        additionalProperties.put("apiRelativeToRoot", apiRelativeToRoot);
        additionalProperties.put("modelRelativeToRoot", modelRelativeToRoot);

        supportingFiles.add(new SupportingFile("index.handlebars", "", "index.ts"));
        supportingFiles.add(new SupportingFile("package.handlebars", "", "package.json"));
        supportingFiles.add(new SupportingFile("package.handlebars", "", "package.json"));
        supportingFiles.add(new SupportingFile("baseApi.handlebars", "", "base.ts"));
        supportingFiles.add(new SupportingFile("api.handlebars", "", "api.ts"));
        supportingFiles.add(new SupportingFile("model.handlebars", "", "model.ts"));
        supportingFiles.add(new SupportingFile("git_push.sh.handlebars", "", "git_push.sh"));
        supportingFiles.add(new SupportingFile("gitignore", "", ".gitignore"));

        if (additionalProperties.containsKey(GENERATE_API_TESTS)) {
            boolean generateApiTests = Boolean.parseBoolean(additionalProperties.get(GENERATE_API_TESTS).toString());
            if (generateApiTests) {
                supportingFiles.add(new SupportingFile("apiTest.handlebars", "test", "apiTest.ts"));
            }
        }

        if (additionalProperties.containsKey(GENERATE_MODEL_TESTS)) {
            boolean generateModelTests = Boolean.parseBoolean(additionalProperties.get(GENERATE_MODEL_TESTS).toString());
            if (generateModelTests) {
                additionalProperties.put("withInterfaces", "true");
                supportingFiles.add(new SupportingFile("modelTest.handlebars", "test", "modelTest.ts"));
            }
        }


        if (additionalProperties.containsKey(SEPARATE_MODELS_AND_API)) {
            boolean separateModelsAndApi = Boolean.parseBoolean(additionalProperties.get(SEPARATE_MODELS_AND_API).toString());
            if (separateModelsAndApi) {
                if (StringUtils.isAnyBlank(modelPackage, apiPackage)) {
                    throw new RuntimeException("apiPackage and modelPackage must be defined");
                }
                modelTemplateFiles.put("model.handlebars", ".ts");
                apiTemplateFiles.put("apiInner.handlebars", ".ts");
                supportingFiles.add(new SupportingFile("modelIndex.handlebars", tsModelPackage, "index.ts"));
            }
        }

        if (additionalProperties.containsKey(NPM_NAME)) {
            addNpmPackageGeneration();
        }

    }

    public String toEnumValue(String value, String datatype) {
        if ("number".equals(datatype)) {
            return value;
        } else {
            return "\"" + escapeText(value) + "\"";
        }
    }

    @Override
    public Map<String, Object> postProcessOperationsWithModels(Map<String, Object> objs, List<Object> allModels) {
    /*
        allModels.forEach(modelMap -> {
            CodegenModel model = (CodegenModel) ((Map<String, Object>)modelMap).get("model");
            for (String alternative : model.oneOf) {
                for (Object objAlternative : allModels) {
                    CodegenModel alternativeModel = (CodegenModel) ((Map<String, Object>)objAlternative).get("model");
                    String name = alternativeModel.getClassname();
                    if (name.equals(alternative)) {
                        for (CodegenProperty allVar : model.getAllVars()) {
                            if (allVar.isDiscriminator) {
                                alternativeModel.allVars.stream()
                                        .filter(v -> v.name.equals(allVar.name))
                                        .forEach(v -> v.isDiscriminator = true);
                            }
                        }
                    }
                }
            }
        });

     */

        objs = super.postProcessOperationsWithModels(objs, allModels);
        Map<String, Object> vals = (Map<String, Object>) objs.getOrDefault("operations", new HashMap<>());
        List<CodegenOperation> operations = (List<CodegenOperation>) vals.getOrDefault("operation", new ArrayList<>());
        /*
            Filter all the operations that are multipart/form-data operations and set the vendor extension flag
            'multipartFormData' for the template to work with.
         */
        operations.stream()
                .filter(op -> op.hasConsumes)
                .filter(op -> op.consumes.stream().anyMatch(opc -> opc.values().stream().anyMatch("multipart/form-data"::equals)))
                .forEach(op -> op.vendorExtensions.putIfAbsent("multipartFormData", true));
        return objs;
    }

    @Override
    public Map<String, Object> postProcessAllModels(Map<String, Object> objs) {
        Map<String, Object> result = super.postProcessAllModels(objs);
        for (Map.Entry<String, Object> entry : result.entrySet()) {
            Map<String, Object> inner = (Map<String, Object>) entry.getValue();
            List<Map<String, Object>> models = (List<Map<String, Object>>) inner.get("models");
            for (Map<String, Object> model : models) {
                CodegenModel codegenModel = (CodegenModel) model.get("model");
                model.put("hasAllOf", codegenModel.allOf.size() > 0);
                model.put("hasOneOf", codegenModel.oneOf.size() > 0);
                model.put("hasReadOnly", codegenModel.allVars.stream().anyMatch(v -> v.isReadOnly));
                model.put("hasWriteOnly", codegenModel.allVars.stream().anyMatch(v -> v.isWriteOnly));

                for (CodegenProperty variable : codegenModel.vars) {
                    if (variable.get_enum() != null && variable.get_enum().size() == 1) {
                        variable.dataType = "\"" + variable.get_enum().get(0) + "\"";
                        variable.isEnum = false;
                        // This is abusing uniqueItems - we use it to note that there is only one enum alternative - i.e. the property is constant
                        variable.setUniqueItems(true);
                    }
                    if (variable.dataType.equals("object")) {
                        variable.dataType = variable.datatypeWithEnum = "unknown";
                    }
                    if (variable.isArray && variable.maxItems != null && variable.maxItems <= 5) {
                        String toupleType = "[" + IntStream.range(0, variable.maxItems)
                                .mapToObj(i -> variable.items.dataType + (i >= variable.minItems ? "?" : ""))
                                .collect(Collectors.joining(", ")) + "]";
                        variable.dataType = variable.datatypeWithEnum = toupleType;
                    }
                }
                for (CodegenProperty variable : codegenModel.allVars) {
                    if (variable.get_enum() != null && variable.get_enum().size() == 1) {
                        variable.dataType = "\"" + variable.get_enum().get(0) + "\"";
                        variable.isEnum = false;
                        // This is abusing uniqueItems - we use it to note that there is only one enum alternative - i.e. the property is constant
                        variable.setUniqueItems(true);
                    }
                    if (variable.dataType.equals("object")) {
                        variable.dataType = variable.datatypeWithEnum = "unknown";
                    }
                }

                if (!codegenModel.oneOf.isEmpty()) {
                    if (codegenModel.discriminator.getMapping() == null) {
                        Set<CodegenDiscriminator.MappedModel> mappedModels = new HashSet<>();
                        HashMap<String, String> mapping = new HashMap<>();
                        for (String className : codegenModel.oneOf) {

                            String subtypeModel = result.entrySet().stream()
                                    .filter(e -> ((Map<String, Object>) e.getValue()).get("classname").equals(className))
                                    .map(Map.Entry::getKey)
                                    .findFirst()
                                    .orElseThrow(() -> new IllegalArgumentException("Undefined model " + className + " referenced from " + codegenModel.getClassname()));
                            mapping.put(subtypeModel, className);
                            mappedModels.add(new CodegenDiscriminator.MappedModel(subtypeModel, className));
                        }
                        codegenModel.discriminator.setMapping(mapping);
                        codegenModel.discriminator.setMappedModels(mappedModels);
                    }
                }

            }
        }
        return result;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> postProcessModels(Map<String, Object> objs) {
        List<Object> models = (List<Object>) postProcessModelsEnum(objs).get("models");

        boolean withoutPrefixEnums = false;
        if (additionalProperties.containsKey(WITHOUT_PREFIX_ENUMS)) {
            withoutPrefixEnums = Boolean.parseBoolean(additionalProperties.get(WITHOUT_PREFIX_ENUMS).toString());
        }

        for (Object _mo  : models) {
            Map<String, Object> mo = (Map<String, Object>) _mo;
            CodegenModel cm = (CodegenModel) mo.get("model");

            // Deduce the model file name in kebab case
            cm.classFilename = cm.classname.replaceAll("([a-z0-9])([A-Z])", "$1-$2").toLowerCase(Locale.ROOT);

            //processed enum names
            if(!withoutPrefixEnums) {
                cm.imports = new TreeSet(cm.imports);
                // name enum with model name, e.g. StatusEnum => PetStatusEnum
                for (CodegenProperty var : cm.vars) {
                    if (Boolean.TRUE.equals(var.isEnum)) {
                        var.datatypeWithEnum = var.datatypeWithEnum.replace(var.enumName, cm.classname + var.enumName);
                        var.enumName = var.enumName.replace(var.enumName, cm.classname + var.enumName);
                    }
                }
                for (CodegenProperty var : cm.allVars) {
                    if (Boolean.TRUE.equals(var.isEnum)) {
                        var.datatypeWithEnum = var.datatypeWithEnum.replace(var.enumName, cm.classname + var.enumName);
                        var.enumName = var.enumName.replace(var.enumName, cm.classname + var.enumName);
                    }
                }
            }
        }

        // Apply the model file name to the imports as well
        for (Map<String, String> m : (List<Map<String, String>>) objs.get("imports")) {
            String javaImport = m.get("import").substring(modelPackage.length() + 1);
            String tsImport = tsModelPackage + "/" + javaImport;
            m.put("tsImport", tsImport);
            m.put("class", javaImport);
            m.put("filename", javaImport.replaceAll("([a-z0-9])([A-Z])", "$1-$2").toLowerCase(Locale.ROOT));
        }
        return objs;
    }

    /**
     * Overriding toRegularExpression() to avoid escapeText() being called,
     * as it would return a broken regular expression if any escaped character / metacharacter were present.
     */
    @Override
    public String toRegularExpression(String pattern) {
        return addRegularExpressionDelimiter(pattern);
    }

    @Override
    public String toModelFilename(String name) {
        return super.toModelFilename(name).replaceAll("([a-z0-9])([A-Z])", "$1-$2").toLowerCase(Locale.ROOT);
    }

    @Override
    public String toApiFilename(String name) {
        return super.toApiFilename(name).replaceAll("([a-z0-9])([A-Z])", "$1-$2").toLowerCase(Locale.ROOT);
    }

    private void addNpmPackageGeneration() {

        if (additionalProperties.containsKey(NPM_REPOSITORY)) {
            this.setNpmRepository(additionalProperties.get(NPM_REPOSITORY).toString());
        }

        //Files for building our lib
        supportingFiles.add(new SupportingFile("README.handlebars", "", "README.md"));
        supportingFiles.add(new SupportingFile("package.handlebars", "", "package.json"));
        supportingFiles.add(new SupportingFile("tsconfig.handlebars", "", "tsconfig.json"));
    }

}
