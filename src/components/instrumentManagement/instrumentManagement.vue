<template>
  <div class="instrument-management" :style="mainminheight">
    <!-- 表格 -->
    <el-table
      ref="instrumentTableData"
      :key="key"
      row-key="id"
      :data="instrumentTableData"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="{ background: '#f7f7f7' }"
      v-loading="loading"
      stripe
    >
      <el-table-column
        prop="deviceName"
        label="仪器类型"
        min-width="12%"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="iotId"
        label="测试仪编号"
        min-width="15%"
        show-overflow-tooltip
        :render-header="renderHeader"
      ></el-table-column>
      <el-table-column
        label="归属人"
        prop="owner"
        min-width="15%"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="操作" min-width="8%">
        <template slot-scope="scope">
          <span
            @click="handleEdit(scope.row)"
            style="margin-right: 10px; color: #001450; cursor: pointer"
            >编辑</span
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 已删除的设备 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenation.current"
      :page-size="pagenation.size"
      :page-sizes="[5,10,20,30,50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      style="float: right;display:flex; margin-top: 10px"
    ></el-pagination>

    <!-- 编辑归属人 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      width="850px"
      :close-on-click-modal="false"
    >
      <div style="padding-bottom: 20px">
        一台便携仪器至少有1名归属人，最多拥有3名
      </div>
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      label-width="100px"
      label-position="left"
      class="demo-dynamic"
      inline
    >
    <el-row v-for="(item,i) in dynamicValidateForm.list"   :key="i">
        <el-form-item :label="`归属人${i+1}`" :prop="'list.' + i + '.companyType'" :rules="{required: true, message: '请选择身份', trigger: 'change'}">
          <el-select
            size="small"
            v-model="item.companyType"
            style="width: 150px"
            placeholder="请选择身份"
            @change="companyTypeChange(item.companyType,i)"
          >
            <el-option label="美孚" value="0"></el-option>
            <el-option label="经销商" value="1"></el-option>
          </el-select>
        </el-form-item>  

        <el-form-item :prop="'list.' + i + '.companyNumber'" :rules="rules.companyNumber">  
            <el-select
              size="small"
              remote
              filterable
              v-model="item.companyNumber"
              reserve-keywords
              style="width: 280px"
              placeholder="请输入公司名称"
              :loading="companyIsloading"
              @blur="handlerBlur(i,'companyNumber',item)"
              @change="companyChange(item.companyNumber,i)"
            >
              <el-option
                  v-for="row in item.customerList"
                  :key="row.companyNumber"
                  :label="row.companyName"
                  :value="row.companyNumber"
                ></el-option>
            </el-select>
          </el-form-item>
        <el-form-item :prop="'list.' + i + '.userId'" :rules="rules.userId">
            <el-select
              size="small"
              v-model="item.userId"
              remote
              filterable
              reserve-keywords
              style="width: 150px"
              placeholder="请选择用户"
              :loading="isloading"
              @blur="handlerBlur(i,'userId',item)"
            >
              <el-option
                v-for="row in item.roleList"
                :key="row.userId"
                :label="row.userName"
                :value="row.userId"
              ></el-option>
            </el-select>
          </el-form-item>          
          <el-popconfirm
            title="是否删除该归属人？"
            icon="el-icon-info"
            icon-color="red"
            @confirm="removeDomain(i)"
          >
            <span
              slot="reference"
              v-show="dynamicValidateForm.list.length > 1"
              style="margin-left: 20px; color: red; border: 0; cursor: pointer;line-height: 32px;"
              >删除</span
            >
          </el-popconfirm>
        </el-row>
      </el-form>
        <span
            @click="addDomain"
            v-if="dynamicValidateForm.list.length < 3"
            style="color: rgba(2, 167, 240, 1); cursor: pointer;margin-left:30px"
            >+添加归属人</span
          >
      <div slot="footer" class="dialog-footer" style="text-align: right">
        <el-button plain @click="handleCancle" size="small"
          >取消</el-button
        >
        <el-button
          type="danger"
          @click="submitForm"
          size="small"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      iotId:'',
      rules:{
        companyNumber:[{ required: true, message: '请选择公司', trigger: 'change' }],
        userId:[{ required: true, message: '请选择用户', trigger: 'change' }],
      },

      dynamicValidateForm:{
        list: [{
          companyType: "",
          companyNumber: "",
          userId: "",
          roleList:[],
          customerList:[],
        }]
      },
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      pagenation: {
        current: 1,
        size: 30,
      },
      totalNumber: 0, //总条数
      instrumentTableData: [], //列表数据
      dialogFormVisible: false, //新增框
      dialogTitle: "",
      loading: false, //是否加载

      isloading: false, //远程搜索loading
      companyIsloading: false, 
      
    };
  },
  components: {},
  computed: {},
  created() {},
  mounted() {
    this.getList()
  },
  methods: {
    // 人员
    $_queryRoleData(val,idx) {
      this.companyIsloading = true
      this.requestMethodGet("/web/system/permission/userManage/listByPage", {useFlag: 1,companyNumber:val,size:999})
        .then(res => {
          res = res.data;
          this.companyIsloading = false
          if (res.code == 1000) {
            this.$set(this.dynamicValidateForm.list[idx],'roleList', res.data.list)
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.companyIsloading = false;
        });
    },
    // 公司
    companyChange(val,idx){
      this.dynamicValidateForm.list[idx].userId=''
      this.dynamicValidateForm.list[idx].roleList=[]
      this.$_queryRoleData(val,idx)
      this.$refs.dynamicValidateForm.validateField('list.' + idx + `.userId`,(valid)=>{})
    },
    // 改变身份
    companyTypeChange(val,idx){
      this.dynamicValidateForm.list[idx].companyNumber=''
      this.dynamicValidateForm.list[idx].userId=''
      this.dynamicValidateForm.list[idx].roleList=[]
      this.dynamicValidateForm.list[idx].customerList=[]
      this.$refs.dynamicValidateForm.validateField('list.' + idx + `.companyNumber`,(valid)=>{})
      this.getCompanyDropdownList(val,idx)
    },
    getCompanyDropdownList(val,idx){
        let params = {
          companyType:val
        }
        this.requestMethodGet("/web/system/permission/userManage/getCompanyDropdownList", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$set(this.dynamicValidateForm.list[idx],'customerList', res.data)
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
      getList(){
        this.loading = true;
        this.requestMethodGet("/portable/device/getPortableDeviceList", {...this.pagenation})
        .then((res) => {
          this.loading = false;
          if(res.data.code == 1000) {
            this.instrumentTableData = res.data.data.list
            this.totalNumber = res.data.data.totalCount;
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
          })
          .catch((res) => {
            this.loading = false;
          });
      },
      // 校验
      handlerBlur(i,name,item){
        if(name == 'companyNumber' && !item.companyType) {
          this.rules.companyNumber[0].message = '请先选择身份'
        }
        if(name == 'userId' && !item.companyNumber) {
          this.rules.userId[0].message = '请先选择公司'
        }
        this.$refs.dynamicValidateForm.validateField('list.' + i + `.${name}`,(valid)=>{})
        this.rules.companyNumber[0].message = '请选择公司'
        this.rules.userId[0].message = '请选择用户'
      },


    // 自定义表头
    renderHeader(h, { column }) {
      const paymentContent = h(
        "div",
        {
          slot: "content",
        },
        "系列号:便携式验油箱唯一标识,见设备铭牌"
      );
      return h("div", [
        h("span", column.label),
        h(
          "el-tooltip",
          {
            props: {
              placement: "top",
            },
          },
          [
            column.label != "测试仪编号" ? serviceContent : paymentContent,
            h("i", {
              class: "el-icon-warning",
              style: "margin-left:5px;",
            }),
          ]
        ),
      ]);
    },
    //  提交
    submitForm() {
      this.$refs['dynamicValidateForm'].validate((valid) => {
        if (valid) {
          let params = this.dynamicValidateForm.list.map((item)=>{
            return {
              iotId: this.iotId,
              userId: item.userId,
            };
          })
          this.requestMethodPost("/portable/device/setPortableUserOwner", params)
          .then((res) => {
            if(res.data.code == 1000) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });         
                this.getList()
                this.dialogFormVisible = false;
            } else {
              this.$message({
                message: res.data.msg,
                type: "warning"
              });
            }
            })
            .catch((res) => {
            });
        }
      })
    },
    // 删除
    removeDomain(index) {
      this.dynamicValidateForm.list.splice(index, 1);
    },
    // 添加
    addDomain() {
        this.dynamicValidateForm.list.push({
          companyType: "",
          companyNumber: "",
          userId: "",
          roleList:[],
          customerList:[],
        });
    },
    // 编辑
    handleEdit(row) {
      this.iotId = row.iotId
      this.dialogTitle = "编辑归属人";
      this.requestMethodGet("/portable/device/getPortableOwnerListByIotId", {iotId:row.iotId})
      .then((res) => {
        this.loading = false;
        if(res.data.code == 1000) {
          this.dynamicValidateForm.list = res.data.data.map((item,index) => {
            this.getCompanyDropdownList(item.roleType,index)
            this.$_queryRoleData(item.companyNumber,index)
            return {
              companyType: item.roleType,
              companyNumber: item.companyNumber,
              userId: item.userId,
              roleList:[],
              customerList:[],
            }
          })
          this.dialogFormVisible = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
        })
        .catch((res) => {
          this.loading = false;
        });
      
      if(this.$refs['dynamicValidateForm']) {
        this.$refs['dynamicValidateForm'].clearValidate()
      }
    },
    // 取消
    handleCancle() {
      this.dialogFormVisible = false;
    },
        //current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.getList()
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.getList()
    },
  },
};
</script>
<style lang='less'>
.instrument-management {
  padding: 10px 25px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin: 15px 0 30px;
  }
  .demo-dynamic .el-form-item__label {
    float: left;
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
  .el-pagination {
    position: fixed;
    bottom: 25px;
    right: 25px;
  }
  .el-form-item__content {
    display: flex;
  }
}
.instrument-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
</style>