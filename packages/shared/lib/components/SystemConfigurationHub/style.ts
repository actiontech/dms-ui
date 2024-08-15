import { styled } from '@mui/material/styles';
import { Descriptions } from 'antd';

export const SystemConfigFormStyleWrapper = styled('section')`
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

  .ant-form {
    .switch-field-wrapper {
      padding: 32px 0;

      .ant-form-item {
        margin-bottom: 0;
      }
    }

    > .ant-form-item {
      margin-bottom: 32px;
    }

    .ant-form-item-control-input-content {
      display: flex;
      justify-content: end;
    }

    .config-field-wrapper {
      padding: 32px 0;
      border-top: 1px solid
        ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
    }
  }
`;

export const SystemConfigReadonlyModeStyleWrapper = styled(Descriptions)`
  &.system-config-view-wrapper {
    padding: 24px 0 8px !important;
    border-top: 1px solid
      ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};

    .ant-descriptions-item-container {
      height: 20px;

      .ant-descriptions-item-label {
        width: 240px;
      }
    }
  }
`;
