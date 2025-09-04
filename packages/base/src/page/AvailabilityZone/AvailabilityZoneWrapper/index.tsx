import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, Outlet, useParams } from 'react-router-dom';
import { Space } from 'antd';
import { BasicModal, BasicSelect, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { useTypedNavigate } from '@actiontech/shared';
import useRecentlySelectedZone from '../../../hooks/useRecentlySelectedZone';
import { useUserInfo } from '@actiontech/shared/lib/features';
import useRecentlyOpenedProjects from '../../Nav/SideMenu/useRecentlyOpenedProjects';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';

const AvailabilityZoneWrapper: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useTypedNavigate();
  const { projectID } = useParams<{ projectID: string }>();

  const { getRecentlyProjectIdByUserInfo } = useRecentlyOpenedProjects();
  const {
    availabilityZone,
    updateRecentlySelectedZone,
    availabilityZoneOptions
  } = useRecentlySelectedZone();

  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>();

  const { refreshProjectListAsync, getUserInfoLoading } = useUserInfo();

  const [confirmLoading, { setTrue: startConfirm, setFalse: confirmFinish }] =
    useBoolean();

  const isZoneConfigured = !!availabilityZoneOptions?.length;
  const isMemorizedZoneNotInOptions = useMemo(
    () =>
      !availabilityZoneOptions?.some((v) => v.value === availabilityZone?.uid),
    [availabilityZoneOptions, availabilityZone]
  );

  useEffect(() => {
    if (
      (isZoneConfigured && !availabilityZone) ||
      (!!availabilityZone && isMemorizedZoneNotInOptions)
    ) {
      setZoneModalVisible(true);
    }
  }, [availabilityZone, isZoneConfigured, isMemorizedZoneNotInOptions]);

  const onModalCancel = () => {
    navigate(-1);
  };

  const onModalOk = () => {
    startConfirm();
    updateRecentlySelectedZone({
      uid: selectedZone ?? '',
      name:
        availabilityZoneOptions.find((zone) => zone?.value === selectedZone)
          ?.label ?? ''
    });
    refreshProjectListAsync().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        const isProjectInBindProjects = res.data.data?.user_bind_projects?.some(
          (project) => project.project_id === projectID
        );

        const memorizedProjectID = getRecentlyProjectIdByUserInfo(
          res.data.data
        );

        // 当前项目不在用户绑定项目中 并且不存在近期选择项目 则需要去选择项目
        if (!!projectID && !isProjectInBindProjects && !memorizedProjectID) {
          const newPathname = location.pathname.replace(
            /^(\/sqle\/|\/)project\/([^\/]+)\/(.+)$/,
            (_, prefix, projectId, target) => {
              return `${prefix}project//${target}`;
            }
          );
          navigate(`${newPathname}${location.search}`, { replace: true });
        } else if (memorizedProjectID) {
          // 路径中没有默认项目
          if (!projectID) {
            const newPathname = location.pathname.replace(
              /^(\/sqle\/|\/)project\/\/(.+)$/,
              (_, prefix, target) => {
                return `${prefix}project/${memorizedProjectID}/${target}`;
              }
            );
            navigate(`${newPathname}${location.search}`, { replace: true });
          } else {
            // 路径中有默认项目
            // 场景：如果用户没有选择可用区，接口还是会返回改用户在默认ip服务下的绑定项目，导致会有默认项目存在
            // 这是后端的业务逻辑 如果没有给后端传递可用区信息 则默认走当前ip的服务
            // 这时项目下的页面路经就会携带项目id，如果选择其他可用区就会报错，因为可能在其他可用区中用户可能不属于该项目
            const newPathname = location.pathname.replace(
              /^(\/sqle\/|\/)project\/([^\/]+)\/(.+)$/,
              (_, prefix, projectId, target) => {
                return `${prefix}project/${memorizedProjectID}/${target}`;
              }
            );
            navigate(`${newPathname}${location.search}`, { replace: true });
          }
        }
        setZoneModalVisible(false);
        confirmFinish();
      }
    });
  };

  if (isZoneConfigured && isMemorizedZoneNotInOptions) {
    return (
      <BasicModal
        title={t('availabilityZone.wrapper.modalTitle')}
        open={zoneModalVisible}
        footer={
          <Space>
            <BasicButton onClick={onModalCancel} disabled={getUserInfoLoading}>
              {t('common.cancel')}
            </BasicButton>
            <BasicButton
              onClick={onModalOk}
              disabled={!selectedZone}
              loading={getUserInfoLoading}
              type="primary"
            >
              {t('common.ok')}
            </BasicButton>
          </Space>
        }
        closable={false}
      >
        <div>
          <p>{t('availabilityZone.wrapper.modalTips')}</p>
          <BasicSelect
            options={availabilityZoneOptions}
            value={selectedZone}
            onChange={setSelectedZone}
            className="full-width-element"
          />
        </div>
      </BasicModal>
    );
  }

  if (!zoneModalVisible && !confirmLoading && !getUserInfoLoading) {
    return <Outlet />;
  }
};

export default AvailabilityZoneWrapper;
