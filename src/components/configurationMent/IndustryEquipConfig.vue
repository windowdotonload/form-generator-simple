<template>
    <div class="dealer-industry" :style="mainminheight">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" label-width="90px" label-position="left">
            <el-row :gutter="20" style="margin-bottom:20px;font-size:15px">
                <el-col :span="6" class="form-search-item">
                    <el-form-item label="行业">
                    <el-select size="small"  v-model="queryParams.industryCode" 
                        @change='selectIndustriesAll'
                        :filter-method='industriesAllFilter' style="width:80%;" filterable clearable  placeholder="请选择">
                        <el-option
                        v-for="item in industriesAllList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="6" class="form-search-item">
                    <el-form-item label="细分行业">
                        <el-select size="small"  v-model="queryParams.industryDetailCode" 
                            @change='selectIndustriesSegmentation'
                            :filter-method='industriesAllFilter'  style="width:80%;" filterable clearable  placeholder="请选择">
                            <el-option
                            v-for="item in industriesSegmentationList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="form-search-item">
                    <el-form-item label="设备">
                        <el-select size="small"  v-model="queryParams.deviceCode" 
                            @change='selectEquipmentAll'
                            :filter-method='industriesAllFilter' style="width:80%;" filterable clearable placeholder="请选择">
                            <el-option
                            v-for="item in equipmentAllList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="form-search-item">
                    <el-form-item label="细分设备">
                        <el-select size="small"  v-model="queryParams.deviceDetailCode" 
                            @change='selectEquipmentSegmentation'
                            :filter-method='industriesAllFilter' style="width:80%;" filterable clearable  placeholder="请选择">
                            <el-option
                            v-for="item in equipmentSegmentationList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6" class="form-search-item">
                    <el-form-item label="状态">
                    <el-select size="small" v-model="queryParams.state" @change="statesChange" placeholder="请选择状态" clearable style="width:80%;">
                        <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item> 
                </el-col>
                <el-col :span="6" >
                    <el-button @click="handleClearSearch" size="small">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-row :gutter="24">
            <el-col :span="12" align="left">
                <el-button type="danger"   @click="handleDownload"  size="small">批量下载</el-button>
            </el-col>
        </el-row>
        <!-- 表格列表 -->
        <el-row style="margin-top: 10px;width: 100%; overflow:hidden">
            <!-- 全部行业 - 数据 - 表格 -->
            <el-col :span="6" >
                <el-table
                    ref="industriesTable"
                    :key="key"
                    row-key="id"
                    :data="industriesAllData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    border
                    :height="tableheight"
                    highlight-current-row
                    @row-click='clickIndustriesAll'
                    :header-cell-style="{background:'#f7f7f7'}"
                    :max-height="600"
                    class="data-table"
                >
                    <el-table-column prop="name" label="行业" min-width="50%" align="center">
                    </el-table-column>
                    <el-table-column    :render-header="renderHeader"  min-width="50%" align="center">
                        
                    </el-table-column>
                </el-table>
            </el-col>
            <!-- 细分行业 - 数据 - 表格 -->
            <el-col :span="6">
                <el-table
                    ref="industriesSegmentationTable"
                    :key="key"
                    row-key="id"
                    :data="industriesSegmentationData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    highlight-current-row
                    :height="tableheight"
                    @row-click='clickIndustriesSegmentation'
                    :header-cell-style="{background:'#f7f7f7'}"
                    border
                    :max-height="600"
                    class="data-table"
                >
                    <el-table-column prop="name" label="细分行业" min-width="50%" align="center">
                    </el-table-column>
                    <el-table-column   :render-header="renderHeaderType" min-width="50%" align="center">
                        
                    </el-table-column>
                </el-table>
            </el-col>
            <!-- 全部设备 - 数据 - 表格 -->
            <el-col :span="6">
                <el-table
                    ref="equipmentTable"
                    :key="key"
                    row-key="id"
                    :data="equipmentAllData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    class="data-table"
                    :height="tableheight"
                    highlight-current-row
                    :max-height="600"
                    @row-click='clickEquipmentAll'
                    :header-cell-style="{background:'#f7f7f7'}"
                    border
                >
                    <el-table-column prop="name" label="设备" min-width="50%" align="center">
                    </el-table-column>
                    <el-table-column  :render-header="renderHeaderSeries" min-width="50%" align="center">
                        
                    </el-table-column>
                </el-table>
            </el-col>
            <!-- 细分设备 - 数据 - 表格 -->
            <el-col :span="6">
                <el-table
                    ref="equipmentSegmentationTable"
                    :key="key"
                    row-key="id"
                    :data="equipmentSegmentationData"
                    class="data-table"
                    :height="tableheight"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @row-click='clickNameItem'
                    highlight-current-row
                    :max-height="600"
                    :header-cell-style="{background:'#f7f7f7'}"
                    border
                >
                    <el-table-column prop="name" label="细分设备" min-width="50%" align="center">
                       
                    </el-table-column>
                    <el-table-column  :render-header="renderHeaderOil" min-width="50%" align="center">
                        
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!-- 新增油品 -->
        <AddDeviceType
            :addOilDialog="addOilDialog"
            :addType="addType"
            :dialogTitle="dialogTitle"
            :addOilForm="addOilForm"
            :state = 'queryParams.state'
            :selectIndustryDetailObj="selectIndustryDetailObj"
            v-on:addOrEditDevice="addOrEditDevice"
            v-on:closeDialogAdd="closeDialogAdd"
            ref="child"
        />
    </div>
</template>

<script>
import AddDeviceType from "./components/AddDeviceType";
import { baseRemoteOauth2 } from '@/api/api'
export default {
    industriesAllName: "HelloWorld",
    components: { AddDeviceType },
    data() {
        return {
            mainminheight: `height:${document.documentElement.clientHeight- 140}px`, 
            hidden: true,
            EPDataDisBtn:false, // 启用 禁用得按钮权限
            addType:'',
            addOilDialog: false, // 手动添加油品弹框
            dialogTitle:'',
            queryParams: {
                state:'1',
                industryCode:'',
                industryDetailCode:'',
                deviceCode:'',
                deviceDetailCode:''
            },  // 设备/行业配置表单搜索
            // 手动添加油品弹框
            addOilForm: {
                oilBrand: "",
                oilType: "",
                oilName: ""
            },
            industriesAllList: [],      // 搜索栏 全部行业数据
            addClick:true,  // 点击添加  true 按钮展示
            isClickDisabled:true,
            searchDisabled:false,
            clickUse:false, // 启用图标是否展示
            isClickUse:false,  // 启用按钮是否可以展示    false 是 不可点  true 可点
            industriesSegmentationList: [], // 搜索栏 细分行业数据
            equipmentAllList: [],        // 搜索栏 全部设备数据
            equipmentSegmentationList: [], // 搜索栏 细分设备数据
            statusList: [{ value: "0", label: "禁用" },{  value: "1", label: "启用"}], //状态
            industriesAllData: [],   // 全部行业  -  数据表格
            industriesSegmentationData:[],   // 细分行业  -  数据表格
            equipmentAllData:[],  // 全部设备 - 数据表格
            equipmentSegmentationData:[],  // 细分设备 - 数据表格
            currentRow: null,
            equipmentAllAdd:false,  // 全部设备 - 添加 按钮是否可以点击  false 不可点  true 可点
            equipmentSegmentationAdd:false,   // 细分设备 - 添加 按钮是否可以点击  false 不可点  true 可点
            tableheight: `${document.documentElement.clientHeight- 370}px` ,
            selectIndustryObj:{},  // 选定的行业对象
            selectIndustryDetailObj:{},  // 选定的细分行业对象
            selectDeviceObj:{},  // 选定的设备对象
            selectDeviceDetailObj:{},  // 选定的细分设备对象
        };
    },
    computed: {},
    methods: {
      // 下载
      handleDownload () {
        const loading = this.$loading({
          lock: true,
          text: '数据下载中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let paramObj = {
          deviceCode: this.queryParams.deviceCode,
          deviceDetailCode: this.queryParams.deviceDetailCode,
          industryCode: this.queryParams.industryCode,
          industryDetailCode: this.queryParams.industryDetailCode,
          state: this.queryParams.state,
          responseTypeBlob: true
        }
        this.requestMethodGet("/web/config/industryDevice/exportIndustryDevice", paramObj).then(res => {
          let data = res.data
          let fileReader = new FileReader()
          let that = this
          loading.close()
          fileReader.onload = function () {
            try {
              let jsonData = JSON.parse(this.result) // 说明是普通对象数据，后台转换失败
              if (jsonData.code) {
                that.$message({
                  message: jsonData.msg,
                  type: 'error'
                })
                return
              }
            } catch (err) {
              // 解析成对象失败，说明是正常的文件流
              const blob = new Blob([res.data], {
                type: 'application/vnd.ms-excel'
              })
              const objectUrl = URL.createObjectURL(blob)
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = objectUrl
              link.setAttribute('download', '设备类型.xlsx')
              document.body.appendChild(link)
              link.click()
            }
          }
          fileReader.readAsText(data) 
        })
        .catch((res) => {
          loading.close()
        });
      },
        // 全部行业 change 事件 
        selectIndustriesAll() {
            this.industriesSegmentationData=[];   // 清空细分行业数组@
            this.equipmentAllData=[];   // 清空设备选择数组
            this.equipmentSegmentationData=[];   // 清空设备细分数组
            this.queryParams.industryDetailCode= '';
            this.queryParams.deviceCode= '';
            this.queryParams.deviceDetailCode= '';
            this.selectIndustryObj={};  // 选定的行业对象
            this.selectIndustryDetailObj={};  // 选定的细分行业对象
            this.selectDeviceObj={};  // 选定的设备对象
            this.selectDeviceDetailObj={};  // 选定的细分设备对象
            if(!this.queryParams.industryCode) {
                this.industriesAllFilter('')
                this.queryParams.industryDetailCode= '';
                this.queryParams.deviceCode= '';
                this.queryParams.deviceDetailCode= '';
                this.equipmentAllList=[];   // 清空全部设备选择数组
                this.equipmentSegmentationList=[];        // 清空细分设备选择数组
                this.industriesSegmentationList=[]
                this.searchTableData()
                return
            }
            
            this.searchTableData()
            // 调取 细分行业 的数据接口
            this.refreshIndustrieDetail(this.queryParams.industryCode,'industriesSegmentation')
            
            this.equipmentAllList=[];   // 清空全部设备选择数组
            this.equipmentSegmentationList=[];        // 清空细分设备选择数组
        },
        // 细分行业的 change 事件 判断 全部行业 是否为空
        selectIndustriesSegmentation() {
            this.equipmentAllData=[];   // 清空设备选择数组
            this.equipmentSegmentationData=[];   // 清空设备细分数组\
            this.queryParams.deviceCode= '';
            this.queryParams.deviceDetailCode= '';
            this.selectIndustryDetailObj={};  // 选定的细分行业对象
            this.selectDeviceObj={};  // 选定的设备对象
            this.selectDeviceDetailObj={};  // 选定的细分设备对象
            if(!this.queryParams.industryDetailCode) {
                this.queryParams.deviceCode= '';
                this.queryParams.deviceDetailCode= '';
                this.equipmentAllList=[];   // 清空全部设备选择数组
                this.equipmentSegmentationList=[];        // 清空细分设备选择数组
                this.searchTableData()
                return
            }
            this.searchTableData()
             // 调取 全部设备 的数据接口
             this.refreshIndustrieDetail(this.queryParams.industryDetailCode,'device')
            this.equipmentSegmentationList=[];        // 清空细分设备选择数组
        },
        // 全部设备的 change 事件 判断 全部行业和细分行业 是否为空
        selectEquipmentAll() {
            this.equipmentSegmentationData=[];   // 清空设备细分数组
            this.queryParams.deviceDetailCode= '';
            this.selectDeviceObj={};  // 选定的设备对象
            this.selectDeviceDetailObj={};  // 选定的细分设备对象
            if(!this.queryParams.deviceCode) {
                
                this.equipmentSegmentationList=[];        // 清空细分设备选择数组
                this.searchTableData()
                return
            }
            this.searchTableData()
            // 调取 细分设备 的数据接口
            this.refreshIndustrieDetail(this.queryParams.deviceCode,'deviceDetail')
        },
        selectEquipmentSegmentation() {
            this.searchTableData()
        },
        // 状态切换
        statesChange(val) {
            this.queryParams.state = val;
            if(this.queryParams.state == 0) {
                this.searchDisabled = false;
                this.addClick = true;  // 点击添加  true 按钮展示
            } else {
                this.searchDisabled = false;
                this.clickUse = false;  // 启用图标是否展示   false 不展示
            }
            this.searchTableData()
            this.$refs.industriesTable.setCurrentRow()
            this.$refs.industriesSegmentationTable.setCurrentRow()
            this.$refs.equipmentTable.setCurrentRow()
            this.$refs.equipmentSegmentationTable.setCurrentRow()
            this.selectIndustryObj={};  // 选定的行业对象
            this.selectIndustryDetailObj={};  // 选定的细分行业对象
            this.selectDeviceObj={};  // 选定的设备对象
            this.selectDeviceDetailObj={};  // 选定的细分设备对象

        },
        // 刷新细分行业
        refreshIndustrieDetail(val,type) {
            this.requestMethodGet("/web/config/industryDevice/queryIndustryDeviceListOnStage",{parentCode:val}).then(res => {
                if(res.data.code == 1000) {
                    let optionData = res.data.data
                    optionData = optionData.map(item =>{return {'value':item.code,"label":item.name}})
                    if(type=='industriesSegmentation') {
                        this.industriesSegmentationList = optionData;
                    }
                    if(type=='device') {
                        this.equipmentAllList = optionData;
                    }
                    if(type=='deviceDetail') {
                        
                        this.equipmentSegmentationList = optionData;
                    }
                    
                }
            }).catch(res => {
            });
        },
        // 新建设备类型或者编辑设备类型保存
        addOrEditDevice(formName) {
            console.log(formName)
            // 如果是新建，调取新建保存接口
            if(this.addType=='addIndustry' || this.addType=='addSubdivideIndustries' || this.addType=='addEquip' || this.addType=='addSubdivideEquip') {
                this.addDevice(formName)
            } 
            // 如果是编辑，调取编辑保存接口
            if(this.addType=='editIndustry' || this.addType=='editSubdivideIndustries' || this.addType=='editEquip' || this.addType=='editSubdivideEquip') {
                this.editDevice(formName)
            } 
        },
        // 编辑设备类型
        editDevice(formName) {
            console.log(formName)
            const params={}
            // 编辑行业
            if(this.addType=='editIndustry') {
                params.industryCode = formName.industry
                params.level='1';
                params.name=formName.industryName;
            }
            // 编辑细分行业
            if(this.addType=='editSubdivideIndustries') {
                params.level='2';
                params.name=formName.subdivideIndustryName;
                params.industryCode=formName.industry;
                params.industryDetailCode=formName.subdivideIndustry;
            }
            // 编辑设备
            if(this.addType=='editEquip') {
                params.level='3';
                params.name=formName.equipNameAdd;
                params.industryCode=formName.industry;
                params.industryDetailCode=formName.subdivideIndustry;
                params.deviceCode=formName.equip;
            }
            // 编辑细分设备
            if(this.addType=='editSubdivideEquip') {
                params.level='4';
                params.name=formName.subdivideEquipName;
                params.industryCode=formName.industry;
                params.industryDetailCode=formName.subdivideIndustry;
                params.deviceCode=formName.equip;
                params.deviceDetailCode=formName.subdivideEquip;
            }
            this.requestMethodPost("/web/config/industryDevice/updateIndustryDevice",params).then(res => {
                if(res.data.code == 1000) {
                    // 获取 行业 数据
                    if(this.addType=='editIndustry') {
                        this.$message({
                            message: "行业编辑成功",
                            type: "success"
                        });
                        this.industriesAllFilter('')
                        this.getAllData()
                    }
                    // 编辑细分行业
                    if(this.addType=='editSubdivideIndustries') {
                        this.$message({
                            message: "细分行业编辑成功",
                            type: "success"
                        });
                        this.refreshIndustry();
                        // 调取 细分行业 的数据接口
                        this.refreshIndustrieDetail(this.queryParams.industryCode,'industriesSegmentation')
                    }
                    // 编辑设备
                    if(this.addType=='editEquip') {
                        this.$message({
                            message: "设备编辑成功",
                            type: "success"
                        });
                        // 调取 设备 的数据接口
                        this.refreshIndustrieDetail(this.queryParams.industryDetailCode,'device')
                        this.refreshAllDevice()
                    }
                    // 编辑细分设备
                    if(this.addType=='editSubdivideEquip') {
                        this.$message({
                            message: "细分设备编辑成功",
                            type: "success"
                        });
                        this.refreshIndustrieDetail(this.queryParams.deviceCode,'deviceDetail')
                        this.getSearchDeviceList()
                    }
                    this.addOilDialog = false
                }else {
                    this.$message.error(res.data.msg);
                }
            }).catch(res => {
            });
        },
        // 新建设备类型
        addDevice(formName) {
            const params={}
            // 新建行业
            if(this.addType=='addIndustry') {
                params.level='1';
                params.name=formName.industryName;
                params.parentCode="company_industry";
            }
            // 新建细分行业
            if(this.addType=='addSubdivideIndustries') {
                params.level='2';
                params.name=formName.subdivideIndustryName;
                params.parentCode=formName.industry;
            }
            // 新建设备
            if(this.addType=='addEquip') {
                params.level='3';
                params.name=formName.equip;
                params.parentCode=formName.subdivideIndustry;
            }
            // 新建细分设备
            if(this.addType=='addSubdivideEquip') {
                params.level='4';
                params.name=formName.equipName;
                params.parentCode=formName.equip;
            }
            this.requestMethodPost("/web/config/industryDevice/addIndustryDevice",params).then(res => {
                if(res.data.code == 1000) {
                    // 获取 行业 数据
                    if(this.addType=='addIndustry') {
                        this.getAllData()
                        this.industriesAllFilter('')
                        this.$message({
                            message: "行业新建成功",
                            type: "success"
                        });
                    }
                    // 新建细分行业
                    if(this.addType=='addSubdivideIndustries') {
                        this.$message({
                            message: "细分行业新建成功",
                            type: "success"
                        });
                        // 调取 细分行业 的数据接口
                        this.refreshIndustrieDetail(this.queryParams.industryCode,'industriesSegmentation')
                        this.refreshIndustry();
                    }
                    // 新建设备
                    if(this.addType=='addEquip') {
                        this.$message({
                            message: "设备新建成功",
                            type: "success"
                        });
                        // 调取 设备 的数据接口
                        this.refreshIndustrieDetail(this.queryParams.industryDetailCode,'device')
                        this.refreshAllDevice();
                    }
                    // 新建细分设备
                    if(this.addType=='addSubdivideEquip') {
                        this.$message({
                            message: "细分设备新建成功",
                            type: "success"
                        });
                        this.refreshIndustrieDetail(this.queryParams.deviceCode,'deviceDetail')
                        this.getSearchDeviceList()
                    }
                    this.addOilDialog = false
                } else if(res.data.code == 4307){
                    this.$confirm(res.data.msg, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                        // 新建细分行业
                        if(this.addType=='addSubdivideIndustries') {
                            this.forceSaveData('2',formName.subdivideIndustryName,formName.industry)
                        }
                         // 新建设备
                        if(this.addType=='addEquip') {
                            this.forceSaveData('3',formName.equip,formName.subdivideIndustry)
                        }
                        // 新建细分设备
                        if(this.addType=='addSubdivideEquip') {
                            this.forceSaveData('4',formName.equipName,formName.equip)
                        }
                      }).catch(err => {
                        console.log(err)
                        this.refreshIndustry()
                      })
                    
                } else {
                    this.$message.error(res.data.msg);
                    this.refreshIndustry();
                }
            }).catch(res => {
            });
        },
        // 关闭添加自定义油品弹框
        closeDialogAdd() {
            Object.assign(this.$data.addOilForm, this.$options.data().addOilForm)
            this.addOilDialog = false;
        },
        // 新增行业 - 数据 - 表格
        addItemIndustry() {
            this.addOilDialog=true
            this.dialogTitle = '新建设备类型'
            this.addType = 'addIndustry'
            this.addOilForm= {
                industry: ''
            }
        },
        // 编辑行业
        editItemIndustry() {
            console.log(this.selectIndustryObj)
            if(JSON.stringify(this.selectIndustryObj) == "{}") {
                this.$message.warning('请选择行业再进行编辑');
                return
            }
            this.addOilDialog=true
            this.dialogTitle = '编辑设备类型'
            this.addOilForm= {
                industry: this.selectIndustryObj.code
            }
            this.addType = 'editIndustry'
            this.$refs.child.getOilBrandData()

        },
        // 启用行业
        enableItemIndustry() {
            
            if(JSON.stringify(this.selectIndustryObj) == "{}") {
                this.$message.warning('请选择行业再进行启用操作');
                return
            }
            this.startUseItem(this.selectIndustryObj)
        },
        // 禁用行业
        forbiddenItemIndustry() {
            if(JSON.stringify(this.selectIndustryObj) == "{}") {
                this.$message.warning('请选择行业再进行禁用操作');
                return
            }
            this.disabledItem(this.selectIndustryObj)
        },
        
        // 编辑细分行业
        editItemSubdivideIndustries() {
            if(JSON.stringify(this.selectIndustryDetailObj) == "{}" || JSON.stringify(this.selectIndustryObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业再进行编辑');
                return
            }
            this.addOilDialog=true
            this.dialogTitle = '编辑设备类型'
            this.addOilForm= {
                oilBrand: this.selectIndustryObj.code,
                oilType: this.selectIndustryDetailObj.code,
                oilName: ""
            }
            this.$refs.child.getQueryIndustrySearchDeviceList(1, this.selectIndustryObj.code,'segmentedIndustry')
            this.addType = 'editType'

        },
        // 禁用细分行业
        forbiddenItemSubdivideIndustries() {
            if(JSON.stringify(this.selectIndustryDetailObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业再进行禁用');
                return
            }
            this.disabledItem(this.selectIndustryDetailObj)
        },
        // 启用细分行业
        enableItemSubdivideIndustries() {
            if(JSON.stringify(this.selectIndustryDetailObj) == "{}" || JSON.stringify(this.selectIndustryObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业再进行启用');
                return
            }
            if(this.selectIndustryObj.state=='0') {
                this.$confirm('您启用的设备类型上级已禁用！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            this.startUseItem(this.selectIndustryDetailObj)
        },
        // 设备点击新增
        addEquip() {
            if(JSON.stringify(this.selectIndustryDetailObj) == "{}" || JSON.stringify(this.selectIndustryObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业再进行新建');
                return
            }
            if(this.selectIndustryDetailObj.state=='0') {
                this.$confirm('您新建的设备类型上级已禁用！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            this.addOilDialog=true
            this.dialogTitle = '新建设备类型'
            this.addOilForm= {
                industry: this.selectIndustryObj.code,
                subdivideIndustry: this.selectIndustryDetailObj.code
            }
            this.$refs.child.getOilBrandData()
            this.$refs.child.getQueryIndustrySearchDeviceList(1, this.selectIndustryObj.code,'segmentedIndustry')
            this.addType = 'addEquip'
        },
        // 细分行业点击新增
        addItemSubdivideIndustries() {
            if(JSON.stringify(this.selectIndustryObj) == "{}") {
                this.$message.warning('请确保已选择行业再进行新建');
                return
            }
            if(this.selectIndustryObj.state=='0') {
                this.$confirm('您新建的设备类型上级已禁用！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            this.addOilDialog=true
            this.dialogTitle = '新建设备类型'
            this.addOilForm= {
                industry: this.selectIndustryObj.code
            }
            this.addType = 'addSubdivideIndustries'
            this.$refs.child.getOilBrandData()
        },
        // 细分行业点击编辑
        editItemSubdivideIndustries() {
            if(JSON.stringify(this.selectIndustryDetailObj) == "{}" || JSON.stringify(this.selectIndustryObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业再进行编辑');
                return
            }
            this.addOilDialog=true
            this.dialogTitle = '编辑设备类型'
            this.addOilForm= {
                industry: this.selectIndustryObj.code,
                subdivideIndustry: this.selectIndustryDetailObj.code,
            }
            this.addType = 'editSubdivideIndustries'
            this.$refs.child.getOilBrandData()
            this.$refs.child.getQueryIndustrySearchDeviceList(1, this.selectIndustryObj.code,'segmentedIndustry')
        },
        // 设备点击编辑
        editEquip() {
            if(JSON.stringify(this.selectDeviceObj) == "{}" || JSON.stringify(this.selectIndustryObj) == "{}" || JSON.stringify(this.selectIndustryDetailObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业、设备再进行编辑');
                return
            }
            this.addOilDialog=true
            this.dialogTitle = '编辑设备类型'
            this.addOilForm= {
                industry: this.selectIndustryObj.code,
                subdivideIndustry: this.selectIndustryDetailObj.code,
                equip: this.selectDeviceObj.code
            }
            this.$refs.child.getOilBrandData()
            this.$refs.child.getQueryIndustrySearchDeviceList(1, this.selectIndustryObj.code,'segmentedIndustry')
            this.$refs.child.getQueryIndustrySearchDeviceList(2, this.selectIndustryDetailObj.code,'equip')
            this.addType = 'editEquip'
        },
        // 启用设备
        enableEquip() {
            if(JSON.stringify(this.selectDeviceObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业、设备再进行启用');
                return
            }
            if(this.selectIndustryDetailObj.state=='0') {
                this.$confirm('您启用的设备类型上级已禁用！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            this.startUseItem(this.selectDeviceObj)
        },
        // 禁用设备
        forbiddenEquip() {
            if(JSON.stringify(this.selectDeviceObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业、设备再进行禁用');
                return
            }
            this.disabledItem(this.selectDeviceObj)
        },
        // 细分设备 点击 新增
        addItemSubdivideEquip() {
            if(JSON.stringify(this.selectDeviceObj) == "{}" || JSON.stringify(this.selectIndustryObj) == "{}" || JSON.stringify(this.selectIndustryDetailObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业、设备再进行新建');
                return
            }
            if(this.selectDeviceObj.state=='0') {
                this.$confirm('您新建的设备类型上级已禁用！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            this.addOilDialog=true
            this.dialogTitle = '新建设备类型'
            this.addOilForm= {
                industry: this.selectIndustryObj.code,
                subdivideIndustry: this.selectIndustryDetailObj.code,
                equip: this.selectDeviceObj.code
            }
            this.$refs.child.getOilBrandData()
            this.$refs.child.getQueryIndustrySearchDeviceList(1, this.selectIndustryObj.code,'segmentedIndustry')
            this.$refs.child.getQueryIndustrySearchDeviceList(2, this.selectIndustryDetailObj.code,'equip')
            this.addType = 'addSubdivideEquip'
        },
        // 编辑细分设备
        editItemSubdivideEquip() {
            if(JSON.stringify(this.selectDeviceDetailObj) == "{}" || JSON.stringify(this.selectIndustryObj) == "{}" || JSON.stringify(this.selectIndustryDetailObj) == "{}" || JSON.stringify(this.selectDeviceObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业、设备、细分设备再进行编辑');
                return
            }
            console.log(this.selectDeviceDetailObj)
            this.addOilDialog=true
            this.dialogTitle = '编辑设备类型'
            this.addOilForm= {
                industry: this.selectIndustryObj.code,
                subdivideIndustry: this.selectIndustryDetailObj.code,
                equip: this.selectDeviceObj.code,
                subdivideEquip: this.selectDeviceDetailObj.code
            }
            this.$refs.child.getOilBrandData()
            this.$refs.child.getQueryIndustrySearchDeviceList(1, this.selectIndustryObj.code,'segmentedIndustry')
            this.$refs.child.getQueryIndustrySearchDeviceList(2, this.selectIndustryDetailObj.code,'equip')
            this.$refs.child.getQueryIndustrySearchDeviceList(3, this.selectDeviceObj.code,'equipSubdivide')
            this.addType = 'editSubdivideEquip'
        },
        // 禁用细分设备
        forbiddenItemSubdivideEquip() {
            if(JSON.stringify(this.selectDeviceDetailObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业、设备、细分设备再进行禁用');
                return
            }
            this.disabledItem(this.selectDeviceDetailObj)
        },
        // 启用细分设备
        enableItemSubdivideEquip() {
            if(JSON.stringify(this.selectDeviceDetailObj) == "{}") {
                this.$message.warning('请确保已选择行业、细分行业、设备、细分设备再进行启用');
                return
            }
            if(this.selectDeviceObj.state=='0') {
                this.$confirm('您启用的设备类型上级已禁用！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            this.startUseItem(this.selectDeviceDetailObj)
        },
        
        // 获取全部行业数据
        getAllData() {
            this.requestMethodGet("/web/config/industryDevice/queryIndustryDeviceList",{state:this.queryParams.state}).then(res => {
                if(res.data.code == 1000) {
                    this.industriesAllData = res.data.data.industryList;
                    this.industriesSegmentationData = [];
                    this.equipmentAllData = [];
                    this.equipmentSegmentationData = [];
                }
            }).catch(res => {
            });
        },
        // 全部行业的远程搜索事件
        industriesAllFilter(val) {
            this.requestMethodGet("/web/config/industryDevice/queryIndustryDeviceListByFuzzy",{name:val,level:1}).then(res => {
                if(res.data.code == 1000) {
                    let optionData = res.data.data
                    optionData = optionData.map(item =>{return {'value':item.code,"label":item.name}})
                    this.industriesAllList = optionData;
                }
            }).catch(res => {
            });
        },

        //  搜索表单
        searchTableData() {
            this.requestMethodGet("/web/config/industryDevice/queryIndustryDeviceList",this.queryParams).then(res => {
                if(res.data.code == 1000) {
                    if(this.queryParams.industryCode=='' && this.queryParams.industryDetailCode==''  && this.queryParams.deviceCode=='' && this.queryParams.deviceDetailCode=='') {
                        this.industriesAllData = res.data.data.industryList;
                        this.industriesSegmentationData = [];
                        this.equipmentAllData = [];             // 清空全部设备数组
                        this.equipmentSegmentationData=[];      // 清空细分设备数组
                    }
                    console.log(this.selectIndustryObj)
                    if(this.queryParams.industryCode) {
                        this.industriesAllData = res.data.data.industryList;
                        this.industriesSegmentationData = res.data.data.industryDetailList;
                        if(this.queryParams.industryDetailCode) {
                            this.industriesSegmentationData = res.data.data.industryDetailList;
                            this.equipmentAllData = res.data.data.deviceList;
                            if(this.queryParams.deviceCode) {
                                this.equipmentAllData = res.data.data.deviceList;
                                this.equipmentSegmentationData = res.data.data.deviceDetailList;
                                if(this.queryParams.deviceDetailCode) {
                                    this.equipmentSegmentationData = res.data.data.deviceDetailList;
                                }
                            }
                        }
                    } 
                    this.$refs.industriesTable.setCurrentRow()
                    this.$refs.industriesSegmentationTable.setCurrentRow()
                    this.$refs.equipmentTable.setCurrentRow()
                    this.$refs.equipmentSegmentationTable.setCurrentRow()
                }
            }).catch(res => {
            });
        },
        // 重置表单
        handleClearSearch() {
            // 其他搜索条件清空   状态设置为  启用
            this.queryParams = {
                state:"1",
                industryCode:'',
                industryDetailCode:'',
                deviceCode:'',
                deviceDetailCode:''
            };
            this.$refs.industriesTable.setCurrentRow()
            this.searchDisabled = false;
            this.selectIndustryObj={};  // 选定的行业对象
            this.selectIndustryDetailObj={};  // 选定的细分行业对象
            this.selectDeviceObj={};  // 选定的设备对象
            this.selectDeviceDetailObj={};  // 选定的细分设备对象
            this.industriesSegmentationList= [], // 搜索栏 细分行业数据
            this.equipmentAllList= [],        // 搜索栏 全部设备数据
            this.equipmentSegmentationList= [], // 搜索栏 细分设备数据
            this.industriesAllList= []   // 搜索栏 全部行业数据
            this.industriesAllFilter('')
            this.getAllData();
        },
        // 禁用 数据
        disabledItem(row) {
            console.log(row)
            this.checkDisableIndustryDevice(row)
            
        },
        // 禁用校验
        checkDisableIndustryDevice(row) {
            this.requestMethodGet("/web/config/industryDevice/checkDisableIndustryDevice",{code:row.code,level:row.level}).then(res => {
                if(res.data.code == 1000) {
                    this.$confirm('确定要禁用这条数据吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.requestMethodPost("/web/config/industryDevice/forbiddenIndustryDevice",{code:row.code}).then(res => {
                            if(res.data.code == 1000) {
                                this.$message({
                                    message: "禁用设备类型成功",
                                    type: "success"
                                });
                                this.$refs.industriesTable.setCurrentRow()
                                this.selectIndustryObj={};  // 选定的行业对象
                                this.selectIndustryDetailObj={};  // 选定的细分行业对象
                                this.selectDeviceObj={};  // 选定的设备对象
                                this.selectDeviceDetailObj={};  // 选定的细分设备对象
                                // 获取全部行业数据
                                this.getAllData();

                                this.searchTableData();
                            }
                        }).catch(res => {
                        });
                    }).catch(() => {
                    });
                    
                } else{
                    this.$confirm('您禁用的设备类型有启用下级设备类型，是否全部禁用?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.requestMethodPost("/web/config/industryDevice/forbiddenIndustryDevice",{code:row.code}).then(res => {
                            if(res.data.code == 1000) {
                                this.$message({
                                    message: "禁用设备类型成功",
                                    type: "success"
                                });
                                this.$refs.industriesTable.setCurrentRow()
                                this.selectIndustryObj={};  // 选定的行业对象
                                this.selectIndustryDetailObj={};  // 选定的细分行业对象
                                this.selectDeviceObj={};  // 选定的设备对象
                                this.selectDeviceDetailObj={};  // 选定的细分设备对象
                                // 获取全部行业数据
                                this.searchTableData();
                            }
                        }).catch(res => {
                        });
                        
                    }).catch(() => {
                    });
                }
            }).catch(res => {
            });
        },
        
        
        // 启用数据
        startUseItem(row) {
            this.$confirm('确定要启用这条数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.requestMethodGet("/web/config/industryDevice/updateStatusByCode",{code:row.code}).then(res => {
                        if(res.data.code == 1000) {
                            this.$message({
                                message: "启用设备类型成功",
                                type: "success"
                            });
                            this.$refs.industriesTable.setCurrentRow()
                            this.selectIndustryObj={};  // 选定的行业对象
                            this.selectIndustryDetailObj={};  // 选定的细分行业对象
                            this.selectDeviceObj={};  // 选定的设备对象
                            this.selectDeviceDetailObj={};  // 选定的细分设备对象
                            this.industriesSegmentationList= [], // 搜索栏 细分行业数据
                            this.equipmentAllList= [],        // 搜索栏 全部设备数据
                            this.equipmentSegmentationList= [], // 搜索栏 细分设备数据
                            this.industriesAllList= []   // 搜索栏 全部行业数据
                            this.industriesAllFilter('')
                            // 获取全部行业数据
                            this.searchTableData();
                        }
                    }).catch(res => {
                    });
                }).catch(() => {       
                });
        },
        // 行业 - 点击新增
        renderHeader() {
            if( JSON.stringify(this.selectIndustryObj) != "{}" && this.selectIndustryObj.state=='0' && this.EPDataDisBtn) {
                return (
                    <div>
                    <el-button  onClick={this.enableItemIndustry}  style='border:none;background:none;padding:0px;color:#999;' >
                        启用
                    </el-button>
                    </div>
                )
            } else if(((JSON.stringify(this.selectIndustryObj) != "{}" && this.selectIndustryObj.state=='1') || JSON.stringify(this.selectIndustryObj) == "{}") && this.EPDataDisBtn){
                return (
                    <div>
                    <el-button   onClick={this.addItemIndustry}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        新建 
                    </el-button>
                    <el-button   onClick={this.editItemIndustry}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                        编辑
                    </el-button>
                    <el-button   onClick={this.forbiddenItemIndustry}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        禁用
                    </el-button>
                    </div>
                )
            } else if(((JSON.stringify(this.selectIndustryObj) != "{}" && this.selectIndustryObj.state=='1') || JSON.stringify(this.selectIndustryObj) == "{}") && !this.EPDataDisBtn) {
                return (
                    <div>
                    <el-button   onClick={this.addItemIndustry}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        新建
                    </el-button>
                    <el-button   onClick={this.editItemIndustry}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                        编辑
                    </el-button>
                    </div>
                )
            }
        },
         
        // 细分行业 - 点击新增
        renderHeaderType() {
            if( JSON.stringify(this.selectIndustryDetailObj) != "{}" && this.selectIndustryDetailObj.state=='0' && this.EPDataDisBtn) {
                return (
                    <div>
                    <el-button  onClick={this.enableItemSubdivideIndustries}  style='border:none;background:none;padding:0px;color:#999;' >
                        启用
                    </el-button>
                    </div>
                )

            } else if(((JSON.stringify(this.selectIndustryDetailObj) != "{}" && this.selectIndustryDetailObj.state=='1') || JSON.stringify(this.selectIndustryDetailObj) == "{}") && this.EPDataDisBtn) {
                return (
                    <div>
                    <el-button    onClick={this.addItemSubdivideIndustries}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        新建
                    </el-button>
                    <el-button   onClick={this.editItemSubdivideIndustries}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                        编辑
                    </el-button>
                    <el-button   onClick={this.forbiddenItemSubdivideIndustries}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        禁用
                    </el-button>
                    </div>
                )
            } else if(((JSON.stringify(this.selectIndustryDetailObj) != "{}" && this.selectIndustryDetailObj.state=='1') || JSON.stringify(this.selectIndustryDetailObj) == "{}") && !this.EPDataDisBtn) {
                return (
                    <div>
                    <el-button    onClick={this.addItemSubdivideIndustries}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        新建
                    </el-button>
                    <el-button   onClick={this.editItemSubdivideIndustries}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                        编辑
                    </el-button>
                    </div>
                )
            } 
        },
        // 设备 - 点击新增
        renderHeaderSeries() {
            if(JSON.stringify(this.selectDeviceObj) != "{}" && this.selectDeviceObj.state=='0' && this.EPDataDisBtn) {
                return (
                    <div>
                    <el-button  onClick={this.enableEquip}  style='border:none;background:none;padding:0px;color:#999;' >
                        启用
                    </el-button>
                    </div>
                )

            } else if(((JSON.stringify(this.selectDeviceObj) != "{}" && this.selectDeviceObj.state=='1') || JSON.stringify(this.selectDeviceObj) == "{}")&& this.EPDataDisBtn) {
                return (
                    <div>
                    <el-button  onClick={this.addEquip}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        新建                
                    </el-button>
                    <el-button   onClick={this.editEquip}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                        编辑
                    </el-button>
                    <el-button    onClick={this.forbiddenEquip}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        禁用
                    </el-button>
                    </div>
                )
            }else if(((JSON.stringify(this.selectDeviceObj) != "{}" && this.selectDeviceObj.state=='1') || JSON.stringify(this.selectDeviceObj) == "{}") && !this.EPDataDisBtn) {
                return (
                    <div>
                    <el-button  onClick={this.addEquip}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        新建                
                    </el-button>
                    <el-button   onClick={this.editEquip}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                        编辑
                    </el-button>
                    </div>
                )
            }
        },
        // 细分设备 点击新增
        renderHeaderOil() {
            if(JSON.stringify(this.selectDeviceDetailObj) != "{}" && this.selectDeviceDetailObj.state=='0' && this.EPDataDisBtn) {
                return (
                    <div>
                        <el-button  onClick={this.enableItemSubdivideEquip}  style='border:none;background:none;padding:0px;color:#999;' >
                            启用
                        </el-button>
                    </div>
                )

            } else if(((JSON.stringify(this.selectDeviceDetailObj) != "{}" && this.selectDeviceDetailObj.state=='1') || JSON.stringify(this.selectDeviceDetailObj) == "{}") && this.EPDataDisBtn)  {
                return (
                    <div>
                        <el-button  onClick={this.addItemSubdivideEquip}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                            新建                
                        </el-button>
                        <el-button   onClick={this.editItemSubdivideEquip}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                            编辑
                        </el-button>
                        <el-button    onClick={this.forbiddenItemSubdivideEquip}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                            禁用
                        </el-button>
                    </div>
                )
            }else if(((JSON.stringify(this.selectDeviceDetailObj) != "{}" && this.selectDeviceDetailObj.state=='1') || JSON.stringify(this.selectDeviceDetailObj) == "{}") && !this.EPDataDisBtn)  {
                return (
                    <div>
                        <el-button  onClick={this.addItemSubdivideEquip}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                            新建                
                        </el-button>
                        <el-button   onClick={this.editItemSubdivideEquip}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                            编辑
                        </el-button>
                    </div>
                )
            }
        },
        // 点击 全部行业 某条数据
        clickIndustriesAll(val) {
            console.log(1111,this.queryParams.industryDetailCode)
            this.industryCode = val.code
            // 给选定的品牌对象赋值
            this.selectIndustryObj = val
            this.selectIndustryDetailObj={}
            this.selectDeviceObj={}
            this.selectDeviceDetailObj={}
            // 获取细分行业数据
            this.requestMethodGet("/web/config/industryDevice/clickQueryIndustrySearchDeviceList",{industryCode:this.industryCode,state:this.queryParams.state,level:1,code:this.queryParams.industryDetailCode}).then(res => {
                if(res.data.code == 1000) {
                    this.industriesSegmentationData = res.data.data;
                    this.$refs.industriesSegmentationTable.setCurrentRow()
                    this.equipmentAllData = [];             // 清空全部设备数组
                    this.equipmentSegmentationData=[];      // 清空细分设备数组
                }
            }).catch(res => {
            });
        },
         // 点击 细分行业 某条数据
        clickIndustriesSegmentation(val) {
            this.selectDeviceObj={}
            this.selectDeviceDetailObj={}
            this.industryDetailCode = val.code;
            // 给选定的类型对象赋值
            this.selectIndustryDetailObj = val
                // 获取全部设备数据
                this.requestMethodGet("/web/config/industryDevice/clickQueryIndustrySearchDeviceList",{industryCode:this.industryDetailCode,state:this.queryParams.state,level:2,code:this.queryParams.deviceCode}).then(res => {
                    if(res.data.code == 1000) {
                        this.equipmentAllData = res.data.data;
                        this.$refs.equipmentTable.setCurrentRow()
                        this.equipmentSegmentationData = [];
                    }
                }).catch(res => {
                });
        },
         // 点击 全部设备 某条数据
        clickEquipmentAll(val) {
            // 给选定的类型对象赋值
            this.selectDeviceObj = val
            this.selectDeviceDetailObj={}
            this.deviceCode = val.code;
            // 获取细分设备数据
            this.requestMethodGet("/web/config/industryDevice/clickQueryIndustrySearchDeviceList",{industryCode:this.deviceCode,state:this.queryParams.state,level:3,code:this.queryParams.deviceDetailCode}).then(res => {
                if(res.data.code == 1000) {
                    this.equipmentSegmentationData = res.data.data;
                    this.$refs.equipmentSegmentationTable.setCurrentRow()
                }
            }).catch(res => {
            });
        },
        clickNameItem(val){
            // // 给选定的名称对象赋值
            this.selectDeviceDetailObj = val
        },
        // 刷新细分行业数据
        refreshIndustry(){
            this.requestMethodGet("/web/config/industryDevice/clickQueryIndustrySearchDeviceList",{industryCode:this.industryCode,state:this.queryParams.state,level:1}).then(res => {
                if(res.data.code == 1000) {
                    this.industriesSegmentationData = res.data.data;
                }else {
                    this.$message.error(res.data.msg);
                }
            }).catch(res => {
            });
        },
        // 刷新全部设备数据
        refreshAllDevice() {
          this.requestMethodGet("/web/config/industryDevice/clickQueryIndustrySearchDeviceList",{industryCode:this.industryDetailCode,state:this.queryParams.state,level:2}).then(res => {
              if(res.data.code == 1000) {
                  this.equipmentAllData = res.data.data;
                  this.equipmentSegmentationData = [];
                  if(this.queryParams.state == 0 && this.equipmentAllData != null) {
                      this.equipmentAllData.map(item => {
                          if(item.state == 1) {
                              item.selectUse = false;
                          } else if(item.state == 0) {
                              item.selectUse = true;
                          }
                      })
                  }
              }else {
                  this.$message.error(res.data.msg);
              }
          }).catch(res => {
          });
        },
        forceSaveData(level,name,parentCode){
            console.log(level,name,parentCode)
          this.requestMethodPost("/web/config/industryDevice/addIndustryDevice",{level:level,name:name,parentCode:parentCode,forceSaveExistNameFlag:true}).then(res => {
             if(res.data.code == 1000){
              if(level=='2'){
                this.refreshIndustry()
                // 调取 细分行业 的数据接口
                this.refreshIndustrieDetail(this.queryParams.industryCode,'industriesSegmentation')
              }else if(level=='3'){
                this.refreshAllDevice()
                // 调取 设备 的数据接口
                this.refreshIndustrieDetail(this.queryParams.industryDetailCode,'device')
              }else if(level=='4'){
                this.getSearchDeviceList()
                this.refreshIndustrieDetail(this.queryParams.deviceCode,'deviceDetail')
              }
              this.addOilDialog = false
             }
            }).catch(res => {
            });
        },
        // 获取细分设备数据
        getSearchDeviceList(){
          this.requestMethodGet("/web/config/industryDevice/clickQueryIndustrySearchDeviceList",{industryCode:this.deviceCode,state:this.queryParams.state,level:3}).then(res => {
              if(res.data.code == 1000) {
                  this.equipmentSegmentationData = res.data.data;
                  if(this.queryParams.state == 0 && this.equipmentSegmentationData != null) {
                      this.equipmentSegmentationData.map(item => {
                          if(item.state == 1) {
                              item.selectUse = false;
                          } else if(item.state == 0) {
                              item.selectUse = true;
                          }
                      })
                  }
              }else {
                  this.$message.error(res.data.msg);
              }
          }).catch(res => {
          });
        },
        onResize(){
            this.mainminheight = `height:${document.documentElement.clientHeight- 140}px`
            this.tableheight= `${document.documentElement.clientHeight- 370}px`
        }
    },
    created() {
        const buttonList = JSON.parse(sessionStorage.getItem("btnPremissions"));
        for (let i in buttonList) {
            if (buttonList[i].menuCode == "EPDataDisBtn") {
                this.EPDataDisBtn = true;
            }
        }
    },
    mounted() {
        // 获取全部行业数据
        this.getAllData();
        // 获取行业搜索数据
        this.industriesAllFilter('')
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.dealer-industry {
    padding: 20px;
    padding-bottom:50px;
    overflow: auto;
    .form-search-item {
    label {
        display: block;
    //         display: inline-block;
    //   text-align: right;
    //     width: 25%;
        padding-bottom: 10px;
        }
    }
}
</style>
