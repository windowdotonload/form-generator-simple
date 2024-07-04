<!--
* @description 账号管理
* @fileName accountManagement.vue
* @author vvx
* @date 2020/05/15 15:30:23
* @version V1.0.0
!-->
<template>
  <div class="equipment-management" :style="mainminheight">
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="联网设备" name="first">
        <el-row :gutter="20">
            <el-col :span="24" class="equipment-management-serach-item">
                <label for>公司名称：</label>
                <el-select
                  v-model="queryParams.companyNumber"
                  size="small"
                  filterable
                  remote
                  clearable
                  reserve-keywords
                  style="width:15%;margin-right:20px"
                  placeholder="请输入公司名称"
                  :remote-method="remoteMethod"
                  @change="onChangeCompanyName"
                  @focus="focusChange('companyNumber')"
                  :loading="isloading">
                  <el-option
                    v-for="item in companyNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            <!-- </el-col> -->
            <!-- <el-col :span="6" class="equipment-management-serach-item"> -->
                <label for>设备名称：</label>
                <el-select
                  v-model="queryParams.deviceNumber"
                  size="small"
                  filterable
                  remote
                  clearable
                  maxlength="25"
                  reserve-keywords
                  style="width:15%;margin-right:20px"
                  placeholder="请输入设备名称"
                  :remote-method="remoteDeviceMethod"
                  @change="onChangeDeviceName"
                  @focus="focusChange('deviceNumber')"
                  :loading="isloading">
                  <el-option
                    v-for="item in equipmentNameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

                 <label for>润滑点名称：</label>
                <el-select
                  v-model="queryParams.lubricationPointNumber"
                  size="small"
                  filterable
                  remote
                  clearable
                  maxlength="25"
                  reserve-keywords
                  style="width:15%;margin-right:20px"
                  placeholder="请输入润滑点名称"
                  :remote-method="remoteLubricationPointMethod"
                  @change="handleSearchTableData"
                  @focus="focusChange()"
                  :loading="isloading">
                  <el-option
                    v-for="item in lubricationPointNameList"
                    :key="item.lubricationPointNumber"
                    :label="item.lubricationPointName"
                    :value="item.lubricationPointNumber">
                  </el-option>
                </el-select>
            <!-- </el-col> -->
            <!-- <el-col :span="6" class="equipment-management-serach-item"> -->
            </el-col>
        </el-row>
            <!-- 表格 -->
            <el-table
            ref="accountTable"
            :key="key"
            row-key="id"
            :data="accountTableData"
            tooltip-effect="dark"
            style="width: 100%"
            @row-click="handleMonitor"
            :header-cell-style="{background:'#f7f7f7'}"
            v-loading="loading"
            stripe
            >
            <el-table-column prop="companyName" label="公司名称" min-width="15%"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="deviceName" label="设备名称" min-width="15%"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="region" label="区域" min-width="15%"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="lubricationPointName" label="润滑点名称" min-width="20%"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="sensorNum" label="传感器数量" min-width="10%" ></el-table-column>
            <el-table-column label="操作" min-width="8%" align="center">
                <i class="el-icon-share"></i>
                <template slot-scope="scope">
                <el-link
                    type="danger"
                    v-has="IotEPMonitBtn"
                    @click="handleMonitor(scope.row)"
                    style="margin-right:10px;"
                >监测</el-link>
                <em style="color:#ccc">|</em>
                <el-link
                    type="danger"
                    v-has="IotEPConfigBtn"
                    @click="handleConfiguration(scope.row)"
                    style="margin-left:10px"
                >配置</el-link>
                </template>
            </el-table-column>
            </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="配置管理" name="second">    
            <span slot="label">待绑定设备<span style="color:#fe000c" v-if="allTotalNum>0"> ({{allTotalNum}})</span></span>
               <el-row :gutter="20">
            <el-col :span="24" class="equipment-management-serach-item">
                <label for>产品(物联网平台)：</label>
                <el-select
                v-model="queryParams.productKey"
                @change="handleSearchTableData"
                style="width:15%;margin-right:20px"
                size="small"
                clearable
                >
                <el-option
                    v-for="item in productionList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                ></el-option>
                </el-select>
            <!-- </el-col>
            <el-col :span="6" class="equipment-management-serach-item"> -->
                <label for>备注名称：</label>
                <el-input
                v-model="queryParams.nickName"
                @change="handleSearchTableData"
                size="small"
                maxlength="25"
                placeholder="请输入"
                style="width:15%;margin-right:20px"
                clearable
                ></el-input>
            <!-- </el-col>
            <el-col :span="6" class="equipment-management-serach-item"> -->
                <el-button type="danger" plain icon="el-icon-refresh" @click="handleRefresh" style="float:right" size="small" v-has="IotEPRefreshBtn">同步</el-button>
            </el-col>
        </el-row>
              <!-- 表格 -->
                <el-table
                ref="awaitBindTableData"
                :key="key"
                row-key="id"
                :data="awaitBindTableData"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{background:'#f7f7f7'}"
                v-loading="loading"
                stripe
                >
                <el-table-column prop="deviceName" label="DeviceName（序列号）" min-width="12%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="nickName" label="备注名称" min-width="15%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="设备所属产品" min-width="15%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="监测指标" min-width="20%" >
                     <template slot-scope="scope">
                       <el-tooltip class="item" effect="dark" placement="top" v-if="scope.row.name">
                        <div slot="content"  v-html="ToBreak(scope.row.name)">
                        </div>
                        <span>{{ scope.row.name.length>30?scope.row.name.substring(0,30)+'...':scope.row.name }}</span>
                       </el-tooltip>
                        <span v-else style="color:#ddd">请先定义物模型</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="8%" >
                    <i class="el-icon-share"></i>
                    <template slot-scope="scope">
                    <el-link
                        v-if="scope.row.name"
                        type="danger"
                        @click="handleEdit(scope.row)"
                        style="margin-right:10px;"
                    >绑定</el-link>
                    <span v-else style="margin-right:10px;color:#ddd">绑定</span>
                    </template>
                </el-table-column>
                </el-table>
        </el-tab-pane>
        <!-- 已删除的设备 -->
        <el-tab-pane label="配置管理" name="third">    
            <span slot="label">已删除设备<span style="color:#fe000c" v-if="allTotalNum>0"></span></span>
               <el-row :gutter="20">
            <el-col :span="24" class="equipment-management-serach-item">
                <label for>产品(物联网平台)：</label>
                <el-select
                v-model="queryDeleteParams.productKey"
                @change="handleSearchTableData"
                size="small"
                style="width:15%;margin-right:20px"
                clearable
                >
                <el-option
                    v-for="item in productionList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                ></el-option>
                </el-select>
            <!-- </el-col>
            <el-col :span="6" class="equipment-management-serach-item"> -->
                <label for>备注名称：</label>
                <el-input
                v-model="queryDeleteParams.nickName"
                @change="handleSearchTableData"
                size="small"
                maxlength="25"
                placeholder="请输入"
                style="width:15%;margin-right:20px"
                clearable
                ></el-input>
            <!-- </el-col>
            <el-col :span="6" class="equipment-management-serach-item"> -->
            </el-col>
        </el-row>
              <!-- 表格 -->
                <el-table
                ref="deleteTableData"
                :key="key"
                row-key="id"
                :data="deleteTableData"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{background:'#f7f7f7'}"
                v-loading="loading"
                stripe
                >
                <el-table-column prop="deviceName" label="DeviceName（序列号）" min-width="12%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="nickName" label="备注名称" min-width="15%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="设备所属产品" min-width="15%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="name" label="监测指标" min-width="20%"  >
                     <template slot-scope="scope">
                        <!-- <span v-if="scope.row.name">{{scope.row.name}}</span> -->
                        <el-tooltip class="item" effect="dark" placement="top" v-if="scope.row.name">
                        <div slot="content"  v-html="ToBreak(scope.row.name)">
                        </div>
                        <span>{{ scope.row.name.length>30?scope.row.name.substring(0,30)+'...':scope.row.name }}</span>
                       </el-tooltip>
                        <span v-else style="color:#ddd">请先定义物模型</span>
                    </template>
                </el-table-column>
                </el-table>
        </el-tab-pane>
    </el-tabs>
    <el-pagination
      v-if="totalNumber>0"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenation.current"
      :page-size="pagenation.size"
      :page-sizes="[5,10,20,30,50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNumber"
      style="float: right;display:flex; margin-top: 10px"
    ></el-pagination>

    <!-- 绑定传感器 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
      >
      <el-row>
          <el-col :span="12">
            <el-form-item label="公司名称：" prop="companyNumber">
                <el-select
                  size="small"
                  v-model="ruleForm.companyNumber"
                  filterable
                  remote
                  clearable
                  reserve-keywords
                  style="width:280px"
                  placeholder="请输入公司名称"
                  @change="onChangeCompanyName"
                  :remote-method="remoteCompanyMethod"
                  :loading="isloading">
                  <el-option
                    v-for="item in companyNameAllList"
                    :key="item.companyNumber"
                    :label="item.companyName"
                    :value="item.companyNumber">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备名称：" prop="deviceNumber">
                <el-select
                  size="small"
                  v-model="ruleForm.deviceNumber"
                  filterable
                  remote
                  clearable
                  reserve-keywords
                  style="width:280px"
                  placeholder="请输入设备名称"
                  @change="onChangeEquipmentName"
                  :remote-method="remoteDeviceAllMethod"
                  :loading="isloading">
                  <el-option
                    v-for="item in equipmentNameAllList"
                    :key="item.deviceNumber"
                    :label="item.deviceName"
                    :value="item.deviceNumber">
                  </el-option>
                </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="润滑点名称：" prop="lubricationPointNumber">
              <el-select
                size="small"
                v-model="ruleForm.lubricationPointNumber"
                clearable
                style="width:280px"
              >
                <el-option
                  v-for="item in lubricatepointNameList"
                  :key="item.lubricationPointNumber"
                  :label="item.lubricationPointName"
                  :value="item.lubricationPointNumber"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button plain @click="handleCancle('ruleForm')" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmit('ruleForm')" size="small">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import equipment from "./iotMixins/equipment.js";
export default {
  mixins: [equipment],
  data() {
    return {
    }
  },

  components: {},

  computed: {},
  created() {
  },
  mounted() {
    
  },
  methods: {
    
  }
};
</script>
<style lang='less'>
.equipment-management {
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
  .el-tabs__item.is-active {
    color:#fe000c !important;
    font-weight: 900 !important;
  }
  .el-tabs__active-bar {
    background-color: #fe000c !important;
  }
  .el-tabs__item:hover {
    color:#fe000c !important;
  }
  .el-pagination{
    position: fixed;
    bottom:25px;
    right: 25px;
  }
}
</style>
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
</style>