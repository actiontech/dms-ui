import { renderWithTheme } from '../../testUtil/customRender';
import BasicInfoList from './BasicInfoList';
import { BasicInfoListProps } from './BasicInfoList.types';

describe('lib/BasicInfoList', () => {
  const customRender = (params: BasicInfoListProps) => {
    return renderWithTheme(<BasicInfoList {...params} />);
  };

  it('render info list is loading | date empty | has error', () => {
    const { container } = customRender({
      loading: true,
      data: []
    });
    expect(container).toMatchSnapshot();

    const { container: containerEmpty } = customRender({
      loading: false,
      data: []
    });
    expect(containerEmpty).toMatchSnapshot();

    const { container: containerError } = customRender({
      loading: false,
      data: [],
      errorInfo: 'error str'
    });
    expect(containerError).toMatchSnapshot();
  });

  it('render info list has title', () => {
    const { container } = customRender({
      loading: false,
      title: 'info list 标题',
      data: []
    });
    expect(container).toMatchSnapshot();
  });

  it('render normal info list cont', () => {
    const { container } = customRender({
      loading: false,
      title: 'info list 标题',
      data: [
        {
          key: <>key1</>,
          value: <>value1</>
        },
        {
          key: <>key2</>,
          value: <>value2</>
        },
        {
          key: <>key3</>,
          value: <>value3</>
        }
      ]
    });
    expect(container).toMatchSnapshot();
  });

  it('render diff info list cont', () => {
    const { container } = customRender({
      loading: false,
      title: 'info list 标题',
      data: [
        {
          key: <>key1</>,
          value: <>value1</>
        },
        {
          key: <>key2</>,
          value: <>value2</>
        }
      ]
    });
    expect(container).toMatchSnapshot();
  });
});
