<template>
  <div class="drawer-video-tab-section-container">
    <el-input type="textarea" placeholder="请留下您宝贵的评论" v-model="commentContent" maxlength="80" show-word-limit />
    <el-button type="danger" size="mini" style="margin-top:10px" @click="addComment">提交</el-button>
    <div class="comment-list-container">
      <div class="comment-list-item" v-for="item in commentList" :key="item.id">
        <div style="width:100%;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;height:20px">
          <span class="comment-name">{{ item.userName }}</span>
          <i class="el-icon-delete" style="cursor:pointer;" @click="deleteCommentItem(item)" v-if="deletBtnPermission" />
        </div>
        <div class="comment-content">{{ item.evaluate }}</div>
        <div class="comment-date">{{ item.createTime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTrainCommentList, addComment, executeCbAfterReq, deleteComment } from "../../api";
export default {
  data() {
    return {
      deletBtnPermission: this.$_has("deleteTrainEvaluate"),
      commentContent: "",
      commentList: [],
      commentTotal: 0
    };
  },
  inject: ["state"],
  watch: {
    "state.drawerComponentParams.id"(val) {
      this.getTrainCommentList();
    }
  },
  created() {
    this.getTrainCommentList();
  },
  methods: {
    deleteCommentItem(item) {
      this.$confirm("确认删除此条评论", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await deleteComment({
            evaluateId: item.id
          });
          this.getTrainCommentList();
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {});
    },
    getTrainCommentListActions(res) {
      this.commentTotal = res.totalCount;
      this.commentList = res.list;
    },
    getTrainCommentList() {
      const params = {
        trainId: this.state.drawerComponentParams.id,
        current: 1,
        size: 50
      };
      executeCbAfterReq(getTrainCommentList, params, this.getTrainCommentListActions);
    },
    addCommentAfterAction(res) {
      this.commentContent = "";
      this.getTrainCommentList();
      this.$gio.evaluateTrain({
        trainName: this.tate.drawerComponentParams.trainName,
        operation: "提交评价"
      });
    },
    addComment() {
      if (!this.commentContent) return this.$message({ type: "warning", message: "请输入评论内容" });
      const params = {
        evaluate: this.commentContent,
        trainId: this.state.drawerComponentParams.id
      };
      executeCbAfterReq(addComment, params, this.addCommentAfterAction);
    }
  }
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  width: 3px !important;
}
.drawer-video-tab-section-container {
  box-sizing: border-box;
  width: 100%;
  padding: 10px 0;
  min-height: 300px;
  &::-webkit-scrollbar {
    display: none;
  }
}
.comment-list-container {
  box-sizing: border-box;
  overflow-y: auto;
  max-height: 500px;
  margin-top: 10px;
}

.comment-list-item {
  padding: 5px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9e9e9;
}
.comment-name {
  display: inline-block;
  color: #000;
  font-weight: bold;
  font-size: 15px;
}
.el-icon-delete:hover {
  color: #d10000;
}
.comment-content {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}
.comment-date {
  font-size: 12px;
  color: #999;
}
</style>
