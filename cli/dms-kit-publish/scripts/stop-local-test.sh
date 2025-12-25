#!/bin/bash

# DMS-UI 本地测试环境停止脚本

echo ""
echo "🛑 停止 DMS-KIT-PUBLISH 本地测试环境"
echo "================================"
echo ""

# 停止并删除容器
echo "🧹 停止容器..."
docker rm -f verdaccio ftp-server mailhog 2>/dev/null || true
echo ""

echo "================================"
echo "✅ 测试环境已停止并清理"
echo "================================"
echo ""

# 询问是否删除数据
echo "❓ 是否删除测试数据? (y/n)"
echo "   - verdaccio/  (npm 包数据)"
echo "   - ftp-data/   (FTP 上传文件)"
echo ""
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "🗑️  删除测试数据..."
    rm -rf verdaccio/ ftp-data/
    echo "✅ 测试数据已删除"
else
    echo ""
    echo "📦 测试数据已保留"
    echo "   - 位置: $(pwd)/verdaccio/ 和 $(pwd)/ftp-data/"
    echo "   - 下次启动测试环境时会复用这些数据"
fi

echo ""
echo "👋 再见！"
echo ""

