import * as useNavigateToWorkbench from '../../hooks/useNavigateToWorkbench';
import { mockUseNavigateToWorkbenchData } from './data';

export const mockUseNavigateToWorkbench = (
  data?: Partial<typeof mockUseNavigateToWorkbenchData>
) => {
  const spy = jest.spyOn(useNavigateToWorkbench, 'default');
  spy.mockImplementation(() => ({
    ...mockUseNavigateToWorkbenchData,
    ...data
  }));
  return spy;
};
