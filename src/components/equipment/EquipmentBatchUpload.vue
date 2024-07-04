<template>
    <div class="customer-profile" :style="mainminheight">
        <div style="font-size:15px;line-height:60px;margin-top:-20px;font-weight:bold;">正在为{{companyName}}批量导入设备</div>
        <el-form :model="fileListForm" ref="fileListForm" :rules="fileListFormRules">
            <el-table 
            :data="fileListForm.fileList"
            v-loading="loading"
            :height="tableHeight"
            ref="customerTable"
            :key="key"
            row-key="id"
            tooltip-effect="dark"
            style="width: 100%"
            :cell-style="finalCellStyle"
            :header-cell-style="{background:'#f7f7f7'}"
            stripe>
                <el-table-column type="index" label="序号"></el-table-column>
                <el-table-column label="设备名称" width="150" prop="deviceName">
                    <template slot="header">
                        <span class="star">*</span>
                        <span class="starName">设备名称</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.deviceName'"
                        :rules='fileListFormRules.deviceName'>
                            <el-input v-model="scope.row.deviceName" size="mini" maxlength="50"  @change="changeDeviceName(scope.row)"   placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="设备类型大类" min-width="200" prop="deviceType1Code">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">设备类型大类</span>
                    </template>
                    <template slot-scope="{row,$index}">
                        <el-form-item
                        :prop="'fileList.' + $index + '.deviceType1Code'"
                        :rules='fileListFormRules.deviceType1Code'>
                            <el-select v-model="row.deviceType1Code" size="mini"   value-key
                            filterable 
                            @change="(deviceType1Code) => changeDeviceCateParent(deviceType1Code, row)" placeholder="请选择">
                                <el-option
                                v-for="item in typeList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="设备类型子类" min-width="200" prop="deviceType2Code">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">设备类型子类</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.deviceType2Code'"
                        :rules='fileListFormRules.deviceType2Code'>
                            <el-select v-model="scope.row.deviceType2Code" size="mini"  
                            @focus="lubricationPointTypeSmallFocus(scope.row)"
                            :no-data-text='noDataText'
                            filterable 
                            @change="(deviceType2Code) => deviceTypeSmallChange(deviceType2Code,scope.row)"  placeholder="请选择">
                                <el-option
                                v-for="item in typeSmallList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="制造商" min-width="150" prop="manufacturer">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.manufacturer'"
                        :rules='fileListFormRules.manufacturer'>
                            <el-input v-model="scope.row.manufacturer" maxlength="50"  @change="manufacturerChange(scope.row)"   size="mini"  placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="设备型号" min-width="150" prop="deviceModel">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.deviceModel'"
                        :rules='fileListFormRules.deviceModel'>
                            <el-input v-model="scope.row.deviceModel" size="mini" maxlength="50"  @change="deviceModelChange(scope.row)"    placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="润滑点名称" min-width="200" prop="lubricationPointName">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.lubricationPointName'"
                        :rules='fileListFormRules.lubricationPointName'>
                            <el-input v-model="scope.row.lubricationPointName" size="mini" maxlength="50"   @change="lubricationPointNameChange(scope.row)"   placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="润滑点设备类型" min-width="200" prop="lubricationPointType2Code">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">润滑点设备类型</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.lubricationPointType1Code'"
                        :rules='fileListFormRules.lubricationPointType1Code'>
                            <el-select size="small" clearable v-model="scope.row.lubricationPointType1Code" placeholder="--请选择--" @change="(lubricationPointType2Code) => lubricationPointTypeBigChange(lubricationPointType2Code, scope.row)">
                                <el-option
                                    v-for="item in lubricationPointTypeList"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="换油/加脂周期" min-width="130" prop="oilChangePeriod">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">换油/加脂周期</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.oilChangePeriod'"
                        :rules="[{ required: true, message: '请输入换油/加脂周期', trigger: 'blur' },{pattern:/^[0-9]*[1-9][0-9]*$/,message: '请正确输入换油/加脂周期', trigger: 'blur'}]" >
                            <el-input v-model="scope.row.oilChangePeriod" size="mini"  maxlength="6"  @change="OilWeekChange(scope.row)"  placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="换油/加脂周期单位" min-width="150" prop="oilChangePeriodUnit">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">换油/加脂周期单位</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.oilChangePeriodUnit'"
                        :rules='fileListFormRules.oilChangePeriodUnit'>
                            <el-select v-model="scope.row.oilChangePeriodUnit" size="mini"   
                            @change="(oilChangePeriodUnit) => oilChangePeriodUnitChange(oilChangePeriodUnit, scope.row)"
                            placeholder="请选择">
                                <el-option
                                v-for="item in oilChangePeriodList"
                                :key="item.oilChangePeriodUnit"
                                :label="item.oilChangePeriodUnitDesc"
                                :value="item.oilChangePeriodUnit">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="油箱容量" min-width="100" prop="oilBoxCapacity">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">油箱容量</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.oilBoxCapacity'"
                        :rules='fileListFormRules.oilBoxCapacity'>
                            <el-input v-model="scope.row.oilBoxCapacity" size="mini"    maxlength="15"
                            @change="(oilBoxCapacity) => oilBoxCapacityChange(oilBoxCapacity, scope.row)" placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="油箱容量单位" min-width="140" prop="oilBoxCapacityUnit">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">油箱容量单位</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.oilBoxCapacityUnit'"
                        :rules='fileListFormRules.oilBoxCapacityUnit'>
                            <el-select v-model="scope.row.oilBoxCapacityUnit" size="mini" 
                            @change="(oilBoxCapacityUnit) => oilBoxCapacityUnitChange(oilBoxCapacityUnit, scope.row)" placeholder="请选择">
                                <el-option
                                v-for="item in oilBoxCapacityList"
                                :key="item.oilBoxCapacityUnit"
                                :label="item.oilBoxCapacityUnitDesc"
                                :value="item.oilBoxCapacityUnit">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="在用油品牌" min-width="140" prop="oilBrandName">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">在用油品牌</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.oilBrandName'"
                        :rules='fileListFormRules.oilBrandName'>
                            <el-select v-model="scope.row.oilBrandName" size="mini"  
                            @change="(oilBrandName) => deviceRecommendChange(oilBrandName, scope.row)"  placeholder="请选择">
                                <el-option
                                v-for="item in oilBrandList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="润滑点设备名称" min-width="150" prop="lubricationPointName">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.lubricationPointName'"
                        :rules='fileListFormRules.lubricationPointName'>
                            <el-input v-model="scope.row.lubricationPointName" size="mini" maxlength="50"   @change="LubricationDeviceNameChange(scope.row)"   placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="描述" min-width="300" prop="lubricationPointDesc">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.lubricationPointDesc'"
                        :rules='fileListFormRules.lubricationPointDesc'>
                            <el-input v-model="scope.row.lubricationPointDesc" maxlength="200" size="mini"  @change="describeChange(scope.row)"   placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="设备制造商推荐油品" min-width="150" prop="recommendOilName">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.recommendOilName'"
                        :rules='fileListFormRules.recommendOilName'>
                            <el-input v-model="scope.row.recommendOilName" size="mini" maxlength="50"  @change="oilRecommendChange(scope.row)"   placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="润滑/加脂方式" min-width="150" prop="lubricationMethod">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.lubricationMethod'"
                        :rules='fileListFormRules.lubricationMethod'>
                            <el-select v-model="scope.row.lubricationMethod" size="mini"  
                            @change="(deptId) => lubricationMethodChange(deptId, scope.row)"   placeholder="请选择">
                                <el-option
                                v-for="item in methodsList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="预计下次换油/加脂日期" min-width="190" prop="oilPlanDate">
                    <template slot="header" slot-scope="scope">
                        <span class="star">*</span>
                        <span class="starName">预计下次换油/加脂日期</span>
                    </template>
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.oilPlanDate'"
                        :rules='fileListFormRules.oilPlanDate'>
                            <el-date-picker
                                v-model="scope.row.oilPlanDate"
                                type="date"
                                @change="expectedNextDateChange(scope.row)"
                                size="small"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="上次换油/加脂日期" min-width="190" prop="lastOilChangeDate">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.lastOilChangeDate'"
                        :rules='fileListFormRules.lastOilChangeDate'>
                            <el-date-picker
                                v-model="scope.row.lastOilChangeDate"
                                type="date"
                                @change="lastAddOilDateChange(scope.row)"
                                size="small"
                                placeholder="请选择">
                            </el-date-picker>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="加注量" min-width="140" prop="fillingQuantity">
                    <template slot-scope="scope">
                        <el-form-item   
                        :prop="'fileList.' + scope.$index + '.fillingQuantity'"
                        :rules='fileListFormRules.fillingQuantity'>
                            <el-input v-model="scope.row.fillingQuantity" size="mini" style="width:70%;" maxlength="8"  @change="quantityChange(scope.row)"    placeholder="请输入"></el-input>
                            <span>{{scope.row.oilBoxCapacityUnit}}</span>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="在用油名称" min-width="160" prop="currentOilName">
                    <template slot-scope="scope">
                        <el-form-item
                        :prop="'fileList.' + scope.$index + '.currentOilName'"
                        :rules='fileListFormRules.currentOilName'>
                            <el-input v-model="scope.row.currentOilName" size="mini" maxlength="50"  @change="oilNameChange(scope.row)"   placeholder="请输入"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
            v-if="totalNumber"
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagenation.current"
            :page-size="pagenation.size"
            :page-sizes="[10,20,30,50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNumber"
            style="float: right;display:flex; margin-top: 10px;"
            ></el-pagination>
        </el-form>
        <div class="file-list-btn">
            <el-button type="danger" @click="submitFileList" size="small">提交</el-button>
            <el-button type="danger" plain @click="cancelFileList" size="small">返回</el-button>
        </div> 
    </div>
</template>

<script>
export default {
    data(){
        return {
            loading:false,
            totalNumber: 0, //总条数
            //  分页参数
            pagenation: {
                current: 1,
                size: 30
            },
            mainminheight: `height:${document.documentElement.clientHeight - 180}px`,
            tableHeight:`${document.documentElement.clientHeight - 240}px`,
            oilBrandList:[],  // 油品品牌数组
            typeList:[],
            typeSmallList:[],
            lubricationPointTypeList:[],  // 润滑点设备类型数组
            typeProps: {
                value: "code",
                label: "name"
            },
            fileListForm:{
                fileList:[]
            },
            fileListFormRules:{
                deviceName: [{ required: true, message: '请输入设备称号', trigger: 'blur' }],
                deviceType1Code: [{ required: true, message: '请输入设备类型大类', trigger: 'blur' }],
                deviceType2Code: [{ required: true, message: '请输入设备类型子类', trigger: 'blur' }],
                // manufacturer: [{ required: true, message: '请输入设备制造商', trigger: 'blur' }],
                // deviceModel: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
                // lubricationPointName: [{ required: true, message: '请输入润滑点名称', trigger: 'blur' }],
                lubricationPointType2Code: [{ required: true, message: '请输入润滑点设备类型', trigger: 'blur' }],
                oilChangePeriodUnit: [{ required: true, message: '请选择换油/加脂周期单位', trigger: 'change' }],
                oilBoxCapacity: [
                    { required: true, message: '请输入油箱容量', trigger: 'blur' },
                    {pattern:/^([1-9]\d*)(\.\d{1,3})?$/,message: '数值不能为空或0,且小数点后最多三位小数', trigger: 'blur'}
                ],
                oilPlanDate: [{ required: true, message: '请选择预计下次换油/加脂日期', trigger: 'change' }],
                oilBoxCapacityUnit: [{ required: true, message: '请选择油箱容量单位', trigger: 'change' }],
                oilBrandName: [{ required: true, message: '请输入在用油品牌', trigger: 'blur' }]
            },
            noDataText:'无数据',
            oilChangePeriodList:[
                {oilChangePeriodUnit:'年',oilChangePeriodUnitDesc:'年'},
                {oilChangePeriodUnit:'月',oilChangePeriodUnitDesc:'月'},
                {oilChangePeriodUnit:'天',oilChangePeriodUnitDesc:'天'},
                {oilChangePeriodUnit:'小时',oilChangePeriodUnitDesc:'小时'}
            ],
            oilBoxCapacityList:[
                {oilBoxCapacityUnit:'L',oilBoxCapacityUnitDesc:'L'},
                {oilBoxCapacityUnit:'KG',oilBoxCapacityUnitDesc:'KG'}
            ],
            methodsList: [
                { value: "循环", label: "循环" },
                { value: "飞溅", label: "飞溅" },
                { value: "喷射", label: "喷射" },
                { value: "手刷", label: "手刷" },
                { value: "油枪", label: "油枪" }   
            ],
            hasDoneTestList:[
                {hasDoneTest:true,hasDoneTestDesc:'是'},
                {hasDoneTest:false,hasDoneTestDesc:'否'}
            ],
            batchNumber:'',
            companyName:'',
            submitData:{
                batchNumber:'',
                paramList:[],  // 存放修改的数据list
            },
            changeListIdList:[]   // 存放修改数据的 id 数组
        }
    },
    created(){
        this.getParams()
    },
    mounted() {
        this.$_queryDeviceExcel();  // 查询临时数据
        this.$_queryLPData(); //查询润滑点
        this.$_queryTypeData(); //查询设备类型
        this.$_queryOilBrandData();  // 查询用油品牌
        this.$_queryTypeDataSmall()
    },
    watch: {
        '$route': 'getParams'
    },
    methods:{
        lubricationPointTypeSmallFocus(row) {
            this.typeSmallList = []
            if(row.deviceType1Code) {
                let params = {
                level:'4',
                parentCode:row.deviceType1Code
            };
            this.requestMethodGet("/web/device/queryDeviceType", params)
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    if (res.data && res.data.length > 0) {
                        let optionData = res.data;
                        optionData = optionData.map(item =>{return {'value':item.code,"label":item.name}})
                        this.typeSmallList = optionData;
                    } else {
                        this.noDataText = '无数据，请重新选择大类'
                    }
                } else {
                    this.$message({
                    message: res.msg,
                    type: "warning"
                    });
                }
                })
                .catch(res => {});
            } else {
                this.typeSmallList = []
            }
        },
        checkRequired(row) {
            if(!row.deviceName) {
                return
            } 
            if(!row.deviceType1Code) {
                return
            }
            if(!row.deviceType2Code) {
                return
            }
            if(!row.oilChangePeriod) {
                return
            }
            if(!row.lubricationPointType2Code) {
                return
            }
            if(!row.oilChangePeriodUnit) {
                return
            }
            if(!row.oilBoxCapacity) {
                return
            }
            if(!row.oilBoxCapacityUnit) {
                return
            }
            // 在用油品品牌是否选择
            if(!row.oilBrandName) {
                return
            } 
            // 预计下次换油/加脂日期是否已选
            if(!row.oilPlanDate) {
                return
            }
            row.validCode = true
        },
        // 取到路由带过来的参数
        getParams() {
            this.batchNumber = this.$route.query.batchNumber  // 获取上个页面传过来的data
        },
        // 查询临时数据
        $_queryDeviceExcel() {
            let params = {
                batchNumber:this.batchNumber,
                size:this.pagenation.size,
                current:this.pagenation.current
            };
            this.requestMethodGet("/web/device/queryDeviceExcelTmp", params)
            .then(res => {
            res = res.data;
            if (res.code == 1000) {
                this.companyName = res.data.companyName
                this.fileListForm.fileList = res.data.list;
                this.totalNumber = res.data.totalCount;
            } else {
                this.$message({
                message: res.msg,
                type: "warning"
                });
            }
            })
            .catch(res => {});
        },
        //查询在用油品牌
        $_queryOilBrandData() {
            let params = {
              parentCode: 0,
              status: 1
            };
            this.requestMethodGet("/mdm/oil/queryOilList", params)
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    if (res.data && res.data.length > 0) {
                    let optionData = res.data;
                    optionData = optionData.map(item =>{return {'value':item.code,"label":item.name}})
                    this.oilBrandList = optionData;
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
        //查询润滑点
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
        // 设置如果某行有错误数据 背景色为红色
        finalCellStyle({row, column, rowIndex, columnIndex}) {
            if (row.validCode == false) {
                return {
                    background: '#f5dbdc'
                }
            }else{
                return {
                    background: '#fff'
                }
            }
        },
        // size change
        handleSizeChange(size) {
            this.pagenation.size = size;
            this.pagenation.current = 1;
            this.$_queryDeviceExcel();
        },
        //current change
        handleCurrentChange(current) {
            this.pagenation.current = current;
            this.$_queryDeviceExcel();
        },
        // 保存修改的数据，如果之前修改过已在修改数组
        replacePreData(row) {
            if(this.changeListIdList.length != 0) {
                // 查不到这个 id
                if(this.changeListIdList.findIndex(item => item == row.id)== '-1') {
                    this.changeListIdList.push(row.id)
                    this.submitData.paramList.push(row)

                } else {  // 查得到，删除之前的数组数据
                    this.submitData.paramList.splice( this.submitData.paramList.findIndex(item => item.id === row.id), 1)
                    this.submitData.paramList.push(row)
                }
            } else {
                this.submitData.paramList.push(row)
                this.changeListIdList.push(row.id)
            }
        },
        // 设备名称 --  change 事件
        changeDeviceName(row) {
            this.checkRequired(row)
            this.replacePreData(row)
        },
        // 设备类型大类 -- change 事件
        changeDeviceCateParent(deviceType1Code,row) {
            let obj = this.typeList.find(item=> {
                return item.value == deviceType1Code
            })
            row.deviceType1Name = obj.label
            this.checkRequired(row)
            this.replacePreData(row)
            if(deviceType1Code == '') {
                this.ruleForm.deviceTypeSmall=''
            }
            if(deviceType1Code && deviceType1Code != 'device_user_defined') {
                let params = {
                level:'4',
                parentCode:deviceType1Code
            };
            this.requestMethodGet("/web/device/queryDeviceType", params)
                .then(res => {
                res = res.data;
                if (res.code == 1000) {
                    if (res.data && res.data.length > 0) {
                        let optionData = res.data;
                        optionData = optionData.map(item =>{return {'value':item.code,"label":item.name}})
                        this.typeSmallList = optionData;
                    } else {
                        this.noDataText ='请重新选择设备类型大类'
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
            this.typeCode = this.typeBigCode
        },
        // 设备类型子类 的 change 事件
        deviceTypeSmallChange(deviceType2Code,row){
            let obj2 = this.typeSmallList.find(item=> {
                return item.value == deviceType2Code
            })
            row.deviceType2Name = obj2.label
            this.checkRequired(row)
            this.replacePreData(row)
        },
        // 制造商的 change 事件
        manufacturerChange(row){
            this.replacePreData(row)
        },
        // 设备型号 change 事件
        deviceModelChange(row){
            this.replacePreData(row)
        },
        // 润滑点名称 change 事件
        lubricationPointNameChange(row){
            this.replacePreData(row)
        },
        // 润滑点设备类型大类 change 事件
        lubricationPointTypeBigChange(val,row){
            if(val.length>0) {
                var obj = {};
                obj = this.lubricationPointTypeList.find(item => {
                    return item.code === val[0];
                });
                var objChild = obj.children.find(element => {
                    return element.code == val[1];
                });
                row.lubricationPointType1Code = obj.code;
                row.lubricationPointType1Name = obj.name;
                row.lubricationPointType2Code = objChild.code;
                row.lubricationPointType2Name = objChild.name;
            }
            this.checkRequired(row)
            this.replacePreData(row)
        },
        // 换油/加脂周期  change 事件
        OilWeekChange(row){
            this.checkRequired(row)
            this.replacePreData(row)
        },
        // 换油/加脂周期单位  change 事件
        oilChangePeriodUnitChange(val,row){
            this.checkRequired(row)
            this.replacePreData(row)
        },
        // 油箱容量  change 事件
        oilBoxCapacityChange(val,row){
            this.checkRequired(row)
            this.replacePreData(row)
        },
        // 油箱容量单位  change 事件
        oilBoxCapacityUnitChange(val,row){
            this.checkRequired(row)
            this.replacePreData(row)
        },
        // 在用油品牌   change 事件
        deviceRecommendChange(val,row){
            let obj2 = this.oilBrandList.find(item=> {
                return item.value == val
            })
            row.oilBrandCode = obj2.value
            row.oilBrandName = obj2.label
            this.checkRequired(row)
            this.replacePreData(row)
        },
        //  润滑点设备名称  change 事件
        LubricationDeviceNameChange(row){
            this.replacePreData(row)
        },
        //  描述  change 事件
        describeChange(row){
            this.replacePreData(row)
        },
        // 设备制造商推荐油品  change 事件
        oilRecommendChange(row){
            this.replacePreData(row)
        },
        // 润滑/加脂方式  change 事件
        lubricationMethodChange(val,row){
            this.replacePreData(row)
        },
        // 预计下次换油/加脂日期   change 事件
        expectedNextDateChange(row){
            this.checkRequired(row)
            this.replacePreData(row)
        },
        // 上次换油/加脂日期   change 事件
        lastAddOilDateChange(row){
            this.replacePreData(row)
        },
        //  加注量  change 事件
        quantityChange(row){
            this.replacePreData(row)
        },
        //  在用油品名称  change 事件
        oilNameChange(row){
            this.replacePreData(row)
        },
        //  是否做过油品实验室检测 change 事件
        isTestChange(val,row){
            this.replacePreData(row)
        },
        //  上次油品实验室检测日期 change 事件
        lastOilChangeDataChange(row){
            this.replacePreData(row)
        },
        //查询设备类型大类
        $_queryTypeData() {
        let params = {
            level:'3'
        };
        this.requestMethodGet("/web/device/queryDeviceType", params)
            .then(res => {
            res = res.data;
            if (res.code == 1000) {
                if (res.data && res.data.length > 0) {
                let optionData = res.data;
                optionData = optionData.map(item =>{return {'value':item.code,"label":item.name}})
                this.typeList = optionData;
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
        //查询设备类型小类
        $_queryTypeDataSmall() {
        let params = {
            level:'4',
        };
        this.requestMethodGet("/web/device/queryDeviceType", params)
            .then(res => {
            res = res.data;
            if (res.code == 1000) {
                if (res.data && res.data.length > 0) {
                let optionData = res.data;
                optionData = optionData.map(item =>{return {'value':item.code,"label":item.name}})
                this.typeSmallList = optionData;
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
        //  提交
        submitFileList(){
            this.$refs['fileListForm'].validate((valid) => {
                if (valid) {
                    this.submitData.batchNumber = this.batchNumber
                    this.submitData.paramList.map( item=> {
                        delete item.updateTime
                        delete item.updateUser
                        delete item.validCode
                        delete item.batchNumber
                        delete item.delFlag
                        delete item.createTime
                        delete item.createUser
                        delete item.currentOilCode
                        delete item.recommendOilCode
                    })
                    this.requestMethodPost("/web/device/updateDeviceExcelBatch",this.submitData)
                        .then(res => {
                        res = res.data;
                            if (res.code == 1000) {
                                this.$router.push({
                                    name: "EquipmentProfile"
                                });
                            } else {
                                // 提交有错误信息 重新刷新列表
                                this.$_queryDeviceExcel();
                                this.$message({
                                    message: res.msg,
                                    type: "warning"
                                });
                            }
                        })
                        .catch(res => {});
                }else{
                    this.$message.error('请填写必填项')
                }
            })
        },
        // 返回
        cancelFileList(){
            this.$confirm("设备还未导入，是否放弃更改？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
            .then(() => {
            this.$router.push({
                name: "EquipmentProfile"
            });
            })
            .catch(() => {
            });
        },
    },
}
</script>

<style lang='less' scoped>
.customer-profile {
    padding: 20px;
    height: 100%;
    overflow: auto;
    &-serach-item {
        label {
        display: inline-block;
        text-align: right;
        padding-bottom: 10px;
        }
    }
    .el-form-item {
        margin-bottom:0px;
    }
    .star {
        color:#f56c6c;
        font-size:14px;
        margin-right: 2px;
    }
    .starName {
        font-size:14px;
        font-weight: bold;
    }
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 170px;
    }
    /deep/.el-table td:last-child {
        text-align: center ;
    }
}
.file-list-btn{
    position: fixed;
    margin-top: 20px;
    // margin-top: -32px;
}

</style>