import { Row } from 'antd5';
import { BasicButton } from '../';
import { ANTD_PREFIX_STR } from '../data/common';
import { styled } from '@mui/material/styles';

/**
 * 使用介绍: packages/sqle/src/page/AuditPlan/PlanList/TableTaskTypeFilter/index.tsx
 */
export const FilterButtonStyleWrapper = styled(BasicButton)`
  &.${ANTD_PREFIX_STR}-btn-default.basic-button-wrapper.filter-btn {
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorFillTertiary};
    border-color: ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};

    span,
    .number-tag {
      font-style: normal;
      font-weight: 400;
    }

    span {
      font-size: 13px !important;
    }

    .number-tag {
      display: inline-block;
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillSecondary};
      padding: 0 3px;
      border-radius: 3px;
      line-height: 18px;
      margin-left: 4px;
      font-size: 12px;
    }

    &:hover,
    &.checked-item {
      background-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgActive};
      border-color: ${({ theme }) =>
        theme.sharedTheme.basic.colorPrimaryBgActive};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};

      .number-tag {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
        background-color: ${({ theme }) =>
          theme.sharedTheme.basic.colorPrimaryBgHover};
      }
    }

    &:disabled {
      background-color: ${({ theme }) =>
        theme.sharedTheme.uiToken.colorFillTertiary};
      border-color: ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};

      .number-tag {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextQuaternary};
        background-color: ${({ theme }) =>
          theme.sharedTheme.uiToken.colorFillSecondary};
      }
    }
  }
`;

export const FilterButtonLabelStyleWrapper = styled('span')`
  border-radius: 4px;
  font-size: 13px !important;
  height: 28px;
  line-height: 28px;
  text-align: left;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  margin-right: 10px;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
`;

export const PageLayoutHasFixedHeaderStyleWrapper = styled('section')`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const SegmentedRowStyleWrapper = styled(Row)`
  padding: 14px 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
`;

export const RuleStatusWrapperStyleWrapper = styled('div')`
  padding-right: 40px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
`;

export const PopconfirmMessageStyleWrapper = styled('span')`
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
`;
