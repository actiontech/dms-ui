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
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { useBoolean, useRequest } from 'ahooks';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  ResponseCode,
  CompanyNoticeDisplayStatusEnum,
  StorageKey
} from '@actiontech/shared/lib/enum';
import { initNavModalStatus } from '../../../../store/nav';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import { updateNavModalStatus } from '../../../../store/nav';
import { CompanyNoticeModalStyleWrapper } from '../style';

const CompanyNoticeModal: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) => state.nav.modalStatus[ModalName.Company_Notice]
  );

  const { isAdmin } = useCurrentUser();

  const [value, setValue] = useState('');

  const [canEdit, setCanEdit] = useState(false);

  const [hasDirtyData, setHasDirtyData] = useState(false);

  const [submitLoading, { setTrue: startSubmit, setFalse: finishedSubmit }] =
    useBoolean(false);

  const [messageApi, contextHolder] = message.useMessage();

  const { data, loading } = useRequest(
    () =>
      dms.GetCompanyNotice().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setValue(res.data.data?.notice_str ?? '');
          return res.data.data?.notice_str ?? '';
        }
      }),
    { ready: !!visible }
  );

  const resetAllState = () => {
    setValue('');
    setCanEdit(false);
    setHasDirtyData(false);
  };

  const handleCloseModal = useCallback(() => {
    dispatch(
      updateNavModalStatus({
        modalName: ModalName.Company_Notice,
        status: false
      })
    );

    resetAllState();
  }, [dispatch]);

  const handleCancelEdit = useCallback(() => {
    setHasDirtyData(false);
    setCanEdit(false);
    setValue(data ?? '');
  }, [data]);

  const submit = () => {
    startSubmit();

    dms
      .UpdateCompanyNotice({ company_notice: { notice_str: value } })
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

  return (
    <CompanyNoticeModalStyleWrapper
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
                  <BasicButton
                    onClick={() => {
                      setCanEdit(false);
                    }}
                  >
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
              <EmptyBox if={isAdmin}>
                <BasicButton type="primary" onClick={() => setCanEdit(true)}>
                  {t('common.edit')}
                </BasicButton>
              </EmptyBox>
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
