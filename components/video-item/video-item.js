// 自定义组件
Component({
  properties: {
    // 这里定义的属性，属性值可以在组件使用时指定
    itemData: {
      type: Object,
      value: {},
    },
  },
  data: {
    // 这里是一些组件内部数据
    someData: {},
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () {},
  },
});
