<template>
  <div class="team-main">
    <div v-if="$userInfo.userType == 0 || $userInfo.userType == 1">
      <TeamMember @get-height="getTableHeight" />
    </div>
    <div v-if="$userInfo.userType == 2">
      <el-tabs v-model="currentTab" style="margin-top: 20px">
        <el-tab-pane label="团队成员" name="companyMember">
          <TeamMember @get-height="getTableHeight" />
        </el-tab-pane>
        <el-tab-pane label="岗位" name="companyPosition">
          <el-button v-has="PC_Account_createposition" size="mini" type="danger" style="margin-bottom:5px;float:right" @click="editPost('createPost')">新建岗位</el-button>
          <custom-table class="table" :tableHeader="positionTableDataHeader" :tableData="companyPostList" :tableHeight="tableHeight + ''" :loading="loading">
            <template v-slot:operation>
              <el-table-column label="操作" width="300" show-overflow-tooltip>
                <template v-slot="scope">
                  <el-button type="text" @click="editPost('editPost', scope.row)" v-has="PC_Account_editposition">编辑</el-button>
                  <el-button type="text" @click="editMember(scope.row)" v-has="PC_Account_deleteposition">编辑岗位人员</el-button>
                </template>
              </el-table-column>
            </template>
          </custom-table>
          <el-pagination
            background
            @size-change="handleNormalSizeChange($event, 'post')"
            @current-change="handleNormalCurrentChange($event, 'post')"
            :current-page="postListPage.current"
            :page-size="postListPage.size"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="postListTotal"
            style="float: right; display: flex; margin-top: 10px"
          ></el-pagination>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      width="30%"
      :title="postType == 'createPost' ? '新建岗位' : '编辑岗位'"
      :visible.sync="addPostDialog"
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
        <el-button type="danger" plain size="small" @click="deletePost" v-if="postType == 'editPost'">删 除</el-button>
        <el-button type="danger" size="small" @click="saveAddPost">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑人员" :visible.sync="editUserDialog" width="45%" :close-on-click-modal="false" :close-on-press-escape="false" @close="cancelEditUser">
      <div class="choose-workshop-title">
        <span style="color:#000;font-size:16px;font-weight:bolder;">岗位人员</span>
        <span style="color:#dd0000;margin-left:10px;font-size:16px;font-weight:bolder;">{{ editUserNum }}</span>
      </div>
      <!-- 滚动加载表格 -->
      <div>
        <el-table
          row-key="id"
          height="400"
          :data="companyMemberList"
          tooltip-effect="dark"
          ref="editUserRef"
          v-loading="loadingUser"
          v-el-table-infinite-scroll="loadMoreCompanyMemer"
          @select="handleSelectUser"
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
    <!-- 删除岗位提示 -->
    <el-dialog title="确认删除" :visible.sync="deletePostDialog" width="30%" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="cancelDelete">
      <div>删除岗位后您将无法恢复，是否继续？</div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelDelete">取 消</el-button>
        <el-button type="danger" size="small" @click="confirmDeletePost">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import customTable from "../tableComponents/customTable";
import TeamMember from "./components/teamMember.vue";
export default {
  created() {
    this.getUserListOfOrg();
    this.getQueryPostList();
    this.getTaskType();
  },
  components: {
    TeamMember,
    "custom-table": customTable
  },
  data() {
    return {
      currentTab: "companyMember",
      tableHeight: "",
      memberTableDataHeader: [
        { label: "姓名", prop: "userName", width: "150", tooltip: true },
        { label: "岗位", prop: "postNames", width: "200", tooltip: true },
        { label: "联系电话", prop: "phonenumber", width: "200", tooltip: true },
        { label: "邮箱", prop: "email", width: "200", tooltip: true }
      ],
      positionTableDataHeader: [
        { label: "岗位", prop: "postName", width: "150", tooltip: true },
        { label: "岗位详情", prop: "postDetails", width: "200", tooltip: true },
        { label: "管理任务类型", prop: "taskTypeName", width: "200", tooltip: true },
        { label: "岗位人数", prop: "userCounts", width: "200", tooltip: true },
        { slot: "operation" }
      ],
      loadingUser: false,
      editUserDialog: false,
      editUserNum: "",
      deletePostDialog: false,
      addPostForm: {
        postName: "",
        taskTypeCode: [],
        postDetails: ""
      },
      existUserList: [],
      addPostRules: {
        postName: [{ required: true, message: "请输入岗位名称", trigger: "blur" }]
      },
      postType: "",
      addPostDialog: false,
      companyMemberList: [],
      companyPostList: [],
      taskTypeList: [],
      companyMemberTotal: 0,
      postListTotal: 0,
      userListPage: {
        current: 1,
        size: 10
      },
      postListPage: {
        current: 1,
        size: 10
      }
    };
  },
  methods: {
    getTableHeight(val) {
      this.tableHeight = val;
    },
    handleNormalSizeChange(event, type) {
      if (type == "post") {
        this.postListPage.size = event;
        this.getQueryPostList();
      } else {
        this.userListPage.size = event;
        this.getUserListOfOrg();
      }
    },
    handleNormalCurrentChange(event, type) {
      if (type == "post") {
        this.postListPage.current = event;
        this.getQueryPostList();
      } else {
        this.userListPage.current = event;
        this.getUserListOfOrg();
      }
    },
    saveAddPost() {
      this.$refs.addPost.validate(valid => {
        if (valid) {
          let params = {};
          let url = "";
          if (this.postType == "editPost") {
            // 编辑
            params = this.addPostForm;
            params.taskTypeCode = params.taskTypeCode.length > 0 ? params.taskTypeCode.toString() : "";
            url = "/web/system/permission/orgPostManage/updatePost";
          } else {
            params.companyId = this.$userInfo.orgInfo.companyId;
            params.postName = this.addPostForm.postName;
            params.postDetails = this.addPostForm.postDetails;
            params.taskTypeCode = this.addPostForm.taskTypeCode.length > 0 ? this.addPostForm.taskTypeCode.toString() : "";
            url = "/web/system/permission/orgPostManage/addPost";
            this.$gio.submitCreatePost();
          }
          this.requestMethodPost(url, params).then(res => {
            if (res.data.code == 1000) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              this.cancelAddPost();
              this.$emit("loadingEnd");
              this.refreshPostList();
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
    deletePost() {
      const params = {
        id: this.editRow.id
      };
      this.requestMethodPost("/web/system/permission/orgPostManage/delPostCheck", params).then(res => {
        if (res.data.code == 1000) {
          this.deletePostDialog = true;
        } else {
          this.$message({
            type: "warning",
            message: res.data.msg
          });
        }
      });
    },
    cancelDelete() {
      this.deletePostDialog = false;
    },
    confirmDeletePost() {
      const params = {
        id: this.editRow.id
      };
      this.requestMethodPost("/web/system/permission/orgPostManage/delPost", params).then(res => {
        if (res.data.code == 1000) {
          this.deletePostDialog = false;
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.cancelAddPost();
          this.$emit("loadingEnd");
          this.refreshPostList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getTaskType() {
      this.getDicDataList("task_type").then(res => {
        this.taskTypeList = res;
      });
    },
    editPost(type, rowInfo) {
      this.postType = type;
      if (rowInfo) {
        this.editRow = rowInfo;
        this.addPostForm = {
          postName: rowInfo.postName,
          taskTypeCode: rowInfo.taskTypeCode ? rowInfo.taskTypeCode.split(",") : "",
          postDetails: rowInfo.postDetails
        };
        this.addPostForm.id = rowInfo.id;
      }
      this.addPostDialog = true;
    },
    cancelEditUser() {
      this.existUserList = [];
      this.editUserDialog = false;
    },
    assignMemberList() {
      this.loadingUser = true;
      const existUserIds = this.existUserList.map(item => item.userId);
      this.$nextTick(() => {
        this.companyMemberList.forEach(item => {
          if (existUserIds.includes(item.userId)) {
            this.$refs.editUserRef.toggleRowSelection(item, true);
          }
        });
        this.loadingUser = false;
      });
    },
    async loadMoreCompanyMemer() {
      if (this.companyMemberList.length >= this.companyMemberTotal) return;
      this.loadingUser = true;
      this.userListPage.current++;
      const res = await this.requestMethodGetTip("/web/system/permission/userManage/listByPage", {
        orgId: this.$route.query.companyId,
        ...this.userListPage,
        menuCode: "MyTeam"
      });
      this.companyMemberList = this.companyMemberList.concat(res.data.data.list);
      this.assignMemberList();
      this.loadingUser = false;
    },
    editMember(row) {
      this.editMemberItem = row;
      this.editUserType = "post";
      this.existUserList = [];
      const params = {
        postId: row.id,
        companyId: this.$userInfo.orgInfo.companyId,
        current: 1,
        size: 500
      };
      this.requestMethodGet("/web/system/permission/orgPostManage/queryPostUserByPage", params).then(res => {
        if (res.data.code == 1000) {
          this.existUserList = res.data.data.list;
          this.editUserNum = res.data.data.totalCount;
          this.editUserDialog = true;
          this.assignMemberList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    confirmEditUser() {
      const checkUser = this.$refs.editUserRef.selection;
      const currentCompanUserlistIds = this.companyMemberList.map(item => item.userId);
      const outSideCheckUserId = this.existUserList.filter(item => !currentCompanUserlistIds.includes(item.userId));
      const userIdList = _.isEmpty(checkUser) ? [] : checkUser.map(it => it.userId).concat(outSideCheckUserId.map(it => it.userId));
      // 校验选择的人
      const params = {
        userIdList,
        postId: this.editMemberItem.id
      };
      this.requestMethodPost("/web/system/permission/orgPostManage/addBatchPostUserRel", params).then(res => {
        if (res.data.code == 1000) {
          this.editUserDialog = false;

          this.$refs.editUserRef.toggleAllSelection(false);
          this.cancelEditUser();
          this.refreshPostList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    cancelAddPost() {
      this.addPostDialog = false;
      this.editRow = null;
      this.addPostForm = {
        postName: "",
        taskTypeCode: [],
        postDetails: ""
      };
    },
    async getUserListOfOrg() {
      const res = await this.requestMethodGetTip("/web/system/permission/userManage/listByPage", {
        orgId: this.$route.query.companyId,
        ...this.userListPage,
        menuCode: "MyTeam"
      });
      this.companyMemberTotal = res.data.data.totalCount;
      this.companyMemberList = res.data.data.list;
    },
    refreshMemberList() {
      this.userListPage = {
        current: 1,
        size: 10
      };
      this.getUserListOfOrg();
    },
    refreshPostList() {
      this.postListPage = {
        current: 1,
        size: 10
      };
      this.getQueryPostList();
    },
    async getQueryPostList() {
      const res = await this.requestMethodGetTip("/web/system/permission/orgPostManage/queryPostList", {
        orgId: this.$userInfo.orgInfo.companyId,
        ...this.postListPage
      });
      this.companyPostList = res.data.data.list;
      this.postListTotal = res.data.data.totalCount;
    },
    async updateSpOfAccount() {
      const replaceList = this.$refs.distributorChangeCard.distributorList.map(item => {
        return {
          oldSpId: item.distirbutorCompanyid,
          newSpId: item.newDistirbutorCompanyid,
          dataReceiverUserId: item.dataReceiverUserId
        };
      });
      const params = {
        replaceSpParams: replaceList,
        accountId: this.ruleForm.companyId
      };
      const res = await this.requestMethodPostTip("/web/company/updateSpOfAccount", params);
      this.$refs.distributorChangeCard.clearSelRP();
      if (res.data.code == 1000) {
        // this.ruleForm.customerCompanyName = this.$refs.distributorChangeCard.distributorList.map(item => item.newDistributorName).join(",");
        this.$_queryDealerInfo(this.$route.query.companyNumber);
      }
    },
    openChangeDistributorDialog() {
      if (this.$refs.distributorChangeCard) {
        this.$refs.distributorChangeCard.show = true;
      }
      const h = this.$createElement;
      this.$msgbox({
        customClass: "auth-manage-change-distributor-dialog",
        title: "更换经销商",
        modal: false,
        message: h(DistributorChangeCard, {
          props: {
            customerInfo: this.ruleForm
          },
          ref: "distributorChangeCard"
        }),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--danger"
      })
        .then(action => {
          this.updateSpOfAccount();
        })
        .catch(() => {})
        .finally(() => {
          this.$refs.distributorChangeCard.show = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.team-main {
  margin: 10px 20px 0;
}
/deep/ .el-tabs__item {
  font-weight: bold;
  color: #999;
}
/deep/ .el-tabs__nav-wrap::after {
  background: none;
}
/deep/ .el-tabs__item.is-active {
  color: red;
}
/deep/ .el-tabs__active-bar {
  background: red;
}
</style>
