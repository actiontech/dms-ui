import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../../../store';
import { ModalName } from '../../../../../data/ModalName';
import { useCallback, useEffect, useState } from 'react';
import {
  initSqlInsightsModalStatus,
  updateSqlInsightsModalStatus
} from '../../../../../store/sqlInsights';
import { useTranslation } from 'react-i18next';
import { BasicDrawer } from '@actiontech/shared/lib/components/BasicDrawer';
import { BasicButton, HighlightCode, EmptyBox } from '@actiontech/shared';
import { Descriptions, Divider, Steps, Typography, Spin } from 'antd';
import {
  IRelatedSQLInfo,
  IRelatedTransactionInfo
} from '@actiontech/shared/lib/api/sqle/service/common';
import { SqleApi } from '@actiontech/shared/lib/api/';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import {
  TransactionInfoLockTypeEnumDict,
  TransactionInfoLockTypeEnumFlagDict
} from './data';

const SqlRelatedTransactionDrawer = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [loading, setLoading] = useState(false);
  const [transactionData, setTransactionData] =
    useState<IRelatedTransactionInfo>();

  const dispatch = useDispatch();

  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.sqlInsights.modalStatus[
        ModalName.Sql_Insights_Related_SQL_Item_Relate_Transaction_Drawer
      ]
  );

  const selectedRecord = useSelector<IReduxState, IRelatedSQLInfo | null>(
    (state) => state.sqlInsights.relateSqlList.selectedRecord
  );

  const closeModal = useCallback(() => {
    dispatch(
      updateSqlInsightsModalStatus({
        modalName:
          ModalName.Sql_Insights_Related_SQL_Item_Relate_Transaction_Drawer,
        status: false
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      initSqlInsightsModalStatus({
        modalStatus: {
          [ModalName.Sql_Insights_Related_SQL_Item_Relate_Transaction_Drawer]:
            false
        }
      })
    );
  }, [dispatch]);

  const onShowSQAnalysis = useCallback(() => {
    // console.log('onShowSQAnalysis');
  }, []);

  const getTransactionData = useCallback(async () => {
    if (!projectName || !selectedRecord || !visible) return;

    setLoading(true);
    try {
      const res =
        // fixme: 这个接口的参数还为确定。需要跟具体实现的后端讨论。
        await SqleApi.SqlInsightService.GetSqlPerformanceInsightsRelatedTransaction(
          {
            project_name: projectName,
            instance_id: '123',
            sql_id: '123'
          }
        );
      setTransactionData(res.data.data);
    } finally {
      setLoading(false);
    }
  }, [projectName, selectedRecord, visible]);

  useEffect(() => {
    getTransactionData();
  }, [getTransactionData]);

  return (
    <BasicDrawer
      open={visible}
      title={t('sqlInsights.relatedSqlList.sqlRelatedTransaction.title')}
      onClose={closeModal}
      extra={
        <BasicButton type="primary" onClick={onShowSQAnalysis}>
          {t(
            'sqlInsights.relatedSqlList.sqlRelatedTransaction.actions.showSQAnalysis'
          )}
        </BasicButton>
      }
      width={520}
    >
      <Spin spinning={loading}>
        <EmptyBox
          if={!!transactionData}
          defaultNode={
            <Typography.Text type="secondary">
              {t('sqlInsights.relatedSqlList.sqlRelatedTransaction.noData')}
            </Typography.Text>
          }
        >
          {/* 抽屉内容 */}
          <Typography.Title level={5}>
            {t('sqlInsights.relatedSqlList.sqlRelatedTransaction.originalSql')}
          </Typography.Title>
          <div
            dangerouslySetInnerHTML={{
              __html: HighlightCode.highlightSql(
                selectedRecord?.sql_fingerprint ?? ''
              )
            }}
          />
          <Divider />
          <Descriptions column={2}>
            <Descriptions.Item
              label={t(
                'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.id'
              )}
            >
              {transactionData?.transaction_info?.transaction_id || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={t(
                'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.lockType'
              )}
            >
              {transactionData?.transaction_info?.lock_type
                ? TransactionInfoLockTypeEnumDict[
                    transactionData?.transaction_info?.lock_type
                  ]
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={t(
                'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.duration'
              )}
            >
              {transactionData?.transaction_info?.transaction_duration || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={t(
                'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.startTime'
              )}
            >
              {transactionData?.transaction_info?.transaction_start_time || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={t(
                'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.state'
              )}
            >
              {transactionData?.transaction_info?.transaction_state || '-'}
            </Descriptions.Item>
            <Descriptions.Item
              label={t(
                'sqlInsights.relatedSqlList.sqlRelatedTransaction.transactionInfo.commitTime'
              )}
            >
              {transactionData?.transaction_info?.transaction_start_time || '-'}
            </Descriptions.Item>
          </Descriptions>
          <Divider />
          <Typography.Title level={5}>
            {t('sqlInsights.relatedSqlList.sqlRelatedTransaction.timeline')}
          </Typography.Title>
          <Steps
            direction="vertical"
            progressDot
            current={
              transactionData?.transaction_timeline?.current_step_index || 0
            }
            items={
              transactionData?.transaction_timeline?.timeline?.map((item) => ({
                title: item.start_time,
                description: item.description
              })) || []
            }
          />
          <Divider />
          <Typography.Title level={5}>
            {t(
              'sqlInsights.relatedSqlList.sqlRelatedTransaction.relatedSqlList'
            )}
          </Typography.Title>
          <div className="sql-list">
            {transactionData?.related_sql_info?.map((sql, index) => (
              <div className="sql-list-item" key={index}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: HighlightCode.highlightSql(sql.sql || '')
                  }}
                />
                <div className="sql-list-item-info">
                  <Descriptions column={3}>
                    <Descriptions.Item
                      label={t(
                        'sqlInsights.relatedSqlList.sqlRelatedTransaction.sqlInfo.executeDuration'
                      )}
                    >
                      {sql.execute_duration || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item
                      label={t(
                        'sqlInsights.relatedSqlList.sqlRelatedTransaction.sqlInfo.lockType'
                      )}
                    >
                      {sql.lock_type
                        ? TransactionInfoLockTypeEnumDict[sql.lock_type]
                        : '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="">
                      <Typography.Link>
                        {t(
                          'sqlInsights.relatedSqlList.sqlRelatedTransaction.sqlInfo.sqlAnalysis'
                        )}
                      </Typography.Link>
                    </Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            ))}
          </div>
          <Divider />
          <Typography.Title level={5}>
            {t(
              'sqlInsights.relatedSqlList.sqlRelatedTransaction.lockAnalysis.title'
            )}
          </Typography.Title>
          <Typography.Paragraph>
            <EmptyBox
              if={!!((transactionData?.transaction_lock_info?.length ?? 0) > 0)}
              defaultNode={t(
                'sqlInsights.relatedSqlList.sqlRelatedTransaction.lockAnalysis.noData'
              )}
            >
              <ul>
                {transactionData?.transaction_lock_info?.map((lock, index) => (
                  <li key={index}>
                    {t(
                      'sqlInsights.relatedSqlList.sqlRelatedTransaction.lockAnalysis.desc',
                      {
                        table_name: lock.table_name,
                        lock_type: lock.lock_type
                          ? `${
                              TransactionInfoLockTypeEnumDict[lock.lock_type]
                            } (${
                              TransactionInfoLockTypeEnumFlagDict[
                                lock.lock_type
                              ]
                            })`
                          : '-',
                        create_lock_sql: lock.create_lock_sql
                      }
                    )}
                  </li>
                ))}
              </ul>
            </EmptyBox>
          </Typography.Paragraph>
        </EmptyBox>
      </Spin>
    </BasicDrawer>
  );
};

export default SqlRelatedTransactionDrawer;
