<template>
  <div class="customer-profile">
    <el-tabs v-model="activeName" @tab-click="tabsChange">
      <el-tab-pane label="对标产品查询" name="benchmark"></el-tab-pane>
      <el-tab-pane label="相容性查询" name="compatibility"></el-tab-pane>
    </el-tabs>
    <div class="toolbox-con flexBetween">
      <el-button plain size="small" @click="resetForm">重置筛选</el-button>
      <div class="tool-con">
        <el-button plain size="small" @click="batchEdit">批量编辑</el-button>
        <el-button plain size="small" @click="exportData">批量导出</el-button>
        <el-button plain type="danger" size="small" @click="importFile">批量导入</el-button>
        <el-button type="danger" plain size="small" @click="operationHistory">操作历史</el-button>
        <el-button type="danger" size="small" @click="create">{{ activeName == 'benchmark' ? '新建对标产品' : '新建兼容性查询'}}</el-button>
      </div>
    </div>
    <!-- 竞品表格 -->
    <custom-table
      :tableHeader="tableDataBenchmark"
      :tableData="benchmarkTableData"
      :tableHeight="tableHeight + ''"
      :loading="loading"
      class="moreSelectMar"
      v-if="activeName == 'benchmark'"
      @changeSearch="tableTitleSearch"  
      @changeSortTable="changeSortTable"
    >
      <template v-slot:status="slotProps">
        <el-table-column
          label="状态"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataBenchmark.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataBenchmark.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template slot="header">
            <column-header 
              title="状态"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectOptions="slotProps.slotData.selectOptions"
              @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <span :style="{ color: scope.row.status == '1' ? '#008888' : 'rgb(211,0,0)', 'font-weight': 800 }">{{ scope.row.status == "1" ? "已启用" : "已禁用" }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
      <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="80" align="center">
        <i class="el-icon-share"></i>
        <template slot-scope="scope">
          <el-link @click="editRow(scope.row)" style="margin-right:10px;color:#001450">编辑 </el-link>
        </template>
      </el-table-column>
    </custom-table>
    <!-- 相容性 -->
    <custom-table
      :tableHeader="tableDataCom"
      :tableData="compatibilityTableData"
      :tableHeight="tableHeight + ''"
      :loading="loading"
      class="moreSelectMar"
      v-if="activeName == 'compatibility'"
      @changeSearch="tableTitleSearch"  
      @changeSortTable="changeSortTable"
    >
      <template v-slot:compatibilityResult="slotProps">
        <el-table-column
          label="相容结果"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataCom.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataCom.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template slot="header">
            <column-header 
              title="相容结果"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectOptions="slotProps.slotData.selectOptions"
              @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.compatibilityResult == 0">边界相容</span>
            <span v-if="scope.row.compatibilityResult == 1">相容</span>
            <span v-if="scope.row.compatibilityResult == 2">不相容</span>
            <span v-if="scope.row.compatibilityResult == 3">无结论</span>
          </template>
        </el-table-column>
      </template>
      <template v-slot:status="slotProps">
        <el-table-column
          label="状态"
          :width="slotProps.slotData.width && slotProps.ind !== tableDataCom.length - 2 ? slotProps.slotData.width : ''"
          :resizable="slotProps.ind == tableDataCom.length - 2 ? false : true"
          show-overflow-tooltip
        >
          <template slot="header">
            <column-header 
              title="状态"
              :filterType="slotProps.slotData.filterType"
              :paramValue="slotProps.slotData.paramValue"
              :changeValue="slotProps.slotData.changeValue"
              :selectOptions="slotProps.slotData.selectOptions"
              @chSubmit="tableTitleSearch"/>
          </template>
          <template slot-scope="scope">
            <span :style="{ color: scope.row.status == '1' ? '#008888' : 'rgb(211,0,0)', 'font-weight': 800 }">{{ scope.row.status == "1" ? "已启用" : "已禁用" }}</span>
          </template>
        </el-table-column>
      </template>
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
      <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="80" align="center">
        <i class="el-icon-share"></i>
        <template slot-scope="scope">
          <el-link @click="editRow(scope.row)" style="margin-right:10px;color:#001450">编辑 </el-link>
        </template>
      </el-table-column>
    </custom-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      :page-size="size"
      :page-sizes="[10, 20, 30, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="activeName == 'benchmark' ? benchmarkTotalNumber : compatibilityTotalNumber"
      class="listOptimizePage"
    ></el-pagination>
    <!-- 对标弹框 -->
    <el-dialog
      :title="dialogType == 'add' ? '新建' : '编辑'"
      :visible.sync="dialogBenchmark"
      custom-class="customer-dialog"
      :close-on-click-modal="false"
      width="848px"
      top="40px"
      :key="dialogBenchmarkKey"
    >
      <div class="dialog-no-title" v-if="dialogType == 'edit'">
        <div style="margin-left:20px">编号</div>
        <div>{{ benchmarkDialogForm.competeNo }}</div>
      </div>
      <el-form ref="benchmarkDialogRef" :rules="benchmarkDialogRules" :model="benchmarkDialogForm" label-width="110px" label-position="top">
        <div class="info-title">
          <div class="line"></div>
          <div class="title">对标产品信息</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="品牌" prop="oilBrand">
              <el-input v-model="benchmarkDialogForm.oilBrand" size="small" maxlength="10" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="油品种类" prop="oilType">
              <el-input v-model="benchmarkDialogForm.oilType" size="small" maxlength="15" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品名称（英文）" prop="productNameEn">
              <el-input type="textarea" :rows="2" v-model="benchmarkDialogForm.productNameEn" size="small" maxlength="100" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品名称（中文）">
              <el-input type="textarea" :rows="2" v-model="benchmarkDialogForm.productName" size="small" maxlength="50" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="info-title">
          <div class="line"></div>
          <div class="title">美孚产品信息</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品名称（英文）" prop="mobilProductNameEn">
              <el-input type="textarea" :rows="2" v-model="benchmarkDialogForm.mobilProductNameEn" size="small" maxlength="100" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品名称（中文）">
              <el-input type="textarea" :rows="2" v-model="benchmarkDialogForm.mobilProductName" size="small" maxlength="50" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="benchmarkDialogForm.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="benchmarkDialogForm.status == 0">
          <el-col :span="22">
            <el-form-item label="禁用原因" prop="remark">
              <el-input type="textarea" :rows="2" v-model="benchmarkDialogForm.remark" size="small" maxlength="50" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelBenchmark('benchmarkDialogRef')" size="small">取消</el-button>
        <el-button type="danger" @click="submitBenchmark('benchmarkDialogRef')" size="small">提交</el-button>
      </span>
    </el-dialog>
    <!-- 相容性 -->
    <el-dialog
      :title="dialogType == 'add' ? '新建' : '编辑'"
      :visible.sync="dialogCompatibility"
      :key="dialogCompatibilityKey"
      custom-class="customer-dialog"
      :close-on-click-modal="false"
      width="848px"
      top="40px"
    >
      <div class="dialog-no-title" style="margin-bottom:20px" v-if="dialogType == 'edit'">
        <div style="margin-left:20px">编号</div>
        <div>{{ compatibilityDialogForm.compatibleNo }}</div>
      </div>
      <el-form ref="compatibilityDialogRef" :rules="compatibilityDialogRules" :model="compatibilityDialogForm" label-width="80px" label-position="top">
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="Project ID" prop="projectId">
              <el-input v-model="compatibilityDialogForm.projectId" onkeyup="value=value.replace(/[^0-9.]/g,'')" size="small" maxlength="5" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="11">
            <el-form-item label="兼容性类型" prop="compatibilityType">
              <el-radio-group v-model="compatibilityDialogForm.compatibilityType">
                <el-radio :label="0">润滑油</el-radio>
                <el-radio :label="1">润滑脂</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <div style="font-size:13px;color:rgb(153,153,153);margin-bottom:10px">Customer Country and Zone ：China-AP</div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="报告日期" prop="reportTime">
              <el-date-picker v-model="compatibilityDialogForm.reportTime" value-format="yyyy-MM-dd" size="small" clearable type="date" placeholder="请选择日期"> </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="info-title">
          <div class="line"></div>
          <div class="title">产品1</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品名称" prop="product">
              <el-input type="textarea" :rows="2" v-model="compatibilityDialogForm.product" size="small" maxlength="100" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品状态">
              <span>新油</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="info-title">
          <div class="line"></div>
          <div class="title">产品2</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item label="产品名称" prop="competitorProduct">
              <el-input type="textarea" :rows="2" v-model="compatibilityDialogForm.competitorProduct" size="small" maxlength="100" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="产品状态">
              <span>新油</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="info-title">
          <div class="line"></div>
          <div class="title">结论</div>
        </div>
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="相容性结果" prop="compatibilityResult">
              <el-radio-group v-model="compatibilityDialogForm.compatibilityResult">
                <el-radio :label="0">边界相容</el-radio>
                <el-radio :label="1">相容</el-radio>
                <el-radio :label="2">不相容</el-radio>
                <el-radio :label="3">无结论</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="22">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="compatibilityDialogForm.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="compatibilityDialogForm.status == 0">
          <el-col :span="22">
            <el-form-item label="禁用原因" prop="remark">
              <el-input type="textarea" :rows="2" v-model="compatibilityDialogForm.remark" size="small" maxlength="50" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCompatibility('compatibilityDialogRef')" size="small">取消</el-button>
        <el-button type="danger" @click="submitCompatibility('compatibilityDialogRef')" size="small">提交</el-button>
      </span>
    </el-dialog>
    <!-- 批量导入 -->
    <el-dialog title="批量导入" :visible.sync="dialogImportFlag" :close-on-click-modal="false" width="480px">
      <el-form ref="importForm">
        <el-form-item>
          <div>第一步： 下载模版，按照模版格式填写</div>
        </el-form-item>
        <el-form-item>
          <div style="color:rgb(0,20,80);cursor: pointer;display: flex;justify-content: center;" @click="downloadTemplate">下载模版（{{ activeName == "benchmark" ? "竞品" : "相容性" }}导入模版）</div>
        </el-form-item>
        <el-form-item>
          <div>第二步： 填写完模版后，上传Excel文件</div>
        </el-form-item>
        <el-form-item style="margin-top:20px;">
          <el-upload
            :class="{ hide: hideUpload || fileList.length > 0 }"
            drag
            action="uploadUrl"
            :key="uploadKey"
            :auto-upload="false"
            accept=".xlsx"
            :limit="1"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :on-change="handleFileChange"
            :file-list="fileList"
          >
            <div>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em style="color:#001450">点击上传</em></div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelImport">取消</el-button>
        <el-button size="small" type="danger" @click="submitImport" :disabled="!fileList.length">立即导入</el-button>
      </span>
    </el-dialog>
    <!-- 操作历史 -->
    <el-dialog title="操作历史" :visible.sync="operationDialogFlag" :close-on-click-modal="false" custom-class="operation-content" width="60%">
      <el-table :data="historyTableData" tooltip-effect="dark" style="width: 100%;" :header-cell-style="{ background: '#f7f7f7' }" stripe>
        <el-table-column prop="actionType" label="操作类型" min-width="8%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="操作时间" min-width="8%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createUserName" label="操作人" min-width="5%" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="明细" min-width="30%" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="operationSizeChange"
        @current-change="operationCurrentChange"
        :current-page="operationCurrent"
        :page-size="operationSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="operationTotalNumber"
        style="position: absolute;"
      ></el-pagination>
    </el-dialog>
    <!-- 批量编辑 -->
    <el-dialog title="批量编辑" :visible.sync="batchEditDialog" width="480px" center :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelBatchEdit">
      <el-form ref="importForm">
        <el-form-item>
          <div>第一步： 导出数据，更改导出表格的值</div>
        </el-form-item>
        <el-form-item>
          <div style="display: flex;align-items:center;justify-content: center;">
            <el-button plain size="small" @click="exportData">导出数据</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <div>第二步： 更改完成后，上传文件</div>
        </el-form-item>
        <el-form-item style="margin-top:20px;">
          <div style="display: flex;align-items:center;justify-content: center;">
            <el-upload
              :class="{ hide: hideEditUpload || editFileList.length > 0 }"
              drag
              action="uploadUrl"
              :key="uploadEditKey"
              :auto-upload="false"
              accept=".xlsx"
              :limit="1"
              :on-exceed="handleExceed"
              :on-remove="handleEditRemove"
              :on-change="handleEditChange"
              :file-list="editFileList"
            >
              <div>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em style="color:#001450">点击上传</em></div>
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item>
          <span slot="label" style="color:#dd0000">注意：系统将按编号，进行覆盖式编辑</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelBatchEdit">取消</el-button>
        <el-button size="small" type="danger" @click="submitBatchEdit" :disabled="!editFileList.length">立即导入</el-button>
      </span>
    </el-dialog>
    <!-- 导入结果 -->
    <el-dialog title="导入结果" :visible.sync="importResult" width="480px" :close-on-click-modal="false">
      <div style="padding-left:30%;line-height:40px;margin-top:30px;">
        <div>本次导入数据共 {{ batchEditResultObj.totalCount }} 条</div>
        <div style="color:#70B603">成功 {{ batchEditResultObj.successCount }} 条</div>
        <div style="color:#ff0000">失败 {{ batchEditResultObj.errorCount }} 条</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importResult = false" size="small">关闭</el-button>
        <el-button v-if="batchEditResultObj.errorCount > 0" type="danger" @click="failDetail" size="small">失败详情</el-button>
      </div>
    </el-dialog>
    <!-- 失败详情 -->
    <el-dialog title="失败详情" :visible.sync="failDetailVisible" width="70%" :close-on-click-modal="false" style="padding-bottom:40px;">
      <div style="padding:0px 20px;">
        <!-- 表格 -->
        <el-table ref="failTable" :key="failTableKey" :data="failTableData" tooltip-effect="dark" max-height="500" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" stripe>
          <el-table-column prop="rowNum" label="第几行" min-width="15%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fieldName" show-overflow-tooltip label="字段名称" min-width="30%"></el-table-column>
          <el-table-column prop="errorMsg" label="错误详情" min-width="40%" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="failSizeChange"
          @current-change="failCurrentChange"
          :current-page="failCurrent"
          :page-size="failSize"
          :page-sizes="[10, 20, 30, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="failTotal"
          style="float: right; display: flex; margin-top: 10px;position: static;"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top:40px;">
        <el-button @click="failDetailVisible = false" size="small">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import customTable from "../tableComponents/customTable.vue";
import columnHeader from "../tableComponents/headerComponent";
export default {
  components: {
    "custom-table": customTable,
    "column-header": columnHeader,
  },
  data() {
    return {
      mainminheight: `height:${document.documentElement.clientHeight}px`,
      pageHeight: "",
      hideUpload: false,
      uploadUrl: "", //`${process.env.api}/web/config/serviceConfiguration/addServiceConfiguration`,
      activeName: "",
      benchmarkForm: {
        competeNo: "",
        oilBrand: "",
        oilType: "",
        productName: "",
        mobilProductName: "",
        status: ""
      },
      compatibilityForm: {
        compatibleNo: "",
        projectId: "",
        product:'',
        competitorProduct:'',
        compatibilityResult: "",
        status: "",
        reportStartTime:'',
        reportEndTime:'',
      },
      dateRange: [],
      compatibilityTypeList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "润滑油"
        },
        {
          value: 1,
          label: "润滑脂"
        }
      ],
      compatibilityResultList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "边界相容"
        },
        {
          value: 1,
          label: "相容"
        },
        {
          value: 2,
          label: "不相容"
        },
        {
          value: 3,
          label: "无结论"
        }
      ],
      statusList: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 1,
          label: "启用"
        },
        {
          value: 0,
          label: "禁用"
        }
      ],
      benchmarkTableData: [],
      compatibilityTableData: [],
      current: 1,
      size: 10,
      benchmarkTotalNumber: 0,
      compatibilityTotalNumber: 0,
      dialogType: "",
      dialogBenchmark: false,
      // 竞品弹框
      benchmarkDialogForm: {
        oilBrand: "",
        oilType: "",
        productName: "",
        productNameEn: "",
        mobilProductName: "",
        mobilProductNameEn: "",
        status: 1,
        remark: ""
      },
      dialogBenchmarkKey: 1,
      benchmarkDialogRules: {
        oilBrand: [{ required: true, message: "请输入品牌", trigger: "blur" }],
        oilType: [{ required: true, message: "请输入油品种类", trigger: "blur" }],
        productNameEn: [{ required: true, message: "请输入产品名称（英文）", trigger: "blur" }],
        mobilProductNameEn: [{ required: true, message: "请输入产品名称（英文）", trigger: "blur" }],
        remark: [{ required: true, message: "请输入禁用原因", trigger: "blur" }]
      },
      // 相容性
      dialogCompatibility: false,
      compatibilityDialogForm: {
        projectId: "",
        reportTime: "",
        product: "",
        productStatus: "",
        competitorProduct: "",
        competitorProductStatus: "",
        compatibilityResult: "",
        status: 1,
        remark: ""
      },
      compatibilityDialogRules: {
        projectId: [{ required: true, message: "请输入Project ID", trigger: "blur" }],
        reportTime: [{ required: true, message: "请选择报告日期", trigger: "change" }],
        product: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        competitorProduct: [{ required: true, message: "请输入产品名称", trigger: "blur" }],
        compatibilityResult: [{ required: true, message: "请选择相容性结果", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        remark: [{ required: true, message: "请输入禁用原因", trigger: "remark" }]
      },
      dialogCompatibilityKey: 1,
      // 批量导入
      dialogImportFlag: false,
      fileList: [],
      // 操作历史
      operationDialogFlag: false,
      historyTableData: [],
      operationCurrent: 1,
      operationSize: 10,
      operationTotalNumber: 0,
      uploadKey: 0,
      benchTableKey: 1,
      compTableKey: 1,
      oilBrandList: [],
      oilTypeList: [],
      batchEditDialog: false,
      editFileList: [],
      uploadEditKey: 1,
      importResult: false,
      failDetailVisible: false,
      failSize: 10,
      failCurrent: 1,
      editFileRaw: "",
      batchEditResultObj: {
        errorCount: 0,
        successCount: 0,
        totalCount: 0,
        uniqueCode: ""
      },
      failTableKey: 1,
      tableHeight:null,
      tableDataBenchmark:[
        { filterType: "input", paramValue: "competeNo", changeValue:"", label: "编号", prop: "competeNo", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "oilBrand", selectOptions:  [], changeValue:"", label: "品牌", prop: "oilBrand", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "oilType", selectOptions:  [], changeValue:"", label: "油品种类", prop: "oilType", width: "100", tooltip: true},
        { label: "产品名称（英文）", prop: "productNameEn", width: "150", tooltip: true},
        { filterType: "input", paramValue: "productName", changeValue:"", label: "中文翻译（中文）", prop: "productName", width: "150", tooltip: true},
        { label: "美孚产品名称（英文）", prop: "mobilProductNameEn", width: "180", tooltip: true},
        { filterType: "input", paramValue: "mobilProductName", changeValue:"", label: "美孚产品名称（中文）", prop: "mobilProductName", width: "180", tooltip: true},
        { filterType: "selection", paramValue: "status", selectOptions: [{code: "",name: "全部"},{code: 1,name: "启用"},{code: 0,name: "禁用"}], changeValue:"", label: "状态", slot: "status", width: "120" },
        { label: "操作", slot: "operation" }
      ],
      tableDataCom:[
        { filterType: "input", paramValue: "compatibleNo", changeValue:"", label: "编号", prop: "compatibleNo", width: "100", tooltip: true},
        { filterType: "input", paramValue: "projectId", changeValue:"", label: "Project ID", prop: "projectId", width: "130", tooltip: true},
        { filterType: "input", paramValue: "product", changeValue:"", label: "产品1", prop: "product", width: "100", tooltip: true},
        { filterType: "input", paramValue: "competitorProduct", changeValue:"", label: "产品2", prop: "competitorProduct", width: "100", tooltip: true},
        { filterType: "dateRange", paramValue: "reportTime", changeValue:"", label: "报告日期", prop: "reportTime", width: "120", tooltip: true },
        { filterType: "selection", paramValue: "compatibilityResult", selectOptions:[{code: "",name: "全部"},{ code: 0,name: "边界相容"},{ code: 1,name: "相容"},{ code: 2,name: "不相容"},{ code: 3,name: "无结论"}], changeValue:"", label: "相容结果", slot: "compatibilityResult", width: "100", tooltip: true},
        { filterType: "selection", paramValue: "status", selectOptions: [{code: "",name: "全部"},{code: 1,name: "启用"},{code: 0,name: "禁用"}], changeValue:"", label: "状态", slot: "status", width: "100" },
        { label: "操作", slot: "operation" }
      ],
      loading:false
    };
  },
  created() {
    this.getOilBrandList();
    this.pageHeight = document.documentElement.clientHeight;
    this.activeName = "benchmark";
  },
  mounted(){
    this.getTableHeight()
    window.addEventListener("resize", () => {
      this.getTableHeight()
    });
  },
  methods: {
    // 获取油品品牌
    getOilBrandList() {
      this.requestMethodGet("/compete/getCompeteOilBrandList", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.forEach(it => {
            it.label = it.oilBrand;
            it.value = it.oilBrand;
          });
          this.oilBrandList = data;
          let oilBrandList = data.map(item=>{
            return {
              code:item.oilBrand,
              name:item.oilBrand
            }
          })
          this.tableDataBenchmark[1].selectOptions = oilBrandList
          this.getOilTypeList()
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 获取油品种类
    getOilTypeList() {
      this.requestMethodGet("/compete/getCompeteOilTypeList", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.forEach(it => {
            it.label = it.oilType;
            it.value = it.oilType;
          });
          this.oilTypeList = data;
          let oilTypeList = data.map(item=>{
            return {
              code:item.oilType,
              name:item.oilType
            }
          })
          this.tableDataBenchmark[2].selectOptions = oilTypeList
          this.searchBenchmarkTableData('refresh');
          this.searchCompatibilityTableData('refresh');
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 批量编辑
    batchEdit() {
      this.batchEditDialog = true;
    },
    // 批量编辑-上传
    handleEditChange(file, fileList) {
      this.hideEditUpload = fileList.length >= 1;
      this.editFileList = fileList;
    },
    // 批量编辑-移除
    handleEditRemove(file, fileList) {
      this.editFileList = [];
      this.hideEditUpload = fileList.length >= 1;
    },
    cancelBatchEdit() {
      this.editFileList = [];
      this.hideEditUpload = false;
      this.batchEditDialog = false;
    },
    // 失败详情
    failDetail() {
      this.getFailData();
    },
    // 失败详情-分页
    failSizeChange(val) {
      this.failSize = val;
      this.getFailData();
    },
    failCurrentChange(val) {
      this.failCurrent = val;
      this.getFailData();
    },
    getFailData() {
      const params = {
        type: this.activeName == "benchmark" ? 0 : 1,
        uniqueCode: this.batchEditResultObj.uniqueCode,
        size: this.failSize,
        current: this.failCurrent
      };
      this.requestMethodGet("/compete/getImportErrorLogListByPage", params).then(res => {
        if (res.data.code == 1000) {
          ++this.failTableKey;
          this.failTableData = res.data.data.list;
          this.failTotal = res.data.data.totalCount;
          this.failDetailVisible = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 立即导入
    submitBatchEdit() {
      // 需要判断是在对标产品还是相容性标签下导入
      let url = "";
      if (this.activeName == "benchmark") {
        url = "/compete/competeProductBatchUpdate";
      } else {
        url = "/compatible/compatibleProductBatchUpdate";
      }
      var params = new FormData();
      params.append("file", this.editFileList[0].raw);
      this.requestMethodPost(url, params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.batchEditResultObj = data;
          this.importResult = true;
          this.activeName == "benchmark" ? this.searchBenchmarkTableData('refresh') : this.searchCompatibilityTableData('refresh');
          if (data.errorCount > 0) {
            // 查询失败详情
            this.failSize = 10;
            this.failCurrent = 1;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    tabsChange() {
      this.current = 1;
      this.size = 10;
      this.benchmarkTableData = [];
      this.compatibilityTableData = [];
      if (this.activeName == "benchmark") {
        this.searchBenchmarkTableData();
      } else {
        this.searchCompatibilityTableData();
      }
    },
    // 重置对标form
    resetForm() {
      const data = this.activeName == "benchmark" ? this.benchmarkForm : this.compatibilityForm;
      for (let key in data) {
        data[key] = "";
      }
      this.dateRange = []
      this.current = 1;
      this.size = 10;
      if(this.activeName == "benchmark"){
        this.tableDataBenchmark.forEach(item=>{
          item.changeValue=""
        })
      }else{
        this.tableDataCom.forEach(item=>{
          item.changeValue=""
        })
      }
      this.activeName == "benchmark" ? this.searchBenchmarkTableData() : this.searchCompatibilityTableData();
    },
    // 加载对标table
    searchBenchmarkTableData(val) {
      this.loading = true
      const params = this.benchmarkForm;
      if(val){
        params.current = 1;
        params.size = 10;
      }else{
        params.current = this.current;
        params.size = this.size;
      }
      this.requestMethodGet("compete/getCompeteProductListByPage", params).then(res => {
        this.loading = false
        if (res.data.code == 1000) {
          ++this.benchTableKey;
          const data = res.data.data.list;
          this.benchmarkTableData = data;
          this.benchmarkTotalNumber = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 相容性table
    searchCompatibilityTableData(val) {
      this.loading = true
      const params = this.compatibilityForm;
      if(val){
        params.current = 1;
        params.size = 10;
      }else{
        params.current = this.current;
        params.size = this.size;
      }
      this.requestMethodGet("compatible/getCompetitorProductList", params).then(res => {
        this.loading = false
        if (res.data.code == 1000) {
          ++this.compTableKey;
          const data = res.data.data.list;
          this.compatibilityTableData = data;
          this.compatibilityTotalNumber = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 新建
    create() {
      this.dialogType = "add";
      if (this.activeName == "benchmark") {
        const data = this.benchmarkDialogForm;
        for (let key in data) {
          if (key == "status") {
            data[key] = 1;
          } else {
            data[key] = "";
          }
        }
        this.dialogBenchmarkKey += 1;
        this.dialogBenchmark = true;
      } else {
        const data = this.compatibilityDialogForm;
        for (let key in data) {
          if (key == "status") {
            data[key] = 1;
          } else {
            data[key] = "";
          }
        }
        this.dialogCompatibilityKey += 1;
        this.dialogCompatibility = true;
      }
    },
    // 竞品取消
    cancelBenchmark(formName) {
      this.getOilBrandList();
      this.getOilTypeList();
      this.dialogBenchmark = false;
      this.$refs[formName].resetFields();
    },
    // 提交竞品
    submitBenchmark(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否保存？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              const params = this.benchmarkDialogForm;
              let url = this.dialogType == "add" ? "compete/addCompeteProduct" : "compete/editCompeteProduct";
              this.requestMethodPost(url, params).then(res => {
                if (res.data.code == 1000) {
                  this.$message({
                    message: this.dialogType == "add" ? "新建成功" : "编辑成功",
                    type: "success"
                  });

                  this.cancelBenchmark(formName);
                  this.searchBenchmarkTableData('refresh');
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
              });
            })
            .catch(() => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 相容性取消
    cancelCompatibility(formName) {
      this.dialogCompatibility = false;
      this.$refs[formName].resetFields();
    },
    // 相容性提交
    submitCompatibility(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm("是否保存？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消"
          })
            .then(() => {
              const params = this.compatibilityDialogForm;
              let url = this.dialogType == "add" ? "compatible/addCompetitorProduct" : "compatible/updateCompetitorProduct";
              this.requestMethodPost(url, params).then(res => {
                if (res.data.code == 1000) {
                  this.$message({
                    message: this.dialogType == "add" ? "新建成功" : "编辑成功",
                    type: "success"
                  });
                  this.searchCompatibilityTableData('refresh');
                  this.cancelCompatibility(formName);
                } else {
                  this.$message({
                    message: res.data.msg,
                    type: "error"
                  });
                }
              });
            })
            .catch(() => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 批量导入
    importFile() {
      this.uploadKey += 1;
      this.hideUpload = false;
      this.dialogImportFlag = true;
    },
    // 下载模板
    downloadTemplate() {
      if (this.activeName == "benchmark") {
        //竞品
        this.handleDownload("template/compete/竞品导入模板.xlsx");
      } else {
        //相容性
        this.handleDownload("template/compete/相容性导入模板.xlsx");
      }
    },
    handleDownload(url) {
      this.requestMethodGet("/web/file/getFullDownloadUrl", { url: url }).then(res => {
        if (res.data.code == 1000) {
          window.open(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 文件上传删除
    handleRemove(file, fileList) {
      this.fileList = [];
      this.hideUpload = fileList.length >= 1;
    },
    // 文件上传超出限制
    handleExceed(files, fileList) {
      this.$message.error(`最多上传 1 个文件`);
    },
    // 文件上传改变
    handleFileChange(file, fileList) {
      this.hideUpload = fileList.length >= 1;
      this.fileList = fileList;
    },
    // 取消导入
    cancelImport() {
      this.dialogImportFlag = false;
      this.fileList = [];
    },
    // 导入
    submitImport() {
      let url = "";
      if (this.activeName == "benchmark") {
        //竞品
        url = "compete/importCompeteProducts";
      } else {
        //相容性
        url = "compatible/importProducts";
      }
      let params = new FormData();
      params.append("file", this.fileList[0].raw);
      this.requestMethodPost(url, params)
        .then(res => {
          if (res.data.code == 1000) {
            const data = res.data.data;
            this.batchEditResultObj = data;
            this.importResult = true;
            this.activeName == "benchmark" ? this.searchBenchmarkTableData('refresh') : this.searchCompatibilityTableData('refresh');
            if (data.errorCount > 0) {
              // 查询失败详情
              this.failSize = 10;
              this.failCurrent = 1;
            }
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    // 操作历史
    operationHistory() {
      this.getOperationData();
      this.operationDialogFlag = true;
    },
    // 导出数据
    exportData() {
      let url = "";
      let paramObj = {}
      if (this.activeName == "benchmark") {
        //对标产品
        url = '/compete/competeProductExport'
        paramObj = {
          competeNo: this.benchmarkForm.competeNo,
          oilBrand: this.benchmarkForm.oilBrand,
          oilType: this.benchmarkForm.oilType,
          productName: this.benchmarkForm.productName,
          mobilProductName: this.benchmarkForm.mobilProductName,
          status: this.benchmarkForm.status,
          responseTypeBlob: true
        }
      } else {
        //相容性
        url = 'compatible/compatibleProductExport'
        paramObj = {
          compatibleNo: this.compatibilityForm.compatibleNo,
          projectId: this.compatibilityForm.projectId,
          product: this.compatibilityForm.product,
          competitorProduct: this.compatibilityForm.competitorProduct,
          compatibilityResult: this.compatibilityForm.compatibilityResult,
          status: this.compatibilityForm.status,
          reportStartTime: this.compatibilityForm.reportStartTime,
          reportEndTime: this.compatibilityForm.reportEndTime,
          responseTypeBlob: true
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
          let fileReader = new FileReader();
          let that = this;
          loading.close();
          let name = "";
          if (this.activeName == "benchmark") {
            name = "对标产品信息表.xlsx";
          } else {
            name = "相容性产品信息表.xlsx";
          }
          fileReader.onload = function() {
            try {
              let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
                that.$message({
                  message: jsonData.msg,
                  type: "error"
                });
                return;
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
                type: "application/vnd.ms-excel"
              });
              const objectUrl = URL.createObjectURL(blob);
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", name);
              document.body.appendChild(link);
              link.click();
            }
          };
          fileReader.readAsText(data);
        })
        .catch(res => {
          loading.close();
        });
    },
    // 获取操作历史数据
    getOperationData() {
      let params = {};
      if (this.activeName == "benchmark") {
        //竞品
        params.productType = 0;
      } else {
        //相容性
        params.productType = 1;
      }
      params.current = this.operationCurrent;
      params.size = this.operationSize;
      this.requestMethodGet("compe/log/getCompOperateLogByPage", params).then(res => {
        if (res.data.code == 1000) {
          this.historyTableData = res.data.data.list;
          this.operationTotalNumber = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    operationSizeChange(e) {
      this.operationCurrent = 1;
      this.operationSize = e;
      this.getOperationData();
    },
    operationCurrentChange(e) {
      this.operationCurrent = e;
      this.getOperationData();
    },
    // 编辑
    editRow(row) {
      this.dialogType = "edit";
      if (this.activeName == "benchmark") {
        this.requestMethodGet("compete/getCompeteProductById", { id: row.id }).then(res => {
          if (res.data.code == 1000) {
            this.benchmarkDialogForm = res.data.data;
            this.dialogBenchmarkKey += 1;
            this.dialogBenchmark = true;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      } else {
        this.compatibilityDialogForm = row;
        this.dialogCompatibilityKey += 1;
        this.dialogCompatibility = true;
      }
    },
    handleSizeChange(e) {
      this.size = e;
      this.current = 1;
      if (this.activeName == "benchmark") {
        this.searchBenchmarkTableData();
      } else {
        this.searchCompatibilityTableData();
      }
    },
    handleCurrentChange(e) {
      this.current = e;
      if (this.activeName == "benchmark") {
        this.searchBenchmarkTableData();
      } else {
        this.searchCompatibilityTableData();
      }
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight}px`;
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
      if(this.activeName == "benchmark"){
        this.tableDataBenchmark.forEach(item=>{
          if(item.sortTypeVal){
            if(item.paramValue&&(item.paramValue == this.sortMethod)){
              item.sortTypeVal = sortVal
            }else if(item.paramValue&&(item.paramValue != this.sortMethod)){
              item.sortTypeVal = 'sortDefault'
            }
          }
        })
      }else{
        if(item.sortTypeVal){
          this.tableDataCom.forEach(item=>{
            if(item.paramValue&&(item.paramValue == this.sortMethod)){
              item.sortTypeVal = sortVal
            }else if(item.paramValue&&(item.paramValue != this.sortMethod)){
              item.sortTypeVal = 'sortDefault'
            }
          })
        } 
      }
      this.current = 1;
      if (this.activeName == "benchmark") {
        this.searchBenchmarkTableData();
      } else {
        this.searchCompatibilityTableData();
      }
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      if(this.activeName == "benchmark"){
        this.tableDataBenchmark.forEach(item=>{
          if(obj.paramValue==item.paramValue){
            item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
          }
        })
        this.benchmarkForm[obj.paramValue] = searchVal
      }else{
        this.tableDataCom.forEach(item=>{
          if(obj.paramValue==item.paramValue){
            if(searchVal){
              item.changeValue = searchVal
            }else{
              item.changeValue = ""
            }
          }
        })
        if(obj.paramValue=="reportTime"){
          if(searchVal){
            this.compatibilityForm.reportStartTime = searchVal[0]
            this.compatibilityForm.reportEndTime = searchVal[1]
          }else{
            this.compatibilityForm.reportStartTime = ""
            this.compatibilityForm.reportEndTime = ""
          }
        }else{
          this.compatibilityForm[obj.paramValue] = searchVal
        } 
      }
      this.current = 1;
      if (this.activeName == "benchmark") {
        this.searchBenchmarkTableData();
      } else {
        this.searchCompatibilityTableData();
      }
    },
    getTableHeight(){
      this.tableHeight = document.documentElement.clientHeight - 280
    },
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
.customer-profile {
  padding:0 20px 0 20px;
  height: 100%;
  overflow: auto;
  position: relative;
}
.dialog-no-title {
  font-size: 13px;
  color: rgb(102, 102, 102);
  display: flex;
  align-items: center;
  height: 36px;
  background-color: rgba(204, 221, 255, 0.4);
  border-radius: 4px;
  border: 1px solid rgb(204, 221, 255);
}
.info-title {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
}
.title {
  margin-left: 10px;
  font-size: 14px;
  line-height: 14px;
  color: #000;
}
.line {
  width: 4px;
  height: 14px;
  background: #dd0000;
}
.msg-content /deep/.el-message__content {
  line-height: 25px !important;
}
.hide /deep/.el-upload {
  display: none !important;
}
/deep/.customer-dialog {
  height: 620px;
  overflow: auto;
}
/deep/.operation-content {
  padding-bottom: 45px;
}
/deep/ .el-tabs__item.is-active {
  color: #fe000c !important;
}
/deep/ .el-tabs__active-bar {
  background-color: #fe000c !important;
}
/deep/ .el-tabs__item:hover {
  color: #fe000c !important;
}
/deep/ .el-tabs__nav-wrap::after{
  background-color: transparent;
}
/deep/ .el-tabs__active-bar{
  background-color: #DD0000 !important;
}
.topRightCon{
  position: absolute;
  right: 20px;
  top: 4px;
}
</style>