/**
 * DMS UI 部署脚本入口文件
 *
 * 功能:
 * 1. 从 package.json 中获取对应包名称和版本
 * 2. [包]@[版本]未发布时，发布包
 * 3. 构建文档和部署文档
 * 4. 推送 tag
 *
 * 使用方法:
 * - 正常部署: node dist/index.js
 * - 重试文档部署触发: node dist/index.js --retry-deploy-trigger
 */

import { DmsKitPublish } from './services/deploy';

// 启动部署流程
new DmsKitPublish().start();
