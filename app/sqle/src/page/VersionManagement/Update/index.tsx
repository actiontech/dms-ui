import {
  PageHeader,
  BasicButton,
  EmptyBox,
  BasicResult
} from '@actiontech/dms-kit';
import { useTypedParams } from '@actiontech/shared';
import { Space, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import BackToList from '../Common/BackToList';
import VersionForm from '../Common/VersionForm';
import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { IUpdateSqlVersionV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_version/index.d';
import { useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/dms-kit';
import { useMemo } from 'react';
import useVersionFormState from '../Common/VersionForm/hooks/useVersionFormState';
import { useState } from 'react';
import { VersionStage } from '../Common/VersionForm/index.type';
import { isEqual } from 'lodash';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/dms-kit/es/components/CustomForm/style';
const VersionManagementUpdate = () => {
  const { t } = useTranslation();
  const { versionId } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.VERSION_MANAGEMENT.update>();
  const { projectName } = useCurrentProject();
  const [initStages, setInitStages] = useState<VersionStage[]>();
  const {
    form,
    submitting,
    submitPending,
    submitDone,
    submitSuccessStatus,
    successfulSubmit
  } = useVersionFormState();
  const { data: versionDetail, loading: getVersionDetailLoading } = useRequest(
    () =>
      sqlVersion
        .getSqlVersionDetailV1({
          sql_version_id: versionId ?? '',
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }),
    {
      onSuccess: (res) => {
        const stages = res?.sql_version_stage_detail?.map((stage) => ({
          name: stage.stage_name ?? '',
          instances:
            stage.stage_instances?.map((instance) => instance.instances_id) ??
            []
        }));
        setInitStages(stages);
        form.setFieldsValue({
          version: res?.version,
          desc: res?.desc,
          stages
        });
      }
    }
  );

  // 如果第一阶段绑定的工单为空 则可以编辑版本部署阶段
  const allowEditStages = useMemo(
    () =>
      !versionDetail?.sql_version_stage_detail?.[0]?.workflow_details?.length,
    [versionDetail]
  );
  const onSubmit = async () => {
    const values = await form.validateFields();
    submitPending();
    const params: IUpdateSqlVersionV1Params = {
      sql_version_id: versionId ?? '',
      project_name: projectName,
      version: values.version,
      desc: values.desc,
      update_sql_version_stage: values.stages.map((stage, index) => ({
        name: stage.name,
        stage_sequence: index + 1,
        update_stages_instance_dep: stage.instances.map(
          (instance, instanceIndex) => ({
            stage_instance_id: instance,
            next_stage_instance_id:
              values.stages[index + 1]?.instances[instanceIndex]
          })
        )
      }))
    };
    if (!allowEditStages || isEqual(initStages, values.stages)) {
      delete params.update_sql_version_stage;
    }
    sqlVersion
      .updateSqlVersionV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          successfulSubmit();
        }
      })
      .finally(() => submitDone());
  };
  const onReset = () => {
    form.resetFields(['version', 'desc']);
  };
  return (
    <>
      <PageHeader
        fixed
        title={<BackToList />}
        extra={
          <Space hidden={submitSuccessStatus}>
            <BasicButton
              onClick={onReset}
              loading={submitting || getVersionDetailLoading}
            >
              {t('common.reset')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={onSubmit}
              loading={submitting || getVersionDetailLoading}
            >
              {t('common.save')}
            </BasicButton>
          </Space>
        }
      />
      <Spin spinning={getVersionDetailLoading}>
        <EmptyBox
          if={!submitSuccessStatus}
          defaultNode={
            <BasicResult title={t('versionManagement.update.successTips')} />
          }
        >
          <FormStyleWrapper
            colon={false}
            labelAlign="left"
            className="hasTopHeader"
            form={form}
            {...formItemLayout.spaceBetween}
          >
            <VersionForm isUpdate allowEditStages={allowEditStages} />
          </FormStyleWrapper>
        </EmptyBox>
      </Spin>
    </>
  );
};
export default VersionManagementUpdate;
