# Repository instructions

严禁超前设计，严禁过度工程，严禁防御未出现的错误，严禁向后兼容，严禁使用胶水代码掩盖需要修剪的实现和旧路径

1. 不能乱修改与本次需求无关的代码的修改，即使可能有错误
2. 要注意边界，本次需求的修改不能影响已有的功能，导致新的bug
3. 不能在通用的方法或者功能中实现本次需求的具体功能
4. 不要重复造轮子，要了解全貌，架构中已有的核心入口或者功能模块要直接调用
5. 遵照已有的代码目录结构、技术架构和设计模式，不要自己随便乱创建新的目录和文件
6. 没有允许，不能随便staged
7. 修改代码的时候对于已有的功能除非明确说删除或者去掉，否则不能擅自去掉，造成新的回归bug
8. 写测试文件严谨为了测试通过而做虚假断言、mock断言或者跳过某些断言

## Agent skills

### Issue tracker

需求与问题使用 GitHub Issues；通过 `gh` CLI 操作。See `docs/agents/issue-tracker.md`.

### Domain docs

single-context：使用根目录 `GLOSSARY.md` 和相关 `docs/adr/`。See `docs/agents/domain.md`.
