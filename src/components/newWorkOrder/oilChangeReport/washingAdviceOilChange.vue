<template>
<el-card class="washingAdviceOilChange" style="margin-top: 20px; border: 1px solid #ededed; border-radius: 4px">
    <div slot="header" class="title">
    <el-divider direction="vertical"></el-divider>
    <span>{{ washingAdviceOilChange }}</span>
    </div>
    <el-form :model="washingAdviceOilChangeObj" ref="oilChangeRef" label-position="top" label-width="200px" style="padding: 0 20px">
        <el-row>
        <div v-for="(item, index) in washingAdviceOilChangeObj" :key="index">
        <el-col :span="24">
            <el-form-item  v-if="item.display">
            <span slot="label" style="width: 100%;">
                <span>
                    <span v-if="item.required" class="star">*</span>
                    <span style='width:auto'> {{ item.name }}:</span>
                    <span v-if="item.unit">({{ item.unit }})</span>
                    <span v-if="item.type == 'img'">（最多上传{{ item.length }}张图片）</span>
                    <span class="no-wrap" v-if="item.tip && item.tip.type == 'text'">
                        <el-tooltip class="item" effect="dark" :content="item.tip.content" placement="top-start">
                        <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                            <i class="el-icon-warning-outline"></i>
                        </el-button>
                        </el-tooltip>
                    </span>
                    <!-- key_1352 代表的字段 冲洗时长预估，如下：-->
                    <span style="margin-left: 20px" v-if="item.type == 'string' && item.nameKey !='key_1352'">
                        {{ item.value || "暂无" }}
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
                <el-input
                    v-if="type == 'edit' && item.type == 'textarea'"
                    type="textarea"
                    placeholder="请输入"
                    v-model="item.value"
                    :maxlength="item.length"
                    style="width:80%"
                    show-word-limit
                    :autosize="autosize"
                    clearable
                />
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
                <!-- input2 数字输入框 -->
                <el-input
                v-if="item.type == 'input2' && type == 'edit' && item.display"
                style="width: 220px"
                size="small"
                @keyup.native="proving1(item)"
                :maxlength="item.length"
                v-model="item.value"
                placeholder="请输入"
                ></el-input>
            </el-form-item>
        </el-col>
            <!--  dropdown4 下边的children 处理-->
            <div v-if="item.type == 'dropdown4'">
                <div v-for="(cylinder, index) in item.children" :key="index">
                <div v-if="!cylinder.valueCodeNotDisplay || (cylinder.valueCodeNotDisplay && !cylinder.valueCodeNotDisplay.includes(item.valueCode))">
                    <el-col :span="6">
                    <el-form-item  :required="cylinder.required">
                        <span slot="label"> {{ cylinder.name }}<span v-if="cylinder.unit">({{ cylinder.unit }})</span>：
                        <span class="no-wrap" v-if="cylinder.tip && cylinder.tip.type == 'text'">
                            <el-tooltip class="item" effect="dark" :content="cylinder.tip.content" placement="top-start">
                                <el-button type="text" style="color: #333; font-size: 15px; padding: 0px">
                                    <i class="el-icon-warning-outline"></i>
                                </el-button>
                            </el-tooltip>
                        </span>
                        </span>
                        <span v-if="type == 'view'">{{ cylinder.value }}</span>
                        <el-input
                            v-if="cylinder.type == 'input1' && type == 'edit'"
                            placeholder="请输入"
                            :disabled="cylinder.disabled"
                            v-model="cylinder.value"
                            :maxlength="cylinder.length"
                            style="width: 220px"
                            show-word-limit
                            size="small"
                            clearable
                        >
                        </el-input>
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
components: {},
props: {
    type: {
    type: String,
    default: () => {
        return "";
    }
    },
    washingAdviceOilChange: {
    type: String,
    default: () => {
        return "";
    }
    },
    washingAdviceOilChangeObj: {
    type: Array,
    default: () => {
        return [];
    }
    },
    deviceObj: {
    type: Array,
    default: () => {
        return [];
    }
    },
    oilSituation: {
    type: Array,
    default: () => {
        return [];
    }
    },
    deviceDetail: {
    type: Object,
    default: () => {
        return ''
    }
    },
},
data() {
    return {
        oilSituation:this.oilSituation,
        typeFlushing:'', // 冲洗类型
        compatibilityConclusion:'',   // 相容性结论
        situation:'',
        oilChangeNum:null, // 换油周期数值
        oilChangeUnit :'', // 换油周期单位
        oilChangeHour : null,   // 换油周期转换为小时
        OilChangeLastTime :'' , // 上次换油日期
        nowTimeStamp : Date.parse(new Date()),  // 当前时间的时间戳
        intervalTime: null ,  // 实际时间间隔 单位为小时
        oilChangeTimeStamp : null , // 上次换油日期转换为时间戳
        result:false,  // 判断是否为定值
    };
},
mounted() {
    this.washingAdviceOilChangeObj.forEach(it=>{
        if(it.nameKey=='key_1295') {
            sessionStorage.setItem("valueCodeOilFushing", it.valueCode);
        }
    })
    // 获取设备冲洗类型
    this.typeFlushing = sessionStorage.getItem('typeFlushing')
    // 获取目前系统是否有如下情况
    this.situation = sessionStorage.getItem('situation')
    // 获取相容性结论
    this.compatibilityConclusion = sessionStorage.getItem('compatibilityConclusion')
    var result = this.oilSituation.find(item =>{
        return item==1 || item==3 ||item==4
    });
    if(result) {  // 如果是定制
    this.result = true
        this.washingAdviceOilChangeObj.forEach(it=>{
            if(it.nameKey=='key_1292') {
                it.value='定制'
            }
            if(it.nameKey=='key_1293') {
                it.value='建议咨询美孚专家，定制冲洗方案'
            }
            if(it.nameKey=='key_1294') {
                it.type='textarea'
                it.length=500
                it.value=''
            }
            // 清洁剂冲洗时长不展示
            if(it.nameKey=='key_1298') {
                it.display=false
            }
        })
    } else {  // 如果不是定制 要根据换油周期 和 换油间隔判断
        // 获取换油周期和换油间隔
        // 获取换油周期和换油间隔
        this.deviceObj.forEach(it=>{
            if(it.nameKey=='key_149_oil_change') {
                this.oilChangeNum = it.value
                this.oilChangeUnit = it.unit
            }
            if(it.nameKey=='lup_last_oil_change_date') {
                this.OilChangeLastTime = it.value
            }
        })
        this.getOilChangeMsg()
    }
},
created() {
},
methods: {
    getOilChangeMsg() {
        this.oilChangeTimeStamp = new Date(this.OilChangeLastTime).getTime()
        this.intervalTime = (this.nowTimeStamp-this.oilChangeTimeStamp)/1000/60/60   // 实际时间间隔 单位为小时
        // 换油周期转换为 小时
        if(this.oilChangeUnit=='小时') {
            this.oilChangeHour = this.oilChangeNum
        } else if(this.oilChangeUnit=='天') {
            this.oilChangeHour = this.oilChangeNum*24
        }else if(this.oilChangeUnit=='月') {
            this.oilChangeHour = this.oilChangeNum*24*30
        }else if(this.oilChangeUnit=='年') {
            this.oilChangeHour = this.oilChangeNum*24*30*12
        }
        this.calculateFlushingLevel(this.intervalTime,this.oilChangeHour)
    },
    handleGet (val) {
        if (val == 'changeOil' && !this.result) {
            this.typeFlushing = sessionStorage.getItem('typeFlushing')
            this.compatibilityConclusion = sessionStorage.getItem('compatibilityConclusion')
            this.situation= sessionStorage.getItem('situation')
            this.calculateFlushingLevel(this.intervalTime,this.oilChangeHour)
        }
        //
        if(val=='changeLevelRefresh') {
            this.typeFlushing = sessionStorage.getItem('typeFlushing')
            this.compatibilityConclusion = sessionStorage.getItem('compatibilityConclusion')
            this.situation= sessionStorage.getItem('situation')
            // 获取换油周期和上次换油日期
            this.$_getLubricationPointDetail ()
        }
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
                this.oilChangeNum = res.data.oilChangePeriod
                this.oilChangeUnit = res.data.oilChangePeriodUnitDesc
                this.OilChangeLastTime=res.data.lastOilChangeDate
                this.getOilChangeMsg()
            } else {
                this.$message({
                message: res.msg,
                type: 'warning'
                })
            }
            })
        .catch(res => {})
    },
    // 计算冲洗等级
    calculateFlushingLevel(intervalTime,oilChangeHour) {
        let level;
        if(this.typeFlushing=='新机冲洗') {
            level='基础'
            this.washingAdviceOilChangeObj.forEach(it=>{
                if(it.nameKey=='key_1292') {
                    it.value='基础'
                }
                if(it.nameKey=='key_1293') {
                    it.value='建议两段式冲洗'
                }
                if(it.nameKey=='key_1294') {
                    it.type='string'
                    it.value='1 排放旧油，清洁系统.2 添加冲洗油/工作油，按建议时长冲洗系统。3 排放冲洗用油，清洁系统，更换滤芯等部件。4 添加工作油，进行开机前冲洗。5 达到系统清洁度再开机运行。'
                }
                // 清洁剂冲洗时长不展示
                if(it.nameKey=='key_1298') {
                    it.display=false
                }
            })
        } else if(this.typeFlushing=='设备常规换油'){
            // 实际换油间隔≥2倍换油周期”或者“实际换油间隔超过3年”时，冲洗等级判断为“增强”；
            if(intervalTime>=(2*oilChangeHour) || (intervalTime/24/30/12)>=3) {
                level='增强'
                this.washingAdviceOilChangeObj.forEach(it=>{
                    if(it.nameKey=='key_1292') {
                        it.value='增强'
                    }
                    if(it.nameKey=='key_1293') {
                        it.value='建议添加系统清洁剂的三段式冲洗'
                    }
                    if(it.nameKey=='key_1294') {
                        it.type='string'
                        it.value='1添加专用清洁剂，随旧油运行时清洗. 2排放旧油，清洁系统. 3添加冲洗油/工作油，按建议时长冲洗系统。4排放冲洗用油，清洁系统，更换滤芯等部件。5     添加工作油，进行开机前冲洗。6     达到系统清洁度再开机运行'
                    }
                    // 清洁剂冲洗时长展示
                    if(it.nameKey=='key_1298') {
                        it.display=true
                    }
                })
                return
            }
            // 实际换油间隔≤2倍换油周期
            if(intervalTime<2*oilChangeHour) {
                this.washingAdviceOilChangeObj.forEach(it=>{
                    if(it.nameKey=='key_1292') {
                        it.value='基础'
                    }
                    if(it.nameKey=='key_1293') {
                        it.value='建议两段式冲洗'
                    }
                    if(it.nameKey=='key_1294') {
                        it.type='string'
                        it.value='1 排放旧油，清洁系统.2 添加冲洗油/工作油，按建议时长冲洗系统。3 排放冲洗用油，清洁系统，更换滤芯等部件。4 添加工作油，进行开机前冲洗。5 达到系统清洁度再开机运行。'
                    }
                    // 清洁剂冲洗时长不展示
                    if(it.nameKey=='key_1298') {
                        it.display=false
                    }
                })
            }
        } else if(this.typeFlushing=='设备用油品牌或型号更换') {
            // 如果字段-目前系统是否有如下情况，勾选了任意项”，冲洗等级判断为“基础”；
            if(this.situation.length>0) {
                level='增强'
                this.washingAdviceOilChangeObj.forEach(it=>{
                    if(it.nameKey=='key_1292') {
                        it.value='增强'
                    }
                    if(it.nameKey=='key_1293') {
                        it.value='建议添加系统清洁剂的三段式冲洗'
                    }
                    if(it.nameKey=='key_1294') {
                        it.type='string'
                        it.value='1添加专用清洁剂，随旧油运行时清洗. 2排放旧油，清洁系统. 3添加冲洗油/工作油，按建议时长冲洗系统。4排放冲洗用油，清洁系统，更换滤芯等部件。5     添加工作油，进行开机前冲洗。6     达到系统清洁度再开机运行'
                    }
                    if(it.nameKey=='key_1298') {
                        it.display=true
                    }
                })
            } else {
                if(this.compatibilityConclusion=='相容' || this.compatibilityConclusion=='边界') {
                    level='基础'
                    this.washingAdviceOilChangeObj.forEach(it=>{
                        if(it.nameKey=='key_1292') {
                            it.value='基础'
                        }
                        if(it.nameKey=='key_1293') {
                            it.value='建议两段式冲洗'
                        }
                        if(it.nameKey=='key_1294') {
                            it.value='1 排放旧油，清洁系统.2 添加冲洗油/工作油，按建议时长冲洗系统。3 排放冲洗用油，清洁系统，更换滤芯等部件。4 添加工作油，进行开机前冲洗。5 达到系统清洁度再开机运行。'
                        }
                        // 清洁剂冲洗时长不展示
                        if(it.nameKey=='key_1298') {
                            it.display=false
                        }
                    })
                }
                if(this.compatibilityConclusion=='不相容' || this.compatibilityConclusion=='未知') {
                    level='增强'
                    this.washingAdviceOilChangeObj.forEach(it=>{
                        if(it.nameKey=='key_1292') {
                            it.value='增强'
                        }
                        if(it.nameKey=='key_1293') {
                            it.value='建议添加系统清洁剂的三段式冲洗'
                        }
                        if(it.nameKey=='key_1294') {
                            it.type='string'
                            it.value='1添加专用清洁剂，随旧油运行时清洗. 2排放旧油，清洁系统. 3添加冲洗油/工作油，按建议时长冲洗系统。4排放冲洗用油，清洁系统，更换滤芯等部件。5     添加工作油，进行开机前冲洗。6     达到系统清洁度再开机运行'
                        }
                        // 清洁剂冲洗时长展示
                        if(it.nameKey=='key_1298') {
                            it.display=true
                        }
                    })
                }
            }
    }
            sessionStorage.removeItem("valueCodeOilLevel");
            sessionStorage.setItem("valueCodeOilLevel", level);
            this.$parent.fatherMethodOilLevel();
    },
    proving1(item) {
        if(item.decimalPrecision !=0) {
            if (item.rangeMin >= 0) {
                item.value = item.value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
                item.value = item.value.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
                item.value = item.value.replace(/\.{1,}/g, "."); // 只保留第一个. 清除多余的.
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
                item.value = item.value.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
                item.value = item.value.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
                item.value = item.value.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
            }
        } else {
            if (item.rangeMin >= 0) {
                item.value = item.value.replace(/[^\d.]/g, ""); // 清除"数字"和"."以外的字符
                item.value = item.value.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
                item.value = item.value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
                item.value = item.value
                .replace(/[^\d]/g,'').replace(/^0{1,}/g,''); // bu允许输入一个小数点
                item.value = item.value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, "$1$2.$3"); // 只能输入3个小数
                item.value = item.value.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
                item.value = item.value.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
                item.value = item.value.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
            } else {
                item.value = item.value.replace(/[^\-\d.]/g, ""); // 清除"数字"和"."以外的字符
                item.value = item.value.replace(/^\./g, ""); // 验证第一个字符是数字而不是.
                item.value = item.value.replace(/\.{2,}/g, "."); // 只保留第一个. 清除多余的.
                item.value = item.value
                .replace(/[^\d]/g,'').replace(/^0{1,}/g,'');// 只允许输入一个小数点
                item.value = item.value
                .replace("-", "$#$")
                .replace(/\-/g, "")
                .replace("$#$", "-"); // 只允许输入一个负号
                item.value = item.value.replace(/(\d+|\.)-/g, "$1"); // 数字和.后面不能接-,不能出现类似11-, 12.-
                item.value = item.value.replace(/(-)0+(\d+)/g, "$1$2"); // 不能出现-01,-02类似
                item.value = item.value.replace(/^0+(\d)/, "$1"); // 第一位0开头，0后面为数字，则过滤掉，取后面的数字
            }
            if(item.value>=100 && item.nameKey=='key_1296') {
                item.value= 100
            }
        }
    },
    selectDropdown4 (val) {
        let optionsData = val.fieldOption
        let index1 = optionsData.find(item => item.value == val.valueCode)
        val.value = index1.option
        val.valueCode = index1.value
        // 冲洗油 change  值会影响 附录
        if(val.nameKey=='key_1295') {
            sessionStorage.removeItem("valueCodeOilFushing");
            sessionStorage.setItem("valueCodeOilFushing", val.valueCode);
            this.$parent.fatherMethodOilType();
        }
    },
    // 验证
    validatewashingAdviceOilChangeObj() {
    const data = this.washingAdviceOilChangeObj;
    let emptyChildList = [];
    let emptyList = data.filter(item => {
        return item.required && !item.value && item.display;
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
    emptyChildList = emptyList;
    if (emptyChildList.length > 0) {
        this.$message({
        message: emptyChildList[0].name + "必填",
        type: "warning"
        });
        this.$emit("passModulValidate", "111");
    } else {
        this.$emit("passModulValidate", "washingAdviceOilChangeObj");
    }
    },
}
};
</script>

<style lang='less'>
.washingAdviceOilChange {
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
