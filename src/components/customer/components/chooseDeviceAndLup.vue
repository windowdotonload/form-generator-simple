<template>
  <div style="position:relative">
    <!-- 选择设备弹框 -->
    <el-dialog title="选择设备" :visible.sync="chooseDeviceAndLupDialog" width="70%" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelChoose">
      <!-- 搜索项 -->
      <el-form ref="searchForm" :model="searchForm" inline label-width="100px">
        <el-form-item label="设备名称">
          <el-input v-model="searchForm.deviceName" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
        </el-form-item>

        <el-form-item label="设备类型">
          <el-cascader
            size="small"
            placeholder="请选择"
            :options="deviceTypeList"
            v-model="searchForm.deviceType"
            filterable
            clearable
            @change="getDeviceData('refresh')"
            :props="{ value: 'code', label: 'name' }"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="所属车间">
          <el-select v-model="searchForm.workshopId" placeholder="请选择" size="small" clearable @change="getDeviceData('refresh')">
            <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备型号">
          <el-input v-model="searchForm.deviceModel" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
        </el-form-item>

        <el-form-item label="设备制造商">
          <el-input v-model="searchForm.manufacturer" placeholder="请输入" size="small" @change="getDeviceData('refresh')" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <div slot="label">
            <el-button size="small" @click="resetSearch">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <div>
        <el-table
          :data="deviceTableData"
          tooltip-effect="dark"
          ref="deviceTableRef"
          v-loading="loadingDevice"
          v-el-table-infinite-scroll="loadMore"
          :row-key="rowKey"
          @select="handleSelectDevice"
          @select-all="selectAllDevice"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="deviceName" min-width="8%" label="设备名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceTypeName" min-width="5%" label="设备类型" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceModel" min-width="6%" label="设备型号" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="manufacturer" min-width="6%" label="设备制造商" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="lubricationPointName" min-width="8%" label="润滑点名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="lubricationPointType" min-width="8%" label="润滑点设备类型" show-overflow-tooltip> </el-table-column>
          <p v-if="loadMoreDeviceFlag">加载中...</p>
          <p v-if="!loadMoreWorkshopFlag">没有更多了</p>
        </el-table>
      </div>

      <span slot="footer">
        <div>
          <el-button @click="cancelChoose" size="small">取 消</el-button>
          <el-button size="small" type="danger" @click="confirmChoose">确定</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    companyId:{
      type:Number,
      default:null
    },
    chooseDeviceAndLupDialog:{
      type:Boolean,
      default:false
    },
    checkedDevice:{
      type:Array,
      default:[]
    }
  },
  watch: {
    chooseDeviceAndLupDialog:function(val, oldVal) {
      if (val) {
        // 查询列表
        this.getDeviceData('refresh')
      }
    }
  },
  data() {
    return {
      searchForm: {
        deviceName: "",
        deviceType: [],
        deviceModel: "",
        workshopId: "",
        manufacturer: ""
      },
      workshopList: [],
      loadingDevice: false,
      loadMoreDeviceFlag: false,
      deviceCurrent: 1,
      deviceTypeList: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      deviceTableData: [],
      deviceTotal: 0,
      radioDeviceRow: {},
    };
  },
  created() {
    // 获取设备类型
    this.getDeviceTypeList();
    // 获取车间
    this.getWorkshopList()
  },
  methods: {
    getWorkshopList() {
      const params = {
        companyId: this.companyId,
        workshopName: "",
        current: 1,
        size: 300
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workshopList = list;
          if (this.workshopId) {
            this.searchForm.workshopId = this.workshopId;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    rowKey(row) {
      return row.id;
    },
    getDeviceTypeList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {}).then(res => {
        if (res.data.code == 1000) {
          this.deviceTypeList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getDeviceData(val) {
      if (val) {
        this.deviceCurrent = 1;
      }
      const params = {
        size: 30,
        current: this.deviceCurrent,
        ...this.searchForm
      };
     if(params.deviceType.length){
      params.deviceType = params.deviceType[params.deviceType.length-1]
     }
      params.companyId = this.companyId
      this.loadingDevice = true;
      this.requestMethodGet('/pes/pop/queryDeviceByPageForPop', params).then(res => {
        if (res.data.code == 1000) {
          let list = [];
          if (val) {
            this.$refs.deviceTableRef.clearSelection();
            list = res.data.data.list;
          } else {
            list = this.deviceTableData.concat(res.data.data.list);
          }
          this.deviceTableData = list;
          this.deviceTotal = res.data.data.totalCount;
          if (this.deviceTableData.length < this.deviceTotal) {
            this.loadMoreDeviceFlag = true;
          } else {
            this.loadMoreDeviceFlag = false;
          }
          if (list.length && this.checkedDevice.length) {
            this.$nextTick(()=>{
              for(let i=0;i<list.length;i++){
                for(let j=0;j<this.checkedDevice.length;j++){
                  if(list[i].lubricationPointId == this.checkedDevice[j].lubricationPointId){
                    this.$refs.deviceTableRef.toggleRowSelection(list[i], true);
                  }
                }
              }
            })
          }
          this.loadingDevice = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    loadMore() {
      if (this.loadMoreDeviceFlag && this.deviceTableData.length < this.deviceTotal) {
        ++this.deviceCurrent;
        this.getDeviceData();
      }
    },
    // 重置
    resetSearch() {
      for (let key in this.searchForm) {
        this.searchForm[key] = "";
      }
      this.searchForm.deviceType = [];
      this.getDeviceData("refresh");
    },
    // 选择设备
    handleSelectDevice(val, row) {
      if (!val.length) {
        this.$refs.deviceTableRef.clearSelection();
        return;
      }
      this.radioDeviceRow = row;
      this.$refs.deviceTableRef.clearSelection();
      this.$refs.deviceTableRef.toggleRowSelection(val.pop(), true);
    },
    // 全选
    selectAllDevice(val) {
      this.$refs.deviceTableRef.clearSelection();
      this.$refs.deviceTableRef.toggleRowSelection(this.radioDeviceRow, true);
    },
    // 取消选择
    cancelChoose() {
      this.checkedDevice = [];
      this.$refs.deviceTableRef.clearSelection();
      this.$emit("cancelChooseDeviceAndLup");
    },
    // 确定选择
    confirmChoose() {
      let checkArr = this.$refs.deviceTableRef.selection;
      if (!checkArr.length) {
        this.$message({
          type: "error",
          message: "请至少选择一个设备"
        });
        return;
      }
      const list = this.checkedDevice.concat(checkArr);
      this.$refs.deviceTableRef.clearSelection();
      this.$emit("confirmChooseLup",checkArr);
      this.chooseDeviceAndLupDialog = false
    }
  }
};
</script>
<style lang="less" scoped></style>
