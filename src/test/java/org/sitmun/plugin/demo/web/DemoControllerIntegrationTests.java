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
import org.springframework.web.util.UriTemplate;

import static java.text.MessageFormat.format;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class DemoControllerIntegrationTests {

  private static final String EXPECTED_MESSAGE = "Hello {0}!";
  private static final String HELLO_ENDPOINT = "http://localhost:{port}/api/demo/hello?name={msg}";

  @LocalServerPort
  private int port;

  @Autowired
  private TestRestTemplate restTemplate;

  @Test
  public void helloMe() {
    UriTemplate uri = new UriTemplate(HELLO_ENDPOINT);
    assertThat(this.restTemplate.getForObject(uri.expand(port, "me"), Greetings.class))
      .extracting("message")
      .containsOnly(format(EXPECTED_MESSAGE, "me"));
  }
}
