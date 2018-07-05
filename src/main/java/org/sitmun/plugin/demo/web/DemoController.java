package org.sitmun.plugin.demo.web;

import org.sitmun.plugin.demo.domain.Greetings;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.MessageFormat;

@Controller
@RequestMapping("api/demo")
public class DemoController {
  @ResponseBody
  @RequestMapping(value = "hello")
  public Greetings hello(@RequestParam String name) {
    return new Greetings(MessageFormat.format("Hello {0}!", name));
  }
}