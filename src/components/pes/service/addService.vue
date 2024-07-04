<!--PES档案-->
<template>
  <div style="position: relative">
    <div class="return-btn" style="position: absolute; right: 20px; height: 55px; line-height: 55px; top: -65px">
      <el-button type="danger" size="small" @click="submit">提交</el-button>
      <el-button size="small" @click="cancel">取消</el-button>
    </div>
    <el-divider></el-divider>
    <!-- 内容区域 -->
    <div class="add-customer-profile" :style="mainminheight">
      <!-- 新增服务项 -->
      <div class="add-title" style="margin-top: -20px">新增服务项</div>
      <div style="margin: 24px 0 20px 16px">
        <el-button size="small" @click="addService" type="danger" plain>添加服务项</el-button>
      </div>
      <!-- 服务项form -->
      <div class="service-form" v-for="(item, index) in addFormList" :key="index">
        <el-form :ref="item.formRef" :model="item" label-width="80px" class="demo-form-inline" label-position="top" inline>
          <el-row :gutter="20">
            <el-col :span="screenWidth > 1800 ? '3' : '5'">
              <el-form-item label="服务项" prop="serviceNumber" :rules="[{ required: true, message: '请选择服务项' }]">
                <el-cascader
                  :ref="`item+${index}`"
                  clearable
                  v-model="item.serviceNumber"
                  @change="
                    click => {
                      handleSelectServiceType2(click, index);
                    }
                  "
                  :options="typeList"
                  style="width:180px;"
                  :props="{ value: 'serviceNumber', label: 'serviceName', children: 'children' }"
                  :show-all-levels="false"
                  filterable
                  size="small"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1800 ? '3' : '5'">
              <el-form-item label="计划开始日期" prop="planStartTime" :rules="[{ required: true, message: '请选择计划开始日期' }]">
                <el-date-picker style="width:180px;" v-model="item.planStartTime" type="date" size="small" :picker-options="pickerBeginDateBefore" value-format="yyyy-MM-dd" placeholder="请选择">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1800 ? '3' : '5'">
              <el-form-item label="所属车间" prop="workshopId" :rules="[{ required: true, message: '请选择所属车间' }]">
                <el-select
                  v-model="item.workshopId"
                  style="width:180px;"
                  @change="val => workshopChange(val, item, 'create')"
                  placeholder="请选择"
                  no-data-text=" 无数据 "
                  size="small"
                  clearable
                  filterable
                >
                  <el-option @click.native="clickWorkShopItem(workshop)" v-for="workshop in workshopList" :key="workshop.workshopId" :label="workshop.workshopName" :value="workshop.workshopId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="screenWidth > 1800 ? '3' : '5'">
              <el-form-item label="服务负责人" prop="chargeUserId" :rules="[{ required: true, message: '请选择服务负责人' }]">
                <el-cascader
                  v-if="userType == 0"
                  ref="cascaderAddr"
                  clearable
                  style="width:180px;"
                  v-model="item.chargeUserId"
                  :options="userType == 1 ? chargeUserList : item.workshopId ? createChargeUserList : []"
                  :props="{ value: 'userId', label: 'userName', children: 'userList' }"
                  :show-all-levels="false"
                  filterable
                  size="small"
                >
                </el-cascader>
                <el-select size="small" v-model="item.chargeUserId" filterable placeholder="请选择" clearable v-if="userType == 1">
                  <el-option v-for="item in chargeUserList" :key="item.userId" :label="item.userName" :value="item.userId"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- 美孚项目成员 -->
            <el-col :span="screenWidth > 1800 ? '3' : '5'" v-if="serviceCompanyType == '0'">
              <el-form-item label="美孚项目成员" prop="mobilProjectUsers" no-match-text="该用户不存在">
                <el-select
                  v-model="item.mobilProjectUsers"
                  multiple
                  @visible-change="val => customerVisible(val, item)"
                  :loading="loadingCustomer"
                  no-match-text="该用户不存在"
                  filterable
                  placeholder="请选择"
                  size="small"
                  clearable
                >
                  <el-option v-for="user in item.mobilProjectUsersList" :key="user.userId" :label="user.nameCn" :value="user.userId"> </el-option>
                </el-select>
                <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.customerUserName }}</span>
              </el-form-item>
            </el-col>
            <!-- 经销商项目成员 -->
            <el-col :span="screenWidth > 1800 ? '3' : '5'" v-if="(distributorCompanyType == '1' && serviceCompanyType == '0') || serviceCompanyType == '1'">
              <el-form-item label="经销商项目成员" prop="distributorProjectUsers" no-match-text="该用户不存在">
                <el-select
                  v-model="item.distributorProjectUsers"
                  multiple
                  @visible-change="val => customerVisible(val, item)"
                  :loading="loadingCustomer"
                  no-match-text="该用户不存在"
                  filterable
                  placeholder="请选择"
                  size="small"
                  clearable
                >
                  <el-option v-for="user in item.distributorProjectUsersList" :key="user.userId" :label="user.nameCn" :value="user.userId"> </el-option>
                </el-select>
                <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.customerUserName }}</span>
              </el-form-item>
            </el-col>
            <!-- 客户项目成员 -->
            <el-col :span="screenWidth > 1800 ? '3' : '5'">
              <el-form-item label="客户项目成员" prop="customerProjectUsers" no-match-text="该用户不存在">
                <el-select
                  v-model="item.customerProjectUsers"
                  multiple
                  @visible-change="val => customerVisible(val, item)"
                  :loading="loadingCustomer"
                  no-match-text="该用户不存在"
                  filterable
                  placeholder="请选择"
                  size="small"
                  clearable
                >
                  <el-option v-for="user in customerProjectList" :key="user.userId" :label="user.userName" :value="user.userId"> </el-option>
                </el-select>
                <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.customerUserName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="2" align="right">
              <div style="margin-top: 30px; cursor: pointer">
                <el-button type="small" @click="deleteItem(item)">删除</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 已有服务项 -->
      <div v-if="servicePageType == 'edit'">
        <div>
          <div class="add-title">已有服务项<span style="font-size: 12px; color: #999">（已提交的服务项无法删除）</span></div>
        </div>
        <div style="height: 20px"></div>
        <!-- 已有服务项form -->
        <div
          class="service-form"
          v-for="(item, index) in oldItemList"
          :key="index"
          :style="{ border: item.status == 3 ? 'none' : '1px solid #e9e9e9', backgroundColor: item.status == 3 ? '#f9f9f9' : '#fff' }"
        >
          <el-form :ref="item.formRef" :model="item" label-width="80px" class="demo-form-inline" label-position="top" inline>
            <el-row :gutter="20">
              <el-col :span="screenWidth > 1800 ? '3' : '5'">
                <el-form-item label="服务项" prop="serviceName" :rules="[{ required: true, message: '请选择服务项' }]">
                  <span>{{ item.serviceName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1800 ? '3' : '5'">
                <el-form-item label="计划开始日期" prop="planStartTime" :rules="[{ required: true, message: '请选择计划开始日期' }]" :disabled="item.status == 3">
                  <el-date-picker
                    v-model="item.planStartTime"
                    type="date"
                    style="width:180px;"
                    size="small"
                    :disabled="item.status == 3"
                    v-if="(item.status == 0 || item.status == 3) && item.editFlag"
                    :picker-options="pickerBeginDateBefore"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择"
                  >
                  </el-date-picker>
                  <!-- 无法编辑时显示 -->
                  <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.planStartTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1800 ? '3' : '5'">
                <el-form-item label="所属车间" prop="workshopId" :rules="[{ required: true, message: '请选择所属车间' }]">
                  <el-select
                    v-model="item.workshopId"
                    @change="val => workshopChange(val, item)"
                    placeholder="请选择"
                    no-data-text=" 无数据 "
                    size="small"
                    clearable
                    style="width:180px;"
                    filterable
                    :disabled="item.status == 3"
                    v-if="(item.status == 0 || item.status == 3) && item.editFlag"
                  >
                    <el-option @click.native="changeExistWorkShop(item)" v-for="workshop in workshopList" :key="workshop.workshopId" :label="workshop.workshopName" :value="workshop.workshopId">
                    </el-option>
                  </el-select>
                  <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.workshopName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="screenWidth > 1800 ? '3' : '5'">
                <el-form-item label="服务负责人" prop="chargeUserId" no-match-text="该用户不存在" :rules="[{ required: true, message: '请选择服务负责人' }]" :disabled="item.status == 3">
                  <el-cascader
                    v-if="userType == 0 && (item.status == 0 || item.status == 3) && item.editFlag"
                    :disabled="item.status == 3"
                    ref="cascaderAddr"
                    clearable
                    style="width:180px;"
                    v-model="item.chargeUserId"
                    :options="userType == 1 ? chargeUserList : item.workshopId ? existFormChargeUserList[item.workshopId] : []"
                    :props="{ value: 'userId', label: 'userName', children: 'userList' }"
                    :show-all-levels="false"
                    filterable
                    size="small"
                  >
                  </el-cascader>
                  <el-select
                    size="small"
                    v-model="item.chargeUserId"
                    filterable
                    placeholder="请选择"
                    no-match-text="该用户不存在"
                    clearable
                    style="width:180px;"
                    v-if="userType == 1 && (item.status == 0 || item.status == 3) && item.editFlag"
                    :disabled="item.status == 3"
                  >
                    <el-option v-for="item in chargeUserList" :key="item.userId" :label="item.userName" :value="item.userId"> </el-option>
                  </el-select>
                  <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.chargeUserName }}</span>
                </el-form-item>
              </el-col>
              <!-- 美孚项目成员 -->
              <el-col :span="screenWidth > 1800 ? '3' : '5'" v-if="serviceCompanyType == '0'">
                <el-form-item label="美孚项目成员" prop="mobilProjectUsers" no-match-text="该用户不存在">
                  <el-select
                    v-model="item.mobilProjectUsers"
                    @visible-change="val => customerVisible(val, item)"
                    :loading="loadingCustomer"
                    no-match-text="该用户不存在"
                    style="width:180px;"
                    multiple
                    filterable
                    placeholder="请选择"
                    size="small"
                    clearable
                    :disabled="item.status == 3"
                    v-if="(item.status == 0 || item.status == 3) && item.editFlag"
                  >
                    <el-option v-for="user in item.mobilProjectUsersList" :key="user.userId" :label="user.nameCn" :value="user.userId"> </el-option>
                  </el-select>
                  <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.customerUserName }}</span>
                </el-form-item>
              </el-col>
              <!-- 经销商项目成员 -->
              <el-col :span="screenWidth > 1800 ? '3' : '5'" v-if="(distributorCompanyType == '1' && serviceCompanyType == '0') || serviceCompanyType == '1'">
                <el-form-item label="经销商项目成员" prop="distributorProjectUsers" no-match-text="该用户不存在">
                  <el-select
                    v-model="item.distributorProjectUsers"
                    @visible-change="val => customerVisible(val, item)"
                    style="width:180px;"
                    multiple
                    :loading="loadingCustomer"
                    no-match-text="该用户不存在"
                    filterable
                    placeholder="请选择"
                    size="small"
                    clearable
                    :disabled="item.status == 3"
                    v-if="(item.status == 0 || item.status == 3) && item.editFlag"
                  >
                    <el-option v-for="user in item.distributorProjectUsersList" :key="user.userId" :label="user.nameCn" :value="user.userId"> </el-option>
                  </el-select>
                  <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.customerUserName }}</span>
                </el-form-item>
              </el-col>
              <!-- 客户项目成员 -->
              <el-col :span="screenWidth > 1800 ? '3' : '5'">
                <el-form-item label="客户项目成员" prop="customerProjectUsers" no-match-text="该用户不存在">
                  <el-select
                    v-model="item.customerProjectUsers"
                    style="width:180px;"
                    multiple
                    @visible-change="val => customerVisible(val, item)"
                    :loading="loadingCustomer"
                    no-match-text="该用户不存在"
                    filterable
                    placeholder="请选择"
                    size="small"
                    clearable
                    :disabled="item.status == 3"
                    v-if="(item.status == 0 || item.status == 3) && item.editFlag"
                  >
                    <el-option v-for="user in customerProjectList" :key="user.userId" :label="user.userName" :value="user.userId"> </el-option>
                  </el-select>
                  <span v-if="item.status == 1 || item.status == 2 || item.status == 4 || !item.editFlag">{{ item.customerUserName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="2" align="right">
                <div style="margin-top: 30px">
                  <el-button type="small" @click="cancelItem(item)" v-if="item.status == 0 && item.editFlag">取消</el-button>
                  <el-button type="small" @click="recoveryItem(item)" v-if="item.status == 3 && item.editFlag">恢复</el-button>
                  <div style="font-size: 12px; color: #008888" v-if="(item.status == 1 || item.status == 2 || item.status == 4) && item.editFlag">
                    <span style="margin-left: 8px">无法编辑</span>
                  </div>
                  <div style="font-size: 12px; color: #008888" v-if="!item.editFlag && userType == '1'">
                    <span style="margin-left: 8px">由美孚修改，无法编辑</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 添加服务项 -->
      <el-dialog title="添加服务项" :visible.sync="addServiceFlag" width="30%" :before-close="handleClose">
        <el-form ref="addForm" :model="addForm" label-width="100px" :rules="addFormRules" label-position="left">
          <el-form-item label="服务类型" prop="serviceTypeNumber">
            <el-cascader
              ref="cascaderAddr1"
              clearable
              v-model="addForm.serviceTypeNumber"
              :options="typeList"
              :props="{ value: 'serviceNumber', label: 'serviceName', children: 'children' }"
              :show-all-levels="false"
              filterable
              :key="addServiceKey"
              @change="handleSelectServiceType($event)"
              size="small"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item label="数量" prop="number">
            <el-input-number v-model="addForm.number" @change="handleNumberChange" :min="1" :max="12"></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd('addForm')" size="small">取 消</el-button>
          <el-button type="primary" @click="confirmAdd('addForm')" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 新建换油咨询工单   选择换油情况 -->
      <el-dialog title="请选择换油情况" class="closeWorkOrder" :visible="dialogOilChangeVisible" :show-close="false" width="30%">
        <el-form :model="ruleForm" :rules="closerules" ref="ruleForm" label-width="100px" label-position="top">
          <div class="radioGroup" style="border:1px solid #e9e9e9;border-bottom:none">
            <!-- 多选 -->
            <el-checkbox-group v-model="valueCheckBoxList" @change="selectId => changebox(selectId)" style="display: inline-block;">
              <el-checkbox style="height:50px;line-height:30px;" v-for="btn in oilChangefieldOption" :label="btn.type" :key="btn.type">{{ btn.desc }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="notice-text" v-if="resultBox">
            <img src="../../../assets/notice-icon.png" alt="" style="margin-right:8px;" />
            请预先咨询美孚工程师
          </div>
        </el-form>
        <div slot="footer" style="margin-top: 20px">
          <el-button type="danger" plain @click="consoleOilChange('ruleForm')" size="small">取消</el-button>
          <el-button type="danger" @click="confirmContiun('ruleForm')" size="small">确认继续</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { validateForms } from "../../../utils/index";
export default {
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 210}px`,
      screenWidth: null,
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7; // 如果当天可选，就不用减8.64e7
        }
      },
      valueCheckBoxList: [],
      dialogOilChangeVisible: false, // 选择换油情况弹框
      resultBox: false,
      typeList: [],
      userList: [],
      workshopList: [],
      servicePageType: "",
      pesId: "",
      addFormList: [],
      addForm: {
        serviceTypeNumber: "",
        number: 1
      },
      addFormRules: {
        serviceTypeNumber: [{ required: true, message: "请选择服务类型", trigger: "change" }],
        number: [{ required: true, message: "请输入数量", trigger: "blur" }]
      },
      addServiceFlag: false,
      // 已有服务项
      oldItemList: [],
      distributorCompanyType: "",
      queryCompanyNumber: "",
      addServiceKey: 0,
      userType: "",
      companyId: "",
      loadingCustomer: false,
      chargeUserList: [],
      createChargeUserList: [],
      existFormChargeUserList: {},
      pesFlag: "",
      serviceCompanyType: "",
      resource: "",
      customerProjectList: [], // 客户项目成员
      distributorCompanyId: "",
      userId: "",
      reportTypeSelect: "", // 选择的服务项所属 reportType
      oilChangefieldOption: [],
      addType: "add", // 判断是编辑还是新增的服务项
      editIndex: null // 编辑的未提交的服务项的下标
    };
  },
  created() {
    this.screenWidth = document.body.clientWidth;
    this.userType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).roleType;
    this.userId = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userId;
    this.servicePageType = this.$route.query.servicePageType;
    this.pesId = this.$route.query.pesId;
    this.pesFlag = this.$route.query.pesFlag;
    this.serviceCompanyType = this.$route.query.serviceCompanyType;
    this.distributorCompanyType = this.$route.query.distributorCompanyType;
    this.resource = this.$route.query.resource;
    this.distributorCompanyId = this.$route.query.distributorCompanyId;
    this.queryCompanyNumber = this.$route.query.companyNumber ? this.$route.query.companyNumber : JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber;
    this.companyId = this.$route.query.companyId ? this.$route.query.companyId : JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyId;
    this.getWorkshopList();
    this.getOldService();
    this.$_getServiceList();
    if (this.userType == 1) {
      this.getUserList();
    }
    this.$_getSTData(this.queryCompanyNumber);
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
      })();
    };
  },
  methods: {
    // 获取换油情况
    getOilChangeStatus() {
      this.requestMethodGet("/serviceReport/queryOilChangeStates")
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.oilChangefieldOption = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    changebox(val) {
      if (val.length) {
        if (val[val.length - 1] == "0") {
          this.valueCheckBoxList = ["0"];
        }
        if (val[val.length - 1] != "0") {
          // 有正常得选项
          let index = val.findIndex(it => it == "0");
          if (index > -1) {
            val.splice(index, 1);
            this.valueCheckBoxList = val;
          }
        }
      }
      if (val[val.length - 1] != "0") {
        // 有正常得选项
        let index = val.findIndex(it => it == "0");
        if (index > -1) {
          val.splice(index, 1);
          this.valueCheckBoxList = val;
          console.log(val);
        }
      }
      this.resultBox = this.valueCheckBoxList.find(item => {
        return item == 1 || item == 2 || item == 3 || item == 4;
      });
    },
    // 选择服务项触发事件
    handleSelectServiceType() {
      const checkedNode = this.$refs["cascaderAddr1"].getCheckedNodes();
      this.reportTypeSelect = checkedNode[0].data.reportType;
    },
    // 选择服务项触发事件
    handleSelectServiceType2(val, index) {
      if (val) {
        this.$nextTick(() => {
          const checkedData = this.$refs[`item+${index}`][0].panel.getNodeByValue(val);
          this.reportTypeSelect = checkedData.data.reportType;
          this.addType = "edit";
          this.valueCheckBoxList = [];
          if (checkedData.data.reportType == "11") {
            this.dialogOilChangeVisible = true;
            this.editIndex = index;
          } else {
            this.addFormList[index].oilChangeState = "";
          }
        });
      }
    },
    // 查询客户人员
    $_getSTData(companyNumber) {
      let params = {
        useFlag: 1,
        companyNumber,
        size: 300
      };
      if (this.userType == 1) {
        params.companyFlag = true;
      } else if (this.userType == 0) {
        params.currentUserIsMobil = true;
        params.distributorCompanyId = this.distributorCompanyId;
      }
      this.requestMethodGet("/web/system/permission/userManage/listByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const list = res.data.list;
            this.customerProjectList = list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询美孚项目成员
    getMobilUser(val, item) {
      const params = {
        workshopId: val,
        pesFlag: this.pesFlag,
        useStateFlag: 1,
        pesInfoId: this.pesId
      };
      this.requestMethodGet("/pes/report/queryMobilProjectUsers", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          item.mobilProjectUsersList = [];
          item.mobilProjectUsersList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 查询经销商项目成员
    queryDistributorProjectUsers(val, item) {
      const params = {
        workshopId: val,
        pesFlag: this.pesFlag,
        pesInfoId: this.pesId,
        useStateFlag: 1,
        customerCompanyId: this.companyId
      };
      this.requestMethodGet("/pes/report/queryDistributorProjectUsers", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          item.distributorProjectUsersList = [];
          item.distributorProjectUsersList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 查询车间
    getWorkshopList() {
      this.requestMethodGet("/pes/getPesWorkshop", { pesId: this.pesId }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.workshopList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 查询已有服务项
    getOldService() {
      this.requestMethodGet("/pes/package/queryServiceItemForEditList", { pesId: this.pesId }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          if (data.length) {
            data.forEach((it, index) => {
              let arr = [];
              let obj = {};
              obj.userId = it.customerUserId;
              obj.userName = it.customerUserName;
              obj.phonenumber = it.customerUserPhone;
              arr.push(obj);
              it.chargeUserId = it.chargeUserId.toString();
              it.formRef = "editForm" + index;
              it.formType = "edit";
              if (!_.isEmpty(it.mobilProjectUsers)) {
                it.mobilProjectUsers = it.mobilProjectUsers.split(",").map(Number);
              }
              if (!_.isEmpty(it.distributorProjectUsers)) {
                it.distributorProjectUsers = it.distributorProjectUsers.split(",").map(Number);
              }
              if (!_.isEmpty(it.customerProjectUsers)) {
                it.customerProjectUsers = it.customerProjectUsers.split(",").map(Number);
              }
              it.mobilProjectUsersList = [];
              it.distributorProjectUsersList = [];
              it._uid = Date.now() + index + 1;
              it.userList = arr;
              this.getUserList(it.customerCompanyNumber, it.workshopId);
              this.getMobilUser(it.workshopId, it);
              this.queryDistributorProjectUsers(it.workshopId, it);
            });
          }
          this.oldItemList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    clickWorkShopItem(item) {
      this.chargeUserList = [];
      this.getUserList(item.customerCompanyNumber, null, null, item.workshopId);
    },
    changeExistWorkShop(item) {
      console.log("this is item", item.workshopId);
      this.getUserList(item.customerCompanyNumber, item.workshopId);
    },
    // 车间改变
    workshopChange(val, item, type) {
      // 车间改变清空客户联系人并且重新查询该车间下的客户联系人
      this.$nextTick(() => {
        const list = item.formType == "add" ? this.addFormList : this.oldItemList;
        list.forEach(it => {
          if (it._uid == item._uid) {
            it.customerUserId = "";
            it.customerUserName = "";
            it.customerUserNumber = "";
            it.customerUserPhone = "";
            it.distributorProjectUsers = "";
            it.mobilProjectUsers = "";
            it.mobilProjectUsersList = [];
            it.customerProjectUsers = "";
          }
        });
        if (val != "") {
          this.getMobilUser(val, item);
          this.queryDistributorProjectUsers(val, item);
        } else {
          if (item.formType == "add") {
            this.userList = [];
          } else {
            const data = [...new Set(this.oldItemList)];
            data.forEach(it => {
              if (it._uid == item._uid) {
                it.userList = [];
              }
            });
            this.oldItemList = data;
          }
        }
      });
    },
    // 获取车间下的联系人
    getWorkshopUser(workshopId) {
      const params = {
        workshopId: workshopId,
        companyId: this.companyId,
        current: 1,
        size: 5000
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopCompanyUserListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.list;
          this.userList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 客户联系人
    customerVisible(val, item) {
      if (val) {
        this.$refs[item.formRef][0].validateField("workshopId", err => {
          if (!err) {
            if (item.formType == "edit") {
              this.loadingCustomer = true;
              const params = {
                workshopId: item.workshopId,
                companyId: this.companyId,
                current: 1,
                size: 5000
              };
              this.requestMethodGet("/weChat/workshop/queryWorkshopCompanyUserListByPage", params).then(res => {
                if (res.data.code == 1000) {
                  const list = res.data.data.list;
                  const editList = [...new Set(this.oldItemList)];
                  editList.forEach(it => {
                    if (it._uid == item._uid) {
                      it.userList = list;
                    }
                  });
                  this.loadingCustomer = false;
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "warning"
                  });
                }
              });
            }
          }
        });
      }
    },
    // 获取客户联系人
    getCustomerList() {
      let params = {
        companyNumber: this.queryCompanyNumber,
        size: 3000
      };
      this.requestMethodGet("/weChat/comp/customer/user/page", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.userList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取服务负责人数据
    getUserList(queryCompanyNumber, key, target, createWorkshopId) {
      const params = {
        useStateFlag: 1,
        distributorCompanyType: this.$route.query.daFlag ? 1 : 0,
        customerCompanyId: this.$route.query.companyId,
        distributorCompanyId: this.$route.query.distributorCompanyId,
        workshopId: key || createWorkshopId,
        customerCompanyNumber: this.userType == 1 ? this.queryCompanyNumber : queryCompanyNumber
      };
      this.requestMethodGet("/pes/package/queryServiceChargeUsers", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data;
          // 美孚
          if (this.userType == 0 && list.length) {
            list.forEach((item, index) => {
              item.userName = item.companyTypeName;
              item.userId = item.companyTypeName + "_" + index;
            });
          }
          if (this.userType == 1) {
            this.chargeUserList = list;
          } else {
            if (key) {
              this.$set(this.existFormChargeUserList, key, list);
            } else {
              this.createChargeUserList = list;
            }
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 提交
    submit() {
      let formRefs = [];
      this.addFormList.forEach(key => {
        formRefs.push(...this.$refs[key.formRef]);
      });
      // editForm
      if (this.servicePageType == "edit" && this.oldItemList.length) {
        this.oldItemList.forEach(item => {
          formRefs.push(...this.$refs[item.formRef]);
        });
      }
      validateForms(formRefs)
        .then(() => {
          let addFormList = JSON.parse(JSON.stringify(this.addFormList));
          let oldItemList = JSON.parse(JSON.stringify(this.oldItemList));
          addFormList.forEach((item, index) => {
            item.serviceNumber = item.serviceNumber[item.serviceNumber.length - 1];
            item.serviceName = this.$refs[`item+${index}`][0].panel.getNodeByValue(item.serviceNumber).label;
            if (this.userType == 0) {
              item.chargeUserId = item.chargeUserId[item.chargeUserId.length - 1];
            }
            if (!_.isEmpty(item.mobilProjectUsers) && _.isArray(item.mobilProjectUsers)) {
              item.mobilProjectUsers = item.mobilProjectUsers.toString();
            } else {
              item.mobilProjectUsers = "";
            }
            if (!_.isEmpty(item.distributorProjectUsers) && _.isArray(item.distributorProjectUsers)) {
              item.distributorProjectUsers = item.distributorProjectUsers.toString();
            } else {
              item.distributorProjectUsers = "";
            }
            if (!_.isEmpty(item.customerProjectUsers) && _.isArray(item.customerProjectUsers)) {
              item.customerProjectUsers = item.customerProjectUsers.toString();
            } else {
              item.customerProjectUsers = "";
            }
          });
          oldItemList.forEach(item => {
            if (this.userType == 0 && Array.isArray(item.chargeUserId)) {
              item.chargeUserId = item.chargeUserId[item.chargeUserId.length - 1];
            }
            if (!_.isEmpty(item.mobilProjectUsers) && _.isArray(item.mobilProjectUsers)) {
              item.mobilProjectUsers = item.mobilProjectUsers.toString();
            } else {
              item.mobilProjectUsers = "";
            }
            if (!_.isEmpty(item.distributorProjectUsers) && _.isArray(item.distributorProjectUsers)) {
              item.distributorProjectUsers = item.distributorProjectUsers.toString();
            } else {
              item.distributorProjectUsers = "";
            }
            if (!_.isEmpty(item.customerProjectUsers) && _.isArray(item.customerProjectUsers)) {
              item.customerProjectUsers = item.customerProjectUsers.toString();
            } else {
              item.customerProjectUsers = "";
            }
          });
          const params = {
            newItemDtoList: addFormList,
            oldItemDtoList: oldItemList,
            pesId: this.pesId
          };
          this.requestMethodPost("/pes/package/addUpdateServiceItem", params).then(res => {
            if (res.data.code == 1000) {
              // 调取消息未读数据
              this.$parent.msgCount();
              this.$message({
                message: "提交成功",
                type: "success"
              });
              if (this.resource == "plan") {
                let planData = JSON.parse(sessionStorage.getItem("plan" + this.userId + "y"));
                setTimeout(() => {
                  this.$router.push({
                    path: "/CustomerProfile/servicePlan",
                    query: {
                      false: true,
                      pesId: planData.pesId,
                      statusPlan: planData.statusPlan,
                      companyNumber: planData.companyNumber,
                      companyId: planData.companyId,
                      resource: "planY",
                      reportId: planData.reportId,
                      serviceCompanyType: planData.serviceCompanyType,
                      pesFlag: planData.pesFlag
                    }
                  });
                }, 100);
              } else {
                if (this.servicePageType == "add") {
                  this.$router.push({
                    path: "/CustomerProfile/CustomerPesIndex",
                    query: {
                      companyNumber: this.queryCompanyNumber,
                      companyId: this.companyId,
                      pesFlagCustomer: this.$route.query.pesFlagCustomer
                    }
                  });
                } else if (this.servicePageType == "edit") {
                  this.$router.push({
                    path: "/PESService/serviceDetail",
                    query: {
                      pesId: this.pesId,
                      pesFlagCustomer: this.$route.query.pesFlagCustomer
                    }
                  });
                } else {
                  this.$router.go(-1);
                }
              }
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 取消
    cancel() {
      if (this.resource == "plan") {
        let planData = JSON.parse(sessionStorage.getItem("plan" + this.userId + "y"));
        setTimeout(() => {
          this.$router.push({
            path: "/CustomerProfile/servicePlan",
            query: {
              false: true,
              pesId: planData.pesId,
              companyNumber: planData.companyNumber,
              companyId: planData.companyId,
              statusPlan: planData.statusPlan,
              resource: "planY",
              reportId: planData.reportId,
              serviceCompanyType: planData.serviceCompanyType,
              pesFlag: planData.pesFlag
            }
          });
        }, 100);
      } else {
        if (this.servicePageType == "add") {
          this.$router.push({
            path: "/CustomerProfile/CustomerPesIndex",
            query: {
              companyNumber: this.queryCompanyNumber,
              companyId: this.companyId,
              pesFlagCustomer: this.$route.query.pesFlagCustomer
            }
          });
        } else if (this.servicePageType == "edit") {
          this.$router.push({
            path: "/PESService/serviceDetail",
            query: {
              pesId: this.pesId,
              pesFlagCustomer: this.$route.query.pesFlagCustomer
            }
          });
        } else {
          this.$router.go(-1);
        }
      }
    },
    // 添加服务项
    addService() {
      this.addServiceFlag = true;
      ++this.addServiceKey;
    },
    // 数量变化
    handleNumberChange(val) {},
    // 取消新增
    cancelAdd(formName) {
      this.addServiceFlag = false;
      this.$refs[formName].resetFields();
    },
    // 确认继续
    confirmContiun() {
      // 如果是编辑的刚才新增但是未提交的
      if (this.addType == "edit") {
        if (this.reportTypeSelect == "11") {
          this.addFormList[this.editIndex].oilChangeState = this.valueCheckBoxList.toString();
        } else {
          this.addFormList[this.editIndex].oilChangeState = "";
        }
        this.dialogOilChangeVisible = false;
      } else {
        // 如果是新增服务项，继续新增的逻辑
        if (this.valueCheckBoxList.length > 0) {
          this.addService1();
        } else {
          this.$message({
            message: "请选择换油情况",
            type: "warning"
          });
        }
      }
    },
    // 新增服务型
    addService1() {
      for (let i = 0; i < this.addForm.number; i++) {
        let obj = {
          serviceNumber: this.addForm.serviceTypeNumber,
          planStartTime: "",
          chargeUserId: "",
          workshopId: "",
          customerUserId: "",
          distributorProjectUsers: "",
          mobilProjectUsers: "",
          mobilProjectUsersList: [],
          customerProjectUsers: ""
        };
        if (this.reportTypeSelect == "11") {
          obj.oilChangeState = this.valueCheckBoxList.toString();
        }
        obj.formType = "add";
        obj.formRef = "form" + i;
        obj._uid = Date.now() + i + 1;
        this.addFormList.unshift(obj);
      }
      this.cancelAdd("addForm");
      this.dialogOilChangeVisible = false;
    },
    // 确定新增
    confirmAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.reportTypeSelect == "11") {
            this.valueCheckBoxList = [];
            this.dialogOilChangeVisible = true;
            // 获取换油情况数据
            this.getOilChangeStatus();
          } else {
            this.addService1();
          }
        } else {
          return false;
        }
      });
    },
    // 删除新增数据
    deleteItem(item) {
      this.addFormList.forEach((it, index) => {
        if (it._uid == item._uid) {
          this.addFormList.splice(index, 1);
        }
      });
    },
    // 已有服务项取消
    cancelItem(item) {
      const params = {
        pesItemId: item.id
      };
      this.requestMethodPost("/pes/package/cancelPesItemCheck", params).then(res => {
        if (res.data.code == 1000) {
          if (!res.data.data) {
            this.$confirm("该服务项已关联计划工程服务计划书，如需删除，请先至计划书编辑页面取消关联！", "", {
              confirmButtonText: "知道了",
              showCancelButton: false,
              type: "warning"
            })
              .then(() => {})
              .catch(() => {});
          } else {
            this.oldItemList.forEach(it => {
              if (it.id == item.id) {
                it.status = 3;
              }
            });
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 已有服务项恢复
    recoveryItem(item) {
      this.oldItemList.forEach(it => {
        if (it.id == item.id) {
          it.status = 0;
        }
      });
    },
    // 取消选择换油情况
    consoleOilChange() {
      this.dialogOilChangeVisible = false;
    },
    // 服务类型
    $_getServiceList(val) {
      this.typeList = [];
      this.loadingInput = true;
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTree", { serviceName: val || "" })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.typeList = res.data;
            this.typeList = this.formatData(this.typeList);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          data[i].children = undefined;
        } else {
          this.formatData(data[i].children);
        }
      }
      return data;
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 210}px`;
    }
  }
};
</script>
<style lang="less" scoped>
.add-customer-profile {
  padding: 20px;
  overflow: auto;
}
.closeWorkOrder .el-checkbox {
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #e4e7ed;
  margin-right: 0;
}
.el-dialog__header {
  padding: 20px 20px 10px;
}
.el-checkbox__label {
  display: inline-grid;
  white-space: pre-line;
  word-wrap: break-word;
  overflow: hidden;
  line-height: 20px;
}
/deep/ .radioGroup {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #666;
  .el-radio-button__inner {
    height: 28px;
    line-height: 28px;
    padding: 0px 16px;
    border: 1px solid #e9e9e9;
  }
  .el-radio-button:last-child .el-radio-button__inner {
    border-radius: 4px;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    color: #f9f9f9;
    background-color: #001450;
    border-color: #001450;
    -webkit-box-shadow: -1px 0 0 0 #001450;
    box-shadow: -1px 0 0 0 #001450;
  }
  .el-radio-button__inner:hover {
    color: #001450;
    border: 1px solid #001450;
  }
}
.notice-text {
  font-size: 12px;
  line-height: 12px;
  margin: 20px 0 10px;
  color: #ff9900;
  display: flex;
  align-items: center;
}
.add-title {
  font-size: 14px;
  font-weight: bold;
  color: #000;
}
.service-form {
  border: 1px solid #e9e9e9;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 20px;
}
</style>
