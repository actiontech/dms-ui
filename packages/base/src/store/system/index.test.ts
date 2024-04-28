import reducers, { updateWebTitleAndLogo, updateSqlOptimizationIsSupported } from '.';

import { IReduxState } from '..';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';

describe('store system', () => {
  const state: IReduxState['system'] = {
    modalStatus: {},
    webTitle: DMS_DEFAULT_WEB_TITLE,
    sqlOptimizationIsSupported: false
  };

  it('should update web info for execute updateWebTitleAndLogo', () => {
    const newState = reducers(
      state,
      updateWebTitleAndLogo({
        webTitle: 'this is a title',
        webLogoUrl: 'this is a web logo url'
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      webTitle: 'this is a title',
      webLogoUrl: 'this is a web logo url',
      sqlOptimizationIsSupported: false,
    });
  });

  it('should update sql optimization is supported', () => {
    const newState = reducers(
      state,
      updateSqlOptimizationIsSupported({
        isSupported: true
      })
    );
    expect(newState).not.toBe(state);
    expect(newState).toEqual({
      modalStatus: {},
      webTitle: DMS_DEFAULT_WEB_TITLE,
      sqlOptimizationIsSupported: true
    });
  });
});
