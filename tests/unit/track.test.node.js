// eslint-disable-next-line no-underscore-dangle
global.__non_webpack_require__ = require;

const http = require('http');

jest.mock('http');
http.request.mockReturnValue({on: () => {}, end: () => {}});
const spy = jest.spyOn(http, 'request');

const {default: track, sendBatch, setTrackingServer} = require('../../src/track');

describe('track', () => {
  test('should apply updated tracking server info', () => {
    setTrackingServer('201.123.68.122', 9031);
    track({});
    sendBatch();
    expect(spy).toBeCalledWith(
      expect.objectContaining({
        host: '201.123.68.122',
        port: 9031,
      }),
      expect.any(Function),
    );
  });

  test('should track and send batch', () => {
    track({});
    sendBatch();
    expect(spy).toBeCalledTimes(1);
  });

  test('should batch', async () => {
    track({});
    // Request should not be sent immediately
    expect(spy).toBeCalledTimes(0);
    // Batch should go out one second later
    await new Promise((r) => {
      setTimeout(r, 1200);
    });
    expect(spy).toBeCalledTimes(1);
  });
});
