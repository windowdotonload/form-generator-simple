<template>
<el-card class="researchBasicMsgInfo" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header" class="title" style="display:flex;align-items:center;justify-content: space-between;">
    <div>
        <el-divider direction="vertical"></el-divider>
        <span>{{ researchBasicMsgName }}</span>
    </div>
    </div>
    <el-form :model="researchBasicMsgObj" ref="deviceRef" label-position="left" style="padding:0 20px;">
    <el-row>
        <div v-for="(item, index) in researchBasicMsgObj" :key="index">
        <el-col  :span="8"   v-if="item.display && item.type == 'string'">
            <el-form-item :label="item.name">
            <span slot="label">
                <div>
                <span v-if="item.required" class="star">*</span>
                <span v-else class="star" style="color:white;">*</span>
                <span>{{ item.name }}</span>
                </div>
            </span>
            <div class="no-wrap" v-if="item.type == 'string' && item.value" style="margin-left:10px;">
                <el-tooltip class="item" effect="dark" :content="item.value" placement="top-start">
                <span>{{ item.value }}{{ item.unit }}</span>
                </el-tooltip>
            </div>
            <span v-if="item.type == 'string' && !item.value && item.required" style="color:#dd0000;font-family:MicrosoftYaHei;margin-left:10px;">暂无，请补充</span>
            <span v-if="item.type == 'string' && !item.value && !item.required && item.nameKey!='key_1321'" style="color:#666;font-family:MicrosoftYaHei;margin-left:10px;">暂无</span>
            </el-form-item>
        </el-col>
        <el-col :span="6" v-if="item.type == 'datepicker3'">
            <el-form-item :label="item.name" :required="item.required">
                <el-date-picker
                    v-model="item.value"
                    type="date"
                    value-format="yyyy-MM-dd"
                    style="width:220px"
                    size="small"
                    placeholder="选择日期"
                >
                </el-date-picker>
            </el-form-item>
        </el-col>
        <el-col :span="20" v-if="item.type == 'textarea'">
            <div style="font-size:14px;color:#606266;margin-bottom:10px;"><span v-if="item.required" class="star">*</span>{{ item.name }}</div>
            <el-form-item :required="item.required">
                <el-input
                placeholder="请输入"
                :disabled="item.disabled"
                v-model="item.value"
                :maxlength="item.length"
                type="textarea"
                style="width: 100%"
                size="big"
                show-word-limit
                clearable
                >
                </el-input>
            </el-form-item>
        </el-col>
        <el-col
            :span="24"
            v-if="
            item.display && item.type == 'string1' 
            "
        >
            <el-form-item :label="item.name">
                <span slot="label">
                    <div>
                    <span v-if="item.required" class="star">*</span>
                    <span>{{ item.name }}</span>
                    </div>
                </span>
            </el-form-item>
        </el-col>
        <el-col v-if="item.type == 'string1' && item.children.length>0" >
            <el-row v-for="(itemChild, index1) in item.children" :key="index1" >
                <el-col :span="8"  v-for="(itemChild2, index1) in itemChild.children" :key="index1">
                    <el-form-item :label="itemChild2.name">
                        <span slot="label">
                            <div>
                            <span v-if="itemChild2.required" class="star">*</span>
                            <span>{{ itemChild2.name }}</span>
                            </div>
                        </span>
                        <el-input
                            v-if="itemChild2.type == 'input1' "
                            placeholder="请输入"
                            v-model="itemChild2.value"
                            :maxlength="itemChild2.length"
                            style="width: 220px;"
                            size="small"
                            clearable
                        >
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-top:-5px;" v-if="index1>1">
                    <el-button @click="deletePerson(index,index1)" size="small" type="text" style="color:#001450;font-size:14px;">
                        <img src="../../../assets/delete-icon.png" alt="" style="width:22px;">
                    </el-button>
                </el-col>
            </el-row>
            <div v-if="item.type == 'string1' && item.children.length>0">
                <el-button @click="addPerson" size="small" type="text" style="color:#001450;font-size:14px;">+ 添加人员</el-button>
            </div>
        </el-col>
    </div>
    </el-row>
    </el-form>
    
</el-card>
</template>

<script>
export default {
components: {  },
props: {
    researchBasicMsgName: {
    type: String,
    default: () => {
        return ''
    }
    },
    researchBasicMsgObj: {
    type: Array,
    default: () => {
        return []
    }
    },
    dynamicItemDto: {
        type: Object,
        default: () => {
            return []
        }
    },
},
data () {
    return {
        value:''
    }
},
mounted () {},
created () {
    
},
methods: {
    // 添加调研人员
    addPerson() {
        console.log(this.dynamicItemDto)
        const data = JSON.parse(JSON.stringify(this.dynamicItemDto.dynamic6))
        data._uid = Date.now()
        let index = this.researchBasicMsgObj.findIndex(it=>it.nameKey=='key_1444')
        this.researchBasicMsgObj[index].children.push(data)
    },
    // 删除调研人员
    deletePerson(index,index1) {
        this.researchBasicMsgObj[index].children.splice(index1,1)
    },
    // 验证
    validateResearchBasicMsg() {
        let isPass = false
        const data = this.researchBasicMsgObj;
        let childrenNotValue=[]

        let childData=[]
        let child2Data=[]
        let totalCheckList=[]
        const emptyList = data.filter(item => {
            return item.required && !item.value;
        });
        data.forEach(it=>{
            if(it.children.length>0) {
            it.children.forEach(itChild=>{
                childData.push(itChild)
            })
            }
        })
        childData.forEach(itChild3=>{
            itChild3.children.forEach(itChild2=>{
                child2Data.push(itChild2)
            })
        })
        childrenNotValue= child2Data.filter(item => {
            return item.required && !item.value;
        });
        totalCheckList = childrenNotValue.concat(emptyList)
        if (totalCheckList.length > 0) {
            this.$message({
            message: totalCheckList[0].name + "必填",
            type: "warning"
            });
            return;
        } else {
            isPass = true
        }
        return isPass
    }
}
}
</script>

<style lang='less'>
.researchBasicMsgInfo {
.el-form-item {
    display: flex;
    align-items: center;
}
.title {
    font-family: MicrosoftYaHei-Bold;
    font-size: 14px;
    color: #000;
    line-height: 14px;
    font-weight: bold;
    display: flex;
}
.el-form-item__content {
    line-height: 27px !important;
    width: 100%;
}
.el-form-item__label {
    width: 120px;
}
.star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
}
.el-card__header {
    background: #f9f9f9;
}
.el-divider--vertical {
    width: 3px;
}
.el-divider {
    background-color: #dd0000;
    position: relative;
}
.noUploadBtn .el-upload--picture-card {
    display: none;
}

.el-upload-list__item {
    transition: none !important;
}
}
</style>
<style lang="less" scoped>
.el-upload-list--picture-card .el-upload-list__item-actions {
opacity: 1 !important;
background-color: rgba(0, 0, 0, 0.2);
}
.uploadMask {
opacity: 0;
}
.uploadMask:hover {
opacity: 1;
}
.researchBasicMsgInfo .el-upload-list__item-thumbnail {
width: 148px;
height: 148px;
object-fit: cover;
}
</style>
