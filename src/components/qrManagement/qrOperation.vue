<template>
   <!-- 设备二维码使用说明 -->
      <el-dialog
      title='设备二维码使用说明'
      :visible.sync="dialogVisibleOperation"
      :close-on-click-modal="false"
      width="60%"
      :before-close="closeVisibleOperation"
      >
      <div>
        <div class="child-item" style="text-indent:1em;">设备二维码用于管理设备资产，您可将二维码制作成标签，使每个二维码带有不同信息，实现一物一码对应。</div>
        <div style="margin:10px 0;" class="title-item">1、如何打印二维码？</div>
        <div class="child-item"  style="text-indent:1em;">您可以在“设备/设备二维码”页面中，选择您需要打印的二维码后批量导出，并通过以下方式打印二维码图片：</div>
        <div class="child-item"> ● 使用A4打印机或标签打印机打印；</div>
        <div class="child-item"> ● 找文印店或专业印刷公司代打；</div>
        <div class="child-item"> ● 联系您的服务商代打（请登陆小程序查看服务商信息）。</div>

        <div style="margin:16px 0 10px;" class="title-item">2、如何根据现场环境选择印刷材质？</div>
        <div class="child-item"  style="text-indent:1em;">现场环境对标牌性能和落地效果有较大影响，请根据实际环境选择合适的二维码材质：</div>
        <div class="child-item"> ● <span style="color:#000;font-weight:600;">热敏纸：</span>具有成本低、易制作的特点，适用于室内清洁、常温或需要快速落地的短期使用场景；</div>
        <div class="child-item"> ● <span style="color:#000;font-weight:600;">覆膜纸：</span>具有防水防油、耐磨防刮的特点，适用于表面光滑平整或弧度不大的设备中长期使用（服务商代打印使用该材质）；</div>
        <div class="child-item"> ● <span style="color:#000;font-weight:600;">铝板/不锈钢：</span>具有强度高、耐强酸强碱、耐高温极寒的特点，适用于高强度使用或高温极寒环境下使用，极端环境推荐使用蚀刻印刷工艺。</div>

        <div style="margin:16px 0 10px;" class="title-item">3、如何张贴二维码？</div>
        <div class="child-item"  style="text-indent:1em;">正确的张贴可以有效提升二维码的使用寿命，需要根据二维码材质和环境特征选择合适的张贴方式：</div>
        <div class="child-item"> ● <span style="color:#000;font-weight:600;">准备工作：</span>请在粘贴前对粘贴面进行清洁，保证标签与粘贴面间无杂质，以确保粘贴强度；</div>
        <div class="child-item"> ● <span style="color:#000;font-weight:600;">光滑表面：</span>可使用不干胶、水性胶、3M背胶；</div>
        <div class="child-item"> ● <span style="color:#000;font-weight:600;">磨砂表面：</span>可使用3M背胶、海绵胶；</div>
        <div class="child-item"> ● <span style="color:#000;font-weight:600;">极端环境：</span>可使用3M背胶、海绵胶、打孔固定（服务商代打印使用3M背胶）。</div>
      </div>
      <span slot="footer" class="dialog-footer" align="center">
          <el-button type="danger" @click="closeVisibleOperation" size="small">我知道了</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisibleOperation: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data () {
    return {
    }
  },
  mounted () {

  },
  created () {
  },
  methods: {
    closeVisibleOperation () {
      this.$emit('closeVisibleOperation')
    }
  }
}
</script>

<style lang='less' scoped>
.child-item{
  font-weight:400;
  font-size:13px;
  line-height:21px;
  color:#666;
}
.title-item{
  font-weight:700;
  font-size:14px;
  line-height:14px;
  color:#000;
}
</style>
