import copy from '../Copy';

describe('utils/Copy', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should create element input for copy text', () => {
    const input: any = {
      style: {},
      select: jest.fn(),
      setAttribute: (a: any, b: any) => {
        input[a] = b;
      }
    };
    jest.spyOn(document, 'createElement').mockImplementation(() => input);

    document.execCommand = jest.fn();
    const command = jest.spyOn(document, 'execCommand');
    const appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((input) => input);
    const removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation((input) => input);

    copy.copyText('123');
    expect(input.style).toEqual({
      position: 'fixed',
      left: '-9999px',
      top: '-9999px',
      opacity: '0'
    });
    expect(appendChildSpy).toHaveBeenCalledWith(input);
    expect(input.value).toBe('123');
    expect(input.select).toHaveBeenCalledTimes(1);
    expect(command).toHaveBeenCalledWith('copy');
    expect(removeChildSpy).toHaveBeenCalledWith(input);
  });

  test('should create element textarea for copy textarea text', () => {
    const textarea: any = {
      style: {},
      select: jest.fn(),
      setAttribute: (a: any, b: any) => {
        textarea[a] = b;
      }
    };
    jest.spyOn(document, 'createElement').mockImplementation(() => textarea);

    document.execCommand = jest.fn();
    const appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((textarea) => textarea);
    const removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation((textarea) => textarea);

    const normalStr = '123';
    copy.copyTextByTextarea(normalStr);
    expect(textarea.style).toEqual({
      position: 'fixed',
      left: '-9999px',
      top: '-9999px',
      opacity: '0'
    });
    expect(appendChildSpy).toHaveBeenCalledWith(textarea);
    expect(textarea.value).toBe(normalStr);
    expect(textarea.select).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledWith(textarea);

    const moreLineStr = 'sql select *\n from user_table\n left join users.id';
    copy.copyTextByTextarea(moreLineStr);
    expect(textarea).toMatchSnapshot();
    expect(textarea.value).toBe(moreLineStr);
    expect(textarea.select).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalledWith(textarea);
  });
});
