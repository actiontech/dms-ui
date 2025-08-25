import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { groupBy } from 'lodash';
import { TableTaskTypeFilterStyleWrapper } from './style';
import {
  FilterButtonStyleWrapper,
  FilterButtonLabelStyleWrapper
} from '@actiontech/dms-kit';
import { AuditPlanTypesV1InstanceTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAuditPlanTypesV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { TableTaskTypeFilterProps } from './index.type';
import { ComputedEnabledTypeEnum, PageDefaultEnum } from './index.enum';

const TableTaskTypeFilter = (props: TableTaskTypeFilterProps) => {
  const { t } = useTranslation();
  const { updateParams, auditPlanTypes } = props;
  const [dataSourceType, setDataSourceType] = useState<
    string | typeof PageDefaultEnum.allTypeVal
  >(PageDefaultEnum.allTypeVal);
  const [taskType, setTaskType] = useState<
    string | typeof PageDefaultEnum.allTypeVal
  >(PageDefaultEnum.allTypeVal);

  const { allDataSource, allTaskType, relationalData } = useMemo(() => {
    if (!auditPlanTypes.length) {
      return {
        allDataSource: [],
        allTaskType: [],
        relationalData: {}
      };
    }
    const auditPlanTypesDictionary = groupBy(auditPlanTypes, 'instance_type');

    const dataTypeSource: Set<string> = new Set();
    const innerRelationalData: {
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
      if (currentDesc) {
        dataTypeSource.add(currentDesc);
      }
      if (typeof instance_type === undefined) {
        return;
      }
      const mainCateKey = instance_type ?? 'custom_action_main_cate';
      if (!innerRelationalData[mainCateKey]) {
        innerRelationalData[mainCateKey] = [
          {
            ...item,
            showDesc: currentDesc
          }
        ];
      } else {
        innerRelationalData[mainCateKey].push({
          ...item,
          showDesc: currentDesc
        });
      }
      // child cate -> main cate
      const typeCate = currentDesc ?? 'custom_action_type';
      if (!innerRelationalData[typeCate]) {
        innerRelationalData[typeCate] = [
          {
            ...item,
            showDesc: currentDesc
          }
        ];
      } else {
        innerRelationalData[typeCate].push({
          ...item,
          showDesc: currentDesc
        });
      }
    });

    return {
      allDataSource: Object.keys(auditPlanTypesDictionary),
      allTaskType: Array.from(dataTypeSource),
      relationalData: innerRelationalData
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
      dataSourceType === PageDefaultEnum.allTypeVal &&
      taskType === PageDefaultEnum.allTypeVal
    ) {
      return false;
    }
    if (type === ComputedEnabledTypeEnum.dataSource) {
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
    if (type === ComputedEnabledTypeEnum.task) {
      if (
        dataSourceType === PageDefaultEnum.allTypeVal &&
        taskType !== PageDefaultEnum.allTypeVal
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
            disabled={computedEnabled(type, ComputedEnabledTypeEnum.dataSource)}
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
          disabled={computedEnabled(type ?? '', ComputedEnabledTypeEnum.task)}
        >
          {type}
        </FilterButtonStyleWrapper>
      );
    });
  };

  useEffect(() => {
    const comTaskType =
      taskType && taskType !== PageDefaultEnum.allTypeVal
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
      <section className="type-filter-line">
        <FilterButtonLabelStyleWrapper>
          {t('managementConf.list.table.filter.taskType.allDataSource')}
        </FilterButtonLabelStyleWrapper>
        {renderDataSourceItem()}
      </section>
      <section className="type-filter-line">
        <FilterButtonLabelStyleWrapper>
          {t('managementConf.list.table.filter.taskType.allTaskType')}
        </FilterButtonLabelStyleWrapper>
        {renderTaskTypeItem()}
      </section>
    </TableTaskTypeFilterStyleWrapper>
  );
};

export default TableTaskTypeFilter;
