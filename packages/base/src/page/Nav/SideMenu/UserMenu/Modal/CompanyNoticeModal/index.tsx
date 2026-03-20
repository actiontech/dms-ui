import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Empty,
  Form,
  Popconfirm,
  Space,
  Spin,
  Typography,
  message
} from 'antd';
import { EmptyBox, BasicButton, formatTime } from '@actiontech/dms-kit';
import { useBoolean, useRequest } from 'ahooks';
import CompanyNotice from '@actiontech/shared/lib/api/base/service/CompanyNotice';
import { ResponseCode } from '@actiontech/dms-kit';
import { initNavModalStatus } from '../../../../../../store/nav';
import { ModalName } from '../../../../../../data/ModalName';
import { IReduxState } from '../../../../../../store';
import { updateNavModalStatus } from '../../../../../../store/nav';
import { CompanyNoticeModalStyleWrapper } from '../../../style';
import { companyNoticeModalActions } from './actions';
import { CompanyNoticeForm } from './CompanyNoticeForm';
import { ICompanyNoticeFormValues } from './CompanyNoticeForm/index.type';
import dayjs from 'dayjs';

const { Text } = Typography;

const CompanyNoticeModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [form] = Form.useForm<ICompanyNoticeFormValues>();
  const visible = useSelector<IReduxState, boolean>(
    (state) => state.nav.modalStatus[ModalName.Company_Notice]
  );
  const [canEdit, { setTrue: showEditor, setFalse: hideEditor }] = useBoolean();
  const [hasDirtyData, setHasDirtyData] = useState(false);
  const [submitLoading, { setTrue: startSubmit, setFalse: finishedSubmit }] =
    useBoolean(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { data: noticeData, loading } = useRequest(
    () =>
      CompanyNotice.GetCompanyNotice({
        include_latest_outside_period: true
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      }),
    {
      ready: !!visible
    }
  );

  const getFormInitialValues = useCallback(():
    | Partial<ICompanyNoticeFormValues>
    | undefined => {
    if (!noticeData) return undefined;
    return {
      notice_str: noticeData.notice_str ?? '',
      validPeriod:
        noticeData.start_time && noticeData.expire_time
          ? [dayjs(noticeData.start_time), dayjs(noticeData.expire_time)]
          : null
    };
  }, [noticeData]);

  const resetAllState = useCallback(() => {
    form.resetFields();
    setHasDirtyData(false);
    hideEditor();
  }, [form, hideEditor]);

  const handleCloseModal = useCallback(() => {
    dispatch(
      updateNavModalStatus({
        modalName: ModalName.Company_Notice,
        status: false
      })
    );
    resetAllState();
  }, [dispatch, resetAllState]);

  const handleCancelEdit = useCallback(() => {
    form.resetFields();
    const initial = getFormInitialValues();
    form.setFieldsValue(
      initial
        ? { ...initial, validPeriod: initial.validPeriod ?? undefined }
        : {}
    );
    setHasDirtyData(false);
    hideEditor();
  }, [form, hideEditor, getFormInitialValues]);

  const handleSubmit = useCallback(async () => {
    const values = await form.validateFields();
    startSubmit();
    CompanyNotice.UpdateCompanyNotice({
      company_notice: {
        notice_str: values.notice_str,
        start_time: values.validPeriod?.[0]?.toISOString() ?? '',
        end_time: values.validPeriod?.[1]?.toISOString() ?? ''
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsSystem.notification.successMessage'));
          handleCloseModal();
        }
      })
      .finally(finishedSubmit);
  }, [form, startSubmit, finishedSubmit, messageApi, t, handleCloseModal]);

  useEffect(() => {
    dispatch(
      initNavModalStatus({
        modalStatus: {
          [ModalName.Company_Notice]: false
        }
      })
    );
  }, [dispatch]);

  const actions = companyNoticeModalActions(showEditor);

  return (
    <CompanyNoticeModalStyleWrapper
      width={720}
      maskClosable={false}
      title={t('dmsSystem.notification.title')}
      onCancel={handleCloseModal}
      open={visible}
      className="company-notice-modal"
      closable
      footer={
        <Space>
          {canEdit ? (
            <>
              <EmptyBox
                if={hasDirtyData}
                defaultNode={
                  <BasicButton onClick={hideEditor}>
                    {t('common.cancel')}
                  </BasicButton>
                }
              >
                <Popconfirm
                  title={t('dmsSystem.notification.hasDirtyDataTips')}
                  okText={t('common.ok')}
                  cancelText={t('common.cancel')}
                  onConfirm={handleCancelEdit}
                  okButtonProps={{
                    disabled: submitLoading
                  }}
                >
                  <BasicButton loading={submitLoading} disabled={submitLoading}>
                    {t('common.cancel')}
                  </BasicButton>
                </Popconfirm>
              </EmptyBox>

              <BasicButton
                onClick={handleSubmit}
                loading={submitLoading}
                disabled={submitLoading}
                type="primary"
              >
                {t('common.submit')}
              </BasicButton>
            </>
          ) : (
            <>
              <BasicButton onClick={handleCloseModal}>
                {t('common.close')}
              </BasicButton>
              {actions['edit-notice']}
            </>
          )}
        </Space>
      }
    >
      {contextHolder}
      <Spin spinning={loading}>
        <EmptyBox
          if={canEdit}
          defaultNode={
            <>
              {noticeData?.notice_str ? (
                <Space
                  direction="vertical"
                  className="company-notice-view-space"
                >
                  <span className="pre-warp-break-all">
                    {noticeData.notice_str}
                  </span>
                  {(noticeData.start_time || noticeData.expire_time) && (
                    <Text
                      type="secondary"
                      className="company-notice-effective-period"
                    >
                      {t('dmsSystem.notification.effectivePeriod')}
                      {': '}
                      {noticeData.start_time
                        ? formatTime(noticeData.start_time)
                        : '--'}
                      {' ~ '}
                      {noticeData.expire_time
                        ? formatTime(noticeData.expire_time)
                        : '--'}
                    </Text>
                  )}
                </Space>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t('dmsSystem.notification.notData')}
                />
              )}
            </>
          }
        >
          <CompanyNoticeForm
            form={form}
            initialValues={getFormInitialValues()}
            disabled={submitLoading}
            onValuesChange={() => setHasDirtyData(true)}
          />
        </EmptyBox>
      </Spin>
    </CompanyNoticeModalStyleWrapper>
  );
};
export default CompanyNoticeModal;
