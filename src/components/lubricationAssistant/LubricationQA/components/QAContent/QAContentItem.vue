<template>
  <el-collapse v-model="activeNames" @change="handleChange" style="border:none;width:100%">
    <el-collapse-item name="1">
      <template slot="title">
        <span class="qa-item-line Q qa-item-line-wrap" style="line-height:1.5;margin-bottom:10px">
          <span style="color:#d10000;font-weight:bloder">问：</span><span class="A">{{ QAContentItem.question }} </span>
        </span>
      </template>
      <span class="qa-item-line-wrap">
        答：<span class="A">{{ QAContentItem.answer }}</span>
      </span>
      <div class="media-bar">
        <OSSUploadCombine uploadType="video" v-model="videoUrl" readOnly width="235px" height="105px" @click.native="viewVideo" />
        <OSSUploadCombine uploadType="image" v-model="picUrl" readOnly @click.native="viewPic" />
      </div>
      <el-button v-if="this.attachmentUrl && this.attachmentUrl.length == 1" size="mini" type="text" style="margin-top:5px" @click="viewAttachment">
        <i class="el-icon-link" style="margin-right:5px" />查看附件
      </el-button>
      <el-button style="margin-top:10px" v-if="QAContentItem.linkContent" type="danger" size="small" @click="handleApply(QAContentItem)">{{ QAContentItem.linkContent }}</el-button>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { saveVisitsLogByQaId } from "../../../api/LubQA";
import { closeLoading, openLoading } from "@/api/request.js";
export default {
  props: {
    QAContentItem: Object
  },

  data() {
    return {
      picUrl: [],
      videoUrl: [],
      attachmentUrl: [],
      activeNames: [],
      flodStatus: 0
    };
  },
  created() {
    this.initAssets();
  },
  methods: {
    initAssets() {
      this.picUrl = this.QAContentItem.picUrlFullList && this.QAContentItem.picUrlFullList;
      this.videoUrl = this.QAContentItem.videoUrlFull && this.QAContentItem.videoUrlFull.split(",");
      this.attachmentUrl = this.QAContentItem.attachmentUrlFull && this.QAContentItem.attachmentUrlFull.split(",");
    },
    handleApply(QAContentItem) {
      console.log(QAContentItem)
      if(QAContentItem.jumpFlag=='2') {
        this.$message({
            message: '网页端不支持此类跳转，请前往小程序操作！',
            type: "warning"
        });
      } else {
        let url =  QAContentItem.linkUrl.split('#')
        this.$router.push({
          path: url[url.length-1]
        }); 
      }
      
    },
    viewAttachment() {
      this.$gio.viewQAattachment({
        question: this.QAContentItem.question
      });
      window.open(this.attachmentUrl[0], "_blank");
    },
    viewPic() {
      this.$gio.viewQApicture({
        question: this.QAContentItem.question
      });
    },
    viewVideo() {
      this.$gio.viewQAattachment({
        question: this.QAContentItem.question
      });
      this.$gio.viewQAVideo({
        question: this.QAContentItem.question
      });
    },
    async handleChange(activeNames) {
      if (activeNames.length == 1) {
        this.flodStatus = !this.flodStatus;
        const params = {
          id: this.QAContentItem.id
        };
        closeLoading();
        await saveVisitsLogByQaId(params);
        openLoading();
        this.$gio.foldQA({
          operation: this.flodStatus ? "展开" : "收起",
          question: this.QAContentItem.question
        });
      }
      this.$gio.Clicktoapplyentrance()
    }
  }
};
</script>

<style lang="less" scoped>
.qa-item-line {
  display: inline-block;
  width: 100%;
  font-size: 16px;
}
.qa-item-line-wrap {
  display: flex;
  width: 100%;
  font-size: 16px;
}
.Q {
  font-weight: bolder;
  color: #000;
}
.A {
  color: #666;
  white-space: pre-wrap;
}
.media-bar {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 10px;
  align-items: center;
}
/deep/ .el-collapse-item__header {
  border: none;
  height: fit-content;
}

/deep/ .el-collapse-item__wrap {
  border: none;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 0;
}
</style>
