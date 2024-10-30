import { useTranslation } from 'react-i18next';
import {
  ComparisonActionStyleWrapper,
  ComparisonEntryStyleWrapper,
  ComparisonSelectorFormStyleWrapper
} from './style';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import { Empty, Form, Typography } from 'antd';
import { ToggleButtonStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useRequest, useToggle } from 'ahooks';
import databaseCompareService from '@actiontech/shared/lib/api/sqle/service/database_comparison';
import { DatabaseComparisonFromFields } from './index.type';
import EnvironmentSelector from './component/EnvironmentSelector';
import { parse2DatabaseCompareObject } from './utils';
import ComparisonTreeNode from './component/ComparisonTreeNode';

const ComparisonEntry: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();

  const [form] = Form.useForm<DatabaseComparisonFromFields>();

  const [showDifferencesOnly, { toggle: toggleShowDifferencesOnly }] =
    useToggle();

  const {
    data: comparisonResults,
    run: executeComparisonApi,
    loading: executeComparisonPending
  } = useRequest(
    (baseLineValue: string, comparisonValue: string) =>
      databaseCompareService
        .executeDatabaseComparisonV1({
          project_name: projectName,
          base_db_object: parse2DatabaseCompareObject(baseLineValue),
          comparison_db_object: parse2DatabaseCompareObject(comparisonValue)
        })
        .then((res) => res.data.data),
    {
      manual: true
    }
  );

  const executeComparison = async () => {
    const values = await form.validateFields();
    executeComparisonApi(values.baselineInstance, values.comparisonInstance);
  };

  return (
    <ComparisonEntryStyleWrapper>
      <ComparisonSelectorFormStyleWrapper form={form}>
        <EnvironmentSelector
          executeComparisonPending={executeComparisonPending}
        />
      </ComparisonSelectorFormStyleWrapper>

      <BasicButton
        size="large"
        className="full-width-element"
        type="primary"
        onClick={executeComparison}
        disabled={executeComparisonPending}
        loading={executeComparisonPending}
      >
        {t('dataSourceComparison.entry.executeComparison')}
      </BasicButton>

      <ComparisonActionStyleWrapper size={12}>
        <ToggleButtonStyleWrapper
          disabled={executeComparisonPending}
          active={showDifferencesOnly}
          onClick={() => {
            if (!executeComparisonPending) {
              toggleShowDifferencesOnly();
            }
          }}
        >
          {t('dataSourceComparison.entry.showDifferencesOnly')}
        </ToggleButtonStyleWrapper>

        <BasicButton disabled={executeComparisonPending}>
          {t('dataSourceComparison.entry.modifyMappings')}
        </BasicButton>

        <BasicButton disabled={executeComparisonPending}>
          {t('dataSourceComparison.entry.generateSQL')}
        </BasicButton>
      </ComparisonActionStyleWrapper>

      {/* <EmptyBox
        if={!!comparisonResults}
        defaultNode={
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Typography.Text type="secondary">
                {t('common.tip.no_data')}
              </Typography.Text>
            }
          />
        }
      >
        <ComparisonTreeNode comparisonResults={comparisonResults ?? []} />
      </EmptyBox> */}
    </ComparisonEntryStyleWrapper>
  );
};

export default ComparisonEntry;
