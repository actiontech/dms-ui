import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Col, Form, FormInstance, Row, Space, Typography } from 'antd';
import { ColSize } from 'antd/es/col';
import { debounce } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutType } from '~/data/common';
import { Dictionary, KeyboardType } from '~/types/common.type';
import { cleanEmptyParams } from '~/utils/Common';
import { EmptyBox } from '@actiontech/shared';

import './index.less';
interface ITableFilterForm<T> {
  form: FormInstance<T>;
  updateFilteredInfo: (info: T | null) => void;
  children: React.ReactNode;
  filterFormButtonLayout: Partial<Record<LayoutType, number | ColSize>>;

  collapse?: boolean;
  collapseChange?: () => void;
}

const TableFilterForm: <T extends Record<string, any> = Dictionary>(
  props: ITableFilterForm<T> & {
    children?: React.ReactNode;
  }
) => React.ReactElement = ({
  form,
  updateFilteredInfo,
  children,
  filterFormButtonLayout,
  collapse,
  collapseChange
}) => {
  const { t } = useTranslation();
  const submitFilter = debounce(() => {
    const values = form.getFieldsValue();
    Object.entries(values).forEach(([key, val]) => {
      if (typeof val !== 'string') {
        delete values[key];
      }
    });
    updateFilteredInfo(cleanEmptyParams(values));
  }, 300);

  /**
   * TODO:
   * form resetFields will set value to initValue. but updateFilteredInfo will always set filterInfo to empty object
   */
  const resetFilter = React.useCallback(() => {
    form.resetFields();
    updateFilteredInfo(null);
  }, [form, updateFilteredInfo]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === KeyboardType.Enter) {
      e.stopPropagation();
      submitFilter();
    }
  };

  return (
    <Form form={form} className="filter-form" onKeyDownCapture={handleKeyDown}>
      <Row>
        {children}
        <Col {...filterFormButtonLayout} className="text-align-right">
          <Space style={{ float: 'right' }}>
            <Button onClick={resetFilter}>{t('common.reset')}</Button>
            <Button onClick={submitFilter} type="primary">
              {t('common.search')}
            </Button>
            {collapse !== undefined && (
              <Typography.Link onClick={collapseChange}>
                <EmptyBox
                  if={!collapse}
                  defaultNode={
                    <>
                      {t('common.collapse')}
                      <UpOutlined />
                    </>
                  }
                >
                  {t('common.expansion')}
                  <DownOutlined />
                </EmptyBox>
              </Typography.Link>
            )}
          </Space>
        </Col>
      </Row>
    </Form>
  );
};
export default TableFilterForm;
