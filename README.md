<<<<<<< HEAD
# Etlong-AI
=======
# 📚 个人档案库 / 知识库

> 一个版本控制驱动的个人知识库，用于沉淀笔记、项目、命令片段与学习记录。

## 目录结构

```text
.
├── README.md            # 本文件，首页索引
├── journal/             # 日记 / 周记 / 月记
│   └── 2026-11-24.md
├── projects/            # 项目资料
│   └── project-a/
├── notes/               # 按主题分类的笔记
│   ├── networking/
│   ├── security/
│   └── linux/
├── snippets/            # 代码片段 / 常用命令
│   └── docker.md
├── references/          # 参考资料 / 链接收藏
├── pdf/                 # GitHub Actions 自动生成的 PDF 备份
└── templates/           # 笔记模板
```

## 快速开始

1. 进入对应目录，新建 `.md` 文件
2. 修改完成后执行：

   ```bash
   git add .
   git commit -m "Update notes"
   git push
   ```

3. 如果启用 GitHub Actions 自动备份，PDF 会生成在 `pdf/` 目录

## 使用建议

- 文件名使用小写字母、短横线或下划线，避免空格
- 日期型文件建议使用 `YYYY-MM-DD` 前缀
- 重要笔记用 `## 标签` 标注，方便全局搜索
- 不要把密码、密钥、身份证号等敏感信息明文存放

## 贡献 / 维护

这是个人仓库，由我独立维护。如多人协作，建议每个笔记独立 PR 提交。
>>>>>>> dcc6f95 (Initial knowledge base setup)
