import { styled } from '@mui/material/styles';
import { Space } from 'antd';
import { BasicDrawer } from '@actiontech/shared';

export const PipelineConfigurationDefaultPromptsWrapper = styled(Space)`
  width: 100%;
  margin-top: 32px;

  .step-wrap {
    width: 1000px;
    margin-top: 32px;
    padding: 24px;
    border: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const PipelineNodeListStyleWrapper = styled('section')`
  & .ant-table-wrapper.actiontech-table-namespace {
    padding-bottom: 0 !important;
  }

  & .ant-space.sub-title {
    display: flex;
    justify-content: space-between;
  }
`;

export const PipelineNodeModalStyleWrapper = styled(BasicDrawer)`
  &
    .ant-form
    .ant-form-item.has-label-tip
    .ant-form-item-row
    .ant-form-item-required::after {
    display: none !important;
  }
`;
