import { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Empty, Spin } from 'antd';
import { BasicDrawer } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import RemediationDiffCompare from './RemediationDiffCompare';

export const REMEDIATION_DETAIL_DRAWER_WIDTH = 960;

export type RemediationDetailDrawerProps = {
  open: boolean;
  onClose: () => void;
  sqlManageId?: string | number;
  title?: ReactNode;
  width?: number;
};

const RemediationDetailDrawer = ({
  open,
  onClose,
  sqlManageId,
  title = null,
  width = REMEDIATION_DETAIL_DRAWER_WIDTH
}: RemediationDetailDrawerProps) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();

  const {
    data: remediationDetail,
    loading,
    error,
    run,
    mutate
  } = useRequest(
    (id: string) =>
      SqlManage.GetSqlManageRemediationV1({
        project_name: projectName,
        sql_manage_id: id
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
        throw new Error(
          res.data?.message ?? t('sqlManagement.remediationCompare.loadFailed')
        );
      }),
    {
      manual: true
    }
  );

  useEffect(() => {
    if (open && sqlManageId) {
      run(sqlManageId.toString());
    }
    if (!open) {
      mutate(undefined);
    }
  }, [mutate, open, run, sqlManageId]);

  return (
    <BasicDrawer
      open={open}
      title={title}
      showClosedIcon
      onClose={onClose}
      width={width}
      maskClosable
      destroyOnClose
    >
      <Spin spinning={loading}>
        {error ? (
          <Alert
            type="error"
            showIcon
            message={t('sqlManagement.remediationCompare.loadFailed')}
          />
        ) : remediationDetail ? (
          <RemediationDiffCompare data={remediationDetail} />
        ) : (
          <Empty />
        )}
      </Spin>
    </BasicDrawer>
  );
};

export default RemediationDetailDrawer;
