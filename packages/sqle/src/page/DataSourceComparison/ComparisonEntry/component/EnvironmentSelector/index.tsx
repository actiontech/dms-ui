import { BasicTreeSelect } from '@actiontech/shared';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import { Form, TreeSelectProps, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { DatabaseComparisonFromFields } from '../../index.type';
import useDataSourceTreeData from '../../hooks/useDataSourceTreeData';
import { EnvironmentSelectStyleWrapper } from './style';

type Props = {
  executeComparisonPending: boolean;
};

const EnvironmentSelector: React.FC<Props> = ({ executeComparisonPending }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<DatabaseComparisonFromFields>();
  const baselineInstance = Form.useWatch('baselineInstance', form);
  const comparisonInstance = Form.useWatch('comparisonInstance', form);

  const {
    onLoadTreeData,
    treeExpandedKeys,
    onTreeExpand,
    disableTreeNodesBasedOnSelection,
    treeLoadedKeys,
    getTreeDataPending
  } = useDataSourceTreeData();

  const databaseComparisonSelectorCommonProps: TreeSelectProps = {
    treeLoadedKeys,
    onTreeExpand,
    treeExpandedKeys,
    showSearch: true,
    allowClear: true,
    treeDataSimpleMode: true,
    treeNodeFilterProp: 'label',
    loadData: onLoadTreeData,
    loading: getTreeDataPending,
    disabled: executeComparisonPending
  };

  return (
    <>
      <EnvironmentSelectStyleWrapper>
        <Typography.Title level={4}>
          {t('dataSourceComparison.entry.baselineEnvironment')}
        </Typography.Title>
        <Typography.Text className="environment-section-desc">
          {t('dataSourceComparison.entry.baselineEnvironmentDescription')}
        </Typography.Text>
        <FormItemNoLabel
          name="baselineInstance"
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('dataSourceComparison.entry.baselineEnvironment')
              })
            }
          ]}
        >
          <BasicTreeSelect
            {...databaseComparisonSelectorCommonProps}
            treeData={disableTreeNodesBasedOnSelection(comparisonInstance)}
          />
        </FormItemNoLabel>
      </EnvironmentSelectStyleWrapper>
      <EnvironmentSelectStyleWrapper>
        <Typography.Title level={4}>
          {t('dataSourceComparison.entry.comparisonEnvironment')}
        </Typography.Title>

        <Typography.Text className="environment-section-desc">
          {t('dataSourceComparison.entry.comparisonEnvironmentDescription')}
        </Typography.Text>
        <FormItemNoLabel
          name="comparisonInstance"
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('dataSourceComparison.entry.comparisonEnvironment')
              })
            }
          ]}
        >
          <BasicTreeSelect
            {...databaseComparisonSelectorCommonProps}
            treeData={disableTreeNodesBasedOnSelection(baselineInstance)}
          />
        </FormItemNoLabel>
      </EnvironmentSelectStyleWrapper>
    </>
  );
};

export default EnvironmentSelector;
