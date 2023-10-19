import { styled } from '@mui/material/styles';

export const CommonIconStyleWrapper = styled('span')`
  display: inline-block;
  color: inherit;
  font-style: normal;
  line-height: 0;
  text-align: center;
  text-transform: none;
  vertical-align: -0.125em;
  text-rendering: optimizelegibility;
  -webkit-font-smoothing: antialiased;

  svg {
    display: inline-block;
  }

  * {
    line-height: 1;
  }

  &.custom-icon-spin-dot {
    position: absolute;
    top: 50%;
    inset-inline-start: 50%;
    margin: -10px;
  }
`;
