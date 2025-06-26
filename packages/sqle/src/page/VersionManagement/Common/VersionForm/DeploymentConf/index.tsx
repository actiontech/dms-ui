import { useTranslation } from 'react-i18next';
import {
  BasicInput,
  BasicButton,
  BasicSelect,
  EmptyBox,
  FormItemSubTitle,
  FormItemLabel
} from '@actiontech/shared';
import { Form, Row, Col } from 'antd';
import { MinusCircleFilled, PlusCircleFilled } from '@actiontech/icons';
import { DownTriangleOutlined } from '@actiontech/icons';
import useInstance from '../../../../../hooks/useInstance';
import { useEffect } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { getInstanceTipListV2FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import classNames from 'classnames';
import { VersionDeploymentConfStyleWrapper } from '../style';
import { VersionFormType, VersionStage } from '../index.type';
import { FormListAddButtonWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const DeploymentConf: React.FC<{ allowEditStages?: boolean }> = ({
  allowEditStages
}) => {
  const { t } = useTranslation();

  const { projectName } = useCurrentProject();

  const form = Form.useFormInstance<VersionFormType>();

  const stages = Form.useWatch('stages', form);

  const {
    loading: instanceTipsLoading,
    updateInstanceList,
    instanceIDOptions
  } = useInstance();

  const onAddStage = () => {
    form.setFieldValue(
      'stages',
      stages.concat([
        {
          name: '',
          instances: stages?.[0]?.instances.map(() => undefined)
        }
      ])
    );
  };

  const onAddInstance = () => {
    form.setFieldValue(
      'stages',
      stages.map((i: VersionStage) => ({
        ...i,
        instances: i.instances.concat([undefined])
      }))
    );
  };

  const onRemoveDistance = (index: number) => {
    form.setFieldValue(
      'stages',
      stages.map((i: VersionStage) => {
        i.instances?.splice(index, 1);
        return i;
      })
    );
  };

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module: getInstanceTipListV2FunctionalModuleEnum.create_version
    });
  }, [projectName, updateInstanceList]);

  return (
    <VersionDeploymentConfStyleWrapper>
      <FormItemSubTitle>
        {t('versionManagement.form.deploymentStageConf')}
      </FormItemSubTitle>
      <Form.List
        name="stages"
        initialValue={[
          {
            name: t('versionManagement.form.dev'),
            instances: [undefined]
          },
          {
            name: t('versionManagement.form.test'),
            instances: [undefined]
          },
          {
            name: t('versionManagement.form.prod'),
            instances: [undefined]
          }
        ]}
      >
        {(fields, { remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Row key={field.key} gutter={6}>
                <EmptyBox if={fields.length !== 2}>
                  <Col span={1}>
                    <FormItemLabel
                      label={index === 0 ? ' ' : ''}
                      wrapperCol={{ span: 24 }}
                      labelCol={{ span: 24 }}
                    >
                      <BasicButton
                        onClick={() => remove(field.name)}
                        icon={<MinusCircleFilled />}
                        disabled={!allowEditStages}
                        className="delete-stage-btn"
                      />
                    </FormItemLabel>
                  </Col>
                </EmptyBox>
                <Col span={3}>
                  <FormItemLabel
                    {...field}
                    key={`${field.name}-form-item-label`}
                    rules={[
                      {
                        required: true,
                        message: t('common.form.placeholder.input', {
                          name: t('versionManagement.form.stageName')
                        })
                      }
                    ]}
                    name={[field.name, 'name']}
                    wrapperCol={{ span: 24 }}
                    labelCol={{ span: 24 }}
                    label={
                      index === 0 ? t('versionManagement.form.stageName') : ''
                    }
                    className="has-required-style"
                  >
                    <BasicInput disabled={!allowEditStages} />
                  </FormItemLabel>
                  <EmptyBox if={index !== fields.length - 1}>
                    <div className="stage-icon">
                      <DownTriangleOutlined width={18} height={6} />
                      <DownTriangleOutlined width={18} height={6} />
                    </div>
                  </EmptyBox>
                </Col>
                <Col span={20}>
                  <Form.List name={[field.name, 'instances']}>
                    {(instanceFields) => (
                      <Row wrap={false} gutter={6}>
                        {instanceFields.map((instanceField, instanceIndex) => (
                          <Col
                            span={
                              Math.ceil(24 / instanceFields?.length) > 8
                                ? 8
                                : Math.ceil(24 / instanceFields?.length)
                            }
                            key={`${index}-${instanceIndex}`}
                            className="instance-col"
                          >
                            <FormItemLabel
                              {...instanceField}
                              key={`${instanceField.key}-form-item-label`}
                              rules={[
                                {
                                  required: true,
                                  message: t('common.form.placeholder.select', {
                                    name: t('versionManagement.form.instance')
                                  })
                                }
                              ]}
                              name={[instanceField.name]}
                              wrapperCol={{ span: 24 }}
                              labelCol={{ span: 24 }}
                              label={
                                index === 0
                                  ? instanceIndex === 0
                                    ? t('versionManagement.form.instance')
                                    : ' '
                                  : ''
                              }
                              className={classNames('has-required-style', {
                                'no-required-style': instanceIndex !== 0
                              })}
                            >
                              <BasicSelect
                                loading={instanceTipsLoading}
                                options={instanceIDOptions}
                                disabled={!allowEditStages}
                              />
                            </FormItemLabel>
                            <EmptyBox
                              if={
                                index === 0 &&
                                instanceFields?.length !== 1 &&
                                allowEditStages
                              }
                            >
                              <span
                                className="remove-instance-btn"
                                onClick={() => {
                                  onRemoveDistance(instanceIndex);
                                }}
                              >
                                <MinusCircleFilled />
                              </span>
                            </EmptyBox>
                            <EmptyBox if={index !== fields.length - 1}>
                              <div className="stage-icon">
                                <DownTriangleOutlined width={18} height={6} />
                                <DownTriangleOutlined width={18} height={6} />
                              </div>
                            </EmptyBox>
                          </Col>
                        ))}
                        <EmptyBox
                          if={index === 0 && instanceFields?.length !== 6}
                        >
                          <Col>
                            <FormItemLabel
                              label={index === 0 ? ' ' : ''}
                              wrapperCol={{ span: 24 }}
                              labelCol={{ span: 24 }}
                            >
                              <BasicButton
                                onClick={onAddInstance}
                                icon={<PlusCircleFilled />}
                                disabled={!allowEditStages}
                                className="add-instance-btn"
                              />
                            </FormItemLabel>
                          </Col>
                        </EmptyBox>
                      </Row>
                    )}
                  </Form.List>
                </Col>
              </Row>
            ))}
            <EmptyBox if={fields.length !== 10}>
              <Row>
                <Col span={3}>
                  <FormListAddButtonWrapper
                    icon={<PlusCircleFilled />}
                    onClick={onAddStage}
                    className="add-stage-btn"
                    disabled={!allowEditStages}
                  >
                    {t('versionManagement.form.addStage')}
                  </FormListAddButtonWrapper>
                </Col>
                <Form.ErrorList errors={errors} />
              </Row>
            </EmptyBox>
          </>
        )}
      </Form.List>
    </VersionDeploymentConfStyleWrapper>
  );
};

export default DeploymentConf;
