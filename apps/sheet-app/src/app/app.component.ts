import { Component, OnDestroy } from '@angular/core';
import { SheetHandleService } from '@my-sheet/sheet-handle';
import { MockHandleService } from '@my-sheet/mock-handle';
import { Subject } from 'rxjs';
import { utils, writeFile } from 'xlsx';

// 临时用worker类型
export interface WorkerMessage {
  event: WorkerEvent;
  time?: number;
  result?: any;
  data?: any;
}

export type WorkerEvent = 'mockData';

@Component({
  selector: 'my-sheet-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'sheet-app';
  // 步数
  public step = 0;
  // 当然进度
  public progress = 0;
  private worker1!: Worker;
  private worker2!: Worker;
  private worker3!: Worker;
  private worker4!: Worker;
  private destroy$ = new Subject<void>();
  private startTime!: number;
  // 储存的数据
  private data: Record<string, any>[] = [];

  constructor(
    private sheetHandle: SheetHandleService,
    private mockHandle: MockHandleService
  ) {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker1 = new Worker(new URL('./app.worker', import.meta.url), {
        type: 'module',
      });
      this.worker1.onmessage = ({ data }: { data: WorkerMessage }) => {
        switch (data.event) {
          case 'mockData':
            this.handleMockDataAsync(data.result);
            break;
        }
      };

      this.worker2 = new Worker(new URL('./app.worker', import.meta.url), {
        type: 'module',
      });
      this.worker2.onmessage = ({ data }: { data: WorkerMessage }) => {
        switch (data.event) {
          case 'mockData':
            this.handleMockDataAsync(data.result);
            break;
        }
      };

      this.worker3 = new Worker(new URL('./app.worker', import.meta.url), {
        type: 'module',
      });
      this.worker3.onmessage = ({ data }: { data: WorkerMessage }) => {
        switch (data.event) {
          case 'mockData':
            this.handleMockDataAsync(data.result);
            break;
        }
      };

      this.worker4 = new Worker(new URL('./app.worker', import.meta.url), {
        type: 'module',
      });
      this.worker4.onmessage = ({ data }: { data: WorkerMessage }) => {
        switch (data.event) {
          case 'mockData':
            this.handleMockDataAsync(data.result);
            break;
        }
      };
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  ngOnDestroy() {
    this.worker1.terminate();
    this.worker2.terminate();
    this.worker3.terminate();
    this.worker4.terminate();
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportExcel(): void {
    this.sheetHandle.presidents().then(() => {
      console.log('success');
    });
  }

  exportExcelAsync(): void {
    this.renderExcel(this.data);
  }

  mockData(): void {
    console.log(this.mockHandle.mockDataMultiple(1000));
  }

  mockDataAsync(): void {
    this.step = 20;
    this.progress = 0;
    this.data = [];
    this.startTime = Date.now();
    console.log('---- 开始异步生成数据 ----');
    for (let i = 0; i < this.step / 4; i++) {
      const postMessage: WorkerMessage = {
        event: 'mockData',
        time: 50000,
      };
      this.worker1.postMessage(postMessage);
      this.worker2.postMessage(postMessage);
      this.worker3.postMessage(postMessage);
      this.worker4.postMessage(postMessage);
    }
  }

  private handleMockDataAsync(data: Record<string, any>): void {
    this.progress++;
    this.data = Array.prototype.concat(this.data, data);
    console.log(
      `---- 当前进度 ${((this.progress / this.step) * 100).toFixed(2)} % ----`
    );
    if (this.progress === this.step) {
      console.log(
        `---- 总共耗时: ${(Date.now() - this.startTime) / 1000} 秒 ----`
      );
      this.step = 0;
      this.progress = 0;
      console.dir(this.data);
    }
  }

  private renderExcel(data: Array<Record<string, any>>): void {
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, '数据表1');

    /* fix headers */
    utils.sheet_add_aoa(worksheet, [['guid', '姓名', '性别', '邮箱']], {
      origin: 'A1',
    });

    /* create an XLSX file and try to save to Presidents.xlsx */
    writeFile(workbook, '测试数据表格.xlsx');
  }
}
