# 1. 在 GitHub 创建私有仓库
#    Repository name: my-knowledge-base
#    Visibility: Private
#    勾选 Add a README file
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
git config user.name "yourname"
git config user.email "12345678+yourname@users.noreply.github.com"

# 关联远端（替换 yourname 和仓库名）
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin https://github.com/yourname/my-knowledge-base.git
fi

# 首次提交并推送
git add .
git commit -m "Initial knowledge base setup"
git push -u origin main

# 3. 后续日常提交
git add .
git commit -m "Update notes"
git push

# 4. 多设备同步（第二台电脑）
git clone https://github.com/yourname/my-knowledge-base.git
