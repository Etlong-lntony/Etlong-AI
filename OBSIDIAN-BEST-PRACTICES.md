# Obsidian + GitHub 同步最佳实践

## 1. 目录与命名

- 笔记按主题放在 `notes/` 下，命令片段放 `snippets/`，日记放 `journal/`
- 文件名建议小写 + 短横线，日期型用 `YYYY-MM-DD` 前缀
  - 例：`2026-11-24-git-sync.md`、`docker-常用命令.md`
- 避免文件名使用 `* ? " < > |` 等特殊字符

## 2. `.gitignore` 规则

仓库根目录的 `.gitignore` 已配置：

- 不提交 `.obsidian/workspace.json` 和 `.obsidian/workspace-mobile.json`（每台设备窗口布局不同）
- 不提交 `.trash/`、系统临时文件
- 大型附件（视频、压缩包）建议不提交，或单独用云盘存放

## 3. 初始化命令

在 Obsidian vault 根目录执行：

```bash
git init -b main
git config user.name "yourname"
git config user.email "12345678+yourname@users.noreply.github.com"
git remote add origin https://github.com/yourname/my-knowledge-base.git
git add .
git commit -m "Initial Obsidian vault"
git push -u origin main
```

## 4. Obsidian Git 插件配置

安装社区插件 **Git**（by Vinzent03）：

| 设置项 | 推荐值 |
|---|---|
| Auto Commit Interval | 5–10 分钟 |
| Auto Push on Commit | 开启 |
| Auto Pull On Boot | 开启 |
| Commit message prefix | `obsidian: ` |
| Git command to commit | `git add -A && git commit -m "obsidian: auto commit"` |

## 5. 日常同步习惯

- 打开 Obsidian 时先点一次 **Pull from main**
- 离开设备前点一次 **Commit and push**
- 两台电脑不要同时编辑同一份笔记；编辑前先 pull
- 出现冲突时，保留两份内容手动合并，不要直接覆盖

## 6. 移动端

- Android：推荐 [GitSync](https://gitsync.md) 客户端，Obsidian 内关闭 Git 插件
- iOS：推荐 [Working Copy](https://workingcopy.app) + Obsidian；纯 Git 在 iOS 后台受限，建议桌面为主

## 7. 敏感信息

GitHub 私有仓库 ≠ 端到端加密。以下内容不要明文提交：

- 密码、API Key、身份证号、银行卡号
- 加密笔记可用 Obsidian 插件（如 Crypt）或单独存放
