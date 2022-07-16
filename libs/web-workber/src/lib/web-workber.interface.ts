// 临时用worker类型
export interface WorkerMessage {
  event: WorkerEvent;
  time?: number;
  result?: any;
}

export type WorkerEvent = 'mockData';
