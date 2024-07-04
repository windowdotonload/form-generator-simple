<template>
    <div class="main-box-train">
      <div class="train-management" :style="mainminheight">
        <el-button @click="applyHistory" size="small" type="danger" style="margin-bottom: 20px;">申请历史</el-button>
        <!-- 表格 -->
        <el-table ref="accountTable" :key="2" row-key="id" :data="newsTableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" v-loading="loading" stripe>
          
          <el-table-column prop="fileType" label="申请类型" min-width="60%" show-overflow-tooltip> </el-table-column>
          <el-table-column label="操作" min-width="20%">
            <template slot-scope="scope">
              <el-link  @click="handleAdd(scope.row)" style="margin-right:10px" :underline="false" >申请 </el-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        v-if="totalNumber > 0"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        style="float: right;display:flex; margin-top: 10px"
      ></el-pagination>
      <!-- 变更历史弹框 -->
      <el-dialog :visible.sync="dialogEditHistoryVisible" width="54%" :close-on-click-modal="false">
        <div slot="title">
          <span>编辑历史</span>
        </div>
        <EditTable
          :key="key"
          :cHDataTotalNumber="cHDataTotalNumber"
          :changeHistoryTableData="changeHistoryTableData"
          :current="pagenationCH.current"
          :size="pagenationCH.size"
          @handleSizeChangeCH="handleSizeChangeCH"
          @handleCurrentChangeCH="handleCurrentChangeCH"
        />
        <div slot="footer" class="dialog-footer" style="margin-top: 20px"></div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import EditTable from "./editTable.vue";
  export default {
    components: {EditTable},
    data() {
      return {
        newsTableData:[],
        dialogEditHistoryVisible:false,
        cHDataTotalNumber: 0, // 变更历史总条数
        pagenationCH: {
            //   变更历史列表分页参数
            current: 1,
            size: 30
        },
        mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
        dialogTitle:'新建',
        editType:'add',
        ruleForm: {
            fileType:'',
            udeskUrl:''
        },
        rules: {
            fileType: [{ required: true, message: '请输入文件索取类型', trigger: 'change' }],
            udeskUrl: [{ required: true, message: "请输入Udesk链接", trigger: "blur" }]
        },
        pagenation: {
          current: 1,
          size: 30
        },
        changeHistoryTableData:[],
        dialogFormVisible:false,
        totalNumber: 0, // 总条数
        loading: false, // 是否加载
      };
    },
  
    created() {
      this.$gio.Clicktoapply()
    },
    mounted() {
      this.getOrderManagementData(); // 获取订单列表
    },
    methods: {
        handleAdd(row) {
          window.open(row.udeskUrl, "_blank");
          let params = {
            fileType:row.fileType
          };
          this.requestMethodPost("/web/sys/conf/fd/addLog", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {
            });

        },
        applyHistory() {
            this.dialogEditHistoryVisible = true
            // 获取申请历史数据
            this.getApplyLog()
            this.$gio.ClicktoApplyHistory()
        },
        //  变更历史列表 size change
        handleSizeChangeCH(size) {
        this.pagenationCH.size = size;
        this.pagenationCH.current = 1;
        this.getApplyLog() // 查询变更历史
        },
        // current change
        handleCurrentChangeCH(current) {
        this.pagenationCH.current = current;
        this.getApplyLog() // 查询变更历史
        },
        onResize() {
            this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`;
        },
        getApplyLog() {
        let params = {
          ...this.pagenationCH
        };
        this.changeHistoryTableData = [];
        this.requestMethodGet("/web/sys/conf/fd/getFdApplyLog", params)
          .then(res => {
            this.loading = false;
            res = res.data;
            if (res.code == 1000) {
              this.changeHistoryTableData = res.data.list;
              this.cHDataTotalNumber = res.data.totalCount;
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {
            this.loading = false;
          });
      },
      // 获取账号列表
      getOrderManagementData() {
        this.loading = true;
        let params = {
          ...this.pagenation
        };
        this.newsTableData = [];
        this.requestMethodGet("/web/sys/conf/fd/getFdConf", params)
          .then(res => {
            this.loading = false;
            res = res.data;
            if (res.code == 1000) {
              this.newsTableData = res.data.list;
              this.totalNumber = res.data.totalCount;
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {
            this.loading = false;
          });
      },
      // page change  事件
      handleCurrentChange(page) {
        this.pagenation.current = page;
        this.getOrderManagementData(); // 获取订单管理列表
      },
      // size change 事件
      handleSizeChange(size) {
        this.pagenation.size = size;
        this.pagenation.current = 1;
        this.getOrderManagementData(); // 获取订单管理列表
      },
    }
  };
  </script>
  <style lang="less">
  .train-management {
    padding: 10px 25px;
    height: 100%;
    overflow: auto;
    &-serach-item {
      margin: 0px 0 22px;
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: rgba(254, 0, 12, 1) !important;
      border-color: rgba(254, 0, 12, 1) !important;
    }
    .el-radio-button__inner:hover {
      color: rgba(254, 0, 12, 1) !important;
    }
    .is-active .el-radio-button__inner:hover {
      color: #fff !important;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #f5f7fa !important;
    }
    .el-tabs__item.is-active {
      color: #fe000c !important;
      font-weight: 900 !important;
    }
    .el-tabs__active-bar {
      background-color: #fe000c !important;
    }
    .el-tabs__item:hover {
      color: #fe000c !important;
    }
  }
  </style>
  <style lang="less">
  .preview-dialog .el-scrollbar__wrap,
  .drawer-box .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .main-box-train .el-dialog__body {
    padding-top: 5px !important;
  }
  .el-icon-delete:hover {
    color: #dd0000;
  }
  .el-pager li.active {
    color: #dd0000 !important;
  }
  .deletBtn .el-button--primary {
    background-color: #fe000c !important;
    border-color: #fe000c !important;
  }
  .deletBtn .el-message-box__container {
    position: relative;
  }
  .deletBtn .el-icon-warning {
    color: #fe000c !important;
  }
  .deletBtn .el-message-box__message {
    word-break: break-all !important;
  }
  .drawer-box {
    .el-drawer__header {
      font-size: 18px;
      color: #000;
      line-height: 26px;
      margin-bottom: 8px !important;
    }
    .el-drawer__body {
      padding-left: 20px;
      height: calc(100% - 50px);
    }
    .train-name {
      color: #999;
      font-size: 13px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e9e9e9;
    }
    .title {
      font-size: 14px;
      color: #000;
      font-weight: bold;
      margin: 20px 0;
    }
    .grid-content {
      background: rgba(204, 221, 255, 0.2);
      padding: 20px;
    }
    .col-5 {
      width: 20%;
      margin-right: 10px;
      border: 1px solid rgba(204, 221, 255, 0.8);
      border-radius: 6px;
      .name {
        color: #666;
        font-size: 14px;
        margin-bottom: 20px;
      }
      .number {
        color: #dd0000;
        font-size: 20px;
        display: inline;
        font-weight: bold;
        cursor: pointer;
      }
    }
    .status {
      position: relative;
      padding-left: 15px;
      font-size: 12px;
      color: #999;
      margin-bottom: 10px;
      display: inline-block;
      &::before {
        content: "";
        position: absolute;
        top: 6px;
        left: 0;
        width: 6px;
        height: 6px;
        background-color: #3ba1ff;
        border-radius: 3px;
      }
    }
    .star2::before {
      background-color: #37cbcb;
    }
    .star3::before {
      background-color: #4fcb74;
    }
    .star4::before {
      background-color: #fbd438;
    }
    .star5::before {
      background-color: #f2647c;
    }
  }
  </style>
  