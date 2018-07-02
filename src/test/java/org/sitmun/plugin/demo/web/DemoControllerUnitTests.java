package org.sitmun.plugin.demo.web;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static java.text.MessageFormat.format;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest
public class DemoControllerUnitTests {

    private static final String EXPECTED_MESSAGE = "Hello {0}!";

    @Autowired
    private DemoController controller;

    @Test
    public void contextLoads() {
        assertThat(controller).isNotNull();
    }

    @Test
    public void helloResponseContainsName() {
        assertThat(controller.hello("me"))
                .extracting("message")
                .containsOnly(format(EXPECTED_MESSAGE, "me"));
    }
}
