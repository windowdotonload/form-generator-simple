<template>
  <div class="userHelp-container">
    <div class="left-content">
      <div class="top-title">
        <p class="rectangle-icon"></p>
        <p>分类</p>
        <div class="icon-box" @click="$router.push({ name: 'editUserHelp' })">
          <img src="@/assets/uer_help_icon.png" alt="" />
        </div>
      </div>

      <div class="menulist-container">
        <div class="list-item" :class="{ 'list-item-active': showActive(item.id) }" :key="item.name" v-for="item in leftListData" @click="changeCate(item)">
          <p class="circle-icon" :style="{ background: item.status === 0 ? '#dd0000' : '' }" />
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>

    <div class="right-content">
      <div class="top-title">
        <p class="rectangle-icon"></p>
        <p>帮助内容</p>
      </div>
      <div class="search-group">
        <el-form ref="form" :model="searchForm">
          <el-form-item label="标题" label-width="60px">
            <el-input v-model="searchForm.title" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态" label-width="70px">
            <el-select clearable v-model="searchForm.status" placeholder="请选择">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可见范围" label-width="90px">
            <el-select clearable v-model="searchForm.target" placeholder="请选择">
              <el-option label="美孚" value="0">美孚</el-option>
              <el-option label="经销商" value="1">经销商</el-option>
              <el-option label="工业客户" value="2">工业客户</el-option>
            </el-select>
          </el-form-item>
          <el-button size="small" style="margin-left: 10px" @click="resetSearch">
            重置
          </el-button>
        </el-form>

        <el-button v-show="this.leftMenuActiveItem && this.leftMenuActiveItem.type != 0" type="danger" size="small" style="position: absolute; right: 10px" @click="createHelp">
          添加帮助
        </el-button>
      </div>
      <div style="padding: 0 10px" class="content-table-box">
        <g-table
          :loading="loading"
          :tableSettings="contentTableSettings"
          :tableData="userHelpContentTableData"
          :handle-func="handle"
          :total="total"
          :currentPage="pageInfo.current"
          :pageSize="pageInfo.size"
          :pageSizeChange="pageSizeChange"
          :pageCurrentChange="pageCurrentChange"
        />
      </div>
    </div>

    <el-dialog title="排序" width="30%" :visible.sync="orderDialogVisible" @closed="closeOrderDialog">
      <el-form ref="orderForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item prop="orderNum " label="权重" class="weight-label">
          <el-tooltip effect="dark" content="内容将按照权重排序，权重相同时按照拼音排序" placement="top">
            <img class="tip-icon" src="@/assets/tips_icon.svg" alt="" />
          </el-tooltip>
          <el-input-number :min="1" :max="100" v-model="form.orderNum" controls-position="right"></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="orderDialogVisible = false" size="mini">
          取 消
        </el-button>
        <el-button type="danger" @click="submit" size="mini"> 提交 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import GTable from "@/generalComponents/gTable.vue";
import { contentTableSettings } from "./tableSetting.js";
export default {
  components: {
    GTable
  },
  async created() {
    await this.requestMethodGet("/help/center/queryHelpClassListByPage", {
      isConfPage: 1,
      size: 999,
      current: 1
    }).then(res => {
      const { data } = res.data;
      const { list } = data;
      this.leftListData = list;
      this.leftMenuActiveItem = this.$store.state.userHelpLeftActiveItem ? this.$store.state.userHelpLeftActiveItem : list[0];
    });
    this.getContentList({ ...this.pageInfo, id: this.leftMenuActiveItem.id });
    this.searchForm = this.$store.state.userHelpSearchFormRecord ? Object.assign({}, this.$store.state.userHelpSearchFormRecord) : this.searchForm;
  },
  data() {
    return {
      total: 0,
      contentTableSettings,
      searchForm: {
        title: "",
        status: "",
        target: ""
      },
      orderDialogVisible: false,
      form: {
        orderNum: 0
      },
      leftListData: [],
      leftMenuActiveItem: null,
      userHelpContentTableData: [],
      recordRowData: {},
      pageInfo: {
        size: 30,
        current: 1
      },
      loading: true,
      rules: {
        orderNum: [{ required: true, message: "请输入分类标题", trigger: "blur" }]
      }
    };
  },
  methods: {
    resetSearch() {
      this.loading = true;
      this.searchForm = Object.assign(
        {},
        {
          title: "",
          status: "",
          target: ""
        }
      );
      this.$store.commit("changeUserHelpSearchFormRecord", this.searchForm);
      this.getContentList(this.leftMenuActiveItem);
    },
    createHelp() {
      this.$router.push({
        name: "createUserHelpContent",
        params: {
          classIdProp: this.leftMenuActiveItem.id
        }
      });
    },
    changeCate(cateItem) {
      this.userHelpContentTableData = [];
      this.loading = true;
      this.leftMenuActiveItem = cateItem;
      this.$store.commit("changeUserHelpLeftActiveItem", this.leftMenuActiveItem);
      this.getContentList(cateItem);
      this.searchForm = Object.assign(
        {},
        {
          title: "",
          status: "",
          target: ""
        }
      );
      this.$store.commit("changeUserHelpSearchFormRecord", this.searchForm);
      this.$gio.clickUserGuide({
        userGuide: cateItem.name
      });
    },
    closeOrderDialog() {
      this.recordRowData = {};
      this.form.orderNum = 0;
      this.orderDialogVisible = false;
    },
    handle(opType, opItem, rowData) {
      this.recordRowData = rowData;
      if (opType === "ORDER") {
        this.form.orderNum = rowData.orderNum;
        this.orderDialogVisible = true;
      } else if (opType === "READ") {
        this.$router.push({
          name: "createUserHelpContent",
          params: {
            classIdProp: this.leftMenuActiveItem.id,
            classTypeProp: this.leftMenuActiveItem.type,
            operationTypeProp: "READ",
            readItemProp: rowData
          }
        });
      }
    },
    pageSizeChange(pageSize) {
      this.pageInfo = Object.assign({}, this.pageInfo, { size: pageSize });
    },
    pageCurrentChange(currentPage) {
      this.pageInfo = Object.assign({}, this.pageInfo, {
        current: currentPage
      });
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { target } = this.recordRowData;
          const targetRes = target.split("，").map(item => {
            // "美孚|经销|工业客户"
            if (item.includes("美孚")) {
              return 0;
            } else if (item.includes("经销商")) {
              return 1;
            } else if (item.includes("工业客户")) {
              return 2;
            }
          });
          const res = await this.requestMethodPost(
            "/help/center/addOrUpdateHelpContent",
            Object.assign({}, this.recordRowData, this.form, {
              classId: this.leftMenuActiveItem.id,
              target: targetRes.join(",")
            })
          );
          const data = res.data;
          if (data.code == 1000) {
            this.$message({
              type: "success",
              message: "修改排序成功"
            });
          } else {
            this.$message({
              type: "error",
              message: data.msg || "请稍后重试"
            });
          }
          this.getContentList(this.leftMenuActiveItem);
          this.orderDialogVisible = false;
        } else {
          return false;
        }
      });
    },
    showActive(id) {
      if (this.leftMenuActiveItem && this.leftMenuActiveItem.id === id) {
        return true;
      } else {
        return false;
      }
    },
    async getContentList(cateItem, searchForm) {
      const res = await this.requestMethodGet("/help/center/queryHelpContentListByPage", {
        isConfPage: 1,
        classId: cateItem.id,
        ...this.pageInfo,
        ...searchForm
      });
      const { data } = res;
      if (data.code == 1000) {
        this.total = data.data.totalCount;
        if (cateItem.id == 0) {
          this.userHelpContentTableData = data.data.list.map(item => {
            if (["易美孚", "网页端", "对标产品与相容性查询"].includes(item.title)) {
              return { ...item, auths: ["排序"] };
            } else {
              return { ...item, auths: ["排序", "查看"] };
            }
          });
        } else {
          this.userHelpContentTableData = data.data.list;
        }
        this.loading = false;
      }
    }
  },
  watch: {
    pageInfo(val) {
      this.getContentList(this.leftMenuActiveItem);
    },
    searchForm: {
      handler: function(val, oldVal) {
        this.pageInfo.size = 30;
        this.pageInfo.current = 1;
        this.getContentList(this.leftMenuActiveItem, this.searchForm);
        this.$store.commit("changeUserHelpSearchFormRecord", this.searchForm);
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.userHelp-container {
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
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 20px;
    box-sizing: border-box;
    height: 48px;
    width: 100%;
    background: #f9f9f9;
    border-bottom: 1px solid #e9e9e9;
  }

  .left-content {
    width: 18%;
    height: 100%;
    border: 1px solid #e9e9e9;

    .icon-box {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 5%;
      cursor: pointer;
      img {
        width: 80%;
      }
      &:hover {
        background: #dcdcdc;
      }
    }

    .menulist-container {
      width: 100%;
      height: calc(100% - 110px);
      overflow-y: auto;
    }

    .list-item {
      padding-left: 10%;
      display: flex;
      align-items: center;
      cursor: pointer;
      &:hover {
        background: #f2f3f6;
      }
      .circle-icon {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #008787;
        margin-right: 8px;
      }
    }
    .list-item-active {
      background: #f2f3f6;
    }
  }

  .right-content {
    width: 82%;
    height: 100%;
    border: 1px solid #e9e9e9;
    border-left: none;

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
</style>
