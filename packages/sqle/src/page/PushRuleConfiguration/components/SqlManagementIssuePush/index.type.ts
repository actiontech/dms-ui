import { IReportPushConfigList } from '@actiontech/shared/lib/api/sqle/service/common';

export type SqlManagementIssuePushProps = {
  config?: IReportPushConfigList;
  refetch: () => void;
};

export type SqlManagementIssuePushFields = {
  enabled: boolean;
  minutesInterval: string;
  pushUserList: string[];
};
