package org.sitmun.plugin.demo.web;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.util.UriTemplate;

import static java.text.MessageFormat.format;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest
@ContextConfiguration
public class DemoControllerMvcTests {

    private static final String EXPECTED_MESSAGE = "Hello {0}!";
    private static final String HELLO_ENDPOINT = "/api/demo/hello?name={msg}";

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void helloResponseContainsName() throws Exception {
        UriTemplate uri = new UriTemplate(HELLO_ENDPOINT);
        mockMvc.perform(get(uri.expand("me")).accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString(format(EXPECTED_MESSAGE, "me"))));
    }
}
