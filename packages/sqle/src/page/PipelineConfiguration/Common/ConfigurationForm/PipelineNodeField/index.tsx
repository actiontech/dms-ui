import { PipelineNodeFieldProps } from '../index.type';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { PipelineNodeTableColumn, PipelineNodeTableActions } from './column';
import { FormItemSubTitle } from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { Space, Form, Typography } from 'antd';
import { BasicButton } from '@actiontech/shared';
import { PipelineNodeListStyleWrapper } from '../../style';
import NodeModal from './NodeModal';
import { useBoolean } from 'ahooks';
import { IPipelineNodeDetail } from '@actiontech/shared/lib/api/sqle/service/common';
import React, { useMemo, useState } from 'react';
import { uniqueId } from 'lodash';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { DragEndEvent } from '@dnd-kit/core';
import { DragTableRow } from './DragTableRow';

const PipelineNodeField: React.FC<PipelineNodeFieldProps> = ({
  value,
  onChange
}) => {
  const { t } = useTranslation();

  const [visible, { setTrue: showNodeModal, setFalse: hideNodeModal }] =
    useBoolean();

  const [editNodeId, setEditNodeId] = useState<number>();

  const [form] = Form.useForm<IPipelineNodeDetail>();

  const onEdit = (id?: number) => {
    setEditNodeId(id);
    form.setFieldsValue(value?.find((v) => v.id === id) ?? {});
    showNodeModal();
  };

  const onRemove = (id?: number) => {
    const index = value?.findIndex((v) => v.id === id);
    value?.splice(index!, 1);
    onChange?.([...(value ?? [])]);
  };

  const onChangeValue = async () => {
    const values = await form.validateFields();
    if (editNodeId) {
      const index = value?.findIndex((v) => v.id === editNodeId);
      value?.splice(index!, 1, { ...values, id: editNodeId });
      onChange?.([...(value ?? [])]);
    } else {
      onChange?.([
        ...(value ?? []),
        { ...values, id: values?.id ?? Number(uniqueId()) }
      ]);
    }
    onCancel();
  };

  const onCancel = () => {
    hideNodeModal();
    setEditNodeId(undefined);
    form.resetFields();
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const sortedValue = () => {
        const activeIndex =
          value?.findIndex((record) => record.id === active?.id) ?? 0;
        const overIndex =
          value?.findIndex((record) => record.id === over?.id) ?? 0;
        return arrayMove(value ?? [], activeIndex, overIndex);
      };
      onChange?.(sortedValue());
    }
  };

  const nodeNameList = useMemo(
    () =>
      value?.filter((i) => i.id !== editNodeId).map((i) => i.name ?? '') ?? [],
    [value, editNodeId]
  );

  return (
    <PipelineNodeListStyleWrapper>
      <FormItemSubTitle>
        <Space className="sub-title">
          {t('pipelineConfiguration.form.nodeConfig')}
          <BasicButton type="primary" onClick={showNodeModal}>
            {t('pipelineConfiguration.form.node.addNode')}
          </BasicButton>
        </Space>
      </FormItemSubTitle>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={value?.map((i) => i.id ?? '') ?? []}
          strategy={verticalListSortingStrategy}
        >
          <ActiontechTable
            rowKey="id"
            dataSource={value}
            columns={PipelineNodeTableColumn()}
            actions={PipelineNodeTableActions(onEdit, onRemove)}
            locale={{
              emptyText: (
                <BasicEmpty>
                  <>
                    <Typography.Paragraph type="secondary">
                      {t('pipelineConfiguration.form.node.emptyTips')}
                    </Typography.Paragraph>
                  </>
                </BasicEmpty>
              )
            }}
            pagination={false}
            components={{ body: { row: DragTableRow } }}
          />
        </SortableContext>
      </DndContext>

      <NodeModal
        visible={visible}
        onCancel={onCancel}
        onSubmit={onChangeValue}
        editNodeId={editNodeId}
        form={form}
        nodeNameList={nodeNameList}
      />
    </PipelineNodeListStyleWrapper>
  );
};

export default PipelineNodeField;
