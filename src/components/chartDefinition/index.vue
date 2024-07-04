<template>
  <div class="chart-profile" :style="mainMinHeight">
    <el-row :gutter="20">
      <el-col :span="6" style="background:#fff;">
        <!-- 左侧自定义项 -->
        <div :style="{ height: contentHeight + 'px' }" style="overflow: auto;">
          <el-form style="margin:20px 0 20px 0" :validate-on-rule-change="false" ref="form" :model="chartForm" :rules="rules" label-width="180px" label-position="top">
            <el-form-item label="图表名称：" prop="chartName">
              <el-input style="width:95%" size="small" clearable v-model="chartForm.chartName" placeholder="请输入20字以内的名称" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="区域：" v-if="userType == 0" prop="areaCodeList">
              <el-select style="width:95%" v-model="chartForm.areaCodeList" @change="getDistributorList" size="small" clearable multiple collapse-tags placeholder="请选择">
                <el-option v-for="item in areaList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="userType == 0 ? '经销商：' : '客户：'" v-if="userType != 2" prop="companyNumberList">
              <el-select
                v-model="chartForm.companyNumberList"
                @change="companyChange"
                @visible-change="visibleChange"
                size="small"
                clearable
                multiple
                collapse-tags
                filterable
                placeholder="请选择"
                style="width:95%"
              >
                <!-- <el-option label="全部" value="all" v-if="distributorList.length>0"></el-option> -->
                <el-option v-for="item in distributorList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行业：" prop="industryDataAll">
              <el-cascader
                ref="cascader"
                style="width:95%"
                v-model="chartForm.industryDataAll"
                size="small"
                :checkStrictly="true"
                filterable
                placeholder="请输入关键词(多选)"
                :options="industryData"
                :props="typeProps"
                collapse-tags
                @change="handleIndustryChange"
                :show-all-levels="false"
                clearable
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="客户组：" prop="" v-if="haveCustomerGroupPerms">
              <el-select v-model="chartForm.customerGroupIdList" @change="customerGroupChange" size="small" clearable multiple collapse-tags filterable placeholder="请选择" style="width:95%">
                <el-option label="全部" value="selectAll" v-if="customerGroupList.length > 0"></el-option>
                <el-option v-for="item in customerGroupList" :key="item.id" :label="item.groupName" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间：" prop="monthData">
              <el-date-picker
                style="width:95%"
                size="small"
                clearable
                v-model="chartForm.monthData"
                type="monthrange"
                value-format="yyyy-MM"
                @change="monthChange"
                :picker-options="pickerOptions"
                :default-time="['08:00:00', '08:00:00']"
                range-separator="至"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="维度：" prop="indicatorCodeList">
              <el-select style="width:95%" v-model="chartForm.indicatorCodeList" @change="getDimensionList" size="small" clearable multiple collapse-tags placeholder="请选择">
                <el-option v-for="item in indexList" :key="item.indicatorCode" :label="item.indicatorName" :value="item.indicatorCode"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="指标：" prop="dimensionCodeList">
              <el-select style="width:95%" v-model="chartForm.dimensionCodeList" @visible-change="dimensionVisibleChange" size="small" clearable multiple collapse-tags placeholder="请选择">
                <el-option v-for="item in dimensionList" :key="item.dimensionCode" :label="item.dimensionName" :value="item.dimensionCode"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="serviceNumberListAll" v-show="iconClass == 'el-icon-arrow-up'">
              <div slot="label" style="display:flex;align-items:center;margin-top: -30px;margin-left: 5px;">
                <!-- <span style="color:red">*</span> -->
                <span><span style="margin-left:5px">核心服务配置：</span></span>
                <el-popover placement="top" title="" width="200" trigger="click" content="配置核心服务，统计做过核心服务的设备与工单">
                  <i slot="reference" class="el-icon-info"></i>
                </el-popover>
                <span
                  >（已选<span style="color:red">{{ checkedNum }}</span
                  >个）</span
                >
              </div>
              <el-cascader
                ref="cascader"
                style="width:95%"
                v-model="chartForm.serviceNumberListAll"
                size="small"
                :checkStrictly="true"
                filterable
                placeholder="请选择"
                @change="serviceConfigChange"
                :options="serviceConfigList"
                :props="props"
                collapse-tags
                :show-all-levels="false"
                clearable
              >
              </el-cascader>
            </el-form-item>
            <el-form-item>
              <div @click="clickMore" style="display: flex;align-items: center;justify-content: center;cursor: pointer;">
                <i :class="iconClass"></i>
                {{ iconClass == "el-icon-arrow-down" ? "查看更多" : "收起" }}
              </div>
            </el-form-item>
          </el-form>
          <!-- 生成图表 -->
          <div>
            <el-button type="primary" size="small" @click="createChart('form')">生成图表</el-button>
          </div>
        </div>
      </el-col>

      <el-col :span="18">
        <div
          id="rightContent"
          v-show="showNoData"
          style="background:#fff;font-size:16px;font-weight:bold;display: flex;align-items: center;justify-content: center;color: #ccc;"
          :style="{ height: contentHeight + 'px' }"
        >
          暂无图表
        </div>
        <div id="tabsId" v-show="!showNoData">
          <div style="position: absolute;right: 20px;top: 5px;z-index:999">
            <el-button type="primary" size="small" :disabled="!(tableData.length > 0)" @click="exportExcel">导出</el-button>
          </div>
          <el-tabs v-model="activeName" style="background:#fff;">
            <!-- 维度表 -->
            <el-tab-pane label="维度表" name="dimension">
              <div style="padding:0 20px 20px 20px">
                <!-- 图表 -->
                <div :style="{ height: contentHeight - 85 + 'px' }" style="margin-top:10px">
                  <Charts
                    :industryList="industryList"
                    :serviceTypeList="serviceTypeList"
                    :isAll="isAll"
                    :dimensionCodeList="chartForm.dimensionCodeList"
                    :userType="userType"
                    :chartParams="chartParams"
                    :chartKey="chartKey"
                    :contentHeight="contentHeight - 85"
                    :selectUserTypeList="selectUserTypeList"
                    :chartsWidth="chartsWidth"
                    :areaList="selectedAreaList"
                    :dateSelectList="dateSelectList"
                    :dateSelectListMonth="dateSelectListMonth"
                  />
                </div>
              </div>
            </el-tab-pane>
            <!-- 明细表 -->
            <el-tab-pane label="明细表" name="schedule">
              <div style="padding:0 20px 20px 20px">
                <div v-if="isTotalTable || addTotalTable">
                  <!-- 表名 -->
                  <div style="">{{ tableName }}</div>
                  <!-- 表格 -->
                  <div :style="{ height: contentHeight - 150 + 'px' }" style="margin-top:10px">
                    <userTable
                      :isTotalTableFlag="isTotalTable"
                      :tableHeight="contentHeight - 150"
                      :tableData="tableData"
                      :monthList="monthList"
                      :userType="userType"
                      :showCustomerNum="showCustomerNum"
                      :showDeviceNum="showDeviceNum"
                      :showUserNum="showUserNum"
                      :showPesNum="showPesNum"
                      :showCustomNum="showCustomNum"
                      :showWorkOrderNum="showWorkOrderNum"
                    />
                  </div>
                </div>
                <div v-if="isAddEqTable || isAddWorkOrderTable || isAddUserTable || isAddCustomerTable">
                  <!-- 表格 -->
                  <div :style="{ height: contentHeight - 150 + 'px' }" style="margin-top:10px">
                    <sheetTable
                      :isTotalTableFlag="isTotalTable"
                      :addTotalTable="addTotalTable"
                      :tableHeight="contentHeight - 150"
                      :tableEqData="tableEqData"
                      :tableWorkOrderData="tableWorkOrderData"
                      :tableUserData="tableUserData"
                      :tableCustomerData="tableCustomerData"
                      :monthList="monthList"
                      :isAddWorkOrderTable="isAddWorkOrderTable"
                      :isAddUserTable="isAddUserTable"
                      :isAddCustomerTable="isAddCustomerTable"
                      :isAddEqTable="isAddEqTable"
                      :userType="userType"
                      :showCustomerNum="showCustomerNum"
                      :showDeviceNum="showDeviceNum"
                      :showUserNum="showUserNum"
                      :showPesNum="showPesNum"
                      :showCustomNum="showCustomNum"
                      :showWorkOrderNum="showWorkOrderNum"
                    />
                  </div>
                </div>
                <el-pagination
                  style="bottom:64px;"
                  v-if="totalNumber && (isAddEqTable || isAddWorkOrderTable || isAddUserTable || isAddCustomerTable)"
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pagenation.current"
                  :page-size="pagenation.size"
                  :page-sizes="[10, 20, 30, 50]"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="totalNumber"
                ></el-pagination>
                <!-- 按钮 -->
                <div style="margin-top:45px">
                  <el-button size="small" :type="isTotalTable ? 'danger' : ''" plain @click="totalDetail">总量明细</el-button>

                  <el-button size="small" :type="addTotalTable ? 'danger' : ''" plain @click="incrementalDetail">增量明细</el-button>
                  <el-button size="small" v-if="showDeviceNum" :type="isAddEqTable ? 'danger' : ''" plain @click="addEqDetail">设备明细（新增）</el-button>
                  <el-button size="small" v-if="showWorkOrderNum" :type="isAddWorkOrderTable ? 'danger' : ''" plain @click="addWorkOrderDetail">工单明细（新增）</el-button>
                  <el-button size="small" v-if="showCustomerNum" :type="isAddUserTable ? 'danger' : ''" plain @click="addUserDetail">客户用户明细</el-button>
                  <el-button size="small" v-if="showCustomerNum" :type="isAddCustomerTable ? 'danger' : ''" plain @click="addCustomerDetail">客户明细（累计）</el-button>
                </div>

                <!-- <div style="margin-top:15px">
                    <el-button type="primary" size="small" :disabled="!(tableData.length>0)" @click="exportExcel">导出</el-button>
                  </div> -->
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userTable from "./components/userTable";
import sheetTable from "./components/sheetTable";
import Charts from "./components/charts";
const checkSpecialCharacters = (rule, value, cb) => {
  const checkFlag = value.includes("/");
  if (checkFlag) return cb(new Error("输入不允许包含“/”"));
  cb();
};
export default {
  components: { userTable, Charts, sheetTable },
  data() {
    return {
      mainMinHeight: `height:${document.documentElement.clientHeight - 120}px`,
      contentHeight: `${document.documentElement.clientHeight - 160}`,
      pickerOptions: {
        onPick: ({ minDate, maxDate }) => {},
        // 日期限制
        disabledDate: time => {
          const dd = new Date();
          const y = dd.getFullYear().toString();
          const m = dd.getMonth() + 1 >= 10 ? dd.getMonth() + 1 : "0" + (dd.getMonth() + 1);
          const str = y + "-" + m;
          // 设置日期范围
          const minDate = new Date("2020-06");
          const maxDate = new Date(str);
          var flag = false;
          flag = time > maxDate || time < minDate;
          return flag;
        }
      },
      chartsWidth: "",
      chartForm: {
        chartName: "",
        areaCodeList: [],
        companyNumberList: [],
        monthData: "",
        indicatorCodeList: [],
        dimensionCodeList: [],
        serviceNumberListAll: [],
        industryDataAll: [],
        customerGroupIdList: []
      },
      rules: {
        chartName: [{ required: true, message: "请输入图表名称", trigger: "blur" }, { validator: checkSpecialCharacters, trigger: "blur" }],
        areaCodeList: [{ required: true, message: "请选择区域", trigger: "change" }],
        companyNumberList: [{ required: true, message: "请选择经销商", trigger: "change" }],
        monthData: [{ required: true, message: "请选择时间", trigger: "change" }],
        indicatorCodeList: [{ required: true, message: "请选择指标", trigger: "change" }],
        dimensionCodeList: [{ required: true, message: "请选择维度", trigger: "change" }],
        serviceNumberListAll: [{ required: true, message: "请选择核心服务配置", trigger: "change" }]
      },
      areaList: [],
      typeProps: {
        multiple: true,
        value: "code",
        label: "name"
      },
      selectedAreaList: [],
      distributorList: [],
      indexList: [],
      dimensionList: [],
      serviceConfigList: [],
      industryData: [], // 行业数据
      preSelected: [], // 行业上次选中的数据
      originData: [], //  行业源数据平铺成一级节点
      props: { multiple: true, value: "serviceNumber", label: "serviceName" },
      userType: "",
      activeName: "dimension",
      tableData: [],
      tableEqData: [],
      tableWorkOrderData: [],
      tableUserData: [], // 客户用户明细（累计）
      tableCustomerData: [], // 客户明细
      monthList: [],
      selectUserTypeList: [], // 用户角色下拉数据源
      dateSelectList: [],
      dateSelectListMonth: [],
      checkedNum: 0,
      tableName: "",
      addData: {}, // 增量明细
      totalData: {}, // 总量明细
      addNewData: {}, // 新增明细
      showCustomerNum: false,
      showDeviceNum: false,
      showUserNum: false,
      showPesNum: false,
      showCustomNum: false,
      showWorkOrderNum: false,
      showNoData: true,
      oldOptions: [],
      chartParams: {},
      chartKey: 1,
      isTotalTable: true,
      addTotalTable: false, // 增量明细
      isAddEqTable: false, // 新增设备明细
      isAddWorkOrderTable: false, // 新增设备明细
      isAddUserTable: false, // 新增客户用户表
      isAddCustomerTable: false, // 新增客户表
      totalNumber: 0,
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      tableCode: "",
      iconClass: "el-icon-arrow-down",
      industryList: [],
      serviceTypeList: [],
      isAll: false,
      haveCustomerGroupPerms: false,
      customerGroupList: [], // 客户组下拉列表
      customerGroupOldId: [] // 上一次选中的客户组Id集合
    };
  },
  mounted() {
    this.chartsWidth = document.getElementById("rightContent").offsetWidth - 80;
  },
  created() {
    this.userType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).userType;
    // 查询已配置的核心服务
    this.getUserServiceConf();
    if (this.userType != "2") {
      // 查询客户下拉
      this.getDistributorList();
    }
    // 获取区域下拉
    this.getAreaList();
    // 指标下拉
    this.getIndexList();
    // 核心服务配置下拉
    this.getServiceConfigList();
    // 行业下拉数据
    this.getIndustryList();
    // 服务类型下拉数据
    this.getServiceTypeList();
    // 行业下拉数据
    this.$_getIndustryData();
    // 判断客户组权限
    let menuList = JSON.parse(sessionStorage.getItem("menuList"));
    let customerwebInfo = menuList.find(item => item.menuCode == "customer_web");
    if (customerwebInfo) {
      let customerGroupIndex = customerwebInfo.children.findIndex(indexItem => indexItem.menuCode == "CustomerGroup");
      if (customerGroupIndex != -1) {
        this.haveCustomerGroupPerms = true;
        // 获取客户组列表
        this.getCustomerGroupList();
      }
    }
  },
  methods: {
    getServiceTypeList() {
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTreeIncludeStatusNo", { serviceName: "" })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data;
            if (data && data.length > 0) {
              data.forEach(it => {
                const obj = {
                  id: "",
                  children: null,
                  serviceLevel: 2,
                  serviceName: "全部",
                  serviceNumber: ""
                };
                it.children.unshift(obj);
                it.children.forEach(item => {
                  item.children = null;
                });
              });
            }
            const obj = {
              children: [
                {
                  id: "",
                  children: null,
                  serviceLevel: 2,
                  serviceName: "全部",
                  serviceNumber: ""
                }
              ],
              id: "",
              serviceLevel: 1,
              serviceName: "全部一级服务类型",
              serviceNumber: ""
            };
            data.unshift(obj);
            this.serviceTypeList = data;
          } else {
            this.$message({
              message: res.msg,
              type: "error"
            });
          }
        })
        .catch(res => {});
    },
    getIndustryList() {
      this.requestMethodGet("/web/customer/getIndustryTreeList", { parentCode: "company_industry", allStatusFlag: true })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data;
            if (data && data.length) {
              data.forEach(item => {
                item.children = null;
              });
            }
            const obj = {
              code: "",
              level: "1",
              name: "全部一级行业",
              parentCode: "company_industry",
              sort: "1",
              state: "1"
            };
            data.unshift(obj);
            this.industryList = data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    clickMore() {
      if (this.iconClass == "el-icon-arrow-down") {
        this.iconClass = "el-icon-arrow-up";
      } else {
        this.iconClass = "el-icon-arrow-down";
      }
    },

    getUserServiceConf() {
      this.requestMethodGet("/report/getUserServiceConf", {}).then(res => {
        if (res.data.code == 1000) {
          let list = [];
          let data = res.data.data;
          if (data && data.length > 0) {
            data.forEach(item => {
              let arr = [];
              arr.push(item.confLv1Number);
              arr.push(item.confLv2Number);
              arr.push(item.confLv3Number);
              list.push(arr);
            });
            this.checkedNum = list.length;
            this.chartForm.serviceNumberListAll = list;
          } else {
            this.iconClass = "el-icon-arrow-up";
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getAreaList() {
      this.requestMethodGet("/report/getAreaList", {}).then(res => {
        if (res.data.code == 1000) {
          this.areaList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 经销商下拉
    visibleChange(val) {
      // if(val){
      //   if(this.chartForm.areaCodeList == ''){
      //     this.$message({
      //       type:'warning',
      //       message:'请选择区域'
      //     })
      //   }
      // }
    },
    companyChange(valArr) {
      this.chartForm.indicatorCodeList = [];
      this.chartForm.dimensionCodeList = [];
      const allIdArr = [];
      // 保存全部选项的id
      for (const item of this.distributorList) {
        allIdArr.push(item.companyNumber);
      }
      const oldVal = this.oldOptions.length === 1 ? this.oldOptions[0] : [];
      // 当前选中的有'全选'   this.chartForm.companyNumberList
      if (valArr.includes("allSelect")) {
        this.chartForm.companyNumberList = allIdArr;
      }
      // 旧数据包含'全选'，当前选中数据不包含全选
      if (oldVal.includes("allSelect") && !valArr.includes("allSelect")) {
        this.chartForm.companyNumberList = [];
      }
      // 旧数据包含'全选'，当前选中数据包含全选
      if (oldVal.includes("allSelect") && valArr.includes("allSelect")) {
        const index = valArr.indexOf("allSelect");
        valArr.splice(index, 1); // 排除全选选项
        this.chartForm.companyNumberList = valArr;
      }
      // 旧数据不包含'全选'，当前选中数据不包含'全选'
      if (!oldVal.includes("allSelect") && !valArr.includes("allSelect")) {
        // 除了全选外 其余所有选中时
        if (valArr.length === allIdArr.length - 1) {
          this.chartForm.companyNumberList = ["allSelect"].concat(valArr);
        }
      }
      // 数据发生变化时保存数据，做为下次对比的旧数据
      this.oldOptions[0] = this.chartForm.companyNumberList;
    },
    getDistributorList() {
      // 区域改变拼装右侧图标区域下拉数据
      let arr = [];
      if (this.userType == "0") {
        this.chartForm.companyNumberList = [];
        this.chartForm.indicatorCodeList = [];
        this.chartForm.dimensionCodeList = [];
        const str = this.chartForm.areaCodeList.toString();
        this.areaList.forEach(item => {
          if (str.indexOf(item.code) > -1) {
            arr.push(item);
          }
        });
        // 选中的区域
        this.selectedAreaList = [{ name: "已选全部区域", code: "" }].concat(arr);
      }
      const params = {
        areaCode: this.userType == "0" ? this.chartForm.areaCodeList.toString() : "",
        size:300,
        menuCode:'DealerProfile'
      };
      params.status = 1;
      this.requestMethodPostTip("/web/company/filterSp", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.list;
          let obj = [
            {
              companyName: "全部",
              companyNumber: "allSelect"
            }
          ];
          this.distributorList = obj.concat(data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getIndexList() {
      this.requestMethodGet("/report/getIndicatorAndDimension", { indicatorCode: "" }).then(res => {
        if (res.data.code == 1000) {
          this.indexList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 维度打开
    dimensionVisibleChange(val) {
      // if(val){
      //   if(this.chartForm.indicatorCodeList == ''){
      //     this.$message({
      //       type:'warning',
      //       message:'请选择指标'
      //     })
      //   }
      // }
    },
    // 维度
    getDimensionList(val) {
      this.chartForm.dimensionCodeList = [];
      const params = {
        indicatorCode: this.chartForm.indicatorCodeList.toString()
      };
      this.requestMethodGet("/report/getIndicatorAndDimension", params).then(res => {
        if (res.data.code == 1000) {
          this.dimensionList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 日期改变
    monthChange(val) {
      this.chartForm.indicatorCodeList = [];
      this.chartForm.dimensionCodeList = [];
      if (!val) {
        return;
      }
      // 计算差了几个月
      let dateList = [];
      let dateListMonth = [];
      // 计算两个月份之间相差的月份
      var date1 = val[0];
      var date2 = val[1];
      // 拆分年月日
      date1 = date1.split("-");
      // 得到月数
      date1 = parseInt(date1[0]) * 12 + parseInt(date1[1]);
      // 拆分年月日
      date2 = date2.split("-");
      // 得到月数
      date2 = parseInt(date2[0]) * 12 + parseInt(date2[1]);
      const num = Math.abs(date1 - date2) + 1;
      let minY = Math.abs(val[0].split("-")[0]);
      let minM = Math.abs(val[0].split("-")[1]);
      for (let i = 0; i < num; i++) {
        let strY = minY;
        let strM = minM;
        strY = minM + i > 12 ? strY + 1 : strY;
        strM = minM + i > 12 ? Math.abs(12 - (minM + i)) : minM + i;
        const m = strM > 9 ? strM.toString() : "0" + strM.toString();
        const str = strY.toString() + "-" + m;
        let obj = {};
        obj.value = str;
        obj.label = str;
        dateList.push(obj);
        dateListMonth.push(obj);
      }
      const headObj = {
        value: "",
        label: "已选全部时间"
      };
      const headObj1 = {
        value: "0",
        label: "历史总数"
      };
      dateList.unshift(headObj1);
      dateList.unshift(headObj);
      dateListMonth.unshift(headObj1);
      this.dateSelectList = dateList;
      this.dateSelectListMonth = dateListMonth;
    },
    // 获取核心服务配置
    getServiceConfigList() {
      this.requestMethodGet("/web/config/serviceConfiguration/getServiceConfTreeIncludeStatusNo", { serviceName: "" }).then(res => {
        if (res.data.code == 1000) {
          this.serviceConfigList = this.formatData(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 服务配置改变
    serviceConfigChange() {
      const checkedArr = this.$refs["cascader"].getCheckedNodes();
      let sum = 0;
      if (checkedArr.length) {
        checkedArr.forEach(item => {
          if (item.level > 2) {
            sum = sum + 1;
          }
        });
      }
      this.checkedNum = sum;
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
    // 获取行业列表
    $_getIndustryData() {
      let params = {
        parentCode: "company_industry",
        allStatusFlag: true
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.industryData = res.data;
              this.industryData.unshift({ code: "全选", name: "全选" });
              this.industryData.map(res => {
                if (!res.children && res.name != "全选") {
                  res.disabled = true;
                }
              });
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
    // 行业的change事件
    handleIndustryChange(node = []) {
      this.chartForm.industryDataAll = []; // 绑定的结果首先置空
      let list = this.industryData; // 复制列表出来
      let current = []; // 获取当前选中的option
      if (node.length >= this.preSelected.length) {
        let keys = this.preSelected.map(item => JSON.stringify(item));
        current = node.filter(item => !keys.includes(JSON.stringify(item)));
      } else {
        // 取消选中
        let keys = node.map(item => JSON.stringify(item));
        current = this.preSelected.filter(item => !keys.includes(JSON.stringify(item)));
      }
      const currentValue = current.length > 0 ? current[0][0] || "" : "";
      if (currentValue === "全选") {
        if (this.judgetAllSelected(node)) {
          this.loopSelectData(list);
        } else {
          this.chartForm.industryDataAll = [];
        }
      } else {
        this.chartForm.industryDataAll = node;
      }
      this.checkIsAddAllSelected(); // 主要是勾选或取消非“全选”项时，对于全选的逻辑处理
      this.preSelected = this.chartForm.industryDataAll; // 保存上一次的选择结果
      this.changeHandle();
    },
    // 判断是否点击了全选按钮
    judgetAllSelected(node) {
      // 判断是否是全选,也就是看已选择的选中中包不包含"全选"
      let isAllSelected = false;
      for (let i = 0; i < node.length; i++) {
        if (node[i][0] === "全选") {
          isAllSelected = true;
          break;
        }
      }
      return isAllSelected;
    },
    loopSelectData(list, parentNode = []) {
      list.length > 0 &&
        list.forEach(e => {
          let pNode = [...parentNode]; // 注意这里必须是深拷贝，否则会由于引用类型赋值的是地址（指针），导致parentNode在pNode更新时，同时被更新
          if (e.children && e.children.length > 0) {
            pNode.push(e.code); // 1 11
            this.loopSelectData(e.children, pNode);
          } else {
            if (parentNode.length > 0) {
              this.chartForm.industryDataAll.push([...parentNode, e.code]);
            } else {
              this.chartForm.industryDataAll.push([e.code]);
            }
          }
        });
    },
    checkIsAddAllSelected(isEdit = false) {
      let list = this.industryData; // 原始数据列表
      if (this.originData.length === 0) {
        this.loopFlatData(list); // 把所有的父子级平铺成一个一级列表
      }
      let origin = this.originData;
      let now = [...this.chartForm.industryDataAll].filter(item => item[0] !== "全选");
      if (origin.length > now.length + 1) {
        // 非全选时, 如果有之前选过全选,要把全选过滤掉
        this.chartForm.industryDataAll = this.chartForm.industryDataAll.filter(item => item[0] !== "全选");
      } else {
        // 当所有的数据都选择时, 要自动把全选勾选上
        if (this.chartForm.industryDataAll[0] && this.chartForm.industryDataAll[0][0] !== "全选") {
          this.chartForm.industryDataAll = [["全选"], ...this.chartForm.industryDataAll];
        }
      }
      if (isEdit) {
        this.preSelected = this.chartForm.industryDataAll;
      }
    },
    loopFlatData(list = [], parentNode = []) {
      list.length > 0 &&
        list.forEach(e => {
          let pNode = [...parentNode]; // 注意这里必须是深拷贝，否则会由于引用类型赋值的是地址（指针），导致parentNode在pNode更新时，同时被更新
          if (e.children && e.children.length > 0) {
            pNode.push(e.code); // 1 11
            this.loopFlatData(e.children, pNode);
          } else {
            if (e.label !== "全选") {
              if (parentNode.length > 0) {
                pNode.push(e.code);
                this.originData.push({ ...e, parentNode: pNode });
              } else {
                this.originData.push(e);
              }
            }
          }
        });
    },
    changeHandle() {
      // 这里是处理成自己需要的数据格式, 需要把全选的这一选项过滤掉
      let list = JSON.parse(JSON.stringify(this.chartForm.industryDataAll)).filter(item => item[0] != "全选");
      let arr = list.map(item => {
        return item[1];
      });
      let stringList = arr.toString();
    },
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.createTable();
    },
    // current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.createTable();
    },
    // 生成表格
    createTable() {
      let param = this.chartParams;
      param.tableCode = this.tableCode;
      param.current = this.pagenation.current;
      param.size = this.pagenation.size;
      this.requestMethodPost("/report/getReportDetailTable", param).then(res => {
        if (res.data.code == 1000) {
          if (res.data.data.deviceDetailNewList) {
            this.tableEqData = res.data.data.deviceDetailNewList.list;
            this.totalNumber = res.data.data.deviceDetailNewList.totalCount;
          }
          if (res.data.data.workOrderDetailNewList) {
            this.tableWorkOrderData = res.data.data.workOrderDetailNewList.list;
            this.totalNumber = res.data.data.workOrderDetailNewList.totalCount;
          }
          if (res.data.data.customerUserDetailList) {
            this.tableUserData = res.data.data.customerUserDetailList.list;
            this.totalNumber = res.data.data.customerUserDetailList.totalCount;
          }
          if (res.data.data.customerDetailList) {
            this.tableCustomerData = res.data.data.customerDetailList.list;
            this.totalNumber = res.data.data.customerDetailList.totalCount;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 生成图表
    createChart(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 右侧图表用户指标角色下拉
          const companyCodeStr = this.chartForm.companyNumberList.toString();
          let hasMobil = false;
          let typeArr = [];
          this.selectUserTypeList = [];
          this.distributorList.forEach(item => {
            if (companyCodeStr.indexOf(item.companyNumber) > -1) {
              typeArr.push(item.companyType);
            }
          });
          if (typeArr.length) {
            typeArr.forEach(it => {
              if (it == "0") {
                hasMobil = true;
              }
            });
          }
          if (this.userType == 0) {
            // 美孚
            if (hasMobil && this.chartForm.companyNumberList.length > 1) {
              this.selectUserTypeList = [
                {
                  value: "",
                  label: "全部"
                },
                {
                  value: "0",
                  label: "美孚"
                },
                {
                  value: "1",
                  label: "经销商"
                },
                {
                  value: "2",
                  label: "客户"
                }
              ];
            } else if (hasMobil && this.chartForm.companyNumberList.length == 1) {
              this.selectUserTypeList = [
                {
                  value: "",
                  label: "全部"
                },
                {
                  value: "0",
                  label: "美孚"
                },
                {
                  value: "2",
                  label: "客户"
                }
              ];
            } else {
              this.selectUserTypeList = [
                {
                  value: "",
                  label: "全部"
                },
                {
                  value: "1",
                  label: "经销商"
                },
                {
                  value: "2",
                  label: "客户"
                }
              ];
            }
          }
          this.isAll = true;
          const params = this.chartForm;
          params.startDateStr = this.chartForm.monthData[0];
          params.endDateStr = this.chartForm.monthData[1];
          // 指标
          this.showCustomerNum = params.indicatorCodeList.includes("indicator_code1"); // 客户数
          this.showDeviceNum = params.indicatorCodeList.includes("indicator_code2"); // 设备数
          this.showUserNum = params.indicatorCodeList.includes("indicator_code4"); // 工单数
          this.showWorkOrderNum = params.indicatorCodeList.includes("indicator_code3"); // 工单数
          this.showPesNum = params.indicatorCodeList.includes("indicator_code1"); // 客户数
          this.showCustomNum = params.indicatorCodeList.includes("indicator_code4"); // 客户数
          // 核心服务配置
          const list = [];
          this.chartForm.serviceNumberListAll.forEach(item => {
            list.push(item[item.length - 1]);
          });
          // 行业数据
          const industryList = [];
          this.chartForm.industryDataAll.forEach(item => {
            industryList.push(item[item.length - 1]);
          });
          const indexAll = industryList.filter(it => {
            return it != "全选";
          });
          params.industryCodeFilterList = indexAll;
          params.serviceNumberList = list;
          // 经销商，客户是否选中全部
          if (params.companyNumberList.includes("allSelect")) {
            // 选中了全部，剔除全部的code
            params.companyNumberList.splice(params.companyNumberList.indexOf("allSelect"), 1);
          }
          // 客户组是否选中全部
          if (params.customerGroupIdList.includes("selectAll")) {
            // 选中了全部，剔除全部的code
            params.customerGroupIdList.splice(params.customerGroupIdList.indexOf("selectAll"), 1);
          }
          this.chartParams = params;
          console.log(this.chartParams, "参数");
          // 生成表格
          this.requestMethodPost("/report/getReportTotalTable", params).then(res => {
            if (res.data.code == 1000) {
              ++this.chartKey;
              // 表格名称
              this.tableName = this.chartForm.chartName;
              this.addData = res.data.data.addData;
              this.totalData = res.data.data.totalData;
              this.showNoData = false;
              this.isTotalTable = true;
              this.isAddEqTable = false;
              this.isAddWorkOrderTable = false;
              this.isAddUserTable = false;
              this.isAddCustomerTable = false;
              this.tableData = this.totalData.titleDataList;
              this.monthList = this.totalData.monthList;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          this.iconClass = "el-icon-arrow-up";
          return false;
        }
      });
    },
    // 总量明细
    totalDetail() {
      this.isTotalTable = true;
      this.isAddEqTable = false;
      this.addTotalTable = false;
      this.isAddWorkOrderTable = false;
      this.isAddUserTable = false;
      this.isAddCustomerTable = false;
      this.tableData = this.totalData.titleDataList;
      this.monthList = this.totalData.monthList;
    },
    // 新增设备明细
    addEqDetail() {
      this.tableCode = "table_device_add";
      this.pagenation.current = 1;
      this.createTable();
      this.isAddEqTable = true;
      this.addTotalTable = false;
      this.isTotalTable = false;
      this.isAddWorkOrderTable = false;
      this.isAddUserTable = false;
      this.isAddCustomerTable = false;
    },
    // 新增工单明细
    addWorkOrderDetail() {
      this.tableCode = "table_work_order_add";
      this.pagenation.current = 1;
      this.createTable();
      this.isAddWorkOrderTable = true;
      this.isAddUserTable = false;
      this.addTotalTable = false;
      this.isTotalTable = false;
      this.isAddCustomerTable = false;
      this.isAddEqTable = false;
    },
    addUserDetail() {
      this.tableCode = "table_customer_user_acc";
      this.pagenation.current = 1;
      this.createTable();
      this.isAddWorkOrderTable = false;
      this.isAddUserTable = true;
      this.isAddCustomerTable = false;
      this.isAddEqTable = false;
      this.addTotalTable = false;
      this.isTotalTable = false;
    },
    addCustomerDetail() {
      this.tableCode = "table_customer_acc";
      this.pagenation.current = 1;
      this.createTable();
      this.isAddWorkOrderTable = false;
      this.isAddUserTable = false;
      this.isAddCustomerTable = true;
      this.isAddEqTable = false;
      this.isTotalTable = false;
      this.addTotalTable = false;
    },
    // 增量明细
    incrementalDetail() {
      this.addTotalTable = true;
      this.isTotalTable = false;
      this.isAddEqTable = false;
      this.isAddWorkOrderTable = false;
      this.isAddUserTable = false;
      this.isAddCustomerTable = false;
      this.tableData = this.addData.titleDataList;
      this.monthList = this.addData.monthList;
    },
    // 导出明细
    exportExcel() {
      const params = this.chartForm;
      params.startDateStr = this.chartForm.monthData[0];
      params.endDateStr = this.chartForm.monthData[1];
      const list = [];
      this.chartForm.serviceNumberListAll.forEach(item => {
        list.push(item[item.length - 1]);
      });
      // 行业数据
      const industryList = [];
      this.chartForm.industryDataAll.forEach(item => {
        industryList.push(item[item.length - 1]);
      });
      const indexAll = industryList.filter(it => {
        return it != "全选";
      });
      params.industryCodeFilterList = indexAll;
      params.serviceNumberList = list;
      this.requestMethodPost("/report/exportReportTotalExcel", Object.assign({}, params, { chartName: this.tableName })).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "下载中，请稍后去下载中心查看",
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    onResize() {
      this.mainMinHeight = `height:${document.documentElement.clientHeight - 120}px`;
    },
    getCustomerGroupList() {
      this.requestMethodGet("/report/getCustomerGroup", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.customerGroupList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    customerGroupChange(val) {
      const oldVal = this.customerGroupOldId.length === 1 ? this.customerGroupOldId[0] : [];
      let allcustomerGroupId = this.customerGroupList.map(item => {
        return item.id;
      });
      if (val.includes("selectAll")) {
        this.chartForm.customerGroupIdList = allcustomerGroupId;
        this.chartForm.customerGroupIdList.unshift("selectAll");
      }
      if (oldVal.includes("selectAll") && !val.includes("selectAll")) this.chartForm.customerGroupIdList = [];
      if (oldVal.includes("selectAll") && val.includes("selectAll")) {
        const index = val.indexOf("selectAll");
        val.splice(index, 1); // 排除全选选项
        this.chartForm.customerGroupIdList = val;
      }
      if (!oldVal.includes("selectAll") && !val.includes("selectAll")) {
        if (val.length === allcustomerGroupId.length) {
          this.chartForm.customerGroupIdList.unshift("selectAll");
        }
      }
      // 储存当前最后的结果 作为下次的老数据
      this.customerGroupOldId[0] = this.chartForm.customerGroupIdList;
    }
  }
};
</script>

<style lang="less" scoped>
.chart-profile {
  padding: 20px;
  height: 100%;
  overflow: auto;
  background: #f2f3f6;
  &-serach-item {
    label {
      display: inline-block;
      width: 28%;
      text-align: right;
      padding-bottom: 10px;
    }
  }
}
.left {
  width: 25%;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
}
// .el-form-item{
//   margin-bottom: 10px;
// }
</style>
