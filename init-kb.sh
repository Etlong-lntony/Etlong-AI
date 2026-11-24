# 1. 在 GitHub 创建私有仓库
#    Repository name: -AI-Etlong
#    用户名: Etlong-lntony
#    URL: https://github.com/Etlong-lntony/-AI-Etlong.git
#
# 2. 本地初始化（Windows 用 Git Bash 或 PowerShell）
#    本脚本默认在当前目录初始化；若想放进 kb/ 子目录，可改成：
#    mkdir -p kb && cd kb

# 创建目录结构
mkdir -p journal projects notes/networking notes/security notes/linux snippets references pdf templates

# 添加示例文件（已存在则跳过，避免覆盖）
[ -f journal/2026-11-24.md ] || echo "# Journal" > journal/2026-11-24.md
[ -f snippets/docker.md ] || echo "# Docker snippets" > snippets/docker.md
[ -f templates/note.md ] || echo "# Templates" > templates/note.md

# 初始化 Git
if [ ! -d .git ]; then
  git init -b main
fi
git config user.name "Etlong-lntony"
# TODO: 把 12345678 替换成你的 GitHub 数字 ID
# 获取方法：打开 https://github.com/settings/emails，勾选 Keep my email addresses private
# 然后复制 no-reply 地址，形如 12345678+Etlong-lntony@users.noreply.github.com
git config user.email "12345678+Etlong-lntony@users.noreply.github.com"

# 关联远端
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/Etlong-lntony/-AI-Etlong.git
else
  git remote set-url origin https://github.com/Etlong-lntony/-AI-Etlong.git
fi

# 首次提交并推送
git add .
git commit -m "Initial knowledge base setup"
git pull --rebase origin main
git push -u origin main

# 3. 后续日常提交
git add .
git commit -m "Update notes"
git push

# 4. 多设备同步（第二台电脑）
git clone https://github.com/Etlong-lntony/-AI-Etlong.git
