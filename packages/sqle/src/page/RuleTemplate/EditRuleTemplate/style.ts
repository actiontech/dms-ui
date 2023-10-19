import { styled } from '@mui/material/styles';

export const RuleTemplateFormStyleWrapper = styled('section')`
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextTertiary};
  font-size: 13px;
  padding-top: 8px;
  padding-bottom: 24px;
  border-bottom: 1px solid
    ${({ theme }) => theme.sharedTheme.basic.colorGrayLine};
`;
