import { BasicButton, BasicModal, BasicTable } from '@actiontech/dms-kit';
import { Alert, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  SortableSQLFilesModalProps,
  SortableSQLFilesTableRowProps
} from './index.type';
import { SortableSqlFilesModalColumns } from './columns';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useRef, useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useRequest } from 'ahooks';
import {
  IAuditFileStatistic,
  IFileToSort
} from '@actiontech/shared/lib/api/sqle/service/common';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTableRequestError } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { ResponseCode } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
const SortableSqlFilesModal: React.FC<SortableSQLFilesModalProps> = ({
  open,
  onClose,
  taskId,
  refresh,
  workflowId
}) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName } = useCurrentProject();
  const draggedItemCollection = useRef<Set<string>>(new Set());
  const submit = () => {
    const filesToSort: IFileToSort[] = Array.from(
      draggedItemCollection.current
    ).map((v) => {
      return {
        file_id: Number(v),
        new_index: (dataSource.findIndex((item) => item.file_id === v) ?? 0) + 1
      };
    });
    task
      .updateSqlFileOrderV1({
        files_to_sort: filesToSort,
        workflow_id: workflowId ?? '',
        task_id: taskId ?? '',
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          closeModal();
          refresh();
          messageApi.success(
            t(
              'execWorkflow.audit.fileModeExecute.sortableSQLFilesModal.successTips'
            )
          );
        }
      });
  };
  const [dataSource, setDataSource] = useState<IAuditFileStatistic[]>([]);
  const { handleTableRequestError, requestErrorMessage } =
    useTableRequestError();
  const {
    run: fetchMoreData,
    data,
    loading
  } = useRequest(
    () => {
      const page = dataSource ? Math.ceil(dataSource.length / 20) + 1 : 1;
      return handleTableRequestError(
        task.getAuditFileList({
          task_id: taskId,
          page_index: `${page}`,
          page_size: '20'
        })
      ).then((res) => {
        setDataSource([...dataSource, ...(res.list ?? [])]);
        return res;
      });
    },
    {
      ready: open
    }
  );
  const resetDataSource = () => {
    handleTableRequestError(
      task.getAuditFileList({
        task_id: taskId,
        page_index: '1',
        page_size: '20'
      })
    ).then((res) => {
      setDataSource(res.list ?? []);
      draggedItemCollection.current = new Set();
      return res;
    });
  };
  const closeModal = () => {
    onClose();
    setDataSource([]);
    draggedItemCollection.current = new Set();
  };

  //drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1
      }
    })
  );
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.file_id === active.id);
        const overIndex = prev.findIndex((i) => i.file_id === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });

      // 前端只负责记录哪些列被拖拽过，最终提交这些拖拽过的项以及最终 index，后端处理变更
      draggedItemCollection.current.add(active.id as string);
    }
  };
  const TableRow = (props: SortableSQLFilesTableRowProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({
      id: props['data-row-key']
    });
    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      cursor: 'move',
      ...(isDragging
        ? {
            position: 'relative',
            zIndex: 9999
          }
        : {})
    };
    return (
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      />
    );
  };
  return (
    <>
      {messageContextHolder}
      <BasicModal
        size="large"
        onCancel={closeModal}
        open={open}
        title={t(
          'execWorkflow.audit.fileModeExecute.sortableSQLFilesModal.title'
        )}
        footer={
          <Space>
            <BasicButton onClick={closeModal}>{t('common.close')}</BasicButton>
            <BasicButton onClick={resetDataSource}>
              {t(
                'execWorkflow.audit.fileModeExecute.sortableSQLFilesModal.resetFileOrder'
              )}
            </BasicButton>
            <BasicButton onClick={submit} type="primary">
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        <Alert
          style={{
            marginBottom: 12
          }}
          message={t(
            'execWorkflow.audit.fileModeExecute.sortableSQLFilesModal.tips'
          )}
          type="info"
        />

        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={dataSource.map((i) => i.file_id!)}
            strategy={verticalListSortingStrategy}
          >
            <InfiniteScroll
              hasMore={dataSource.length < (data?.total ?? 0)}
              next={fetchMoreData}
              loader={null}
              dataLength={dataSource?.length || 0}
              scrollableTarget="scrollable-target"
            >
              <div
                id="scrollable-target"
                style={{
                  maxHeight: '600px',
                  overflow: 'auto'
                }}
              >
                <BasicTable
                  loading={loading}
                  errorMessage={requestErrorMessage}
                  rowKey="file_id"
                  className="clear-padding-bottom"
                  components={{
                    body: {
                      row: TableRow
                    }
                  }}
                  dataSource={dataSource.map((v, index) => ({
                    ...v,
                    index: index + 1
                  }))}
                  columns={SortableSqlFilesModalColumns()}
                  pagination={false}
                />
              </div>
            </InfiniteScroll>
          </SortableContext>
        </DndContext>
      </BasicModal>
    </>
  );
};
export default SortableSqlFilesModal;
