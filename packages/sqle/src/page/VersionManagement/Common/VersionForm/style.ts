import { styled } from '@mui/material/styles';
import { FormAreaBlockStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';

export const VersionFormAreaBlockStyleWrapper = styled(
  FormAreaBlockStyleWrapper
)`
  width: 1000px;
`;

export const VersionDeploymentConfStyleWrapper = styled('section')`
  .no-required-style .ant-form-item-label {
    height: 40px;
  }

  .no-required-style .ant-form-item-required {
    &::after {
      display: none;
    }
  }

  .stage-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 12px 0;
  }

  .add-stage-btn {
    width: 100%;
  }

  .add-instance-btn {
    .ant-btn-icon {
      padding: 3px 0 0 3px;
    }
  }

  .instance-col {
    position: relative;

    .remove-instance-btn {
      position: absolute;
      right: 0;
      top: 8px;
      height: 16px;
      cursor: pointer;
    }
  }
`;
