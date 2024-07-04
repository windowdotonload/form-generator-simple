<template>
  <div>
    <div class="operation-record">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="操作日志" name="operationLog">
          <el-row>
            <el-button @click="handleRefresh" style="margin-bottom:16px" size="small">重置筛选</el-button>
            <el-button type="danger" v-has="RecordDownBtn" plain icon="el-icon-download" @click="handleDownloadSystem" style="float:right;margin-bottom:16px" size="small">导出</el-button>
          </el-row>
          <custom-table
            :tableHeader="tableDataHeaderOper"
            :tableData="operLogTableData"
            :tableHeight="tableHeight + ''"
            :loading="loading"
            @changeSearch="tableTitleSearch"  @changeSortTable="changeSortTable"
          >
            <template v-slot:operName="slotProps">
              <el-table-column
                :width="slotProps.slotData.width && slotProps.ind !== tableDataHeaderOper.length - 2 ? slotProps.slotData.width : ''"
                :resizable="slotProps.ind == tableDataHeaderOper.length - 2 ? false : true"
                label="操作人员"
                show-overflow-tooltip
              >
                <template slot="header">
                  <column-header 
                    title="操作人员"
                    :filterType="slotProps.slotData.filterType"
                    :paramValue="slotProps.slotData.paramValue"
                    :changeValue="slotProps.slotData.changeValue"
                    @chSubmit="tableTitleSearch"/>
                </template>
                <template slot-scope="scope">
                  <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                    <div>
                      <div style="display: flex;align-items:center;">
                        <img :src="operUserDetail.headUrl ? operUserDetail.headUrl : require('../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                        <div style="flex: 1; margin-left: 10px">
                          <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ operUserDetail.userName }}</div>
                        </div>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">电话: </span>
                        <span>{{ formatPhonenumber(operUserDetail.phonenumber) }}</span>
                        <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="operUserDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel" v-if="operUserDetail.phonenumber">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">邮箱: </span>
                        <span>{{ formatEmail(operUserDetail.email) }}</span>
                        <el-button class="copy_mail" type="text" v-clipboard:copy="operUserDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px" v-if="operUserDetail.email">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                    </div>
                    <span
                      slot="reference"
                      :disabled="!scope.row.operName"
                      class="copy_text"
                      type="text"
                      style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                      @click="operUserDetail(scope)"
                      >{{ scope.row.operName || "-" }}</span
                    >
                  </el-popover>
                </template>
              </el-table-column>
            </template>
            <template v-slot:status="slotProps">
              <el-table-column
                label="操作状态"
                :width="slotProps.slotData.width && slotProps.ind !== tableDataHeaderOper.length - 2 ? slotProps.slotData.width : ''"
                :resizable="slotProps.ind == tableDataHeaderOper.length - 2 ? false : true"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="status" style="color:rgb(0, 136, 136);" v-if="scope.row.status == '0'">成功</span>
                  <span class="status" style="color:rgb(153, 153, 153);" v-if="scope.row.status == '1'">失败</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
            <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-link @click="handleLookOperation(scope.row)" style="margin-right:10px;color:rgb(0,20,79)" :underline="false">查看</el-link>
              </template>
            </el-table-column>
          </custom-table>
          <el-pagination
            background
            v-if="operLogTotal > 0"
            @size-change="handleSizeChangeOper"
            @current-change="handleCurrentChangeOper"
            :pageNumber-page="pagenation.pageNumber"
            :page-size="pagenation.pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="operLogTotal"
            class="listOptimizePage"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="系统日志" name="systemLog">
          <el-row>
            <el-button plain @click="handleRefresh" style="margin-bottom:16px" size="small">重置筛选</el-button>
            <el-button type="danger" plain icon="el-icon-download" @click="handleDownloadSystem" style="float:right;margin-bottom:16px" size="small" v-has="RecordDownBtn">导出</el-button>
          </el-row>
          <custom-table
            :tableHeader="tableDataHeaderLog"
            :tableData="logSystemData"
            :tableHeight="tableHeight + ''"
            :loading="loading"
			      @changeSearch="tableTitleSearch"
            @changeSortTable="changeSortTable"
          >
          <template v-slot:userName="slotProps">
              <el-table-column
                :width="slotProps.slotData.width && slotProps.ind !== tableDataHeaderLog.length - 2 ? slotProps.slotData.width : ''"
                :resizable="slotProps.ind == tableDataHeaderLog.length - 2 ? false : true"
                label="用户"
                show-overflow-tooltip
              >
                <template slot="header">
                  <column-header 
                    title="用户"
                    :filterType="slotProps.slotData.filterType"
                    :paramValue="slotProps.slotData.paramValue"
                    :changeValue="slotProps.slotData.changeValue"
                    @chSubmit="tableTitleSearch"/>
                </template>
                <template slot-scope="scope">
                  <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                    <div>
                      <div style="display: flex;align-items:center;">
                        <img :src="userDetail.headUrl ? userDetail.headUrl : require('../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                        <div style="flex: 1; margin-left: 10px">
                          <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ userDetail.userName }}</div>
                        </div>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">电话: </span>
                        <span>{{ formatPhonenumber(userDetail.phonenumber) }}</span>
                        <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="userDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel" v-if="userDetail.phonenumber">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                      <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                        <span style="color: #666; margin-right: 8px">邮箱: </span>
                        <span>{{ formatEmail(userDetail.email) }}</span>
                        <el-button class="copy_mail" type="text" v-clipboard:copy="userDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px" v-if="userDetail.email">
                          <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                        </el-button>
                      </div>
                    </div>
                    <span
                      slot="reference"
                      :disabled="!scope.row.userName"
                      class="copy_text"
                      type="text"
                      style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                      @click="userDetail(scope)"
                      >{{ scope.row.userName || "-" }}</span
                    >
                  </el-popover>
                </template>
              </el-table-column>
            </template>
            <template v-slot:status="slotProps">
              <el-table-column
                label="状态"
                :width="slotProps.slotData.width && slotProps.ind !== tableDataHeaderLog.length - 2 ? slotProps.slotData.width : ''"
                :resizable="slotProps.ind == tableDataHeaderLog.length - 2 ? false : true"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span class="status" style="color:rgb(0, 136, 136);" v-if="scope.row.status == '0'">成功</span>
                  <span class="status" style="color:rgb(153, 153, 153);" v-if="scope.row.status == '1'">失败</span>
                </template>
              </el-table-column>
            </template>
            <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
            <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-link @click="handleLookSystemLog(scope.row)" style="margin-right:10px;color:rgb(0,20,79)" :underline="false">查看</el-link>
              </template>
            </el-table-column>
          </custom-table>
          <el-pagination
            background
            v-if="totalNumberSystem > 0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :pageNumber-page="pagenation1.pageNumber"
            :page-size="pagenation1.pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNumberSystem"
            class="listOptimizePage"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 操作日志详细 -->
    <el-dialog title="日志详情" :visible.sync="dialogOperationLog" :show-close="false" width="700px" :close-on-click-modal="false">
      <el-form :model="operForm" ref="operForm">
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">日志编码</div>
            <span style="color:#666">{{ operForm.operId }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">操作时间</div>
            <span style="color:#666">{{ operForm.operTime }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">操作状态</div>
            <span style="color:#666">{{ operForm.status == 0 ? "成功" : "失败" }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">系统模块</div>
            <span style="color:#666">{{ operForm.title }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">业务类型</div>
            <span style="color:#666">{{ operForm.business }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">操作人员</div>
            <span style="color:#666">{{ operForm.operName }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">公司</div>
            <span style="color:#666">{{ operForm.deptName }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">账号归属</div>
            <span style="color:#666">{{ operForm.operatorRoleTypeName || "" }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">请求方式</div>
            <span style="color:#666">{{ operForm.requestMethod }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">操作地点</div>
            <span style="color:#666">{{ operForm.operLocation }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">请求URL</div>
            <span style="color:#666">{{ operForm.method }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="24">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">请求参数</div>
            <span style="color:#666">{{ operForm.operParam }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="24">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">返回参数</div>
            <span style="color:#666">{{ operForm.jsonResult }}</span>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button type="danger" @click="dialogOperationLog = false" size="small">确定</el-button>
      </div>
    </el-dialog>
    <!-- 系统日志详细 -->
    <el-dialog title="日志详情" :visible.sync="dialogSystemLogVisible" :show-close="false" width="700px" :close-on-click-modal="false">
      <el-form :model="sysForm" ref="sysForm">
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">日志编码</div>
            <span style="color:#666">{{ sysForm.sysId }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">时间</div>
            <span style="color:#666">{{ sysForm.sysTime }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">状态</div>
            <span style="color:#666">{{ sysForm.status == 0 ? "成功" : "失败" }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">系统模块</div>
            <span style="color:#666">{{ sysForm.title }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">功能类型</div>
            <span style="color:#666">{{ sysForm.sysType }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">用户</div>
            <span style="color:#666">{{ sysForm.userName }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">公司</div>
            <span style="color:#666">{{ sysForm.userCompany }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">账号归属</div>
            <span style="color:#666">{{ sysForm.userRoleTypeName || "" }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">日志类型</div>
            <span style="color:#666">{{ sysForm.jouType }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">用户地点</div>
            <span style="color:#666">{{ sysForm.loginLocation }}</span>
          </el-col>
          <el-col :span="12">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">导航地址</div>
            <span style="color:#666">{{ sysForm.navigateUrl }}</span>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:25px">
          <el-col :span="24">
            <div style="font-weight:bold;margin-bottom:10px;font-size:16px">提示消息</div>
            <span style="color:#666">{{ sysForm.msg }}</span>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:right;">
        <el-button type="danger" @click="dialogSystemLogVisible = false" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
import commonJS from "../tableComponents/tableCommon.js";
export default {
  mixins: [commonJS],
  components: {
    "custom-table": customTable,
    "column-header": columnHeader,
  },
  data() {
    return {
      acountBelongList: [
        { code: "0", name: "美孚" },
        { code: "1", name: "经销商" },
        { code: "2", name: "客户" }
      ],
      pickerOptions: {
        shortcuts: []
      },
      customerList: [],
      logSystemData: [], // 系统日志列表
      dialogSystemLogVisible: false, // 系统日志详情弹框
      dialogOperationLog: false, // 操作日志详情弹框
      activeName: "operationLog",
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      queryParams: {
        roleType: "",
        titleCode: "", // 系统模块
        operTimeStart: "", // 操作日志开始时间
        operTimeEnd: "", // 操作日志结束时间
        sysType: "", // 功能/业务类型
        userName: "", // 用户/操作人
        companyName: "" // 公司
      },
      sysForm: {},
      operForm: {},
      pagenation: {
        pageNumber: 1,
        pageSize: 30
      },
      pagenation1: {
        pageNumber: 1,
        pageSize: 30
      },
      operLogTableData: [],
      logModuleData: [],
      operLogTotal: 0, // 总条数
      dataRecordTableData: [],
      selectList: [],
      dialogTitle: "",
      loading: false, // 是否加载
      falg: false, // 开始日期，结束日期是否合规
      tableHeight:null,
      tableDataHeaderOper:[
        { label: "日志编码", prop: "operId", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "titleCode", selectMultiple: true, selectOptions:  [], changeValue:"", label: "系统模块", prop: "title", width: "100", tooltip: true},
        { filterType: "input", paramValue: "sysType", changeValue:"", label: "业务类型", prop: "business", width: "100", tooltip: true},
        { label: "请求方式", prop: "requestMethod", width: "100", tooltip: true},
        { filterType: "input", paramValue: "userName", changeValue:"", label: "操作人员", slot: "operName", width: "100", tooltip: true},
        { filterType: "input", paramValue: "companyName", changeValue:"", label: "公司", prop: "deptName", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "roleType", selectMultiple: true, selectOptions: [{ code: "0", name: "美孚" },{ code: "1", name: "经销商" },{ code: "2", name: "客户" }], changeValue:"", label: "账号归属", prop: "operatorRoleTypeName", width: "100", tooltip: true},
        { label: "操作地点", prop: "operLocation", width: "100", tooltip: true},
        { label: "操作状态", slot: "status", width: "100" },
        { filterType: "datetimerange", paramValue: "createTime", changeValue:"", label: "时间", prop: "operTime", width: "150", tooltip: true},
        { label: "操作", slot: "operation" }
      ],
      tableDataHeaderLog: [
        { label: "日志编码", prop: "sysId", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "titleCode", selectMultiple: true, selectOptions:  [], changeValue:"", label: "系统模块", prop: "title", width: "100", tooltip: true},
        { filterType: "input", paramValue: "sysType", changeValue:"", label: "业务类型", label: "功能类型", prop: "sysType", width: "100", tooltip: true},
        { label: "日志类型", prop: "jouType", width: "100", tooltip: true},
        { filterType: "input", paramValue: "userName", changeValue:"", label: "用户", slot: "userName", width: "100", tooltip: true},
        { filterType: "input", paramValue: "companyName", changeValue:"", label: "公司", prop: "userCompany", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "roleType", selectMultiple: true, selectOptions: [{ code: "0", name: "美孚" },{ code: "1", name: "经销商" },{ code: "2", name: "客户" }], changeValue:"", label: "账号归属", prop: "userRoleTypeName", width: "100", tooltip: true},
        { label: "登陆地点", prop: "loginLocation", width: "100", tooltip: true},
        { label: "状态", slot: "status", width: "100" },
        { filterType: "datetimerange", paramValue: "createTime", changeValue:"", label: "时间", prop: "sysTime", width: "150", tooltip: true},
        { label: "操作", slot: "operation" }
      ],
      operUserDetail:{},
      userDetail:{}
    };
  },
  created() {
    this.$_queryOperateList(); // 获取短信列表
    this.selectTime();
    this.$_queryCustomerData(); // 查询所属客户
    this.$_queryLogModuleData();
  },
  mounted(){
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  methods: {
    selectCompany(val) {
      this.queryParams.companyName = val;
      if (this.activeName == "operationLog") {
        this.$_queryOperateList();
      } else {
        this.$_querySystemList();
      }
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      this.$_queryCustomerData(val);
    },
    clearCustomer(val) {
      if (!val) {
        this.$_queryCustomerData("");
      }
    },
    // 查询日志模块
    $_queryLogModuleData() {
      let type;
      if (this.activeName == "operationLog") {
        type = "op_log_model";
      } else {
        type = "sys_log_model";
      }
      this.requestMethodGet("/log/search/model", { type: type })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.logModuleData = res.data;
            this.tableDataHeaderOper.forEach(item=>{
              if(item.paramValue == "titleCode"){
                item.selectOptions = res.data
              }
            })
            this.tableDataHeaderLog.forEach(item=>{
              if(item.paramValue == "titleCode"){
                item.selectOptions = res.data
              }
            })
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询所属客户
    $_queryCustomerData(val) {
      let params = {
        companyName: val
      };
      this.requestMethodGet("/log/search/company", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.customerList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    selectTime() {
      var _this = this;
      let today = _this.moment(new Date()).format("YYYY-MM-DD") + " " + "00:00:00"; // 今天的零点
      let nowTimeCur = this.moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let yesterday =
        _this
          .moment()
          .subtract(1, "days")
          .format("YYYY-MM-DD") +
        " " +
        "00:00:00"; // 昨天的零点
      let thismonthFirt = _this
        .moment()
        .startOf("month")
        .format("YYYY-MM-DD HH:mm:ss");
      let day1 =
        _this
          .moment()
          .weekday(1)
          .format("YYYY-MM-DD") +
        " " +
        "00:00:00";
      _this.pickerOptions.shortcuts = [
        {
          text: "今天",
          onClick(picker) {
            picker.$emit("pick", today);
            _this.queryParams.operTimeEnd = nowTimeCur;
          }
        },
        {
          text: "昨天",
          onClick(picker) {
            picker.$emit("pick", yesterday);
            _this.queryParams.operTimeEnd = today;
          }
        },
        {
          text: "本周",
          onClick(picker) {
            picker.$emit("pick", day1);
            _this.queryParams.operTimeEnd = nowTimeCur;
          }
        },
        {
          text: "上周",
          onClick(picker) {
            // 上周的第一天和最后一天
            let weekOfday = parseInt(_this.moment().format("d")); // 计算今天是这周第几天 周日为一周中的第一天
            let start =
              _this
                .moment()
                .subtract(weekOfday + 7 - 1, "days")
                .format("YYYY-MM-DD") +
              " " +
              "00:00:00"; // 周一日期
            picker.$emit("pick", start);
            _this.queryParams.operTimeEnd = day1;
          }
        },
        {
          text: "本月",
          onClick(picker) {
            picker.$emit("pick", thismonthFirt);
            _this.queryParams.operTimeEnd = nowTimeCur;
          }
        },
        {
          text: "上月",
          onClick(picker) {
            let lastmonthFirt = _this
              .moment()
              .month(_this.moment().month() - 1)
              .startOf("month")
              .format("YYYY-MM-DD HH:mm:ss");
            picker.$emit("pick", lastmonthFirt);
            _this.queryParams.operTimeEnd = thismonthFirt;
          }
        },
        {
          text: "本季度",
          onClick(picker) {
            // 本季度第一天
            var thisseasonFirst =
              _this
                .moment()
                .startOf("quarter")
                .format("YYYY-MM-DD") +
              " " +
              "00:00:00";
            picker.$emit("pick", thisseasonFirst);
            _this.queryParams.operTimeEnd = nowTimeCur;
          }
        },
        {
          text: "6个月",
          onClick(picker) {
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            var six = _this.moment(start).format("YYYY-MM-DD") + " " + "00:00:00";
            picker.$emit("pick", six);
            _this.queryParams.operTimeEnd = nowTimeCur;
          }
        }
      ];
    },
    handleRefresh() {
      this.queryParams = {
        roleType:'',
        titleCode: "", // 系统模块
        operTimeStart: "", // 操作日志开始时间
        operTimeEnd: "", // 操作日志结束时间
        sysType: "", // 功能/业务类型
        userName: "", // 用户/操作人
        companyName: "" // 公司
      };
      if (this.activeName == "operationLog") {
        this.tableDataHeaderOper.forEach(item=>{
          item.changeValue=""
        })
        this.pagenation.pageNumber = 1;
        this.$_queryOperateList();
      } else {
        this.tableDataHeaderLog.forEach(item=>{
          item.changeValue=""
        })
        this.pagenation1.pageNumber = 1;
        this.$_querySystemList();
      }
    },
    handleClick() {
      this.$_queryLogModuleData();
      this.queryParams = {
        titleCode: "", // 系统模块
        operTimeStart: "", // 操作日志开始时间
        operTimeEnd: "", // 操作日志结束时间
        sysType: "", // 功能/业务类型
        userName: "", // 用户/操作人
        companyName: "" // 公司
      };
	  this.tableDataHeaderOper.forEach(item=>{
	    item.changeValue=""
	  })
	  this.tableDataHeaderLog.forEach(item=>{
	    item.changeValue=""
	  })
      if (this.activeName == "operationLog") {
        this.$_queryOperateList();
      } else {
        this.$_querySystemList();
      }
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 220}px`;
    },
    // 操作日志查看
    handleLookOperation(row) {
      this.operForm = row;
      this.dialogOperationLog = true;
    },
    // 系统日志查看
    handleLookSystemLog(row) {
      this.sysForm = row;
      this.dialogSystemLogVisible = true;
    },
    // 获取操作日志列表
    $_queryOperateList() {
      let date1, date2;
      date1 = this.queryParams.operTimeStart;
      date2 = this.queryParams.operTimeEnd;
      if (date1 && date2) {
        var oDate1 = new Date(date1);
        var oDate2 = new Date(date2);
        if (oDate1.getTime() > oDate2.getTime()) {
          this.$message({
            message: "结束日期不可以小于开始日期",
            type: "warning"
          });
          return;
        }
      }
      this.loading = true;
      let params = {
        titleCode: this.queryParams.titleCode.toString(),
        sysType: this.queryParams.sysType,
        userName: this.queryParams.userName,
        companyName: this.queryParams.companyName,
        operTimeStart: this.queryParams.operTimeStart || "",
        operTimeEnd: this.queryParams.operTimeEnd || "",
        roleType: this.queryParams.roleType || "",
        ...this.pagenation
      };
      params.roleType = params.roleType.toString()
      this.operLogTableData = [];
      this.requestMethodGet("/log/search/operate", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.operLogTableData = res.data.list;
            this.operLogTotal = res.data.total;
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
    // 获取系统日志列表
    $_querySystemList() {
      let date1, date2;
      date1 = this.queryParams.operTimeStart;
      date2 = this.queryParams.operTimeEnd;
      if (date1 && date2) {
        var oDate1 = new Date(date1);
        var oDate2 = new Date(date2);
        if (oDate1.getTime() > oDate2.getTime()) {
          this.$message({
            message: "结束日期不可以小于开始日期",
            type: "warning"
          });
          return;
        }
      }
      this.loading = true;
      let params = {
        titleCode: this.queryParams.titleCode.toString(),
        sysType: this.queryParams.sysType,
        userName: this.queryParams.userName,
        companyName: this.queryParams.companyName,
        operTimeStart: this.queryParams.operTimeStart || "",
        operTimeEnd: this.queryParams.operTimeEnd || "",
        roleType: this.queryParams.roleType || "",
        ...this.pagenation1
      };
      params.roleType = params.roleType.toString()
      this.logSystemData = [];
      this.requestMethodGet("/log/search/system", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.logSystemData = res.data.list;
            this.totalNumberSystem = res.data.total;
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
    // 查询
    handleSearchTableData() {
      if (this.activeName == "operationLog") {
        this.pagenation.pageNumber = 1;
        this.$_queryOperateList();
      } else {
        this.pagenation1.pageNumber = 1;
        this.$_querySystemList();
      }
    },
    // 日志下载
    handleDownloadSystem() {
      let url = "";
      let paramObj = {}
      console.log('this.queryParams',this.queryParams)
      console.log('this.queryParams.roleType',this.queryParams.roleType)
      if (this.activeName == "operationLog") {
        url = "/log/search/operate/download"
        paramObj = {
          titleCode: this.queryParams.titleCode.toString() || "",
          sysType: this.queryParams.sysType || "",
          userName: this.queryParams.userName || "",
          companyName: this.queryParams.companyName || "",
          operTimeStart: this.queryParams.operTimeStart || "",
          operTimeEnd: this.queryParams.operTimeEnd || "",
          roleType: this.queryParams.roleType?this.queryParams.roleType.toString() || "":"",
        }
      } else {
        url = "/log/search/system/download"
        paramObj = {
          titleCode: this.queryParams.titleCode.toString() || "",
          sysType: this.queryParams.sysType || "",
          userName: this.queryParams.userName || "",
          companyName: this.queryParams.companyName || "",
          operTimeStart: this.queryParams.operTimeStart || "",
          operTimeEnd: this.queryParams.operTimeEnd || "",
          roleType: this.queryParams.roleType?this.queryParams.roleType.toString() || "":"",
        }
      }
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.requestMethodGet(url, paramObj).then(res => {
        let data = res.data;
        loading.close();
        console.log('this is res',res)
        if(res.data.code == 1000){
          this.$message({
            type:'success',
            message: data.data || "下载中，请稍后去下载中心查看"
          })
        }
      })
      .catch(res => {
        loading.close();
      });
    },
    // page change  事件  系统日志
    handleCurrentChange(page) {
      this.pagenation1.pageNumber = page;
      this.$_querySystemList(); // 获取日志列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation1.pageSize = size;
      this.pagenation1.pageNumber = 1;
      this.$_querySystemList();
    },
    // page change  事件 操作日志
    handleCurrentChangeOper(page) {
      this.pagenation.pageNumber = page;
      this.$_queryOperateList(); // 获取日志列表
    },
    handleSizeChangeOper(size) {
      this.pagenation.pageSize = size;
      this.pagenation.pageNumber = 1;
      this.$_queryOperateList(); // 获取短信日志列表
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 287
    },
    // 排序
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal
      this.sortMethod = obj.paramValue
      if(sortVal=='sortUp'){
        this.sortType = true
      }else if(sortVal=='sortDown'){
        this.sortType = false
      }
      if(this.activeName == "operationLog"){
        this.tableDataHeaderOper.forEach(item=>{
          if(item.sortTypeVal){
            if(item.paramValue&&(item.paramValue == this.sortMethod)){
              item.sortTypeVal = sortVal
            }else if(item.paramValue&&(item.paramValue != this.sortMethod)){
              item.sortTypeVal = 'sortDefault'
            }
          }
        })
      }else{
        this.tableDataHeaderLog.forEach(item=>{
          if(item.sortTypeVal){
            if(item.paramValue&&(item.paramValue == this.sortMethod)){
              item.sortTypeVal = sortVal
            }else if(item.paramValue&&(item.paramValue != this.sortMethod)){
              item.sortTypeVal = 'sortDefault'
            }
          }
        })
      }
      this.handleSearchTableData()
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      if(this.activeName == "operationLog"){
        this.tableDataHeaderOper.forEach(item=>{
          if(obj.paramValue==item.paramValue){
            item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
          }
        })
      }else{
        this.tableDataHeaderLog.forEach(item=>{
          if(obj.paramValue==item.paramValue){
            if(searchVal){
              item.changeValue = searchVal
            }else{
              item.changeValue = ""
            }
          }
        })
      }
      if(obj.paramValue=="createTime"){
        if(searchVal){
          this.queryParams.operTimeStart = searchVal[0]
          this.queryParams.operTimeEnd = searchVal[1]
        }else{
          this.queryParams.operTimeStart = ''
          this.queryParams.operTimeEnd = ''
        }
      }else{
        this.queryParams[obj.paramValue] = searchVal
      }
      this.handleSearchTableData()
    },
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          return res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 获取客户联系人详情
    getUserDetail(val, index, type) {
      if (val) {
        if(type==1){
          this.operUserDetail = {};
        }else{
          this.userDetail = {};
        }
        let param = {
          userId: val
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.$refs[`popovers-${index}`].doShow();
                if(type==1){
                  this.operUserDetail = res.data;
                  if (this.operUserDetail.avatar) {
                    let avatarUrl =  this.getFullUrl(this.operUserDetail.avatar);
                    this.$set(this.operUserDetail,'headUrl',avatarUrl)
                  }
                  if (this.operUserDetail.roleNames) {
                    this.operUserDetail.roleNames = this.operUserDetail.roleNames.join(",");
                  }
                  if (this.operUserDetail.phonenumber) {
                    const phoneNum = this.operUserDetail.phonenumber;
                    this.operUserDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                  }
                }else{
                  this.userDetail = res.data;
                  if (this.userDetail.avatar) {
                    let avatarUrl = this.getFullUrl(this.userDetail.avatar);
                    this.$set(this.operUserDetail,'headUrl',avatarUrl)
                  }
                  if (this.userDetail.roleNames) {
                    this.userDetail.roleNames = this.userDetail.roleNames.join(",");
                  }
                  if (this.userDetail.phonenumber) {
                    const phoneNum = this.userDetail.phonenumber;
                    this.userDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                  }
                }
              } else {
                this.$refs[`popovers-${index}`].doClose();
                this.$message({
                  message: "人员不存在",
                  type: "warning"
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
      }
    },
    // 查看创建人详情
    createUserNameDetail(scope) {
      this.operUserDetail = {};
      if (scope.row.operId) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        this.getUserDetail(scope.row.operId, scope.$index, 1);
      }
    },
    userDetail(){
      this.userDetail = {};
      if (scope.row.userId) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        this.getUserDetail(scope.row.userId, scope.$index, 2);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.getTableHeight()
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.status {
  font-family: MicrosoftYaHei-Bold;
  font-size: 14px;
  font-weight: bold;
}
/deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
  border-bottom-color: #e9e9e9;
  background: #dd0000;
  color: #fff !important;
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
.operation-record {
  padding: 0 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin: 15px 0 0px;
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
  // .el-pagination.is-background .el-pager li:not(.disabled).active {
  //   background:#fff !important;
  // }
  /deep/ .el-tabs__item.is-active {
    color: #fe000c !important;
  }
  .el-tabs__active-bar {
    background-color: #fe000c !important;
  }
  .el-tabs__item:hover {
    color: #fe000c !important;
  }
  /deep/ .el-tabs__nav-wrap::after{
    background-color: transparent;
  }
  /deep/ .el-tabs__active-bar{
    background-color: #DD0000 !important;
  }
}
</style>
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
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
  /* top: 1px !important; */
}
</style>
