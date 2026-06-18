import React, { useCallback, useMemo } from 'react';
import { useBoolean } from 'ahooks';
import { Select } from 'antd';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import {
  IListDBServiceTipItem,
  IListDBServiceV2
} from '@actiontech/shared/lib/api/base/service/common';
import { DatabaseTypeLogo, ResponseCode } from '@actiontech/dms-kit';
import { EnvironmentTag } from '@actiontech/shared';
import DBService from '@actiontech/shared/lib/api/base/service/DBService';
import { IListDBServiceTipsParams } from '@actiontech/shared/lib/api/base/service/DBService/index.d';

const getDbServiceDisplayLabel = (dbService: IListDBServiceTipItem) => {
  return !!dbService.host && !!dbService.port
    ? `${dbService.name} (${dbService.host}:${dbService.port})`
    : dbService.name;
};

const renderDbServiceOptionLabel = (dbService: IListDBServiceTipItem) => {
  return (
    <span
      className="db-service-option-label"
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      <EnvironmentTag
        name={dbService.environment_tag?.name}
        color={dbService.environment_tag?.color}
        size="small"
        style={{ marginRight: 6 }}
      />
      <span>{getDbServiceDisplayLabel(dbService)}</span>
    </span>
  );
};

const mergeDbServiceEnvironmentTag = (
  tips: IListDBServiceTipItem[],
  dbServices: IListDBServiceV2[]
) => {
  if (dbServices.length === 0) {
    return tips;
  }

  return tips.map((tip) => {
    const dbService = dbServices.find(
      (item) => item.uid === tip.id || item.name === tip.name
    );

    if (!dbService?.environment_tag) {
      return tip;
    }

    return {
      ...tip,
      environment_tag: dbService.environment_tag
    };
  });
};

const useDbService = () => {
  const [dbServiceList, setDbServiceList] = React.useState<
    IListDBServiceTipItem[]
  >([]);
  const [loading, { setTrue, setFalse }] = useBoolean();
  const { getLogoUrlByDbType } = useDbServiceDriver();
  const updateDbServiceList = React.useCallback(
    (params: IListDBServiceTipsParams) => {
      setTrue();
      DBService.ListDBServiceTips(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            const tips = res.data?.data ?? [];
            setDbServiceList(tips);

            if (!params.project_uid || tips.length === 0) {
              return;
            }

            DBService.ListDBServicesV2({
              project_uid: params.project_uid,
              page_index: 1,
              page_size: 999
            })
              .then((dbServicesRes) => {
                if (dbServicesRes.data.code !== ResponseCode.SUCCESS) {
                  return;
                }

                setDbServiceList(
                  mergeDbServiceEnvironmentTag(
                    tips,
                    dbServicesRes.data?.data ?? []
                  )
                );
              })
              .catch(() => {
                setDbServiceList(tips);
              });
          } else {
            setDbServiceList([]);
          }
        })
        .catch(() => {
          setDbServiceList([]);
        })
        .finally(() => {
          setFalse();
        });
    },
    [setFalse, setTrue]
  );
  const dbTypeList: string[] = useMemo(
    () => Array.from(new Set(dbServiceList.map((v) => v.db_type ?? ''))),
    [dbServiceList]
  );
  const generateCommonOptions = React.useCallback(
    (valueType: 'id' | 'name') => {
      return dbTypeList.map((type) => {
        return (
          <Select.OptGroup
            label={
              <DatabaseTypeLogo
                dbType={type ?? ''}
                logoUrl={getLogoUrlByDbType(type ?? '')}
              />
            }
            key={type}
          >
            {dbServiceList
              .filter((db) => db.db_type === type)
              .map((db) => {
                const id = db.id ?? '';
                const name = db.name ?? '';
                const label = getDbServiceDisplayLabel(db);
                return (
                  <Select.Option
                    key={db.id}
                    value={valueType === 'id' ? id : name}
                    label={label}
                    title={label}
                  >
                    {renderDbServiceOptionLabel(db)}
                  </Select.Option>
                );
              })}
          </Select.OptGroup>
        );
      });
    },
    [dbServiceList, dbTypeList, getLogoUrlByDbType]
  );

  /**
   * 提供 value 为 id 的 数据源options
   */
  const generateDbServiceIDSelectOptions = React.useCallback(() => {
    return generateCommonOptions('id');
  }, [generateCommonOptions]);
  const generateDbServiceSelectOptions = React.useCallback(() => {
    return generateCommonOptions('name');
  }, [generateCommonOptions]);
  const generateCommonDbServiceOptions = React.useCallback(
    (valueType: 'id' | 'name') => {
      return dbTypeList.map((type) => ({
        label: (
          <DatabaseTypeLogo
            dbType={type ?? ''}
            logoUrl={getLogoUrlByDbType(type ?? '')}
          />
        ),
        options: dbServiceList
          .filter((db) => db.db_type === type)
          .map((db) => ({
            value: valueType === 'id' ? db?.id : db?.name,
            text: getDbServiceDisplayLabel(db),
            title: getDbServiceDisplayLabel(db),
            label: renderDbServiceOptionLabel(db)
          }))
      }));
    },
    [dbServiceList, dbTypeList, getLogoUrlByDbType]
  );
  const dbServiceOptions = useMemo(() => {
    return generateCommonDbServiceOptions('name');
  }, [generateCommonDbServiceOptions]);
  const dbServiceIDOptions = useMemo(() => {
    return generateCommonDbServiceOptions('id');
  }, [generateCommonDbServiceOptions]);

  const getServiceDbType = useCallback(
    (id: string) => {
      return dbServiceList.find((i) => i.id === id)?.db_type ?? '';
    },
    [dbServiceList]
  );

  return {
    dbServiceList,
    dbServiceOptions,
    loading,
    updateDbServiceList,
    generateDbServiceSelectOptions,
    generateDbServiceIDSelectOptions,
    dbServiceIDOptions,
    getServiceDbType
  };
};
export default useDbService;
