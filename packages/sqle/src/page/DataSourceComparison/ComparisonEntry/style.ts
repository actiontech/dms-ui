import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { styled } from '@mui/material/styles';
import { Form, Space } from 'antd';

export const ComparisonEntryStyleWrapper = styled('div')`
  width: 820px;
  margin: 0 auto;
  padding: 24px 0;

  .environment-section-wrapper {
    display: flex;
    flex: 1;
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
  }
`;
