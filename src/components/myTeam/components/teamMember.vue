<template>
  <div style="position:relative;">
    <div class="account-management" :style="mainminheight" id="accountManage">
      <div class="toolbox-con flexBetween">
        <el-form ref="form" :model="queryParams" :inline="true" size="small" id="formDiv">
          <el-form-item>
            <el-button size="small" @click="handleClearSearch">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="tool-con">
          <el-button plain @click="importFile" size="small" v-has="PC_Account_Import">批量导入</el-button>
          <el-button type="danger" @click="handleAdd()" size="small" v-has="PC_Account_create">新建账号</el-button>
          <custom-field @get-fields="getCustomFields" :customFieldlist="customFieldlist" listType="teamMember" style="display:inline-block;margin-left:10px;"></custom-field>
        </div>
      </div>
      <!-- 表格 -->
      <custom-table
        class="table"
        ref="accountTable"
        :tableHeader="tableDataHeader"
        :tableData="accountTableData"
        :tableHeight="tableHeight + ''"
        :loading="loading"
        @changeSearch="tableTitleSearch"
        @changeSortTable="changeSortTable"
      >
        <template v-slot:userName="slotProps">
          <el-table-column
            label="姓名"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="姓名"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center">
                <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.userName }}</span>
                <el-tooltip
                  :content="
                    scope.row.distributorHonoraryMedal == '3' ? '服务大师' : scope.row.distributorHonoraryMedal == '2' ? '服务达人' : scope.row.distributorHonoraryMedal == '1' ? '服务先锋' : ''
                  "
                  placement="top"
                >
                  <img v-if="scope.row.distributorHonoraryMedal == '3'" src="../../../assets/small_service_great_person.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                  <img v-if="scope.row.distributorHonoraryMedal == '2'" src="../../../assets/small_service_master.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                  <img v-if="scope.row.distributorHonoraryMedal == '1'" src="../../../assets/small_service_pioneer.png" alt="" style="width:24px;height:20px;margin-left: 4px;" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:phonenumber="slotProps">
          <el-table-column
            label="联系电话"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="联系电话"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center">
                <span>{{ scope.row.isShowListAllPhone ? scope.row.phonenumber : scope.row.tempPhone }}</span>
                <img
                  style="margin-left:10px;width:20px;height:20px;cursor: pointer;"
                  @click="viewListAll(scope.row, 'phoneNumber')"
                  :src="scope.row.isShowListAllPhone ? viewIcon : notViewIcon"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:email="slotProps">
          <el-table-column
            label="邮箱"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="邮箱"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center">
                <span>{{ scope.row.isShowListAllEmail ? scope.row.email : scope.row.tempEmail ? scope.row.tempEmail : "-" }}</span>
                <img
                  style="margin-left:10px;width:20px;height:20px;cursor: pointer;"
                  v-if="scope.row.email"
                  @click="viewListAll(scope.row, 'email')"
                  :src="scope.row.isShowListAllEmail ? viewIcon : notViewIcon"
                  alt=""
                />
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:roleNames="slotProps">
          <el-table-column
            label="角色"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.roleNames ? scope.row.roleNames.join(",") : "-" }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-slot:postNames="slotProps">
          <el-table-column
            label="岗位"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="岗位"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <div style="display:flex;align-items:center">
                <span>{{ scope.row.postNames ? scope.row.postNames.join(",") : "-" }}</span>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-slot:useStateFlag="slotProps">
          <el-table-column
            label="账号状态"
            :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
            :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
            show-overflow-tooltip
          >
            <template slot="header">
              <column-header
                title="账号状态"
                :filterType="slotProps.slotData.filterType"
                :paramValue="slotProps.slotData.paramValue"
                :changeValue="slotProps.slotData.changeValue"
                :selectMultiple="slotProps.slotData.selectMultiple"
                :selectOptions="slotProps.slotData.selectOptions"
                @chSubmit="tableTitleSearch"
              />
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.userStatus.includes('1')" style="margin-right:5px;color:rgb(0, 136, 136)">有效</span>
              <span v-if="scope.row.userStatus.includes('0')" style="margin-right:5px;color:rgb(221, 0, 0)">已失效</span>
              <span v-if="scope.row.userStatus.includes('2')" style="color:rgb(221, 0, 0)">无效</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
        <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-link @click="handleEdit(scope.row, '查看')" style="color:rgb(0,20,79)" :underline="false">查看</el-link>
            <el-link @click="handleEdit(scope.row)" style="margin-left:10px;color:rgb(0,20,79)" v-has="PC_Account_Management">编辑</el-link>
            <span>
              <!-- <el-link @click="handleTransfer(scope.row)" style="margin-left:10px;color:rgb(0,20,79)" v-has="User_Data_Transfer">数据转移</el-link> -->
            </span>
            <el-link type="danger" @click="handleDelete(scope.row)" v-has="PC_Account_Management" style="margin-left:10px">删除</el-link>
          </template>
        </el-table-column>
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
        class="listOptimizePage"
      ></el-pagination>
      <!-- 新增/编辑账号管理 -->
      <el-dialog :title="dialogTitle" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" :show-close="false" width="700px" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="top">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" :prop="dialogTitle == '查看账号' ? '' : 'userName'">
                <span v-if="dialogTitle == '查看账号'" style="color:#000">{{ ruleForm.userName }}</span>
                <el-input v-else size="small" v-model="ruleForm.userName" clearable maxlength="15" autocomplete="off" style="width:280px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" :prop="dialogTitle == '查看账号' ? '' : 'phonenumber'">
                <div v-if="dialogTitle == '查看账号'" style="display: flex;align-items: center;">
                  <span style="color:#000">{{ isShowAllPhone ? ruleForm.phonenumber : ruleForm.tempPhone }}</span>
                  <img style="margin-left:10px;width:20px;height:20px;cursor: pointer;" @click="viewAll('phoneNumber')" :src="isShowAllPhone ? viewIcon : notViewIcon" alt="" />
                </div>
                <el-input size="small" v-else v-model="ruleForm.phonenumber" maxlength="11" clearable style="width:280px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属角色" :prop="dialogTitle == '查看账号' ? '' : ruleForm.roleType == 0 ? 'roleId' : 'roleIds'">
                <span v-if="dialogTitle == '查看账号'" style="color:#000">{{ ruleForm.roleNames }}</span>
                <div v-else>
                  <el-select size="small" v-if="ruleForm.roleType == 0 && toggleSelect" v-model="ruleForm.roleId" @change="roleChange" placeholder="请选择" style="width:280px">
                    <el-option v-for="item in roleList" :key="item.accessTemplateId" :label="item.accessTemplateName" :value="item.accessTemplateId"></el-option>
                  </el-select>
                  <el-select size="small" v-if="ruleForm.roleType != 0 && toggleSelect" v-model="ruleForm.roleIds" multiple placeholder="请选择" style="width:280px">
                    <el-option v-for="item in roleList" :key="item.accessTemplateId" :label="item.accessTemplateName" :value="item.accessTemplateId"></el-option>
                  </el-select>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="ruleForm.roleType == 2">
              <el-form-item label="所属岗位" prop="postIdList">
                <span v-if="dialogTitle == '查看账号'" style="color:#000">{{ ruleForm.postName.toString() }}</span>
                <el-select size="small" v-else clearable multiple v-model="ruleForm.postIdList" placeholder="请选择" style="width:280px;">
                  <el-option v-for="item in deptList" :key="item.id" :label="item.postName" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="ruleForm.roleType == 2">
              <el-form-item label="所属车间" prop="workshopIdList" key="workshopIdList">
                <span v-if="dialogTitle == '查看账号'" style="color:#000">{{ ruleForm.workshopNames }}</span>
                <el-select size="small" v-else clearable multiple v-model="ruleForm.workshopIdList" placeholder="请选择" style="width:280px;">
                  <el-option v-for="item in workshopList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="ruleForm.roleType == 0">
              <el-form-item label="区域" :prop="dialogTitle == '查看账号' ? '' : 'area'">
                <span v-if="dialogTitle == '查看账号'" style="color:#000">{{ ruleForm.areaName }}</span>
                <el-select size="small" v-else clearable v-model="ruleForm.area" placeholder="请选择" style="width:280px;">
                  <el-option v-for="item in arealist" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="ruleForm.roleType != 0">
              <el-form-item label="邮箱" :prop="dialogTitle == '查看账号' ? '' : 'email'">
                <span v-if="dialogTitle == '查看账号'" style="color:#000">{{ ruleForm.email }}</span>
                <el-input size="small" v-model="ruleForm.email" maxlength="50" clearable v-else style="width:280px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="ruleForm.roleType == 0">
              <el-form-item label="邮箱" :prop="dialogTitle == '查看账号' ? '' : 'email'">
                <div v-if="dialogTitle == '查看账号'" style="display: flex;align-items: center;">
                  <span style="color:#000">{{ isShowAllEmail ? ruleForm.email : ruleForm.tempEmail }}</span>
                  <img style="margin-left:10px;width:20px;height:20px;cursor: pointer;" @click="viewAll('email')" :src="isShowAllEmail ? viewIcon : notViewIcon" alt="" />
                </div>
                <el-input size="small" v-model="ruleForm.email" maxlength="50" clearable v-else style="width:280px"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div style="margin:20px 0">
                <div style="display:flex;align-items:center"><span style="background:rgb(221,0,0);width:4px;height: 12px;display: inline-block;margin-right:10px"></span>账号登录有效时长</div>
                <div style="color:#000;flex:1;margin-top:12px;padding:10px 20px;border-radius:5px;background:rgba(204, 221, 255, 0.4);display:flex;align-items:center">
                  <i class="el-icon-warning" style="margin-right:10px;font-size:22px;color:#001450"></i>您可以通过设置登录有效时长，限制账号在<span style="color:#dd0000">指定时间范围内</span
                  >正常登录。
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否永久有效" :prop="dialogTitle == '查看账号' ? '' : 'valid'">
                <span v-if="dialogTitle == '查看账号'" style="color:#000">{{ ruleForm.valid===2 ? "无效" : ruleForm.valid===1 ?"是":"否" }}</span>
                <el-radio-group v-model="ruleForm.valid" @change="radioValidChange" v-else>
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="2">无效</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用期限" :prop="dialogTitle == '查看账号' ? '' : 'time'" v-if="!ruleForm.valid">
                <span v-if="dialogTitle == '查看账号'" style="color:#000">{{ ruleForm.time[0] }} 至 {{ ruleForm.time[1] }}</span>
                <el-date-picker
                  size="small"
                  v-else
                  style="width:280px;"
                  v-model="ruleForm.time"
                  :unlink-panels="true"
                  clearable
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <span style="color:rgb(255,153,0);margin-right:4px" v-if="ruleForm.time && ruleForm.time.length && ruleForm.valid == 0"
                ><i class="el-icon-warning" style="color:rgb(255,153,0)"></i> 注意：该账号将在{{ ruleForm.time[1] }} 24点后失效！</span
              >
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right;">
          <el-button type="danger" @click="handleSubmit('ruleForm')" size="small" v-if="dialogTitle != '查看账号'">提交</el-button>
          <el-button type="danger" plain @click="handleCancle('ruleForm')" size="small">取消</el-button>
        </div>
      </el-dialog>
      <!-- 导入文件弹框 -->
      <el-dialog :visible.sync="showImportFileFlag" width="400px" :close-on-click-modal="false" @close="cancelUploadFile('fileForm')">
        <div slot="title">
          <span>导入表格</span>
        </div>
        <div style="color:rgb(221,0,0)">注意：导入的账号，默认为永久有效。</div>
        <div style="color:rgb(221,0,0)">导入成功后，若需对账号有效时长进行调整，可在账号列表对账号详情进行修改。</div>
        <el-form :model="fileForm" ref="fileForm" :rules="rules" label-position="left">
          <el-form-item style="margin-top:20px;">
            <el-upload
              drag
              action="uploadUrl"
              :auto-upload="false"
              accept=".xls, .xlsx"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleFileChange"
              :file-list="fileForm.fileList"
            >
              <div>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em style="color:#001450">点击上传</em></div>
              </div>
            </el-upload>
          </el-form-item>
          <div style="color:#dd0000;font-size:16px;text-decoration: underline;cursor:pointer" @click="uploadTable">下载导入模板</div>
        </el-form>
        <div slot="footer" class="dialog-footer" style="line-height:32px">
          <el-button @click="cancelUploadFile('fileForm')" size="small">取 消</el-button>
          <el-button type="danger" :loading="isloading" size="small" @click="submitFile('fileForm')">{{ isloading ? "正在上传文件，请稍等" : "确认上传" }}</el-button>
        </div>
      </el-dialog>
      <!-- 批量导入荣誉称号的弹框 -->
      <el-dialog :visible.sync="showImportHonortitleFlag" width="400px" :close-on-click-modal="false" @close="cancelUploadHonorFile('fileHonorForm')">
        <div slot="title">
          <span>导入荣誉称号</span>
        </div>
        <el-form :model="fileHonorForm" ref="fileHonorForm" :rules="rules" label-position="left">
          <el-form-item style="margin-top:20px;">
            <el-upload
              drag
              action="uploadUrl"
              :auto-upload="false"
              accept=".xls, .xlsx"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :on-change="handleHonorFileChange"
              :file-list="fileHonorForm.fileList"
            >
              <div>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em style="color:#001450">点击上传</em></div>
              </div>
            </el-upload>
          </el-form-item>
          <div style="color:#dd0000;font-size:16px;text-decoration: underline;cursor:pointer" @click="uploadHonorTable">下载导入模板</div>
        </el-form>
        <div slot="footer" class="dialog-footer" style="line-height:32px">
          <el-button @click="cancelUploadHonorFile('fileHonorForm')" size="small">取 消</el-button>
          <el-button type="danger" :loading="isloadingHonor" size="small" @click="submitHonorFile('fileHonorForm')">{{ isloadingHonor ? "正在上传文件，请稍等" : "确认上传" }}</el-button>
        </div>
      </el-dialog>
      <!-- 导入结果弹框 -->
      <el-dialog :visible.sync="showImportResultsFlag" width="35%" :close-on-click-modal="false">
        <div slot="title">
          <span>导入结果</span>
        </div>
        <div v-if="importType == 'account'">
          <!-- <div style="padding-left:30%;line-height:40px;margin-top:30px;" v-if="$userInfo.userType == 0">
            <div>本次导入数据共 {{ importResult.allCount }} 条</div>
            <div style="color:#70B603">已修改 {{ importResult.updatedCount }} 条</div>
            <div style="color:#70B603">未变化 {{ importResult.noChangeCount }} 条</div>
            <div style="color:#ff0000">失败 {{ importResult.failCount }} 条</div>
          </div> -->
          <div style="padding-left:30%;line-height:40px;margin-top:30px;">
            <div>本次导入数据共 {{ importResult.allCount }} 条</div>
            <div style="color:#70B603">成功 {{ importResult.updatedCount }} 条</div>
            <div style="color:#ff0000">失败 {{ importResult.failCount }} 条</div>
          </div>
        </div>
        <div v-if="importType == 'honor'">
          <div style="padding-left:30%;line-height:40px;margin-top:30px;">
            <div>本次导入数据共 {{ importResult.totalCount }} 条</div>
            <div style="color:#70B603">成功 {{ importResult.successCount }} 条</div>
            <div style="color:#ff0000">失败 {{ importResult.failCount }} 条</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeImportResult()" size="small">关闭</el-button>
          <el-button v-if="importResult.failCount != 0" type="primary" @click="handleFailDetail()" size="small">失败详情</el-button>
        </div>
      </el-dialog>
      <!-- 失败详情弹框 -->
      <el-dialog :visible.sync="showFailDetailFlag" width="70%" :close-on-click-modal="false" style="padding-bottom:40px;">
        <div slot="title">
          <span>失败详情</span>
        </div>
        <div style="padding:0px 20px;">
          <!-- 表格 -->
          <el-table
            ref="customerTable"
            :key="key"
            row-key="id"
            :data="failDetailTableData"
            tooltip-effect="dark"
            max-height="500"
            style="width: 100%"
            :header-cell-style="{ background: '#f7f7f7' }"
            stripe
          >
            <el-table-column prop="row" label="第几行" min-width="15%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fieldName" :show-overflow-tooltip="true" label="字段名称" min-width="30%"></el-table-column>
            <el-table-column prop="failResult" label="错误详情" min-width="40%" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination
            v-if="fDDataTotalNumber"
            background
            @size-change="handleSizeChangeFD"
            @current-change="handleCurrentChangeFD"
            :current-page="pagenationFD.current"
            :page-size="pagenationFD.size"
            :pager-count="4"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="fDDataTotalNumber"
            style="float: right; display: flex; margin-top: 10px;position: static;"
          ></el-pagination>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top:40px;">
          <el-button @click="closeFailDetail()" size="small">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 荣誉勋章失败详情弹框 -->
      <el-dialog :visible.sync="showFailHonorDetailFlag" width="70%" :close-on-click-modal="false" style="padding-bottom:40px;">
        <div slot="title">
          <span>失败详情</span>
        </div>
        <div style="padding:0px 20px;">
          <!-- 表格 -->
          <el-table :key="key" row-key="id" :data="failDetailHonorTableData" tooltip-effect="dark" max-height="500" style="width: 100%" :header-cell-style="{ background: '#f7f7f7' }" stripe>
            <el-table-column prop="phoneNumber" label="联系电话" min-width="15%" show-overflow-tooltip></el-table-column>
            <el-table-column prop="honoraryMedal" :show-overflow-tooltip="true" label="荣誉称号" min-width="30%"></el-table-column>
            <el-table-column prop="reason" label="错误详情" min-width="40%" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="dialog-footer" style="margin-top:40px;">
          <el-button @click="closeFailDetail()" size="small">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 数据转移弹框 -->
      <el-dialog title="数据转移" :visible.sync="dialogTransferVisible" :close-on-click-modal="false" class="dialog-transfer" width="30%">
        <div style="margin-bottom:10px;">请选择继承数据的用户：</div>
        <el-select v-if="replaceObj.roleType != '1'" size="small" clearable filterable v-model="transferUserNumber" placeholder="请选择" style="width: 250px">
          <el-option v-for="item in transferList" :key="item.userNumber" :label="item.userName" :value="item.userNumber"></el-option>
        </el-select>
        <el-select v-if="replaceObj.roleType == '1'" size="small" clearable filterable v-model="transferUserNumber" placeholder="请选择" style="width: 250px">
          <el-option v-for="item in transferList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer" align="center">
          <el-button type="danger" plain @click="dialogTransferVisible = false" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmTrasfer" size="small">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 数据转移确认弹框 -->
      <el-dialog title="数据转移" :visible.sync="confirmTransferVisible" :close-on-click-modal="false" class="dialog-transfer" width="30%">
        <div style="width:400px;margin:0 auto;">
          <div class="confirm-tips">
            <div class="img_div">
              <img :src="replaceObj.avatar ? replaceObj.avatar : headImg" alt="" style="width: 40px; height: 40px" />
              <div class="img_text">{{ replaceObj.userName }}</div>
            </div>
            <div style="margin:0 40px;">
              <img src="../../../assets/process-unChecked.png" style="width:32px;height:30px;" />
            </div>
            <div class="img_div">
              <img :src="selectObj.avatar ? selectObj.avatar : headImg" alt="" style="width: 40px; height: 40px" />
              <div class="img_text">{{ selectObj.userName }}</div>
            </div>
          </div>
          <div class="tips_text" v-if="replaceObj.roleType == '0'">
            <div style="margin:12px 0 4px 0;">为保证成功，请注意以下事项:</div>
            <div style="line-height:22px;color:#999;">
              <div>1）请尽量在非工作时段转移用户数据，推荐时间段：当日20:00 ~ 次日8:00;</div>
              <div>2）系统仅对工单、计划工程服务项、申请单、分管人、特价润滑申请等数据进行继承;</div>
              <div>3）请尽量避免同时进行多个账号的数据转移;</div>
              <div>4）数据转移过程中，请尽量避免对双方账号有关的数据进行编辑、修改、执行、删除等操作;</div>
              <div>5）数据转移过程中，请尽量避免以双方账号为对象，进行创建、分配、转派等操作;</div>
              <div>6）数据转移开始和完成时，系统将发送邮件给被转移账号的用户和管理员用户，请注意查收;</div>
              <div>7）数据转移预计耗时1分钟，请耐心等待，是否完成请以邮件为准;</div>
            </div>
          </div>
          <div class="tips_text" v-if="replaceObj.roleType == '1'">
            <div style="margin:12px 0 4px 0;">为保证成功，请注意以下事项:</div>
            <div style="line-height:22px;color:#999;">
              <div>1）请尽量在非工作时段转移用户数据，推荐时间段：当日20:00 ～ 次日8:00;</div>
              <div>2）系统仅对工单、计划工程服务项、申请单、分管人、特价润滑申请、等数据进行继承;</div>
              <div>3）系统仅对待确认、待处理、进行中的申请单、待执行的工单、待处理的计划工程服务、等待办事项进行继承;</div>
              <div>4）请尽量避免同时进行多个账号的数据转移;</div>
              <div>5）数据转移过程中，请尽量避免对双方账号有关的数据进行编辑、修改、执行、删除等操作;</div>
              <div>6）数据转移过程中，请尽量避免以双方账号为对象，进行创建、分配、转派等操作;</div>
              <div v-if="$userInfo.userType == 0">7）数据转移开始和完成时，系统将发送邮件给管理员用户，请注意查收;</div>
              <div v-if="$userInfo.userType == 0">8）数据转移预计耗时 1 分钟，请耐心等待，是否完成请以邮件为准;</div>
              <div v-if="$userInfo.userType == 1">7）数据转移开始和完成时，系统将发送消息给管理员用户，请注意查收;</div>
              <div v-if="$userInfo.userType == 1">8）数据转移预计耗时 1 分钟，请耐心等待，是否完成请以消息为准;</div>
            </div>
          </div>
          <div class="tips_text" v-if="replaceObj.roleType == '2'">
            <div style="margin:12px 0 4px 0;">为保证成功，请注意以下事项:</div>
            <div style="line-height:22px;color:#999;">
              <div>1）请尽量在非工作时段转移用户数据，推荐时间段：当日20:00 ～ 次日8:00;</div>
              <div>2）系统仅对计划、任务、申请单、角色、部门、岗位进行继承;</div>
              <div>3）请避免同时进行多个账号的数据转移;</div>
              <div>4）数据转移过程中，请避免对双方账号有关的数据进行编辑、修改、执行、删除等操作;</div>
              <div>5）数据转移过程中，请避免以双方账号为对象，进行创建、分配、转派等操作;</div>
              <div>6）数据转移完成后将通过系统消息提示，请注意查看;</div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" align="center">
          <el-button type="danger" plain @click="confirmTransferVisible = false" size="small">取 消</el-button>
          <el-button type="danger" @click="confirmTrasferTips" size="small" :loading="loadingTransfer">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
import customField from "../../tableComponents/customField.vue";
import customTable from "../../tableComponents/customTable";
import columnHeader from "../../tableComponents/headerComponent";
import commonJS from "../../tableComponents/tableCommon.js";
export default {
  mixins: [commonJS],
  data() {
    var validatePhone = (rule, value, callback) => {
      let regPhone = /^((\+?86)|(\(\+86\)))?(1[3456789][0123456789][0-9]{8}|1349[0-9]{7})$/;
      if (value && !regPhone.test(value)) {
        callback(new Error("请不要输入无效的号码"));
      } else if (!value) {
        callback(new Error("请输入联系电话"));
      } else {
        this.checkPhoneUnique(callback);
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!value && this.rules.email[0].required) {
        callback(new Error("请输入邮箱"));
      } else if (value && this.rules.email[0].required && !value.endsWith("@exxonmobil.com") && baseRemoteOauth2 == "https://mobilserv.mobil.com.cn/msdp") {
        callback(new Error("仅限埃克森美孚公司邮箱"));
      } else {
        this.checkEmailUnique(callback);
      }
    };
    var validateRole = (rule, value, callback) => {
      if (!this.ruleForm.roleIds.length) {
        callback(new Error("请选择角色"));
      } else {
        callback();
      }
    };
    return {
      inviterPersonDetail: {},
      sortType: true,
      loadingTransfer: false,
      sortMethod: "createTime",
      mobilFieldlistUnit: [
        {
          fieldName: "userName",
          visible: 2
        },
        {
          fieldName: "phonenumber",
          visible: 1
        },
        {
          fieldName: "email",
          visible: 1
        },
        {
          fieldName: "roleNames",
          visible: 1
        },
        {
          fieldName: "loginDate",
          visible: 1
        },
        {
          fieldName: "createTime",
          visible: 1
        },
        {
          fieldName: "useStateFlag",
          visible: 1
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      customFieldlistUnit: [
        {
          fieldName: "userName",
          visible: 2
        },
        {
          fieldName: "phonenumber",
          visible: 1
        },
        {
          fieldName: "email",
          visible: 1
        },
        {
          fieldName: "roleNames",
          visible: 1
        },
        {
          fieldName: "postName",
          visible: 1
        },
        {
          fieldName: "loginDate",
          visible: 1
        },
        {
          fieldName: "createTime",
          visible: 1
        },
        {
          fieldName: "useStateFlag",
          visible: 1
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      dealerFieldlistUnit: [
        {
          fieldName: "userName",
          visible: 2
        },
        {
          fieldName: "phonenumber",
          visible: 1
        },
        {
          fieldName: "email",
          visible: 1
        },
        {
          fieldName: "roleNames",
          visible: 1
        },
        {
          fieldName: "loginDate",
          visible: 1
        },
        {
          fieldName: "createTime",
          visible: 1
        },
        {
          fieldName: "useStateFlag",
          visible: 1
        },
        {
          fieldName: "operation",
          visible: 2
        }
      ],
      customFieldlist: [],
      tableHeight: null,
      tableDataHeaderInit: {
        userName: { filterType: "input", paramValue: "userName", changeValue: "", prop: "userName", slot: "userName", label: "姓名", fixed: "left", width: "180", tooltip: true },
        phonenumber: { filterType: "input", paramValue: "phonenumber", changeValue: "", slot: "phonenumber", label: "联系电话", width: "150" },
        email: { filterType: "input", paramValue: "email", changeValue: "", slot: "email", label: "邮箱", width: "210" },
        roleNames: { slot: "roleNames", label: "角色", width: "150", tooltip: true },
        loginDate: { paramValue: "loginDate", sortTypeVal: "sortDefault", label: "最后登录日期", prop: "loginDate", width: "160", tooltip: true },
        createTime: { paramValue: "createTime", sortTypeVal: "sortDown", label: "创建日期", prop: "createTime", width: "160", tooltip: true },
        useStateFlag: {
          selectMultiple: true,
          filterType: "selection",
          paramValue: "useStateFlag",
          changeValue: "",
          selectOptions: [{ name: "有效", code: 1 }, { name: "已失效", code: 0 }, { name: "无效", code: 2 }],
          slot: "useStateFlag",
          label: "账号状态",
          width: "100"
        },
        operation: { slot: "operation", label: "操作" }
      },
      dealerDataHeaderInit: {
        userName: { filterType: "input", paramValue: "userName", changeValue: "", prop: "userName", slot: "userName", label: "姓名", fixed: "left", width: "150", tooltip: true },
        phonenumber: { filterType: "input", paramValue: "phonenumber", changeValue: "", slot: "phonenumber", label: "联系电话", width: "150" },
        email: { filterType: "input", paramValue: "email", changeValue: "", slot: "email", label: "邮箱", width: "210" },
        roleNames: { slot: "roleNames", label: "角色", width: "150", tooltip: true },
        loginDate: { paramValue: "loginDate", sortTypeVal: "sortDefault", label: "最后登录日期", prop: "loginDate", width: "160", tooltip: true },
        createTime: { paramValue: "createTime", sortTypeVal: "sortDown", label: "创建日期", prop: "createTime", width: "160", tooltip: true },
        useStateFlag: {
          selectMultiple: true,
          filterType: "selection",
          paramValue: "useStateFlag",
          changeValue: "",
          selectOptions: [{ name: "有效", code: 1 }, { name: "已失效", code: 0 }, { name: "无效", code: 2 }],
          slot: "useStateFlag",
          label: "账号状态",
          width: "100"
        },
        operation: { slot: "operation", label: "操作" }
      },
      customerHeaderInit: {
        userName: { filterType: "input", paramValue: "userName", changeValue: "", prop: "userName", slot: "userName", label: "姓名", fixed: "left", width: "150", tooltip: true },
        phonenumber: { filterType: "input", paramValue: "phonenumber", changeValue: "", slot: "phonenumber", label: "联系电话", width: "150" },
        email: { filterType: "input", paramValue: "email", changeValue: "", slot: "email", label: "邮箱", width: "210" },
        roleNames: { slot: "roleNames", label: "角色", width: "150", tooltip: true },
        postName: { filterType: "input", paramValue: "postName", changeValue: "", label: "岗位", slot: "postNames", prop: "postNames", width: "120", tooltip: true },
        loginDate: { paramValue: "loginDate", sortTypeVal: "sortDefault", label: "最后登录日期", prop: "loginDate", width: "160", tooltip: true },
        createTime: { paramValue: "createTime", sortTypeVal: "sortDown", label: "创建日期", prop: "createTime", width: "160", tooltip: true },
        useStateFlag: {
          selectMultiple: true,
          filterType: "selection",
          paramValue: "useStateFlag",
          changeValue: "",
          selectOptions: [{ name: "有效", code: 1 }, { name: "已失效", code: 0 }, { name: "无效", code: 2 }],
          slot: "useStateFlag",
          label: "账号状态",
          width: "100"
        },
        operation: { slot: "operation", label: "操作" }
      },
      tableDataHeader: [],
      headImg: require("../../../assets/headImg.png"),
      viewIcon: require("../../../assets/account_view.png"),
      notViewIcon: require("../../../assets/account_not_view.png"),
      transferUserNumber: "",
      replaceObj: {},
      selectObj: {},
      transferList: [],
      confirmTransferVisible: false,
      dialogTransferVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
      accountManageHeight: 0,
      formDivHeight: 0,
      pagenation: {
        current: 1,
        size: 30
      },
      departmentList: [],
      roleTypeList: [{ label: "美孚", value: "0" }, { label: "经销商", value: "1" }, { label: "客户", value: "2" }],
      statusList: [{ label: "有效", value: true }, { label: "已失效", value: false }],
      uploadUrl: `${process.env.api}/web/config/serviceConfiguration/addServiceConfiguration`,
      showImportFileFlag: false,
      showImportHonortitleFlag: false, // 批量导入荣誉称号的弹框
      totalNumber: 0, // 总条数
      accountTableData: [], // 账号数据
      selectList: [],
      dialogFormVisible: false, // 新增账号对话框
      ruleForm: {
        userName: "",
        email: "",
        phonenumber: "",
        roleType: "0",
        roleIds: [],
        postIdList: [],
        roleId: "",
        companyNumber: "",
        area: "",
        valid: 1, // 是否有效
        time: [], // 使用期限
        workshopIdList: []
      },
      rules: {
        userName: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }, { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }],
        roleType: [{ required: true, message: "请选择角色归属", trigger: "change" }],
        companyNumber: [{ required: true, message: "请选择所属公司", trigger: "change" }],
        phonenumber: [{ required: true, validator: validatePhone, trigger: "blur" }],
        roleIds: [{ required: true, validator: validateRole, trigger: "change" }],
        roleId: [{ required: true, message: "请选择角色", trigger: "change" }],
        area: [{ required: true, message: "请选择区域", trigger: "change" }],
        valid: [{ required: true, trigger: "change" }],
        time: [{ required: true, message: "请选择使用期限", trigger: "change" }]
      },
      fileForm: {
        fileList: []
      },
      fileHonorForm: {
        fileList: []
      },
      customerList: [],
      roleList: [], // 角色列表
      dialogTitle: "",
      loading: false, // 是否加载
      addFlag: 1, // 是否是新建弹窗
      ACCEditBtn: false,
      ACCDeleteBtn: false,
      isloading: false, // 上传文件按钮
      isloadingHonor: false, // 上次经销商荣誉勋章按钮
      failDetailTableData: [], // 失败详情表格内容
      showImportResultsFlag: false, // 展示导入结果弹框
      failNum: true, // 如果有上传失败记录，显示失败详情按钮
      showFailDetailFlag: false, // 展示失败详情弹框
      showFailHonorDetailFlag: false, // 荣誉勋章导入失败详情
      failDetailHonorTableData: [],
      viewImportHistory: false, // 导入历史弹框
      showChangeHistoryFlag: false, // 变更历史弹框
      importType: "", // 导入类型
      importHistoryTableData: [], // 导入历史表格数据
      queryParams: {
        userName: "", // 姓名
        roleType: "", // 账号
        phonenumber: "",
        useStateFlag: "",
        email: "",
        companyName: "",
        deptName: "", // 部门名称
        postName: "" // 岗位名称
      },
      fDDataTotalNumber: 0, // 失败详情列表总数
      iHDataTotalNumber: 0, // 导入历史表格总条数
      pageshow: true,
      pagenationFD: {
        //   失败详情列表分页参数
        current: 1,
        size: 10
      },
      pagenationIH: {
        //   导入历史列表分页参数
        current: 1,
        size: 10
      },
      arealist: [],
      toggleSelect: true,
      showValue: "",
      fileRom: "", // 批量导入上传得附件
      fileHonorRom: "", // 批量导入荣誉勋章上传的附件
      unSaveChangeCurrent: false,
      companyId: "",
      deptList: [], // 岗位数据
      selectDeptId: [], // 选择的部门数组
      depart: false,
      importResult: "", // 导入结果
      isShowAllPhone: false, //展示电话
      isShowAllEmail: false //展示email
    };
  },
  components: {
    "custom-field": customField,
    "custom-table": customTable,
    "column-header": columnHeader
  },
  mounted() {
    this.$_queryAccountList(); // 获取账号列表
    this.getCustomFieldList();
    this.handleTableHeight();
    // this.getWorkShopList(this.$userInfo.orgInfo.companyId);
    window.addEventListener("resize", () => {
      this.mainminheight = this.$userInfo.userType == 2 ? `height:${document.documentElement.clientHeight - 220}px` : `height:${document.documentElement.clientHeight - 150}px`;
      this.$nextTick(() => {
        this.handleTableHeight();
      });
    });
    let buttonpermsStr = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonpermsStr) {
      let item = buttonpermsStr[i];
      if (item.menuFontUrl == "ACCEditBtn") {
        this.ACCEditBtn = true;
      }
      if (item.menuFontUrl == "ACCDeleteBtn") {
        this.ACCDeleteBtn = true;
      }
    }
  },
  methods: {
    // 所属岗位查询
    queryPostList(val, companyId) {
      let url = "/web/system/permission/orgPostManage/queryPostList";
      if (val == "add") {
        this.selectDeptId = [];
      }
      let params = {
        orgId: companyId,
        current: 1,
        size: 300,
        requestSource: 2
      };

      this.requestMethodGet(url, params)
        .then(res => {
          this.deptList = res.data.data.list;
        })
        .catch(res => {});
    },
    async getWorkShopList(accountIds, workshopUserId) {
      const res = await this.requestMethodPost("weChat/workshop/filterWorkshop", {
        accountIds: [accountIds],
        workshopUserId: workshopUserId,
        menuCode: "PC_workshopdata"
      });
      if (res.data.code == 1000) {
        this.workshopList = res.data.data.list;
      }
    },
    tableTitleSearch(obj) {
      let searchVal = obj.changeValue;
      this.tableDataHeader.forEach(item => {
        if (obj.paramValue == item.paramValue) {
          item.changeValue = searchVal === 0 || searchVal === false ? searchVal : searchVal || "";
        }
      });
      if (obj.paramValue == "roleType" || obj.paramValue == "useStateFlag") {
        this.queryParams[obj.paramValue] = searchVal.toString();
      } else {
        this.queryParams[obj.paramValue] = searchVal;
      }
      this.handleSearchTableData();
    },
    changeSortTable(obj) {
      let sortVal = obj.sortTypeVal;
      this.sortMethod = obj.paramValue;
      if (sortVal == "sortUp") {
        this.sortType = false;
      } else if (sortVal == "sortDown") {
        this.sortType = true;
      }
      this.tableDataHeader.forEach(item => {
        if (item.sortTypeVal && item.paramValue == this.sortMethod) {
          item.sortTypeVal = sortVal;
        } else if (item.sortTypeVal && item.paramValue != this.sortMethod) {
          item.sortTypeVal = "sortDefault";
        }
      });
      this.handleSearchTableData();
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
        this.tableHeight = this.$userInfo.userType == 2 ? Number(this.accountManageHeight) - Number(this.formDivHeight) - 120 : Number(this.accountManageHeight) - Number(this.formDivHeight) - 50;
        this.$emit("get-height", this.tableHeight);
      }, 200);
    },
    // 获取自定义字段信息
    getCustomFieldList() {
      let fieldDtoList = JSON.parse(sessionStorage.getItem("fieldDtoList"));
      let customFieldlistUnit = [];
      if (fieldDtoList.length == 0) {
        if (this.$userInfo.userType == 0) {
          customFieldlistUnit = this.mobilFieldlistUnit;
        } else if (this.$userInfo.userType == 1) {
          customFieldlistUnit = this.dealerFieldlistUnit;
        } else {
          customFieldlistUnit = this.customFieldlistUnit;
        }
      } else {
        let index = fieldDtoList.findIndex(item => item.listType == "teamMember");
        if (index != -1) {
          let fieldDtoInfos = fieldDtoList[index].fieldDtoInfos;
          if (this.$userInfo.userType == 0) {
            customFieldlistUnit = fieldDtoInfos.length == 0 ? this.mobilFieldlistUnit : fieldDtoInfos;
          } else if (this.$userInfo.userType == 1) {
            customFieldlistUnit = fieldDtoInfos.length == 0 ? this.dealerFieldlistUnit : fieldDtoInfos;
          } else {
            customFieldlistUnit = fieldDtoInfos.length == 0 ? this.customFieldlistUnit : fieldDtoInfos;
          }
        } else {
          customFieldlistUnit = this.$userInfo.userType == 0 ? this.mobilFieldlistUnit : this.$userInfo.userType == 1 ? this.dealerFieldlistUnit : this.customFieldlistUnit;
        }
      }
      let customFieldlist = customFieldlistUnit.map(item => {
        if (this.$userInfo.userType == 0) {
          item.fieldNameCn = this.tableDataHeaderInit[item.fieldName].label;
        } else if (this.$userInfo.userType == 1) {
          item.fieldNameCn = this.dealerDataHeaderInit[item.fieldName].label;
        } else {
          item.fieldNameCn = this.customerHeaderInit[item.fieldName].label;
        }

        return item;
      });
      customFieldlist.sort((a, b) => {
        return a.sort - b.sort;
      });
      this.customFieldlist = customFieldlist;
      let tableDataHeader = [];
      this.customFieldlist.forEach(item => {
        if (item.visible != 0) {
          if (this.$userInfo.userType == 0) {
            tableDataHeader.push(this.tableDataHeaderInit[item.fieldName]);
          } else if (this.$userInfo.userType == 1) {
            tableDataHeader.push(this.dealerDataHeaderInit[item.fieldName]);
          } else {
            tableDataHeader.push(this.customerHeaderInit[item.fieldName]);
          }
        }
      });
      if (this.$userInfo.userType == 0) {
        if (this.tableDataHeaderInit.selection) {
          tableDataHeader.unshift(this.tableDataHeaderInit.selection);
        }
      } else if (this.$userInfo.userType == 1) {
        if (this.dealerDataHeaderInit.selection) {
          tableDataHeader.unshift(this.dealerDataHeaderInit.selection);
        }
      } else {
        if (this.customerHeaderInit.selection) {
          tableDataHeader.unshift(this.customerHeaderInit.selection);
        }
      }

      this.tableDataHeader = tableDataHeader;
    },
    // 自定义字段
    getCustomFields(data) {
      this.customFieldlist = data;
      let tableDataHeader = [];
      data.forEach(item => {
        if (item.visible != 0) {
          if (this.$userInfo.userType == 0) {
            tableDataHeader.push(this.tableDataHeaderInit[item.fieldName]);
          } else if (this.$userInfo.userType == 1) {
            tableDataHeader.push(this.dealerDataHeaderInit[item.fieldName]);
          } else {
            tableDataHeader.push(this.customerHeaderInit[item.fieldName]);
          }
        }
      });
      if (this.$userInfo.userType == 0) {
        if (this.tableDataHeaderInit.selection) {
          tableDataHeader.unshift(this.tableDataHeaderInit.selection);
        }
      } else if (this.$userInfo.userType == 1) {
        if (this.dealerDataHeaderInit.selection) {
          tableDataHeader.unshift(this.dealerDataHeaderInit.selection);
        }
      } else {
        if (this.customerHeaderInit.selection) {
          tableDataHeader.unshift(this.customerHeaderInit.selection);
        }
      }
      this.tableDataHeader = tableDataHeader;
    },
    // 查看全部
    viewAll(propName) {
      if (propName == "email") {
        this.isShowAllEmail = !this.isShowAllEmail;
      } else {
        this.isShowAllPhone = !this.isShowAllPhone;
      }
    },
    viewListAll(row, propName) {
      this.accountTableData.forEach(it => {
        if (row.userId == it.userId) {
          if (propName == "email") {
            it.isShowListAllEmail = !it.isShowListAllEmail;
          } else {
            it.isShowListAllPhone = !it.isShowListAllPhone;
          }
        }
      });
    },
    // 复制邮箱
    onCopyMail(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制邮箱
    onErrorMail(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 复制手机号
    onCopyTel(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制失败
    onErrorTel(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    getPersonDetail(scope) {
      this.inviterPersonDetail = {};
      if (scope.row.inviter) {
        this.$refs[`popovers-${scope.$index}`].doClose();
        let param = {
          userId: scope.row.inviter
        };
        this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              if (res.data) {
                this.$refs[`popovers-${scope.$index}`].doShow();
                this.inviterPersonDetail = res.data;
                if (this.inviterPersonDetail.avatar) {
                  this.getFullUrl(this.inviterPersonDetail.avatar);
                }
                if (this.inviterPersonDetail.roleNames) {
                  this.inviterPersonDetail.roleNames = this.inviterPersonDetail.roleNames.join(",");
                }
                if (this.inviterPersonDetail.phonenumber) {
                  const phoneNum = this.inviterPersonDetail.phonenumber;
                  this.inviterPersonDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                }
              } else {
                this.$refs[`popover-${index}`].doClose();
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
    // 获取头像全路径
    getFullUrl(val) {
      const params = {
        url: val
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          this.inviterPersonDetail.headUrl = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 确定转移
    confirmTrasfer() {
      console.log(this.transferUserNumber);
      let selectData = [];
      if (this.transferUserNumber) {
        this.confirmTransferVisible = true;
        if (this.replaceObj.roleType != 1) {
          selectData = this.transferList.filter(item => {
            return item.userNumber == this.transferUserNumber;
          });
        } else {
          selectData = this.transferList.filter(item => {
            return item.userId == this.transferUserNumber;
          });
        }
        console.log(selectData[0]);
        this.selectObj = selectData[0];
      } else {
        this.$message({
          message: "请选择用户",
          type: "warning"
        });
      }
    },
    confirmTrasferTips() {
      this.loadingTransfer = true;
      if (this.replaceObj.roleType == 0) {
        let param = {
          oldUserId: this.replaceObj.userId,
          oldUserNumber: this.replaceObj.userNumber,
          userId: this.selectObj.userId,
          userNumber: this.selectObj.userNumber,
          operationEntrance: "2"
        };
        this.requestMethodPost("/companyUser/replaceUserData", param)
          .then(res => {
            if (res.data.code == 1000) {
              this.confirmTransferVisible = false;
              this.dialogTransferVisible = false;
              this.loadingTransfer = false;
              this.$message({
                message: "数据转移成功。",
                type: "success"
              });
              // 调取消息未读数据
              this.$parent.msgCount();
            } else {
              this.$message({
                message: "数据转移失败。",
                type: "warning"
              });
              this.loadingTransfer = false;
            }
          })
          .catch(res => {});
      } else if (this.replaceObj.roleType == 2) {
        let param = {
          fromUserId: this.replaceObj.userId,
          fromUserName: this.replaceObj.userName,
          toUserId: this.selectObj.userId,
          toUserName: this.selectObj.userName
        };
        this.requestMethodPost("/web/system/permission/orgSysUserManagae/userDataTransfer", param)
          .then(res => {
            if (res.data.code == 1000) {
              this.confirmTransferVisible = false;
              this.dialogTransferVisible = false;
              this.loadingTransfer = false;
              this.$message({
                message: "数据转移成功。",
                type: "success"
              });
              this.$_queryAccountList(); // 获取账号列表
              // 调取消息未读数据
              this.$parent.msgCount();
            } else {
              this.$message({
                message: "数据转移失败。",
                type: "warning"
              });
              this.loadingTransfer = false;
            }
          })
          .catch(res => {});
      } else {
        let param = {
          fromUserId: this.replaceObj.userId,
          fromUserName: this.replaceObj.userName,
          toUserId: this.selectObj.userId,
          toUserName: this.selectObj.userName
        };
        this.requestMethodPost("/web/system/permission/orgSysUserManagae/distributorUserDataTransfer", param)
          .then(res => {
            if (res.data.code == 1000) {
              this.confirmTransferVisible = false;
              this.dialogTransferVisible = false;
              this.loadingTransfer = false;
              this.$message({
                message: "数据转移成功。",
                type: "success"
              });
              this.$_queryAccountList(); // 获取账号列表
              // 调取消息未读数据
              this.$parent.msgCount();
            } else {
              this.$message({
                message: "数据转移失败。",
                type: "warning"
              });
              this.loadingTransfer = false;
            }
          })
          .catch(res => {});
      }
    },
    // 获取数据转移列表
    getPersonsListData(areaCode, roleCode, userNumber, roleIds) {
      let param = {
        current: 1,
        size: 500,
        areaCode: areaCode,
        roleCode: roleCode,
        roleId: roleIds
      };
      this.requestMethodGet("/companyUser/selectReplaceUserList", param)
        .then(res => {
          if (res.data.code == 1000) {
            this.transferList = res.data.data.list.filter(item => {
              return item.userNumber != userNumber;
            });
          }
        })
        .catch(res => {});
    },
    // 获取经销商的转移人员数据下拉
    getPersonsListDistributorData(row) {
      let param = {
        current: 1,
        size: 500,
        id: row.userId,
        name: ""
      };
      this.requestMethodGet("/web/system/permission/orgSysUserManagae/distributorTeamMemberList", param)
        .then(res => {
          if (res.data.code == 1000) {
            this.transferList = res.data.data.list.filter(item => {
              return item.userNumber != row.userNumber;
            });
          }
        })
        .catch(res => {});
    },
    getPersonsListCustomerData(row) {
      let param = {
        current: 1,
        size: 500,
        id: this.EncryptUserId(row.userId)
      };
      this.requestMethodGet("/web/system/permission/orgSysUserManagae/teamMemberList", param)
        .then(res => {
          if (res.data.code == 1000) {
            this.transferList = res.data.data.list.filter(item => {
              return item.userNumber != row.userNumber;
            });
          }
        })
        .catch(res => {});
    },
    roleChange(val) {
      this.ruleForm.area = "";
      this.getAreaList(val);
    },
    getAreaList(val) {
      let params = {
        roleId: val
      };
      this.requestMethodGet("/web/sys/conf/area/selectRoleAreaById", params)
        .then(res => {
          this.arealist = res.data.data;
        })
        .catch(res => {});
    },
    // 所属公司 change 事件
    seleceCompany(val) {
      let company = this.customerList.filter(it => it.companyNumber == val);
      this.companyId = company[0].companyId;
      this.ruleForm.deptIdList = [];
      this.selectDeptId = [];
      this.ruleForm.postIdList = [];
      // this.queryDepartmentList(company[0].companyId);
      this.queryRolesList();
    },
    formatData(data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].childrens || data[i].childrens.length == 0) {
          data[i].childrens = null;
        } else {
          this.formatData(data[i].childrens);
        }
      }
      return data;
    },
    // 所属部门 数据 查询
    queryDepartmentList(val) {
      let params = {};
      let url = "";
      if (this.$userInfo.userType == 2) {
        url = "/web/system/permission/orgDeptManage/user/webSelectDepts";
      } else {
        url = "/web/system/permission/orgDeptManage/deptTreeByCompanyId";
        params.companyId = val;
        params.size = 300;
        params.current = 1;
      }
      this.requestMethodGet(url, params)
        .then(res => {
          const data = this.$userInfo.userType == 2 ? res.data.data : res.data.data.list;
          this.departmentList = this.formatData(data);
          if (this.depart) {
            this.ruleForm.deptIdList = this.fromDeptTree(this.departmentList, this.ruleForm.deptIdList);
          }
        })
        .catch(res => {});
    },
    // 部门 change  事件
    handleChangeDepartment(val) {
      if (val) {
        const result = [];
        for (let j = 0; j < val.length; j++) {
          result.push(val[j][val[j].length - 1]);
        }
        this.selectDeptId = Array.from(new Set(result));
        this.queryRolesList();
        this.ruleForm.postIdList = [];
      }
    },
    // 所属岗位查询
    queryRolesList(val) {
      let url = "/web/system/permission/orgPostManage/queryPostList";
      if (val == "add") {
        this.selectDeptId = [];
      }
      let params = {
        companyId: this.ruleForm.companyId,
        flagDeptHead: 2,
        size: 300,
        requestSource: 2
      };

      this.requestMethodGet(url, params)
        .then(res => {
          this.deptList = res.data.data.list;
        })
        .catch(res => {});
    },
    radioChange(val) {
      this.toggleSelect = false;
      if (val == 0) {
        this.rules.email[0].required = true;
      } else {
        this.rules.email[0].required = false;
      }
      this.ruleForm.roleId = "";
      this.ruleForm.roleIds = [];
      this.$nextTick(() => {
        this.toggleSelect = true;
      });
      this.ruleForm.companyNumber = "";
      this.ruleForm.companyName = "";
      this.$_queryCustomerData("");
      this.$_queryRoleData();
    },
    // 校验邮箱
    checkEmailUnique(callback) {
      let params = {
        userId: this.ruleForm.userId,
        email: this.ruleForm.email
      };
      this.requestMethodGet("/web/system/permission/userManage/checkEmailUnique", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            callback();
          } else {
            callback(res.msg);
          }
        })
        .catch(res => {});
    },
    // 校验手机号
    checkPhoneUnique(callback) {
      let params = {
        userId: this.ruleForm.userId,
        phone: this.ruleForm.phonenumber
      };
      this.requestMethodGet("/web/system/permission/userManage/checkPhoneUnique", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            callback();
          } else {
            callback(res.msg);
          }
        })
        .catch(res => {});
    },
    // 模糊搜索公司
    customerAllFilter(val) {
      this.$_queryCustomerData(val);
    },
    clearCustomer(val) {
      if (!val) {
        this.$_queryCustomerData("");
      }
    },
    // 查询所属客户
    $_queryCustomerData(val, it) {
      let params = {
        companyName: val,
        companyType: this.ruleForm.roleType,
        size: 300
      };
      console.log(params, this.ruleForm.roleType);
      this.customerList = [];
      this.requestMethodGet("/web/company/getCompanyDropdownList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data;
            if (this.$userInfo.userType != "0" && it == "first") {
              this.ruleForm.roleType = this.$userInfo.userType;
              this.ruleForm.companyNumber = this.$userInfo.companyNumber;
              this.ruleForm.companyName = this.$userInfo.orgInfo.companyName;
            }
            if (data.length > 0 && this.ruleForm.companyNumber) {
              const findItem = data.filter(item => {
                return item.companyNumber == this.ruleForm.companyNumber;
              });
              if (!findItem.length) {
                const obj = {
                  companyName: this.ruleForm.companyName,
                  companyNumber: this.ruleForm.companyNumber
                };
                data.unshift(obj);
              }
            }
            this.customerList = res.data;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取账号列表
    $_queryAccountList() {
      this.loading = true;
      let params = { ...this.queryParams, ...this.pagenation, menuCode: "AccountManageme" };
      params.userType = params.roleType;
      if (this.$userInfo.userType == 2) {
        params.userType = 2;
      }
      params.orderBy = this.sortMethod;
      params.descFlag = this.sortType;
      this.accountTableData = [];
      params.useStateFlag = params.useStateFlag+''
      params.userStatus = params.useStateFlag
      params.orgId = this.$userInfo.orgInfo.companyId;
      params.menuCode = "MyTeam";
      this.requestMethodGet("/web/system/permission/userManage/listByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            const data = res.data.list;
            if (data.length) {
              data.forEach(it => {
                it.isShowListAllEmail = false;
                it.isShowListAllPhone = false;
                it.tempPhone = this.tmPhone(it.phonenumber);
                it.tempEmail = this.tmEmail(it.email);
                it.companyName = it.orgInfo ? it.orgInfo.companyName : "";
              });
            }
            this.accountTableData = data;
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
    // 获取角色数据
    $_queryRoleData() {
      this.roleList = [];
      this.requestMethodGet("/web/system/permission/roleManage/list", { roleType: this.ruleForm.roleType })
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.roleList = res.data;
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
    handleSearchTableData() {
      this.pagenation.current = 1;
      this.$_queryAccountList();
    },
    // 重置
    handleClearSearch() {
      this.queryParams = {
        userName: "", // 姓名
        roleType: "", // 账号
        phonenumber: "",
        useStateFlag: "",
        email: "",
        companyName: "",
        deptName: "", // 部门名称
        postName: "" // 岗位名称
      };
      this.pagenation = {
        current: 1,
        size: 30
      };
      this.tableDataHeader.forEach(item => {
        item.changeValue = "";
      });
      console.log("this.tableDataHeader", this.tableDataHeader);
      this.$_queryAccountList();
    },
    // 新建
    handleAdd() {
      this.dialogFormVisible = true;
      this.dialogTitle = "新建账号";
      this.rules.email[0].required = true;
      this.ruleForm = {
        userName: "",
        email: "",
        phonenumber: "",
        roleType: 0,
        roleId: "",
        roleIds: [],
        postIdList: [],
        companyNumber: "",
        area: "",
        valid: 1,
        time: [
          this.moment(new Date()).format("YYYY-MM-DD"),
          this.moment(new Date())
            .add("days", 7)
            .format("YYYY-MM-DD")
        ] // 使用期限
      };
      if (this.$userInfo.userType == "2") {
        this.ruleForm.roleType = 2;
        this.rules.email[0].required = false;
        this.companyId = this.$userInfo.orgInfo.companyId;
        this.$_queryRoleData(); // 获取角色列表
        this.queryPostList("add", this.companyId);
      }
      if (this.$userInfo.userType == "1") {
        this.ruleForm.roleType = 1;
        this.rules.email[0].required = false;
        this.companyId = this.$userInfo.orgInfo.companyId;
      }
      this.ruleForm.userType = this.ruleForm.roleType;
      if (this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
      }
      this.$_queryRoleData(); // 获取角色列表
      this.$_queryCustomerData("", "first");
      this.getWorkShopList(this.$userInfo.orgInfo.companyId);
    },
    fromDeptTree(array, selects) {
      var items = [];
      if (selects) {
        for (var i = 0; i < selects.length; i++) {
          var item = this.recursionDept(array, selects[i]);
          items.push(item);
        }
      } else {
        items = [];
      }
      return items;
    },
    recursionDept(array, id) {
      if (array) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].id == id) {
            var items = [];
            items.unshift(id);
            return items;
          } else {
            if (array[i].childrens) {
              var res = this.recursionDept(array[i].childrens, id);
              if (res) {
                res.unshift(array[i].id);
                return res;
              }
            }
          }
        }
      }
    },
    // 编辑
    handleEdit(row, name) {
      if (row.userType == 0 && row.roleIds) this.getAreaList(row.roleIds[0]);
      this.dialogTitle = "编辑账号";
      this.ruleForm = {
        userName: row.userName,
        email: row.email,
        phonenumber: row.phonenumber,
        phone: row.phonenumber,
        roleType: row.userType,
        userType: row.userType,
        roleIds: row.roleIds,
        roleId: row.roleIds ? row.roleIds[0] : "",
        postName: row.postNames,
        deptName: row.deptName,
        postIdList: row.postIds || [],
        userId: row.userId,
        area: row.areaCode,
        valid: row.valid,
        time: [
          this.moment(new Date()).format("YYYY-MM-DD"),
          this.moment(new Date())
            .add("days", 7)
            .format("YYYY-MM-DD")
        ], // 使用期限
        orgInfo: row.orgInfo,
        companyNumber: row.orgInfo.companyNumber, // 使用期限
        companyName: row.orgInfo.companyName,
        workshopIdList: row.workshopIds ? row.workshopIds : [],
        workshopNames: row.workshopNames ? row.workshopNames.join(",") : ""
      };
      this.selectDeptId = row.deptIdList;
      if (row.startTime && row.endTime) {
        this.ruleForm.time = [row.startTime.substr(0, 10), row.endTime.substr(0, 10)]; // 使用期限
      }
      if (row.roleType != 0) {
        this.rules.email[0].required = false;
      } else {
        this.rules.email[0].required = true;
      }
      this.getWorkShopList(row.orgInfo.companyId, row.userId);
      this.$_queryRoleData(); // 获取角色列表
      this.$_queryCustomerData("");
      // this.queryDepartmentList(row.companyId);
      if (this.ruleForm.deptIdList) {
        this.depart = true;
      } else {
        this.depart = false;
      }
      this.companyId = row.orgInfo.companyId;
      this.queryPostList("", this.companyId);
      this.dialogFormVisible = true;
      if (name) {
        this.ruleForm.companyName = row.orgInfo.companyName;
        this.ruleForm.areaName = row.areaName;
        this.ruleForm.roleNames = row.roleNames.join(" / ");
        this.ruleForm.tempPhone = this.tmPhone(row.phonenumber);
        this.ruleForm.tempEmail = this.tmEmail(row.email);
        this.dialogTitle = "查看账号";
      }
    },
    // 手机号脱敏
    tmPhone(phone) {
      if (null != phone && phone != undefined) {
        var pat = /(\d{3})\d*(\d{4})/;
        return phone.replace(pat, "$1****$2");
      } else {
        return "";
      }
    },
    // 邮箱脱敏
    tmEmail(email) {
      let new_email = email;
      if (String(email).indexOf("@") > 0) {
        let str = email.split("@");
        let _s = "";
        if (str[0].length > 2) {
          //@前面多于3位
          for (let i = 2; i < str[0].length; i++) {
            _s += "*";
          }
          new_email = str[0].substr(0, 2) + _s + "@" + str[1];
        } else {
          //@前面小于等于于3位
          for (let i = 1; i < str[0].length; i++) {
            _s += "*";
          }
          new_email = str[0].substr(0, 1) + _s + "@" + str[1];
        }
      }
      return new_email;
    },
    // 数据转移
    handleTransfer(row) {
      this.transferUserNumber = "";
      this.dialogTransferVisible = true;
      this.replaceObj = row;
      // row.roleCode
      // row.area
      // row.userNumber
      console.log(row);
      this.transferList = [];
      if (row.roleType == 0) {
        this.getPersonsListData(row.area, row.roleCode, row.userNumber, row.roleIds[0]);
      } else if (row.roleType == 2) {
        this.getPersonsListCustomerData(row);
      } else {
        this.getPersonsListDistributorData(row);
      }
    },
    // 删除
    handleDelete(row) {
      this.$confirm("确认删除这条数据源?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          const formData = new FormData();
          formData.append("ids", row.userId);
          this.requestMethodPost("/web/system/permission/userManage/remove", formData)
            .then(res => {
              res = res.data;
              if (res.code == 1000) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.$_queryAccountList();
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
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增账号提交
    handleSubmit(formName) {
      this.$refs[formName].validate((valid, validateRes) => {
        try {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.ruleForm));
            if (!params.valid) {
              params.startTime = params.time[0] + " 00:00:00";
              params.endTime = params.time[1] + " 23:59:59";
            }
            params.companyId = this.companyId;

            if (params.area) params.areaCode = params.area;
            let url = "/web/system/permission/userManage/add";
            if (this.dialogTitle == "编辑账号") {
              params.flagWeb = true;
              url = "/web/system/permission/userManage/edit";
            }
            if (url == "/web/system/permission/userManage/add") {
              params.orgInfo = {
                companyNumber: params.companyNumber,
                companyId: this.$userInfo.orgInfo.companyId
              };
              params.accessTemplates = params.roleIds.map(id => ({ accessTemplateId: id }));
              params.userType = this.$userInfo.userType;
              params.validFlag = params.valid;
            }
            params.phone = params.phonenumber;
            if (params.postIdList) {
              params.posts = params.postIdList.map(id => {
                return {
                  postId: id
                };
              });
            }
            if (params.userType == 0) {
              params.accessTemplates = [{ accessTemplateId: params.roleId }];
            } else {
              params.accessTemplates = params.roleIds ? params.roleIds.map(id => ({ accessTemplateId: id })) : [];
            }

            this.requestMethodPost(url, params)
              .then(res => {
                res = res.data;
                if (res.code == 1000) {
                  this.$message({
                    message: "提交成功",
                    type: "success"
                  });
                  if (this.dialogTitle == "新建账号") {
                    this.pagenation.current = 1;
                  }
                  this.dialogFormVisible = false;
                  this.$_queryAccountList();
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
              })
              .catch(res => {
                console.log(res);
              });
          } else {
            return false;
          }
        } catch (e) {
          console.log(e);
        }
      });
    },
    // 新增账号取消
    handleCancle(formName) {
      this.$refs[formName].resetFields();
      this.dialogFormVisible = false;
    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.$_queryAccountList();
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.$_queryAccountList();
    },
    handleCurrentChangeRow(row, event, column) {},
    // 导入excel表格
    importFile() {
      this.showImportFileFlag = true;
    },
    // 批量导入荣誉称号
    importHonortitle() {
      this.showImportHonortitleFlag = true;
    },
    // 文件上传删除前置
    beforeRemove(file) {
      if (file.size > 100 * 1024 * 1024) {
        this.$message.error("上传文件大小不能超过 100MB!");
        return false; // 必须返回false
      }
    },
    // 文件上传超出限制
    handleExceed(files, fileList) {
      this.$message.error(`最多上传 1 个文件`);
    },
    // 文件上传删除
    handleRemove(file, fileList) {
      this.fileForm.fileList = [];
    },
    // 文件上传改变
    handleFileChange(file, fileList) {
      this.fileForm.fileList = fileList;
      this.fileRom = file.raw;
    },
    handleHonorFileChange(file, fileList) {
      this.fileHonorForm.fileList = fileList;
      this.fileHonorRom = file.raw;
    },
    // 弹框取消
    cancelUploadFile(formName) {
      this.fileForm.fileList = [];
      this.$refs[formName].resetFields();
      this.showImportFileFlag = false;
    },
    // 经销商荣誉称号 弹框取消
    cancelUploadHonorFile(formName) {
      this.fileForm.fileList = [];
      this.$refs[formName].resetFields();
      this.showImportHonortitleFlag = false;
    },
    // 导入表格 点击  确认上传
    submitFile(formName) {
      if (this.fileForm.fileList.length === 0) {
        this.$message.error("请上传文件");
      } else {
        this.isloading = true;
        var params = new FormData();
        params.append("file", this.fileRom);
        let url = "";
        if (this.$userInfo.userType == "1" || this.$userInfo.userType == "2") {
          url = "/web/system/permission/userManage/batchImportUserExcel";
        } else {
          // url = "/web/system/permission/userManage/importUserExcel";
          url = "/web/system/permission/userManage/batchImportUserExcel";
        }
        this.requestMethodPost(url, params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$_queryAccountList();
              // 导入成功
              this.isloading = false;
              this.importResult = res.data.importExcelResult;
              this.showImportResultsFlag = true;
              this.importType = "account";
              this.showImportFileFlag = false;
              this.fileForm.fileList = [];
              this.$refs[formName].resetFields();
            } else {
              this.isloading = false;
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
    },
    // 导入表格 点击  确认上传
    submitHonorFile(formName) {
      if (this.fileHonorForm.fileList.length === 0) {
        this.$message.error("请上传文件");
      } else {
        this.isloadingHonor = true;
        var params = new FormData();
        params.append("file", this.fileHonorRom);
        this.requestMethodPost("/web/system/permission/userManage/batchImportDistributorHonoraryMedal", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.$_queryAccountList();
              // 导入成功
              this.isloadingHonor = false;
              this.importType = "honor";
              this.showImportHonortitleFlag = false;
              this.fileHonorForm.fileList = [];
              this.$refs[formName].resetFields();
              this.importResult = res.data;
              this.showImportResultsFlag = true;
            } else if (res.code == 2000) {
              // 导入成功
              this.isloadingHonor = false;
              this.$_queryAccountList();
              this.importResult = res.data;
              this.failDetailHonorTableData = res.data.failList;
              this.showImportResultsFlag = true;
              this.importType = "honor";
              this.showImportHonortitleFlag = false;
              this.fileHonorForm.fileList = [];
              this.$refs[formName].resetFields();
            } else {
              this.isloadingHonor = false;
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
    },
    // 关闭导入结果弹框
    closeImportResult() {
      this.showImportResultsFlag = false; // 关闭导入结果弹框
    },
    // 关闭失败详情弹框
    closeFailDetail() {
      if (this.importType == "honor") {
        this.showFailHonorDetailFlag = false; // 关闭导入结果弹框
      } else {
        this.showFailDetailFlag = false;
      }
    },
    // 点击失败详情
    handleFailDetail() {
      if (this.importType == "honor") {
        this.showFailHonorDetailFlag = true; // 失败详情弹框展示
        this.showImportResultsFlag = false; // 关闭导入结果弹框
      } else {
        this.showFailDetailFlag = true; // 失败详情弹框展示
        this.showImportResultsFlag = false; // 关闭导入结果弹框
        this.getFailByPage(); // 获取失败数据
      }
    },
    // 获取失败数据
    getFailByPage() {
      this.loading = true;
      let params = { uniqueCode: this.importResult.uniqueCode, ...this.pagenationFD };
      this.requestMethodGet("/web/system/permission/userManage/importUserExcelError", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.failDetailTableData = res.data.list;
            this.fDDataTotalNumber = res.data.totalCount;
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
    // 点击查看导入历史
    handleViewImportHistory() {
      this.viewImportHistory = true;
      this.getImportHistoryData();
    },
    // 获取导入历史数据
    getImportHistoryData() {
      this.loading = true;
      let params = { ...this.pagenationIH };
      this.requestMethodGet("/web/sys/conf/msla/queryImportRecordByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.importHistoryTableData = res.data.list;
            this.iHDataTotalNumber = res.data.totalCount;
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

    // 下载表格模板
    uploadTable(row) {
      const params = {
        url: "template/user/import/美孚-批量导入账号模板.xls"
      };
      if (this.$userInfo.userType == "2") {
        params.url = "template/user/import/客户-批量导入账号模板.xls";
      } else if (this.$userInfo.userType == "1") {
        params.url = "template/user/import/经销商-批量导入账号模板.xls";
      }
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.location.href = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 下载批量导入经销商荣誉勋章的表格模板
    uploadHonorTable() {
      const params = {
        url: "user/template/批量导入经销商荣誉称号模板.xlsx"
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
        if (res.data.code == 1000) {
          window.location.href = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning"
          });
        }
      });
    },
    // 批量导出
    exportData() {
      if (!this.queryParams.useStateFlag) {
        this.queryParams.useStateFlag = "";
      }
      const loading = this.$loading({
        lock: true,
        text: "数据下载中，请稍后",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      let paramObj = {
        userName: this.queryParams.userName,
        roleType: this.queryParams.roleType,
        phonenumber: this.queryParams.phonenumber,
        useFlag: this.queryParams.useFlag,
        deptName: this.queryParams.deptName,
        postName: this.queryParams.postName,
        email: this.queryParams.email,
        companyName: this.queryParams.companyName,
        useStateFlag: this.queryParams.useStateFlag,
        responseTypeBlob: true
      };
      this.requestMethodGet("/web/system/permission/userManage/exportUserExcel", paramObj)
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
              let link = document.createElement("a");
              link.style.display = "none";
              link.href = objectUrl;
              link.setAttribute("download", "账号.xls");
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
    //  失败详情列表 size change
    handleSizeChangeFD(size) {
      this.pagenationFD.size = size;
      this.pagenationFD.current = 1;
      this.getFailByPage(); // 获取失败数据
    },
    // current change
    handleCurrentChangeFD(current) {
      this.pagenationFD.current = current;
      this.getFailByPage(); // 获取失败数据
    },
    //  导入历史列表 size change
    handleSizeChangeIH(size) {
      this.pagenationIH.size = size;
      this.pagenationIH.current = 1;
      this.getImportHistoryData();
    },
    // current change
    handleCurrentChangeIH(current) {
      this.pagenationIH.current = current;
      this.getImportHistoryData();
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
@import "../../../assets/css/customTable.less";
.account-management {
  height: 100%;
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
.dialog-transfer .el-dialog__body {
  padding: 20px !important;
}
.dialog-transfer .el-form-item__label {
  font-size: 16px !important;
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
</style>
<style lang="less">
.account-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
}
.deletBtn .el-message-box__message {
  word-break: break-all !important;
}
.el-radio__input.is-checked .el-radio__inner {
  background: #001450 !important;
  border-color: #001450 !important;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #001450 !important;
}
</style>
