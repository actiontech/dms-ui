import { superRender } from '../../../testUtil/customRender';
import ActionButtonGroup from '../ActionButtonGroup';

describe('ActionButtonGroup', () => {
  it('should match snapshot', () => {
    const { container } = superRender(
      <ActionButtonGroup
        actions={[
          { key: 'button', text: 'Click Me' },
          {
            key: 'link',
            text: 'Go to Home',
            actionType: 'navigate-link',
            link: { to: '/' }
          },
          {
            key: 'confirm',
            text: 'Delete',
            actionType: 'confirm',
            confirm: { title: 'Are you sure' }
          },
          {
            key: 'tooltip',
            text: 'Info',
            actionType: 'tooltip',
            tooltip: { title: 'More informateion' }
          }
        ]}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
