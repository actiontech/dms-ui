import { AuthListDataOperationSetsFilterByDbTypeEnum } from '@actiontech/shared/lib/api/provision/service/auth/index.enum';
import { Col, Form, Input, Select } from 'antd';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TableFilterForm } from '~/components/ProvisionTable';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout
} from '~/data/common';
export interface IFilteredInfo {
  filter_by_field_name: string;
  filter_by_db_type: AuthListDataOperationSetsFilterByDbTypeEnum;
}

interface IOperationListFilterForm {
  setFilteredInfo: (info: IFilteredInfo | null) => void;
}

const OperationListFilterForm: FC<IOperationListFilterForm> = ({
  setFilteredInfo
}) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm<IFilteredInfo>();
  return (
    <TableFilterForm
      form={filterForm}
      updateFilteredInfo={setFilteredInfo}
      filterFormButtonLayout={filterFormButtonLayoutFactory(12, 0, 6)}
    >
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_field_name"
          label={t('operation.tableColumns.name')}
        >
          <Input allowClear />
        </Form.Item>
      </Col>
      <Col {...FilterFormColLayout}>
        <Form.Item
          name="filter_by_db_type"
          label={t('operation.tableColumns.type')}
        >
          <Select options={mysqlTypeOptions} allowClear={true} />
        </Form.Item>
      </Col>
    </TableFilterForm>
  );
};

export default OperationListFilterForm;

const mysqlTypeOptions = [
  {
    value: AuthListDataOperationSetsFilterByDbTypeEnum.MySQL,
    label: 'MySQL'
  },
  {
    value: AuthListDataOperationSetsFilterByDbTypeEnum.OceanBaseMySQL,
    label: 'OceanBaseMySQL'
  }
];
