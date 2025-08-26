import { CommonIconStyleWrapper } from '@actiontech/dms-kit';
import { styled } from '@mui/material/styles';
import { Form, Space } from 'antd';
import { Card } from 'antd';

export const ComparisonEntryStyleWrapper = styled('div')`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 0;
  display: flex;
  flex-direction: column;

  .environment-section-wrapper {
    display: flex;
    flex: 1;
  }
`;

export const ComparisonCardStyleWrapper = styled(Card)`
  &.ant-card {
    margin-bottom: 24px !important;
    box-shadow: ${({ theme }) =>
      theme.sqleTheme.dataSourceComparison.comparisonEntry.card
        .boxShadow} !important;

    &:last-of-type {
      margin-bottom: 0 !important;
    }

    .ant-card-head {
      border-bottom: 1px solid
        ${({ theme }) =>
          theme.sqleTheme.dataSourceComparison.comparisonEntry.card
            .borderColor};
      min-height: 48px;
    }

    .ant-card-body {
      padding: 24px;
    }
  }
`;

export const ComparisonSelectorFormStyleWrapper = styled(Form)`
  display: flex;
  flex: 1;
`;

export const ComparisonActionStyleWrapper = styled(Space)`
  width: 100%;
  justify-content: end;
  margin: 18px 0;
`;

export const DatabaseSelectorTitleStyleWrapper = styled(CommonIconStyleWrapper)`
  height: 100%;
  display: flex;
  align-items: center;

  svg {
    min-width: 18px;
  }

  .content {
    margin-left: 4px;
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-word;
    line-height: 16px;
  }
`;

export const TimeInfo = styled('div')`
  display: flex;
  margin: 10px 0;
  color: ${({ theme }) =>
    theme.sqleTheme.dataSourceComparison.comparisonEntry.timeInfo.color};
  font-size: 14px;
  text-align: right;

  & > div:first-of-type {
    margin-right: 16px;
  }
`;
