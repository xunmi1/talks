---
title: 什么是组件
highlighter: shikiji
colorSchema: dark
layout: cover
transition: fade-out
favicon: https://api.iconify.design/carbon/carbon-for-ibm-dotcom.svg?color=%230ea5e9
exportFilename: what-is-the-component
htmlAttrs:
  lang: zh-CN
---

# 什么是组件？

<footer class="absolute bottom-10 right-14 text-sm opacity-50">xunmi 2024-01</footer>


---
layout: two-cols
layoutClass: gap-4 items-center
title: 比较
---

<logos-vue />

```vue {all|2,3,7,8} {at:0}
<script setup>
defineProps(['text']);
defineEmits(['click']);
</script>

<template>
  <div @click="$emit('click', $event)">{{ text }}</div>
  <slot />
</template>
```

::right::

<logos-react />

```jsx {all|1,4-7} {at:0}
function Demo(props) {
  const { text, onClick, children } = props;
  return (
    <>
      <div onClick={e => onClick(e)}>{text}</div>
      {children}
    </>
  );
}
```


---

# `emits` & `slots`
事件与插槽

<div class="grid grid-cols-[1fr_auto_1fr] gap-4 mt-8">

```vue {2,3,7,8}
<script setup>
defineProps(['text']);
defineEmits(['click']);
</script>

<template>
  <div @click="$emit('click', $event)">{{ text }}</div>
  <slot />
</template>
```
<carbon-arrows-horizontal class="self-center text-lg text-gray" />

```vue {2,6,7}
<script setup>
defineProps(['text', 'onClick']);
</script>

<template>
  <div @click="onClick">{{ text }}</div>
  <component :is="$slots.default" />
</template>
```

</div>

<div v-click>

1. `$emit('click', params)` <carbon-arrows-horizontal /> `props.onClick(params)`

   - `defineEmits(['click'])` = `defineProps(['onClick'])`
   - `@click="..."` = `:onClick="..."`

2. `<slot name="name" v-bind="params" />` <carbon-arrows-horizontal /> `$slots[name](params)`

> 在 `template` 模板中使用 `<slot />` 或 `<component />` 元素，在 JSX 中可使用 `$slots.default()` 来渲染插槽

</div>


---

# 组件是函数

<div class="grid grid-cols-2">

<div>

- `props` & `emits` & `slots` <carbon-arrow-right /> 函数参数

  - 事件是名称以 `on` 开头，类型为函数的“参数”
  - 插槽是以标签形式进行传递、调用，类型为函数的“参数”

- `template` <carbon-arrow-right /> 函数返回值

</div>

<div>

```js
function Component(props, $emit, $slots) {
  ...
  emit(eventName, ...);
  return () => (
    <template>
      ...
      {$slots[slotName](...)}
      ...
    </template>
  );
}
```

</div>

</div>

不同的是 Vue 组件的入口函数（`setup`）只会执行一次，内部的状态全是持久化的，状态发生变化时，其渲染函数会再次执行


---
layout: quote
---

# 为什么不统一？

<div v-click>

[“Vue 3 的大部分设计都是戴着镣铐跳舞，需要做很多折衷。”](https://www.zhihu.com/question/453332049/answer/1844784032) - Evan You

</div>


---

# Generic Components
泛型组件

在 TypeScript 中，可以给函数声明泛型，组件亦是如此

```vue
<script setup lang="ts" generic="T extends string">
defineProps<{ text: T }>();
defineSlots<{
  default(props?: { text: T }): unknown
}>();
</script>

<template>
  <div>{{ text }}</div>
  <slot :text />
</template>
```

v3.3 版本后，使得属性、事件、插槽均获得类型约束，完成组件类型支持的最后一步。


---

# Async Components (`async setup()`)
异步组件

<div class="grid grid-cols-2 gap-4">

```vue
<script setup lang="ts">
import { shallowRef, onMounted } from 'vue';

defineSlots<{
  default(props?: { data: string }): unknown
}>();

const data = shallowRef<string>();
data.value = await (await fetch('/foo')).text();
</script>
```

```vue
<template>
  <Suspense>
    <AsyncComponent />

    <template #fallback>
      正在加载...
    </template>
  </Suspense>
</template>
```

</div>

需配合使用 `<Suspense>` 组件，相当于 `Promise`，两种插槽，两种状态

- `#default` <carbon-arrow-right />  `settled` 状态
- `#fallback` <carbon-arrow-right />  `pending` 状态

出现异常时，可使用 `onErrorCaptured()` 来捕获和处理。


---
clicks: 2
---

# 组件亦是对象
和参数一样，可以自由传递

<div class="grid grid-cols-[auto_minmax(0,1fr)]">

```vue {all|7|7,21}
<script>
import { defineComponent, h } from 'vue';

const A = defineComponent({
  props: ['child'],
  render() {
    return h('div', ['A', this.$slots.default(), h(this.child)]);
  },
});

const B = defineComponent(() => () => 'B');

export default defineComponent({
  setup() {
    return { A, B };
  },
});
</script>

<template>
  <component :is="A" :child="B">默认插槽</Component>
</template>
```

<VClicks :at="0">

- 调用 `$slots[slotName]()` 渲染插槽
- 组件以参数形式传递使用，**无需注册**

</VClicks>

</div>


---

# 组件是服务

函数可以没有返回值，组件亦是如此

```vue
<script setup lang="ts">
import { shallowRef, onMounted } from 'vue';

defineSlots<{
  default(props?: { data: string }): unknown
}>();

const data = shallowRef<string>();
onMounted(async () => {
  data.value = await (await fetch('/foo')).text();
});

defineExpose({ data });
</script>

<template>
  <slot :data />
</template>
```

将请求服务封装成组件，数据通过插槽、内部引用等传递给上层组件，自身不存在任何 HTML 元素


---
layout: center
---

<div class="font-bold underline underline-offset-12">

# “任何功能均可封装成组件”

</div>
