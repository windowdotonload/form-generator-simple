import DistributorChangeCard from "../components/authManageChangeDistributor.vue";
export default {
  components: {
    DistributorChangeCard
  },
  created() {
    this.getUserListOfOrg();
    this.getQueryPostList();
    this.getTaskType();
  },
  destroyed() {
    this.msgBoxInstance = null;
    this.renderComInstance = null;
  },
  data() {
    return {
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
            params.companyId = this.ruleForm.companyId;
            url = "/web/system/permission/orgPostManage/updatePost";
          } else {
            params.companyId = this.ruleForm.companyId;
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
          taskTypeCode: rowInfo.taskTypeCode ? rowInfo.taskTypeCode.split(",") : [],
          postDetails: rowInfo.postDetails
        };
        this.addPostForm.id = rowInfo.id;
      }
      this.addPostDialog = true;
    },
    cancelEditUser() {
      this.$refs.editUserRef.toggleAllSelection(false);
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
      const res = await this.requestMethodGetTip("/web/system/permission/orgSysUserManagae/userListOfOrg", {
        orgId: this.$route.query.companyId,
        ...this.userListPage,
        menuCode: 'PC_Customer_user'
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
        companyId: this.ruleForm.companyId,
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
      const res = await this.requestMethodGetTip("/web/system/permission/orgSysUserManagae/userListOfOrg", {
        orgId: this.$route.query.companyId,
        ...this.userListPage,
        menuCode: 'PC_Customer_user'
      });
      if (res.data.data.list.length) {
        res.data.data.list.forEach(it => {
          it.isShowListAllPhone = false;
          it.tempPhone = this.tmPhone(it.phonenumber);
        });
      }
      this.companyMemberTotal = res.data.data.totalCount;
      this.companyMemberList = res.data.data.list;
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
        orgId: this.$route.query.companyId,
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
      // const selRP = this.$refs.distributorChangeCard.selRP;
      const params = {
        replaceSpParams: replaceList,
        accountId: this.ruleForm.companyId
      };
      const res = await this.requestMethodPostTip("/web/company/updateSpOfAccount", params);
      this.$refs.distributorChangeCard.clearSelRP();
      if (res.data.code == 1000) {
        this.$_queryDealerInfo(this.$route.query.companyNumber);
        // this.ruleForm.customerCompanyName = this.$refs.distributorChangeCard.distributorList.map(item => item.newDistributorName).join(",");
      }
    },
    openChangeDistributorDialog() {
      const h = this.$createElement;
      const renderCom = h(DistributorChangeCard, {
        props: {
          customerInfo: this.ruleForm
        },
        key: new Date().getTime(),
        ref: "distributorChangeCard"
      });
      this.renderComInstance = renderCom;
      this.$msgbox({
        customClass: "auth-manage-change-distributor-dialog",
        title: "更换经销商",
        modal: false,
        message: renderCom,
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        confirmButtonClass: "el-button--danger",
        beforeClose(action, instance, done) {
          done();
        }
      })
        .then(action => {
          this.updateSpOfAccount();
        })
        .catch(() => {});
    }
  }
};
