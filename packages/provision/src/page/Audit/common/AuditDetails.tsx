import { EmptyBox } from '@actiontech/shared';
import { Box } from '@mui/system';
import { Card, Space, Button, Typography, Row, Col, List } from 'antd';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ProvisionTable, { TableColumn } from '~/components/ProvisionTable';
import {
  IAuditDetail,
  IListData,
  columnType
} from '~/page/Audit/common/AuditDetails.d';
import ErrorResult from '../../../components/ErrorResult';

const AuditDetail: <Data extends Record<string, any>>(
  props: IAuditDetail<Data> & {
    children?: React.ReactNode;
  }
) => React.ReactElement = ({ title, columns, dataSource, loading, error }) => {
  const { t } = useTranslation();
  const { actionInfoList, objectInfoList, tableInfoList } = useMemo(() => {
    const actionInfoList: IListData[] = [];
    const objectInfoList: IListData[] = [];
    const tableInfoList: (IListData & {
      columns: TableColumn<typeof dataSource>;
      tableSpan: number;
    })[] = [];
    if (dataSource) {
      columns.forEach((item) => {
        const key = Object.keys(dataSource).find((key) => key === item.key);
        if (!key) return;
        const info = {
          label: item.label,
          value: item.render
            ? item.render(dataSource[key], dataSource)
            : dataSource[key] || '--'
        };
        switch (item.type) {
          case columnType.action:
            actionInfoList.push(info);
            break;
          case columnType.object:
            objectInfoList.push(info);
            break;
          case columnType.table:
            tableInfoList.push({
              ...info,
              columns: item.columns,
              tableSpan: item.tableSpan ?? 12
            });
            break;
        }
      });
    }
    return { actionInfoList, objectInfoList, tableInfoList };
  }, [columns, dataSource]);
  const renderItem = (item: { label: string; value: string }) => {
    return (
      <Typography.Text
        ellipsis={{ tooltip: true }}
        style={{ marginBottom: 16, paddingRight: 16 }}
      >
        {item.label}： {item.value}
      </Typography.Text>
    );
  };
  return (
    <Box
      sx={{
        padding: (theme) => theme.layout.padding
      }}
    >
      <Card
        title={title}
        loading={loading}
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            {t('auth.addAuth.back')}
          </Button>
        }
      >
        <EmptyBox
          if={!!dataSource}
          defaultNode={<ErrorResult errorMessage={error} />}
        >
          <Space direction="vertical" className="full-width-element" size={20}>
            <List
              split={false}
              grid={{ column: 3, xxl: 4 }}
              header={
                <Typography.Title level={5}>
                  {t('provisionAudit.authAuditDetail.subTitle.actionInfo')}
                </Typography.Title>
              }
              dataSource={actionInfoList}
              renderItem={renderItem}
            />
            <List
              split={false}
              grid={{ column: 3, xxl: 4 }}
              header={
                <Typography.Title level={5}>
                  {t('provisionAudit.authAuditDetail.subTitle.objectInfo')}
                </Typography.Title>
              }
              dataSource={objectInfoList}
              renderItem={renderItem}
            />
            <Row>
              {tableInfoList.map((item) => {
                return (
                  <React.Fragment key={item.label}>
                    <Col span={item.tableSpan} style={{ marginBottom: 16 }}>
                      <Space
                        direction="vertical"
                        className="full-width-element"
                      >
                        <span>{item.label}:</span>
                        <ProvisionTable
                          columns={item.columns}
                          dataSource={item.value}
                          rowKey={item.columns?.[0].dataIndex as string}
                          scroll={{ x: 'max-content' }}
                          pagination={{ position: [] }}
                        />
                      </Space>
                    </Col>
                    <Col span={24 - item.tableSpan} />
                  </React.Fragment>
                );
              })}
            </Row>
          </Space>
        </EmptyBox>
      </Card>
    </Box>
  );
};

export default AuditDetail;
