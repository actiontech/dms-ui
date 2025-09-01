import { InputProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { CustomSelectProps } from '../CustomSelect';
import { BasicButtonProps } from '../BasicButton';
import { ExcludeSymbol } from '../../types/common.type';
import { CustomInputProps } from '../CustomInput';

/**
 * 用于移除后端提供的表格筛选类型中的 page_size 以及 page_index, 同时可以传入第二个泛型, 来移除自己不需要的类型
 */
export type PageInfoWithoutIndexAndSize<
  T extends TablePagination & Record<string, any>,
  Other extends keyof T = never
> = Omit<T, keyof TablePagination | Other>;

//=======================================

//======================================= filter
export type TypeFilterElement =
  | 'select'
  | 'date-range'
  | 'input'
  | 'search-input';

export type ICustomSearchInputProps = CustomInputProps;

/**
 * 更新表格筛选数据的方法, 一般为 useTableRequestParams 导出的 updateTableFilterInfo
 */
export type UpdateTableFilterInfoType<F = Record<string, any>> = (
  params: F | ((prevParams: F) => F)
) => void;

/**
 * toolbar 中筛选按钮的数据源, 由于历史原因, 最初点击筛选按钮后, 需要勾选上需要添加的筛选项, 所以这里有 checked 属性.
 * 目前点击筛选按钮后, 会同时 checked 所有的筛选项
 * 数据一般为 useTableRequestParams 导出的 filterButtonMeta
 */
export type ActiontechTableFilterButtonMeta<T = Record<string, any>> = Map<
  keyof T,
  Pick<
    Required<ActiontechTableFilterMetaValue>,
    'checked' | 'filterLabel' | 'filterCustomType'
  >
>;

/**
 * 数据一般为 useTableRequestParams 导出的 filterContainerMeta
 */
export type ActiontechTableFilterContainerMeta<
  T = Record<string, any>,
  F = Record<string, any>
> = Array<
  Omit<ActiontechTableFilterMetaValue<F>, 'checked'> & {
    dataIndex: keyof T;
  }
>;

export type FilterCustomProps<C = TypeFilterElement> = C extends 'select'
  ? CustomSelectProps
  : C extends 'date-range'
  ? RangePickerProps
  : C extends 'input'
  ? CustomInputProps
  : C extends 'search-input'
  ? ICustomSearchInputProps
  : never;

/**
 * 表格筛选信息中 value 的数据格式
 */
export type ActiontechTableFilterMetaValue<
  F = Record<string, any>,
  C = TypeFilterElement
> = {
  /**
   * 是否在筛选按钮中选中该项
   */
  checked?: boolean;

  /**
   * 筛选项类型, 'select', 'date-range', 'input'
   */
  filterCustomType?: C;

  /**
   * 最后筛选数据中的 key 值, 一般为当前表格筛选数据类型的某项,
   * 当筛选类型为 date-range 时, filterKey 一般为 [开始时间Key, 结束时间Key], 此时会将开始时间赋值在 filterKey[0], 结束时间赋值在 filterKey[1]
   * 如果筛选类型不为 date-range, 但是 filterKey 也是一个数组时, 会将select选中的值赋值给数组中的所有项
   */
  filterKey?: keyof F | Array<keyof F>;

  /**
   * 筛选项的 label
   */
  filterLabel?: string;
};

/**
 * 表格筛选信息, Map 结构
 * key 为 表格列的 dataIndex, value 结构见 ActiontechTableFilterMetaValue
 * 表格列中的筛选信息通过 useTableFilterContainer 生成,
 * 主要作为定义表格列以外的筛选项的类型
 */
export type ActiontechTableFilterMeta<
  RecordType = Record<string, any>,
  F = Record<string, any>
> = Map<keyof RecordType, ActiontechTableFilterMetaValue<F>>;

export type UseTableRequestParamsOptions<F = Record<string, any>> = {
  defaultPageSize?: number;
  defaultPageIndex?: number;
  defaultFilterInfo?: F;
  defaultSearchKeyword?: string;
};

export type TablePagination = {
  page_index: number;
  page_size: number;
};

//=======================================

//======================================= toolbar

/**
 * 表格模糊查询
 */
export type TableSearchInputProps = {
  onChange?: (value: string) => void;
  onSearch?: () => void;
} & Omit<InputProps, 'onChange'>;

/**
 * 表格刷新
 */
export type TableRefreshButtonProps = {
  refresh?: () => void;
} & Omit<BasicButtonProps, 'onClick'>;

/**
 * 表格列缓存数据格式
 */
export type CatchTableColumnValueType<
  T = Record<string, any>,
  OtherColumnKeys extends string = never
> = {
  /**
   * key 为用户名
   */
  [key in keyof T | OtherColumnKeys]: {
    /**
     * 顺序
     */
    order: number;

    /**
     * 是否显示
     */
    show: boolean;

    /**
     * 是否固定, 类型同 antd 中的 fixed
     */
    fixed?: ActiontechTableColumn<T>[0]['fixed'];

    /**
     * 表头名, 通 columns 中的 title, 如果 columns 中的 title 为 ReactNode, 会使用 utils 中的 getColumnsLabel 来获取中文
     */
    title: string;
  };
};

export type CatchTableColumnsType<T = Record<string, any>> = {
  [key: string]: CatchTableColumnValueType<T>;
};

/**
 * 表格设置 props
 */
export type ColumnsSettingProps = {
  /**
   * 表格 key 值, 需要全局唯一, 用与 localeStorage 中缓存数据的 key 值
   */
  tableName: string;

  /**
   * 当前用户名, 用于区分不同用户下表格列的缓存数据
   */
  username: string;
};

/**
 * todo: 如何控制 筛选项的顺序
 * 表格 columns props, 当配置 filterCustomType 和 filterKey 启用该列的筛选功能, 通过 useTableFilterContainer 来生成 筛选项的元数据
 * 当需要添加表格列以外的筛选列时, 可以使用 useTableFilterContainer 的第三个参数: extraFilterMeta
 */
type ColumnValueType<T, K extends string | keyof T> = K extends keyof T
  ? T[K]
  : never;

type BaseColumnType<T, K extends string | keyof T, F = Record<string, any>> = {
  show?: boolean;
  dataIndex: ExcludeSymbol<K>;
  render?: (
    value: ColumnValueType<T, K>,
    record: T,
    index: number
  ) => ColumnType<T>['render'] extends (...args: any) => infer R
    ? R
    : React.ReactNode;
} & Pick<
  ActiontechTableFilterMetaValue<F>,
  'filterCustomType' | 'filterKey' | 'filterLabel'
>;

export type ActiontechTableColumn<
  T = Record<string, any>,
  F = Record<string, any>,
  OtherColumnKeys extends string = never
> = Array<
  Omit<ColumnGroupType<T> | ColumnType<T>, 'dataIndex' | 'render'> &
    (
      | {
          [K in keyof Required<T>]: BaseColumnType<T, K, F>;
        }[keyof Required<T>]
      | {
          [K in OtherColumnKeys]: BaseColumnType<T, K, F>;
        }[OtherColumnKeys]
    )
>;
