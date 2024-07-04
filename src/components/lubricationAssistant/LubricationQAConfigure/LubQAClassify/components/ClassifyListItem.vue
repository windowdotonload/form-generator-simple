<template>
  <div class="classify-item" :class="[classifyLevel == 1 && classifyItem.id == firstActiveId.value ? 'active' : '', classifyLevel == 1 ? 'pointer' : '']">
    <div class="calssify-item-left">
      <div class="status-flag" :class="classifyItem.status ? 'using' : 'prohibit'"></div>
      {{ classifyItem.name || "--" }}
    </div>
    <div class="calssify-item-right">
      <el-button size="mini" type="text" @click.stop="editClassifyItem">编辑</el-button>
      <el-button size="mini" type="text" @click.stop="move('up')" :disabled="itemIndex == 0">上移</el-button>
      <el-button size="mini" type="text" @click.stop="move('down')" :disabled="itemIndex == $parent[`ClassifyListLevel_${classifyLevel}`].length - 1">下移</el-button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["firstActiveId"],
  props: {
    classifyItem: Object,
    classifyLevel: {
      type: Number,
      required: true
    },
    itemIndex: {
      type: Number
    }
  },
  methods: {
    editClassifyItem() {
      this.$emit("editClassifyItem");
    },
    move(direction) {
      this.$emit("move", direction);
    }
  }
};
</script>

<style lang="less" scoped>
.classify-item {
  width: 100%;
  height: 50px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
}
.calssify-item-left {
  font-size: 15px;
  font-weight: bold;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  .status-flag {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 5px;
  }
  .prohibit {
    background: #d10000;
  }
  .using {
    background: #218888;
  }
}
.calssify-item-right {
  display: flex;
}
.active {
  background: #f5f7fa;
}
.pointer {
  cursor: pointer;
}
</style>
