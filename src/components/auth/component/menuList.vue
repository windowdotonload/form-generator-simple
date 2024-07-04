<template>
  <div class="menu__list">
    <div v-for="item in menuList" :key="item.id" class="menu__list-item" :class="item.id == activeKey ? ' menu__list-item--active' : ''" @click="click(item)">
      <MenuItem :text="item[lableKeyName]" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lableKeyName: {
      type: String,
      default: "name"
    },
    activeKey: {
      type: String,
      default: ""
    },
    menuList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MenuItem: () => import("./menuListItem.vue")
  },
  methods: {
    click(item) {
      this.$emit("click", item);
    }
  }
};
</script>

<style lang="less" scoped>
.menu__list {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.menu__list-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  height: 48px;
  width: 100%;
  padding: 20px;
  &:hover {
    background-color: rgba(221, 0, 0, 0.05);
  }
}

.menu__list-item--active {
  background-color: rgba(221, 0, 0, 0.05);
  border-right: 3px solid var(--dd-0000, #d00);
}
</style>
