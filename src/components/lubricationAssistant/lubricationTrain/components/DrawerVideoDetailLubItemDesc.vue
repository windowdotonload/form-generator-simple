<template>
  <div class="lub-service-sec-container">
    <div class="lub-service-desc">
      {{ collapse ? showContent : content }}
      <span class="see-more-btn" @click="switechCollapse" v-if="needCollapse">{{ collapse ? "查看更多" : "收起" }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ""
    },
    limitNum: {
      type: Number,
      default: 80
    }
  },
  created() {
    if (this.content.length > this.limitNum) {
      this.showContent = this.content.slice(0, this.limitNum) + "...";
      this.needCollapse = true;
    } else {
      this.showContent = this.content;
    }
  },
  data() {
    return {
      showContent: "",
      needCollapse: false,
      collapse: true
    };
  },
  methods: {
    switechCollapse() {
      this.collapse = !this.collapse;
    }
  }
};
</script>

<style lang="less" scoped>
.lub-service-desc {
  line-height: 1.5;
  font-size: 13px;
  color: #666;
}
.lub-service-desc-towrow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.see-more-btn {
  margin-left: 10px;
  text-align: right;
  font-size: 12px;
  color: #001450;
  margin-top: 5px;
  cursor: pointer;
}
</style>
