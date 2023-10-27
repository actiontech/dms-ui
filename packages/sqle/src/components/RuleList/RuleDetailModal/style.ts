import { styled } from '@mui/material/styles';
import { Button } from 'antd5';
import { ANTD_PREFIX_STR } from '@actiontech/shared/lib/data/common';

export const RuleDetailItemStyleWrapper = styled('section')`
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  font-size: 13px;
  padding-top: 8px;
  padding-bottom: 24px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
`;

export const RuleDetailKnowledgeLinkStyleWrapper = styled(Button)`
  &.${ANTD_PREFIX_STR}-btn.${ANTD_PREFIX_STR}-btn-sm.${ANTD_PREFIX_STR}-btn-link {
    padding: 0;
  }
`;
