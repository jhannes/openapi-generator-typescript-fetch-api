package io.github.jhannes.openapi.typescriptfetchapi;

import com.github.jknack.handlebars.Context;
import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Jackson2Helper;
import com.github.jknack.handlebars.Template;
import com.github.jknack.handlebars.context.FieldValueResolver;
import com.github.jknack.handlebars.context.JavaBeanValueResolver;
import com.github.jknack.handlebars.context.MapValueResolver;
import com.github.jknack.handlebars.helper.ConditionalHelpers;
import com.github.jknack.handlebars.helper.StringHelpers;
import com.github.jknack.handlebars.io.AbstractTemplateLoader;
import com.github.jknack.handlebars.io.TemplateLoader;
import com.github.jknack.handlebars.io.TemplateSource;
import org.openapitools.codegen.api.TemplatingExecutor;
import org.openapitools.codegen.templating.HandlebarsEngineAdapter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.lang.reflect.Modifier;
import java.util.Locale;
import java.util.Map;

/**
 * TODO: This fixes a problem in Handlebars 4.2.0 with Java 17. Try to remove it when com.github.jknack:handlebars:4.4.0 is released
 * `com.github.jknack.handlebars.HandlebarsException: baseApi.handlebars:4:3: java.lang.IllegalStateException: Shouldn't be illegal to access field 'size'`.
 */
class FixedHandlebarsEngineAdapter extends HandlebarsEngineAdapter {
    private static final Logger LOGGER = LoggerFactory.getLogger(FixedHandlebarsEngineAdapter.class);

    public static class MyFieldValueResolver extends FieldValueResolver {

        @Override
        public boolean matches(FieldWrapper field, String name) {
            return super.matches(field, name) && !isTransient(field);
        }

        protected boolean isTransient(FieldWrapper member) {
            return Modifier.isTransient(member.getModifiers());
        }
    }

    @Override
    public String compileTemplate(TemplatingExecutor executor, Map<String, Object> bundle, String templateFile) throws IOException {
        TemplateLoader loader = new AbstractTemplateLoader() {
            @Override
            public TemplateSource sourceAt(String location) {
                return findTemplate(executor, location);
            }
        };

        Context context = Context
                .newBuilder(bundle)
                .resolver(
                        MapValueResolver.INSTANCE,
                        JavaBeanValueResolver.INSTANCE,
                        new MyFieldValueResolver())
                .build();

        Handlebars handlebars = new Handlebars(loader);
        handlebars.registerHelperMissing((obj, options) -> {
            LOGGER.warn(String.format(Locale.ROOT, "Unregistered helper name '%s', processing template:%n%s", options.helperName, options.fn.text()));
            return "";
        });
        handlebars.registerHelper("json", Jackson2Helper.INSTANCE);
        StringHelpers.register(handlebars);
        handlebars.registerHelpers(ConditionalHelpers.class);
        handlebars.registerHelpers(org.openapitools.codegen.templating.handlebars.StringHelpers.class);
        Template tmpl = handlebars.compile(templateFile);
        return tmpl.apply(context);
    }
}
