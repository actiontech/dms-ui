import { renderWithTheme } from '../../testUtil/customRender';
import BasicModal from './BasicModal';
import { BasicModalProps } from './BasicModal.types';

describe('lib/BasicModal', () => {
  const customRender = (params: BasicModalProps) => {
    return renderWithTheme(<BasicModal {...params} />);
  };

  it('render diff size modal', () => {
    const { baseElement } = customRender({
      title: '基础modal480',
      open: true,
      closable: false
    });
    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement1 } = customRender({
      title: '基础modal960',
      open: true,
      closable: false,
      size: 'large'
    });
    expect(baseElement1).toMatchSnapshot();
  });

  it('render has close icon modal', () => {
    const { baseElement } = customRender({
      title: '基础modal480',
      open: true,
      children: <>内容区域</>
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render has width prop modal', () => {
    const { baseElement } = customRender({
      title: '基础modal480',
      open: true,
      children: <>内容区域</>,
      width: 720
    });
    expect(baseElement).toMatchSnapshot();
  });
});
