<!--
* @description 人员管理
* @fileName personnelList.vue
* @author vvx
* @date 2020/04/16 19:48:33
* @version V1.0.0
!-->
<template>
  <div class="personnel-manage" :style="mainminheight">
    <!-- 查询条件 -->
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="6" class="personnel-manage-serach-item">
        <label for style="width:auto">姓名：</label>
        <el-input size="small" v-model="queryParams.nameCn"  @change="handleSearchTableData"   placeholder="请输入" style="width:70%;" clearable></el-input>
      </el-col>
      <el-col :span="6" class="personnel-manage-serach-item">
        <label for>人员类型：</label>
        <el-select
        @change="handleSearchTableData"
          size="small"
          v-model="queryParams.userType"
          placeholder="--请选择--"
          style="width:70%;"
          clearable
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" class="personnel-manage-serach-item">
        <label for>账号：</label>
        <el-input size="small" v-model="queryParams.phone" @change="handleSearchTableData" placeholder="请输入" style="width:70%;" clearable></el-input>
      </el-col>
      <el-col :span="6" class="personnel-manage-serach-item">
        <label for>所属公司：</label>
        <el-input size="small" v-model="queryParams.companyName" placeholder="请输入" @change="handleSearchTableData" style="width:70%;" clearable></el-input>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="6" class="personnel-manage-serach-item">
        <label for style="width:auto">状态：</label>
        <el-select size="small" v-model="queryParams.state" placeholder="请选择状态"  @change="handleSearchTableData" clearable style="width:70%;">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            @change="handleChage"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6" class="personnel-manage-serach-item">
        <label for>创建日期：</label>
        <el-date-picker
        @change="handleSearchTableData"
          v-model="queryParams.createTime"
          align="right"
          type="date"
           size="small"
          style="width:70%"
          placeholder="--请选择--"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          clearable
        ></el-date-picker>
      </el-col>
      <el-col :span="6" class="personnel-manage-serach-item">
        <label for></label>
        <el-button @click="handleClearSearch" size="small">重置</el-button>
      </el-col>
    </el-row>
    <!-- 表格操作 -->
    <el-row style="margin-bottom:20px;" type="flex" align="right">
      <el-col :span="24" align="right">
        <!-- <el-button v-if="selectList.length > 0" @click="handleBatchDownload">下载</el-button> -->
        <el-button type="danger" plain @click="handleDownload" v-has='PEDownloadBtn' size="small">下载数据</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      ref="customerTable"
      :key="key"
      row-key="id"
      :data="personnelTableData"
      tooltip-effect="dark"
      style="width: 100%"
      :header-cell-style="{background:'#f7f7f7'}"
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="phone" label="账号" min-width="8%" ></el-table-column>
      <el-table-column prop="nameCn" label="姓名" min-width="8%" ></el-table-column>
      <el-table-column
        prop="companyName"
        :show-overflow-tooltip="true"
        label="所属公司"
        min-width="12%"
        
      ></el-table-column>
      <el-table-column prop="userType" label="人员类型" min-width="10%" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.roleNames !==null">{{scope.row.roleNames}}</span>
          <div v-else>
            <span>{{scope.row.userType ==1?'工程师':scope.row.userType==2?'内勤':scope.row.userType==3?'工业客户':'管理员'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="账号状态" min-width="8%" >
        <template slot-scope="scope">
          <span>{{scope.row.state ==1?'正常':'禁用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建日期" min-width="10%" ></el-table-column>
      <el-table-column label="操作" min-width="8%" align="center">
        <i class="el-icon-share"></i>
        <template slot-scope="scope">
          <el-link type="danger" @click="handleLook(scope.row)" style="margin-right:10px">查看</el-link><em v-has='PEEditBtn'>|</em>
          <el-link type="danger" @click="handleEdit(scope.row)" v-has='PEEditBtn'>&nbsp;编辑</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="totalNumber"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenation.current"
      :page-size="pagenation.size"
      :page-sizes="[10,20,30,50]"
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
    return {
      mainminheight: `height:${document.documentElement.clientHeight - 220}px`,
      queryParams: {
        nameCn: "", //姓名
        userType: "", //
        phone: "", //
        companyName: "",
        state: "", //
        createTime: ""
      },
      typeList: [
        { value: "1", label: "工程师" },
        { value: "2", label: "内勤" },
        { value: "3", label: "工业客户" }
      ], //类型
      statusList: [
        { value: "1", label: "正常" },
        { value: "0", label: "禁用" }
      ], //状态列表
      pickerOptions: {
        shortcuts: [
          {
            text: "选择今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          }
        ]
      },
      personnelTableData: [], //设备列表
      selectList: [], //选中的设备列表
      loading: false, //是否显示加载动画，默认隐藏
      totalNumber: 0, //总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      }
    };
  },

  components: {},

  computed: {},
  beforeRouteLeave(to, from, next) {
    this.queryParams.current = this.pagenation.current
    this.queryParams.size = this.pagenation.size
    sessionStorage.setItem("queryParams", JSON.stringify(this.queryParams));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/PersonnelList/PersonnelDetail") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  mounted() {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
      this.pagenation.current = this.queryParams.current 
      this.pagenation.size = this.queryParams.size
    }
    this.$_getPersonnerData(); //获取人员列表
  },

  methods: {
    // 查询
    handleSearchTableData() {
      this.pagenation.current = 1;
      this.$_getPersonnerData();
    },
    handleChage(val) {
    },
    // 重置
    handleClearSearch() {
      this.queryParams = {
        nameCn: "", //姓名
        userType: "", //
        phone: "", //
        companyName: "",
        state: "", //
        createTime: ""
      };
      this.pagenation = {
        current: 1,
        size: 30
      };
      this.$_getPersonnerData();
    },
    // 下载
    handleDownload() {
      const loading = this.$loading({
          lock: true,
          text: '数据下载中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      let url = '', paramObj = {}
      if (this.selectList.length > 0) {
        url = '/web/user/exportCustomerExcel'
        paramObj = {
          userNumbers: this.selectList.toString(),
          responseTypeBlob: true
        }
      } else {
        url = '/web/user/exportUserExcelAll'
        paramObj = {
          userType: this.queryParams.userType,
          nameCn: this.queryParams.nameCn,
          phone: this.queryParams.phone,
          companyName: this.queryParams.companyName,
          state: this.queryParams.state,
          createTime: this.queryParams.createTime,
          responseTypeBlob: true
        }
      }
        this.requestMethodGet(url, paramObj).then(res => {
          let data = res.data
          let fileReader = new FileReader()
          let that = this
          loading.close()
          fileReader.onload = function () {
          try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
              that.$message({
                  message: jsonData.msg,
                  type: "error",
              });
              return;
              }
          } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
              type: "application/vnd.ms-excel",
              });
              const objectUrl = URL.createObjectURL(blob);
              // window.location.href = objectUrl
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", "用户.xls");
              document.body.appendChild(link);
              link.click();
          }
          };
          fileReader.readAsText(data);
        })
        .catch((res) => {
          loading.close()
        });
    },
    //表格多选事件
    handleSelectionChange(select) {
      this.selectList = [];
      select.forEach(item => {
        this.selectList.push(item.userNumber);
      });
    },
    // 批量下载
    // handleBatchDownload() {},
    // 查看
    handleLook(row) {
      this.$router.push({
        path: "/PersonnelList/PersonnelDetail",
        query: {
          userNumber: row.userNumber
        }
      });
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: "/PersonnelList/EditPersonnel",
        query: {
          userNumber: row.userNumber
        }
      });
    },
    // size change
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getPersonnerData();
    },
    //current change
    handleCurrentChange(current) {
      this.pagenation.current = current;
      this.$_getPersonnerData();
    },

    $_getPersonnerData() {
      this.loading = true;
      let params = { ...this.queryParams, ...this.pagenation };
      this.requestMethodGet("/web/user/userList", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            res.data.list.forEach(item => {
              item.createTime = this.moment(new Date(item.createTime)).format(
                "YYYY-MM-DD"
              );
            });
            this.personnelTableData = res.data.list;
            this.totalNumber = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        220}px`;
    }
  }
};
</script>
<style lang='less' scoped>
.personnel-manage {
  padding: 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: 28%;
      text-align: right;
      padding-bottom: 10px;
    }
  }
}
</style>