type T = {
  add: (data: number) => number | void;
}

type S = {
  add: (data: number | string) => number;
  result: number;
}

let a: S = { result: 0, add: a => Number(a)  + 1, } 
let b: T = a;