import { cloneDeep, isEqual } from 'lodash';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Select, Typography, Space } from 'antd5';
import { IDataObjects, IFormFields, IAddDataPermission } from './index.d';
import { DefaultOptionType } from 'antd/es/select';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { useQueryData } from './hooks/useQueryData';
import { AuthDataPermissionListModalStatus } from '~/store/auth/templateList';
import { getObjectsLabelByDataObjects } from '../../index.utils';
import {
  BasicButton,
  BasicDrawer,
  BasicSelect,
  BasicToolTips,
  EmptyBox
} from '@actiontech/shared';
import { IconSyncDictionary } from '~/icon/AuthTemplate';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  IconFormListAdd,
  IconFormListDelete
} from '@actiontech/shared/lib/Icon';
import {
  DrawerFormIconWrapper,
  FormListAddButtonWrapper
} from '@actiontech/shared/lib/styleWrapper/element';

const AddDataPermission: FC<IAddDataPermission> = ({
  dataPermissions,
  setDataPermissions,
  editIndex,
  setEditIndex
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<IFormFields>();

  const { toggleModal, visible } = useModalStatus(
    AuthDataPermissionListModalStatus,
    ModalName.DataPermissionModal
  );

  const closeModal = () => {
    form.resetFields();
    setDuplicateError(false);
    setSelectedDatabase([]);
    setTableOptions([]);
    setEditIndex();
    toggleModal(ModalName.DataPermissionModal, false);
  };

  const [duplicateError, setDuplicateError] = useState(false);
  const submit = () => {
    form.validateFields().then((res) => {
      if (
        dataPermissions.find((item) => {
          return (
            item.serviceValue === res.service &&
            isEqual(item.objectsValue, res.data_objects) &&
            isEqual(item.operationsValue, res.data_operations)
          );
        })
      ) {
        setDuplicateError(true);
        return;
      }
      setDuplicateError(false);

      const serviceLabel =
        serviceOptions?.find((item) => item.value === res.service)?.label ?? '';
      const objectsLabel = getObjectsLabelByDataObjects(
        res.data_objects,
        databaseOptions,
        tableOptions
      );
      const operationsLabel =
        operationOptions
          ?.filter((item) => res.data_operations?.includes(item.value))
          .map((item) => item.label) ?? [];

      const objectsParams =
        res.data_objects
          ?.map((item) => {
            if (item?.tables?.length) {
              return item.tables;
            } else if (item?.database) {
              return item.database;
            }
            return res.service ?? '';
          })
          .flat() ?? [];
      const curPermission = {
        index: editIndex,
        business: res.business ?? '',
        serviceValue: res.service ?? '',
        objectsValue: res.data_objects,
        operationsValue: res.data_operations ?? [],

        serviceLabel,
        objectsLabel,
        operationsLabel,

        objectsParams
      };
      if (editIndex !== undefined) {
        const permissions = cloneDeep(dataPermissions);
        permissions.splice(editIndex, 1, curPermission);
        setDataPermissions(permissions);
      } else {
        setDataPermissions([...dataPermissions, curPermission]);
      }
      closeModal();
    });
  };

  const business = Form.useWatch('business', form);
  const service = Form.useWatch('service', form);
  const dataObjects = Form.useWatch('data_objects', form);

  const {
    businessOptionsLoading,
    serviceOptionsLoading,
    databaseOptionsLoading,
    tableOptionLoading,
    operationOptionsLoading,
    businessOptions,
    serviceOptions,
    generateServiceSelectOptions,
    databaseOptions,
    getTableOptions,
    operationOptions,
    SyncService
  } = useQueryData(visible, business, service, dataObjects);

  const [selectedDatabase, setSelectedDatabase] = useState<string[]>([]);
  const [tableOptions, setTableOptions] = useState<DefaultOptionType[][]>([]);
  const newDatabaseOptions = useMemo(() => {
    return databaseOptions?.map((item) => ({
      ...item,
      disabled: selectedDatabase.includes(item.value)
    }));
  }, [selectedDatabase, databaseOptions]);

  const updateTableOptions = useCallback(
    async (ids?: string[]) => {
      if (!ids?.length) return;
      const options = cloneDeep(tableOptions);
      for (let i = 0; i < ids.length; i++) {
        if (!ids[i]) continue;
        const res = await getTableOptions(ids[i]);
        if (res) {
          options[i] = res;
        }
      }
      setTableOptions(options);
    },
    [getTableOptions, tableOptions]
  );

  useEffect(() => {
    if (visible && editIndex !== undefined) {
      const { business, serviceValue, objectsValue, operationsValue } =
        dataPermissions[editIndex];
      updateTableOptions(objectsValue?.map((item) => item.database ?? ''));
      form.setFieldsValue({
        business,
        service: serviceValue,
        data_objects: objectsValue,
        data_operations: operationsValue.map((id) => String(id))
      });
      const selectedDatabase = objectsValue
        ?.map((item) => item.database ?? '')
        .filter((database) => !!database);
      setSelectedDatabase(selectedDatabase ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editIndex]);

  const onValuesChange = (changeValues: any) => {
    const fields = Object.keys(changeValues)[0];
    if (fields === 'data_objects') {
      form.resetFields(['data_operations']);
    }
  };

  const handleDatabaseChange = (index: number, value: string) => {
    const dataObjects = form.getFieldValue('data_objects');
    setSelectedDatabase(
      dataObjects.map((item: IDataObjects) => item?.database ?? '')
    );
    const options = cloneDeep(tableOptions);
    if (value) {
      getTableOptions(value).then((res) => {
        if (res) {
          options[index] = res;
          setTableOptions(options);
        }
      });
    } else {
      options[index] = [];
      setTableOptions(options);
    }
    form.setFieldsValue({
      data_objects: dataObjects.map((item: IDataObjects, i: number) => {
        if (i === index) {
          return {
            database: item.database,
            tables: []
          };
        }
        return item;
      })
    });
  };

  const handleRemoveDataObject = (index: number) => {
    const dataObjects = form.getFieldValue('data_objects');
    setSelectedDatabase(
      dataObjects.map((item: IDataObjects) => item?.database ?? '')
    );
    const options = cloneDeep(tableOptions);
    options.splice(index, 1);
    setTableOptions(options);
  };
  const handleBusinessChange = () => {
    form.resetFields(['service', 'data_objects', 'data_operations']);
    setSelectedDatabase([]);
    SyncService.mutate();
  };
  const handleServiceChange = () => {
    form.resetFields(['data_objects', 'data_operations']);
    setSelectedDatabase([]);
  };

  const handleSyncService = () => {
    if (!service || SyncService.loading) return;
    SyncService.run();
    handleServiceChange();
  };

  const successResult = useMemo(() => {
    if (SyncService.data?.data.code === ResponseCode.SUCCESS) {
      return true;
    }
    return false;
  }, [SyncService.data]);

  return (
    <BasicDrawer
      title={t('auth.button.addDataPermission')}
      width={640}
      open={visible}
      onClose={closeModal}
      footer={
        <Space>
          <BasicButton onClick={closeModal}>{t('common.close')}</BasicButton>
          <BasicButton type="primary" onClick={submit}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      <Form
        className="add-data-permission-form"
        form={form}
        onValuesChange={onValuesChange}
        layout="vertical"
      >
        <Form.Item
          name="business"
          label={t('auth.addAuth.baseForm.business')}
          rules={[{ required: true }]}
        >
          <BasicSelect
            loading={businessOptionsLoading}
            options={businessOptions}
            onChange={handleBusinessChange}
          />
        </Form.Item>
        <Form.Item label={t('auth.addAuth.baseForm.dataSource')}>
          <Row wrap={false}>
            <Col flex={1}>
              <Form.Item name="service" rules={[{ required: true }]} noStyle>
                <BasicSelect
                  className="data-service-select"
                  loading={serviceOptionsLoading}
                  // options={serviceOptions}
                  onChange={handleServiceChange}
                >
                  {generateServiceSelectOptions()}
                </BasicSelect>
              </Form.Item>
            </Col>
            <Col flex={'48px'}>
              <BasicToolTips title={t('dataObject.syncDataSource.button')}>
                <DrawerFormIconWrapper
                  style={{ marginLeft: '12px' }}
                  onClick={handleSyncService}
                >
                  <IconSyncDictionary />
                </DrawerFormIconWrapper>
                {/* <BasicButton
                  style={{ marginLeft: '12px' }}
                  size="large"
                  type="text"
                  disabled={!service || SyncService.loading}
                  onClick={handleSyncService}
                  icon={<IconSyncDictionary />}
                /> */}
              </BasicToolTips>
            </Col>
            {/* {successResult && (
              <Col span={1}>
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  loading={SyncService.loading}
                  style={{ color: '#52c41a' }}
                />
              </Col>
            )} */}
          </Row>
        </Form.Item>
        <Form.List
          name="data_objects"
          initialValue={[
            {
              database: undefined
            }
          ]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={index === 0 ? t('auth.addAuth.baseForm.objects') : ''}
                  required={false}
                  key={field.key}
                  className="database-form-item"
                >
                  <Row wrap={false}>
                    <Col flex={'180px'} style={{ marginRight: '12px' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'database']}
                        noStyle
                      >
                        <BasicSelect
                          placeholder="*"
                          loading={databaseOptionsLoading}
                          onChange={handleDatabaseChange.bind(null, index)}
                          allowClear={true}
                        >
                          {newDatabaseOptions?.map((item) => (
                            <Select.Option
                              key={item.value}
                              disabled={item.disabled}
                              value={item.value}
                            >
                              {item.label}
                            </Select.Option>
                          ))}
                        </BasicSelect>
                      </Form.Item>
                    </Col>
                    <Col flex={1}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'tables']}
                        noStyle
                      >
                        <BasicSelect
                          loading={tableOptionLoading}
                          options={tableOptions[index]}
                          placeholder="*"
                          mode="multiple"
                        />
                      </Form.Item>
                    </Col>
                    <Col flex={'48px'}>
                      <EmptyBox if={index > 0}>
                        <DrawerFormIconWrapper
                          className="remove-object-button"
                          style={{ marginLeft: '12px' }}
                          onClick={() => {
                            handleRemoveDataObject(index);
                            remove(field.name);
                          }}
                        >
                          <IconFormListDelete />
                        </DrawerFormIconWrapper>
                      </EmptyBox>
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item label="" colon={false}>
                <FormListAddButtonWrapper
                  icon={<IconFormListAdd />}
                  onClick={() => {
                    add();
                  }}
                  className="form-list-add"
                >
                  {t('auth.addAuth.baseForm.addDatabaseTable')}
                </FormListAddButtonWrapper>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          name="data_operations"
          label={t('auth.addAuth.baseForm.operation')}
          rules={[{ required: true }]}
        >
          <BasicSelect
            mode="multiple"
            loading={operationOptionsLoading}
            options={operationOptions}
          />
        </Form.Item>

        {duplicateError && (
          <Row>
            <Col offset={7}>
              <Typography.Text type="danger">
                {t('auth.addAuth.baseForm.duplicateError')}
              </Typography.Text>
            </Col>
          </Row>
        )}
      </Form>
    </BasicDrawer>
  );
};

export default AddDataPermission;
