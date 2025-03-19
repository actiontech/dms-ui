import { createContext } from 'react';
import { ActiontechTableProps } from '../index.type';

type ActiontechTableContextType = {
  setting?: ActiontechTableProps['setting'];
};

const ActiontechTableContext = createContext<ActiontechTableContextType | null>(
  null
);

ActiontechTableContext.displayName = 'ActiontechTableContext';

const ActiontechTableContextProvide = ActiontechTableContext.Provider;

export { ActiontechTableContext, ActiontechTableContextProvide };

export type { ActiontechTableContextType };
