<template>
    <div>
      <!-- 手动添加油品 -->
        <el-dialog title="手动添加油品" :visible.sync="addOilDialog" width="30%" :close-on-click-modal="false"  :before-close="cancelAddOil">
            <el-form :model="addOilForm" :rules="addOilRules" ref="addOilRef" class="demo-ruleForm" label-width="100px" label-position="left">
                <el-form-item class="filterConditionType" prop="oilBrand" label="油品品牌">
                    <el-select size="small" clearable  v-model="addOilForm.oilBrand" @change="selectOilBrandAdd" style="width: 60%">
                    <el-option v-for="item in oilBrandListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filterConditionType" prop="oilBrandName" label="" v-if="addOilForm.oilBrand=='0'">
                    <el-input v-model="addOilForm.oilBrandName" @blur='(val)=>checkedOil(val,"brand")' style="width: 60%" size="small" clearable maxlength="25" placeholder="请输入油品品牌"></el-input>
                    <div v-if="brandError && addOilForm.oilBrandName" style="color:#ff0000">{{ noticeErrorBrand }}</div>
                </el-form-item>
                <el-form-item class="filterConditionType" prop="oilName" label="油品名称">
                    <el-input v-model="addOilForm.oilName" @blur='(val)=>checkedOil(val,"name")' @change="changeOil"  style="width: 60%" size="small" clearable maxlength="25"></el-input>
                    <div v-if="nameError && addOilForm.oilName" style="color:#ff0000">{{ noticeError }}</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancelAddOil('addOilRef')" size="small">取 消</el-button>
            <el-button type="danger" @click="completeAddOil('addOilRef')" size="small">完 成</el-button>
            </span>
        </el-dialog>
    </div>
  </template>
  <script>
  import { closeLoading } from "@/api/request.js";
  export default {
    props: {
    addOilDialog: {
        type: Boolean,
        default: () => {
          return false;
        },
      },
      addType: {
        type: String,
        default: ''
      },
      addOilForm: {
        type: Object,
        default: () => {
          return {};
        },
      },
      oilBrandList: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    data() {
      return {
        oilBrandListAdd: [],
        brandError:false,
        nameError:false,
        noticeError:'',
        noticeErrorBrand:'',
        // 手动添加油品弹框
        addOilForm: {
          oilBrand: "",
          oilName: "",
        },
        checkOilName:false,  // 校验名称是否重复
        addOilRules: {
          oilBrand: [{ required: true, message: "请选择油品品牌", trigger: "change" }],
          oilBrandName: [{ required: true, message: "请输入", trigger: "blur" }],
          oilName: [{ required: true, message: "请输入油品名称", trigger: "blur" }],
        },
      };
    },
    created() {
      this.getOilBrandData();
    },
    methods: {
      // 获取品牌数据
      getOilBrandData() {
        const params = {
          parentCode:0,
          status:1
        };
        this.requestMethodGet("/mdm/oil/queryOilList", params).then((res) => {
          if (res.data.code == 1000) {
            const data = res.data.data;
            let brandList = [];
            if (data.length !== 0) {
              brandList = data.filter((it) => {
                return it.code !== "oil_0001";
              });
            }
            this.oilBrandListAdd = brandList;
            this.oilBrandListAdd.push({
              name:'自定义',
              code:'0'
            })
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        });
      },
      // 手动添加油品校验名字是否重复
    checkedOil(val,type,type2) {
      let value ;
      if(type2) {
        value = val
      } else {
        value = val.target.value
      }
      if(value) {
        const params = {
          productName: value
        };
        if(type=='brand') {
          params.parentNumber=0
        }else if(type=='name') {
          params.parentNumber=this.addOilForm.oilBrand
        }
        closeLoading();
        this.requestMethodPost("mdm/oil/checkOilName", params).then((res) => {
          if (res.data.code == 1000) {
            if(type=='brand') {
              this.brandError = false
              this.noticeErrorBrand = ''
            } else if(type=='name') {
              this.checkOilName = true
              this.nameError = false
              this.noticeError = ''
            }
          } else if(res.data.code == 4217) {
              this.brandError = true
              this.noticeErrorBrand = res.data.msg
          } else if(res.data.code == 4216) {
              this.checkOilName = true
              this.nameError = true
              this.noticeError = res.data.msg
          }else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        });
      }
    },
      selectOilBrandAdd() {
        this.noticeError=''
        this.noticeErrorBrand=''
        this.$set(this.addOilForm, 'oilBrandName', '')
        this.$set(this.addOilForm, 'oilName', '')
      },
      changeOil(val) {
        if(!val) {
          this.noticeError=''
        }
      },  
      // 取消自定义油品
      cancelAddOil() {
        Object.assign(this.$data.addOilForm, this.$options.data().addOilForm)
        this.$emit("closeDialogAdd");
      },
      completeAddOil(formName){
        this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.checkOilName)
          if(!this.checkOilName) {
            this.checkedOil(this.addOilForm.oilName,'name','type')
          }
          if(!this.brandError && !this.nameError) {
            this.$emit("addOrEditOil", this.addOilForm);
          } else {
          return false;
        }
        }
      });
        
      },
    },
    computed: {
    },
  };
  </script>
<style lang="sss" scoped>
.el-select-dropdown__item:last-child {
  color: #001450;
  font-weight:bold;
}
.demo-ruleForm {
  padding: 30px 20px !important;
}
</style>