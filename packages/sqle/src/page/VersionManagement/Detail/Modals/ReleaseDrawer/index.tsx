import {
  BasicDrawer,
  BasicButton,
  BasicInput,
  CustomLabelContent,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/dms-kit';
import { TypedLink, useTypedParams } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Space, Form, message, SelectProps, Spin, Typography } from 'antd';
import { ModalName } from '../../../../../data/ModalName';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../../store';
import { useEffect, useMemo } from 'react';
import {
  updateVersionManagementModalStatus,
  updateSelectVersionStageId,
  updateSelectVersionStageWorkflowList
} from '../../../../../store/versionManagement';
import { DrawerFormLayout } from '@actiontech/dms-kit';
import { RingPieFilled } from '@actiontech/icons';
import useInstance from '../../../../../hooks/useInstance';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { getInstanceTipListV2FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { ReleaseDrawerFormStyleWrapper } from '../../style';
import DataSourceField from './DataSourceField';
import { ReleaseWorkflowFormType } from '../../index.type';
import useTestConnection from './hooks/useTestConnection';
import { useRequest, useBoolean } from 'ahooks';
import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { ResponseCode } from '@actiontech/dms-kit';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
const ReleaseDrawer: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { versionId } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.detail>();
  const { projectName, projectID } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [form] = Form.useForm<ReleaseWorkflowFormType>();
  const [submitting, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const releaseWorkflows = Form.useWatch('release_workflows', form);
  const {
    renderTestDatabasesConnectInfo,
    getConnectionInfoLoading,
    getConnectionInfo,
    testConnectionAble,
    clearConnectionInfo
  } = useTestConnection(releaseWorkflows);
  const {
    loading: instanceTipsLoading,
    updateInstanceList,
    instanceOptions,
    instanceIDOptions,
    instanceList
  } = useInstance();
  const { stageId, currentStageWorkflowList, visible } = useSelector(
    (state: IReduxState) => ({
      stageId: state.versionManagement.stageId,
      currentStageWorkflowList:
        state.versionManagement.currentStageWorkflowList,
      visible:
        !!state.versionManagement.modalStatus[
          ModalName.Version_Management_Release_Modal
        ]
    })
  );
  const { data: nextStageInstances, loading: getNextStageInstanceLoading } =
    useRequest(
      () => {
        return sqlVersion
          .getDependenciesBetweenStageInstanceV1({
            project_name: projectName,
            sql_version_stage_id: `${stageId}`,
            sql_version_id: versionId ?? ''
          })
          .then((res) => {
            if (res.data.code === ResponseCode.SUCCESS) {
              return res.data.data;
            }
          });
      },
      {
        ready: !!stageId && visible && !!instanceList.length,
        onSuccess: (res) => {
          const initValues = currentStageWorkflowList?.map((workflow) => {
            return {
              workflow_id: workflow.workflow_id,
              target_release_instances: workflow.workflow_instances?.map(
                (instance) => {
                  const nextInstances = res?.filter(
                    (i) => i.stage_instance_id === instance.instances_id
                  );
                  const getDefaultInstanceId = () => {
                    if (nextInstances?.length === 1) {
                      const firstInstanceId =
                        nextInstances[0].next_stage_instance_id;
                      return instanceList.some(
                        (i) => i.instance_id === firstInstanceId
                      )
                        ? firstInstanceId
                        : undefined;
                    }
                    return undefined;
                  };
                  return {
                    instance_id: instance.instances_id,
                    instance_schema: instance.instance_schema,
                    target_instance_id: getDefaultInstanceId()
                  };
                }
              )
            };
          });
          form.setFieldValue('release_workflows', initValues);
        }
      }
    );
  const onClose = () => {
    form.resetFields();
    clearConnectionInfo();
    dispatch(
      updateVersionManagementModalStatus({
        modalName: ModalName.Version_Management_Release_Modal,
        status: false
      })
    );
    dispatch(
      updateSelectVersionStageId({
        stageId: null
      })
    );
    dispatch(
      updateSelectVersionStageWorkflowList({
        workflowList: null
      })
    );
  };
  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    sqlVersion
      .batchReleaseWorkflowsV1({
        project_name: projectName,
        sql_version_id: versionId ?? '',
        release_workflows: values.release_workflows
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('versionManagement.release.successTips'));
        }
        if (
          res.data.code === ResponseCode.SUCCESS ||
          res.data.code === ResponseCode.BatchTaskNotFullyCompleted
        ) {
          onClose();
          EventEmitter.emit(EmitterKey.Refresh_Version_Management_Detail);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };
  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module:
        getInstanceTipListV2FunctionalModuleEnum.create_workflow
    });
  }, [updateInstanceList, projectName]);
  const filteredInstanceIdOptions = useMemo(() => {
    const newOptions: SelectProps['options'] = [];
    instanceIDOptions.forEach((item) => {
      if (
        item.options.some((i) =>
          nextStageInstances?.some(
            (nextInstance) => nextInstance.next_stage_instance_id === i.value
          )
        )
      ) {
        newOptions.push({
          ...item,
          options: item.options.filter((i) =>
            nextStageInstances?.some(
              (nextInstance) => nextInstance.next_stage_instance_id === i.value
            )
          )
        });
      }
    });
    return newOptions;
  }, [instanceIDOptions, nextStageInstances]);
  return (
    <BasicDrawer
      open={visible}
      size="large"
      title={t('versionManagement.release.title')}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} loading={submitting}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            onClick={getConnectionInfo}
            loading={getConnectionInfoLoading || submitting}
            disabled={!testConnectionAble}
          >
            {t('common.testDatabaseConnectButton.testDatabaseConnection')}
          </BasicButton>
          <BasicButton type="primary" onClick={onSubmit} loading={submitting}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {messageContextHolder}
      <Spin spinning={getNextStageInstanceLoading}>
        <Space direction="vertical">
          <Typography.Text type="secondary">
            {t('versionManagement.release.currentAllowReleaseWorkflow')}：
          </Typography.Text>
          <ReleaseDrawerFormStyleWrapper
            form={form}
            layout="vertical"
            {...DrawerFormLayout}
          >
            {currentStageWorkflowList?.map((workflow, index) => {
              return (
                <FormItemLabel
                  key={index}
                  label={
                    <Space className="workflow-name-wrapper">
                      <RingPieFilled />
                      <TypedLink
                        to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.detail}
                        params={{
                          projectID,
                          workflowId: workflow.workflow_id ?? ''
                        }}
                        target="_blank"
                      >
                        {workflow.workflow_name}
                      </TypedLink>
                    </Space>
                  }
                >
                  <FormItemNoLabel
                    name={['release_workflows', index, 'workflow_id']}
                    hidden
                  >
                    <BasicInput />
                  </FormItemNoLabel>
                  {workflow?.workflow_instances?.map(
                    (dataSource, instanceIndex) => {
                      return (
                        <FormItemLabel
                          key={instanceIndex}
                          className="has-required-style has-label-tip data-source-item-wrapper"
                          label={
                            <CustomLabelContent
                              title={t(
                                'versionManagement.release.targetDataSource'
                              )}
                              tips={
                                <span>
                                  {t(
                                    'versionManagement.release.currentDataSource'
                                  )}
                                  ：
                                  {`${dataSource.instances_name} ${
                                    dataSource.instance_schema
                                      ? ` / ${dataSource.instance_schema}`
                                      : ''
                                  }`}
                                </span>
                              }
                            />
                          }
                        >
                          <FormItemNoLabel
                            name={[
                              'release_workflows',
                              index,
                              'target_release_instances',
                              instanceIndex,
                              'instance_id'
                            ]}
                            hidden
                          >
                            <BasicInput />
                          </FormItemNoLabel>
                          <FormItemNoLabel
                            name={[
                              'release_workflows',
                              index,
                              'target_release_instances',
                              instanceIndex,
                              'instance_schema'
                            ]}
                            hidden
                          >
                            <BasicInput />
                          </FormItemNoLabel>
                          <DataSourceField
                            instanceIDOptions={filteredInstanceIdOptions}
                            instanceList={instanceList}
                            instanceOptions={instanceOptions}
                            instanceTipsLoading={instanceTipsLoading}
                            fieldNamePath={[
                              'release_workflows',
                              index,
                              'target_release_instances',
                              instanceIndex
                            ]}
                          />
                          {renderTestDatabasesConnectInfo(
                            releaseWorkflows?.[index]
                              ?.target_release_instances?.[instanceIndex]
                              ?.target_instance_name
                          )}
                        </FormItemLabel>
                      );
                    }
                  )}
                </FormItemLabel>
              );
            })}
          </ReleaseDrawerFormStyleWrapper>
        </Space>
      </Spin>
    </BasicDrawer>
  );
};
export default ReleaseDrawer;
