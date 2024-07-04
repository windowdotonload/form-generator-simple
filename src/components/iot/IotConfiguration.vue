<template>
    <div style="height:100%;position: relative;" >
        <div class="return-btn" style="position:absolute;right:50px;height:55px;line-height:55px;top:-55px;color:red;cursor:pointer">
            <el-button type="danger" plain size="small" @click="handleMonitor"><img src="../../assets/jc.png" style  ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px">监测</el-button>
            <el-button type="danger" plain size="small" @click="onBack"><img src="../../assets/back.png" style  ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:10px;height:10px">返回</el-button>
            <!-- <img src="../../assets/back.png" style ="vertical-align: middle;margin-right:5px;margin-top:-2px;height:12px;height:12px">返回 -->
        </div>
        <div class="wrapConfiguration" :style="mainminheight">
            <!-- 基本参数 -->
            <div class="configTitle">
                <el-row>
                    <el-col :span="4" style="width:188px;">
                        <!-- 润滑点图片 -->
                        <img :src="lubricationPointPicPath || defaultImg" style="width:168px;height:168px;border-radius:15px;margin-top:5px;"/>
                    </el-col>
                    <el-col :span="18">                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
                        <div style="font-size:24px;font-weight:bold;">{{lubricationDetail.lubricationPointName}} </div>
                        <el-row style="font-size:14px;line-height:30px;margin-top:20px;color:#666;">
                            <el-col :span="6">
                                <span>所属公司</span>
                            </el-col>
                            <el-col :span="5">
                                <span>设备名称</span>
                            </el-col>
                            <el-col :span="5">
                                <span>设备区域</span>
                            </el-col>
                            <el-col :span="8">
                                <span>制造商</span>
                            </el-col>
                        </el-row>
                        <el-row style="font-size:16px;color:#333;font-weight:bold;">
                            <el-col :span="6">
                                <span style='color:#0c479d;cursor:pointer' @click="goCompanyDetail">{{deviceInfo.companyName || '--'}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>{{deviceInfo.deviceName || '--'}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>{{deviceInfo.region || '--'}}</span>
                            </el-col>
                            <el-col :span="8">
                                <span>{{deviceInfo.manufacturer || '--'}}</span>
                            </el-col>
                        </el-row>
                        <el-row style="font-size:14px;line-height:30px;margin-top:10px;color:#666;margin-top:20px;">
                            <el-col :span="6">
                                <span>润滑点设备类型</span>
                            </el-col>
                            <el-col :span="5">
                                <span>换油周期</span>
                            </el-col>
                            <el-col :span="5">
                                <span>上次用油日期</span>
                            </el-col>
                            <el-col :span="8">
                                <span>现用油品</span>
                            </el-col>
                        </el-row>
                        <el-row style="font-size:16px;color:#333;font-weight:bold;">
                            <el-col :span="6">
                                <span>{{lubricationDetail.lubricationPointType || '--'}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>{{lubricationDetail.oilChangePeriod || '--'}}</span>
                            </el-col>
                            <el-col :span="5">
                                <span>{{lubricationDetail.oilDate || '--'}}</span>
                            </el-col>
                            <el-col :span="8">
                                <span>{{lubricationDetail.oilName || '--'}}</span>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <!-- 传感器和检测指标阈值 -->
            <el-row :gutter="20" style="margin-top:20px;height:420px;">
                <!-- 传感器表格 -->
                <el-col :span="8">
                    <div class="tableBg">
                        <div style="line-height:40px;position:relative;">
                            <span style="display:inline-block;width:2px;height:16px;background:#fe000c;position:absolute;top:12px;left:-20px;"></span>
                            传感器
                        </div>
                        <!-- 表格 -->
                        <el-table
                        ref="accountTable"
                        :key="key"
                        row-key="id"
                        :data="sensorListTableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :header-cell-style="{background:'#f7f7f7'}"
                        :max-height="294"
                        height="294"
                        v-loading="sensorListLoading"
                        border
                        >
                        <el-table-column
                        type="index"
                        :index="indexMethodSensorList"
                        label="序号"
                        width="50">
                        </el-table-column>
                        <el-table-column  prop="deviceName" label="DeviceName" min-width="10%"  show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.deviceName}}</span>
                                <span style="color:#fe000c;margin-left:4px;font-size:12px" v-if="status && scope.row.iotId==sensorListTableData[0].iotId">新</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="productName" label="产品名称" min-width="10%"  show-overflow-tooltip></el-table-column>
                        <el-table-column label="操作" min-width="6%" align="center">
                            <i class="el-icon-share"></i>
                            <template slot-scope="scope">
                            <el-link
                                @click="handleUnbundling(scope.row)"
                                type="danger"
                                style="color:#fe000c;"
                            >解绑</el-link>
                            </template>
                        </el-table-column>
                        </el-table>
                        <el-pagination
                        background
                        :pager-count="3"
                        @size-change="handleSizeSensorChange"
                        @current-change="handleCurrentSensorChange"
                        :current-page="pagenationSensor.current"
                        :page-size="pagenationSensor.size"
                        :page-sizes="[5,10,20,30,50]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalNumbeSensor"
                        style="float: right;display:flex; margin-top: 10px;max-width: 100%;"
                        ></el-pagination>
                        <!-- 解除绑定提示 弹框 -->
                        <el-dialog
                            title="解除绑定提示"
                            :visible.sync="dialogUnbundlingVisible"
                            :show-close="false"
                            width="600px"
                            class="dialog-unbundling"
                            :close-on-click-modal="false"
                            >
                            <div style="margin-left:30px;line-height:30px;position:relative"><i class="el-icon-warning-outline" style="position:absolute;left:-30px;top:3px;font-size:24px;color:red"></i>您将要解绑的传感器监测的值已经在设备端展示。</div>
                            <div style="margin-left:30px;line-height:20px;">传感器解绑设备后，监测数据和指标将消失,与其相关的阈值和报警规则将失效。</div>
                            <div style="margin-left:30px;line-height:30px;">您确认要解绑吗？</div>
                            <div slot="footer" class="dialog-footer" style="text-align:right;">
                                <el-button type="danger" plain @click="handleCancle()" size="small">取消</el-button>
                                <el-button type="danger" @click="handleSure()" size="small">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </el-col>
                <!-- 检测指标阈值 -->
                <el-col :span="16" >
                    <!-- 表格 -->
                    <div class="tableBg">
                        <div style="line-height:40px;position:relative;">
                            <span style="display:inline-block;width:2px;height:16px;background:#fe000c;position:absolute;top:12px;left:-20px;"></span>
                            监测指标阈值
                        </div>
                        <el-table
                        ref="accountTable"
                        :key="key"
                        row-key="id"
                        :data="monitorTableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :header-cell-style="{background:'#f7f7f7'}"
                        :max-height="294"
                        height="294"
                        v-loading="monitorLoading"
                        border
                        >
                        <el-table-column
                        type="index"
                        label="序号"
                        :index="indexMethod"
                        width="50">
                        </el-table-column>
                        <el-table-column prop="name" label="指标" min-width="12%"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="deviceName" label="DeviceName" min-width="15%"  show-overflow-tooltip></el-table-column>
                        <el-table-column prop="dangerMax" label="危险上限" min-width="10%"    show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.dangerMaxStatus">{{scope.row.dangerMax}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="alertMax" label="警戒上限" min-width="10%"   show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.alertMaxStatus">{{scope.row.alertMax}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="alertMin" label="警戒下限" min-width="10%"  show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.alertMinStatus">{{scope.row.alertMin}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="dangerMin" label="危险下限" min-width="10%"   show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span v-if="scope.row.dangerMinStatus">{{scope.row.dangerMin}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column  label="状态" min-width="12%" align="center">
                            <template slot-scope="scope">
                                <el-switch
                                    class="tablescope"
                                    v-model="scope.row.status"
                                    :active-value="true"
                                    :inactive-value="false"
                                    active-color="#fe000c"
                                    active-text="开"
                                    inactive-text="关"
                                    inactive-color="#bdbdbd"
                                    @change="changeSwitch(scope.row,val)"/>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="15%" align="center">
                            <i class="el-icon-share"></i>
                            <template slot-scope="scope">
                            <el-link
                                @click="handleSet(scope.row)"
                                type="danger"
                                style="color:#fe000c;"
                            >阈值</el-link>
                            <el-dropdown v-if="scope.row.status" style="margin-left:10px">
                                <span class="el-dropdown-link" style="color:#fe000c;cursor:pointer">
                                    更多<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item style="text-align:center">
                                        <el-link
                                            v-if="scope.row.topFlag == 'N' && scope.row.status"
                                            @click="handleTop(scope.row)"
                                            type="danger"
                                            style="color:#fe000c;"
                                        >置顶</el-link>
                                        <span
                                            v-if="scope.row.topFlag == 'N' && !scope.row.status"
                                            style="color:#ccc;"
                                        >置顶</span>
                                        <el-link
                                            v-if="scope.row.topFlag == 'Y'"
                                            @click="handleDown(scope.row)"
                                            type="danger"
                                            style="color:#fe000c;"
                                        >取消置顶</el-link>
                                    </el-dropdown-item>
                                    <el-dropdown-item style="text-align:center" v-if="scope.row.moveDown != 'hide' && scope.row.status">
                                        <el-link
                                        type="danger"
                                        @click="moveRow(scope.row)"
                                        >{{scope.row.moveDown?'下移':'上移'}}</el-link>
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <img src="../../assets/topIcon.png" alt="置顶" style="vertical-align:bottom;position:absolute;right:10px;"  v-if="scope.row.topFlag == 'Y'">
                            <!-- <el-link
                                v-if="scope.row.topFlag == 'N' && scope.row.status"
                                @click="handleTop(scope.row)"
                                type="danger"
                                style="margin-right:10px;color:#fe000c;"
                            >置顶</el-link>
                              <span
                                v-if="scope.row.topFlag == 'N' && !scope.row.status"
                                style="margin-right:10px;color:#ccc;"
                            >置顶</span>
                             <el-link
                                v-if="scope.row.topFlag == 'Y'"
                                @click="handleDown(scope.row)"
                                type="danger"
                                style="margin-right:10px;color:#fe000c;"
                            >取消置顶</el-link>
                               <el-link 
                               v-if="scope.row.moveDown == 'hide'"
                                type="danger"
                                @click="moveRow(scope.row)"
                                ></el-link>
                              <el-link
                                v-else
                                type="danger"
                                @click="moveRow(scope.row)"
                                >&nbsp;{{scope.row.moveDown?'下移':'上移'}}</el-link> -->
                            </template>
                        </el-table-column>
                        </el-table>
                        <el-pagination
                        background
                        @size-change="handleSizeChangeMonitor"
                        @current-change="handleCurrentChangeMonitor"
                        :current-page="pagenationMonitor.current"
                        :page-size="pagenationMonitor.size"
                        :page-sizes="[5,10,20,30,50]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalNumbeMonitor"
                        style="float: right;display:flex; margin-top: 10px"
                        ></el-pagination>
                        <!-- 点击设置 显示弹框 -->
                        <el-dialog
                            :visible.sync="dialogSetVisible"
                            :show-close="false"
                            width="520px"
                            :close-on-click-modal="false"
                            >
                            <el-row>
                                <el-col :span="14">
                                    <div style="color:#999;font-size:12px;">{{setContent.name}} {{setContent.unit}}</div>
                                    <img src="../../assets/lineChart.png" style="width:260px;height:200px;margin-top:6px;"/>
                                </el-col>
                                <el-col :span="10" style="padding-left:10px;">
                                    <div style="text-align:right;">启用</div>
                                    <el-form :model="rulesForm"  ref="rulesForm" :rules="rulesFormRules" label-width="78px" label-position="left" >
                                        <el-row style="font-size:12px;margin-top:16px;">
                                            <el-col :span="20">
                                                <el-form-item label="危险上限："  prop="dangerousUpper" style="margin-bottom:3px;">
                                                    <el-input  v-model="rulesForm.dangerMax"  size="small"  style="width:80px;" :disabled="!rulesForm.dangerMaxStatus"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="4" style="padding-left:14px;margin-top:8px;">
                                                <el-checkbox v-model="rulesForm.dangerMaxStatus"></el-checkbox>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="20">
                                                <el-form-item label="警戒上限："  prop="alertMax" style="margin-bottom:3px;">
                                                    <el-input  v-model="rulesForm.alertMax" size="small"  style="width:80px;" :disabled="!rulesForm.alertMaxStatus"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="4" style="padding-left:14px;margin-top:8px;">
                                                <el-checkbox v-model="rulesForm.alertMaxStatus"></el-checkbox>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="20">
                                                <el-form-item label="警戒下限："  prop="alertMin" style="margin-bottom:3px;">
                                                    <el-input v-model="rulesForm.alertMin" size="small"  style="width:80px;" :disabled="!rulesForm.alertMinStatus"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="4" style="padding-left:14px;margin-top:8px;">
                                                <el-checkbox v-model="rulesForm.alertMinStatus"></el-checkbox>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="20">
                                                <el-form-item label="危险下限："  prop="dangerMin" style="margin-bottom:3px;">
                                                    <el-input v-model="rulesForm.dangerMin" size="small"  style="width:80px;" :disabled="!rulesForm.dangerMinStatus"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="4" style="padding-left:14px;margin-top:8px;">
                                                <el-checkbox v-model="rulesForm.dangerMinStatus"></el-checkbox>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </el-col>
                            </el-row>
                            <div slot="footer" class="dialog-footer" style="text-align:right;">
                                <el-button type="danger" plain @click="handleSetCancle()" size="small">取消</el-button>
                                <el-button type="danger" @click="handleSetSubmit()" size="small">提交</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </el-col>
            </el-row>
            <!--  指标过滤  开始-->
            <div class="tableBg">
                <div style="line-height:40px;position:relative;padding:10px 0">
                    <span style="display:inline-block;width:2px;height:16px;background:#fe000c;position:absolute;top:22px;left:-20px;"></span>
                    指标过滤
                    <el-button type="danger"  size="small" plain icon="el-icon-edit-outline"  style="float:right;margin-top:6px;"  @click="handleEditRules()">编辑条件</el-button>
                </div>
                <!-- 表格 -->
                <el-table
                ref="accountTable"
                :key="key"
                row-key="id"
                :data="indicatorsFilteList"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{background:'#f7f7f7'}"
                v-loading="loading"
                border
                >
                <el-table-column
                type="index"
                :index="indexMethodAlarmRule"
                label="序号"
                width="50">
                </el-table-column>
                <el-table-column prop="filterContent" label="过滤条件内容" min-width="10%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="statusStr" label="条件状态" min-width="20%"  show-overflow-tooltip></el-table-column>
                </el-table>
                <el-pagination
                background
                @size-change="handleSizeChangeIndicatorsFilte"
                @current-change="handleCurrentChangeIndicatorsFilte"
                :current-page="pagenationIndicatorsFilte.current"
                :page-size="pagenationIndicatorsFilte.size"
                :page-sizes="[5,10,20,30,50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNumberIndicatorsFilte"
                style="float: right;display:flex; margin-top: 10px"
                ></el-pagination>
                <!-- 编辑条件 弹框  界面 -->
                <el-dialog  :visible.sync="dialogEditRulesVisible" 
                class="sendOfferVisibleDialog" 
                @close="handleCloseSendOffer" 
                style="min-height:400px;width:120%;margin-left:-10%;"
                title="条件设立"
                    :show-close="false"
                    :close-on-click-modal="false">
                    <div  class="candidatesFirstFormDialog">
                        <div>符合全部以下条件，相应的指标数据在小程序端不显示且不会触发报警</div>
                        <el-form :model="conditionsRulesForm"  ref="addCondition"  :rules="conditionsFormRules"  style='margin-left:40px;margin-bottom:55px;margin-top:40px;'>
                            <div v-for="(item,index) in conditionsRulesForm.iotDataList" :key="index">
                                <el-row>
                                    <el-col :span="4" style="margin-right:10px;">
                                        <el-form-item class="monitorNumber" label="指标：" :prop="'iotDataList.'+index+'.monitorNumber'"  :rules="conditionsFormRules.monitorNumber">
                                            <el-select style="width:60%" v-model="item.monitorNumber"  size="small" >
                                                <el-option v-for="item in ruleContentSelect2" 
                                                :key="item.value" 
                                                :value="item.value" 
                                                :label="item.label">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4" style="margin-right:10px;">
                                        <el-form-item class="filterConditionType" label="监测值："  :prop="'iotDataList.'+index+'.filterConditionType'" :rules="conditionsFormRules.filterConditionType">
                                            <el-select style="width:50%"  v-model="item.filterConditionType"  size="small" >
                                                <el-option v-for="item in monitoringValueList" 
                                                :key="item.value" 
                                                :value="item.value" 
                                                :label="item.label">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="2" style="margin-right:10px;">
                                        <el-form-item  class="filterConditionValue" :prop="'iotDataList.'+index+'.filterConditionValue'" :rules="conditionsFormRules.filterConditionValue">
                                            <el-input
                                                size="small"
                                                v-model="item.filterConditionValue"
                                                maxlength="15"
                                                autocomplete="off"
                                                style="width:100%"
                                            ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="4" style="margin-right:10px;width:17.6%;">
                                        <el-form-item label="隐藏指标：" class="filteredMonitorNumber"  :prop="'iotDataList.'+index+'.filteredMonitorNumber'" :rules="conditionsFormRules.filteredMonitorNumber">
                                            <el-select style="width:50%"  v-model="item.filteredMonitorNumber"   size="small" >
                                                <el-option v-for="item in ruleContentSelect2" 
                                                :key="item.value" 
                                                :value="item.value" 
                                                :label="item.label">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="5" style="margin-right:10px;width:21.8%;">  
                                        <el-form-item label="条件状态：" :prop="'iotDataList.'+index+'.status'" :rules="conditionsFormRules.status">
                                            <el-switch
                                            class="tablescope"
                                            v-model="item.status"
                                            :active-value="true"
                                            :inactive-value="false"
                                            active-color="#fe000c"
                                            active-text="开"
                                            inactive-text="关"
                                            inactive-color="#bdbdbd"/>
                                        </el-form-item>
                                    </el-col>
                                    <!-- 删除按钮 -->
                                    <el-col :span="1" >
                                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                                            <el-button @click="delConditions(index)" style='border:none;background:none;padding:0px;margin-top:4px;'>
                                                <i class="el-icon-remove-outline"  style='font-size:20px;'></i>
                                            </el-button>
                                        </el-tooltip>
                                    </el-col>
                                </el-row>
                            </div>
                            <div>
                                <el-tooltip class="item" effect="dark" content="添加条件" placement="top">
                                    <el-button  @click="addConditions" style='cursor:pointer;width:83%;color:#fe000c;border:1px dashed #fe000c;height:40px;padding:0px;margin-top:10px;margin-left:20px;font-size:26px'>
                                        +
                                    </el-button>
                                </el-tooltip> 
                        </div>
                        </el-form>
                        <div slot="footer" class="dialog-footer" style="text-align:center;position:absolute;bottom:30px;width:100%;">
                            <el-button  type="danger" plain @click="handleEditCancel" size="small">取消</el-button>
                            <el-button style="margin-top: 12px;"  type="danger" @click="handleEditSave('addCondition')" size="small">保存</el-button>
                        </div>
                    </div>
                </el-dialog>
                <!-- 报警规则-推送策略-内容定义 弹框     界面   结束-->
                <!-- 取消 - 离开确认 弹框 -->
                <el-dialog
                    :visible.sync="dialogEditCancelVisible"
                    :show-close="false"
                    width="500px"
                    :close-on-click-modal="false"
                    >
                    <div style="text-indent:2em;line-height:30px;text-align:center">确认离开本页面吗？如果离开则所做的设置会丢失</div>
                    <div slot="footer" class="dialog-footer" style="text-align:center;">
                        <el-button type="danger" plain @click="handleEditBack" size="small">返回</el-button>
                        <el-button type="danger" @click="handleEditLeave('addCondition')" size="small">离开</el-button>
                    </div>
                </el-dialog>
            </div>
            <!-- 指标过滤  结束 -->

            <!--  报警规则-->
            <div class="tableBg">
                <div style="line-height:40px;position:relative;padding:10px 0">
                    <span style="display:inline-block;width:2px;height:16px;background:#fe000c;position:absolute;top:22px;left:-20px;"></span>
                    报警规则
                    <el-button type="danger"  size="small" plain icon="el-icon-edit-outline"  style="float:right;margin-top:6px;"  @click="handleNewRules()">新建规则</el-button>
                </div>
                <!-- 表格 -->
                <el-table
                ref="accountTable"
                :key="key"
                row-key="id"
                :data="alarmRuleTableData"
                tooltip-effect="dark"
                style="width: 100%"
                :header-cell-style="{background:'#f7f7f7'}"
                v-loading="loading"
                border
                >
                <el-table-column
                type="index"
                :index="indexMethodAlarmRule"
                label="序号"
                width="50">
                </el-table-column>
                <el-table-column prop="alarmName" label="规则名称" min-width="10%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="alarmRuleDesc" label="规则内容" min-width="20%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="sendInterval" label="报警发送间隔" min-width="10%" ></el-table-column>
                <el-table-column prop="sendMaxTimes" label="最大发送次数" min-width="10%" ></el-table-column>
                <el-table-column label="操作" min-width="8%" align="center">
                <i class="el-icon-share"></i>
                <template slot-scope="scope">
                <el-link
                    @click="handleEdit(scope.row)"
                    type="danger"
                    style="margin-right:10px;color:#fe000c;"
                >编辑</el-link>
                <em style="color:#ccc">|</em>
                <el-link
                    type="danger"
                    @click="handleDelete(scope.row)"
                    style="margin-left:10px;color:#fe000c;"
                >删除</el-link>
                </template>
                </el-table-column>
                </el-table>
                <el-pagination
                background
                @size-change="handleSizeChangeAlarmRule"
                @current-change="handleCurrentChangeAlarmRule"
                :current-page="pagenationAlarmRule.current"
                :page-size="pagenationAlarmRule.size"
                :page-sizes="[5,10,20,30,50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalNumberAlarmRule"
                style="float: right;display:flex; margin-top: 10px"
                ></el-pagination>
                <!-- 报警规则 - 删除 弹框 -->
                <el-dialog
                    title='删除'
                    :visible.sync="dialogDeleteVisible"
                    :show-close="false"
                    width="500px"
                    class="dialog-unbundling"
                    :close-on-click-modal="false"
                    >
                    <div style="text-indent:2em;line-height:30px;"><i class="el-icon-warning-outline" style="font-size:24px;color:red;margin-right:5px;margin-top:-2px;vertical-align:middle"></i>是否确认删除此条报警规则？</div>
                    <div slot="footer" class="dialog-footer" style="text-align:center;">
                        <el-button type="danger" plain @click="handleDeleteCancle()" size="small">取消</el-button>
                        <el-button type="danger" @click="handleDeleteSure()" size="small">确定</el-button>
                    </div>
                </el-dialog>
                <!-- 报警规则-推送策略-内容定义 弹框  界面 -->
                <el-dialog  :visible.sync="dialogAlarmRulesVisible" class="sendOfferVisibleDialog" @close="handleCloseSendOffer" style="min-height:400px"
                    :show-close="false"
                    :close-on-click-modal="false">
                    <el-steps :active="activeStep" finish-status="success" align-center >
                        <el-step title="报警规则"></el-step>
                        <el-step title="推送策略"></el-step>
                        <el-step title="生效确认"></el-step>
                    </el-steps>
                    <!-- 填写报警规则 -->
                    <div v-show="activeStep === 1" style="margin-top:24px;" class="candidatesFirstFormDialog">
                        <el-form :model="alarmRulesForm"  ref="alarmRulesForm" :rules="alarmRulesFormRules" label-width="100px" label-position="right" style='margin-left:60px;margin-bottom:55px'>
                            <el-form-item label="规则名称："  prop="alarmName">
                                <el-input v-model="alarmRulesForm.alarmName" clearable placeholder="请输入规则名称" size="small" style="width: 215px;"></el-input>
                            </el-form-item>
                            <div v-for="(item,index) in list" :key="index">
                                <el-form-item>
                                    <span slot="label">   
          
                                    <span style="color:#F56C6C" v-if="index==0">* </span>{{index== 0 ? '规则内容：' : '且：'}} 
                                        <!-- <br>  
                                        <el-tooltip class="item" effect="dark" content="添加指标" placement="bottom">
                                            <el-button  @click="add" style='cursor:pointer;border:none;background:none;padding:0px;margin-top:12px;margin-right:9px' v-if="index==list.length-1 && index<5">
                                                <i class="el-icon-circle-plus-outline" style='font-size:20px;color:#fe000c'></i>
                                            </el-button>
                                        </el-tooltip>                            -->
                                    </span>
                                    <el-row>
                                        <el-col :span="8">
                                            <el-select v-model="item.Select" @change="selectRules($event,index)" placeholder="--请选择指标--"  size="small" >
                                                <el-option v-for="item in ruleContentSelect" 
                                                :key="item.value" 
                                                :value="item.value" 
                                                :disabled="item.disabled"
                                                :label="item.label">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="13" v-if="ischange">
                                            <!-- <el-checkbox-group  v-model="item.Checkbox"> -->
                                                <div v-if="!item.flag">
                                                    <el-checkbox  :checked="item.dangerMaxStatus" @change="handleCheckedAlarmRule($event,item,'dangerMax')" :disabled="!item.SelectRow.dangerMaxStatus">危险上限</el-checkbox>
                                                    <el-checkbox  :checked="item.alertMaxStatus"  @change="handleCheckedAlarmRule($event,item,'alertMax')" :disabled="!item.SelectRow.alertMaxStatus">警戒上限</el-checkbox>
                                                    <el-checkbox  :checked="item.alertMinStatus" @change="handleCheckedAlarmRule($event,item,'alertMin')" :disabled="!item.SelectRow.alertMinStatus">警戒下限</el-checkbox>
                                                    <el-checkbox  :checked="item.dangerMinStatus" @change="handleCheckedAlarmRule($event,item,'dangerMin')" :disabled="!item.SelectRow.dangerMinStatus">危险下限</el-checkbox>
                                                </div>
                                                <div v-if="!item.SelectRow.dangerMaxStatus && !item.SelectRow.alertMaxStatus && !item.SelectRow.alertMinStatus && !item.SelectRow.dangerMinStatus && item.Select" style="color:red">此指标没有任何阈值，只有设置的才可以添加到报警规则作为条件</div>
                                            <!-- </el-checkbox-group> -->
                                                <div v-if="item.flag" style="color:red">此规则内容状态已经禁用，请重新选择其他规则内容</div>
                                        </el-col>
                                        <!-- 如果是第一条 -->
                                        <el-col :span="1" v-if="index== 0" style="margin-top:1px;">
                                            <el-tooltip content="本条指标被勾选的子项之间为“或”关系，当监测值达到其中一个，视为满足该条规则。" placement="bottom" effect="light">
                                                <img src="../../assets/questionMark.png" alt="" >
                                            </el-tooltip>
                                            <!-- <span title="本条指标被勾选的子项之间为“或”关系，当监测值达到其中一个，视为满足该条规则。">
                                                <img src="../../assets/questionMark.png" alt="" >
                                            </span> -->
                                        </el-col>
                                        <!-- <el-col :span="2" >
                                            <el-button  @click="add" style='border:none;background:none;padding:0px;margin-top:4px;' >
                                                <i class="el-icon-circle-plus-outline" title='添加' style='font-size:20px;'></i>
                                            </el-button>
                                        </el-col> -->
                                        <!-- 非第一条数据 -->
                                        <el-col :span="3" v-if="index!= 0">
                                            <el-button @click="del(index)" style='border:none;background:none;padding:0px;margin-top:4px;'>
                                                <i class="el-icon-remove-outline" title='删除' style='font-size:20px;'></i>
                                            </el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                            </div>
                            <div>
                                <el-tooltip class="item" effect="dark" content="添加指标" placement="top">
                                    <el-button  @click="add" style='cursor:pointer;width:83%;color:#fe000c;border:1px dashed #fe000c;height:40px;padding:0px;margin-top:10px;margin-left:20px;font-size:26px'>
                                        <!-- <i class="el-icon-circle-plus-outline" style='font-size:20px;color:#fe000c'></i> -->
                                        +
                                    </el-button>
                                </el-tooltip> 
                        </div>
                        </el-form>
                        <div slot="footer" class="dialog-footer" style="text-align:center;position:absolute;bottom:30px;width:100%;">
                            <el-button  type="danger" plain @click="handleCancel" size="small">取消</el-button>
                            <el-button style="margin-top: 12px;"  type="danger" @click="next" size="small">下一步</el-button>
                        </div>
                    </div>
                    <!-- 推送策略 -->
                    <div v-show="activeStep === 2">
                        <el-form :model="pushStrategyForm" :rules="candidatesSecondFormRules" ref="pushStrategyForm" label-width="120px" label-position="left" style='margin-top:20px;margin-left:60px'>
                            <el-form-item label="报警发送间隔："  prop="sendInterval">
                                <el-select v-model="pushStrategyForm.sendInterval" @change="sendIntervalChange" placeholder="--请选择--" clearable  size="small" >
                                    <el-option v-for="item in sendIntervallist" 
                                    :key="item.value" 
                                    :value="item.value" 
                                    :label="item.label">
                                    </el-option>
                                </el-select>
                                <el-tooltip content="指报警发生后如果未恢复正常，间隔多久重复发送一次报警通知。" placement="bottom" effect="light" style="display:inline-block;margin:0px 0 0 10px;position:relative;top:3px;">
                                    <img src="../../assets/questionMark.png" alt="" >
                                </el-tooltip>
                                <!-- <div title="指报警发生后如果未恢复正常，间隔多久重复发送一次报警通知。" style="display:inline-block;margin:0px 0 0 10px;position:relative;top:3px;">
                                    <img src="../../assets/questionMark.png" alt="" >
                                </div> -->
                            </el-form-item>
                            <el-form-item label="最大发送次数："  prop="maxNum">
                                <el-select v-model="pushStrategyForm.maxNum" @change="maxNumChange" placeholder="--请选择--" clearable  size="small" >
                                    <el-option v-for="item in sendMaxTimesList" 
                                    :key="item.value" 
                                    :value="item.value" 
                                    :label="item.label">
                                    </el-option>
                                </el-select>
                                <el-tooltip content="指报警发生后如果未恢复正常，间隔重复发送报警通知的最大发送次数。" placement="bottom" effect="light" style="display:inline-block;margin:0px 0 0 10px;position:relative;top:3px;">
                                    <img src="../../assets/questionMark.png" alt="" >
                                </el-tooltip>
                                <!-- <div title="指报警发生后如果未恢复正常，间隔重复发送报警通知的最大发送次数。" style="display:inline-block;margin:0px 0 0 10px;position:relative;top:3px;">
                                    <img src="../../assets/questionMark.png" alt="" >
                                </div> -->
                            </el-form-item>
                            <el-form-item label="消息推送内容：" prop="messageContent" style="margin-bottom:10px;">
                                <el-form-item style="margin-bottom:0px;width:500px;" >
                                    <el-input
                                    type="textarea"
                                    :rows="3"
                                    maxlength="70"
                                    show-word-limit
                                    placeholder="请输入内容"
                                    v-model="pushStrategyForm.messageContent">
                                    </el-input>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="" prop="" style="margin-bottom:10px;">
                                <el-form-item style="margin-top:10px;width:500px;" class="line-h">
                                【美孚数智服务平台】 {{deviceInfo.deviceName}}-{{lubricationDetail.lubricationPointName}}的油品质量有异常，告警内容:{{pushStrategyForm.messageContent}}，已触发第/次报警，请前往美孚数智服务平台小程序进行查看
                                </el-form-item>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer" style="text-align:center;">
                            <el-button type="danger" plain @click="handleCancel" size="small">取消</el-button>
                            <el-button style="margin-top: 12px;"  type="danger" plain @click="prev" size="small">上一步</el-button>
                            <el-button style="margin-top: 12px;"  type="danger" @click="nextSecond" size="small">下一步</el-button>
                        </div>
                    </div>
                    <!-- 内容定义 -->
                    <div v-show="activeStep === 3">
                        <div    style="margin-top:60px;">
                            <div style="font-size:13px;text-align:center">本条报警规则将在提交后生效，在报警触发后，设备所属公司的管理员和消息订阅人将收到配置的消息内容短信。<br><br><br>
    <span style="font-weight:900">确认提交此条规则吗？</span></div>
                        </div>
                        <div slot="footer" class="dialog-footer" style="text-align:center;position:absolute;bottom:30px;width:100%;">
                            <el-button type="danger" plain @click="handleCancel" size="small">取消</el-button>
                            <el-button style="margin-top: 12px;"  type="danger" plain  @click="prev" size="small">上一步</el-button>
                            <el-button @click="handleSend"  type="danger" size="small">提交</el-button>
                        </div>
                    </div>
                </el-dialog>
                <!-- 报警规则-推送策略-内容定义 弹框     界面   结束-->
                <!-- 取消 - 离开确认 弹框 -->
                <el-dialog
                    :visible.sync="dialogCancelVisible"
                    :show-close="false"
                    width="500px"
                    :close-on-click-modal="false"
                    >
                    <div style="text-indent:2em;line-height:30px;text-align:center">确认离开本页面吗？如果离开则所做的设置会丢失</div>
                    <div slot="footer" class="dialog-footer" style="text-align:center;">
                        <el-button type="danger" plain @click="handleBack()" size="small">返回</el-button>
                        <el-button type="danger" @click="handleLeave()" size="small">离开</el-button>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { baseRemoteOauth2 } from "@/api/api";
export default {
    data() {
        return {
            ischange:true,
            loading: false, //是否加载
            sensorListLoading:false,
            monitorLoading:false,
            mainminheight: `height:${document.documentElement.clientHeight - 130}px`,
            defaultImg: require("../../assets/lp-none.png"),   // 润换点默认图片
            lubricationPointNumber:'',  //润滑点编码
            lubricationDetail:{},  // 润滑点详情信息 
            deviceInfo:{},//设备信息
            lubricationPointPicPath:'',  // 润滑点 图片
            deviceNumber:'',  // 设备编号
            isEditRule:'',//新增规则还是编辑规则
            dialogUnbundlingVisible:false,  // 解除绑定弹框提示设置不可见
            dialogEditCancelVisible:false,   // 取消 - 离开确认 弹框设置不可见
            dialogDeleteVisible:false,   // 报警规则 - 删除 - 弹框设置不可见
            dialogAlarmRulesVisible:false, // 报警规则弹框 设置不可见
            dialogEditRulesVisible:false, // 编辑条件弹框 设置不可见
            dialogCancelVisible:false,   // 取消弹框是否展示
            status:'',  // 判断是否存在新被绑定的传感器，在devicename列名称后出现“新”标识
            sensorListTableData:[],  // 传感器 表格数据
            sensorIotId:'',  // 传感器 某一行的 iotId
            monitorTableData:[],  // 检测指标阈值 表格数据
            setContent:{},  // 设置的 弹框内容
            identifier:'',   // 点击设置需要的行 检测指标
            iotId:'',  // 点击设置需要的行 设备（传感器）编号
            alarmRuleTableData:[], //报警规则 表格数据
            indicatorsFilteList:[], //指标过滤 表格数据
            monitoringValueList:[],  // 检测值所在数组
            pagenationIndicatorsFilte: {  // 报警规则 分页 信息
                current: 1,
                size: 5,
            },
            totalNumberIndicatorsFilte: 0, //总条数
            pagenationAlarmRule: {  // 报警规则 分页 信息
                current: 1,
                size: 10,
            },
            totalNumberAlarmRule: 0, //总条数
            pagenationMonitor: {   // 指标阈值分页信息
                current: 1,
                size: 5,
            },
            totalNumbeMonitor: 0, //总条数
            pagenationSensor: { // 传感器表格分页
                current: 1,
                size: 5,
            },
            totalNumbeSensor: 0, //总条数
            conditionsRulesForm:{
                iotDataList:[
                    {
                        monitorNumber:'',  // 指标
                        filterConditionType:'', //检测值
                        filterConditionValue:'',  // 隐藏指标
                        lubricationPointNumber:'',   // 润滑点编号
                        status:true  // 状态
                    }
                ],
            },  // 过滤条件表单
            deleteList:[],
            alarmRuleId:'',  // 获取 删除操作  报警规则某一行的id
            alarmRuleNumber:'',//报警规则编码
            // 报警规则表单
            alarmRulesForm:{
                "alarmName":'',
                "rulesContentProp":'',
                dynamicItem: []
            }, 
            // 推送策略表单
            pushStrategyForm:{
                "sendInterval":'',
                "maxNum":'',
                "messageContent":''
            }, 
            sendIntervallist:[  // 发送间隔
                {
                    value:'30',
                    label:'30分钟'
                },
                {
                    value:'60',
                    label:'1小时'
                },
                {
                    value:'180',
                    label:'3小时'
                },
                {
                    value:'540',
                    label:'9小时'
                },
                {
                    value:'1440',
                    label:'24小时'
                }
            ],
            sendMaxTimesList:[ // 最大发送数
                {
                    value:'5',
                    label:'5'
                },
                {
                    value:'10',
                    label:'10'
                },
                {
                    value:'30',
                    label:'30'
                },
                {
                    value:'50',
                    label:'50'
                },
                {
                    value:'100',
                    label:'100'
                }
            ],
            ruleContentSelect:[],
            ruleContentSelect2:[],
            checkList:[],
            list: [
                {
                    Select: '',
                    SelectRow:{},
                    dangerMaxStatus:false,
                    alertMaxStatus:false,
                    alertMinStatus:false,
                    dangerMinStatus:false
                }
            ],
            conditionsFormRules:{
                monitorNumber:[
                    {required: true,message:'请选择指标',trigger:'change'}
                ],
                filterConditionType:[
                    {required: true,message:'请选择检测值',trigger:'change'}
                ],
                filterConditionValue:[
                    {required: true,message:'请输入检测值',trigger:'blur'},
                    {pattern:/^-?[1-9]\d{0,14}(\.\d{1,3})?$|^0(\.\d{1,3})?$/,message: '最多可输入15位数值', trigger: 'change' }
                ],
                filteredMonitorNumber:[
                    {required: true,message:'请选择隐藏指标',trigger:'change'}
                ],
                status:[
                    {required: true}
                ],
            },
            alarmRulesFormRules:{
                alarmName:[
                    {required: true,message:'请输入规则名称',trigger:'blur'},
                    {pattern:/^.{1,15}$/,message: '最多输入15个字符', trigger: 'change' }
                ],
                rulesContentProp:[
                    {required: true,message:'请选择规则内容',trigger:'change'}
                ]
            },
            candidatesSecondFormRules:{
                sendInterval:[
                    {required: true,message: '请选择发送间隔', trigger: 'change'}
                ],
                maxNum:[
                    {required: true,message: '请选择最大发送数', trigger: 'change'}
                ],
                messageContent:[
                    {required: true,message: '请输入消息推送内容', trigger: 'blur'},
                    {pattern:/^.{1,50}$/,message: '最多输入50个字符', trigger: 'change' }
                ],
            },
            rulesFormRules:{
                dangerousUpper:[
                    {pattern:/^[1-9]\d{0,4}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,message: '最多输入五位整数和两位小数', trigger: 'blur'}
                ],
                checkedAlert:[
                    {pattern:/^[1-9]\d{0,4}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,message: '最多输入五位整数和两位小数', trigger: 'blur'}
                ],
                alertThreshold:[
                    {pattern:/^[1-9]\d{0,4}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,message: '最多输入五位整数和两位小数', trigger: 'blur'}
                ],
                dangerousThreshold:[
                    {pattern:/^[1-9]\d{0,4}(\.\d{1,2})?$|^0(\.\d{1,2})?$/,message: '最多输入五位整数和两位小数', trigger: 'blur'}
                ]
            },
            sendSuccess:false,
            activeStep:1,
            dialogSetVisible:false,  // 设置弹框是否可见
            rulesForm:{},
            rulesContentOne:{},
            MonitorRuleUpdateDto:{},
            monitorRuleUpdateListSelect:[],  // 新建规则 规则内容数组
            monitorRuleContent:{
                alarmMsg:"",
                alarmName:"",
                lubricationPointNumber:"",
                monitorRuleUpdateList:[],  // 报警规则
                sendInterval:"60",
                sendMaxTimes:"5"
            },  // 报警规则 内容
        };
    },

    components: {},

    computed: {},
    created(){
        this.getParams()
        this.$_queryLubricationPoint();    // 获取润滑点详情
        this.getMonitorRuleUpdateList()  
    },
    watch: {
        '$route': 'getParams'
    },
    mounted() {
        this.$_queryMonitorRuleList(); //  获取指标阈值列表
        this.$_querySensorList();   // 获取传感器列表
        this.$_queryAlarmRuleList();   // 获取报警规则列表
        this.$_queryIndicatorsFilteList();  // 获取指标过滤列表
        this.$_queryOilRecord() ;  // 获取用油记录
    },
    methods: {
        indexMethodSensorList(index){
            return this.pagenationSensor.size*(this.pagenationSensor.current -1)+index+1
        },
        indexMethod(index){
            return this.pagenationMonitor.size*(this.pagenationMonitor.current -1)+index+1
        },
        indexMethodAlarmRule(index){
            return this.pagenationAlarmRule.size*(this.pagenationAlarmRule.current -1)+index+1
        },
        moveRow(row){
            let params = {
                lubricationPointNumber:row.lubricationPointNumber, 
                monitorNumber:row.monitorNumber, 
                upOrDown:1 
            };
            if(row.moveDown) {
                params.upOrDown = 2
            }
            this.requestMethodPost("/iot/device/model/monitorRule/updateMonitorRuleUpOrDown", params)
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                     this.$message({
                            message: `移动成功`,
                            type: "success"
                        });
                this.$_queryMonitorRuleList('noRefresh');
                 this.getMonitorRuleUpdateList()
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning"
                    });
                }
                }).catch(res => {});
        },
        // 获取监测指标下拉框
        getMonitorRuleUpdateList(){
            let params = {lubricationPointNumber:this.lubricationPointNumber };
            this.requestMethodGet("/iot/device/alarmRule/getMonitorRule", params)
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    this.monitorRuleUpdateListSelect = res.data;
                    this.ruleContentSelect = this.monitorRuleUpdateListSelect.map(item => {
                        return { value: item.monitorNumber, label: item.name };
                    });
                    this.ruleContentSelect2 = this.ruleContentSelect;
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning"
                    });
                }
                }).catch(res => {});
        },
        onBack() {
            this.$router.push({
                path: "/IotManagement",
            });
            // history.back()
        },
        onResize() {
            this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
        },
        // 获取传感器 列表
        $_querySensorList() {
        this.sensorListLoading = true;
        this.status = sessionStorage.getItem('lubricationPointStatus');
        let params = {...this.pagenationSensor,lubricationPointNumber:this.lubricationPointNumber};
        this.sensorListTableData = []
        this.requestMethodGet("/iot/device/iotRel/getLubricationPointIotDevice", params)
            .then(res => {
            this.sensorListLoading = false;
            res = res.data;
            if (res.code == 1000) {
                this.sensorListTableData = res.data.list;
                this.totalNumbeSensor = res.data.totalCount;
                sessionStorage.removeItem('lubricationPointStatus');
            } else {
                this.$message({
                message: res.msg,
                type: "warning"
                });
            }
            })
            .catch(res => {
            this.sensorListLoading = false;
            });
        },
        // 获取润滑点详情
        $_queryLubricationPoint() {
            this.requestMethodGet("/web/common/lubricationPoint/queryLubricationPoint", {lubricationPointNumber:this.lubricationPointNumber})
            .then(res => {
            res = res.data;
            if (res.code == 1000) {
                this.lubricationDetail.lubricationPointName   = res.data.lubricationPointName ;  // 润滑点名称
                this.lubricationDetail.lubricationPointType  = res.data.lubricationPointType;  // 润滑点设备类型
                this.lubricationDetail.oilChangePeriod   = res.data.oilChangePeriod;  // 换油周期
                this.deviceNumber = res.data.deviceNumber  ;  // 换油周期
                this.lubricationPointPicPath = res.data.lubricationPointPicPath ;   // 润滑点图片
                this.$_queryDeviceInfo();  // 获取设备详情
            } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
            }
            })
            .catch(res => {
            });
        },
        // 获取用油记录
        $_queryOilRecord() {
            this.requestMethodGet("/web/common/device/queryOilRecordListWithLpNum", {lubricationPointNumber:this.lubricationPointNumber})
            .then(res => {
            res = res.data;
            if (res.code == 1000) {
                if(res.data!=[]) {
                    this.lubricationDetail.oilName = res.data[0].oilName;  // 油品名称
                    this.lubricationDetail.oilDate = res.data[0].oilDate;  // 上次用油日期
                }
            } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
            }
            })
            .catch(res => {
            });
        },
        // 获取设备详情
        $_queryDeviceInfo() {
            this.requestMethodGet("/web/common/device/queryDeviceInfo", {deviceNumber:this.deviceNumber})
            .then(res => {
            res = res.data;
            if (res.code == 1000) {
                this.deviceInfo = res.data
            }
            })
            .catch(res => {
            });
        },
        // 获取指标阈值列表
        $_queryMonitorRuleList(val) {
            if(!val) {
                this.monitorLoading = true;
                this.monitorTableData = [] 
            }
        let params = {...this.pagenationMonitor,lubricationPointNumber:this.lubricationPointNumber };
        this.requestMethodGet("/iot/device/model/monitorRule/getMonitorRuleBy", params)
            .then(res => {
            this.monitorLoading = false;
            res = res.data;
            if (res.code == 1000) {
                this.monitorTableData = res.data.list;
                let firstN = this.monitorTableData.findIndex(item => {
                    return item.topFlag == 'N'
                })
                this.monitorTableData.forEach((item,index) =>{
                    if(this.pagenationMonitor.current == 1) {
                        if(firstN == 0) {
                            if(index == 0){
                                item.moveDown = true
                            }else {
                                item.moveDown = false
                            }
                        }else {
                            if(index == firstN-1) {
                                item.moveDown = false
                            }else if(index == firstN){
                                item.moveDown = true
                            }else {
                                item.moveDown = false
                            }
                            if(index == 0 && firstN-1 != 0){
                                item.moveDown = true
                            }
                            if(index == 0 && firstN == 1) {
                                item.moveDown = 'hide'
                            }
                        }
                    }else {
                        if(firstN > 0) {
                            if(index == firstN) {
                              item.moveDown = true
                            }else {
                              item.moveDown = false
                            }
                        }else {
                            item.moveDown = false
                        }
                    }

                })
                this.totalNumbeMonitor = res.data.totalCount;
            } else {
                this.$message({
                message: res.msg,
                type: "warning"
                });
            }
            })
            .catch(res => {
            this.monitorLoading = false;
            });
        },
        // 获取 指标过滤 列表   
        $_queryIndicatorsFilteList() {
            this.loading = true;
            let params = {...this.pagenationIndicatorsFilte,lubricationPointNumber:this.lubricationPointNumber};
            this.indicatorsFilteList = []
            this.requestMethodGet("/iot/device/alarmRule/getMonitorFilterListByPage", params)
                .then(res => {
                this.loading = false;
                res = res.data;
                if (res.code == 1000) {
                    this.indicatorsFilteList = res.data.list;
                    
                    this.totalNumberIndicatorsFilte = res.data.totalCount;
                } else {
                    this.$message({
                    message: res.msg,
                    type: "warning"
                    });
                }
                })
                .catch(res => {
                this.loading = false;
                });
        },
        // 获取 报警规则 列表
        $_queryAlarmRuleList() {
        this.loading = true;
        let params = {...this.pagenationAlarmRule,lubricationPointNumber:this.lubricationPointNumber };
        this.alarmRuleTableData = []
        this.requestMethodGet("/iot/device/alarmRule/listByPage", params)
            .then(res => {
            this.loading = false;
            res = res.data;
            if (res.code == 1000) {
                this.alarmRuleTableData = res.data.list;
                this.totalNumberAlarmRule = res.data.totalCount;
            } else {
                this.$message({
                message: res.msg,
                type: "warning"
                });
            }
            })
            .catch(res => {
            this.loading = false;
            });
        },
        // 传感器的 page  change  事件
        handleCurrentSensorChange(page) {
            this.pagenationSensor.current = page;
            this.$_querySensorList();   // 获取传感器列表
        },
        // 传感器的 size change 事件
        handleSizeSensorChange(size) {
            this.pagenationSensor.size = size;
            this.pagenationSensor.current = 1;
            this.$_querySensorList();   // 获取传感器列表
        },
         // 指标阈值的 page change 事件
        handleCurrentChangeMonitor(page) {
            this.pagenationMonitor.current = page;
            this.$_queryMonitorRuleList();
        },
        // 指标阈值 size change 事件
        handleSizeChangeMonitor(size) {
            this.pagenationMonitor.size = size;
            this.pagenationMonitor.current = 1;
            this.$_queryMonitorRuleList();
        },
        // 报警规则 page change 事件
        handleCurrentChangeAlarmRule(page) {
            this.pagenationAlarmRule.current = page;
            this.$_queryAlarmRuleList();   // 获取报警规则列表
        },
        // 报警规则 size change 事件
        handleSizeChangeAlarmRule(size) {
            this.pagenationAlarmRule.size = size;
            this.pagenationAlarmRule.current = 1
            this.$_queryAlarmRuleList();   // 获取报警规则列表
        },
         // 指标过滤 page change 事件
        handleCurrentChangeIndicatorsFilte(page) {
            this.pagenationIndicatorsFilte.current = page;
            this.$_queryIndicatorsFilteList();   // 获取指标过滤列表
        },
        // 指标过滤 size change 事件
        handleSizeChangeIndicatorsFilte(size) {
            this.pagenationIndicatorsFilte.size = size;
            this.pagenationIndicatorsFilte.current = 1
            this.$_queryIndicatorsFilteList();   // 获取指标过滤列表
        },
        // 取到路由带过来的参数
        getParams() {
            this.lubricationPointNumber = this.$route.query.lubricationPointNumber  // 获取上个页面传过来的润滑点编码
        },
        // 传感器表格  解绑事件
        handleUnbundling(row) {
            this.dialogUnbundlingVisible = true;
            // 传感器 某一行的 iotId
            this.sensorIotId = row.iotId;
        },
        // 取消解绑
        handleCancle() {
            this.dialogUnbundlingVisible = false;
        },
        // 确定解绑
        handleSure() {
            let params = {
                iotId:this.sensorIotId,
                lubricationPointNumber:this.$route.query.lubricationPointNumber 
            };
            this.requestMethodPost("/iot/device/UnBundlingIotDevice",params).then(res => {
                if(res.data.code == 1000) {
                    this.dialogUnbundlingVisible = false;
                    this.$_querySensorList();   // 刷新传感器列表
                    this.$_queryMonitorRuleList('noRefresh');
                    this.$confirm('传感器与润滑点已解除绑定关系，您可前往“待绑定设备”进行重新绑定', '', {
                        showClose:false,
                        type: 'warning',
                        customClass:'unbinding-info',
                        closeOnClickModal:false,
                        confirmButtonText: '立即前往',
                        cancelButtonText: '留在此页'
                        })
                        .then(() => {
                            this.$router.push({
                                name: "IotManagement",
                                params: {
                                    activeName: 'second',
                                }
                            });
                        })
                        .catch(action => {
                            this.getMonitorRuleUpdateList()
                        });
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "warning"
                    });
                }
            }).catch(res => {
            });
        },
        handleEdit(row) {
            this.isEditRule = row.id
            this.alarmRuleNumber = row.alarmRuleNumber
            this.list = [
                {
                    Select: '',
                    SelectRow:{},
                    dangerMaxStatus:false,
                    alertMaxStatus:false,
                    alertMinStatus:false,
                    dangerMinStatus:false
                }
            ],
            // 报警规则表单
            this.alarmRulesForm = {
                "alarmName":row.alarmName
            }
            // 推送策略表单
            this.pushStrategyForm = {
                "sendInterval":row.sendInterval,
                "maxNum":row.sendMaxTimes,
                "messageContent":row.alarmMsg
            }
            this.dialogAlarmRulesVisible = true
            this.activeStep = 1;
            this.requestMethodGet("/iot/device/alarmRule/getById", {id:row.id}).then(res => {
                res = res.data;
                if (res.code == 1000) {
                    this.ischange = false
                    this.$nextTick(()=> {
                        this.list = res.data.monitorRuleList.map(item => {
                            let flag = false
                            // 获取选中的 某一项的对象
                            for(let res of this.monitorRuleUpdateListSelect) {
                                if(res.monitorNumber == item.monitorNumber ) {
                                    item.SelectRow= res
                                    flag = true
                                }
                            };
                            if(!flag) {
                                return {
                                    Select:'',
                                    SelectRow:{},
                                    flag:true,
                                    dangerMaxStatus:false,
                                    alertMaxStatus:false,
                                    alertMinStatus:false,
                                    dangerMinStatus:false
                                }
                            }
                            return {
                                Select:item.monitorNumber,
                                SelectRow:item.SelectRow,
                                dangerMax:item.SelectRow.dangerMax || '',
                                alertMax:item.SelectRow.alertMax || '',
                                alertMin:item.SelectRow.alertMin || '',
                                dangerMin:item.SelectRow.dangerMin || '',
                                dangerMaxStatus:item.dangerMaxStatus,
                                alertMaxStatus:item.alertMaxStatus,
                                alertMinStatus:item.alertMinStatus,
                                dangerMinStatus:item.dangerMinStatus
                            }
                        })
                        this.ruleContentSelect.forEach(item => {
                            item.disabled = false
                            this.list.forEach(res => {
                                if(res.Select == item.value ) {
                                    item.disabled=true
                                }
                            })
                        })
                        this.ischange = true
                    })
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning"
                    });
                }
                })
                .catch(res => {
            });
        },
        goCompanyDetail() {
            this.$router.replace({
            //核心语句
            path: "/CustomerProfile/CustomerProfileDetail", //跳转的路径
            query: {
                companyNumber: this.deviceInfo.customerNumber
            }
            })
        },
        // 点击删除按钮
        handleDelete(row) {
            this.dialogDeleteVisible= true;
            this.alarmRuleId = row.id;
            this.alarmRuleNumber = row.alarmRuleNumber
        },
        // 删除 弹框 点击 取消
        handleDeleteCancle() {
            this.dialogDeleteVisible= false;
        },
        // 删除 弹框 点击 确定
        handleDeleteSure() {
            let params = {id:this.alarmRuleId,alarmRuleNumber:this.alarmRuleNumber };
            this.requestMethodGet("/iot/device/alarmRule/delete", params)
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    this.dialogDeleteVisible= false;
                     this.$message({
                        message: '删除成功',
                        type: "success"
                    });
                    this.$_queryAlarmRuleList();   // 获取报警规则列表
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning"
                    });
                }
                })
                .catch(res => {
            });
        },
        // 获取弹框的条件列表
        getConditionList() {
            // 调取已经存在的条件列表
            let params = {...this.pagenationIndicatorsFilte,lubricationPointNumber:this.lubricationPointNumber};
            this.requestMethodGet("/iot/device/alarmRule/getMonitorFilterListByPage", params)
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    this.conditionsRulesForm.iotDataList  = res.data.list;
                } else {
                    this.$message({
                    message: res.msg,
                    type: "warning"
                    });
                }
                })
                .catch(res => {
                });
        },
        // 点击编辑条件
        handleEditRules() {
            this.dialogEditRulesVisible = true;
            this.deleteList = [];
            this.getConditionList();
            // 调取获得检测值大小的接口
            this.requestMethodGet("/web/common/dic/drops", {name:"iot_monitor_filter_type"})
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    let optionData = res.data
                    optionData = optionData.map(item =>{return {'value':parseInt(item.code),"label":item.name}})
                    this.monitoringValueList = optionData
                } else {
                    this.$message({
                        message: res.msg,
                        type: "warning"
                    });
                }
                })
                .catch(res => {
            });
        },
        //条件设立中添加一行
        addConditions () {
            if(this.conditionsRulesForm.iotDataList.length<=10) {
                this.conditionsRulesForm.iotDataList.push({
                    monitorNumber:'',  // 指标
                    filterConditionType:'', //检测值类型
                    filterConditionValue:'',  // 检测值
                    lubricationPointNumber:'',   // 润滑点编号
                    filteredMonitorNumber:'',  // 隐藏指标
                    status:true  // 状态
                });
            } else {
                this.$message('最多可添加十项条件');
            }
        },
        // 条件设立中的删除一行
        delConditions(index) {
            this.$confirm('是否确认删除此条过滤规则？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.conditionsRulesForm.iotDataList[index].id) {
                    this.deleteList.push(this.conditionsRulesForm.iotDataList[index].id)
                }
                this.$nextTick(()=> {
                    this.conditionsRulesForm.iotDataList.splice(index, 1);
                })
            }).catch(res => {
            });
        },
        // 条件设立 弹框的保存
        handleEditSave(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.$confirm('是否确认提交过滤规则？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        if(this.conditionsRulesForm.iotDataList.length) {
                            this.conditionsRulesForm.iotDataList.map(item => {
                                    item.lubricationPointNumber = this.lubricationPointNumber
                                    delete item.createTime
                                    delete item.createUser
                                    delete item.delFlag
                                    delete item.iotId
                                    delete item.updateTime
                                    delete item.updateUser
                                    delete item.filteredMonitorName 
                                    delete item.filterContent
                                    delete item.monitorName 
                                    delete item.statusStr
                                    delete item.filterConditionTypeStr
                                })
                        }
                        let iotMonitorFilterAddOrUpdateDto={
                            dataList:this.conditionsRulesForm.iotDataList,
                            deleteIdList:this.deleteList
                        }
                        this.requestMethodPost("/iot/device/alarmRule/addOrUpdateIotMonitorFilterBatch",iotMonitorFilterAddOrUpdateDto).then(res => {
                            if(res.data.code == 1000) {
                                this.dialogEditRulesVisible = false;
                                this.$_queryIndicatorsFilteList();  // 获取指标过滤列表
                            }else {
                                this.$message({
                                    message: res.data.msg,
                                    type: "warning"
                                });
                            }
                        }).catch(res => {
                    });
                }).catch(() => {
                });
                }
            })
        },
        // 新建规则 弹框点击取消
        handleEditCancel() {
            this.dialogEditCancelVisible = true;
        },
        // 点击取消弹框的 返回按钮
        handleEditBack() {
            this.dialogEditCancelVisible = false;
        },
        // 点击取消弹框的  离开 按钮
        handleEditLeave(formName){
            this.dialogEditRulesVisible = false;
            this.dialogEditCancelVisible = false;
            this.$nextTick(() => {
                this.$refs[formName].resetFields();
            });
        },
        // 点击新建规则
        handleNewRules(index) {
            this.isEditRule = ''
            this.ischange = false
            // 报警规则表单
            this.alarmRulesForm = {
                "alarmName":''
            }
            // 推送策略表单
            this.pushStrategyForm = {
                "sendInterval":'',
                "maxNum":'',
                "messageContent":''
            }
            this.$nextTick(()=> {
                this.ischange = true
                this.list = [
                    {
                        Select: '',
                        SelectRow:{},
                        dangerMaxStatus:false,
                        alertMaxStatus:false,
                        alertMinStatus:false,
                        dangerMinStatus:false
                    }
                ],
                this.dialogAlarmRulesVisible = true
                this.activeStep = 1;
                this.ruleContentSelect.forEach(item => {
                    item.disabled = false
                })
            })
        },
        // 选择 规则内容 change 事件
        selectRules(val,index) {
            this.ischange = false
            this.ruleContentSelect.forEach(item => {
                item.disabled = false
                if(item.value == val) {
                    item.disabled=true
                }
                this.list.forEach(res => {
                    if(res.Select == item.value ) {
                        item.disabled=true
                    }
                })
            })
            // 获取选中的 某一项的对象
            for(let item of this.monitorRuleUpdateListSelect) {
                this.list.forEach(res => {
                    if(res.Select == item.monitorNumber ) {
                        res.SelectRow=item
                    }
                })
            };
            this.$nextTick(()=> {
                    this.list[index].dangerMaxStatus = false
                    this.list[index].alertMaxStatus = false
                    this.list[index].alertMinStatus = false
                    this.list[index].dangerMinStatus = false
                    delete this.list[index].flag
                    delete this.list[index].dangerMax
                    delete this.list[index].alertMax
                    delete this.list[index].alertMin
                    delete this.list[index].dangerMin
                    this.ischange = true
            })
        },
        // 规则内容后边的 checkbox 框变化
        handleCheckedAlarmRule(value,item,type) {
            item[type + 'Status'] = value
            if(value) {
                item[type] =  item.SelectRow[type]
            }else {
                delete item[type]
            }
    
        },
        // 上一步
        prev() {
            this.activeStep --;
        },
        // 下一步
        next() {
            this.$refs.alarmRulesForm.validate(valid => {
                if(valid){
                    if(!this.list[0].Select) {
                        this.$message.error('规则内容必填，请先选择规则内容');
                        return
                    }
                    let flag = false
                    this.$refs.pushStrategyForm.clearValidate()
                    let isNextFlag = false
                    let MonitorRuleUpdateDto = this.list.map(item => {
                        if(item.SelectRow.monitorNumber) {
                            if(!item.SelectRow.dangerMaxStatus && !item.SelectRow.alertMaxStatus && !item.SelectRow.alertMinStatus && !item.SelectRow.dangerMinStatus) {
                                isNextFlag = true
                            }
                            return {
                                dangerMax:item.dangerMax || '',
                                dangerMaxStatus:item.dangerMaxStatus || false,
                                alertMax:item.alertMax || '',
                                alertMaxStatus:item.alertMaxStatus ||false,
                                alertMin:item.alertMin || '',
                                alertMinStatus:item.alertMinStatus || false,
                                dangerMin:item.dangerMin || '',
                                dangerMinStatus:item.dangerMinStatus || false,
                                identifier:item.SelectRow.identifier,
                                iotId:item.SelectRow.iotId,
                                name:item.SelectRow.name,
                                monitorNumber:item.SelectRow.monitorNumber
                            }
                        }else {
                            flag = true
                        }
                    })
                    if(flag) {
                        this.$message.error('请检查新增的规则内容是否为空');
                        return
                    }
                    if(isNextFlag) {
                        this.$message.error('存在指标没有任何阈值，请选择其他指标');
                        return
                    }
                    this.monitorRuleContent.alarmName = this.alarmRulesForm.alarmName;
                    this.monitorRuleContent.monitorRuleUpdateList=[...MonitorRuleUpdateDto];
                    this.activeStep++
                }
            })
        },
        //添加一行
        add () {
            if(this.list.length<=5) {
                this.list.push({
                    Select: '',
                    SelectRow:[]
                });
            } else {
                this.$message('最多可添加五项规则内容');
            }
        },
        
         //删除一行
        del (index) {
            this.ischange = false
            this.$nextTick(()=> {
                this.list.splice(index, 1);
                this.ischange = true
            })
             this.ruleContentSelect.forEach(item => {
                item.disabled = false
                this.list.forEach(res => {
                    if(res.Select == item.value ) {
                        item.disabled=true
                    }
                })
            })
            
        },
        // 发送间隔选择事件
        sendIntervalChange(val) {
            this.monitorRuleContent.sendInterval = val;
        },
        // 最大发送数  选择事件
        maxNumChange(val) {
            this.monitorRuleContent.sendMaxTimes = val;
        },
        // 下一步到内容定义
        nextSecond() {
            this.$refs.pushStrategyForm.validate(valid => {
                if(valid){
                    this.monitorRuleContent.alarmMsg = this.pushStrategyForm.messageContent;
                    this.monitorRuleContent.lubricationPointNumber = this.lubricationPointNumber;
                    this.activeStep++
                }
            })
        },
        // 点击提交
        handleSend() {
            if(this.isEditRule) {
                this.monitorRuleContent.id = this.isEditRule
                this.monitorRuleContent.alarmRuleNumber = this.alarmRuleNumber
                this.requestMethodPost("/iot/device/alarmRule/edit",this.monitorRuleContent).then(res => {
                    if(res.data.code == 1000) {
                        this.dialogAlarmRulesVisible = false;
                        this.$message({
                            message: "编辑规则成功",
                            type: "success"
                        });
                        this.$_queryAlarmRuleList() 
                    }else {
                        this.$message({
                            message: res.data.msg,
                            type: "warning"
                        });
                    }
                }).catch(res => {
                });
            } else {
                this.requestMethodPost("/iot/device/alarmRule/add",this.monitorRuleContent).then(res => {
                    if(res.data.code == 1000) {
                        this.dialogAlarmRulesVisible = false;
                        this.pagenationAlarmRule.current = 1
                        this.$message({
                        message: "新建规则成功",
                        type: "success"
                        });
                        this.$_queryAlarmRuleList() 
                    }else {
                        this.$message({
                            message: res.data.msg,
                            type: "warning"
                        });
                    }
                }).catch(res => {
                });
            }

        },
        // 点击设置
        handleSet(row) {
            this.dialogSetVisible = true;
            this.setContent = row;
            this.rulesForm = this.setContent;
            this.iotId=this.setContent.iotId;
            this.identifier=this.setContent.identifier;
        },
        // 点击置顶 
        handleTop(row) {
            let params = {
                monitorNumber:row.monitorNumber,
                lubricationPointNumber:row.lubricationPointNumber
            }
            this.requestMethodPost("/iot/device/model/monitorRule/updateMonitorRuleToTop",params).then(res => {
                if(res.data.code == 1000) {
                    this.$message({
                        message: "置顶成功",
                        type: "success"
                    });
                    this.$_queryMonitorRuleList() 
                }else {
                    this.$message({
                        message: res.data.msg,
                        type: "warning"
                    });
                }
            }).catch(res => {
            });
        },
        // 取消置顶 
        handleDown(row) {
            let params = {
                monitorNumber:row.monitorNumber
            }
            this.requestMethodPost("/iot/device/model/monitorRule/updateMonitorRuleRemoveTop",params).then(res => {
                if(res.data.code == 1000) {
                    this.$message({
                        message: "取消置顶成功",
                        type: "success"
                    });
                    this.$_queryMonitorRuleList() 
                }else {
                    this.$message({
                        message: res.data.msg,
                        type: "warning"
                    });
                }
            }).catch(res => {
            });
        },
        // 设置 点击取消
        handleSetCancle() {
            this.dialogSetVisible = false;
             this.$_queryMonitorRuleList('noRefresh');
        },
        // 设置 点击提交
        handleSetSubmit() {
            let numArr = [];
            // 提交数据，检查“启用”状态对应项是否有值且满足危险上限>警戒上限>警戒下限>危险下限，未启用的数据项不需比对值大小
             // 判断危险上限是否选中，选中往数组里推危险上限的值
            if(this.rulesForm.dangerMaxStatus) {
                numArr.push(this.rulesForm.dangerMax)
            }
            // 判断警戒上限是否选中，选中往数组里推警戒上限的值
            if(this.rulesForm.alertMaxStatus) {
                numArr.push(this.rulesForm.alertMax)
            }
            // 判断警戒下限是否选中，选中往数组里推值
            if(this.rulesForm.alertMinStatus) { 
                numArr.push(this.rulesForm.alertMin)
            }
            // 判断危险下限是否选中，选中往数组里推值
            if(this.rulesForm.dangerMinStatus) {
                numArr.push(this.rulesForm.dangerMin)
            }
            // 判断数组中是否有空字符串
            if(numArr.includes('') || numArr.includes(null)) {
                this.$message.error('请检查“启用”状态对应项是否有值');
                return
            }
            // 将数组中的字符串转为数字
            let numArrNew = numArr.map(Number)
            // 判断数组中的值是否满足危险上限>警戒上限>警戒下限>危险下限
            let flag = false
            for(var i=0,m=numArrNew.length;i<m;i++){
                if(numArrNew[i+1]>=numArrNew[i]){
                    flag = true
                }
            }
            if(flag) {
                this.$message.error('请检查表单输入数值是否满足危险上限>警戒上限>警戒下限>危险下限');
                return
            }
            let params = {
                lubricationPointNumber:this.$route.query.lubricationPointNumber,
                alertMax :this.rulesForm.alertMax,
                alertMaxStatus :this.rulesForm.alertMaxStatus || false,
                alertMin : this.rulesForm.alertMin,
                alertMinStatus : this.rulesForm.alertMinStatus || false,
                dangerMax : this.rulesForm.dangerMax,
                dangerMaxStatus : this.rulesForm.dangerMaxStatus || false,
                dangerMin : this.rulesForm.dangerMin,
                dangerMinStatus : this.rulesForm.dangerMinStatus || false,
                monitorNumber:this.setContent.monitorNumber,
                iotId:this.setContent.iotId,
                identifier:this.setContent.identifier
            };
            this.requestMethodPost("/iot/device/model/monitorRule/updateMonitorRule",params).then(res => {
                if(res.data.code == 1000) {
                    this.dialogSetVisible = false;
                     this.$message({
                      message: "设置成功",
                      type: "success"
                    });
                    this.$_queryMonitorRuleList('noRefresh');
                    this.getMonitorRuleUpdateList()
                }else {
                     this.$message({
                        message: res.data.msg,
                        type: "warning"
                    });
                }
            }).catch(res => {
            });
        },
        // 新建规则 弹框点击取消
        handleCancel() {
            this.dialogCancelVisible = true;
        },
        // 点击取消弹框的 返回按钮
        handleBack() {
            this.dialogCancelVisible = false;
        },
        // 点击取消弹框的  离开 按钮
        handleLeave(){
            this.dialogAlarmRulesVisible = false;
            this.dialogCancelVisible = false;
        },
        // 状态改变
        changeSwitch(row) {
            let params = {
                lubricationPointNumber:this.$route.query.lubricationPointNumber,
                status:row.status,
                monitorNumber:this.setContent.monitorNumber,
                iotId:row.iotId,
                identifier:row.identifier
            };
            this.requestMethodPost("/iot/device/model/monitorRule/updateMonitorRule",params).then(res => {
                if(res.data.code == 1000) {
                    // console.log('提交成功')
                    this.$message({
                      message: "修改状态成功",
                      type: "success"
                    });
                    setTimeout(() => {
                        this.$_queryMonitorRuleList('noRefresh');
                    },10000)
                    this.getMonitorRuleUpdateList()
                }else {
                     this.$message({
                        message: res.data.msg,
                        type: "warning"
                    });
                }
            }).catch(res => {
            });
        },
        handleMonitor(){
            this.$router.push({
                path: "/IotManagement/MonitoringData",
                query: {
                    lubricationPointNumber: this.$route.query.lubricationPointNumber
                }
            });
        }
    },
};
</script>
<style lang='less'>
.wrapConfiguration {
    position: relative;
    padding:0 0px 20px;
    height: 100%;
    background: #f4f5f7;
    overflow: auto;
    .el-pagination__sizes {
        display: none !important;
    }
    .configTitle {
        background:#fff;
        padding:20px 20px;
    }
    .tableBg{
        background:#fff;
        padding: 0px 20px 60px;
    }
    .title {
        font-size:14px;
        line-height:50px;
    }
    .is-active .el-radio-button__inner:hover {
        color: #fff !important;
    }
    .el-form-item__label {
        font-size:13px;
    }
    .el-form-item__error {
        width:165px;
    }
    .filterConditionType .el-form-item__error {
        left:71px;
    }
    .monitorNumber .el-form-item__error {
        left:58px;
    }
    .filteredMonitorNumber .el-form-item__error {
        left:85px;
    }
    .el-step__head.is-success {
        color:#fe000c;
        border-color:#fe000c;
    }
    .el-step__title.is-success {
        color:#fe000c;
    }
    .el-checkbox {
        margin-right:14px;
    }
    .tablescope{
        .el-switch__label--left {
            position: relative;
            left: 45px;
            color: #fff;
            z-index: -1111;
        }
        .el-switch__core{
            width: 50px !important;
        }
        .el-switch__label--right {
            position: relative;
            right: 46px;
            color: #fff;
            z-index: -1111;
        }
        .el-switch__label--right.is-active {
            z-index: 1111;
            color: #fff !important;
        }
        .el-switch__label--left.is-active {
            z-index: 1111;
            color: #fff !important;
        }
        .el-link.el-link--danger.is-underline:hover:after, .el-link.el-link--danger:after {
            border: none !important;
        }
    }
//    .el-pagination.is-background .el-pager li:not(.disabled).active {
//     background:#fff !important;
//   }
    .el-pagination {
        position:static !important;
    }
    .el-textarea .el-input__count {
        background:transparent !important;
        bottom:-5px !important;
    }
    .line-h .el-form-item__content {
        line-height: 24px !important;
    }
}
.dialog-unbundling .el-dialog__body {
    padding: 10px 20px !important;
}
.sendOfferVisibleDialog .el-dialog {
    min-height:472px !important;
}
.unbinding-info.el-message-box {
    width: 550px !important;
    padding: 20px !important;
    .el-message-box__content {
        margin-bottom: 20px !important;
    }
    .el-button--primary {
        background-color:rgb(254, 0, 12) !important;
        border-color:rgb(254, 0, 12) !important;
    }
    .el-message-box__btns {
        text-align:center !important;
    }
    .el-icon-warning {
        color:rgb(254, 0, 12) !important;
    }
}
</style>