import { Injectable } from '@angular/core';
import { raw_data as _raw_data, RawData } from '@my-sheet/data-base';
import { utils, writeFile } from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class SheetHandleService {
  public async presidents() {
    let raw_data: RawData[];
    try {
      /* fetch JSON data and parse */
      const url = 'https://sheetjs.com/executive.json';
      raw_data = await (await fetch(url)).json();
    } catch (e) {
      //如果网络不行
      raw_data = JSON.parse(JSON.stringify(_raw_data.default));
    }

    const prez = raw_data.filter((row) =>
      row.terms.some((term) => term.type === 'prez')
    );

    const rows = prez.map((row) => ({
      name: row.name.first + ' ' + row.name.last,
      birthday: row.bio.birthday,
    }));

    /* generate worksheet and workbook */
    const worksheet = utils.json_to_sheet(rows);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Dates');

    /* fix headers */
    utils.sheet_add_aoa(worksheet, [['Name', 'Birthday']], { origin: 'A1' });

    /* calculate column width */
    const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
    worksheet['!cols'] = [{ wch: max_width }];

    /* create an XLSX file and try to save to Presidents.xlsx */
    writeFile(workbook, 'Presidents.xlsx');
  }
}
