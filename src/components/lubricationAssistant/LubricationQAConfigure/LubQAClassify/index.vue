<template>
  <div class="configure-classify-container" v-loading="calssifyLoading">
    <div class="left-content">
      <div class="top-title">
        <div style="display:flex;flex-wrap;nowrap;align-items:center">
          <p class="rectangle-icon"></p>
          <p style="font-size:15px;font-weight:700">一级分类</p>
        </div>
        <el-button size="mini" type="danger" @click="createClassify(1)">添加</el-button>
      </div>
      <div class="classify-list-container empty-content" @scroll="scrollLoad($event, 1)">
        <ClassifyItem
          @click.native="clickClassifyItem(item)"
          :classifyLevel="1"
          @editClassifyItem="editClassifyItem(1, item)"
          @move="d => move(d, item)"
          v-for="(item, index) in ClassifyListLevel_1"
          :key="item.id"
          :itemIndex="index"
          :classifyItem="item"
        />
      </div>
    </div>

    <div class="right-content" v-loading="secondLevelListLoading">
      <div class="top-title">
        <div style="display:flex;flex-wrap;nowrap;align-items:center">
          <p class="rectangle-icon"></p>
          <p style="font-size:15px;font-weight:700">二级分类</p>
        </div>
        <el-button size="mini" type="danger" @click="createClassify(2)" :disabled="!firstActiveId.value">添加</el-button>
      </div>
      <div class="classify-list-container empty-content" @scroll="scrollLoad($event, 2)">
        <ClassifyItem
          :classifyLevel="2"
          :itemIndex="index"
          @editClassifyItem="editClassifyItem(2, item)"
          @move="d => move(d, item)"
          v-for="(item, index) in ClassifyListLevel_2"
          :key="item.id"
          :classifyItem="item"
        />
      </div>
    </div>

    <CreateAndeEditClassify ref="opClassify" @postFunc="params => refreshClassifyList(params)" />
  </div>
</template>

<script>
import CreateAndeEditClassify from "./components/CreateAndEditClassifyDrawer.vue";
import ClassifyItem from "./components/ClassifyListItem.vue";
import { getClassifyList, moveUpDown } from "../../api/LubQA";
export default {
  components: {
    CreateAndeEditClassify,
    ClassifyItem
  },
  provide() {
    return {
      firstActiveId: this.firstActiveId
    };
  },
  data() {
    return {
      calssifyLoading: false,
      secondLevelListLoading: false,
      ClassifyListLevel_1: [],
      ClassifyListLevel_1_total: 0,
      ClassifyListLevel_2: [],
      ClassifyListLevel_2_total: 0,
      firstActiveId: { value: "" },
      ClassifyListLevel_1_pageInfo: {
        current: 1,
        size: 50
      },
      ClassifyListLevel_2_pageInfo: {
        current: 1,
        size: 50
      }
    };
  },
  created() {
    this.getClassifyList(1);
  },
  methods: {
    refreshPageInfo(level) {
      this[`ClassifyListLevel_${level}`] = [];
      this[`ClassifyListLevel_${level}_total`] = 0;
      this[`ClassifyListLevel_${level}_pageInfo`] = {
        current: 1,
        size: 50
      };
    },
    scrollLoad(e, level) {
      const { scrollHeight, scrollTop, offsetHeight } = e.target;
      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this[`ClassifyListLevel_${level}`].length == this[`ClassifyListLevel_${level}_total`]) return;
        this[`ClassifyListLevel_${level}_pageInfo`].current++;
        this.getClassifyList(level);
      }
    },
    clickClassifyItem(item) {
      this.firstActiveId.value = item.id;
      this.ClassifyListLevel_2 = [];
      this.getClassifyList(2);
    },
    refreshClassifyList(params) {
      this[`ClassifyListLevel_${params.level}`] = [];
      this[`ClassifyListLevel_${params.level}_pageInfo`] = {
        current: 1,
        size: 50
      };

      this.getClassifyList(params.level, params.all);
    },

    async getClassifyList(level = 1, all = false) {
      if (level == 1) {
        this.calssifyLoading = true;
      } else if (level == 2) {
        this.secondLevelListLoading = true;
      }
      const params = {
        ...this[`ClassifyListLevel_${level}_pageInfo`],
        level
      };
      if (level == 2) params.parentId = this.firstActiveId.value;
      const res = await getClassifyList(params);
      this[`ClassifyListLevel_${level}`] = this[`ClassifyListLevel_${level}`].concat(res.data.data.list);
      this[`ClassifyListLevel_${level}_total`] = res.data.data.totalCount;

      if (level == 1) {
        const firstLevelIds = this.ClassifyListLevel_1.map(classify => classify.id);
        this.firstActiveId.value =
          this.firstActiveId.value && firstLevelIds.includes(this.firstActiveId.value)
            ? this.firstActiveId.value
            : (this[`ClassifyListLevel_${level}`][0] && this[`ClassifyListLevel_${level}`][0].id) || "";
        if (this.ClassifyListLevel_2.length > 0 && !all) return (this.calssifyLoading = false);
        this.refreshPageInfo(2);
        const subParams = {
          parentId: this.firstActiveId.value || null,
          ...this[`ClassifyListLevel_2_pageInfo`],
          level: 2
        };

        if (!subParams.parentId) {
          this.calssifyLoading = false;
          this.secondLevelListLoading = false;
          return;
        }

        const subRes = await getClassifyList(subParams);
        this.ClassifyListLevel_2 = subRes.data.data.list;
        this[`ClassifyListLevel_2_total`] = subRes.data.data.totalCount;
      }

      this.calssifyLoading = false;
      this.secondLevelListLoading = false;
    },
    createClassify(level) {
      this.$refs.opClassify.evokeDrawer({
        opType: "CREATE",
        title: `新建${level == 1 ? "一级" : "二级"}分类`,
        level
      });
    },
    editClassifyItem(level, editItem) {
      this.$refs.opClassify.evokeDrawer({
        opType: "EDIT",
        title: `编辑${level == 1 ? "一级" : "二级"}分类`,
        level,
        editItem
      });
    },
    async move(direction, item) {
      const params = {
        moveUpFlag: direction == "up" ? true : false,
        level: item.level,
        id: item.id
      };
      await moveUpDown(params);
      this.refreshClassifyList({ level: item.level });
    }
  }
};
</script>

<style lang="less" scoped>
.configure-classify-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  .rectangle-icon {
    width: 4px;
    height: 14px;
    background: #dd0000;
    margin-right: 10px;
  }
  .top-title {
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    box-sizing: border-box;
    height: 48px;
    width: 100%;
    background: #f9f9f9;
    border-bottom: 1px solid #e9e9e9;
    padding-right: 8px;
  }

  .left-content {
    box-sizing: border-box;
    width: 50%;
    height: 100%;
    border: 1px solid #e9e9e9;
  }

  .right-content {
    width: 50%;
    height: 100%;
    border: 1px solid #e9e9e9;
    border-left: none;
    position: relative;
    box-sizing: border-box;

    .search-group {
      margin-top: 10px;
      margin-bottom: 10px;
      height: 52px;
      display: flex;
      align-items: center;

      /deep/ .el-form-item__label {
        line-height: 32px !important;
        height: 32px;
      }

      /deep/ input {
        height: 32px;
      }

      /deep/ .el-form {
        display: flex;
        align-items: center;
        height: 100%;
      }

      /deep/ .el-form-item {
        width: 30%;
        margin-bottom: 0;
      }
    }
  }

  /deep/ .el-dialog__body {
    padding-bottom: 0;
  }

  /deep/ label {
    line-height: 40px !important;
  }

  .weight-label {
    /deep/ label {
      padding-right: 30px;
    }
  }

  .tip-icon {
    top: 10px;
    left: -23px;
    position: absolute;
  }
  .content-table-box {
    overflow: auto;
    height: calc(100vh - 38%);
  }
}
.classify-list-container {
  box-sizing: border-box;
  height: calc(100vh - 190px);
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
