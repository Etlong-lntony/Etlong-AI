# GitHub 个人档案库搭建指南

> 一份从零开始的实战指南：用 GitHub 私有仓库搭建个人知识库 / 档案库，
> 含 Obsidian 同步、GitHub Actions 自动备份转 PDF。
>
> 基于真实项目 `Etlong-lntony/Etlong-AI`（2026-11 搭建）整理，
> 所有报错都是实际踩过的坑，按此顺序执行即可一次成功。
>
> 界面截图存放于 WorkBuddy 资料库「GitHub 个人档案库 / 界面截图」，
> 各步骤对应截图见文内标记。

## 步骤截图索引

| 步骤 | 截图 | 说明 |
|---|---|---|
| 2. 创建仓库 | [01-仓库首页.jpg](https://workbuddy-space-static.codebuddy.work/image/food2ohKKmX1t82IdJsLVC.jpg) | 仓库首页（私有仓库） |
| 5. 权限设置 | [07-Actions权限设置_英文_操作权限+Workflow读写.jpg](https://workbuddy-space-static.codebuddy.work/image/5YACKaddVW1MpGxxxEnT1w.jpg) | Settings → Actions → General 全页（英文界面：Actions permissions + 保留期 + Workflow 读写权限） |
| 5. 手动触发 | [02-Run-workflow手动触发.jpg](https://workbuddy-space-static.codebuddy.work/image/09qtqIY7k6S7hmuf8ouijC.jpg) | Actions 手动触发页（In progress） |
| 5. 失败排查 | [03-Actions运行日志.jpg](https://workbuddy-space-static.codebuddy.work/image/GmbbTmu99jtlDcWkIp3Fw9.jpg) | 红色失败 job + set -x 追踪日志 |
| 5. 成功验收 | [06-备份成功截图.jpg](https://workbuddy-space-static.codebuddy.work/image/fNVOsmgX7KZHHYjrBv7INe.jpg) | 全步骤绿色通过（1m 33s） |
| 8. 在线浏览 | 无截图（见 8.2 / 8.4 节） | 公开仓库 + GitHub Pages 上线，访问 `*.github.io/<仓库名>` |

> 截图原件存放于资料库「GitHub 个人档案库 / 界面截图」目录，
> 指南 PDF 与截图分开存放（PDF 在「指南PDF」目录）。

---

## 0. 你将搭建什么

```text
GitHub 私有仓库 Etlong-AI/
├── README.md                        # 首页 / 目录索引
├── journal/                         # 日记 / 周记
├── projects/                        # 项目资料
├── notes/                           # 主题笔记
├── snippets/                        # 命令 / 代码片段
├── references/                      # 参考资料
├── templates/                       # 笔记模板
├── pdf/                             # Actions 自动生成的 PDF 备份
├── .github/workflows/backup-to-pdf.yml   # 定时转 PDF + 自动备份
└── .gitignore                       # Obsidian 专用忽略规则
```

核心特性：

| 能力 | 说明 |
|---|---|
| 版本控制 | 每次修改可回滚、可对比 |
| 多设备同步 | 任何机器 `git clone` 即可访问 |
| 自动备份 | 每天凌晨 2 点把笔记转 PDF 并推回仓库 |
| 私有安全 | 私人内容不外泄 |

## 1. 准备工作（10 分钟）

### 1.1 注册 / 登录 GitHub

- 访问 https://github.com 注册或登录
- 记下你的用户名（本文以 `Etlong-lntony` 为例）

### 1.2 安装 Git

- Windows：安装 [Git for Windows](https://git-scm.com/downloads)，安装时选默认选项
- 验证：新开 PowerShell 输入 `git --version`，能输出版本号即成功

> ⚠️ **常见问题 1**：`git : 无法将"git"项识别为 cmdlet...`
>
> 原因：Git 没安装，或安装后**没新开终端**（PATH 不刷新）。
> 解决：重装 Git for Windows，或把 Git 的 `mingw64\bin` 目录手动加入 PATH
> （系统属性 → 环境变量 → Path → 新建一行），然后**重开终端**。

### 1.3 生成 PAT（Personal Access Token）

git 推 GitHub 不再接受账号密码，必须用 PAT：

1. 打开 https://github.com/settings/tokens/new
2. **Note** 填 `kb-sync`
3. **Expiration** 选 `No expiration`（或 90 天）
4. **Select scopes** 只勾最顶上的 **`repo`**
5. 拉到底点 **Generate token**，复制 `ghp_...` 开头的字符串

> ⚠️ **常见问题 2**：token 只显示这一次，离开页面就找不到了。
> 立刻存到密码管理器里。泄露了随时在
> https://github.com/settings/tokens 点 **Revoke** 撤销并重新生成。

## 2. 创建仓库（2 分钟）

1. GitHub 首页右上角 **+** → **New repository**
2. 名称：`Etlong-AI`（或你喜欢的名字）
3. **Private**
4. 勾选 **Add a README file**（这样仓库初始有个 README）
5. 点 **Create repository**

   ![](https://workbuddy-space-static.codebuddy.work/image/food2ohKKmX1t82IdJsLVC.jpg)
   图：建好后的仓库首页（私有仓库，带 README 与完整目录结构）

> ⚠️ **常见问题 3**：仓库建好后访问 `https://github.com/用户名/仓库名`
> 显示 404 —— 因为它是**私有**的，未登录访问就是 404，属正常现象。
> 登录后可见。

## 3. 本地初始化（5 分钟）

在项目目录执行（目录里已有本仓库的 `init-kb.sh`，也可直接跑它）：

```bash
# 创建目录结构
mkdir -p journal projects notes/networking notes/security notes/linux \
         snippets references pdf templates

# 初始化 Git
git init -b main
git config user.name "Etlong-lntony"
git config user.email "你的GitHub数字ID+Etlong-lntony@users.noreply.github.com"

# 关联远端
git remote add origin https://github.com/Etlong-lntony/Etlong-AI.git

# 首次提交并推送
git add .
git commit -m "Initial knowledge base setup"
git pull --rebase origin main
git push -u origin main
```

> ⚠️ **常见问题 4**：`git config user.email` 里的"数字ID"在哪找？
> 打开 https://github.com/settings/emails ，勾选
> **Keep my email addresses private**，下方显示的
> `1234567+你的用户名@users.noreply.github.com` 就是，
> 用你的真实数字替换 `1234567`。

> ⚠️ **常见问题 5**：push 时弹认证框
> - Username：你的 GitHub 用户名
> - Password：**粘贴 PAT**（粘贴后屏幕不显示，正常，直接回车）
> - Windows 会把它存进系统凭证管理器，以后不再问

> ⚠️ **常见问题 6**：`git pull --rebase` 报 CONFLICT (add/add)
> 发生在 GitHub 建仓库时勾了"Add a README"，远端已有一个 README，
> 本地也写了一个。解决：
>
> ```bash
> # 保留本地完整 README
> git checkout --ours README.md   # 或手动合并
> git add README.md
> git rebase --continue
> ```
>
> 若终端提示 `Terminal is dumb, but EDITOR unset`，
> 用 `EDITOR=true git rebase --continue` 绕过编辑器。

> ⚠️ **常见问题 7**：公司网络下 push 报
> `schannel: server closed abruptly` 或 `Connection was reset`
> 原因：代理干扰。解决：
> - 本地终端执行 `git config --global --unset http.proxy`
> - 或临时用 `env -u http_proxy -u https_proxy git push` 绕过代理
> - 在**能直连 GitHub 的终端**里推送即可成功

## 4. 配置 Obsidian（可选，10 分钟）

适合想要双向链接、图谱视图的用户。

1. 安装 [Obsidian](https://obsidian.md)
2. 社区插件搜索 **Git**（作者 Vinzent03）安装并启用
3. 用 Obsidian「打开文件夹作为库」指向项目目录
4. 插件设置：

| 设置项 | 推荐值 |
|---|---|
| Auto Commit Interval | 5–10 分钟 |
| Auto Push on Commit | 开 |
| Auto Pull On Boot | 开 |

`.gitignore` 已预置（不要提交 `workspace.json` 等每台设备不同的文件）。

> ⚠️ **常见问题 8**：两个设备同时改同一文件 → git 冲突。
> 习惯：打开先 pull，走前 commit + push；冲突时手动合并两份内容。

> ⚠️ **常见问题 9**：手机端 Git 支持弱。
> iOS 用 Working Copy / GitSync，Android 用 GitSync，
> 手机上的 Obsidian 不要再开 Git 插件（避免两套进程抢写）。

## 5. 启用 GitHub Actions 自动备份（3 分钟）

仓库已内置 `.github/workflows/backup-to-pdf.yml`：
每天凌晨 2 点用 Pandoc 把 Markdown 转 PDF → 推回 `pdf/` 目录 → 打 tag，
并把 PDF 上传为 Artifact（30 天保留）兜底。

启用步骤：

1. 仓库 → **Settings** → **Actions** → **General**
2. 新版 GitHub 不再单列 "Allow workflow dispatch / scheduled runs"，
   已被 **Actions permissions** 的三选一合并：
   - 选 **Allow all actions and reusable workflows**（含手动+定时）
   - **Workflow permissions** 选 **Read and write permissions**
     （workflow 要 push PDF 回仓库，必须写权限）
3. 点 **Save**（每个区块各有一个 Save，三处都要保存）

   ![](https://workbuddy-space-static.codebuddy.work/image/5YACKaddVW1MpGxxxEnT1w.jpg)
   图：Actions → General 全页（英文界面，截图 07）。从上到下：
   - **Actions permissions**：选 `Allow all actions and reusable workflows`（允许所有操作和可复用工作流，含手动+定时触发）
   - **Check, workflow run, status, artifact and log retention**：运行保留期，默认 `90 days`（上限 400 天）
   - **Fork pull request workflows**：私有仓库可忽略
   - **Workflow permissions**：选 `Read and write permissions`（读写权限，workflow 要 push PDF 回仓库必须开）

> ⚠️ **提示**：新版界面是英文的，上面每项的英文选项与中文含义对照已标注；
> 界面语言可在 头像 → Settings → 右上角语言切换器 改回中文（可选）。

> ⚠️ **常见问题 10**：手动触发 Run workflow 后 job 以
> **exit code 43** 失败
> 原因：pandoc 对某些文件转换失败 / `git push` 无新内容时报错。
> 解决：本仓库已修复——转换步骤容错（单文件失败跳过并打 WARN）、
> 无变更时跳过 push、PDF 一律上传 Artifact 兜底。
> 重跑后若仍红，展开失败步骤看 `+` 开头的 set -x 追踪日志定位。

   ![](https://workbuddy-space-static.codebuddy.work/image/GmbbTmu99jtlDcWkIp3Fw9.jpg)
   图：失败排查示例 —— 红色 job（exit code 43），展开步骤看 set -x 追踪日志（截图 03）

验证：

- **Actions** → 选 `Backup & Convert to PDF` → **Run workflow**

  ![](https://workbuddy-space-static.codebuddy.work/image/09qtqIY7k6S7hmuf8ouijC.jpg)
  图：手动触发后运行中（In progress，截图 02）

- 跑完看结果：

  ![](https://workbuddy-space-static.codebuddy.work/image/fNVOsmgX7KZHHYjrBv7INe.jpg)
  图：backup-pdf job 全步骤通过（1m 33s），Artifacts 区可下载 PDF 备份（截图 06）

> 提示：成功运行仍可能有 **1 warning**（通常是 `set -x` 日志量或
> LaTeX 字体告警），不影响结果；看 job 左侧是否全绿 + Artifacts 是否生成即可。

## 6. 日常使用

```bash
# 改完笔记
git add .
git commit -m "Update notes"
git push

# 换设备
git clone https://github.com/Etlong-lntony/Etlong-AI.git
```

## 7. 安全清单

- [ ] PAT 只勾 `repo`，定期 Revoke 旧的
- [ ] 密码 / API Key / 身份证 / 银行卡号**不要**明文入库
- [ ] GitHub 账户开 **Two-Factor Authentication**
- [ ] 仓库保持 Private；私有 ≠ 端到端加密，GitHub 仍可读明文
- [ ] 重要内容定期 `git clone` 一份到本地 / 外置硬盘

## 8. 把仓库变成可浏览的网站（GitHub Pages）

仓库建好、内容沉淀之后，还可以直接生成一个在线浏览的网站，不用写任何后端。
两种方式按"是否愿意公开"选：

| 方式 | 适用 | 代价 |
|---|---|---|
| **A. GitHub Pages（本仓库公开）** | 想让笔记/指南全网可访问 | 仓库变 Public，全部内容公开 |
| **B. 只公开 `site/` 子目录到独立公开仓库** | 只想公开网站，主档案库保持私有 | 多维护一个仓库 |

### 8.1 准备静态站点（本仓库已内置 `site/`）

仓库根目录已带一个极简静态站（暗色主题、纯 HTML，无依赖）：

```text
site/
├── index.html            # 首页：卡片导航 + 快速开始 + 使用建议
├── guide.html           # 搭建指南页（复用 GUIDE.md 内容 + 样式 + 截图）
└── best-practices.html # Obsidian + Git 同步最佳实践
```

生成命令（本仓库已封装，跑一下即可同步 `site/guide.html`）：

```bash
node md2html.js   # 更新 site/guide.html 的内容与样式
```

### 8.2 方式 A：公开仓库 + 启用 GitHub Pages

1. 仓库页 → **Settings**（仓库设置）
2. 左侧最底 **Danger zone** → **Change visibility** → 选 **Public**
   （输入仓库名 `Etlong-AI` 确认）
3. 回到 **Settings** → **Pages**
4. **Build and deployment** → **Source** 选 **Deploy from a branch**
5. **Branch** 选 `main`，**文件夹**选 **`site`**（⚠️ 不是 `/ (root)`，
   站点文件在 `site/` 目录里，选错会白页 / 404）
6. 点 **Save**，等 1–2 分钟

上线地址：

```text
https://<你的用户名>.github.io/<仓库名>/
例：https://etlong-lntony.github.io/Etlong-AI/
```

### 8.3 方式 B：只公开网站（折中）

不想让笔记源码公开时：

1. 新建一个**公开**仓库，例如 `Etlong-AI-site`
2. 把本仓库的 `site/` 整个目录拷进去作为该仓库根目录
3. 主仓库 `Etlong-AI` 保持 **Private**，只把网站页放公开仓库
4. 在公开仓库同样走 8.2 的 Pages 步骤（Branch = `main`，文件夹 = `/ (root)`，
   因为 `site/` 已拷成根目录）

### 8.4 验收与排查

- 访问上线地址，应看到暗色首页 + 卡片导航；点卡片能跳各页
- **404 / "Site not found"**：
  - 仓库还没设为 Public → 私有仓库的 Pages 不对外
  - Pages 的文件夹没选 `site` → 根目录无 index.html
  - 刚开 Pages，等 1–2 分钟再刷
- 内容没更新：`node md2html.js` 重新生成 → `git add site/ && git commit && git push`，
  Pages 会在推送后 1–2 分钟自动重建

> ⚠️ **安全提示**：方式 A 会让 `GUIDE.md`、截图、`journal/`、`notes/`、`snippets/`
> 全网可见。操作前确认这些内容**可以公开**；含敏感信息的请改用方式 B。

---

## 附：文件清单

| 文件 | 作用 |
|---|---|
| `init-kb.sh` | 一键本地初始化脚本 |
| `README.md` | 仓库首页 / 目录索引 |
| `.gitignore` | Obsidian 忽略规则 |
| `.github/workflows/backup-to-pdf.yml` | 定时转 PDF + 备份 |
| `OBSIDIAN-BEST-PRACTICES.md` | Obsidian 同步最佳实践 |
| `md2html.js` | Markdown → HTML 构建脚本（同步 `site/guide.html`） |
| `site/` | 静态站点（GitHub Pages 托管，含 index / guide / best-practices 三页） |
| `GUIDE.md` | 本指南 |
| `GUIDE.pdf` | 本指南 PDF 版（同步上传资料库） |
