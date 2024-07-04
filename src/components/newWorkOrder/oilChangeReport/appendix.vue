<template>
<div>
<el-card class="deviceInfo" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
    <el-divider direction="vertical"></el-divider>
    <span>{{appendixName}} 
        <span  class="font-style">（仅支持PDF文件，其他文件格式请转换为PDF后上传）</span>
    </span>
    </div>
    <div v-for="(item,index) in appendixObj" :key="index">
        <div v-if="item.nameKey =='key_1301'" class="appendix-title"> 附件：设备信息<span class="appendix-notice">（自动展示“设备&润滑点&用油信息”）</span></div>
        <!-- {{chuixiLevel}}    -->
        <div v-if="(item.nameKey!='key_1301' && item.nameKey!='key_hyzx_cxy_pds' && item.nameKey!='key_hyzx_qjj_pds' && item.nameKey!='key_hyzx_msds' ) || (item.nameKey=='key_hyzx_cxy_pds' && typeFlushingOil!='2') ||((item.nameKey=='key_hyzx_qjj_pds' || item.nameKey=='key_hyzx_msds') && chuixiLevel=='增强')" class="appendix-title">附件： {{ item.name }} 
            <span class="no-wrap" v-if="item.tip && item.tip.type == 'text'">
                <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                    <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                    <i class="el-icon-warning-outline"></i>
                    </el-button>
                </el-tooltip>
            </span>
        </div>
        <div v-if="item.type=='file' && (item.nameKey!='key_1301' && item.nameKey!='key_hyzx_cxy_pds' && item.nameKey!='key_hyzx_qjj_pds' && item.nameKey!='key_hyzx_msds' ) || (item.nameKey=='key_hyzx_cxy_pds' && typeFlushingOil!='2') ||((item.nameKey=='key_hyzx_qjj_pds' || item.nameKey=='key_hyzx_msds') && chuixiLevel=='增强')" style="margin:10px 0 20px 0">
            <el-upload
            class="upload-demo"
            action=""
            accept=".pdf"
            ref="upload"
            :file-list="fileList"
            :show-file-list="false"
            :http-request="((val)=>{handleUploadFileAttachment(val,index)})"
            :auto-upload="true">
                <el-button  type="danger" plain size="small" >+ 添加附件</el-button>
            </el-upload>
        </div>
        <el-row class="service-items-wrap" v-for="(child,index3) in item.serviceReportFileDtoList" :key="index3" style="display:flex;align-items:center;">
            <el-col :span="18">
                <div style="color:#333;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
                    <span style="color:#dd0000;">附件{{index3+1}}：</span>{{child.fileName}}
                </div>
                <div style="color:#999999;font-size:13px;line-height:13px;">
                    <span>创建人：{{child.createUserName}}</span>
                    <span style="margin-left:24px;">创建时间：{{child.createTime}}</span>
                </div>
            </el-col>
            <el-col :span="6" align='right'>
                <el-button type="text" @click="previewAttachment(child)" style='color:#001450;font-size:13px;'>预览</el-button>
                <el-button type="text" @click="deleteAttachment(item,child,index,index3)" style='color:#dd0000;font-size:13px;'>删除</el-button>
            </el-col>
        </el-row>
    </div>

</el-card>
</div>

</template>

<script>
export default {
props:{
    type:{
    type:String,
    default:()=>{
        return ''
    }
    },
    appendixName:{
    type:String,
    default:()=>{
        return ''
    }
    },
    deviceDetail:{
    type:Object,
    default:()=>{
        return ''
    }
    },
    defaultNodeDto:{
    type:Object,
    default:()=>{
        return []
    }
    },
    appendixObj:{
    type:Array,
    default:()=>{
        return []
    }
    },
    oilSituation:{
    type:Array,
    default:()=>{
        return []
    }
    },
},
data(){
    return{
        typeFlushingOil:'',  // 冲洗油类型
        chuixiLevel:'',  // 冲洗等级
        oilChangeNum:null, // 换油周期数值
        oilChangeUnit :'', // 换油周期单位
        oilChangeHour : null,   // 换油周期转换为小时
        OilChangeLastTime :'' , // 上次换油日期
        nowTimeStamp : Date.parse(new Date()),  // 当前时间的时间戳
        intervalTime: null ,  // 实际时间间隔 单位为小时
        oilChangeTimeStamp : null , // 上次换油日期转换为时间戳    
        situation:[],
        typeFlushingOilType:''
    }
},
    created(){
    },
    mounted(){
        this.typeFlushingOil = sessionStorage.getItem('valueCodeOilFushing')
        this.typeFlushingOilType = sessionStorage.getItem('typeFlushing')  // 设备冲洗类型
        let result = this.oilSituation.find(item =>{
            return item==1 || item==3 ||item==4 
        });
        if(result) {
            this.chuixiLevel = '定制'
        }
        this.situation= sessionStorage.getItem('situation')
    },
    methods:{
        handleGet (val) {
            if (val == 'valueCodeOilFushing' ) {
                this.typeFlushingOil = sessionStorage.getItem('valueCodeOilFushing')
            } 
            if (val == 'changeLevel' ) {
                this.chuixiLevel = sessionStorage.getItem('valueCodeOilLevel')
            } 
        },
        // 附件上传文件
        handleUploadFileAttachment(file,index) {
        if (!file.file.type.startsWith("application")) {
            fileList.pop();
            this.$message.error("只能上传pdf类型文件");
            return;
        }
        const isLt100M = file.file.size / 1024 / 1024 < 100;
        if (!isLt100M) {
            this.$message({
            type: "error",
            message: "请选择100M以内的文件",
            });
            this.$refs.upload.abort();
            return;
        }
        this.AddOssFile(file.file,index);
        },

        AddOssFile(file,index) {
            const loading = this.$loading({
                lock: true,
                text: "正在上传文件中，请稍后...",
                spinner: "el-icon-loading",
                background: "rgba(0, 0, 0, 0.7)",
            });
            let params = new FormData();
            params.append("multipartFiles", file);
            this.requestMethodPost("/common/business/attachment/uploadFiles", params).then((res) => {
                res = res.data;
                if (res.code == 1000) {
                    let obj={
                        filePath:res.data[0].fileUrl,
                        createUserName:res.data[0].createUserName,
                        createTime:res.data[0].createTime,
                        fileName:res.data[0].fileName,
                    }
                    this.appendixObj[index].serviceReportFileDtoList.push(obj)
                    let halfPathUrl = []
                    if(this.appendixObj[index].value) {
                        halfPathUrl = this.appendixObj[index].value.split(',')
                    }
                    halfPathUrl.push(res.data[0].fileUrl)
                    this.appendixObj[index].value = halfPathUrl.toString()
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning",
                });
                }
                loading.close();
            });
        },
        // 预览附件
        previewAttachment(item) {
            this.downLoadFile(item)
        },
        // 预览通过半路径获取全路径
        downLoadFile(item) {
            const params = {
                url: encodeURI(item.filePath),
            };
            this.requestMethodGet("/web/file/getFullUrl", params).then((res) => {
                if (res.data.code == 1000) {
                window.open(res.data.data);
                } else {
                this.$message({
                    message: res.data.msg,
                    type: "warning",
                });
                }
            });
        },
        // 删除附件
        deleteAttachment(item,child,index,indexChild) {
            let halfPathUrl = []
            if(this.appendixObj[index].value) {
                halfPathUrl = this.appendixObj[index].value.split(',')
                halfPathUrl.splice(indexChild,1)
                this.appendixObj[index].serviceReportFileDtoList.splice(indexChild,1)
            }
            if(halfPathUrl.length>0) {
                this.appendixObj[index].value = halfPathUrl.toString()
            } else {
                this.appendixObj[index].value =''
            }
        },
    }
}
</script>

<style lang='less' scoped>
.font-style {
    font-size:14px;
    font-weight:normal;
    color: #999;
}
.appendix-title ,.appendix-notice{
    font-weight: 400;
    font-size: 14px;
    color: #000;
    line-height: 32px;
    margin-top: 20px;
}
.appendix-notice {
    color: #999;
}
// 附件样式
.service-items-wrap {
    background: rgba(204, 221, 255, 0.2);
    font-weight: 400;
    color: #999;
    border: 1px solid #ccddff;
    border-radius: 6px;
    font-size: 13px;
    padding: 16px 20px;
    margin-bottom: 12px;
}
.el-card__header {
    background: #f9f9f9;
}

</style>