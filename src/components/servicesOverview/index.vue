<template>
  <div class="so-container">
    <div class="so-tabs">
      <el-card
        class="soc-box-card"
        :style="{ background:'#fcf2f1',color:'#ee3434' }"
        v-loading="cardLoading"
        element-loading-spinner="el-icon-loading"
        element-loading-text="加载中...">
        <div
          v-for="item in tabsList"
          :key="item.code"
          :class="'soc-item ' + `soc-item-${item.code}`"
          @click="()=>{handlerTabClick(item)}"
        ><span class="soc-item-tit">{{ item.serviceName }}</span><span class="soc-item-child">{{ item.type }}</span></div>
      </el-card>
    </div>
    <div class="so-table">
      <custom-table class="table" ref="accountTable" :tableHeader="tableDataHeaderWorkorder" :tableData="tableData" :tableHeight="700 + ''" :loading="loading">
        <template #workOrderNumber="slotProps">
          <el-table-column label="工单编号" width="150" show-overflow-tooltip>
            <template slot="header">
              <column-header
              title="工单编号"
              :filterType="slotProps.slotData.filterType"
              :sortTypeVal="slotProps.slotData.sortTypeVal"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectMultiple="slotProps.slotData.selectMultiple"
              :selectOptions="slotProps.slotData.selectOptions"
              />
            </template>
            <template slot-scope="scope">
              <div>
                <span style="color: #409eff; cursor: pointer" @click="handleJumpWorkOrderDetail(scope.row)">{{ scope.row.workOrderNumber || "-" }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <template #serviceName="slotProps">
          <el-table-column label="服务项" width="150" show-overflow-tooltip>
            <template slot="header">
              <column-header
              title="服务项"
              :filterType="slotProps.slotData.filterType"
              :sortTypeVal="slotProps.slotData.sortTypeVal"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectMultiple="slotProps.slotData.selectMultiple"
              :selectOptions="slotProps.slotData.selectOptions"
              />
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span class="service-name">{{ scope.row.serviceName || "-" }}</span>
                <!-- <div v-if="scope.row.workOrderPesFlag == 1" class="pes-div">PES</div>
                <div v-if="scope.row.workOrderPesFlag == 2" class="dpes-div">DPES</div> -->
              </div>
            </template>
          </el-table-column>
        </template>
        <!-- <el-table-column slot="contactName" label="联系人" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popover-${scope.$index}`" trigger="click">
              <div>
                <div style="display: flex">
                  <img :src="contactDetail.headUrl ? contactDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                  <div style="flex: 1; margin-left: 10px">
                    <div class="username-div">{{ contactDetail.userName }}</div>
                    <div class="rolename-div">{{ contactDetail.roleNames || "-" }}</div>
                  </div>
                </div>
                <div class="phone-div">
                  <span style="color: #666; margin-right: 8px">Tel: </span>
                  <span>{{ contactDetail.phonenumber }}</span>
                  <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="contactDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel">
                    <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                  </el-button>
                </div>
                <div class="mail-div">
                  <span style="color: #666; margin-right: 8px">Mail: </span>
                  <span>{{ contactDetail.email }}</span>
                  <el-button class="copy_mail" type="text" v-clipboard:copy="contactDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px">
                    <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                  </el-button>
                </div>
              </div>
              <span slot="reference" :disabled="!scope.row.contactName" class="copy_text name-span" type="text" @click="executePersonDetail(scope)">{{ scope.row.contactName || "-" }}</span>
            </el-popover>
          </template>
        </el-table-column> -->
        <template #executePersonName="slotProps">
          <el-table-column label="执行人" width="150" show-overflow-tooltip>
            <template slot="header">
              <column-header
              title="执行人"
              :filterType="slotProps.slotData.filterType"
              :sortTypeVal="slotProps.slotData.sortTypeVal"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectMultiple="slotProps.slotData.selectMultiple"
              :selectOptions="slotProps.slotData.selectOptions"
              />
            </template>
            <template slot-scope="scope">
              <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                <div>
                  <div style="display: flex">
                    <img :src="executeDetail.headUrl ? executeDetail.headUrl : headImg" alt="" style="width: 40px; height: 40px" />
                    <div style="flex: 1; margin-left: 10px">
                      <div class="username-div">{{ executeDetail.userName }}</div>
                      <div class="rolename-div">{{ executeDetail.roleNames || "-" }}</div>
                    </div>
                  </div>
                  <div class="phone-div">
                    <span style="color: #666; margin-right: 8px">Tel: </span>
                    <span>{{ executeDetail.phonenumber }}</span>
                    <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="executeDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel">
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                  <div class="mail-div">
                    <span style="color: #666; margin-right: 8px">Mail: </span>
                    <span>{{ executeDetail.email }}</span>
                    <el-button class="copy_mail" type="text" v-clipboard:copy="executeDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px">
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                </div>
                <span slot="reference" :disabled="!scope.row.executePersonName" class="copy_text name-span" type="text" @click="contactPersonDetail(scope)">{{
                  scope.row.executePersonName || "-"
                }}</span>
              </el-popover>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="workOrderStatus" label="工单状态" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="workOrder-Status" style="color: #dd0000" v-if="scope.row.workOrderStatus == '0' || scope.row.workOrderStatus == '9'">{{ scope.row.workOrderStatusName }}</span>
            <span class="workOrder-Status" style="color: #001450" v-if="scope.row.workOrderStatus == '2'">{{ scope.row.workOrderStatusName }}</span>
            <span class="workOrder-Status" style="color: #008888" v-if="scope.row.workOrderStatus == '1'">{{ scope.row.workOrderStatusName }}</span>
            <span class="workOrder-Status" style="color: #999999" v-if="scope.row.workOrderStatus == '4'">{{ scope.row.workOrderStatusName }}</span>
            <span class="workOrder-Status" style="color: #999999" v-if="scope.row.workOrderStatus == '3'">{{ scope.row.workOrderStatusName }}</span>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageSet.pageNum"
        :page-size="pageSet.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageSet.total"
        style="float: right; margin-top: 10px"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import customTable from '../tableComponents/customTable'
import columnHeader from '../tableComponents/headerComponent'
import { getServiceOverview, getServiceOverviewList } from '@/api/cpServicesOverview/index'
export default {
  components: {
    'custom-table': customTable,
    'column-header': columnHeader
  },
  data () {
    return {
      headImg: require('../../assets/headImg.png'),
      tabsList: [{serviceName: '-', type: '', code: ''}],
      tableDataHeaderWorkorder: [
        { slot: 'workOrderNumber', label: '工单编号', paramValue: 'workOrderNumber' },
        { slot: 'serviceName', label: '服务项', paramValue: 'serviceName' },
        { slot: 'contactName' },
        { slot: 'executePersonName', label: '执行人', paramValue: 'executePersonName' },
        { label: '预约日期', paramValue: 'expectComingTime', prop: 'expectComingTime', width: '150', tooltip: true },
        { label: '创建日期', paramValue: 'createTime', prop: 'createTime', width: '150', tooltip: true },
        { slot: 'workOrderStatus' }
      ],
      pageSet: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      cardLoading: false,
      loading: false,
      tableData: [],
      contactDetail: {},
      executeDetail: {},
      tempServer: {}
    }
  },
  mounted () {
    this.getServiceOverviewData()
  },
  methods: {
    handlerTabClick (val) {
      let domList = document.getElementsByClassName(`soc-item`)
      for (let i = 0; i < domList.length; i++) {
        domList[i].style.background = '#fcf2f1'
        domList[i].style.color = '#ee3434'
      }
      let dom = document.getElementsByClassName(`soc-item-${val.code}`)[0]
      dom.style.background = '#ee3434'
      dom.style.color = '#fcf2f1'

      this.pageSet = {
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
      this.getTableData(val)
    },
    // 获取服务项数据
    getServiceOverviewData () {
      let params = {
        companyCode: ''
      }
      this.cardLoading = true
      getServiceOverview(params).then((res) => {
        if (res.data.code === 1000) {
          let data = res.data.data
          let arr = data.cusAllDoneService.map(item => { return {serviceName: item.serviceName, type: item.amount, code: item.serviceNumber} })
          this.tabsList = arr
          // let arr1 = data.doneService.map(item => { return {serviceName: item.serviceName, type: item.amount, code: item.serviceNumber} })
          // let arr2 = data.otherService.map(item => { return {serviceName: item.serviceName, type: item.amount, code: item.serviceNumber} })
          // this.tabsList = arr1.concat(arr2)
          if (this.tabsList && this.tabsList.length === 0) {
            this.tabsList = [{serviceName: '暂无数据', type: '', code: ''}]
          }
          this.$nextTick(() => {
            this.handlerTabClick(this.tabsList[0])
          })
        } else {
          this.$message.warning(res.data.msg)
        }
        this.cardLoading = false
      }).catch((err) => { console.log(err) })
    },
    // 获取表格数据
    getTableData (val) {
      if (val.code === '') return
      let params = {
        companyCode: '',
        serviceNumber: val.code,
        current: this.pageSet.pageNum,
        size: this.pageSet.pageSize
      }
      this.tempServer = val
      this.loading = true
      getServiceOverviewList(params).then((res) => {
        if (res.data.code === 1000) {
          this.tableData = res.data.data.list
          this.pageSet.total = res.data.data.totalCount
        } else {
          this.$message.warning(res.data.msg)
        }
        this.loading = false
      }).catch((err) => { console.log(err) })
    },
    // 表格工单编号点击
    handleJumpWorkOrderDetail (row) {
      if (row.serviceType === 1) {
        this.$router.push({
          path: '/NewWorkOrderList/newWorkOrderOilDetail',
          query: {
            workOrderNumber: row.workOrderNumber
          }
        })
      } else if (row.serviceType === 9 || row.serviceType == 11) {
        this.$router.push({
          path: '/NewWorkOrderList/newWorkOrderDetail',
          query: {
            workOrderNumber: row.workOrderNumber
          }
        })
      } else if (row.serviceType === 2) {
        this.$router.push({
          path: '/NewWorkOrderList/newWorkorderTaskDetail',
          query: {
            workOrderNumber: row.workOrderNumber
          }
        })
      }
    },
    // 查看联系人详情
    executePersonDetail (scope) {
      this.contactDetail = {}
      if (scope.row.contactNumber) {
        this.getUserDetail(scope.row.contactNumber, scope.$index, 'contact')
      }
    },
    // 查看执行人详情
    contactPersonDetail (scope) {
      this.executeDetail = {}
      if (scope.row.executePersonNumber) {
        this.getUserDetail(scope.row.executePersonNumber, scope.$index, 'execute')
      }
    },
    // 获取客户联系人详情
    getUserDetail (val, index, type) {
      if (val) {
        if (type === 'contact') {
          this.contactDetail = {}
        } else {
          this.executeDetail = {}
        }
        let param = {
          userNumber: val
        }
        this.requestMethodGet('/workOrder/getWorkOrderUser', param).then(res => {
          res = res.data
          if (res.code === 1000) {
            if (res.data) {
              if (type === 'contact') {
                this.contactDetail = res.data
                if (this.contactDetail.avatar) {
                  this.getFullUrl(this.contactDetail.avatar)
                }
                if (this.contactDetail.roleNames) {
                  this.contactDetail.roleNames = this.contactDetail.roleNames.join(',')
                }
                if (this.contactDetail.phonenumber) {
                  const phoneNum = this.contactDetail.phonenumber
                  this.contactDetail.phonenumber = phoneNum.substr(0, 3) + ' ' + phoneNum.substr(3, 4) + ' ' + phoneNum.substr(7, 4)
                }
              } else {
                this.executeDetail = res.data
                if (this.executeDetail.avatar) {
                  this.getFullUrl(this.executeDetail.avatar)
                }
                if (this.executeDetail.roleNames) {
                  this.executeDetail.roleNames = this.executeDetail.roleNames.join(',')
                }
                if (this.executeDetail.phonenumber) {
                  const phoneNum = this.executeDetail.phonenumber
                  this.executeDetail.phonenumber = phoneNum.substr(0, 3) + ' ' + phoneNum.substr(3, 4) + ' ' + phoneNum.substr(7, 4)
                }
              }
            } else {
              if (type === 'contact') {
                this.$message({
                  message: '人员不存在',
                  type: 'warning'
                })
              } else {
                this.$message({
                  message: '人员不存在',
                  type: 'warning'
                })
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: 'warning'
            })
          }
        }).catch(res => {})
      }
    },
    async getFileUrl (halfPath) {
      const res = await this.requestMethodGet('/web/file/getFullUrl', {
        url: halfPath
      })
      if (res.data.code === 1000) {
        return Promise.resolve(res.data.data)
      } else {
        this.$message({
          type: 'warning',
          message: '获取全路径失败，请稍后重试。'
        })
      }
    },
    // 分页方法
    handleSizeChange (val) {
      this.pageSet.pageSize = val
      this.getTableData(this.tempServer)
    },
    handleCurrentChange (val) {
      this.pageSet.pageNum = val
      this.getTableData(this.tempServer)
    }
  }
}
</script>

<style lang="less" scoped>
.so-container{
  padding: 20px;
  display: flex;
  justify-content: space-between;
  .so-tabs{
    width: 17%;
    /deep/.el-tabs{
      width: 100%;
      text-align: right;
    }
    /deep/.el-tabs--left .el-tabs__header.is-left{
      float: right;
    }
    .service-type{
      display: inline-block;
      width: 30px;
      text-align: right;
      margin-left: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: middle;
    }
  }
  .so-table{
    width: 80%;
  }
}
.soc-box-card{
  padding: 10px;
  font-size: 14px;
  max-height: 600px;
  overflow-y: auto;
  /deep/.el-card__body{
    padding: 0 !important;
  }
  .soc-item{
    padding: 8px 10px;
    text-align: left;
    cursor: pointer;
    transition: all 0.25s;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    .soc-item-tit{
      display: block;
      width: 78%;
      overflow:hidden;
      text-overflow:ellipsis;//文本溢出显示省略号
      white-space:nowrap;
    }
    .soc-item-child{
      display: block;
      width: 22%;
      text-align: right;
      margin-left: 5px;
      overflow:hidden;
      text-overflow:ellipsis;//文本溢出显示省略号
      white-space:nowrap;
    }
  }
  .soc-item:hover{
    background: rgba(0,0,0,0.05);
  }
}
</style>
