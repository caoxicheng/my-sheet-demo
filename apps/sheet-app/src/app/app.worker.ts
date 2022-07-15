/// <reference lib="webworker" />

import { WorkerMessage } from './app.component';
import { MockHandleService } from '@my-sheet/mock-handle';

const mockHandleService = new MockHandleService();

addEventListener('message', ({ data }: { data: WorkerMessage }) => {
  const { event, time, data: dataset } = data;
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
