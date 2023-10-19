import { styled } from '@mui/material/styles';
import { Form } from 'antd5';
import { ANTD_PREFIX_STR } from '../../../data/common';
import BasicInput from '../../BasicInput';

export const FormItemNoLabelStyleWrapper = styled(Form.Item)`
  .${ANTD_PREFIX_STR}-row {
    .${ANTD_PREFIX_STR}-col:nth-of-type(1) {
      label {
        display: none;
      }
    }
  }
`;

export const FormInputBotBorderStyleWrapper = styled(BasicInput)`
  &.${ANTD_PREFIX_STR}-input {
    border-top: 0 !important;
    border-left: 0 !important;
    border-right: 0 !important;
    padding: 12px 0 !important;
    border-radius: 0 !important;
    font-size: 18px !important;
    line-height: 18px !important;
    font-weight: 700 !important;
    box-shadow: none !important;

    &:focus {
      box-shadow: none !important;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:focus {
      box-shadow: 0 0 0 1000px
        ${({ theme }) => theme.sharedTheme.uiToken.colorFillQuaternary} inset !important;
      background-color: transparent !important;
    }
  }
`;

export const FormItemLabelStyleWrapper = styled(Form.Item)`
  label {
    font-weight: 500;
  }

  &.has-required-style {
    label {
      &::before {
        position: absolute;
        right: 0;
      }
    }
  }

  &.has-label-tip {
    label {
      height: auto !important;

      .label-cont-custom {
        width: 100%;

        .tip-content-box {
          font-size: 12px;
          line-height: 20px;
          color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
          font-weight: 300;
          margin-top: 0.5em;
          overflow-wrap: break-word;
          word-break: break-all;
          word-wrap: break-word;
          white-space: normal;
        }
      }
    }
  }

  &.has-required-style.has-label-tip {
    label {
      &::before {
        content: '' !important;
      }

      .label-cont-custom {
        > div:nth-of-type(1) {
          &::after {
            content: '*';
            color: ${({ theme }) => theme.sharedTheme.uiToken.colorError};
            margin-left: 3px;
          }
        }
      }
    }
  }
`;
