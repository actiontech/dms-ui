import { BasicSegmented, EmptyBox } from '@actiontech/shared';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { Divider, Space } from 'antd';
import { ToggleButtonStyleWrapper } from '../style';
import DownloadRecord from '../DownloadRecord';
import AuditResultFilterContainer from '../AuditResultFilterContainer';
import AuditResultTable from './List';
import { useEffect, useMemo, useState } from 'react';
import { AuditResultListProps } from './index.type';
import InstanceSegmentedLabel from '../InstanceSegmentedLabel';
import { AuditTaskResV1AuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { AuditResultLevelFilterType } from '../../Create/AuditResult/index.type';
import { AuditResultFilterOptionsType } from '../AuditResultFilterContainer/index.type';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { auditLevelDictionary } from '../../../../hooks/useStaticStatus/index.data';
import { useTranslation } from 'react-i18next';
import { AuditResultForCreateOrderStyleWrapper } from './style';

const AuditResultList: React.FC<AuditResultListProps> = ({
  tasks,
  projectID,
  updateTaskRecordTotalNum,
  ...props
}) => {
  const { t } = useTranslation();
  const { mode = 'order' } = props;
  const isOrder = useMemo(() => mode === 'order', [mode]);

  const [currentTaskID, setCurrentTaskID] = useState<string>();
  const [duplicate, setDuplicate] = useState(false);
  const [auditLevelFilterValue, setAuditLevelFilterValue] =
    useState<AuditResultLevelFilterType>('all');

  const currentTask = useMemo(
    () => tasks.find((v) => `${v.task_id}` === currentTaskID),
    [currentTaskID, tasks]
  );

  const handleChangeCurrentTask = (taskID?: string) => {
    setCurrentTaskID(taskID);
  };

  const generateCurrentTaskLabel = (
    instanceName?: string,
    auditLevel?: AuditTaskResV1AuditLevelEnum
  ) => {
    if (!instanceName) {
      return '-';
    }

    return (
      <InstanceSegmentedLabel
        instanceName={instanceName}
        auditLevel={auditLevel}
      />
    );
  };
  //todo 需要后端支持 http://10.186.18.11/jira/browse/DMS-424
  const filterOptions: AuditResultFilterOptionsType<AuditResultLevelFilterType>[] =
    Object.keys(getAuditTaskSQLsV2FilterAuditLevelEnum).map<
      AuditResultFilterOptionsType<AuditResultLevelFilterType>
    >((v) => {
      const key = v as getAuditTaskSQLsV2FilterAuditLevelEnum;
      return {
        value: key,
        label: t(auditLevelDictionary[key])
        // num: 299
      };
    });

  useEffect(() => {
    if (typeof tasks?.[0]?.task_id !== 'undefined') {
      setCurrentTaskID(`${tasks[0].task_id}`);
    }
  }, [tasks]);

  return (
    <AuditResultForCreateOrderStyleWrapper>
      <SegmentedRowStyleWrapper justify={'space-between'}>
        {isOrder ? (
          <BasicSegmented
            value={currentTaskID}
            onChange={(v) => handleChangeCurrentTask(v as string)}
            options={tasks.map((v) => ({
              label: generateCurrentTaskLabel(v.instance_name, v.audit_level),
              value: !!v?.task_id ? `${v.task_id}` : '',
              key: v.task_id
            }))}
          />
        ) : (
          <div />
        )}
        <Space size={4}>
          <ToggleButtonStyleWrapper
            active={duplicate}
            onClick={() => setDuplicate(!duplicate)}
          >
            {t('order.createOrder.auditResult.duplicate')}
          </ToggleButtonStyleWrapper>

          <Divider type="vertical" style={{ height: 28 }} />
          <EmptyBox if={!!currentTaskID}>
            <DownloadRecord duplicate={duplicate} taskId={currentTaskID!} />
          </EmptyBox>
        </Space>
      </SegmentedRowStyleWrapper>

      {/* todo: 数据需要后端接口支持 http://10.186.18.11/jira/browse/DMS-424*/}
      <AuditResultFilterContainer<AuditResultLevelFilterType>
        passRate={currentTask?.pass_rate}
        score={currentTask?.score}
        instanceSchemaName={isOrder ? currentTask?.instance_schema : ''}
        filterOptions={[
          {
            value: 'all',
            label: t('order.createOrder.auditResult.allLevel')
            // num: 299 * 4
          },
          ...filterOptions
        ]}
        filterValue={auditLevelFilterValue}
        filterValueChange={setAuditLevelFilterValue}
        auditLevel={currentTask?.audit_level}
      />

      <AuditResultTable
        taskID={currentTaskID}
        duplicate={duplicate}
        auditLevelFilterValue={auditLevelFilterValue}
        projectID={projectID}
        updateTaskRecordTotalNum={updateTaskRecordTotalNum}
        dbType={currentTask?.instance_db_type}
        instanceName={currentTask?.instance_name}
        schema={currentTask?.instance_schema}
      />
    </AuditResultForCreateOrderStyleWrapper>
  );
};

export default AuditResultList;
