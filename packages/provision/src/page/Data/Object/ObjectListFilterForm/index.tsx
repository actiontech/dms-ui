import { Col, Form, Input } from 'antd';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { TableFilterForm } from '~/components/ProvisionTable';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout
} from '~/data/common';
export interface IFilteredInfo {
  filter_by_address?: string;
  filter_by_user?: string;
}

interface IObjectListFilterForm {
  setFilteredInfo: (info: IFilteredInfo | null) => void;
}

const ObjectListFilterForm: FC<IObjectListFilterForm> = ({
  setFilteredInfo
}) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm<IFilteredInfo>();
  const [params] = useSearchParams();
  const address = params.get('address');
  const user = params.get('user');

  useEffect(() => {
    const flag: IFilteredInfo = {};
    if (address !== null) {
      flag.filter_by_address = address;
    }
    if (user !== null) {
      flag.filter_by_user = user;
    }
    if (Object.keys(flag).length) {
      filterForm.setFieldsValue(flag);
      setFilteredInfo(flag);
    }
  }, [filterForm, address, setFilteredInfo, user]);
  return (
    <TableFilterForm
      form={filterForm}
      updateFilteredInfo={setFilteredInfo}
      filterFormButtonLayout={filterFormButtonLayoutFactory(12, 0, 6)}
    >
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_address"
          label={t('dataObject.dataSource.address')}
        >
          <Input allowClear />
        </Form.Item>
      </Col>
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_user"
          label={t('dataObject.dataSource.user')}
        >
          <Input allowClear />
        </Form.Item>
      </Col>
    </TableFilterForm>
  );
};

export default ObjectListFilterForm;
