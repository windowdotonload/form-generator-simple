<template>
  <div>
    <el-dialog title="创建润滑点" :visible.sync="dialogFlag" width="40%" :close-on-click-modal="false" :before-close="cancelDialog">
      <!-- 润滑点 -->
      <div class="lup-content">
        <!-- 润滑点信息 -->
        <div class="info-title">
          <div class="line"></div>
          <div class="title">润滑点信息</div>
        </div>
        <div class="form-content">
          <el-form ref="lupRuleForm" :rules="rules" :model="ruleForm" label-width="100px" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <!-- style修改，绑定zdyIsHeight，data创建一个对应变量，然后watch设置监听zdyIsShow的改变，改变zdyIsHeight的值 -->
                <el-form-item label="润滑点设备名称" :prop="(lupDeviceNameList.length<=1 || ruleForm.lubricationPointSelectName=='自定义')?'lubricationPointName':'lubricationPointSelectName'">
                  <div style="display: flex;" v-if="lupDeviceNameList.length>1">
                    <el-select
                      v-model="ruleForm.lubricationPointSelectName"
                      placeholder="请选择润滑点设备名称"
                      size="small"
                      :style="{width:(ruleForm.lubricationPointSelectName=='自定义')?'30%':'80%',marginRight:(ruleForm.lubricationPointSelectName=='自定义')?'5px':''}"
                    >
                      <el-option  
                        v-for="item in lupDeviceNameList" 
                        :key="item.lubPointName" 
                        :label="item.lubPointName" 
                        :value="item.lubPointName"
                        :style="{color:(item.lubPointName=='自定义'?'blue':'#606266')}">
                      </el-option>
                    </el-select>
                    <el-input size="small"
                    :style="{width:(ruleForm.lubricationPointSelectName=='自定义')?'50%':'80%'}"
                    v-if="ruleForm.lubricationPointSelectName=='自定义'"
                    v-model="ruleForm.lubricationPointName" maxlength="50" clearable placeholder="请输入"></el-input>
                  </div>
                  <div v-else>
                    <el-input size="small"
                    v-model="ruleForm.lubricationPointName" 
                    maxlength="50" 
                    style="width:80%"
                    clearable 
                    placeholder="请输入"></el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <!-- 这里也改变 -->
                <el-form-item label="润滑点设备类型" prop="lubricationPointTypeCode">
                  <span slot="label">
                    润滑点设备类型
                    <el-tooltip class="item" effect="dark" placement="top-start">
                      <div slot="content" style="max-width: 400px; line-height: 18px">
                        1. 蒸汽轮机、燃气轮机、造纸机类型仅对应其循环系统 <br />
                        2. 商用车对应的润滑点设备类型选择如下：
                        发动机请选择“发动机”，变速箱/差速器/终传动/轮边减速器请选择“闭式齿轮”，轮毂轴承/其它回转设备滚动轴承请选择“滚动轴承”，刹车系统/液压系统请选择“液压系统”，开式齿轮请选择“开式齿轮”，冷却系统/销轴请选择“其它”
                      </div>
                      <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                        <i class="el-icon-warning-outline"></i>
                      </el-button>
                    </el-tooltip>
                  </span>
                  <el-select v-model="ruleForm.lubricationPointTypeCode" placeholder="请选择" size="small" style="width: 80%" @change="handleLubricationPointTypeChange">
                    <el-option v-for="item in lubricationPointTypeList" :key="item.code" :label="item.name" :value="item.code" clearable> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="height: 80px">
                <el-form-item label="润滑⽅式" prop="lubricationMethod">
                  <el-select
                    size="small"
                    clearable
                    v-model="ruleForm.lubricationMethod"
                    placeholder="请选择"
                    style="width: 80%"
                    no-data-text="请先选择润滑点设备类型"
                    @change="handlelubricationMethodChange"
                  >
                    <el-option v-for="item in lubricationPointTypeData" :key="item.code" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="height: 80px">
                <el-form-item label="在用油品名称" prop="currentOilCode">
                  <el-select 
                    ref="cascaderRef"
                    size="small" 
                    v-model="ruleForm.currentOilCode" 
                    placeholder="试试搜索：油品名称" 
                    clearable
                    filterable
                    no-data-text="请先选择在用油品牌"
                    remote
                    :loading="loadingRemote"
                    @focus="getOilList('')"
                    :remote-method="getOilList"
                    @change="oilNameChange"
                    style="width:80%">
                    <el-option v-for="item in oilList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                    <template slot="empty">
                      <div style="text-align:center;padding:5px;color:grey;" v-if="loadingRemote">
                        加载中
                      </div>
                      <div style="display: flex; align-items: center; justify-content: center; padding: 5px 0px" v-else>
                        暂无匹配数据<el-link style="margin-left: 10px; color: #409eff" @click="createOil('oilName')">去添加</el-link>
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="height: 80px">
                <el-form-item prop="oilBoxCapacity">
                  <el-col :span="11" style="padding: 0">
                    <el-form-item
                      prop="oilBoxCapacity"
                      label="油箱容量"
                      :rules="[
                        { required: ruleForm.oilTypeDevice != 2 ? true : false, message: '请输入油箱容量', trigger: 'blur' },
                        { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' },
                      ]"
                    >
                      <el-input size="small" v-model="ruleForm.oilBoxCapacity" maxlength="10" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="oilBoxCapacityUnit" :rules="[{ required: ruleForm.oilTypeDevice != 2 ? true : false, message: '请选择油箱容量单位', trigger: 'change' }]">
                      <span slot="label">单位</span>
                      <el-select size="small" clearable v-model="ruleForm.oilBoxCapacityUnit">
                        <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>

              <el-col :span="12" style="height: 80px">
                <el-form-item label="润滑点设备制造商名称" prop="lubricationPointManufacturer">
                  <el-input size="small" v-model="ruleForm.lubricationPointManufacturer" maxlength="50" clearable placeholder="请输入" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备制造商推荐油品" prop="recommendOilCode">
                  <el-select 
                    ref="cascaderRef"
                    size="small" 
                    v-model="ruleForm.recommendOilCode" 
                    placeholder="试试搜索：油品名称" 
                    clearable
                    filterable
                    no-data-text="请先选择在用油品牌"
                    remote
                    :loading="loadingRemote"
                    :remote-method="getOilList"
                    @focus="getOilList('')"
                    @change="selectRecommendOilName"
                    style="width:80%">
                    <el-option v-for="item in oilList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                    <template slot="empty">
                      <div style="text-align:center;padding:5px;color:grey;" v-if="loadingRemote">
                        加载中
                      </div>
                      <div style="display: flex; align-items: center; justify-content: center; padding: 5px 0px" v-else>
                        暂无匹配数据<el-link style="margin-left: 10px; color: #409eff" @click="createOil('currentName')">去添加</el-link>
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item>
                  <div style="margin-bottom: 15px"><span slot="label">润滑点图片</span><span slot="label" style="color: #999">（支持.png.jpg.svn.gif图片格式）</span></div>
                  <el-upload
                    :class="{ hide: hideUpload || imageLubricationList.length > 0 }"
                    :action="uploadUrl"
                    list-type="picture-card"
                    limit="1"
                    :file-list="imageLubricationList"
                    accept="image/*"
                    :auto-upload="false"
                    :on-change="handleAddLubricatePointFile"
                    :on-remove="handleLubricatePointRemove"
                  >
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="描述" prop="lubricationPointDesc">
                  <el-input size="small" type="textarea" :rows="6" v-model="ruleForm.lubricationPointDesc" maxlength="200" placeholder="请输入" style="width: 80%" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 用油信息 -->
        <div class="info-title">
          <div class="line"></div>
          <div class="title">用油信息</div>
        </div>
        <!-- 如果润滑点设备类型选择的是 非滚动轴承 -->
        <div class="form-content" v-if="ruleForm.oilTypeDevice != 2">
          <el-form ref="oilRuleForm" :rules="rules" :model="ruleForm" label-width="100px" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12" v-if="showOrHideState == 0">
                <el-form-item label="定期或按质换油" prop="oilChangeMethod" :rules="[{ required: true, message: '请选择定期或按质换油', trigger: 'change' }]">
                  <el-radio-group v-model="ruleForm.oilChangeMethod">
                    <el-radio :label="1">定期</el-radio>
                    <el-radio :label="2">按质</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12" v-if="showOrHideState == 0" style="height: 80px">
                <el-form-item prop="oilChangePeriod">
                  <el-col :span="11" style="padding: 0; height: 80px">
                    <el-form-item
                      prop="oilChangePeriod"
                      label="换油周期"
                      :rules="[
                        { validator: validatePeriodVal(this.ruleForm), trigger: 'blur' },
                        { required: true, message: '请输入换油周期', trigger: 'blur' },
                        { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' },
                      ]"
                    >
                      <el-input size="small" @change="dateChange('lastOilChangeDate')" v-model="ruleForm.oilChangePeriod" maxlength="10" placeholder="请输入" class="input-with-select" clearable>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9" style="height: 80px">
                    <el-form-item prop="oilChangePeriodUnit">
                      <span slot="label">单位</span>
                      <el-select size="small" @change="dateChange('lastOilChangeDate')" clearable v-model="ruleForm.oilChangePeriodUnit">
                        <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="showOrHideState == 0" style="height: 80px">
                <el-form-item label="上次换油⽇期" prop="lastOilChangeDate">
                  <el-date-picker
                    v-model="ruleForm.lastOilChangeDate"
                    type="date"
                    size="small"
                    @change="dateChange('lastOilChangeDate')"
                    :picker-options="expireTimeOption"
                    style="width: 80%"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="showOrHideState == 0 && ruleForm.lastOilChangeDate" style="height: 80px">
                <el-form-item prop="fillingQuantity">
                  <el-col :span="11" style="padding: 0">
                    <el-form-item
                      prop="fillingQuantity"
                      label="上次换油时加注量"
                      :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                    >
                      <el-input size="small" v-model="ruleForm.fillingQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="fillingQuantityUnit">
                      <span slot="label">单位</span>
                      <el-select size="small" clearable v-model="ruleForm.fillingQuantityUnit">
                        <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
                v-if="showOrHideState == 0 && ruleForm.lastOilChangeDate && ruleForm.oilChangePeriod && ruleForm.oilChangeMethod == 1 && ruleForm.oilChangePeriodUnit != 'KM'"
                style="height: 80px"
              >
                <el-form-item label="是否自动生成下次换油计划？" prop="autoCreateOilChangePlan">
                  <el-radio-group v-model="ruleForm.autoCreateOilChangePlan">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col
                :span="12"
                style="height: 80px"
                v-if="
                  showOrHideState == 0 &&
                  ruleForm.autoCreateOilChangePlan &&
                  ruleForm.oilChangeMethod &&
                  ruleForm.lastOilChangeDate &&
                  ruleForm.oilChangeMethod == 1 &&
                  ruleForm.oilChangePeriod &&
                  ruleForm.oilChangePeriodUnit != 'KM'
                "
              >
                <el-form-item label="预计下次换油日期" prop="nextScheduledOilChangeDate">
                  <el-date-picker
                    v-model="ruleForm.nextScheduledOilChangeDate"
                    type="date"
                    size="small"
                    :picker-options="pickerBeginDateBefore"
                    style="width: 80%"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-col :span="11" style="padding: 0; height: 80px">
                  <el-form-item prop="oilAddPeriod" label="加油周期" :rules="[{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]">
                    <el-input size="small" v-model="ruleForm.oilAddPeriod" maxlength="10" @change="dateChange('lastOilAddDate')" placeholder="请输入" class="input-with-select" clearable> </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item prop="oilAddPeriodUnit">
                    <span slot="label">单位</span>
                    <el-select size="small" clearable @change="dateChange('lastOilAddDate')" v-model="ruleForm.oilAddPeriodUnit">
                      <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上次加油⽇期" prop="lastOilAddDate">
                  <el-date-picker
                    v-model="ruleForm.lastOilAddDate"
                    type="date"
                    size="small"
                    @change="dateChange('lastOilAddDate')"
                    :picker-options="expireTimeOption"
                    style="width: 80%"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="everyTimeOilAddQuantity">
                  <el-col :span="11" style="padding: 0">
                    <el-form-item
                      prop="everyTimeOilAddQuantity"
                      label="每次加油量"
                      :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                    >
                      <el-input size="small" v-model="ruleForm.everyTimeOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="everyTimeOilAddQuantityUnit">
                      <span slot="label">单位</span>
                      <el-select size="small" clearable v-model="ruleForm.everyTimeOilAddQuantityUnit">
                        <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="preMonthOilAddQuantity">
                  <el-col :span="11" style="padding: 0">
                    <el-form-item
                      prop="preMonthOilAddQuantity"
                      label="每月润滑剂添加量"
                      :rules="[
                        { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' },
                        { required: showOrHideState == 1 ? true : false, message: '请输入每月润滑剂添加量', trigger: 'blur' },
                      ]"
                    >
                      <el-input size="small" v-model="ruleForm.preMonthOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="preMonthOilAddQuantityUnit">
                      <span slot="label">单位</span>
                      <el-select size="small" clearable v-model="ruleForm.preMonthOilAddQuantityUnit">
                        <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12" v-if="ruleForm.oilAddPeriod && ruleForm.lastOilAddDate && ruleForm.oilAddPeriodUnit != 'KM'">
                <el-form-item label="是否自动生成下次加油计划？" prop="autoCreateOilAddPlan">
                  <el-radio-group v-model="ruleForm.autoCreateOilAddPlan">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="ruleForm.autoCreateOilAddPlan && ruleForm.lastOilAddDate && ruleForm.oilAddPeriod && ruleForm.oilAddPeriodUnit != 'KM'">
                <el-form-item label="预计下次加油日期" prop="nextScheduledOilAddDate">
                  <el-date-picker
                    v-model="ruleForm.nextScheduledOilAddDate"
                    type="date"
                    :picker-options="pickerBeginDateBefore"
                    size="small"
                    style="width: 80%"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 如果选择的是 滚动轴承 -->
        <div class="form-content" v-if="ruleForm.oilTypeDevice == 2">
          <el-form ref="oilRuleForm1" :rules="rules" :model="ruleForm" label-width="100px" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item prop="oilAddPeriod">
                  <el-col :span="11" style="padding: 0">
                    <el-form-item prop="oilAddPeriod" label="加脂周期" :rules="[{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]">
                      <el-input size="small" @change="dateChange('lastOilAddDate2')" v-model="ruleForm.oilAddPeriod" maxlength="10" placeholder="请输入" class="input-with-select" clearable>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="oilAddPeriodUnit">
                      <span slot="label">单位</span>
                      <el-select size="small" @change="dateChange('lastOilAddDate2')" clearable v-model="ruleForm.oilAddPeriodUnit">
                        <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="everyTimeOilAddQuantity">
                  <el-col :span="11" style="padding: 0">
                    <el-form-item
                      prop="everyTimeOilAddQuantity"
                      label="每次加脂量"
                      :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                    >
                      <el-input size="small" v-model="ruleForm.everyTimeOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="everyTimeOilAddQuantityUnit">
                      <span slot="label">单位</span>
                      <el-select size="small" clearable v-model="ruleForm.everyTimeOilAddQuantityUnit">
                        <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="preMonthOilAddQuantity">
                  <el-col :span="11" style="padding: 0">
                    <el-form-item
                      prop="preMonthOilAddQuantity"
                      label="每月润滑剂添加量"
                      :rules="[
                        { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' },
                        { required: true, message: '请输入每月润滑剂添加量', trigger: 'blur' },
                      ]"
                    >
                      <el-input size="small" v-model="ruleForm.preMonthOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="preMonthOilAddQuantityUnit">
                      <span slot="label">单位</span>
                      <el-select size="small" clearable v-model="ruleForm.preMonthOilAddQuantityUnit">
                        <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上次加脂⽇期" prop="lastOilAddDate">
                  <el-date-picker
                    v-model="ruleForm.lastOilAddDate"
                    type="date"
                    size="small"
                    :picker-options="expireTimeOption"
                    style="width: 80%"
                    @change="dateChange('lastOilAddDate2')"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12" v-if="ruleForm.lastOilAddDate && ruleForm.oilAddPeriod && ruleForm.oilAddPeriodUnit != 'KM'">
                <el-form-item label="是否自动生成下次加脂计划？" prop="autoCreateOilAddPlan">
                  <el-radio-group v-model="ruleForm.autoCreateOilAddPlan">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-if="ruleForm.lastOilAddDate && ruleForm.oilAddPeriod && ruleForm.autoCreateOilAddPlan && ruleForm.oilAddPeriodUnit != 'KM'"
                  label="预计下次加脂日期"
                  prop="nextScheduledOilAddDate"
                >
                  <el-date-picker
                    v-model="ruleForm.nextScheduledOilAddDate"
                    type="date"
                    :picker-options="pickerBeginDateBefore"
                    size="small"
                    style="width: 80%"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancelDialog">取 消</el-button>
        <el-button type="danger" size="small" @click="submitAddLup">提 交</el-button>
      </span>
    </el-dialog>
    <!-- 手动添加油品 -->
    <AddOil :addOilDialog="addOilDialog" :addType="addType" :addOilForm="addOilForm" v-on:addOrEditOil="addOrEditOil" v-on:closeDialogAdd="closeDialogAdd" ref="LupDialogRef" />
  </div>
</template>
<script>
import AddOil from "./addOil";
export default {
  components: { AddOil },
  props: {
    dialogFlag: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    ruleForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
    imageLubricationList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    lubricationPointTypeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    oilBrandList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    oilChangePeriodList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    oilBoxCapacityList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    oilList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    recommendOilCodeKey: {
      type: Number,
      default: () => {
        return 1;
      },
    },
    lupDeviceNameList:{
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    dialogFlag: function(val, oldVal) {
        if (val) {
          this.getOilList('');
        }
      }
    },
  data() {
    const validateOilChangePeriodUnit = (rule, value, callback) => {
      const str = this.ruleForm.lubricationPointTypeCode == "lubrication_point_type_0007" ? "加脂" : "换油";
      if (!this.ruleForm.oilChangePeriodUnit) {
        callback(new Error(`请选择${str}周期单位`));
      } else {
        callback();
      }
    };

    return {
      validatePeriodVal: (ruleForm) => {
        const { oilChangePeriodUnit } = ruleForm;
        return (rule, value, callback) => {
          if (!value) {
            return callback(new Error("请输入换油周期"));
          }
          if (parseInt(value) < 0) {
            return callback(new Error("请输入大于0的周期"));
          }
          if (oilChangePeriodUnit == "Y" && value > 20) {
            return callback(new Error("请输入小于20年的周期"));
          } else if (oilChangePeriodUnit == "M" && value > 240) {
            return callback(new Error("请输入小于240月的周期"));
          } else if (oilChangePeriodUnit == "D" && value > 7300) {
            console.log("this ======", value > 7300);
            return callback(new Error("请输入小于7300天的周期"));
          } else if (oilChangePeriodUnit == "H" && value > 175200) {
            return callback(new Error("请输入小于175200小时的周期"));
          } else {
            return callback();
          }
        };
      },
      loadingRemote: false,
      hideUpload: false,
      addOilDialog: false, // 手动添加油品弹框
      oilBrandListAdd: [],
      oilTypeListAdd: [],
      // 手动添加油品弹框
      addOilForm: {
        oilBrand: "",
        oilType: "",
        oilName: "",
      },
      addOilRules: {
        oilBrand: [{ required: true, message: "请选择油品品牌", trigger: "change" }],
        oilBrandName: [{ required: true, message: "请输入", trigger: "blur" }],
        oilName: [{ required: true, message: "请输入油品名称", trigger: "blur" }],
        oilTypeName: [{ required: true, message: "请输入", trigger: "blur" }],
        oilType: [{ required: true, message: "请选择油品类型", trigger: "change" }],
      },
      useOilKey: 0,
      selectOil: "", // 选择的在用油品牌code
      expireTimeOption: {
        disabledDate(date) {
          return date.getTime() > Date.now();
        },
      },

      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now(); //如果当天可选，就不用减8.64e7
        },
      },
      lubricationPointTypeData: [], // 润滑方式数据
      rules: {
        // oilChangeMethod:[
        //   { required: true, message: "请选择定期或按质换油", trigger: "change" }
        // ],
        lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        lubricationPointName: [{ required: true, message: "请输入润滑点设备名称", trigger: "change" }],
        lubricationMethod: [{ required: true, message: "请选择润滑方式", trigger: "change" }],
        oilBrandCode: [{ required: true, message: "请选择在用油品牌", trigger: "change" }],
        currentOilCode: [{ required: true, message: "请选择在用油品名称", trigger: "change" }],
        oilChangePeriod: [{ required: true, message: "请输入换油周期", trigger: "change" }],
        oilChangePeriodUnit: [{ required: true, validator: validateOilChangePeriodUnit, trigger: "change" }],
        lubricationPointSelectName:[{ required: true, message: "请选择润滑点设备名称", trigger: "change" }],
      },
    };
  },
  created() {
    this.getOilBrandData();
  },
  methods: {
    // 计划预计下次加油日期/预计下次加脂日期自动计算    上次加油时间 和 上次换油日期 ，上次加脂日期 日期框事件
    dateChange(val) {
      let oilChangePeriod;
      let oilChangePeriodUnit;
      let oilLastTime;
      if (val == "lastOilAddDate2" || val == "lastOilAddDate") {
        // 加脂周期 // 加油周期
        oilChangePeriod = this.ruleForm.oilAddPeriod;
        oilChangePeriodUnit = this.ruleForm.oilAddPeriodUnit;
        oilLastTime = this.ruleForm.lastOilAddDate;
      } else {
        // 换油周期
        oilChangePeriod = this.ruleForm.oilChangePeriod;
        oilChangePeriodUnit = this.ruleForm.oilChangePeriodUnit;
        oilLastTime = this.ruleForm.lastOilChangeDate;
      }
      if (oilChangePeriod && oilChangePeriodUnit && oilLastTime) {
        // 找出换油周期单位和数值，以及选中的上次换油日期作为入参查出下次换油日期
        const params = {
          oilChangePeriod: oilChangePeriod,
          oilChangePeriodUnit: oilChangePeriodUnit,
          oilLastTime: oilLastTime,
        };
        this.requestMethodGet("/web/service/ps/plusChangeOilDate", params).then((res) => {
          if (res.data.code == 1000) {
            if (val == "lastOilAddDate2") {
              // 加脂周期
              this.ruleForm.nextScheduledOilAddDate = res.data.data;
            } else if (val == "lastOilAddDate") {
              // 加油周期
              this.ruleForm.nextScheduledOilAddDate = res.data.data;
            } else {
              // 换油周期
              this.ruleForm.nextScheduledOilChangeDate = res.data.data;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        });
      }
    },
    addOrEditOil(formName) {
      const params = {
        oilBrand: formName.oilBrand,
        oilName: formName.oilName,
        customerCompanyNumber: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber,
      };
      if (formName.oilBrand == "0") {
        params.oilBrand = "";
        params.customCode = "1";
        params.oilBrandName = formName.oilBrandName;
      }
      this.requestMethodPost("mdm/oil/addOil", params).then((res) => {
        if (res.data.code == 1000) {
          if (formName.oilBrand == "0") {
            this.getOilBrandData();
            this.getQueryOilList("oilBrandList", "add", res.data.data.oilBrandNumber);
            if (this.addType == "oilName") {
              this.ruleForm.oilBrandCode = res.data.data.oilBrandNumber;
            }
          } else {
            this.ruleForm.oilBrandCode = formName.oilBrand;
          }
          if (this.addType == "oilName") {
            this.getOilList('');
            this.$set(this.ruleForm, "currentOilCode", res.data.data.oilNameNumber);
          } else {
            this.getOilList('');
            this.$set(this.ruleForm, "recommendOilCode", res.data.data.oilNameNumber);
          }
          this.addOilDialog = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
      });
    },
    // 关闭添加自定义油品弹框
    closeDialogAdd() {
      Object.assign(this.$data.addOilForm, this.$options.data().addOilForm);
      this.addOilDialog = false;
    },

    // 获取品牌数据
    getOilBrandData() {
      const params = {
        status: 1,
        parentCode: 0,
      };
      this.requestMethodGet("/mdm/oil/queryOilList", params).then((res) => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          let brandList = [];
          if (data.length !== 0) {
            data.forEach((item) => {
              item.text = item.name;
            });
            brandList = data.filter((it) => {
              return it.code !== "oil_0001";
            });
          }
          this.oilBrandListAdd = brandList;
          this.oilBrandListAdd.push({
            name: "自定义",
            code: "0",
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
        }
      });
    },
    selectOilBrandAdd(val) {
      this.$set(this.addOilForm, "oilType", "");
      this.$set(this.addOilForm, "oilBrandName", "");
      this.$set(this.addOilForm, "oilTypeName", "");
      this.$set(this.addOilForm, "oilName", "");
    },
    selectOilTypeAdd() {
      this.$set(this.addOilForm, "oilTypeName", "");
      this.$set(this.addOilForm, "oilName", "");
    },
    // 手动添加油品
    createOil(val) {
      // 记录添加油品的下拉框  是设备制造商推荐油品还是在用油品名称
      this.addType = val;
      if (val == "currentName") {
        this.$set(this.addOilForm, "oilBrand", "");
        this.$set(this.addOilForm, "oilBrandName", "");
      }
      this.$set(this.addOilForm, "oilBrand", "");
      this.$set(this.addOilForm, "oilBrandName", "");
      this.$set(this.addOilForm, "oilType", "");
      this.$set(this.addOilForm, "oilName", "");
      this.$set(this.addOilForm, "oilTypeName", "");
      this.addOilDialog = true;
    },
    // 取消自定义油品
    cancelAddOil() {
      this.addOilDialog = false;
      Object.assign(this.$data.addOilForm, this.$options.data().addOilForm);
    },
    getQueryOilList(listName, val, value) {
      let params = {
        parentCode:0,
        status:1
      };
      this.requestMethodGet("/mdm/oil/queryOilList", params)
        .then((res) => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map((item) => {
                return { value: item.code, label: item.name };
              });
              switch (listName) {
                case "oilBrandList":
                  this.oilBrandList = optionData;
                  break;
                case "oilTypeListAdd":
                  this.oilTypeListAdd = optionData;
                  break;
                case "oilSeriesListAdd":
                  this.oilSeriesListAdd = optionData;
                  break;
                default:
                  break;
              }
            }
            if (val == "add" && this.addType == "oilName") {
              this.$nextTick(() => {
                this.ruleForm.oilBrandCode = value;
              });
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch((res) => {});
    },
    completeAddOil(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            oilBrand: this.addOilForm.oilBrand,
            oilName: this.addOilForm.oilName,
            customerCompanyNumber: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber,
          };
          if (this.addOilForm.oilBrand == "0") {
            params.oilBrand = "";
            params.customCode = "1";
            params.oilBrandName = this.addOilForm.oilBrandName;
          }
          this.requestMethodPost("mdm/oil/addOil", params).then((res) => {
            if (res.data.code == 1000) {
              if (this.addOilForm.oilBrand == "0") {
                this.getOilBrandData();
                this.getQueryOilList("oilBrandList", "add", res.data.data.oilBrandNumber);
                if (this.addType == "oilName") {
                  this.ruleForm.oilBrandCode = res.data.data.oilBrandNumber;
                }
              } else {
                this.ruleForm.oilBrandCode = this.addOilForm.oilBrand;
              }
              if (this.addType == "oilName") {
                this.getRecommendOilList(this.ruleForm.oilBrandCode, "addType", res.data.data.oilNameNumber);
              } else {
                this.getOilList('');
                this.ruleForm.recommendOilCode = res.data.data.oilNameNumber;
              }
              this.addOilDialog = false;
            } else if (res.data.code == 4216) {
              let msg = "请直接搜索或下拉查询此油品：" + "“" + res.data.msg + "”";
              this.$confirm(msg, "该油品已存在", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning",
              })
                .then(() => {})
                .catch(() => {});
            } else if (res.data.code == 4217) {
              let msg = "请直接搜索或下拉查询此油品：" + "“" + res.data.msg + "”";
              this.$confirm(msg, "该油品品牌已存在", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning",
              })
                .then(() => {})
                .catch(() => {});
            } else if (res.data.code == 4218) {
              let msg = "请直接搜索或下拉查询此油品：" + "“" + res.data.msg + "”";
              this.$confirm(msg, "该油品类型已存在", {
                confirmButtonText: "确定",
                showCancelButton: false,
                type: "warning",
              })
                .then(() => {})
                .catch(() => {});
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOilList(val) {
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, status:1, size:200, current:1}).then((res) => {
        if (res.data.code == 1000) {
          this.loadingRemote = false
          this.oilList = res.data.data.list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error",
          });
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
    // 推荐油品名称 change 事件
    selectRecommendOilName(val) {
      ++this.recommendOilCodeKey;
      if (val) {
        this.ruleForm.recommendOilCode = val;
      }
    },
    handleLubricationPointTypeChange(val) {
      if (val) {
        var obj = {};
        obj = this.lubricationPointTypeList.filter((item) => {
          return item.code === val;
        });
        this.ruleForm.lubricationPointTypeCode = obj[0].code;
        this.ruleForm.lubricationPointType = obj[0].name;
        this.ruleForm.lubricationMethod = "";
        this.$_queryLubricationMethodData(this.ruleForm.lubricationPointTypeCode);
      } else {
        this.ruleForm.lubricationPointTypeCode = "";
        this.ruleForm.lubricationPointType = "";
      }
    },
    // 通过润滑方式 确认是油类还是脂类
    getDeviceType(val) {
      var obj = {};
      obj = this.lubricationPointTypeData.filter((item) => {
        return item.code === val;
      });
      this.ruleForm.oilTypeDevice = obj[0].oilType;
      if (this.ruleForm.oilTypeDevice == 2) {
        this.ruleForm.oilBoxCapacityUnit = "KG";
        this.ruleForm.everyTimeOilAddQuantityUnit = "KG";
        this.ruleForm.preMonthOilAddQuantityUnit = "KG";
        this.ruleForm.oilChangeMethod = "";
        this.ruleForm.oilChangePeriod = "";
        this.ruleForm.oilChangePeriodUnit = "";
        this.ruleForm.lastOilChangeDate = "";
        this.ruleForm.autoCreateOilChangePlan = "";
        this.ruleForm.fillingQuantity = "";
        this.ruleForm.fillingQuantityUnit = "";
        this.ruleForm.nextScheduledOilChangeDate = "";
      } else {
        this.ruleForm.oilBoxCapacityUnit = "L";
        this.ruleForm.everyTimeOilAddQuantityUnit = "L";
        this.ruleForm.preMonthOilAddQuantityUnit = "L";
        this.ruleForm.oilChangeMethod = 2;
        this.ruleForm.autoCreateOilChangePlan = false;
        // 如果选择的润滑点设备类型是  发动机
        if (this.ruleForm.lubricationPointTypeCode == "lubrication_point_type_0004") {
          this.ruleForm.oilChangeMethod = 1;
        }
      }
    },
    // 润滑方式下拉事件
    handlelubricationMethodChange(val) {
      this.getDeviceType(val);
    },
    // 通过润滑点设备类型获取 润滑方式下拉框数据
    $_queryLubricationMethodData(val) {
      let params = {
        typeCode: val,
      };
      this.requestMethodGet("/web/device/getLubricationMethodByType", params)
        .then((res) => {
          res = res.data;
          if (res.code == 1000) {
            this.lubricationPointTypeData = res.data;
            if (this.lubricationPointTypeData.length == 1) {
              this.ruleForm.lubricationMethod = this.lubricationPointTypeData[0].code;
              this.ruleForm.oilTypeDevice = this.lubricationPointTypeData[0].oilType;
              if (this.ruleForm.oilTypeDevice != 2) {
                this.ruleForm.oilBoxCapacityUnit = "L";
                this.ruleForm.everyTimeOilAddQuantityUnit = "L";
                this.ruleForm.preMonthOilAddQuantityUnit = "L";
                this.ruleForm.autoCreateOilChangePlan = false;
                if (this.ruleForm.lubricationPointTypeCode == "lubrication_point_type_0004") {
                  this.ruleForm.oilChangeMethod = 1;
                } else {
                  this.ruleForm.oilChangeMethod = 2;
                }
              } else {
                this.ruleForm.oilBoxCapacityUnit = "KG";
                this.ruleForm.everyTimeOilAddQuantityUnit = "KG";
                this.ruleForm.preMonthOilAddQuantityUnit = "KG";
                this.ruleForm.oilChangePeriod = "";
                this.ruleForm.oilChangePeriodUnit = "";
                this.ruleForm.lastOilChangeDate = "";
                this.ruleForm.autoCreateOilChangePlan = "";
                this.ruleForm.fillingQuantity = "";
                this.ruleForm.fillingQuantityUnit = "";
                this.ruleForm.nextScheduledOilChangeDate = "";
              }
            } else {
              this.ruleForm.lubricationMethod = "";
              if (this.ruleForm.oilTypeDevice == 2) {
                this.ruleForm.oilTypeDevice = 1;
                this.ruleForm.oilBoxCapacityUnit = "L";
                this.ruleForm.everyTimeOilAddQuantityUnit = "L";
                this.ruleForm.preMonthOilAddQuantityUnit = "L";
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch((res) => {});
    },
    // 在用油名称
    oilNameChange(val) {
      console.log('oilNameChange',val)
      if (val) {
        let selectOil = this.oilList.filter(item=>{
          return item.code==val
        })
        this.ruleForm.oilBrandCode = selectOil[0].parentCode;
        this.ruleForm.currentOilCode = val;
      }
    },
    // 添加润滑点图片
    handleAddLubricatePointFile(file, fileList) {
      if (!file.raw.type.startsWith("image")) {
        this.imageLubricationList = [];
        this.$message.error("只能上传图片类型文件");
        return;
      }
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isLt2M) {
        this.imageLubricationList = [];
        this.$message.error("上传图片大小不能超过 10MB!");
        return;
      }
      let params = new FormData();
      params.append("fileType", "lubrication_point");
      params.append("multipartFiles", file.raw);
      this.requestMethodPost("/web/file/uploadFiles", params)
        .then((res) => {
          res = res.data;
          if (res.code == 1000) {
            const data = res.data[0];
            this.ruleForm.lubricationPointPicPath = res.data[0];
            this.getFullImgPath(data, file);
          } else {
            this.$message({
              message: res.msg,
              type: "warning",
            });
          }
        })
        .catch((res) => {});
    },
    // 图片上传获取全路径
    getFullImgPath(path, file) {
      const params = {
        url: path,
      };
      this.requestMethodGet("/web/file/getFullUrl", params).then((res) => {
        if (res.data.code == 1000) {
          this.imageLubricationList.push({
            url: res.data.data,
            submitImgUrl: path,
          });
          this.hideUpload = this.imageLubricationList.length >= 1;
          if (this.ruleForm.id) {
            this.ruleForm.imgLubricationFile = path;
          } else {
            this.ruleForm.imgLubricationFile = file.raw;
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "warning",
          });
        }
      });
    },
    // 删除 润滑点图片
    handleLubricatePointRemove(file, fileList) {
      this.ruleForm.imgLubricationFile = "";
      this.imageLubricationList = [];
      setTimeout(() => {
        this.hideUpload = fileList.length >= 1;
      }, 500);
    },
    // 多个表单验证
    validateForms(formRefs) {
      let objectList = [];
      let results = formRefs.map(
        (formRef) =>
          new Promise((resolve, reject) => {
            formRef.validate((valid, object) => {
              if (valid) {
                resolve();
              } else {
                objectList.push(object);
                reject();
              }
            });
          })
      );
      return Promise.all(results).catch(() => {
        return Promise.reject(objectList);
      });
    },
    // 提交
    submitAddLup() {
      let formRefs;
      if (this.ruleForm.oilTypeDevice == 1) {
        formRefs = ["lupRuleForm", "oilRuleForm"].map((key) => this.$refs[key]);
      }
      if (this.ruleForm.oilTypeDevice == 2) {
        formRefs = ["lupRuleForm", "oilRuleForm1"].map((key) => this.$refs[key]);
      }
      this.validateForms(formRefs)
        .then(() => {
          // 校验换油周期值是否合法
          const reg = /^[1-9]\d*$/;
          const oilChangePeriodNum = Number(this.ruleForm.oilChangePeriod);
          const oilAddPeriodNum = Number(this.ruleForm.oilAddPeriod);
          const regTestResult1 = reg.test(oilChangePeriodNum);
          const regTestResult2 = reg.test(oilAddPeriodNum);
          const isRollingBearing = this.ruleForm.oilTypeDevice == "2"; // 油类  加油周期     false  脂类 加脂周期
          const list = this.oilChangePeriodList;
          let MaxNum = null;
          let MaxNum1 = null;
          // 先判断 加油/加脂
          list.forEach((it) => {
            it.rangMin = 1;
            if (isRollingBearing) {
              if (it.oilChangePeriodUnit != "KM") {
                //换油
                it.rangMax = it.oilChangePeriodUnit == "Y" ? 2 : it.oilChangePeriodUnit == "M" ? 24 : it.oilChangePeriodUnit == "D" ? 730 : 17520;
              }
            } else {
              if (it.oilChangePeriodUnit != "KM") {
                //加脂
                it.rangMax = it.oilChangePeriodUnit == "Y" ? 20 : it.oilChangePeriodUnit == "M" ? 240 : it.oilChangePeriodUnit == "D" ? 7300 : 175200;
              }
            }
          });
          if (isRollingBearing) {
            // 加脂周期   脂类
            list.forEach((item) => {
              if (this.ruleForm.oilAddPeriodUnit == item.oilChangePeriodUnit) {
                MaxNum1 = item.rangMax;
              }
            });
          } else {
            list.forEach((item) => {
              // 油类  加油/加脂周期
              if (this.ruleForm.oilChangePeriodUnit == item.oilChangePeriodUnit) {
                MaxNum = item.rangMax;
              }
            });
            list.forEach((item) => {
              if (this.ruleForm.oilAddPeriodUnit == item.oilChangePeriodUnit) {
                MaxNum1 = item.rangMax;
              }
            });
          }
          if (oilAddPeriodNum) {
            if (regTestResult2 && oilAddPeriodNum >= 1 && oilAddPeriodNum <= MaxNum1) {
              // console.log(2222)
            } else {
              if (MaxNum1) {
                this.$message({
                  type: "error",
                  message: `加油/加脂周期：请输入1~${MaxNum1}的整数`,
                });
                return;
              }
            }
          }
          if (regTestResult1 && oilChangePeriodNum && !isRollingBearing) {
            if (oilChangePeriodNum >= 1 && oilChangePeriodNum <= MaxNum) {
            } else {
              if (MaxNum) {
                this.$message({
                  type: "error",
                  message: `换油周期：请输入1~${MaxNum}的整数`,
                });
                return;
              }
            }
          }
          // 提交逻辑
          if (this.ruleForm.id) {
            this.ruleForm.lupFlag = "edit";
          } else {
            this.ruleForm.lupFlag = "add";
          }
          this.$emit("addOrEditLup", this.ruleForm, this.showOrHideState);
        })
        .catch((err) => {
          // console.log(err)
        });
    },
    // 取消
    cancelDialog() {
      this.$refs["lupRuleForm"].resetFields();
      if (this.ruleForm.oilTypeDevice == 1) {
        this.$refs["oilRuleForm"].resetFields();
      }
      if (this.ruleForm.oilTypeDevice == 2) {
        this.$refs["oilRuleForm1"].resetFields();
      }
      this.$emit("closeDialog");
    },
  },
  computed: {
    showOrHideState() {
      /**
       * 控制显隐整体分为三种情况：
       * 1 - 普通油润滑类 - return [ 0:common]
       * 2 - 特殊油类润滑 - return [1:special]
       * 3 - 脂类润滑 - return [2:lipid]
       *
       * lubricationPointTypeCode - 润滑点设备类型
       * lubricationMethod - 润滑方式
       *
       * 循环 - lubrication_method_0001
       * 飞溅/油谷 - lubrication_method_0002
       * 喷射 - lubrication_method_0003
       * 油雾 - lubrication_method_0004
       * 手刷 - lubrication_method_0005
       * 脂滑枪 - lubrication_method_0006
       * 集中供脂 - lubrication_method_0007
       * 其他油润滑 - lubrication_method_0008
       * 其他脂润滑 - lubrication_method_0009
       */
      const { lubricationPointTypeCode, lubricationMethod } = this.ruleForm;
      // console.log("lubricationPointTypeCode, lubricationMethod", lubricationPointTypeCode, lubricationMethod);
      if (lubricationMethod == "lubrication_method_0004" || (lubricationMethod == "lubrication_method_0003" && lubricationPointTypeCode == "lubrication_point_type_0011")) {
        return 1;
      } else if (
        lubricationMethod == "lubrication_method_0001" ||
        lubricationMethod == "lubrication_method_0002" ||
        lubricationMethod == "lubrication_method_0008" ||
        (lubricationMethod == "lubrication_method_0003" && lubricationPointTypeCode != "lubrication_point_type_0011")
      ) {
        return 0;
      } else if (
        lubricationMethod == "lubrication_method_0005" ||
        lubricationMethod == "lubrication_method_0006" ||
        lubricationMethod == "lubrication_method_0007" ||
        lubricationMethod == "lubrication_method_0009"
      ) {
        return 2;
      } else {
        return null;
      }
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-dialog__body {
  padding: 0px 20px;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #001450 !important;
  background: #001450 !important;
}
.hide /deep/ .el-upload--picture-card {
  display: none !important;
}
.lup-content {
  height: 600px;
  overflow-x: hidden;
  overflow-y: auto;
}
.info-title {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
}
.title {
  margin-left: 10px;
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
  color: #000;
}
.line {
  width: 4px;
  height: 14px;
  background: #dd0000;
  margin-left: 20px;
}
.form-content {
  margin-left: 20px;
}
.lup-content .el-tooltip.item {
  outline-color: transparent !important;
  outline-width: 0 !important;
}
</style>