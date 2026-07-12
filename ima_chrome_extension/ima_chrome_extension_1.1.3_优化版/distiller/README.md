### Readability

- https://github.com/mozilla/readability
- Readability-readerable.js 判断是否适合抽取
- Readability.js执行抽取
- 本项目对Readability-readerable.js和Readability.js均做了少量修改以适配一些明显的badcase

### X5-Distiller

- https://git.woa.com/x5tbs/dom_distiller_for_novel/tree/for_readmode_master
- X5内核中阅读模式、抽取正文所使用的的脚本，基于chromium的distiller项目
- 可以直接使用编译好的脚本：JSForReadMode/javascript/mtt_domdistiller.js
- 也可以自己编译：https://doc.weixin.qq.com/doc/w3_ALYAXQaRACgeE0wtJoYSMCBCTgrIs?scode=AJEAIQdfAAo0WpGP8rALYAXQaRACg
  ```
  // 移动端在执行 js 之前会对原始 js 进行如下的替换，DISTILLER_JS 为原始 js，第一个就是用来控制抽取的结果为 html 片段
  DISTILLER_JS = DISTILLER_JS.replace("{\"1\":true}", "{}");
  DISTILLER_JS = DISTILLER_JS.replace("$$STRINGIFY_OUTPUT", "false");
  DISTILLER_JS = DISTILLER_JS.replace("$$SITETYPE", "news");
  ```
