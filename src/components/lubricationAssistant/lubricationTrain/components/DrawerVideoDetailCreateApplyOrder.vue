<template>
  <div class="apply-order-component-train">
    <el-dialog :modal="false" class="closeWorkOrder" :visible.sync="addWorkorderVisibled" title="创建申请单" top="100px" :show-close="false" width="32%" @close="closeServiceDialog">
      <el-form :model="questionForm" :rules="serviceTypeRule" ref="questionForm" label-position="top">
        <el-form-item v-if="userInfo.userType != 2" label="客户" prop="customerId">
          <el-select @clear="clearPeopleList" size="small" clearable class="dialog" placeholder-style="color:#e2e2e2;" style="width: 100%" filterable v-model="questionForm.customerId">
            <el-option @click.native="changeCompany(item.companyNumber)" v-for="item in companyList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="contactUserId">
          <el-select
            :disabled="userInfo.userType != 2 ? false : true"
            @click.native="selCompanyPeople"
            size="small"
            clearable
            class="dialog"
            placeholder-style="color:#e2e2e2;"
            style="width: 100%"
            filterable
            v-model="questionForm.contactUserId"
          >
            <el-option
              v-for="item in selCompnyPeopleList"
              :key="item.userId"
              :label="`${item.roleNames ? item.roleNames.join('/') : ''} ${item.userName} ${item.phonenumber}`"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="润滑点设备类型" prop="lubricationPointTypeCode">
          <el-select v-model="questionForm.lubricationPointTypeCode" placeholder="请选择" placeholder-style="color:#e2e2e2;" class="dialog" style="width: 100%" size="small">
            <el-option v-for="item in lubricationPointTypeList" :key="item.code" :label="item.name" :value="item.code" clearable> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油品种类" prop="oilNumber">
          <el-cascader
            size="small"
            clearable
            class="dialog"
            v-model="questionForm.oilNumber"
            :options="oilTypeList"
            filterable
            :props="{ label: 'oilName', value: 'oilNumber', children: 'children' }"
            style="width: 100%"
          >
          </el-cascader>
        </el-form-item>
        <div style="margin-bottom: 10px; font-size: 13px;margin-top:10px"><span style="color: #dd0000">*</span>请选择您遇到的问题</div>
        <div style="max-height: 640px; overflow: auto">
          <el-collapse v-model="selectQuestionList" @change="handleChange">
            <el-collapse-item v-for="item in questionList" :key="item" :name="item.id">
              <template slot="title">
                {{ item.name }}
              </template>
              <el-checkbox-group v-model="checkList">
                <el-checkbox :label="res.id" v-for="res in item.children" :key="res.id">{{ res.name }}</el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
          <div style="background: #f9f9f9; padding: 20px; border: 1px solid #e4e7ed" v-if="checkList.includes(2)">
            <el-form-item label="详细描述" prop="description">
              <el-input
                placeholder="请填写具体的现象，100字以内。"
                size="small"
                type="textarea"
                resize="none"
                style="width: 100%"
                :row="4"
                v-model="questionForm.description"
                maxlength="100"
                show-word-limit
              >
              </el-input>
            </el-form-item>
          </div>
        </div>
        <UplaodSection ref="uploadVideoImg" />
      </el-form>

      <div slot="footer" style="margin-top: -20px">
        <el-button type="danger" plain @click="handleResetAdd('questionForm')" size="small">取消</el-button>
        <el-button type="danger" @click="sureAddWorkOrder('questionForm')" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UplaodSection from "../../../configure/components/uploadVideoImg.vue";
import applyList from "../../../configure/applyMixins/list";
export default {
  mixins: [applyList],
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 240}px`
    };
  },
  components: {
    UplaodSection
  },
  data() {
    return {
      selCompnyPeopleList: [],
      questionForm: {
        description: "",
        contactUserId: ""
      },
      oilTypeList: [],
      companyList: [], // 公司数据
      lubricationPointTypeList: [], // 润滑点设备类型
      selectQuestionList: [],
      //   表单验证规则
      serviceTypeRule: {
        customerId: [{ required: true, message: "请选择客户", trigger: "change" }],
        lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        oilNumber: [{ required: true, message: "请选择油品种类", trigger: "change" }],
        description: [{ required: true, message: "请输入详细描述", trigger: "change" }],
        contactUserId: [{ required: true, message: "请选择联系人", trigger: "blur" }]
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      addWorkorderVisibled: false, // 新建工单
      questionList: [], //服务类型列表
      checkList: [] //选中的问题
    };
  },
  mounted() {
    this.getApplyReasonConfTree();
    this.$_queryApplyType();
  },

  methods: {
    // 创建申请单
    handleAddWorkOrder(configureServiceItem) {
      this.getCompanyData();
      this.getOilTypeData();
      this.$_queryLPData();
      this.questionForm = {
        description: "",
        contactUserId: ""
      };
      if (this.userInfo.userType == 2) {
        this.questionForm.contactUserId = this.userInfo.userId;
      }
      this.checkList = [];
      this.checkList.push(2);
      this.selectQuestionList.push(1);
      this.questionForm.description = configureServiceItem.serviceName;
      this.addWorkorderVisibled = true;
    },
    selCompanyPeople() {
      if (this.userInfo.userType == 2) return;
      if (!this.questionForm.customerId) {
        return this.$message({
          type: "warning",
          message: "请先选择客户"
        });
      }
    },
    clearPeopleList() {
      this.questionForm.contactUserId = "";
      this.selCompnyPeopleList = [];
    },
    changeCompany(companyNumber) {
      this.selCompnyPeopleList = [];
      this.questionForm.contactUserId = "";
      this.getCompanyPeople(companyNumber);
    },
    async getCompanyPeople(companyNumber) {
      if (this.userInfo.userType == 2) return;
      const params = {
        useFlag: 1,
        companyNumber,
        current: 1,
        size: 300
      };
      if (this.userInfo.userType == 1) params.companyFlag = true;
      const peopleListRes = await this.requestMethodGetTip("/web/system/permission/userManage/listByPage", params);
      if (peopleListRes.data.code == 1000) {
        this.selCompnyPeopleList = peopleListRes.data.data.list;
      }
    },
    closeServiceDialog() {
      this.$refs.uploadVideoImg.cancelUplaod();
    },

    // 查询创建类型
    $_queryApplyType() {
      this.requestMethodGet("/serviceApply/getServiceApplyType")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.applyTypeData = res.data;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },

    //查询润滑点
    $_queryLPData() {
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.lubricationPointTypeList = res.data;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    getOilTypeData() {
      this.requestMethodGet("/serviceApply/getOilLv2")
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.oilTypeList = this.formatData1(res.data.list);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    formatData1(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].children || data[i].children.length == 0) {
          data[i].children = null;
        } else {
          this.formatData1(data[i].children);
        }
      }
      return data;
    },

    getCompanyData(val) {
      let param = {
        size: 500,
        searchCompanyName: ""
      };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", param)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.companyList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },

    handleResetAdd(formName) {
      this.addWorkorderVisibled = false;
      this.$refs[formName].resetFields();
    },
    // 确定新建申请单
    sureAddWorkOrder(formName) {
      if (!this.checkList.length) {
        this.$message({
          message: "请选择问题",
          type: "warning"
        });
        return;
      }
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let param = {
            lubricationPointTypeCode: this.questionForm.lubricationPointTypeCode,
            oilNumber: this.questionForm.oilNumber[this.questionForm.oilNumber.length - 1],
            customerId: this.questionForm.customerId,
            description: this.checkList.includes(2) ? this.questionForm.description : "",
            distributorId: this.userInfo.distributorId,
            reasonConfList: this.checkList,
            serviceApplyType: 1
          };
          const targetPeople = this.selCompnyPeopleList.find(item => item.userId == this.questionForm.contactUserId);
          param.customerContactPerson = `userId=${targetPeople.userId}&userName=${targetPeople.userName}&userPhone=${targetPeople.phonenumber}`;
          param.customerContactPersonId = targetPeople.userId;

          if (this.userInfo.userType != 2) {
            param.serviceApplyType = 2;
            param.distributorId = this.userInfo.companyId;
          } else {
            param.customerId = this.userInfo.companyId;
          }
          const uploadAssets = await this.$refs.uploadVideoImg.getUplaodAssets();
          Object.assign(param, uploadAssets);

          this.requestMethodPost("/serviceApply/addServiceApplyOrder", param).then(res => {
            this.loading = false;
            res = res.data;
            if (res.code == 1000) {
              this.$router.push({
                path: "/ServiceApplyList/ServiceApplyDetail",
                query: {
                  id: res.data
                }
              });
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          });
        }
      });
    },

    //  获取问题列表
    getApplyReasonConfTree() {
      let params = { status: 1 };
      this.requestMethodGet("/serviceApply/reasonConf/queryServiceApplyReasonConfTree", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.questionList = res.data;
            this.activeQuestion = this.questionList[0].id
            this.checkboxList = this.questionList[0].children;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    }
  }
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  display: none;
}
.apply-order-component-train {
  border-radius: 16px;
  overflow: hidden;
  padding: 0px 20px 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
  .el-form-item {
    margin-bottom: 0px !important;
  }
  .el-popover-detail {
    /deep/ .el-button {
      padding: 0px !important;
    }
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    border-bottom-color: #e9e9e9;
    background: #dd0000;
    color: #fff;
  }
  /deep/ .el-tabs--card > .el-tabs__header {
    border-bottom: none;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/.el-table::before {
    height: 0px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item {
    border-bottom: 1px solid #e4e7ed;
    border-left: 1px solid #e4e7ed;
    -webkit-transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  /deep/ .el-tabs__item {
    color: #666;
  }
  /deep/ .el-tabs__item:hover {
    color: #dd0000;
    cursor: pointer;
  }
  /deep/.el-table .descending .sort-caret.descending {
    border-top-color: #001450;
  }
  /deep/.el-table .ascending .sort-caret.ascending {
    border-bottom-color: #001450;
  }
  .workOrder-Status {
    // cursor:pointer;
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    font-weight: bold;
  }
  /deep/ .dialog .el-input--small .el-input__inner {
    height: 35px !important;
    line-height: 35px !important;
    background: #f9f9f9 !important;
  }
  /deep/ .dialog input::-webkit-input-placeholder {
    color: #333;
  }
  /deep/ .exDetail {
    .el-dialog__header {
      padding: 0px;
    }
    .el-dialog__body {
      padding: 13px;
    }
    .el-dialog__headerbtn {
      top: 13px;
      right: 12px;
    }
    .el-dialog__wrapper {
      left: 21%;
    }
  }
}
/deep/ .el-form--label-top .el-form-item__label {
  margin-top: 8px;
}
</style>
<style lang="less">
.apply-order-component-train .closeWorkOrder {
  .el-dialog {
    border-radius: 16px;
  }
  .el-dialog__body {
    padding: 10px 20px 20px 20px;
  }
  .el-dialog__title {
    font-size: 18px;
    color: #000;
    font-family: MicrosoftYaHei;
  }
  .el-collapse {
    border: none !important;
  }
  .el-collapse-item__header {
    background: #f9f9f9;
    border-top: 1px solid #e4e7ed;
    padding: 0 20px;
    height: 35px;
  }
  .el-collapse-item__content {
    padding-bottom: 0;
  }
  .el-collapse-item {
    border-left: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    margin-bottom: 20px;
    position: relative;
  }
  .el-collapse-item__wrap {
    border-bottom: none !important;
  }
  .el-checkbox {
    width: 100%;
    // height: 45px;
    // line-height: 45px;
    padding: 10px 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #e4e7ed;
    margin-right: 0;
  }
  .el-checkbox__label {
    display: inline-grid;
    white-space: pre-line;
    word-wrap: break-word;
    overflow: hidden;
    line-height: 20px;
  }
}
</style>
