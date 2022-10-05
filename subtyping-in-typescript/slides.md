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

## 名义子类型

如 Java、C#、 Python 的[抽象基类](https://docs.python.org/3.9/library/abc.html)等

<div class="min-h-20">

- 必须显式声明子类型关系
- 类型声明的名字相同时，类型相同

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

## 结构子类型

如 TypeScript、Python 的[协议](https://peps.python.org/pep-0544/)等

<div class="min-h-20">

- 不需要显式声明子类型关系
- 需要包含父类型声明的所有成员

</div>

```ts {all|2,6-7}
type T = {
  add: (value: number) => number | void;
}

type S = {
  result: number;
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

<!-- 在 TypeScript 中 `unknown` 作为顶层类型 -->

---
