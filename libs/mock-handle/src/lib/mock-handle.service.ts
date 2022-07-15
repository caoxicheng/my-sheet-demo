import { Injectable } from '@angular/core';
import * as mock from 'mockjs';
import { Observable, of } from 'rxjs';

interface MockConfig {
  [key: string]:
    | string
    | number
    | boolean
    | Record<string, unknown>
    | Array<any>
    | RegExp;
}

@Injectable({
  providedIn: 'root',
})
export class MockHandleService {
  /**
   * 基础配置
   * @description id 自增
   */
  readonly baseConfig = {
    guid: '@id',
    姓名: '@cname',
    '性别|1': ['男', '女'],
    邮箱: '@email',
  };

  /**
   * 生成一条数据
   * @param config
   */
  mockDataOnce(config: MockConfig = this.baseConfig): Record<string, any> {
    return mock.mock(config);
  }

  /**
   * 同步生成多条数据， 等于重复调用 mockDataOnce()
   * @param number 次数默认1000
   * @param config 配置项
   */
  mockDataMultiple(
    number: number = 1000,
    config: MockConfig = this.baseConfig
  ): Array<Record<string, any>> {
    const resultArray = [];
    for (let i = 0; i < number; i++) {
      resultArray.push(this.mockDataOnce(config));
    }
    return resultArray;
  }

  /**
   * 异步生成多条数据， 等于重复调用 mockDataOnce()
   * @param number 次数默认1000
   * @param config 配置项
   */
  mockDataMultipleAsync(
    number: number = 1000,
    config: MockConfig = this.baseConfig
  ): Observable<Array<Record<string, any>>> {
    const resultArray = [];
    for (let i = 0; i < number; i++) {
      resultArray.push(this.mockDataOnce(config));
    }
    return of(resultArray);
  }
}
