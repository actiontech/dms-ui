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

import { AuditPlanTypesV1InstanceTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
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

  const { allDataSource, allTaskType, relationalData } = useMemo(() => {
    if (!auditPlanTypes.length) {
      return {
        allDataSource: [],
        allTaskType: [],
        relationalData: {}
      };
    }
    const auditPlanTypesDictionary = groupBy(auditPlanTypes, 'instance_type');
    const allDataSource = Object.keys(auditPlanTypesDictionary);

    const dataTypeSource: Set<string> = new Set();
    const relationalData: {
      [key: string]: {
        desc?: string;
        instance_type?: AuditPlanTypesV1InstanceTypeEnum;
        type?: string;
        showDesc?: IAuditPlanTypesV1['desc'];
      }[];
    } = {};
    auditPlanTypes.forEach((item: IAuditPlanTypesV1) => {
      const { instance_type, desc } = item;
      // tidy type
      const currentDesc =
        desc && /Top\s+SQL$/i.test(desc)
          ? 'Top SQL'
          : desc ?? 'custom_action_desc';
      currentDesc && dataTypeSource.add(currentDesc);
      if (typeof instance_type === undefined) {
        return;
      }
      const mainCateKey = instance_type ?? 'custom_action_main_cate';
      if (!relationalData[mainCateKey]) {
        relationalData[mainCateKey] = [
          {
            ...item,
            showDesc: currentDesc
          }
        ];
      } else {
        relationalData[mainCateKey].push({
          ...item,
          showDesc: currentDesc
        });
      }
      // child cate -> main cate
      const typeCate = currentDesc ?? 'custom_action_type';
      if (!relationalData[typeCate]) {
        relationalData[typeCate] = [
          {
            ...item,
            showDesc: currentDesc
          }
        ];
      } else {
        relationalData[typeCate].push({
          ...item,
          showDesc: currentDesc
        });
      }
    });

    return {
      allDataSource: allDataSource,
      allTaskType: Array.from(dataTypeSource),
      relationalData
    };
  }, [auditPlanTypes]);

  const onUpdateDataSourceType = (value: string) => {
    setDataSourceType(value === dataSourceType ? '' : value);
  };

  const onUpdateTaskType = (value: string) => {
    setTaskType(value === taskType ? '' : value);
  };

  const computedEnabled = (value: string, type: string) => {
    if (!value) {
      return false;
    }
    if (
      dataSourceType === enumPageDefault.allTypeVal &&
      taskType === enumPageDefault.allTypeVal
    ) {
      return false;
    }
    if (type === enumComputedEnabledType.dataSource) {
      const currentRelationalData = Array.isArray(relationalData[taskType])
        ? relationalData[taskType]
        : undefined;
      if (!currentRelationalData) {
        return false;
      }
      const enableData =
        currentRelationalData.length === 1
          ? [currentRelationalData[0]?.instance_type]
          : currentRelationalData.map((item) => item?.instance_type);
      if (enableData[0] === '') {
        return false;
      }
      return !enableData.includes(value as AuditPlanTypesV1InstanceTypeEnum);
    }
    if (type === enumComputedEnabledType.task) {
      if (
        dataSourceType === enumPageDefault.allTypeVal &&
        taskType !== enumPageDefault.allTypeVal
      ) {
        return false;
      }
      const currentRelationalData = Array.isArray(
        relationalData[dataSourceType]
      )
        ? relationalData[dataSourceType]
        : undefined;
      const globalRelationalData = Array.isArray(relationalData[''])
        ? relationalData[''].map((item) => item.showDesc)
        : [];
      if (!currentRelationalData && !globalRelationalData.length) {
        return false;
      }
      return ![
        ...(currentRelationalData ?? []).map((item) => item.showDesc),
        ...globalRelationalData
      ].includes(value);
    }
    return false;
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

  const renderTaskTypeItem = () => {
    return allTaskType.map((type) => {
      return (
        <FilterButtonStyleWrapper
          key={type}
          size="small"
          className={classNames('filter-btn', {
            'checked-item': type === taskType
          })}
          onClick={() => onUpdateTaskType(type ?? '')}
          disabled={computedEnabled(type ?? '', enumComputedEnabledType.task)}
        >
          {type}
        </FilterButtonStyleWrapper>
      );
    });
  };

  useEffect(() => {
    const comTaskType =
      taskType && taskType !== enumPageDefault.allTypeVal
        ? Array.isArray(relationalData[taskType])
          ? relationalData[taskType][0]?.type ?? ''
          : ''
        : '';
    updateParams({
      dataSourceType,
      taskType: comTaskType
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSourceType, taskType]);

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
