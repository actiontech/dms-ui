import { styled } from '@mui/material/styles';

export const SensitiveDisplayWrapper = styled(`span`)`
  display: flex;
  align-items: center;
`;

export const DisplayToggleWrapper = styled(`span`)`
  &.rect-border-wrapper {
    display: inline-block;
    height: 26px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: ${({ theme }) => theme.sharedTheme.uiToken.colorBgBase};
    position: relative;
    z-index: 1;
    margin-right: 8px;

    &::before,
    &::after {
      width: 100%;
      height: 8px;
      border: 1px solid
        ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
      content: '';
      position: absolute;
      z-index: 2;
      left: 0;
    }

    &::before {
      border-radius: 4px 4px 0 0;
      border-bottom: 0;
      top: 0;
    }

    &::after {
      border-radius: 0 0 4px 4px;
      border-top: 0;
      bottom: 0;
    }
  }
`;
