/// <reference lib="webworker" />

import { MockHandleService } from '@my-sheet/mock-handle';
import { WorkerMessage } from '@my-sheet/web-workber';

const mockHandleService = new MockHandleService();

addEventListener('message', ({ data }: { data: WorkerMessage }) => {
  const { event, time } = data;
  switch (event) {
    case 'mockData':
      postMessage({
        event: 'mockData',
        result: mockHandleService.mockDataMultiple(time),
      } as WorkerMessage);
      break;
    default:
  }
});
