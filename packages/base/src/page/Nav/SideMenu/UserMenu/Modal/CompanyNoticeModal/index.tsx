import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Empty, Popconfirm, Space, Spin, message } from 'antd';
import {
  LocalStorageWrapper,
  EmptyBox,
  BasicButton,
  BasicInput
} from '@actiontech/shared';
import { useBoolean, useRequest } from 'ahooks';
import CompanyNotice from '@actiontech/shared/lib/api/base/service/CompanyNotice';
import {
  ResponseCode,
  CompanyNoticeDisplayStatusEnum,
  StorageKey
} from '@actiontech/shared/lib/enum';
import { initNavModalStatus } from '../../../../../../store/nav';
import { ModalName } from '../../../../../../data/ModalName';
import { IReduxState } from '../../../../../../store';
import { updateNavModalStatus } from '../../../../../../store/nav';
import { CompanyNoticeModalStyleWrapper } from '../../../style';
import { CompanyNoticeModalActions } from './actions';

const CompanyNoticeModal: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) => state.nav.modalStatus[ModalName.Company_Notice]
  );

  const [value, setValue] = useState('');

  const [canEdit, { setTrue: showEditor, setFalse: hideEditor }] = useBoolean();

  const [hasDirtyData, setHasDirtyData] = useState(false);

  const [submitLoading, { setTrue: startSubmit, setFalse: finishedSubmit }] =
    useBoolean(false);

  const [messageApi, contextHolder] = message.useMessage();

  const { data, loading } = useRequest(
    () =>
      CompanyNotice.GetCompanyNotice().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setValue(res.data.data?.notice_str ?? '');
          return res.data.data?.notice_str ?? '';
        }
      }),
    { ready: !!visible }
  );

  const resetAllState = useCallback(() => {
    setValue('');
    hideEditor();
    setHasDirtyData(false);
  }, [hideEditor]);

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
    setHasDirtyData(false);
    hideEditor();
    setValue(data ?? '');
  }, [data, hideEditor]);

  const submit = () => {
    startSubmit();

    CompanyNotice.UpdateCompanyNotice({ company_notice: { notice_str: value } })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsSystem.notification.successMessage'));
          handleCloseModal();
        }
      })
      .finally(finishedSubmit);
  };

  useEffect(() => {
    if (visible) {
      LocalStorageWrapper.set(
        StorageKey.SHOW_COMPANY_NOTICE,
        CompanyNoticeDisplayStatusEnum.Displayed
      );
    }
  }, [visible]);

  useEffect(() => {
    dispatch(
      initNavModalStatus({
        modalStatus: {
          [ModalName.Company_Notice]: false
        }
      })
    );
  }, [dispatch]);

  const actions = CompanyNoticeModalActions(showEditor);

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
                  okButtonProps={{ disabled: submitLoading }}
                >
                  <BasicButton loading={submitLoading} disabled={submitLoading}>
                    {t('common.cancel')}
                  </BasicButton>
                </Popconfirm>
              </EmptyBox>

              <BasicButton
                onClick={submit}
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
              {data ? (
                <span className="pre-warp-break-all">{data}</span>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t('dmsSystem.notification.notData')}
                />
              )}
            </>
          }
        >
          <BasicInput.TextArea
            autoSize
            value={value}
            disabled={submitLoading}
            onChange={(e) => {
              setValue(e.target.value ?? '');
              setHasDirtyData(true);
            }}
          />
        </EmptyBox>
      </Spin>
    </CompanyNoticeModalStyleWrapper>
  );
};

export default CompanyNoticeModal;
