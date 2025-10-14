import { PipelineNodeFieldProps } from '../index.type';
import { PipelineNodeTableColumn, PipelineNodeTableActions } from './column';
import { FormItemSubTitle } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import { Space, Form, Typography } from 'antd';
import { BasicButton, BasicEmpty } from '@actiontech/dms-kit';
import { PipelineNodeListStyleWrapper } from '../../style';
import NodeModal from './NodeModal';
import { useBoolean } from 'ahooks';
import React, { useMemo, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { DragEndEvent } from '@dnd-kit/core';
import { DragTableRow } from './DragTableRow';
import { PipelineNodeType } from '../index.type';
import { ActiontechTable } from '@actiontech/dms-kit/es/components/ActiontechTable';
const PipelineNodeField: React.FC<PipelineNodeFieldProps> = ({
  value,
  onChange
}) => {
  const { t } = useTranslation();
  const [visible, { setTrue: showNodeModal, setFalse: hideNodeModal }] =
    useBoolean();
  const [editNodeId, setEditNodeId] = useState<string>();
  const [form] = Form.useForm<PipelineNodeType>();
  const onEdit = (id?: string) => {
    setEditNodeId(id);
    form.setFieldsValue(value?.find((v) => v.id === id) ?? {});
    showNodeModal();
  };
  const onRemove = (id?: string) => {
    const index = value?.findIndex((v) => v.id === id);
    value?.splice(index!, 1);
    onChange?.([...(value ?? [])]);
  };
  const onChangeValue = async () => {
    const values = await form.validateFields();
    if (editNodeId) {
      const index = value?.findIndex((v) => v.id === editNodeId);
      value?.splice(index!, 1, {
        ...values,
        id: editNodeId
      });
      onChange?.([...(value ?? [])]);
    } else {
      // 因为name在当前流水线是唯一的，所以添加节点用name作为自定义id submit时会删除掉此id
      onChange?.([
        ...(value ?? []),
        {
          ...values,
          id: values?.id ?? values.name
        }
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
            components={{
              body: {
                row: DragTableRow
              }
            }}
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
