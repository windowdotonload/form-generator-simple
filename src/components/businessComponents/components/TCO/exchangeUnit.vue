<template>
  <el-popover placement="top" width="160" trigger="click">
    <div v-for="item in changeSelOptions" :key="item.label" class="sel-item" @click="confirmSelUnit(item)">
      {{ item.label }}
    </div>

    <template #reference>
      <i class="el-icon-sort" />
    </template>
  </el-popover>
</template>

<script>
export default {
  props: {
    changeSelOptions: {
      type: Array,
      default: []
    },
    changeCb: {
      type: Function
    }
  },
  methods: {
    confirmSelUnit(item) {
      this.changeCb(item);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-icon-sort {
  transform: rotateX(45deg);
  cursor: pointer;
}
.sel-item {
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.sel-item:hover {
  background: rgba(144, 147, 153, 0.1);
  border-radius: 5px;
}
</style>
