<template>
    <el-card class="appendix-content" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
        <div slot="header" class="title">
            <div style="display:flex;align-items:center">
            <el-divider direction="vertical"></el-divider>
            <span>{{appendixName}}</span>
            </div>
        </div>
        <!-- 表单循环展示 -->
        <el-form label-position="top" label-width="120px" :model="appendixNode" ref="appendixForm">
        <div v-for="(item,index) in appendixNode" :key="index">
            <!-- 描述,附件 -->
            <el-row :gutter="10" v-if="item.display">
                <div v-for="(child,index1) in item.children">
                    <el-col :span="24" >
                        <el-form-item>
                        <div slot="label" style="display:flex;align-items:center">
                            <span style="color: #f56c6c;font-size: 14px;margin-right: 2px;" v-if="child.required">*</span>
                            <span>{{child.name}}</span>
                            <span style="margin:0 8px 0 4px">{{index}}</span>
                            <el-link v-if="child.nameKey=='key_1363' && item.children.length>1" style="color:#dd0000;" @click="deleteItem(child)">删 除</el-link>
                        </div>
                        <el-input
                            v-if="child.type == 'textarea'"
                            type="textarea"
                            placeholder="请输入"
                            v-model="child.value"
                            :maxlength="child.length"
                            show-word-limit
                            :autosize="autosize"
                            clearable
                            style="width:100%">
                        </el-input>
                        <!-- 附件 -->
                        <el-upload
                            v-if="child.type == 'file'"
                            class="upload-demo"
                            :auto-upload="false"
                            :show-file-list="false"
                            :on-change="(file,fileList)=>handleAddFile(file,fileList,child,index,index1)"
                            :limit="10"
                            accept=".pdf"
                            :on-exceed="handleExceed">
                            <el-button size="small">点击上传</el-button>
                        </el-upload>
                        <!-- 附件列表 -->
                        <el-row class="service-items-wrap" v-for="(fileItem,index3) in child.serviceReportFileDtoList" :key="index3" style="display:flex;align-items:center;" v-if="child.serviceReportFileDtoList.length">
                            <el-col :span="18">
                                <div style="color:#333;font-size:14px;line-height:14px;margin-bottom:12px;font-weight:bold;">
                                    <span style="color:#dd0000;">附件{{index3+1}}：</span>{{fileItem.fileName}}
                                </div>
                                <div style="color:#999999;font-size:13px;line-height:13px;">
                                    <span>创建人：{{fileItem.createUserName}}</span>
                                    <span style="margin-left:24px;">创建时间：{{fileItem.createTime}}</span>
                                </div>
                            </el-col>
                            <el-col :span="6" align='right'>
                                <el-button type="text" @click="previewAttachment(fileItem)" style='color:#001450;font-size:13px;'>预览</el-button>
                                <el-button type="text" @click="handleRemove(child,fileItem,child,index,index1,index3)" style='color:#dd0000;font-size:13px;'>删除</el-button>
                            </el-col>
                        </el-row>
                        </el-form-item>      
                    </el-col>
                </div>
                <!-- 删除附录 -->
                <div  style="float:right;" >
                    <el-button size="small" type="text"  @click="deleteItemAppendix(index)" style="margin-bottom:10px;color:#dd0000;">删除附录</el-button>
                </div>
                
            </el-row>
            <!-- 添加附录 -->
            <div v-if="index==appendixNode.length-1 ">
                <el-button size="small"  @click="addItem" style="margin-bottom:10px;">添加附录</el-button>
            </div>
        </div>
        <!-- 添加附录 -->
        <div v-if="appendixNode.length==0">
            <el-button size="small"  @click="addItem" style="margin-bottom:10px;">添加附录</el-button>
        </div>
        </el-form>
    </el-card>
</template>

<script>
import OSSClient from '../../../utils/ossClient'
const oss_client = new OSSClient();
export default {
props:{
    // 附录节点字段
    appendixNode:{
    type:Array,
    default:()=>{
        return []
    }
    },
    appendixName:{
        type:String,
        default:()=>{
            return []
        }
    },
    addAppendixObj:{
        type:Object,
        default:()=>{
            return {}
        }
    },
    dynamicItemDto: {
        type: Object,
        default: () => {
            return []
        }
    },
},
data() {
    return {
        userInfo:JSON.parse(this.Decrypt(sessionStorage.getItem('userInfo')))
    };
},
watch:{
},
created(){
},
methods: {
    //  添加
    addItem(){
        this.dynamicItemDto.dynamic5.display = true
        const obj = _.cloneDeep(this.dynamicItemDto.dynamic5)
        console.log(this.appendixNode)
        obj.uid = _.uniqueId('appendix_')
        this.appendixNode.push(obj)
        console.log('this.appendixNode',this.appendixNode)
    },
    // 删除附录
    deleteItemAppendix(index){
        this.appendixNode.splice(index,1)
    },
    // 删除
    deleteItem(val){
        console.log('val',val)
        this.appendixNode[0].children.forEach((it,index)=>{
            if(it.uid == val.uid){
            this.appendixNode[0].children.splice(index,1)
            }
        })
    },
    // 上传附件
    async handleAddFile(file,fileList,child,index,index1){
    const fileType = file.name.split('.')[1]
    if(fileType.toLowerCase() != 'pdf'){
        this.$message({
        type:'warning',
        message:'请上传pdf文件'
        })
        return
    }
    await oss_client.getOSSClientInstance('service_report_file');
    const uploadFileRes = await oss_client.uploadFile(file.raw, file.raw.name)
    console.log(this.appendixNode,child,index,index1)
        let obj = {}
        obj.fileName = file.name
        obj.filePath = uploadFileRes.name
        obj.createUserName = this.userInfo.userName
        obj.createTime = this.formatDate(new Date())
        obj.uid = _.uniqueId('file_')
        this.appendixNode[index].children[index1].serviceReportFileDtoList.push(obj)
    },
    // 删除附件
    handleRemove(child,fileItem,item,index,index1,index2){
    console.log(child,fileItem)
        this.appendixNode[index].children[index1].serviceReportFileDtoList.splice(index2,1)
    },
    // 预览
    previewAttachment(fileItem){
    console.log('fileItem',fileItem)
    const params = {
        url: fileItem.filePath,
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
    // 超出限制
    handleExceed(files, fileList){
    this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件`);
    },
    // 校验附录
    validateAppendix(){
    let appendixCheck = []
    let appendixChildCheck = []
    let appendixChild2Check = []
    let totalCheckList = []
    let isPass = false
    const data = this.appendixNode
    data.forEach(it=>{
        if(it.display) {
            it.children.forEach(item=>{
                appendixChild2Check.push(item)
            })
        }
        
    })
    appendixChild2Check.forEach(yChild=>{
        if((yChild.type== "textarea" && _.isEmpty(yChild.value)) || (yChild.type== "file" && _.isEmpty(yChild.serviceReportFileDtoList))){
            appendixChildCheck.push(yChild)
        }
                    
    })
    totalCheckList = appendixCheck.concat(appendixChildCheck)
    if(totalCheckList.length){
        this.$message({
        message: totalCheckList[0].nodeName + '-'  + totalCheckList[0].name + '必填',
        type: 'warning'
        })
    }else{
        isPass = true
    }
    return isPass
    },
}
};
</script>
<style lang='less' scoped>
.el-divider--vertical {
    width:3px;
}
.el-divider {
    background-color: #dd0000;
    position: relative;
}
.title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
}
/deep/.el-card__header {
    background: #f9f9f9;
}
/deep/ .el-form-item__content {
    width: 100%;
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
    margin-top:20px;
    margin-bottom: 12px;
}
</style>