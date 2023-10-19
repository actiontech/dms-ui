import EventEmitter from '../EventEmitter';

enum EventEmitterKey {
  Refresh_User_List_Table = 'Refresh_User_List_Table'
}

const eventEmitter = new EventEmitter<EventEmitterKey>();

describe('utils/EventEmitter', () => {
  const TEST_KEY = EventEmitterKey.Refresh_User_List_Table;

  test('should call subscribe function when emit event', () => {
    const willCall = jest.fn();
    eventEmitter.subscribe(TEST_KEY, willCall);
    eventEmitter.emit(TEST_KEY, 'test');
    expect(willCall).toBeCalledTimes(1);
    expect(willCall).toBeCalledWith('test');
    eventEmitter.unsubscribe(TEST_KEY, willCall);
  });

  test('should not call function which already unsubscribe', () => {
    const willCall = jest.fn();
    eventEmitter.subscribe(TEST_KEY, willCall);
    eventEmitter.unsubscribe(TEST_KEY, willCall);
    eventEmitter.emit(TEST_KEY, 'test');
    expect(willCall).not.toBeCalled();
  });

  test('should only toggle once when user subscribe event by once method', () => {
    const willCall = jest.fn();
    eventEmitter.once(TEST_KEY, willCall);
    eventEmitter.emit(TEST_KEY, 'test');
    expect(willCall).toBeCalledTimes(1);
    expect(willCall).toBeCalledWith('test');
    eventEmitter.emit(TEST_KEY, 'test2');
    expect(willCall).toBeCalledTimes(1);
  });
});
