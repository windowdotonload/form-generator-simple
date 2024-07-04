<template>
    <div class="dealer-progile" :style="mainminheight">
        <!-- 查询条件 -->
        <el-form ref="form" :model="queryParams" :inline="true" size="small" label-width="120px" id="searchForm">
            <div>
                <el-form-item label="润滑点部件" >
                    <el-select v-model="queryParams.name" 
                        size="small"
                        @change='selectIndustriesAll'
                        :filter-method='industriesAllFilter' style="width:80%;" filterable  clearable placeholder="请选择">
                        <el-option
                        v-for="item in industriesAllList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="英文名称" >
                    <el-input
                    suffix-icon="el-icon-search"
                    class="search-info"
                    size="small"
                    style="width:80%;"
                    @change="selectIndustriesAll"
                    v-model="queryParams.nameEn"
                    maxlength="25"
                    placeholder="请输入"
                    clearable
                ></el-input>
                </el-form-item>
                <el-form-item label="MSLA ID" >
                    <el-input
                    suffix-icon="el-icon-search"
                    class="search-info"
                    size="small"
                    style="width:80%;"
                    @change="selectIndustriesAll"
                    v-model="queryParams.mslaCode"
                    maxlength="25"
                    placeholder="请输入"
                    clearable
                ></el-input>
                </el-form-item>
                <el-form-item label="MSLA类别" >
                    <el-input
                    suffix-icon="el-icon-search"
                    class="search-info"
                    size="small"
                    style="width:80%;"
                    @change="selectIndustriesAll"
                    v-model="queryParams.mslaName"
                    maxlength="25"
                    placeholder="请输入"
                    clearable
                ></el-input>
                </el-form-item>
            </div>
            <div>
                <el-form-item label="状态" >
                    <el-select size="small" clearable v-model="queryParams.state" @change="statesChange" placeholder="请选择" style="width:80%;">
                        <el-option
                            v-for="item in statusList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-button @click="handleClearSearch" size="small" style="width: 60px;">重置</el-button>
            </div>
        </el-form>
            <el-row :gutter="24" style="margin: 0 0 20px 20px;"  type="flex"  align="bottom">
                <el-button type="danger" plain @click="handleAdd()"  size="small"  v-has='PCFAddBtn'>添加部件类型</el-button>
                <el-button type="danger" plain @click="handleDownload" size="small"  v-has='PCFDownloadBtn'>批量下载</el-button>
            </el-row>
            <el-form  :model="form1"  ref="formTable" >
                <el-table
                ref="topicTable"
                v-if="isExpand1"
                :cell-style="columnStyle"
                :data="form1.tableData"
                style="margin: 0 20px 20px 20px;"
                row-key="id"
                :height="tableHeight"
                stripe
                :header-cell-style="{background:'#f7f7f7'}"
                @selection-change="handleSelectionChange"
                :tree-props="{children: 'children'}"
                >
                    <el-table-column  min-width="30%" label='润滑点部件名称'>
                        <template slot-scope="scope">
                            <span>{{scope.row.name || '/'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='英文名称' prop="nameEn" min-width="30%">
                        <template slot-scope="scope">
                            <span>{{scope.row.nameEn || '/'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label='MSLA Asset Class ID' prop="mslaCode" min-width="30%"  >
                        <template slot-scope="scope" >
                            {{ scope.row.mslaCode ||  '/'}}
                        </template>
                    </el-table-column>
                    <el-table-column label='MSLA 类别' prop="mslaName" min-width="30%">
                        <template slot-scope="scope" >
                            {{ scope.row.mslaName ||  '/'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="操作" min-width="30%" align="center">
                        <template slot-scope="scope" >
                            <el-link @click="handleCommand(scope.$index,scope.row)" :style="scope.row.state == '0' ? 'color:#666' : 'color:#f56c6c'">
                                {{ scope.row.state == '0' ? '启用' :'禁用' }}
                            </el-link>
                            
                            <el-link type="danger"  @click="handleEdit(scope.row)" style="margin-left:10px" v-has="PCFEditBtn">编辑</el-link>
                          
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                background
                v-if="totalNumber"
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
        <!-- 新建润滑点部件 -->
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogFormVisible"
            :show-close="false"
            width="700px"
            :close-on-click-modal="false"
            >
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="accountForm"
                label-width="100px"
                label-position="top"
            >

                <el-row >
                    <el-col :span="12">
                        <el-form-item label="润滑点部件名称" prop="name" :error="errorMsgName">
                            <el-input
                                size="small"
                                v-model="ruleForm.name"
                                maxlength="50"
                                autocomplete="off"
                                style="width:90%"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="润滑点部件英文名称" prop="nameEn"  :error="errorMsgNameEn"  :rules='{ required: true, message: "请输入润滑点部件英文名称", trigger: "blur" }'>
                        <el-input
                            size="small"
                            v-model="ruleForm.nameEn"
                            maxlength="50"
                            autocomplete="off"
                            style="width:90%"
                        ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="MSLA Asset Class ID" prop="mslaCode" >
                        <el-input
                            size="small"
                            v-model="ruleForm.mslaCode"
                            maxlength="11"
                            autocomplete="off"
                            style="width:90%"
                        ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="MSLA类别" prop="mslaName" >
                        <el-input
                            size="small"
                            v-model="ruleForm.mslaName"
                            maxlength="50"
                            autocomplete="off"
                            style="width:90%"
                        ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:right;">
                <el-button type="danger" @click="handleSubmit('accountForm')" size="small">提交</el-button>
                <el-button type="danger" plain @click="handleCancle('accountForm')" size="small">取消</el-button>
            </div>
        </el-dialog>
    </div>
        
    </template>
    
    <script>
    import { baseRemoteOauth2 } from "@/api/api";
    export default {
        name: 'treeTableDemo',
        components: {  },
        data() {
            return {
                dialogTitle:'添加部件类型',
                isExpand:false,  // 树状表格是否展开
                isExpand1:true,  // 树状表格是否展开
                dialogFormVisible: false, //新增润滑点部件对话框
                ruleForm: {
                    nameEn: "",
                    name: "",
                    mslaCode: '',
                    mslaName: ""
                },
    
                form1:{
                    tableData: [], // 表格数据
                },
                rules: {
                    level: [{ required: true, message: '请选择层级', trigger: 'change' }],
                    name: [{ required: true, message: "请输入润滑点部件名称", trigger: "blur" }],
                    mslaCode: [{ pattern: /^(0|[0-9][0-9]*|-[0-9][0-9]*)$/, message: '请输入数字', trigger: 'blur' }]
                },
                industriesAllList2:[],  // 新建润滑点部件  选择润滑点一层名称
                mainminheight: `height:${document.documentElement.clientHeight- 160}px`, 
                queryParams: {
                    state:'1',
                    name:'',
                    nameEn:'',
                    mslaCode:'',
                    mslaName:''
                },  // 设备/行业配置表单搜索
                // 分页参数
                pagenation: {
                    current: 1,
                    size: 30
                },
                editType:'add',
                totalNumber:0,
                industriesAllList: [],      // 搜索栏 全部行业数据
                searchDisabled:false,
                industriesSegmentationList: [], // 搜索栏 细分行业数据
                statusList: [{ value: "0", label: "禁用" },{  value: "1", label: "启用"}], //数据可见性
                name:'',   // 选中 的 元件一层 code
                lubricatingSecond:'',   // 选中 的 元件二层 code
                tableheight:0 ,
                status: '',
                preValue:'',
                editId:'',
                params:{},
                parentCode:'',
                errorMsgName:'',   // 新增润滑点  第一级 输入框 添加报错信息
                errorMsgNameEn:'',  // 新增润滑点  第一级英文 输入框 添加报错信息
                errorMsgLevel2NameEn:'', // 新增润滑点  第2级英文 输入框 添加报错信息
                errorMsgLevel2Name:'', // 新增润滑点  第2级 输入框 添加报错信息
                levelAdd:''   // 选择新增第几级
            }
        },
        watch: {},
        computed: {},
        methods:{
            handleHeight(){
            const searchFormHeight = document.getElementById("searchForm").clientHeight
            this.tableHeight = Number(document.documentElement.clientHeight)-Number(searchFormHeight)-280
            console.log(this.tableHeight)
          },
            columnStyle({ row, column, rowIndex, columnIndex }) {
                if (columnIndex == 4) {
                    return "borderLeft:1px solid #EBEEF5;paddingLeft:10px;";
                }
            },
            handleConnectionSearch(row) {
                row.expanded = !row.expanded;
                this.$refs.topicTable.toggleRowExpansion(row, row.expanded) // 点击button展开
            },
            // 状态切换
            statesChange(val) {
                this.queryParams.state = val;
                this.searchTableData()
            },
             // size change 事件
            handleSizeChange (size) {
            this.pagenation.size = size
            this.pagenation.current = 1
            this.getAllData()
            },
            // page change 事件
            handleCurrentChange (current) {
            this.pagenation.current = current
            this.getAllData()
            },
            // 获取全部润滑点数据
            getAllData() {
                let params = { ...this.queryParams, ...this.pagenation }
                this.requestMethodGet("/web/config/lubricationPoint/getLubricationPointTypeParentChildrenList",params).then(res => {
                    if(res.data.code == 1000) {
                        
                        const data = res.data.data;
                        // 每一条数据添加 editing 属性  false 为不可编辑   true 为可编辑
                        if(data.list && data.list.length>0) {
                            this.form1.tableData = data.list
                        } else {
                            this.form1.tableData =[]
                        }
                        
                        this.totalNumber = data.totalCount
                    }else {
                        this.$message({
                            message: res.data.msg,
                            type: 'warning'
                        })
                    }
                }).catch(res => {
                });
            },

            // 重置表单
            handleClearSearch() {
                // 其他搜索条件清空   状态设置为  启用
                this.queryParams= {
                    state:'1',
                    name:'',
                    nameEn:'',
                    mslaCode:'',
                    mslaName:''
                }, 
                this.getAllData() 
            },
            //  搜索表单
            searchTableData() {
                this.getAllData() 
            },
            // 润滑点部件一层的远程搜索事件
            industriesAllFilter(val) {
                this.requestMethodGet("/web/config/lubricationPoint/getLubricationPointTypeByLevel",{name:val,level:1}).then(res => {
                    if(res.data.code == 1000) {
                        let optionData = res.data.data
                        optionData = optionData.map(item =>{return {'value':item.name,"label":item.name}})
                        this.industriesAllList = optionData
                    }else {
                        this.$message.error(res.data.msg);
                    }
                }).catch(res => {
                });
            },
            // 润滑点部件一层  change 事件 
            selectIndustriesAll() {
                this.searchTableData()
            },
            selectIndustriesSegmentation() {
                this.searchTableData()
            },
            // 点击编辑
            handleEdit(row) {
                this.dialogTitle = '编辑部件类型'
                this.dialogFormVisible = true
                console.log(row)
                this.editId = row.id
                this.editType = 'edit'
                this.ruleForm ={
                    nameEn: row.nameEn,
                    name: row.name,
                    mslaCode: row.mslaCode || '',
                    mslaName: row.mslaName || ''
                }
            },
            // 表格中行的编辑 保存
            handleEditSave() {
                let params = {
                    id:this.editId,
                    name: this.ruleForm.name,
                    nameEn: this.ruleForm.nameEn,
                    mslaName: this.ruleForm.mslaName
                }
                if(this.ruleForm.mslaCode) {
                    params.mslaCode = Number(this.ruleForm.mslaCode)
                }
                this.requestMethodPost("/web/common/updateSysDicById",params).then(res => {
                    if(res.data.code == 1000) {
                        this.$message({
                            message: "编辑部件类型成功",
                            type: "success"
                        });
                        // 刷新部件类型 表格数据
                        this.dialogFormVisible = false;
                        this.industriesAllFilter('')
                        this.getAllData()
                    }else {
                        this.$message.error(res.data.msg);
                    }
                }).catch(res => {
                    this.loading = false;
                });
            },
            // 新建润滑点部件
            handleAdd() {
                this.dialogFormVisible = true;
                this.dialogTitle = '添加部件类型'
                this.editType='add'
                this.ruleForm ={
                    nameEn: '',
                    name: '',
                    mslaCode: '',
                    mslaName: ''
                }
            },
            // 润滑点部件一层的远程搜索事件
            industriesAllFilter2(val) {
                this.requestMethodGet("/web/config/lubricationPoint/getLubricationPointTypeByLevel",{name:val,level:1}).then(res => {
                    if(res.data.code == 1000) {
                        let optionData = res.data.data
                        optionData = optionData.map(item =>{return {'value':item.code,"label":item.name}})
                        this.industriesAllList2 = optionData
                    }else {
                        this.$message.error(res.data.msg);
                    }
                }).catch(res => {
                });
            },
            // 润滑点部件一层  change 事件 
            selectIndustriesAll2(val) {
                var data= this.form1.tableData.filter(item=>item.code == val)
                // 获取选中的第一层润滑点的英文名称
                this.ruleForm.nameEn = data[0].nameEn
                // 获取选中的 parentCode
                this.parentCode = data[0].code
            },
            // 新建润滑 点  选择 新增第几级
            changeLevel(val) {
                this.levelAdd = val;
                this.ruleForm = {
                    level: val,
                    nameEn: "",
                    name: "",
                    level2Name: "",
                    level2NameEn: ""
                }
            },
            // 新增账号提交
            handleSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        
                        this.$confirm("是否确认提交数据？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                        })
                        .then(() => {
                            let params = {
                                name: this.ruleForm.name,
                                nameEn: this.ruleForm.nameEn,
                                mslaName: this.ruleForm.mslaName
                            };
                            if(this.ruleForm.mslaCode) {
                                params.mslaCode = Number(this.ruleForm.mslaCode)
                            }
                            console.log(this.editType)
                            if(this.editType == 'add') {
                                
                                this.addData(params);
    
                            } else  {
                                this.handleEditSave();
                            }
                        })
                        .catch(() => {});
                    } else {
                    return false;
                    }
                });
            },
            // 调取新增接口
            addData(params) {
                console.log(params)
                this.requestMethodPost("/web/config/lubricationPoint/addLubricationPointType", params)
                .then(res => {
                    res = res.data;
                    if (res.code == 1000) {
                        this.$message({
                            message: "新建部件类型成功",
                            type: "success"
                        });
                        this.ruleForm = {
                            nameEn: "",
                            name: "",
    
                        }
                        this.industriesAllFilter('')
                        this.dialogFormVisible = false;
                        this.getAllData()
                    } else {
                    this.$message({
                        message: res.msg,
                        type: "warning"
                    });
                    }
                })
                .catch(res => {
                    console.log(res);
                });
            },
              // 新建润滑点部件 取消
            handleCancle(formName) {
                this.$nextTick(() => {
                    this.ruleForm.level = '';
                    this.$refs[formName].resetFields();
                });
                this.dialogFormVisible = false;
            },
            // 下载
            handleDownload() {
              const loading = this.$loading({
                lock: true,
                text: '数据下载中，请稍后',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              })
              let paramObj = {
                name: this.queryParams.name,
                nameEn: this.queryParams.nameEn,
                mslaCode: this.queryParams.mslaCode,
                mslaName: this.queryParams.mslaName,
                state: this.queryParams.state,
                responseTypeBlob: true
              }
              this.requestMethodGet("/web/config/lubricationPoint/exportAllLubricationPointType", paramObj).then(res => {
                let data = res.data
                let fileReader = new FileReader()
                let that = this
                loading.close()
                fileReader.onload = function () {
                try {
                    let jsonData = JSON.parse(this.result); // 说明是普通对象数据，后台转换失败
                    if (jsonData.code) {
                    that.$message({
                        message: jsonData.msg,
                        type: "error",
                    });
                    return;
                    }
                } catch (err) {
                    // 解析成对象失败，说明是正常的文件流
                    const blob = new Blob([res.data], {
                    type: "application/vnd.ms-excel",
                    });
                    const objectUrl = URL.createObjectURL(blob);
                    // window.location.href = objectUrl
                    let link = document.createElement("a");
                    link.style.display = "none";
                    link.href = objectUrl;
                    link.setAttribute("download", "部件类型.xlsx");
                    document.body.appendChild(link);
                    link.click();
                }
                };
                fileReader.readAsText(data);
              })
              .catch((res) => {
                loading.close()
              });
            },
            // 下拉的点击事件
            handleCommand(val,row) {
                console.log(val,row)
                let title=''
                if(row.state == '1') {
                    title='确定要禁用这条数据吗？'
                } else{
                    title='确定要启用这条数据吗？'
                }
                this.$confirm(title, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        id:row.id,
                        state:row.state == '1'?0:1
                    }
                    this.requestMethodPost("/web/common/updateSysDicById",params).then(res => {
                        if(res.data.code == 1000) {
                            this.$message({
                                message: row.state == '1'?'禁用部件类型成功':'启用部件类型成功',
                                type: "success"
                            });
                            // 刷新部件类型 表格数据
                            this.getAllData()
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    }).catch(res => {
                        this.loading = false;
                    });
                }).catch(() => {});

            }
        },
        mounted() {
            this.getAllData()
            this.industriesAllFilter('')
            window.onresize = () => {
            return (() => {
              this.screenWidth = document.body.clientWidth
              this.mainminheight = `height:${document.documentElement.clientHeight - 240}px`
            })()
          }
          this.$nextTick(()=>{
            this.handleHeight()
          })
        }
    }
    
    </script>
    <style lang="less" scoped>
    .dealer-progile {
        padding: 20px;
        overflow: auto;
        .form-search-item {
        label {
            display: block;
            // display: inline-block;
            // text-align: right;
            // width: 28%;
            padding-bottom: 10px;
            }
        }
        .approvalStage{
            background-color: #fff;
            padding: 20px;
            padding-bottom: 40px;
            border-radius: 4px;
        }
        .el-form .el-button {
            width: 120px;
        }

    }
    </style>