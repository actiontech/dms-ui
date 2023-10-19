import { Col, Form, Input } from 'antd';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TableFilterForm } from '~/components/ProvisionTable';
import {
  filterFormButtonLayoutFactory,
  FilterFormColLayout
} from '~/data/common';
export interface IFilteredInfo {
  filter_by_name: string;
}

interface IAuthTemplateListFilterForm {
  setFilteredInfo: (info: IFilteredInfo | null) => void;
}

const AuthTemplateListFilterForm: FC<IAuthTemplateListFilterForm> = ({
  setFilteredInfo
}) => {
  const { t } = useTranslation();
  const [filterForm] = Form.useForm<IFilteredInfo>();

  const { name } = useParams();
  useEffect(() => {
    if (name !== undefined) {
      filterForm.setFieldsValue({
        filter_by_name: name
      });
      setFilteredInfo({
        filter_by_name: name
      });
    }
  }, [filterForm, name, setFilteredInfo]);
  return (
    <TableFilterForm
      form={filterForm}
      updateFilteredInfo={setFilteredInfo}
      filterFormButtonLayout={filterFormButtonLayoutFactory(0, 8, 12)}
    >
      <Col {...FilterFormColLayout}>
        <Form.Item name="filter_by_name" label={t('auth.template.searchLabel')}>
          <Input allowClear />
        </Form.Item>
      </Col>
    </TableFilterForm>
  );
};

export default AuthTemplateListFilterForm;
