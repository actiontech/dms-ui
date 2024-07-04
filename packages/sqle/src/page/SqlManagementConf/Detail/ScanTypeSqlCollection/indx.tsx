import {
  ActiontechTable,
  TableFilterContainer,
  TableToolbar,
  useTableFilterContainer,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import {
  ScanTypeSqlCollectionColumnAction,
  ScanTypeSqlCollectionColumns
} from './column';
import ReportDrawer from '../../../../components/ReportDrawer';
import { useState } from 'react';
import { useBoolean } from 'ahooks';
import SqlStatusFilterContainer from './SqlStatusFilterContainer';
import useSqlStatusFilterContainer from './SqlStatusFilterContainer/useSqlStatusFilterContainer';
import { ScanTypeSqlCollectionStyleWrapper } from './style';

const ScanTypeSqlCollection: React.FC = () => {
  const { t } = useTranslation();

  const columns = ScanTypeSqlCollectionColumns();

  const {
    tableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword,
    updateTableFilterInfo
  } = useTableRequestParams<any, any>();

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const [
    reportDrawerVisible,
    { setTrue: openReportDrawer, setFalse: closeReportDrawer }
  ] = useBoolean(false);

  const {
    sqlStatusFilterValue,
    handleChangeSqlStatus,
    sqlStatusFilterOptions,
    auditAction,
    lastAuditTime
  } = useSqlStatusFilterContainer();

  return (
    <ScanTypeSqlCollectionStyleWrapper>
      <TableToolbar
        // loading={loading}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          placeholder: t(
            'managementConf.detail.scanTypeSqlCollection.filter.searchInputPlaceholder'
          ),
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
      >
        <TableFilterContainer
          inlineToolbar
          filterContainerMeta={filterContainerMeta}
          updateTableFilterInfo={updateTableFilterInfo}
          // disabled={loading}
          // filterCustomProps={filterCustomProps}
        />
      </TableToolbar>
      <SqlStatusFilterContainer
        lastAuditTime={lastAuditTime}
        value={sqlStatusFilterValue}
        onChange={handleChangeSqlStatus}
        options={sqlStatusFilterOptions}
        auditAction={auditAction}
      />
      <ActiontechTable
        onChange={tableChange}
        columns={columns}
        actions={ScanTypeSqlCollectionColumnAction(() => {
          console.log('分析');
        })}
      />

      {/* <ReportDrawer
        open={reportDrawerVisible}
        onClose={closeReportDrawer}
       
      /> */}
    </ScanTypeSqlCollectionStyleWrapper>
  );
};

export default ScanTypeSqlCollection;
