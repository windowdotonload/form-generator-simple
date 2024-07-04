<template>
  <div class="abnormal-container" id="abnormalDiv">
    <div style="position: absolute;right: 30px;top: -50px;display: flex;align-items: center;">
      <p class="tips">
        <i class="el-icon-warning" />
        <span style="margin-left: 8px">仅统计与登陆人相关的异常记录</span>
      </p>
    </div>
    <!-- 统计看板 -->
    <header class="task-situation-record" id="taskSituationDiv">
      <div class="task-situation-item task-situation-super" v-for="item in taskCate" :key="item.cateName">
        <div class="task-item-left">
          <div class="task-left-text">{{ item.cateName }}</div>
          <div class="task-left-number">{{ item.val }}</div>
        </div>
      </div>
    </header>
    <div class="work-order-component">
      <div class="toolbox-con flexBetween" id="formDiv">
        <!-- 异常表单查询 -->
        <el-form ref="abnormalForm" :model="abnormalForm" :inline="true" size="small">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2 && formDivLen>=1" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item v-show="formDivLen>=2" class="form-item-outline" label="设备类型">
            <el-cascader size="small" placeholder="请选择" :style="{width:(abnormalForm.deviceTypeList.length==0)?'150px':'450px'}" :options="eptList" v-model="abnormalForm.deviceTypeList" filterable clearable :props="{ value: 'code', label: 'name', multiple:true}" collapse-tags>
            </el-cascader>
          </el-form-item>
          <el-form-item v-show="formDivLen>=3" class="form-item-outline" label="设备分组">
            <el-cascader
              :options="groupList"
              :key="groupKey"
              :props="{ label: 'groupName', value: 'id', multiple: true }"
              collapse-tags
              size="small"
              :style="{width:(abnormalForm.groupId.length==0)?'150px':'270px'}"
              v-model="abnormalForm.groupId"
              placeholder="请选择"
              no-data-text="暂无分组"
              @visible-change="visibleChange"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item v-show="formDivLen>=4" class="form-item-outline" label="设备位置">
            <el-input clearable v-model="abnormalForm.devicePosition" class="search-info" size="small" placeholder="请输入" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="handleMoreSearch">{{ showMoreSearch ? "收起" : "更多筛选" }}</el-button>
            <el-button size="small" type="danger" plain @click="getAbnormalData" >搜索</el-button>
            <el-button size="small" @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 批量处理 -->
        <div class="tool-con">
          <el-button v-if="batchAbnormalBtnFlag" plain size="small" @click="batchHandle">批量处理</el-button>
          <el-button plain size="small" @click="exportHandle">批量导出</el-button>
          <el-button v-if="createAbnormalBtnFlag" type="danger" size="small" @click="createAbnormal">记录异常</el-button>
          <custom-field class="marLeft" @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="abnormal"></custom-field>
        </div>
      </div>
      <div class="moreSearchCon marBottom" v-if="showMoreSearch">
        <el-form ref="abnormalForm" id="formMoreDiv" :model="abnormalForm" :inline="true" size="small">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2 && formDivLen<1" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length>0?'color:#606266;':''">{{selectCustomerList.length>0?'指定客户'+selectCustomerList.length:'请选择'}}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length>0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item v-show="formDivLen<2" class="form-item-outline" label="设备类型">
            <el-cascader size="small" placeholder="请选择" :style="{width:(abnormalForm.deviceTypeList.length==0)?'150px':'450px'}" :options="eptList" v-model="abnormalForm.deviceTypeList" filterable clearable :props="{ value: 'code', label: 'name', multiple:true}" collapse-tags>
            </el-cascader>
          </el-form-item>
          <el-form-item v-show="formDivLen<3" class="form-item-outline" label="设备分组">
            <el-cascader
              :options="groupList"
              :key="groupKey"
              :props="{ label: 'groupName', value: 'id', multiple: true }"
              collapse-tags
              size="small"
              :style="{width:(abnormalForm.groupId.length==0)?'150px':'270px'}"
              v-model="abnormalForm.groupId"
              placeholder="请选择"
              no-data-text="暂无分组"
              @visible-change="visibleChange"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item v-show="formDivLen<4" class="form-item-outline" label="设备位置">
            <el-input clearable v-model="abnormalForm.devicePosition" class="search-info" size="small" placeholder="请输入" maxlength="16"></el-input>
          </el-form-item>
          <el-form-item class="form-item-outline" label="设备编码" v-if="showMoreSearch">
            <el-input clearable class="search-info" v-model="abnormalForm.deviceCode" size="small" placeholder="请输入" maxlength="16"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div>
        <custom-table
          ref="tableRef"
          :tableHeader="tableDataHeader"
          :tableData="abnormalTableData"
          :tableHeight="tableHeight + ''"
          :listEmptyType="listEmptyType" 
          :limitFlag="createAbnormalBtnFlag"
          @select="selectTable"
          @selectAll="selectAllTable"
          @changeSearch="tableTitleSearch" 
          @changeSortTable="changeSortTable"
          :loading="loading"
        >
          <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" align="center" width="55"></el-table-column>
          <template v-slot:abnormalNo="slotProps">
            <el-table-column
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              label="异常ID"
              fixed="left"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                title="异常ID"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.abnormalNo }}</span>
                  <div>
                    <el-button class="copy_text" type="text" style="padding: 0px" v-clipboard:copy="scope.row.abnormalNo" v-clipboard:success="onCopy" v-clipboard:error="onError">
                      <img src="../../../assets/icon-copy.png" alt="" style="width: 16px; height: 16px; position: relative; top: 3px; cursor: pointer; margin-left: 8px" />
                    </el-button>
                  </div>
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:workshopName="slotProps">
            <el-table-column
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              label="所属车间"
              show-overflow-tooltip
            >
              <template slot="header" v-if="userInfo.userType!=2 && !abnormalForm.companyId">
                <span>所属车间</span>
              </template>
              <template slot="header" v-if="(userInfo.userType!=2 && abnormalForm.companyId) || userInfo.userType==2">
                <column-header 
                title="所属车间"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectOptions="slotProps.slotData.selectOptions"
                :showTips="slotProps.slotData.showTips"
                @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.workshopName || '-'}}</span>
              </template>
            </el-table-column>
          </template>
          <template v-slot:abnormalDesc="slotProps">
            <el-table-column
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              label="异常说明"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                title="异常说明"/>
              </template>
              <template slot-scope="scope">
                <span v-if="scope.row.abnormalSource == 2&&(!scope.row.studyRecordId)">《</span>{{ scope.row.abnormalDesc }} <span v-if="scope.row.abnormalSource == 2&&(!scope.row.studyRecordId)">》发现设备异常</span>
              </template>
            </el-table-column>
          </template>
          <template v-slot:createUserName="slotProps">
            <el-table-column
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              label="创建人"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                title="创建人"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                  <div>
                    <div style="display: flex;align-items:center;">
                      <img :src="createUserDetail.headUrl ? createUserDetail.headUrl : require('../../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                      <div style="flex: 1; margin-left: 10px">
                        <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ createUserDetail.userName }}</div>
                      </div>
                    </div>
                    <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                      <span style="color: #666; margin-right: 8px">电话: </span>
                      <span>{{ formatPhonenumber(createUserDetail.phonenumber) }}</span>
                      <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="createUserDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel" v-if="createUserDetail.phonenumber">
                        <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                      </el-button>
                    </div>
                    <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                      <span style="color: #666; margin-right: 8px">邮箱: </span>
                      <span>{{ formatEmail(createUserDetail.email) }}</span>
                      <el-button class="copy_mail" type="text" v-clipboard:copy="createUserDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px" v-if="createUserDetail.email">
                        <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                      </el-button>
                    </div>
                  </div>
                  <span
                    slot="reference"
                    :disabled="!scope.row.createUserName"
                    class="copy_text"
                    type="text"
                    style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                    @click="createUserNameDetail(scope)"
                    >{{ scope.row.createUserName || "-" }}</span
                  >
                </el-popover>
              </template>
            </el-table-column>
          </template>
          <template v-slot:abnormalStatus="slotProps">
            <el-table-column
              label="状态"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                  title="状态"
                  :filterType="slotProps.slotData.filterType"
                  :paramValue="slotProps.slotData.paramValue"
                  :changeValue="slotProps.slotData.changeValue"
                  :selectMultiple="slotProps.slotData.selectMultiple"
                  :selectOptions="slotProps.slotData.selectOptions"
                  @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <span v-if="scope.row.abnormalStatus" style="color:#999">已处理</span>
                <span v-else style="color: #dd0000">未处理</span>
              </template>
            </el-table-column>
          </template>
          <template v-slot:companyName="slotProps">
            <el-table-column
              label="所属客户"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
              v-if="userInfo.userType < 2"
            >
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.companyName }}</span>
                  <span class="self-tips" v-if="scope.row.customerCompanyType == 0">直</span>
                  <img v-if="scope.row.pesFlag == '1' || scope.row.pesFlag == '3'" src="../../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                  <img v-if="scope.row.pesFlag == '2' || scope.row.pesFlag == '3'" src="../../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                  <img v-if="scope.row.spFlag == '1'" src="../../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
                </div>
              </template>
            </el-table-column>
          </template>
          <template v-slot:abnormalType="slotProps">
            <el-table-column
              label="异常类型"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                  title="异常类型"
                  :filterType="slotProps.slotData.filterType"
                  :paramValue="slotProps.slotData.paramValue"
                  :changeValue="slotProps.slotData.changeValue"
                  :selectMultiple="slotProps.slotData.selectMultiple"
                  :selectOptions="slotProps.slotData.selectOptions"
                  @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.abnormalType == "1" ? "设备异常" : "润滑异常" }}</span>
              </template>
            </el-table-column>
          </template>
          <template v-slot:abnormalSource="slotProps">
            <el-table-column
              label="来源"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                  title="来源"
                  :filterType="slotProps.slotData.filterType"
                  :paramValue="slotProps.slotData.paramValue"
                  :changeValue="slotProps.slotData.changeValue"
                  :selectOptions="slotProps.slotData.selectOptions"
                  @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.abnormalSource == "1" ? "手工创建" : scope.row.abnormalSource == "0" ? "检查" : "润滑服务" }}</span>
              </template>
            </el-table-column>
          </template>
          <template v-slot:priority="slotProps">
            <el-table-column
              label="优先级"
              :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
              :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
              show-overflow-tooltip
            >
              <template slot="header">
                <column-header 
                title="优先级"
                :filterType="slotProps.slotData.filterType"
                :sortTypeVal="slotProps.slotData.sortTypeVal"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @changeSort="changeSortTable"
                @chSubmit="tableTitleSearch"/>
              </template>
              <template slot-scope="scope">
                <span>{{ scope.row.priority == 1 ? "急需处理" : "可暂缓处理" }}</span>
              </template>
            </el-table-column>
          </template>
          <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
          <el-table-column slot="operation" fixed="right" label="操作" :resizable="false" width="100" align="center">
            <template slot-scope="scope">
              <el-link @click="viewAbnormal(scope.row)" style="margin-right:10px;color:#001450">查看</el-link>
            </template>
          </el-table-column>
        </custom-table>
        <!-- 分页 -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="abnormalForm.current"
          :page-size="abnormalForm.size"
          :page-sizes="[30, 60, 100, 200, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNumber"
          class="listOptimizePage"
        ></el-pagination>
      </div>
    </div>
    <!-- 创建异常弹框 -->
    <el-dialog title="记录异常" :visible.sync="abnormalDialog" width="40%" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form ref="stepOneForm" :model="stepOneForm" label-width="80px" :rules="stepOneRules">
        <el-form-item label="异常说明" prop="abnormalDesc">
          <el-input v-model="stepOneForm.abnormalDesc" size="small" clearable placeholder="请输入" type="textarea" show-word-limit :rows="4" style="width:80%;" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="现场照片" style="margin-top:20px">
          <el-upload
            :class="{ noShowImgUpload: hideUpload || stepOneForm.imageList.length == 9 }"
            :action="uploadUrl"
            list-type="picture-card"
            limit="9"
            :file-list="stepOneForm.imageList"
            accept=".jpg,.png"
            :auto-upload="false"
            :on-change="handleAddFile"
            :on-remove="handleRemove"
            :on-preview="handlePreview"
          >
            <i class="el-icon-plus" style="display: flex; align-items: center;justify-content: center;height: 100px;"></i>
          </el-upload>
          <div style="font-size:12px;color:#999">最多上传9张，规格要求：≤10M，jpg/png格式</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="abnormalStepOneCancel('stepOneForm')" size="small">取 消</el-button>
        <el-button type="danger" @click="abnormalStepOneNext('stepOneForm')" size="small">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 创建异常第二步,选择设备 -->
    <ChooseDevice
      :chooseDeviceDialog="chooseDeviceDialogFlag"
      :singleFlag="singleFlag"
      :urlType="urlType"
      :companyNumber="userInfo.companyNumber"
      :checkedDevice="checkedDevice"
      :companyId="currentUserCompanyId"
      v-on:cancelChooseDevice="cancelChooseDevice"
      v-on:confirmChooseDevice="confirmChooseDevice"
      v-on:upStep="upStep"
    ></ChooseDevice>
    <!-- 批量处理弹框 -->
    <el-dialog title="批量处理" :visible.sync="batchHandleDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <span>请按需要选择批量处理的方式</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchHandleDialog = false" size="small">取 消</el-button>
        <el-button type="danger" plain size="small" @click="allNotProcessed">全部转为未处理</el-button>
        <el-button type="danger" size="small" @click="allProcessed">全部转为已处理</el-button>
      </span>
    </el-dialog>
    <!-- 异常详情 -->
    <AbnormalDraw
      :openDrawFlag="openDrawFlag"
      :abnormalData="currentAbnomalData"
      :abnormalStatus="abnormalStatus"
      :id="abnormalId"
      v-on:refreshList="refreshList"
      v-on:closeDraw="closeDraw"
    ></AbnormalDraw>
    <!-- 图片预览 -->
    <el-dialog width="30%" :visible.sync="previewImg" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="closeImgPreview">
      <el-image style="width: 100%; height: 100%;margin-top:20px" :src="dialogImageUrl"> </el-image>
    </el-dialog>
     <!-- 导出弹框 -->
     <el-dialog
      title="导出为Excel"
      :visible.sync="dialogVisibleExport"
      width="30%"
      :before-close="handleClose">
      <div style="color: #333;font-size: 14px;font-weight: 400;" >当前共 <span style="color:#dd0000;">{{selectTableData.length >0 ? selectTableData.length : totalNumber}}</span> 条数据，是否需要导出？</div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibleExport = false" size="small">取 消</el-button>
        <el-button type="danger" @click="submitExport" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <customer-list ref="selectCustomer" :showCustomerDialog="showCustomerDialog" @handleSubmitCustomer="handleSubmitCustomer" @handleCloseCustomer="handleCloseCustomer"></customer-list>
  </div>
</template>

<script>
import ChooseDevice from "../components/chooseDevice";
import AbnormalDraw from "./abnormalDetail";
import customField from "../../tableComponents/customField.vue";
import sortType from "../../tableComponents/sortType.vue";
import customTable from "../../tableComponents/customTable.vue";
import columnHeader from "../../tableComponents/headerComponent";
import customerList from "../../tableComponents/customerList";
import commonJS from "../../tableComponents/tableCommon.js";
export default {
  mixins: [commonJS],
  components: {
    ChooseDevice,
    AbnormalDraw,
    "custom-field": customField,
    "sort-type": sortType,
    "custom-table": customTable,
    "column-header":columnHeader,
    "customer-list":customerList,
  },
  data() {
    return {
      loading: false,
      currentAbnomalData: null,
      abnormalDivHeight: document.documentElement.clientHeight - 184,
      formDivHeight: 0,
      mainminheight: `height:${document.documentElement.clientHeight - 420}px`,
      tableHeight: null,
      abnormalForm: {
        abnormalNo: "",
        priority: "",
        abnormalSource: "",
        createDate: "",
        deviceTypeList: [],
        workshopId: "",
        distributorName:'',
        devicePosition: "",
        groupId: [],
        deviceCode: "",
        abnormalStatus: [0],
        companyId: "",
        current: 1,
        size: 30,
        deviceName:'',
        createUserName:'',
        abnormalType:'',
        createStartTime:'',
        createEndTime:''
      },
      dialogVisibleExport:false,
      selectCompanyName: "",
      statusList: [
        {
          name: "未处理",
          code: 0
        },
        {
          name: "已处理",
          code: 1
        }
      ],
      priorityList: [
        {
          label: "急需处理",
          value: 1
        },
        {
          label: "可暂缓处理",
          value: 2
        }
      ],
      abnormalSourceList: [
        {
          label: "手工创建",
          value: 1
        },
        {
          label: "检查",
          value: 0
        },
        {
          label: "美孚服务",
          value: 2
        }
      ],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      customerList: [],
      abnormalTableData: [],
      selectTableData: [],
      totalNumber: 0,
      abnormalDialog: false,
      stepOneForm: {
        abnormalDesc: "",
        imageList: []
      },
      stepOneRules: {
        abnormalDesc: [{ required: true, message: "请输入异常说明", trigger: "blur" }]
      },
      currentUserCompanyId: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyId,
      chooseDeviceDialogFlag: false,
      singleFlag: true,
      batchHandleDialog: false, //批量处理
      openDrawFlag: false,
      urlType: "createAbnormal",
      checkedDevice: [],
      handleType: "",
      abnormalStatus: 0,
      abnormalId: 0,
      batchAbnormalBtnFlag: false,
      createAbnormalBtnFlag: false,
      taskCate: [
        { cateName: "异常总数", code: "amountofAbnormal", val: null },
        { cateName: "月度异常增长率", code: "abnormalOfMonthlyGrowthRatio", val: null },
        { cateName: "未处理异常数", code: "amountOfNotProcessedAbnormal", val: null },
        { cateName: "急需处理占比", code: "abnormalOfUrgentlyNeededRatio", val: null },
        { cateName: "可暂缓处理占比", code: "abnormalOfDeferredRatio", val: null }
      ],
      eptList: [],
      groupList: [],
      showMoreSearch: false,
      selectCompanyName: "",
      workshopList: [],
      groupKey: 1,
      hideUpload: false,
      previewImg: false,
      dialogImageUrl: "",
      sortMethodList: [
        {
          label: "异常ID",
          value: "abnormalNo"
        },
        {
          label: "优先级",
          value: "priority"
        },
        {
          label: "生成时间",
          value: "createTime"
        }
      ],
      sortMethod: "createTime",
      sortType: false,
      customFieldlistUnit: [
        {
          fieldName: "abnormalNo",
          visible: 2
        },
        {
          fieldName: "abnormalStatus",
          visible: 1
        },
        {
          fieldName: "priority",
          visible: 1
        },
        {
          fieldName: "abnormalType",
          visible: 1
        },
        {
          fieldName: "abnormalDesc",
          visible: 1
        },
        {
          fieldName: "deviceName",
          visible: 1
        },
        {
          fieldName: "workshopName",
          visible: 1
        },
        {
          fieldName: "distributors",
          visible: 1
        },
        {
          fieldName: "abnormalSource",
          visible: 1
        },
        {
          fieldName: "createUserName",
          visible: 1
        },
        {
          fieldName: "createTime",
          visible: 1
        },
        {
          fieldName: "remark",
          visible: 1
        },
        {
          fieldName: "companyName",
          visible: 1
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      customFieldlist: [],
      tableDataHeaderInit: {
        selection: { slot: "selection" },
        abnormalNo: { filterType: "input", paramValue: "abnormalNo", changeValue:"", sortTypeVal: "sortDefault", label: "异常ID", slot: "abnormalNo", width: "200", fixed: "left", tooltip: true },
        abnormalStatus: { selectMultiple: true, filterType: "selection", paramValue: "abnormalStatus", selectOptions:  [{ code: 1, name: "已处理" },{ code: 0, name: "未处理" }], changeValue:"", label: "状态", slot: "abnormalStatus", width: "100" },
        priority: { selectMultiple: true, filterType: "selection", paramValue: "priority", selectOptions:  [{ code: 1, name: "急需处理" },{ code: 2, name: "可暂缓处理" }], changeValue:"", sortTypeVal: "sortDefault", label: "优先级", slot: "priority", width: "140" },
        abnormalType: { selectMultiple: true, filterType: "selection", paramValue: "abnormalType", selectOptions:  [{ code: 1, name: "设备异常" },{ code: 2, name: "润滑异常" }], changeValue:"", label: "异常类型", slot: "abnormalType", width: "120" },
        abnormalDesc: { label: "异常说明", slot: "abnormalDesc", width: "200", tooltip: true },
        deviceName: { filterType: "input", paramValue: "deviceName", changeValue:"", label: "所属设备", prop: "deviceName", width: "150", tooltip: true },
        workshopName: { showTips: false, filterType: "selection", paramValue: "workshopId", changeValue:"", selectOptions: [], label: "所属车间", slot: "workshopName", width: "150", tooltip: true },
        distributors: { filterType: "input", paramValue: "distributorName", changeValue:"", label: "服务商", prop: "distributors", width: "150", tooltip: true },
        abnormalSource: { filterType: "selection", paramValue: "abnormalSource", selectOptions:  [{ code: 1, name: "手工创建" },{code:0,name:'检查'},{ code: 2, name: "润滑服务" }], changeValue:"", label: "来源", slot: "abnormalSource", width: "120" },
        createUserName: { filterType: "input", paramValue: "createUserName", changeValue:"", label: "创建人", slot: "createUserName", width: "150", tooltip: true },
        createTime: { filterType: "dateRange", paramValue: "createTime", changeValue:"", sortTypeVal: "sortDown", label: "创建时间", prop: "createTime", width: "150", tooltip: true },
        remark: { label: "备注", prop: "remark", width: "150", tooltip: true },
        companyName: { label: "所属客户", slot: "companyName", width: "250" },
        operation: { label: "操作", slot: "operation" }
      },
      tableDataHeader: [],
      listEmptyType:'abnormal_list',
      selectCustomerList:[],
      showCustomerDialog:false,
      formDivLen:4,
      createUserDetail:{}
    };
  },
  created() {
    this.$gio.toEventPage({
      entrance: "异常管理"
    });
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "web_Event_Handle") {
        //批量处理
        this.batchAbnormalBtnFlag = true;
      }
      if (buttonList[i].menuCode == "web_Event_Add") {
        //创建
        this.createAbnormalBtnFlag = true;
      }
    }
    this.getOverviewData();
    this.getEptList();
    if(this.userInfo.userType < 2){
      this.getCustomerData();
    }
    
    this.getGroupTree();
    if(this.userInfo.userType == 2){
      this.getCustomerWorkshopList(this.$userInfo.orgInfo.companyId.toString())
    }
    this.getAbnormalData();
    this.getCustomFieldList(); //获取自定义字段列表
  },
  mounted() {
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 420}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
    console.log(this.$route.query)
    if(this.$route.query.resource=='message') {
      this.viewAbnormal(this.$route.query)
    }
  },
  // watch: {
  //   abnormalForm: {
  //     handler(val) {
  //       this.getAbnormalData();
  //     },
  //     deep: true
  //   }
  // },
  methods: {
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        if(document.getElementById("abnormalDiv")){
          let formDivWidth = (document.getElementById("abnormalDiv").clientWidth - 500);
          this.formDivLen = Math.trunc( formDivWidth / 240)
        }
        let taskSituationDivHeight = 0
        if (document.getElementById("taskSituationDiv")) {
          taskSituationDivHeight = document.getElementById("taskSituationDiv").clientHeight;
        }
        if (document.getElementById("formDiv")) {
          this.formDivHeight = document.getElementById("formDiv").clientHeight;
        } 
        let moreSearchHeight = 0
        if (document.getElementById("formMoreDiv")) {
          moreSearchHeight = Number(document.getElementById("formMoreDiv").clientHeight) + 24;
        }
        this.tableHeight = Number(this.abnormalDivHeight) - Number(this.formDivHeight) - Number(taskSituationDivHeight) - Number(moreSearchHeight) - 20;
      }, 200);
    },
    getOverviewData() {
      this.requestMethodGet("/device/check/abnormal/overview", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.taskCate.forEach(item => {
            item.val = data[item.code];
          });
          this.handleTableHeight()
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 批量导出
    exportHandle() {
      if (this.selectTableData.length > 0) {
        this.dialogVisibleExport = true;
      } else {
        if (this.totalNumber > 10000) {
          this.$confirm("超过导出上限（1万条），请尝试以下方法分批导出：<br/> 1、选择 1 条或 N 条数据导出 <br/> 2、筛选特定属性的数据后导出", "导出为Excel", {
            confirmButtonText: "取消",
            showCancelButton: false,
            dangerouslyUseHTMLString: true
            // type: "error"
          })
            .then(() => {})
            .catch(() => {});
        } else if (this.totalNumber == 0) {
          this.$message({
            message: "暂无内容导出",
            type: "error"
          });
        } else {
          this.dialogVisibleExport = true;
        }
      }
    },
    submitExport() {
    const date = new Date();
    const year = date.getFullYear(); // 获取当前年份
    const mon = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1); // 获取当前月份
    const da = date.getDate()+1 > 10 ? date.getDate() : "0" + date.getDate(); // 获取当前日
    
    let time = "" + year + mon + da
    let title = '设备异常记录'+'_'+time+'.xlsx'
    // 导出
    let exportTask = [];
    this.selectTableData.forEach(it => {
      exportTask.push(it.id);
    });
    const ids = exportTask;
    let orderBy = this.sortMethod;
    let descFlag = !this.sortType;
    let abnormalForm = _.cloneDeep(this.abnormalForm)
    const params = { ...abnormalForm, orderBy, descFlag };
    params.abnormalStatus = params.abnormalStatus === ""?[]:params.abnormalStatus
    if (params.deviceTypeList.length) {
      let deviceTypeList = []
      params.deviceTypeList.forEach(item=>{
        deviceTypeList.push(item[item.length - 1])
      })
      params.deviceTypeList = deviceTypeList;
    } else {
      params.deviceTypeList = [];
    }
    let groupId = "";
    if (params.groupId.length) {
      let groupIdArr = []
      params.groupId.forEach(item=>{
        groupIdArr.push(item[1])
      })
      groupId = groupIdArr.toString();
    }
    let paramObj = {
        sourceTaskIds: ids,
        abnormalNo:params.abnormalNo,
        abnormalSource:params.abnormalSource,
        abnormalStatus:params.abnormalStatus,
        companyId:params.companyId,
        createDate:params.createDate,
        descFlag:params.descFlag,
        deviceCode:params.deviceCode,
        devicePosition:params.devicePosition,
        deviceTypeList:params.deviceTypeList,
        groupId:groupId,
        orderBy:params.orderBy,
        priority:params.priority.toString(),
        workshopId:params.workshopId,
        distributorName:params.distributorName,
        deviceName:params.deviceName,
        createUserName:params.createUserName,
        abnormalType:params.abnormalType.toString(),
        createStartTime:params.createStartTime,
        createEndTime:params.createEndTime,
        responseTypeBlob: true
    }
    const loading = this.$loading({
      lock: true,
      text: "数据下载中，请稍后",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.requestMethodPost("/device/check/exportAbnormalList", paramObj).then(res => {
      let data = res.data;
      let fileReader = new FileReader();
      let that = this;
      loading.close();
      this.dialogVisibleExport = false
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
          that.$refs["tableRef"].clearSelection();
          that.selectTableData =[]
          console.log(that.selectTableData)
          link.setAttribute("download", title);
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
    getAbnormalData() {
      this.loading = true;
      let orderBy = this.sortMethod;
      let descFlag = !this.sortType;
      let abnormalForm = _.cloneDeep(this.abnormalForm)
      const params = { ...abnormalForm, orderBy, descFlag };
      params.abnormalStatus = params.abnormalStatus === ""?[]:params.abnormalStatus
      params.priority = params.priority.toString()
      params.abnormalType = params.abnormalType.toString()
      if (params.deviceTypeList.length) {
        let deviceTypeList = []
        params.deviceTypeList.forEach(item=>{
          deviceTypeList.push(item[item.length - 1])
        })
        params.deviceTypeList = deviceTypeList;
      } else {
        params.deviceTypeList = [];
      }
      let groupId = "";
      if (params.groupId.length) {
        let groupIdArr = []
        params.groupId.forEach(item=>{
          groupIdArr.push(item[1])
        })
        groupId = groupIdArr.toString();
      }
      params.groupId = groupId
      params.menuCode = 'Event_web'
      this.requestMethodPost("/device/check/abnormal/queryListByPage", params)
        .then(res => {
          this.loading = false;
          if (res.data.code == 1000) {
            this.abnormalTableData = res.data.data.list;
            this.totalNumber = res.data.data.totalCount;
            this.$gio.filterEvent({
              eventID: params.abnormalNo,
              priority: this.$gio.findValueCodeCorresponding(this.priorityList, params.priority, "value", "label"),
              customer: this.$gio.findValueCodeCorresponding(this.customerList, params.companyId, "companyId", "companyName"),
              workshop: this.$gio.findValueCodeCorresponding(this.workshopList, params.workshopId, "workshopId", "workshopName"),
              eventSource: this.$gio.findValueCodeCorresponding(this.abnormalSourceList, params.abnormalSource, "value", "label"),
              generateTime: params.createDate,
              deviceType: this.$gio.findValueCodeCorresponding(this.eptList, params.deviceTypeList, "code", "name", true)
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 查询所属客户
    getCustomerData() {
      let params = {
        companyType: 2,
        size: 200,
        status: 1,
        companyName: this.selectCompanyName
      };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.customerList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      this.getCustomerData();
    },
    clearCustomer(val) {
      if (!val) {
        this.selectCompanyName = "";
        ++this.groupKey;
        this.groupList = [];
        this.workshopList = [];
        this.getCustomerData();
      }
    },
    companyChange() {
      this.getWorkshopList();
      this.getGroupTree();
    },
    visibleChange(val) {
      if (val && this.userInfo.userType < 2) {
        if (!this.abnormalForm.companyId) {
          this.$message({
            type: "warning",
            message: "请选择所属客户"
          });
        }else{
          if(this.abnormalForm.companyId.toString().includes(',')){
            this.$message({
              type: "warning",
              message: "请选择一个客户后重新尝试"
            });
          }
        }
      }
    },
    getWorkshopList() {
      const params = {
        companyId: this.userInfo.userType < 2 ? this.abnormalForm.companyId : this.userInfo.companyId,
        workshopName: "",
        current: 1,
        size: 300
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workshopList = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 获取分组树
    getGroupTree() {
      if(this.userInfo.userType != 2){
        if(this.abnormalForm.companyId.toString().includes(',')){
          return;
        }
      }
      const params = {
        companyId: this.userInfo.userType < 2 ? this.abnormalForm.companyId : this.userInfo.companyId
      };
      if (!params.companyId) {
        return;
      }
      this.requestMethodGet("/weChat/deviceGroup/getDeviceGroupTree", params).then(res => {
        if (res.data.code == 1000) {
          this.groupList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 设备类型
    getEptList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {}).then(res => {
        if (res.data.code == 1000) {
          this.eptList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 创建异常
    createAbnormal() {
      this.selectCompanyName = "";
      // this.getCustomerData();
      this.abnormalDialog = true;
    },
    // 取消创建异常
    abnormalStepOneCancel(formName) {
      this.stepOneForm.abnormalDesc = "";
      this.stepOneForm.imageList = [];
      this.hideUpload = false;
      this.$refs[formName].resetFields();
      this.abnormalDialog = false;
      this.checkedDevice = [];
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.previewImg = true;
    },
    closeImgPreview() {
      this.previewImg = false;
    },
    // 下一步
    abnormalStepOneNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.checkedDevice = [];
          this.chooseDeviceDialogFlag = true;
        } else {
          return false;
        }
      });
    },
    handleAddFile(file, fileList) {
      if (!file.raw.type.startsWith("image")) {
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      this.stepOneForm.imageList.push({ url: file.url });
      let params = new FormData();
      params.append("fileType", "device_abnormal");
      params.append("multipartFiles", file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.stepOneForm.imageList.map(it => {
              if (it.url == file.url) {
                it.attachmentHalfUrl = res.data[0];
              }
            });
            this.hideUpload = this.stepOneForm.imageList.length == 9;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleRemove(imgItem) {
      this.stepOneForm.imageList.forEach((it, index) => {
        if (it.uid == imgItem.uid) {
          this.stepOneForm.imageList.splice(index, 1);
        }
      });
      this.hideUpload = this.stepOneForm.imageList.length == 9;
    },
    // 取消选择设备
    cancelChooseDevice() {
      this.chooseDeviceDialogFlag = false;
      this.checkedDevice = [];
    },
    // 确定选择设备-创建异常
    confirmChooseDevice(list) {
      if (!list.length || (list.length == 1 && Object.keys(list[0]).length == 0)) {
        this.$message({
          type: "warning",
          message: "请选择设备"
        });
        return;
      }
      this.checkedDevice = list;
      let params = Object.assign({}, this.stepOneForm);
      let imgList = [];
      if (this.stepOneForm.imageList.length) {
        this.stepOneForm.imageList.forEach(it => {
          imgList.push(it.attachmentHalfUrl);
        });
      }
      console.log(this.userInfo)
      params.companyId = this.userInfo.orgId;
      params.pictureOssPaths = imgList;
      params.deviceId = list[0].id;
      this.requestMethodPost("/device/check/abnormal/create", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "创建成功"
          });
          this.stepOneForm.abnormalDesc = "";
          this.stepOneForm.imageList = [];
          this.chooseDeviceDialogFlag = false;
          this.abnormalDialog = false;
          this.abnormalForm.size = 30;
          this.abnormalForm.current = 1;
          this.getOverviewData();
          this.getAbnormalData();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 上一步
    upStep() {
      this.chooseDeviceDialogFlag = false;
      this.checkedDevice = [];
    },
    // 重置
    resetSearch() {
      if(this.abnormalForm.companyId){
        this.$refs["selectCustomer"].clearSelectCustomer()
      }
      this.selectCustomerList = []
      for (let key in this.abnormalForm) {
        this.abnormalForm[key] = "";
      }
      this.abnormalForm.groupId = [];
      this.abnormalForm.abnormalStatus = [0];
      this.abnormalForm.size = 30;
      this.abnormalForm.current = 1;
      this.sortMethod = "createTime"
      this.sortType = false
      if(this.userInfo.userType != 2){
        ++this.groupKey;
        this.groupList = [];
      } 
      this.tableDataHeader.forEach(item=>{
        item.changeValue=""
        if(item.sortTypeVal){
          if(item.paramValue == "createTime"){
            item.sortTypeVal = 'sortDown'
          }else{
            item.sortTypeVal = 'sortDefault'
          }
        }
        if(item.paramValue=='abnormalStatus'){
          item.changeValue =  [0]
        }
        if(item.paramValue == "workshopId" && this.userInfo.userType != 2){
          item.showTips = false
          item.selectOptions = []
        }
      })
      this.abnormalForm.current = 1;
      this.getAbnormalData()
    },
    handleMoreSearch() {
      this.showMoreSearch = !this.showMoreSearch;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    },
    // 批量处理
    batchHandle() {
      if (!this.selectTableData.length) {
        this.$message({
          type: "warning",
          message: "请选择需要批量处理的数据"
        });
        return;
      }
      this.batchHandleDialog = true;
    },
    // 全部未处理
    allNotProcessed() {
      this.handleType = 0;
      this.handleAbnormal();
    },
    // 全部已处理
    allProcessed() {
      this.handleType = 1;
      this.handleAbnormal();
    },
    handleAbnormal() {
      let list = [];
      this.selectTableData.forEach(it => {
        list.push(it.id);
      });
      const params = {
        abnormalStatus: this.handleType,
        abnormalIds: list
      };
      this.requestMethodPost("/device/check/abnormal/batchUpdate", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "处理成功"
          });
          this.abnormalForm.size = 30;
          this.abnormalForm.current = 1;
          this.batchHandleDialog = false;
          this.selectTableData = [];
          this.$refs.tableRef.clearSelection();
          this.getOverviewData();
          this.getAbnormalData();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 勾选表格
    selectTable(selection, row) {
      this.selectTableData = selection;
    },
    selectAllTable(val) {
      this.selectTableData = val;
    },
    // 查看
    viewAbnormal(row) {
      this.abnormalStatus = row.abnormalStatus;
      this.abnormalId = row.id;
      this.openDrawFlag = true;
      this.currentAbnomalData = row;
      this.$gio.toEventPage({
        operation: "异常记录"
      });
      this.$gio.viewEvent({
        eventID: row.abnormalNo
      });
    },
    // 关闭抽屉
    closeDraw() {
      this.currentAbnomalData = null;
      this.openDrawFlag = false;
    },
    refreshList() {
      this.abnormalForm.size = 30;
      this.abnormalForm.current = 1;
      this.$refs.tableRef.clearSelection();
      this.getOverviewData();
      this.getAbnormalData();
      this.openDrawFlag = false;
    },
    handleSizeChange(val) {
      this.abnormalForm.size = val;
      this.$refs.tableRef.clearSelection();
      this.getAbnormalData()
    },
    handleCurrentChange(val) {
      this.abnormalForm.current = val;
      this.$refs.tableRef.clearSelection();
      this.getAbnormalData()
    },
    // 排序
    changeSortType(data) {
      this.sortType = data;
      this.abnormalForm.current = 1;
      this.getAbnormalData();
    },
    changeSortMethod(data) {
      this.sortMethod = data;
      this.abnormalForm.current = 1;
      this.getAbnormalData();
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      if (this.userInfo.userType == 2) {
        this.customFieldlistUnit = this.customFieldlistUnit.filter(item => item.fieldName != "companyName");
      }
      let customFieldlistUnit = [];
      if (fieldDtoList.length != 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "abnormal");
        if (index != -1) {
          let fieldDtoInfos = fieldDtoList[index].fieldDtoInfos;
          customFieldlistUnit = fieldDtoInfos.length == 0 ? this.customFieldlistUnit : fieldDtoInfos;
        } else {
          customFieldlistUnit = this.customFieldlistUnit;
        }
      }
      let customFieldlist = customFieldlistUnit.map(item => {
        item.fieldNameCn = this.tableDataHeaderInit[item.fieldName].label;
        return item;
      });
      customFieldlist.sort((a, b) => {
        return a.sort - b.sort;
      });
      this.customFieldlist = customFieldlist;
      let tableDataHeader = [];
      this.customFieldlist.forEach(item => {
        if (item.visible != 0) {
          tableDataHeader.push(this.tableDataHeaderInit[item.fieldName]);
        }
      });
      if (this.tableDataHeaderInit.selection) {
        tableDataHeader.unshift(this.tableDataHeaderInit.selection);
      }
      this.tableDataHeader = tableDataHeader;
      this.tableDataHeader.forEach(item=>{
        if(item.paramValue=='abnormalStatus'){
          item.changeValue =  [0]
        }
      })
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
    // 排序
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal
      this.sortMethod = obj.paramValue
      if(sortVal=='sortUp'){
        this.sortType = true
      }else if(sortVal=='sortDown'){
        this.sortType = false
      }
      this.tableDataHeader.forEach(item=>{
        if(item.sortTypeVal){
          if(item.paramValue&&(item.paramValue == this.sortMethod)){
            item.sortTypeVal = sortVal
          }else if(item.paramValue&&(item.paramValue != this.sortMethod)){
            item.sortTypeVal = 'sortDefault'
          }
        }
      })
      this.abnormalForm.current = 1;
      this.getAbnormalData();
    },
    tableTitleSearch(obj){
      let searchVal = obj.changeValue
      this.tableDataHeader.forEach(item=>{
        if(obj.paramValue==item.paramValue){
          item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
        }
      })
      if(obj.paramValue=="createTime"){
        if(searchVal){
          this.abnormalForm.createStartTime = searchVal[0]
          this.abnormalForm.createEndTime = searchVal[1]
        }else{
          this.abnormalForm.createStartTime = ''
          this.abnormalForm.createEndTime = ''
        }
      }else{
        this.abnormalForm[obj.paramValue] = searchVal
      }
      this.abnormalForm.current = 1;
      this.getAbnormalData();
    },
    showSelectCustomer() {
      this.showCustomerDialog = true
    },
    handleClearCustomer() {
      this.selectCustomerList = []
      this.abnormalForm.companyId = ""
      this.abnormalForm.groupId = []
      this.abnormalForm.workshopId = ""
      this.abnormalForm.current = 1;
      ++this.groupKey;
      this.groupList = [];
      this.tableDataHeader.forEach(item=>{
        if(item.paramValue == "workshopId"){
          item.changeValue=""
          item.showTips = false
          item.selectOptions = []
        }
      })
      this.getAbnormalData();
      this.$refs["selectCustomer"].clearSelectCustomer()
    },
    handleSubmitCustomer(e){
      this.selectCustomerList = e
      let selectList = this.selectCustomerList.map(item=>{
        return item.companyId
      })
      this.abnormalForm.groupId = []
      this.abnormalForm.workshopId = ""
      ++this.groupKey;
      this.groupList = [];
      this.abnormalForm.companyId = selectList.join(",")
      this.getCustomerWorkshopList(selectList.join(","))
      this.getGroupTree();
      this.getAbnormalData();
      this.abnormalForm.current = 1;
      this.showCustomerDialog = false
    },
    handleCloseCustomer(){
      this.showCustomerDialog = false
    },
    getCustomerWorkshopList(companyIds) {
      console.log('----companyIds--',companyIds)
      const params = {
        accountIds: [...companyIds.split(',')],
        current: 1,
        size: 500
      };
      this.requestMethodPostTip("/weChat/workshop/filterWorkshop", params)
        .then(res => {
          if (res.data.code == 1000) {
            let workshopList = [];
            if(res.data.data.list.length>0){
              res.data.data.list.forEach(item=>{
                let obj = {
                  code:item.id,
                  name:item.name
                }
                workshopList.push(obj)
              })
            }
            this.tableDataHeader.forEach(item=>{
              if(item.paramValue == "workshopId"){
                item.changeValue=""
                item.showTips = companyIds.toString().includes(',')?true:false
                item.selectOptions = workshopList
              }
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 复制异常ID编号
    onCopy(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.$set(this.createUserDetail,'headUrl',res.data.data)
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
        this.createUserDetail = {};
        let param = {
          userId: val
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.$refs[`popovers-${index}`].doShow();
                this.createUserDetail = res.data;
                if (this.createUserDetail.avatar) {
                  this.getFullUrl(this.createUserDetail.avatar);
                }
                if (this.createUserDetail.roleNames) {
                  this.createUserDetail.roleNames = this.createUserDetail.roleNames.join(",");
                }
                if (this.createUserDetail.phonenumber) {
                  const phoneNum = this.createUserDetail.phonenumber;
                  this.createUserDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
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
      this.createUserDetail = {};
      if (scope.row.createUserId) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        this.getUserDetail(scope.row.createUserId, scope.$index, "");
      }
    },
  },
  
  
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.handleTableHeight();
    });
  }
};
</script>
<style lang="less" scoped>
@import "../../../assets/css/customTable.less";
.abnormal-container {
  position: relative;
}
.noShowImgUpload /deep/ .el-upload--picture-card {
  display: none !important;
}
.tips {
  display: flex;
  align-items: center;
  color: #b2b2b2;
  justify-content: flex-end;
}
.task-sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  padding: 0 20px;
}
.work-order-component {
  padding: 20px 20px 0 20px;
  height: 109%;
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
}
/deep/.el-upload--picture-card {
  width: 100px;
  height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
/deep/.el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 100px;
  height: 100px;
}
.task-situation-super{
  width: calc(20% - 14px);
}
.marBottom{
  margin-bottom: 12px;
}
.self-tips {
  margin-left: 10px;
  min-height: 20px;
  min-width: 20px;
  width: 20px;
  height: 20px;
  background-color: #ccddff;
  border-radius: 4px;
  display: inline-block;
  text-align: center;
  font-size: 12px;
  line-height: 22px;
  color: #666;
}
</style>
