import { BasicTreeSelect } from '@actiontech/dms-kit';
import { FormItemNoLabel } from '@actiontech/dms-kit';
import { Form, TreeSelectProps, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { DatabaseComparisonFromFields } from '../../index.type';
import useDataSourceSelectorTree from '../../hooks/useDataSourceSelectorTree';
import { EnvironmentSelectStyleWrapper } from './style';
import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
type Props = {
  executeComparisonPending: boolean;
  updateComparisonResult: (data?: ISchemaObject[]) => void;
  comparisonObjectTreeOnCheck: (keys: string[]) => void;
} & Pick<
  ReturnType<typeof useDataSourceSelectorTree>,
  | 'treeLoadedKeys'
  | 'onTreeExpand'
  | 'treeExpandedKeys'
  | 'onLoadTreeData'
  | 'getTreeDataPending'
  | 'disableTreeNodesBasedOnSelection'
  | 'validatorDataSourceTreeSelector'
>;
const EnvironmentSelector: React.FC<Props> = ({
  executeComparisonPending,
  treeLoadedKeys,
  onTreeExpand,
  treeExpandedKeys,
  onLoadTreeData,
  getTreeDataPending,
  disableTreeNodesBasedOnSelection,
  updateComparisonResult,
  comparisonObjectTreeOnCheck,
  validatorDataSourceTreeSelector
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<DatabaseComparisonFromFields>();
  const baselineInstance = Form.useWatch('baselineInstance', form);
  const comparisonInstance = Form.useWatch('comparisonInstance', form);
  const onChange: TreeSelectProps['onChange'] = () => {
    updateComparisonResult(undefined);
    comparisonObjectTreeOnCheck([]);
  };
  const databaseComparisonSelectorCommonProps: TreeSelectProps = {
    treeLoadedKeys,
    onTreeExpand,
    treeExpandedKeys,
    onChange,
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
          dependencies={['baselineInstance']}
          rules={[
            {
              required: true,
              message: t('common.form.placeholder.select', {
                name: t('dataSourceComparison.entry.comparisonEnvironment')
              })
            },
            {
              validator: validatorDataSourceTreeSelector()
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
