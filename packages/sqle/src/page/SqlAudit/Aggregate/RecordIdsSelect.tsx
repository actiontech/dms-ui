import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounceFn } from 'ahooks';
import { Checkbox, Empty, Pagination, Spin, Space } from 'antd';
import {
  BasicButton,
  BasicInput,
  BasicModal,
  BasicTag
} from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import sql_audit_record from '@actiontech/shared/lib/api/sqle/service/sql_audit_record';
import { getSQLAuditRecordsV1FilterSqlAuditStatusEnum } from '@actiontech/shared/lib/api/sqle/service/sql_audit_record/index.enum';
import type { ISQLAuditRecord } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { RecordPickerStyleWrapper } from './style';

/** 已选上限（≠候选展示上限；候选按服务端 total_nums 翻全） */
const MAX_RECORD_IDS = 50;
/** 弹层每页条数 = 服务端 page_size；固定高度列表，降低 DOM */
const LIST_PAGE_SIZE = 10;

export type RecordIdsSelectProps = {
  value: string[];
  onChange: (ids: string[]) => void;
  onOverLimit: () => void;
};

type RecordCard = {
  id: string;
  time: string;
  instanceLabel: string;
  tags: string[];
  creator: string;
  searchText: string;
};

const toCard = (record: ISQLAuditRecord): RecordCard | null => {
  const id = record.sql_audit_record_id?.trim();
  if (!id) {
    return null;
  }
  const creator = record.creator?.trim() || '-';
  const instanceName = record.task?.instance_name?.trim();
  const instanceLabel = instanceName
    ? instanceName
    : record.instance?.db_host
    ? `${record.instance.db_host}:${record.instance.db_port ?? ''}`
    : '';
  const tags = (record.tags ?? []).filter(Boolean);
  const time = formatTime(record.created_at, '-');
  // 列表契约无稳定 sql_count：不挂载 SQL 数量，卡片侧不展示（禁「-」占位）
  return {
    id,
    time,
    instanceLabel,
    tags,
    creator,
    searchText: [id, creator, instanceLabel, tags.join(',')]
      .join(' ')
      .toLowerCase()
  };
};

const uniqueIds = (ids: string[]): string[] => {
  const out: string[] = [];
  const seen = new Set<string>();
  ids.forEach((raw) => {
    const id = String(raw ?? '').trim();
    if (!id || seen.has(id)) {
      return;
    }
    seen.add(id);
    out.push(id);
  });
  return out;
};

/**
 * 指定审核记录选人器（弹层）：
 * 服务端分页（page_index + total_nums）；跨页勾选累计 ≤ MAX_RECORD_IDS。
 */
const RecordIdsSelect = ({
  value,
  onChange,
  onOverLimit
}: RecordIdsSelectProps) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  /** 当前服务端页候选（仅本页 DOM） */
  const [cards, setCards] = useState<RecordCard[]>([]);
  /** 接口 total_nums：候选可翻全，与已选上限解耦 */
  const [totalNums, setTotalNums] = useState(0);
  const [draftSelected, setDraftSelected] = useState<string[]>([]);
  const [listPage, setListPage] = useState(1);
  const latestKeywordRef = useRef('');
  const latestPageRef = useRef(1);
  const cardMapRef = useRef<Map<string, RecordCard>>(new Map());

  const fetchRecords = useCallback(
    async (searchKeyword: string, pageIndex: number) => {
      const trimmed = searchKeyword.trim();
      const page = Math.max(1, pageIndex);
      latestKeywordRef.current = trimmed;
      latestPageRef.current = page;
      setLoading(true);
      try {
        const params: Parameters<
          typeof sql_audit_record.getSQLAuditRecordsV1
        >[0] = {
          project_name: projectName,
          filter_sql_audit_status:
            getSQLAuditRecordsV1FilterSqlAuditStatusEnum.successfully,
          page_index: page,
          page_size: LIST_PAGE_SIZE
        };
        if (trimmed) {
          if (/^[A-Za-z0-9_-]{6,}$/.test(trimmed) && !/\s/.test(trimmed)) {
            params.filter_sql_audit_record_ids = trimmed;
          } else {
            params.fuzzy_search_tags = trimmed;
          }
        }
        const res = await sql_audit_record.getSQLAuditRecordsV1(params);
        if (
          latestKeywordRef.current !== trimmed ||
          latestPageRef.current !== page
        ) {
          return;
        }
        if (res.data.code === ResponseCode.SUCCESS) {
          const list = res.data.data ?? [];
          const total = Number(res.data.total_nums ?? 0);
          const next = new Map(cardMapRef.current);
          const visible: RecordCard[] = [];
          list.forEach((record) => {
            const card = toCard(record);
            if (card) {
              next.set(card.id, card);
              visible.push(card);
            }
          });
          cardMapRef.current = next;
          setCards(visible);
          setTotalNums(Number.isFinite(total) && total >= 0 ? total : 0);
          setListPage(page);
        }
      } finally {
        if (
          latestKeywordRef.current === trimmed &&
          latestPageRef.current === page
        ) {
          setLoading(false);
        }
      }
    },
    [projectName]
  );

  const { run: debouncedSearch } = useDebounceFn(
    (searchKeyword: string) => {
      void fetchRecords(searchKeyword, 1);
    },
    { wait: 300 }
  );

  useEffect(() => {
    if (!open) {
      return;
    }
    // 打开时同步已选；翻页不重置 draftSelected（跨页累计）
    setDraftSelected(uniqueIds(value));
    setKeyword('');
    setListPage(1);
    cardMapRef.current = new Map();
    void fetchRecords('', 1);
  }, [open, value, fetchRecords]);

  const applyDraftLimit = useCallback(
    (ids: string[]) => {
      const unique = uniqueIds(ids);
      if (unique.length > MAX_RECORD_IDS) {
        onOverLimit();
        return unique.slice(0, MAX_RECORD_IDS);
      }
      return unique;
    },
    [onOverLimit]
  );

  const toggleId = useCallback(
    (id: string, checked: boolean) => {
      setDraftSelected((prev) => {
        if (checked) {
          if (prev.includes(id)) {
            return prev;
          }
          return applyDraftLimit([...prev, id]);
        }
        return prev.filter((item) => item !== id);
      });
    },
    [applyDraftLimit]
  );

  /** 仅勾选当前页可见项，与已选跨页合并 */
  const selectVisible = useCallback(() => {
    setDraftSelected((prev) =>
      applyDraftLimit([...prev, ...cards.map((card) => card.id)])
    );
  }, [applyDraftLimit, cards]);

  const clearDraft = useCallback(() => {
    setDraftSelected([]);
  }, []);

  const handleConfirm = useCallback(() => {
    const next = applyDraftLimit(draftSelected);
    onChange(next);
    setOpen(false);
  }, [applyDraftLimit, draftSelected, onChange]);

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      // 显式保留 draftSelected（state 不因翻页清空）
      void fetchRecords(keyword, page);
    },
    [fetchRecords, keyword]
  );

  const triggerLabel =
    value.length === 0
      ? t('sqlAudit.aggregate.filter.pickerTriggerEmpty')
      : t('sqlAudit.aggregate.filter.pickerTriggerSelected', {
          count: value.length
        });

  return (
    <>
      <RecordPickerStyleWrapper>
        <BasicButton
          className="record-picker-trigger"
          block
          onClick={() => setOpen(true)}
          data-testid="sql-audit-aggregate-record-ids"
        >
          <span className="record-picker-trigger-label">{triggerLabel}</span>
          <span className="record-picker-trigger-action">
            {t('sqlAudit.aggregate.filter.pickerOpen')}
          </span>
        </BasicButton>
      </RecordPickerStyleWrapper>

      <BasicModal
        open={open}
        title={t('sqlAudit.aggregate.filter.pickerTitle')}
        width={760}
        onCancel={handleCancel}
        destroyOnClose
        data-testid="sql-audit-aggregate-record-picker-modal"
        footer={
          <RecordPickerStyleWrapper>
            <div className="record-picker-footer">
              <span
                className="record-picker-count"
                data-testid="sql-audit-aggregate-record-picker-count"
              >
                {t('sqlAudit.aggregate.filter.pickerSelectedCount', {
                  count: draftSelected.length,
                  max: MAX_RECORD_IDS
                })}
              </span>
              <Space>
                <BasicButton onClick={handleCancel}>
                  {t('common.cancel')}
                </BasicButton>
                <BasicButton
                  type="primary"
                  disabled={draftSelected.length === 0}
                  onClick={handleConfirm}
                  data-testid="sql-audit-aggregate-record-picker-confirm"
                >
                  {t('sqlAudit.aggregate.filter.pickerConfirm')}
                </BasicButton>
              </Space>
            </div>
          </RecordPickerStyleWrapper>
        }
      >
        <RecordPickerStyleWrapper>
          <div className="record-picker-modal-hint">
            {t('sqlAudit.aggregate.filter.pickerHint')}
          </div>
          <div className="record-picker-toolbar">
            <BasicInput
              allowClear
              value={keyword}
              placeholder={t(
                'sqlAudit.aggregate.filter.pickerSearchPlaceholder'
              )}
              onChange={(e) => {
                const next = e.target.value;
                setKeyword(next);
                setListPage(1);
                debouncedSearch(next);
              }}
              data-testid="sql-audit-aggregate-record-picker-search"
            />
            <BasicButton onClick={selectVisible}>
              {t('sqlAudit.aggregate.filter.pickerSelectVisible')}
            </BasicButton>
            <BasicButton onClick={clearDraft}>
              {t('sqlAudit.aggregate.filter.pickerClear')}
            </BasicButton>
          </div>

          <Spin spinning={loading}>
            <div
              className="record-picker-list"
              data-testid="sql-audit-aggregate-record-picker-list"
            >
              {cards.length === 0 && !loading ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div className="record-picker-empty">
                      <strong>
                        {t('sqlAudit.aggregate.filter.pickerEmptyTitle')}
                      </strong>
                      <span>
                        {t('sqlAudit.aggregate.filter.pickerEmptyTip')}
                      </span>
                    </div>
                  }
                />
              ) : (
                cards.map((card) => {
                  const checked = draftSelected.includes(card.id);
                  const disabled =
                    !checked && draftSelected.length >= MAX_RECORD_IDS;
                  return (
                    <label
                      className="record-picker-option"
                      key={card.id}
                      data-testid={`sql-audit-aggregate-record-option-${card.id}`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={disabled}
                        onChange={(e) => toggleId(card.id, e.target.checked)}
                      />
                      <div className="record-picker-option-main">
                        <div className="record-picker-id">{card.id}</div>
                        <div className="record-picker-sub">{card.time}</div>
                      </div>
                      <div className="record-picker-option-main">
                        <div>
                          {card.instanceLabel ||
                            t('sqlAudit.aggregate.filter.pickerOffline')}
                        </div>
                        <div className="record-picker-tags">
                          {card.tags.length === 0
                            ? null
                            : card.tags.map((tag) => (
                                <BasicTag key={tag} size="small">
                                  {tag}
                                </BasicTag>
                              ))}
                        </div>
                      </div>
                      <div className="record-picker-option-side">
                        <div>{card.creator}</div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
            {totalNums > 0 ? (
              <div className="record-picker-pagination">
                <Pagination
                  size="small"
                  current={listPage}
                  pageSize={LIST_PAGE_SIZE}
                  total={totalNums}
                  showSizeChanger={false}
                  onChange={handlePageChange}
                  data-testid="sql-audit-aggregate-record-picker-pagination"
                />
              </div>
            ) : null}
          </Spin>
        </RecordPickerStyleWrapper>
      </BasicModal>
    </>
  );
};

export default RecordIdsSelect;
export { MAX_RECORD_IDS };
