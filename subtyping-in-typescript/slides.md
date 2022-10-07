---
title: Subtyping in TypeScript
highlighter: shiki
colorSchema: dark
exportFilename: 'subtyping-in-typescript.pdf'
favicon: https://api.iconify.design/mdi:language-typescript.svg
# 幻灯片的长宽比
aspectRatio: '16/9'
layout: cover
---

# <MdiLanguageTypescript class="text-[#3178c6]" /> Subtyping in TypeScript

<p class="text-2xl">TypeScript 中的子类型</p>

<footer class="absolute bottom-10 right-14 text-sm opacity-60">2022-10</footer>

---

# Subtyping

子类型

如果类型 S 的实例可以安全地替换类型 T 的实例，则类型 S 是类型 T 的子类型，记作 S <: T

即符合里氏替换原则（Liskov Substitution principle）

> 在面向对象程序设计中，多态一般仅指的是 “子类型多态”

---
layout: two-cols
---

<style>
.slidev-layout {
  gap: 2rem;
}
</style>

## Nominal Type System 

<p class="opacity-50 !mt-0">名义子类型</p>

<div class="min-h-30">

- 必须显式声明子类型关系
- 类型声明的名字相同时，类型相同
- 如 Java、C#、 Python 的[抽象基类](https://docs.python.org/3.9/library/abc.html)等

</div>

```java {all|5}
interface T {
   int add(int value);
}

class S implements T {
   int result;
   int add(int value) {/** ... */}
}

S a = new S();
T b = a;
```

::right::

## Structural Type System 

<p class="opacity-50 !mt-0">结构子类型</p>

<div class="min-h-30">

- 不需要显式声明子类型关系
- 需要包含父类型声明的所有成员
- 如 TypeScript、Python 的[协议](https://peps.python.org/pep-0544/)等

</div>

```ts {all|2,6-7}
type T = {
  add: (value: number) => number | undefined;
}

type S = {
  readonly result: number;
  add: (value: number | string) => number;
}

const a: S = {/** ... */} 
const b: T = a;
```

<v-click>

在 TypeScript 中，可以使用 `unique symbol` 模拟实现名义子类型

</v-click>
---

# Subtyping rules

子类型规则

|     |     |     |
| --- | --- | --- |
| S-Refl  | 自反性 | $\frac{}{S\ <:\ S}$ |
| S-Trans | 传递性 | $\frac{S\ <:\ U\quad U\ <:\ T}{S\ <:\ T}$ |
| S-Top   |       | $\frac{}{S\ <:\ unknown}$ |
| S-Arrow |       | $\frac{T_1\ <:\ S_1\quad S_2\ <:\ T_1}{S_1\ \rightarrow\ S_2\ <:\ T_1\ \rightarrow\ T_2}$ |

<div class="mt-12">

> 在 TypeScript 中，`unknown` 是作为顶层类型

> $T_1 \rightarrow T_2$：代表构造了参数类型是 T1，返回值类型是 T2 的函数类型

</div>

---

# Covariance and contravariance

协变与逆变

|     |     |     |
| --- | --- | --- |
| covariant     | 协变 | 保持子类型的顺序关系
| contravariant | 逆变 | 逆转子类型的顺序关系
| invariant     | 不变 | 不会发生变化

<v-click>

```ts
const toLooseNumber: (x: unknown) => number = x => {
  return Number(x);
};

const toNumber: (x: string) => number | undefined = toLooseNumber;
```

</v-click>

---

# Function types

函数类型

$$
\frac{T_1\ <:\ S_1\quad S_2\ <:\ T_1}{S_1\ \rightarrow\ S_2\ <:\ T_1\ \rightarrow\ T_2}
$$

<div class="text-center">

对于函数类型 $T_1 \rightarrow T_2$，其子类型为 $S_1 \rightarrow S_2$，则 $T_1 \rightarrow S_1$ 且 $S_2 \rightarrow T_2$。

</div>

```ts
type T1 = unknown;
type T2 = number;
type S1 = string;
type S2 = number | undefined;

const toLooseNumber: (x: T1) => T2 = { /** ... */ };

const toNumber: (x: S1) => S2 = toLooseNumber;
```

<v-click>
<div class="text-center text-2xl text-orange-400 mt-12">
参数类型逆变，返回类型协变
</div>
</v-click>


---

# Invariance

不变

<div class="grid grid-cols-2 gap-8">
  <div>

```ts
const list1: number[] = [];
const list2: unknown[] = list1;

list2.push('😵');

// ???
list1[0].toFixed();
```

```ts {4-5}
// lib.es5.d.ts 
interface Array<T> {
  // ...
  push(...items: T[]): number;
  pop(): T | undefined;
  // ...
}
```

  </div>

  <div>
  <v-click>
  
  - `push`: T 在函数类型的参数位置，要求逆变
  - `pop`: T 在函数类型的返回位置，要求协变

  所以, T 是不变的，`number[]` 和 `unknown[]` 不存在子类型关系
  <v-click>
  
  <div class="text-orange-400">

  在 TypeScript 中，允许了**方法**的参数是双变的

  </div>

  导致 T 是协变，`number[]` 是 `unknown[]` 是的子类型

  </v-click>
  </v-click>
  </div>
</div>

---

# Record types

记录（对象）类型

- 宽度子类型（width subtyping）：对象类型 S 比 T 拥有更多的成员类型
- 深度子类型（depth subtyping）：对象类型 S 的只读（immutable）成员类型可以替换为 T 对应的成员类型（协变）

```ts {all|7,11}
type T = {
  readonly name: string | undefined;
};

type S1 = {
  readonly name: string | undefined;
  readonly value: number;
};

type S2 = {
  readonly name: string;
};
```

<v-after>

- S1 比 T 多出 `value` 字段，S1 是 T 的子类型
- S2 的成员字段的类型是 T 对应字段的子类型，S2 是 T 的子类型

</v-after>

---

# Record types

记录（对象）类型

```ts
type S = { value: number };
type T = { value: unknown };

const data1: S = { value: 1 };
const data2: T = data1;

data2.value = '😢';

// ???
data1.value.toFixed();
```
<v-click>

只能让对象的 `immutable` 字段协变，而 `mutable` 字段不变

`value` 不是只读字段，所以 S 和 T 不存在子类型关系

</v-click>

<v-click>

<div class="text-orange-400">

在 TypeScript 中，允许了 `mutable` 字段协变

</div>

所以 S 是 T 的子类型

</v-click>