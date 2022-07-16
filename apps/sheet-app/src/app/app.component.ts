import { Component, OnDestroy } from '@angular/core';
import { SheetHandleService } from '@my-sheet/sheet-handle';
import { MockHandleService } from '@my-sheet/mock-handle';
import { utils, writeFile } from 'xlsx';
import { WorkerMessage } from '@my-sheet/web-workber';

@Component({
  selector: 'my-sheet-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'sheet-app';
  private worker!: Worker;
  private startTime!: number;
  // 储存的数据
  private data: Record<string, any>[] = [];

  constructor(
    private sheetHandle: SheetHandleService,
    private mockHandle: MockHandleService
  ) {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker(new URL('./app.worker', import.meta.url), {
        type: 'module',
      });
      this.worker.onmessage = ({ data }: { data: WorkerMessage }) => {
        switch (data.event) {
          case 'mockData':
            this.handleMockDataAsync(data.result);
            break;
          default:
        }
      };
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  ngOnDestroy() {
    this.worker.terminate();
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
    this.data = this.mockHandle.mockDataMultiple(1000);
    console.log(this.data);
  }

  mockDataAsync(): void {
    this.data = [];
    this.startTime = Date.now();
    console.log('---- 开始异步生成数据 ----');
    const postMessage: WorkerMessage = {
      event: 'mockData',
      time: 50000,
    };
    this.worker.postMessage(postMessage);
  }

  private handleMockDataAsync(data: Record<string, any>[]): void {
    this.data = data;
    console.log(
      `---- 总共耗时: ${ (Date.now() - this.startTime) / 1000 } 秒 ----`
    );
    console.dir(this.data);
  }

  private renderExcel(data: Array<Record<string, any>>): void {
    const startTime = Date.now();
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, '数据表1');

    /* fix headers */
    utils.sheet_add_aoa(worksheet, [['guid', '姓名', '性别', '邮箱']], {
      origin: 'A1',
    });

    /* create an XLSX file and try to save to Presidents.xlsx */
    writeFile(workbook, '测试数据表格.xlsx');
    console.log(`---- 生成表格耗时 ${ (Date.now() - startTime) / 1000 } 秒 ----`);
  }
}
