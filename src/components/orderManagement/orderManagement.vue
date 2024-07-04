<template>
  <div style="position: relative">
    <div class="order-management" :style="mainminheight" id="orderManageDiv">
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="searchForm">
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button plain @click="handleDownload" size="small" v-has="orderDownBtn">批量导出</el-button>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table class="table" ref="orderManageTable" :tableHeader="tableDataHeader" :tableData="orderTableData" :tableHeight="tableHeight + ''" :loading="loading" @selectionChange="handleSelectionChange" @changeSearch="tableTitleSearch">
        <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" width="40"></el-table-column>
        <template v-slot:nameCn="slotProps">
          <el-table-column
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            label="订购人"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                <div>
                  <div style="display: flex;align-items:center;">
                    <img :src="orderPersonDetail.headUrl ? orderPersonDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                    <div style="flex: 1; margin-left: 10px">
                      <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ orderPersonDetail.userName }}</div>
                    </div>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">电话: </span>
                    <span>{{ formatPhonenumber(orderPersonDetail.phonenumber) }}</span>
                    <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="orderPersonDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel" v-if="orderPersonDetail.phonenumber">
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">邮箱: </span>
                    <span>{{ formatEmail(orderPersonDetail.email) }}</span>
                    <el-button class="copy_mail" type="text" v-clipboard:copy="orderPersonDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px" v-if="orderPersonDetail.email">
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                </div>
                <span
                  slot="reference"
                  :disabled="!scope.row.nameCn"
                  class="copy_text"
                  type="text"
                  style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                  @click="getPersonDetail(scope)"
                  >{{ scope.row.nameCn || "-" }}</span
                >
              </el-popover>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-link type="danger" @click="handleLook(scope.row)" style="margin-right:10px">查看 </el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        background
        v-if="totalNumber"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[5, 10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from '@/api/api'
import customTable from "../tableComponents/customTable";
import commonJS from "../tableComponents/tableCommon.js";
export default {
  mixins: [commonJS],
  components: {
    "custom-table": customTable
  },
  data () {
    return {
      orderPersonDetail: {},
      tableDataHeader: [
        { slot: "selection" },
        { filterType: "input", paramValue: "orderNumber", changeValue:"", prop: "mslaOrderNumber", label: "订单编号", width: "180", tooltip: true },
        { filterType: "input", paramValue: "orderContent", changeValue:"", prop: "orderContent", label: "订购内容", width: "200", tooltip: true },
        { filterType: "input", paramValue: "companyName", changeValue:"", prop: "companyName", label: "订购方", width: "180", tooltip: true },
        { slot: "nameCn", label: "订购人", width: "130", tooltip: true },
        { filterType: "selection", paramValue: "orderState", selectOptions: [{code: 1,name: '待确认'},{code: 2,name: '待发货'},{code: 3,name: '待收货'},{code: 7,name: '已完成'},{code: 4,name: '已关闭'}], changeValue:"", prop: "orderStateDesc", label: "订单状态", width: "130", tooltip: true },
        { filterType: "dateRange", paramValue: "time", changeValue:"", prop: "orderTime", label: "下单日期", width: "130", tooltip: true },
        { slot: "operation", label: "操作" }
      ],
      tableHeight: null,
      activeName: 'second',
      mainminheight: `height:${document.documentElement.clientHeight - 150}px`,
      queryParams: {
        orderNumber: '',
        orderState: '',
        time: [], // 姓名
        companyName: '', // 订购方
        orderContent: ''
      },
      pagenation: {
        current: 1,
        size: 30
      },
      orderTableData: [],
      totalNumber: 0, // 总条数
      dataRecordTableData: [],
      selectList: [],
      dialogTitle: '',
      loading: false, // 是否加载
      headImg: require("../../assets/headImg.png")
    }
  },
  beforeRouteLeave (to, from, next) {
    this.queryParams.current = this.pagenation.current
    this.queryParams.size = this.pagenation.size
    sessionStorage.setItem('queryParams', JSON.stringify(this.queryParams))
    next()
  },
  beforeRouteEnter (to, from, next) {
    if (from.path == '/OrderManagement/LookOrderDetail') {
      to.params.isSaveQuery = true
    }
    next()
  },
  mounted () {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem('queryParams'))
      this.pagenation.current = this.queryParams.current
      this.pagenation.size = this.queryParams.size
      this.tableDataHeader.forEach(item=>{
        if(item.paramValue=='time'&&this.queryParams.time[0]){
          item.changeValue=[this.queryParams.time[0],this.queryParams.time[1]]
        }else if(item.paramValue=='orderContent'){
          item.changeValue = this.queryParams.orderContent
        }else if(item.paramValue=='orderNumber'){
          item.changeValue = this.queryParams.orderNumber
        }else if(item.paramValue=='orderState'){
          item.changeValue = this.queryParams.orderState
        }else if(item.paramValue=='companyName'){
          item.changeValue = this.queryParams.companyName
        }
      })
    }
    this.getOrderManagementData() // 获取订单列表
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 150}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          if(searchVal){
            item.changeValue = searchVal
          }else{
            item.changeValue = ""
          }
        }
      })
      this.queryParams[obj.paramValue] = searchVal
      this.handleSearchTableData()
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let orderManageDiv= 0
        let searchFormHeight= 0
        if (document.getElementById("orderManageDiv")) {
          orderManageDiv = document.getElementById("orderManageDiv").clientHeight;
        }
        if (document.getElementById("searchForm")) {
          searchFormHeight = document.getElementById("searchForm").clientHeight;
        }
        this.tableHeight = Number(orderManageDiv) - Number(searchFormHeight) - 40;
      }, 200);
    },
    handleClearSearch () {
      this.queryParams = {
        orderNumber: '',
        orderState: '',
        time: [], // 姓名
        companyName: '', // 订购方
        orderContent: ''
      }
      this.pagenation.current = 1
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.getOrderManagementData() // 获取订单管理列表
    },
    // 表格多选
    handleSelectionChange (select) {
      this.selectList = []
      select.forEach(item => {
        this.selectList.push(item.id)
      })
    },
    getOrderManagementData () {
      this.loading = true
      if (!this.queryParams.time) {
        this.queryParams.time = []
      }
      let params = {
        orderNumber: this.queryParams.orderNumber,
        orderState: this.queryParams.orderState,
        companyName: this.queryParams.companyName,
        orderContent: this.queryParams.orderContent,
        startTime: this.queryParams.time[0] || '',
        endTime: this.queryParams.time[1] || '',
        ...this.pagenation
      }
      this.orderTableData = []
      this.requestMethodGet('/msla/kit/order/queryKitOrderListByPage', params)
        .then(res => {
          this.loading = false
          res = res.data
          if (res.code == 1000) {
            this.orderTableData = res.data.list
            this.totalNumber = res.data.totalCount
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        })
        .catch(res => {
          this.loading = false
        })
    },
    // 查询
    handleSearchTableData (e) {
      this.pagenation.current = 1
      this.$refs.orderManageTable.clearSelection()
      this.getOrderManagementData() // 获取订单管理列表
    },
    // 复制邮箱
    onCopyMail(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制邮箱
    onErrorMail(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 复制手机号
    onCopyTel(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制失败
    onErrorTel(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    getPersonDetail(scope) {
      this.orderPersonDetail = {};
      if (scope.row.userId) {
        let param = {
          userId: scope.row.userId
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.orderPersonDetail = res.data;
                if (this.orderPersonDetail.avatar) {
                  this.getFullUrl(this.orderPersonDetail.avatar);
                }
                if (this.orderPersonDetail.roleNames) {
                  this.orderPersonDetail.roleNames = this.orderPersonDetail.roleNames.join(",");
                }
                if (this.orderPersonDetail.phonenumber) {
                  const phoneNum = this.orderPersonDetail.phonenumber;
                  this.orderPersonDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                }
              } else {
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
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.orderPersonDetail.headUrl = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 下载
    handleDownload () {
      let ids = this.selectList.join(',')
      let startTime = this.queryParams.time[0] || ''
      let endTime = this.queryParams.time[1] || ''
      let paramObj = {
        orderContent: this.queryParams.orderContent,
        orderNumber: this.queryParams.orderNumber,
        orderState: this.queryParams.orderState,
        companyName: this.queryParams.companyName,
        startTime: startTime,
        endTime: endTime,
        ids: ids,
        responseTypeBlob: true
      }
      this.requestMethodGet("/msla/kit/order/export", paramObj).then(res => {
        let data = res.data
        let fileReader = new FileReader()
        let that = this
        fileReader.onload = function () {
          try {
            let jsonData = JSON.parse(this.result) // 说明是普通对象数据，后台转换失败
            if (jsonData.code) {
              that.$message({
                message: jsonData.msg,
                type: 'error'
              })
              return
            }
          } catch (err) {
            // 解析成对象失败，说明是正常的文件流
            const blob = new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
            const objectUrl = URL.createObjectURL(blob)
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = objectUrl
            link.setAttribute('download', '订单管理.xls')
            document.body.appendChild(link)
            link.click()
          }
        }
        fileReader.readAsText(data)
      })
      .catch(res => {
      });
    },
    // page change  事件
    handleCurrentChange (page) {
      this.pagenation.current = page
      this.getOrderManagementData() // 获取订单管理列表
    },
    // size change 事件
    handleSizeChange (size) {
      this.pagenation.size = size
      this.pagenation.current = 1
      this.getOrderManagementData() // 获取订单管理列表
    },
    handleLook (row) {
      this.$router.push({
        path: '/OrderManagement/LookOrderDetail',
        query: {
          kitOrderNumber: row.kitOrderNumber
        }
      })
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  }
}
</script>
<style lang="less">
@import "../../assets/css/customTable.less";
.order-management {
  padding: 0 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
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
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
</style>
