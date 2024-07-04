<template>
  <div style="margin-top:30px;margin-left:100px;padding-bottom:100px;">
    <el-form :model="lubricationForm" ref="lubricationRef" label-width="220px">
      <el-row v-for="(item, index) in lubricationForm" :key="index">
        <el-col :span="24">
          <el-form-item :required="item.required">
            <span slot="label">{{ item.name }}{{item.nameKey=='key_lup_17'?'（'+item.unit +'）':''}}：</span>
            <div>
              <sapn v-if="item.type == 'string' && item.value">{{ item.value }}</sapn> <span v-if="item.unit && item.value && item.nameKey!='key_lup_17'">({{ item.unit }})</span>
              <span v-if="item.children.length && item.type == 'string' && item.children[0].value && item.value">({{ item.children[0].value }})</span>
              <span v-if="item.type == 'string' && !item.value && item.required" style="color:#dd0000;font-family:MicrosoftYaHei;">暂无，请补充</span>
              <span v-if="item.type == 'string' && !item.value && !item.required" style="color:#666;font-family:MicrosoftYaHei;">暂无</span>
              <div v-if="item.type == 'img2' && item.imgFullDtoUrl.length > 0">
                <div v-for="(pic, index2) in item.imgFullDtoUrl" :key="index2">
                  <img style="width:120px" :src="pic.url" />
                </div>
              </div>
              <div v-if="item.type == 'img2' && item.imgFullDtoUrl.length == 0 && !item.required">
                <span style="color:#666;">暂无</span>
              </div>
              <div v-if="item.type == 'img2' && item.imgFullDtoUrl.length == 0 && item.required">
                <span style="color:#dd0000;">暂无，请补充</span>
              </div>
            </div>
            <el-input
              v-if="(item.type == 'input1' || item.type == 'input2') && type == 'edit'"
              clearable
              placeholder="--请输入--"
              size="small"
              :maxlength="item.length"
              style="width:300px"
              v-model="item.value"
            ></el-input>
            <div style="font-size:14px;color:#C0C4CC" v-if="item.type == 'img' && type == 'edit'">(最多添加一张照片)</div>
            <el-radio-group v-model="item.value" v-if="type == 'edit' && item.type == 'radio1'" @change="val => handleRadio1(val, item)">
              <el-radio v-for="(it, idx) in item.fieldOption" :label="it.value" :key="idx">{{ it.option }}</el-radio>
            </el-radio-group>
            <el-input-number v-if="type == 'edit' && item.type == 'stepper'" size="medium" :precision="2" v-model="item.value" :min="0" :step="1"></el-input-number>
            <el-radio-group v-model="item.value" v-if="type == 'edit' && item.type == 'radio2'">
              <el-radio v-for="(it, idx) in item.fieldOption" :label="it.value" :key="idx">{{ it.option }}</el-radio>
            </el-radio-group>
            <el-radio-group v-model="item.value" v-if="type == 'edit' && item.type == 'radio5'">
              <el-radio v-for="(it, idx) in item.fieldOption" :label="it.value" :key="idx">{{ it.option }}</el-radio>
            </el-radio-group>
            <!-- <span v-if="item.unit && type == 'edit'">{{item.unit}}</span> -->
            <!-- 液压系统-特殊字段处理 -->
            <div v-if="item.type == 'dropdown' && (item.nameKey == 'key_lup_15' || item.nameKey == 'key_lup_16')">
              <el-col :span="18">
                <el-select size="small" clearable v-model="item.value" placeholder="--请选择--">
                  <el-option v-for="filed in item.fieldOption" :key="filed.value" :label="filed.option" :value="filed.option"></el-option>
                </el-select>
                <el-input clearable placeholder="--请输入--" size="small" style="width:220px" :maxlength="item.children[0].length" v-model="item.children[0].value"></el-input>
              </el-col>
            </div>
            <!-- 润滑点图片 -->
            <el-upload
              v-if="item.type == 'img' && type == 'edit'"
              :class="{'noUploadBtn':item.imgFullDtoUrl.length>0 || notShowUploadBtn}"
              :action="uploadUrl"
              accept="image/*" 
              list-type="picture-card"
              :limit=1
              :auto-upload="false"
              :file-list="item.imgFullDtoUrl"
              :before-upload="beforelubricationImgUpload"
              :on-change="addFileChange"
              :on-preview="handlePictureCardPreview"
              :on-remove="removeFileChange">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="imgDialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <el-date-picker
              v-if="type == 'edit' && item.type == 'datepicker'"
              size="small"
              v-model="item.value"
              type="date"
              value-format="yyyy-MM-dd"
              @change="dateChange(item)"
              placeholder="--选择日期--"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="item.type == 'string' && item.children && item.children.length && item.nameKey != 'lup_method' && item.valueCode == '1'">
          <div v-for="(itemChild, index1) in item.children" :key="index1" style="line-height:30px;font-size:14px;color:#606266;margin-bottom:22px;">
            <span style="width:214px;display:inline-block;text-align:right;" v-if="itemChild.unit">{{ itemChild.name }}{{ itemChild.unit }}：</span>
            <span style="width:214px;display:inline-block;text-align:right;" v-else>{{ itemChild.name }}：</span>
            <sapn>{{ itemChild.value }}</sapn>
          </div>
        </el-col>
        <div v-if="item.type == 'radio2' && item.value == item.children[0].valueCode">
          <el-form-item :label="item.children[0].name + '：'" :required="item.children[0].required">
            <span v-if="type == 'view' && item.children[0].type == 'datepicker'">{{ item.children[0].value }}</span>
            <el-date-picker v-if="type == 'edit'" size="small" v-model="item.children[0].value" type="date" :picker-options="todayBeforeOptions" value-format="yyyy-MM-dd" placeholder="--选择日期--">
            </el-date-picker>
          </el-form-item>
        </div>
        <div v-if="item.type == 'radio5' && item.value == item.children[0].valueCode" v-for="(cylinder, index) in item.children" :key="index">
          <el-form-item :label="cylinder.name + '：'" :required="cylinder.required">
            <span v-if="type == 'view'">{{ cylinder.value }}</span>
            <el-input
              v-if="(cylinder.type == 'input1' || cylinder.type == 'input2') && type == 'edit'"
              clearable
              placeholder="--请输入--"
              size="small"
              style="width:350px"
              :maxlength="cylinder.length"
              v-model="cylinder.value"
            ></el-input>
            <!-- dropdown1  这种类型的下拉框调用字典接口获取下拉信息 -->
            <el-select v-if="type == 'edit' && cylinder.type == 'dropdown1'" size="small" clearable v-model="cylinder.value" placeholder="--请选择--" @change="changeselect(cylinder.valueCode)">
              <el-option v-for="(dic, index) in cylinder.dicList" :key="dic.code" :label="dic.name" :value="dic.name"></el-option>
            </el-select>
            <!-- 设备制造商推荐油品 -->
            <el-cascader
              v-if="type == 'edit' && cylinder.type == 'dropdown' && cylinder.nameKey == 'lup_recommend_oil'"
              ref="cylinderRef"
              :options="oilBrandList"
              v-model="cylinder.valueCode"
              :show-all-levels="false"
              size="small"
              filterable
              @change="cylinderRecommendChange(cylinder)"
              :props="{
                value: 'oilNumber',
                label: 'oilName',
                children: 'children'
              }"
              clearable
            >
              <template slot="empty">
                <div style="display:flex;align-items:center;justify-content: center;padding: 5px 0px;">
                  暂无匹配数据<el-link style="margin-left:10px;color:#409EFF" @click="addRecommendOil('2')">去添加</el-link>
                </div>
              </template>
            </el-cascader>
            <!-- 在用油品牌 -->
            <el-select
              v-if="type == 'edit' && cylinder.type == 'dropdown' && cylinder.nameKey == 'lup_oil_brand'"
              size="small"
              clearable
              v-model="cylinder.valueCode"
              placeholder="--请选择--"
              @change="cylinderChangeOilBrand(cylinder.valueCode)"
              @clear="clearOilBrand('cylinder')"
            >
              <el-option v-for="list in oilBrandList" :key="list.oilNumber" :label="list.oilName" :value="list.oilNumber"></el-option>
            </el-select>
            <!-- 在用油名称 -->
            <el-cascader
              v-if="type == 'edit' && cylinder.type == 'dropdown' && cylinder.nameKey == 'lup_current_oil'"
              ref="cylinderCurrentOilRef"
              :options="cylinderOilNameList"
              v-model="cylinder.valueCode"
              :key="cylinderOilNameKey"
              size="small"
              filterable
              :show-all-levels="false"
              @change="cylinderOilNameChange(cylinder)"
              :props="{
                value: 'oilNumber',
                label: 'oilName',
                children: 'children'
              }"
              clearable
            >
              <template slot="empty" v-if="cylinderCurrentBrandCode">
                <div style="display:flex;align-items:center;justify-content: center;padding: 5px 0px;">
                  暂无匹配数据<el-link style="margin-left:10px;color:#409EFF" v-if="cylinderCurrentBrandCode != 'oil_0001'" @click="addOilName('2')">去添加</el-link>
                </div>
              </template>
            </el-cascader>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
    <!-- 润滑点设备类型细分 -->
    <el-form ref="lubForm" :model="lubClassifyDetailList" label-width="220px" v-if="radioVal">
      <div v-for="(lub, key) in lubClassifyDetailList" :key="key">
        <el-form-item :label="lub.unit ? lub.name + '（' + lub.unit + '）' : lub.name + '：'" :required="lub.required">
          <!-- 压缩机润滑方式 -->
          <el-input
            v-if="lub.nameKey == 'key_459' || lub.nameKey == 'key_463'"
            clearable
            placeholder="--请输入--"
            size="small"
            style="width:220px"
            :maxlength="lub.length"
            v-model="lub.value"
          ></el-input>
          <!-- 油品外观是否正常（观察孔） -->
          <el-radio-group v-model="lub.value" v-if="type == 'edit' && lub.type == 'radio1'">
            <el-radio v-for="(it, idx) in lub.fieldOption" :label="it.value" :key="idx">{{ it.option }}</el-radio>
          </el-radio-group>
          <!--润滑油过滤器更换周期，油气分离器更换周期 -->
          <el-input
            clearable
            v-if="lub.type == 'input2' && (lub.nameKey == 'key_462' || lub.nameKey == 'key_461')"
            placeholder="--请输入--"
            size="small"
            style="width:220px"
            :maxlength="lub.length"
            v-model="lub.value"
          ></el-input>
          <!-- 离心式-油品外观 -->
          <el-select v-if="type == 'edit' && lub.type == 'dropdown1'" size="small" clearable v-model="lub.value" placeholder="--请选择--">
            <el-option v-for="(dic, index) in oilAppearanceList" :key="dic.code" :label="dic.name" :value="dic.name"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <!-- 油类 -->
    <el-form ref="class1Form" :model="classList" label-width="220px" v-if="oilType == 1">
      <!-- 油类字段 -->
      <div v-for="(classify, key_index) in classList" :key="key_index" :style="{ display: classify.display ? 'block' : 'none' }">
        <el-form-item :required="classify.required">
          <span slot="label">{{ classify.name }}：</span>
          <span v-if="classify.type == 'string' && !classify.value && classify.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
          <span v-if="classify.type == 'string' && !classify.value && !classify.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
          <span>{{ classify.value }}</span><span  v-if="classify.value && classify.children && classify.children.length && classify.children[0].value && classify.nameKey != 'key_lup_12' && classify.nameKey != 'key_lup_7' && classify.nameKey != 'key_lup_3'"
            >({{ classify.children[0].value }})</span
          >
        </el-form-item>
        <div v-for="(classifyChild, key_index2) in classify.children" :key="key_index2" v-if="classify.children && classify.children.length && classify.value == '是'">
          <el-form-item :required="classifyChild.required">
            <span slot="label">{{ classifyChild.name }}：</span>
            <span v-if="classifyChild.type == 'string' && !classifyChild.value && classifyChild.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
            <span v-if="classifyChild.type == 'string' && !classifyChild.value && !classifyChild.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
            <span>{{ classifyChild.value }}</span>
            <span v-if="classifyChild.value && classifyChild.children && classifyChild.children.length && classifyChild.children[0].value && classifyChild.nameKey != 'key_lup_12'">({{ classifyChild.children[0].value }})</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- 脂类 -->
    <el-form ref="class2Form" :model="classList" label-width="220px" v-if="oilType == 2">
      <!-- 脂类字段 -->
      <div v-for="(classify, key_index) in classList" :key="key_index" :style="{ display: classify.display ? 'block' : 'none' }">
        <el-form-item :required="classify.required">
          <span slot="label">{{ classify.name }}：</span>
          <span v-if="classify.type == 'string' && !classify.value && classify.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
          <span v-if="classify.type == 'string' && !classify.value && !classify.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
          <span>{{ classify.value }}</span>
          <span v-if="classify.children && classify.children.length && classify.children[0].value && classify.nameKey != 'key_lup_12' && classify.value">({{ classify.children[0].value }})</span>
        </el-form-item>
        <div v-for="(classifyChild, key_index2) in classify.children" :key="key_index2" v-if="classify.children && classify.children.length && classify.value == '是'">
          <el-form-item :required="classifyChild.required">
            <span slot="label">{{ classifyChild.name }}：</span>
            <span v-if="classifyChild.type == 'string' && !classifyChild.value && classifyChild.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
            <span v-if="classifyChild.type == 'string' && !classifyChild.value && !classifyChild.required" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
            <span>{{ classifyChild.value }}</span>
            <span v-if="classifyChild.children && classifyChild.children.length && classifyChild.children[0].value && classifyChild.nameKey != 'key_lup_12' && classifyChild.value">({{ classifyChild.children[0].value }})</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div style="display:flex;align-items:center;">
      <!-- <div @click="handleRefresh" style="color:#001450;font-weight:normal;font-size:13px;margin-right:20px;cursor: pointer;">
        <i class="el-icon-refresh-right" style="margin-right:4px;"></i>刷新数据
      </div> -->
      <div @click="handleEdit" style="color:#001450;font-weight:normal;font-size:13px;cursor: pointer;"><i class="el-icon-edit" style="margin-right:4px;"></i> 前往补充</div>
    </div>
    <!-- 设备制造商推荐油品新增 -->
    <el-dialog title="手动添加油品" :visible.sync="addOilDialog" width="30%" :close-on-click-modal="false">
      <el-form :model="addOilForm" :rules="addOilRules" ref="addOilRef" class="demo-ruleForm ">
        <el-form-item class="filterConditionType" prop="oilBrand" label="油品品牌">
          <el-select v-if="addType == 'recommend'" size="small" placeholder="请选择" clearable v-model="addOilForm.oilBrand" @change="selectOilBrandAdd" style="width:60%">
            <el-option v-for="item in oilBrandListAdd" :key="item.oilNumber" :label="item.nameCn" :value="item.oilNumber"></el-option>
          </el-select>
          <span v-else>{{ addBrandNameType == "1" ? currentOilBrandName : cylinderCurrentBrandName }}</span>
        </el-form-item>
        <el-form-item class="filterConditionType" prop="oilType" label="油品类型">
          <el-select size="small" placeholder="请选择" clearable v-model="addOilForm.oilType" style="width:60%">
            <el-option v-for="item in oilTypeListAdd" :key="item.oilNumber" :label="item.nameCn" :value="item.oilNumber"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="filterConditionType" prop="oilName" label="油品名称">
          <el-input v-model="addOilForm.oilName" style="width:60%" placeholder="请输入" size="small" clearable maxlength="25"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAddOil('addOilRef')" size="small">取 消</el-button>
        <el-button type="danger" @click="completeAddOil('addOilRef')" size="small">完 成</el-button>
      </span>
    </el-dialog>
    <!-- 编辑设备弹框 -->
    <CreateDevice
      v-if="addDeviceDialog"
      :deviceTypeDialog="deviceTypeDialog"
      :selectLubricationPointNumber="selectLubricationPointNumber"
      :addDeviceDialog="addDeviceDialog"
      :epInfo='epInfo'
      :resource="resource"
      v-on:addOrEditDeviceAndLumpoint="addOrEditDeviceAndLumpoint"
      v-on:closeDialogAddDevice="closeDialogAddDevice"
    />
  </div>
</template>

<script>
import CreateDevice from '../../equipment/components/CreateDevice.vue'
import lubricationInfo from "../mixins/lubricationInfo";
export default {
  mixins: [lubricationInfo],
  components: { CreateDevice },
  props: {
    type: {
      type: String,
      default: () => {
        return "";
      }
    },
    deviceObj: {
      type: Array,
      default: () => {
        return [];
      }
    },
    lubricationObj: {
      type: Array,
      default: () => {
        return [];
      }
    },
    saveParams: {
      type: Object,
      default: () => {
        return [];
      }
    },
    lubricationPointTypeCode: {
      type: String,
      default: () => {
        return "";
      }
    },
    oilType: {
      type: Number,
      default: () => {
        return null;
      }
    }
  },
  data() {
    return {
      resource: '',
      epInfo: {},
      addDeviceDialog: false,
      deviceTypeDialog: 'editDeviceAndLumPoint',
      selectLubricationPointNumber: "",
      // 日期限制，今天之前可选
      todayBeforeOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      // 日期限制，今天之后可选
      todayAfterOptions: {
        disabledDate(time) {
          const currentY = new Date().getFullYear() + 21;
          const currentM = new Date().getMonth();
          const currentD = new Date().getDay() + 1;
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > new Date(currentY, currentM, currentD).getTime();
        }
      }
    };
  },
  watch: {},
  created() {
    //设备信息中是否有润滑点设备细分选项
    let is_lup_device_detail_value = "";
    let data = [];
    this.deviceObj.forEach(item => {
      if (item.nameKey == "lup_device_detail") {
        is_lup_device_detail_value = item.valueCode;
      }
    });
    if (is_lup_device_detail_value) {
      this.lubricationObj.forEach(it => {
        if (it.valueCode == is_lup_device_detail_value) {
          data = it.children;
        }
      });
    } else {
      data = this.lubricationObj;
    }
    this.lubricationForm = data;
    this.lubricationForm.forEach(item => {
      if (item.nameKey == "lup_oil_brand") {
        this.tempOilBrandCode = item.valueCode;
        this.currentOilBrandName = item.value;
      }
      if (item.type == "radio5") {
        item.children.forEach(it => {
          if (it.nameKey == "lup_oil_brand") {
            this.cylinderCurrentBrandCode = it.valueCode;
            this.cylinderCurrentBrandName = it.value;
          }
        });
      }
    });
    // 找出dropdown1类型
    this.lubricationForm.forEach(item => {
      if (item.type == "dropdown1") {
        this.getDicList(item.nameKey);
      }
      if (item.type == "radio5") {
        item.children.forEach(it => {
          if (it.type == "dropdown1") {
            this.getCylinderListDic(it.nameKey);
          }
        });
      }
    });
    // 找出油类/脂类对应字段
    let list = [];
    let key = this.oilType == 1 ? "key_you_lei" : "key_zhi_lei";
    this.lubricationForm.forEach(it => {
      if (it.nameKey == "lup_method") {
        list = it.children;
      }
    });
    let childList = [];
    list.forEach(item => {
      if (item.nameKey == key) {
        childList = item.children;
      }
    });
    this.classList = childList;
    // 润滑点设备类型细分
    let radioVal = null;
    let radioItem = {};
    this.lubricationForm.forEach(it => {
      if (it.nameKey == "lup_device_detail") {
        radioVal = it.value;
        radioItem = it;
      }
    });
    if (radioVal) {
      this.handleRadio1(radioVal, radioItem);
    }
    this.handleRefresh()
    this.getOilBrandData();
    this.getOilList();
    this.getLubricationPointTypeList();
  },
  methods: {
     // 取消编辑设备
    closeDialogAddDevice() {
      this.addDeviceDialog = false
    },  
    // 编辑设备弹框点击确定
    addOrEditDeviceAndLumpoint() {
      this.addDeviceDialog = false
      this.handleRefresh()
    },
  }
};
</script>

<style lang="less">
.el-upload-list__item {
  transition: none !important;
}
.hide .el-upload--picture-card {
  display: none;
}
/deep/.el-form-item__label-wrap {
  margin-left: 76px;
}
/deep/.el-form-item__content {
  margin-left: 166px;
}
</style>
