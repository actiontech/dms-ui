import { TableProps, ButtonProps, PopconfirmProps, InputProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { ColumnGroupType, ColumnType } from 'antd/es/table';
import { CSSProperties, ReactNode } from 'react';
import { CustomSelectProps } from '../CustomSelect';
import { IBasicButton } from '../BasicButton';
import { ICustomInputProps } from '../CustomInput';

//======================================= utils

type ComponentBaseType = {
  className?: string;
  style?: CSSProperties;
};

/**
 * 用于移除后端提供的表格筛选类型中的 page_size 以及 page_index, 同时可以传入第二个泛型, 来移除自己不需要的类型
 */
export type PageInfoWithoutIndexAndSize<
  T extends TablePagination & Record<string, any>,
  Other extends keyof T = ''
> = Omit<T, keyof TablePagination | Other>;

//=======================================

//======================================= filter
export type TypeFilterElement =
  | 'select'
  | 'date-range'
  | 'input'
  | 'search-input';

export type ICustomSearchInputProps = ICustomInputProps;

/**
 * 更新表格筛选数据的方法, 一般为 useTableRequestParams 导出的 updateTableFilterInfo
 */
export type UpdateTableFilterInfoType<F = Record<string, any>> = (
  params: F
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
 * 筛选按钮组件的 props
 */
export type TableFilterButtonProps<T = Record<string, any>> = {
  /**
   *  toolbar 中筛选按钮的数据源
   */
  filterButtonMeta?: ActiontechTableFilterButtonMeta<T>;

  /**
   * 同时勾选上所有的筛选项, 一般为 useTableRequestParams 导出的 updateAllSelectedFilterItem
   */
  updateAllSelectedFilterItem: (checked: boolean) => void;

  /**
   * 筛选按钮的 disabled
   */
  disabled?: boolean;
} & ComponentBaseType;

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

/**
 * FilterContainer 组件的 props
 */
export type TableFilterContainerProps<
  T = Record<string, any>,
  F = Record<string, any>,
  C = TypeFilterElement
> = {
  /**
   * FilterContainer 中筛选项的数据源
   */
  filterContainerMeta?: ActiontechTableFilterContainerMeta<T, F>;

  /**
   * 更新表格筛选数据
   */
  updateTableFilterInfo: UpdateTableFilterInfoType;

  /**
   * 表格筛选项的输入组件类型的 props, 目前只有 select 以及 date-range, 可以处理一些 onChange 等事件.
   */
  filterCustomProps?: Map<keyof T, FilterCustomProps<C>>;

  /**
   * 用于禁用筛选组件的输入, 一般在表格 loading 时禁用
   */
  disabled?: boolean;
} & ComponentBaseType;

export type FilterCustomProps<C = TypeFilterElement> = C extends 'select'
  ? CustomSelectProps
  : C extends 'date-range'
  ? RangePickerProps
  : C extends 'input'
  ? ICustomInputProps
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
} & Omit<IBasicButton, 'onClick'>;

/**
 * 表格列缓存数据格式
 */
export type CatchTableColumnValueType<
  T = Record<string, any>,
  OtherColumnKeys extends string = ''
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
 * toolbar 中操作按钮的数据格式
 */
export type ActiontechTableToolbarActionMeta = {
  key: string;
  text: ReactNode;
  buttonProps?: Omit<ButtonProps, 'children'>;
  confirm?: PopconfirmProps | false;
  permissions?: boolean;
};

/**
 * 表格 toolbar props
 */
export type TableToolbarProps<T = Record<string, any>> = {
  /**
   * toolbar 左侧部分
   */
  children?: ReactNode;
  /**
   * 控制 toolbar 中筛选按钮, 用于展开表格的筛选信息
   */
  filterButton?: TableFilterButtonProps<T> | false;
  /**
   * 控制 toolbar 右侧的表格设置按钮, 需要配合表格的 setting props 使用
   */
  setting?: ColumnsSettingProps | false;
  /**
   * 刷新表格数据, 仅作为按钮样式组件, 需要传入刷新表格方法
   */
  refreshButton?: TableRefreshButtonProps;
  /**
   * toolbar 中右方的按钮元数据
   */
  actions?: ActiontechTableToolbarActionMeta[] | false;
  /**
   * 表格快速筛选组件, 需要传入查询方法
   */
  searchInput?: TableSearchInputProps | false;
  /**
   * 是否需要自己重写 toolbar 样式
   */
  noStyle?: boolean;
  /**
   * 表格 loading, 防止表格在刷新时再次操作toolbar 进行请求
   */
  loading?: boolean;
} & ComponentBaseType;

//=======================================

/**
 * 表格操作列中按钮的数据格式
 */
export type ActiontechTableActionMeta<T = Record<string, any>> = {
  key: string;
  text: ReactNode;
  buttonProps?: (record?: T) => Omit<ButtonProps, 'children'>;
  confirm?: ((record?: T) => PopconfirmProps) | false;
  permissions?: (record?: T) => boolean;
};

/**
 * 表格操作列中更多按钮的数据格式
 */
export type InlineActiontechTableMoreActionsButtonMeta<
  T = Record<string, any>
> = {
  icon?: ReactNode;
  disabled?: boolean | ((record?: T) => boolean);
  onClick?: (record?: T) => void;
} & Pick<
  ActiontechTableActionMeta<T>,
  'key' | 'text' | 'confirm' | 'permissions'
>;

/**
 * todo: 如何控制 筛选项的顺序
 * 表格 columns props, 当配置 filterCustomType 和 filterKey 启用该列的筛选功能, 通过 useTableFilterContainer 来生成 筛选项的元数据
 * 当需要添加表格列以外的筛选列时, 可以使用 useTableFilterContainer 的第三个参数: extraFilterMeta
 */
type ExcludeSymbol<T> = T extends symbol ? never : T;
export type ActiontechTableColumn<
  T = Record<string, any>,
  F = Record<string, any>,
  OtherColumnKeys extends string = never
> = Array<
  Omit<ColumnGroupType<T> | ColumnType<T>, 'render' | 'dataIndex'> &
    {
      [K in keyof Required<T>]: {
        show?: boolean;
        dataIndex: ExcludeSymbol<K | OtherColumnKeys>;
        render?: (
          value: K | OtherColumnKeys extends keyof T ? T[K] : never,
          record: T,
          index: number
        ) => ColumnType<T>['render'] extends (...args: any) => infer R
          ? R
          : React.ReactNode;
      } & Pick<
        ActiontechTableFilterMetaValue<F>,
        'filterCustomType' | 'filterKey'
      >;
    }[keyof Required<T>]
>;

export interface ActiontechTableProps<
  T = Record<string, any>,
  F = Record<string, any>,
  OtherColumnKeys extends string = ''
> extends Omit<TableProps<T>, 'columns'> {
  setting?: ColumnsSettingProps | false;
  /**
   * 生成表格操作列
   */
  actions?:
    | {
        title?: ActiontechTableColumn<T, F, OtherColumnKeys>[0]['title'];
        moreButtons?:
          | InlineActiontechTableMoreActionsButtonMeta<T>[]
          | ((record: T) => InlineActiontechTableMoreActionsButtonMeta<T>[]);
        buttons: ActiontechTableActionMeta<T>[];
        fixed?: ActiontechTableColumn<T, F, OtherColumnKeys>[0]['fixed'];
        width?: ActiontechTableColumn<T, F, OtherColumnKeys>[0]['width'];
      }
    | ActiontechTableActionMeta<T>[];

  /**
   * 表格的 toolbar, 和组件 TableToolbar 的 props 相同, 使用该 props 时, toolbar 会默认在表格上方
   */
  toolbar?: TableToolbarProps<T> | false;

  /**
   * 表格的 筛选项, 和组件 TableFilterContainer 的 props 相同, 使用该 props 时, filterContainer 会默认在表格上方
   */
  filterContainerProps?: TableFilterContainerProps<T>;

  /**
   * 表格的错误消息, 一般用于表格数据请求出现错误时, 一般使用 useTableRequestError 来获取
   */
  errorMessage?: string;

  columns?: ActiontechTableColumn<T, F, OtherColumnKeys>;

  /**
   * 控制表格的分页器是否固定于页面底部，默认为true，固定在页面底部，注意：只有在表格有pagination时，设置isPaginationFixed才有意义
   */
  isPaginationFixed?: boolean;
}
