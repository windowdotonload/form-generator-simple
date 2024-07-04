<script>
export default {
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showTooltip: false
    };
  },
  mounted() {
    this.setShowTooltip();
  },
  watch: {
    text: {
      handler() {
        this.$nextTick(() => {
          this.setShowTooltip();
        });
      }
    }
  },
  methods: {
    setShowTooltip() {
      const element = this.$refs.text;
      const elementWidth = element.offsetWidth;
      const textWidth = element.scrollWidth;
      this.showTooltip = textWidth > elementWidth;
    }
  },
  render() {
    const renderELM = this.showTooltip ? (
      <el-tooltip class="item" effect="dark" content={this.text} placement="top">
        <span class="menu__list--item-text" ref="text">
          {this.text}
        </span>
      </el-tooltip>
    ) : (
      <span class="menu__list--item-text" ref="text">
        {this.text}
      </span>
    );
    return renderELM;
  }
};
</script>

<style lang="less" scoped>
.menu__list--item-text {
  display: inline-block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-family: Microsoft YaHei;
}
</style>
