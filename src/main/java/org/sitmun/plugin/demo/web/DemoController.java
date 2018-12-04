package org.sitmun.plugin.demo.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.webjars.RequireJS;

@Controller
@RequestMapping("app")
public class DemoController {
  @ResponseBody
  @RequestMapping(value = "config", produces = "application/javascript")
  public String webjarjs() {
    return RequireJS.getSetupJavaScript("/webjars/");
  }
}