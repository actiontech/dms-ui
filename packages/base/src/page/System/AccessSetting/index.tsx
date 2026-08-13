import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { Space, Spin, Typography, message } from 'antd';
import { BasicSwitch, EmptyBox, ResponseCode } from '@actiontech/dms-kit';
import { ActiontechTable } from '@actiontech/dms-kit/es/components/ActiontechTable';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { IAccessWhitelistRuleItem } from '@actiontech/shared/lib/api/base/service/common';
import { PERMISSIONS, usePermission } from '@actiontech/shared/lib/features';
import SystemBasicTitle from '../components/BasicTitle';
import { AccessSettingColumns } from './columns';
import {
  AccessSettingHeaderActions,
  AccessSettingTableActions
} from './actions';
import AccessRuleDrawer from './RuleDrawer';

const AccessSetting = () => {
  const { t } = useTranslation();
  const { parse2TableActionPermissions, checkActionPermission } =
    usePermission();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [drawerOpen, { setTrue: openDrawer, setFalse: closeDrawer }] =
    useBoolean();
  const [switchLoading, { setTrue: startSwitch, setFalse: finishSwitch }] =
    useBoolean();
  const [editingRule, setEditingRule] =
    useState<IAccessWhitelistRuleItem | null>(null);

  const canWrite = checkActionPermission(
    PERMISSIONS.ACTIONS.BASE.SYSTEM.ACCESS_SETTINGS.TOGGLE_RESTRICTION
  );

  const {
    data: accessConfig,
    loading,
    refresh
  } = useRequest(() =>
    Configuration.GetAccessRestriction().then((res) => ({
      enabled: !!res.data?.data?.enabled,
      rules: res.data?.data?.rules ?? []
    }))
  );

  const enabled = !!accessConfig?.enabled;

  const handleToggle = (checked: boolean) => {
    startSwitch();
    Configuration.UpdateAccessRestriction({ enabled: checked })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            checked
              ? t('dmsSystem.accessSettings.enableSuccess')
              : t('dmsSystem.accessSettings.disableSuccess')
          );
        }
      })
      .finally(() => {
        finishSwitch();
        refresh();
      });
  };

  const handleAdd = useCallback(() => {
    setEditingRule(null);
    openDrawer();
  }, [openDrawer]);

  const handleEdit = useCallback(
    (record: IAccessWhitelistRuleItem) => {
      setEditingRule(record);
      openDrawer();
    },
    [openDrawer]
  );

  const handleDelete = useCallback(
    (uid: string) => {
      if (!uid) {
        return;
      }
      const hide = messageApi.loading(t('dmsSystem.accessSettings.deleting'));
      Configuration.DeleteAccessWhitelistRule({ rule_uid: uid })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('dmsSystem.accessSettings.deleteSuccess'));
            refresh();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [messageApi, refresh, t]
  );

  const headerActions = AccessSettingHeaderActions(handleAdd);
  const columns = useMemo(() => AccessSettingColumns(), []);
  const actions = useMemo(
    () =>
      parse2TableActionPermissions(
        AccessSettingTableActions(handleEdit, handleDelete)
      ),
    [parse2TableActionPermissions, handleEdit, handleDelete]
  );

  return (
    <SystemBasicTitle
      title={t('dmsSystem.tabPaneTitle.accessSettings')}
      titleTip={t('dmsSystem.accessSettings.titleTip')}
      titleExtra={headerActions['add-access-rule']}
    >
      {messageContextHolder}
      <Spin spinning={loading || switchLoading}>
        <Space
          direction="vertical"
          size={16}
          style={{ width: '100%', marginBottom: 16 }}
        >
          <Space align="center">
            <Typography.Text>
              {t('dmsSystem.accessSettings.restrictionSwitch')}
            </Typography.Text>
            <BasicSwitch
              checked={enabled}
              loading={switchLoading}
              disabled={!canWrite}
              onChange={canWrite ? handleToggle : undefined}
            />
          </Space>
          <ActiontechTable
            rowKey="uid"
            loading={loading}
            dataSource={accessConfig?.rules}
            columns={columns}
            actions={canWrite ? actions : undefined}
            pagination={false}
            scroll={{}}
          />
        </Space>
      </Spin>
      <EmptyBox if={canWrite}>
        <AccessRuleDrawer
          open={drawerOpen}
          editingRule={editingRule}
          onClose={closeDrawer}
          onSuccess={refresh}
          canWrite={canWrite}
        />
      </EmptyBox>
    </SystemBasicTitle>
  );
};

export default AccessSetting;
