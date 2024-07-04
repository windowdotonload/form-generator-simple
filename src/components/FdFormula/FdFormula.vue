<template>
    <div class="main-box-train">
      <div class="train-management" :style="mainminheight">
        <el-button @click="addFormula" size="small" type="danger" style="margin-bottom: 20px;">新建</el-button>
        <!-- 表格 -->
        <el-table ref="accountTable" :key="2" row-key="id" :data="newsTableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" v-loading="loading" stripe>
          
          <el-table-column prop="fileType" label="文件索取类型" min-width="30%" show-overflow-tooltip> </el-table-column>
          
          <el-table-column prop="udeskUrl" label="Udesk链接" min-width="25%" show-overflow-tooltip></el-table-column>

          <el-table-column prop="updateTime" label="最近编辑时间" min-width="25%" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" min-width="20%">
            <template slot-scope="scope">
              <el-link  @click="handleEdit(scope.row)" style="margin-right:10px" :underline="false" >编辑 </el-link>
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
      <!-- 新建弹框 -->
      <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogFormVisible"
            :show-close="false"
            width="700px"
            :close-on-click-modal="false"
            >
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="accountForm"
                label-width="150px"
                label-position="left"
            >
                <el-form-item label="文件索取类型" prop="fileType" >
                    <el-input
                        size="small"
                        v-model="ruleForm.fileType"
                        maxlength="20"
                        autocomplete="off"
                        style="width:320px"
                    ></el-input>
                </el-form-item>
                <el-form-item label="Udesk链接" prop="udeskUrl"   :rules='{ required: true, message: "请输入Udesk链接", trigger: "blur" }'>
                <el-input
                    size="small"
                    v-model="ruleForm.udeskUrl"
                    autocomplete="off"
                    style="width:320px"
                ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;">
                <el-button type="danger" plain @click="handleCancle('accountForm')" size="small">取消</el-button>
                <el-button v-if="editType=='edit'" type="danger" plain @click="handleDelete('accountForm')" size="small">删除</el-button>
                <el-button type="danger" @click="handleSubmit('accountForm')" size="small">提交</el-button>
                
            </div>
        </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    components: {},
    data() {
      return {
        newsTableData:[],
        mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
        dialogTitle:'新建',
        editType:'add',
        ruleForm: {
            fileType:'',
            udeskUrl:''
        },
        editId:'',
        rules: {
            fileType: [{ required: true, message: '请输入文件索取类型', trigger: 'change' }],
            udeskUrl: [{ required: true, message: "请输入Udesk链接", trigger: "blur" }]
        },
        pagenation: {
          current: 1,
          size: 30
        },
        dialogFormVisible:false,
        totalNumber: 0, // 总条数
        loading: false, // 是否加载
      };
    },
  
    created() {
    },
    mounted() {
      this.getOrderManagementData(); // 获取订单列表
    },
    methods: {
    //新建
    addFormula() {
      this.dialogFormVisible = true
      this.editType = 'add'
      this.dialogTitle = '新建'
      
    },
    // 删除
    handleDelete() {
      this.$confirm("确认是否删除？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          let params = {
            id: this.editId
          };
          this.requestMethodGet("/web/sys/conf/fd/deleteFdConf", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.dialogFormVisible = false
                this.$refs.accountForm.resetFields();
                this.getOrderManagementData(); // 获取列表
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增账号提交
    handleSubmit(formName) {
      this.$refs[formName].validate(valid => {
          if (valid) {
              this.$confirm("是否确认提交数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
              .then(() => {
                  let params = {
                    fileType: this.ruleForm.fileType,
                    udeskUrl: this.ruleForm.udeskUrl,
                    id:this.editId
                  };
                  if(this.editType == 'add') {
                      this.addData(params);

                  } else  {
                      this.handleEditSave();
                  }
              })
              .catch(() => {});
          } else {
          return false;
          }
      });
    },
        // 点击编辑
        handleEdit(row) {
          console.log(row)
          this.dialogTitle = '编辑'
          this.dialogFormVisible = true
          this.editId = row.id
          this.editType = 'edit'
          this.ruleForm ={
            fileType: row.fileType,
            udeskUrl: row.udeskUrl
          }
        },
        // 表格中行的编辑 保存
        handleEditSave() {
            let params = {
                id:this.editId,
                fileType: this.ruleForm.fileType,
                udeskUrl: this.ruleForm.udeskUrl,
            }
            this.requestMethodPost("/web/sys/conf/fd/editFdConf",params).then(res => {
                if(res.data.code == 1000) {
                    this.$message({
                        message: "编辑成功",
                        type: "success"
                    });
                    this.ruleForm={
                        fileType:'',
                        udeskUrl:''
                    }
                    this.$refs.accountForm.resetFields();
                    this.getOrderManagementData(); // 获取订单列表
                    this.dialogFormVisible = false;
                    
                    
                }else {
                    this.$message.error(res.data.msg);
                }
            }).catch(res => {
                this.loading = false;
            });
        },
        // 调取新增接口
        addData(params) {
            console.log(params)
            this.requestMethodPost("/web/sys/conf/fd/addFdConf", params)
            .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    this.$message({
                        message: "新建成功",
                        type: "success"
                    });
                    // this.ruleForm = {
                    //   fileType: "",
                    //   udeskUrl: "",

                    // }
                    this.$refs.accountForm.resetFields();
                    this.dialogFormVisible = false;
                    this.getOrderManagementData(); // 获取订单列表
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                console.log(res);
            });
        },
        // 新建润滑点部件 取消
        handleCancle(formName) {
          this.$nextTick(() => {
              this.$refs[formName].resetFields();
          });
          this.dialogFormVisible = false;
            
        },
      onResize() {
        this.mainminheight = `height:${document.documentElement.clientHeight - 200}px`;
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
  