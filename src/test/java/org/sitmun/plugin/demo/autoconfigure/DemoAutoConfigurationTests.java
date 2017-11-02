package org.sitmun.plugin.demo.autoconfigure;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.sitmun.plugin.demo.web.DemoController;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import static org.assertj.core.api.Assertions.assertThat;

public class DemoAutoConfigurationTests {

    private AnnotationConfigApplicationContext context;

    @Before
    public void setUp() {
        context = new AnnotationConfigApplicationContext();
    }

    @After
    public void tearDown() {
        if (context != null) {
            context.close();
        }
    }

    @Test
    public void registersDemoControllerAutomatically() {
        context.register(DemoAutoConfiguration.class);
        context.refresh();
        assertThat(context.getBean(DemoController.class)).isNotNull();
    }
}
