<template>
    <div>
        <custom-table
            ref="deviceTable"
            :tableHeader="tableDataHeader"
            :tableData="tableData"
            :tableHeight="height + ''"
            @changeSearch="tableTitleSearch"
        >
            <template v-slot:abnormalStatus="slotProps">
                <el-table-column
                    label="状态"
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.abnormalStatus" style="color:#999">已处理</span>
                        <span v-else style="color: #dd0000">待处理</span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:abnormalSource="slotProps">
                <el-table-column
                    label="来源"
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.abnormalSource == '1'">手工创建</span>
                        <span v-else>检查</span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:priority="slotProps">
                <el-table-column
                    label="优先级"
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.priority == 1">急需处理</span>
                        <span v-else>可暂缓处理</span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:taskType="slotProps">
                <el-table-column
                    label="任务类型"
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    show-overflow-tooltip
                >
                <template slot="header">
                    <column-header 
                        title="任务类型"
                        :filterType="slotProps.slotData.filterType"
                        :paramValue="slotProps.slotData.paramValue"
                        :changeValue="slotProps.slotData.changeValue"
                        :selectOptions="slotProps.slotData.selectOptions"
                        @chSubmit="tableTitleSearch"/>
                    </template>
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskType == 1">换油</span>
                        <span v-if="scope.row.taskType == 2">加油</span>
                        <span v-if="scope.row.taskType == 3">加脂</span>
                        <span v-if="scope.row.taskType == 4">检查</span>
                        <span v-if="scope.row.taskType == 5">保养</span>
                        <span v-if="scope.row.taskType == 6">维修</span>
                        <span v-if="scope.row.taskType == 7">其他</span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:taskTime="slotProps">
                <el-table-column
                    label="计划执行时间"
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    show-overflow-tooltip
                >
                <template slot="header">
                    <column-header 
                        title="计划执行时间"
                        :filterType="slotProps.slotData.filterType"
                        :paramValue="slotProps.slotData.paramValue"
                        :changeValue="slotProps.slotData.changeValue"
                        :selectOptions="slotProps.slotData.selectOptions"
                        @chSubmit="tableTitleSearch"/>
                    </template>
                    <template slot-scope="scope">
                        <span>{{ scope.row.taskTime }}</span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:taskStatus="slotProps">
                <el-table-column
                    label="状态"
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span v-if="scope.row.taskStatus == 1" style="color:#dd0000">待领取</span>
                        <span v-if="scope.row.taskStatus == 2" style="color:#008888">执行中</span>
                        <span v-if="scope.row.taskStatus == 3" style="color:#999">已执行</span>
                        <span v-if="scope.row.taskStatus == 4" style="color:#999">已取消</span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:workOrderStatus="slotProps">
                <el-table-column
                    label="工单状态"
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <span style="color:#dd0000;" v-if="scope.row.workOrderStatus == '0' || scope.row.workOrderStatus == '9'">待确认</span>
                        <span style="color:#001450;" v-if="scope.row.workOrderStatus == '2'">待评价</span>
                        <span style="color:#008888;" v-if="scope.row.workOrderStatus == '1'">进行中</span>
                        <span style="color:#999999;" v-if="scope.row.workOrderStatus == '4'">已关闭</span>
                        <span style="color:#999999;" v-if="scope.row.workOrderStatus == '3'">已完成</span>
                    </template>
                </el-table-column>
            </template>
            <template v-slot:userName="slotProps">
                <el-table-column
                    :width="slotProps.slotData.width && slotProps.ind !== tableDataHeader.length - 2 ? slotProps.slotData.width : ''"
                    :resizable="slotProps.ind == tableDataHeader.length - 2 ? false : true"
                    :label="tableType == 'task' ? '负责人' : '执行人'"
                    show-overflow-tooltip
                >
                    <template slot-scope="scope">
                        <el-popover class="el-popover-detail" placement="bottom" width="272" :ref="`popovers-${scope.$index}`" trigger="click">
                            <div>
                                <div style="display: flex;align-items:center;">
                                    <img :src="userDetail.headUrl ? userDetail.headUrl : require('../../../assets/headImg.png')" alt="" style="width: 40px; height: 40px" />
                                    <div style="flex: 1; margin-left: 10px">
                                        <div style="color: #000; font-family: MicrosoftYaHei; font-size: 14px; line-height: 14px">{{ userDetail.userName }}</div>
                                    </div>
                                </div>
                                <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                                    <span style="color: #666; margin-right: 8px">电话: </span>
                                    <span>{{ formatPhonenumber(userDetail.phonenumber) }}</span>
                                    <el-button class="copy_tel" style="padding: 0px" type="text" v-clipboard:copy="userDetail.phonenumber" v-clipboard:success="onCopyTel" v-clipboard:error="onErrorTel" v-if="userDetail.phonenumber">
                                    <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                                    </el-button>
                                </div>
                                <div style="color: #999; font-family: MicrosoftYaHei; font-size: 13px; line-height: 14px; margin-top: 12px; margin-bottom: 4px; display: flex; align-items: center">
                                    <span style="color: #666; margin-right: 8px">邮箱: </span>
                                    <span>{{ formatEmail(userDetail.email) }}</span>
                                    <el-button class="copy_mail" type="text" v-clipboard:copy="userDetail.email" v-clipboard:success="onCopyMail" v-clipboard:error="onErrorMail" style="padding: 0px" v-if="userDetail.email">
                                    <img src="../../../assets/icon-copy.png" alt="" class="icon-copy" style="margin-left: 8px" />
                                    </el-button>
                                </div>
                            </div>
                            <span
                                v-if="tableType == 'task'"
                                slot="reference"
                                :disabled="!scope.row.taskUserName"
                                class="copy_text"
                                type="text"
                                style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px"
                                @click="getUserDetail(scope,1)"
                                >{{ scope.row.taskUserName || "-" }}</span
                            >
                            <!-- <div style="display: flex;align-items: center;"> -->
                                <div
                                    v-if="tableType == 'workOrder'" 
                                    slot="reference"
                                    :disabled="!scope.row.executePersonName"
                                    class="copy_text"
                                    type="text"
                                    style="color: #001450; font-family: MicrosoftYaHei; cursor: pointer; padding: 0px;display: flex;align-items: center;"
                                    @click="getUserDetail(scope,1)"
                                    >
                                    <span style="word-break: break-all; white-space: nowrap; text-overflow: ellipsis; overflow: hidden">{{ scope.row.executePersonName || "-" }}</span>
                                    
                                    <el-tooltip :content="scope.row.executePersonHonoraryMedal=='3' ? '服务大师' :  scope.row.executePersonHonoraryMedal=='2' ? '服务达人' : scope.row.executePersonHonoraryMedal=='1' ?  '服务先锋' :''" placement="top">
                                        <img v-if="scope.row.executePersonHonoraryMedal=='3'" src="../../../assets/small_service_great_person.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                                        <img v-if="scope.row.executePersonHonoraryMedal=='2'" src="../../../assets/small_service_master.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                                        <img v-if="scope.row.executePersonHonoraryMedal=='1'" src="../../../assets/small_service_pioneer.png" alt="" style="width:24px;height:20px;margin-left: 4px;position: relative;top: 4px;">
                                    </el-tooltip>
                                    </div
                                >
                                
                            <!-- </div> -->
                            

                        </el-popover>
                    </template>
                </el-table-column>
            </template>
            <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
            <el-table-column slot="operation" :resizable="false" fixed="right" label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-link v-if="isView" style="color:rgb(0,20,80)" @click="viewRow(scope.row)">查看</el-link>
                    <el-link v-if="isEdit" style="color:rgb(0,20,80)" @click="editRow(scope.row)">编辑</el-link>
                    <el-link v-if="isDelete" style="color:rgb(211,0,0)" @click="deleteRow(scope.row)">删除</el-link>
                </template>
            </el-table-column>
        </custom-table>
        <el-pagination
            v-if="tableTotal && tableType != 'check'"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="tableCurrent"
            :page-size="tableSize"
            :page-sizes="[30, 60, 100, 200, 500]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableTotal"
            style="float: right; display: flex; bottom: 15px; background: #fff"
        ></el-pagination>
    </div>
  </template>
  
  <script>
  import customTable from "../../tableComponents/customTable.vue";
  import columnHeader from "../../tableComponents/headerComponent";
  import commonJS from "../../tableComponents/tableCommon.js";
  export default {
    mixins: [commonJS],
    components: {
        "custom-table": customTable,
        "column-header":columnHeader,
    },
    props: {
        // 是否展示查看按钮
        isView: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        // 是否展示编辑按钮
        isEdit: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        // 是否展示删除按钮
        isDelete: {
            type: Boolean,
            default: () => {
                return false;
            }
        },
        tableData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        height: {
            type: Number,
            default: () => {
                return 0;
            }
        },
        tableCurrent: {
            type: Number,
            default: () => {
                return 1;
            }
        },
        tableSize: {
            type: Number,
            default: () => {
                return 30;
            }
        },
        tableTotal: {
            type: Number,
            default: () => {
                return 0;
            }
        },
        tableType:{
            type: String,
            default: () => {
                return '';
            }
        }
    },
    watch: {
        isView: {
            handler: function(val, oldVal) {
                this.isView = val;
            },
            immediate: true
        },
        isEdit: {
            handler: function(val, oldVal) {
                this.isEdit = val;
            },
            immediate: true
        },
        isDelete: {
            handler: function(val, oldVal) {
                this.isDelete = val;
            },
            immediate: true
        },
        tableData: {
            handler: function(val, oldVal) {
                this.tableData = val;
            },
            immediate: true
        },
        tableCurrent: {
            handler: function(val, oldVal) {
                this.tableCurrent = val;
            },
            immediate: true
        },
        tableSize: {
            handler: function(val, oldVal) {
                this.tableSize = val;
            },
            immediate: true
        },
        tableTotal: {
            handler: function(val, oldVal) {
                this.tableTotal = val;
            },
            immediate: true
        },
        tableType:{
            handler: function(val, oldVal) {
                if(val){
                    this.tableType = val;
                    this.tableDataHeader = this.tableDataHeaderObj[val];
                }
            },
            immediate: true
        }
    },
    data() {
        return {
            tableDataHeader: [],
            tableDataHeaderObj:{
                'abnormal':[
                    { label: "异常ID", prop: "abnormalNo", width: "150", tooltip: true },
                    { label: "状态", slot: "abnormalStatus", width: "150"},
                    { label: "来源", slot: "abnormalSource", width: "150" },
                    { label: "优先级", slot: "priority", width: "150" },
                    { label: "生成时间", prop: "createTime", width: "180", tooltip: true },
                    { label: "操作", slot: "operation" }
                ],
                'task':[
                    { label: "任务名称", prop: "taskName", width: "200", tooltip: true },
                    { label: "任务ID", prop: "taskPlanNo", width: "150", tooltip: true },
                    { filterType: "selection", paramValue: "taskType", selectOptions:  [{ name: "换油", code: "1" },{ name: "加油", code: "2" },{ name: "加脂", code: "3" },{ name: "检查", code: "4" },{ name: "保养", code: "5" },{ name: "维修", code: "6" },{ name: "其他", code: "7" }], changeValue:"", label: "任务类型", slot: "taskType", width: "150", tooltip: true },
                    { label: "状态", slot: "taskStatus", width: "150" },
                    { label: "负责人", slot: "userName", width: "120" },
                    { filterType: "datetimerange", paramValue: "taskTime", changeValue:"",  label: "计划执行时间", slot: "taskTime", width: "180", tooltip: true },
                    { label: "操作", slot: "operation" }
                ],
                'workOrder':[
                    { label: "工单编号", prop: "workOrderNumber",  width: "150", tooltip: true },
                    { label: "服务项", prop: "serviceName", width: "200", tooltip: true },
                    { label: "服务商", prop: "distributorCompanyName", width: "200", tooltip: true },
                    { label: "执行人", slot: "userName",slot: "userName",  width: "180" },
                    { label: "预约日期", prop: "expectComingTimeStr", width: "120", tooltip: true },
                    { label: "创建日期", prop: "createTimeStr", width: "120", tooltip: true },
                    { label: "工单状态", slot: "workOrderStatus", width: "150" },
                    { label: "操作", slot: "operation" }
                ],
                'check':[
                    { label: "检查内容", prop: "content", width: "300", tooltip: true },
                    { label: "适用任务", prop: "taskNames", width: "300", tooltip: true },
                    { label: "操作", slot: "operation" }
                ],
            },
            userDetail:{}
        };
    },
    methods: {
        handleSizeChange(val) {
            this.$emit("tableSizeChange", val);
        },
        handleCurrentChange(val) {
            this.$emit("tableCurrentChange", val);
        },
        viewRow(row) {
            this.$emit("tableRowView", row);
        },
        editRow(row) {
            this.$emit("tableRowEdit", row);
            this.$gio.deleteCheckItem({
                operation: "点击编辑按钮",
                customer: this.$parent.epInfo.companyName
            });
            this.$gio.createOrEditCheckItem({
                operation: "点击编辑按钮",
                customer: this.$parent.epInfo.companyName
            });
        },
        deleteRow(row) {
            this.$emit("tableRowDelete", row);
            this.$gio.deleteCheckItem({
                operation: "点击删除按钮",
                customer: this.$parent.epInfo.companyName
            });
        },
        // 获取头像全路径
        getFullUrl(val) {
            const params = {
                url: val
            };
            this.requestMethodGet("/web/file/getFullUrl", params).then(res => {
                if (res.data.code == 1000) {
                    this.$set(this.userDetail,'headUrl',res.data.data)
                } else {
                    this.$message({
                        message: res.data.msg,
                        type: "warning"
                    });
                }
            });
        },
        // 获取人详情
        getUserDetailById(val, index, type, number) {
            if (val || number) {
                this.userDetail = {};
                let param = {};
                if(val){
                    param.userId = val
                }else{
                    param.userNumber = number
                }
                this.requestMethodGet("/web/system/permission/userManage/queryUserInfoByUserId", param)
                .then(res => {
                    res = res.data;
                    if (res.code == 1000) {
                        if (res.data) {
                            if(type == 1){
                                this.$refs[`popovers-${index}`].doShow();
                            }else{
                                this.$refs[`contactname-${index}`].doShow();
                            }
                            this.userDetail = res.data;
                            if (this.userDetail.avatar) {
                                this.getFullUrl(this.userDetail.avatar);
                            }
                            if (this.userDetail.roleNames) {
                                this.userDetail.roleNames = this.userDetail.roleNames.join(",");
                            }
                            if (this.userDetail.phonenumber) {
                                const phoneNum = this.userDetail.phonenumber;
                                this.userDetail.phonenumber = phoneNum.substr(0, 3) + " " + phoneNum.substr(3, 4) + " " + phoneNum.substr(7, 4);
                            }
                        } else {
                            if(type == 1){
                                this.$refs[`popovers-${index}`].doClose();
                            }else{
                                this.$refs[`contactname-${index}`].doClose();
                            }
                            this.$message({
                                message: "人员不存在",
                                type: "warning"
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
            }
        },
        // 查看人详情
        getUserDetail(scope,type) {
            this.userDetail = {};
            if(type == 1){
                if(scope.row.taskUserId || scope.row.executePersonNumber){
                    this.$refs[`popovers-${scope.$index}`].doClose();
                    if (this.tableType == 'task') {
                        this.getUserDetailById(scope.row.taskUserId, scope.$index, type, "");
                    }else{
                        this.getUserDetailById('', scope.$index, type, scope.row.executePersonNumber);
                    }
                }   
            }else{
                if (scope.row.contactNumber) {
                    this.$refs[`contactname-${scope.$index}`].doClose();
                    this.getUserDetailById('', scope.$index, type, scope.row.contactNumber);
                }
            }
        },
        tableTitleSearch(obj){
            let searchVal = obj.changeValue
            this.tableDataHeader.forEach(item=>{
                if(obj.paramValue==item.paramValue){
                    item.changeValue = (searchVal === 0 || searchVal === false) ? searchVal : searchVal || "";
                }
            })
            if(obj.paramValue=='taskType'){
                this.$emit("taskTypeChange", searchVal);
            }else if(obj.paramValue=='taskTime'){
                this.$emit("taskTimeChange", searchVal);
            }
        },
        
    }
  };
  </script>
  