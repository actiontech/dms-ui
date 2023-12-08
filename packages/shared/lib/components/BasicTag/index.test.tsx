import BasicTag, { IBasicTag } from '.';
import { renderWithTheme } from '../../testUtil/customRender';

describe('lib/BasicTag', () => {
  const customRender = (params: IBasicTag) => {
    return renderWithTheme(<BasicTag {...params} />);
  };

  it('render diff size tag', () => {
    const { baseElement } = customRender({
      size: 'large'
    });
    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement1 } = customRender({
      size: 'small'
    });
    expect(baseElement1).toMatchSnapshot();

    const { baseElement: baseElement2 } = customRender({
      size: 'default'
    });
    expect(baseElement2).toMatchSnapshot();
  });

  it('render diff color tag', () => {
    const { baseElement } = customRender({
      color: 'default'
    });
    expect(baseElement).toMatchSnapshot();

    const { baseElement: redBaseElement } = customRender({
      color: 'red'
    });
    expect(redBaseElement).toMatchSnapshot();

    const { baseElement: orangeBaseElement } = customRender({
      color: 'orange'
    });
    expect(orangeBaseElement).toMatchSnapshot();

    const { baseElement: goldBaseElement } = customRender({
      color: 'orange'
    });
    expect(goldBaseElement).toMatchSnapshot();

    const { baseElement: greenBaseElement } = customRender({
      color: 'green'
    });
    expect(greenBaseElement).toMatchSnapshot();

    const { baseElement: cyanBaseElement } = customRender({
      color: 'cyan'
    });
    expect(cyanBaseElement).toMatchSnapshot();

    const { baseElement: blueBaseElement } = customRender({
      color: 'blue'
    });
    expect(blueBaseElement).toMatchSnapshot();

    const { baseElement: geekblueBaseElement } = customRender({
      color: 'geekblue'
    });
    expect(geekblueBaseElement).toMatchSnapshot();

    const { baseElement: purpleBaseElement } = customRender({
      color: 'purple'
    });
    expect(purpleBaseElement).toMatchSnapshot();

    const { baseElement: GrapeBaseElement } = customRender({
      color: 'Grape'
    });
    expect(GrapeBaseElement).toMatchSnapshot();

    const { baseElement: lilacBaseElement } = customRender({
      color: 'lilac'
    });
    expect(lilacBaseElement).toMatchSnapshot();

    const { baseElement: grayBaseElement } = customRender({
      color: 'gray'
    });
    expect(grayBaseElement).toMatchSnapshot();
  });
});
