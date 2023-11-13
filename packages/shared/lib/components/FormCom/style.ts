import { styled } from '@mui/material/styles';
import { Form } from 'antd';

export const formItemLayout = {
  spaceBetween: {
    labelCol: { span: 11 },
    wrapperCol: { span: 11, push: 2 }
  },
  fullLine: {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
  }
};

export const FormStyleWrapper = styled(Form)`
  &.ant-form {
    padding-bottom: 80px !important;
  }

  &.ant-form.hasTopHeader {
    padding-top: 60px;
  }

  &.ant-form.hasTopGap {
    padding-top: 24px;
  }

  &.ant-form.clearPaddingBottom {
    padding-bottom: 0 !important;
  }
`;

export const FormAreaLineStyleWrapper = styled('section')`
  &.has-border::after {
    content: '';
    display: block;
    width: 100%;
    margin: 40px 0 24px;
    border-bottom: 1px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  }
`;

export const FormAreaBlockStyleWrapper = styled('section')`
  width: 720px;
  margin: 0 auto;
`;
