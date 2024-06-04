import {
  BasicDrawer,
  BasicSelect,
  EmptyBox,
  BasicButton,
  BasicToolTips
} from '@actiontech/shared';
import { Form, Row, Col, Select, Space, Typography } from 'antd';
import {
  PermissionModalFormType,
  PermissionModalProps,
  IDataObjects
} from '../../index.type';
import {
  DrawerFormIconWrapper,
  FormListAddButtonWrapper
} from '@actiontech/shared/lib/styleWrapper/element';
import { useTranslation } from 'react-i18next';
import {
  IconFormListAdd,
  IconFormListDelete
} from '@actiontech/shared/lib/Icon';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRequest } from 'ahooks';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { DefaultOptionType } from 'antd/es/select';
import { cloneDeep, isEqual } from 'lodash';
import qs from 'query-string';
import {
  getObjectsLabelByDataObjects,
  customIdGenerator
} from '../../index.utils';
import { EventEmitterKey } from '../../../../data/enum';
import EventEmitter from '../../../../utils/EventEmitter';

const defaultParams = {
  page_index: 1,
  page_size: 9999
};

const PermissionModal: React.FC<PermissionModalProps> = ({
  visible,
  editId,
  onCancel,
  onSubmit,
  service,
  data
}) => {
  const { t } = useTranslation();

  const [form] = Form.useForm<PermissionModalFormType>();

  const dataObjects = Form.useWatch('data_objects', form);

  const [selectedDatabase, setSelectedDatabase] = useState<string[]>([]);

  const [tableOptions, setTableOptions] = useState<DefaultOptionType[][]>([]);

  const [duplicateError, setDuplicateError] = useState(false);

  const {
    data: databaseOptions,
    loading: databaseOptionsLoading,
    refresh: refreshDatabaseOptions
  } = useRequest(
    () =>
      auth
        .AuthListDatabase({
          service_uid: service ?? '',
          ...defaultParams
        })
        .then((res) => {
          return res.data.data?.map((item) => ({
            value: item.uid ?? '',
            label: item.name ?? ''
          }));
        }),
    {
      refreshDeps: [service],
      ready: !!service
    }
  );

  const { runAsync: getTableOptions, loading: tableOptionLoading } = useRequest(
    (id: string) =>
      auth
        .AuthListTable({
          database_uid: id,
          ...defaultParams
        })
        .then((res) => {
          return res.data.data?.map((item) => ({
            value: item.uid ?? '',
            label: item.name ?? ''
          }));
        }),
    {
      manual: true
    }
  );

  const objects = useMemo(() => {
    let objectsFlag: string[] = [];
    if (dataObjects?.length) {
      dataObjects.forEach((item) => {
        if (item?.tables?.length) {
          objectsFlag = objectsFlag.concat(item.tables);
        } else if (item?.database) {
          objectsFlag.push(item.database);
        }
      });
    }
    if (!objectsFlag.length && service) {
      objectsFlag.push(service);
    }
    return objectsFlag;
  }, [dataObjects, service]);

  const {
    data: operationOptions,
    loading: operationOptionsLoading,
    refresh: refreshOperationOptions
  } = useRequest(
    () =>
      auth
        .AuthListDataOperationSets(
          {
            data_object_uids: objects,
            ...defaultParams
          },
          {
            paramsSerializer: (params) => qs.stringify(params)
          }
        )
        .then((res) => {
          return res.data.data?.map((item) => ({
            value: item.uid ?? '',
            label: item.name ?? ''
          }));
        }),
    {
      refreshDeps: [objects],
      ready: !!objects.length
    }
  );

  const newDatabaseOptions = useMemo(() => {
    return databaseOptions?.map((item) => ({
      ...item,
      disabled: selectedDatabase.includes(item.value)
    }));
  }, [selectedDatabase, databaseOptions]);

  const handleDatabaseChange = (index: number, value: string) => {
    const data_objects = form.getFieldValue('data_objects');
    setSelectedDatabase(
      data_objects.map((item: IDataObjects) => item?.database ?? '')
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
      data_objects: data_objects.map((item: IDataObjects, i: number) => {
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
    const data_objects = form.getFieldValue('data_objects');
    setSelectedDatabase(
      data_objects.map((item: IDataObjects) => item?.database ?? '')
    );
    const options = cloneDeep(tableOptions);
    options.splice(index, 1);
    setTableOptions(options);
  };

  const submit = () => {
    form.validateFields().then((res) => {
      if (
        data.find((item) => {
          return (
            isEqual(item.objectsValue, res.data_objects) &&
            isEqual(item.operationsValue, res.data_operations)
          );
        }) &&
        !editId
      ) {
        setDuplicateError(true);
        return;
      }
      setDuplicateError(false);

      const objectsLabel = getObjectsLabelByDataObjects(
        res.data_objects,
        databaseOptions,
        tableOptions
      );
      const operationsLabel =
        operationOptions
          ?.filter((item) => res.data_operations?.includes(item.value))
          .map((item) => item.label) ?? [];

      const operationsValue =
        operationOptions
          ?.filter((item) => res.data_operations?.includes(item.value))
          .map((item) => item.value) ?? [];

      const includeDatabase = res.data_objects?.some((item) => {
        return !!item?.database?.length;
      });

      const objectsParams =
        res.data_objects
          ?.map((item) => {
            if (item?.tables?.length) {
              return item.tables;
            } else if (item?.database) {
              return item.database;
            }

            if (!includeDatabase) {
              return service ?? '';
            }
            return '';
          })
          .flat()
          .filter((i) => !!i) ?? [];

      const curPermission = {
        id:
          editId ??
          customIdGenerator(res.data_objects, res.data_operations || []),
        objectsValue: res.data_objects,
        operationsValue,
        objectsLabel,
        operationsLabel,
        objectsParams
      };
      if (editId !== undefined) {
        const permissions = cloneDeep(data);
        const index = permissions.findIndex((i) => i.id === editId);
        permissions.splice(index, 1, curPermission);
        onSubmit?.(permissions);
      } else {
        onSubmit?.([...data, curPermission]);
      }
      handleCancel();
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedDatabase([]);
    setTableOptions([]);
    setDuplicateError(false);
    onCancel?.();
  };

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
    if (visible && editId !== undefined) {
      const { objectsValue, operationsValue } =
        data.find((i) => i.id === editId) ?? {};
      updateTableOptions(objectsValue?.map((item) => item.database ?? ''));
      form.setFieldsValue({
        data_objects: objectsValue,
        data_operations: operationsValue?.map((id) => String(id))
      });
      const selectedData = objectsValue
        ?.map((item) => item.database ?? '')
        .filter((database) => !!database);
      setSelectedDatabase(selectedData ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editId]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Create_Account_Sync_Service,
      () => {
        refreshDatabaseOptions();
        refreshOperationOptions();
      }
    );
    return unsubscribe;
  }, [refreshDatabaseOptions, refreshOperationOptions]);

  return (
    <BasicDrawer
      open={visible}
      size="large"
      title={
        editId !== undefined
          ? t('databaseAccount.create.form.editDataPermission')
          : t('databaseAccount.create.form.addDataPermission')
      }
      onClose={handleCancel}
      footer={
        <Space>
          <BasicButton onClick={handleCancel}>{t('common.close')}</BasicButton>
          <BasicButton type="primary" onClick={submit}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
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
                  label={
                    index === 0 ? (
                      <BasicToolTips
                        suffixIcon
                        title={t('databaseAccount.create.form.permissionTip')}
                      >
                        {t('databaseAccount.create.form.selectObjects')}
                      </BasicToolTips>
                    ) : (
                      ''
                    )
                  }
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
                          icon={<IconFormListDelete />}
                        />
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
                  className="form-list-add add-object-button"
                >
                  {t('databaseAccount.create.form.addDatabaseTable')}
                </FormListAddButtonWrapper>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item
          name="data_operations"
          label={t('databaseAccount.create.form.selectPermission')}
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
                {t('databaseAccount.create.form.duplicateError')}
              </Typography.Text>
            </Col>
          </Row>
        )}
      </Form>
    </BasicDrawer>
  );
};

export default PermissionModal;
