import { ItemType } from 'antd5/es/menu/hooks/useItems';
import { NavigateFunction } from 'react-router-dom';

export type CustomMenuItemType =
  | (ItemType & {
      order?: number;
    })
  | null;

export type GenerateMenuItemsType = (arg: {
  navigate: NavigateFunction;
}) => CustomMenuItemType[];
