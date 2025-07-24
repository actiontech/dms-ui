import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { generateSegmentedLabel } from '.';
import { screen } from '@testing-library/react';

describe('page/Home/CommonTable', () => {
  it('render segment label with badgeCount', () => {
    const { baseElement } = superRender(
      <>{generateSegmentedLabel('test', 5)}</>
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('render segment label without badgeCount', () => {
    const { baseElement } = superRender(<>{generateSegmentedLabel('test')}</>);
    expect(baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          test
        </div>
      </body>
    `);
  });
});
