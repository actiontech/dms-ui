import { cloneDeep, isEqual } from 'lodash';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Form, Row, Select, Typography, Space } from 'antd';
import { IDataObjects, IFormFields, IAddDataPermission } from './index.type';
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
import {
  DrawerFormIconWrapper,
  FormListAddButtonWrapper
} from '@actiontech/shared/lib/styleWrapper/element';
import { PlusCircleFilled, MinusCircleFilled } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

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
    SyncService,
    messageContextHolder
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
      const {
        business: innerBusiness,
        serviceValue,
        objectsValue,
        operationsValue
      } = dataPermissions[editIndex];
      updateTableOptions(objectsValue?.map((item) => item.database ?? ''));
      form.setFieldsValue({
        business: innerBusiness,
        service: serviceValue,
        data_objects: objectsValue,
        data_operations: operationsValue.map((id) => String(id))
      });

      setSelectedDatabase(
        objectsValue
          ?.map((item) => item.database ?? '')
          .filter((database) => !!database) ?? []
      );
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
    const innerDataObjects = form.getFieldValue('data_objects');
    setSelectedDatabase(
      innerDataObjects.map((item: IDataObjects) => item?.database ?? '')
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
      data_objects: innerDataObjects.map((item: IDataObjects, i: number) => {
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
    const innerDataObjects = form.getFieldValue('data_objects');
    setSelectedDatabase(
      innerDataObjects.map((item: IDataObjects) => item?.database ?? '')
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
    SyncService.run();
    handleServiceChange();
  };

  return (
    <BasicDrawer
      title={
        editIndex !== undefined
          ? t('auth.button.editDataPermission')
          : t('auth.button.addDataPermission')
      }
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
      {messageContextHolder}
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
        <Form.Item
          label={t('auth.addAuth.baseForm.dataSource')}
          name="service"
          rules={[
            {
              required: true,
              message: t('auth.addAuth.baseForm.errorByService')
            }
          ]}
        >
          <Row wrap={false}>
            <Col flex={1}>
              <Form.Item
                name="service"
                rules={[{ required: true, message: '' }]}
                noStyle
              >
                <BasicSelect
                  className="data-service-select"
                  loading={serviceOptionsLoading}
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
                  disabled={!service || SyncService.loading}
                  icon={
                    <CommonIconStyleWrapper>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.6666 6.93337V2.20004C14.6666 1.80004 14.3333 1.46671 13.9333 1.46671H8.99992C8.59992 1.46671 8.26658 1.80004 8.26658 2.20004V6.93337C8.26658 7.33337 8.59992 7.66671 8.99992 7.66671H13.9333C14.3333 7.66671 14.6666 7.33337 14.6666 6.93337ZM2.06659 8.40004C1.66659 8.40004 1.33325 8.73337 1.33325 9.13337V13.8667C1.33325 14.2667 1.66659 14.6 2.06659 14.6H6.99992C7.39992 14.6 7.73325 14.2667 7.73325 13.8667V9.13337C7.73325 8.73337 7.39992 8.40004 6.99992 8.40004H2.06659ZM4.79992 5.20004H4.06659C4.06659 3.93337 5.13325 2.86671 6.39992 2.86671H6.66658C6.86658 2.86671 6.99992 2.73337 6.99992 2.53337V1.66671C6.99992 1.46671 6.86658 1.33337 6.66658 1.33337H6.39992C4.26659 1.33337 2.53325 3.06671 2.53325 5.20004H1.66659C1.53325 5.20004 1.46659 5.33337 1.46659 5.46671C1.46659 5.53337 1.46659 5.53337 1.53325 5.60004L2.99992 7.26671C3.13325 7.40004 3.33325 7.40004 3.46659 7.26671L4.93325 5.60004C4.99992 5.53337 4.99992 5.40004 4.93325 5.33337C4.86659 5.26671 4.86659 5.20004 4.79992 5.20004ZM11.1999 10.8H11.9333C11.9333 12.0667 10.8666 13.1334 9.59992 13.1334H9.33325C9.13325 13.1334 8.99992 13.2667 8.99992 13.4667V14.4C8.99992 14.6 9.13325 14.7334 9.33325 14.7334H9.59992C11.7333 14.7334 13.4666 13 13.4666 10.8667H14.3333C14.4666 10.8667 14.5333 10.8 14.5333 10.6667C14.5333 10.6 14.5333 10.6 14.4666 10.5334L12.9999 8.86671C12.8666 8.73337 12.6666 8.73337 12.5333 8.86671L11.0666 10.5334C10.9999 10.6 10.9999 10.7334 11.0666 10.8C11.0666 10.7334 11.1333 10.8 11.1999 10.8Z"
                          fill={
                            !service || SyncService.loading
                              ? 'currentColor'
                              : '#4583FF'
                          }
                        />
                      </svg>
                    </CommonIconStyleWrapper>
                  }
                />
              </BasicToolTips>
            </Col>
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
                          data-testid={`database-form-item-database-${index}`}
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
                          data-testid={`database-form-item-schema-${index}`}
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
                          icon={<MinusCircleFilled />}
                        />
                      </EmptyBox>
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item label="" colon={false}>
                <FormListAddButtonWrapper
                  icon={<PlusCircleFilled />}
                  onClick={() => {
                    add();
                  }}
                  className="form-list-add add-object-button"
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
            <Col>
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
