import { styled } from '@mui/material';

export const MobileCardListStyleWrapper = styled('div')`
  padding: 1rem;

  .overview-list-item {
    padding: 0 !important;
    margin-bottom: 0.75rem;
  }

  .overview-card {
    width: 100%;
    cursor: pointer;
  }

  .overview-card .ant-card-body {
    padding: 0.75rem !important;
  }

  .overview-card-title {
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorPrimary};
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .overview-card-desc .ant-descriptions-item-label {
    font-size: 0.75rem;
    width: 40%;
    padding-right: 0.5rem;
  }

  .overview-card-desc .ant-descriptions-item-content {
    font-size: 0.75rem;
  }

  .overview-card-actions {
    margin-top: 0.75rem;
    width: 100%;
  }

  .ant-descriptions-item-label {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorTextSecondary};
    font-weight: 500;
  }

  .ant-descriptions-item-content {
    color: ${({ theme }) => theme.sharedTheme.uiToken.colorText};
  }
`;
