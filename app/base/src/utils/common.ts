import { ICheckDBServiceIsConnectableReplyItem } from '@actiontech/shared/lib/api/base/service/common';

export const getDbServiceIsConnectbale = (
  connectableInfos: ICheckDBServiceIsConnectableReplyItem[]
) => {
  return connectableInfos.every((connection) => !!connection?.is_connectable);
};

export const getDBServiceConnectableErrorMessage = (
  connectableInfos: ICheckDBServiceIsConnectableReplyItem[]
) => {
  return connectableInfos.reduce(
    (acc, cur, curIndex) =>
      !!cur?.is_connectable
        ? acc
        : acc +
          `${cur.component}: ${cur?.connect_error_message?.replace(
            /\n$/,
            ''
          )} ${curIndex < connectableInfos.length - 1 ? '\n\r' : ''}`,
    ''
  );
};
