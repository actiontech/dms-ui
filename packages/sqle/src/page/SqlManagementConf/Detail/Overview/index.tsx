import {
  ActiontechTable,
  ColumnsSettingProps,
  TableFilterContainer,
  TableToolbar,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ConfDetailOverviewColumnActions,
  ConfDetailOverviewColumns
} from './column';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { ConfDetailOverviewProps } from './index.type';

const ConfDetailOverview: React.FC<ConfDetailOverviewProps> = ({
  activeTabKey,
  handleChangeTab
}) => {
  const { t } = useTranslation();
  const { username } = useCurrentUser();

  const columns = ConfDetailOverviewColumns();

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'sql_management_conf_detail_overview',
      username
    }),
    [username]
  );

  const { tableFilterInfo, tableChange, pagination, updateTableFilterInfo } =
    useTableRequestParams<any, any>();

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  return (
    <>
      <TableToolbar
        setting={tableSetting}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
      >
        <TableFilterContainer
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          inlineToolbar
          // disabled={loading}
          // filterCustomProps={filterCustomProps}
        />
      </TableToolbar>

      <ActiontechTable
        columns={columns}
        setting={tableSetting}
        onChange={tableChange}
        onRow={(record) => {
          return {
            onClick: () => {
              handleChangeTab(record.id);
            }
          };
        }}
        actions={ConfDetailOverviewColumnActions(
          () => {
            console.log('enabledAction');
          },
          () => {
            console.log('enabledAction');
          }
        )}
      />
    </>
  );
};

export default ConfDetailOverview;
