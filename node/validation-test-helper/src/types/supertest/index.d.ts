declare module global {
  namespace supertest {
    export interface Test {
      expect2(): this;
    }
  }
}

declare function supertest(app: any): supertest.SuperTest<supertest.Test>;
declare namespace supertest {
  export interface SuperTest<T> {
  }
  export interface Test {
    expect2(): this;
  }
}