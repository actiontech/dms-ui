import { styled } from '@mui/material';
import MDEditor from '@uiw/react-md-editor';

export const RewrittenSuggestionDetailsStyleWrapper = styled('div')`
  border: 1px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorBorderSecondary};
  border-top: none;
  border-radius: 0 0 6px 6px;
  margin-bottom: 18px;
  overflow: hidden;
  background: transparent;
  padding: 16px 20px;

  .action-items-wrapper {
    display: flex;
    align-items: center;
    justify-content: end;
    margin-bottom: 12px;

    .toggle-button-wrapper {
      margin-left: 12px;
    }
  }
`;

export const OptimizationDescriptionStyleWrapper = styled('div')`
  border-left: 3px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorSuccess};
  padding: 12px 16px;
  margin: 12px 0;
  border-radius: 0 6px 6px 0;
  box-shadow: 0 2px 4px
    ${({ theme }) => theme.sharedTheme.basic.colorShadowByWhite};
  background-color: ${({ theme }) =>
    theme.sharedTheme.uiToken.colorSuccessBgHover};

  .description-content {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase} !important;
    font-size: 14px;
    line-height: 1.6;
    background-color: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorSuccessBgHover};
  }

  .sql-analyze-link {
    display: block;
    font-size: 14px;
    line-height: 1.6;
    margin-top: 12px;
  }
`;

export const OptimizationSummaryStyleWrapper = styled('ul')`
  margin: 0;

  li {
    opacity: 1 !important;
    vertical-align: baseline;
    transition: all 0.1s ease;
    line-height: 30px;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase} !important;

    &::marker {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
      font-size: 16px;
    }
  }
`;

export const MarkdownPreviewModeStyleWrapper = styled(MDEditor.Markdown)`
  &.wmde-markdown {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase} !important;
    background-color: transparent;
    font-size: 14px;
    line-height: 22px;

    &::before {
      content: none;
    }

    li {
      opacity: 1 !important;
      vertical-align: baseline;
      transition: all 0.1s ease;
      line-height: 30px;

      &::marker {
        color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextBase};
        font-size: 16px;
      }

      p {
        margin: 0;
      }
    }
  }
`;

export const OptimizationRuleItemStyleWrapper = styled('div')<{
  isActive?: boolean;
  hiddenArrow?: boolean;
}>`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: ${({ isActive }) => (isActive ? '0' : '16px')};
  background: ${({ isActive, theme }) =>
    isActive ? theme.sharedTheme.basic.colorPrimaryBgHover : 'white'};
  border-radius: 6px 6px ${({ isActive }) => (isActive ? '0 0' : '6px 6px')};
  box-shadow: ${({ isActive, theme }) =>
    isActive
      ? 'none'
      : `0 2px 4px  ${theme.sharedTheme.basic.colorShadowByWhite};`};
  border-left: 3px solid
    ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 8px
      ${({ theme }) => theme.sharedTheme.basic.colorShadowByWhite};
  }

  .rule-name {
    flex: 1;
    font-size: 14px;
    margin-left: 12px;
    font-weight: ${({ isActive }) => (isActive ? '500' : 'normal')};

    &:hover {
      color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    }
  }

  &::after {
    opacity: ${({ hiddenArrow }) => (hiddenArrow ? 0 : 1)};
    content: '';
    width: 8px;
    height: 8px;
    border-right: 2px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    border-bottom: 2px solid
      ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    transform: rotate(${({ isActive }) => (isActive ? '225deg' : '45deg')});
    transition: transform 0.3s ease;
    margin-left: 12px;
  }
`;
