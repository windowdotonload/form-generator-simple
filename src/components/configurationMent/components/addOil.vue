<template>
    <div>
        <el-dialog :title="addType=='editBrand'  || addType=='editType' ||  addType=='editOilName' ? '编辑油品' :'新建油品'" :visible.sync="addOilDialog" width="30%" :close-on-click-modal="false"  :before-close="cancelAddOil">
            <el-form :model="addOilForm" :rules="addOilRules" ref="addOilRef" class="demo-ruleForm" label-width="100px" label-position="left">
                <div v-if="addType=='addBrand'">
                    <el-form-item class="filterConditionType" prop="oilBrandName" label="油品品牌">
                        <el-input v-model="addOilForm.oilBrandName"  style="width: 60%" size="small" clearable maxlength="25" placeholder="请输入油品品牌"></el-input>
                    </el-form-item>
                </div>
                <div v-if="addType=='addName'">
                    <el-form-item class="filterConditionType" prop="oilBrand" label="油品品牌">
                        <el-select size="small" clearable  v-model="addOilForm.oilBrand" style="width: 60%">
                        <el-option v-for="item in oilBrandListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="oilName" label="油品名称">
                        <el-input v-model="addOilForm.oilName" @change="changeOil"  style="width: 60%" size="small" placeholder="请输入油品名称" clearable maxlength="25"></el-input>
                    </el-form-item>
                </div>
                <!-- 编辑油品品牌 -->
                <div v-if="addType=='editBrand'">
                    <el-form-item class="filterConditionType" prop="oilBrand" label="油品品牌">
                        <el-select disabled size="small" clearable  v-model="addOilForm.oilBrand"  style="width: 60%">
                        <el-option  v-for="item in oilBrandListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType"  label="" >
                        <el-input v-model="addOilForm.oilBrandName"  style="width: 60%" size="small" clearable maxlength="25" placeholder="请输入油品品牌"></el-input>
                    </el-form-item>
                </div>
                <!--  编辑油品名称-->
                <div v-if="addType=='editOilName'">
                    <el-form-item class="filterConditionType" prop="oilBrand" label="油品品牌">
                        <el-select size="small" clearable  v-model="addOilForm.oilBrand" style="width: 60%">
                        <el-option v-for="item in oilBrandListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="oilName" label="油品名称" >
                        <el-select disabled size="small" clearable v-model="addOilForm.oilName" style="width: 60%">
                            <el-option v-for="item in oilNameListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" label="" >
                        <el-input v-model="addOilForm.oilTypeName"  style="width: 60%" size="small" clearable maxlength="25" placeholder="请输入油品名称"></el-input>
                    </el-form-item>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button @click="cancelAddOil('addOilRef')" size="small">取 消</el-button>
            <el-button type="danger" @click="completeAddOil('addOilRef')" size="small">完 成</el-button>
            </span>
        </el-dialog>
    </div>
  </template>
  <script>
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
        oilNameListAdd:[],
        brandError:false,
        nameError:false,
        noticeError:'',
        noticeErrorBrand:'',
        addOilForm: {
          oilBrand: "",
          oilName: "",
        },
        checkOilName:false,  // 校验名称是否重复
        addOilRules: {
          oilBrand: [{ required: true, message: "请选择油品品牌", trigger: "change" }],
          oilBrandName: [{ required: true, message: "请输入油品品牌", trigger: "blur" }],
          oilName: [{ required: true, message: "请输入油品名称", trigger: "blur" }],
          oilTypeName: [{ required: true, message: "请输入油品名称", trigger: "blur" }],
        },
      };
    },
    created() {
    },
    mounted() {
      if(this.addType=='editOilName') {
        this.getOilNameOption()
      }
    },
    methods: {
      // 获取品牌数据
      getOilBrandChild() {
        const params = {
          parentCode: 0,
          status:1,
        };
        this.requestMethodGet("/mdm/oil/queryOilList", params).then((res) => {
          if (res.data.code == 1000) {
            const data = res.data.data;
            let brandList = [];
            if (data.length !== 0) {
              brandList = data.filter(it => {
                return it.code !== "oil_0001";
              });
            }
            this.oilBrandListAdd = brandList;
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        });
      },
      // 获取油品名称数据
      getOilNameOption() {
        this.requestMethodGet("/mdm/oil/queryOilList",{parentCode:this.addOilForm.oilBrand,status:''}).then(res => {
          if(res.data.code == 1000) {
              this.oilNameListAdd = res.data.data;
          }else {
              this.$message({
                  message: res.data.msg,
                  type: "warning",
              });
          }
        }).catch(res => {
        });
      },
      changeOil(val) {
        if(!val) {
          this.noticeError=''
        }
      },  
      // 取消自定义油品
      cancelAddOil() {
        this.$nextTick(()=>{
          this.$refs["addOilRef"].resetFields();
        })
        
        Object.assign(this.$data.addOilForm, this.$options.data().addOilForm)
        this.$emit("closeDialogAdd");
      },
      completeAddOil(formName){
        this.$refs[formName].validate((valid) => {
        if (valid) {
            this.$emit("addOrEditOil", this.addOilForm);
        }
      });
      },
      formatData(data) {
        for (var i = 0; i < data.length; i++) {
          if (!data[i].children || data[i].children.length == 0) {
            data[i].children = null;
          } else {
            this.formatData(data[i].children);
          }
        }
        return data;
      },
 
    },
    computed: {
    },
  };
  </script>
<style lang="sss" scoped>
</style>