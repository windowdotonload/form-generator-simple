export default {
    data() {
        return {
            activeName:'first',
            mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
            queryParams: {
            companyNumber: "", //公司名称
            deviceNumber: "", //设备名称
            lubricationPointNumber:'',
            nickName:'',//备注名称
            productKey:''//产品
            },
            queryDeleteParams: {
            nickName:'',//备注名称
            productKey:''//产品
            },
            productionList:[],
            pagenation: {
            current: 1,
            size: 30
            },
            iotId:'',//物联网设备id
            productKey:'',//产品Key
            lubricationPointNumber:'',//绑定润滑点编码
            totalNumber: 0, //总条数
            allTotalNum:0,//待绑定设备总数量
            accountTableData: [],
            selectList: [],
            awaitBindTableData:[],//待绑定列表
            deleteTableData:[],//删除的设备列表
            dialogFormVisible: false, //新增账号对话框
            ruleForm: {
            companyNumber: "", //公司名称
            deviceNumber: "", //设备名称
            lubricationPointNumber: ''
            },
            companyNameList:[],
            companyNameAllList:[],
            equipmentNameList:[],
            equipmentNameAllList:[],
            lubricatepointNameList:[],
            lubricationPointNameList:[],
            rules: {
            companyNumber: [{ required: true, message: "请输入公司名称", trigger: "change" }],
            deviceNumber: [
                { required: true, message: "请选择设备名称", trigger: "change" }
            ],
            lubricationPointNumber: [
                { required: true, message: "请选择润滑点名称", trigger: "change" }
            ]
            },
            dialogTitle: "",
            loading: false, //是否加载
            isloading:false,//远程搜索loading
        };
        },
    
        components: {},
    
        computed: {},
        created() {
        this.requestMethodGet("/iot/device/product/getProductList", {})
            .then(res => {
                res = res.data;
                if (res.code == 1000) {
                this.productionList = res.data.map(item => {
                    return {
                    name:item.productName,
                    code:item.productKey
                    }
                })
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.loading = false;
            });
        },
        mounted() {
        if(this.$route.params.activeName) {
            this.activeName = this.$route.params.activeName
        }
        this.$_queryAccountList(); //获取联网设备列表
        this.$_queryawaitBindList('search') ;//获取待绑定设备列表
        this.remoteLubricationPointMethod('')
        // this.getLubricationPoin('')
        },
        methods: {
        // 将 \n 换为 <br/>标签
            ToBreak (val) {
            return val.replace(/,/g, '<br />')
            },
        // 刷新数据
        handleRefresh(e) {
            let target = e.target;
            if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
                target = e.target.parentNode;
            }
            target.blur()
            this.requestMethodGet("/iot/device/auto/refreshBaseData", {})
            .then(res => {
                res = res.data;
                if (res.code == 1000) {
                this.$_queryawaitBindList('search') ;//获取待绑定设备列表
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
            });
        },
        onResize() {
            this.mainminheight = `height:${document.documentElement.clientHeight -
            200}px`;
        },
        handleClick(val)  {
            this.activeName =val.name
            this.pagenation.current = 1
            if(val.name == 'first') {
            this.$_queryAccountList(); //获取联网设备列表
            } else if(val.name == 'second'){
            this.$_queryawaitBindList() ;//获取待绑定设备列表
            }else {
            this.queryDeleteList()
            }
        },
        onChangeEquipmentName(){
            this.ruleForm.lubricationPointNumber = ''
            let params = {
            deviceNumber:this.ruleForm.deviceNumber
            }
            if(!this.ruleForm.deviceNumber) {
            return
            }
            this.isloading = true
            this.requestMethodGet("/web/common/fuzzy/query/fuzzyQueryLubricationPoint", params)
            .then(res => {
                res = res.data;
            this.isloading = false
                if (res.code == 1000) {
                this.lubricatepointNameList = res.data
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.isloading = false;
            });
        },
        focusChange(name){
            if(name == 'companyNumber') {
            this.remoteMethod('')
            return
            }
            if(name == 'deviceNumber') {
            this.remoteDeviceMethod('')
            return
            }
            this.remoteLubricationPointMethod('')
        },
        remoteLubricationPointMethod(val){
            let params = {
                lubricationPointName:val,
                deviceNumber:this.queryParams.deviceNumber,
                companyNumber:this.queryParams.companyNumber
            }
            this.isloading = true
            this.requestMethodGet("/iot/device/iotRel/getRelation", params)
            .then(res => {
                res = res.data;
            this.isloading = false
                if (res.code == 1000) {
                this.lubricationPointNameList = res.data.list
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.isloading = false;
            });
        },
        remoteMethod(val){
            let params = {
            companyName:val
            }
            this.isloading = true
            this.requestMethodGet("/iot/device/iotRel/getRelation", params)
            .then(res => {
                res = res.data;
            this.isloading = false
                if (res.code == 1000) {
                this.companyNameList = res.data.list.map(item => {
                    return {
                    label:item.companyName,
                    value:item.companyNumber
                    }
                })
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.loading = false;
            });
    
        },
        remoteCompanyMethod(val){
            let params = {
            companyName:val
            }
            this.isloading = true
            this.requestMethodGet("/web/common/fuzzy/query/fuzzyQueryCompany", params)
            .then(res => {
                res = res.data;
            this.isloading = false
                if (res.code == 1000) {
                this.companyNameAllList = res.data
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.loading = false;
            });
    
        },
        remoteDeviceMethod(val) {
            let params = {
            deviceName:val,
            companyNumber:this.ruleForm.companyNumber
            }
            if(this.activeName == 'first') {
            params.companyNumber = this.queryParams.companyNumber
            }
            this.isloading = true
            this.requestMethodGet("/iot/device/iotRel/getRelation", params)
            .then(res => {
                res = res.data;
            this.isloading = false
                if (res.code == 1000) {
                this.equipmentNameList = res.data.list.map(item => {
                    return {
                    label:item.deviceName,
                    value:item.deviceNumber
                    }
                })
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.loading = false;
            });
        },
        remoteDeviceAllMethod(val) {
            let params = {
            deviceName:val,
            companyNumber:this.ruleForm.companyNumber
            }
            this.isloading = true
            this.requestMethodGet("/web/common/fuzzy/query/fuzzyQueryDevice", params)
            .then(res => {
                res = res.data;
            this.isloading = false
                if (res.code == 1000) {
                this.equipmentNameAllList = res.data
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.loading = false;
            });
        },
        onChangeCompanyName(val){
            if(this.activeName == 'first') {
            this.queryParams.deviceNumber = ''
            this.queryParams.lubricationPointNumber = ''
            this.equipmentNameList = []
            this.remoteDeviceMethod('')
            this.handleSearchTableData()
            } else if(this.activeName == 'second'){
            // this.lubricatepointNameList = []
            this.ruleForm.deviceNumber = ''
            this.ruleForm.lubricationPointNumber = ''
            // this.equipmentNameAllList = []
            this.remoteDeviceAllMethod('')
            }
        },
        onChangeDeviceName(){
            this.queryParams.lubricationPointNumber = ''
            this.handleSearchTableData()
        },
        // 获取联网列表数据
        $_queryawaitBindList(val) {
            this.loading = true;
            let params = { 
            current:this.pagenation.current,
            size:this.pagenation.size,
            productKey:this.queryParams.productKey, 
            nickName:this.queryParams.nickName, 
            status:0 
            };
            this.requestMethodGet("/iot/device/getDeviceList", params)
            .then(res => {
                this.loading = false;
                res = res.data;
                if (res.code == 1000) {
                this.awaitBindTableData = res.data.list;
                if(this.activeName == 'second') {
                this.totalNumber = res.data.totalCount;
                }
                if(val) {
                this.allTotalNum = res.data.totalCount;
                }
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.loading = false;
            });
        },
        // 获取已删除列表数据
        queryDeleteList() {
            this.loading = true;
            let params = { 
            current:this.pagenation.current,
            size:this.pagenation.size,
            productKey:this.queryDeleteParams.productKey, 
            nickName:this.queryDeleteParams.nickName, 
            };
            this.requestMethodGet("/iot/device/getRemovedDeviceList", params)
            .then(res => {
                this.loading = false;
                res = res.data;
                if (res.code == 1000) {
                this.deleteTableData = res.data.list;
                if(this.activeName == 'third') {
                this.totalNumber = res.data.totalCount;
                }
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.loading = false;
            });
        },
            // 获取联网列表数据
        $_queryAccountList() {
            this.loading = true;
            let params = { 
            companyNumber:this.queryParams.companyNumber, 
            deviceNumber:this.queryParams.deviceNumber,
            lubricationPointNumber:this.queryParams.lubricationPointNumber,
            current:this.pagenation.current,
            size:this.pagenation.size
            };
            this.requestMethodGet("/iot/device/iotRel/getRelation", params)
            .then(res => {
                this.loading = false;
                res = res.data;
                if (res.code == 1000) {
                this.accountTableData = res.data.list;
                if(this.activeName == 'first') {
                this.totalNumber = res.data.totalCount;
                }
                } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
                }
            })
            .catch(res => {
                this.loading = false;
            });
        },
        // 查询
        handleSearchTableData(e) {
            this.pagenation.current = 1;
            if( this.activeName == 'first') {
            this.$_queryAccountList(); //获取联网设备列表
            } else if(this.activeName == 'second') {
            this.$_queryawaitBindList() ;//获取待绑定设备列表
            }else {
            this.queryDeleteList()
            }
            if(e.target) {
            let target = e.target;
            if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
                target = e.target.parentNode;
            }
            target.blur()
            }
        },
        // 绑定
        handleEdit(row) {
            this.companyNameAllList = []
            this.equipmentNameAllList = []
            this.lubricatepointNameList = []
            this.ruleForm = {
            companyNumber: "", //公司名称
            deviceNumber: "", //设备名称
            lubricationPointNumber: ''
            },
            this.iotId = row.iotId
            this.productKey = row.productKey
            this.lubricationPointNumber = row.lubricationPointNumber
            this.dialogTitle = "绑定设备信息";
            this.dialogFormVisible = true;
            this.remoteCompanyMethod('')
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
                        lubricationPointNumber: this.ruleForm.lubricationPointNumber,
                        deviceNumber: this.ruleForm.deviceNumber,
                        iotId: this.iotId,
                        productKey:this.productKey
                    };
                    this.requestMethodPost("/iot/device/bindIotDevice", params)
                        .then(res => {
                        res = res.data;
                        if (res.code == 1000) {
                            this.$message({
                            message: "提交成功",
                            type: "success"
                            });
                            this.dialogFormVisible = false;
                            sessionStorage.setItem('lubricationPointStatus', 'news');
                            this.$router.push({
                            //核心语句
                            path: "/IotManagement/IotConfiguration", //跳转的路径
                            query: {
                                lubricationPointNumber: this.ruleForm.lubricationPointNumber
                            }
                            })  
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
                    })
                    .catch(() => {});
            } else {
                return false;
            }
            });
        },
        // 取消
        handleCancle(formName) {
            this.$refs[formName].resetFields();
            this.dialogFormVisible = false;
            this.ruleForm = {
            companyNumber: "", //公司名称
            deviceNumber: "", //设备名称
            lubricationPointNumber: ''
            }
        },
        handleMonitor(row){
            this.$router.push({
            path: "/IotManagement/MonitoringData",
            query: {
                lubricationPointNumber: row.lubricationPointNumber,
            }
            });
        },
        // page change  事件
        handleCurrentChange(page) {
            this.pagenation.current = page;
            if( this.activeName == 'first') {
            this.$_queryAccountList(); //获取联网设备列表
            } else if(this.activeName == 'second'){
            this.$_queryawaitBindList() ;//获取待绑定设备列表
            }else {
            this.queryDeleteList()
            }
        },
        // size change 事件
        handleSizeChange(size) {
            this.pagenation.size = size;
            this.pagenation.current = 1;
            if( this.activeName == 'first') {
            this.$_queryAccountList(); //获取联网设备列表
            } else if(this.activeName == 'second'){
            this.$_queryawaitBindList() ;//获取待绑定设备列表
            }else {
            this.queryDeleteList()
            }
        },
            // 点击配置跳转管理页面
        handleConfiguration(row) {
            this.$router.push({
                //核心语句
                path: "/IotManagement/IotConfiguration", //跳转的路径
                query: {
                    lubricationPointNumber: row.lubricationPointNumber
                }
            })
        }
        }
    };