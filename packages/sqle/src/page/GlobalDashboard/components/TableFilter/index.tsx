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

  return (
    <GlobalDashboardFilterStyleWrapper>
      <Form form={form}>
        <Space size={12}>
          <Form.Item noStyle name="projectId">
            <CustomSelect
              prefix={t('globalDashboard.filter.project')}
              suffixIcon={null}
              bordered={false}
              options={projectOptions}
              onChange={(value) => {
                onProjectChange?.(value as string);
              }}
            />
          </Form.Item>
          <Form.Item noStyle name="instanceId">
            <CustomSelect
              prefix={t('globalDashboard.filter.instance')}
              suffixIcon={null}
              bordered={false}
              options={instanceIDOptions}
              loading={getInstanceListLoading}
            />
          </Form.Item>
        </Space>
      </Form>
    </GlobalDashboardFilterStyleWrapper>
  );
};

export default GlobalDashboardTableFilter;
