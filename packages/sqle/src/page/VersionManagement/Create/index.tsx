import {
  PageHeader,
  BasicButton,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { Space } from 'antd';
import { useTranslation } from 'react-i18next';
import BackToList from '../Common/BackToList';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import VersionForm from '../Common/VersionForm';
import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useVersionFormState from '../Common/VersionForm/hooks/useVersionFormState';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const VersionManagementCreation = () => {
  const { t } = useTranslation();

  const { projectName, projectID } = useCurrentProject();

  const [versionId, setVersionId] = useState<number>();

  const {
    form,
    submitting,
    submitPending,
    submitDone,
    submitSuccessStatus,
    successfulSubmit,
    backToForm
  } = useVersionFormState();

  const onSubmit = async () => {
    const values = await form.validateFields();
    submitPending();
    sqlVersion
      .createSqlVersionV1({
        project_name: projectName,
        version: values.version,
        desc: values.desc,
        create_sql_version_stage: values.stages.map((stage, index) => ({
          name: stage.name,
          stage_sequence: index + 1,
          create_stages_instance_dep: stage.instances.map(
            (instance, instanceIndex) => ({
              stage_instance_id: instance,
              next_stage_instance_id:
                values.stages[index + 1]?.instances[instanceIndex]
            })
          )
        }))
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setVersionId(res.data.data?.sql_version_id);
          successfulSubmit();
        }
      })
      .finally(() => submitDone());
  };

  const onReset = () => {
    form.resetFields();
    backToForm();
  };

  return (
    <>
      <PageHeader
        fixed
        title={<BackToList />}
        extra={
          <Space hidden={submitSuccessStatus}>
            <BasicButton loading={submitting} onClick={onReset}>
              {t('common.reset')}
            </BasicButton>
            <BasicButton type="primary" onClick={onSubmit} loading={submitting}>
              {t('common.save')}
            </BasicButton>
          </Space>
        }
      />
      <EmptyBox
        if={!submitSuccessStatus}
        defaultNode={
          <BasicResult
            title={t('versionManagement.create.successTips')}
            extra={[
              <BasicButton type="primary" key="continue-btn" onClick={onReset}>
                {t('versionManagement.create.continueText')}
              </BasicButton>,
              <Link
                to={`/sqle/project/${projectID}/version-management/detail/${versionId}`}
                key="check-detail"
              >
                <BasicButton type="primary" onClick={onReset}>
                  {t('versionManagement.create.viewVersionDetail')}
                </BasicButton>
              </Link>
            ]}
          />
        }
      >
        <FormStyleWrapper
          colon={false}
          labelAlign="left"
          className="hasTopHeader"
          form={form}
          {...formItemLayout.spaceBetween}
        >
          <VersionForm />
        </FormStyleWrapper>
      </EmptyBox>
    </>
  );
};

export default VersionManagementCreation;
