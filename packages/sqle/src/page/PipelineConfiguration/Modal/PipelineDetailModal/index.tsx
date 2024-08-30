import { BasicDrawer, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../..//store';
import { ModalName } from '../../../../data/ModalName';
import { Space, Spin, Form, Typography, Popconfirm, message } from 'antd';
import {
  updateSelectPipelineId,
  updatePipelineNodeTourStatus,
  updatePipelineModalStatus
} from '../../../../store/pipeline';
import pipeline from '@actiontech/shared/lib/api/sqle/service/pipeline';
import { useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { useNavigate } from 'react-router-dom';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { PipelineNodeTableColumn } from './column';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { useEffect, useRef, useCallback } from 'react';
import { PipelineDetailModalStyleWrapper } from './style';
import classNames from 'classnames';

const PipelineDetailModal: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [messageApi, messageContextHolder] = message.useMessage();

  const { projectName, projectID } = useCurrentProject();

  const visible = useSelector<IReduxState, boolean>((state) => {
    return !!state.pipeline.modalStatus[
      ModalName.Pipeline_Configuration_Detail_Modal
    ];
  });

  const nodeListRef = useRef<HTMLElement>(null);

  const pipelineState = useSelector<
    IReduxState,
    { id?: number; showTour: boolean }
  >((state) => ({
    id: state.pipeline.selectPipelineId,
    showTour: state.pipeline.showPipelineNodeTour
  }));

  const { loading, data } = useRequest(
    () =>
      pipeline
        .getPipelineDetailV1({
          pipeline_id: pipelineState.id?.toString() ?? '',
          project_name: projectName ?? ''
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }),
    {
      ready: !!pipelineState.id
    }
  );

  const hidePipelineNodeTour = useCallback(() => {
    dispatch(updatePipelineNodeTourStatus({ show: false }));
  }, [dispatch]);

  const closeModal = () => {
    dispatch(updateSelectPipelineId({ id: undefined }));
    hidePipelineNodeTour();
    dispatch(
      updatePipelineModalStatus({
        modalName: ModalName.Pipeline_Configuration_Detail_Modal,
        status: false
      })
    );
  };

  const onDelete = () => {
    const hide = messageApi.loading(t('pipelineConfiguration.table.deleting'));
    pipeline
      .deletePipelineV1({
        pipeline_id: pipelineState.id?.toString() ?? '',
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('pipelineConfiguration.table.deleteSuccess'));
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Pipeline_Configuration_list);
        }
      })
      .finally(() => {
        hide();
      });
  };

  const onEdit = () => {
    closeModal();
    navigate(
      `/sqle/project/${projectID}/pipeline-configuration/update/${pipelineState.id}`
    );
  };

  useEffect(() => {
    if (pipelineState.showTour && visible && !loading) {
      window.addEventListener('click', hidePipelineNodeTour, { once: true });
    }
  }, [visible, pipelineState.showTour, loading, hidePipelineNodeTour]);

  return (
    <PipelineDetailModalStyleWrapper
      ref={nodeListRef}
      className={classNames({
        'focus-node-list': pipelineState.showTour && !loading
      })}
    >
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={t('pipelineConfiguration.modal.title')}
        open={visible}
        onClose={closeModal}
        extra={
          <Space>
            <Popconfirm
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              title={t('pipelineConfiguration.table.confirmDelete')}
              onConfirm={onDelete}
            >
              <BasicButton danger>{t('common.delete')}</BasicButton>
            </Popconfirm>
            <BasicButton type="primary" onClick={onEdit}>
              {t('common.edit')}
            </BasicButton>
          </Space>
        }
        getContainer={() => nodeListRef.current!}
      >
        <Spin spinning={loading}>
          <Form layout="vertical">
            <FormItemLabel label={t('pipelineConfiguration.form.name')}>
              <Typography.Text type="secondary">{data?.name}</Typography.Text>
            </FormItemLabel>
            <FormItemLabel label={t('pipelineConfiguration.form.desc')}>
              <Typography.Text type="secondary">
                {data?.description || '-'}
              </Typography.Text>
            </FormItemLabel>
            <FormItemLabel label={t('pipelineConfiguration.form.address')}>
              <Typography.Text type="secondary">
                {data?.address ? (
                  <Typography.Link href={data.address} target="_blank">
                    {data?.address}
                  </Typography.Link>
                ) : (
                  '-'
                )}
              </Typography.Text>
            </FormItemLabel>
            <FormItemLabel
              label={t('pipelineConfiguration.modal.pipelineNode')}
            >
              <section className="node-list">
                <ActiontechTable
                  rowKey="id"
                  dataSource={data?.nodes}
                  columns={PipelineNodeTableColumn()}
                  pagination={false}
                />
              </section>
            </FormItemLabel>
          </Form>
        </Spin>
      </BasicDrawer>
    </PipelineDetailModalStyleWrapper>
  );
};

export default PipelineDetailModal;
