import { Component, OnDestroy } from '@angular/core';
import { SheetHandleService } from '@my-sheet/sheet-handle';
import { MockHandleService } from '@my-sheet/mock-handle';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'my-sheet-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'sheet-app';

  private destroy$ = new Subject<void>();
  constructor(
    private sheetHandle: SheetHandleService,
    private mockHandle: MockHandleService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportExcel(): void {
    this.sheetHandle.presidents().then(() => {
      console.log('success');
    });
  }

  mockData(): void {
    console.log(this.mockHandle.mockDataMultiple(1000));
  }

  mockDataAsync(): void {
    const startTime = Date.now();
    this.mockHandle
      .mockDataMultipleAsync(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log(
          `---- 生成 1000 条数据耗时 ${
            (Date.now() - startTime) / 1000
          } 秒  ----`
        );
        console.log(res);
      });
  }
}
