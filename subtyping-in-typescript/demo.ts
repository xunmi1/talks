type T = {
  add: (data: number) => number | undefined;
};

type S = {
  add: (data: number | string) => number;
  result: number;
};

let a: S = { result: 0, add: a => Number(a) + 1 };
let b: T = a;

const toLooseNumber: (x: unknown) => number = x => {
  return Number(x);
};

const toNumber: (x: string) => number | undefined = toLooseNumber;

const list1: number[] = [];

const list2: unknown[] = list1;

list2.push('😵');
list1[0].toFixed();

type T11 = {
  readonly name: string | undefined;
};

type S11 = {
  readonly name: string;
  readonly value: number;
};

type S22 = {
  readonly name: string;
};

let aa = { name: '', value: 22 } as S11;

let bb: T11 = aa;
