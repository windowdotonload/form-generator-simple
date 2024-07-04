<template>
  <div>
    <el-form :model="configTcoListParams" ref="configTcoList" label-width="100px" label-position="left">
      <el-form-item label="标题">
        <el-input size="small" v-model="configEditParams.toolName" style="width: 70%" placeholder="请输入标题" :maxlength="50" disabled></el-input>
      </el-form-item>

      <div class="config-list-container" ref="scrollContainer">
        <div v-for="(config, index) in configTcoListParams.tcoCvConfigProductList" :key="config.key" class="config-line">
          <el-form-item
            :prop="'tcoCvConfigProductList.' + index + '.productName'"
            label="黑霸王产品"
            :rules="{ required: true, message: '产品名不能为空', trigger: 'blur' }"
            style="width:40%;margin-right:20px"
          >
            <el-input size="small" v-model="config.productName" placeholder="请输入" :maxlength="50" />
          </el-form-item>
          <el-form-item
            :prop="'tcoCvConfigProductList.' + index + '.savingRate'"
            label="节省率"
            :rules="[{ required: true, message: '节省率不能为空', trigger: 'blur' }, { validator: checkNumber, trigger: 'blur' }]"
            style="width:40%"
          >
            <el-input size="small" v-model.number="config.savingRate" placeholder="请输入" :maxlength="50" />
          </el-form-item>
          <el-form-item style="width:5%;">
            <el-button type="text" size="small" @click="deleteProduct(config)" style="color:#d10000" v-show="configTcoListParams.tcoCvConfigProductList.length > 1">删除</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-button type="text" size="small" @click="addProduct" style="margin-bottom:10px">
      <i class="el-icon-plus" />
      添加产品
    </el-button>

    <div class="footer-btn">
      <el-button plain size="small" @click="cancelSaveConfigParams">取消</el-button>
      <el-button type="danger" size="small" @click="saveConfigParams">保存</el-button>
    </div>
  </div>
</template>

<script>
const checkNumber = (rlue, val, cb) => {
  if (isNaN(val)) return cb(new Error("请输入数字"));
  cb();
};
export default {
  props: {
    configEditParams: {
      type: Object,
      default: null
    },
    parent: {
      type: Object
    }
  },
  mounted() {
    this.revertList();
  },
  data() {
    return {
      checkNumber,
      configTcoListParams: {
        tcoCvConfigProductList: [
          {
            key: new Date(),
            productName: "",
            savingRate: ""
          }
        ]
      }
    };
  },
  methods: {
    revertList() {
      if (this.configEditParams.configuration) {
        this.configTcoListParams.tcoCvConfigProductList = JSON.parse(this.configEditParams.configuration);
      }
    },
    addProduct() {
      this.configTcoListParams.tcoCvConfigProductList.push({
        key: new Date(),
        productName: "",
        savingRate: ""
      });
      this.$nextTick(() => {
        Promise.resolve().then(() => {
          this.$refs.scrollContainer.scrollTop = this.$refs.scrollContainer.scrollHeight;
        });
      });
    },
    deleteProduct(config) {
      if (this.configTcoListParams.tcoCvConfigProductList.length == 1) {
        return this.$message({
          type: "warning",
          message: "至少保留一个产品"
        });
      }
      this.configTcoListParams.tcoCvConfigProductList = this.configTcoListParams.tcoCvConfigProductList.filter(item => item.key !== config.key);
    },
    cancelSaveConfigParams() {
      this.configTcoListParams.tcoCvConfigProductList = [
        {
          key: new Date(),
          productName: "",
          savingRate: ""
        }
      ];
      this.parent.cancelSaveConfigParams();
    },
    saveConfigParams() {
      this.$refs.configTcoList.validate(async valid => {
        if (valid) {
          const params = {
            ...this.configEditParams,
            configuration: JSON.stringify(this.configTcoListParams.tcoCvConfigProductList)
          };

          const res = await this.requestMethodPost("/toolkit/updateToolConfig", {
            ...params,
            id: this.configEditParams.id
          });
          if (res.data.code == 1000) {
            this.$message({
              type: "success",
              message: "编辑数据成功"
            });
            await this.parent.getToolkitList();
            this.parent.handleCloseConfig();
          } else {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped>
.config-line {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  flex-wrap: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.config-list-container {
  box-sizing: border-box;
  position: relative;
  overflow: auto;
  padding-right: 3px;
  max-height: 200px;
  overflow: auto;
}
.config-list-container::-webkit-scrollbar {
  width: 2px !important;
}
</style>
