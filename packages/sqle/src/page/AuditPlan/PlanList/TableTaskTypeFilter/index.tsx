import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { groupBy } from 'lodash';

import { Spin } from 'antd';
import { TableTaskTypeFilterStyleWrapper } from './style';
import {
  FilterButtonStyleWrapper,
  FilterButtonLabelStyleWrapper
} from '@actiontech/shared/lib/styleWrapper/element';

import useAuditPlanTypes from '../../../../hooks/useAuditPlanTypes';
import { IAuditPlanTypesV1 } from '@actiontech/shared/lib/api/sqle/service/common';

export const defaultAllVal = '';

export enum enumComputedEnabledType {
  dataSource = 'data-source-type',
  task = 'task'
}

export enum enumPageDefault {
  allTypeVal = '',
  computedEnabledVal = 'all'
}

export interface ITableTaskTypeFilter {
  updateParams: (data: { dataSourceType: string; taskType: string }) => void;
}

const TableTaskTypeFilter = (props: ITableTaskTypeFilter) => {
  const { t } = useTranslation();
  const { updateParams } = props;
  const [dataSourceType, setDataSourceType] = useState<
    string | typeof enumPageDefault.allTypeVal
  >(enumPageDefault.allTypeVal);
  const [taskType, setTaskType] = useState<
    string | typeof enumPageDefault.allTypeVal
  >(enumPageDefault.allTypeVal);

  const { loading, auditPlanTypes, updateAuditPlanTypes } = useAuditPlanTypes();

  useEffect(() => {
    updateAuditPlanTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateParams({
      dataSourceType,
      taskType
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceType, taskType]);

  const { allDataSource, allTaskType, dataSourceGroupByTaskType, globalTask } =
    useMemo(() => {
      if (!auditPlanTypes.length) {
        return {
          allDataSource: [],
          allTaskType: [],
          dataSourceGroupByTaskType: {},
          globalTask: []
        };
      }
      const auditPlanTypesDictionary = groupBy(auditPlanTypes, 'instance_type');
      const allDataSource = Object.keys(auditPlanTypesDictionary);
      const dataKeysDictionary: { [key: string]: string[] } = {};
      allDataSource.forEach((item: string) => {
        dataKeysDictionary[item] = auditPlanTypesDictionary[item].map(
          (subItem) => subItem.type ?? ''
        );
      });

      return {
        allDataSource,
        allTaskType: auditPlanTypes,
        dataSourceGroupByTaskType: dataKeysDictionary,
        globalTask: dataKeysDictionary['']
      };
    }, [auditPlanTypes]);

  const renderTaskTypeItem = () => {
    return allTaskType.map((item: IAuditPlanTypesV1) => {
      return (
        <FilterButtonStyleWrapper
          key={item.type}
          size="small"
          className={classNames('filter-btn', {
            'checked-item': item.type === taskType
          })}
          onClick={() => onUpdateTaskType(item.type ?? '')}
          disabled={computedEnabled(
            item.type ?? '',
            enumComputedEnabledType.task
          )}
        >
          {item.desc}
        </FilterButtonStyleWrapper>
      );
    });
  };

  const renderDataSourceItem = () => {
    return allDataSource
      .filter((type) => type)
      .map((type: string) => {
        return (
          <FilterButtonStyleWrapper
            key={type}
            size="small"
            className={classNames('filter-btn', {
              'checked-item': type === dataSourceType
            })}
            onClick={() => onUpdateDataSourceType(type ?? '')}
            disabled={computedEnabled(type, enumComputedEnabledType.dataSource)}
          >
            {type}
          </FilterButtonStyleWrapper>
        );
      });
  };

  const onUpdateTaskType = (value: string) => {
    setTaskType(value === taskType ? '' : value);
  };

  const onUpdateDataSourceType = (value: string) => {
    setDataSourceType(value === dataSourceType ? '' : value);
  };

  const computedEnabled = (value: string, type: string) => {
    if (
      type === enumComputedEnabledType.dataSource &&
      globalTask.includes(taskType)
    ) {
      return false;
    }
    const compareData =
      type === enumComputedEnabledType.dataSource
        ? canClickData.dataType
        : canClickData.taskType;
    if (
      typeof compareData === 'string' &&
      compareData === enumPageDefault.computedEnabledVal
    ) {
      return false;
    }
    return !compareData.includes(value);
  };

  const canClickData = useMemo(() => {
    let dataTypeData: string | string[] = enumPageDefault.computedEnabledVal;
    let taskTypeData: string | string[] = enumPageDefault.computedEnabledVal;
    if (dataSourceType) {
      taskTypeData = (dataSourceGroupByTaskType[dataSourceType] ?? []).concat(
        globalTask
      );
    } else {
      taskTypeData = enumPageDefault.computedEnabledVal;
    }
    if (taskType) {
      const filterIndex = Object.values(dataSourceGroupByTaskType).findIndex(
        (type) => type.includes(taskType)
      );
      filterIndex !== -1 && (dataTypeData = allDataSource[filterIndex]);
    } else {
      dataTypeData = enumPageDefault.computedEnabledVal;
    }
    return {
      dataType: dataTypeData,
      taskType: taskTypeData
    };
  }, [
    dataSourceType,
    taskType,
    dataSourceGroupByTaskType,
    allDataSource,
    globalTask
  ]);

  return (
    <TableTaskTypeFilterStyleWrapper>
      <Spin spinning={loading} delay={300}>
        <section className="type-filter-line">
          <FilterButtonLabelStyleWrapper>
            {t('auditPlan.list.filter.all.dataSource')}
          </FilterButtonLabelStyleWrapper>
          {renderDataSourceItem()}
        </section>
        <section className="type-filter-line">
          <FilterButtonLabelStyleWrapper>
            {t('auditPlan.list.filter.all.taskType')}
          </FilterButtonLabelStyleWrapper>
          {renderTaskTypeItem()}
        </section>
      </Spin>
    </TableTaskTypeFilterStyleWrapper>
  );
};

export default TableTaskTypeFilter;
