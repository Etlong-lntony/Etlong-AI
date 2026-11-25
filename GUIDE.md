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
| 5. Actions 运行日志 | [03-Actions运行日志.jpg](https://workbuddy-space-static.codebuddy.work/image/GmbbTmu99jtlDcWkIp3Fw9.jpg) | 红色失败 job + set -x 追踪日志 |
| 5. 操作权限设置 | [04-Actions权限设置.jpg](https://workbuddy-space-static.codebuddy.work/image/xMjovQvCZDEMkKDB1qyFwj.jpg) | Settings → Actions → General → 操作权限 |
| 5. 权限与保留期 | [05-Actions权限设置_操作权限.jpg](https://workbuddy-space-static.codebuddy.work/image/ITWusHMHfRzE6u4nfUPO3q.jpg) | 操作权限 + 日志保留 90 天 |

> 截图原件存放于资料库「GitHub 个人档案库 / 界面截图」目录，
> 指南 PDF 与截图分开存放（PDF 在「指南PDF」目录）。
> 待补截图：01-新建仓库（建仓库页面）、02-Run workflow（手动触发页）。

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
   【截图：01-新建仓库.png —— 新建仓库页面】

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
3. 点 **Save**

   ![](https://workbuddy-space-static.codebuddy.work/image/xMjovQvCZDEMkKDB1qyFwj.jpg)
   *图 1：操作权限区 —— 选"允许所有操作和可复用工作流"，Workflow permissions 选"读写权限"*

   ![](https://workbuddy-space-static.codebuddy.work/image/ITWusHMHfRzE6u4nfUPO3q.jpg)
   *图 2：检查、工作流运行、状态、工件和日志保留 90 天*

> ⚠️ **常见问题 10**：手动触发 Run workflow 后 job 以
> **exit code 43** 失败
> 原因：pandoc 对某些文件转换失败 / `git push` 无新内容时报错。
> 解决：本仓库已修复——转换步骤容错（单文件失败跳过并打 WARN）、
> 无变更时跳过 push、PDF 一律上传 Artifact 兜底。
> 重跑后若仍红，展开失败步骤看 `+` 开头的 set -x 追踪日志定位。

验证：

- **Actions** → 选 `Backup & Convert to PDF` → **Run workflow**
- 绿色通过 = 成功；失败时看日志 + Artifacts 里是否已生成 PDF

  ![](https://workbuddy-space-static.codebuddy.work/image/GmbbTmu99jtlDcWkIp3Fw9.jpg)
  *图 3：Actions 运行失败示例（exit code 43）—— 修复后应显示绿色通过*

## 6. 日常使用

```bash
# 改完笔记
git add .
git commit -m "Update notes"
git push

# 换设备
git clone https://github.com/Etlong-lntony/Etlong-AI.git
```

可选：仓库名与用户名相同时，README 页即个人主页；
也可开 GitHub Pages 把笔记发布成网站
（Settings → Pages → main 分支根目录）。

## 7. 安全清单

- [ ] PAT 只勾 `repo`，定期 Revoke 旧的
- [ ] 密码 / API Key / 身份证 / 银行卡号**不要**明文入库
- [ ] GitHub 账户开 **Two-Factor Authentication**
- [ ] 仓库保持 Private；私有 ≠ 端到端加密，GitHub 仍可读明文
- [ ] 重要内容定期 `git clone` 一份到本地 / 外置硬盘

---

## 附：文件清单

| 文件 | 作用 |
|---|---|
| `init-kb.sh` | 一键本地初始化脚本 |
| `README.md` | 仓库首页 / 目录索引 |
| `.gitignore` | Obsidian 忽略规则 |
| `.github/workflows/backup-to-pdf.yml` | 定时转 PDF + 备份 |
| `OBSIDIAN-BEST-PRACTICES.md` | Obsidian 同步最佳实践 |
| `GUIDE.md` | 本指南 |
| `GUIDE.pdf` | 本指南 PDF 版（同步上传资料库） |
