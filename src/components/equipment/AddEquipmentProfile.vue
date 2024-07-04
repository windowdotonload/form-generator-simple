<!--
* @author vvx
* @date 2020/04/14 16:57:26
* @version V1.0.0
!-->
<template>
  <div style="position: relative" class="add-customer-profile" :style="mainminheight">
    <div class="detail-content">
      <!-- 设备信息 -->
      <div class="info detail-base-info">
        <div class="info-title">
          <div class="line"></div>
          <div class="title">设备信息</div>
        </div>
        <div class="detail-form">
          <el-form ref="deviceRuleForm" :rules="rules" :model="ruleForm" label-width="100px" label-position="top">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备名称" prop="deviceName">
                  <el-input size="small" v-model="ruleForm.deviceName" maxlength="50" clearable placeholder="请输入" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备类型" prop="eptType">
                  <el-cascader
                    size="small"
                    v-model="ruleForm.eptType"
                    placeholder="试试搜索：设备"
                    :options="eptList"
                    filterable
                    clearable
                    style="width: 80%"
                    ref="deviceRef"
                    :props="{ value: 'code', label: 'name' }"
                    @change="eptTypeChange"
                  >
                    <template slot="empty">
                      <div style="display: flex; align-items: center; justify-content: center; padding: 5px 0px">
                        暂无匹配数据<el-link style="margin-left: 10px; color: #409eff" @click="createDevice">去创建</el-link>
                      </div>
                    </template>
                  </el-cascader>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12" v-if="roleType != '2'">
                <el-form-item label="所属客户" prop="customerNumber">
                  <el-select
                    size="small"
                    clearable
                    filterable
                    v-model="ruleForm.customerNumber"
                    :filter-method="customerAllFilter"
                    @change="handleChangeCustomer"
                    placeholder="请选择"
                    style="width: 80%"
                  >
                    <el-option v-for="item in customerList" :key="item.companyNumber" :label="item.companyName" :value="item.companyNumber"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属车间" prop="workshopId">
                  <el-select v-model="ruleForm.workshopId" placeholder="请选择" size="small" clearable style="width: 80%" filterable>
                    <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="制造商">
                  <el-input size="small" v-model="ruleForm.manufacturer" maxlength="50" clearable placeholder="请输入" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备型号">
                  <el-input size="small" v-model="ruleForm.deviceModel" maxlength="50" clearable placeholder="请输入" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备编码">
                  <el-input size="small" v-model="ruleForm.deviceCode" maxlength="50" clearable placeholder="请输入" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备位置">
                  <el-input size="small" v-model="ruleForm.devicePosition" maxlength="50" clearable placeholder="请输入" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否有部件需要润滑">
                  <el-radio-group v-model="isHas">
                    <el-radio :label="1">需要</el-radio>
                    <el-radio :label="0">不需要</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否对客户可见" prop="customerVisibility">
                  <el-radio-group v-model="ruleForm.customerVisibility">
                    <el-radio :label="1">可见</el-radio>
                    <el-radio :label="0">不可见</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div style="height: 20px"></div>
      <!-- 润滑点信息 -->
      <div class="info detail-other-info" v-if="isHas">
        <div class="info-title">
          <div class="line"></div>
          <div class="title">润滑点信息</div>
        </div>
        <div class="detail-form">
          <el-form ref="lupRuleForm" :rules="rules" :model="ruleForm" label-width="100px" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="润滑点设备名称" :prop="(ruleForm.lubricationPointSelectName=='自定义' || lupDeviceNameList.length==1 || lupDeviceNameList.length==0)?'lubricationPointName':'lubricationPointSelectName'">
                  <div style="display: flex;" v-if="lupDeviceNameList.length>1">
                    <el-select
                      v-model="ruleForm.lubricationPointSelectName"
                      placeholder="请选择润滑点设备名称"
                      size="small"
                      :style="{width:(ruleForm.lubricationPointSelectName=='自定义')?'30%':'80%',marginRight:(ruleForm.lubricationPointSelectName=='自定义')?'5px':''}"
                    >
                      <el-option  
                        v-for="item in lupDeviceNameList" 
                        :key="item.id" 
                        :label="item.lubPointName" 
                        :value="item.lubPointName"
                        :style="{color:(item.lubPointName=='自定义'?'blue':'#606266')}"> 
                      </el-option>
                    </el-select>
                    <el-input size="small"
                    :style="{width:(ruleForm.lubricationPointSelectName=='自定义')?'50%':'80%'}"
                    v-if="ruleForm.lubricationPointSelectName=='自定义'"
                    @blur="lubricationPointNameBlur"  
                    v-model="ruleForm.lubricationPointName" maxlength="50" clearable placeholder="请输入"></el-input>
                  </div>
                  <div v-else>
                    <el-input size="small" 
                      v-model="ruleForm.lubricationPointName" 
                      maxlength="50" 
                      clearable 
                      @blur="lubricationPointNameBlur"
                      placeholder="请输入" 
                      style="width: 80%">
                    </el-input>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="润滑点设备类型" prop="lubricationPointTypeCode">
                  <span slot="label">
                    润滑点设备类型
                    <el-tooltip class="item" effect="dark" content="" placement="top-start">
                      <div slot="content" style="max-width: 400px;line-height: 18px;">
                        1. 蒸汽轮机、燃气轮机、造纸机类型仅对应其循环系统 <br/>
                        2. 商用车对应的润滑点设备类型选择如下： 发动机请选择“发动机”，变速箱/差速器/终传动/轮边减速器请选择“闭式齿轮”，轮毂轴承/其它回转设备滚动轴承请选择“滚动轴承”，刹车系统/液压系统请选择“液压系统”，开式齿轮请选择“开式齿轮”，冷却系统/销轴请选择“其它”
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
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item label="在用油品名称" prop="currentOilCode">
                  <el-select size="small" ref="cascaderRef" v-model="ruleForm.currentOilCode" placeholder="试试搜索：油品名称" clearable filterable remote :loading="loadingRemote" :remote-method="getOilData" @focus="getOilData('')" @change="oilNameChange" style="width: 80%">
                    <el-option v-for="item in oilList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                    <template slot="empty">
                      <div style="text-align:center;padding:5px;color:grey;" v-if="loadingRemote">
                        加载中
                      </div>
                      <div style="display: flex; align-items: center; justify-content: center; padding: 5px 0px" v-else>
                        暂无匹配数据<el-link  style="margin-left: 10px; color: #409eff" @click="createOil('oilName')">去添加</el-link>
                      </div>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-col :span="11" style="padding: 0">
                    <el-form-item
                      prop="oilBoxCapacity"
                      label="油箱容量"
                      :rules="[
                        { required: oilTypeDevice == 1 ? true : false, message: '请输入油箱容量', trigger: 'blur' },
                        { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }
                      ]"
                    >
                      <el-input size="small" v-model="ruleForm.oilBoxCapacity" maxlength="10" placeholder="请输入" clearable></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="oilBoxCapacityUnit" :rules="[{ required: oilTypeDevice == 1 ? true : false, message: '请选择油箱容量单位', trigger: 'change' }]">
                      <span slot="label">单位</span>
                      <el-select size="small" clearable v-model="ruleForm.oilBoxCapacityUnit">
                        <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备制造商推荐油品" prop="recommendOilCode">
                  <el-select size="small" ref="deviceRef" v-model="ruleForm.recommendOilCode" placeholder="试试搜索：油品名称" clearable filterable remote :loading="loadingRemote" :remote-method="getOilData" @focus="getOilData('')" @change="selectRecommendOilName" style="width: 80%">
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
              <el-col :span="12">
                <el-form-item label="润滑点设备制造商名称" prop="lubricationPointManufacturer">
                  <el-input size="small" v-model="ruleForm.lubricationPointManufacturer" maxlength="50" clearable placeholder="请输入" style="width: 80%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
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
                <el-form-item label="描述">
                  <el-input size="small" type="textarea" :rows="6" v-model="ruleForm.lubricationPointDesc" maxlength="200" placeholder="请输入" style="width: 80%" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div style="height: 20px"></div>
      <!-- 用油信息 -->
      <div class="info detail-other-info" v-if="isHas">
        <div class="info-title">
          <div class="line"></div>
          <div class="title">用油信息</div>
        </div>
        <!-- 如果选择的是 油类 -->
        <div class="detail-form" v-if="oilTypeDevice == 1">
          <el-form ref="oilRuleForm" :rules="rules" :model="ruleForm" label-width="100px" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12" v-if="showOrHideState == 0">
                <el-form-item label="定期或按质换油" prop="oilChangeMethod">
                  <el-radio-group v-model="ruleForm.oilChangeMethod">
                    <el-radio :label="1">定期</el-radio>
                    <el-radio :label="2">按质</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="24">
              <el-col :span="12" v-if="showOrHideState == 0" style="height: 80px">
                <el-form-item>
                  <el-col :span="11" style="padding: 0">
                    <el-form-item
                      prop="oilChangePeriod"
                      label="换油周期"
                      :rules="[
                        { validator: validatePeriodVal(this.ruleForm), trigger: 'blur' },
                        { required: true, message: '请输入换油周期', trigger: 'blur' },
                        { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
                      ]"
                    >
                      <el-input size="small" @change="dateChange('lastOilChangeDate')" v-model="ruleForm.oilChangePeriod" maxlength="10" placeholder="请输入" class="input-with-select" clearable>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item prop="oilChangePeriodUnit">
                      <span slot="label">单位</span>
                      <el-select size="small" @change="dateChange('lastOilChangeDate')" clearable v-model="ruleForm.oilChangePeriodUnit">
                        <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="height: 80px" v-if="showOrHideState == 0">
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
                <el-form-item>
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
              <el-col :span="12" v-if="showOrHideState == 0 && ruleForm.oilChangeMethod == 1 && ruleForm.lastOilChangeDate && ruleForm.oilChangePeriod && ruleForm.oilChangePeriodUnit!='KM'" style="height: 80px">
                <el-form-item label="是否自动生成下次换油计划？">
                  <el-radio-group v-model="ruleForm.autoCreateOilChangePlan">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="showOrHideState == 0 && ruleForm.autoCreateOilChangePlan && ruleForm.lastOilChangeDate && ruleForm.oilChangePeriod && ruleForm.oilChangePeriodUnit!='KM'" style="height: 80px">
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
              <el-col :span="12" style="height: 80px">
                <el-form-item>
                  <el-col :span="11" style="padding: 0">
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
                </el-form-item>
              </el-col>
              <el-col :span="12" style="height: 80px">
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
              <el-col :span="12" style="height: 80px">
                <el-form-item>
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
              <el-col :span="12" style="height: 80px">
                <el-form-item>
                  <el-col :span="11" style="padding: 0">
                    <!-- 每月油品添加量 -->
                    <el-form-item
                      prop="preMonthOilAddQuantity"
                      label="每月润滑剂添加量"
                      :rules="[
                        { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' },
                        { required: showOrHideState == 1 ? true : false, message: '请输入每月润滑剂添加量', trigger: 'blur' }
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
              <el-col :span="12" v-if="ruleForm.oilAddPeriod && ruleForm.lastOilAddDate && ruleForm.oilAddPeriodUnit!='KM'" style="height: 80px">
                <el-form-item label="是否自动生成下次加油计划？">
                  <el-radio-group v-model="ruleForm.autoCreateOilAddPlan">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio> 
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="ruleForm.autoCreateOilAddPlan && ruleForm.lastOilAddDate && ruleForm.oilAddPeriod && ruleForm.oilAddPeriodUnit!='KM'" style="height: 80px">
                <el-form-item label="预计下次加油日期">
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
        <!-- 如果选择的是 脂类 -->
        <div class="detail-form" v-if="oilTypeDevice == 2">
          <el-form ref="oilRuleForm" :rules="rules" :model="ruleForm" label-width="100px" label-position="top">
            <el-row :gutter="24">
              <el-col :span="12" style="height: 80px">
                <el-form-item>
                  <el-col :span="11" style="padding: 0">
                    <el-form-item prop="oilAddPeriod" label="加脂周期" :rules="[{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]">
                      <el-input size="small" @change="dateChange('lastOilAddDate2')" v-model="ruleForm.oilAddPeriod" maxlength="10" placeholder="请输入" class="input-with-select" clearable> </el-input>
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
              <el-col :span="12" style="height: 80px">
                <el-form-item>
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
              <el-col :span="12" style="height: 80px">
                <el-form-item>
                  <el-col :span="11" style="padding: 0">
                    <!-- 每月滑脂添加量 -->
                    <el-form-item
                      prop="preMonthOilAddQuantity"
                      label="每月润滑剂添加量"
                      :rules="[
                        { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' },
                        { required: true, message: '请输入每月润滑剂添加量', trigger: 'blur' }
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
              <el-col :span="12" style="height: 80px">
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
            <el-row :gutter="24" v-if="ruleForm.lastOilAddDate && ruleForm.oilAddPeriod && ruleForm.oilAddPeriodUnit!='KM'">
              <el-col :span="12" style="height: 80px">
                <el-form-item label="是否自动生成下次加脂计划？">
                  <el-radio-group v-model="ruleForm.autoCreateOilAddPlan">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="height: 80px">
                <el-form-item v-if="ruleForm.autoCreateOilAddPlan && ruleForm.oilAddPeriodUnit!='KM'" label="预计下次加脂日期">
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
      <!-- 底部按钮 -->
      <div slot="footer" style="margin: 30px 0">
        <el-button type="danger" plain @click="handleResetFrom" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitForm" size="small">保存</el-button>
      </div>
      <!-- 自定义设备类型 -->
      <el-dialog title="自定义设备类型" :visible.sync="createDeviceFlag" width="30%" :close-on-click-modal="false">
        <el-form :model="addDeviceForm" :rules="addDeviceRules" ref="addDeviceRef" class="demo-ruleForm">
          <el-form-item prop="name">
            <el-input v-model="addDeviceForm.name" size="small" clearable maxlength="25"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelAdd('addDeviceRef')" size="small">取 消</el-button>
          <el-button type="danger" @click="completeAdd('addDeviceRef')" size="small">完 成</el-button>
        </span>
      </el-dialog>

      <!-- 新增润滑点 -->
      <AddOil
        :addOilDialog="addOilDialog"
        :addType="addType"
        :addOilForm="addOilForm"
        v-on:addOrEditOil="addOrEditOil"
        v-on:closeDialogAdd="closeDialogAdd"
        ref="LupDialogRef"
      />
      <!-- 查重 -->
      <el-dialog title="设备类型查重" :visible.sync="showDialog" width="30%" :close-on-click-modal="false">
        <span>{{ addDeviceMsg }}</span>
        <span slot="footer" class="dialog-footer" v-if="addDeviceCode == 4307">
          <el-button @click="chooseAgain" size="small">重新选择</el-button>
          <el-button type="danger" @click="confirmAddDevice" size="small">确 定</el-button>
        </span>
        <span slot="footer" class="dialog-footer" v-if="addDeviceCode == 4306">
          <el-button @click="showDialog = false" size="small">我知道了</el-button>
        </span>
      </el-dialog>
      <SyncLub :dialogFlag="showSyncLubDialog" @closeSyncLubDialog="closeSyncLubDialog" :tipsData="tipsData"/>
    </div>
  </div>
</template>

<script>

import AddOil from "./components/addOil";
import SyncLub from "./components/syncLubDialog";
export default {
  components: { AddOil, SyncLub },
  data() {
    const validateLastOilChangeDate = (rule, value, callback) => {
      if (!value) {
        const str = this.ruleForm.lubricationPointTypeCode == "lubrication_point_type_0007" ? "上次加脂⽇期" : "上次换油⽇期";
        return callback(new Error(`请选择${str}`));
      } else {
        callback();
      }
    };
    const validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入自定义设备类型"));
      } else {
        const reg1 = /^[\u4e00-\u9fa5]{0,}$/;
        if (!reg1.test(value)) {
          return callback(new Error("请输入中文"));
        } else {
          callback();
        }
      }
    };
    const validateEptType = (rule, value, callback) => {
      if (!this.ruleForm.eptType.length) {
        return callback(new Error("请选择设备类型"));
      } else {
        callback();
      }
    };
    return {
      validatePeriodVal: ruleForm => {
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
      expireTimeOption: {
        disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now();
        }
      },
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < Date.now(); //如果当天不可选，就不用减8.64e7
        }
      },
      showSyncLubDialog: false,
      tipsData: {},
      mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
      imageLubricationList: [], // 润滑点图片
      uploadUrl: "",
      hideUpload: false,
      typeProps: {
        value: "code",
        label: "name"
      },
      loadingRemote: false,
      oilChangePeriodList: [], // 换油单位配置数据
      oilBoxCapacityList: [{ oilBoxCapacityUnit: "L", oilBoxCapacityUnitDesc: "L" }, { oilBoxCapacityUnit: "KG", oilBoxCapacityUnitDesc: "KG" }],
      // 手动添加油品弹框
      addOilForm: {
        oilBrand: "",
        oilType: "",
        oilName: ""
      },
      brandError:false,
      typeError:false,
      nameError:false,
      noticeError:'',
      addOilRules: {
        oilBrand: [{ required: true, message: "请选择油品品牌", trigger: "change" }],
        oilBrandName: [{ required: true, message: "请输入油品品牌", trigger: "blur" }],
        oilName: [{ required: true, message: "请输入油品名称", trigger: "blur" }],
        oilTypeName: [{ required: true, message: "请输入油品类型", trigger: "blur" }],
        oilType: [{ required: true, message: "请选择油品类型", trigger: "change" }]
      },
      lubricationPointTypeData: [], // 润滑方式数据
      // 表单验证
      ruleForm: {
        imgLubricationFile: "", //润滑点图片
        customerNumber: "", //所属客户
        recommendOilBrand: "",
        deviceCode: "", // 设备编码
        devicePosition: "", // 设备位置
        oilChangeMethod: 2, // 定期或按质换油
        recommendOilType: "",
        recommendOilSeries: "",
        recommendOilCode: "",
        lubricationPointTypeCode: "",
        deviceType: "", //设备类型
        manufacturer: "", //制造商
        deviceModel: "", //型号
        lastOilAddDate: "",
        oilBrandCode: "",
        lubricationPointName: "",
        lubricationPointDesc: "",
        lubricationPointManufacturer: "",
        lubricationMethod: "",
        oilAddPeriod: "",
        oilName: "",
        oilSeries: "",
        oilType: "",
        everyTimeOilAddQuantityUnit: "L",
        fillingQuantityUnit: "L",
        preMonthOilAddQuantityUnit: "L",
        preMonthOilAddQuantity: "",
        lastOilChangeDate: "",
        fillingQuantity: "",
        oilBoxCapacity: "",
        currentOilCode: "",
        everyTimeOilAddQuantity: "",
        nextScheduledOilChangeDate: "",
        nextScheduledOilAddDate: "",
        autoCreateOilChangePlan: false,
        lastTestDate: "",
        autoCreateOilAddPlan: false, // 是否自动生成下次加脂计划
        cardNumber: "",
        eptType: [], //设备类型
        workshopId: "", //车间
        oilChangePeriodUnit: "D",
        oilChangePeriod: "",
        oilBoxCapacityUnit: "L",
        oilAddPeriodUnit: "D",
        lubricationPointSelectName:'',
        customerVisibility: 1
      },
      oilTypeDevice: 1, // 判断是油类还是脂类，默认为油类
      //   表单验证规则
      rules: {
        oilChangeMethod: [{ required: true, message: "请选择定期或按质换油", trigger: "change" }],
        deviceName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        lubricationPointName: [{ required: true, message: "请输入润滑点设备名称", trigger: "blur" }],
        lubricationPointSelectName: [{ required: true, message: "请选择润滑点设备名称", trigger: "change" }],
        lubricationMethod: [{ required: true, message: "请选择润滑方式", trigger: "change" }],
        customerNumber: [{ required: true, message: "请选择所属客户", trigger: "change" }],
        cardNumber: [{ pattern: /^[0-9]{8}$/, message: "请输入8位数字", trigger: "blur" }],
        oilChangePeriodUnit: [{ required: true, message: "请输入换油周期单位", trigger: "change" }],
        lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        // oilBrandCode: [{ required: true, message: "请选择在用油品牌", trigger: "change" }],
        currentOilCode: [{ required: true, message: "请选择在用油品名称", trigger: "change" }],
        eptType: [{ required: true, validator: validateEptType, trigger: "change" }],
        workshopId: [{ required: true, message: "请选择车间", trigger: "change" }],
        customerVisibility: [{ required: true, message: "请选择是否对客户可见", trigger: "change" }],
      },
      customerList: [], //客户
      companyIndustry: "", //客户下面的行业code
      typeList: [], //类型
      typeBigCode: "", // 选中的类型大类的 code
      typeSmallList: [], // 设备类型小类
      typeCode: "",
      lubricationPointTypeList: [], // 润滑点设备类型数组
      deviceType: "", //选中的类型
      oilBrandList: [], // 油品品牌数组
      recommendOilTypeList: [], // 推荐油品类型数组
      recommendOilSeriesList: [], // 推荐油品系列数组
      recommendOilList: [], // 推荐油品名称数组
      oilTypeList: [], // 在用油品类型数组
      oilSeriesList: [], // 在用油品系列数组
      oilList: [], // 在用油品名称数组
      isFlag: true,
      selectDevice: "",
      oilBrandName: "", // 选择的在用油品牌name
      // selectOil: "", // 选择的在用油品牌code
      selectCompanyName: "", // 所属客户的模糊搜索
      selectRecommendOil: "", // 选择的推荐用油品牌
      eptList: [],
      workshopList: [],
      createDeviceFlag: false,
      addDeviceForm: {
        name: ""
      },
      addDeviceRules: {
        name: [{ validator: validateName, trigger: "blur" }]
      },
      timeout: null,
      showDialog: false,
      addDeviceMsg: "",
      addDeviceCode: null,
      useOilKey: 0,
      roleType: "",
      addOilDialog: false, // 手动添加油品弹框
      oilBrandListAdd: [],
      oilTypeListAdd: [],
      brandDisabled: false,
      addType: "",
      isHas:1,
      recommendKey:1,
      lupDeviceNameList:[],
    };
  },
  mounted() {
    this.ruleForm.createTime = this.moment(new Date()).format("YYYY-MM-DD");
    this.$_queryCustomerData(); //查询所属客户
    this.$_queryLPData(); // 查询润滑点设备类型
    this.$_queryTypeData(); //查询设备类型
    this.getQueryOilList("oilBrandList"); // 查询用油品牌
    this.$_queryOilChangePeriodData(); // 查询换油单位
    this.getEptList(); //获取设备类型
    this.getOilData(); //获取油品级联数据
    this.getOilBrandData();
  },
  created() {
    this.roleType = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).roleType;
    if (this.roleType == "2") {
      this.ruleForm.customerNumber = JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber;
      this.getWorkShopList(JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyId);
    }
    if (this.$route.query.customerNumber) {
      this.ruleForm.customerNumber = this.$route.query.customerNumber;
    }
    if (this.$route.query.companyNumber) {
      this.ruleForm.customerNumber = this.$route.query.companyNumber;
      this.ruleForm.workshopId = this.$route.query.workshopId;
    }
    if (this.$route.query.companyId) {
      this.getWorkShopList(this.$route.query.companyId);
    }
  },
  methods: {
    closeSyncLubDialog() {
      this.showSyncLubDialog = false
      this.$router.push({
        path: "/EquipmentProfile"
      });
    },
    eptTypeChange(val){
      const params = {
        deviceCode:val[val.length-1],
        lubPointName:'',
        status:1,
        current:1,
        size:100
      }
      this.requestMethodGet('/device/coreDeviceLubPoint/pageList',params).then(res=>{
        if(res.data.code == 1000){
          const data = res.data.data.list || []
          if(data.length){
            data.forEach(it=>{
              it.isCustomFlag = false
            })
          }
          let obj = {
            lubPointName:'自定义',
            isCustomFlag:true
          }
          data.push(obj)
          if(data.length>1){
            this.$set(this.ruleForm,'lubricationPointSelectName','')
          }
          this.lupDeviceNameList = data
        }else{
          this.$message({
              message: res.data.msg,
              type: "error"
          });
        }
      })
    },
    // 判断是否为正整数
    isPositiveInteger(num) {
      return /^[1-9]\d*$/.test(num);
    },

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
      if(oilChangePeriodUnit=='KM') {
        return
      }
      if(!this.isPositiveInteger(oilChangePeriod)) {
        return
      }
      if (oilChangePeriod && oilChangePeriodUnit && oilLastTime) {
        // 找出换油周期单位和数值，以及选中的上次换油日期作为入参查出下次换油日期
        const params = {
          oilChangePeriod: oilChangePeriod,
          oilChangePeriodUnit: oilChangePeriodUnit,
          oilLastTime: oilLastTime
        };
        this.requestMethodGet("/web/service/ps/plusChangeOilDate", params).then(res => {
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
              type: "warning"
            });
          }
        });
      }
    },
    // 关闭添加自定义油品弹框
    closeDialogAdd() {
      this.addOilDialog = false;
    },

    addOrEditOil(formName) {
      const params = {
            oilBrand: formName.oilBrand,
            oilName: formName.oilName,
            customerCompanyNumber: JSON.parse(this.Decrypt(sessionStorage.getItem("userInfo"))).companyNumber,
          };
          if(formName.oilBrand=='0') {
            params.oilBrand=''
            params.customCode='1'
            params.oilBrandName=formName.oilBrandName
          }
          this.requestMethodPost("mdm/oil/addOil", params).then((res) => {
            if (res.data.code == 1000) {
              console.log( res.data.data)
              if(formName.oilBrand=='0') {
                this.getOilBrandData()
                this.getQueryOilList("oilBrandList",'add',res.data.data.oilBrandNumber);
                if (this.addType == "oilName") {
                  this.ruleForm.oilBrandCode=res.data.data.oilBrandNumber
                }
              } else{
                this.ruleForm.oilBrandCode=formName.oilBrand
              }
              if (this.addType == "oilName") {
                this.handleType('addType',res.data.data.oilNameNumber)
              } else {
                this.handleType( res.data.data.oilNameNumber);
              }
              this.addOilDialog = false;
            }else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });

    },
    // 获取品牌数据
    getOilBrandData() {
      const params = {
          oilName:'',
          parentCode:0,
          status:1
        };
      this.requestMethodGet("mdm/oil/queryOilList", params).then((res) => {
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
    selectOilBrandAdd(val) {
      this.getOilTypeData(val);
      this.$set(formName, 'oilType', '')
      this.$set(formName, 'oilBrandName', '')
      this.$set(formName, 'oilTypeName', '')
      this.$set(formName, 'oilName', '')

    },
    selectOilTypeAdd() {
      this.$set(formName, 'oilTypeName', '')
      this.$set(formName, 'oilName', '')
    },
    // 获取品牌类型数据
    getOilTypeData(val) {
      const params = {
        oilNumber: val,
        type: 1
      };
      this.requestMethodPost("weChat/oilRecord/queryOilList", params).then(res => {
        if (res.data.code == 1000) {
          this.oilTypeListAdd = res.data.data;
          this.oilTypeListAdd.push({
            nameCn: "自定义",
            oilNumber: "0"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 创建新设备
    createDevice() {
      this.createDeviceFlag = true;
      this.addDeviceForm.name = this.$refs.deviceRef.inputValue;
    },
    // 确定创建
    completeAdd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            level: "4",
            name: this.addDeviceForm.name,
            parentCode: "device_user_defined"
          };
          this.requestMethodPost("web/config/industryDevice/addIndustryDevice", params).then(res => {
            if (res.data.code == 1000) {
              this.ruleForm.eptType = ["industry_0013", "industry_0051", "device_user_defined", res.data.data];
              this.chooseAgain();
              this.getEptList();
            } else if (res.data.code == 4306 || res.data.code == 4307) {
              this.addDeviceCode = res.data.code;
              this.addDeviceMsg = res.data.msg;
              this.showDialog = true;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 手动添加油品
    createOil(val) {
      // 记录添加油品的下拉框  是设备制造商推荐油品还是在用油品名称
      this.addType = val;
      this.addOilDialog = true;
      if(val == "currentName" ) {
        this.$set(this.addOilForm, 'oilBrand', '')
        this.$set(this.addOilForm, 'oilBrandName', '')
      }
      this.$set(this.addOilForm, "oilBrand", "");
        this.$set(this.addOilForm, "oilBrandName", "");
      this.$set(this.addOilForm, 'oilType', '')
      this.$set(this.addOilForm, 'oilName', '')
      this.$set(this.addOilForm, 'oilTypeName', '')
      ++this.recommendKey;

    },
    // 查重确定新增
    confirmAddDevice() {
      const params = {
        level: "4",
        name: this.addDeviceForm.name,
        parentCode: "device_user_defined",
        forceSaveExistNameFlag: true
      };
      this.requestMethodPost("web/config/industryDevice/addIndustryDevice", params).then(res => {
        if (res.data.code == 1000) {
          this.ruleForm.eptType = ["industry_0013", "industry_0051", "device_user_defined", res.data.data];
          this.chooseAgain();
          this.getEptList();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 重新选择
    chooseAgain() {
      this.showDialog = false;
      this.cancelAdd("addDeviceRef");
    },
    // 取消创建
    cancelAdd(formName) {
      this.createDeviceFlag = false;
      this.$refs[formName].resetFields();
    },
    // oilChangePeriodFocus(){
    //   if(!this.ruleForm.lubricationPointTypeCode){
    //     this.$message({
    //       type:'error',
    //       message:'请先选择润滑点设备类型'
    //     })
    //   }
    // },
    // 获取车间
    getWorkShopList(id) {
      const params = {
        companyId: id,
        workshopName: "",
        current: 1,
        size: 500
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          // list.unshift({ workshopName: "暂无车间", workshopId: "0" });
          this.workshopList = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 设备类型
    getEptList() {
      this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {filterFlag:true}).then(res => {
        if (res.data.code == 1000) {
          this.eptList = res.data.data;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].children && data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    async handleType(val,type) {
      if(val=='addType' && type) {
        this.ruleForm.currentOilCode = type;
        let resCurrentOil = await this.getOilNameByOilCode(this.ruleForm.currentOilCode)
        this.oilList.push({oilAlias: resCurrentOil,code:this.ruleForm.currentOilCode})
      }else{
        this.ruleForm.recommendOilCode = val;
        let resRecommendOil = await this.getOilNameByOilCode(this.ruleForm.recommendOilCode)
        this.oilList.push({oilAlias: resRecommendOil,code:this.ruleForm.recommendOilCode})
      }
    },
    getOilData(val){
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, status:1, size:200, current:1}).then((res) => {
        if (res.data.code == 1000) {
          this.loadingRemote = false
          this.oilList = res.data.data.list;
          this.$nextTick(()=>{
            this.$refs['lupRuleForm'].clearValidate('currentOilCode')
          })
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 在用油名称
    oilNameChange(val) {
      if (val) {
        let item = this.oilList.filter(it=>{
          return it.code==val
        })
        this.ruleForm.oilBrandCode = item[0].parentCode
        this.ruleForm.currentOilCode = val
      }
    },
    //  查询用油品牌/类型/系列/名称 数据
    getQueryOilList(listName) {
      let params = {
        parentCode: 0,
        status: 1
      };
      this.requestMethodGet("/mdm/oil/queryOilList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { value: item.code, label: item.name };
              });
              switch (listName) {
                case "recommendOilTypeList":
                  this.recommendOilTypeList = optionData;
                  break;
                case "oilBrandList":
                  this.oilBrandList = optionData;
                  break;
                default:
                  break;
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
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
            this.getFullImgPath(data, file);
            this.ruleForm.lubricationPointPicPath=res.data[0];
            console.log(88888)
            
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
    console.log(9999)
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
    // 模糊搜索公司
    customerAllFilter(val) {
      this.selectCompanyName = val;
      this.$_queryCustomerData();
    },
    //查询所属客户
    $_queryCustomerData() {
      let params = {
        companyType: 2,
        size: 3000,
        status: 1,
        companyName: this.selectCompanyName
      };
      this.requestMethodGet("/web/customer/queryCompanyListByPage", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.customerList = res.data.list;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    //查询润滑点
    $_queryLPData() {
      let params = {
        parentCode: "lubrication_point_type"
      };
      this.requestMethodGet("/web/customer/getIndustryTreeList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              this.lubricationPointTypeList = res.data;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 所属客户 change 事件
    handleChangeCustomer(val) {
      this.ruleForm.workshopId = "";
      if (val) {
        const selectCompanyId = this.customerList.filter(item => {
          return item.companyNumber == val;
        })[0].companyId;
        this.getWorkShopList(selectCompanyId);
      } else {
        this.selectCompanyName = "";
        this.$_queryCustomerData();
      }
    },
    //查询换油单位配置数据
    $_queryOilChangePeriodData() {
      this.requestMethodGet("/web/device/getOilChangePeriodUnitConfig")
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { oilChangePeriodUnit: item.oilChangePeriodUnit, oilChangePeriodUnitDesc: item.oilChangePeriodUnitDesc };
              });
              this.oilChangePeriodList = optionData;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    deviceTypeSmallChange(val) {
      this.selectDevice = val;
    },
    //查询设备类型
    $_queryTypeData() {
      let params = {
        level: "3",
        customerNumber: this.customerNumber
      };
      this.requestMethodGet("/web/device/queryDeviceType", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              let optionData = res.data;
              optionData = optionData.map(item => {
                return { value: item.code, label: item.name };
              });
              this.typeList = optionData;
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 推荐油品名称 change 事件
    selectRecommendOilName(val) {
      if (val) {
        this.ruleForm.recommendOilCode = val;
      }
    },
    // 润滑点设备类型 change 事件===============
    handleLubricationPointTypeChange(val) {
      if (val) {
        var obj = {};
        obj = this.lubricationPointTypeList.filter(item => {
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
    lubricationPointNameBlur(){
      this.$refs['deviceRuleForm'].validateField(['eptType'],err=>{
        if(err){
          this.$message({
            message: '请先选择设备类型',
            type: "warning"
          });
          this.ruleForm.lubricationPointName = ''
        }
      })
    },
    // 通过润滑方式 确认是油类还是脂类
    getDeviceType(val) {
      var obj = {};
      obj = this.lubricationPointTypeData.filter(item => {
        return item.code === val;
      });
      this.oilTypeDevice = obj[0].oilType;
      if (this.oilTypeDevice == 2) {
        this.ruleForm.oilBoxCapacityUnit = "KG";
        this.ruleForm.everyTimeOilAddQuantityUnit = "KG";
        this.ruleForm.preMonthOilAddQuantityUnit = "KG";
        this.ruleForm.oilChangeMethod = "";
        this.ruleForm.oilChangePeriod = "";
        this.ruleForm.oilChangePeriodUnit = "";
        this.ruleForm.lastOilChangeDate = "";
        this.ruleForm.autoCreateOilChangePlan = "";
        this.ruleForm.fillingQuantity = "";
        this.ruleForm.fillingQuantityUnit = "L";
        this.ruleForm.nextScheduledOilChangeDate = "";
      } else {
        this.ruleForm.oilBoxCapacityUnit = "L";
        this.ruleForm.everyTimeOilAddQuantityUnit = "L";
        this.ruleForm.preMonthOilAddQuantityUnit = "L";
        this.ruleForm.oilChangeMethod = 2;
        this.ruleForm.autoCreateOilChangePlan = false;
        // 如果选择的润滑点设备类型是  发动机 
        if(this.ruleForm.lubricationPointTypeCode=='lubrication_point_type_0004') {
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
        typeCode: val
      };
      this.requestMethodGet("/web/device/getLubricationMethodByType", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.lubricationPointTypeData = res.data;
            if (this.lubricationPointTypeData.length == 1) {
              this.ruleForm.lubricationMethod = this.lubricationPointTypeData[0].code;
              this.oilTypeDevice = this.lubricationPointTypeData[0].oilType;
              if (this.oilTypeDevice == 1) {
                this.ruleForm.oilBoxCapacityUnit = "L";
                this.ruleForm.everyTimeOilAddQuantityUnit = "L";
                this.ruleForm.preMonthOilAddQuantityUnit = "L";
                this.ruleForm.autoCreateOilChangePlan = false;
                if(this.ruleForm.lubricationPointTypeCode=='lubrication_point_type_0004') {
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
              if (this.oilTypeDevice == 2) {
                this.oilTypeDevice = 1;
                this.ruleForm.oilBoxCapacityUnit = "L";
                this.ruleForm.everyTimeOilAddQuantityUnit = "L";
                this.ruleForm.preMonthOilAddQuantityUnit = "L";
              }
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 多个表单验证
    validateForms(formRefs) {
      let objectList = [];
      let results = formRefs.map(
        formRef =>
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
    //提交
    handleSubmitForm() {
      let refArr = [];
      if (this.isHas) {
        refArr = ["deviceRuleForm", "lupRuleForm", "oilRuleForm"];
      } else {
        refArr = ["deviceRuleForm"];
      }
      let formRefs = refArr.map(key => this.$refs[key]);
      this.validateForms(formRefs)
        .then(() => {
          // 校验换油周期值是否合法
          if (this.isHas) {
            const reg = /^[1-9]\d*$/;
            const oilChangePeriodNum = Number(this.ruleForm.oilChangePeriod);
            const oilAddPeriodNum = Number(this.ruleForm.oilAddPeriod);
            const regTestResult1 = reg.test(oilChangePeriodNum);
            const regTestResult2 = reg.test(oilAddPeriodNum);
            const isRollingBearing = this.oilTypeDevice == "2"; // 油类  加油周期     false  脂类 加脂周期
            const list = this.oilChangePeriodList;
            let MaxNum = null;
            let MaxNum1 = null;
            // 先判断 加油/加脂
            list.forEach(it => {
              it.rangMin = 1;
              if (isRollingBearing) {
                if(it.oilChangePeriodUnit != "KM") {
                  //加脂
                  it.rangMax = it.oilChangePeriodUnit == "Y" ? 2 : it.oilChangePeriodUnit == "M" ? 24 : it.oilChangePeriodUnit == "D" ? 730 : 17520;
                }
                //加脂
              } else {
                if(it.oilChangePeriodUnit != "KM") {
                  //加脂
                  it.rangMax = it.oilChangePeriodUnit == "Y" ? 20 : it.oilChangePeriodUnit == "M" ? 240 : it.oilChangePeriodUnit == "D" ? 7300 : 175200;
                }
                //换油
              }
            });
            if (isRollingBearing) {
              // 加脂周期   脂类
              list.forEach(item => {
                if (this.ruleForm.oilAddPeriodUnit == item.oilChangePeriodUnit) {
                  MaxNum1 = item.rangMax;
                }
              });
            } else {
              list.forEach(item => {
                // 油类  加油/加脂周期
                if (this.ruleForm.oilChangePeriodUnit == item.oilChangePeriodUnit) {
                  MaxNum = item.rangMax;
                }
              });
              list.forEach(item => {
                if (this.ruleForm.oilAddPeriodUnit == item.oilChangePeriodUnit) {
                  MaxNum1 = item.rangMax;
                }
              });
            }
            if (oilAddPeriodNum) {
              if (regTestResult2 && oilAddPeriodNum >= 1 && oilAddPeriodNum <= MaxNum1) {
              } else {
                if(MaxNum1) {
                  this.$message({
                    type: "error",
                    message: `加油/加脂周期：请输入1~${MaxNum1}的整数`
                  });
                  return;
                }
              }
            }
            if (regTestResult1 && oilChangePeriodNum && !isRollingBearing) {
              if (oilChangePeriodNum >= 1 && oilChangePeriodNum <= MaxNum) {
              } else {
                if(MaxNum) {
                  this.$message({
                  type: "error",
                  message: `换油周期：请输入1~${MaxNum}的整数`
                });
                return;
                }
              }
            }
          }
          this.$gio.saveCreateDeviceInfo({
            entrance: "新建设备页",
            operation: "点击保存按钮",
            customer: this.$gio.findValueCodeCorresponding(this.customerList, this.ruleForm.customerNumber, "companyNumber", "companyName")
          });
          this.$confirm("确定提交添加设备?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$gio.saveCreateDeviceInfo({
                entrance: "新建设备页",
                operation: "弹框中点击确定",
                customer: this.$gio.findValueCodeCorresponding(this.customerList, this.ruleForm.customerNumber, "companyNumber", "companyName")
              });
              console.log(this.ruleForm.eptType[this.ruleForm.eptType.length - 1],this.ruleForm.eptType)
              var params = new FormData();
              params.append("deviceName", this.ruleForm.deviceName);
              params.append("customerNumber", this.ruleForm.customerNumber);
              params.append("deviceType ", this.ruleForm.eptType[this.ruleForm.eptType.length - 1]);
              params.append("workshopId ", this.ruleForm.workshopId);
              params.append("manufacturer ", this.ruleForm.manufacturer);
              params.append("deviceModel ", this.ruleForm.deviceModel);
              params.append("deviceCode", this.ruleForm.deviceCode);
              params.append("devicePosition", this.ruleForm.devicePosition);
              params.append("customerVisibility", this.ruleForm.customerVisibility);
              params.append("haveLubricationPointFlag", this.isHas);
              // 是否有部件需要润滑 如果是有，传入润滑点信息参数
              if (this.isHas) {
                params.append("oilBoxCapacity", this.ruleForm.oilBoxCapacity);  //油箱容量
                params.append("oilBoxCapacityUnit", this.ruleForm.oilBoxCapacityUnit);  //油箱容量单位
                params.append("oilBrandCode", this.ruleForm.oilBrandCode);  // 在用油品品牌 code
                params.append("oilBrand", this.oilBrandName);  // 在用油品品牌 name
                params.append("lubricationPointManufacturer", this.ruleForm.lubricationPointManufacturer); //润滑点设备制造商名称
                params.append("lubricationPointTypeCode ", this.ruleForm.lubricationPointTypeCode);   // 润滑点设备类型
                if(this.ruleForm.lubricationPointPicPath) {
                  params.append("lubricationPointPicPath", this.ruleForm.lubricationPointPicPath ); // 润滑点图片
                }
                
                params.append("lubricationPointType ", this.ruleForm.lubricationPointType); // 润滑点设备类型名称
                params.append("oilType", this.oilTypeDevice);  // 油类/脂类润滑点
                if(this.lupDeviceNameList.length>1 && this.ruleForm.lubricationPointSelectName != '自定义'){
                  params.append("lubricationPointName ", this.ruleForm.lubricationPointSelectName); //润滑点设备名称
                }else{
                  params.append("lubricationPointName ", this.ruleForm.lubricationPointName); //润滑点设备名称
                }
                params.append("lubricationPointDesc", this.ruleForm.lubricationPointDesc); //描述
                if (this.ruleForm.recommendOilCode) {  // 推荐油品
                  params.append("recommendOilCode", this.ruleForm.recommendOilCode);
                }
                params.append("currentOilCode", this.ruleForm.currentOilCode);  //在用油品名称
                params.append("lubricationMethod", this.ruleForm.lubricationMethod); // 润滑⽅式
                // 油类润滑点 
                if (this.oilTypeDevice == 1) {   
                  // 普通油类 特殊展示
                  if(this.showOrHideState==0) {  
                    params.append("oilChangeMethod", this.ruleForm.oilChangeMethod);  // 定期或者按质
                    params.append("oilChangePeriod", this.ruleForm.oilChangePeriod);  // 换油周期
                    params.append("oilChangePeriodUnit", this.ruleForm.oilChangePeriodUnit);  // 换油周期单位
                    if (this.ruleForm.lastOilChangeDate) {  // 上次换油⽇期
                      params.append("lastOilChangeDate ", this.ruleForm.lastOilChangeDate);
                      params.append("fillingQuantity", this.ruleForm.fillingQuantity); //  上次换油时加注量
                      params.append("fillingQuantityUnit", this.ruleForm.fillingQuantityUnit); // 上次换油时加注量单位
                    }
                    if(this.ruleForm.oilChangeMethod == 1 && this.ruleForm.lastOilChangeDate && this.ruleForm.oilChangePeriod && this.ruleForm.oilChangePeriodUnit!='KM') {
                      params.append("autoCreateOilChangePlan", this.ruleForm.autoCreateOilChangePlan); // 是否自动生成下次换油计划？
                      // 预计下次换油日期
                      if (this.ruleForm.nextScheduledOilChangeDate && this.ruleForm.autoCreateOilChangePlan) { 
                        params.append("nextScheduledOilChangeDate ", this.ruleForm.nextScheduledOilChangeDate);
                      }
                    }
                  }

                  params.append("oilAddPeriod", this.ruleForm.oilAddPeriod);  //加油周期
                  params.append("oilAddPeriodUnit", this.ruleForm.oilAddPeriodUnit); //加油周期单位
                  params.append("lastOilAddDate", this.ruleForm.lastOilAddDate); // 上次加油⽇期
                  params.append("everyTimeOilAddQuantity", this.ruleForm.everyTimeOilAddQuantity);  // 每次加油量
                  params.append("everyTimeOilAddQuantityUnit", this.ruleForm.everyTimeOilAddQuantityUnit);  // 每次加油量 单位
                  params.append("preMonthOilAddQuantity", this.ruleForm.preMonthOilAddQuantity); //每月润滑剂添加量
                  params.append("preMonthOilAddQuantityUnit", this.ruleForm.preMonthOilAddQuantityUnit); //每月润滑剂添加量单位
                  //是否自动生成下次加油计划  
                  if(this.ruleForm.oilAddPeriod && this.ruleForm.lastOilAddDate && this.ruleForm.oilAddPeriodUnit!='KM') {
                    params.append("autoCreateOilAddPlan", this.ruleForm.autoCreateOilAddPlan);
                    if(this.ruleForm.autoCreateOilAddPlan) {
                      params.append("nextScheduledOilAddDate", this.ruleForm.nextScheduledOilAddDate);  //预计下次加油日期
                    }
                  }
                }
                 // 脂类润滑点 
                if(this.oilTypeDevice == 2) {  
                    params.append("oilAddPeriodUnit", this.ruleForm.oilAddPeriodUnit);  //加脂周期单位
                    params.append("oilAddPeriod", this.ruleForm.oilAddPeriod);  //加脂周期
                    
                    params.append("everyTimeOilAddQuantity", this.ruleForm.everyTimeOilAddQuantity);  //每次加脂量 / 每次加油量
                    
                    params.append("everyTimeOilAddQuantityUnit", this.ruleForm.everyTimeOilAddQuantityUnit);  //每次加脂量 / 每次加油量 单位
                    
                    
                    params.append("lastOilAddDate", this.ruleForm.lastOilAddDate); // 上次加脂⽇期
                    params.append("preMonthOilAddQuantity", this.ruleForm.preMonthOilAddQuantity);  //每月润滑剂添加量
                    
                    params.append("preMonthOilAddQuantityUnit", this.ruleForm.preMonthOilAddQuantityUnit);  //每月润滑剂添加量单位
                    
                    if(this.ruleForm.lastOilAddDate && this.ruleForm.oilAddPeriod && this.ruleForm.oilAddPeriodUnit!='KM') {
                      params.append("autoCreateOilAddPlan", this.ruleForm.autoCreateOilAddPlan);  //是否自动生成下次加脂计划 /是否自动生成下次加油计划
                      //  预计下次加油日期/预计下次加脂日期
                      if (this.ruleForm.nextScheduledOilAddDate != "" && this.ruleForm.autoCreateOilAddPlan) {
                        params.append("nextScheduledOilAddDate", this.ruleForm.nextScheduledOilAddDate);
                      }
                    }
                    
                  }
              }
              this.requestMethodPost("/web/device/addDeviceV2", params)
                .then(res => {
                  res = res.data;
                  if (res.code == 1000) {
                    this.$message({
                      message: "添加成功",
                      type: "success"
                    });
                    if(res.data.tips && this.$userInfo.userType != 2){
                      this.showSyncLubDialog = true
                      this.tipsData = res.data.tips
                    }else{
                      this.$router.push({
                        path: "/EquipmentProfile"
                      });
                    }
                  } else {
                    this.$message({
                      message: res.msg,
                      type: "warning"
                    });
                  }
                })
                .catch(res => {});
            })
            .catch(() => {});
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 返回
    handleResetFrom() {
      this.$gio.cancelCreate({
        entrance: "新建设备页",
        operation: "点击取消按钮",
        customer: this.$gio.findValueCodeCorresponding(this.customerList, this.ruleForm.customerNumber, "companyNumber", "companyName")
      });
      this.$confirm("确认退出新建设备吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$gio.cancelCreate({
            entrance: "新建设备页",
            operation: "弹框中点击是",
            customer: this.$gio.findValueCodeCorresponding(this.customerList, this.ruleForm.customerNumber, "companyNumber", "companyName")
          });
          if (this.isHas) {
            this.$refs["deviceRuleForm"].resetFields();
            this.$refs["lupRuleForm"].resetFields();
            this.$refs["oilRuleForm"].resetFields();
            this.$router.push({
              path: "/EquipmentProfile"
            });
          } else {
            this.$refs["deviceRuleForm"].resetFields();
            this.$router.push({
              path: "/EquipmentProfile"
            });
          }
        })
        .catch(() => {});
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`;
    }
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
    }
  }
};
</script>
<style lang="less" scoped>
.add-customer-profile {
  padding: 0 20px;
  height: 100%;
  overflow: auto;
  &-title {
    font-size: 14px;
    color: #999;
    span {
      color: #999;
      font-weight: normal;
      font-size: 12px;
    }
  }
  &-header {
    width: 100%;
    height: 40px;
    background: rgb(247, 247, 247);
    line-height: 40px;
    padding-left: 20px;
    font-size: 18px;
    font-weight: bold;
    margin: 20px 0;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 114px;
    height: 114px;
  }
  /deep/.el-upload--picture-card {
    line-height: 114px;
  }
  /deep/ .el-upload-list--picture-card .el-upload-list__item {
    margin: -8px 8px 8px 0;
  }
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 114px;
    height: 114px;
  }
}
/deep/ .filterConditionType .el-form-item__error {
  left: 75px !important;
}
/deep/ .el-form-item__label {
  color: #000 !important;
}
/deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: #001450 !important;
  background: #001450 !important;
}
.detail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.info {
  width: 960px;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
}
.info-title {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-bottom: 1px solid #e9e9e9;
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
.detail-form {
  margin-top: 20px;
  margin-left: 80px;
}
</style>
<style>
.add-customer-profile .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.add-customer-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.add-customer-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.add-customer-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}
.footer {
  padding: 20px 20px 0;
}

.hide .el-upload--picture-card {
  display: none;
}
</style>
