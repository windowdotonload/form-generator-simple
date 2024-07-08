<template>
  <div id="app">
    <FormCreate />
  </div>
</template>

<script>
import FormCreate from "./components/ReportForm/formApplication/formCreate/page.vue";
export default {
  name: "App",
  components: {
    FormCreate,
  },
};
</script>

<style lang="less">
// @import "./assets/font/font.css";
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#app-sub {
  height: 100%;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  min-width: 1300px;
  color: #2c3e50;
}
.el-button--confirm-msdp {
  border: 1px solid #d10000;
  background-color: #d10000;
}

.msg-center {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}
::-webkit-scrollbar {
  width: 10px !important;
  height: 10px !important;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.6);
  border-radius: 6px !important;
}
.number-msg {
  padding: 0 7px;
  height: 18px;
  background-color: #dd0000;
  color: #ffffff;
  border-radius: 10px;
  text-align: center;
  line-height: 18px;
  font-size: 12px;
  margin-right: 10px;
  position: absolute;
  top: 16px;
  left: 30px;
}
.yahei {
  font-family: MicrosoftYaHei;
  font-size: 13px;
  color: rgb(153, 153, 153);
}
.title-logo {
  // border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  height: 60px;
  line-height: 60px;
}
//  去掉表格内部边框
.data-table {
  min-height: 500px;
}
// 导出提示语
.export-notice {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #ff9900;
  margin-left: 20px;
  display: flex;
  align-items: center;
}
.download-box {
  font-family: MicrosoftYaHei;
  padding: 0px 20px 20px 20px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.file-title {
  font-family: MicrosoftYaHei;
  font-size: 13px;
  color: #333;
  line-height: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 300px;
}
.file-notice {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #999;
  line-height: 12px;
  margin-top: 10px;
}
.download-wrap {
  .el-dialog {
    margin-right: 40px;
    padding-bottom: 20px;
    border-radius: 4px;
  }
  .el-dialog__body {
    padding: 0px 0px 0px;
  }
  .el-tooltip_popper {
    max-width: 20% !important;
  }
  .el-dialog__title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    line-height: 16px;
  }
  .el-divider--horizontal {
    margin: 10px 0;
  }
}
.honor-wrap {
  .el-dialog {
    padding-bottom: 20px;
    border-radius: 4px;
  }
  .el-dialog__body {
    padding: 0px 0px 0px;
  }
  .el-dialog__title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    line-height: 16px;
  }
  .el-divider--horizontal {
    margin: 10px 0;
  }
}
// .data-table::after {
//   width: 0 !important;
// }
.data-table td,
.data-table th.is-leaf {
  border: none !important;
}
.data-table thead tr th.is-leaf {
  // border: 1px solid #ebeef5 !important;
  border-right: none !important;
}
.data-table thead tr th:nth-last-of-type(2) {
  border-right: 0px solid #ebeef5 !important;
}
// .nav-left > div:first-child {
//   overflow-y: auto !important;
// }
.right-nav {
  float: left;
  width: calc(100% - 220px) !important;
}
.left-nav {
  float: left;
  background: #f2f3f7;
  width: 220px !important;
}
.el-button--danger {
  background: rgb(221, 0, 0) !important;
}
.el-button--danger.is-plain {
  color: rgb(221, 0, 0);
  background-color: #fcf2f1 !important;
  border-color: #f56c6c !important;
}
.el-button--danger.is-plain:focus,
.el-button--danger.is-plain:hover {
  color: rgb(221, 0, 0) !important;
}
.el-button--default.el-button--small:focus,
.el-button--default.el-button--small:hover {
  color: rgb(221, 0, 0) !important;
  background-color: #fcf2f1 !important;
  border-color: #fe000c !important;
}
.deletBtn .el-button--primary:focus,
.deletBtn .el-button--primary:hover {
  background-color: #fe000c !important;
  color: #fff !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.data-table .el-table__body tr.current-row > td {
  background-color: #fee7e8 !important;
}
.el-form-item__label {
  line-height: 30px !important;
}
.el-form-item__content {
  line-height: 30px !important;
}
.el-form--label-top .el-form-item__label {
  padding: 0px !important;
}
.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background: #fff !important;
  border: 1px solid #dcdfe6 !important;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background: #fff !important;
  border: 1px solid #fe000c !important;
  color: #fe000c !important ;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #fe000c !important ;
}
.el-select .el-input.is-focus .el-input__inner,
.el-select .el-input__inner:focus,
.el-input.is-active .el-input__inner,
.el-input__inner:focus,
.el-range-editor.is-active,
.el-range-editor.is-active:hover,
.el-textarea__inner:focus {
  border-color: #fe000c !important;
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: #001450 !important;
  background: #001450 !important;
}
.el-radio.is-checked .el-radio__label {
  color: #001450 !important;
}
.el-select-dropdown__item.selected,
.el-date-table td.today span,
.el-date-table td.available:hover {
  color: #fe000c !important;
}
.el-date-table td.today.start-date span {
  color: #fff !important;
}
.el-submenu__title:hover {
  background-color: #fee7e8 !important;
}
.el-date-table td.end-date span,
.el-date-table td.start-date span {
  background-color: #fe000c !important;
}
.el-pagination {
  position: fixed;
  bottom: 25px;
  right: 25px;
  // .el-pagination__sizes {
  //   display: none !important;
  // }
}
.el-table .el-table__header-wrapper thead {
  color: #000;
}
.el-textarea__inner {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, "\5FAE\8F6F\96C5\9ED1", Arial, sans-serif;
}
label {
  font-size: 14px !important;
}
// .el-input__inner{
//   height:32px !important;
//   line-height: 32!important;
// }
// .el-pagination__editor.el-input .el-input__inner{
//   height:28px !important;
// }
.el-table__body-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 10px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.6);
  border-radius: 3px;
}
::-webkit-scrollbar {
  width: 6px; /*竖向*/
  height: 6px; /*横向*/
}
::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.6);
  border-radius: 3px;
}
.empty-content {
  &:empty {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      color: #999;
      font-size: 15px;
      content: "暂无内容";
    }
  }
}
</style>
