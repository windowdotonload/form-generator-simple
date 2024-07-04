<template>
  <div class="qa-menu-container" v-loading="loading">
    <el-menu class="el-menu-vertical-demo" ref="qaMenu" :default-active="activeIndex">
      <el-submenu :index="item.id" v-for="item in treeList" :key="item.id">
        <template slot="title">
          <p class="first-level-title">{{ item.name }}</p>
        </template>
        <template v-if="item.children && item.children.length > 0">
          <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.id" @click.native="selectMenu(subItem)">
            <template slot="title">
              <p class="sec-level-title">{{ subItem.name }}</p>
            </template>
          </el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { queryQATreeList } from "../../../api/LubQA";
export default {
  inject: ["provide"],
  watch: {
    "provide.activeId"(val) {
      this.activeIndex = val;
    }
  },
  data() {
    return {
      activeIndex: null,
      treeList: [],
      loading: false
    };
  },
  created() {
    this.queryQATreeList();
  },
  methods: {
    async queryQATreeList() {
      this.loading = true;
      const res = await queryQATreeList();
      this.treeList = res.data.data;
      this.loading = false;
    },
    initExpandDefaultAcitveItem() {
      this.activeIndex = this.treeList[0].children[0].id;
      this.switchActiveId();
    },
    switchActiveId() {
      this.provide.activeId = this.activeIndex;
    },
    selectMenu(selItem) {
      this.provide.searchLocate = false;
      this.activeIndex = selItem.id;
      this.switchActiveId();
      this.$gio.clickSecondaryMenu();
    }
  }
};
</script>

<style lang="less" scoped>
.qa-menu-container {
  box-sizing: border-box;
  padding-bottom: 30px;
  width: 12%;
  height: 100%;
  border-right: 2px solid #e9e9e9;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  /deep/ .el-menu {
    border-right: none;
  }
  /deep/ .el-submenu .el-menu {
    overflow: hidden !important;
  }
  /deep/ .el-menu-item {
    display: flex;
    align-items: center;
    padding-left: 20px !important;
    height: 40px;
  }
  /deep/ .el-menu-item.is-active {
    color: #d10000 !important;
    background: rgba(221, 0, 0, 0.05) !important;
    border-right: 2px solid #dd0000 !important;
  }
}
.first-level-title {
  margin: 0;
  font-weight: 700;
  color: #000000;
  font-size: 15px;
}
.sec-level-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-weight: normal;
  font-size: 13px;
  color: #999;
  box-sizing: border-box;
  padding-left: 10px;
}
</style>
