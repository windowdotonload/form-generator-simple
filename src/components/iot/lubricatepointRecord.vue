<!--
* @description 账号管理
* @fileName accountManagement.vue
* @author vvx
* @date 2020/05/15 15:30:23
* @version V1.0.0
!-->
<template>
  <div class="record-management" :style="mainminheight">
        <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- <el-tab-pane label="数据日志" name="first">
          <el-row :gutter="20">
            <el-col :span="5" class="record-management-serach-item">
              <label for>状态：</label>
              <el-select
                v-model="queryParams.status"
                style="width:240px"
                clearable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" class="record-management-serach-item">
              <label for>时间区间：</label>
              <el-date-picker
                v-model="queryParams.time"
                :unlink-panels="true"
                clearable
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="4" class="record-management-serach-item">
                <el-button type="danger" plain icon="el-icon-search" @click="handleSearchTableData">查询</el-button>
            </el-col>
          </el-row> -->
          <!-- 表格 -->
          <!-- <el-table
            ref="accountTable"
            :key="1"
            row-key="id"
            :data="dataRecordTableData"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{background:'#f7f7f7'}"
            :max-height="500"
            v-loading="loading"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column prop="sendTime" label="时间" min-width="10%" ></el-table-column>
            <el-table-column prop="messageId" label="MessageID" min-width="10%" ></el-table-column>
            <el-table-column prop="deviceName" label="DeviceName" min-width="10%" ></el-table-column>
            <el-table-column prop="businessType" label="业务类型" min-width="10%" ></el-table-column>
            <el-table-column prop="messageContent" label="内容" min-width="30%" ></el-table-column>
            <el-table-column label="状态" min-width="10%" >
              <template slot-scope="scope">
                <span v-if="scope.row.statusDesc=='成功'" style="color:green">{{scope.row.statusDesc}}</span>
                <div style="padding-left:20px" v-else >
                <span style="color:red">{{scope.row.statusDesc}}</span>
                <el-tooltip :content="scope.row.errorMsg" placement="bottom" effect="light"><i class="el-icon-warning" style="font-size:20px;vertical-align: middle;color:#ccc"></i></el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane> -->
        
        <el-tab-pane label="短信日志" name="second">    
          <el-row :gutter="20">
            <!-- <el-col :span="5" class="record-management-serach-item">
              <label for>润滑点：</label>
              <el-select
                v-model="queryParams.lubricationPointNumber"
                style="width:240px"
                clearable
              >
                <el-option
                  v-for="item in lubricatepointNameList"
                  :key="item.lubricationPointNumber"
                  :label="item.lubricationPointName"
                  :value="item.lubricationPointNumber"
                ></el-option>
              </el-select>
            </el-col> -->
            <el-col :span="5" class="record-management-serach-item">
              <label for>状态：</label>
              <el-select
                v-model="queryParams.status"
                @change="handleSearchTableData"
                size="small"
                style="width:240px"
                clearable
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="7" class="record-management-serach-item">
              <label for>时间区间：</label>
              <el-date-picker
                v-model="queryParams.time"
                @change="handleSearchTableData"
                size="small"
                :unlink-panels="true"
                clearable
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
            <el-col :span="4" class="record-management-serach-item">
              <el-button type="danger" plain icon="el-icon-search" @click="handleSearchTableData" size="small">查询</el-button>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <el-table
            ref="accountTable"
            :key="2"
            row-key="id"
            :data="newsTableData"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{background:'#f7f7f7'}"
            v-loading="loading"
            stripe  
            @selection-change="handleSelectionChange"
          >
            <el-table-column prop="sendTime" label="发送时间" min-width="15%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phoneNumber" label="接收账号" min-width="15%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="messageContent" label="消息内容" min-width="30%" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" min-width="10%" >
              <template slot-scope="scope">
                <span v-if="scope.row.statusDesc=='成功'" style="color:green">{{scope.row.statusDesc}}</span>
                <span v-else style="color:red">{{scope.row.statusDesc}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
    </el-tabs>

    <el-pagination
      background
      v-if="totalNumber>0"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenation.current"
      :page-size="pagenation.size"
      :page-sizes="[5,10,20,30,50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      style="float: right;display:flex; margin-top: 10px"
    ></el-pagination>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
export default {
  data() {
    var validateRole = (rule, value, callback) => {
      if (this.ruleForm.roleNumbers.length == 0) {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      activeName:'second',
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      queryParams: {
        time: [], //姓名
        status: "" //状态
      },
      lubricatepointNameList:[],
      statusList:[{
          value:1,
          label:'成功'
      },
      {
          value:0,
          label:'失败'
      }],
      timeList:[{
        value:1,
        label:'10分钟'
      },
      {
        value:2,
        label:'1小时'
      },  {
        value:3,
        label:'6小时'
      },  {
        value:4,
        label:'24小时'
      },  {
        value:5,
        label:'7天'
      }],
      pagenation: {
        current: 1,
        size: 30
      },
      newsTableData:[],
      totalNumber: 0, //总条数
      dataRecordTableData: [],
      selectList: [],
      dialogTitle: "",
      loading: false, //是否加载
    };
  },

  components: {},

  computed: {},
  created() {
      this.requestMethodGet("/web/common/fuzzy/query/fuzzyQueryLubricationPoint", {})
        .then(res => {
          res = res.data;
         this.isloading = false
          if (res.code == 1000) {
            this.lubricatepointNameList = res.data
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
  mounted() {
    this.$_queryAccountList(); //获取短信日志列表
    // this.$_queryawaitBindList()
  },
  methods: {
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        200}px`;
    },
    handleClick(val)  {
      this.activeName =val.name
      this.pagenation.current = 1
      this.queryParams = {
        time: [], //姓名
        status: "" //状态
      }
      if(val.name == 'second') {
        this.$_queryAccountList(); //获取短信日志列表
      } else {
        this.$_queryawaitBindList() ;//获取数据日志列表
      }
    },
    // 获取账号列表
    $_queryAccountList() {
      this.loading = true;
      if(!this.queryParams.time) {
        this.queryParams.time = []
      }
      let params = { 
        lubricationPointNumber:this.$route.query.lubricationPointNumber,
        status:this.queryParams.status,
        sendTimeBegin:this.queryParams.time[0] || '',
        sendTimeEnd:this.queryParams.time[1] || '',
         ...this.pagenation
      };
      this.newsTableData = []
      this.requestMethodGet("/iot/device/lubricationPointMessage/sms/listByPage", params)
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
    $_queryawaitBindList(){
      this.loading = true;
      if(!this.queryParams.time) {
        this.queryParams.time = []
      }
      let params = { 
        lubricationPointNumber:this.$route.query.lubricationPointNumber,
        status:this.queryParams.status,
        sendTimeBegin:this.queryParams.time[0] || '',
        sendTimeEnd:this.queryParams.time[1] || '',
         ...this.pagenation
      };
      this.dataRecordTableData = []
      this.requestMethodGet("/iot/device/lubricationPointMessage/data/listByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.dataRecordTableData = res.data.list;
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
    // 查询
    handleSearchTableData(e) {
      this.pagenation.current = 1;
      if( this.activeName == 'second') {
        this.$_queryAccountList(); //获取短信日志列表
      } else {
        this.$_queryawaitBindList() ;//获取数据日志列表
      }
      if(e.target) {
        let target = e.target;
        if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
            target = e.target.parentNode;
        }
        target.blur()
      }
    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
       if( this.activeName == 'second') {
        this.$_queryAccountList(); //获取短信日志列表
      } else {
        this.$_queryawaitBindList() ;//获取数据日志列表
      }
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      if( this.activeName == 'second') {
        this.$_queryAccountList(); //获取短信日志列表
      } else {
        this.$_queryawaitBindList() ;//获取数据日志列表
      }
    },
  }
};
</script>
<style lang='less'>
.record-management {
  padding: 10px 25px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin: 15px 0 30px;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color:rgba(254, 0, 12, 1) !important;
      border-color:rgba(254, 0, 12, 1) !important;
  }
  .el-radio-button__inner:hover{
      color: rgba(254, 0, 12, 1) !important;
  }
  .is-active .el-radio-button__inner:hover {
      color: #fff !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f7fa !important;
  }
  // .el-pagination.is-background .el-pager li:not(.disabled).active {
  //   background:red !important;
  // }
  .el-tabs__item.is-active {
    color:red !important;
    font-weight: 900 !important;
  }
  .el-tabs__active-bar {
    background-color: red !important;
  }
  .el-tabs__item:hover {
    color:red !important;
  }
  .el-pagination{
    position: fixed;
    bottom:25px;
    right: 25px;
    // .el-pagination__sizes {
    //   display: none;
    // }
  }
}
</style>
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
</style>