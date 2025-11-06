import { useCurrentUser } from '@actiontech/shared/lib/features';
import {
  GetUserSystemEnum,
  UpdateCurrentUserSystemEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import { updateSystemPreference } from '../../../store/user';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import useRecentlySelectedZone from '../../../hooks/useRecentlySelectedZone';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const UserGuideModal: React.FC = () => {
  const { systemPreference } = useCurrentUser();

  const dispatch = useDispatch();

  const availabilityZoneTips = useSelector(
    (state: IReduxState) => state.availabilityZone.availabilityZoneTips
  );

  const { availabilityZone, updateRecentlySelectedZone } =
    useRecentlySelectedZone();

  useRequest(
    () => {
      return DmsApi.CloudBeaverService.GetSQLQueryConfiguration().then(
        (res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }
      );
    },
    {
      onSuccess: (res) => {
        let url = '';

        if (res?.enable_sql_query && res.sql_query_root_uri) {
          url = res.sql_query_root_uri;
        } else if (res?.enable_odc_query && res.odc_query_root_uri) {
          url = res.odc_query_root_uri;
        }

        if (url && url !== location.pathname) {
          // 如果当前设置了可用区 并且没有最近选择的可用区记录 则设置一个默认的可用区
          if (!!availabilityZoneTips.length && !availabilityZone) {
            updateRecentlySelectedZone(availabilityZoneTips[0]);
          }
          // res.sql_query_root_uri !== location.pathname 防止无限刷新
          // 因为sql_query_root_uri是不携带origin的，只有pathname。所以开发环境localhost不可以直接跳转到CB
          // #if [PROD]
          window.location.href = url;
          // #endif
        }
      },
      ready: systemPreference === GetUserSystemEnum.WORKBENCH
    }
  );

  useRequest(
    () =>
      DmsApi.UserService.UpdateCurrentUser({
        current_user: {
          system: UpdateCurrentUserSystemEnum.MANAGEMENT
        }
      }),
    {
      ready: !systemPreference,
      onSuccess: () => {
        dispatch(
          updateSystemPreference({
            systemPreference: GetUserSystemEnum.MANAGEMENT
          })
        );
      }
    }
  );

  return null;

  // return (
  //   <BasicModal
  //     title={t('dmsMenu.userGuide.title')}
  //     open={!systemPreference}
  //     footer={null}
  //     centered
  //     closable={false}
  //   >
  //     <UserGuideContent
  //       system={system}
  //       onSystemChange={(e) => setSystem(e.target.value)}
  //       onConfirm={updateCurrentUserSystem}
  //       loading={updateCurrentUserSystemLoading || openCloudBeaverLoading}
  //     />
  //     <Typography.Text type="secondary">
  //       {t('dmsMenu.userGuide.description')}
  //     </Typography.Text>
  //     <UserGuideModalButtonContainer>
  //       <BasicButton
  //         type="primary"
  //         size="large"
  //         onClick={updateCurrentUserSystem}
  //         className="primary-button"
  //         loading={updateCurrentUserSystemLoading || openCloudBeaverLoading}
  //       >
  //         {t('dmsMenu.userGuide.confirmButton')}
  //       </BasicButton>
  //     </UserGuideModalButtonContainer>
  //   </BasicModal>
  // );
};

export default UserGuideModal;
