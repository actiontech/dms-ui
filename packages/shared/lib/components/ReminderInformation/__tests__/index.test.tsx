import { superRender } from '../../../testUtil/customRender';
import ReminderInformation from '..';

describe('shared/lib/components/ReminderInformation', () => {
  it('render success message', async () => {
    const { baseElement } = superRender(
      <ReminderInformation status="success" message="success message" />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render error message', async () => {
    const { baseElement } = superRender(
      <ReminderInformation status="error" message="error message" />
    );
    expect(baseElement).toMatchSnapshot();
  });
});
