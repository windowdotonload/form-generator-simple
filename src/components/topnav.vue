<template>
  <div class="nav-top" style="width: 100%; overflow: hidden">
    <!-- 头部便面包屑 -->
    <div v-show="$route.meta.title">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 24px 20px 20px 20px">
        <div></div>
        <el-breadcrumb-item
          :class="{
            'breadcrumb-color': breadcrumb.length > 0,
            'only-one-breadcrumb': breadcrumb.length == 0,
          }"
        >
          <span @click="returnPage(0)"> {{ routeChange[0] }} </span>
        </el-breadcrumb-item>
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="item" class="breadcrumb-color">
          <span @click="returnPage(index + 1)"> {{ $route.query.trainId ? "编辑培训" : $route.query.bannerId ? "编辑" : item }} </span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      breadcrumb: [],
      lastPath: "",
    };
  },
  computed: {
    routeChange() {
      if (this.$route.meta.title) {
        let breadcrumbNav = this.$route.meta.title.split(",");
        this.breadcrumb = breadcrumbNav.splice(1);
        this.lastPath = "/" + this.$route.path.split("/")[1];
        return breadcrumbNav;
      }
      return [];
    },
  },
  methods: {
    returnPage(i) {
      if (this.breadcrumb.length > i) {
        if (this.breadcrumb == "填写表单") {
          return this.$router.go(-1);
        }
        if (i == 0) {
          this.$router.push({
            path: this.lastPath,
          });
        } else {
          this.$router.go(-(this.breadcrumb.length - i));
        }
      }
    },
  },
  mounted() {
    // this.requestMethodGet("/common/manage/dropDown").then(res => {
    // })
    // this.requestMethodPost("/project/getIpmProjectList",{cee:2134}).then(res => {
    // })
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.nav-top {
  .el-badge__content {
    top: 15px;
    right: 35px;
  }
  .breadcrumb-color .el-breadcrumb__inner,
  .only-one-breadcrumb .el-breadcrumb__inner {
    color: rgb(0, 20, 79);
    font-size: 16px;
    font-weight: bold;
  }
  .breadcrumb-color,
  .only-one-breadcrumb {
    .el-breadcrumb__inner:hover {
      color: rgb(0, 20, 79);
      cursor: pointer;
      font-weight: bold;
      text-decoration: underline;
    }
  }
  .breadcrumb-color:last-of-type {
    .el-breadcrumb__inner {
      color: rgb(153, 153, 153) !important;
      font-weight: 400;
    }
  }
}
</style>
