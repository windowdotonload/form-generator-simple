<template>
<el-card class="supplementary-info" style="margin-top:20px;border:1px solid #ededed;border-radius:4px;">
    <div slot="header"  class="title">
    <el-divider direction="vertical"></el-divider>
    <span>{{moduleTitle}}</span>
    </div>
    <el-form :model="supplementaryWindForm" ref="supplementaryRef" label-position="top" label-width="200px" style="padding:0 20px;">
    <el-row>
        <div v-for="(item,index) in supplementaryWindForm" :key="index">
        <el-col :span="6">
            <el-form-item :label="item.type == 'string'? '': item.name+'：'" :required="item.required">
            <span v-if="item.type == 'string'"><span v-if="item.required" style="color:red;">* </span>{{item.name}}</span>
            <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start" v-if="item.type == 'string'">
                <el-button type="text" style="color:#333;font-size:15px;padding:0px;">
                <i class="el-icon-warning-outline"></i> :
                </el-button>
            </el-tooltip>
            <span v-if="item.type == 'string'">{{item.value}}</span>
            <span v-if="item.type == 'string' && !item.value && item.required "  style="color:#dd0000;font-family:MicrosoftYaHei;">暂无，请补充</span>
            <span v-if="item.type == 'string' && !item.value && !item.required "  style="color:#666;font-family:MicrosoftYaHei;">暂无</span>
        
            </el-form-item>
        </el-col>
    </div>
    </el-row>
    </el-form>
</el-card>
</template>

<script>
export default {
props: {
    moduleTitle: {
    type: String,
    default: () => {
        return ''
    }
    },
    deviceDetail: {
    type: Object,
    default: () => {
        return ''
    }
    },
    type: {
    type: String,
    default: () => {
        return ''
    }
    },
    supplementaryObj1: {
    type: Array,
    default: () => {
        return []
    }
    },
},
data () {
    return {
    
    supplementaryWindForm: this.supplementaryObj1
    }
},
mounted () {
},
created () {
    this.supplementaryWindForm = this.supplementaryObj1
},
methods: {
    handleGet (val){
    // 监听刷新设备信息
    console.log(val)
    if(val=='changeDeviceInfo') {
        this.$_queryEPInfo() 
        this.$_getLubricationPointDetail()
    }
    },
    // 查询设备档案详情
    $_queryEPInfo() {
    let params = {
        deviceNumber:this.deviceDetail.deviceNumber
    };
    this.requestMethodGet("/web/device/queryDevice", params)
        .then(res => {
        res = res.data;
        if (res.code == 1000) {
            this.supplementaryWindForm.forEach(it=>{
            // 风机型号
            if(it.nameKey=='fan_model' ) {
                it.value=res.data.deviceModel
            }
            // 风机制造商
            if(it.nameKey=='fan_manufacturer' ) {
                it.value=res.data.manufacturer
            }
            })
            console.log(this.supplementaryWindForm)
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
    $_getLubricationPointDetail () {
    let params = {
        lubricationPointNumber: this.deviceDetail.lubricationPointNumber
    }
    this.requestMethodGet('/web/device/queryLubricationPointDetail', params)
        .then(res => {
        res = res.data
        if (res.code == 1000) {
            this.supplementaryWindForm.forEach(it=>{
                // 再用油品名称
                if(it.nameKey=='lup_current_oil' ) {
                    it.value=res.data.currentOilName
                }
            })
            console.log(this.supplementaryWindForm)
        } else {
            this.$message({
            message: res.msg,
            type: 'warning'
            })
        }
        })
        .catch(res => {})
    },

    // 验证
    validateDevice (formName) {
    const data = this.supplementaryWindForm
    let radio5EmptyList = []
    let emptyChildList = []
    const emptyList = data.filter(item => {
        return item.required && !item.value
    })
    // 找出radio5类型
    data.forEach(item => {
        if (item.type == 'radio5' && item.value == '1') {
        radio5EmptyList = item.children.filter(it => {
            return it.required && !it.value
        })
        }
    })
    emptyChildList = emptyChildList.concat(emptyList).concat(radio5EmptyList)
    if (emptyChildList.length > 0) {
        this.$message({
        message: emptyChildList[0].name + '必填',
        type: 'warning'
        })
    } else {
        this.$emit('passModulValidate', 'suppleMentWind')
    }
    }
}
}
</script>

<style lang='less'>
.supplementary-info{
.title {
    font-family:MicrosoftYaHei-Bold;
    font-size:14px;
    color:#000;
    line-height:14px;
    font-weight:bold;
    display: flex;
}
.el-card__header {
    background: #f9f9f9;
}
.el-divider--vertical {
    width:3px;
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
.el-input-number .el-input__inner {
    text-align: left;
}
}
</style>
