<template>
    <div>
        <el-dialog :title="dialogTitle" :visible.sync="addOilDialog" width="30%" :close-on-click-modal="false"  :before-close="cancelAddOil">
            <el-form :model="addOilForm" :rules="addOilRules" ref="addOilRef" class="demo-ruleForm" label-width="100px" label-position="left">
                <!-- 新建行业 -->
                <div v-if="addType=='addIndustry'">
                    <el-form-item class="filterConditionType" prop="industryName" label="行业">
                        <el-input v-model="addOilForm.industryName"  style="width: 60%" size="small" clearable maxlength="50" placeholder="请输入行业"></el-input>
                    </el-form-item>
                </div>
                <!-- 编辑行业 -->
                <div v-if="addType=='editIndustry'">
                    <el-form-item class="filterConditionType" prop="industry" label="行业">
                        <el-select disabled size="small" clearable  v-model="addOilForm.industry" @change="selectIndustryAdd" style="width: 60%">
                        <el-option  v-for="item in industryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType"  label="" >
                        <el-input v-model="addOilForm.industryName" style="width: 60%" size="small" clearable maxlength="50" placeholder="请输入行业"></el-input>
                    </el-form-item>
                </div>
                <!-- 新建细分行业 -->
                <div v-if="addType=='addSubdivideIndustries'">
                    <el-form-item class="filterConditionType" prop="industry" label="行业">
                        <el-select size="small" clearable  v-model="addOilForm.industry" @change="selectIndustryAdd" style="width: 60%">
                        <el-option v-for="item in industryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="subdivideIndustryName" label="细分行业" >
                        <el-input v-model="addOilForm.subdivideIndustryName"  style="width: 60%" size="small" clearable maxlength="50" placeholder="请输入细分行业"></el-input>
                    </el-form-item>
                </div>
                 <!-- 编辑细分行业 -->
                 <div v-if="addType=='editSubdivideIndustries'">
                    <el-form-item class="filterConditionType" prop="industry" label="行业">
                        <el-select size="small" clearable  v-model="addOilForm.industry" @change="selectIndustryAdd" style="width: 60%">
                        <el-option v-for="item in industryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="subdivideIndustry" label="细分行业" >
                        <el-select disabled size="small" clearable v-model="addOilForm.subdivideIndustry" @change="selectSubdivideIndustry"  style="width: 60%">
                            <el-option v-for="item in subdivideIndustryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType"  label="" >
                        <el-input v-model="addOilForm.subdivideIndustryName"  style="width: 60%" size="small" clearable maxlength="50" placeholder="请输入细分行业"></el-input>
                    </el-form-item>
                </div>
                <!-- 新建设备 -->
                <div v-if="addType=='addEquip'">
                    <el-form-item class="filterConditionType" prop="industry" label="行业">
                        <el-select size="small" clearable  v-model="addOilForm.industry" @change="selectIndustryAdd" style="width: 60%">
                        <el-option v-for="item in industryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="subdivideIndustry" label="细分行业" >
                        <el-select size="small" clearable v-model="addOilForm.subdivideIndustry" @change="selectSubdivideIndustry"  style="width: 60%">
                            <el-option v-for="item in subdivideIndustryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="equip" label="设备">
                        <el-input v-model="addOilForm.equip"  style="width: 60%" size="small" clearable maxlength="50" placeholder="请输入设备"></el-input>
                    </el-form-item>
                </div>
                <!-- 编辑设备 -->
                <div v-if="addType=='editEquip'">
                    <el-form-item class="filterConditionType" prop="industry" label="行业">
                        <el-select size="small" clearable  v-model="addOilForm.industry" @change="selectIndustryAdd" style="width: 60%">
                        <el-option v-for="item in industryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="subdivideIndustry" label="细分行业" >
                        <el-select size="small" clearable v-model="addOilForm.subdivideIndustry" @change="selectSubdivideIndustry"  style="width: 60%">
                            <el-option v-for="item in subdivideIndustryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="equip" label="设备" >
                        <el-select size="small" clearable v-model="addOilForm.equip" disabled  style="width: 60%">
                            <el-option v-for="item in equipList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType"  label="">
                        <el-input v-model="addOilForm.equipNameAdd"   style="width: 60%" size="small" placeholder="请输入设备" clearable maxlength="50"></el-input>
                    </el-form-item>
                </div>
                <!-- 新建细分设备 -->
                <div v-if="addType=='addSubdivideEquip'">
                    <el-form-item class="filterConditionType" prop="industry" label="行业">
                        <el-select size="small" clearable  v-model="addOilForm.industry" @change="selectIndustryAdd" style="width: 60%">
                        <el-option v-for="item in industryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="subdivideIndustry" label="细分行业" >
                        <el-select size="small" clearable v-model="addOilForm.subdivideIndustry" @change="selectSubdivideIndustry"  style="width: 60%">
                            <el-option v-for="item in subdivideIndustryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="equip" label="设备" >
                        <el-select size="small" clearable v-model="addOilForm.equip" @change="selectEquip"  style="width: 60%">
                            <el-option v-for="item in equipList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="equipName" label="细分设备">
                        <el-input v-model="addOilForm.equipName"    style="width: 60%" size="small" clearable maxlength="50"></el-input>
                    </el-form-item>
                </div>
                
               
                <!--  编辑细分设备-->
                <div v-if="addType=='editSubdivideEquip'">
                    <el-form-item class="filterConditionType" prop="industry" label="行业">
                        <el-select size="small" clearable  v-model="addOilForm.industry" @change="selectIndustryAdd" style="width: 60%">
                        <el-option v-for="item in industryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="subdivideIndustry" label="细分行业" >
                        <el-select  size="small" clearable v-model="addOilForm.subdivideIndustry" @change="selectSubdivideIndustry"  style="width: 60%">
                            <el-option v-for="item in subdivideIndustryListAdd" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="equip" label="设备" >
                        <el-select  size="small" clearable v-model="addOilForm.equip" @change="selectEquip"  style="width: 60%">
                            <el-option v-for="item in equipList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType" prop="subdivideEquip" label="细分设备" >
                        <el-select disabled size="small" clearable v-model="addOilForm.subdivideEquip" @change="selectSubdivideIndustry"  style="width: 60%">
                            <el-option v-for="item in equipSubdivideList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="filterConditionType"  label="" >
                        <el-input v-model="addOilForm.subdivideEquipName"  style="width: 60%" size="small" clearable maxlength="50" placeholder="请输入细分设备"></el-input>
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
  import { closeLoading } from "@/api/request.js";
  export default {
    props: {
    addOilDialog: {
        type: Boolean,
        default: () => {
          return false;
        },
      },
      state: {
        type: String,
        default: ''
      },
      dialogTitle: {
        type: String,
        default: ''
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
      selectOilTypeObj: {
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
        industryListAdd: [],
        subdivideIndustryListAdd: [],
        equipList:[],  // 设备数据
        equipSubdivideList:[],  // 细分设备数据
        brandError:false,
        typeError:false,
        nameError:false,
        noticeError:'',
        noticeErrorBrand:'',
        noticeErrorType:'',
        // 手动添加油品弹框
        addOilForm: {
          industry: "",
          subdivideIndustry: "",
          equip: "",
        },
        checkOilName:false,  // 校验名称是否重复
        addOilRules: {
          industry: [{ required: true, message: "请选择行业", trigger: "change" }],
          industry: [{ required: true, message: "请输入行业", trigger: "blur" }],
          equip: [{ required: true, message: "请输入设备", trigger: "blur" }],
          equipName: [{ required: true, message: "请输入细分设备", trigger: "blur" }],
          subdivideIndustry: [{ required: true, message: "请输入细分行业", trigger: "blur" }],
          subdivideIndustry: [{ required: true, message: "请选择细分行业", trigger: "change" }],
          subdivideEquip: [{ required: true, message: "请选择细分设备", trigger: "change" }],
          subdivideEquipName: [{ required: true, message: "请输入细分设备", trigger: "blur" }],
          equipNameAdd: [{ required: true, message: "请输入设备", trigger: "blur" }],
          subdivideIndustryName: [{ required: true, message: "请输入细分行业", trigger: "blur" }],
          industryName: [{ required: true, message: "请输入行业", trigger: "blur" }],
        },
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {
      // 获取品牌数据
      getOilBrandData() {
        const params = {
          state: 1
        };
        this.requestMethodGet("web/config/industryDevice/queryIndustryDeviceList", params).then((res) => {
          if (res.data.code == 1000) {
            const data = res.data.data;
            this.industryListAdd = data.industryList;
            console.log(this.industryListAdd)
          } else {
            this.$message({
              message: res.data.msg,
              type: "error",
            });
          }
        });
      },
      // 行业的下拉选择
      selectIndustryAdd() {
        this.getQueryIndustrySearchDeviceList(1, this.addOilForm.industry,'segmentedIndustry')
        // 新建设备
        if(this.addType=='addEquip') { 
          this.$set(this.addOilForm, 'subdivideIndustry', '')
        }
        // 新建细分设备
        if(this.addType=='addSubdivideEquip') { 
          this.$set(this.addOilForm, 'subdivideIndustry', '')
          this.$set(this.addOilForm, 'equip', '')
          this.$set(this.addOilForm, 'equipName', '')
          this.equipList=[]
        }
        // 编辑设备
        if(this.addType=='editEquip') { 
          this.$set(this.addOilForm, 'subdivideIndustry', '')
        }
        // 编辑细分设备
        if(this.addType=='editSubdivideEquip') { 
          this.$set(this.addOilForm, 'subdivideIndustry', '')
          this.$set(this.addOilForm, 'equip', '')
          this.$set(this.addOilForm, 'subdivideEquipName', '')
          this.equipList=[]
        }
      },
      // 细分行业的下拉选择
      selectSubdivideIndustry() {
         // 编辑细分设备
         if(this.addType=='editSubdivideEquip') { 
          this.$set(this.addOilForm, 'equip', '')
          this.$set(this.addOilForm, 'equipName', '')
        }
        if(this.addType=='addSubdivideEquip') {
          console.log(888888)
          this.$set(this.addOilForm, 'equip', '')
          this.$set(this.addOilForm, 'equipName', '')
        }
        this.getQueryIndustrySearchDeviceList(2, this.addOilForm.subdivideIndustry,'equip')
      },
      // 设备下拉
      selectEquip() {
        this.$set(this.addOilForm, 'equipName', '')
      },
      // 取消自定义油品
      cancelAddOil() {
        this.$nextTick(()=>{
          this.$refs["addOilRef"].resetFields();
        })
        Object.assign(this.$data.addOilForm, this.$options.data().addOilForm)
        this.$emit("closeDialogAdd");
      },
      // 获取细分行业数据
      getQueryIndustrySearchDeviceList(level,code,type) {  
        console.log(level,code,type)
        this.requestMethodGet("/web/config/industryDevice/clickQueryIndustrySearchDeviceList",{industryCode:code,state:1,level:level}).then(res => {
          if(res.data.code == 1000) {
            if(type=='segmentedIndustry') {
              this.subdivideIndustryListAdd = res.data.data;
            }
            if(type=='equip') {
              this.equipList = res.data.data;
            }
            if(type=='equipSubdivide') {
              this.equipSubdivideList = res.data.data;
            }
              
          }
          }).catch(res => {
          });
      },
      completeAddOil(formName){
        this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(12222)
          this.$emit("addOrEditDevice", this.addOilForm);
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