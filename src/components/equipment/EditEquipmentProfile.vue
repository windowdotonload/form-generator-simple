<!--
* @description  编辑设备档案
* @fileName EditEquipmentProfile.vue
* @author vvx
* @date 2020/04/15 16:57:26
* @version V1.0.0
!-->
<template>
  <div class="edit-equipment-profile" :style="mainminheight">
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
                    :key="eptTypeKey"
                    size="small"
                    v-model="ruleForm.eptType"
                    placeholder="试试搜索：设备"
                    :options="eptList"
                    @change="eptTypeChange"
                    @focus="focusEptTypeChange"
                    filterable
                    clearable
                    ref="deviceRef"
                    style="width: 80%"
                    :props="{ value: 'code', label: 'name' }"
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
              <el-col :span="12">
                <el-form-item label="所属客户" prop="companyName">
                  <span style="margin-left: 15px">{{ ruleForm.companyName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属车间" prop="workshopId">
                  <el-select v-model="ruleForm.workshopId" :disabled="!canEditFlag" placeholder="请选择" size="small" clearable style="width: 80%" filterable>
                    <el-option v-for="item in workshopList" :key="item.workshopId" :label="item.workshopName" :value="item.workshopId"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
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
            </el-row>
            <el-row :gutter="20">
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
      <div class="info detail-other-info">
        <div class="lup-info">
          <div class="lup-left">
            <div class="content-title left-padding">润滑点列表</div>
            <div style="margin: 16px 0" class="left-padding">
              <el-button style="width: 100%" type="danger" plain size="small" @click="addLup">添加润滑点</el-button>
            </div>
            <!-- 润滑点列表 -->
            <div style="border-top: 1px solid #e9e9e9">
              <ul style="list-style: none; display: contents" v-if="menus && menus.length > 0">
                <li v-for="(item, index) in menus" :key="index" class="lup-li" @click="selectWay(index, item.id)" :style="{ backgroundColor: item.isActive ? '#f9f9f9' : '#fff' }">
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="item.lubricationPointName ? item.lubricationPointName + '-' + item.lubricationPointType : item.lubricationPointType"
                    placement="top"
                  >
                    <div style="display: flex; align-items: center">
                      <div class="lup-name" :style="{ color: item.isActive ? '#001450' : '#333' }">
                        {{ item.lubricationPointName ? item.lubricationPointName + "-" + item.lubricationPointType : item.lubricationPointType }}
                      </div>
                      <img @click="checkLubricationPoint(item.lubricationPointNumber)" class="icon-service" :src="item.isActive ? active_delete : default_delete" alt="" />
                    </div>
                  </el-tooltip>
                </li>
              </ul>
              <span v-else
                      style="font-size:14px;color:#999;display: flex;align-items: center;justify-content: center;margin-top: 18px;">暂无润滑点</span>
            </div>
          </div>
          <div class="lup-right">
            <div class="info-title">
              <div class="line"></div>
              <div class="title">润滑点信息</div>
            </div>
            <div v-if="menus && menus.length > 0">
              <el-form ref="lupRuleForm" :rules="rules" :model="selectLubricatePointData" label-width="100px" label-position="top">
                <div class="detail-form">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="润滑点设备名称" :prop="(lupDeviceNameList.length<=1 || selectLubricatePointData.lubricationPointSelectName=='自定义')?'lubricationPointName':'lubricationPointSelectName'">
                        <div style="display:flex" v-if="lupDeviceNameList.length>1">
                          <el-select
                            v-model="selectLubricatePointData.lubricationPointSelectName"
                            placeholder="请选择润滑点设备名称"
                            size="small"
                            :style="{width:(selectLubricatePointData.lubricationPointSelectName=='自定义')?'30%':'80%',marginRight:(selectLubricatePointData.lubricationPointSelectName=='自定义')?'5px':''}"
                            @change="lubricationPointSelectNameChange"
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
                            :style="{width:(selectLubricatePointData.lubricationPointSelectName=='自定义')?'50%':'80%'}" 
                            v-if="selectLubricatePointData.lubricationPointSelectName=='自定义'"
                            v-model="selectLubricatePointData.lubricationPointName" 
                            maxlength="50" clearable placeholder="请输入">
                          </el-input>
                        </div>
                        <div v-else>
                          <el-input size="small"
                            v-model="selectLubricatePointData.lubricationPointName" 
                            maxlength="50" style="width:80%" clearable placeholder="请输入"></el-input>
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
                        <el-select
                          v-model="selectLubricatePointData.lubricationPointTypeCode"
                          placeholder="请选择"
                          size="small"
                          style="width: 80%"
                          :disabled="this.$route.query.resource == 'report' || this.$route.query.resource == 'task'"
                          @change="handleLubricationPointTypeChange"
                          @focus="focusLubricationPointTypeChange"
                        >
                          <el-option v-for="item in lubricationPointTypeList" :key="item.code" :label="item.name" :value="item.code" clearable> </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 80px">
                      <el-form-item label="润滑⽅式" prop="lubricationMethod">
                        <el-select
                          size="small"
                          clearable
                          :disabled="this.$route.query.resource == 'task'"
                          v-model="selectLubricatePointData.lubricationMethod"
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
                        <el-select style="width: 80%" size="small" v-model="selectLubricatePointData.currentOilCode" placeholder="试试搜索：油品名称" clearable filterable remote :loading="loadingRemote" :remote-method="(val)=>{focusOilNameChange(val, 'currentOilCode')}" @change="oilNameChange"
                          @focus="focusOilNameChange('', 'currentOilCode')">
                          <el-option v-for="item in currentOilListNew" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
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
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item
                            prop="oilBoxCapacity"
                            label="油箱容量"
                            :rules="[
                              { required: this.oilTypeDevice == 1 ? true : false, message: '请输入油箱容量', trigger: 'blur' },
                              { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }
                            ]"
                          >
                            <el-input size="small" v-model="selectLubricatePointData.oilBoxCapacity" maxlength="10" placeholder="请输入" clearable></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="oilBoxCapacityUnit" :rules="[{ required: this.oilTypeDevice == 1 ? true : false, message: '请选择油箱容量单位', trigger: 'change' }]">
                            <span slot="label">单位</span>
                            <el-select size="small" clearable v-model="selectLubricatePointData.oilBoxCapacityUnit">
                              <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>

                    <el-col :span="12" style="height: 80px">
                      <el-form-item label="设备制造商推荐油品" prop="recommendOilCode">
                        <el-select style="width: 80%" size="small" v-model="selectLubricatePointData.recommendOilCode" placeholder="试试搜索：油品名称" clearable filterable remote :loading="loadingRemote" :remote-method="(val)=>{focusOilNameChange(val, 'recommendOilCode')}" @change="selectRecommendOilName"
                          @focus="focusOilNameChange('', 'recommendOilCode')">
                          <el-option v-for="item in recommendOilListNew" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
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
                    <el-col :span="12" style="height: 80px">
                      <el-form-item label="润滑点设备制造商名称">
                        <el-input size="small" v-model="selectLubricatePointData.lubricationPointManufacturer" maxlength="50" clearable placeholder="请输入" style="width: 80%"></el-input>
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
                        <el-input
                          type="textarea"
                          :autosize="{ minRows: 6, maxRows: 8 }"
                          size="small"
                          v-model="selectLubricatePointData.lubricationPointDesc"
                          maxlength="200"
                          show-word-limit
                          placeholder="请输入"
                          style="width: 90%"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
                <div class="info-title">
                  <div class="line"></div>
                  <div class="title">用油信息</div>
                </div>
                <!-- 如果选的是油类 -->
                <div class="detail-form" v-if="oilTypeDevice == 1">
                  <el-row :gutter="24">
                    <el-col :span="12" v-if="showOrHideStateFlag == 0">
                      <el-form-item label="定期或按质换油" prop="oilChangeMethod" :rules="[{ required: true, message: '请选择定期或按质换油', trigger: 'change' }]">
                        <el-radio-group v-model="selectLubricatePointData.oilChangeMethod" @change="oilChangeMethodChange">
                          <el-radio :label="1">定期</el-radio>
                          <el-radio :label="2">按质</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="12" v-if="showOrHideStateFlag == 0" style="height: 80px">
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item
                            prop="oilChangePeriod"
                            label="换油周期"
                            :rules="[
                              { validator: validatePeriodVal(this.selectLubricatePointData), trigger: 'blur' },
                              { required: true, message: '请输入换油周期', trigger: 'blur' },
                              { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
                            ]"
                          >
                            <el-input
                              size="small"
                              v-model="selectLubricatePointData.oilChangePeriod"
                              @change="dateChange('lastOilChangeDate')"
                              maxlength="10"
                              placeholder="请输入"
                              class="input-with-select"
                              clearable
                            >
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="oilChangePeriodUnit">
                            <span slot="label">单位</span>
                            <el-select size="small" @change="dateChange('lastOilChangeDate')" clearable v-model="selectLubricatePointData.oilChangePeriodUnit">
                              <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="showOrHideStateFlag == 0" style="height: 80px">
                      <!-- 按质是非必填  定期是必填 -->
                      <el-form-item label="上次换油日期" prop="lastOilChangeDate">
                        <el-date-picker
                          v-model="selectLubricatePointData.lastOilChangeDate"
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
                    <el-col :span="12" v-if="showOrHideStateFlag == 0 && selectLubricatePointData.lastOilChangeDate">
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item
                            prop="fillingQuantity"
                            label="上次换油时加注量"
                            :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                          >
                            <el-input size="small" v-model="selectLubricatePointData.fillingQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="fillingQuantityUnit">
                            <span slot="label">单位</span>
                            <el-select size="small" clearable v-model="selectLubricatePointData.fillingQuantityUnit">
                              <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col
                      :span="12"
                      v-if="showOrHideStateFlag == 0 &&
                      selectLubricatePointData.oilChangeMethod == 1 &&
                      selectLubricatePointData.lastOilChangeDate &&
                      selectLubricatePointData.oilChangePeriod &&
                      selectLubricatePointData.oilChangePeriodUnit!='KM'"
                    >
                      <el-form-item label="是否自动生成下次换油计划？">
                        <el-radio-group v-model="selectLubricatePointData.autoCreateOilChangePlan">
                          <el-radio :label="true">是</el-radio>
                          <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col
                      :span="12"
                      v-if="
                        showOrHideStateFlag == 0 &&
                          selectLubricatePointData.autoCreateOilChangePlan &&
                          selectLubricatePointData.oilChangeMethod == 1 &&
                          selectLubricatePointData.lastOilChangeDate &&
                          selectLubricatePointData.oilChangePeriod &&
                          selectLubricatePointData.oilChangePeriodUnit!='KM'
                      "
                    >
                      <el-form-item label="预计下次换油日期" prop="nextScheduledOilChangeDate">
                        <el-date-picker
                          v-model="selectLubricatePointData.nextScheduledOilChangeDate"
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
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item prop="oilAddPeriod" label="加油周期" :rules="[{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]">
                            <el-input
                              size="small"
                              v-model="selectLubricatePointData.oilAddPeriod"
                              @change="dateChange('lastOilAddDate')"
                              maxlength="10"
                              placeholder="请输入"
                              class="input-with-select"
                              clearable
                            >
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="oilAddPeriodUnit">
                            <span slot="label">单位</span>
                            <el-select size="small" clearable @change="dateChange('lastOilAddDate')" v-model="selectLubricatePointData.oilAddPeriodUnit">
                              <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="上次加油⽇期" prop="lastOilAddDate">
                        <el-date-picker
                          v-model="selectLubricatePointData.lastOilAddDate"
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
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item
                            prop="everyTimeOilAddQuantity"
                            label="每次加油量"
                            :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                          >
                            <el-input size="small" v-model="selectLubricatePointData.everyTimeOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="everyTimeOilAddQuantityUnit">
                            <span slot="label">单位</span>
                            <el-select size="small" clearable v-model="selectLubricatePointData.everyTimeOilAddQuantityUnit">
                              <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item
                            prop="preMonthOilAddQuantity"
                            label="每月润滑剂添加量"
                            :rules="[
                              { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' },
                              { required: showOrHideStateFlag == 1 ? true : false, message: '请输入每月润滑剂添加量', trigger: 'blur' }
                            ]"
                          >
                            <el-input size="small" v-model="selectLubricatePointData.preMonthOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="preMonthOilAddQuantityUnit">
                            <span slot="label">单位</span>
                            <el-select size="small" clearable v-model="selectLubricatePointData.preMonthOilAddQuantityUnit">
                              <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="12" v-if="selectLubricatePointData.oilAddPeriod &&
                    selectLubricatePointData.lastOilAddDate &&
                    selectLubricatePointData.oilAddPeriodUnit!='KM'">
                      <el-form-item label="是否自动生成下次加油计划？">
                        <el-radio-group v-model="selectLubricatePointData.autoCreateOilAddPlan">
                          <el-radio :label="true">是</el-radio>
                          <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="selectLubricatePointData.autoCreateOilAddPlan &&
                    selectLubricatePointData.lastOilAddDate &&
                    selectLubricatePointData.oilAddPeriod &&
                    selectLubricatePointData.oilAddPeriodUnit!='KM'">
                      <el-form-item label="预计下次加油日期">
                        <el-date-picker
                          v-model="selectLubricatePointData.nextScheduledOilAddDate"
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
                </div>
                <!-- 脂类 -->
                <div class="detail-form" v-if="oilTypeDevice == 2">
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item prop="oilAddPeriod" label="加脂周期" :rules="[{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]">
                            <el-input
                              size="small"
                              v-model="selectLubricatePointData.oilAddPeriod"
                              maxlength="10"
                              @change="dateChange('lastOilAddDate2')"
                              placeholder="请输入"
                              class="input-with-select"
                              clearable
                            >
                            </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="oilAddPeriodUnit">
                            <span slot="label">单位</span>
                            <el-select size="small" @change="dateChange('lastOilAddDate2')" clearable v-model="selectLubricatePointData.oilAddPeriodUnit">
                              <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item
                            prop="everyTimeOilAddQuantity"
                            label="每次加脂量"
                            :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                          >
                            <el-input size="small" v-model="selectLubricatePointData.everyTimeOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="everyTimeOilAddQuantityUnit">
                            <span slot="label">单位</span>
                            <el-select size="small" clearable v-model="selectLubricatePointData.everyTimeOilAddQuantityUnit">
                              <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item>
                        <el-col :span="11" style="padding: 0">
                          <el-form-item
                            prop="preMonthOilAddQuantity"
                            label="每月润滑剂添加量"
                            :rules="[
                              { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' },
                              { required: true, message: '请输入每月润滑剂添加量', trigger: 'blur' }
                            ]"
                          >
                            <el-input size="small" v-model="selectLubricatePointData.preMonthOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="9">
                          <el-form-item prop="preMonthOilAddQuantityUnit">
                            <span slot="label">单位</span>
                            <el-select size="small" clearable v-model="selectLubricatePointData.preMonthOilAddQuantityUnit">
                              <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="上次加脂⽇期" prop="lastOilAddDate">
                        <el-date-picker
                          v-model="selectLubricatePointData.lastOilAddDate"
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
                    <el-col :span="12">
                      <el-form-item label="是否自动生成下次加脂计划？" v-if="selectLubricatePointData.lastOilAddDate &&
                      selectLubricatePointData.oilAddPeriod &&
                      selectLubricatePointData.oilAddPeriodUnit!='KM'">
                        <el-radio-group v-model="selectLubricatePointData.autoCreateOilAddPlan">
                          <el-radio :label="true">是</el-radio>
                          <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item v-if="selectLubricatePointData.lastOilAddDate &&
                      selectLubricatePointData.oilAddPeriod && selectLubricatePointData.autoCreateOilAddPlan &&
                      selectLubricatePointData.oilAddPeriodUnit!='KM' " label="预计下次加脂日期">
                        <el-date-picker
                          v-model="selectLubricatePointData.nextScheduledOilAddDate"
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
                </div>
              </el-form>
            </div>
            <div v-else
                   style="display: flex;align-items: center;justify-content: center;flex-direction: column;padding-bottom: 40px;">
                <img src="../../assets/no_lup.png"
                     alt="" />
                <div style="font-size:14px;color:#999;">暂无润滑点详情</div>
              </div>
          </div>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div slot="footer" style="margin: 30px 0">
        <el-button type="danger" plain @click="handleResetFrom" size="small">取消</el-button>
        <el-button type="danger" @click="handleSubmitForm" size="small">保存</el-button>
      </div>
    </div>
    <!-- 自定义设备类型 -->
    <el-dialog title="自定义设备类型" :visible.sync="createDeviceFlag" width="30%" :close-on-click-modal="false">
      <el-form :model="addDeviceForm" :rules="addDeviceRules" ref="addDeviceRef" class="demo-selectLubricatePointData">
        <el-form-item prop="name">
          <el-input v-model="addDeviceForm.name" size="small" clearable maxlength="25"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('addDeviceRef')" size="small">取 消</el-button>
        <el-button type="danger" @click="completeAdd('addDeviceRef')" size="small">完 成</el-button>
      </span>
    </el-dialog>
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
    <!-- 新增润滑点 -->
    <LupDialog
      :dialogFlag="dialogFlag"
      :ruleForm="addLupForm"
      :lupDeviceNameList="lupDeviceNameList"
      :imageLubricationList="addLupImgList"
      :recommendOilCodeKey="recommendOilCodeKey"
      :lubricationPointTypeList="lubricationPointTypeList"
      :oilBrandList="oilBrandList"
      :oilChangePeriodList="oilChangePeriodList"
      :oilBoxCapacityList="oilBoxCapacityList"
      :methodsList="methodsList"
      :recommendOilList="recommendOilList"
      :oilList="oilList"
      v-on:addOrEditLup="addOrEditLup"
      v-on:closeDialog="closeDialog"
      ref="LupDialogRef"
    />
    <!-- 自定义添加油品 -->
    <AddOil
      :addOilDialog="addOilDialog"
      :addType="addType"
      :addOilForm="addOilForm"
      :ruleForm="ruleForm"
      v-on:addOrEditOil="addOrEditOil"
      v-on:closeDialogAdd="closeDialogAdd"
      ref="LupDialogRef1"
    />
  <!-- 显示同步核心润滑表信息弹框 -->
  <SyncLub :dialogFlag="showSyncLubDialog" @closeSyncLubDialog="closeSyncLubDialog" :tipsData="tipsData"/>
  </div>
</template>

<script>
import SyncLub from "./components/syncLubDialog.vue";
import LupDialog from "./components/lupDialog";
import AddOil from "./components/addOil";
import { nextTick } from 'vue';
export default {
  components: { LupDialog,AddOil,SyncLub },
  data() {
    const validateEptType = (rule, value, callback) => {
      if (this.ruleForm.eptType.length == 0) {
        return callback(new Error("请选择设备类型"));
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
            return callback(new Error("请输入小于7300天的周期"));
          } else if (oilChangePeriodUnit == "H" && value > 175200) {
            return callback(new Error("请输入小于175200小时的周期"));
          } else {
            return callback();
          }
        };
      },
      showSyncLubDialog: false,
      tipsData: {},
      loadingRemote:false,
      showOrHideStateFlag: null,
      dialogFlag: false,
      expireTimeOption: {
        disabledDate(date) {
          //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          return date.getTime() > Date.now();
        }
      },

      mainminheight: `height:${document.documentElement.clientHeight - 160}px`,
      uploadUrl: "",
      addOilDialog: false, // 手动添加油品弹框
      noticeError:'',
      brandError:false,
      typeError:false,
      nameError:false,
      // 手动添加油品弹框
      addOilForm: {
        oilBrand: "",
        oilType: "",
        oilName: ""
      },
      addOilRules: {
        oilBrand: [{ required: true, message: "请选择油品品牌", trigger: "change" }],
        oilBrandName: [{ required: true, message: "请输入", trigger: "blur" }],
        oilName: [{ required: true, message: "请输入油品名称", trigger: "blur" }],
        oilTypeName: [{ required: true, message: "请输入", trigger: "blur" }],
        oilType: [{ required: true, message: "请选择油品类型", trigger: "change" }]
      },
      isAdd: false,
      oilTypeDevice: 1,
      imageList: [], //图片
      imageLubricationList: [], // 润滑点图片
      hideUpload: false, //是否隐藏添加图片，默认展示
      // 表单验证
      ruleForm: {
        deviceName: "",
        customer: "",
        cardNumber: "",
        manufacture: "",
        area: "",
        nowDate: "",
        eptType: [], //设备类型
        workshopId: "", //所属设备
        devicePosition: "",
        deviceCode: "",
        customerVisibility: 1
      },
      lubFlag: false,
      selectLubricatePointData: {
        recommendOilBrand: "",
        recommendOilType: "",
        recommendOilSeries: "",
        recommendOilCode: "",
        imgLubricationFile: "",
        lubricationPointTypeCode: "",
        lubricationPointType: "",
        lubricationPointDesc: "",
        lubricationMethod: "",
        nextScheduledOilChangeDate: "",
        nextScheduledOilAddDate: "",
        lubricationPointName: "",
        lubricationPointSelectName:''
      },
      //   表单验证规则
      rules: {
        eptType: [{ required: true, validator: validateEptType, trigger: "change" }],
        workshopId: [{ required: true, message: "请选择车间", trigger: "change" }],
        deviceName: [{ required: true, message: "请输入设备名称", trigger: "blur" }],
        lubricationPointName: [{ required: true, message: "请输入润滑点设备名称", trigger: "blur" }],
        lubricationPointSelectName: [{ required: true, message: "请选择润滑点设备名称", trigger: "change" }],
        companyName: [{ required: true, message: "请选择所属客户", trigger: "change" }],
        cardNumber: [{ pattern: /^[0-9]{8}$/, message: "请输入8位数字", trigger: "blur" }],
        lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
        oilBrandCode: [{ required: true, message: "请选择在用油品牌", trigger: "change" }],
        oilChangePeriodUnit: [{ required: true, message: "请选择换油周期单位", trigger: "change" }],
        oilBoxCapacityUnit: [{ required: true, message: "请选择油箱容量单位", trigger: "change" }],
        lubricationMethod: [{ required: true, message: "请选择润滑方式", trigger: "change" }],
        oilBrand: [{ required: true, message: "请选择在用油品牌", trigger: "change" }],
        recommendOilType: [{ required: false, message: "请继续完善设备制造商推荐油品类型", trigger: "change" }],
        recommendOilSeries: [{ required: false, message: "请继续完善设备制造商推荐油品系列", trigger: "change" }],
        recommendOilCode: [{ required: false, message: "请继续完善设备制造商推荐油品名称", trigger: "change" }],
        currentOilCode: [{ required: true, message: "请继续完善在用油品名称", trigger: "change" }],
        customerVisibility: [{ required: true, message: "请选择是否对客户可见", trigger: "change" }]
      },
      lubricationPointTypeData: [], // 润滑方式数组
      typeList: [], //类型
      typeBigCode: "", // 选中的类型大类的 code
      oilListAll:[],  // 全量的油品数据
      typeSmallList: [], // 设备类型小类
      oilChangePeriodList: [], // 换油单位
      lubricatePointData: [],
      oilBoxCapacityList: [{ oilBoxCapacityUnit: "L", oilBoxCapacityUnitDesc: "L" }, { oilBoxCapacityUnit: "KG", oilBoxCapacityUnitDesc: "KG" }],
      totalNumber: 0, //总条数
      isFlag: true,
      selectDevice: "",
      selectWayNum: "",
      menus: [],
      lubricationPointTypeList: [], // 润滑点设备类型数组
      oilBrandList: [], // 油品品牌数组
      recommendOilTypeList: [], // 推荐油品类型数组
      recommendOilList: [], // 推荐油品名称数组
      oilTypeList: [], // 在用油品类型数组
      oilSeriesList: [], // 在用油品系列数组
      oilList: [], // 在用油品名称数组
      recommendOilListNew:[],
      currentOilListNew:[],
      customerList: [], // 所属客户
      hasDoneTestList: [{ hasDoneTest: "true", hasDoneTestDesc: "是" }, { hasDoneTest: "false", hasDoneTestDesc: "否" }],
      typeProps: {
        value: "code",
        label: "name"
      },
      countData: [], // 动态
      countTrends: 0, // 动态总条数
      current: 1,
      delCust: "0",
      addForm: {
        nextScheduledOilChangeDate: "",
        lastOilChangeDate: "",
        fillingQuantity: "",
        currentOilCode: ""
      },
      currentIndex: 0,
      oilBrandCodeAdd: "",
      oilTypeListAdd: [],
      oilSeriesListAdd: [],
      deleteLubricateList: [],
      oilBoxCapacityUnitAdd: "",
      selectRecommendOil: "", // 选择的推荐用油品牌
      default_delete: require("../../assets/delet_lup_default.png"),
      active_delete: require("../../assets/delet_lup_active.png"),
      eptList: [],
      addLupForm: {}, //添加润滑点表单
      addLupImgList: [], //添加润滑点图片
      recommendKey: 1,
      recommendOilCodeKey: 1,
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
      // workshopList: [{ workshopName: "暂无车间", workshopId: "0" }],
      workshopList: [],
      eptTypeKey: 1,
      canEditFlag: false,
      oilBrandListAdd: [],
      addType: "",
      timeDiaabled: "",
      disabledOilBrand: false,
      lupDeviceNameList:[],
      deptData:[],
    };
  },
  mounted() {
    this.$_queryOilChangePeriodData(); // 查询换油单位
    this.$_queryLPData(); //查询润滑点
    this.getOilBrandData(); // 获取品牌数据
  },
  watch: {
    selectLubricatePointData: {
      handler(val) {
        const { lubricationPointTypeCode, lubricationMethod } = val;
        this.showOrHideStateFlag = this.showOrHideState(lubricationPointTypeCode, lubricationMethod);
      },
      deep: true
    }
  },
  computed: {
    pickerBeginDateBefore() {
      const nowDate = new Date();
      const curY = nowDate.getFullYear() + 21;
      const Y = curY + "-";
      const M = (nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1) + "-";
      const D = nowDate.getDate() + " ";
      const h = nowDate.getHours() + ":";
      const m = 10 + ":";
      const s = nowDate.getSeconds();
      const nowDate1 = new Date(Y + M + D + h + m + s + ":" + 123);
      const timeDiaabled = nowDate1.getTime();
      return {
        disabledDate(time) {
          return time.getTime() < Date.now() || time.getTime() > timeDiaabled; //如果当天可选，就不用减8.64e7
        }
      };
    }
  },
  created() {
    if (this.$route.query.resource == "report" || this.$route.query.resource == "task") {
      this.selectWayNum = this.$route.query.lubricationPointNumber;
    } else {
      this.selectWayNum = this.$route.query.currentLupNum || "";
    }
    this.getQueryOilList("oilBrandList"); // 查询用油品牌
    this.getDeviceEdit(this.$route.query.deviceNumber);
    this.$_queryEPInfo(this.$route.query.deviceNumber);
    this.$_getLubricatePointData(this.$route.query.deviceNumber); //润滑点列表
    this.getEptList();
  },
  methods: {
    closeSyncLubDialog() {
      this.showSyncLubDialog = false
      this.$refs.LupDialogRef.cancelDialog();
      this.$_getLubricatePointData(this.$route.query.deviceNumber); //润滑点列表
    },
    lubricationPointSelectNameChange(val){
      console.log('selectLubricatePointData.lubricationPointSelectName',this.selectLubricatePointData.lubricationPointSelectName,val)
      if(val){
        this.selectLubricatePointData.lubricationPointSelectNameFlag = (val != '自定义')
      }
    },
    showOrHideState(lubricationPointTypeCode, lubricationMethod) {
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
    // 获取品牌数据
    getOilBrandData() {
      const params = {
        status: 1,
        parentCode: 0
      };
      this.requestMethodGet("/mdm/oil/queryOilList", params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data;
          let brandList = [];
          if (data.length !== 0) {
            data.forEach(item => {
              item.text = item.name;
            });
            brandList = data.filter(it => {
              return it.code !== "oil_0001";
            });
          }
          this.oilBrandListAdd = brandList;
          this.oilBrandListAdd.push({
            name: "自定义",
            code: "0"
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
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
              if(formName.oilBrand=='0') {
                this.getOilBrandData()
                this.getQueryOilList("oilBrandList",'add',res.data.data.oilBrandNumber);
                if (this.addType == "oilName") {
                  this.selectLubricatePointData.oilBrandCode=res.data.data.oilBrandNumber
                }
              } else{
                this.selectLubricatePointData.oilBrandCode=formName.oilBrand
              }
              if (this.addType == "oilName") {
                this.$set(this.selectLubricatePointData, 'currentOilCode', res.data.data.oilNameNumber)
                this.$nextTick(()=>{
                    this.$refs.lupRuleForm.clearValidate(['currentOilCode']);
                })
              } else {
                this.$set(this.selectLubricatePointData, 'recommendOilCode', res.data.data.oilNameNumber)
                this.$nextTick(()=>{
                    this.$refs.lupRuleForm.clearValidate(['recommendOilCode']);
                })
              }
              this.handleOilName(this.addType)
              this.addOilDialog = false;
            }else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          });

    },
    async handleOilName(type) {
      if(type == "oilName"){
        this.currentOilListNew = [];
        if(this.selectLubricatePointData.currentOilCode){
          let resCurrentOil = await this.getOilNameByOilCode(this.selectLubricatePointData.currentOilCode)
          this.currentOilListNew.push({oilAlias: resCurrentOil,code:this.selectLubricatePointData.currentOilCode})
        }
      }else{
        this.recommendOilListNew = [];
        if(this.selectLubricatePointData.recommendOilCode){
          let resRecommendOil = await this.getOilNameByOilCode(this.selectLubricatePointData.recommendOilCode)
          this.recommendOilListNew.push({oilAlias: resRecommendOil,code:this.selectLubricatePointData.recommendOilCode})
        }
      }
    },
    // 关闭添加自定义油品弹框
    closeDialogAdd() {
      Object.assign(this.$data.addOilForm, this.$options.data().addOilForm)
      this.addOilDialog = false;
    },
    getDeviceEdit(deviceNumber) {
      const params = {
        deviceNumberList: [deviceNumber]
      };
      this.requestMethodPost("weChat/workshop/getNoMoveDevice", params).then(res => {
        if (res.data.code == 1000) {
          this.canEditFlag = res.data.data.canEditFlag;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    eptTypeChange(val) {
      ++this.eptTypeKey;
      this.getNameListData(val[val.length-1],false)
    },
    getNameListData(deviceCode,flag){
      const params = {
        deviceCode:deviceCode,
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
          if(!flag){
            if(data.length>1){
              this.$set(this.selectLubricatePointData,'lubricationPointSelectName','')
            }
          }
          if(flag){
            let selectNameList = []
            data.forEach(it=>{
              selectNameList.push(it.lubPointName)
            })
            if(selectNameList.includes(this.selectLubricatePointData.lubricationPointName)){
              this.$set(this.selectLubricatePointData,'lubricationPointSelectName',this.selectLubricatePointData.lubricationPointName)
              this.$nextTick(()=>{
                this.$refs['lupRuleForm'].validateField(['lubricationPointSelectName'])
              })
            }else{
              this.$set(this.selectLubricatePointData,'lubricationPointSelectName','自定义')
              this.$nextTick(()=>{
                this.$refs['lupRuleForm'].validateField(['lubricationPointName'])
              })
            }
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
    // 创建新设备
    createDevice() {
      this.createDeviceFlag = true;
      this.addDeviceForm.name = '';
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
              this.$refs.deviceRuleForm.validateField("eptType");
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
          // console.log('error submit!!');
          return false;
        }
      });
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
        oilChangePeriod = this.selectLubricatePointData.oilAddPeriod;
        oilChangePeriodUnit = this.selectLubricatePointData.oilAddPeriodUnit;
        oilLastTime = this.selectLubricatePointData.lastOilAddDate;
      } else {
        // 换油周期
        oilChangePeriod = this.selectLubricatePointData.oilChangePeriod;
        oilChangePeriodUnit = this.selectLubricatePointData.oilChangePeriodUnit;
        oilLastTime = this.selectLubricatePointData.lastOilChangeDate;
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
              this.selectLubricatePointData.nextScheduledOilAddDate = res.data.data;
            } else if (val == "lastOilAddDate") {
              // 加油周期
              this.selectLubricatePointData.nextScheduledOilAddDate = res.data.data;
            } else {
              // 换油周期
              this.selectLubricatePointData.nextScheduledOilChangeDate = res.data.data;
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
    selectOilBrandAdd(val) {
      this.getOilTypeData(val);

      this.$set(this.addOilForm, "oilType", "");
      this.$set(this.addOilForm, "oilBrandName", "");
      this.$set(this.addOilForm, "oilTypeName", "");
      this.$set(this.addOilForm, "oilName", "");
      if (this.$refs["addOilForm"] != undefined) {
        this.$refs["addOilForm"].resetFields();
      }
    },
    selectOilTypeAdd() {
      this.$set(this.addOilForm, "oilTypeName", "");
      this.$set(this.addOilForm, "oilName", "");
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
          this.selectLubricatePointData.eptType = ["industry_0013", "industry_0051", "device_user_defined", res.data.data];
          this.chooseAgain();
          this.getEptList();
          this.$refs.deviceRuleForm.validateField("eptType");
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
    oilChangePeriodFocus() {
      if (!this.selectLubricatePointData.lubricationPointTypeCode) {
        this.$message({
          type: "error",
          message: "请先选择润滑点设备类型"
        });
      }
    },
    // 通过润滑方式 确认是油类还是脂类
    getDeviceType(val) {
      var obj = {};
      obj = this.lubricationPointTypeData.filter(item => {
        return item.code === val;
      });
      this.oilTypeDevice = obj[0].oilType;
      let showOrHideStateFlag = this.showOrHideState(this.selectLubricatePointData.lubricationPointTypeCode, val);
      if (this.oilTypeDevice == 2) {
        this.selectLubricatePointData.oilBoxCapacityUnit = "KG";
        this.selectLubricatePointData.everyTimeOilAddQuantityUnit = "KG";
        this.selectLubricatePointData.preMonthOilAddQuantityUnit = "KG";
      } else {
        if(showOrHideStateFlag==0) {
          this.selectLubricatePointData.oilChangeMethod = 2;
        }
        this.selectLubricatePointData.oilChangePeriodUnit = "D";
        this.selectLubricatePointData.oilAddPeriodUnit = "D";
        this.selectLubricatePointData.oilBoxCapacityUnit = "L";
        this.selectLubricatePointData.everyTimeOilAddQuantityUnit = "L";
        this.selectLubricatePointData.preMonthOilAddQuantityUnit = "L";
        // 如果选择的润滑点设备类型是  发动机
        if(this.selectLubricatePointData.lubricationPointTypeCode=='lubrication_point_type_0004') {
          this.selectLubricatePointData.oilChangeMethod = 1;
        }
      }
    },
    // 定期或者按质切换
    oilChangeMethodChange(val) {
      if (val == "1") {
        this.selectLubricatePointData.fillingQuantityUnit = "L";
      }
    },
    // 通过润滑点设备类型获取 润滑方式下拉框数据
    $_queryLubricationMethodData(val,type) {
      let params = {
        typeCode: val
      };
      this.requestMethodGet("/web/device/getLubricationMethodByType", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.lubricationPointTypeData = res.data;
            if (this.lubricationPointTypeData.length == 1) {
              this.selectLubricatePointData.lubricationMethod = this.lubricationPointTypeData[0].code;
              this.oilTypeDevice = this.lubricationPointTypeData[0].oilType;
              if (!this.selectLubricatePointData.oilChangeMethod) {
                this.selectLubricatePointData.oilChangeMethod = 2;
                this.selectLubricatePointData.oilAddPeriodUnit = "D";
              }
              if(type=='change') {
                if(this.selectLubricatePointData.lubricationPointTypeCode=='lubrication_point_type_0004') {
                  this.selectLubricatePointData.oilChangeMethod = 1;
                } else {
                  this.selectLubricatePointData.oilChangeMethod = 2;
                }
              }
            } else {
              if (i != "query") {
                this.selectLubricatePointData.lubricationMethod = "";
              }
              if (this.oilTypeDevice == 2) {
                this.selectLubricatePointData = 1;
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
    // 润滑方式下拉事件
    handlelubricationMethodChange(val) {
      this.getDeviceType(val);
    },
    focusOilNameChange(val, type) {
      this.loadingRemote = true
      this.requestMethodGet("/mdm/oil/queryOilListByPage",{oilName:val, status:1, size:200, current:1}).then(async (res) => {
        this.loadingRemote = false
        if (res.data.code == 1000) {
          if(type=='recommendOilCode') {
            this.recommendOilListNew = res.data.data.list;
            this.$nextTick(()=>{
              if(this.selectLubricatePointData.recommendOilCodeStatus ==0) {
                this.selectLubricatePointData.recommendOilCode=''
                this.selectLubricatePointData.recommendOilName = ''
              }
            })
          } else if(type=='currentOilCode') {
            this.currentOilListNew = res.data.data.list;
            this.$nextTick(()=>{
              if(this.selectLubricatePointData.currentOilCodeStatus ==0) {
                this.selectLubricatePointData.currentOilCode=''
                this.selectLubricatePointData.oilBrandCode = ''
              }
            })
          }
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    findPathByLeafId(leafId, nodes, path) {
      if(path === undefined) {
        path = [];
      }
      for(var i = 0; i < nodes.length; i++) {
          var tmpPath = path.concat();
          tmpPath.push({oilName:nodes[i].oilName,oilNumber:nodes[i].oilNumber,status:nodes[i].status});
          if(leafId == nodes[i].oilNumber) {
            return tmpPath;
          }
          if(nodes[i].children ) {
            var findResult = this.findPathByLeafId(leafId, nodes[i].children, tmpPath);
            if(findResult) {
              return findResult;
            }
          }
      }
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
    // 添加润滑点
    addLup() {
      let typeCode = ''
      if(this.ruleForm.eptType.length>1){
        typeCode = this.ruleForm.eptType[this.ruleForm.eptType.length-1]
      }else{
        typeCode = this.ruleForm.eptType
      }
      this.getNameListData(typeCode,false)
      this.dialogFlag = true;
      this.addLupForm = {
        lubricationPointTypeCode: "", //润滑点设备类型
        lubricationPointManufacturer: "",
        imgLubricationFile: "",
        oilAddPeriodUnit: "D",
        oilAddPeriod: "", //润滑点设备类型
        everyTimeOilAddQuantity: "",
        everyTimeOilAddQuantityUnit: "L",
        preMonthOilAddQuantity: "",
        preMonthOilAddQuantityUnit: "L",
        autoCreateOilAddPlan: false, //润滑点设备类型
        lastOilAddDate: "",
        oilChangeMethod: 2,
        oilTypeDevice: "1",
        autoCreateOilChangePlan: false,
        currentOilCode: "",
        oilBrandCode: "", //在用油品牌
        oilChangePeriod: "", //换油/加脂周期
        oilChangePeriodUnit: "D", //换油单位
        oilBoxCapacity: "", //油箱容量
        oilBoxCapacityUnit: "L", //邮箱单位
        lubricationPointName: "", //润滑点设备名称
        lubricationPointSelectName:'',
        lubricationMethod: "", //润滑/加脂方式
        recommendOilCode: [], //设备制造商推荐油品名称
        recommendOil: "",
        lubricationPointDesc: "", //描述
        nextScheduledOilChangeDate: "", //预计下次换油/加脂日期
        nextScheduledOilAddDate: "",
        lastOilChangeDate: "", //上次换油/加脂日期
        fillingQuantity: "", //加注量
        fillingQuantityUnit: "L",
        oilName: "", //在用油品名称
      };
      this.addLupImgList = [];
      this.recommendOilList = [];
      ++this.recommendOilCodeKey;
      ++this.recommendKey;
      this.$gio.createLubrPoint({
        customer: this.ruleForm.companyName,
        entrance: "设备编辑页"
      });
    },
    // 关闭添加润滑点
    closeDialog() {
      this.dialogFlag = false;
    },
    // 添加润滑点成功
    addOrEditLup(form,showOrHideState) {
      this.$confirm("确定提交添加润滑点?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 校验换油周期值是否合法
          const reg = /^[1-9]\d*$/;
          const oilChangePeriodNum = Number(form.oilChangePeriod);
          const oilAddPeriodNum = Number(form.oilAddPeriod);
          const regTestResult1 = reg.test(oilChangePeriodNum);
          const regTestResult2 = reg.test(oilAddPeriodNum);
          const isRollingBearing = form.oilTypeDevice == "2"; // 油类  加油周期     false  脂类 加脂周期
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

            } else {
              if(it.oilChangePeriodUnit != "KM") {
                 //换油   加油
                 it.rangMax = it.oilChangePeriodUnit == "Y" ? 20 : it.oilChangePeriodUnit == "M" ? 240 : it.oilChangePeriodUnit == "D" ? 7300 : 175200;
              }

            }
          });
          if (isRollingBearing) {
            // 加脂周期   脂类
            list.forEach(item => {
              if (form.oilAddPeriodUnit == item.oilChangePeriodUnit) {
                MaxNum1 = item.rangMax;
              }
            });
          } else {
            list.forEach(item => {
              // 油类  加油/加脂周期
              if (form.oilChangePeriodUnit == item.oilChangePeriodUnit) {
                MaxNum = item.rangMax;
              }
            });
            list.forEach(item => {
              if (form.oilAddPeriodUnit == item.oilChangePeriodUnit) {
                MaxNum1 = item.rangMax;
              }
            });
          }
          if (oilAddPeriodNum) {
            if (regTestResult2 && oilAddPeriodNum >= 1 && oilAddPeriodNum <= MaxNum1) {
              // console.log(2222)
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
              // console.log(111111)
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
          var params = new FormData();
          params.append("deviceNumber ", this.$route.query.deviceNumber); //设备编号
          params.append("lubricationPointTypeCode ", form.lubricationPointTypeCode); //润滑点设备类型
          params.append("lubricationPointImgFile", form.imgLubricationFile); //润滑点图片
          if(form.lubricationPointPicPath) {
            params.append("lubricationPointPicPath", form.lubricationPointPicPath); //润滑点图片
          }
          params.append("lubricationPointType ", form.lubricationPointType); //润滑点设备类型名称
          params.append("oilBoxCapacity", form.oilBoxCapacity); //油箱容量
          params.append("lubricationPointManufacturer", form.lubricationPointManufacturer);
          params.append("lubricationMethod", form.lubricationMethod); //润滑/加脂方式
          params.append("oilBoxCapacityUnit", form.oilBoxCapacityUnit); //油箱容量单位
          params.append("oilBrandCode", form.oilBrandCode); //在用油品牌
          params.append("currentOilCode", form.currentOilCode);
          if(this.lupDeviceNameList.length>1 && form.lubricationPointSelectName != '自定义'){
            params.append("lubricationPointName", form.lubricationPointSelectName); //润滑点设备名称
          }else{
            params.append("lubricationPointName", form.lubricationPointName); //润滑点设备名称
          }
          params.append("lubricationPointDesc", form.lubricationPointDesc); //描述
          if (form.recommendOilCode) {
            params.append("recommendOilCode", form.recommendOilCode); //设备制造商推荐油品code
            params.append("recommendOil", form.recommendOil); //设备制造商推荐油品名称
          } 

          params.append("oilType", form.oilTypeDevice);
          if (form.oilTypeDevice == 1) {
            // 普通油类 特殊展示
            if(showOrHideState==0) {  
              params.append("oilChangeMethod", form.oilChangeMethod);  // 定期或者按质
              params.append("oilChangePeriod", form.oilChangePeriod);  // 换油周期
              params.append("oilChangePeriodUnit", form.oilChangePeriodUnit);  // 换油周期单位
              if (form.lastOilChangeDate) {  // 上次换油⽇期
                params.append("lastOilChangeDate ", form.lastOilChangeDate);
                params.append("fillingQuantity", form.fillingQuantity); //  上次换油时加注量
                params.append("fillingQuantityUnit", form.fillingQuantityUnit); // 上次换油时加注量单位
              }
              if(form.oilChangeMethod == 1 && form.lastOilChangeDate && form.oilChangePeriod && form.oilChangePeriodUnit!='KM') {
                params.append("autoCreateOilChangePlan", form.autoCreateOilChangePlan); // 是否自动生成下次换油计划？
                // 预计下次换油日期
                if (form.nextScheduledOilChangeDate && form.autoCreateOilChangePlan) {
                  params.append("nextScheduledOilChangeDate ", form.nextScheduledOilChangeDate);
                }
              }
            }
            params.append("oilAddPeriod", form.oilAddPeriod);  //加油周期
            params.append("oilAddPeriodUnit", form.oilAddPeriodUnit); //加油周期单位
            params.append("lastOilAddDate", form.lastOilAddDate); // 上次加油⽇期
            params.append("everyTimeOilAddQuantity", form.everyTimeOilAddQuantity);  // 每次加油量
            params.append("everyTimeOilAddQuantityUnit", form.everyTimeOilAddQuantityUnit);  // 每次加油量 单位
            params.append("preMonthOilAddQuantity", form.preMonthOilAddQuantity); //每月润滑剂添加量
            params.append("preMonthOilAddQuantityUnit", form.preMonthOilAddQuantityUnit); //每月润滑剂添加量单位
            //是否自动生成下次加油计划  
             if(form.oilAddPeriod && form.lastOilAddDate && form.oilAddPeriodUnit!='KM') {
              params.append("autoCreateOilAddPlan", form.autoCreateOilAddPlan);
              if(form.autoCreateOilAddPlan) {
                params.append("nextScheduledOilAddDate", form.nextScheduledOilAddDate);  //预计下次加油日期
              }
            }
          }
          // 脂类润滑点
          if(form.oilTypeDevice == 2) {  
            params.append("oilAddPeriodUnit", form.oilAddPeriodUnit);  //加脂周期单位
            params.append("oilAddPeriod", form.oilAddPeriod);  //加脂周期
            
            params.append("everyTimeOilAddQuantity", form.everyTimeOilAddQuantity);  //每次加脂量 / 每次加油量
            
            params.append("everyTimeOilAddQuantityUnit", form.everyTimeOilAddQuantityUnit);  //每次加脂量 / 每次加油量 单位
            
            
            params.append("lastOilAddDate", form.lastOilAddDate); // 上次加脂⽇期
            params.append("preMonthOilAddQuantity", form.preMonthOilAddQuantity);  //每月润滑剂添加量
            
            params.append("preMonthOilAddQuantityUnit", form.preMonthOilAddQuantityUnit);  //每月润滑剂添加量单位
            
            if(form.lastOilAddDate && form.oilAddPeriod && form.oilAddPeriodUnit!='KM') {
              params.append("autoCreateOilAddPlan", form.autoCreateOilAddPlan);  //是否自动生成下次加脂计划 /是否自动生成下次加油计划
              //  预计下次加油日期/预计下次加脂日期
              if (form.nextScheduledOilAddDate != "" && form.autoCreateOilAddPlan) {
                params.append("nextScheduledOilAddDate", form.nextScheduledOilAddDate);
              }
            }
            
          }

          this.requestMethodPost("/web/device/addMoreLubricationPoint", params)
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
                  this.$refs.LupDialogRef.cancelDialog();
                  this.$_getLubricatePointData(this.$route.query.deviceNumber); //润滑点列表
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
    },
    // 手动添加油品
    createOil(val) {
      // 记录添加油品的下拉框  是设备制造商推荐油品还是在用油品名称
      this.addType = val;
      if (val == "oilName") {
        this.getOilTypeData(this.selectLubricatePointData.oilBrandCode);
      }
      this.addOilDialog = true;
      if (val == "currentName") {
        this.$set(this.addOilForm, "oilBrand", "");
        this.$set(this.addOilForm, "oilBrandName", "");
      }
      this.$set(this.addOilForm, "oilBrand", "");
        this.$set(this.addOilForm, "oilBrandName", "");
      this.$set(this.addOilForm, "oilType", "");
      this.$set(this.addOilForm, "oilTypeName", "");
      this.$set(this.addOilForm, "oilName", "");
    },
    // 设备类型
    // getEptList() {
    //   this.requestMethodGet("/weChat/device/queryAllDeviceTypeTree4", {}).then(res => {
    //     if (res.data.code == 1000) {
    //       this.eptList = res.data.data;
    //     } else {
    //       this.$message({
    //         message: res.data.msg,
    //         type: "error"
    //       });
    //     }
    //   });
    // },
    focusEptTypeChange() {
      // 如果原先选的设备类型是禁用的数据，把设备类型给清空
      if(this.ruleForm.deviceTypeState=='0') {
        this.$set(this.ruleForm, "eptType", []);
        
      }
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
    // 设备类型
    getEptList() {
      this.requestMethodGet("/weChat/device/queryDeviceTypeTree4ByStatus", {state:''}).then(res => {
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
        if (data[i].children.length < 1) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].children);
        }
      }
      return data;
    },
    // 删除润滑点
    checkLubricationPoint(val) {
        let params = {
          lubricationPointNumber: val
        };
        this.requestMethodGet("/web/lubricationPoint/checkLubricationPointRelation", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              let msg = "是否删除润滑点？";
              if (res.data.hasOilPlan) {
                msg = "确认删除润滑点和换油记录吗？";
              }
              if (res.data.iotDeviceRelation || res.data.hasPlantStudyWorkOrder || res.data.workOrderRelation || res.data.mslaWorkOrderRelation) {
                let str = "";
                if (res.data.iotDeviceRelation) {
                  str = `失败原因：已关联设备【${res.data.deviceName}】，请先解除关联！`;
                }
                if (res.data.workOrderRelation || res.data.mslaWorkOrderRelation || res.data.hasPlantStudyWorkOrder) {
                  if (res.data.thirdServiceCount == 1) {
                    str = `失败原因：润滑点正在进行【${res.data.thirdServiceName}】，不可删除`;
                  } else {
                    str = `失败原因：润滑点正在进行【${res.data.thirdServiceName}】等任务，不可删除`;
                  }
                }
                this.$gio.deleteLubrPoint({
                  operation: "点击删除按钮",
                  customer: this.ruleForm.companyName
                });
                this.$confirm(str, "删除失败", {
                  closeOnClickModal: false,
                  confirmButtonText: "我知道了",
                  showCancelButton: false,
                  customClass: "deletBtn",
                  type: "warning"
                })
                  .then(() => {})
                  .catch(() => {});
              } else {
                this.$confirm(msg, "", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  closeOnClickModal: false,
                  customClass: "deletBtn",
                  type: "warning"
                })
                  .then(() => {
                    const params = {
                      lubricationPointNumber: val
                    };
                    this.requestMethodGet("/web/lubricationPoint/deleteLubricationPoint", params).then(res => {
                      if (res.data.code == 1000) {
                        this.menus.forEach((item, idx) => {
                          if (item.lubricationPointNumber == val) {
                            this.menus.splice(idx, 1);
                            this.selectLubricatePointData.delFlag = true;
                            this.deleteLubricateList.push(item);
                          }
                        });
                        this.currentIndex = 0;
                        this.selectWayNum = "";
                        this.$_getLubricatePointDetail(); // 查询润滑点详情
                        this.current = 1;
                      } else {
                        this.$message({
                          message: res.msg,
                          type: "warning"
                        });
                      }
                    });
                  })
                  .catch(() => {});
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
    oilNameChange(val) {
      if (val) {
        let obj = this.currentOilListNew.filter(item=>{
          return item.code == val
        })
        this.selectLubricatePointData.oilBrandCode = obj[0].parentCode;
        this.selectLubricatePointData.currentOilCode = val;
      }
    },
    // 油箱容量单位 change 事件
    changeOilBoxCapacityUnit(val) {
      this.oilBoxCapacityUnitAdd = val;
      this.addForm.oilType = "";
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
    // 推荐油品名称 change 事件
    selectRecommendOilName(val) {
      if (val) {
        this.selectLubricatePointData.recommendOilCode = val;
      }
    },
    //查询润滑点
    $_queryLPData() {
      const params = {
        state: '',
        name: "",
        nameEn: '',
        mslaCode: '',
        mslaName: '',
        current: 1,
        size: 500
      };
      this.requestMethodGet("/web/config/lubricationPoint/getLubricationPointTypeParentChildrenList", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.lubricationPointTypeList = list;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 润滑点设备类型 change 事件
    handleLubricationPointTypeChange(val) {
      if (val) {
        var obj = {};
        obj = this.lubricationPointTypeList.filter(item => {
          return item.code === val;
        });
        this.selectLubricatePointData.lubricationPointTypeCode = obj[0].code;
        this.selectLubricatePointData.lubricationPointType = obj[0].name;
        this.selectLubricatePointData.lubricationMethod = "";
        this.$_queryLubricationMethodData(this.selectLubricatePointData.lubricationPointTypeCode,'change');
        // 如果选择的润滑点设备类型是  发动机
        if(val=='lubrication_point_type_0004') {
          this.selectLubricatePointData.oilChangeMethod = 1;
        }
      } else {
        this.selectLubricatePointData.lubricationPointTypeCode = "";
        this.selectLubricatePointData.lubricationPointType = "";
      }
    },
    // 润滑点设备类型获取焦点
    focusLubricationPointTypeChange() {
      if(this.selectLubricatePointData.lubricationPointTypeState==0) {
        this.$set(this.selectLubricatePointData,'lubricationPointTypeCode','')
      }
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
    selectWay(index, id) {
      // if(this.currentIndex == index) {
      //   return
      // }
      this.currentIndex = index;

      this.selectWayNum = this.menus[index].lubricationPointNumber;
      // this.lupDeviceNameList = []
      // this.imageLubricationList = [];
      this.menus.forEach(item => {
        if (item.id == id) {
          item.isActive = true;
        } else {
          item.isActive = false;
        }
      });
      this.$_getLubricatePointDetail(); // 查询润滑点详情
      this.current = 1; // 切换润滑点时，设置current 为1
      this.$gio.toEditLubrPoint({
        entrance: "设备详情页"
      });
    },
    //   查询设备档案详情
    $_queryEPInfo(deviceNumber) {
      let params = {
        deviceNumber
      };
      this.requestMethodGet("/web/device/queryDevice", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.getWorkShopList(res.data.companyId || "");
            // res.data.deviceTypeSmall =  res.data.deviceTypeDto?res.data.deviceTypeDto[1].code:''
            this.customerNumber = this.ruleForm.customerNumber;
            this.ruleForm = res.data;
            this.ruleForm.createTime = this.moment(new Date(this.ruleForm.createTime)).format("YYYY-MM-DD");
            const list = [];
            if (this.ruleForm.deviceTypeDto) {
              this.ruleForm.deviceTypeDto.forEach(item => {
                list.push(item.code);
              });
            }
            this.ruleForm.eptType = list;
            this.getNameListData(this.ruleForm.deviceType,true)
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    // 获取车间
    getWorkShopList(id) {
      if (!id) {
        return;
      }
      const params = {
        companyId: id,
        workshopName: "",
        current: 1,
        size: 500
      };
      this.requestMethodGet("/weChat/workshop/queryWorkshopListByPage", params).then(res => {
        if (res.data.code == 1000) {
          const list = res.data.data.list || [];
          this.workshopList = this.workshopList.concat(list);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    // 查询润滑点列表
    $_getLubricatePointData(deviceNumber) {
      let params = {
        deviceNumber
      };
      this.requestMethodGet("/web/lubricationPoint/queryLubricationPointList", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            if (res.data && res.data.length > 0) {
              const data = res.data;
              data.forEach( (item, idx) => {
                item.isActive = false;
                item.lubricationPointSelectNameFlag = false
                if (this.selectWayNum) {
                  if (this.selectWayNum == item.lubricationPointNumber) {
                    item.isActive = true;
                    this.currentIndex = idx;
                  } 
                } else {
                  if (idx == 0) {
                    item.isActive = true;
                    this.selectWayNum = item.lubricationPointNumber;
                  }
                }
                if(item.oilType=='1') {
                  item.oilBoxCapacityUnit = item.oilBoxCapacityUnit ?  item.oilBoxCapacityUnit : "L";
                  item.everyTimeOilAddQuantityUnit = item.everyTimeOilAddQuantityUnit ? item.everyTimeOilAddQuantityUnit :"L";
                  item.preMonthOilAddQuantityUnit = item.preMonthOilAddQuantityUnit ? item.preMonthOilAddQuantityUnit : "L";
                  item.oilAddPeriodUnit = item.oilAddPeriodUnit ? item.oilAddPeriodUnit : "D";
                } else {
                  item.oilBoxCapacityUnit = item.oilBoxCapacityUnit ?  item.oilBoxCapacityUnit : "KG";
                  item.everyTimeOilAddQuantityUnit = item.everyTimeOilAddQuantityUnit ? item.everyTimeOilAddQuantityUnit :"KG";
                  item.preMonthOilAddQuantityUnit = item.preMonthOilAddQuantityUnit ? item.preMonthOilAddQuantityUnit : "KG";
                }
                
                setTimeout(() => {
                  this.$set(this.menus,idx,item)
                  if(idx == data.length-1) {
                    this.$_getLubricatePointDetail(); // 查询润滑点详情
                  }
                  
                }, 200)
                
                
              });
              
              
            }
            this.totalNumber = res.data.totalCount;
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
     getFullpath(halfPath) {
      let params = {
        url: halfPath
      };
      this.requestMethodGet("/web/file/getFullUrl", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.$set(this.selectLubricatePointData, 'lubricationPointPicRelativePath', res.data)
            this.imageLubricationList.push({ url: res.data });
          } else {
            this.$message({
              type: "warning",
              message: "获取全路径失败，请稍后重试。"
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
      this.imageLubricationList.push({ url: file.url });
      if (fileList.length) {
        let params = new FormData();
        params.append("fileType", "lubrication_point");
        params.append("multipartFiles", file.raw);
        this.requestMethodPost("/web/file/uploadFiles", params)
          .then(res => {
            res = res.data;
            if (res.code == 1000) {
              this.selectLubricatePointData.delLubPicFlag = "";
              this.selectLubricatePointData.lubricationPointPicPath = res.data[0];
              this.selectLubricatePointData.imgLubricationFile = res.data[0];
            } else {
              this.imageLubricationList = [];
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(res => {});
      }
      // this.selectLubricatePointData.imgLubricationFile = file.raw;
    },
    // 删除 润滑点图片
    handleLubricatePointRemove(file, fileList) {
      this.imageLubricationList = [];
      this.selectLubricatePointData.imgLubricationFile = "";
      this.selectLubricatePointData.lubricationPointPicPath = "";
      this.selectLubricatePointData.delLubPicFlag = 1;
      this.hideUpload = fileList.length >= 1;
    },
    getQueryOilList(listName, val, value) {
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
                this.selectLubricatePointData.oilBrandCode = value;
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
    },
     // 查看润滑点详情
     $_getLubricatePointDetail() {
      if (this.menus.length == 0) {
        this.selectLubricatePointData = {};
        this.imageLubricationList = [];
        this.$refs["lupRuleForm"].resetFields();
        return;
      }
      if (!this.selectWayNum) {
        this.selectWayNum = this.menus[0].lubricationPointNumber;
      }
      this.menus.forEach((item, idx) => {
        item.isActive = false;
        if (this.selectWayNum) {
          if (this.selectWayNum == item.lubricationPointNumber) {
            item.isActive = true;
            this.currentIndex = idx;
          }
        } else {
          if (idx == 0) {
            item.isActive = true;
          }
        }
      });
      this.$nextTick(()=>{
        this.selectLubricatePointData = this.menus.filter(item => {
          return item.lubricationPointNumber == this.selectWayNum;
        })[0];
        this.imageLubricationList = [];
        if(this.selectLubricatePointData.lubricationPointPicRelativePath){
          this.getFullpath(this.selectLubricatePointData.lubricationPointPicRelativePath)
            this.$set(this.selectLubricatePointData, 'lubricationPointPicPath', this.selectLubricatePointData.lubricationPointPicRelativePath)
            
        }  else {
          this.selectLubricatePointData.imgLubricationFile = "";
        }
        this.oilBoxCapacityUnitAdd = this.selectLubricatePointData.oilBoxCapacityUnit;
        this.oilBrandCodeAdd = this.selectLubricatePointData.oilBrandCode || "oil_0001";
        this.oilTypeDevice = this.selectLubricatePointData.oilType;
        if (this.selectLubricatePointData.lubricationPointTypeCode) {
          this.$_queryLubricationMethodData(this.selectLubricatePointData.lubricationPointTypeCode);
        }
        const { lubricationPointTypeCode, lubricationMethod } = this.selectLubricatePointData;
        this.showOrHideStateFlag = this.showOrHideState(lubricationPointTypeCode, lubricationMethod);
        this.getNameListData(this.ruleForm.deviceType,true)
        // 获取油品
        this.getOilData()
      })
    },
    async getOilData() {
      this.recommendOilListNew = [];
      if(this.selectLubricatePointData.recommendOilCode){
        let resRecommendOil = await this.getOilNameByOilCode(this.selectLubricatePointData.recommendOilCode)
        this.recommendOilListNew.push({oilAlias: resRecommendOil,code:this.selectLubricatePointData.recommendOilCode})
      }
      this.currentOilListNew = [];
      if(this.selectLubricatePointData.currentOilCode){
        let resCurrentOil = await this.getOilNameByOilCode(this.selectLubricatePointData.currentOilCode)
        this.currentOilListNew.push({oilAlias: resCurrentOil,code:this.selectLubricatePointData.currentOilCode})
      }
    },
    // 查看润滑点详情
    $_getLubricationPointDetail() {
      let params = {
        lubricationPointNumber: this.selectWayNum
      };
      this.requestMethodGet("/web/device/queryLubricationPointDetail", params)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.selectLubricatePointData = res.data;
            this.oilBoxCapacityUnitAdd = this.selectLubricatePointData.oilBoxCapacityUnit;
            this.oilBrandCodeAdd = this.selectLubricatePointData.oilBrandCode || "oil_0001";
            this.oilTypeDevice = this.selectLubricatePointData.oilType;
            this.imageLubricationList = [];
            if (this.selectLubricatePointData.lubricationPointPicPath) {
              this.imageLubricationList.push({ url: this.selectLubricatePointData.lubricationPointPicRelativePath });
            } else {
              this.selectLubricatePointData.imgLubricationFile = "";
            }
            if (this.selectLubricatePointData.currentOilBrandDto.length > 0) {
              this.selectLubricatePointData.oilBrandCode = this.selectLubricatePointData.currentOilBrandDto[0].code; // 在用油品牌
            }
            if (this.selectLubricatePointData.lubricationPointTypeCode) {
              this.$_queryLubricationMethodData(this.selectLubricatePointData.lubricationPointTypeCode);
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
    filterArray(data, parent) {
      let vm = this;
      var tree = [];
      var temp;
      for (var i = 0; i < data.length; i++) {
        if (data[i].parentCode == parent) {
          var obj = data[i];
          temp = this.filterArray(data, data[i].code);
          if (temp.length > 0) {
            obj.children = temp;
          }
          tree.push(obj);
        }
      }
      return tree;
    },
    //提交
    handleSubmitForm() {
      let lubricationPointUpdateRequestList = this.menus.map(item => {
        item.showFlag= this.showOrHideState(item.lubricationPointTypeCode, item.lubricationMethod);
        let obj = {
          deviceNumber: this.$route.query.deviceNumber,
          lubricationMethod: item.lubricationMethod,
          lubricationPointDesc: item.lubricationPointDesc,
          lubricationPointName: (item.lubricationPointSelectNameFlag)?item.lubricationPointSelectName:item.lubricationPointName,
          lubricationPointNumber: item.lubricationPointNumber,
          lubricationPointType: item.lubricationPointType,
          lubricationPointTypeCode: item.lubricationPointTypeCode,
          oilBoxCapacity: item.oilBoxCapacity,  //油箱容量
          oilBoxCapacityUnit: item.oilBoxCapacityUnit,  //油箱容量单位
          oilBrandCode: item.oilBrandCode,  // 在用油品品牌 code
          recommendOil: item.recommendOil,
          recommendOilCode: item.recommendOilCode,
          lubricationPointPicPath: item.imgLubricationFile,
          picDeleteFlag: item.delLubPicFlag || "",
          delFlag: item.delFlag || false,
          currentOilCode: item.currentOilCode,
          lubricationPointManufacturer: item.lubricationPointManufacturer
        };
        if(item.lubricationPointPicPath) {
          obj.lubricationPointPicPath= item.lubricationPointPicPath;
          if(obj.picDeleteFlag==1) {
            obj.picDeleteFlag=0
          }
        }

          obj.oilChangeMethod = item.oilChangeMethod;   // 定期或者按质
          obj.oilChangePeriod = item.oilChangePeriod;   // 换油周期
          obj.oilChangePeriodUnit = item.oilChangePeriodUnit; // 换油周期单位
          obj.lastOilChangeDate = item.lastOilChangeDate;
          obj.fillingQuantity = item.fillingQuantity;
          obj.fillingQuantityUnit = item.fillingQuantityUnit;
          obj.autoCreateOilChangePlan = item.autoCreateOilChangePlan; // 是否自动生成下次换油计划？
          // 预计下次换油日期
          obj.nextScheduledOilChangeDate = item.nextScheduledOilChangeDate;
          obj.oilAddPeriod= item.oilAddPeriod;   //加油周期
          obj.oilAddPeriodUnit= item.oilAddPeriodUnit;   //加油周期单位
          obj.lastOilAddDate = item.lastOilAddDate;  // 上次加油⽇期
          obj.everyTimeOilAddQuantity= item.everyTimeOilAddQuantity; // 每次加油量
          obj.everyTimeOilAddQuantityUnit= item.everyTimeOilAddQuantityUnit; // 每次加油量 单位
          obj.preMonthOilAddQuantity= item.preMonthOilAddQuantity; //每月润滑剂添加量
          obj.preMonthOilAddQuantityUnit= item.preMonthOilAddQuantityUnit; //每月润滑剂添加量单位
          //是否自动生成下次加油计划
          obj.autoCreateOilAddPlan= item.autoCreateOilAddPlan; 
          obj.nextScheduledOilAddDate= item.nextScheduledOilAddDate;   //预计下次加油日期
          obj.oilAddPeriodUnit= item.oilAddPeriodUnit;   //加脂周期单位
          obj.oilAddPeriod= item.oilAddPeriod;   //加脂周期
          obj.everyTimeOilAddQuantity = item.everyTimeOilAddQuantity;  // 上次加油⽇期
          obj.everyTimeOilAddQuantityUnit= item.everyTimeOilAddQuantityUnit; //每次加脂量
          obj.preMonthOilAddQuantity= item.preMonthOilAddQuantity; //每月润滑剂添加量
          obj.preMonthOilAddQuantityUnit= item.preMonthOilAddQuantityUnit; // 每月润滑剂添加量 单位

          obj.lastOilAddDate= item.lastOilAddDate; // 上次加脂⽇期
          //是否自动生成下次加脂计划
          obj.autoCreateOilAddPlan= item.autoCreateOilAddPlan; 
          obj.nextScheduledOilAddDate= item.nextScheduledOilAddDate;   //预计下次加脂日期




        if (!item.lubricationPointNumber) {
          obj = {
            ...obj,
            ...{
              nextScheduledOilChangeDate: item.nextScheduledOilChangeDate,
              lastOilChangeDate: item.lastOilChangeDate,
              currentOilCode: item.currentOilCode[item.currentOilCode.length - 1],
              fillingQuantity: item.fillingQuantity,
            }
          };
        }
        return obj;
      });
      // if (this.menus.length == 0) {
      //   this.$message({
      //     message: "请至少添加一个润滑点",
      //     type: "error"
      //   });
      //   return;
      // }
      this.$refs["deviceRuleForm"].validate(valid => {
        if (valid) {
          if(this.menus.length > 0) {
            this.$refs["lupRuleForm"].validate(valid => {
              if (valid) {
                // 校验换油周期值是否合法
                const reg = /^[1-9]\d*$/;
                const oilChangePeriodNum = Number(this.selectLubricatePointData.oilChangePeriod);
                const oilAddPeriodNum = Number(this.selectLubricatePointData.oilAddPeriod);
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
                    if (this.selectLubricatePointData.oilAddPeriodUnit == item.oilChangePeriodUnit) {
                      MaxNum1 = item.rangMax;
                    }
                  });
                } else {
                  list.forEach(item => {
                    // 油类  加油/加脂周期
                    if (this.selectLubricatePointData.oilChangePeriodUnit == item.oilChangePeriodUnit) {
                      MaxNum = item.rangMax;
                    }
                  });
                  list.forEach(item => {
                    if (this.selectLubricatePointData.oilAddPeriodUnit == item.oilChangePeriodUnit) {
                      MaxNum1 = item.rangMax;
                    }
                  });
                }
                if (oilAddPeriodNum) {
                  if (regTestResult2 && oilAddPeriodNum >= 1 && oilAddPeriodNum <= MaxNum1) {
                    // console.log(2222)
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
                    // console.log(111111)
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
                this.$gio.saveDeviceEditInfo({
                  operation: "点击保存按钮"
                });
                this.$gio.saveLubrPointEditInfo({
                  operation: "点击保存按钮"
                });
                this.submitDeviceForm(lubricationPointUpdateRequestList)
                
              } else {
                return false;
              }
          });
          }else {
            lubricationPointUpdateRequestList=[]
            this.submitDeviceForm(lubricationPointUpdateRequestList)
          }
        } else {
        this.$confirm(`失败原因：设备详情未完善！`, "保存失败", {
          closeOnClickModal: false,
          confirmButtonText: "去完善",
          showCancelButton: false,
          customClass: "deletBtn",
          type: "warning"
        })
          .then(() => {viewApplyInfoDetails
          })
          .catch(() => {});
        }
          
      });
    },
    submitDeviceForm(lubricationPointUpdateRequestList) {
      this.$confirm("确定提交修改设备?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  customClass: "deletBtn",
                  type: "warning"
                })
                  .then(() => {
                    this.$gio.saveDeviceEditInfo({
                      customer: this.ruleForm.companyName,
                      operation: "弹框中点击确定"
                    });
                    this.$gio.saveLubrPointEditInfo({
                      customer: this.ruleForm.companyName,
                      operation: "弹框中点击确定"
                    });
                    let params = {
                      deviceNumber: this.ruleForm.deviceNumber,
                      deviceName: this.ruleForm.deviceName,
                      customerNumber: this.ruleForm.customerNumber,
                      manufacturer: this.ruleForm.manufacturer || "",
                      deviceModel: this.ruleForm.deviceModel || "",
                      picDeleteFlag: this.ruleForm.delDevicePicFlag || "",
                      lubricationPointUpdateRequestList: lubricationPointUpdateRequestList,
                      deviceType: this.ruleForm.eptType[this.ruleForm.eptType.length - 1],
                      workshopId: this.ruleForm.workshopId,
                      deviceCode: this.ruleForm.deviceCode,
                      devicePosition: this.ruleForm.devicePosition,
                      customerVisibility: this.ruleForm.customerVisibility
                    };
                    this.requestMethodPost("/web/device/updateDeviceAndLPBatch", params)
                      .then(res => {
                        res = res.data;
                        if (res.code == 1000) {
                          this.$message({
                            message: "修改成功",
                            type: "success"
                          });
                          if (this.$route.query.isSaveQuery) {
                            this.$router.push({
                              name: "EquipmentProfile",
                              params: { isSaveQuery: true }
                            });
                          } else {
                            this.$router.push({
                              path: "/EquipmentProfile/EquipmentProfileDetail",
                              query: {
                                deviceNumber: this.ruleForm.deviceNumber
                              }
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
    },
    // 返回
    handleResetFrom() {
      this.$gio.cancelEditDeviceOrLubrPoint();
      this.$confirm("当前修改未保存，是否继续退出？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "deletBtn",
        type: "warning"
      })
        .then(() => {
          if (this.$route.query.isSaveQuery) {
            this.$router.push({
              name: "EquipmentProfile",
              params: { isSaveQuery: true }
            });
          } else {
            this.$router.push({
              path: "/EquipmentProfile/EquipmentProfileDetail",
              query: {
                deviceNumber: this.ruleForm.deviceNumber
              }
            });
          }
        })
        .catch(() => {});
    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight - 160}px`;
    }
  }
};
</script>
<style lang="less" scoped>
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
  margin-left: 40px;
}
.lup-info {
  border-radius: 6px;
  width: 100%;
  display: flex;
}
.content-title {
  font-size: 14px;
  color: #000;
  font-weight: bold;
}
.lup-left {
  padding: 16px 0;
  width: 270px;
  border-right: 1px solid #e9e9e9;
}
.left-padding {
  padding: 0 20px;
}
.lup-li {
  height: 48px;
  line-height: 48px;
  text-align: left;
  font-size: 14px;
  color: #333;
  padding: 0 20px;
  cursor: pointer;
}
.lup-name {
  width: 100%;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: nowrap;
  padding-right: 4px;
}
.lup-right {
  flex: 1;
}
.edit-equipment-profile {
  padding: 0 20px;
  height: 100%;
  overflow: auto;
  .el-pagination {
    position: static !important;
  }
  &-title {
    font-size: 14px;
    color: #999;
    span {
      color: #999;
      font-weight: normal;
      font-size: 12px;
    }
  }
  .icon-service {
    width: 18px;
    height: 18px;
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
  .el-menu-item {
    border: 1px solid #dcdfe6;
    margin-bottom: 10px;
    border-radius: 10px;
    max-height: 80px;
    margin-bottom: 20px;
    color: #999;
  }
  .el-menu-item.is-active {
    border: 1px solid #179bff;
    color: #179bff;
  }
  .download {
    display: inline-block;
    width: 60px;
    height: 24px;
    line-height: 24px;
    box-sizing: border-box;
    border: 1px solid #0c479d;
    color: #0c479d;
    font-size: 14px;
    text-align: center;
    border-radius: 24px;
    cursor: pointer;
  }
  /deep/ .el-upload--picture-card {
    width: 114px;
    height: 114px;
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
  /deep/ .edit-equipment-profile .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    margin-top: -6px;
    width: 114px;
    height: 114px;
  }
}
</style>
<style>
.edit-equipment-profile .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.edit-equipment-profile .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 128px;
  height: 128px;
  line-height: 128px;
  text-align: center;
}
.edit-equipment-profile .avatar {
  width: 128px;
  height: 128px;
  display: block;
}
.footer {
  padding-top: 20px;
}
.foot-botton {
  position: fixed;
  bottom: 20px;
  left: 13.5%;
}
.edit-equipment-profile .el-timeline {
  padding: 0;
}
.edit-equipment-profile .el-card__body {
  padding: 10px 20px;
}
.edit-equipment-profile .el-dialog__body {
  /* height: 620px; */
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}
.edit-equipment-profile .el-upload-list__item {
  transition: none !important;
}
.hide .el-upload--picture-card {
  display: none;
}
.el-tooltip.item {
  outline-color: transparent !important;
  outline-width: 0 !important;
}
.deletBtn .el-button--primary {
  background-color: #fe000c !important;
  border-color: #fe000c !important;
}
.deletBtn .el-message-box__container {
  position: relative;
}
.deletBtn .el-icon-warning {
  color: #fe000c !important;
  /* top: 1px !important; */
}
.deletBtn .el-message-box__message {
  word-break: break-all !important;
}
</style>
