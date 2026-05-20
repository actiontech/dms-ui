import { Form, Space } from 'antd';
import { CustomSelect } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { GlobalDashboardFilterStyleWrapper } from '../../style';
import { GlobalDashboardTableFilterProps } from '../../index.type';

const GlobalDashboardTableFilter: React.FC<GlobalDashboardTableFilterProps> = ({
  form,
  projectOptions,
  instanceIDOptions,
  getInstanceListLoading,
  onProjectChange
}) => {
  const { t } = useTranslation();
  const selectedProjectId = Form.useWatch('projectId', form);

  return (
    <GlobalDashboardFilterStyleWrapper>
      <Form form={form}>
        <Space size={12}>
          <Form.Item noStyle name="projectId">
            <CustomSelect
              prefix={t('globalDashboard.filter.project')}
              placeholder={t('common.all')}
              suffixIcon={null}
              options={projectOptions}
              onChange={(value) => {
                onProjectChange?.(value as string);
              }}
            />
          </Form.Item>
          <Form.Item noStyle name="instanceId">
            <CustomSelect
              prefix={t('globalDashboard.filter.instance')}
              placeholder={t('common.all')}
              suffixIcon={null}
              options={instanceIDOptions}
              loading={getInstanceListLoading}
              disabled={!selectedProjectId}
            />
          </Form.Item>
        </Space>
      </Form>
    </GlobalDashboardFilterStyleWrapper>
  );
};

export default GlobalDashboardTableFilter;
