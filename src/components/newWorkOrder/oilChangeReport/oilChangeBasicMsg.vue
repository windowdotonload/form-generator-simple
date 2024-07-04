<template>
<el-card class="oilChangeHistoryWrap" style="margin-top: 20px; border: 1px solid #ededed; border-radius: 4px">
    <div slot="header" class="title">
    <el-divider direction="vertical"></el-divider>
    <span>{{ oilChangeBasicMsg }}</span>
    </div>
    <el-form :model="oilChangeBasicMsgObj" ref="oilChangeRef" label-position="top" label-width="200px" style="padding: 0 20px">
    <el-row>
        <div v-for="(item, index) in oilChangeBasicMsgObj" :key="index">
        <el-col :span="item.type=='radio2' || item.type=='checkbox' ? '24' : '6'">
            <el-form-item >
            <span slot="label" style="width: 260px;">
                <span>
                    <span v-if="item.required" class="star">*</span>
                    <span > {{ item.name }}:</span>
                    <span v-if="item.unit">({{ item.unit }})</span>
                    <span v-if="item.type == 'img'">（最多上传{{ item.length }}张图片）</span>
                    <span class="no-wrap" v-if="item.tip && item.tip.type == 'text'">
                        <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                        <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                            <i class="el-icon-warning-outline"></i>
                        </el-button>
                        </el-tooltip>
                    </span>
                </span>
            </span>
                <!-- 普通输入框 -->
                <el-input
                    v-if="item.type == 'input1' && type == 'edit'"
                    placeholder="请输入"
                    :disabled="item.disabled"
                    v-model="item.value"
                    :maxlength="item.length"
                    style="width: 80%"
                    size="small"
                    clearable
                >
                </el-input>
                <!-- dropdown4 下拉框 -->
                <el-select
                size="small"
                v-if="type == 'edit' && item.type == 'dropdown4'"
                v-model="item.valueCode"
                style="width: 220px"
                @change="selectDropdown4(item)"
                placeholder="--请选择--"
                >
                    <el-option v-for="filed in item.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                </el-select>
                <!-- 多选框 -->
                <el-checkbox-group v-if="item.type == 'checkbox'" v-model="item.valueCheckBoxList" @change="selectId => changebox(selectId,item)" style="display: inline-block">
                    <el-checkbox v-for="btn in item.fieldOption" :label="btn.option" :key="btn.value" style="margin-bottom: 10px">{{ btn.option }}</el-checkbox>
                </el-checkbox-group>
                <!-- 单选框 -->
                <el-radio-group v-if="item.type == 'radio2'" v-model="item.valueCode"  @change="selectId => changeRadio(selectId,item)"  style="display: inline-block">
                    <el-radio v-for="btn in item.fieldOption" :label="btn.value" :key="btn.option" style="margin-bottom: 10px">{{ btn.option }}</el-radio>
                </el-radio-group>
                <!-- input2 数字输入框 -->
                <el-input
                v-if="item.type == 'input2' && type == 'edit'"
                style="width: 80%"
                size="small"
                @keyup.native="proving1(item)"
                :maxlength="item.length"
                v-model="item.value"
                placeholder="请输入"
                 ></el-input>
                <!-- radio2 children 特殊情况处理 -->
                <div v-if="item.type == 'radio2'" v-for="(cylinder, index) in item.children" :key="index">
                    <div v-if="item.valueCode == cylinder.valueCodeNotDisplay">
                        <el-form-item :label="cylinder.name + '：'" :required="cylinder.required" style="margin-top: 20px">
                        <span slot="label">
                            {{ cylinder.name }}
                            <span v-if="cylinder.unit">({{ cylinder.unit }})</span>
                            <span v-if="cylinder.type == 'img'">（最多上传{{ cylinder.length }}张图片）</span>
                        </span>
                        <span v-if="type == 'view'">{{ cylinder.value }}</span>
                        <el-input
                            v-if="cylinder.type == 'input1' && type == 'edit'"
                            placeholder="请输入"
                            :disabled="cylinder.disabled"
                            v-model="cylinder.value"
                            :maxlength="cylinder.length"
                            style="width: 80%"
                            show-word-limit
                            size="small"
                            clearable
                        >
                        </el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form-item>
        </el-col>
            <!--  dropdown4 下边的children 处理-->
            <div v-if="item.type == 'dropdown4'">
                <div v-for="(cylinder, index) in item.children" :key="index">
                <div v-if="!cylinder.valueCodeNotDisplay || (cylinder.valueCodeNotDisplay && !cylinder.valueCodeNotDisplay.includes(item.valueCode))">
                    <el-col :span="6">
                    <el-form-item>
                        <span slot="label">
                        <span v-if="cylinder.required" class="star">*</span>{{ cylinder.name }}<span v-if="cylinder.unit">({{ cylinder.unit }})</span>
                        <span class="no-wrap" v-if="cylinder.tip && cylinder.tip.type == 'text'">
                            <el-tooltip class="item" effect="dark" :content="cylinder.tip.content" placement="top-start">
                                <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                                    <i class="el-icon-warning-outline"></i>
                                </el-button>
                            </el-tooltip></span> ：
                        </span>
                        <span v-if="type == 'view'">{{ cylinder.value }}</span>
                        <el-select
                            v-if="type == 'edit' && cylinder.type == 'dropdown1'"
                            size="small"
                            clearable
                            style="width:80%" 
                            @change="(deviceId) => selectOilBrand(deviceId,cylinder )"
                            v-model="cylinder.value"
                            placeholder="--请选择--"
                        >
                            <el-option
                            v-for="dic in oilData"
                            :key="dic.code"
                            :label="dic.name"
                            :value="dic.code"
                            ></el-option>
                        </el-select>
                        <el-select
                        size="small"
                        v-if="type == 'edit' && cylinder.type == 'dropdown2'"
                        v-model="cylinder.valueCode"
                        style="width: 220px"
                        @change="selectDropdown4(cylinder)"
                        placeholder="--请选择--"
                        >
                            <el-option v-for="filed in cylinder.fieldOption" :key="filed.value" :label="filed.option" :value="filed.value"></el-option>
                        </el-select>
                        <!-- 在用油名称 -->
                        <el-select v-if="type == 'edit' && cylinder.type == 'dropdown' && cylinder.nameKey=='key_1287'" size="small" ref="cascaderRef" v-model="cylinder.valueCode" placeholder="请先选择更换后工作用油品牌" clearable filterable remote :loading="loadingRemote" :remote-method="getOilList" @change="oilNameChange(cylinder,`cascaderRef`)" style="width:80%">
                          <el-option v-for="item in oilNameList" :key="item.code" :label="item.oilAlias" :value="item.code"></el-option>
                        </el-select>
                        <!-- <el-cascader
                            v-if="type == 'edit' && cylinder.type == 'dropdown' && cylinder.nameKey=='key_1287'"
                            ref='cascaderRef'
                            :options="oilNameList"
                            v-model="cylinder.valueCode"
                            :key="oilNameKey"
                            size="small"
                            style="width:80%" 
                            placeholder="请先选择更换后工作用油品牌"
                            :show-all-levels="false"
                            @change="oilNameChange(cylinder,`cascaderRef`)"
                            :props="{ 
                            value:'oilNumber',
                            label:'oilName',
                            children:'children'
                            }"
                            clearable>
                            </el-cascader> -->
                    </el-form-item>
                    </el-col>
                </div>
                </div>
            </div>
        </div>
    </el-row>
    </el-form>
</el-card>
</template>

<script>
export default {
components: {  },
props: {
    type: {
    type: String,
    default: () => {
        return "";
    }
    },
    oilChangeBasicMsg: {
    type: String,
    default: () => {
        return "";
    }
    },
    oilChangeBasicMsgObj: {
    type: Array,
    default: () => {
        return [];
    }
    }
},
data() {
    return {
        loadingRemote: false,
        oilNameList:[],
        oilData:[]
    };
},
mounted() {
    // 找出dropdown1类型  要调取通用下拉接口
    this.getOilName()
    
    this.oilChangeBasicMsgObj.forEach(it=>{
        // 设备冲洗类型
        if(it.nameKey=='key_1285') {
            sessionStorage.removeItem("typeFlushing");
            sessionStorage.setItem("typeFlushing", it.value);
            this.$parent.fatherMethodOil();
        }
        // 目前系统是否有如下情况
        if(it.nameKey=='key_1291') {
            sessionStorage.removeItem("situation");
            sessionStorage.setItem("situation", it.valueCheckBoxList);
            this.$parent.fatherMethodOil();
        }
        if(it.nameKey=='key_1285') {
            it.children.forEach(itChild=>{
                // 相容性结论
                if(itChild.nameKey=='key_1288') {
                    sessionStorage.removeItem("compatibilityConclusion");
                    sessionStorage.setItem("compatibilityConclusion", itChild.value);
                    this.$parent.fatherMethodOil();
                }
                // 用油品牌
                if(itChild.nameKey=='key_1286' && itChild.valueCode) {
                    this.getOilList(itChild.valueCode)
                }
            })
        }
    })
},
created() {
},
methods: {
    proving1(item) {
        if (item.rangeMin >= 0) {
            item.value = item.value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
            item.value = item.value.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
            item.value = item.value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
            item.value = item.value
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", "."); // 只允许输入一个小数点
            item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
            item.value = item.value.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
            item.value = item.value.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
            item.value = item.value.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
        } else {
            item.value = item.value.replace(/[^\-\d.]/g, ""); // 清除"数字"和"."以外的字符
            item.value = item.value.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
            item.value = item.value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
            item.value = item.value
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", "."); // 只允许输入一个小数点
            item.value = item.value
            .replace("-", "$#$")
            .replace(/\-/g, "")
            .replace("$#$", "-"); // 只允许输入一个负号
            item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
            item.value = item.value.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
            item.value = item.value.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
            item.value = item.value.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
        }
    },
     // 多选框的change 事件
    changebox(val,item) {
        sessionStorage.removeItem("situation");
        sessionStorage.setItem("situation", val);
        this.$parent.fatherMethodOil();
    },
    // dropdown4 的下拉框事件
    selectDropdown4 (val) {
        let optionsData = val.fieldOption
        let index1 = optionsData.find(item => item.value == val.valueCode)
        val.value = index1.option
        val.valueCode = index1.value
        // 如果是相容性
        if(val.nameKey=='key_1288' && val.valueCode=='4') {
            this.$confirm('建议测试油品相容性，请咨询美孚经销商。', '提示', {
                confirmButtonText: '知道了',
                showCancelButton:false,
                }).then(() => {
                }).catch(() => {    
                });
        }
        // 设备冲洗类型
        if(val.nameKey=='key_1285') {
            sessionStorage.removeItem("typeFlushing");
            sessionStorage.setItem("typeFlushing", val.value);
            this.$parent.fatherMethodOil();
        }
        if(val.nameKey=='key_1288') {
            sessionStorage.removeItem("compatibilityConclusion");
            sessionStorage.setItem("compatibilityConclusion", val.value);
            this.$parent.fatherMethodOil();
        }
    },
    // 获取dropdown1类型的dic下拉数据源
    getOilName(){
        this.requestMethodGet("/mdm/oil/queryOilList",{status: 1,parentCode:0 }).then(res=>{
            res=res.data
            if(res.code == 1000){
            this.oilData = res.data
            }else{
            this.$message({
                message: res.msg,
                type: "warning"
            });
            }
        })
    }, 
    // 用油品牌下拉事件
    selectOilBrand(val,item) {
        let index = this.oilData.findIndex(it=>it.oilNumber==val)
        console.log(this.oilData[index])
        item.value = this.oilData[index].nameCn
        item.valueCode = val
        this.getOilList(val)
    },
    // 获取油品下拉
    getOilList(val){
        this.loadingRemote = true
        this.requestMethodGet("/mdm/oil/queryOilListByPage", {oilName:val, status:1, size:200, current:1})
            .then(res => {
            res = res.data;
            this.loadingRemote = false
            if (res.code == 1000) {
                this.oilNameList = res.data.list
            } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                  });
                }
            })
        .catch(res => {});
    },
     // 用油名称改变
    oilNameChange(item){
        if(item) {
            const checkedData = this.$refs.cascaderRef[0].getCheckedNodes()[0]
            let oilNameValueCode = []
            let oilBrandValueCode = item.valueCode[0]
            if(oilBrandValueCode == 'oil_0001'){//美孚
            if(checkedData.path.length != 4){
                this.$message({
                message:'请选择更换后工作用油名称',
                type:'warning'
                })
                item.valueCode = ''
                return
            }else{
                item.value = checkedData.label
                item.valueCode = checkedData.path[checkedData.path.length-1]
            }
            }else{
            if(checkedData.path.length != 3){
                this.$message({
                message:'请选择更换后工作用油名称',
                type:'warning'
                })
                item.valueCode = ''
                return
            }else{
                item.value = checkedData.label
                item.valueCode = checkedData.path[checkedData.path.length-1]
            }
            }
        }
    },
    changeRadio(val,item) {
        console.log(val,item)
        item.value=val
    },
    // 验证
    validateoilChangeBasicMsgObj() {
    const data = this.oilChangeBasicMsgObj;
    let dropdown4List = [];
    let radio2List=[]
    let dropdown4ListChildNotValue = [];
    let emptyChildList = [];
    // 第一层必填未填写的
    let emptyList = data.filter(item => {
        return item.required && !item.value && item.type!='checkbox' && item.type!='radio2';
    });

    // 找出   input2   类型
    const dataType = data.filter(item => {
        return item.type == "input2";
    });
    let isNotNum = [];
    dataType.forEach(it => {
        if (it.value) {
        let obj = {};
        if (parseFloat(it.value).toString() == "NaN") {
            obj.name = it.name;
            obj.value = it.value;
            isNotNum.push(obj);
        }
        }
    });
    if (isNotNum.length > 0) {
        this.$message({
        message: isNotNum[0].name + "值应为数字",
        type: "warning"
        });
        return;
    }
    // 找出radio2 的children
    data.forEach(item => {
        if (item.type == "radio2" && item.children.length>0) {
            radio2List.push(item);
        }
    });
    radio2List.forEach(it5 => {
        it5.children.forEach(itChild4=>{
            if(itChild4.required && !itChild4.value && (!itChild4.valueCodeNotDisplay || (itChild4.valueCodeNotDisplay &&  itChild4.valueCodeNotDisplay==it5.valueCode))) {
                dropdown4ListChildNotValue.push(itChild4)
            }
        })
    });
    // 找出dropdown4类型
    data.forEach(item => {
        if (item.type == "dropdown4" && item.children.length>0) {
        dropdown4List.push(item);
        }
        if(item.type=='checkbox'  &&  item.required && item.valueCheckBoxList.length == 0) {
            emptyList.push(item)
        }
        if(item.type=='radio2'  &&  item.required && !item.valueCode) {
            emptyList.push(item)
        }
    });
    dropdown4List.forEach(it5 => {
        it5.children.forEach(itChild4=>{
            if(itChild4.required && !itChild4.value && (!itChild4.valueCodeNotDisplay || (itChild4.valueCodeNotDisplay &&  !itChild4.valueCodeNotDisplay.includes(it5.valueCode)))) {
                dropdown4ListChildNotValue.push(itChild4)
            }
        })
    });
    emptyChildList = emptyList.concat(dropdown4ListChildNotValue);
    if (emptyChildList.length > 0) {
        this.$message({
        message: emptyChildList[0].name + "必填",
        type: "warning"
        });
        this.$emit("passModulValidate", "111");
    } else {
        this.$emit("passModulValidate", "oilChangeBasicMsgObj");
    }
    },
}
};
</script>

<style lang='less'>
.oilChangeHistoryWrap {
.noUploadBtn .el-upload--picture-card {
    display: none;
}
.el-divider--vertical {
    width: 3px;
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
    display: flex;
}
.star {
    color: #f56c6c;
    font-size: 14px;
    margin-right: 2px;
}
.no-wrap {
    margin-left: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
}
.el-upload-list__item {
    transition: none !important;
}
.el-upload-list__item-thumbnail {
    width: 148px;
    height: 148px;
    object-fit: cover;
}
}
</style>
