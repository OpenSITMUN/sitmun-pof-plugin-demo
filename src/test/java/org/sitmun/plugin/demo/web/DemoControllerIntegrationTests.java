package org.sitmun.plugin.demo.web;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.sitmun.plugin.demo.domain.Greetings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class DemoControllerIntegrationTests {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void helloMe() throws Exception {
        assertThat(this.restTemplate.getForObject("http://localhost:" + port + "/api/demo/hello?name=me", Greetings.class))
                .extracting("message").containsOnly("Hello me!");
    }
}
