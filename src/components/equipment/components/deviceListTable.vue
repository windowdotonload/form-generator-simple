<template>
  <div>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :key="key"
      row-key="id"
      :data="epTableData"
      tooltip-effect="dark"
      class="tableStyle"
      @row-click="handleCurrentChangeRow"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#f7f7f7' }"
      stripe
    >
      <el-table-column key="2" type="selection" width="55" align="center"></el-table-column>
      <el-table-column prop="deviceName" key="3" label="设备名称" min-width="15%" :show-overflow-tooltip="true" :render-header="renderHeader">
        <template slot-scope="scope">
          <div style="display: flex; align-items: center">
            <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.deviceName }}</span>
            <el-tag v-if="!scope.row.deviceActiveStatus" class="unActiveTag">非活跃</el-tag>
            <el-tag v-if="scope.row.deviceServiceStatus" class="unActiveTag" style="background: rgba(0, 136, 136, 0.1); color: rgb(0, 136, 136)">服务中</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="deviceTypeName" label="设备类型" min-width="10%" key="36" :show-overflow-tooltip="true" :render-header="renderHeader"></el-table-column>
      <el-table-column prop="lubricationPointNum" label="润滑点数" min-width="6%" key="88" :show-overflow-tooltip="true" :render-header="renderHeader"></el-table-column>
      <el-table-column prop="amountOfMonthCheckDevice" label="月度检查次数" min-width="6%" key="77" :show-overflow-tooltip="true" :render-header="renderHeader"></el-table-column>
      <el-table-column prop="amountOfAbnormalDevice" label="未处理异常数" min-width="6%" key="66" :show-overflow-tooltip="true" :render-header="renderHeader"></el-table-column>
      <el-table-column prop="companyName" label="所属客户" min-width="15%" key="88" :show-overflow-tooltip="true" :render-header="renderHeader" v-if="userInfo.userType < 2"></el-table-column>
      <el-table-column prop="workshopName" label="所属车间" min-width="8%" key="99" :show-overflow-tooltip="true" :render-header="renderHeader"></el-table-column>
      <el-table-column prop="dataIntegrityFlag" label="信息状态" min-width="5%" key="97" :show-overflow-tooltip="true" :render-header="renderHeader">
        <template slot-scope="scope">
          <span v-if="scope.row.dataIntegrityFlag == '1' && !scope.row.editNew && scope.row.lubricationPointNum > 0" style="color:#999;font-weight:800">已完善</span>
          <span v-if="scope.row.lubricationPointNum == '0'" style="color:#999;font-weight:800">无润滑点</span>
          <span v-if="scope.row.dataIntegrityFlag == '0' && scope.row.lubricationPointNum > 0" style="color:#dd0000;font-weight:800">待完善</span>
          <span
            v-if="scope.row.creatNew && scope.row.editNew && scope.row.dataIntegrityFlag != 0 && scope.row.updateTimeMills == scope.row.createTimeMills && scope.row.lubricationPointNum > 0"
            style="color:rgb(0,136,136);font-weight:800"
          >
            新创建
          </span>
          <span
            v-if="
              ((scope.row.editNew && scope.row.creatNew) || scope.row.editNew) &&
                scope.row.dataIntegrityFlag != 0 &&
                scope.row.updateTimeMills != scope.row.createTimeMills &&
                scope.row.lubricationPointNum > 0
            "
            style="rgb(153,153,153);font-weight:800"
          >
            刚修改
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="7%" align="center" key="1">
        <i class="el-icon-share"></i>
        <template slot-scope="scope">
          <el-link @click="handleLook(scope.row)" style="margin-right: 10px; color: #001450">查看</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="totalNumber"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-size="size"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      style="float: right; display: flex; margin-top: 10px"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    key: {
      type: [String, Number]
    },
    epTableData: {
      type: Array
    },
    totalNumber: {
      type: Number,
      default: 0
    },
    size: {
      type: Number
    },
    current: {
      type: Number
    }
  },
  data() {
    return {
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo")))
    };
  },
  methods: {
    renderHeader(h, { column, $index }) {
      // console.log(h, column, $index);
      const label = column.label;
      return [
        h(
          "el-tooltip",
          {
            props: {
              content: (function() {
                return label;
              })(),
              placement: "top"
            }
          },
          [h("span", {}, label)]
        )
      ];
    },
    handleLook(row) {
      this.$router.push({
        path: "/EquipmentProfile/EquipmentProfileDetail",
        query: {
          deviceNumber: row.deviceNumber,
          deviceId: row.id
        }
      });
      this.$gio.viewDevice({
        customer: row.companyName
      });
      this.$gio.toDeviceDetails({
        customer: row.companyName,
        entrance: "设备列表"
      });
    },
    handleCurrentChangeRow(row) {
      this.$emit("handleCurrentChangeRow", row);
    },
    handleSelectionChange(select) {
      this.$emit("handleSelectionChange", select);
    },
    handleSizeChange(size) {
      this.$emit("handleSizeChange", size);
    },
    handleCurrentChange(current) {
      this.$emit("handleCurrentChange", current);
    }
  }
};
</script>

<style scoped lang="less">
.tableStyle {
  // width: calc(100% - 40px);
  left: 0px;
  // padding:0 20px;
}
.unActiveTag {
  background: rgba(0, 0, 0, 0.05);
  color: rgb(102, 102, 102);
  border: none;
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
  margin-left: 10px;
}
</style>
