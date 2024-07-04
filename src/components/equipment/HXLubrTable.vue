<template>
  <div style="position:relative;">
    <div class="account-management" :style="mainminheight" id="accountManage">
      <div class="toolbox-con flexBetween" style="margin-top:0;">
        <div class="tool-con">
          <el-button size="small" plain @click="handleDownload" :disabled="lubriTableData.length==0">下载数据</el-button>
          <el-button size="small" plain @click="handleClearSearch">重置</el-button>
        </div>
      </div>
      <div style="margin:12px 0;font-size:12px;color:#dd0000;"><i class="el-icon-warning" style="margin-right:8px"></i><span style="color:#dd0000">注意：1、该推荐为一般建议，参考设备制造商的具体润滑要求。2、油箱容量仅供参考，因设备厂家型号的不同而有差异。</span></div>
      <!-- 表格 -->
      <custom-table
        class="table"
        ref="accountTable"
        :tableHeader="tableDataHeader"
        :tableData="lubriTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        @changeSearch="tableTitleSearch"
        @selectionChange="handleSelectionChange"
      >
      </custom-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        style="float: right;display:flex; margin-top: 10px"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import customField from "../tableComponents/customField.vue";
import customTable from "../tableComponents/customTable";
import { baseRemoteOauth2 } from "@/api/api";
export default {
  data() {
    return {
      industryList: [],
      queryParams: {
        industryCode: "",
        depName: "",
        deviceName: "",
        lubType: "",
        mainLubPoint: "",
        greaseName: "",
        syntheticOilName: "",
        mineralOilName: "",
      },
      operationDialogFlag: false,
      loadingTransfer:false,
      customFieldlist: [],
      tableHeight: null,
      tableDataHeader: [
        { filterType: "selection", paramValue: "industryCode", changeValue:"", selectOptions: [], label: "行业", prop: "industryCode", width: "120", tooltip: true },
        { filterType: "", paramValue: "", changeValue:"", selectOptions: [], label: "车间/部门", prop: "depName", width: "120", tooltip: true },
        { filterType: "", paramValue: "", changeValue:"", selectOptions: [], label: "设备名称", prop: "deviceName", width: "120", tooltip: true },
        { filterType: "", paramValue: "", changeValue:"", selectOptions: [], label: "主要润滑点", prop: "mainLubPoint", width: "120", tooltip: true },
        { filterType: "selection", paramValue: "lubType", changeValue:"", label: "润滑剂类型", prop: "lubType", width: "120", tooltip: true },
        { filterType: "input", paramValue: "syntheticOilName", changeValue:"", label: "润滑推荐-合成油", prop: "syntheticOil", width: "150", tooltip: true },
        { filterType: "input", paramValue: "greaseName", changeValue:"", label: "润滑推荐-润滑脂", prop: "grease", width: "150", tooltip: true },
        { filterType: "input", paramValue: "mineralOilName", changeValue:"", label: "润滑推荐-矿物油", prop: "mineralOil", width: "150", tooltip: true },
        { label: "油箱容量参考值", prop: "volume", width: "120", tooltip: true },
      ],
      mainminheight: `height:${document.documentElement.clientHeight - 150}px`,
      accountManageHeight: 0,
      formDivHeight: 0,
      pagenation: {
        current: 1,
        size: 10
      },
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      totalNumber: 0, // 总条数
      lubriTableData: [], // 账号数据
      loading: false, // 是否加载
      gioFilterTypeMap:{
        industryCode:"行业",
        lubType:"润滑剂类型",
        syntheticOilName:"润滑推荐-合成油",
        greaseName:"润滑推荐-润滑脂",
        mineralOilName:"润滑推荐-矿物油", 
      }
    };
  },
  components: {
    "custom-field": customField,
    "custom-table": customTable,
  },
  computed: {},
  created() {},
  async mounted() {
    const res = await this.requestMethodGet('/core/device/oil/getCoreDeviceOilByKey', {searchKey:'lubType',size:200,current:1})
    if(res.data.code==1000){
      let list = res.data.data.list
      list.forEach(item=>{
        item.code = item.value
        item.name = item.value
      })
      this.tableDataHeader[4].selectOptions=list
    } 
    this.$_getIndustryData();
    this.$_queryLubriList(); // 获取列表
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 150}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
  },
  methods: {
    async tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if((obj.paramValue=='industryCode'||obj.paramValue=='depName')){
        if(obj.paramValue=='industryCode'){
          this.tableDataHeader[1].selectOptions=[]
          this.tableDataHeader[1].filterType=''
          this.tableDataHeader[1].changeValue=''
          this.tableDataHeader[1].paramValue=''
          this.tableDataHeader[2].selectOptions=[]
          this.tableDataHeader[2].filterType=''
          this.tableDataHeader[2].changeValue=''
          this.tableDataHeader[2].paramValue=''
          this.tableDataHeader[3].selectOptions=[]
          this.tableDataHeader[3].filterType=''
          this.tableDataHeader[3].changeValue=''
          this.tableDataHeader[3].paramValue=''
          this.queryParams.industryCode = ''
          this.queryParams.depName=''
          this.queryParams.deviceName=''
          this.queryParams.mainLubPoint=''
          if(searchVal.length==0){
            this.pagenation.current = 1;
            this.$_queryLubriList()
            return
          }
        }
        if(obj.paramValue=='depName'){
          this.tableDataHeader[2].selectOptions=[]
          this.tableDataHeader[2].filterType=''
          this.tableDataHeader[2].changeValue=''
          this.tableDataHeader[2].paramValue=''
          this.tableDataHeader[3].selectOptions=[]
          this.tableDataHeader[3].filterType=''
          this.tableDataHeader[3].changeValue=''
          this.tableDataHeader[3].paramValue=''
          this.queryParams.depName=''
          this.queryParams.deviceName=''
          this.queryParams.mainLubPoint=''
          if(!searchVal){
            this.pagenation.current = 1;
            this.$_queryLubriList()
            return
          }
        }
        let url = obj.paramValue=='industryCode'?'/core/device/oil/getExistDepName':'/core/device/oil/getExistDeviceName'
        let paramObj = {name:searchVal,size:200,current:1}
        if(obj.paramValue=='depName'){
          paramObj.parentName = this.tableDataHeader[0].changeValue
        }
        const res = await this.requestMethodPost(url, paramObj)
        if(res.data.code==1000){
          res.data.data.list.forEach(item=>{
            item.code=item.name
          })
          if(obj.paramValue=='industryCode'){
            this.tableDataHeader[1].selectOptions=res.data.data.list
            this.tableDataHeader[1].paramValue = 'depName'
            this.queryParams[obj.paramValue] = searchVal
            if(this.tableDataHeader[0].changeValue) this.tableDataHeader[1].filterType = 'selection'
          }else if(obj.paramValue=='depName'){
            this.tableDataHeader[2].selectOptions=res.data.data.list
            this.tableDataHeader[2].paramValue = 'deviceName'
            if(this.tableDataHeader[1].selectOptions.length>0){
              this.tableDataHeader[1].selectOptions.forEach(item=>{
                if(item.code==searchVal) this.queryParams[obj.paramValue] = item.name
              })
            }else{
             this.queryParams[obj.paramValue] = ''
            }
            if(this.tableDataHeader[1].changeValue) this.tableDataHeader[2].filterType = 'selection'
          }
        }
      }else if(obj.paramValue=='deviceName'){
        this.tableDataHeader[3].selectOptions=[]
        this.tableDataHeader[3].filterType=''
        this.tableDataHeader[3].changeValue=''
        this.tableDataHeader[3].paramValue=''
        this.queryParams.deviceName=''
        this.queryParams.mainLubPoint=''
        if(!searchVal) {
          this.pagenation.current = 1;
          this.$_queryLubriList()
          return
        }
        const res = await this.requestMethodGet('/core/device/oil/getExistMainLubPoint', {firstName:this.tableDataHeader[0].changeValue,parentName:this.tableDataHeader[1].changeValue,name:searchVal,size:200,current:1})
        if(res.data.code==1000){
          let dataList = []
          res.data.data.list.forEach(item=>{
            dataList.push({code:item.name})
          })
          this.tableDataHeader[3].selectOptions=dataList
          this.tableDataHeader[3].paramValue='mainLubPoint'
          if(this.tableDataHeader[2].selectOptions.length>0){
            this.tableDataHeader[2].selectOptions.forEach(item=>{
              if(item.code==searchVal) this.queryParams[obj.paramValue] = item.name
            })
          }else{
            this.queryParams[obj.paramValue] = ''
          }
        }
        if(this.tableDataHeader[2].changeValue) this.tableDataHeader[3].filterType = 'selection'
      }else if(obj.paramValue=='mainLubPoint'&&searchVal){
        if(this.tableDataHeader[3].selectOptions.length>0){
          this.tableDataHeader[3].selectOptions.forEach(item=>{
            if(item.code==searchVal) this.queryParams[obj.paramValue] = item.name
          })
        }else{
          this.queryParams[obj.paramValue] = ''
        }
      }else{
        this.queryParams[obj.paramValue] = obj.changeValue
      }
      this.pagenation.current = 1;
      this.$_queryLubriList()
    },
    // 获取行业列表
    $_getIndustryData () {
      this.requestMethodPost('/core/device/oil/getExistIndustryCode', {name:'',size:200,current:1}).then((res) => {
        res = res.data;
        if (res.code == 1000) {
          if (res.data && res.data.list.length > 0) {
            res.data.list.forEach(item=>{
              this.industryList.push({code: item.name,name:item.name})
            })
          }
          this.tableDataHeader[0].selectOptions = this.industryList
          this.$_queryLubriList(); // 获取列表
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
          });
        }
      });
    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.$_queryLubriList(); // 获取日志列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_queryLubriList(); // 获取短信日志列表
    },
    // 重置
    handleClearSearch() {
      this.queryParams = {
        industryCode: "",
        depName: "",
        deviceName: "",
        mainLubPoint: "",
        lubType: "",
        syntheticOilName: "",
        greaseName: "", 
        mineralOilName: "", 
      };
      this.pagenation = {
        current: 1,
        size: 10
      };
      this.tableDataHeader[1].selectOptions = []
      this.tableDataHeader[1].filterType = ''
      this.tableDataHeader[1].paramValue = ''
      this.tableDataHeader[2].selectOptions = []
      this.tableDataHeader[2].filterType = ''
      this.tableDataHeader[2].paramValue = ''
      this.tableDataHeader[3].selectOptions = []
      this.tableDataHeader[3].filterType = ''
      this.tableDataHeader[3].paramValue = ''
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
      })
      this.$_queryLubriList();
    },
    // 下载
    handleDownload() {
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let paramObj = {
        industryCode: this.queryParams.industryCode,
        depName: this.queryParams.depName,
        deviceName: this.queryParams.deviceName,
        lubType: this.queryParams.lubType,
        mainLubPoint: this.queryParams.mainLubPoint,
        greaseName: this.queryParams.greaseName,
        syntheticOilName: this.queryParams.syntheticOilName,
        mineralOilName: this.queryParams.mineralOilName,
        status: 1,
        responseTypeBlob: true
      }
      this.requestMethodGet("/core/device/oil/exportCoreDeviceOil", paramObj).then(res => {
        loading.close();
        let data = res.data;
        let fileReader = new FileReader();
        let that = this;
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
            link.setAttribute("download", "核心设备润滑油表.xls");
            document.body.appendChild(link);
            link.click();
          }
        };
        fileReader.readAsText(data);
        this.$gio.Clicktodownloaddata()
      })
      .catch(res => {
        loading.close();
      });
    },
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if (document.getElementById("accountManage")) {
          this.accountManageHeight = document.getElementById("accountManage").clientHeight;
        }
        if (document.getElementById("formDiv")) {
          this.formDivHeight = document.getElementById("formDiv").clientHeight;
        }
        this.tableHeight = Number(this.accountManageHeight) - Number(this.formDivHeight) - 112;
      }, 200);
    },
    // 自定义字段
    getCustomFields(data) {
      this.customFieldlist = data;
      let tableDataHeader = [];
      data.forEach(item => {
        if (item.visible != 0) {
          tableDataHeader.push(this.tableDataHeaderInit[item.fieldName]);
        }
      });
      if (this.tableDataHeaderInit.selection) {
        tableDataHeader.unshift(this.tableDataHeaderInit.selection);
      }
      this.tableDataHeader = tableDataHeader;
    },
    // 获取列表
    $_queryLubriList() {
      this.loading = true;
      let params = { ...this.queryParams, ...this.pagenation, status:1 };
      this.lubriTableData = [];
      this.requestMethodGet("/core/device/oil/getCoreDeviceOilConf", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            this.lubriTableData = data;
            this.totalNumber = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
          let FiltertypeArrs = []
          Object.keys(params).forEach((key) => {
            if(params[key]){
              FiltertypeArrs.push(this.gioFilterTypeMap[key])
            }
          })
          this.$gio.Listfilter({
            Filtertype: FiltertypeArrs.filter(_ => _).join(',')
          })
        })
        .catch(res => {
          this.loading = false;
        });
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.account-management {
  padding: 0 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    margin-bottom: 20px;
    label {
      padding-bottom: 10px;
    }
  }
}
.confirm-tips {
  padding: 16px 24px;
  background: rgba(204, 221, 255, 0.2);
  border: 1px solid rgba(204, 221, 255, 0.4);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  .img_div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .img_text {
      font-size: 14px;
      color: #000;
      margin-top: 8px;
    }
  }
}
.tips_text {
  font-weight: 400;
  font-size: 14px;
  color: #000;
}
/deep/.operation-content {
  padding-bottom: 45px;
}
</style>
