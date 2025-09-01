import Download from '../Download';

describe('utils/Download', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test('should create element a for download file stream', () => {
    window.URL.createObjectURL = jest.fn().mockReturnValue('http://test.com');
    const appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((a) => a);
    const removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation((a) => a);
    const link: any = {
      click: jest.fn(),
      setAttribute: (a: any, b: any) => {
        link[a] = b;
      }
    };
    const createElementSPy = jest.spyOn(document, 'createElement');
    createElementSPy.mockImplementation(() => link);
    Download.downloadByCreateElementA('test', 'test.txt');
    expect(link.download).toBe('test.txt');
    expect(link.href).toBe('http://test.com');
    expect(appendChildSpy).toHaveBeenCalledWith(link);
    expect(link.click).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledWith(link);
  });

  test('should create element a for download file blob', () => {
    window.URL.createObjectURL = jest.fn().mockReturnValue('http://test.com');
    const appendChildSpy = jest
      .spyOn(document.body, 'appendChild')
      .mockImplementation((a) => a);
    const removeChildSpy = jest
      .spyOn(document.body, 'removeChild')
      .mockImplementation((a) => a);
    const link: any = {
      click: jest.fn(),
      setAttribute: (a: any, b: any) => {
        link[a] = b;
      }
    };
    const createElementSPy = jest.spyOn(document, 'createElement');
    createElementSPy.mockImplementation(() => link);
    Download.downloadBlobFile(new Blob(['test']), 'test.txt');
    expect(link.download).toBe('test.txt');
    expect(link.href).toBe('http://test.com');
    expect(appendChildSpy).toHaveBeenCalledWith(link);
    expect(link.click).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledWith(link);
  });
});
