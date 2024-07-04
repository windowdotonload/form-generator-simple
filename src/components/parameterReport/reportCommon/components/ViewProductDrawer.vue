<template>
  <div>
    <el-dialog :visible.sync="visible" :before-close="handlerClose">
      <div slot="title">推荐油品</div>
      <div>
        <div v-if="data.syntheticOil && data.syntheticOil.length > 0">
          <p class="vp-title">推荐合成油：</p>
          <div>
            <span v-for="(item,i) in data.syntheticOil" :key="item.id">{{ item.nameCn }}<span v-show="i < data.syntheticOil.length - 1">、</span></span>
          </div>
        </div>
        <div v-if="data.grease && data.grease.length > 0">
          <p class="vp-title">推荐润滑脂：</p>
          <div>
            <span v-for="(item,i) in data.grease" :key="item.id">{{ item.nameCn }}<span v-show="i < data.grease.length - 1">、</span></span>
          </div>
        </div>
        <div v-if="data.mineralOil && data.mineralOil.length > 0">
          <p class="vp-title">推荐矿物油：</p>
          <div>
            <span v-for="(item,i) in data.mineralOil" :key="item.id">{{ item.nameCn }}<span v-show="i < data.mineralOil.length - 1">、</span></span>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button size="small" type="danger" @click.prevent="handlerClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: false,
    data: {
      type: Object,
      default: () => {
        return {
          syntheticOil: [],
          grease: [],
          mineralOil: []
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    handlerClose () {
      this.$parent.$parent.handlerViewProductDrawerClose()
    }
  }
}
</script>

<style lang="less" scoped>
.vp-title{
  color: #f7b155;
}
</style>
