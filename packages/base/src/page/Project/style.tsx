import { styled } from '@mui/material/styles';

export const ImportProjectUploadFileFieldWrapper = styled('div')`
  & .ant-btn-link.ant-btn-link {
    height: 32px;
    line-height: 32px;
    position: absolute;
    left: 120px;
    top: 0;
    padding: 0;
  }
`;

export const ImportProjectUploadFileWrapper = styled('div')`
  & .fix-header-padding {
    padding-top: 60px;
    padding-bottom: 80px;
  }

  & .ellipsis-column-small-width {
    max-width: 160px;

    .ant-typography-copy {
      visibility: hidden;
    }
  }
`;
