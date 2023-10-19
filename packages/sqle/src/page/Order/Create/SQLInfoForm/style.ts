import { FormStyleWrapper } from '@actiontech/shared/lib/components/FormCom/style';
import { styled } from '@mui/material/styles';

export const SQLInfoFormStyleWrapper = styled(FormStyleWrapper)`
  .custom-icon-ellipse {
    display: none;
  }

  .data-source-row-select {
    width: 300px !important;
  }

  .data-source-row-divider {
    height: 36px !important;
    margin: 0 !important;
  }

  .data-source-row-button {
    height: 36px !important;
    width: 36px !important;
  }

  .data-source-col-delete-button {
    width: 35px !important;
  }
`;
