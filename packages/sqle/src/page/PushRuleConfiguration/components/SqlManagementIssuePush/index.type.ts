import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';

export type SqlManagementIssuePushProps = {
  config?: IReportPushConfigList;
  permission: boolean;
  refetch: () => void;
};

export type SqlManagementIssuePushFields = {
  enabled: boolean;
  minutesInterval: string;
  pushUserList: string[];
};
