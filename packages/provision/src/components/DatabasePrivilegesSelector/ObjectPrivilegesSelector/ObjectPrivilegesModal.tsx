import {
  BasicDrawer,
  BasicSelect,
  EmptyBox,
  BasicButton,
  BasicToolTips
} from '@actiontech/shared';
import { Form, Row, Col, Space, Typography } from 'antd';
import {
  DrawerFormIconWrapper,
  FormListAddButtonWrapper
} from '@actiontech/shared/lib/styleWrapper/element';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { DefaultOptionType } from 'antd/es/select';
import { cloneDeep, isEqual } from 'lodash';
import { PlusCircleFilled, MinusCircleFilled } from '@actiontech/icons';
import {
  IDataObjects,
  ObjectPrivilegesFormFields,
  ObjectPrivilegesModalProps
} from './index.type';
import { customIdGenerator, getObjectsLabelByDataObjects } from './utils';
import EventEmitter from '../../../utils/EventEmitter';
import { EventEmitterKey } from '../../../data/enum';

const OPTIONS_REQUEST_DEFAULT_PARAMS = {
  page_index: 1,
  page_size: 9999
};

const ObjectPrivilegesModal: React.FC<ObjectPrivilegesModalProps> = ({
  visible,
  editId,
  onCancel,
  onSubmit,
  service,
  data,
  getOperationPermissionPending,
  objectPrivilegeOptions
}) => {
  const { t } = useTranslation();

  const [form] = Form.useForm<ObjectPrivilegesFormFields>();

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
          ...OPTIONS_REQUEST_DEFAULT_PARAMS
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
          ...OPTIONS_REQUEST_DEFAULT_PARAMS
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

  const handleSubmit = () => {
    form.validateFields().then((res) => {
      if (
        data.find((item) => {
          return (
            isEqual(item.objectsValue, res.data_objects) &&
            isEqual(item.operationsValue, res.data_operations) &&
            item.id !== editId
          );
        })
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
        objectPrivilegeOptions
          ?.filter((item) => res.data_operations?.includes(item.value))
          .map((item) => item.label) ?? [];

      const operationsValue =
        objectPrivilegeOptions
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
      }
    );
    return unsubscribe;
  }, [refreshDatabaseOptions]);

  return (
    <BasicDrawer
      open={visible}
      size="large"
      title={
        editId !== undefined
          ? t('databaseAccount.create.form.editDataPermission')
          : t('databaseAccount.create.form.addObjectPrivileges')
      }
      onClose={handleCancel}
      footer={
        <Space>
          <BasicButton onClick={handleCancel}>{t('common.close')}</BasicButton>
          <BasicButton type="primary" onClick={handleSubmit}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="data_operations"
          label={t('databaseAccount.create.form.selectPermission')}
          rules={[{ required: true }]}
        >
          <BasicSelect
            mode="multiple"
            loading={getOperationPermissionPending}
            options={objectPrivilegeOptions}
          />
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
                          options={databaseOptions?.map((v) => ({
                            ...v,
                            disabled: selectedDatabase.includes(v.value)
                          }))}
                        />
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
                  {t('databaseAccount.create.form.addDatabaseTable')}
                </FormListAddButtonWrapper>
              </Form.Item>
            </>
          )}
        </Form.List>
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

export default ObjectPrivilegesModal;
