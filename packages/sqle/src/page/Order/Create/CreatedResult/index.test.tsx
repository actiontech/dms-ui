import { renderWithThemeAndRouter } from '../../../../testUtils/customRender';

import CreatedResult from '.';

describe('sqle/Order/Create/CreatedResult', () => {
  it('render snap', () => {
    const { baseElement } = renderWithThemeAndRouter(
      <CreatedResult
        createdOrderId="createdOrderId"
        projectID="projectID"
        desc="desc"
        hidden={false}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render hidden snap', () => {
    const { baseElement } = renderWithThemeAndRouter(
      <CreatedResult
        createdOrderId="createdOrderId"
        projectID="projectID"
        desc="desc"
        hidden={true}
      />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
