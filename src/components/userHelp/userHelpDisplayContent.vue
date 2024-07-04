<template>
  <div class="container">
    <div class="userhelp-banner">
      <img src="@/assets/logo-1.png" style="width: 220px; height: auto; padding-left: 20px" />
      <div class="split-line" />
      <p class="userhelp-text">系统使用小助手</p>
    </div>

    <div class="display-content-container">
      <div class="top-breadcrumb" v-if="!preview">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="first-item">{{ this.$store.state.userHelpDisplayActiveItem && this.$store.state.userHelpDisplayActiveItem.title }}</el-breadcrumb-item>
          <el-breadcrumb-item class="seconde-item">{{ $store.state.userHelpDisplayContentItem && $store.state.userHelpDisplayContentItem.title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button size="mini" @click="goBack">返回</el-button>
      </div>

      <div class="spec-content-box">
        <div class="content-title">
          {{ ($store.state.userHelpDisplayContentItem && $store.state.userHelpDisplayContentItem.title) || titleProp }}
        </div>
        <div class="content-article">
          <iframe :src="currentFullPath" width="100%" height="500" />
        </div>
        <div class="recommend-title">相关问题</div>
        <p class="recommend-text" :class="{ 'recommend-text-hover': !preview }" v-for="item in recommendList" :key="item.id" @click="toRecommend(item)">
          {{ item.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    classId: {
      default: 0
    },
    preview: {
      type: Boolean,
      default: false
    },
    srcProp: {
      type: String,
      default: ''
    },
    titleProp: {
      type: String,
      default: 'TITLE'
    }
  },
  updated () {
    setTimeout(() => {
      if (this.preview) {
        this.currentFullPath = this.srcProp
      }
    }, 0)
  },
  async mounted () {
    const classID = this.preview ? this.classId : this.$store.state.userHelpDisplayActiveItem && this.$store.state.userHelpDisplayActiveItem.id
    const recommendRes = await this.requestMethodGet('/help/center/queryHelpContentListByPage', {
      isConfPage: 0,
      classId: classID,
      size: 10,
      current: 1
    })
    if (recommendRes.data.code == 1000) {
      this.recommendList = recommendRes.data.data.list
    }
    if (this.preview) {
      this.currentFullPath = this.srcProp
      return
    }

    if (this.$store.state.userHelpDisplayContentItem) {
      if (this.$store.state.userHelpDisplayContentItem.contentType == 0) {
        const fullPath = await this.requestMethodGet('/web/file/getFullUrl', {
          url: this.$store.state.userHelpDisplayContentItem.path
        })
        if (fullPath.data.code == 1000) {
          this.currentFullPath = fullPath.data.data
        }
      } else {
        this.currentFullPath = this.$store.state.userHelpDisplayContentItem.path
      }
    }
  },
  data () {
    return {
      recommendList: [],
      currentFullPath: ''
    }
  },
  methods: {
    async toRecommend (item) {
      if (!this.preview) {
        if (item.contentType == 0) {
          this.$store.commit('changeUserHelpDisplayContentItem', item)
          const fullPath = await this.requestMethodGet('/web/file/getFullUrl', {
            url: item.path
          })
          if (fullPath.data.code == 1000) {
            this.currentFullPath = fullPath.data.data
          }
        } else {
          window.open(item.path, '_target')
        }
        window.scrollTo(0, 0)
      }
    },
    goBack () {
      this.$store.commit('changeUserHelpState', 'Search')
    }
  }
}
</script>

<style lang='less' scoped>
.container {
  width: 100%;
  min-height: 100vh;
  padding-bottom: 50px;
  background: #f9f9f9;
}
.userhelp-banner {
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  height: 60px;
  line-height: 60px;
  background: #ffffff;

  .split-line {
    width: 1px;
    height: 16px;
    margin: 0 16px;
    background: rgb(233, 233, 233);
  }

  .userhelp-text {
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: bolder;
  }
}
.display-content-container {
  width: 46%;
  margin: 0 auto;
  padding-top: 30px;
  /deep/ .el-button--default {
    &:hover {
      color: #ffffff;
      background: #f56c6c;
    }
  }
  .top-breadcrumb {
    display: flex;
    justify-content: space-between;
    .first-item {
      /deep/ .el-breadcrumb__inner {
        font-family: MicrosoftYaHei;
        color: rgb(0, 20, 80);
      }
    }

    .seconde-item {
      /deep/ .el-breadcrumb__inner {
        font-family: MicrosoftYaHei;
        color: rgb(153, 153, 153);
      }
    }
  }

  .spec-content-box {
    box-sizing: border-box;
    width: 100%;
    margin-top: 20px;
    padding: 24px;
    background: #ffffff;
    .content-title {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid #e9e9e9;
    }
    .content-article {
      font-size: 13px;
      color: rgb(102, 102, 102);
      line-height: 21px;
      border-bottom: 1px dashed #e9e9e9;
      padding-bottom: 24px;
      margin-bottom: 24px;
    }

    .recommend-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 12px;
    }

    .recommend-text {
      margin: 0;
      height: 32px;
      line-height: 32px;
      font-size: 13px;
      color: rgb(102, 102, 102);
      cursor: pointer;
    }
    .recommend-text-hover:hover {
      color: #dd0000;
    }
  }
}
</style>
