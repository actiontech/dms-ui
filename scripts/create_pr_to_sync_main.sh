#!/bin/bash

# 请勿修改本脚本
# 脚本功能：当 dms-ui-ee 仓库触发同步 dms-ui mian 分支代码后，自动创建 dms-ui-ee 仓库 main 合并至 main-ee 的 pr，并处理 pr 可能存在冲突的场景
# 脚本流程
# 1. dms-ui-ee 仓库中不存在main同步至main-ee的PR:
# 同步代码后无冲突: 直接创建 main 合并至 main-ee 的PR
# 存在冲突: 基于 main 创建新分支 (sync-main-to-main-ee-TIMESTAMP), 创建该分支合并至main-ee的PR，并关掉之前 mian 至 mian-ee 的 pr

# 2. dms-ui-ee 仓库中已存在main同步至main-ee的PR:
# 同步代码后无冲突: 结束action
# 存在冲突: 重复a中的冲突处理流程
# ===============================================================================================================================================

# 检查pr的合并状态，由于当分支提交 commit 后，github 会重新检测当前 pr 的合并状态，所以在这里加上了轮询。
# 当在轮询期前获取到合并状态不为 UNKNOWN 时，即代表pr合并状态检测结束
check_pr_status() {
  local pr_number=$1
  local max_attempts=$2
  local wait_time=$3
  local attempt=1

  while [ $attempt -le $max_attempts ]; do
    local merge_status=$(gh pr view $pr_number --json mergeable -q '.mergeable')

    if [ "$merge_status" != "UNKNOWN" ]; then
      echo $merge_status
      return 0
    fi

    sleep $wait_time
    ( (attempt++))
  done

  echo "TIMEOUT"
  return 1
}

#基于 main 分支新建一个分支，然后创建该分支合并至 main-ee 的pr，并关掉之前创建的 main 合并至 mian-ee 的pr，主要用于处理 main 合并至 mian-ee 存在冲突的情况
create_and_close_conflicting_pr() {
  local pr_number=$1
  # 创建新分支
  new_branch="sync-main-to-main-ee-$(date +%Y%m%d%H%M%S)"
  git checkout main
  git checkout -b $new_branch
  git push origin $new_branch

  # 创建新的 PR
  new_pr=$(gh pr create --base main-ee --head $new_branch \
    --title "Sync main to main-ee (resolved conflicts)" \
    --body "通过脚本自动创建，用于解决代码冲突以及同步 main 变更至 main-ee。  Tips: 请复审人检查冲突原因，并指派相关成员解决冲突。冲突解决并成功合并后，请删除原始分支。")

  # 关闭旧的 PR
  gh pr close $pr_number --comment "Closing due to conflicts. New PR created: $new_pr"
  return 0
}
set -e
trap 'echo "Error occurred. Exiting..."; exit 1' ERR # 捕获错误并退出

# 检查是否已经存在从 main 到 main-ee 的 PR
existing_pr=$(gh pr list --base main-ee --head main --json number --jq '.[0].number')

if [ -z "$existing_pr" ]; then
  # 创建新的 PR
  new_pr=$(gh pr create --base main-ee --head main \
    --title "Sync main to main-ee" \
    --body "通过脚本自动创建，用于同步 main 变更至 main-ee。  Tips: 无需复审，直接合并即可。合并后无需删除原始分支。")

  # 检查 PR 是否成功创建

  # 从 PR URL 中提取 PR 编号
  pr_number=$(echo "$new_pr" | grep -oE '[0-9]+$')

  # 检查是否成功获取 PR 编号
  if [ -z "$pr_number" ]; then
    echo "Failed to extract PR number from: $new_pr"
    exit 1
  else
    echo "Created new PR #$pr_number"
    echo "PR URL: $new_pr"
  fi

  # 获取 PR 检测结束后的合并状态
  merge_status=$(check_pr_status $pr_number 10 10)
  echo "merge_status value: '$merge_status'"

  # 检查新创建的 PR 是否有冲突
  if [ "$merge_status" = "CONFLICTING" ]; then
    create_and_close_conflicting_pr $pr_number || exit 1
  else
    echo "Created new PR #$pr_number without conflicts."
  fi

else
  echo "A PR from main to main-ee already exists (PR #$existing_pr). Checking for conflicts..."

  # 检查是否有冲突
  merge_status=$(check_pr_status $existing_pr 10 10)
  echo "merge_status value: '$merge_status'"

  if [ "$merge_status" = "CONFLICTING" ]; then
    echo "Conflicts detected. Creating new branch and PR..."

    create_and_close_conflicting_pr $existing_pr || exit 1

  else
    echo "Existing PR has no conflicts."
  fi
fi
