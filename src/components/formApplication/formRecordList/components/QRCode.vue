<template>
  <div class="form-qr-container">
    <div id="InterceptElementContainer">
      <div class="form-qr-form-info">
        <div style="text-align:center;font-size:18px;font-weight:bloder;margin-bottom:8px">{{ cardInfo.formName }}</div>
        <div style="text-align:center;font-size:15px;color:#999">{{ cardInfo.remark }}</div>
      </div>
      <div class="form-qr-img">
        <el-image :src="qrPath" fit="none" @load="laodedImg" crossOrigin="anonymous">
          <div slot="error" class="image-slot">
            <i class="el-icon-loading" />
          </div>
          <div slot="load" class="image-slot">
            <i class="el-icon-loading" />
          </div>
        </el-image>
      </div>
      <div class="form-qr-tip">使用 <span style="color:#000">微信小程序</span> 扫码，可直接填写表单</div>
    </div>
    <div style="width:100%;display:flex;justify-content:center;height:fit-content">
      <el-button size="mini" type="danger" style="margin-top:20px" @click="downloadQRCode">下载二维码</el-button>
    </div>
  </div>
</template>

<script>
let html2canvas = null;
export default {
  inject: ["cardInfo"],
  created() {
    this.assignHtml2canvas();
    this.getQRIMGFullPath();
    this.$gio.ClicktoviewQRcode()
  },
  data() {
    return {
      loadedQRcode: false,
      qrPath: ""
    };
  },
  methods: {
    laodedImg() {
      this.loadedQRcode = true;
    },
    assignHtml2canvas() {
      if (html2canvas) return html2canvas;
      import("html2canvas").then(res => {
        html2canvas = res;
      });
    },
    async getQRIMGFullPath() {
      const res = await this.requestMethodGet("/web/file/getFullUrl", {
        url: this.cardInfo.qrImgPath
      });
      this.qrPath = res.data.data;
    },
    downloadQRCode() {
      this.$nextTick(() => {
        const element = document.getElementById("InterceptElementContainer");
        if (!this.loadedQRcode) return;
        html2canvas(element, {
          useCORS: true,
          backgroundColor: "#fff"
        }).then(canvas => {
          let dataURL = canvas.toDataURL("image/png");
          var addElement = document.createElement("a");
          addElement.href = dataURL;
          addElement.download = `记录表二维码_${this.cardInfo.formName}.png`;

          document.body.appendChild(addElement);
          addElement.click();
          document.body.removeChild(addElement);
          this.$gio.Clicktosavepicture()
        });
      });
    }
  }
};
</script>

<style lang="less" scoped>
.form-qr-container {
  flex-wrap: wrap;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}
.form-qr-form-info {
  width: 100%;
  box-sizing: border-box;
  position: relative;
}
.image-slot {
  position: relative;
  box-sizing: border-box;
  min-height: 115px;
  min-width: 115px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-qr-img {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 115px;
  margin-top: 18px;
  margin-bottom: 18px;
  height: fit-content;
}
.form-qr-tip {
  width: 100%;
  text-align: center;
  font-size: 13px;
  color: #999;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
