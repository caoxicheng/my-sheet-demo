import { Component } from '@angular/core';
import { SheetHandleService } from '@my-sheet/sheet-handle';

@Component({
  selector: 'my-sheet-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sheet-app';
  constructor(private sheetHandle: SheetHandleService) {}

  exportExcel(): void {
    this.sheetHandle.presidents().then(() => {
      console.log('success');
    });
  }
}
