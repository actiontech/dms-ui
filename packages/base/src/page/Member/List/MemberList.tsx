import { useMemo, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { useToggle } from 'ahooks';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  useCurrentProject,
  usePermission
} from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListMemberV2 } from '@actiontech/shared/lib/api/base/service/common';
import { IListMembersV2Params } from '@actiontech/shared/lib/api/base/service/Member/index.d';
import Member from '@actiontech/shared/lib/api/base/service/Member';
import { ModalName } from '../../../data/ModalName';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { MemberListColumns } from './column';
import {
  updateMemberModalStatus,
  updateSelectMember
} from '../../../store/member';
import { MemberListTypeEnum } from '../index.enum';
import { MemberListActions } from './actions';

const MemberList: React.FC<{ activePage: MemberListTypeEnum }> = ({
  activePage
}) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const dispatch = useDispatch();

  const { projectID } = useCurrentProject();

  const { parse2TableActionPermissions } = usePermission();

  const [refreshFlag, { toggle: toggleRefreshFlag }] = useToggle(false);

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { pagination, tableChange } = useTableRequestParams<
    IListMemberV2,
    IListMembersV2Params
  >();

  const {
    data: memberList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IListMembersV2Params = {
        ...pagination,
        project_uid: projectID
      };
      // return handleTableRequestError(Member.ListMembersV2(params));
      return Promise.resolve({
        list: [
          {
            uid: '1930102420742868992',
            user: {
              uid: '20250604112007136',
              name: 'test'
            },
            is_project_admin: false,
            is_group_member: true,
            current_project_op_permissions: [
              {
                data_source: 'oracle-test',
                roles: [
                  {
                    uid: '700403',
                    name: '开发工程师',
                    op_permissions: [
                      {
                        uid: '700003',
                        name: '创建/编辑工单'
                      },
                      {
                        uid: '700010',
                        name: 'SQL工作台查询'
                      },
                      {
                        uid: '700015',
                        name: '配置流水线'
                      }
                    ],
                    member_group: {
                      name: 'test',
                      uid: '1930507995565789184',
                      users: [
                        {
                          uid: '20250604112007136',
                          name: 'test'
                        },
                        {
                          uid: '20250604132036026',
                          name: 'test-1'
                        }
                      ],
                      op_permissions: [
                        {
                          uid: '700003',
                          name: '创建/编辑工单'
                        },
                        {
                          uid: '700010',
                          name: 'SQL工作台查询'
                        },
                        {
                          uid: '700015',
                          name: '配置流水线'
                        }
                      ]
                    }
                  },
                  {
                    uid: '700405',
                    name: '运维工程师',
                    op_permissions: [
                      {
                        uid: '700005',
                        name: '授权数据源数据权限'
                      },
                      {
                        uid: '700006',
                        name: '上线工单'
                      },
                      {
                        uid: '700007',
                        name: '查看他人创建的工单'
                      },
                      {
                        uid: '700008',
                        name: '查看他人创建的扫描任务'
                      },
                      {
                        uid: '700009',
                        name: '创建/编辑扫描任务'
                      },
                      {
                        uid: '700012',
                        name: '创建数据导出任务'
                      }
                    ]
                  }
                ]
              },
              {
                data_source: 'mysql-test',
                roles: [
                  {
                    uid: '700403',
                    name: '开发工程师',
                    op_permissions: [
                      {
                        uid: '700003',
                        name: '创建/编辑工单'
                      },
                      {
                        uid: '700010',
                        name: 'SQL工作台查询'
                      },
                      {
                        uid: '700015',
                        name: '配置流水线'
                      }
                    ]
                  }
                ]
              }
            ],
            current_project_manage_permissions: [
              {
                uid: '700003',
                name: '数据源管理'
              },
              {
                uid: '700010',
                name: '成员管理'
              },
              {
                uid: '700015',
                name: '审批流程管理'
              }
            ],
            platform_roles: [
              {
                uid: '700018',
                name: '普通用户'
              }
            ],
            projects: ['default']
          }
        ],
        total: 0
      });
    },
    {
      refreshDeps: [pagination, refreshFlag, projectID, activePage],
      ready: activePage === MemberListTypeEnum.member_list
    }
  );

  const onEditMember = useCallback(
    (record?: IListMemberV2) => {
      dispatch(updateSelectMember({ member: record ?? null }));
      dispatch(
        updateMemberModalStatus({
          modalName: ModalName.DMS_Update_Member,
          status: true
        })
      );
    },
    [dispatch]
  );

  const onDeleteMember = useCallback(
    async (record?: IListMemberV2) => {
      const res = await Member.DelMember({
        member_uid: record?.uid ?? '',
        project_uid: projectID
      });

      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(
          t('dmsMember.memberList.deleteSuccessTips', {
            name: record?.user?.name ?? ''
          })
        );
        refresh();
      }
    },
    [messageApi, refresh, t, projectID]
  );

  const onManageMemberGroup = useCallback(
    (record?: IListMemberV2) => {
      dispatch(updateSelectMember({ member: record ?? null }));
      dispatch(
        updateMemberModalStatus({
          modalName: ModalName.DMS_Manage_Member_Group,
          status: true
        })
      );
    },
    [dispatch]
  );

  const actions = useMemo(() => {
    return parse2TableActionPermissions(
      MemberListActions(onEditMember, onDeleteMember, onManageMemberGroup)
    );
  }, [
    onEditMember,
    onDeleteMember,
    parse2TableActionPermissions,
    onManageMemberGroup
  ]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.DMS_Refresh_Member_List,
      toggleRefreshFlag
    );

    return unsubscribe;
  }, [toggleRefreshFlag]);

  return (
    <>
      {contextHolder}
      <ActiontechTable
        rowKey="uid"
        dataSource={memberList?.list}
        pagination={{
          total: memberList?.total ?? 0
        }}
        loading={loading}
        columns={MemberListColumns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
        scroll={{}}
      />
    </>
  );
};

export default MemberList;
