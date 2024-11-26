import {
  BasicButton,
  BasicTag,
  EmptyBox,
  BasicTypographyEllipsis
} from '@actiontech/shared';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../data/enum';
import useModalStatus from '../../../../hooks/useModalStatus';
import {
  DatabaseRoleFilteredDBServiceID,
  DatabaseRoleModalStatus,
  DatabaseRoleSelectData
} from '../../../../store/databaseRole';
import DbRoleService from '@actiontech/shared/lib/api/provision/service/db_role';
import { useRecoilState } from 'recoil';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { AccountDetailDrawerStyleWrapper } from '../../../DatabaseAccount/style';
import AccountInfoItem from '../../../DatabaseAccount/components/AccountInfoItem';
import { IDBAccountDataPermission } from '@actiontech/shared/lib/api/provision/service/common';

const RoleDetail: React.FC = () => {
  const { t } = useTranslation();
  const { toggleModal, visible } = useModalStatus(
    DatabaseRoleModalStatus,
    ModalName.DatabaseRoleDetailModal
  );
  const { projectID } = useCurrentProject();

  const [selectData, updateSelectData] = useRecoilState(DatabaseRoleSelectData);
  const [filteredByDBServiceID] = useRecoilState(
    DatabaseRoleFilteredDBServiceID
  );

  const {
    data: dbRoleDetailInfo,
    loading: getDBRoleDetailInfoPending,
    mutate: updateDBRoleDetailInfo
  } = useRequest(
    () =>
      DbRoleService.AuthDBRoleDetail({
        project_uid: projectID,
        db_role_uid: selectData?.db_role?.uid ?? '',
        db_service_uid: filteredByDBServiceID ?? ''
      }).then((res) => res.data.data),
    {
      ready: !!selectData?.db_role?.uid && visible && !!filteredByDBServiceID
    }
  );

  const onClose = () => {
    toggleModal(ModalName.DatabaseRoleDetailModal, false);
    updateSelectData(null);
    updateDBRoleDetailInfo(undefined);
  };

  const generatePermissionLabel = (permission: IDBAccountDataPermission) => {
    if (permission.data_objects) {
      return `${permission.data_operations
        ?.map((v) => v.name)
        .join(',')} ON ${permission.data_objects.map((v) => v.name).join(',')}`;
    }

    return permission.data_operations?.map((v) => v.name).join(',');
  };

  return (
    <AccountDetailDrawerStyleWrapper
      size="large"
      open={visible}
      placement="right"
      title={t('databaseRole.roleDetail.title')}
      onClose={onClose}
      footer={<BasicButton onClick={onClose}>{t('common.close')}</BasicButton>}
    >
      <Spin spinning={getDBRoleDetailInfoPending} delay={300}>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('databaseRole.roleDetail.roleAndPermissionInfo')}
          </div>
          <div className="audit-card">
            <AccountInfoItem label={t('databaseAccount.detail.role')}>
              {dbRoleDetailInfo?.child_roles?.map((role) => (
                <BasicTag key={role.uid} style={{ maxWidth: 190 }}>
                  <BasicTypographyEllipsis
                    copyable={false}
                    tooltipsMaxWidth={220}
                    textCont={role.name ?? ''}
                  />
                </BasicTag>
              ))}
            </AccountInfoItem>
            <AccountInfoItem label={t('databaseAccount.detail.permission')}>
              {dbRoleDetailInfo?.data_permissions?.map((item, index) => {
                return (
                  <EmptyBox
                    key={index}
                    if={
                      !!item &&
                      item.data_operations &&
                      item.data_operations.length > 0
                    }
                  >
                    <BasicTag style={{ maxWidth: 190 }}>
                      <BasicTypographyEllipsis
                        copyable={false}
                        tooltipsMaxWidth={220}
                        textCont={generatePermissionLabel(item) ?? ''}
                      />
                    </BasicTag>
                  </EmptyBox>
                );
              }) ?? '-'}
            </AccountInfoItem>
          </div>
        </div>
      </Spin>
    </AccountDetailDrawerStyleWrapper>
  );
};

export default RoleDetail;
