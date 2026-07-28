/**
 * 进度区展示用：空/缺省 reason → 「未填写」文案；有内容返回 trim 后全文。
 * 仅 UI 映射，不写入请求。
 */
export const formatApprovalComment = (
  reason: string | undefined | null,
  notFilledText: string
): string => {
  if (!reason || reason.trim() === '') {
    return notFilledText;
  }
  return reason;
};
