<template>
    <div class="add-lumpoint">
        <el-dialog :title="(deviceTypeDialog!='addDeviceAndLubpoint' && deviceTypeDialog!='addLumPoint') ? '编辑润滑点' : '创建润滑点'" :visible.sync="addLubricationPointDialog" width="40%" :close-on-click-modal="false"  :before-close="cancelAddLumpoint">
            <div style="padding: 10px 20px 0; height:630px;overflow: auto;">
                <el-form :model="addLumPointForm" ref="lupRuleForm" :rules="rules" class="demo-addLumPointForm" label-width="160px" label-position="top">
                    <div >
                        <div class="info detail-other-info" >
                            <div class="info-title">
                                <div class="line"></div>
                                <div class="title">基础信息</div>
                            </div>
                            <el-row :gutter="24" style="padding: 20px;">
                                <el-col :span="12">
                                    <el-form-item label="润滑点设备名称" :prop="(addLumPointForm.lubricationPointSelectName=='自定义' || lupDeviceNameList.length==1 || lupDeviceNameList.length==0)?'lubricationPointName':'lubricationPointSelectName'">
                                        <div style="display: flex;" v-if="lupDeviceNameList.length>1">
                                            <el-select
                                                v-model="addLumPointForm.lubricationPointSelectName"
                                                placeholder="请选择润滑点设备名称"
                                                size="small"
                                                @change="lubricationPointSelectNameChange"
                                                :style="{width:(addLumPointForm.lubricationPointSelectName=='自定义')?'30%':'100%',marginRight:(addLumPointForm.lubricationPointSelectName=='自定义')?'5px':''}"
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
                                            :style="{width:(addLumPointForm.lubricationPointSelectName=='自定义')?'70%':'80%'}"
                                            v-if="addLumPointForm.lubricationPointSelectName=='自定义'"
                                            @blur="lubricationPointNameBlur"  
                                            v-model="addLumPointForm.lubricationPointName" maxlength="50" clearable placeholder="请输入"></el-input>
                                        </div>
                                        <div v-else>
                                            <el-input size="small" 
                                            v-model="addLumPointForm.lubricationPointName" 
                                            maxlength="50" 
                                            clearable 
                                            @blur="lubricationPointNameBlur"
                                            placeholder="请输入" 
                                            style="width: 100%">
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
                                    <el-select v-model="addLumPointForm.lubricationPointTypeCode" 
                                    :disabled="resource == 'report' || resource == 'task'"
                                    placeholder="请选择" 
                                    size="small" style="width: 100%" @change="handleLubricationPointTypeChange">
                                        <el-option v-for="item in lubricationPointTypeList" :key="item.code" :label="item.name" :value="item.code" clearable> </el-option>
                                    </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="润滑⽅式" prop="lubricationMethod">
                                    <el-select
                                        size="small"
                                        clearable
                                        :disabled="resource == 'task'"
                                        v-model="addLumPointForm.lubricationMethod"
                                        placeholder="请选择"
                                        style="width: 100%"
                                        @change="handlelubricationMethodChange"
                                    >
                                        <el-option v-for="item in lubricationPointTypeData" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                    </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="在用油品名称" :prop="!addDeviceForm.newBusinessFlag ? 'currentOilCode' : ''">
                                    <el-select size="small" ref="cascaderRef" v-model="addLumPointForm.currentOilCode" placeholder="试试搜索：油品名称" clearable filterable remote :loading="loadingRemote" :remote-method="getOilData" @focus="getOilData('')" @change="oilNameChange" style="width: 100%">
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
                                        <el-col :span="15" style="padding: 0">
                                            <el-form-item
                                            prop="oilBoxCapacity"
                                            label="油箱容量"
                                            :rules="[
                                                { required: oilTypeDevice == 1 && !addDeviceForm.newBusinessFlag ? true : false, message: '请输入油箱容量', trigger: 'blur' },
                                                { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }
                                            ]"
                                            >
                                                <el-input size="small" v-model="addLumPointForm.oilBoxCapacity" maxlength="10" placeholder="请输入" clearable></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-form-item  prop="oilBoxCapacityUnit" :rules="[{ required: oilTypeDevice == 1 && !addDeviceForm.newBusinessFlag ? true : false, message: '请选择油箱容量单位', trigger: 'change' }]">
                                                <span slot="label">单位</span>
                                                <el-select size="small" clearable v-model="addLumPointForm.oilBoxCapacityUnit">
                                                    <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-form-item>
                                </el-col>
                            </el-row> 
                        </div>
                        <div class="info detail-other-info" style="margin-top: 20px;">
                            <div class="info-title">
                                <div class="line"></div>
                                <div class="title">润滑参考信息</div>
                            </div>
                        
                            <!-- 润滑参考信息  普通油类是必填 -->
                            <div v-if="showOrHideState == 0" style="padding: 20px 20px 0 20px;">
                                
                                <el-row :gutter="24">
                                    <el-col :span="12" >
                                        <el-form-item label="定期或按质换油" :prop="!addDeviceForm.newBusinessFlag ? 'oilChangeMethod' : ''" >
                                        <el-radio-group v-model="addLumPointForm.oilChangeMethod">
                                            <el-radio :label="1">定期</el-radio>
                                            <el-radio :label="2">按质</el-radio>
                                        </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12"  >
                                        <el-form-item>
                                            <el-col :span="15" style="padding: 0">
                                                <el-form-item
                                                :prop="!addDeviceForm.newBusinessFlag ? 'oilChangePeriod' : ''" 
                                                label="换油周期"
                                                :rules="[
                                                    { validator: validatePeriodVal(this.addLumPointForm), trigger: 'blur' },
                                                    { required: !addDeviceForm.newBusinessFlag ? true :false, message: '请输入换油周期', trigger: 'blur' },
                                                    { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }
                                                ]"
                                                >
                                                <el-input size="small" @change="dateChange('lastOilChangeDate')" v-model="addLumPointForm.oilChangePeriod" maxlength="10" placeholder="请输入" class="input-with-select" clearable>
                                                </el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="9">
                                                <el-form-item  :prop="!addDeviceForm.newBusinessFlag ? 'oilChangePeriodUnit' : ''" >
                                                    <span slot="label">单位</span>
                                                    <el-select size="small" @change="dateChange('lastOilChangeDate')" clearable v-model="addLumPointForm.oilChangePeriodUnit">
                                                        <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                            <!-- 润滑参考信息  特殊油类是必填 -->
                            <div v-if="showOrHideState == 1 || oilTypeDevice == 2" style="padding:20px 20px 0 20px;">
                                <el-row :gutter="24">
                                    <el-col :span="12" >
                                        <el-form-item>
                                        <el-col :span="15" style="padding: 0">
                                            <!-- 每月润滑剂添加量 -->
                                            <el-form-item
                                            prop="preMonthOilAddQuantity" 
                                            label="每月润滑剂添加量"
                                            :rules="[
                                                { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' },
                                                { required: !addDeviceForm.newBusinessFlag ? true : false, message: '请输入每月润滑剂添加量', trigger: 'blur' }
                                            ]"
                                            >
                                            <el-input size="small" v-model="addLumPointForm.preMonthOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-form-item :prop="!addDeviceForm.newBusinessFlag  ? 'preMonthOilAddQuantityUnit' : ''" >
                                            <span slot="label">单位</span>
                                            <el-select size="small" clearable v-model="addLumPointForm.preMonthOilAddQuantityUnit">
                                                <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                                            </el-select>
                                            </el-form-item>
                                        </el-col>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </div>
                            <div v-if="showOrHideState != 0" style="margin-top: 20px;"></div>
                            <div style="padding:0px 20px 0 20px;">
                                <!-- 润滑点图片/润滑点描述 -->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item>
                                            <div style="margin-bottom: 15px" class="label-title"><span slot="label">润滑点图片</span><span slot="label" style="color: #999">（支持.png.jpg.svn.gif图片格式）</span></div>
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
                                    <el-col :span="12">
                                        <el-form-item label="润滑点描述">
                                            <el-input size="small" type="textarea" :rows="6" v-model="addLumPointForm.lubricationPointDesc" maxlength="200" placeholder="请输入" style="width: 100%" show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 设备制造商推荐油品/润滑点设备制造商名称 -->
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="设备制造商推荐油品" prop="recommendOilCode">
                                        <el-select size="small" ref="deviceRef" v-model="addLumPointForm.recommendOilCode" placeholder="试试搜索：油品名称" clearable filterable remote :loading="loadingRemote" :remote-method="getOilData" @focus="getOilData('')" @change="selectRecommendOilName" style="width: 100%">
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
                                        <el-input size="small" v-model="addLumPointForm.lubricationPointManufacturer" maxlength="50" clearable placeholder="请输入" style="width: 100%"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 上次换油日期/上次换油时加注量 -->
                                <el-row :gutter="20">
                                    <el-col :span="12"  v-if="showOrHideState == 0">
                                        <el-form-item label="上次换油⽇期" prop="lastOilChangeDate">
                                        <el-date-picker
                                            v-model="addLumPointForm.lastOilChangeDate"
                                            type="date"
                                            size="small"
                                            @change="dateChange('lastOilChangeDate')"
                                            :picker-options="expireTimeOption"
                                            style="width: 100%"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期"
                                        >
                                        </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" v-if="showOrHideState == 0 && addLumPointForm.lastOilChangeDate" >
                                        <el-form-item>
                                        <el-col :span="15" style="padding: 0">
                                            <el-form-item
                                            prop="fillingQuantity"
                                            label="上次换油时加注量"
                                            :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                                            >
                                            <el-input size="small" v-model="addLumPointForm.fillingQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-form-item prop="fillingQuantityUnit">
                                            <span slot="label">单位</span>
                                            <el-select size="small" clearable v-model="addLumPointForm.fillingQuantityUnit">
                                                <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                                            </el-select>
                                            </el-form-item>
                                        </el-col>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 是否自动生成换油任务？/预计下次换油日期 -->
                                <el-row :gutter="20">
                                    <el-col :span="12" v-if="showOrHideState == 0 && addLumPointForm.oilChangeMethod == 1 && addLumPointForm.lastOilChangeDate && addLumPointForm.oilChangePeriod && addLumPointForm.oilChangePeriodUnit!='KM'" >
                                        <el-form-item label="是否自动生成换油任务？">
                                            <el-radio-group v-model="addLumPointForm.autoCreateOilChangePlan">
                                                <el-radio :label="true">是</el-radio>
                                                <el-radio :label="false">否</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" v-if="showOrHideState == 0 && addLumPointForm.oilChangeMethod == 1 && addLumPointForm.autoCreateOilChangePlan && addLumPointForm.lastOilChangeDate && addLumPointForm.oilChangePeriod && addLumPointForm.oilChangePeriodUnit!='KM'" >
                                        <el-form-item label="预计下次换油日期" prop="nextScheduledOilChangeDate">
                                            <el-date-picker
                                                v-model="addLumPointForm.nextScheduledOilChangeDate"
                                                type="date"
                                                size="small"
                                                :picker-options="pickerBeginDateBefore"
                                                style="width: 100%"
                                                value-format="yyyy-MM-dd"
                                                placeholder="选择日期"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--  每月润滑剂添加量   每次加油量 -->
                                <el-row :gutter="20" >
                                    <el-col :span="12"  v-if="oilTypeDevice == 1 && showOrHideState != 1">
                                        <el-form-item>
                                            <el-col :span="15" style="padding: 0">
                                                <!-- 每月油品添加量 -->
                                                <el-form-item
                                                :prop="!addDeviceForm.newBusinessFlag ? 'preMonthOilAddQuantity' : ''" 
                                                label="每月润滑剂添加量"
                                                :rules="[
                                                    { pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }
                                                ]"
                                                >
                                                <el-input size="small" v-model="addLumPointForm.preMonthOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="9">
                                                <el-form-item :prop="!addDeviceForm.newBusinessFlag ? 'preMonthOilAddQuantityUnit' : ''" >
                                                <span slot="label">单位</span>
                                                <el-select size="small" clearable v-model="addLumPointForm.preMonthOilAddQuantityUnit">
                                                    <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                                                </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12"  v-if="oilTypeDevice == 1">
                                        <el-form-item>
                                        <el-col :span="15" style="padding: 0">
                                            <el-form-item
                                            prop="everyTimeOilAddQuantity"
                                            label="每次加油量"
                                            :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                                            >
                                            <el-input size="small" v-model="addLumPointForm.everyTimeOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-form-item prop="everyTimeOilAddQuantityUnit">
                                            <span slot="label">单位</span>
                                            <el-select size="small" clearable v-model="addLumPointForm.everyTimeOilAddQuantityUnit">
                                                <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                                            </el-select>
                                            </el-form-item>
                                        </el-col>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 加油周期 上次加油日期 -->
                                <el-row :gutter="20" v-if="oilTypeDevice == 1">
                                    <el-col :span="12" >
                                        <el-form-item>
                                            <el-col :span="15" style="padding: 0">
                                                <el-form-item prop="oilAddPeriod" label="加油周期" :rules="[{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]">
                                                <el-input size="small" v-model="addLumPointForm.oilAddPeriod" maxlength="10" @change="dateChange('lastOilAddDate')" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="9">
                                                <el-form-item prop="oilAddPeriodUnit">
                                                <span slot="label">单位</span>
                                                <el-select size="small" clearable @change="dateChange('lastOilAddDate')" v-model="addLumPointForm.oilAddPeriodUnit">
                                                    <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                                                </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" >
                                        <el-form-item label="上次加油⽇期" prop="lastOilAddDate">
                                            <el-date-picker
                                                v-model="addLumPointForm.lastOilAddDate"
                                                type="date"
                                                size="small"
                                                @change="dateChange('lastOilAddDate')"
                                                :picker-options="expireTimeOption"
                                                style="width: 100%"
                                                value-format="yyyy-MM-dd"
                                                placeholder="选择日期"
                                            >
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 是否自动生成加油任务   预计下次加油日期 -->
                                <el-row :gutter="20" v-if="oilTypeDevice == 1" >
                                    <el-col :span="12" v-if="addLumPointForm.oilAddPeriod && addLumPointForm.lastOilAddDate && addLumPointForm.oilAddPeriodUnit!='KM'" >
                                        <el-form-item label="是否自动生成加油任务">
                                        <el-radio-group v-model="addLumPointForm.autoCreateOilAddPlan">
                                            <el-radio :label="true">是</el-radio>
                                            <el-radio :label="false">否</el-radio> 
                                        </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" v-if="oilTypeDevice == 1 && addLumPointForm.autoCreateOilAddPlan && addLumPointForm.lastOilAddDate && addLumPointForm.oilAddPeriod && addLumPointForm.oilAddPeriodUnit!='KM'" >
                                        <el-form-item label="预计下次加油日期">
                                        <el-date-picker
                                            v-model="addLumPointForm.nextScheduledOilAddDate"
                                            type="date"
                                            :picker-options="pickerBeginDateBefore"
                                            size="small"
                                            style="width: 100%"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期"
                                        >
                                        </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!-- 脂类的 -->
                                <el-row :gutter="20" v-if="oilTypeDevice == 2">
                                    <el-col :span="12" >
                                        <el-form-item>
                                        <el-col :span="15" style="padding: 0">
                                            <el-form-item
                                            prop="everyTimeOilAddQuantity"
                                            label="每次加脂量"
                                            :rules="[{ pattern: /^(([1-9]\d*)|([0-9]\d*.\d?[1-9]{1,2}))$/, message: '数值不能为0,且小数点后最多三位小数', trigger: 'blur' }]"
                                            >
                                            <el-input size="small" v-model="addLumPointForm.everyTimeOilAddQuantity" maxlength="6" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-form-item prop="everyTimeOilAddQuantityUnit">
                                            <span slot="label">单位</span>
                                            <el-select size="small" clearable v-model="addLumPointForm.everyTimeOilAddQuantityUnit">
                                                <el-option v-for="item in oilBoxCapacityList" :key="item.oilBoxCapacityUnit" :label="item.oilBoxCapacityUnitDesc" :value="item.oilBoxCapacityUnit"></el-option>
                                            </el-select>
                                            </el-form-item>
                                        </el-col>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" >
                                        <el-form-item>
                                        <el-col :span="15" style="padding: 0">
                                            <el-form-item prop="oilAddPeriod" label="加脂周期" :rules="[{ pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'blur' }]">
                                            <el-input size="small" @change="dateChange('lastOilAddDate2')" v-model="addLumPointForm.oilAddPeriod" maxlength="10" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="9">
                                            <el-form-item prop="oilAddPeriodUnit">
                                            <span slot="label">单位</span>
                                            <el-select size="small" @change="dateChange('lastOilAddDate2')" clearable v-model="addLumPointForm.oilAddPeriodUnit">
                                                <el-option v-for="item in oilChangePeriodList" :key="item.oilChangePeriodUnit" :label="item.oilChangePeriodUnitDesc" :value="item.oilChangePeriodUnit"></el-option>
                                            </el-select>
                                            </el-form-item>
                                        </el-col>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" v-if="oilTypeDevice == 2">
                                    <el-col :span="12" >
                                        <el-form-item label="上次加脂⽇期" prop="lastOilAddDate">
                                        <el-date-picker
                                            v-model="addLumPointForm.lastOilAddDate"
                                            type="date"
                                            size="small"
                                            :picker-options="expireTimeOption"
                                            style="width: 100%"
                                            @change="dateChange('lastOilAddDate2')"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期"
                                        >
                                        </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" style="height:96px;"  v-if="addLumPointForm.lastOilAddDate && addLumPointForm.oilAddPeriod && addLumPointForm.oilAddPeriodUnit!='KM'">
                                        <el-form-item label="是否自动生成加脂任务？">
                                        <el-radio-group v-model="addLumPointForm.autoCreateOilAddPlan">
                                            <el-radio :label="true">是</el-radio>
                                            <el-radio :label="false">否</el-radio>
                                        </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" >
                                        <el-form-item v-if="addLumPointForm.autoCreateOilAddPlan && addLumPointForm.oilAddPeriodUnit!='KM'" label="预计下次加脂日期">
                                        <el-date-picker
                                            v-model="addLumPointForm.nextScheduledOilAddDate"
                                            type="date"
                                            :picker-options="pickerBeginDateBefore"
                                            size="small"
                                            style="width: 100%"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期"
                                        >
                                        </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                </el-row>
                                <el-row :gutter="20">
                                </el-row>
                            </div>
                        </div>

                        <!--  设备运行信息-->
                        <div class="info detail-other-info" style="margin-top: 20px;"  v-if="fields.length>0">
                            <div class="info-title">
                                <div class="line"></div>
                                <div class="title">设备运行信息</div>
                            </div>
                            <el-row :gutter="24" style="padding: 20px;">
                                <div v-for="(item, index) in fields" :key="index">

                                
                                    <el-col :span="12"  >
                                        <el-form-item
                                        v-if="item.componentType=='1'"
                                        :prop="item.prop"
                                        :label="item.title"
                                        >
                                            <el-input :type="item.style=='1' ? 'textarea' : ''" size="small" v-model="item.value" :maxlength="item.lengthMax" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" >
                                        <el-form-item
                                            v-if="item.componentType=='5'"
                                            :prop="item.prop"
                                            :label="item.title"
                                            >
                                            <el-date-picker
                                                v-model="item.value"
                                                type="month"
                                                value-format="yyyy-MM"
                                                class="input-with-select" 
                                                style="width:100%"
                                                size="small"
                                                placeholder="请选择">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" >
                                        <el-form-item
                                            v-if="item.componentType=='2'"
                                            :prop="item.prop"
                                            :label="item.title"
                                            >
                                            <el-select size="small"  @change="value => selectComponent(value, item)"  clearable v-model="item.value" style="width:100%" >
                                                <el-option v-for="it in item.optionsDtos" :key="it.value" :label="it.option" :value="it.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    
                                    <el-col :span="12"  v-if="item.componentType=='11'" >
                                        <el-form-item >
                                            <span v-for="(itemChild,index) in item.componentList['1']" :key="index">
                                            <el-col :span="15" style="padding: 0"  v-if="itemChild.componentType == 1">
                                                <el-form-item
                                                :label="item.title"
                                                >
                                                    <el-input size="small" v-model="itemChild.value" :maxlength="itemChild.lengthMax" placeholder="请输入" clearable></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="9" v-if="itemChild.componentType == 2">
                                                <el-form-item  >
                                                    <span slot="label" style="opacity:0">111</span>
                                                    <el-select size="small"  @change="value => selectComponent(value, itemChild)" clearable v-model="itemChild.value" >
                                                        <el-option v-for="item1 in itemChild.optionsDtos" :key="item1.value" :label="item1.option" :value="item1.value"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </span>
                                        </el-form-item>
                                    
                                    </el-col>
                                    <el-col :span="12" >
                                        <el-form-item 
                                        :prop="item.prop"
                                        v-if="item.type=='textarea'"
                                        :label="item.label">
                                            <el-input size="small" type="textarea" :rows="6" v-model="item.value" :maxlength="item.length" placeholder="请输入" style="width: 100%" show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24" v-if="item.componentType == 12" style="padding:0px 0;">
                                        <!-- 设备工况图片 -->
                                        <div v-if="!isObjectEmpty(item.componentList)">
                                            <div  v-for="(valueObj, key,index1) in item.componentList"  :key="key" >
                                            <div v-for="(itemChild, index) in valueObj" :key="index">
                                                <el-col :span="12" v-if="itemChild.componentType==8">
                                                    <el-form-item
                                                    label="设备工况图片1（最多上传1张图片）"
                                                    >
                                                    <span slot="label">设备工况图片{{index1+1}}（最多上传1张图片）</span>
                                                    <el-upload
                                                        :class="{ isShowUploadBtn: (itemChild.imgFullDtoUrl.length >=1 || notShowUploadBtn) }"
                                                        :action="uploadUrl"
                                                        accept="image/*"
                                                        list-type="picture-card"
                                                        limit="1"
                                                        :auto-upload="false"
                                                        :disabled="true"
                                                        :file-list="itemChild.imgFullDtoUrl">
                                                        <div style="width:114px;height:114px;" @click="handlePictureUpload(itemChild)">
                                                            <i class="el-icon-plus"></i>
                                                        </div>
                                                        <div slot="file" slot-scope="{ file }">
                                                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                                                            <span class="el-upload-list__item-actions uploadMask" style="padding-top:12px;">
                                                            <span class="el-upload-list__item-preview">
                                                                <i class="el-icon-zoom-in" @click.self="handlePictureCardPreview(file, itemChild)"></i>
                                                            </span>
                                                            <span class="el-upload-list__item-preview">
                                                                <i class="el-icon-crop" @click.self="handlePicturePrune(file, itemChild)"></i>
                                                            </span>
                                                            <span v-if="!disabled" class="el-upload-list__item-delete">
                                                                <i class="el-icon-delete" @click.self="handleRemove(file, itemChild)"></i>
                                                            </span>
                                                            </span>
                                                        </div>
                                                    </el-upload>
                                                    </el-form-item>
                                                </el-col>
                                        
                                                <el-col :span="12" v-if="itemChild.componentType==1">
                                                    <el-form-item
                                                    label="图片1描述"
                                                    >
                                                    <span slot="label">图片{{index1+1}}描述</span>
                                                        <el-input :type="itemChild.style=='1' ? 'textarea' : ''" size="small" v-model="itemChild.value" :maxlength="itemChild.lengthMax" placeholder="请输入" class="input-with-select" clearable> </el-input>
                                                    </el-form-item>
                                                </el-col>
                                                
                                            </div>
                                            <el-col :span="24">
                                                <div style="color:#dd0000;cursor: pointer;margin-bottom: 10px;margin-top: -5px;" @click="deletePicture(item, key)" >删除</div>
                                            </el-col>
                                            
                                        </div>
                                        </div>
                                        
                                        <el-col :span="24" style="padding:20px 0;">
                                            <el-button  size="small" @click="addPicture(item)" >{{item.title}}</el-button>
                                        </el-col>
                                    </el-col>
                                    
                                </div>
                                
                                
                            </el-row>
                            
                            

                        </div>
                    </div>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <!-- 创建设备和润滑点的底部按钮 addDeviceAndLubpoint-->
                <div v-if="deviceTypeDialog=='addDeviceAndLubpoint'">
                    <el-button  style="color: #999;" @click="handleDirectCreationDevice('lupRuleForm')" size="small">跳过，暂不创建润滑点</el-button>
                    <el-button  type="danger" plain @click="handleLastStep('lupRuleForm')" size="small">上一步</el-button>
                    <el-button type="danger" @click="handleSubmit('lupRuleForm','addDeviceAndLubpoint')" size="small">确定</el-button>
                </div>
                <!-- 单独编辑润滑点的底部按钮 editLumPoint -->
                <div v-if="deviceTypeDialog=='editLumPoint'">
                    <el-button  style="color: #999;" @click="cancelEditLubpoint('lupRuleForm')" size="small">取消</el-button>
                    <el-button type="danger" @click="handleSubmit('lupRuleForm','editLumPoint')" size="small">确定</el-button>
                </div>
                <!-- 单独添加润滑点 addLumPoint-->
                <div v-if="deviceTypeDialog=='addLumPoint'">
                    <el-button  style="color: #999;" @click="cancelEditLubpoint('lupRuleForm')" size="small">取消</el-button>
                    <el-button type="danger" @click="handleSubmit('lupRuleForm','addLumPoint')" size="small">确定</el-button>
                </div>
                <!-- 编辑设备和润滑点 editDeviceAndLumPoint-->
                <div v-if="deviceTypeDialog=='editDeviceAndLumPoint'">
                    <el-button  style="color: #999;" @click="handleLastStep('lupRuleForm')" size="small">上一步</el-button>
                    <el-button type="danger" @click="handleSubmit('lupRuleForm','editDeviceAndLumPoint')" size="small">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <SyncLub :dialogFlag="showSyncLubDialog" @closeSyncLubDialog="closeSyncLubDialog" :tipsData="tipsData"/>
        <!-- 手动添加油品 -->
        <AddOil :addOilDialog="addOilDialog" :addType="addType" :addOilForm="addOilForm" v-on:addOrEditOil="addOrEditOil" v-on:closeDialogAdd="closeDialogAdd" ref="LupDialogRef" />
         <!-- 查看图片 -->
        <el-dialog :visible.sync="imgDialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
        <!-- 图片裁剪 -->
            <img-cutter
            ref="imgCutterModal"
            label="选择本地图片"
            :crossOrigin="true"
            :isModal="true"
            :crossOriginHeader="anonymous"
            :sizeChange="false"
            toolBgc="none"
            :lockScroll="true"
            :boxWidth="800"
            :boxHeight="450"
            :cutWidth="cutWidth"
            :cutHeight="cutHeight"
            :toolBoxOverflow="false"
            @cutDown="val => cutDown(val, item)"
            >
            <div slot="open"></div>
            <div slot="choose"></div>
            </img-cutter>
    </div>
  </template>
  <script>
  import AddOil from "./addOil";
  import imgCutter from '@/components/imgCutter.vue'
  import SyncLub from "./syncLubDialog.vue";
  export default {
    components: {
        SyncLub,AddOil,imgCutter
    },
    props: {
        addLubricationPointDialog: {   // 润滑点弹框是否展示
            type: Boolean,
            default: () => {
                return false;
            },
        },
        saveFlag: {   // 是否是从下一步点到上一步，又点回来的，做缓存的标识
            type: Boolean,
            default: () => {
                return false;
            },
        },
        addLumPointFormSave: {   // 是否是从下一步点到上一步，又点回来的，缓存的之前保存字段
            type: Object,
            default: () => {
            return {};
            },
        },
        addDeviceForm: {   // 设备表单字段
            type: Object,
            default: () => {
            return {};
            },
        },
        epInfo: { // 设备详情字段
            type: Object,
            default: () => {
            return {};
            },
        },
        imageLubricationList: {  // 是否是从下一步点到上一步，又点回来的，缓存的之前润滑点图片字段
            type: Array,
            default: () => {
            return [];
            },
        },
        uploadUrl: {  // 是否是从下一步点到上一步，又点回来的，缓存的之前润滑点图片路径
            type: String,
            default: ''
        },
        resource: {   // 入口类型
            type: String,
            default: ''
        },
        selectLubricationPointNumber: {  // 如果是编辑润滑点，需要带过来要编辑的润滑点编码
            type: String,
            default: ''
        },
        //  addDeviceAndLubpoint 新建设备和润滑点  addLumPoint  单独添加润滑点
        //  editDevice  单独编辑设备   editLumPoint 单独编辑润滑点  editDeviceAndLumPoint  编辑设备和润滑点 
        deviceTypeDialog: {  
            type: String,
            default: ''
        },
    },
    data() {
      return {
        validatePeriodVal: addLumPointForm => {
            const { oilChangePeriodUnit } = addLumPointForm;
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
        pruneIndex: null,
        uploadUrl:'',
        picAddCont:[],
        imgDialogVisible:false,
        dialogImageUrl:'',
        cutFileList:{},
        cutFlag: false,
        notShowUploadBtn: false,
        cutWidth:200,
        cutHeight:200,
        pictureFields:[],
        roleType:'',
        addType:'',
        oilList:[],
        addOilDialog: false, // 手动添加油品弹框
        oilTypeDevice: '1', // 判断是油类还是脂类，默认为油类
        showSyncLubDialog:false,
        tipsData:{},
        lupDeviceNameList:[],
        addLubricationPointDialog:false,  // 创建润滑点的弹框
        lubricationPointTypeData: [], // 润滑方式数据
        lubricationPointTypeList: [], // 润滑点设备类型下拉数据
        loadingRemote: false, // 在用油品数据加载中动画
        oilChangePeriodList: [], // 周期单位的下拉数据
        hideUpload: false,
        typeProps: {
            value: "code",
            label: "name"
        },
        oilBoxCapacityList: [{ oilBoxCapacityUnit: "L", oilBoxCapacityUnitDesc: "L" }, { oilBoxCapacityUnit: "KG", oilBoxCapacityUnitDesc: "KG" }],
        // 手动添加油品弹框
        addOilForm: {
            oilBrand: "",
            oilType: "",
            oilName: ""
        },
        addLumPointForm:{
            imgLubricationFile: "", //润滑点图片
            lubricationPointPicPath:'',
            lubricationPointPicRelativePath:'',
            recommendOilBrand: "",
            oilChangeMethod: 2, // 定期或按质换油
            recommendOilType: "",
            recommendOilSeries: "",
            recommendOilCode: "",
            lubricationPointType :'',
            lubricationPointTypeCode: "",
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
            oilChangePeriodUnit: "D",
            oilChangePeriod: "",
            oilBoxCapacityUnit: "L",
            oilAddPeriodUnit: "D",
            lubricationPointSelectName:'',
            tableFromValueList:[],
            deviceWorkComponentList:[]
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
        //   表单验证规则
        rules: {
            oilChangeMethod: [{ required: true, message: "请选择定期或按质换油", trigger: "change" }],
            lubricationPointName: [{ required: true, message: "请输入润滑点设备名称", trigger: "blur" }],
            lubricationPointSelectName: [{ required: true, message: "请选择润滑点设备名称", trigger: "change" }],
            lubricationMethod: [{ required: true, message: "请选择润滑方式", trigger: "change" }],
            oilChangePeriodUnit: [{ required: true, message: "请输入换油周期单位", trigger: "change" }],
            lubricationPointTypeCode: [{ required: true, message: "请选择润滑点设备类型", trigger: "change" }],
            currentOilCode: [{ required: true, message: "请选择在用油品名称", trigger: "change" }],
        },
        oldBussess:Boolean,
        fields:[],   // 设备运行信息的字段
        fieldsFlag:false
      };
    },
    created() {
    },
    watch: {
        addLubricationPointDialog: {
            handler: function(val, oldVal) {
                this.$_queryLubricationMethodData();
                this.oldBussess = this.epInfo.newBusinessFlag
                if(this.deviceTypeDialog=='editLumPoint' || this.deviceTypeDialog=='addLumPoint') {
                    this.$set(this.addDeviceForm,'newBusinessFlag',this.oldBussess)
                }
                console.log(this.addDeviceForm)
                this.$_queryLPData(); //查询润滑点设备类型
                this.getOilData(); //获取油品级联数据
                this.$_queryOilChangePeriodData(); // 查询换油单位
                // 给设备类型赋值
                const list = [];
                if(this.addDeviceForm.eptType && this.addDeviceForm.eptType.length>0) {
                } else {
                    if (this.epInfo.deviceTypeDto) {
                        this.epInfo.deviceTypeDto.forEach(item => {
                            list.push(item.code);
                        });
                    }
                    if(this.epInfo && JSON.stringify(this.epInfo)!='{}') {
                        this.addDeviceForm.eptType = list;
                    }
                }
                
                if(this.deviceTypeDialog!='editDeviceAndLumPoint' && this.deviceTypeDialog!='editLumPoint' ) {
                console.log(99999,this.epInfo,this.addDeviceForm)
                if(this.addDeviceForm.eptType && this.addDeviceForm.eptType.length>0) {
                    this.eptTypeChange(this.addDeviceForm.eptType) // 查询润滑点设备名称
                } else {
                    this.eptTypeChange(this.epInfo.deviceType,'','devicetype')
                }
                   
                }
                
                // 编辑润滑点  或者编辑设备和润滑点
                if((this.deviceTypeDialog=='editLumPoint' || this.deviceTypeDialog=='editDeviceAndLumPoint') && !this.saveFlag) {
                    
                    if(this.addDeviceForm.newBusinessFlag && this.addDeviceForm.newBusinessFlag !=undefined && this.deviceTypeDialog=='editDeviceAndLumPoint') {
                        this.$set(this.addDeviceForm,'newBusinessFlag',this.addDeviceForm.newBusinessFlag)
                    }
                    // 获取润滑点详情 
                    this.$_getLubricationPointDetail()
                } else {  //  新建润滑点 this.saveFlag true   this.addLumPointFormSave   内容为：填过润滑点信息 又点了上一步，保存原先先写的润滑点信息
                    if(this.addLumPointFormSave && JSON.stringify(this.addLumPointFormSave)!='{}' && this.saveFlag ) {
                        Object.keys(this.addLumPointForm).forEach(key=>{
                            this.addLumPointForm[key] = this.addLumPointFormSave[key]
                        })
                        this.oilTypeDevice = this.addLumPointForm.oilType
                    }
                }
                
            },
            immediate: true
        },
    },
    methods: {
        isObjectEmpty(obj) {
            console.log(obj)
            return Object.keys(obj).length === 0;
        },
        async addPicture(item) {
            console.log(item)
            let objNew = {}
            let arr = await this.requestMethodGet("/device/workComponent/list", {
            lubricationPointType:this.addLumPointForm.lubricationPointTypeCode 
            });
            this.picAddCont = arr.data.data.filter(it=>it.componentType=='12')
                this.picAddCont[0].componentList.forEach(child2=>{
                console.log(child2)
                child2.componentId = child2.id
                child2.id=''
                if(child2.componentType=='8') {
                    this.$set(child2,'imgFullDtoUrl',[])
                    
                }
            })
            if(JSON.stringify(item.componentList)=='{}') {
                
                console.log(this.picAddCont[0])
                let obj = _.cloneDeep(this.picAddCont[0].componentList)
                obj.uid = _.uniqueId('addLupSituation_')
                    objNew = {
                        1:obj
                    }
                
            } else {
                console.log(item.componentList[1])
                let len = Object.keys(item.componentList).length
                let lenNew = len+1
                let obj = _.cloneDeep(this.picAddCont[0].componentList)
                obj.uid = _.uniqueId('addLupSituation_')
                if(lenNew == 2) {
                    objNew = {
                        2:obj
                    }
                }
                if(lenNew == 3) {
                    objNew = {
                        3:obj
                    }
                }
                if(lenNew == 4) {
                    this.$message({
                        type: "warning",
                        message: `最多添加3条数据`
                    });
                }
            }
            
            // this.$set(item.componentList, item.componentList[lenNew], obj)
            
            item.componentList = {
                ...item.componentList,
                ...objNew
            }
            console.log(item,'追加后')

        },
        deletePicture(item,val){
            console.log(item,val)
            this.$delete(item.componentList, val)
            var keys=[];//定义一个数组用来接受key    
            var values=[];//定义一个数组用来接受value 
            for(var it in item.componentList){    
            keys.push(it);    
            values.push(item.componentList[it]);//取得value      
            }   
            let objNew = {}
            for(let i = 0; i < keys.length; i++) {
            let j = i+1
            objNew[j] = values[i]
            // 循环的内容
            
            }
            item.componentList = objNew
            
        },
        // 预览
        handlePictureCardPreview(file, item){
        this.dialogImageUrl = file.url
        this.imgDialogVisible = true
        },
        // 点击上传
        handlePictureUpload(item){
        this.cutFileList = item
        this.cutFlag = false
        this.$refs.imgCutterModal.handleOpen()
        },
        // 裁剪
        handlePicturePrune(file, item){
        this.cutFlag = true
        this.cutFileList = item
        let url = item.imgFullDtoUrl[0].url
        this.$refs.imgCutterModal.handleOpen({
            name: 'img',
            src: url,
            width: 400,
            height: 400
        })
        },
        // 图片返显
        imgBackShow (file, callback) {
            callback(file[0].url)
        },
        // 裁剪确定
        cutDown(fileName){
            let cutDownData = this.cutFileList
            // console.log('裁剪确定....',fileName,cutDownData)
            var imgGs = fileName.dataURL.split(';')[0].split('/')[1]
            var file = this.dataURLtoBlob(fileName.dataURL, '裁剪图片.' + imgGs)
            var formData = new FormData()
            formData.append('fileType', 'lubrication_point')
            formData.append('multipartFiles', file)
            this.requestMethodPost('/web/file/uploadFiles', formData)
                .then(async res => {
                res = res.data
                if (res.code === 1000) {
                    this.getFullImgPath1(cutDownData, res.data[0], this.cutFlag)
                    cutDownData.value = res.data[0]
                } else {
                    // cutDownData.imgFullDtoUrl = []
                    cutDownData.notShowUploadBtn = false
                    this.$message({
                    message: res.msg,
                    type: 'warning'
                    })
                }
                })
                .catch(res => {})
        },
        // base64转换为file
        dataURLtoBlob(dataurl, name) {
            let arr = dataurl.split(",");
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], name, { type: mime });
        },
        // 获取全路径赋值imgFullDtoUrl
        async getFullImgPath1(item, path, flag) {
            console.log(item,path,flag)
            const params = {
                url: path
            };
            await this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
                if (res.data.code == 1000) {
                if (flag) {
                    this.$set(item,'imgFullDtoUrl',[{url: res.data.data}])
                    this.$set(item,'value',path);
                } else {
                    this.$set(item,'imgFullDtoUrl',[{ url: res.data.data}])
                    this.$set(item,'value',path);
                }
                } else {
                this.$message({
                    message: res.data.msg,
                    type: "warning"
                });
                }
            });
        },
        // 删除
        handleRemove(file, item){
            this.$set(item,'value','')
            this.$set(item,'imgFullDtoUrl',[])
            // console.log('==========',file, item)
        },
        // 取消创建润滑点
        cancelAddLumpoint() {
            this.$emit("closeDialogAddLubPoint");
        },
        // 取消编辑润滑点
        cancelEditLubpoint() {
            this.$emit("closeDialogAddLubPoint");
        },
        // 跳过创建润滑点，直接创建设备
        handleDirectCreationDevice() {
            this.$emit("addDevice");
        },
        // 提交设备润滑点
        handleSubmit(formName,type) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addLumPointForm.oilType = this.oilTypeDevice
                    this.addLumPointForm.tableFromValueList = this.fields

                    console.log(this.addLumPointForm)
                    // 单独编辑设备
                    if(type=='editLumPoint') {
                        this.addLumPointForm.lubricationPointNumber = this.selectLubricationPointNumber
                    }
                    // 新建设备和润滑点
                    if(type=='addDeviceAndLubpoint') {
                        this.submitDeviceAndLumpoint("addOrEditLup",this.addLumPointForm,this.showOrHideState,this.lupDeviceNameList,this.addDeviceForm.newBusinessFlag);
                    }
                    // 编辑设备和润滑点
                    if(type=='editDeviceAndLumPoint') {
                        if(this.oldBussess && !this.addDeviceForm.newBusinessFlag) {
                            this.$alert('设备由新项目初装设备变为现有生意设备，必填信息发生改变，请及时补全设备及润滑点信息', '提示', {
                            confirmButtonText: '知道了',
                            callback: action => {
                                this.submitEditDeviceAndLumpoint("editDeviceAndLumPoint",this.addLumPointForm,this.showOrHideState,this.lupDeviceNameList,this.addDeviceForm.newBusinessFlag);
                            }
                            });
                        } else{
                            this.submitEditDeviceAndLumpoint("editDeviceAndLumPoint",this.addLumPointForm,this.showOrHideState,this.lupDeviceNameList,this.addDeviceForm.newBusinessFlag);
                        }
                    }
                    // 单独添加润滑点
                    if(type=='addLumPoint' || type=='editLumPoint') {
                        this.submitAddOrEditLumpoint(this.addLumPointForm,this.showOrHideState,type,this.lupDeviceNameList,this.addDeviceForm.newBusinessFlag)
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: '存在必填项未录入，请填写后重试'
                    });
                }
            });
        },
        // 单独添加润滑点
        submitAddOrEditLumpoint(form, showOrHideState,type,lupDeviceNameList,newBusinessFlag) {
            if (type == "addLumPoint") {
                // 新增
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
                    const isRollingBearing = form.oilType == "2"; // 油类  加油周期     false  脂类 加脂周期
                    const list = this.oilChangePeriodList;
                    let MaxNum = null;
                    let MaxNum1 = null;
                    // 先判断 加油/加脂
                    list.forEach(it => {
                    it.rangMin = 1;
                    if (isRollingBearing) {
                        // 加脂
                        it.rangMax = it.oilChangePeriodUnit == "Y" ? 2 : it.oilChangePeriodUnit == "M" ? 24 : it.oilChangePeriodUnit == "D" ? 730 : 17520;
                    } else {
                        // 换油
                        it.rangMax = it.oilChangePeriodUnit == "Y" ? 20 : it.oilChangePeriodUnit == "M" ? 240 : it.oilChangePeriodUnit == "D" ? 7300 : 175200;
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
                    } else {
                        if (MaxNum1) {
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
                        if (MaxNum) {
                        this.$message({
                            type: "error",
                            message: `换油周期：请输入1~${MaxNum}的整数`
                        });
                        return;
                        }
                    }
                    }
                    const params = {};
                    params.deviceNumber = this.epInfo.deviceNumber; // 设备编号
                    params.lubricationPointTypeCode = form.lubricationPointTypeCode; //润滑点设备类型
                    if (form.lubricationPointPicPath) {
                        params.lubricationPointPicPath = form.lubricationPointPicPath;//润滑点图片
                    }
                    params.newBusinessFlag = newBusinessFlag;
                    params.lubricationPointType = form.lubricationPointType; //润滑点设备类型名称
                    params.oilBoxCapacity = form.oilBoxCapacity; //油箱容量
                    params.lubricationPointManufacturer = form.lubricationPointManufacturer; 
                    params.lubricationMethod = form.lubricationMethod; //润滑/加脂方式
                    params.oilBoxCapacityUnit = form.oilBoxCapacityUnit;//油箱容量单位
                    params.oilBrandCode = form.oilBrandCode; //在用油品牌
                    params.currentOilCode = form.currentOilCode; 
                    if(this.lupDeviceNameList.length>1 && form.lubricationPointSelectName != '自定义'){
                        params.lubricationPointName = form.lubricationPointSelectName; //润滑点设备名称
                    }else{
                        params.lubricationPointName = form.lubricationPointName; //润滑点设备名称
                    }
                    params.lubricationPointDesc = form.lubricationPointDesc;  //描述
                    if (form.recommendOilCode) {
                        params.recommendOilCode = form.recommendOilCode; // 设备制造商推荐油品code
                    } else {
                        params.recommendOilCode = ""
                    }
                    params.oilType = form.oilType
                    
                    if (form.oilType == 1) {
                    // 普通油类 特殊展示
                    if (showOrHideState == 0) {
                        params.oilChangeMethod = form.oilChangeMethod; // 定期或者按质
                        params.oilChangePeriod = form.oilChangePeriod; // 换油周期
                        params.oilChangePeriodUnit = form.oilChangePeriodUnit; // 换油周期单位
                        if (form.lastOilChangeDate) {
                            // 上次换油⽇期
                            params.lastOilChangeDate = form.lastOilChangeDate;
                            params.fillingQuantity = form.fillingQuantity; //  上次换油时加注量
                            params.fillingQuantityUnit = form.fillingQuantityUnit;// 上次换油时加注量单位
                        }
                        if (form.oilChangeMethod == 1 && form.lastOilChangeDate && form.oilChangePeriod && form.oilChangePeriodUnit != "KM") {
                            params.autoCreateOilChangePlan = form.autoCreateOilChangePlan;// 是否自动生成下次换油计划？
                            // 预计下次换油日期
                            if (form.nextScheduledOilChangeDate && form.autoCreateOilChangePlan) {
                                params.nextScheduledOilChangeDate = form.nextScheduledOilChangeDate;
                            }
                        }
                    }
                    params.oilAddPeriod = form.oilAddPeriod;//加油周期
                    params.oilAddPeriodUnit = form.oilAddPeriodUnit;//加油周期单位
                    params.lastOilAddDate = form.lastOilAddDate;// 上次加油⽇期
                    params.everyTimeOilAddQuantity = form.everyTimeOilAddQuantity; // 每次加油量
                    params.everyTimeOilAddQuantityUnit = form.everyTimeOilAddQuantityUnit; // 每次加油量 单位
                    params.preMonthOilAddQuantity = form.preMonthOilAddQuantity;  //每月润滑剂添加量
                    params.preMonthOilAddQuantityUnit = form.preMonthOilAddQuantityUnit;  //每月润滑剂添加量单位
                    //是否自动生成下次加油计划
                    if (form.oilAddPeriod && form.lastOilAddDate && form.oilAddPeriodUnit != "KM") {
                        params.autoCreateOilAddPlan = form.autoCreateOilAddPlan;
                        if (form.autoCreateOilAddPlan) {
                            params.nextScheduledOilAddDate = form.nextScheduledOilAddDate;//预计下次加油日期
                        }
                    }
                    }
                    // 脂类润滑点
                    if (form.oilType == 2) {
                        params.oilAddPeriodUnit = form.oilAddPeriodUnit;  //加脂周期单位
                        params.oilAddPeriod = form.oilAddPeriod; //加脂周期
                        params.everyTimeOilAddQuantity = form.everyTimeOilAddQuantity; //每次加脂量 / 每次加油量
                        params.everyTimeOilAddQuantityUnit = form.everyTimeOilAddQuantityUnit;//每次加脂量 / 每次加油量 单位
                        params.lastOilAddDate = form.lastOilAddDate; // 上次加脂⽇期
                        params.preMonthOilAddQuantity = form.preMonthOilAddQuantity; //每月润滑剂添加量
                        params.preMonthOilAddQuantityUnit = form.preMonthOilAddQuantityUnit;  //每月润滑剂添加量单位

                    if (form.lastOilAddDate && form.oilAddPeriod && form.oilAddPeriodUnit != "KM") {
                        params.autoCreateOilAddPlan = form.autoCreateOilAddPlan; //是否自动生成下次加脂计划 /是否自动生成下次加油计划
                        //  预计下次加油日期/预计下次加脂日期
                        if (form.nextScheduledOilAddDate != "" && form.autoCreateOilAddPlan) {
                            params.nextScheduledOilAddDate = form.nextScheduledOilAddDate;
                        }
                    }
                    }
                    form.tableFromValueList.forEach(it=>{
                        if(it.componentType==12 || it.componentType==11) {
                            for (let key in it.componentList) {
                                console.log(key); // name age
                                it.componentList[key].forEach((it1,j)=>{
                                    it1.row = key
                                })
                            }
                        }
                    })
                    params.tableFromValueList = form.tableFromValueList
                    params.delFlag = false;
                    ++this.recommendOilCodeKey;
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
                            this.$emit('addOrEditLup')
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
                .catch(() => {
                    this.loading = false;
                });
            } else {
                // 编辑
                this.$confirm("确定提交编辑润滑点?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                })
                .then(() => {
                    const params = form;
                    form.tableFromValueList.forEach(it=>{
                        if(it.componentType==12 || it.componentType==11) {
                            for (let key in it.componentList) {
                                console.log(key); // name age
                                it.componentList[key].forEach((it1,j)=>{
                                    it1.row = key
                                })
                            }
                        }
                    })
                    params.deviceNumber = this.epInfo.deviceNumber;
                    params.newBusinessFlag=newBusinessFlag;
                    params.delFlag = false;
                    delete params.lubricationPointPicRelativePath
                    this.requestMethodPost("/weChat/lubricationPoint/updateLubricationPoint", params)
                    .then(res => {
                        res = res.data;
                        if (res.code == 1000) {
                        this.$message({
                            message: "编辑成功",
                            type: "success"
                        });
                        this.dialogFlag = false;
                        this.$emit('addOrEditLup')
                        } else {
                        this.$message({
                            message: res.msg,
                            type: "warning"
                        });
                        }
                    })
                    .catch(res => {});
                })
                .catch(() => {
                    this.loading = false;
                });
            }
        },
        closeSyncLubDialog() {
            this.showSyncLubDialog = false
            this.$emit('addOrEditLup')
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
                    this.addLumPointForm.oilBrandCode = res.data.data.oilBrandNumber;
                    }
                } else {
                    this.addLumPointForm.oilBrandCode = formName.oilBrand;
                }
                console.log(this.addType,88989)
                if (this.addType == "oilName") {
                    this.getOilData('',res.data.data.oilNameNumber);
                    this.$set(this.addLumPointForm, "currentOilCode", res.data.data.oilNameNumber);
                } else {
                    this.getOilData('',res.data.data.oilNameNumber);
                    this.$set(this.addLumPointForm, "recommendOilCode", res.data.data.oilNameNumber);
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
        // 创建设备和润滑点
        submitDeviceAndLumpoint(type,form, showOrHideState,lupDeviceNameList,newBusinessFlag) {
            this.$confirm("确定提交添加设备?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
                console.log(form)
            var params = {};
            params.deviceName = this.addDeviceForm.deviceName; // 设备编号
            params.spId = this.addDeviceForm.spId;
            params.customerNumber = this.addDeviceForm.customerNumber;
            params.deviceType =  this.addDeviceForm.eptType[this.addDeviceForm.eptType.length - 1];
            params.workshopId = this.addDeviceForm.workshopId ;
            params.newBusinessFlag = this.addDeviceForm.newBusinessFlag;
            params.manufacturer= this.addDeviceForm.manufacturer;
            params.deviceModel = this.addDeviceForm.deviceModel;
            params.deviceCode = this.addDeviceForm.deviceCode;
            params.devicePosition = this.addDeviceForm.devicePosition;
            params.customerVisibility = this.addDeviceForm.customerVisibility;
            params.oilBoxCapacity = form.oilBoxCapacity; //油箱容量
            params.oilBoxCapacityUnit = form.oilBoxCapacityUnit;//油箱容量单位
            params.oilBrandCode = form.oilBrandCode; //在用油品牌
            params.oilBrand = form.oilBrandName; //在用油品牌
            params.lubricationPointManufacturer = form.lubricationPointManufacturer;   //润滑点设备制造商名称
            params.lubricationPointTypeCode = form.lubricationPointTypeCode; //润滑点设备类型



            if(form.lubricationPointPicPath) {
                params.lubricationPointPicPath = form.lubricationPointPicPath;//润滑点图片
            }
            params.lubricationPointType  = form.lubricationPointType ; // 润滑点设备类型名称
            params.oilType  =  this.oilTypeDevice ;
            if(this.lupDeviceNameList.length>1 && form.lubricationPointSelectName != '自定义'){
                params.lubricationPointName = form.lubricationPointSelectName; //润滑点设备名称
            }else{
                params.lubricationPointName = form.lubricationPointName; //润滑点设备名称
            }

            params.lubricationPointDesc  = form.lubricationPointDesc ;
            if (form.recommendOilCode) {  // 推荐油品
                params.recommendOilCode  = form.recommendOilCode ;
            }
            params.currentOilCode  = form.currentOilCode ; //在用油品名称
            params.lubricationMethod  = form.lubricationMethod ;  // 润滑⽅式
            // 油类润滑点 
            if (this.oilTypeDevice == 1) {   
                // 普通油类 特殊展示
                if(this.showOrHideState==0) {  
                    params.oilChangeMethod  = form.oilChangeMethod ; // 定期或者按质
                    params.oilChangePeriod  = form.oilChangePeriod ;   // 换油周期
                    params.oilChangePeriodUnit  = form.oilChangePeriodUnit ; // 换油周期单位
                if (form.lastOilChangeDate) {  // 上次换油⽇期
                    params.lastOilChangeDate  = form.lastOilChangeDate ;
                    params.fillingQuantity  = form.fillingQuantity ;//  上次换油时加注量
                    params.fillingQuantityUnit  = form.fillingQuantityUnit ; // 上次换油时加注量单位\
                }
                if(form.oilChangeMethod == 1 && form.lastOilChangeDate && form.oilChangePeriod && form.oilChangePeriodUnit!='KM') {
                    params.autoCreateOilChangePlan  = form.autoCreateOilChangePlan ; // 是否自动生成下次换油计划？
                    // 预计下次换油日期
                    if (form.nextScheduledOilChangeDate && form.autoCreateOilChangePlan) { 
                        params.nextScheduledOilChangeDate  = form.nextScheduledOilChangeDate ;
                    }
                }
                }
                params.oilAddPeriod  = form.oilAddPeriod ;   //加油周期
                  params.oilAddPeriodUnit  = form.oilAddPeriodUnit ;   //加油周期单位
                  params.lastOilAddDate  = form.lastOilAddDate ; // 上次加油⽇期
                  params.everyTimeOilAddQuantity  = form.everyTimeOilAddQuantity ;  // 每次加油量
                  params.everyTimeOilAddQuantityUnit  = form.everyTimeOilAddQuantityUnit ; // 每次加油量 单位
                  params.preMonthOilAddQuantity  = form.preMonthOilAddQuantity ; //每月润滑剂添加量
                  params.preMonthOilAddQuantityUnit  = form.preMonthOilAddQuantityUnit ; //每月润滑剂添加量单位
                //是否自动生成下次加油计划  
                if(form.oilAddPeriod && form.lastOilAddDate && form.oilAddPeriodUnit!='KM') {
                    params.autoCreateOilAddPlan  = form.autoCreateOilAddPlan ;
                if(form.autoCreateOilAddPlan) {
                    params.nextScheduledOilAddDate  = form.nextScheduledOilAddDate ;  //预计下次加油日期
                }
                }
            }
            // 脂类润滑点 
            if(this.oilTypeDevice == 2) {  
                params.oilAddPeriodUnit  = form.oilAddPeriodUnit ; //加脂周期单位
                  params.oilAddPeriod  = form.oilAddPeriod ;   //加脂周期
                  params.everyTimeOilAddQuantity  = form.everyTimeOilAddQuantity ;    //每次加脂量 / 每次加油量
                  params.everyTimeOilAddQuantityUnit  = form.everyTimeOilAddQuantityUnit ;   //每次加脂量 / 每次加油量 单位
                  params.lastOilAddDate  = form.lastOilAddDate ; // 上次加脂⽇期
                  params.preMonthOilAddQuantity  = form.preMonthOilAddQuantity ;  //每月润滑剂添加量
                  params.preMonthOilAddQuantityUnit  = form.preMonthOilAddQuantityUnit ;   //每月润滑剂添加量单位
                
                if(form.lastOilAddDate && form.oilAddPeriod && form.oilAddPeriodUnit!='KM') {
                    params.autoCreateOilAddPlan  = form.autoCreateOilAddPlan ; //是否自动生成下次加脂计划 /是否自动生成下次加油计划
                    //  预计下次加油日期/预计下次加脂日期
                    if (form.nextScheduledOilAddDate != "" && form.autoCreateOilAddPlan) {
                        params.nextScheduledOilAddDate  = form.nextScheduledOilAddDate ;
                    }
                }
                
                }
                form.tableFromValueList.forEach(it=>{
                    if(it.componentType==12 || it.componentType==11) {
                        for (let key in it.componentList) {
                            console.log(key); // name age
                            it.componentList[key].forEach((it1,j)=>{
                                it1.row = key
                            })
                        }
                    }
                })
                params.tableFromValueList = form.tableFromValueList
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
                        } else {
                            this.$emit('addOrEditLup')
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
        lubricationPointSelectNameChange(val){

            if(val){
                this.addLumPointForm.lubricationPointSelectNameFlag = (val != '自定义')
            }
        },
        // 编辑设备和润滑点
        submitEditDeviceAndLumpoint(type,form, showOrHideState,lupDeviceNameList,newBusinessFlag) {

            this.$confirm("确定提交修改设备?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                customClass: "deletBtn",
                type: "warning"
            })
            .then(() => {
            let lubricationPointUpdateRequestList = []
            form.tableFromValueList.forEach(it=>{
                if(it.componentType==12 || it.componentType==11) {
                    for (let key in it.componentList) {
                        console.log(key); // name age
                        it.componentList[key].forEach((it1,j)=>{
                            it1.row = key
                        })
                    }
                }
            })
            let obj = {
                deviceNumber: this.epInfo.deviceNumber,
                lubricationMethod: form.lubricationMethod,
                lubricationPointDesc: form.lubricationPointDesc,
                lubricationPointName: (form.lubricationPointSelectNameFlag)?form.lubricationPointSelectName:form.lubricationPointName,
                lubricationPointNumber: this.selectLubricationPointNumber,
                lubricationPointType: form.lubricationPointType,
                lubricationPointTypeCode: form.lubricationPointTypeCode,
                oilBoxCapacity: form.oilBoxCapacity,  //油箱容量
                oilBoxCapacityUnit: form.oilBoxCapacityUnit,  //油箱容量单位
                oilBrandCode: form.oilBrandCode,  // 在用油品品牌 code
                oilBrandName: form.oilBrandName,  // 在用油品品牌 code
                recommendOil: form.recommendOil,
                recommendOilCode: form.recommendOilCode,
                lubricationPointPicPath: form.lubricationPointPicPath,
                picDeleteFlag: form.delLubPicFlag || "",
                delFlag: form.delFlag || false,
                currentOilCode: form.currentOilCode,
                lubricationPointManufacturer: form.lubricationPointManufacturer,
                tableFromValueList:form.tableFromValueList
            };
            if(obj.lubricationPointPicPath && obj.picDeleteFlag=='1') {
                obj.picDeleteFlag=0
            }
            obj.oilChangeMethod = form.oilChangeMethod;   // 定期或者按质
            obj.oilChangePeriod = form.oilChangePeriod;   // 换油周期
            obj.oilChangePeriodUnit = form.oilChangePeriodUnit; // 换油周期单位
            obj.lastOilChangeDate = form.lastOilChangeDate;
            obj.fillingQuantity = form.fillingQuantity;
            obj.fillingQuantityUnit = form.fillingQuantityUnit;
            obj.autoCreateOilChangePlan = form.autoCreateOilChangePlan; // 是否自动生成下次换油计划？
            // 预计下次换油日期
            obj.nextScheduledOilChangeDate = form.nextScheduledOilChangeDate;
            obj.oilAddPeriod= form.oilAddPeriod;   //加油周期
            obj.oilAddPeriodUnit= form.oilAddPeriodUnit;   //加油周期单位
            obj.lastOilAddDate = form.lastOilAddDate;  // 上次加油⽇期
            obj.everyTimeOilAddQuantity= form.everyTimeOilAddQuantity; // 每次加油量
            obj.everyTimeOilAddQuantityUnit= form.everyTimeOilAddQuantityUnit; // 每次加油量 单位
            obj.preMonthOilAddQuantity= form.preMonthOilAddQuantity; //每月润滑剂添加量
            obj.preMonthOilAddQuantityUnit= form.preMonthOilAddQuantityUnit; //每月润滑剂添加量单位
            //是否自动生成下次加油计划
            obj.autoCreateOilAddPlan= form.autoCreateOilAddPlan; 
            obj.nextScheduledOilAddDate= form.nextScheduledOilAddDate;   //预计下次加油日期
            obj.oilAddPeriodUnit= form.oilAddPeriodUnit;   //加脂周期单位
            obj.oilAddPeriod= form.oilAddPeriod;   //加脂周期
            obj.everyTimeOilAddQuantity = form.everyTimeOilAddQuantity;  // 上次加油⽇期
            obj.everyTimeOilAddQuantityUnit= form.everyTimeOilAddQuantityUnit; //每次加脂量
            obj.preMonthOilAddQuantity= form.preMonthOilAddQuantity; //每月润滑剂添加量
            obj.preMonthOilAddQuantityUnit= form.preMonthOilAddQuantityUnit; // 每月润滑剂添加量 单位
            obj.oilType = this.oilTypeDevice ;
            obj.lastOilAddDate= form.lastOilAddDate; // 上次加脂⽇期
            //是否自动生成下次加脂计划
            obj.autoCreateOilAddPlan= form.autoCreateOilAddPlan; 
            obj.nextScheduledOilAddDate= form.nextScheduledOilAddDate;   //预计下次加脂日期
            

            lubricationPointUpdateRequestList.push(obj)

            let params = {
                deviceNumber: this.epInfo.deviceNumber,
                deviceName: this.addDeviceForm.deviceName,

                newBusinessFlag: this.addDeviceForm.newBusinessFlag,
                customerNumber: this.addDeviceForm.customerNumber,
                manufacturer: this.addDeviceForm.manufacturer || "",
                deviceModel: this.addDeviceForm.deviceModel || "",
                lubricationPointUpdateRequestList: lubricationPointUpdateRequestList,
                deviceType: this.addDeviceForm.eptType[this.addDeviceForm.eptType.length - 1],
                workshopId: this.addDeviceForm.workshopId,
                deviceCode: this.addDeviceForm.deviceCode,
                devicePosition: this.addDeviceForm.devicePosition,
                customerVisibility: this.addDeviceForm.customerVisibility
            };
            this.requestMethodPost("/web/device/updateDeviceAndLPBatch", params)
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    this.$message({
                    message: "修改成功",
                    type: "success"
                    });
                    this.$emit('editDeviceAndLumPoint')
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
        // 上一步
        handleLastStep() {
            this.addLumPointForm.oilType = this.oilTypeDevice
            this.$emit("lastNext",this.addLumPointForm,this.imageLubricationList,this.uploadUrl);
        },
        selectComponent(value,item,itemChild) {
            let itemSelect =[]
            if(itemChild) {
                if(value) {
                    itemSelect = itemChild.optionsDtos.filter(item1=>value==item1.value)
                    itemChild.name = itemSelect[0].option
                }else {
                    itemChild.name = ''
                }
                
            } 
            if(item){
                if(value) {
                    itemSelect = item.optionsDtos.filter(item1=>value==item1.value)
                    item.name = itemSelect[0].option
                }   else {
                    item.name = ''
                }
                
            }
            
        },
        eptTypeChange(val,type,code){
            console.log(val,type)
            const params = {
                lubPointName:'',
                status:1,
                current:1,
                size:100
            }
            if(code =='devicetype') {
                params.deviceCode = val
            } else {
                params.deviceCode = val[val.length-1]
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
                if(data.length>1 && !type){
                    this.$set(this.addLumPointForm,'lubricationPointSelectName','')
                }
                if(type) {
                    let selectNameList = []
                    data.forEach(it=>{
                        selectNameList.push(it.lubPointName)
                    })
                    if(selectNameList.includes(this.addLumPointForm.lubricationPointName)){
                        this.$set(this.addLumPointForm,'lubricationPointSelectName',this.addLumPointForm.lubricationPointName)
                        this.$nextTick(()=>{
                            this.$refs['lupRuleForm'].validateField(['lubricationPointSelectName'])
                        })
                    }else{
                        this.$set(this.addLumPointForm,'lubricationPointSelectName','自定义')
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
        // 获取全路径赋值imgFullDtoUrl
        getFullImg(item, path) {
        const params = {
            url: path
        };
        this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
            if (res.data.code == 1000) {
                this.$set(item,'imgFullDtoUrl',[{url: res.data.data}])
            } else {
            this.$message({
                message: res.data.msg,
                type: "warning"
            });
            }
        });
        },
        // 查看润滑点详情
         $_getLubricationPointDetail() {
            console.log(1222333)
            let params = {
                lubricationPointNumber: this.selectLubricationPointNumber
            };
            this.requestMethodGet("/web/device/queryLubricationPointDetail", params)
                .then(async res => {
                res = res.data;
                if (res.code == 1000) {
                    let lumPointObj = res.data; 
                    Object.keys(this.addLumPointForm).forEach(key=>{
                        this.addLumPointForm[key] = lumPointObj[key]
                    })
                    console.log(this.addLumPointForm)
                    if(this.addLumPointForm.deviceWorkComponentList.length == 0) {
                        this.getDeviceOperationMsg(this.addLumPointForm.lubricationPointTypeCode) 
                    } else {
                        console.log(1122333)
                        this.addLumPointForm.deviceWorkComponentList.forEach(it=>{
                            if(it.componentType == 12) {
                                for (var child in  it.componentList) {
                                    it.componentList[child].forEach(child2=>{
                                    if(child2.componentType=='8') {
                                        if(child2.value) {
                                            this.getFullImg(child2,child2.value)
                                        } else {
                                            this.$set(child2,'imgFullDtoUrl',[])
                                        }
                                        
                                    }
                                })
                                }   
                               
                            }
                        })
                        this.fields = this.addLumPointForm.deviceWorkComponentList
                    }
                    console.log(this.fields)
                    this.imageLubricationList = [];
                    if (this.addLumPointForm.currentOilCode) {
                        let resCurrentOil = await this.getOilNameByOilCode(this.addLumPointForm.currentOilCode)
                        console.log(resCurrentOil,'在用油品名称',{oilAlias: resCurrentOil,code:this.addLumPointForm.currentOilCode})
                        this.oilList.push({oilAlias: resCurrentOil,code:this.addLumPointForm.currentOilCode})
                        console.log(this.oilList)
                    }
                    if (this.addLumPointForm.recommendOilCode) {
                        let resCurrentOil1 = await this.getOilNameByOilCode(this.addLumPointForm.recommendOilCode)
                        console.log(resCurrentOil1,'推荐油品名称',{oilAlias: resCurrentOil1,code:this.addLumPointForm.recommendOilCode})
                        this.oilList.push({oilAlias: resCurrentOil1,code:this.addLumPointForm.recommendOilCode})
                        console.log(this.oilList)
                    }
                    if (this.addLumPointForm.lubricationPointPicPath) {
                        this.$set(this.addLumPointForm, 'lubricationPointPicPath', this.addLumPointForm.lubricationPointPicRelativePath)
                        this.getFullpath(this.addLumPointForm.lubricationPointPicRelativePath)
                    } else {
                        this.addLumPointForm.imgLubricationFile = "";
                    }
                    this.oilTypeDevice = this.addLumPointForm.oilType
                    if(this.addLumPointForm.lubricationPointName) {
                        this.eptTypeChange(this.addDeviceForm.eptType,'editLumPoint') // 查询润滑点设备名称
                        this.$set(this.addLumPointForm,'lubricationPointSelectName',this.addLumPointForm.lubricationPointName)
                    } else {
                        this.eptTypeChange(this.addDeviceForm.eptType) // 查询润滑点设备名称
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
        getFullpath(halfPath) {
            let params = {
                url: halfPath
            };
            this.requestMethodGet("/web/file/getFullUrl", params)
            .then(res => {
             res = res.data;
            if (res.code == 1000) {
                this.$set(this.addLumPointForm, 'lubricationPointPicRelativePath', res.data)
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
        //查询润滑点设备类型
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
        getOilData(val,code){
            this.loadingRemote = true
            this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val,code:code, status:1, size:200, current:1}).then((res) => {
                if (res.data.code == 1000) {
                this.loadingRemote = false
                this.oilList = res.data.data.list;
                this.$nextTick(()=>{
                    if(!this.addDeviceForm.newBusinessFlag) {
                        this.$refs['lupRuleForm'].clearValidate('currentOilCode')
                    }
                    
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
                this.addLumPointForm.oilBrandCode = item[0].parentCode
                this.addLumPointForm.oilBrandName = item[0].parentName
                this.addLumPointForm.currentOilCode = val
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
                this.getFullImgPath(data, file);
                this.addLumPointForm.lubricationPointPicPath=res.data[0];
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
                if (this.addLumPointForm.id) {
                    this.addLumPointForm.imgLubricationFile = path;
                } else {
                    this.addLumPointForm.imgLubricationFile = file.raw;
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
            this.addLumPointForm.imgLubricationFile = "";
            this.addLumPointForm.lubricationPointPicPath = "";
            this.addLumPointForm.lubricationPointPicRelativePath = "";
            this.addLumPointForm.delLubPicFlag = 1;
            this.imageLubricationList = [];
            setTimeout(() => {
                this.hideUpload = fileList.length >= 1;
            }, 500);
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
                oilChangePeriod = this.addLumPointForm.oilAddPeriod;
                oilChangePeriodUnit = this.addLumPointForm.oilAddPeriodUnit;
                oilLastTime = this.addLumPointForm.lastOilAddDate;
            } else {
                // 换油周期
                oilChangePeriod = this.addLumPointForm.oilChangePeriod;
                oilChangePeriodUnit = this.addLumPointForm.oilChangePeriodUnit;
                oilLastTime = this.addLumPointForm.lastOilChangeDate;
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
                    this.addLumPointForm.nextScheduledOilAddDate = res.data.data;
                    } else if (val == "lastOilAddDate") {
                    // 加油周期
                    this.addLumPointForm.nextScheduledOilAddDate = res.data.data;
                    } else {
                    // 换油周期
                    this.addLumPointForm.nextScheduledOilChangeDate = res.data.data;
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
        // 润滑点设备类型 change 事件===============
        handleLubricationPointTypeChange(val) {
            var obj = {};
            obj = this.lubricationPointTypeList.filter(item => {
            return item.code === val;
            });
            this.addLumPointForm.lubricationPointTypeCode = obj[0].code;
            this.addLumPointForm.lubricationPointType = obj[0].name;
            console.log(val)
            // 获取设备运行信息
            this.getDeviceModel(val)
            // this.getDeviceOperationMsg(val)
              
        },
        getDeviceModel(val) {
            this.requestMethodGet("/device/workComponent/selectDeviceWorkListBylubPoint", {
                lubricationPointType: val,lubricationPointNumber:this.deviceTypeDialog!='addDeviceAndLubpoint' && this.deviceTypeDialog!='addLumPoint' ? this.selectLubricationPointNumber : ''
          }).then(res => {
            if (res.data.code == 1000) {
              console.log(res.data)
              if(res.data.data.length>0) {
                res.data.data.forEach(it=>{
                    if(it.componentType == 12) {
                        for (var child in  it.componentList) {
                            it.componentList[child].forEach(child2=>{
                            if(child2.componentType=='8') {
                                if(child2.value) {
                                    this.getFullImg(child2,child2.value)
                                } else {
                                    this.$set(child2,'imgFullDtoUrl',[])
                                }
                                
                            }
                        })
                        }   
                        
                    }
                })
                this.fields = res.data.data
              }else {
                this.getDeviceOperationMsg(val)
              }
                // this.fields = res.data.data
                // this.fields.forEach(it=>{
                //     it.componentId = it.id
                //     it.id=''
                //     if(it.componentList.length>0) {
                //         it.componentList.forEach(child=>{
                //             child.componentId = child.id
                //             child.id=''
                //             this.$set(child,'imgFullDtoUrl',[])
                //         })
                //         if(it.componentType == 12) {
                //             it.componentList={}
                //         } else {
                //             it.componentList = {
                //                 1:it.componentList
                //             }
                //         }
                        
                //     } else {
                //         it.componentList={}
                //     }
                // })
                console.log(this.fields)
              
            }
          });
        },
        // 根据润滑点设备类型获取设备运行信息字段
        getDeviceOperationMsg(val,type) {
            this.requestMethodGet("/device/workComponent/list", {
                lubricationPointType: val
          }).then(res => {
            if (res.data.code == 1000) {
              console.log(res.data)
              if(type=='addPic') {
                this.picAddCont = res.data.data.filter(it=>it.componentType=='12')

              } else {
                this.fields = res.data.data
                this.fields.forEach(it=>{
                    it.componentId = it.id
                    it.id=''
                    if(it.componentList.length>0) {
                        it.componentList.forEach(child=>{
                            child.componentId = child.id
                            child.id=''
                            this.$set(child,'imgFullDtoUrl',[])
                        })
                        if(it.componentType == 12) {
                            it.componentList={}
                        } else {
                            it.componentList = {
                                1:it.componentList
                            }
                        }
                        
                    } else {
                        it.componentList={}
                    }
                })
                console.log(this.fields)
              }
              
            }
          });
        },
         
        lubricationPointNameBlur(){
            this.$refs['deviceRuleForm'].validateField(['eptType'],err=>{
                if(err){
                this.$message({
                    message: '请先选择设备类型',
                    type: "warning"
                });
                this.addLumPointForm.lubricationPointName = ''
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
                this.addLumPointForm.oilBoxCapacityUnit = "KG";
                this.addLumPointForm.everyTimeOilAddQuantityUnit = "KG";
                this.addLumPointForm.preMonthOilAddQuantityUnit = "KG";
                this.addLumPointForm.oilChangeMethod = ""; 
                this.addLumPointForm.oilChangePeriod = "";
                this.addLumPointForm.oilChangePeriodUnit = "";
                this.addLumPointForm.lastOilChangeDate = "";
                this.addLumPointForm.autoCreateOilChangePlan = "";
                this.addLumPointForm.fillingQuantity = "";
                
                this.addLumPointForm.nextScheduledOilChangeDate = "";
            } else {
                this.addLumPointForm.oilBoxCapacityUnit = "L";
                this.addLumPointForm.everyTimeOilAddQuantityUnit = "L";
                this.addLumPointForm.preMonthOilAddQuantityUnit = "L";
                this.addLumPointForm.oilChangeMethod = 2;
                this.addLumPointForm.autoCreateOilChangePlan = false;
                this.addLumPointForm.fillingQuantityUnit = "L";
                // 如果选择的润滑点设备类型是  发动机 
                if(this.addLumPointForm.lubricationPointTypeCode=='lubrication_point_type_0004') {
                    this.addLumPointForm.oilChangeMethod = 1;
                }
            }
        
        },
        // 润滑方式下拉事件
        handlelubricationMethodChange(val) {
            this.getDeviceType(val);
        },
        // 通过润滑点设备类型获取 润滑方式下拉框数据
        $_queryLubricationMethodData() {
            
            this.requestMethodGet("/web/device/getLubricationMethodByType")
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    this.lubricationPointTypeData = res.data;
                    
                } else {
                    this.$message({
                    message: res.msg,
                    type: "warning"
                    });
                }
            })
            .catch(res => {});
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
        const { lubricationPointTypeCode, lubricationMethod } = this.addLumPointForm;
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
 /deep/  .isShowUploadBtn .el-upload {
        display: none;
    }
.add-lumpoint {
    .info {
        width: 100%;
        border: 1px solid #e9e9e9;
        border-radius: 4px;
    }
   
    /deep/ .el-dialog__body {
        padding: 0px !important;
    }
    .info-title {
        width: calc(100% - 40px);
        height: 48px;
        display: flex;
        padding: 0 20px;
        align-items: center;
        background-color: #f9f9f9;
        border-bottom: 1px solid #e9e9e9;
    }
    .hide /deep/.el-upload {
        display: none !important;
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
        width: 114px !important;
        height: 114px;
    }
    .title {
        margin-left: 10px;
        font-size: 14px;
        line-height: 14px;
        font-weight: bold;
        color: #000;
    }
    /deep/ .el-row .el-col-12 {
        padding-right: 20px !important;
    }
    .border {
        width: 100%;
        height:1px;
        background-color: #E9E9E9;
        margin-bottom: 10px;
    }
    /deep/ .el-form-item__label ,.label-title{
        color: #000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
        margin-bottom: 10px;
    }
    /deep/ .el-radio__label {
        color: #000;
        font-family: 'Microsoft YaHei';
        font-size: 14px;
    }
    /deep/ .el-dialog__title{
        color: #000;
        font-family: 'Microsoft YaHei';
        font-size: 18px;
    }
    
    .line {
        width: 4px;
        height: 14px;
        background: #dd0000;
    }
}

</style>