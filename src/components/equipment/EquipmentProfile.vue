<!--
* @description 设备档案
* @fileName EquipmentProfile.vue
* @author vvx
* @date 2020/04/15 15:53:46
* @version V1.0.0
!-->
<template>
  <div style="position: relative">
    <div class="tips" style="position: absolute; right: 20px; top: -40px">
      <i class="el-icon-warning" />
      <span style="margin:0 0 0 8px">仅统计与登陆人相关的设备</span>
    </div>
    <!-- 统计看板 -->
    <header class="task-situation" id="taskSituationDiv">
      <div class="task-situation-item task-situation-super" v-for="item in taskCate" :key="item.cateName">
        <div class="task-left-text">{{ item.cateName }}</div>
        <div class="task-left-number">{{ item.val }}</div>
      </div>
    </header>
    <div class="customer-profile">
      <!-- 表格操作 -->
      <div class="toolbox-con flexBetween">
        <!-- 查询条件 -->
        <el-form ref="form" id="formFilter" :model="queryParams" :inline="true" size="small">
          <el-form-item label="所属客户" v-if="userInfo.userType != 2" class="form-item-outline">
            <div class="select_customer" @click="showSelectCustomer" :style="selectCustomerList.length > 0 ? 'color:#606266;' : ''">
              {{ selectCustomerList.length > 0 ? "指定客户" + selectCustomerList.length : "请选择" }}
              <i class="el-icon-close" style="color:#C0C4CC;" v-show="selectCustomerList.length > 0" @click.stop="handleClearCustomer"></i>
            </div>
          </el-form-item>
          <el-form-item class="form-item-outline" label="设备分组">
            <el-cascader
              :style="{ width: queryParams.groupIdList.length == 0 ? '180px' : '260px' }"
              :options="groupList"
              :key="groupKey"
              :props="{ label: 'groupName', value: 'id', multiple: true }"
              collapse-tags
              size="small"
              v-model="queryParams.groupIdList"
              placeholder="请选择"
              no-data-text="暂无分组"
              @visible-change="groupVisibleChange"
              filterable
              clearable
            >
            </el-cascader>
          </el-form-item>
          <el-form-item class="form-item-outline" label="在用油品">
            <el-select
              size="small"
              :style="{ width: queryParams.currentOilCodeList.length == 0 ? '180px' : '300px' }"
              v-model="queryParams.currentOilCodeList"
              placeholder="请选择"
              clearable
              filterable
              multiple
              collapse-tags
              remote
              :remote-method="getOilList"
              :loading="loadingRemote"
            >
              <el-option v-for="item in oilList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="danger" plain @click="handleSearchTableData">搜索</el-button>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button @click="confirmDelete" v-has="EPDeleteBtnAll" size="small" v-gio.click="clickBulkDeleteButton">批量删除</el-button>
          <el-button @click="recycleBin" v-has="recycleBinWeb" size="small">回收站</el-button>
          <el-button @click="handleEditHistory" v-has="EPEditHistBtn" size="small" v-gio.click="clickEditHistory">编辑历史</el-button>
          <el-button @click="downQrcodeDialog = true" size="small" :loading="isloadingBatch">批量下载设备铭牌</el-button>
          <el-button type="danger" plain size="small" @click="importFile" v-has="EPDownUpBtn">批量导入</el-button>
          <el-button type="danger" plain @click="handleDown" v-has="EPDownloadBtn" size="small">批量导出</el-button>
          <el-button type="danger" plain @click="confirmSelect" v-has="EPEditBtnAll" size="small">批量编辑</el-button>
          <el-button type="danger" size="small" @click="handleAdd" v-has="EPAddBtn">新建设备</el-button>
          <custom-field class="marLeft" @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="device"></custom-field>
        </div>
      </div>
      <custom-table
        ref="deviceTable"
        :tableHeader="tableDataHeader"
        :tableData="epTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        :listEmptyType="listEmptyType"
        :limitFlag="limitFlag"
        @selectionChange="handleSelectionChange"
        @rowClick="handleCurrentChangeRow"
        @changeSortTable="changeSortTable"
        @changeSearch="tableTitleSearch"
      >
        <el-table-column fixed slot="selection" type="selection" :reserve-selection="true" :resizable="false" align="center" width="55"></el-table-column>
        <template v-slot:deviceName="slotProps">
          <el-table-column
            fixed
            label="设备名称"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="设备名称"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValueInput="slotProps.slotData.changeValueInput"
                :changeValueSelect="slotProps.slotData.changeValueSelect"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.deviceName || "-" }}</span>
                <el-tag v-if="!scope.row.deviceActiveStatus" class="unActiveTag">非活跃</el-tag>
                <el-tag v-if="scope.row.deviceServiceStatus" class="unActiveTag" style="background: rgba(0, 136, 136, 0.1); color: rgb(0, 136, 136)">服务中</el-tag>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:lubricationPointNum="slotProps">
          <el-table-column
            label="润滑点数"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
            v-if="userInfo.userType < 2"
          >
            <template slot-scope="scope">
              {{ scope.row.lubricationPointNum || "-" }}
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
                <img v-if="scope.row.pesFlag == '1' || scope.row.pesFlag == '3'" src="../../assets/pes-icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.pesFlag == '2' || scope.row.pesFlag == '3'" src="../../assets/DPES_icon.png" alt="" style="width: 24px; height: 23px; margin-left: 8px" />
                <img v-if="scope.row.spFlag == '1'" src="../../assets/sp-icon.png" alt="" style="width: 20px; height: 20px; margin-left: 8px" />
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
            <template slot="header" v-if="userInfo.userType != 2 && !queryParams.companyId">
              <span>所属车间</span>
            </template>
            <template slot="header" v-if="(userInfo.userType != 2 && queryParams.companyId) || userInfo.userType == 2">
              <column-header
                title="所属车间"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectOptions="slotProps.slotData.selectOptions"
                :showTips="slotProps.slotData.showTips"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.workshopName || "-" }}</span>
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
            <template slot-scope="scope">
              <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                <div>
                  <div style="display: flex;align-items:center;">
                    <img :src="createUserDetail.headUrl ? createUserDetail.headUrl : require('../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                    <div style="flex: 1; margin-left: 10px">
                      <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ createUserDetail.userName }}</div>
                    </div>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">电话: </span>
                    <span>{{ formatPhonenumber(createUserDetail.phonenumber) }}</span>
                    <el-button
                      class="copy_tel"
                      style="padding: 0px"
                      type="text"
                      v-clipboard:copy="createUserDetail.phonenumber"
                      v-clipboard:success="onCopyTel"
                      v-clipboard:error="onErrorTel"
                      v-if="createUserDetail.phonenumber"
                    >
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                    </el-button>
                  </div>
                  <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                    <span style="color: #666; margin-right: 8px">邮箱: </span>
                    <span>{{ formatEmail(createUserDetail.email) }}</span>
                    <el-button
                      class="copy_mail"
                      type="text"
                      v-clipboard:copy="createUserDetail.email"
                      v-clipboard:success="onCopyMail"
                      v-clipboard:error="onErrorMail"
                      style="padding: 0px"
                      v-if="createUserDetail.email"
                    >
                      <img src="../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
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
        <template v-slot:dataIntegrityFlag="slotProps">
          <el-table-column
            label="信息状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
            v-if="userInfo.userType < 2"
          >
            <template slot="header">
              <column-header
                title="信息状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
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
        </template>
        <template v-slot:deviceCode="slotProps">
          <el-table-column
            label="设备编码"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
            v-if="userInfo.userType == 2"
          >
            <template slot="header">
              <column-header
                title="设备编码"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              {{ scope.row.deviceCode || "-" }}
            </template>
          </el-table-column>
        </template>
        <template v-slot:customerVisibility="slotProps" v-if="userInfo.userType != '2'">
          <el-table-column
            label="客户可见性"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="客户可见性"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span>{{ scope.row.customerVisibility == 0 ? "不可见" : "可见" }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:createMethod="slotProps" v-if="userInfo.userType != '2'">
          <el-table-column
            label="创建类型"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="创建类型"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              {{ scope.row.createMethod == 1 ? "客户创建" : "经销商创建" }}
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="100" align="center">
          <i class="el-icon-share"></i>
          <template slot-scope="scope">
            <el-link @click="handleLook(scope.row)" style="margin-right: 10px; color: #001450">查看</el-link>
          </template>
        </el-table-column>
      </custom-table>
      <el-pagination
        v-if="totalNumber"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenation.current"
        :page-size="pagenation.size"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalNumber"
        class="listOptimizePage"
      ></el-pagination>
      <!-- 导入文件弹框 -->
      <el-dialog :visible.sync="showImportFileFlag" width="35%" :close-on-click-modal="false">
        <div slot="title">
          <span>批量导入</span>
          <span style="color: #ccc; margin-left: 15px; font-size: 14px">请您下载模版，并根据模版要求进行整理上传</span>
        </div>
        <el-form :model="fileForm" ref="fileForm" :rules="rules" style="padding: 40px 20px" label-width="100px" label-position="top">
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item label="所属客户" prop="customerNumber" v-if="userInfo.userType < 2">
                <el-select
                  size="small"
                  clearable
                  filterable
                  v-model="fileForm.customerNumber"
                  :filter-method="customerAllFilter"
                  @change="handleChangeCustomer"
                  placeholder="请选择"
                  style="width: 80%"
                >
                  <el-option v-for="item in customerList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"></el-option>
                </el-select>
              </el-form-item>
              <div v-else style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 5px">{{ userInfo.orgInfo.companyName }}</div>
            </el-col>
            <el-col :span="10">
              <!-- <el-form-item label="" prop="workshopId">
                <el-select v-model="fileForm.workshopId" placeholder="所属车间" size="small" clearable style="width: 80%" filterable>
                  <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"></el-option>
                </el-select>

              </el-form-item> -->
              <el-form-item label="是否是新项目设备初装生意？" prop="newBusinessFlag" label-width="220px" v-if="userInfo.userType < 2">
                <el-radio-group v-model="fileForm.newBusinessFlag">
                  <el-radio :label="false">现有生意</el-radio>
                  <el-radio :label="true">新项目初装</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="flex-center" style="font-size: 14px; font-family: MicrosoftYaHei; justify-content: space-between;margin-top:25px;">
            <span style="color: rgb(221, 0, 0)">请您下载模板，并根据模板要求进行整理上传</span>
            <el-link type="danger" @click="downloadTemplate('fileForm')" style="color: rgb(0, 20, 80)">点击下载模板</el-link>
          </div>
          <el-form-item required style="margin-top: 20px">
            <el-upload
              class="upload-demo"
              drag
              action="uploadUrl"
              :auto-upload="false"
              accept=".xlsx"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleFileChange"
              style="width: 100%"
              :file-list="fileForm.fileList"
            >
              <div>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或 <em style="color: rgb(0, 20, 80)">点击上传</em></div>
              </div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelUploadFile('fileForm')">取 消</el-button>
          <el-button type="primary" @click="submitFile('fileForm')">提 交</el-button>
        </div>
      </el-dialog>
      <!-- 导入结果 弹框 -->
      <el-dialog title="导入结果" :visible.sync="uploadResultsDialog" :close-on-click-modal="false" width="500px">
        <div style="margin: 0 20px">
          <div class="flex-center" style="margin-top: 16px; padding: 16px; border-radius: 4px; border: 1px solid rgba(233, 233, 233, 0.4); justify-content: space-between">
            <div><span style="width: 10px; height: 10px; border-radius: 50%; background: rgba(0, 136, 136); display: inline-block; margin-right: 8px"></span>新建</div>
            <div>新建设备 {{ importResult.caret }} 个，润滑点 {{ importResult.caretLuCount }} 个</div>
          </div>
          <div class="flex-center" style="margin-top: 16px; padding: 16px; border-radius: 4px; border: 1px solid rgba(233, 233, 233, 0.4); justify-content: space-between">
            <div><span style="width: 10px; height: 10px; border-radius: 50%; background: rgba(0, 136, 136); display: inline-block; margin-right: 8px"></span>更新</div>
            <div>更新设备 {{ importResult.upDeviceCount }} 个，润滑点 {{ importResult.upLuCount }} 个</div>
          </div>
          <div class="flex-center" style="margin-top: 16px; padding: 16px; border-radius: 4px; border: 1px solid rgba(233, 233, 233, 0.4); justify-content: space-between">
            <div><span style="width: 10px; height: 10px; border-radius: 50%; background: rgba(221, 0, 0); display: inline-block; margin-right: 8px"></span>失败</div>
            <div>新建或更新失败 {{ importResult.failCount }} 行数据，详情请下载错误数据查看</div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="closeUploadResult()">关闭</el-button>
          <el-button type="danger" v-if="importResult.failCount != 0" size="small" @click="downloadErrorData">错误结果下载</el-button>
        </span>
      </el-dialog>
      <!-- 变更历史弹框 -->
      <el-dialog :visible.sync="dialogEditHistoryVisible" width="54%" :close-on-click-modal="false">
        <div slot="title">
          <span>编辑历史</span>
        </div>
        <EditTable
          :key="key"
          :cHDataTotalNumber="cHDataTotalNumber"
          :changeHistoryTableData="changeHistoryTableData"
          :current="pagenationCH.current"
          :size="pagenationCH.size"
          @handleSizeChangeCH="handleSizeChangeCH"
          @handleCurrentChangeCH="handleCurrentChangeCH"
        />
        <div slot="footer" class="dialog-footer" style="margin-top: 20px"></div>
      </el-dialog>
      <!-- 回收站弹框 -->
      <div class="recycle-bin">
        <el-dialog :visible.sync="showRecycleBinDialog" width="65%" :close-on-click-modal="false">
          <div slot="title">
            <span>回收站</span>
          </div>
          <div class="main-content">
            <div class="leftCont" style="width: 160px">
              <div v-for="item in levelList" :key="item.id" class="level-item-content" @click="clickLevel1(item)" :style="{ backgroundColor: item.isActive ? '#fff' : '' }">
                <div>
                  <span style="margin-right: 10px">{{ item.serviceName }}</span
                  ><span :style="{ backgroundColor: item.isActive ? '#fff' : '' }">{{ item.total }}</span>
                </div>
              </div>
            </div>
            <div class="rightCont" style="width: calc(100% - 160px)" v-show="tabType == 'equipmentTab'">
              <!-- 回收站 设备表 -->
              <RecycleBinDevcieTable
                :eqTableData="eqTableData"
                :size="pagenationEq.size"
                :current="pagenationEq.current"
                :eqTotal="eqTotal"
                @handleCurrentEq="handleCurrentEq"
                @handleSizeEq="handleSizeEq"
                @handleReductionEq="handleReductionEq"
              />
            </div>
            <div class="rightCont" style="width: calc(100% - 160px)" v-show="tabType == 'lMTab'">
              <!-- 回收站 润滑表 -->
              <RecycleBinLubTable
                :size="pagenationLm.size"
                :current="pagenationLm.current"
                :lMTableData="lMTableData"
                :lMTotal="lMTotal"
                @handleSizeLm="handleSizeLm"
                @handleCurrentLm="handleCurrentLm"
                @handleReductionLm="handleReductionLm"
              />
            </div>
          </div>
          <div slot="footer" class="dialog-footer" style="margin-top: 20px"></div>
        </el-dialog>
      </div>
      <!-- 批量编辑 弹框 -->
      <el-dialog :visible.sync="batchEditDialogVisible" width="54%" @close="closeBatchEdit('addCondition')" :close-on-click-modal="false">
        <div slot="title">
          <span>批量编辑</span>
        </div>
        <div style="padding: 20px 60px">
          <div style="color: #f56c6c">本次已选设备数：{{ deviceCount }}，润滑点数：{{ dynamicTags.length }}</div>
          <!-- 润滑点明细 -->
          <div style="border: 1px solid #e7e7e7; border-radius: 6px; padding: 10px 10px 0; margin-top: 20px; max-height: 120px; overflow-y: auto">
            <div style="color: #f56c6c; margin-bottom: 10px">润滑点明细：</div>
            <el-tag style="margin-bottom: 10px" v-for="tag in dynamicTags" :key="tag.name" @close="handleClose(tag)" closable>
              {{ tag.lubricationPointType }} <span v-if="tag.lubricationPointName">- {{ tag.lubricationPointName }}</span> (所属设备：{{ tag.deviceName }})
            </el-tag>
          </div>
          <el-form :model="conditionsRulesForm" ref="addCondition" :rules="conditionsFormRules" style="margin-left: 40px; margin-bottom: 55px; margin-top: 40px">
            <div v-for="(item, index) in conditionsRulesForm.iotDataList" :key="index">
              <el-row>
                <el-col :span="9" style="margin-right: 10px">
                  <el-form-item class="monitorNumber" label="字段名称：" :prop="'iotDataList.' + index + '.name'" :rules="conditionsFormRules.name">
                    <el-cascader
                      :ref="'cascader' + index"
                      v-model="item.name"
                      :props="{ label: 'name', value: 'name', children: 'child', emitPath: false }"
                      :options="fieldNameData"
                      :disabled="item.disabled"
                      :show-all-levels="false"
                      @visible-change="visibleChange"
                      @change="changeEditName(item, index)"
                      size="small"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="width: 5%; height: 32px; line-height: 32px"> = </el-col>
                <el-col :span="10" style="margin-right: 10px; width: 41%; height: 54px">
                  <el-form-item class="changeCont" v-if="item.name == ''" label="更新值：" :prop="'iotDataList.' + index + '.changeCont'" :rules="conditionsFormRules.changeCont">
                    <el-input clearable size="small" v-model="item.changeCont" maxlength="50" autocomplete="off" style="width: 70%"></el-input>
                  </el-form-item>
                  <el-form-item
                    class="changeCont"
                    v-if="item.name == '制造商' || item.name == '设备型号' || item.name == '设备编码' || item.name == '设备位置' || item.name == '润滑点设备制造商名称'"
                    label="更新值："
                    :prop="'iotDataList.' + index + '.changeCont'"
                    :rules="conditionsFormRules.changeCont"
                  >
                    <el-input clearable size="small" v-model="item.changeCont" maxlength="50" autocomplete="off" style="width: 70%"></el-input>
                  </el-form-item>
                  <el-form-item class="changeCont" v-if="item.name == '在用油品牌'" label="更新值：" :prop="'iotDataList.' + index + '.oilBrand'" :rules="conditionsFormRules.oilBrand">
                    <el-select style="width: 60%" v-model="item.oilBrand" clearable filterable size="small">
                      <el-option v-for="item in oilBrandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    class="changeCont"
                    v-if="item.name == '设备制造商推荐油品'"
                    label="更新值："
                    :prop="'iotDataList.' + index + '.recommendOilCode'"
                    :rules="conditionsFormRules.recommendOilCode"
                  >
                    <el-select style="width: 60%" v-model="item.recommendOilCode" clearable filterable remote :remote-method="$_queryOilData" :loading="loadingRemote" size="small">
                      <el-option v-for="item in oilListData" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                    </el-select>
                    <!-- <el-cascader
                      size="small"
                      placeholder="请选择"
                      emitPath="false"
                      v-model="item.recommendOilCode"
                      :options="oilListData"
                      :show-all-levels="false"
                      :props="typeProps"
                      clearable
                      style="width: 70%"
                      @change="value => changeEditName(value, item)"
                    ></el-cascader> -->
                  </el-form-item>
                  <el-form-item v-if="item.name == '油箱容量'">
                    <span slot="label"><span style="color: red; margin-right: 4px">*</span>更新值：</span>
                    <el-col :span="9" style="padding: 0">
                      <el-form-item
                        :prop="'iotDataList.' + index + '.oilBoxCapacity'"
                        :rules="[
                          { required: true, message: '更新值不能为空', trigger: 'blur' },
                          { pattern: /^([1-9]\d*)(\.\d{1,3})?$/, message: '数值不能为空或0,且小数点后最多三位小数', trigger: 'blur' }
                        ]"
                      >
                        <el-input size="small" v-model="item.oilBoxCapacity" maxlength="15" placeholder="请输入" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" style="margin-left: 26px">
                      <el-form-item :prop="'iotDataList.' + index + '.oilBoxCapacityUnit'" :rules="[{ required: true, message: '更新值不能为空', trigger: 'change' }]">
                        <el-select size="small" clearable v-model="item.oilBoxCapacityUnit">
                          <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item class="changeCont" v-if="item.name == '润滑方式'" label="更新值：" :prop="'iotDataList.' + index + '.lubricationMethod'" :rules="conditionsFormRules.lubricationMethod">
                    <el-select style="width: 70%" v-model="item.lubricationMethod" clearable @change="value => changeEditName(value, item)" size="small">
                      <el-option v-for="item in lubricationPointTypeData" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="changeCont" v-if="item.name == '在用油品品牌'" label="更新值：" :prop="'iotDataList.' + index + '.oilBrandCode'" :rules="conditionsFormRules.oilBrandCode">
                    <el-select size="small" clearable v-model="item.oilBrandCode" placeholder="请选择" style="width: 70%">
                      <el-option v-for="item in oilBrandList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="changeCont" v-if="item.name == '在用油品名称'" label="更新值：" :prop="'iotDataList.' + index + '.currentOilCode'" :rules="conditionsFormRules.currentOilCode">
                    <el-select size="small" style="width: 60%" v-model="item.currentOilCode" placeholder="请选择" clearable filterable remote :remote-method="$_queryOilData" :loading="loadingRemote">
                      <el-option v-for="item in oilListData" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    class="changeCont"
                    v-if="item.name == '定期或按质换油'"
                    label="更新值："
                    :prop="'iotDataList.' + index + '.oilChangeMethod'"
                    :rules="conditionsFormRules.oilChangeMethod"
                  >
                    <el-select size="small" clearable v-model="item.oilChangeMethod" style="width: 70%">
                      <el-option v-for="item in oilChangeMethodList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    class="changeCont"
                    v-if="item.name == '是否自动生成下次换油计划'"
                    label="更新值："
                    :prop="'iotDataList.' + index + '.autoCreateOilChangePlan'"
                    :rules="conditionsFormRules.autoCreateOilChangePlan"
                  >
                    <el-select size="small" clearable style="width: 70%" v-model="item.autoCreateOilChangePlan">
                      <el-option v-for="item in autoCreateOilAddPlanZhiList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    class="changeCont"
                    v-if="item.name == '上次换油日期'"
                    label="更新值："
                    :prop="'iotDataList.' + index + '.lastOilChangeDate'"
                    :rules="conditionsFormRules.lastOilChangeDate"
                  >
                    <el-date-picker v-model="item.lastOilChangeDate" type="date" size="small" :picker-options="expireTimeOption" style="width: 70%" value-format="yyyy-MM-dd" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item
                    class="changeCont"
                    v-if="item.name == '上次加油/加脂日期'"
                    label="更新值："
                    :prop="'iotDataList.' + index + '.lastOilAddDate'"
                    :rules="conditionsFormRules.lastOilAddDate"
                  >
                    <el-date-picker v-model="item.lastOilAddDate" type="date" size="small" :picker-options="expireTimeOption" style="width: 70%" value-format="yyyy-MM-dd" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item
                    class="changeCont"
                    v-if="item.name == '是否自动生成下次加油/加脂计划'"
                    label="更新值："
                    :prop="'iotDataList.' + index + '.autoCreateOilAddPlanZhi'"
                    :rules="conditionsFormRules.autoCreateOilAddPlanZhi"
                  >
                    <el-select size="small" clearable style="width: 70%" v-model="item.autoCreateOilAddPlan">
                      <el-option v-for="item in autoCreateOilAddPlanZhiList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-if="item.name == '换油周期'">
                    <span slot="label" style="margin-right: 6px"><span style="color: red; margin-right: 4px">*</span>更新值：</span>
                    <el-col :span="9" style="padding: 0">
                      <el-form-item
                        :prop="'iotDataList.' + index + '.oilChangePeriod'"
                        :rules="[{ required: true, message: '更新不能为空', trigger: 'blur' }, { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]"
                      >
                        <el-input size="small" v-model="item.oilChangePeriod" maxlength="10" placeholder="请输入" class="input-with-select" clearable> </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" style="margin-left: 26px">
                      <el-form-item :prop="'iotDataList.' + index + '.oilChangePeriodUnit'" :rules="[{ required: true, message: '更新值不能为空', trigger: 'change' }]">
                        <el-select size="small" clearable v-model="item.oilChangePeriodUnit">
                          <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                  <el-form-item v-if="item.name == '加油/加脂周期'">
                    <span slot="label" style="margin-right: 6px"><span style="color: red; margin-right: 4px">*</span>更新值：</span>
                    <el-col :span="9" style="padding: 0">
                      <el-form-item
                        :prop="'iotDataList.' + index + '.oilAddPeriod'"
                        :rules="[{ required: true, message: '更新值不能为空', trigger: 'blur' }, { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]"
                      >
                        <el-input size="small" v-model="item.oilAddPeriod" maxlength="10" placeholder="请输入" class="input-with-select" clearable> </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" style="margin-left: 26px">
                      <el-form-item :prop="'iotDataList.' + index + '.oilAddPeriodUnit'" :rules="[{ required: true, message: '更新值不能为空', trigger: 'change' }]">
                        <el-select size="small" clearable v-model="item.oilAddPeriodUnit">
                          <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                </el-col>
                <!-- 删除按钮 -->
                <el-col :span="2" style="width: 3%">
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-button @click="delEditFields(index)" style="border: none; background: none; padding: 0px; margin-top: 4px">
                      <i class="el-icon-remove-outline" style="font-size: 20px"></i>
                    </el-button>
                  </el-tooltip>
                </el-col>
              </el-row>
            </div>
            <div>
              <el-tooltip class="item" effect="dark" content="新增" placement="top" v-if="addBtn">
                <el-button @click="addlEditFields" style="cursor: pointer; width: 100%; color: #fe000c; border: 1px dashed #fe000c; height: 40px; padding: 0px; margin-top: 10px; font-size: 26px">
                  +
                </el-button>
              </el-tooltip>
            </div>
            <div style="color: #f56c6c; margin: 20px 0 20px 0px">注意：保存后，更新的字段将全部作用于已选的设备、润滑点</div>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top: 20px">
          <el-button @click="closeBatchEdit('addCondition')">取消</el-button>
          <el-button type="primary" @click="submitBatchEdit('addCondition')">保存</el-button>
        </div>
      </el-dialog>
      <!-- 批量导入错误数据弹框 -->
      <el-dialog title="提示" :visible.sync="errorDataDialog" :close-on-click-modal="false" width="30%">
        <span style="margin-left: 20px">正确数据已导入系统，请下载错误数据！</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="downloadErrorData">错误数据下载</el-button>
        </span>
      </el-dialog>
      <!-- 无法删除设备弹框 -->
      <el-dialog title="" :visible.sync="deleteNoDialog" :close-on-click-modal="false" width="422px">
        <div slot="title" class="flex-center">
          <img src="../../assets/warning-icon.png" alt="" style="width: 24px; height: 24px" />
          <span style="margin-left: 10px; font-family: MicrosoftYaHei; font-size: !8px; color: #000">无法删除部分设备</span>
        </div>
        <div style="margin: 10px 20px 10px 52px">
          <span>部分选中设备下的润滑点有进行中的工单，不可删除，是否删除剩余选中设备？</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancleDeleteNo">取消</el-button>
          <el-button type="danger" size="small" @click="continueDeleteNo">继续删除</el-button>
        </span>
      </el-dialog>
      <!-- 填写批量删除原因 弹框 -->
      <el-dialog title="" :visible.sync="deleteReasonDialog" :close-on-click-modal="false" width="422px">
        <div slot="title" class="flex-center">
          <img src="../../assets/warning-icon.png" alt="" style="width: 24px; height: 24px" />
          <span style="margin-left: 10px; font-family: MicrosoftYaHei; font-size: !8px; color: #000">请填写批量删除原因</span>
        </div>
        <div style="margin: 10px 20px 10px 52px">
          <span>已选择 {{ deviceCountDelete }} 个设备与 {{ LumCountDelete }} 个润滑点。确认删除后，所有设备润滑点的相关信息也将被删除。请填写批量删除原因。</span>
          <el-form ref="deleteForm" :model="deleteReasonForm" :rules="deleteReasonFormRules">
            <el-form-item prop="deleteReasonCont">
              <el-input type="textarea" :rows="3" style="margin-top: 16px" maxlength="100" placeholder="请输入内容" show-word-limit resize="none" v-model="deleteReasonForm.deleteReasonCont">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancleDelete">取消</el-button>
          <el-button type="danger" size="small" @click="continueDelete('deleteForm')" v-gio.click="sumbitBulkDeleteDevice">继续删除</el-button>
        </span>
      </el-dialog>
      <!-- 批量删除结果 弹框 -->
      <el-dialog title="批量删除结果" :visible.sync="deleteResultsDialog" :close-on-click-modal="false" width="422px">
        <div style="margin: 0 20px">
          <span>选中的 {{ deviceCountDelete }} 个设备与 {{ LumCountDelete }} 个润滑点中</span>
          <div class="flex-center" style="margin-top: 16px; padding: 16px; background-image: linear-gradient(to right, rgba(0, 136, 136, 0.1), rgb(255, 255, 255)); border-radius: 4px">
            <img src="../../assets/success-icon.png" alt="" style="width: 24px; height: 24px" />
            <div style="margin-left: 10px; font-family: MicrosoftYaHei; font-size: 14px">
              <div style="color: #000">成功删除</div>
              <div style="color: rgb(153, 153, 153)">{{ deleteDetailSuccess.deviceQuantity }}个设备 与 {{ deleteDetailSuccess.lubricationPointQuantity }}个润滑点</div>
            </div>
          </div>
          <div
            v-if="deleteDetailFail.deviceQuantity != 0 || deleteDetailFail.lubricationPointQuantity != 0"
            style="font-family: MicrosoftYaHei; margin-top: 16px; padding: 16px; background-image: linear-gradient(to right, rgba(250, 233, 238), rgb(255, 255, 255)); border-radius: 4px"
          >
            <div class="flex-center">
              <img src="../../assets/fail-icon.png" alt="" style="width: 24px; height: 24px" />
              <div style="margin-left: 10px; font-size: 14px">
                <div style="color: #000">删除失败</div>
                <div style="color: rgb(153, 153, 153)">{{ deleteDetailFail.deviceQuantity }}个设备 与 {{ deleteDetailFail.lubricationPointQuantity }} 个润滑点</div>
              </div>
            </div>
            <div style="color: rgb(221, 0, 0); font-size: 13px; margin-top: 6px; margin-left: 34px">失败原因： {{ deleteDetailFail.delFailReason }}</div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" size="small" @click="resultConfirm">确定</el-button>
        </span>
      </el-dialog>
      <!-- 无法更新润滑点字段值 -->
      <el-dialog title="" :visible.sync="deleteFailDialog" :close-on-click-modal="false" width="422px">
        <div slot="title" class="flex-center">
          <img src="../../assets/warning-icon.png" alt="" style="width: 24px; height: 24px" />
          <span style="margin-left: 10px; font-family: MicrosoftYaHei; font-size: !8px; color: #000">无法删除选中设备</span>
        </div>
        <div style="margin: 10px 20px 10px 52px">
          <span>选中设备下的润滑点有进行中的工单或绑定传感器监测，不可删除。</span>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" size="small" @click="deleteFailConfirm()">我知道了</el-button>
        </span>
      </el-dialog>
    </div>
    <batch-export :showBatchExport="showBatchExport" @closeBatchExport="showBatchExport = false" @getExportInfo="getExportInfo"></batch-export>
    <customerListCom
      class="customerList"
      ref="selectCustomer"
      :selectCustomerList="selectCustomerList"
      :showCustomerDialog="showCustomerDialog"
      @handleSubmitCustomer="handleSubmitCustomer"
      @handleCloseCustomer="handleCloseCustomer"
    ></customerListCom>
    <!-- 设备二维码批量下载弹框 -->
    <el-dialog title="设备二维码批量下载" :visible.sync="downQrcodeDialog" :close-on-click-modal="false" width="422px">
      <div class="downQrcodeCon">
        <el-checkbox v-model="isIncludeLogo">铭牌中是否包含美孚Logo</el-checkbox>
        <div class="downQrcodeTip">请确认设备名称，设备制造商，设备型号，设备位置正确填写，再确认下载</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="downQrcodeDialog = false">取消</el-button>
        <el-button type="danger" size="small" @click="downNameplate">确认下载</el-button>
      </span>
    </el-dialog>
    <!-- 创建设备 -->
    <CreateDevice
      v-if="addDeviceDialog"
      :deviceTypeDialog="deviceTypeDialog"
      :addDeviceDialog="addDeviceDialog"
      v-on:addOrEditDevice="addOrEditDevice"
      v-on:addOrEditDeviceAndLumpoint="addOrEditDeviceAndLumpoint"
      v-on:closeDialogAddDevice="closeDialogAddDevice"
    />
  </div>
</template>

<script>
import CreateDevice from "./components/CreateDevice.vue";
import DeviceTable from "./components/deviceListTable.vue";
import RecycleBinDevcieTable from "./components/recycleBinTable.vue";
import RecycleBinLubTable from "./components/recyleBinLub.vue";
import EditTable from "./components/editTable.vue";
import customField from "../tableComponents/customField.vue";
import customTable from "../tableComponents/customTable.vue";
import batchExport from "./components/batchExport.vue";
import columnHeader from "../tableComponents/headerComponent";
import commonJS from "../tableComponents/tableCommon.js";
export default {
  mixins: [commonJS],
  components: {
    DeviceTable,
    RecycleBinDevcieTable,
    RecycleBinLubTable,
    EditTable,
    CreateDevice,
    "custom-field": customField,
    "custom-table": customTable,
    "batch-export": batchExport,
    "column-header": columnHeader,
    customerListCom: () => import("../tableComponents/customerList")
  },
  props: {
    valueArr: {
      default: () => {
        return ["01-03", "04-06", "07-09", "10-12"];
      },
      type: Array
    },
    getValue: {
      default: () => {},
      type: Function
    },
    defaultValue: {
      default: "",
      type: String
    }
  },
  data() {
    return {
      loadingRemote: false,
      addDeviceDialog: false, // 新建设备弹框
      deviceTypeDialog: "",
      equipmentDivHeight: document.documentElement.clientHeight - 184,
      formFilterHeight: 0,
      workShopSearchList: [],
      expireTimeOption: {
        disabledDate(date) {
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now();
        }
      },
      taskCate: [
        { cateName: "设备总数", code: "amountOfDevice", val: null },
        { cateName: "月度检查设备数", code: "amountOfMonthCheckDevice", val: null },
        { cateName: "异常设备数", code: "amountOfAbnormalDevice", val: null },
        { cateName: "异常设备占比", code: "amountOfAbnormalDeviceRatio", val: null }
      ],
      autoCreateOilAddPlanZhiList: [{ label: "是", value: "true" }, { label: "否", value: "false" }],
      oilChangeMethodList: [{ label: "定期", value: "1" }, { label: "按质", value: "2" }],
      deleteFailDialog: false,
      maskLoading: false,
      deviceCountDelete: 0,
      LumCountDelete: 0,
      showRecycleBinDialog: false, // 回收站弹框
      deleteReasonDialog: false, // 删除原因弹框
      deleteResultsDialog: false, // 批量删除结果弹框
      uploadResultsDialog: false, // 导入结果弹框
      deleteNoDialog: false, // 无法删除设备弹框
      deleteReasonForm: {
        deleteReasonCont: "" // 删除原因
      },
      oilChangePeriodList: [],
      oilBoxCapacityList: [{ oilBoxCapacityUnit: "L", oilBoxCapacityUnitDesc: "L" }, { oilBoxCapacityUnit: "KG", oilBoxCapacityUnitDesc: "KG" }], // 油箱容量单位
      addBtn: true,
      fieldNameData: [],
      levelList: [
        {
          serviceName: "设备",
          id: 1,
          tabType: "equipmentTab",
          isActive: true,
          total: 0
        },
        {
          serviceName: "润滑点",
          id: 2,
          tabType: "lMTab",
          isActive: false,
          total: 0
        }
      ],
      deviceStatusMap: {
        0: "待完善",
        1: "已完善",
        2: "无润滑点"
      },
      deviceStatusData: [{ value: 1, label: "已完善" }, { value: 0, label: "待完善" }, { value: 2, label: "无润滑点" }],
      deviceActiveStatusData: [{ value: 1, label: "活跃" }, { value: 0, label: "非活跃" }],
      selectedArr: [],
      dynamicTags: [],
      oilBrandList: [],
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      conditionsRulesForm: {
        iotDataList: [
          {
            name: "", // 字段名称
            changeCont: "" // 更新值
          }
        ]
      }, // 批量编辑表单
      deleteReasonFormRules: {
        deleteReasonCont: [{ required: true, message: "请输入删除原因", trigger: "blur" }]
      },
      conditionsFormRules: {
        name: [{ required: true, message: "请选择字段名称", trigger: "change" }],
        currentOilCode: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        oilChangeMethod: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        autoCreateOilChangePlan: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        autoCreateOilAddPlan: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        oilChangePeriod: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        oilAddPeriod: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        oilAddPeriodUnit: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        lastOilChangeDate: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        lastOilAddDate: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        oilBrand: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        oilBrandCode: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        recommendOilCode: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        lubricationMethod: [{ required: true, message: "更新值不能为空", trigger: "change" }],
        manufacturer: [{ required: true, message: "更新值不能为空", trigger: "blur" }],
        changeCont: [{ required: true, message: "更新值不能为空", trigger: "blur" }],
        deviceModel: [{ required: true, message: "更新值不能为空", trigger: "blur" }]
      },
      uploadUrl: `${process.env.api}/web/config/serviceConfiguration/addServiceConfiguration`,
      showImportFileFlag: false,
      fileForm: {
        customerNumber: "",
        fileList: [],
        newBusinessFlag: false
      },
      workshopList: [],
      mainminheight: `height:${document.documentElement.clientHeight - 330}px`,
      queryParams: {
        orderBy: "createTime",
        descFlag: true,
        deviceName: "", // 设备名称
        deviceDataIntegrityStatus: "", // 信息状态
        deviceActiveStatus: "", // 活跃状态
        companyNumber: "",
        groupIdList: [],
        companyName: "",
        workshopId: "",
        deviceCode: "",
        devicePosition: "",
        deviceModel: "",
        manufacturer: "",
        companyId: "",

        deviceTypeList: [],
        currentOilCodeList: []
      },
      showMoreSearch: false,
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
      //   表单验证规则
      rules: {
        customerNumber: [{ required: true, message: "请选择所属客户", trigger: "change" }],
        newBusinessFlag: [{ required: true, message: "是否是新项目设备初装生意", trigger: "change" }]
      },
      customerList: [], // 客户
      epTableData: [], // 设备列表
      selectList: [], // 选中的设备列表
      loading: false, // 是否显示加载动画，默认隐藏
      totalNumber: 0, // 总条数
      //  分页参数
      pagenation: {
        current: 1,
        size: 30
      },
      importResult: {
        caret: 0,
        caretLuCount: 0,
        failCount: 0,
        upDeviceCount: 0,
        upLuCount: 0
      }, // 导入结果
      lubricationPointTypeData: [], // 润滑方式数据
      // dialogFormVisible:false,
      dialogEditHistoryVisible: false, // 批量编辑历史 弹框
      // messageZindex:true,
      eqTableData: [], // 回收站设备表格
      pagenationEq: {
        //   变更历史列表分页参数
        current: 1,
        size: 30
      },
      lMTableData: [], // 回收站润滑点 表格
      pagenationLm: {
        //   变更历史列表分页参数
        current: 1,
        size: 30
      },
      changeHistoryTableData: [], // 编辑历史表格
      pagenationCH: {
        //   变更历史列表分页参数
        current: 1,
        size: 30
      },
      tabType: "equipmentTab",
      lMTotal: 0,
      eqTotal: 0,
      cHDataTotalNumber: 0, // 变更历史总条数
      batchEditDialogVisible: false, // 批量编辑弹框是否展示
      year: new Date().getFullYear(),
      selectCompanyName: "",
      selectName: [],
      lubricationPointCount: 0,
      deviceCount: 0,
      oilListData: [], // 油品级联下拉数据
      typeProps: {
        value: "oilNumber",
        label: "oilName"
      },
      editProps: {
        value: "code",
        label: "name"
      },
      deviceNumberListData: [], // 批量编辑的设备list
      lubricationNumberList: [], // 批量编辑的润滑点list
      deviceModel2: "",
      manufacturer2: "",
      recommendOilCode2: "",
      lubricationMethod2: "",
      oilBrand2: "",
      batchEditData: [],
      isSelectFlag: false, // 多选点击行选中
      selectionRow: [],
      fileRom: "", // 批量导入上传得附件

      // time1:'',
      time2: "",
      eptList: [],
      errorDataDialog: false,
      errorImportCode: "",
      deleteDetailSuccess: [], // 删除结果详情
      deleteDetailFail: [], // 删除结果详情
      editUpdataDevice: {},
      updateFailReason: "",
      // 设备分组
      groupList: [],
      customerSearchList: [],
      groupKey: 1,
      tableHeight: null,
      customFieldlistUnit: [
        {
          fieldName: "deviceName",
          visible: 2
        },
        {
          fieldName: "deviceTypeName",
          visible: 2
        },
        {
          fieldName: "deviceNumberOrQrNumber",
          visible: 1
        },
        {
          fieldName: "lubricationPointNum",
          visible: 1
        },
        {
          fieldName: "amountOfMonthCheckDevice",
          visible: 1
        },
        {
          fieldName: "amountOfAbnormalDevice",
          visible: 1
        },
        {
          fieldName: "workshopName",
          visible: 1
        },
        {
          fieldName: "devicePosition",
          visible: 1
        },
        {
          fieldName: "deviceCode",
          visible: 1
        },
        {
          fieldName: "deviceModel",
          visible: 1
        },
        {
          fieldName: "manufacturer",
          visible: 1
        },
        {
          fieldName: "companyName",
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
          fieldName: "dataIntegrityFlag",
          visible: 1
        },
        {
          fieldName: "customerVisibility",
          visible: 1
        },
        {
          fieldName: "createMethod",
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
        deviceName: {
          filterType: "inputAndselection",
          paramValue: "deviceName",
          selectOptions: [{ code: 1, name: "服务中" }, { code: 0, name: "不活跃" }],
          changeValueInput: "",
          changeValueSelect: "",
          label: "设备名称",
          slot: "deviceName",
          width: "200"
        },
        deviceTypeName: {
          selectMultiple: true,
          filterType: "cascaderDevice",
          paramValue: "deviceTypeList",
          selectOptions: [],
          changeValue: "",
          label: "设备类型",
          prop: "deviceTypeName",
          width: "120",
          tooltip: true,
          fixed: "left"
        },
        deviceNumberOrQrNumber: { label: "铭牌ID", prop: "deviceNumberOrQrNumber", width: "120", tooltip: true },
        lubricationPointNum: { label: "润滑点数", slot: "lubricationPointNum", width: "120" },
        amountOfMonthCheckDevice: {
          filterType: "",
          paramValue: "amountOfMonthCheckDevice",
          changeValue: "",
          sortTypeVal: "sortDefault",
          label: "月度检查次数",
          prop: "amountOfMonthCheckDevice",
          width: "120",
          tooltip: true
        },
        amountOfAbnormalDevice: {
          filterType: "",
          paramValue: "amountOfAbnormalDevice",
          changeValue: "",
          sortTypeVal: "sortDefault",
          label: "未处理异常数",
          prop: "amountOfAbnormalDevice",
          width: "120",
          tooltip: true
        },
        workshopName: { showTips: false, filterType: "selection", paramValue: "workshopId", changeValue: "", selectOptions: [], label: "所属车间", slot: "workshopName", width: "120", tooltip: true },
        devicePosition: { filterType: "input", paramValue: "devicePosition", changeValue: "", label: "设备位置", prop: "devicePosition", width: "120", tooltip: true },
        deviceCode: { filterType: "input", paramValue: "deviceCode", changeValue: "", label: "设备编码", slot: "deviceCode", width: "120" },
        deviceModel: { filterType: "input", paramValue: "deviceModel", changeValue: "", label: "设备型号", prop: "deviceModel", width: "120", tooltip: true },
        manufacturer: { filterType: "input", paramValue: "manufacturer", changeValue: "", label: "制造商", prop: "manufacturer", width: "120", tooltip: true },
        companyName: { label: "所属客户", slot: "companyName", width: "250" },
        createUserName: { label: "创建人", slot: "createUserName", width: "120", tooltip: true },
        createTime: { filterType: "", paramValue: "createTime", changeValue: "", sortTypeVal: "sortDown", label: "创建时间", prop: "createTime", width: "120", tooltip: true },
        dataIntegrityFlag: {
          selectMultiple: true,
          filterType: "selection",
          paramValue: "deviceDataIntegrityStatus",
          selectOptions: [{ code: 1, name: "已完善" }, { code: 0, name: "待完善" }, { code: 2, name: "无润滑点" }],
          changeValue: "",
          label: "信息状态",
          slot: "dataIntegrityFlag",
          width: "120"
        },
        customerVisibility: {
          filterType: "selection",
          paramValue: "customerVisibility",
          selectOptions: [{ code: 0, name: "不可见" }, { code: 1, name: "可见" }],
          changeValue: "",
          label: "客户可见性",
          slot: "customerVisibility",
          width: "120",
          tooltip: true
        },
        createMethod: {
          filterType: "selection",
          paramValue: "createMethod",
          selectOptions: [{ code: 1, name: "客户创建" }, { code: 2, name: "经销商创建" }],
          changeValue: "",
          label: "创建类型",
          slot: "createMethod",
          width: "120",
          tooltip: true
        },
        operation: { label: "操作", slot: "operation" }
      },
      tableDataHeader: [],
      showBatchExport: false,
      listEmptyType: "equipment",
      limitFlag: false,
      oilList: [],
      selectCustomerList: [],
      showCustomerDialog: false,
      createUserDetail: {},
      downQrcodeDialog: false, //设备二维码批量下载弹框
      isIncludeLogo: true, //铭牌中是否包含美孚Logo
      isloadingBatch: false
    };
  },
  beforeRouteLeave(to, from, next) {
    this.queryParams.current = this.pagenation.current;
    this.queryParams.size = this.pagenation.size;
    this.customerSearchList.forEach(it => {
      if (it.companyNumber == this.queryParams.companyNumber) {
        this.queryParams.companyName = it.companyName;
      }
    });
    sessionStorage.setItem("queryParams", JSON.stringify(this.queryParams));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/EquipmentProfile/EquipmentProfileDetail" || from.path == "/EquipmentProfile/EditEquipmentProfile") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  async mounted() {
    this.handleTableHeight();
    window.addEventListener("resize", () => {
      this.mainminheight = `height:${document.documentElement.clientHeight - 330}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
    this.getCustomFieldList(); //获取自定义字段列表
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
      if (this.queryParams.companyId) {
        this.selectCustomerList = this.queryParams.companyId.split(",");
      }
      this.pagenation.current = this.queryParams.current;
      this.pagenation.size = this.queryParams.size;
    }
    this.getEptList();
    this.getOilList("");
    this.getEditNameKey();
    this.$_queryOilChangePeriodData();
    this.$_queryLubricationMethodData();
    if (this.$userInfo.userType == 2) {
      this.getWorkShopList(this.$userInfo.orgInfo.companyId);
      await this.getCustomerWorkshopList(this.$userInfo.orgInfo.companyId);
      this.getGroupTree();
    } else {
      if (this.queryParams.companyId && !this.queryParams.companyId.includes(",")) {
        const res = await this.requestMethodPostTip("/weChat/workshop/filterWorkshop", { companyId: this.queryParams.companyId, accountIds:[...this.queryParams.companyId.split(',')] ,current: 1, size: 500 });
        if (res.data.code == 1000) {
          let workshopList = [];
          if (res.data.data.list.length > 0) {
            res.data.data.list.forEach(item => {
              let obj = {
                code: item.id,
                name: item.name
              };
              workshopList.push(obj);
            });
          }
          this.tableDataHeader.forEach(item => {
            if (item.paramValue == "workshopId") {
              item.showTips = false;
              item.selectOptions = workshopList;
            }
          });
          console.log(this.tableDataHeader, "this.tableDataHeader");
        }
      }
      this.$_getEPData();
    }
    if (this.$userInfo.userType != 2) {
      this.tableDataHeader[1].filterType = "inputAndselection";
      // await this.customerFilter();
      if (this.$route.params.isSaveQuery) {
        const sessionQueryParams = JSON.parse(sessionStorage.getItem("queryParams"));
        if (!sessionQueryParams.companyNumber) return;
        this.customerSearchList.some(item => {
          if (item.companyNumber == sessionQueryParams.companyNumber) {
            this.getSearchWorkShopList(item.companyId);
          }
        });
      }
    }
  },
  created() {
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "EPAddBtn") {
        this.limitFlag = true;
      }
    }
    if (this.$route.params.routerCompanyInfo) {
      this.customerSearchList.push(this.$route.params.routerCompanyInfo);
      this.queryParams.companyNumber = this.$route.params.routerCompanyInfo.companyNumber;
    }
    this.getOverviewData();
    if (this.$userInfo.userType == 2) {
      delete this.tableDataHeaderInit.customerVisibility;
      delete this.tableDataHeaderInit.createMethod;
    }
  },
  watch: {},
  methods: {
    // 自适应获取table高度
    handleTableHeight() {
      setTimeout(() => {
        let taskSituationDivHeight = 0;
        if (document.getElementById("taskSituationDiv")) {
          taskSituationDivHeight = document.getElementById("taskSituationDiv").clientHeight;
        }
        if (document.getElementById("formFilter")) {
          this.formFilterHeight = document.getElementById("formFilter").clientHeight;
        }
        this.tableHeight = Number(this.equipmentDivHeight) - Number(this.formFilterHeight) - Number(taskSituationDivHeight) - 12;
      }, 200);
    },
    selCompany(companyItem) {
      this.workshopList = [];
      this.queryParams.workshopId = "";
      this.getSearchWorkShopList(companyItem.companyId);
    },
    getOverviewData() {
      this.requestMethodGet("/web/device/overview", {}).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          this.taskCate.forEach(item => {
            item.val = data[item.code];
          });
          this.handleTableHeight();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    clearWorkshop(val) {
      if (!val) {
        this.queryParams.workshopId = "";
        this.handleSearchTableData();
      }
    },
    handleMoreSearch() {
      this.showMoreSearch = !this.showMoreSearch;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    },
    worshopSearchChange() {
      this.handleSearchTableData();
    },
    getSearchWorkShopList(id) {
      const params = {
        companyId: id,
        workshopName: "",
        current: 1,
        size: 500
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          // list.unshift({ workshopName: "暂无车间", workshopId: "0" });
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
      // 美孚/经销商选择客户,客户取自己公司ID
      if (this.userInfo.userType != 2) {
        if (this.queryParams.companyId.toString().includes(",")) {
          return;
        }
      }
      let companyId = this.userInfo.userType != 2 ? this.queryParams.companyId : this.userInfo.companyId;
      if (!companyId) {
        return;
      }
      const params = {
        companyId: companyId
      };
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
    // 所属客户搜索
    async customerFilter(val) {
      if (this.$userInfo.userType == 2) return;
      let params = {
        companyType: 2,
        size: 300,
        status: "1,2,3",
        companyName: val
      };
      await this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.customerSearchList = res.data.list;
            this.getGroupTree();
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 所属客户
    customerChange(val) {
      this.queryParams.workshopId = "";
      this.getGroupTree();
      this.handleSearchTableData();
    },
    // 分组面板展示
    groupVisibleChange(val) {
      if (val && this.userInfo.userType < 2) {
        if (_.isEmpty(this.queryParams.companyId)) {
          this.$message({
            type: "warning",
            message: "请选择工业客户"
          });
        } else {
          // if (this.queryParams.companyId.toString().includes(",")) {
          //   this.$message({
          //     type: "warning",
          //     message: "请选择一个客户后重新尝试"
          //   });
          // }
        }
      }
    },
    // 通过润滑点设备类型获取 润滑方式下拉框数据
    $_queryLubricationMethodData() {
      let params = {
        typeCode: ""
      };
      this.requestMethodGet("/web/device/getLubricationMethodByType", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.lubricationPointTypeData = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 查询换油单位配置数据
    $_queryOilChangePeriodData() {
      this.requestMethodGet("/web/device/getOilChangePeriodUnitConfig")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { oilChangePeriodUnit: item.oilChangePeriodUnit, oilChangePeriodUnitDesc: item.oilChangePeriodUnitDesc };
              });
              this.oilChangePeriodList = optionData;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取批量编辑字段
    getEditNameKey(val) {
      this.requestMethodGet("/web/device/getUpdateCloumnTree", {}).then(res => {
        if (res.data.code == 1000) {
          this.fieldNameData = this.formatData(res.data.data);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].child || data[i].child.length == 0) {
          data[i].child = null;
        } else {
          this.formatData(data[i].child);
        }
      }
      return data;
    },
    // 设备类型
    getEptList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", { filterFlag: true }).then(res => {
        if (res.data.code == 1000) {
          this.eptList = res.data.data;
          let index = this.tableDataHeader.findIndex(item => item.paramValue == "deviceTypeList");
          if (index != -1) {
            this.tableDataHeader[index].selectOptions = this.eptList;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },

    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    // 导入excel表格
    importFile() {
      this.showImportFileFlag = true;
      this.$_queryCustomerData(); // 查询公司
      this.$gio.clicBulkImportButton();
    },
    handleCurrentChangeRow(row, event, column) {
      // let refsElTable = this.$refs.deviceTable.$refs.multipleTable; // 获取表格对象
      let refsElTable = this.$refs.deviceTable.$refs.coustomTable; // 获取表格对象
      let findRow = this.selectionRow.find(c => c.id == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row); // 调用选中行方法
    },
    // 点击一级
    clickLevel1(val) {
      this.levelList.forEach(item => {
        if (item.id == val.id) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      });
      if (this.tabType == val.tabType) {
        return;
      }
      if (val.serviceName == "设备") {
        //  // 获取设备列表
        this.eqTableData = [];
        this.recycleBinDataEq();
      } else {
        this.lMTableData = [];
        // // 获取润滑点列表
        this.recycleBinDataLm();
      }
      this.tabType = val.tabType;
      this.$gio.recycleBinChangeTab();
    },
    // 新建设备
    addOrEditDevice() {
      // 刷新列表
      this.$_getEPData(); // 刷新设备列表
      this.addDeviceDialog = false;
    },
    // 创建设备和润滑点
    addOrEditDeviceAndLumpoint() {
      this.addDeviceDialog = false;
      // 刷新列表
      this.$_getEPData(); // 刷新设备列表
    },
    // 取消新建设备
    closeDialogAddDevice() {
      this.addDeviceDialog = false;
    },
    // 下载模板
    downloadTemplate(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$gio.clickDownloadTemplate();
          const loading = this.$loading({
            lock: true,
            text: "数据下载中，请稍后",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          let paramObj = {
            companyNumber: this.userInfo.userType < 2 ? this.fileForm.customerNumber : this.userInfo.companyNumber,
            newBusinessFlag: this.fileForm.newBusinessFlag,
            responseTypeBlob: true
          };
          this.requestMethodGet("/web/device/downLoadDeviceExcelForImport", paramObj)
            .then(res => {
              let data = res.data;
              let fileReader = new FileReader();
              let that = this;
              loading.close();
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
                  // window.location.href = objectUrl
                  let link = document.createElement("a");
                  link.style.display = "none";
                  link.href = objectUrl;
                  if (that.fileForm.newBusinessFlag) {
                    link.setAttribute("download", "设备导入模版_初装设备.xlsx");
                  } else {
                    link.setAttribute("download", "设备导入模版_现有生意.xlsx");
                  }

                  document.body.appendChild(link);
                  link.click();
                }
              };
              fileReader.readAsText(data);
            })
            .catch(res => {
              loading.close();
            });
        }
      });
    },
    // 文件上传删除前置
    beforeRemove() {},
    // 文件上传超出限制
    handleExceed(files, fileList) {
      this.$message.error(`最多上传 1 个文件`);
    },
    // 文件上传删除
    handleRemove() {},
    // 文件上传改变
    handleFileChange(file, fileList) {
      this.fileForm.fileList = fileList;
      this.fileRom = file.raw;
    },
    // 弹框取消
    cancelUploadFile(formName) {
      this.fileForm.fileList = [];
      this.$refs[formName].resetFields();
      this.showImportFileFlag = false;
    },
    // 弹框确定
    submitFile(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.fileForm.fileList.length === 0) {
            this.$message.error("请上传文件");
          } else {
            var params = new FormData();
            let companyNumber = this.userInfo.userType < 2 ? this.fileForm.customerNumber : this.userInfo.companyNumber;
            params.append("file", this.fileRom);
            params.append("companyNumber", companyNumber);
            params.append("newBusinessFlag", this.fileForm.newBusinessFlag);
            this.requestMethodPost("/web/device/importDeviceDataExcel", params)
              .then(res => {
                res = res.data;
                this.importResult = {};
                if (res.code == 1000) {
                  (this.importResult = {
                    caret: res.data.caret,
                    caretLuCount: res.data.caretLuCount,
                    failCount: res.data.failCount,
                    upDeviceCount: res.data.upDeviceCount,
                    upLuCount: res.data.upLuCount
                  }),
                    (this.uploadResultsDialog = true);
                  this.showImportFileFlag = false;
                  // 刷新列表
                  this.$_getEPData(); // 刷新设备列表
                  this.fileForm.fileList = [];
                  this.$refs[formName].resetFields();
                  bulkImportDevice;
                  this.$gio.viewBulkImportResult();
                } else if (res.code == 2000) {
                  this.uploadResultsDialog = true;
                  this.$_getEPData(); // 刷新设备列表
                  (this.importResult = {
                    caret: res.data.caret,
                    caretLuCount: res.data.caretLuCount,
                    failCount: res.data.failCount,
                    upDeviceCount: res.data.upDeviceCount,
                    upLuCount: res.data.upLuCount
                  }),
                    (this.fileForm.fileList = []);
                  this.$refs[formName].resetFields();
                  this.showImportFileFlag = false;
                  // this.errorDataDialog = true
                  this.errorImportCode = res.data.failList;
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              })
              .catch(res => {});
          }
        }
      });
    },
    getNameDate() {
      const date = new Date();
      const year = date.getFullYear(); // 获取当前年份
      const mon = date.getMonth() + 1 > 10 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1); // 获取当前月份
      const da = date.getDate() > 10 ? date.getDate() : "0" + date.getDate(); // 获取当前日
      return "" + year + mon + da;
    },
    // 导入结果的取消
    closeUploadResult() {
      this.uploadResultsDialog = false;
    },
    // 下载错误数据
    downloadErrorData() {
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let params = {
        importlist: this.errorImportCode,
        newBusinessFlag: this.fileForm.newBusinessFlag,
        responseTypeBlob: true
      };
      this.requestMethodPost("/web/device/exportDeviceErrorImportData", params)
        .then(res => {
          let data = res.data;
          let fileReader = new FileReader();
          let that = this;
          that.errorDataDialog = false;
          that.cancelUploadFile("fileForm");
          loading.close();
          const str = "device" + "错误数据" + that.getNameDate() + "." + "xlsx";
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
              link.setAttribute("download", str);
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
    // 回收站弹框
    recycleBin() {
      this.showRecycleBinDialog = true;
      this.getRecycleBinData();
      this.$gio.clickRecycleBinButton();
    },
    // 还原设备
    handleReductionEq(row) {
      this.$gio.restoreDevice({
        operation: "点击还原按钮"
      });
      this.$confirm("与设备一起被删除的润滑点也将被还原。", "将该设备还原？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            deviceNumber: row.deviceNumber
          };
          this.requestMethodGet("/recycle/restoreDevice", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$_getEPData();
                this.$message({
                  message: "还原成功",
                  type: "success"
                });
                this.getRecycleBinData();
                this.$gio.restoreDevice({
                  operation: "弹窗中点击确定"
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {});
    },
    // 还原润滑点
    handleReductionLm(row) {
      this.$gio.restoreLubrPoint({
        operation: "点击还原按钮"
      });
      this.$confirm("将该润滑点还原？", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            lubricationPointNumber: row.lubricationPointNumber
          };
          this.requestMethodGet("/recycle/restoreLubricationPointBeforeCheck", params)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                if (res.data) {
                  this.$confirm(`将润滑点${row.lubricationPointName}与设备${res.data}一起还原？`, "该润滑点所属设备未还原！", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                  })
                    .then(() => {
                      let params = {
                        lubricationPointNumber: row.lubricationPointNumber,
                        restoreDeviceFlag: 1
                      };
                      this.requestMethodGet("/recycle/restoreLubricationPoint", params)
                        .then(res => {
                          res = res.data;
                          if (res.code == 1000) {
                            this.$_getEPData();
                            this.$message({
                              message: "还原成功",
                              type: "success"
                            });
                            this.recycleBinDataLm();
                          } else {
                            this.$message({
                              message: res.msg,
                              type: "warning"
                            });
                          }
                        })
                        .catch(res => {});
                      this.$gio.restoreLubrPoint({
                        operation: "弹窗中点击确定"
                      });
                    })
                    .catch(() => {});
                } else {
                  let params = {
                    lubricationPointNumber: row.lubricationPointNumber
                  };
                  this.requestMethodGet("/recycle/restoreLubricationPoint", params)
                    .then(res => {
                      res = res.data;
                      if (res.code == 1000) {
                        this.$_getEPData();
                        this.$message({
                          message: "还原成功",
                          type: "success"
                        });
                        this.recycleBinDataLm();
                      } else {
                        this.$message({
                          message: res.msg,
                          type: "warning"
                        });
                      }
                    })
                    .catch(res => {});
                }
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {});
    },
    // 获取回收站列表数据
    getRecycleBinData() {
      // 获取设备列表
      this.recycleBinDataEq();
      // 获取润滑点列表
      this.recycleBinDataLm();
    },
    // 获取回收站设备 数据
    recycleBinDataEq() {
      this.loading = true;
      this.eqTableData = [];
      let params = { ...this.pagenationEq };
      params.menuCode = "EquipmentProfil";
      this.requestMethodGet("/recycle/queryRecycleDeviceListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.eqTableData = res.data.list;
            this.levelList[0].total = res.data.totalCount;
            this.eqTotal = res.data.totalCount;
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
    //  获取回收站润滑点数据
    recycleBinDataLm() {
      this.loading = true;
      let params = { ...this.pagenationLm };
      params.menuCode = "LubricationPointList";
      this.requestMethodGet("/recycle/queryRecycleLubricationPointListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.lMTableData = res.data.list;
            this.levelList[1].total = res.data.totalCount;
            this.lMTotal = res.data.totalCount;
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
    //  查询用油品牌/类型/系列/名称 数据
    getQueryOilList() {
      let params = {
        parentCode: 0,
        status: 1
      };
      this.requestMethodGet("/mdm/oil/queryOilList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { value: item.code, label: item.name };
              });
              this.oilBrandList = optionData;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 批量编辑级联 下拉框展示时候循环数据
    visibleChange(e) {
      if (e) {
        this.$nextTick(() => {
          this.fieldNameData.map(item => {
            item.child.map(i => {
              i.disabled = false;
            });
          });
          this.conditionsRulesForm.iotDataList.forEach(item => {
            this.fieldNameData.map(i => {
              i.child.map(t => {
                if (t.name == item.name) {
                  t.disabled = true;
                }
              });
            });
          });
        });
      }
    },
    changeEditName() {
      this.$nextTick(() => {
        this.fieldNameData.map(item => {
          item.child.map(i => {
            i.disabled = false;
          });
        });
        this.conditionsRulesForm.iotDataList.forEach(item => {
          this.fieldNameData.map(i => {
            i.child.map(t => {
              if (t.name == item.name) {
                t.disabled = true;
              }
            });
          });
        });
      });
    },
    // 删除设备/润滑点
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // 批量编辑增加字段名称   中的删除一行
    delEditFields(index) {
      this.$confirm("是否确认删除此条编辑内容？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.fieldNameData.map(item => {
            item.child.map(i => {
              if (i.name == this.conditionsRulesForm.iotDataList[index].name) {
                i.disabled = false;
              }
            });
          });
          this.$nextTick(() => {
            this.conditionsRulesForm.iotDataList.splice(index, 1);
            this.$refs["addCondition"].clearValidate();
            if (this.conditionsRulesForm.iotDataList.length < 5) {
              this.addBtn = true;
            }
          });
        })
        .catch(res => {});
    },
    // 批量编辑 添加一行
    addlEditFields() {
      this.conditionsRulesForm.iotDataList.forEach(item => {
        this.fieldNameData.map(i => {
          i.child.map(t => {
            if (t.name == item.name) {
              t.disabled = true;
            }
          });
        });
      });
      this.conditionsRulesForm.iotDataList.push({
        name: "", // 指标
        changeCont: "" //
      });
      if (this.conditionsRulesForm.iotDataList.length >= 19) {
        this.addBtn = false;
      } else {
        this.addBtn = true;
      }
    },
    // 点击 批量编辑历史
    handleEditHistory() {
      this.dialogEditHistoryVisible = true;
      this.pagenationCH.current = 1;
      this.pagenationCH.size = 10;
      this.getChangeHistoryData(); // 查询变更历史
    },
    // 批量编辑 事件
    batchEditBtn() {
      this.maskLoading = true;
      this.batchEditBtnFlay = false;
    },
    // 取消 批量编辑 事件
    batchCancelEditBtn() {
      this.maskLoading = false;
      this.batchEditBtnFlay = true;
      this.selectList = [];
      this.$refs.multipleTable.clearSelection();
    },
    // 查询油品级联下拉
    $_queryOilData(val) {
      this.loadingRemote = true;
      this.requestMethodGet("/mdm/oil/queryOilListByPage", { oilName: val, status: 1, size: 200, current: 1 })
        .then(res => {
          res = res.data;
          this.loadingRemote = false;
          if (res.code == 1000) {
            this.oilListData = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 表格多选事件
    handleSelectionChange(select) {
      this.selectionRow = select;
      this.selectList = [];
      select.forEach(item => {
        this.selectList.push(item.deviceNumber);
      });
    },
    // 确认选择 事件
    confirmSelect() {
      this.$gio.clickBulkEditButton();
      // 全都设置为未选中
      this.fieldNameData.map(item => {
        item.child.map(i => {
          i.disabled = false;
        });
      });
      if (this.selectList.length) {
        this.batchEditDialogVisible = true;
        this.getQueryOilList();
        this.$_queryOilData("");
        this.maskLoading = false;
        let params = {
          deviceNumberList: this.selectList.toString()
        };
        this.requestMethodGet("/web/device/getSelectedDeviceAndLPCount", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.deviceCount = res.data.deviceCount;
              this.dynamicTags = res.data.lubricationPoints;
              // this.dynamicTags.map((item) => {
              //   this.deviceNumberListData.push(item.deviceNumber);
              // });
              this.lubricationPointCount = res.data.lubricationPointCount;
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      } else {
        this.$message.error("请至少选择一条数据");
      }
    },
    // 取消无法删除设备弹框
    cancleDeleteNo() {
      this.deleteNoDialog = false;
    },
    continueDeleteNo() {
      this.deleteNoDialog = false;
      this.deleteReasonDialog = true;
      this.deleteReasonForm.deleteReasonCont = "";
    },
    // 结果确认
    resultConfirm() {
      this.deleteResultsDialog = false;
    },
    deleteFailConfirm() {
      this.deleteFailDialog = false;
    },
    // 批量删除事件
    confirmDelete() {
      if (this.selectList.length) {
        let params = {
          deviceNumbers: this.selectList.toString()
        };
        this.requestMethodGet("/web/device/batchCheckDeviceLubricationPointRelation", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.deviceCountDelete = res.data.deviceQuantity; // 选中的设备总量
              this.LumCountDelete = res.data.lubricationPointQuantity; // 选中的润滑点总量
              if (!res.data.deflag) {
                this.deleteFailDialog = true;
              } else {
                if (res.data.iotDeviceRelation || res.data.workOrderRelation) {
                  this.deleteNoDialog = true;
                }
                if (!res.data.iotDeviceRelation && !res.data.workOrderRelation) {
                  this.deleteReasonDialog = true;
                }
              }
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      } else {
        this.$message.error("请至少选择一条数据");
      }
    },
    // 取消删除
    cancleDelete() {
      this.deleteReasonDialog = false;
    },
    // 继续删除
    continueDelete(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = {
            delReason: this.deleteReasonForm.deleteReasonCont,
            deviceNumberList: this.selectList
          };
          this.requestMethodPost("/web/device/batchDelDevices", param)
            .then(res => {
              if (res.data.code == 1000) {
                this.deleteResultsDialog = true;
                this.deleteReasonDialog = false;
                let data = res.data.data;
                // deleteDetailSuccess:[] ,  // 删除结果详情
                data.forEach((item, index) => {
                  if (item.successFlag) {
                    this.deleteDetailSuccess = data[index];
                  }
                  if (!item.successFlag) {
                    this.deleteDetailFail = data[index];
                  }
                });
                // 刷新设备列表
                this.$_getEPData();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: "warning"
                });
              }
            })
            .catch(res => {});
        }
      });
    },
    // 关闭批量编辑 弹框
    closeBatchEdit(formName) {
      this.batchEditDialogVisible = false;
      this.conditionsRulesForm.iotDataList = [
        {
          name: "", // 指标
          changeCont: "" // 检测值类型
        }
      ];
      this.selectedArr = [];
      // this.maskLoading = true;
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    // 调取批量保存接口
    saveBranchData() {
      this.lubricationNumberList = [];
      this.dynamicTags.map(item => {
        this.lubricationNumberList.push(item.lubricationPointNumber);
      });
      // 设备编号去重
      this.deviceNumberListData = [...new Set(this.selectList)];
      let param = {
        autoCreateOilAddPlan: this.editUpdataDevice.autoCreateOilAddPlan,
        autoCreateOilChangePlan: this.editUpdataDevice.autoCreateOilChangePlan,
        currentOilCode: this.editUpdataDevice.currentOilCode,
        deviceCode: this.editUpdataDevice.deviceCode,
        deviceModel: this.editUpdataDevice.deviceModel, // 设备型号
        devicePosition: this.editUpdataDevice.devicePosition, // 设备位置
        lastOilAddDate: this.editUpdataDevice.lastOilAddDate, // 上次加脂日期
        lastOilChangeDate: this.editUpdataDevice.lastOilChangeDate, // 上次换油日期
        lubricationMethod: this.editUpdataDevice.lubricationMethod, // 润滑方式
        lubricationPointManufacturer: this.editUpdataDevice.lubricationPointManufacturer, // 润滑点设备制造商名称
        manufacturer: this.editUpdataDevice.manufacturer, // 制造商
        oilAddPeriod: this.editUpdataDevice.oilAddPeriod, // 加油/加脂周期
        oilAddPeriodUnit: this.editUpdataDevice.oilAddPeriodUnit, // 加油/加脂周期单位
        oilBoxCapacity: this.editUpdataDevice.oilBoxCapacity, // 油箱容量
        oilBoxCapacityUnit: this.editUpdataDevice.oilBoxCapacityUnit, // 油箱容量单位
        oilBrandCode: this.editUpdataDevice.oilBrandCode, // 在用油品品牌
        oilChangeMethod: this.editUpdataDevice.oilChangeMethod, // 定期/按质
        oilChangePeriod: this.editUpdataDevice.oilChangePeriod, // 换油周期
        oilChangePeriodUnit: this.editUpdataDevice.oilChangePeriodUnit, // 加油周期单位
        recommendOilCode: this.editUpdataDevice.recommendOilCode, // 设
        deviceNumberList: this.deviceNumberListData,
        lubricationNumberList: this.lubricationNumberList
      };
      this.requestMethodPost("/web/device/updateDeviceBatchAndLPBatch", param)
        .then(res => {
          if (res.data.code == 1000) {
            this.batchEditDialogVisible = false; // 关闭批量编辑弹框
            // this.batchEditBtnFlay = true;
            this.$_getEPData(); // 刷新设备列表
            this.$gio.sumbitBulkEditDevice({
              operation: "点击保存按钮"
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 批量编辑 对照后台字段
    setEditName() {
      let editDetail = {
        autoCreateOilAddPlan: "",
        autoCreateOilChangePlan: "",
        currentOilCode: "",
        deviceCode: "",
        deviceModel: "", // 设备型号
        devicePosition: "", // 设备位置
        lastOilAddDate: "", // 上次加脂日期
        lastOilChangeDate: "", // 上次换油日期
        lubricationMethod: "", // 润滑方式
        lubricationPointManufacturer: "", // 润滑点设备制造商名称
        manufacturer: "", // 制造商
        oilAddPeriod: "", // 加油周期
        oilAddPeriodUnit: "", // 加油周期单位
        oilBoxCapacity: "", // 油箱容量
        oilBoxCapacityUnit: "", // 油箱容量单位
        oilBrandCode: "", // 在用油品品牌
        oilChangeMethod: "", // 定期/按质
        oilChangePeriod: "", // 加油周期
        oilChangePeriodUnit: "", // 加油周期单位
        recommendOilCode: "", // 设备制造商推荐油品
        oilAddPeriodZhi: "",
        oilAddPeriodUnitZhi: ""
      };
      this.batchEditData = this.conditionsRulesForm.iotDataList;

      this.batchEditData.map(item => {
        if (item.name == "油箱容量") {
          editDetail.oilBoxCapacity = item.oilBoxCapacity;
          editDetail.oilBoxCapacityUnit = item.oilBoxCapacityUnit;
        }
        if (item.name == "制造商") {
          editDetail.manufacturer = item.changeCont;
        }
        if (item.name == "设备型号") {
          editDetail.deviceModel = item.changeCont;
        }
        if (item.name == "在用油品品牌") {
          editDetail.oilBrandCode = item.oilBrandCode;
        }
        if (item.name == "设备制造商推荐油品") {
          editDetail.recommendOilCode = item.recommendOilCode;
        }
        if (item.name == "定期或按质换油") {
          editDetail.oilChangeMethod = item.oilChangeMethod;
        }
        if (item.name == "换油周期") {
          editDetail.oilChangePeriod = item.oilChangePeriod;
          editDetail.oilChangePeriodUnit = item.oilChangePeriodUnit;
          editDetail.oilAddType = "1";
        }
        if (item.name == "加油/加脂周期") {
          editDetail.oilAddPeriod = item.oilAddPeriod;
          editDetail.oilAddPeriodUnit = item.oilAddPeriodUnit;
          editDetail.oilAddType = "2";
        }
        if (item.name == "润滑点设备制造商名称") {
          editDetail.lubricationPointManufacturer = item.changeCont;
        }
        if (item.name == "润滑方式") {
          editDetail.lubricationMethod = item.lubricationMethod;
        }
        if (item.name == "上次换油日期") {
          editDetail.lastOilChangeDate = item.lastOilChangeDate;
        }
        if (item.name == "上次加油/加脂日期") {
          editDetail.lastOilAddDate = item.lastOilAddDate;
        }
        if (item.name == "设备位置") {
          editDetail.devicePosition = item.changeCont;
        }
        if (item.name == "设备编码") {
          editDetail.deviceCode = item.changeCont;
        }
        if (item.name == "在用油品名称") {
          let oilListData = this.oilListData.filter(it => {
            return it.code == item.currentOilCode;
          });
          editDetail.oilBrandCode = oilListData[0].parentCode;
          editDetail.currentOilCode = item.currentOilCode;
        }
        if (item.name == "是否自动生成下次加油/加脂计划") {
          editDetail.autoCreateOilAddPlan = item.autoCreateOilAddPlan;
        }
        if (item.name == "是否自动生成下次换油计划") {
          editDetail.autoCreateOilChangePlan = item.autoCreateOilChangePlan;
        }
        // if(item.name == '是否自动生成下次加脂计划') {
        //   editDetail.autoCreateOilAddPlan = item.autoCreateOilAddPlanZhi
        // }
      });
      this.editUpdataDevice = editDetail;
    },
    // 保存批量编辑
    submitBatchEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setEditName();
          // 校验换油周期值是否合法
          const reg = /^[1-9]\d*$/;
          const oilChangePeriodNum = Number(this.editUpdataDevice.oilChangePeriod);
          const oilAddPeriodNum = Number(this.editUpdataDevice.oilAddPeriod);
          const regTestResult1 = reg.test(oilChangePeriodNum);
          const regTestResult2 = reg.test(oilAddPeriodNum);
          const isRollingBearing = this.editUpdataDevice.oilAddType == "2"; // 油类  加油周期     false  脂类 加脂周期
          const list = this.oilChangePeriodList;
          let MaxNum = null;
          let MaxNum2 = null;
          // 先判断 加油/加脂
          list.forEach(it => {
            it.rangMin = 1;
            // if (isRollingBearing) {
            // 加脂
            it.rangMax = it.oilChangePeriodUnit == "Y" ? 2 : it.oilChangePeriodUnit == "M" ? 24 : it.oilChangePeriodUnit == "D" ? 730 : 17520;
            // }
            // if (this.editUpdataDevice.oilAddType == "1") {
            // 换油
            it.rangMax1 = it.oilChangePeriodUnit == "Y" ? 20 : it.oilChangePeriodUnit == "M" ? 240 : it.oilChangePeriodUnit == "D" ? 7300 : 175200;
            // }
          });
          list.forEach(item => {
            // 换油
            if (this.editUpdataDevice.oilChangePeriodUnit == item.oilChangePeriodUnit) {
              // 换油
              MaxNum = item.rangMax1;
            }
          });
          list.forEach(item => {
            //   加油/加脂周期
            if (this.editUpdataDevice.oilAddPeriodUnit == item.oilChangePeriodUnit) {
              // 加油
              MaxNum2 = item.rangMax;
            }
          });
          if (regTestResult2 && oilAddPeriodNum && this.editUpdataDevice.oilAddPeriodUnit != "KM") {
            if (oilAddPeriodNum >= 1 && oilAddPeriodNum <= MaxNum2) {
            } else {
              this.$message({
                type: "error",
                message: `加油/加脂周期：请输入1~${MaxNum2}的整数`
              });
              return;
            }
          }
          if (regTestResult1 && oilChangePeriodNum && this.editUpdataDevice.oilChangePeriodUnit != "KM") {
            if (oilChangePeriodNum >= 1 && oilChangePeriodNum <= MaxNum) {
            } else {
              this.$message({
                type: "error",
                message: `换油周期：请输入1~${MaxNum}的整数`
              });
              return;
            }
          }
          if (this.conditionsRulesForm.iotDataList.length && this.dynamicTags.length == 0) {
            if (
              this.editUpdataDevice.recommendOilCode ||
              this.editUpdataDevice.oilChangePeriodUnit ||
              this.editUpdataDevice.oilChangePeriod ||
              this.editUpdataDevice.oilChangeMethod ||
              this.editUpdataDevice.oilBoxCapacityUnit ||
              this.editUpdataDevice.oilBrandCode ||
              this.editUpdataDevice.oilBoxCapacity ||
              this.editUpdataDevice.oilAddPeriodUnit ||
              this.editUpdataDevice.autoCreateOilAddPlan ||
              this.editUpdataDevice.autoCreateOilChangePlan ||
              this.editUpdataDevice.currentOilCode ||
              this.editUpdataDevice.lastOilAddDate ||
              this.editUpdataDevice.lastOilChangeDate ||
              this.editUpdataDevice.lubricationMethod ||
              this.editUpdataDevice.lubricationPointManufacturer ||
              this.editUpdataDevice.oilAddPeriod
            ) {
              this.$confirm("润滑点明细为空，润滑点更新的字段无效，请确认是否完成本次批量编辑！", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  // this.checkUpdate();
                  this.saveBranchData();
                })
                .catch(() => {});
            } else if (this.editUpdataDevice.deviceCode || this.editUpdataDevice.deviceModel || this.editUpdataDevice.devicePosition || this.editUpdataDevice.manufacturer) {
              this.$confirm("请确认是否完成本次批量编辑？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(() => {
                  // this.checkUpdate();
                  this.saveBranchData();
                })
                .catch(() => {});
            }
          }
          if (this.conditionsRulesForm.iotDataList.length && this.dynamicTags.length) {
            this.$confirm("请确认是否完成本次批量编辑？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                // this.checkUpdate();
                this.saveBranchData();
              })
              .catch(() => {});
          } else if (this.conditionsRulesForm.iotDataList.length == 0) {
            this.$message.error("请至少添加一条数据");
          }
        }
      });
    },
    // 获取变更历史的数据
    getChangeHistoryData() {
      this.loading = true;
      let params = { ...this.pagenationCH };
      params.menuCode = 'EquipmentProfil'
      this.requestMethodGet("/web/device/getDeviceAndLPUpdateHistory", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.changeHistoryTableData = res.data.list;
            this.cHDataTotalNumber = res.data.totalCount;
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
    // 回收站设备
    handleSizeEq(size) {
      this.pagenationEq.size = size;
      this.pagenationEq.current = 1;
      this.recycleBinDataEq();
    },
    // current change
    handleCurrentEq(current) {
      this.pagenationEq.current = current;
      this.recycleBinDataEq();
    },
    // 回收站润滑点
    handleSizeLm(size) {
      this.pagenationLm.size = size;
      this.pagenationLm.current = 1;
      this.recycleBinDataLm();
    },
    // current change
    handleCurrentLm(current) {
      this.pagenationLm.current = current;
      this.recycleBinDataLm();
    },
    //  变更历史列表 size change
    handleSizeChangeCH(size) {
      this.pagenationCH.size = size;
      this.pagenationCH.current = 1;
      this.getChangeHistoryData(); // 查询变更历史
    },
    // current change
    handleCurrentChangeCH(current) {
      this.pagenationCH.current = current;
      this.getChangeHistoryData(); // 查询变更历史
    },
    // 导出事件
    downSubmit(deviceExportFieldStr) {
      let queryParams = _.cloneDeep(this.queryParams);
      let deviceTypeList = [];
      if (queryParams.deviceTypeList.length > 0) {
        queryParams.deviceTypeList.forEach(item => {
          deviceTypeList.push(item[item.length - 1]);
        });
      }
      let groupIdList = [];
      if (queryParams.groupIdList.length) {
        queryParams.groupIdList.forEach(item => {
          groupIdList.push(item[1]);
        });
      }
      let paramObj = {
        deviceName: this.queryParams.deviceName,
        companyNumber: this.queryParams.companyNumber,
        deviceTypeList: deviceTypeList,
        deviceDataIntegrityStatus: this.queryParams.deviceDataIntegrityStatus,
        deviceNumberList: this.selectList,
        deviceActiveStatus: this.queryParams.deviceActiveStatus,
        groupIdList: groupIdList,
        workshopId: this.queryParams.workshopId,
        deviceCode: this.queryParams.deviceCode,
        devicePosition: this.queryParams.devicePosition,
        companyId: this.queryParams.companyId,
        currentOilCodeList: this.queryParams.currentOilCodeList
      };
      if (deviceExportFieldStr) {
        paramObj.deviceExportFieldStr = deviceExportFieldStr;
      }
      this.requestMethodPost("/web/device/exportDeviceExcelAll", paramObj).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            message: "下载中，请稍后去下载中心查看",
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleDown() {
      this.$gio.exportDevice();
      if (this.selectList.length > 0) {
        this.showBatchExport = true;
      } else {
        if (this.totalNumber > 10000) {
          this.$confirm("超过导出上限（1万条），请尝试以下方法分批导出：<br/> 1、选择 1 条或 N 条数据导出 <br/> 2、筛选特定属性的数据后导出", "批量导出设备", {
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
          this.showBatchExport = true;
        }
      }
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      this.$_queryCustomerData();
    },
    // 获取车间
    getWorkShopList(id) {
      const params = {
        companyId: id,
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
    handleSearchCustomerChange(val) {
      if (val) {
        const selectCompanyId = this.customerSearchList.filter(item => {
          return item.companyNumber == val;
        })[0].companyId;
        this.getWorkShopList(selectCompanyId);
        this.getGroupTree();
        this.handleSearchTableData();
      } else {
        this.selectCompanyName = "";
        ++this.groupKey;
        this.workshopList = [];
        this.groupList = [];
      }
    },
    // 所属客户 change 事件
    handleChangeCustomer(val) {
      if (val) {
      } else {
        this.selectCompanyName = "";
        this.$_queryCustomerData();
      }
    },
    // 查询所属客户
    $_queryCustomerData() {
      if (this.$userInfo.userType == 2) return;
      let params = {
        companyType: 2,
        size: 30,
        status: "1,2,3",
        companyName: this.selectCompanyName,
        menuCode:'CustomerProfileList'
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
    // 查询
    handleSearchTableData() {
      this.selectList = [];
      this.pagenation.current = 1;
      this.$_getEPData();
    },
    // 重置
    handleClearSearch() {
      console.log(this.queryParams.companyId, this.$refs["selectCustomer"]);
      if (this.queryParams.companyId) {
        this.$refs["selectCustomer"].clearSelectCustomer();
      }
      this.selectCustomerList = [];
      for (let key in this.queryParams) {
        this.queryParams[key] = "";
      }
      this.queryParams.groupIdList = [];
      this.queryParams.deviceTypeList = [];
      this.queryParams.currentOilCodeList = [];
      this.queryParams.orderBy = "createTime";
      this.queryParams.descFlag = true;
      if (this.userInfo.userType != 2) {
        this.groupList = [];
        ++this.groupKey;
      }
      this.tableDataHeader.forEach(item => {
        item.changeValue = "";
        if (item.sortTypeVal) {
          if (item.paramValue != "createTime") {
            item.sortTypeVal = "sortDown";
          } else {
            item.sortTypeVal = "sortDefault";
          }
        }
        if (item.paramValue == "workshopId" && this.userInfo.userType != 2) {
          item.showTips = false;
          item.selectOptions = [];
        }
        if (item.paramValue == "deviceName") {
          item.changeValueInput = "";
          item.changeValueSelect = "";
        }
      });
      this.handleSearchTableData();
    },
    // 新建
    handleAdd() {
      this.deviceTypeDialog = "addDeviceAndLubpoint";
      this.addDeviceDialog = true;
    },
    // 获取设备列表
    $_getEPData() {
      this.loading = true;
      let queryParams = _.cloneDeep(this.queryParams);
      let deviceTypeList = [];
      if (queryParams.deviceTypeList.length > 0) {
        queryParams.deviceTypeList.forEach(item => {
          deviceTypeList.push(item[item.length - 1]);
        });
      }
      let groupIdList = [];
      if (queryParams.groupIdList.length) {
        queryParams.groupIdList.forEach(item => {
          groupIdList.push(item[1]);
        });
      }
      let params = { ...queryParams, ...this.pagenation };
      params.groupIdList = groupIdList;
      params.deviceTypeList = deviceTypeList;
      params.companyName = "";
      params.menuCode = "EquipmentProfil";
      this.epTableData = [];
      this.requestMethodPost("/web/device/newQueryAllDeviceByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            res.data.list.forEach(item => {
              item.createTime = this.moment(new Date(item.createTime)).format("YYYY-MM-DD");
            });
            this.epTableData = res.data.list;
            var date = new Date().getTime();
            this.epTableData.forEach(item => {
              if (Math.floor((date - item.createTimeMills) / 1000 / 60 / 60 / 24) == 0) {
                item.creatNew = true;
              }
              if (Math.floor((date - item.updateTimeMills) / 1000 / 60 / 60 / 24) == 0) {
                item.editNew = true;
              }
            });
            this.totalNumber = res.data.totalCount;
            this.$gio.filterDevice({
              device: params.deviceName,
              devicePosition: params.devicePosition,
              deviceCode: params.deviceCode,
              infoStatus: this.deviceStatusMap[params.deviceDataIntegrityStatus],
              activeStatus: params.deviceActiveStatus == 1 ? "活跃" : "非活跃",
              deviceType: this.$gio.findValueCodeCorresponding(this.eptList, params.deviceType, "code", "name", true),
              customer: this.$gio.findValueCodeCorresponding(this.customerSearchList, params.companyNumber, "companyNumber", "companyName"),
              workshop: this.$gio.findValueCodeCorresponding(this.workshopList, params.workshopId, "workshopId", "workshopName"),
              group: this.$gio.findValueCodeCorresponding(this.groupList, params.groupIdList, "id", "groupName", true)
            });
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 批量下载
    // handleBatchDownload() {},
    // size change
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_getEPData();
    },
    // current change
    handleCurrentChange(current) {
      if (this.selectList.length > 0) {
        // this.messageZindex = false
        // this.batchEditBtnFlay = false
        this.$confirm("批量选择，只支持在当前页操作，跳转页面后，已选数据将无法保存，请确认是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // this.messageZindex = true
            this.selectList = [];
            this.pagenation.current = current;
            this.$_getEPData();
          })
          .catch(() => {
            // this.messageZindex = true
          });
      } else {
        this.pagenation.current = current;
        this.$_getEPData();
      }
    },
    // 查看
    handleLook(row) {
      this.$router.push({
        path: "/EquipmentProfile/EquipmentProfileDetail",
        query: {
          deviceNumber: row.deviceNumber,
          deviceId: row.id
        }
      });
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        path: "/EquipmentProfile/EditEquipmentProfile",
        query: {
          deviceNumber: row.deviceNumber
        }
      });
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
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      if (this.userInfo.userType == 2) {
        this.customFieldlistUnit = this.customFieldlistUnit.filter(item => item.fieldName != "lubricationPointNum" && item.fieldName != "companyName" && item.fieldName != "dataIntegrityFlag");
      } else {
        this.customFieldlistUnit = this.customFieldlistUnit.filter(item => item.fieldName != "deviceCode");
      }
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        customFieldlistUnit = this.customFieldlistUnit;
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "device");
        if (index != -1) {
          let fieldDtoInfos = fieldDtoList[index].fieldDtoInfos;
          customFieldlistUnit = fieldDtoInfos.length == 0 ? this.customFieldlistUnit : fieldDtoInfos;
        } else {
          customFieldlistUnit = this.customFieldlistUnit;
        }
      }
      let customFieldlist = customFieldlistUnit
        .filter(item => this.tableDataHeaderInit[item.fieldName] && this.tableDataHeaderInit[item.fieldName].label)
        .map(item => {
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
      if (this.$route.params.isSaveQuery) {
        let queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
        if (sessionStorage.getItem("queryParams")) {
          this.tableDataHeader.forEach(item => {
            if (item.paramValue == "deviceName") {
              item.changeValueInput = queryParams.deviceName;
              item.changeValueSelect = queryParams.deviceActiveStatus;
            } else if (item.paramValue == "deviceTypeList") {
              item.changeValue = queryParams.deviceTypeList.length == 0 ? "" : queryParams.deviceTypeList;
            } else if (item.paramValue == "devicePosition") {
              item.changeValue = queryParams.devicePosition;
            } else if (item.paramValue == "deviceCode") {
              item.changeValue = queryParams.deviceCode;
            } else if (item.paramValue == "deviceModel") {
              item.changeValue = queryParams.deviceModel;
            } else if (item.paramValue == "manufacturer") {
              item.changeValue = queryParams.manufacturer;
            } else if (item.paramValue == "deviceDataIntegrityStatus") {
              let dataIntegrityArr = [];
              item.selectOptions.forEach(it => {
                if (queryParams.deviceDataIntegrityStatus.includes(it.code)) dataIntegrityArr.push(it.code);
              });
              item.changeValue = dataIntegrityArr;
            } else if (item.paramValue == "workshopId") {
              item.changeValue = queryParams.workshopId;
            }

            if (queryParams.orderBy == item.paramValue) {
              item.sortTypeVal = queryParams.descFlag ? "sortDown" : queryParams.descFlag === false ? "sortUp" : "sortDefault";
            } else if (item.sortTypeVal && queryParams.orderBy != item.paramValue) {
              item.sortTypeVal = "sortDefault";
            }
          });
        }
      }
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
    getExportInfo(deviceExportFieldStr) {
      this.downSubmit(deviceExportFieldStr);
    },
    getOilList(val) {
      this.loadingRemote = true;
      this.requestMethodGet("/mdm/oil/queryOilListByPage", { oilName: val, fullQueryFlag: true, size: 200, current: 1 })
        .then(res => {
          res = res.data;
          this.loadingRemote = false;
          if (res.code == 1000) {
            this.oilList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 排序
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal;
      this.queryParams.orderBy = obj.paramValue;
      if (sortVal == "sortUp") {
        this.queryParams.descFlag = false;
      } else if (sortVal == "sortDown") {
        this.queryParams.descFlag = true;
      }
      this.tableDataHeader.forEach(item => {
        if (item.sortTypeVal) {
          if (item.paramValue && item.paramValue == this.queryParams.orderBy) {
            item.sortTypeVal = sortVal;
          } else if (item.paramValue && item.paramValue != this.queryParams.orderBy) {
            item.sortTypeVal = "sortDefault";
          }
        }
      });
      this.handleSearchTableData();
    },
    tableTitleSearch(obj) {
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          if (obj.changeType) {
            // 表头有搜索框和下拉框，单独处理
            if (obj.changeType == "input") {
              item.changeValueInput = obj.changeValueInput;
            } else if (obj.changeType == "selection") {
              item.changeValueSelect = obj.changeValueSelect;
            }
          } else {
            item.changeValue = obj.changeValue === 0 || obj.changeValue === false ? obj.changeValue : obj.changeValue || "";
          }
        }
      });
      if (obj.changeType) {
        // 表头有搜索框和下拉框，单独处理
        if (obj.changeType == "input") {
          this.queryParams.deviceName = obj.changeValueInput;
        } else if (obj.changeType == "selection") {
          this.queryParams.deviceActiveStatus = obj.changeValueSelect;
        }
      } else if (obj.paramValue == "deviceDataIntegrityStatus") {
        this.queryParams[obj.paramValue] = obj.changeValue.toString();
      } else {
        this.queryParams[obj.paramValue] = obj.changeValue;
      }
      this.handleSearchTableData();
    },
    // 所属客户组件
    showSelectCustomer() {
      this.showCustomerDialog = true;
    },
    handleClearCustomer() {
      this.selectCustomerList = [];
      this.queryParams.companyId = "";
      this.groupList = [];
      ++this.groupKey;
      this.queryParams.groupIdList = [];
      this.queryParams.workshopId = "";
      this.tableDataHeader.forEach(item => {
        if (item.paramValue == "workshopId") {
          item.changeValue = "";
          item.showTips = false;
          item.selectOptions = [];
        }
      });
      this.handleSearchTableData();
      this.$refs["selectCustomer"].clearSelectCustomer();
    },
    handleSubmitCustomer(e) {
      this.selectCustomerList = e;
      let selectList = this.selectCustomerList.map(item => {
        return item.companyId;
      });
      this.groupList = [];
      ++this.groupKey;
      this.queryParams.groupIdList = [];
      this.queryParams.workshopId = "";
      this.queryParams.companyId = selectList.join(",");
      this.getCustomerWorkshopList(selectList.join(","));
      this.getGroupTree();
      this.showCustomerDialog = false;
    },
    handleCloseCustomer() {
      this.showCustomerDialog = false;
    },
    // 根据所属客户获取所属车间下拉框数据
    async getCustomerWorkshopList(companyIds) {
      const params = {
        companyId: companyIds,
        current: 1,
        size: 500
      };
      if(companyIds.toString().includes(',')){
        params.accountIds = [...companyIds.split(",")]
      }else{
        params.accountIds = [companyIds]
      }
      this.requestMethodPostTip("/weChat/workshop/filterWorkshop", params)
        .then(res => {
          if (res.data.code == 1000) {
            let workshopList = [];
            if (res.data.data.list.length > 0) {
              res.data.data.list.forEach(item => {
                let obj = {
                  code: item.id,
                  name: item.name
                };
                workshopList.push(obj);
              });
            }
            this.tableDataHeader.forEach(item => {
              if (item.paramValue == "workshopId") {
                if (!this.$route.params.isSaveQuery) {
                  item.changeValue = "";
                }
                item.showTips = companyIds.toString().includes(",") ? true : false;
                item.selectOptions = workshopList;
              }
            });
            this.handleSearchTableData();
          } else {
            this.$message({
              message: res.data.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.$set(this.createUserDetail, "headUrl", res.data.data);
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
    // 点击批量下载设备铭牌
    downNameplate() {
      if (this.selectList.length > 0) {
        this.openQrDownloadBatch();
      } else {
        if (this.totalNumber > 1000) {
          this.$confirm("超过导出上限（1千条），请尝试以下方法分批导出：<br/> 1、选择 1 条或 N 条数据导出 <br/> 2、筛选特定属性的数据后导出", "设备二维码批量下载", {
            confirmButtonText: "取消",
            showCancelButton: false,
            dangerouslyUseHTMLString: true
          })
            .then(() => {})
            .catch(() => {});
        } else if (this.totalNumber == 0) {
          this.$message({
            message: "暂无内容导出",
            type: "error"
          });
        } else {
          this.openQrDownloadFilter();
        }
      }
    },
    // 筛选条件下载
    openQrDownloadFilter() {
      this.isloadingBatch = true;
      this.downQrcodeDialog = false;
      let withLogoFlag = this.isIncludeLogo ? 1 : 0;
      let queryParams = _.cloneDeep(this.queryParams);
      let deviceTypeList = [];
      if (queryParams.deviceTypeList.length > 0) {
        queryParams.deviceTypeList.forEach(item => {
          deviceTypeList.push(item[item.length - 1]);
        });
      }
      let groupIdList = [];
      if (queryParams.groupIdList.length) {
        queryParams.groupIdList.forEach(item => {
          groupIdList.push(item[1]);
        });
      }
      let params = { ...queryParams, ...this.pagenation };
      params.groupIdList = groupIdList;
      params.deviceTypeList = deviceTypeList;
      params.companyName = "";
      if (this.time2) {
        params.createTimeStart = this.time2[0];
        params.createTimeEnd = this.time2[1];
      } else {
        params.createTimeStart = "";
        params.createTimeEnd = "";
      }
      params.withLogoFlag = withLogoFlag;
      this.requestMethodPost("/web/device/batchDownloadDeviceQr", params)
        .then(res => {
          this.isloadingBatch = false;
          if (res.data.code == 1000) {
            this.$message({
              message: "下载中，请稍后去下载中心查看",
              type: "success"
            });
            this.$gio.Batchdownloaddevicenameplates();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
          this.$gio.downloadDeviceQr;
        })
        .catch(res => {
          this.isloadingBatch = false;
        });
    },
    // 批量下载
    openQrDownloadBatch() {
      this.isloadingBatch = true;
      this.downQrcodeDialog = false;
      this.$gio.downloadDeviceQr();
      let withLogoFlag = this.isIncludeLogo ? 1 : 0;
      let params = {
        deviceNumberList: this.selectList,
        withLogoFlag: withLogoFlag
      };
      this.requestMethodPost("/qr/manage/downLoadZipQrImages", params)
        .then(res => {
          this.isloadingBatch = false;
          if (res.data.code == 1000) {
            this.$message({
              message: "下载中，请稍后去下载中心查看",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(res => {
          this.isloadingBatch = false;
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
.tips {
  display: flex;
  align-items: center;
  color: #b2b2b2;
  justify-content: flex-end;
}
// 设置显示两行，超出省略
/deep/ .el-table th > .cell {
  word-break: keep-all !important;
  white-space: nowrap !important;
}

.task-sec-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  padding: 0 20px;
}
.flex-center {
  display: flex;
  align-items: center;
}

/deep/.el-upload {
  width: 100% !important;
}
/deep/.el-link.el-link--danger.is-underline:hover:after,
.el-link.el-link--danger:after {
  border-color: rgb(0, 10, 80) !important;
}

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input .is-indeterminate .el-checkbox__inner {
  background-color: #001450 !important;
  border-color: #001450 !important;
}
.customer-profile {
  padding: 12px 20px 0 20px;
  height: 100%;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      // width: 28%
      text-align: right;
      padding-bottom: 10px;
    }
  }
}
.main-content {
  display: flex;
  margin-top: 20px;
}
.level-name {
  margin-left: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 20px;
}
.level-item-content {
  width: 100%;
  padding-left: 40px;
  line-height: 48px;
  cursor: pointer;
}
.el-form-item__label {
  font-size: 13px;
}
.el-form-item__error {
  width: 165px;
}
.className {
  position: absolute !important;
  z-index: 2009;
}
/deep/ .recycle-bin .el-dialog {
  background: rgb(249, 249, 249) !important;
}
.el-tag {
  margin-right: 10px;
}
/deep/ .monitorNumber .el-form-item__error {
  left: 90px;
}
/deep/ .changeCont .el-form-item__error {
  left: 78px;
}
.editHistory .el-pagination {
  position: static;
}

/deep/ .el-dialog__body {
  padding: 0;
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
.task-situation-super {
  width: calc(25% - 14px);
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
/deep/ .customerList .el-dialog__body {
  padding: 30px 20px;
}
.downQrcodeCon {
  width: calc(100% - 40px);
  margin: 20px auto;
  .downQrcodeTip {
    margin-top: 10px;
    color: #666;
    font-size: 12px;
  }
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #333;
}
</style>
