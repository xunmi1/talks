---
title: Subtyping in TypeScript
highlighter: shiki
colorSchema: dark
exportFilename: 'subtyping-in-typescript.pdf'
favicon: https://api.iconify.design/mdi:language-typescript.svg
# 幻灯片的长宽比
aspectRatio: '16/9'
layout: center
---

# <MdiLanguageTypescript class="text-[#3178c6]" /> Subtyping in TypeScript

<p class="text-xl">TypeScript 中的子类型</p>

<footer class="absolute bottom-10 right-14 text-sm opacity-60">2022-10</footer>

---
layout: intro
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

如 `Java`、`C#`、 `Python` 的[抽象基类](https://docs.python.org/3.9/library/abc.html)等

<div class="min-h-20">

- 必须显式声明子类型关系
- 类型声明的名字相同算是类型相同

</div>

```java
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

如 `TypeScript`、`Python` 的[协议](https://peps.python.org/pep-0544/)等

<div class="min-h-20">

- 不需要显式声明子类型关系
- 需要包含父类型声明的所有成员

</div>

```ts
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

---

