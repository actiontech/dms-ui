import { EmptyBox, BasicButton } from '@actiontech/dms-kit';
import { Space, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
interface PageHeaderExtraActionProps {
  hasDirtyData: boolean;
  submitLoading: boolean;
  modifyFinish: () => void;
  onConfirm: () => void;
  onSubmit: () => void;
}
const PageHeaderExtraAction: React.FC<PageHeaderExtraActionProps> = ({
  hasDirtyData,
  submitLoading,
  modifyFinish,
  onConfirm,
  onSubmit
}) => {
  const { t } = useTranslation();
  return (
    <Space>
      <EmptyBox
        if={hasDirtyData}
        defaultNode={
          <BasicButton disabled={submitLoading} onClick={modifyFinish}>
            {t('common.cancel')}
          </BasicButton>
        }
      >
        <Popconfirm
          title={t('ruleKnowledge.hasDirtyDataTips')}
          okText={t('common.ok')}
          cancelText={t('common.cancel')}
          onConfirm={onConfirm}
        >
          <BasicButton disabled={submitLoading}>
            {t('common.cancel')}
          </BasicButton>
        </Popconfirm>
      </EmptyBox>
      <BasicButton loading={submitLoading} type="primary" onClick={onSubmit}>
        {t('common.submit')}
      </BasicButton>
    </Space>
  );
};
export default PageHeaderExtraAction;
