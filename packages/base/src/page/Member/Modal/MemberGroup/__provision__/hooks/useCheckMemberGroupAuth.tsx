import {
  BasicTag,
  BasicToolTip,
  EmptyBox,
  paramsSerializer,
  TypedLink
} from '@actiontech/shared';
import { ProvisionApi } from '@actiontech/shared/lib/api';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useBoolean } from 'ahooks';
import { Modal, Typography, Alert, Divider, Space } from 'antd';
import { accountNameRender } from 'provision/src/page/DatabaseAccount/index.utils';
import { useTranslation } from 'react-i18next';
import { CheckMemberGroupAuthErrorMessageStyleWrapper } from './style';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { IListDBAccount } from '@actiontech/shared/lib/api/provision/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';

interface ICheckMemberGroupParams {
  userUids: string[];
  memberGroupUid: string;
  memberGroupName: string;
}

interface IUserAuthInfo {
  accountUid: string;
  serviceName: string;
  accountInfo: string;
  authType: 'direct' | 'group';
  groupName?: string;
}

interface IAuthConflictInfo {
  userUid: string;
  userName: string;
  currentAuths: IUserAuthInfo[];
  conflictAuths: IUserAuthInfo[];
}

const useCheckMemberGroupAuth = () => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const [modal, contextHolder] = Modal.useModal();
  const [loading, { setTrue: startLoading, setFalse: endLoading }] =
    useBoolean();

  const checkMemberGroupAuth = async (
    params: ICheckMemberGroupParams
  ): Promise<boolean> => {
    const { userUids, memberGroupUid, memberGroupName } = params;

    startLoading();
    let dbAccountListWithFilterUsers: IListDBAccount[] = [];
    let dbAccountListWithFilterUserGroup: IListDBAccount[] = [];

    const [usersResponse, groupResponse] = await Promise.all([
      ProvisionApi.DbAccountService.AuthListDBAccount(
        {
          page_size: 9999,
          page_index: 1,
          project_uid: projectID,
          filter_by_users: userUids
        },
        {
          paramsSerializer
        }
      ),
      ProvisionApi.DbAccountService.AuthListDBAccount({
        page_size: 9999,
        page_index: 1,
        project_uid: projectID,
        filter_by_user_group: memberGroupUid
      })
    ]).finally(() => {
      endLoading();
    });

    if (
      usersResponse.data.code !== ResponseCode.SUCCESS ||
      groupResponse.data.code !== ResponseCode.SUCCESS
    ) {
      return false;
    }

    dbAccountListWithFilterUsers = usersResponse.data.data || [];
    dbAccountListWithFilterUserGroup = groupResponse.data.data || [];

    const authConflicts: IAuthConflictInfo[] = [];
    const userAuthMap = new Map<string, Map<string, IUserAuthInfo[]>>();
    const groupAuthMap = new Map<string, IUserAuthInfo[]>();

    dbAccountListWithFilterUsers?.forEach((account) => {
      if (!account.db_service?.uid || !account.db_account_uid) return;

      const serviceUid = account.db_service.uid;
      const serviceName = account.db_service.name!;
      const accountUid = account.db_account_uid!;
      const accountInfo = accountNameRender(account.account_info!);

      account.auth_users?.forEach((user) => {
        if (userUids.includes(user.uid!)) {
          if (!userAuthMap.has(user.uid!)) {
            userAuthMap.set(user.uid!, new Map());
          }
          const serviceMap = userAuthMap.get(user.uid!)!;
          if (!serviceMap.has(serviceUid)) {
            serviceMap.set(serviceUid, []);
          }
          serviceMap.get(serviceUid)!.push({
            accountUid,
            serviceName,
            accountInfo,
            authType: 'direct'
          });
        }
      });

      account.auth_user_groups?.forEach((group) => {
        group.auth_users?.forEach((user) => {
          if (userUids.includes(user.uid!)) {
            if (!userAuthMap.has(user.uid!)) {
              userAuthMap.set(user.uid!, new Map());
            }
            const serviceMap = userAuthMap.get(user.uid!)!;
            if (!serviceMap.has(serviceUid)) {
              serviceMap.set(serviceUid, []);
            }
            serviceMap.get(serviceUid)!.push({
              accountUid,
              serviceName,
              accountInfo,
              authType: 'group',
              groupName: group.name
            });
          }
        });
      });
    });

    dbAccountListWithFilterUserGroup?.forEach((account) => {
      if (!account.db_service?.uid || !account.db_account_uid) return;

      const serviceUid = account.db_service.uid;
      const serviceName = account.db_service.name!;
      const accountUid = account.db_account_uid!;
      const accountInfo = accountNameRender(account.account_info!);

      if (!groupAuthMap.has(serviceUid)) {
        groupAuthMap.set(serviceUid, []);
      }
      groupAuthMap.get(serviceUid)!.push({
        accountUid,
        serviceName,
        accountInfo,
        authType: 'group',
        groupName: memberGroupName
      });
    });

    // 检查每个用户的授权冲突
    userAuthMap.forEach((serviceMap, userUid) => {
      const currentAuths: IUserAuthInfo[] = [];
      const conflictAuths: IUserAuthInfo[] = [];

      // 收集用户当前的所有授权
      serviceMap.forEach((auths) => {
        currentAuths.push(...auths);
      });

      // 检查与目标成员组授权的冲突
      serviceMap.forEach((_, serviceUid) => {
        const groupAuths = groupAuthMap.get(serviceUid) || [];
        if (groupAuths.length > 0) {
          conflictAuths.push(...groupAuths);
        }
      });

      if (conflictAuths.length > 0) {
        const userName =
          dbAccountListWithFilterUsers
            ?.flatMap((account) => [
              ...(account.auth_users || []),
              ...(account.auth_user_groups || []).flatMap(
                (group) => group.auth_users || []
              )
            ])
            ?.find((user) => user.uid === userUid)?.name || userUid;

        authConflicts.push({
          userUid,
          userName,
          currentAuths,
          conflictAuths
        });
      }
    });

    if (authConflicts.length > 0) {
      modal.error({
        title: t('provisionMember.checkMemberGroupAuth.errorTitle'),
        content: (
          <CheckMemberGroupAuthErrorMessageStyleWrapper>
            <Alert
              className="auth-conflict-alert"
              type="warning"
              message={t(
                'provisionMember.checkMemberGroupAuth.securityAlertDesc'
              )}
            />
            {authConflicts.map((conflict, conflictIndex) => {
              const directAuths = conflict.currentAuths.filter(
                (auth) => auth.authType === 'direct'
              );
              const groupAuths = conflict.currentAuths.filter(
                (auth) => auth.authType === 'group'
              );

              return (
                <div key={conflict.userName} className="auth-conflict-user">
                  <Typography.Text>
                    {t(
                      'provisionMember.checkMemberGroupAuth.userConflictTips1'
                    )}
                  </Typography.Text>
                  <BasicToolTip
                    title={t(
                      'provisionMember.checkMemberGroupAuth.viewCurrentUserAuthDetail'
                    )}
                  >
                    <TypedLink
                      to={ROUTE_PATHS.PROVISION.DATABASE_ACCOUNT.index}
                      params={{
                        projectID
                      }}
                      queries={{
                        user_uid: conflict.userUid
                      }}
                      target="_blank"
                    >
                      {conflict.userName}
                    </TypedLink>
                  </BasicToolTip>
                  <Typography.Text>
                    {t(
                      'provisionMember.checkMemberGroupAuth.userConflictTips2'
                    )}
                  </Typography.Text>

                  <EmptyBox if={directAuths.length > 0}>
                    <div className="auth-conflict-section">
                      <div className="auth-conflict-title">
                        {t(
                          'provisionMember.checkMemberGroupAuth.currentDirectAuth'
                        )}
                      </div>
                      <Space wrap>
                        {directAuths.map((auth) => (
                          <BasicTag
                            size="large"
                            key={auth.accountUid}
                            color="blue"
                          >
                            {auth.serviceName} / {auth.accountInfo}
                          </BasicTag>
                        ))}
                      </Space>
                    </div>
                  </EmptyBox>

                  <EmptyBox if={groupAuths.length > 0}>
                    <div className="auth-conflict-section">
                      <div className="auth-conflict-title">
                        {t(
                          'provisionMember.checkMemberGroupAuth.currentGroupAuth'
                        )}
                      </div>
                      <Space wrap>
                        {groupAuths.map((auth) => (
                          <BasicTag
                            size="large"
                            key={auth.accountUid}
                            color="blue"
                          >
                            {auth.serviceName} / {auth.accountInfo}
                            {`（${t(
                              'provisionMember.checkMemberGroupAuth.throughGroup',
                              {
                                groupName: auth.groupName
                              }
                            )}）`}
                          </BasicTag>
                        ))}
                      </Space>
                    </div>
                  </EmptyBox>

                  <div className="auth-conflict-section">
                    <div className="auth-conflict-title">
                      {t('provisionMember.checkMemberGroupAuth.conflictDesc')}
                    </div>
                    <div className="auth-conflict-content">
                      <Typography.Text>
                        {t(
                          'provisionMember.checkMemberGroupAuth.conflictDetailTips1'
                        )}
                      </Typography.Text>
                      <BasicToolTip
                        title={t(
                          'provisionMember.checkMemberGroupAuth.viewCurrentGroupAuthDetail'
                        )}
                      >
                        <TypedLink
                          to={ROUTE_PATHS.PROVISION.DATABASE_ACCOUNT.index}
                          params={{
                            projectID
                          }}
                          queries={{
                            group_uid: memberGroupUid
                          }}
                          target="_blank"
                        >
                          {memberGroupName}
                        </TypedLink>
                      </BasicToolTip>
                      <Typography.Text>
                        {t(
                          'provisionMember.checkMemberGroupAuth.conflictDetailTips2'
                        )}
                      </Typography.Text>
                      <Space direction="vertical">
                        {conflict.currentAuths.map((auth) => (
                          <BasicTag
                            size="large"
                            key={auth.accountUid}
                            color="blue"
                          >
                            {auth.serviceName} / {auth.accountInfo}
                            {`（${t(
                              'provisionMember.checkMemberGroupAuth.throughGroup',
                              {
                                groupName:
                                  auth.authType === 'group'
                                    ? auth.groupName
                                    : t(
                                        'provisionMember.checkMemberGroupAuth.directAuthTips'
                                      )
                              }
                            )}）`}
                          </BasicTag>
                        ))}
                        {conflict.conflictAuths.map((auth) => (
                          <BasicTag
                            size="large"
                            key={auth.accountUid}
                            color="blue"
                          >
                            {auth.serviceName} / {auth.accountInfo}
                            {`（${t(
                              'provisionMember.checkMemberGroupAuth.throughGroup',
                              {
                                groupName: auth.groupName
                              }
                            )}）`}
                          </BasicTag>
                        ))}
                      </Space>
                    </div>
                  </div>
                  {conflictIndex < authConflicts.length - 1 && (
                    <Divider className="auth-conflict-divider" />
                  )}
                </div>
              );
            })}
          </CheckMemberGroupAuthErrorMessageStyleWrapper>
        ),
        okText: t('common.close'),
        width: 600
      });

      return false;
    }

    return true;
  };

  return {
    checkMemberGroupAuth,
    loading,
    contextHolder
  };
};

export default useCheckMemberGroupAuth;
