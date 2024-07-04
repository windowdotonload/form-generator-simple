<template>
  <div class="auth-panel__menu-container">
    <PanelMenuInspect />
    <div v-if="!menuList.length" class="auth-panel__menu--empty">暂无数据</div>
    <Draggable class="list-group" tag="div" v-model="menuList" v-bind="dragOptions" @start="dragStart" @end="dragEnd">
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <div class="list-group-item" :class="activeAuthItem && activeAuthItem.id == element.id ? 'list-group-item--active' : ''" v-for="element in menuList" :key="element.id" @click="clickMenuItem(element)">
          <TooltipTextItem :text="element.name" />
          <div class="option-icon" @mouseenter="dragable" @mouseleave="dragAble = false">
            <img src="../../../../assets/drapoption.png" />
          </div>
        </div>
      </transition-group>
    </Draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components: {
    Draggable: draggable,
    PanelMenuInspect: () => import("./authConfigPanelMenuInspect"),
    TooltipTextItem: () => import("../../component/menuListItem")
  },
  props: {
    menuList: {
      type: Array,
      default: () => []
    },
    activeAuthItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      list: [],
      dragAble: false,
      drag: false
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: !this.dragAble,
        ghostClass: "ghost"
      };
    }
  },
  methods: {
    clickMenuItem(item) {
      this.$emit("clickMenuItem", item);
    },
    dragable(e) {
      const { toElement } = e;
      if (toElement.className === "option-icon") {
        this.dragAble = true;
      } else {
        this.dragAble = false;
      }
    },
    dragStart(e) {
      this.drag = true;
    },
    async dragEnd(e) {
      this.drag = false;
      this.dragAble = false;
      await this.$nextTick();
      this.$emit("sortMenuList", this.menuList);
    }
  }
};
</script>

<style lang="less" scoped>
.auth-panel__menu-container {
  width: 20%;
  position: relative;
  box-sizing: border-box;
  height: 100%;
  border-right: 1px solid #e9e9e9;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: var(--dd-00005, rgba(221, 0, 0, 0.05));
}
.list-group {
  box-sizing: border-box;
  min-height: 20px;
  height: calc(100% - 95px);
  overflow: auto;
  &::-webkit-scrollbar {
    width: 2px !important;
  }
}
.list-group-item {
  user-select: none;
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  padding: 20px;
  width: 100%;
  height: 48px;
  justify-content: space-between;
  padding-right: 0;
  &:hover {
    background: var(--dd-00005, rgba(221, 0, 0, 0.05));
  }
  .option-icon {
    cursor: move;
    box-sizing: border-box;
    height: 100%;
    width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.list-group-item i {
  cursor: pointer;
}
.list-group-item--active {
  background-color: rgba(221, 0, 0, 0.1);
}
.auth-panel__menu--empty {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 50%;
  font-size: 15px;
  color: #999;
}
.auth-panel__Menu--name {
  display: inline-block;
  white-space: nowrap;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
