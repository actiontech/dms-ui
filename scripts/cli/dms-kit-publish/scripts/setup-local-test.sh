#!/bin/bash

# DMS-UI 本地测试环境启动脚本

set -e

echo ""
echo "🚀 启动 DMS-KIT-PUBLISH 本地测试环境"
echo "================================"
echo ""

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ 错误: 未安装 Docker"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 检查 Docker 是否运行
if ! docker info &> /dev/null; then
    echo "❌ 错误: Docker 未运行"
    echo "请先启动 Docker"
    exit 1
fi

# 停止并删除已存在的容器
echo "🧹 清理旧容器..."
docker rm -f verdaccio ftp-server mailhog 2>/dev/null || true

# 清理旧的 Verdaccio 配置（如果需要）
if [ -f "$(pwd)/verdaccio/conf/config.yaml" ]; then
    echo "🔍 检测到现有配置文件，将重新生成以确保配置正确..."
    rm -f $(pwd)/verdaccio/conf/config.yaml
fi

echo ""

# 启动 Verdaccio
echo "📦 启动 npm 私有仓库 (Verdaccio)..."

# 创建 Verdaccio 数据目录
mkdir -p $(pwd)/verdaccio/storage $(pwd)/verdaccio/conf

# 创建 Verdaccio 配置文件（如果不存在）
if [ ! -f "$(pwd)/verdaccio/conf/config.yaml" ]; then
  cat > $(pwd)/verdaccio/conf/config.yaml << 'EOF'
storage: /verdaccio/storage/data

auth:
  htpasswd:
    file: /verdaccio/storage/htpasswd
    max_users: 1000
    algorithm: bcrypt
    rounds: 10

security:
  api:
    jwt:
      sign:
        expiresIn: 60d
        notBefore: 1
  web:
    sign:
      expiresIn: 7d
    verify:
      expiresIn: 7d

uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    timeout: 30s

packages:
  '@*/*':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

  '**':
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    proxy: npmjs

server:
  keepAliveTimeout: 60

middlewares:
  audit:
    enabled: true

logs: { type: stdout, format: pretty, level: http }

max_body_size: 100mb
EOF
fi

docker run -d \
  --name verdaccio \
  -p 4873:4873 \
  -v $(pwd)/verdaccio/storage:/verdaccio/storage \
  -v $(pwd)/verdaccio/conf:/verdaccio/conf \
  verdaccio/verdaccio

echo "   等待 Verdaccio 启动..."
sleep 5

# 检查 Verdaccio 是否启动成功
if curl -s http://localhost:4873 > /dev/null; then
    echo "   ✅ Verdaccio 启动成功"
else
    echo "   ⚠️  Verdaccio 可能未完全启动，请稍后检查"
    echo "   检查日志: docker logs verdaccio"
fi
echo ""

# 启动 FTP 服务器
echo "📁 启动 FTP 服务器..."

# 预创建 FTP 目录结构（模拟生产环境）
mkdir -p $(pwd)/ftp-data/actiontech-dms-ui/docs
echo "   已预创建目录结构: /home/ftpadmin/actiontech-dms-ui/docs"

docker run -d \
  --name ftp-server \
  -p 21:21 \
  -p 21000-21010:21000-21010 \
  -e USERS="ftpadmin|test123" \
  -e ADDRESS=localhost \
  -e MIN_PORT=21000 \
  -e MAX_PORT=21010 \
  -v $(pwd)/ftp-data:/home/ftpadmin \
  delfer/alpine-ftp-server

echo "   等待 FTP 服务器启动..."
sleep 3
echo "   ✅ FTP 服务器启动成功"
echo ""

# 启动 Mailpit (MailHog 的现代化替代品，支持 ARM)
echo "📧 启动邮件测试服务 (Mailpit)..."
docker run -d \
  --name mailhog \
  -p 1025:1025 \
  -p 8025:8025 \
  -e MP_MAX_MESSAGES=5000 \
  axllent/mailpit

echo "   等待 Mailpit 启动..."
sleep 2
echo "   ✅ Mailpit 启动成功"
echo ""

echo "================================"
echo "✅ 测试环境启动完成！"
echo "================================"
echo ""
echo "📌 服务地址："
echo "   - npm 仓库:   http://localhost:4873"
echo "   - FTP 服务:   ftp://localhost:21"
echo "   - 邮件界面:   http://localhost:8025"
echo ""
echo "🔐 测试凭据："
echo "   - FTP 用户:   ftpadmin / test123"
echo "   - npm 用户:   publisher / publisher"
echo ""
echo "📝 下一步操作："
echo "   1. 注册 npm 用户 (如果还未注册):"
echo "      npm adduser --registry http://localhost:4873/"
echo ""
echo "   2. 配置环境变量:"
echo "      cd scripts/publishAndDocsDeploy"
echo "      cp .env.example .env"
echo "      # 编辑 .env 文件（开发环境已经配置好，无需修改）"
echo ""
echo "   3. 准备测试包:"
echo "      # 修改 packages/*/package.json 中的版本号"
echo "      # 更新 packages/*/docs/CHANGELOG.md"
echo ""
echo "   4. 运行测试:"
echo "      pnpm tsx scripts/publishAndDocsDeploy/index.ts"
echo ""
echo "📖 详细文档: scripts/publishAndDocsDeploy/LOCAL_TEST_GUIDE.md"
echo ""

# 提示注册 npm 用户
echo "❓ 是否现在注册 npm 用户? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "请输入以下信息注册 npm 用户:"
    echo "用户名: publisher"
    echo "密码: publisher"
    echo "邮箱: publisher@example.com"
    echo ""
    npm adduser --registry http://localhost:4873/
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ npm 用户注册成功！"
        echo ""
        echo "🔑 认证信息已保存到 ~/.npmrc"
        echo "   你可以从中获取 NPM_AUTH 配置"
    else
        echo ""
        echo "⚠️  npm 用户注册失败，请稍后手动注册"
    fi
fi

echo ""
echo "🎉 准备就绪！可以开始测试了！"
echo ""

