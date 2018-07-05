package org.sitmun.plugin.demo.autoconfigure;

import org.sitmun.plugin.demo.web.DemoController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DemoAutoConfiguration {

  @Bean
  public DemoController demoController() {
    return new DemoController();
  }
}
