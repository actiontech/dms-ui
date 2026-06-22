import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Empty, Spin } from 'antd';
import { BasicDrawer } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useRequest } from 'ahooks';
import { ModalName } from '../../../../../../data/ModalName';
import RemediationCompare from '../../../../../SqlAnalyze/SqlManage/RemediationCompare';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';

const RemediationDetailDrawer = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();

  const {
    open: visible,
    selectSqlManagement: selectedData,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.View_Remediation_Detail_Drawer);

  const closeModal = () => {
    updateModalStatus(ModalName.View_Remediation_Detail_Drawer, false);
    setSelectData(null);
  };

  const {
    data: remediationDetail,
    loading,
    error,
    run,
    mutate
  } = useRequest(
    (sqlManageId: string) =>
      SqlManage.GetSqlManageRemediationV1({
        project_name: projectName,
        sql_manage_id: sqlManageId
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
        return undefined;
      }),
    {
      manual: true
    }
  );

  useEffect(() => {
    if (visible && selectedData?.id) {
      run(selectedData.id.toString());
    }
    if (!visible) {
      mutate(undefined);
    }
  }, [mutate, run, selectedData?.id, visible]);

  return (
    <BasicDrawer
      open={visible}
      title={t('sqlManagement.remediationCompare.drawerTitle')}
      showClosedIcon
      onClose={closeModal}
      size="large"
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
          <RemediationCompare data={remediationDetail} />
        ) : (
          <Empty />
        )}
      </Spin>
    </BasicDrawer>
  );
};

export default RemediationDetailDrawer;
