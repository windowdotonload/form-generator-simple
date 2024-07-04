<template>
    <div class="parameter-config" >
        <div style="position:relative;">
            <div style="font-weight:bold;font-size:18px;border-bottom:1px solid #DCDFE6;">
            <el-row>
                <el-col :span="4" style="border-right:1px solid #DCDFE6;padding:20px;">
                    配置项选择
                </el-col>
                <el-col :span="8" style="padding-left:40px;border-right:1px solid #DCDFE6;padding:20px;">
                    内容配置
                </el-col>
                <el-col :span="12" style="padding-left:40px;padding:20px;">
                    生效信息
                </el-col>
            </el-row>
            <div style="position:absolute;right:30px;top:15px;" v-if="!isEdit">
                <el-button size="small" type="danger"  style="position"  @click="editConfiger()" v-has="PCEditBtn">编辑</el-button>
            </div>
        </div>
        <div >
            <el-row>
                <el-col :span="4"  class="baseBorder"  :style="mainminheight">
                    <el-menu
                    default-active="1"
                    style="border:none;"
                    class="el-menu-vertical-demo"
                    @select="selectWay">
                    <el-menu-item index="1" :class="selectWayNum =='1'?'active':''">
                        <span slot="title">二维码管理</span>
                    </el-menu-item>
                    <el-menu-item index="2" :class="selectWayNum =='2'?'active':''">
                        <span slot="title">短信管理</span>
                    </el-menu-item>
                    <el-menu-item index="3" :class="selectWayNum =='3'?'active':''">
                        <span slot="title">换油原因类型</span>
                    </el-menu-item>
                    </el-menu>
                </el-col>
                <el-col :span="8"  class="baseBorder"  :style="mainminheight">
                    <div v-if="selectWayNum =='1'">
                        <el-form
                            :model="ruleForm"
                            :rules="rules"
                            ref="accountForm"
                            label-width="180px"
                            label-position="left"
                        >
                        <!-- 二维码默认时长
                        二维码默认可用次数 -->
                            <div style="font-weight:bold;margin-bottom:16px;font-size:15px;">一、邀请客户二维码配置</div>
                            
                            <el-form-item label="二维码默认可用次数：" prop="inviteCustomerValidTimesDefault" >
                            <el-input
                                v-if="isEdit"
                                size="small"
                                v-model="ruleForm.inviteCustomerValidTimesDefault"
                                maxlength="3"
                                autocomplete="off"
                                placeholder="请输入"
                                style="width:50%"
                            ></el-input>
                            <span v-else style="width:50%">
                                    {{ruleForm.inviteCustomerValidTimesDefault}}
                                </span>
                            次
                            </el-form-item>
                            <el-form-item label="二维码最大可用次数：" prop="inviteCustomerValidTimes" >
                            <el-input
                                v-if="isEdit"
                                size="small"
                                v-model="ruleForm.inviteCustomerValidTimes"
                                maxlength="3"
                                autocomplete="off"
                                placeholder="请输入"
                                style="width:50%"
                            ></el-input>
                            <span v-else style="width:50%">
                                    {{ruleForm.inviteCustomerValidTimes}}
                                </span>
                            次
                            </el-form-item>
                            <el-form-item label="二维码默认有效时长：" prop="inviteCustomerValidDaysDefault" >
                                <el-input
                                    v-if="isEdit"
                                    size="small"
                                    v-model="ruleForm.inviteCustomerValidDaysDefault"
                                    maxlength="3"
                                    autocomplete="off"
                                    placeholder="请输入"
                                    style="width:50%"
                                ></el-input>
                                <span v-else style="width:50%">
                                    {{ruleForm.inviteCustomerValidDaysDefault}}
                                </span>
                                天
                            </el-form-item>
                            <el-form-item label="二维码最大有效时长：" prop="inviteCustomerValidDays" >
                                <el-input
                                    v-if="isEdit"
                                    size="small"
                                    v-model="ruleForm.inviteCustomerValidDays"
                                    maxlength="3"
                                    autocomplete="off"
                                    placeholder="请输入"
                                    style="width:50%"
                                ></el-input>
                                <span v-else style="width:50%">
                                    {{ruleForm.inviteCustomerValidDays}}
                                </span>
                                天
                            </el-form-item>
                            <div style="font-weight:bold;margin:24px 0 16px 0;font-size:15px;">二、邀请成员二维码配置</div>
                            <el-form-item label="二维码默认可用次数：" prop="inviteMemberValidTimesDefault" >
                            <el-input
                                v-if="isEdit"
                                size="small"
                                v-model="ruleForm.inviteMemberValidTimesDefault"
                                maxlength="3"
                                autocomplete="off"
                                placeholder="请输入"
                                style="width:50%"
                            ></el-input>
                            <span v-else style="width:50%">
                                    {{ruleForm.inviteMemberValidTimesDefault}}
                                </span>
                            次
                            </el-form-item>
                            <el-form-item label="二维码最大可用次数：" prop="inviteMemberValidTimes" >
                            <el-input
                                v-if="isEdit"
                                size="small"
                                v-model="ruleForm.inviteMemberValidTimes"
                                maxlength="3"
                                autocomplete="off"
                                placeholder="请输入"
                                style="width:50%"
                            ></el-input>
                            <span v-else style="width:50%">
                                    {{ruleForm.inviteMemberValidTimes}}
                                </span>
                            次
                            </el-form-item>
                            <el-form-item label="二维码默认有效时长：" prop="inviteMemberValidDaysDefault" >
                                <el-input
                                    v-if="isEdit"
                                    size="small"
                                    v-model="ruleForm.inviteMemberValidDaysDefault"
                                    maxlength="3"
                                    autocomplete="off"
                                    placeholder="请输入"
                                    style="width:50%"
                                ></el-input>
                                <span v-else style="width:50%">
                                    {{ruleForm.inviteMemberValidDaysDefault}}
                                </span>
                                天
                            </el-form-item>
                            <el-form-item label="二维码最大有效时长：" prop="inviteMemberValidDays">
                                <el-input
                                v-if="isEdit"
                                size="small"
                                v-model="ruleForm.inviteMemberValidDays"
                                maxlength="3"
                                autocomplete="off"
                                placeholder="请输入"
                                style="width:50%"
                                ></el-input>
                                <span v-else style="width:50%">
                                    {{ruleForm.inviteMemberValidDays}}
                                </span>
                                天
                            </el-form-item>
                        </el-form>
                    </div>
                    <div v-if="selectWayNum =='2'">
                        <div style="font-weight:bold;margin:0px 0 16px;font-size:15px;">{{describe.confName}}</div>
                        <div style="font-size:14px;">
                            短信状态
                            <el-switch
                            style="margin-left:20px;"
                            v-model="describe.messageIsOpen"
                            :active-text="showProdStatus"
                            active-value="true"
                            :disabled = '!isEdit'
                            inactive-value="false"
                            @change="changeStatusProd"
                            active-color="#ff4949"
                            :width="56"
                            inactive-color="#e6e6e6">
                            </el-switch>
                        </div>
                    </div>
                    <div v-if="selectWayNum =='3'">
                        <div v-show="isEdit">
                            <div style="font-weight:bold;margin:0px 0 16px;font-size:15px;">换油原因类型配置：（<span style="color:#F56C6C">注意，最多配置十项类型，建议每项最多输入六个字符</span>）</div>
                            <el-col span="24">
                                <el-button size="small" type="danger"  style="position"  @click="addChangeOilType()">新增</el-button>
                            </el-col>
                        </div>
                        <div style="margin-top:60px" v-if="isEdit"></div>
                        <div >
                            <el-form>
                                <div v-for="(item,index) in changeOilType" :key="index">
                                    <el-form-item label="">
                                        <el-input
                                        v-if="isEdit"
                                        size="small"
                                        v-model="item.name"
                                        maxlength="15"
                                        autocomplete="off"
                                        placeholder="请输入"
                                        style="width:50%"
                                        :disabled="item.code === 'change_device_oil_reason_type_0'"
                                        ></el-input>
                                        <span v-else style="width:50%">
                                            {{item.name}}
                                        </span>
                                        <span>
                                            <el-button v-if="isEdit && item.code !== 'change_device_oil_reason_type_0'" type="danger" plain @click="deleteChangeOilType(item)" size="medium">删除</el-button>
                                        </span>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6" style="padding:20px 0 0 20px;font-size:15px;">
                    <div v-if="selectWayNum =='1'">
                        <!-- <div>{{ruleForm.inviteCustomerDescribe}}</div> -->
                        <div style="font-weight:bold;margin-bottom:16px;font-size:15px;">一、邀请客户二维码配置的信息</div>
                        <div style="line-height:30px;">默认有效次数{{ruleForm.inviteCustomerValidTimesDefault}}次，最大可用次数{{ruleForm.inviteCustomerValidTimes}}次</div>
                        <div style="line-height:30px;">默认有效时长{{ruleForm.inviteCustomerValidDaysDefault}}天，最大有效时长{{ruleForm.inviteCustomerValidDays}}天</div>
                        <div style="font-weight:bold;margin-bottom:16px;font-size:15px;margin-top:14px;">二、邀请成员二维码配置的信息</div>
                        <div style="line-height:30px;">默认有效次数{{ruleForm.inviteMemberValidTimesDefault}}次，最大可用次数{{ruleForm.inviteMemberValidTimes}}次</div>
                        <div style="line-height:30px;">默认有效时长{{ruleForm.inviteMemberValidDaysDefault}}天，最大有效时长{{ruleForm.inviteMemberValidDays}}天</div>
                        <!-- <div style="margin-top:14px;">{{ruleForm.inviteMemberValidDescribe}}</div> -->
                    </div>
                    <div v-if="selectWayNum =='2'">
                        <div>{{describe.messageDescribe}}</div>
                    </div>
                    <div v-if="selectWayNum =='3'">
                        <el-form>
                            <div v-for="(item,index) in effectList" :key="index">
                                <el-form-item label="">
                                    <span style="width:50%">
                                        {{item.name}}
                                    </span>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </div>
        </div>
        <div class="footer" v-if="isEdit">
            <el-button type="danger" @click="handleSubmit('accountForm')" size="medium">保存</el-button>
            <el-button type="danger" plain @click="handleCancle('accountForm')" size="medium">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogTableVisible:true,
            mainminheight: `height:${document.documentElement.clientHeight- 180}px` ,
            selectWayNum:"1",
            ruleForm:{
                inviteCustomerValidDays :'',
                inviteCustomerValidTimes :'',
                inviteMemberValidDays :'',
                inviteMemberValidTimes :'',
                inviteCustomerValidDaysDefault :'',
                inviteCustomerValidTimesDefault :'',
                inviteMemberValidDaysDefault :'',
                inviteMemberValidTimesDefault :'',
            },
            changeOilType:[],
            effectList:[],
            delIds:[],
            rules: {
                inviteCustomerValidDays: [
                    { required: true, message: '请输入二维码最大有效时长', trigger: 'blur' },
                    { pattern:/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,message: '请输入999以下的正整数', trigger: 'blur' }
                ],
                inviteCustomerValidTimes: [
                    { required: true, message: "请输入二维码最大可用次数", trigger: "blur" },
                    { pattern:/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,message: '请输入999以下的正整数', trigger: 'blur' }
                ],
                inviteMemberValidDays: [
                    { required: true, message: '请输入二维码最大有效时长', trigger: 'blur' },
                    { pattern:/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,message: '请输入999以下的正整数', trigger: 'blur' }
                ],
                inviteMemberValidTimes: [
                    { required: true, message: "请输入二维码最大可用次数", trigger: "blur" },
                    { pattern:/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,message: '请输入999以下的正整数', trigger: 'blur' }
                ],
                inviteCustomerValidDaysDefault: [
                    { required: true, message: '请输入二维码默认有效时长', trigger: 'blur' },
                    { pattern:/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,message: '请输入999以下的正整数', trigger: 'blur' }
                ],
                inviteCustomerValidTimesDefault: [
                    { required: true, message: "请输入二维码默认可用次数", trigger: "blur" },
                    { pattern:/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,message: '请输入999以下的正整数', trigger: 'blur' }
                ],
                inviteMemberValidDaysDefault: [
                    { required: true, message: '请输入二维码默认有效时长', trigger: 'blur' },
                    { pattern:/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,message: '请输入999以下的正整数', trigger: 'blur' }
                ],
                inviteMemberValidTimesDefault: [
                    { required: true, message: "请输入二维码默认可用次数", trigger: "blur" },
                    { pattern:/^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/,message: '请输入999以下的正整数', trigger: 'blur' }
                ],
            },
            selectType:"qr_manage_conf",
            describe:{
                messageIsOpen:'',
                confName:'',
                messageDescribe:''
            },
            isEdit:false
        };
    },
    computed: {
        // 展示 正式 环境的开关文字状态
        showProdStatus() {
            return  this.describe.messageIsOpen === 'true' ? '开' : '关'
        }
    },
    methods: {
        // 新增换油原因类型
        addChangeOilType(){
            if(this.changeOilType.length>9){
                this.$confirm('新增失败，最多配置10项换油原因类型！', '提示', {
                    confirmButtonText: '知道了',
                    showCancelButton:false,
                    customClass:'confirmBtn',
                    closeOnClickModal:false,
                    type: 'warning'
                    }).then(() => {
                        
                    }).catch(() => {
                              
                    });
            }else{
                const obj = {
                    name:'',
                    uuid:this.getUUID(8,16)
                }
                this.changeOilType.unshift(obj)
            }
        },
        // 生成UUID
        getUUID (len, radix) {
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            var uuid = [], i;
            radix = radix || chars.length;
            if (len) {
              for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
            } else {
              var r;
              uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
              uuid[14] = '4';
              for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                  r = 0 | Math.random()*16;
                  uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
              }
            }
            return uuid.join('');
        },
        // 删除单条原因类型
        deleteChangeOilType(item){
            this.changeOilType.forEach((it,idx)=>{
                if(it.uuid === item.uuid){
                    if(it.id){
                        this.delIds.push(it.id)
                    }
                    this.changeOilType.splice(idx,1)
                }
            })
        },
        editConfiger() {
            this.isEdit = true;
            this.mainminheight= `height:${document.documentElement.clientHeight- 240}px`
        },
        // 正式环境状态切换时
        changeStatusProd(val) {
            if(val ==='true' || val) {
                this.describe.messageIsOpen = 'true'
            }
            if(val === 'false' || !val){
                this.describe.messageIsOpen = 'false'
            }
        },
        // 选择 二维码管理或者短信管理的 change 事件
        selectWay(key, keyPath) {
            // 如果为编辑状态
            if(this.isEdit) {
                this.$confirm("确认离开本页面吗？如果离开则所做的设置不会保存？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                })
                .then(() => {
                    if(this.selectWayNum !== key) {
                        this.selectWayNum = key
                        if(this.selectWayNum == '1') {
                            this.selectType='qr_manage_conf'
                            this.getData();
                        } else if(this.selectWayNum == '2'){
                            this.selectType='phone_message_manage_conf'
                            this.getData();
                        } else {
                            this.selectType='change_device_oil_reason_type'
                            this.getChangeOilData('change_device_oil_reason_type');
                        }
                    }
                    
                })
                .catch(() => {
                    if(key == this.preSelectNum) {
                        this.selectWayNum = this.preSelectNum;
                    }
                });
                }  else {
                    if(this.selectWayNum !== key) {
                        this.selectWayNum = key
                        if(this.selectWayNum == '1') {
                            this.selectType='qr_manage_conf'
                             this.getData();
                        } else if(this.selectWayNum == '2'){
                            this.selectType='phone_message_manage_conf'
                             this.getData();
                        }else {
                            this.selectType='change_device_oil_reason_type'
                            this.getChangeOilData('change_device_oil_reason_type');
                        }
                    }
                }
        },
        // 查询 页面 数据
        getData() {
            let params = {
                typeName:this.selectType
            }
            this.requestMethodGet("/web/sys/conf/querySysConfByTypeName",params).then(res => {
                if(res.data.code == 1000) {
                    if(this.selectWayNum == '1') {
                        if(res.data.data != null) {
                            this.ruleForm = res.data.data;
                        } else {
                            this.ruleForm={
                                inviteCustomerValidDays :'',
                                inviteCustomerValidTimes :'',
                                inviteMemberValidDays :'',
                                inviteMemberValidTimes :'',
                                inviteCustomerValidDaysDefault:'',
                                inviteCustomerValidTimesDefault:'',
                                inviteMemberValidDaysDefault:'',
                                inviteMemberValidTimesDefault:''
                            }
                        }

                    } else {
                        if(res.data.data !=null) {
                            this.describe = res.data.data;
                            if(this.describe.messageIsOpen == null ||this.describe.messageIsOpen == false) {
                                this.describe.messageIsOpen = 'false'
                            } else {
                                this.describe.messageIsOpen = 'true'
                            }
                        } else {
                            this.describe={
                                messageIsOpen:'',
                                confName:'',
                                messageDescribe:''
                            }
                        }
                    }
                }
            }).catch(res => {
            });
        },
        // 换油类型
        getChangeOilData(name){
            this.getDicDataList(name).then(res=>{
                const that = this
                this.effectList = res
                if(res && res.length>0){
                    res.forEach(item=>{
                        item.uuid = that.getUUID(8,16)
                    })
                }
                this.changeOilType = JSON.parse(JSON.stringify(res))
            })
        },
        onResize(){
            this.mainminheight = `height:${document.documentElement.clientHeight- 240}px`
        },
        // 提交数据
        submitData() {
            this.$confirm("是否确认提交数据？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
                })
                .then(() => {
                    if(this.selectWayNum == '1') {
                        let params = {
                            name:'二维码管理',
                            typeName:this.selectType,
                            value:{
                                inviteCustomerValidDays:this.ruleForm.inviteCustomerValidDays,
                                inviteCustomerValidTimes:this.ruleForm.inviteCustomerValidTimes,
                                inviteMemberValidDays:this.ruleForm.inviteMemberValidDays,
                                inviteMemberValidTimes:this.ruleForm.inviteMemberValidTimes,
                                inviteCustomerValidDaysDefault:this.ruleForm.inviteCustomerValidDaysDefault,
                                inviteCustomerValidTimesDefault:this.ruleForm.inviteCustomerValidTimesDefault,
                                inviteMemberValidDaysDefault:this.ruleForm.inviteMemberValidDaysDefault,
                                inviteMemberValidTimesDefault:this.ruleForm.inviteMemberValidTimesDefault
                            }
                        }
                        this.requestMethodPost("/web/sys/conf/updateSysConfByTypeName",params).then(res => {
                            if(res.data.code == 1000) {
                                this.selectWayNum == '1'
                                this.getData()
                                this.isEdit = false;
                                this.mainminheight = `height:${document.documentElement.clientHeight- 180}px`
                            }
                        }).catch(res => {
                        });
                    } else if(this.selectWayNum == '2'){
                        let params = {
                            name:'短信管理',
                            typeName:this.selectType,
                            value:{
                                messageIsOpen:this.describe.messageIsOpen === 'true' ? true :false
                            }
                        }
                        this.requestMethodPost("/web/sys/conf/updateSysConfByTypeName",params).then(res => {
                            if(res.data.code == 1000) {
                                this.selectWayNum == '2'
                                this.getData()
                                this.isEdit = false;
                            }
                        }).catch(res => {
                        });
                    }else if(this.selectWayNum == '3'){
                        let changeOilList = this.changeOilType.filter(item=>{
                            return item.name != ""
                        })
                        const params = {
                            dataList:changeOilList,
                            delIds:this.delIds
                        }
                        this.requestMethodPost("/web/sys/conf/saveConfig",params).then(res => {
                            if(res.data.code == 1000) {
                                this.selectWayNum == '3'
                                this.delIds = []
                                this.getChangeOilData('change_device_oil_reason_type')
                                this.isEdit = false;
                            }
                        }).catch(res => {
                        });
                    }
                })
                .catch(() => {});
        },
        // 新增账号提交
        handleSubmit(formName) {
            if(this.selectWayNum == '1') {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.submitData()
                    } else {
                    return false;
                    }
                });
            } else {
                this.submitData()
            }
        },
        // 取消
        handleCancle() {
            if(this.selectWayNum == '3'){
                this.delIds = []
                this.getChangeOilData('change_device_oil_reason_type')
            }
            if(this.selectWayNum == '1') {
                this.$refs['accountForm'].clearValidate();
                this.getData()
            }
            this.isEdit = false;
        }
    },
    mounted() {
        this.getData()
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.confirmBtn{
    .el-button--primary {
        background-color:#F56C6C !important;
        border-color:#F56C6C !important;
    }
    .el-icon-warning {
        color: #F56C6C !important;
    }
}
.parameter-config {
    // padding: 20px;
    padding-bottom:50px;
    overflow: auto;
    .baseBorder {
        padding:20px 0px 20px 20px;
        border-right:1px solid #DCDFE6;
    }
    .el-menu-item {
        width:140px;
        text-align:center;
        border:1px solid #DCDFE6;
        border-radius:10px;
        height:43px;
        line-height:43px;
        margin-bottom:20px;
        color:#999;
    }
    .footer {
        position:fixed;
        bottom:40px;
        background:red;
        // width:100%;
        background:rgb(247, 247, 247);
        padding-left:20px;
    }
    .el-menu-item.is-active{
        border: 1px solid #DCDFE6;
        color:#999;
    }
    .el-menu-item.active {
        border: 1px solid #179bff !important;
        color:#179bff !important;
    }
    /deep/ .el-switch {
    position: relative;
    height: 24px;
    line-height: 24px;
    &.is-checked {
      .el-switch__core {
        background: #179bff;
        &:after {
          margin-left: -22px;
        }
      }
    }
    .el-switch__label,
    .el-switch__core {
      height: 24px;
    }
    .el-switch__core {
      border-radius: 12px;
      border: none;
      background: #f1f1f1;
      &:after {
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.3);
        width: 22px;
        height: 22px;
      }
    }
    .el-switch__label.is-active {
      color: #333;
    }
    .el-switch__label--right {
      margin-left: 0px;
      &.is-active {
        color: #fff;
        right: 30px;
      }
      position: absolute;
      right: 14px;
      top: -1px;
      color: #999;
      > span {
        font-size: 12px;
      }
    }
  }
}
</style>


