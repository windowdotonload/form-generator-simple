<template>
  <div class="right-detail" v-if="checkedNode && checkedNode.id">
    <div class="dept-title">{{ checkedNode.type > 1 ? detailData.deptOrPostName : checkedNode.name }}</div>
    <!-- 部门/岗位详情 -->
    <div style="margin:16px 0" v-if="checkedNode.type == 2 || checkedNode.type == 3">
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="detail-content">
            <div class="detail-title">{{ checkedNode.type == 2 ? "部门负责人" : "管理任务类型" }}</div>
            <div class="detail-value">
              <div v-if="detailData.names && detailData.names.length <= 10">{{ detailData.names }}</div>
              <el-tooltip v-else class="item" effect="dark" :content="detailData.allNames" placement="top">
                <div class="detail-value">{{ detailData.names }}</div>
              </el-tooltip>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="detail-content">
            <div class="detail-title" style="width:65px">{{ checkedNode.type == 2 ? "部门" : "岗位" }}详情</div>
            <div class="detail-value">
              <div v-if="detailData.detail && detailData.detail.length <= 30">{{ detailData.detail }}</div>
              <el-tooltip v-else class="item" effect="dark" :content="detailData.allDetails" placement="top">
                <div class="detail-value">{{ detailData.detail }}</div>
              </el-tooltip>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 部门按钮 -->
    <div class="btn-content" v-if="checkedNode.type == 1 || checkedNode.type == 2">
      <div v-if="checkedNode.type == 2">
        <el-button  type="danger" size="small" plain @click="editDeptUser('dept')" v-if="(dept_edit_user || deptEditDept) && customerDetailInfo.editOrgFlag">
          编辑成员
        </el-button>
        <el-button type="danger" size="small" plain @click="editDept('editDept')" v-if="(dept_edit_dept || deptEditDept) && customerDetailInfo.editOrgFlag">
          编辑部门
        </el-button>
        <el-button
          v-gio.click="clickCreatePostButton"
          type="danger"
          size="small"
          plain
          @click="createPost('createPost')"
          v-if="(createNextDeptOrPostFlag || dept_create_post) && customerDetailInfo.editOrgFlag"
          >创建岗位</el-button
        >
      </div>
      <el-button
        v-if="checkedNode.level < 3 && (createNextDeptOrPostFlag || dept_create_dept) && customerDetailInfo.editOrgFlag"
        :style="checkedNode.type == 1 ? 'margin-top:16px;' : 'margin-left:10px'"
        type="danger"
        size="small"
        plain
        @click="createdNextDept('createDept')"
        >创建下级部门
      </el-button>
      <el-button :style="checkedNode.type == 1 ? 'margin-top:16px;' : 'margin-left:10px'" type="danger" size="small" plain @click="importDeptPerson()">导入岗位&成员 </el-button>
    </div>

    <!-- 本部门岗位列表 -->
    <div style="margin-top:16px" v-if="checkedNode.type == 1 || checkedNode.type == 2">
      <div class="right-content">
        <div class="line"></div>
        <div class="right-title">本部门岗位（{{ deptTotal }}）</div>
      </div>
      <div>
        <el-table :data="postTableList" tooltip-effect="dark" :header-cell-style="{ background: '#f7f7f7' }" @expand-change="expandChange" :row-class-name="getRowClass" stripe key="id">
          <el-table-column prop="postName" label="岗位名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="taskTypeName" label="管理任务类型" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="postDetails" label="岗位详情" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="chargeWorkShop" label="负责车间" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.workShop }}
            </template>
          </el-table-column>
          <el-table-column prop="userCounts" label="岗位人数" width="80px" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="userCounts" type="expand" show-overflow-tooltip class="expand">
            <template slot-scope="props" v-if="props.row.userCounts != 0">
              <!-- 展开在岗人员数据 -->
              <el-table
                class="table-in-table"
                tooltip-effect="dark"
                :header-cell-style="{ background: '#f7f7f7' }"
                :data="props.row.datas"
                max-height="200"
                v-loading="props.row.loading"
                v-el-table-infinite-scroll="loadMorePerson(props.row)"
                style="width: 480px;float: right;margin: 10px 0;"
              >
                <el-table-column prop="userName" label="姓名" show-overflow-tooltip width="140" />
                <el-table-column prop="phoneNumber" label="电话" show-overflow-tooltip width="140" />
                <el-table-column prop="email" label="邮箱" show-overflow-tooltip width="200" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" align="center">
            <template slot-scope="scope">
              <!-- 部门级 -->
              <span
                style="color: #001450; cursor: pointer"
                @click="editPost('editPost', scope.row)"
                v-if="
                  checkedNode.type == 2 &&
                    ((post_edit_post && userInfo.userType != '2') || (scope.row.postEditPost && userInfo.userType == '2')) &&
                    customerDetailInfo.editOrgFlag &&
                    !scope.row.postType
                "
                >编辑岗位</span
              >
              <span
                style="color: #001450; cursor: pointer"
                @click="editWorkshop(scope.row)"
                v-if="
                  ((post_edit_device && userInfo.userType != '2') || (scope.row.postEditDevice && userInfo.userType == '2')) &&
                    customerDetailInfo.editOrgFlag &&
                    checkedNode.type == 2 &&
                    !scope.row.postType
                "
                >编辑负责车间</span
              >
              <!-- 公司级和部门级 -->
              <span
                style="color: #001450; cursor: pointer"
                @click="editPostUser(scope.row, 'post')"
                v-if="((post_edit_user && userInfo.userType != '2') || (scope.row.postEditUser && userInfo.userType == '2')) && customerDetailInfo.editOrgFlag"
                >编辑岗位人员</span
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          background
          @size-change="deptSizeChange"
          @current-change="deptCurrentChange"
          :current-page="deptCurrent"
          :page-size="deptSize"
          :page-sizes="[10, 20, 50, 100, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="deptTotal"
          style="display: flex;justify-content: end;top: 10px;left: 10px;"
        ></el-pagination>
      </div>
    </div>
    <!-- 无岗位人员列表 -->
    <div style="margin-top:16px" v-if="checkedNode.type == 1 || checkedNode.type == 2">
      <div class="right-content">
        <div class="line"></div>
        <div class="right-title">无岗位人员（{{ noPostTotal }}）</div>
      </div>
      <div>
        <el-table :data="noPostTableData" tooltip-effect="dark" :header-cell-style="{ background: '#f7f7f7' }" stripe key="id" ref="noPostTableData">
          <el-table-column prop="userName" label="姓名" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="phonenumber" label="电话" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip> </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          background
          @size-change="noPostSizeChange"
          @current-change="noPostCurrentChange"
          :current-page="noPostCurrent"
          :page-size="noPostSize"
          :page-sizes="[10, 20, 50, 100, 500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="noPostTotal"
          style="display: flex;justify-content: end;top: 10px;left: 10px;"
        ></el-pagination>
      </div>
    </div>

    <!-- 创建下级部门第一步 -->
    <el-dialog
      :title="deptType == 'editDept' ? '编辑部门' : '新建部门'"
      :visible.sync="createDeptStepOne"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :destroy-on-close="true"
      :before-close="cancelChoose"
    >
      <el-form ref="createDeptStepOneForm" :rules="stepOneRules" :model="createDeptStepOneForm" label-width="80px" label-position="top">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="createDeptStepOneForm.deptName" size="small" maxlength="15" placeholder="请输入" style="width:90%" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <div slot="label">
                <span style="color: #F56C6C;">*</span>
                <span>上级部门</span>
              </div>
              <span>{{ deptType == "createDept" ? checkedNode.name : detailData.upDeptName }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="客户创建部门岗位" label-width="120" prop="postIds">
              <div
                v-if="
                  (checkedNode && checkedNode.type == 1 && checkedNode.level == 1 && deptType == 'createDept') ||
                    (checkedNode && checkedNode.type == 2 && checkedNode.level == 1 && deptType == 'editDept')
                "
              >
                <!-- <el-select v-model="createDeptStepOneForm.postIds" @change="createDeptPostChange" multiple clearable placeholder="请选择" size="small" style="width:90%">
                <el-option
                  v-for="item in postList"
                  :key="item.id"
                  :label="item.postName"
                  :disabled="item.disabled"
                  :value="item.id">
                </el-option>
              </el-select> -->
                <el-cascader
                  size="small"
                  :disabled="deptType == 'editDept'"
                  @change="createDeptPostChange"
                  v-model="createDeptStepOneForm.postIds"
                  :options="postList"
                  :props="{ multiple: true, value: 'id', label: 'postName' }"
                  clearable
                ></el-cascader>
              </div>
              <div v-else>
                {{ detailData.deptPostHeadName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门负责人" prop="deptLeaderUserIds">
              <el-select v-model="createDeptStepOneForm.deptLeaderUserIds" @visible-change="createDeptManagerVisible" multiple clearable placeholder="请选择" size="small" style="width:90%">
                <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="部门详情">
              <el-input type="textarea" :rows="3" v-model="createDeptStepOneForm.deptDetail" size="small" maxlength="50" placeholder="请输入" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDept" size="small" plain type="danger" v-if="deptType == 'editDept'">删 除</el-button>
        <el-button @click="cancelChoose('createDeptStepOneForm')" size="small" v-if="deptType == 'createDept'">取 消</el-button>
        <el-button type="danger" size="small" @click="nextStep('createDeptStepOneForm')">下一步</el-button>
      </span>
    </el-dialog>
    <!-- 创建部门第二步 -->
    <el-dialog title="选择车间" :visible.sync="createDeptStepTwo" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelStepTwo">
      <div class="choose-workshop-title">
        <div style="color:#000">部门负责人负责车间</div>
        <div style="color:#dd0000;margin-left:10px">{{ checkedWorkshopList.length }}/{{ workshopTotal }}</div>
      </div>
      <div>
        <el-table
          :data="workshopTableData"
          tooltip-effect="dark"
          ref="workshopTableRef"
          v-loading="loadingWorkshop"
          v-el-table-infinite-scroll="loadMore"
          :row-key="rowKey"
          @select="handleSelectWorkshop"
          @select-all="selectAllWorkshop"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="workShopName" label="车间名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="workShopUser" label="车间管理员" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceCount" label="设备数量" show-overflow-tooltip> </el-table-column>
          <p v-if="loadMoreWorkshopFlag">加载中...</p>
          <p v-if="!loadMoreWorkshopFlag">没有更多了</p>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upStep" size="small">上一步</el-button>
        <el-button type="danger" size="small" @click="confirmChoose">确定</el-button>
      </span>
    </el-dialog>
    <!-- 新建,编辑岗位 -->
    <el-dialog
      :title="postType == 'createPost' ? '新建岗位' : '编辑岗位'"
      :visible.sync="addPostDialog"
      width="30%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="cancelAddPost"
    >
      <el-form ref="addPost" :rules="addPostRules" :model="addPostForm" label-width="80px" label-position="top">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="岗位名称" prop="postName">
              <el-input v-model="addPostForm.postName" size="small" maxlength="15" placeholder="请输入" style="width:90%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <div slot="label">
                <span style="color: #F56C6C;">*</span>
                <span>所属部门</span>
              </div>
              <span>{{ postType == "createPost" ? checkedNode.name : addPostForm.departmentName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="管理任务类型" label-width="120">
              <el-select v-model="addPostForm.taskTypeCode" multiple clearable placeholder="请选择" size="small" style="width:90%">
                <el-option v-for="item in taskTypeList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="岗位详情">
              <el-input type="textarea" :rows="3" v-model="addPostForm.postDetails" size="small" maxlength="50" placeholder="请输入" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" plain size="small" @click="deletePost" v-if="postType == 'editPost'" v-has="PC_Account_deleteposition">删 除</el-button>
        <el-button type="danger" size="small" @click="saveAddPost('addPost')">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 编辑部门，岗位人员弹框 -->
    <el-dialog title="编辑人员" :visible.sync="editUserDialog" width="45%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelEditUser">
      <div class="choose-workshop-title">
        <div style="color:#000">{{ editUserType == "dept" ? "部门人员" : "岗位人员" }}</div>
        <div style="color:#dd0000;margin-left:10px">{{ editUserNum }}</div>
      </div>
      <!-- 滚动加载表格 -->
      <div>
        <el-table
          :data="userTableData"
          tooltip-effect="dark"
          ref="editUserRef"
          v-loading="loadingUser"
          v-el-table-infinite-scroll="loadMoreUser"
          :row-key="userRowKey"
          @select="handleSelectUser"
          @select-all="selectAllUser"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="userName" label="姓名" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="phonenumber" label="电话" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="email" label="邮箱" show-overflow-tooltip> </el-table-column>
          <p v-if="loadMoreUserFlag">加载中...</p>
          <p v-if="!loadMoreUserFlag">没有更多了</p>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="confirmEditUser">确认</el-button>
      </span>
    </el-dialog>
    <!-- 编辑部门,岗位负责的设备(编辑车间) -->
    <el-dialog title="编辑负责车间" :visible.sync="editWorkshopDialog" width="45%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelEditWorkshop">
      <div class="choose-workshop-title">
        <div style="color:#000">岗位负责车间</div>
        <div style="color:#dd0000;margin-left:10px">{{ editWorkshopNum }}/{{ editWorkshopTotal }}</div>
      </div>
      <!-- 滚动加载表格 -->
      <div>
        <el-table
          :data="editWorkshopTableData"
          tooltip-effect="dark"
          ref="editWorkshopTableRef"
          v-loading="loadingWorkshop"
          v-el-table-infinite-scroll="loadMoreWorkshop"
          :row-key="workshopRowKey"
          @select="handleEditSelectWorkshop"
          @select-all="selectEditAllWorkshop"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="workShopName" label="车间名称" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="workShopUser" label="车间管理员" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="deviceCount" label="设备数量" show-overflow-tooltip> </el-table-column>
          <p v-if="loadMoreEditWorkshopFlag">加载中...</p>
          <p v-if="!loadMoreEditWorkshopFlag">没有更多了</p>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="confirmEditWorkshop">确认</el-button>
      </span>
    </el-dialog>
    <!-- 删除岗位提示 -->
    <el-dialog title="确认删除" :visible.sync="delettePostDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelDelete">
      <div>删除岗位后您将无法恢复，是否继续？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelDelete">取 消</el-button>
        <el-button type="danger" size="small" @click="confirmDeletePost">确 认</el-button>
      </span>
    </el-dialog>

    <!-- 导入岗位&成员弹框 -->
    <el-dialog :visible.sync="showImportFileFlag" width="35%" :close-on-click-modal="false">
      <div slot="title">
        <span>岗位&成员批量导入</span>
      </div>
      <el-form :model="fileForm" ref="fileForm" :rules="rules" style="padding: 0px 20px">
        <div v-if="userInfo.userType != '2'" style="color: rgb(221, 0, 0)">当前客户：{{ customerDetailInfo.companyName }}</div>
        <div class="flex-center" style="font-size: 14px; font-family: MicrosoftYaHei; margin-top:25px;text-align: center;">
          <div>第一步： 下载模板，按照模板格式填写</div>
          <el-link type="danger" :underline="false" @click="downloadTemplate" style="color: rgb(0, 20, 80);margin-top:25px;">下载模板（岗位&成员导入模板）</el-link>
        </div>
        <div class="flex-center" style="font-size: 14px; font-family: MicrosoftYaHei; margin-top:25px;text-align: center;">
          <span>第二步： 填写完模板后，上传Excel文件</span>
        </div>
        <el-form-item required style="margin-top: 20px;text-align: center;">
          <el-upload
            class="upload-demo"
            action="uploadUrl"
            :auto-upload="false"
            accept=".xlsx"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="handleFileChange"
            style="text-align: center;"
            :file-list="fileForm.fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUploadFile('fileForm')">取 消</el-button>
        <el-button type="danger" plain @click="submitFile('fileForm')">立即导入</el-button>
      </div>
    </el-dialog>
    <!-- 导入结果 弹框 -->
    <el-dialog title="导入结果" :visible.sync="uploadResultsDialog" :close-on-click-modal="false" width="500px">
      <div style="margin: 0 20px">
        <div>本次导入数据共 {{ importResult.successNums + importResult.failNums }}条</div>
        <div style="color:#70B603;margin-top:20px;">成功 {{ importResult.successNums }} 条</div>
        <div style="color:#ff0000;margin-top:20px;">失败 {{ importResult.failNums }} 条</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeUploadResult()">关闭</el-button>
        <el-button v-if="importResult.failNums != 0" type="danger" @click="handleFailDetail()" size="small">失败详情</el-button>
      </span>
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
          :data="importResult.errorRecordInfos"
          tooltip-effect="dark"
          max-height="500"
          style="width: 100%"
          :header-cell-style="{ background: '#f7f7f7' }"
          stripe
        >
          <el-table-column prop="lineNumber" label="第几行" min-width="15%" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fieldsName" :show-overflow-tooltip="true" label="字段名称" min-width="30%"></el-table-column>
          <el-table-column prop="failureDetails" label="失败详情" min-width="40%" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer" style="margin-top:40px;">
        <el-button @click="closeFailDetail()" size="small">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    nodeObj: {
      type: Object,
      default: () => {
        return {};
      }
    },
    companyId: {
      type: Number,
      default: () => {
        return null;
      }
    },
    companyNumber: {
      type: String,
      default: () => {
        return "";
      }
    },
    customerDetailInfo: {
      type: String
    }
  },
  data() {
    return {
      pageHeight: "",
      // 无岗位
      noPostTableData: [],
      noPostCurrent: 1,
      editObj: {},
      editRow: {}, // 编辑某条岗位的数据
      noPostSize: 10,
      showFailDetailFlag: false, // 失败详情弹框
      noPostTotal: 0,
      deptCurrent: 1,
      deptSize: 10,
      showImportFileFlag: false,
      fileForm: {
        fileList: []
      },
      uploadResultsDialog: false,
      importResult: {
        successNums: 0,
        failNums: 0,
        errorRecordInfos: []
      }, // 导入结果
      postTableList: [],
      deptTotal: 0,
      // 负责设备
      deviceTableData: [],
      deviceCurrent: 1,
      deviceSize: 10,
      deviceTotal: 0,
      // 岗位人员
      postTableData: [],
      postCurrent: 1,
      postSize: 10,
      postTotal: 0,
      // 新建部门
      createDeptStepOne: false,
      createDeptStepOneForm: {
        deptName: "",
        postIds: [],
        deptLeaderUserIds: [],
        deptDetail: ""
      },
      stepOneRules: {
        deptName: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
        postIds: [{ required: true, message: "请选择客户创建部门岗位", trigger: "change" }],
        deptLeaderUserIds: [{ required: true, message: "请选择岗位负责人", trigger: "change" }]
      },
      postList: [],
      userList: [],
      createDeptStepTwo: false,
      // 新建部门-第二步加载车间
      workshopTableData: [],
      checkedWorkshopList: [],
      loadingWorkshop: false,
      workshopCurrent: 1,
      workshopTotal: 0,
      loadMoreWorkshopFlag: false,
      loadingPerson: false,
      engineerTotal: 0,
      currentPerson: 1,
      engineerInfoList: [],
      // 新建岗位
      addPostDialog: false,
      taskTypeList: [],
      addPostForm: {
        postName: "",
        taskTypeCode: [],
        postDetails: ""
      },
      addPostRules: {
        postName: [{ required: true, message: "请输入岗位名称", trigger: "blur" }]
      },
      // 编辑部门，岗位人员
      editUserType: "",
      editUserDialog: false,
      userTableData: [],
      loadingUser: false,
      editUserCurrent: 1,
      editUserSize: 10,
      editUserTotal: 0,
      loadMoreUserFlag: false,
      // 编辑岗位负责的设备(编辑车间)
      editWorkshopDialog: false,
      editWorkshopTableData: [],
      editWorkshopCurrent: 1,
      editWorkshopSize: 10,
      editWorkshopTotal: 0,
      loadMoreEditWorkshopFlag: false,
      existWorkshopList: [],
      editWorkshopNum: 0,
      // 详情
      detailData: {},
      checkedNode: {},
      createDeptResult: {},
      deptType: "",
      createDeptIsConfirmFlag: false,
      postType: "",
      postDetail: {},
      existUserList: [],
      editUserNum: 0,
      userInfo: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))),
      // 删除岗位
      delettePostDialog: false,
      // 按钮权限控制
      dept_edit_user: false,
      dept_edit_dept: false,
      deptEditDept: false,
      dept_create_post: false,
      dept_create_dept: false,
      post_edit_device: false,
      postEditDevice: false,
      post_edit_user: false,
      postEditUser: false,
      post_edit_post: false,
      postEditPost: false,
      createNextDeptOrPostFlag: false,
      deptPostChangeFlag: false
    };
  },
  watch: {
    nodeObj: {
      handler: function(val, oldVal) {
        if (!_.isEmpty(val)) {
          this.checkedNode = val;
          // 查询详情
          if (val.type > 1) {
            this.getDetail(val);
            this.deptCurrent = 1;
            this.deptSize = 10;
            this.getPostData(val, "post");
            console.log("部门吗");
          } else {
            if (val.type == 1 && this.userInfo.userType == 2) {
              // 客户判断公司详情中创建下级部门按钮权限
              this.createNextDeptOrPostFlag = val.createNextLevelDeptFlag;
            }
            this.noPostSize = 10;
            this.noPostCurrent = 1;
            this.getNoPostUserList();
            console.log("公司吗", val);
            this.deptCurrent = 1;
            this.deptSize = 10;
            this.getPostData(val, "company");
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.pageHeight = document.documentElement.clientHeight;
    // 按钮权限
    const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
    for (let i in buttonList) {
      if (buttonList[i].menuCode == "department_member") {
        this.dept_edit_user = true;
      }
      if (buttonList[i].menuCode == "department_edit") {
        this.dept_edit_dept = true;
      }
      if (buttonList[i].menuCode == "department_create_post") {
        this.dept_create_post = true;
      }
      if (buttonList[i].menuCode == "department_create") {
        this.dept_create_dept = true;
      }
      if (buttonList[i].menuCode == "post_equipment") {
        this.post_edit_device = true;
      }
      if (buttonList[i].menuCode == "post_member") {
        this.post_edit_user = true;
      }
      if (buttonList[i].menuCode == "post_edit") {
        this.post_edit_post = true;
      }
    }
    // 获取管理任务类型下拉数据源
    this.getTaskType();
  },
  methods: {
    getTaskType() {
      this.getDicDataList("task_type").then(res => {
        this.taskTypeList = res;
      });
    },
    getRowClass({ row }) {
      if (row.userCounts == 0) {
        return "row-expand-cover";
      } else {
        return "";
      }
    },
    // 展开行
    expandChange(row, expandedRow, expanded) {
      console.log(row, this.postTableList);
      if (row.numbersPosts == 0) {
        return;
      }
      this.getPostUserList(row);
    },
    deptSizeChange(val) {
      console.log(val);
      this.deptSize = val;
      if (this.checkedNode.type == "1") {
        this.getPostData(this.checkedNode, "company");
      } else if (this.checkedNode.type == "2") {
        this.getPostData(this.checkedNode, "post");
      }
    },
    deptCurrentChange(val) {
      this.deptCurrent = val;
      if (this.checkedNode.type == "1") {
        this.getPostData(this.checkedNode, "company");
      } else if (this.checkedNode.type == "2") {
        this.getPostData(this.checkedNode, "post");
      }
    },
    // 根据公司或者部门获取岗位信息
    getPostData(val, type) {
      let param = {
        size: this.deptSize,
        current: this.deptCurrent
      };
      if (type == "company") {
        param.companyId = val.id;
      } else {
        param.deptId = val.id;
      }
      this.requestMethodGet("/web/system/permission/orgPostManage/queryPosts", param)
        .then(res => {
          if (res.data.code == 1000) {
            res.data.data.list.map(item => {
              item.datas = [];
              item.loading = false;
              item.workShop = [];
              if (item.workshops && item.workshops.length > 0) {
                item.workshops.forEach(it => {
                  item.workShop.push(it.name);
                });
              }
              item.workShop = item.workShop.toString();
              if (this.userInfo.userType == 2) {
                const userId = this.userInfo.userId.toString();
                let userIdList = [];
                let ids = "";
                let flag = false;
                if (!_.isEmpty(item.sysUserList)) {
                  item.sysUserList.forEach(it => {
                    userIdList.push(it.userId);
                  });
                }
                ids = userIdList.join(",");
                flag = ids.includes(userId);
                item.postEditUser = flag;
                item.postEditDevice = item.postType > 0 ? false : flag;
                item.postEditPost = item.postType > 0 ? false : flag;
              }
            });
            this.postTableList = res.data.data.list;
            this.deptTotal = res.data.data.totalCount;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(res => {});
    },

    // 详情
    getDetail(val) {
      console.log(val);
      let url = "";
      let params = {};
      if (val.type == 2) {
        // 部门
        url = "/web/system/permission/orgDeptManage/deptDetail";
        params.deptId = val.id;
      } else if (val.type == 3) {
        // 岗位
        url = "/web/system/permission/orgPostManage/getPostById";
        params.postId = val.id;
      } else {
        return;
      }
      this.requestMethodGet(url, params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          if (val.type == 3) {
            // 岗位
            // 编辑设备，岗位权限
            if (this.userInfo.userType == 2) {
              const userId = this.userInfo.userId.toString();
              let userIdList = [];
              let ids = "";
              let flag = false;
              if (!_.isEmpty(data.sysUserList)) {
                data.sysUserList.forEach(it => {
                  userIdList.push(it.userId);
                });
              }
              ids = userIdList.join(",");
              flag = ids.includes(userId);
              this.postEditUser = flag;
              this.postEditDevice = data.postType > 0 ? false : flag;
              this.postEditPost = data.postType > 0 ? false : flag;
            }
            if (data.taskTypeName && data.taskTypeName.length > 10) {
              data.names = data.taskTypeName.slice(0, 10) + "...";
            } else {
              data.names = data.taskTypeName;
            }
            data.allNames = data.taskTypeName;
            if (data.postDetails && data.postDetails.length > 30) {
              data.detail = data.postDetails.slice(0, 30) + "...";
            } else {
              data.detail = data.postDetails;
            }
            data.allDetails = data.postDetails;
            data.deptOrPostName = data.postName;
            this.addPostForm.postName = data.postName;
            this.addPostForm.postDetails = data.postDetails;
            this.addPostForm.taskTypeCode = _.isEmpty(data.taskTypeCode) ? [] : data.taskTypeCode.split(",");
          } else {
            // 部门
            if (this.userInfo.userType == 2) {
              // 客户,新建下级部门，岗位权限
              this.createNextDeptOrPostFlag = data.deptTree.createNextLevelDeptFlag;
              this.deptEditDept = data.deptTree.editFlag;
            }
            let deptChargeUserNames = "";
            if (data.deptTree.deptLeaderUsers && data.deptTree.deptLeaderUsers.length) {
              let userNameList = [];
              data.deptTree.deptLeaderUsers.forEach(it => {
                userNameList.push(it.userName);
              });
              deptChargeUserNames = userNameList.join(",");
            }
            if (deptChargeUserNames && deptChargeUserNames.length > 10) {
              data.names = deptChargeUserNames.slice(0, 10) + "...";
            } else {
              data.names = deptChargeUserNames;
            }
            data.allNames = deptChargeUserNames;
            if (data.deptTree.deptDetails && data.deptTree.deptDetails.length > 30) {
              data.detail = data.deptTree.deptDetails.slice(0, 30) + "...";
            } else {
              data.detail = data.deptTree.deptDetails;
            }
            data.allDetails = data.deptTree.deptDetails;
            data.deptOrPostName = data.deptTree.deptName;
            this.createDeptStepOneForm.postIds = data.upperLevelDept.deptPostId ? data.upperLevelDept.deptPostId.split(",") : [];
            data.upDeptName = data.upperLevelDept.deptName;
            data.deptPostHeadName = data.deptTree.deptPostHeadName;
          }
          this.detailData = data;
          if (val.type > 2) {
          } else {
            // 公司，部门
            // 获取无岗位人员列表
            this.noPostSize = 10;
            this.noPostCurrent = 1;
            this.getNoPostUserList();
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 负责设备
    deviceCurrentChange(val) {
      this.deviceCurrent = val;
      this.getDeviceList();
    },
    deviceSizeChange(val) {
      this.deviceSize = val;
      this.getDeviceList();
    },
    // 岗位-获取设备列表
    getDeviceList() {
      const params = {
        postId: this.detailData.id,
        companyId: this.detailData.companyId,
        size: this.deviceSize,
        current: this.deviceCurrent
      };
      this.requestMethodGet("/web/system/permission/orgPostManage/queryPostDeviceInfoByPage", params).then(res => {
        if (res.data.code == 1000) {
          this.deviceTableData = res.data.data.list;
          this.deviceTotal = res.data.data.totalCount;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 岗位-获取人员列表
    getPostUserList(row, type) {
      console.log(99889);
      if (!type) {
        row.datas = [];
      }
      row.loading = true;
      const params = {
        postId: row.postId,
        size: 10,
        current: this.postCurrent
      };
      this.requestMethodGet("/web/system/permission/orgPostManage/queryPostUserByPage", params).then(res => {
        row.loading = false;
        if (res.data.code == 1000) {
          let datas = row.datas.concat(res.data.data.list);
          row.totalCount = res.data.data.totalCount;
          this.$set(row, "datas", datas);
          console.log(row);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    loadMorePerson(val) {
      if (!val.loading && val.totalCount > val.datas.length) {
        this.postCurrent++;
        this.getPostUserList(val, "scroll");
      }
    },
    // 无岗位人员分页
    noPostSizeChange(val) {
      this.noPostSize = val;
      this.getNoPostUserList();
    },
    noPostCurrentChange(val) {
      this.noPostCurrent = val;
      this.getNoPostUserList();
    },
    // 公司，部门-获取无岗位人员列表
    getNoPostUserList() {
      const params = {
        type: this.checkedNode.type,
        id: this.checkedNode.id,
        size: this.noPostSize,
        current: this.noPostCurrent
      };
      this.requestMethodGet("/web/system/permission/orgSysUserManagae/webUserOfNoDept", params).then(res => {
        if (res.data.code == 1000) {
          this.noPostTableData = res.data.data.list;
          this.noPostTotal = res.data.data.totalCount;
          this.$emit("loadingEnd");
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 创建下级部门
    createdNextDept(type) {
      // 查询创建部门岗位下拉
      this.deptType = type;
      this.getNextDeptData();
      if (type == "editDept") {
        this.getDeptManagerData();
      } else {
        this.createDeptStepOne = true;
        setTimeout(() => {
          this.$refs.createDeptStepOneForm.resetFields();
        }, 100);
      }
    },
    // 导入岗位&成员
    importDeptPerson() {
      this.showImportFileFlag = true;
      this.fileForm.fileList = [];
    },
    closeUploadResult() {
      this.uploadResultsDialog = false;
    },
    // 失败详情
    handleFailDetail() {
      this.showFailDetailFlag = true;
    },
    // 失败详情的关闭按钮
    closeFailDetail() {
      this.showFailDetailFlag = false;
    },
    // 下载表格模板
    downloadTemplate() {
      const params = {
        url: "org/user/template/userAndPost.xlsx"
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
    cancelUploadFile() {
      this.showImportFileFlag = false;
      this.fileForm.fileList = [];
    },
    // 导入表格 点击  确认上传
    submitFile(formName) {
      console.log(this.checkedNode);
      if (this.fileForm.fileList.length === 0) {
        this.$message.error("请上传文件");
      } else {
        this.isloading = true;
        var params = new FormData();
        params.append("multipartFile", this.fileRom);
        params.append("companyId", this.companyId);
        if (this.checkedNode.type == "2") {
          params.append("deptId", this.checkedNode.id);
        }
        this.requestMethodPost("/web/system/permission/orgSysUserManagae/importUserAndPost", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              // 导入成功
              this.isloading = false;
              this.importResult = res.data;
              this.uploadResultsDialog = true;
              this.showImportFileFlag = false;

              if (this.checkedNode.type == "1") {
                this.getPostData(this.checkedNode, "company");
              } else if (this.checkedNode.type == "2") {
                this.getPostData(this.checkedNode, "post");
                this.getDetail(this.checkedNode);
              }
              this.fileForm.fileList = [];
              // 获取无岗位人员列表
              this.noPostSize = 10;
              this.noPostCurrent = 1;
              this.getNoPostUserList();
            } else {
              this.isloading = false;
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
            this.$gio.Importpostmember();
          })
          .catch(res => {});
      }
    },
    getNextDeptData() {
      const params = {
        companyId: this.companyId
      };
      this.requestMethodGet("/web/system/permission/orgPostManage/queryCreateDeptPosts", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          if (data.length) {
            data.forEach(item => {
              item.disabled = false;
              item.children = undefined;
            });
          }
          if (this.createDeptStepOneForm.postIds.length && data.length) {
            this.createDeptStepOneForm.postIds.forEach(it => {
              data.forEach(item => {
                if (it == item.id) {
                  item.disabled = true;
                }
              });
            });
          }
          this.postList = data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    createDeptPostChange() {
      this.deptPostChangeFlag = true;
      this.createDeptStepOneForm.deptLeaderUserIds = [];
    },
    // 新建部门-打开部门负责人下拉
    createDeptManagerVisible(val) {
      if (val) {
        if (this.checkedNode.type > 1) {
          if (!this.deptPostChangeFlag) {
            this.createDeptStepOneForm.postIds = this.handlePostId();
          }
        }
        this.$refs.createDeptStepOneForm.validateField(["postIds"], err => {
          if (!err) {
            this.getDeptManagerData();
          }
        });
      }
    },
    handlePostId() {
      const data = this.detailData.deptTree.deptPostId;
      let list = data
        ? data.split(",").map(it => {
            return Number(it);
          })
        : [];
      return list;
    },
    // 查询部门负责人下拉
    getDeptManagerData() {
      const params = {
        level: this.deptType == "editDept" ? this.checkedNode.level : this.checkedNode.type == 1 ? 1 : this.checkedNode.level + 1,
        parentDeptId: this.checkedNode.id,
        current: 1,
        size: 500
      };
      if (this.userInfo.userType != 2) {
        params.companyNumber = this.companyNumber;
      }
      params.createDeptPostIds = this.deptPostChangeFlag ? _.flatten(this.createDeptStepOneForm.postIds) : this.handlePostId();
      this.requestMethodPost("/web/system/permission/orgSysUserManagae/userOfPostsByPage", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data.list;
          this.userList = data;
          if (this.deptType == "editDept") {
            const data = this.detailData.deptTree;
            if (!this.deptPostChangeFlag) {
              this.createDeptStepOneForm.deptLeaderUserIds = _.isEmpty(data.deptLeaderUsers) ? [] : data.deptLeaderUsers.map(it => it.userId);
            }
            this.createDeptStepOne = true;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 下一步
    nextStep(formName) {
      if (this.checkedNode.type > 1) {
        if (!this.deptPostChangeFlag) {
          this.createDeptStepOneForm.postIds = this.handlePostId();
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 先进行保存表单再查询车间列表
          const params = Object.assign({}, this.createDeptStepOneForm);
          params.companyId = this.companyId;
          params.postIds = _.flatten(params.postIds);
          params.level = this.checkedNode.type == 1 ? 1 : this.checkedNode.level + 1;
          params.parentDeptId = this.checkedNode.type == 1 ? 0 : this.checkedNode.id;
          if (this.deptType == "editDept") {
            // 编辑
            params.deptId = this.detailData.deptTree.id;
          }
          const url = this.deptType == "editDept" ? "/web/system/permission/orgDeptManage/update" : "/web/system/permission/orgDeptManage/create";
          this.requestMethodPost(url, params).then(res => {
            if (res.data.code == 1000) {
              // 查询车间列表
              if (this.deptType == "createDept") {
                this.createDeptResult = res.data.data;
              }
              this.getCreateDeptWorkshopList("refresh");
              this.createDeptStepTwo = true;
              // 刷新岗位列表
              this.getPostData(this.checkedNode, "post");
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 创建部门获取车间列表
    getCreateDeptWorkshopList(flag) {
      let deptHeadFlag;
      if (this.deptType == "createDept") {
        // 新建
        deptHeadFlag = this.checkedNode.type == 1 ? 0 : 1;
      } else {
        // 编辑
        deptHeadFlag = this.checkedNode.level == 1 ? 0 : 1;
      }
      const params = {
        current: 1,
        size: 500,
        companyId: this.companyId,
        flagDeptHead: deptHeadFlag,
        id: this.deptType == "createDept" ? this.createDeptResult.deptHeadPostId : this.detailData.deptTree.deptPostHeadId,
        postIdList: this.deptType == "createDept" ? this.createDeptResult.upLevelDeptHeadPostIds : _.flatten(this.createDeptStepOneForm.postIds).join(",")
      };
      this.loadingWorkshop = true;
      this.requestMethodGet("/web/system/permission/orgPostManage/queryPostWorkshopList", params)
        .then(res => {
          if (res.data.code == 1000) {
            const checkWorkShopList = res.data.data.checkWorkShopList;
            const list = res.data.data.list;
            let workshopList = [];
            if (flag) {
              workshopList = list;
            } else {
              workshopList = this.workshopTableData.concat(list);
            }
            if (this.workshopCurrent <= 1) {
              workshopList = workshopList.concat(checkWorkShopList);
            }

            this.workshopTableData = _.uniqBy(workshopList, "workShopId");
            this.workshopTotal = this.workshopTableData.length;
            // 已有的反显勾选
            if (checkWorkShopList.length && this.workshopTableData.length) {
              this.$nextTick(() => {
                for (let i = 0; i < checkWorkShopList.length; i++) {
                  for (let j = 0; j < this.workshopTableData.length; j++) {
                    if (checkWorkShopList[i].workShopId == this.workshopTableData[j].workShopId) {
                      this.$refs.workshopTableRef.toggleRowSelection(this.workshopTableData[j], true);
                    }
                  }
                }
              });
            }
            this.checkedWorkshopList = res.data.data.checkWorkShopList;
            this.loadingWorkshop = false;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.loadingWorkshop = false;
        });
    },
    // 加载更多车间
    loadMore() {},
    rowKey(row) {
      return row.id;
    },
    // 选择车间
    handleSelectWorkshop(list) {
      this.checkedWorkshopList = list;
    },
    // 全选车间
    selectAllWorkshop(list) {
      this.checkedWorkshopList = list;
    },
    // 编辑部门
    editDept(type) {
      this.deptType = type;
      this.requestMethodGet("/web/system/permission/orgDeptManage/deptDetail", { deptId: this.checkedNode.id }).then(res => {
        if (res.data.code == 1000) {
          // 刷新岗位列表
          this.getPostData(this.checkedNode, "post");
          const data = this.detailData.deptTree;
          this.createDeptStepOneForm.deptName = data.deptName;
          this.createDeptStepOneForm.deptDetail = data.deptDetails;
          this.createDeptStepOneForm.postIds = data.deptPostId
            ? data.deptPostId.split(",").map(it => {
                return Number(it);
              })
            : [];
          this.createDeptStepOneForm.deptLeaderUserIds = _.isEmpty(data.deptLeaderUsers) ? [] : data.deptLeaderUsers.map(it => it.userId);
        
          
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
      this.createdNextDept(type);
    },
    // 编辑部门人员
    editDeptUser(type) {
      console.log(this.checkedNode);
      this.editUserType = type;
      // 先查询已有人员在查询所有人员
      this.existUserList = [];
      const params = {
        createDeptPostIds: this.detailData.deptTree.deptPostId.split(",").map(it => {
          return Number(it);
        }),
        level: this.checkedNode.level,
        deptId: this.detailData.deptTree.id,
        current: 1,
        size: 500
      };
      this.requestMethodPost("/web/system/permission/orgSysUserManagae/existUserOfPostsByPage", params).then(res => {
        if (res.data.code == 1000) {
          this.existUserList = res.data.data.list;
          this.editUserNum = this.existUserList.length;
          this.getEditDeptUser(params);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
      
    },
    getEditDeptUser(params) {
      if (this.detailData.deptTree.level > 1) {
        params.parentDeptId = this.detailData.upperLevelDept.id;
      }
      if (this.userInfo.userType < 2) {
        params.companyNumber = this.detailData.upperLevelDept.companyNumber;
      }
      this.requestMethodPost("/web/system/permission/orgSysUserManagae/userOfPostsByPage", params).then(res => {
        if (res.data.code == 1000) {
          this.userTableData = res.data.data.list;
          this.editUserTotal = res.data.data.totalCount;
          if (this.existUserList.length && this.userTableData.length) {
            this.$nextTick(() => {
              for (let i = 0; i < this.existUserList.length; i++) {
                for (let j = 0; j < this.userTableData.length; j++) {
                  if (this.existUserList[i].userId == this.userTableData[j].userId) {
                    this.$refs.editUserRef.toggleRowSelection(this.userTableData[j], true);
                  }
                }
              }
            });
          }
          this.editUserDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑岗位人员
    editPostUser(row,type) {
      this.$gio.clickEditPostMember();
      console.log(row)
      this.editObj = row
      this.editUserType = type;
      this.existUserList = [];
      const params = {
        postId: row.postId,
        companyId: this.companyId, // 2
        postType: row.postType,
        current: 1,
        size: 500
      };
      if (this.checkedNode.type == "2") {
        params.deptId = this.checkedNode.id;
      }
      this.requestMethodGet("/web/system/permission/orgPostManage/selectPostUserByPage", params).then(res => {
        if (res.data.code == 1000) {
          this.existUserList = res.data.data.checkUserList;
          this.editUserNum = this.existUserList.length;
          const data = res.data.data.list;
          if (data.length) {
            data.forEach(it => {
              it.phonenumber = it.phoneNumber;
            });
          }
          this.userTableData = data;
          this.editUserTotal = res.data.data.totalCount;
          if (this.existUserList.length && this.userTableData.length) {
            this.$nextTick(() => {
              for (let i = 0; i < this.existUserList.length; i++) {
                for (let j = 0; j < this.userTableData.length; j++) {
                  if (this.existUserList[i].userId == this.userTableData[j].userId) {
                    this.$refs.editUserRef.toggleRowSelection(this.userTableData[j], true);
                  }
                }
              }
            });
          }
          this.editUserDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });

    },
    userRowKey(row) {
      return row.id;
    },
    // 加载更多人员
    loadMoreUser() {},
    // 选择人员
    handleSelectUser(list) {
      this.editUserNum = list ? list.length : 0;
    },
    // 全选人员
    selectAllUser(list) {
      this.editUserNum = list ? list.length : 0;
    },
    // 确认选择人员
    confirmEditUser() {
      const checkUser = this.$refs.editUserRef.selection;
      if (this.editUserType == "dept") {
        // 部门
        this.handleSaveDeptUser(checkUser);
      } else {
        // 岗位
        this.handleSavePostUser(checkUser);
      }
      this.$gio.submitEditPostMember();
    },
    handleSaveDeptUser(checkUser) {
      let addUser = [];
      let deleteUser = [];
      let exitUserIds = [];
      let checkedUserIds = [];
      if (this.existUserList.length) {
        exitUserIds = this.existUserList.map(it => it.userId.toString());
      }
      if (checkUser.length) {
        addUser = checkUser.filter(it => {
          return !exitUserIds.includes(it.userId.toString());
        });
        checkedUserIds = checkUser.map(it => it.userId.toString());
      }
      if (this.existUserList.length && checkUser.length) {
        deleteUser = this.existUserList.filter(item => {
          return !checkedUserIds.includes(item.userId.toString());
        });
      }
      if (!checkUser.length && this.existUserList.length) {
        deleteUser = this.existUserList;
      }
      if (deleteUser.length) {
        this.$confirm("您将在您管理的部门和岗位删除该人员，请确认！", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.saveDeptUser(addUser, deleteUser);
          })
          .catch(() => {});
      } else {
        this.saveDeptUser(addUser, deleteUser);
      }
    },
    saveDeptUser(addUser, deleteUser) {
      const params = {
        deptId: this.detailData.deptTree.id,
        addDeptUserDtoList: addUser.map(item => ({ userId: item.userId, deptId: item.deptId })),
        deleteDeptUserDtoList: deleteUser.map(item => ({ userId: item.userId, deptId: item.deptId }))
      };
      this.requestMethodPost("/web/system/permission/orgDeptManage/user/update", params).then(res => {
        if (res.data.code == 1000) {
          // 刷新表格
          this.$emit("refreshTree");
          this.noPostSize = 10;
          this.noPostCurrent = 1;
          this.getNoPostUserList();
          this.editUserDialog = false;
          if (this.checkedNode.type == "1") {
            this.getPostData(this.checkedNode, "company");
          } else if (this.checkedNode.type == "2") {
            this.getPostData(this.checkedNode, "post");
          }
          this.$message({
            type: "success",
            message: "保存成功"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    handleSavePostUser(checkUser) {
      console.log(this.checkedNode);
      // 校验选择的人
      const params = {
        postId: this.editObj.postId,
        postType: this.editObj.postType,
        userIdList: _.isEmpty(checkUser) ? [] : checkUser.map(it => it.userId)
      };
      this.requestMethodPost("/web/system/permission/orgPostManage/addPostUserCheck", params).then(res => {
        if (res.data.code == 1000) {
          this.savePostUser(params);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    savePostUser(params) {
      console.log(this.checkedNode);
      params.companyId = this.companyId; // 2
      params.deptId = this.checkedNode.id;
      params.postId = this.editObj.postId;
      this.requestMethodPost("/web/system/permission/orgPostManage/addBatchPostUserRel", params).then(res => {
        if (res.data.code == 1000) {
          this.$emit("refreshTree");
          this.editUserDialog = false;
          if (this.checkedNode.type == "1") {
            this.getPostData(this.checkedNode, "company");
          } else if (this.checkedNode.type == "2") {
            this.getPostData(this.checkedNode, "post");
          }

          this.getDetail(this.checkedNode);
          //
          this.$message({
            type: "success",
            message: "保存成功"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 取消
    cancelChoose(formName) {
      // 新建如果不选择第二步确定要删除部门
      if (this.deptType == "createDept" && !_.isEmpty(this.createDeptResult)) {
        this.handleDeleteDept();
      }
      this.createDeptStepOne = false;
      this.deptPostChangeFlag = false;
      this.createDeptStepOneForm.deptName = "";
      this.createDeptStepOneForm.deptDetail = "";
      this.createDeptStepOneForm.postIds = [];
      this.createDeptStepOneForm.deptLeaderUserIds = [];
    },
    handleDeleteDept() {
      const params = {
        deptId: this.createDeptResult.deptId,
        force: true
      };
      this.requestMethodGet("/web/system/permission/orgDeptManage/delete", params).then(res => {
        if (res.data.code == 1000) {
          this.$emit("refreshTree");
          this.createDeptStepOne = false;
          this.createDeptResult = {};
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 删除部门
    deleteDept() {
      this.$confirm("删除部门后您将无法恢复，是否继续？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            deptId: this.detailData.deptTree.id,
            force: false
          };
          this.requestMethodGet("/web/system/permission/orgDeptManage/delete", params).then(res => {
            if (res.data.code == 1000) {
              this.$emit("refreshTree");
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.createDeptStepOne = false;
              this.checkedNode = {};
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        })
        .catch(() => {});
    },
    // 上一步
    upStep() {
      // 如果是创建部门，先删除已创建的部门
      if (this.deptType == "createDept") {
        const params = {
          deptId: this.createDeptResult.deptId,
          force: true
        };
        this.requestMethodGet("/web/system/permission/orgDeptManage/delete", params).then(res => {
          if (res.data.code == 1000) {
            this.$emit("refreshTree");
            this.deptPostChangeFlag = false;
            this.createDeptResult = {};
            this.$refs.workshopTableRef.clearSelection();
            this.createDeptStepTwo = false;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      } else {
        // 清空选择的车间
        this.$refs.workshopTableRef.clearSelection();
        this.createDeptStepTwo = false;
      }
    },
    // 关闭第二步弹框
    cancelStepTwo() {
      // 新建关闭，删除创建的部门并关闭弹框，编辑关闭，关闭两个弹框
      if (this.deptType == "createDept") {
        this.handleDeleteDept();
        this.deptPostChangeFlag = false;
      }
      this.$refs.workshopTableRef.clearSelection();
      this.createDeptStepOne = false;
      this.createDeptStepTwo = false;
    },
    // 新建/编辑部门确定
    confirmChoose() {
      const list = this.$refs.workshopTableRef.selection;
      const params = {
        companyId: this.companyId,
        postId: this.deptType == "createDept" ? this.createDeptResult.deptHeadPostId : this.detailData.deptTree.deptPostHeadId,
        workShopDeviceIdList: list,
        deptId: this.checkedNode.id
      };
      this.requestMethodPost("/web/system/permission/orgPostManage/addBatchWorkShopPostRel", params).then(res => {
        if (res.data.code == 1000) {
          this.createDeptResult = {};
          this.$emit("loadingEnd");
          this.$emit("refreshTree");
          this.cancelChoose("createDeptStepOneForm");
          // 刷新部门详情和无岗位人员列表web/system/permission/orgPostManage/addBatchPostUserRel
          console.log(this.checkedNode);
          if (this.checkedNode.type != "1") {
            this.getDetail(this.checkedNode);
          }

          if (this.checkedNode.type == "1") {
            this.getPostData(this.checkedNode, "company");
          } else if (this.checkedNode.type == "2") {
            this.getPostData(this.checkedNode, "post");
          }
          this.getNoPostUserList();
          this.createDeptStepTwo = false;
          this.$refs.workshopTableRef.clearSelection();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 新建岗位
    createPost(type) {
      this.resetAddPost();
      this.postType = type;
      this.addPostDialog = true;
    },
    cancelAddPost() {
      this.resetAddPost();
      this.addPostDialog = false;
    },
    resetAddPost() {
      this.addPostForm.postName = "";
      this.addPostForm.postDetails = "";
      this.addPostForm.taskTypeCode = [];
    },
    // 新建/编辑岗位-保存
    saveAddPost(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          let url = "";
          if (this.postType == "editPost") {
            // 编辑
            params = this.addPostForm;
            params.taskTypeCode = params.taskTypeCode.length > 0 ? params.taskTypeCode.toString() : "";
            url = "/web/system/permission/orgPostManage/updatePost";
          } else {
            params.companyId = this.companyId;
            params.deptId = this.detailData.deptTree.id;
            params.postName = this.addPostForm.postName;
            params.postDetails = this.addPostForm.postDetails;
            params.taskTypeCode = this.addPostForm.taskTypeCode.length > 0 ? this.addPostForm.taskTypeCode.toString() : "";
            url = "/web/system/permission/orgPostManage/addPost";
            this.$gio.submitCreatePost()
          }
          this.requestMethodPost(url, params).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              this.cancelAddPost();
              this.$emit("loadingEnd");
              // this.$emit("refreshTree");
              if (this.postType == "editPost") {
                this.getDetail(this.checkedNode, "post");
                this.getPostData(this.checkedNode, "post");
              }
              if (this.checkedNode.type == "1") {
                this.getPostData(this.checkedNode, "company");
              } else if (this.checkedNode.type == "2") {
                this.getPostData(this.checkedNode, "post");
              }
              this.$gio.submitCreatePost();
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    // 编辑岗位
    editPost(type, row) {
      this.postType = type;
      this.editRow = row;
      // 查询岗位详情
      this.requestMethodGet("/web/system/permission/orgPostManage/getPostById", { postId: row.postId }).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          data.taskTypeCode = _.isEmpty(data.taskTypeCode) ? [] : data.taskTypeCode.split(",");
          this.addPostForm = data;
          this.addPostDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 删除岗位
    deletePost() {
      console.log(this.editRow);
      const params = {
        id: this.editRow.id,
        deptId: this.detailData.deptId
      };
      this.requestMethodPost("/web/system/permission/orgPostManage/delPostCheck", params).then(res => {
        if (res.data.code == 1000) {
          this.delettePostDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 取消删除
    cancelDelete() {
      this.delettePostDialog = false;
    },
    // 确定删除
    confirmDeletePost() {
      const params = {
        id: this.editRow.id
      };
      this.requestMethodPost("/web/system/permission/orgPostManage/delPost", params).then(res => {
        if (res.data.code == 1000) {
          this.delettePostDialog = false;
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.addPostDialog = false;
          if (this.checkedNode.type == "1") {
            this.getPostData(this.checkedNode, "company");
          } else if (this.checkedNode.type == "2") {
            this.getPostData(this.checkedNode, "post");
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 编辑负责的设备 即车间
    editWorkshop(row) {
      console.log(this.checkedNode, row);
      this.editRow = row;
      const params = {
        deptId: this.checkedNode.id, // 部门id
        id: row.postId, // 岗位id
        companyId: this.companyId,
        flagDeptHead: 1,
        current: 1,
        size: 500
      };
      this.requestMethodGet("/web/system/permission/orgPostManage/queryPostWorkshopList", params).then(res => {
        if (res.data.code == 1000) {
          this.existWorkshopList = res.data.data.checkWorkShopList;
          this.editWorkshopNum = this.existWorkshopList.length;
          this.editWorkshopTableData = res.data.data.list;
          console.log(this.existWorkshopList, this.editWorkshopTableData);
          this.editWorkshopTotal = res.data.data.totalCount;
          if (this.existWorkshopList.length && this.editWorkshopTableData.length) {
            this.$nextTick(() => {
              for (let i = 0; i < this.existWorkshopList.length; i++) {
                for (let j = 0; j < this.editWorkshopTableData.length; j++) {
                  if (this.existWorkshopList[i].workShopId == this.editWorkshopTableData[j].workShopId) {
                    this.$refs.editWorkshopTableRef.toggleRowSelection(this.editWorkshopTableData[j], true);
                  }
                }
              }
            });
          }
          this.editWorkshopDialog = true;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    workshopRowKey(row) {
      return row.id;
    },
    cancelEditWorkshop() {
      this.editWorkshopDialog = false;
    },
    // 加载更多车间
    loadMoreWorkshop() {},
    // 选择车间
    handleEditSelectWorkshop(list) {
      this.editWorkshopNum = list.length;
    },
    // 全选车间
    selectEditAllWorkshop(list) {
      this.editWorkshopNum = list.length;
    },
    // 选择车间确定
    confirmEditWorkshop() {
      const checkedWorkshop = this.$refs.editWorkshopTableRef.selection;
      const params = {
        companyId: this.companyId,
        postId: this.editRow.postId,
        workShopDeviceIdList: checkedWorkshop
      };
      this.requestMethodPost("/web/system/permission/orgPostManage/addBatchWorkShopPostRel", params).then(res => {
        if (res.data.code == 1000) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.deviceSize = 10;
          this.deviceCurrent = 1;
          this.getDeviceList();
          this.getPostData(this.checkedNode, "post");
          this.editWorkshopDialog = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.dept-title {
  font-size: 16px;
  line-height: 16px;
  color: #000;
  font-weight: 700;
}
// /deep/ .el-icon-arrow-right:before {
//   content: '展开';
// }

.detail-content {
  display: flex;
}
.detail-title {
  font-size: 13px;
  line-height: 13px;
  font-weight: 400;
  color: #999;
}
.detail-value {
  color: #333;
  font-size: 13px;
  line-height: 13px;
  font-weight: 400;
  margin-left: 16px;
}
.btn-content {
  display: flex;
}
.right-content {
  display: flex;
  align-items: center;
  font-size: 14px;
  height: 30px;
  margin-bottom: 20px;
}
.line {
  width: 4px;
  height: 14px;
  background-color: #dd0000;
}
.right-title {
  line-height: 30px;
  color: #000;
  margin-left: 10px;
  font-weight: bold;
}
/deep/.el-pagination {
  position: relative;
}
/deep/ .el-table__expanded-cell {
  position: relative;
  right: 0px;
  padding: 0px 0px;
}
/deep/ .expand .el-table__body,
.el-table__footer,
.el-table__header {
  float: right;
  width: 480px;
}
/deep/ .expand .el-table__empty-block {
  width: 200px;
  position: absolute;
  right: 10%;
}
/deep/ .el-table__expanded-cell .el-table .table-in-table .el-table--fit .el-table--enable-row-hover {
  float: right;
  height: 260px;
  width: 480px;
}

/* 隐藏无子设备的展开图表 */
/deep/ .el-table .row-expand-cover .cell .el-table__expand-icon {
  display: none;
}
.choose-workshop-title {
  display: flex;
  font-size: 14px;
  line-height: 14px;
  font-weight: 700;
  margin-bottom: 20px;
}
</style>
