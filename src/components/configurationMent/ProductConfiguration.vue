<template>
  <div class="dealer-progile" :style="mainminheight">
    <!-- 查询条件 -->
    <el-form ref="form" :model="queryParams" inline>
    <!-- 查询条件 -->
    <el-form-item label="油品品牌">
        <el-select size="small" v-model="queryParams.oilBrandCode" 
        @change='selectChangeOilBrand'
        :filter-method='industriesAllFilter' clearable style="width:80%;" filterable  placeholder="请选择">
        <el-option
        v-for="item in oilOptionBrandList"
        :key="item.code"
        :label="item.name"
        :value="item.code">
        </el-option>
    </el-select>
    </el-form-item>
    <el-form-item label="油品名称">
        <el-select 
        size="small" 
        filterable
        clearable
        v-model="queryParams.oilNameCode" 
        @change="selectChangeOilName"  style="width:80%;"   placeholder="请选择">
            <el-option
            v-for="item in nameOptionList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
            </el-option> 
        </el-select>
    </el-form-item>
    <el-form-item label="状态">
        <el-select size="small" v-model="queryParams.status" clearable @change="statesChange" placeholder="请选择状态" style="width:80%;">
            <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
    </el-form-item>
    <el-button @click="handleClearSearch" size="small" >重置</el-button>
  </el-form>
  <el-button type="danger" plain @click="handleRefresh" size="small" >同步MDM油品</el-button>
  <el-button type="danger"   @click="handleDownload"  size="small">批量下载</el-button>
  <!-- 表格列表 -->
  <el-row style="margin-top: 15px" v-loading="loading">
      <!-- 油品品牌列表 -->
      <el-col :span="10">
          <el-table
            ref="brandTable"
            :key="key"
            row-key="id"
            :data="oilBrandList"
            tooltip-effect="dark"
            style="width: 100%"
            border
            :height="tableheight"
            highlight-current-row
            :max-height="600"
            @row-click='clickOilBrandItem'
            :header-cell-style="{background:'#f7f7f7'}"
            class="data-table"
          >
              <el-table-column prop="name" label="油品品牌" min-width="40%" align="center">
              </el-table-column>
              <el-table-column :render-header="renderHeader" min-width="38%" align="center">
              </el-table-column>
          </el-table>
      </el-col>
      <!-- 油品名称列表 -->
      <el-col :span="10">
          <el-table
              ref="namesTable"
              :key="key"
              row-key="id"
              :data="oilNameList"
              class="data-table"
              tooltip-effect="dark"
              style="width: 100%"
              :max-height="600"
              :height="tableheight"
              highlight-current-row
              @row-click='clickNameItem'
              :header-cell-style="{background:'#f7f7f7'}"
              border
          >
              <el-table-column prop="name" label="油品名称" min-width="30%" align="center">
              </el-table-column>
              <el-table-column  v-if="!oilMobil" :render-header="renderHeaderOil" min-width="38%" align="center">
              </el-table-column>
          </el-table>
      </el-col>
  </el-row>
  <!-- 新增油品 -->
  <AddOil
    :addOilDialog="addOilDialog"
    :addType="addType"
    :addOilForm="addOilForm"
    v-on:addOrEditOil="addOrEditOil"
    v-on:closeDialogAdd="closeDialogAdd"
    ref="child"
  />
  </div>
</template>

<script>
import AddOil from "./components/addOil";
import { baseRemoteOauth2 } from '@/api/api'
export default {
    components: { AddOil },
    oilBrandName: "HelloWorld",
    data() {
        return {
            mainminheight: `height:${document.documentElement.clientHeight- 140}px`, 
            loading:false,
            mainminStyle: "",
            addOilDialog: false, // 手动添加油品弹框
            // 手动添加油品弹框
            addOilForm: {
                oilBrand: "",
                oilName: ""
            },
            hidden: true,
            oilMobil:true,
            addClickName:true,  // 名称的点击添加按钮 是否展示
            queryParams: {
                status:'1',   // status  默认
                oilBrandCode:'',
                oilNameCode:''
            },  // 油品配置表单搜索
            oilBrandList: [],   // 油品品牌数据表格
            keyRefresh:1,
            oilNameList:[],  // 油品数据表格
            oilOptionBrandList: [],      // 搜索栏 - 油品品牌 - 数据
            nameOptionList: [], // 搜索栏 - 油品名称 - 数据
            statusList: [{ value: "0", label: "禁用" },{  value: "1", label: "启用"}], //状态
            addOilBrand:false,
            currentRow: null,
            tableheight: `${document.documentElement.clientHeight- 370}px` ,
            oilBrandCodeSelect:'',
            oilNameCodeSelect:'',
            selectOilBrandObj:{},  // 选定的油品品牌对象
            selectOilNameObj:{},  // 选定的油品名称对象
        };
    },
    computed: {},
    methods: {
      // 刷新按钮
      handleRefresh() {
        this.loading = true
        this.requestMethodGet("/mdm/oil/synchronizeMdmOil",{}).then(res => {
            if(res.data.code == 1000) {
                this.loading = false
                this.$message({
                    message: '数据刷新成功！',
                    type: 'success'
                });
                this.queryParams = {
                    status:'1',
                    oilBrandCode:'',
                    oilNameCode:''
                },
                this.getOilBrand();
            } else {
                this.loading = false
                this.$message({
                    message: res.data.msg,
                    type: "warning",
                });
            }
        }).catch(res => {
        });
      },
      // 下载
      handleDownload () {   
        const loading = this.$loading({
          lock: true,
          text: '数据下载中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let paramObj = {
          oilBrandCode: this.queryParams.oilBrandCode,
          oilNameCode: this.queryParams.oilNameCode,
          status: this.queryParams.status,
          responseTypeBlob: true
        }
        this.requestMethodGet("/mdm/oil/exportMdmOil", paramObj).then(res => {
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
              link.setAttribute('download', '油品.xlsx')
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
      addOrEditOil(formName) {
        // 如果是新建，调取新建保存接口
        if(this.addType=='addBrand' || this.addType=='addName' ) {
            this.addOil(formName)
        } 
        // 如果是编辑，调取编辑保存接口
        if(this.addType=='editBrand' || this.addType=='editOilName' ) {
            this.editOil(formName)
        } 
      },
      // 新建油品
      addOil(formName) {
          const params={}
          // 新建油品品牌
          if(this.addType=='addBrand') {
              params.parentCode=0;
              params.name=formName.oilBrandName;
          }
          // 新建油品名称
          if(this.addType=='addName') {
              params.parentCode=formName.oilBrand;
              params.name=formName.oilName;
          }
          this.requestMethodPost("/mdm/oil/addOilConfiguration",params).then(res => {
              if(res.data.code == 1000) {
                  if(this.addType=='addBrand') {
                      this.$message({
                          message: "新建油品品牌成功",
                          type: "success"
                      });
                      this.getOilBrand()
                      this.queryParams.oilBrandCode = ''
                      this.industriesAllFilter(this.queryParams.oilBrandCode)
                  }
                  if(this.addType=='addName') {
                      this.$message({
                          message: "新建油品名称成功",
                          type: "success"
                      });
                      this.queryParams.oilNameCode = ''
                      this.getOilNameList(formName.oilBrand)
                  }
                  this.addOilDialog = false
              } else if(res.data.code == 4307){
                  this.$message({
                      message: res.data.msg,
                      type: "warning",
                  });
      
              } else {
                  this.$message.error(res.data.msg);
              }
          }).catch(res => {
          });
      },
      editOil(formName) {
          const params={}
          // 编辑品牌
          if(this.addType=='editBrand') {
              params.parentCode=0;
              params.code = formName.oilBrand
              params.name = formName.oilBrandName
          }
          // 编辑油品名称
          if(this.addType=='editOilName') {
              params.parentCode=formName.oilBrand;
              params.code = formName.oilName
              params.name = formName.oilTypeName
          }
          this.requestMethodPost("/mdm/oil/updateOil",params).then(res => {
              if(res.data.code == 1000) {
                  if(this.addType=='editBrand') {
                      this.$message({
                          message: "编辑油品品牌成功",
                          type: "success"
                      });
                      this.getOilBrand()
                  }
                  if(this.addType=='editOilName') {
                      this.$message({
                          message: "编辑油品名称成功",
                          type: "success"
                      });
                      this.getOilNameList(formName.oilBrand)
                  }
                  this.addOilDialog = false
              } else if(res.data.code == 4307){
                  this.$message({
                      message: res.data.msg,
                      type: "warning",
                  });
      
              } else {
                  this.$message.error(res.data.msg);
              }
          }).catch(res => {
          });
      },
      // 关闭添加自定义油品弹框
      closeDialogAdd() {
          Object.assign(this.$data.addOilForm, this.$options.data().addOilForm)
          this.addOilDialog = false;
      },
      // 油品品牌 change 事件 
      selectChangeOilBrand(val) {
        this.queryParams.oilNameCode= '';
        this.selectOilBrandObj={}
        this.selectOilNameObj={}
        this.nameOptionList=[]
        this.oilNameList=[]
        if(val=='oil_0001') {
            this.oilMobil = true
        } else {
            this.oilMobil = false
        }
        if(val) {
            this.oilBrandList = this.oilOptionBrandList.filter(item=>{return item.code==val})
            // 获取油品名称
            this.getOilNameList(this.queryParams.oilBrandCode)
        }else{
          this.getOilBrand('init')
        }
        this.cancelHightLight()
      },
      // 油品名称下拉change
      selectChangeOilName(val) {
        if(val) {
          this.oilNameList = this.nameOptionList.filter(item=> {return item.code==val})
        }else{
          this.oilNameList = this.nameOptionList
        }
      },
      getOilNameList(parentCode) {
        this.oilNameList = []
        if(parentCode=='oil_0001') {
            this.oilMobil = true
        } else {
            this.oilMobil = false
        }
        this.requestMethodGet("/mdm/oil/queryOilList",{oilName:'',parentCode:parentCode,status:this.queryParams.status}).then(res => {
          if(res.data.code == 1000) {
              this.oilNameList = res.data.data;
              this.nameOptionList = res.data.data
          }else {
              this.$message({
                  message: res.data.msg,
                  type: "warning",
              });
          }
        }).catch(res => {
        });
      },
      // 取消列表某一行的高亮
      cancelHightLight() {
        this.$refs.brandTable.setCurrentRow()
        this.$refs.namesTable.setCurrentRow()
      },
      // 状态切换
      statesChange(val) {
        this.queryParams.status = val;
        this.queryParams.oilNameCode = ''
        this.selectOilBrandObj={}
        this.selectOilNameObj={}
        this.cancelHightLight()
        this.loading = true
        this.oilBrandList =[]
        this.requestMethodGet("/mdm/oil/queryOilList",{oilName:'', parentCode:0, status:this.queryParams.status}).then(res => {
            this.loading = false
            if(res.data.code == 1000) {                  
                this.oilBrandList = res.data.data;
                if(this.queryParams.oilBrandCode){
                  let brandList = res.data.data.filter(item=>{
                    return item.code==this.queryParams.oilBrandCode
                  })
                  this.oilBrandList = brandList
                }
                this.oilNameList = []
                this.nameOptionList = []
                if(this.queryParams.oilBrandCode){
                  this.getOilNameChangeState(this.queryParams.oilBrandCode)
                }
            } else {
                this.$message({
                    message: res.data.msg,
                    type: "warning",
                });
            }
        }).catch(res => {
            this.loading=false
        });
      },
      getOilNameChangeState(parentCode) {
        if(parentCode=='oil_0001') {
            this.oilMobil = true
        } else {
            this.oilMobil = false
        }
        this.requestMethodGet("/mdm/oil/queryOilList",{oilName:'',parentCode:parentCode,status:this.queryParams.status}).then(res => {
          if(res.data.code == 1000) {
              this.oilNameList = res.data.data;
              this.nameOptionList = res.data.data
          }else {
              this.$message({
                  message: res.data.msg,
                  type: "warning",
              });
          }
        }).catch(res => {
        });
      },
      // 油品品牌 的远程搜索事件
      industriesAllFilter(val) {
        this.oilOptionBrandList = []
        this.oilBrandList = []
        this.requestMethodGet("/mdm/oil/queryOilList",{oilName:val,parentCode:0,status:this.queryParams.status}).then(res => {
            if(res.data.code == 1000) {
                this.oilOptionBrandList = res.data.data;
                this.oilBrandList = res.data.data;
            }else {
                this.$message({
                    message: res.data.msg,
                    type: "warning",
                });
            }
        }).catch(res => {
        });
      },
      // 获取油品品牌
      getOilBrand(val) {
          this.loading = true
          this.oilBrandList =[]
          this.oilOptionBrandList = []
          this.requestMethodGet("/mdm/oil/queryOilList",{oilName:'', parentCode:0, status:this.queryParams.status}).then(res => {
              this.loading = false
              if(res.data.code == 1000) {                    
                  this.oilBrandList = res.data.data;
                  this.oilOptionBrandList = res.data.data;
                  if(!val){
                    this.getOilNameList(this.oilBrandList[0].code)
                  }
              } else {
                  this.$message({
                      message: res.data.msg,
                      type: "warning",
                  });
              }
          }).catch(res => {
              this.loading=false
          });
      },
      // 禁用 数据
      disabledItem(row) {
        this.checkDisableIndustryDevice(row)
      },
        // 禁用校验
        checkDisableIndustryDevice(row) {
            this.requestMethodGet("/mdm/oil/checkDisableOil",{code:row.code}).then(res => {
                if(res.data.code == 1000) {
                    this.$confirm('确定要禁用这条数据吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.requestMethodPost("/mdm/oil/enableOrDisableOilConfiguration",{code:row.code,status:0}).then(res => {
                            if(res.data.code == 1000) {
                                this.$message({
                                    message: "禁用油品成功",
                                    type: "success"
                                });
                                this.getOilBrand()
                                this.$refs.brandTable.setCurrentRow()
                                this.selectOilBrandObj={}
                                this.selectOilNameObj={}
                            }
                        }).catch(res => {
                        });
                    }).catch(() => {
                    });
                } else {
                    this.$confirm('您禁用的油品有启用下级油品，是否全部禁用?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                        this.requestMethodPost("/mdm/oil/enableOrDisableOilConfiguration",{code:row.code,status:0}).then(res => {
                            if(res.data.code == 1000) {
                                this.$message({
                                    message: "禁用油品成功",
                                    type: "success"
                                });
                                this.getOilBrand()
                                this.$refs.brandTable.setCurrentRow()
                                this.selectOilBrandObj={}
                                this.selectOilNameObj={}
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
                    this.requestMethodGet("/mdm/oil/updateStatusByCode",{code:row.code}).then(res => {
                        if(res.data.code == 1000) {
                            this.$message({
                                message: "启用油品成功",
                                type: "success"
                            });
                            this.getOilBrand()
                            this.$refs.brandTable.setCurrentRow()
                            this.selectOilBrandObj={}
                            this.selectOilNameObj={}
                        }else {
                            this.$message({
                                message: res.data.msg,
                                type: "warning",
                            });
                        }
                    }).catch(res => {
                    });
                }).catch(() => {       
                });
        },
        // 重置表单
        handleClearSearch() {
            this.queryParams = {
                status:'1',
                oilBrandCode:'',
                oilNameCode:''
            };
            this.oilOptionBrandList = [];
            this.oilBrandList = [];
            this.oilNameList = [];
            this.nameOptionList = [];
            this.selectOilBrandObj={}
            this.selectOilNameObj={}
            this.getOilBrand('init');
            this.cancelHightLight()
        },
        // 油品品牌 - 点击新增
        renderHeader() {
            if(JSON.stringify(this.selectOilBrandObj) != "{}" && this.selectOilBrandObj.status=='0') {
                return (
                    <div>
                    <el-button  onClick={this.enableItemBrand}  style='border:none;background:none;padding:0px;color:#999;' >
                        启用
                    </el-button>
                    </div>
                )
            } else if ((JSON.stringify(this.selectOilBrandObj) != "{}" && this.selectOilBrandObj.status=='1') || JSON.stringify(this.selectOilBrandObj) == "{}"){
                return (
                    <div>
                    <el-button   onClick={this.addItemBrand}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        新建
                    </el-button>
                    <el-button   onClick={this.editItemBrand}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                        编辑
                    </el-button>
                    <el-button   onClick={this.forbiddenItemBrand}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        禁用
                    </el-button>
                    </div>
                )
            }
        },
         // 油品名称 - 点击新增
        renderHeaderOil() {
            if(JSON.stringify(this.selectOilNameObj) != "{}" && this.selectOilNameObj.status=='0') {
                return (
                    <div >
                    <el-button  onClick={this.enableItemOil}  style='border:none;background:none;padding:0px;color:#999;' >
                        启用
                    </el-button>
                    </div>
                )
            } else if((JSON.stringify(this.selectOilNameObj) != "{}" && this.selectOilNameObj.status=='1') || JSON.stringify(this.selectOilNameObj) == "{}") {
                return (
                    <div >
                    <el-button  onClick={this.addItemOil}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        新建                
                    </el-button>
                    <el-button   onClick={this.editItemOil}  style='border:none;background:none;padding:0px;color:#66b1ff;' >
                        编辑
                    </el-button>
                    <el-button    onClick={this.forbiddenItemOil}  style='border:none;background:none;padding:0px;color:#dd0000;' >
                        禁用
                    </el-button>
                    </div>
                )
            }
        },
        // 油品品牌 - 数据 - 表格
        addItemBrand() {
            this.addOilDialog=true
            this.addType = 'addBrand'
            this.addOilForm={
                oilBrandName: ""
            }
        },
        // 编辑油品品牌
        editItemBrand() {
            if(JSON.stringify(this.selectOilBrandObj) == "{}") {
                this.$message.warning('请选择油品品牌再进行编辑');
                return
            }
            if(this.selectOilBrandObj.code=='oil_0001') {
                this.$confirm('美孚油品无法编辑，请联系MDM平台进行改操作！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            this.addOilDialog=true
            this.$refs.child.getOilBrandChild()
            this.addOilForm= {
                oilBrand: this.selectOilBrandObj.code,
                oilName: ""
            }
            this.addType = 'editBrand'
        },
        // 启用油品品牌
        enableItemBrand() {
            if(JSON.stringify(this.selectOilBrandObj) == "{}") {
                this.$message.warning('请选择油品品牌再进行启用操作');
                return
            }
            this.handleItemBrand('startUse','brand')
        },
        // 禁用油品品牌
        forbiddenItemBrand() {
            if(JSON.stringify(this.selectOilBrandObj) == "{}") {
                this.$message.warning('请选择油品品牌再进行禁用操作');
                return
            }
            this.handleItemBrand('disabled','brand')
        },
        handleItemBrand(val,flag) {
            let obj={}
            if(flag=='brand') {
                obj=this.selectOilBrandObj
            } else if(flag=='name') {
                obj=this.selectOilNameObj
            }
            if(this.oilMobil) {
                this.$confirm('美孚油品无法禁用/启用，请联系MDM平台进行改操作！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            if(val=='disabled') {
                this.disabledItem(obj)
            } else {
                this.startUseItem(obj)
            }
        },
        // 油品点击新增
        addItemOil() {
            if(JSON.stringify(this.selectOilBrandObj) == "{}") {
                this.$message.warning('请选择油品品牌再进行新建');
                return
            }
            if(this.selectOilBrandObj.status=='0') {
                this.$confirm('您新建的油品品牌已禁用！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            this.addOilDialog=true
            this.addOilForm= {
                oilBrand: this.selectOilBrandObj.code,
                oilName: ""
            }
            this.$refs.child.getOilBrandChild()
            this.addType = 'addName'
        },
        // 编辑油品名称
        editItemOil() {
            console.log(this.selectOilBrandObj)
            if(JSON.stringify(this.selectOilNameObj) == "{}" || JSON.stringify(this.selectOilBrandObj) == "{}") {
                this.$message.warning('请确保已选择油品名称再进行编辑');
                return
            }
            this.addOilDialog=true
            this.addOilForm= {
                oilBrand: this.selectOilBrandObj.code,
                oilName: this.selectOilNameObj.code
            }
            this.$refs.child.getOilBrandChild()
            this.addType = 'editOilName'
        },
        forbiddenItemOil() {
            if(JSON.stringify(this.selectOilNameObj) == "{}") {
                this.$message.warning('请确保已选择油品名称再进行禁用');
                return
            }
            this.handleItemBrand('disabled','name')
        },
        enableItemOil() {
            if(this.selectOilBrandObj.status=='0') {
                this.$confirm('您启用的油品品牌已禁用！', '提示', {
                    confirmButtonText: '确定',
                    showCancelButton:false,
                    type: 'warning'
                    }).then(() => {
                    
                    }).catch(() => {       
                });
                return
            }
            if(JSON.stringify(this.selectOilNameObj) == "{}") {
                this.$message.warning('请确保已选择油品名称再进行启用');
                return
            }
            this.handleItemBrand('startUse','name')
        },
        // 点击油品品牌某条数据
        clickOilBrandItem(val) {
          this.selectOilBrandObj = val
          this.selectOilNameObj={}
          if(val.code=="oil_0001") {
              this.oilMobil = true
          } else {
              this.oilMobil = false
          }
          this.getOilNameList(val.code)
        },
        clickNameItem(val){
            this.selectOilNameObj = val
        },
        onResize(){
            this.mainminheight = `height:${document.documentElement.clientHeight- 140}px`
            this.tableheight= `${document.documentElement.clientHeight- 370}px`
        }
    },
    mounted() {
        this.getOilBrand('init');
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.dealer-progile {
    padding: 20px;
    height: calc(100%);
    overflow: auto;
    .form-search-item {
    label {
        display: block;
        padding-bottom: 10px;
        }
    }
}
</style>
