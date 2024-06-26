---
order: 15
title: v18 升级指南
toc: false
---

本文档将帮助你从 `ng-zorro-antd` 17.x 版本升级到 18.x 版本。

## 开始之前

1. 首先确保你 `Node.js` >= `18.19.1` 或 >= `20.11.0` 或 >= `22.0.0`
2. 创建新的分支，或者使用其他方式备份当前项目
3. 删除项目下 package-lock.json 文件

## 升级步骤

### 1. 升级相关依赖

- 前往 [https://angular.dev/update-guide](https://angular.cn/update-guide) 将项目升级到 Angular 18
- 如果你有单独使用 `@angular/cdk` 请执行 `ng update @angular/cdk`

### 升级 NG-ZORRO

> 注意：对于 `standalone` 模式的项目，请手动升级 `ng-zorro-antd` 版本

- 运行 `ng update ng-zorro-antd`
- 如果控制台出现警告消息请按提示修改对应代码