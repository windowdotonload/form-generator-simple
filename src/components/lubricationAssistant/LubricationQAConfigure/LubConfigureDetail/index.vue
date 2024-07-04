<template>
  <div class="userHelp-container">
    <div class="left-content">
      <div class="top-title">
        <div style="display:flex;flex-wrap;nowrap;align-items:center">
          <p class="rectangle-icon"></p>
          <p style="font-size:15px;font-weight:700">分类索引</p>
        </div>
        <el-button size="mini" type="danger" @click="configureClassify">设置分类</el-button>
      </div>
      <ClassifyList />
    </div>

    <div class="right-content">
      <div class="top-title">
        <div style="display:flex;flex-wrap;nowrap;align-items:center">
          <p class="rectangle-icon"></p>
          <p style="font-size:15px;font-weight:700">问答详情</p>
        </div>
      </div>
      <QADetail />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    ClassifyList: () => import("./components/ClassifyList.vue"),
    QADetail: () => import("./components/QADetail.vue")
  },
  provide() {
    return {
      provide: this.provide
    };
  },
  data() {
    return {
      provide: {
        lv1CatalogueItem: {},
        lv2CatalogueItem: {}
      },
      leftListData: []
    };
  },
  methods: {
    configureClassify() {
      this.$router.push({
        name: "LubQAConfigureClassify"
      });
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
    width: 21%;
    height: 100%;
    border: 1px solid #e9e9e9;
  }

  .right-content {
    width: 79%;
    height: 100%;
    border: 1px solid #e9e9e9;
    border-left: none;
    position: relative;

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
::-webkit-scrollbar {
  display: none;
}
</style>
