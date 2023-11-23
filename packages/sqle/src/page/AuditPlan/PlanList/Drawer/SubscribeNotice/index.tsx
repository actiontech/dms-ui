import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useBoolean } from 'ahooks';

import { Space, message, Form, Spin } from 'antd';
import {
  BasicDrawer,
  BasicButton,
  BasicToolTips,
  BasicSelect,
  BasicInput,
  EmptyBox,
  BasicInputNumber,
  BasicSwitch
} from '@actiontech/shared';
import { useForm } from 'antd/es/form/Form';
import { MonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import WebhooksTemplateHelp from './WebhooksTemplateHelp';

import { IReduxState } from '../../../../../../../base/src/store';
import { ModalName } from '../../../../../data/ModalName';
import { webhooksTemplateDefault } from './index.data';
import { ResponseCode } from '../../../../../data/common';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  updateAuditPlanModalStatus,
  updateSelectAuditPlan
} from '../../../../../store/auditPlan';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import useStaticStatus from '../../../../../hooks/useStaticStatus';

import audit_plan from '@actiontech/shared/lib/api/sqle/service/audit_plan';
import { IAuditPlanResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IUpdateAuditPlanNotifyConfigV1Params } from '@actiontech/shared/lib/api/sqle/service/audit_plan/index.d';
import { SubscribeNoticeFormFields } from './index.type';

const SubscribeNotice = () => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const dispatch = useDispatch();
  const { getRuleLevelStatusSelectOption } = useStaticStatus();

  const visible = useSelector<IReduxState, boolean>(
    (state) => state.auditPlan.modalStatus[ModalName.Subscribe_Notice]
  );
  const currentAuditPlan = useSelector<IReduxState, IAuditPlanResV2 | null>(
    (state) => state.auditPlan.selectAuditPlan
  );
  const [
    getDefaultDataLoading,
    { setTrue: startGetDefaultData, setFalse: finishGetDefaultData }
  ] = useBoolean();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [webhooksEnable, toggleWebhooksEnable] = useState(false);
  const [form] = useForm<SubscribeNoticeFormFields>();

  useEffect(() => {
    if (visible) {
      setDefaultValue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const setDefaultValue = async () => {
    startGetDefaultData();
    try {
      const response = await audit_plan.getAuditPlanNotifyConfigV1({
        audit_plan_name: currentAuditPlan?.audit_plan_name ?? '',
        project_name: projectName
      });
      if (response.data.code === ResponseCode.SUCCESS) {
        const config = response.data.data;

        form.setFieldsValue({
          interval: config?.notify_interval ?? 10,
          level:
            config?.notify_level as UpdateAuditPlanNotifyConfigReqV1NotifyLevelEnum,
          emailEnable: config?.enable_email_notify,
          /* IFTRUE_isEE */
          webhooksEnable: config?.enable_web_hook_notify,
          webhooksUrl: config?.web_hook_url,
          template: config?.web_hook_template
          /* FITRUE_isEE */
        });
        if (config?.enable_web_hook_notify) {
          toggleWebhooksEnable(true);
        }
      }
    } finally {
      finishGetDefaultData();
    }
  };

  const resetTemplate = () => {
    form.resetFields(['template']);
  };

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateAuditPlanModalStatus({
        modalName: ModalName.Subscribe_Notice,
        status: false
      })
    );
    dispatch(updateSelectAuditPlan(null));
    setTimeout(() => {
      toggleWebhooksEnable(false);
    }, 300);
  };

  const submit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const params: IUpdateAuditPlanNotifyConfigV1Params = {
      audit_plan_name: currentAuditPlan?.audit_plan_name ?? '',
      enable_email_notify: values.emailEnable,
      enable_web_hook_notify: values.webhooksEnable,
      notify_interval: values.interval,
      notify_level: values.level,
      project_name: projectName
    };
    if (values.webhooksEnable) {
      params.web_hook_url = values.webhooksUrl;
      params.web_hook_template = values.template;
    }
    audit_plan
      .updateAuditPlanNotifyConfigV1(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          closeModal();
          messageApi.success(
            t('auditPlan.subscribeNotice.form.subscribeNoticeSuccess')
          );
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const testLoading = useRef(false);
  const test = async () => {
    if (testLoading.current) {
      return;
    }
    const messageLoadingInstance = messageApi.open({
      type: 'loading',
      content: t('auditPlan.subscribeNotice.form.testLoading', {
        name: currentAuditPlan?.audit_plan_name ?? ''
      })
    });
    testLoading.current = true;
    try {
      const res = await audit_plan.testAuditPlanNotifyConfigV1({
        audit_plan_name: currentAuditPlan?.audit_plan_name ?? '',
        project_name: projectName
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        if (res.data.data?.is_notify_send_normal) {
          messageApi.open({
            type: 'success',
            content: t('auditPlan.subscribeNotice.form.testSuccess')
          });
        } else {
          messageApi.open({
            type: 'error',
            content:
              res.data.data?.send_error_message ?? t('common.unknownError')
          });
        }
      }
    } finally {
      messageLoadingInstance();
      testLoading.current = false;
    }
  };

  return (
    <>
      {contextMessageHolder}
      <BasicDrawer
        open={visible}
        title={t('auditPlan.subscribeNotice.title')}
        onClose={closeModal}
        footer={
          <Space>
            <BasicButton onClick={closeModal} disabled={submitLoading}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={submitLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        <Form form={form} layout="vertical" {...DrawerFormLayout}>
          <Spin spinning={getDefaultDataLoading} delay={500}>
            <Form.Item
              name="interval"
              rules={[
                {
                  required: true
                },
                {
                  type: 'number'
                }
              ]}
              initialValue={10}
              label={
                <BasicToolTips
                  suffixIcon
                  titleWidth={500}
                  title={t('auditPlan.subscribeNotice.form.intervalTips')}
                >
                  {t('auditPlan.subscribeNotice.form.interval')}
                </BasicToolTips>
              }
            >
              <BasicInputNumber min={0} max={99999} />
            </Form.Item>
            <Form.Item
              name="level"
              label={
                <BasicToolTips
                  suffixIcon
                  title={t('auditPlan.subscribeNotice.form.levelTips')}
                >
                  {t('auditPlan.subscribeNotice.form.level')}
                </BasicToolTips>
              }
              rules={[
                {
                  required: true,
                  message: t('common.form.rule.require', {
                    name: t('auditPlan.subscribeNotice.form.level')
                  })
                }
              ]}
            >
              <BasicSelect>{getRuleLevelStatusSelectOption()}</BasicSelect>
            </Form.Item>
            <Form.Item
              name="emailEnable"
              valuePropName="checked"
              label={
                <BasicToolTips
                  suffixIcon
                  title={t('auditPlan.subscribeNotice.form.emailEnableTips')}
                >
                  {t('auditPlan.subscribeNotice.form.emailEnable')}
                </BasicToolTips>
              }
            >
              <BasicSwitch />
            </Form.Item>
            {/* IFTRUE_isEE */}
            <Form.Item
              label={t('auditPlan.subscribeNotice.form.webhooksEnable')}
              name="webhooksEnable"
              valuePropName="checked"
            >
              <BasicSwitch onChange={toggleWebhooksEnable} />
            </Form.Item>

            <EmptyBox if={webhooksEnable}>
              <Form.Item
                name="webhooksUrl"
                label={t('auditPlan.subscribeNotice.form.webhooksUrl')}
                rules={[
                  {
                    required: true
                  }
                ]}
              >
                <BasicInput />
              </Form.Item>
              <Form.Item
                name="template"
                rules={[
                  {
                    required: true
                  }
                ]}
                label={t('auditPlan.subscribeNotice.form.webhooksTemplate')}
                initialValue={webhooksTemplateDefault}
                help={<WebhooksTemplateHelp resetTemplate={resetTemplate} />}
              >
                <MonacoEditor
                  width="100%"
                  height="200px"
                  language="json"
                  options={{
                    automaticLayout: true
                  }}
                />
              </Form.Item>
            </EmptyBox>
            {/* FITRUE_isEE */}
            {/* IFTRUE_isCE */}
            <Form.Item
              label={t('auditPlan.subscribeNotice.form.webhooksEnable')}
            >
              <> {t('auditPlan.subscribeNotice.form.webhooksEnableCe')}</>
            </Form.Item>
            {/* FITRUE_isCE */}
            <Form.Item label=" " colon={false} style={{ marginTop: 10 }}>
              <BasicToolTips
                title={t('auditPlan.subscribeNotice.form.testTips')}
              >
                <BasicButton onClick={test} data-testid="testMessage">
                  {t('auditPlan.subscribeNotice.form.test')}
                </BasicButton>
              </BasicToolTips>
            </Form.Item>
          </Spin>
        </Form>
      </BasicDrawer>
    </>
  );
};

export default SubscribeNotice;
