import { superRender } from '../../../testUtil/superRender';
import ReminderInformation from '../ReminderInformation';

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
