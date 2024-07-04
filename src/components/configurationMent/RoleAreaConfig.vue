<template>
<div style="position: relative">
  <div class="area-config" :style="mainminheight" id="areaconfigDiv">
    <!-- 表格 -->
    <custom-table class="table" :tableHeader="tableDataHeader" :tableData="tableData" :tableHeight="tableHeight + ''" :loading="loading">
      <el-table-column slot="empty" width="" :resizable="false" label=""> </el-table-column>
      <el-table-column :resizable="false" slot="operation" fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
            <el-link type="danger" :disabled="scope.row.areaCode == 'area_0000'" @click="editRow(scope.row)" style="margin-right:10px" v-has="RACEditBtn">编辑</el-link>
        </template>
      </el-table-column>
    </custom-table>
    <!-- 弹框 -->
    <el-dialog
      title="合并区域"
      :visible.sync="dialogVisible"
      width="700px"
      :close-on-click-modal="false"
      @close="initList">
      <el-form label-position="top">
          <el-form-item label="区域选项：">
              <div style="display: flex;align-items: center;">
                  <div class="area-content">
                      <div class="area" :style="{width:(item.length>2?14*(item.length+1):50)+'px'}" v-for="(item,idx) in rowAreaList" :key="idx">{{item}}</div>
                  </div>
                  <div style="margin-left:30px"><el-button :disabled="cancelDisabled" @click="cancelArea" plain size="small">取消合并</el-button></div>
              </div>
          </el-form-item>
          <el-form-item label="合并操作：">
              <div style="display: flex;align-items: center;">
                  <div class="area-content">
                      <el-checkbox-group v-model="checkList">
                          <el-checkbox v-for="(item,idx) in areaList" :label="item.label" :key="idx"></el-checkbox>
                      </el-checkbox-group>
                  </div>
                  <div style="margin-left:30px"><el-button @click="mergeArea" type="danger" plain size="small">合并</el-button></div>
              </div>
              <div style="color:#f56c6c">注：至少选择两个区域</div>
          </el-form-item>
      </el-form>
    </el-dialog>
    </div>
</div>
</template>

<script>
import customTable from "../tableComponents/customTable";
export default {
   components: {
      "custom-table": customTable
    },
    data(){
        return{
            loading: false,
            tableHeight: null,
            tableDataHeader: [
              { prop: "roleName", label: "角色", width: "200", tooltip: true },
              { prop: "areaName", label: "区域选项", width: "300", tooltip: true }
            ],
            tableData:[],
            mainminheight: `height:${document.documentElement.clientHeight - 140}px`,
            pagenation:{
                current: 1,
                size: 30
            },
            dialogVisible:false,
            areaList:[
                {
                   label:'东区',
                   value:'area_0001'
                },{
                   label:'南区',
                   value:'area_0002'
                },{
                   label:'北区',
                   value:'area_0003'
                },{
                   label:'西南区',
                   value:'area_0004'
                },{
                   label:'西北区',
                   value:'area_0005'
                }
            ],
            defaultAreaList:['东区','南区','北区','西南区','西北区'],
            checkList:[],
            defaultList:[],
            cancelDisabled:true,
            editDistributeCode:'',
            editDistributeName:'',
            rowAreaList:[]
        }
    },
    created(){
        this.initList()
        this.handleTableHeight();
        if(this.judgeBtn()){
          this.tableDataHeader.push({ slot: "operation", label: "操作" })
        }
        window.addEventListener("resize", () => {
          this.mainminheight = `height:${document.documentElement.clientHeight - 140}px`;
          this.$nextTick(() => {
            this.handleTableHeight();
          });
        });
    },
    methods:{
      judgeBtn() {
        let isExit = false;
        let buttonpermsStr = JSON.parse(sessionStorage.getItem("btnPremissions"));
        if (buttonpermsStr === undefined || buttonpermsStr === null) {
          return false;
        }
        for (let i = 0; i < buttonpermsStr.length; i++) {
          if ('RACEditBtn' === buttonpermsStr[i].menuCode) {
            isExit = true;
            break;
          }
        }
        return isExit;
      },
      // 自适应获取table高度
      handleTableHeight() {
        setTimeout(() => {
          let areaconfigDiv=0
          let searchFormHeight=0
          if (document.getElementById("areaconfigDiv")) {
            areaconfigDiv = document.getElementById("areaconfigDiv").clientHeight;
          }
          if (document.getElementById("searchForm")) {
            searchFormHeight = document.getElementById("searchForm").clientHeight;
          }
          this.tableHeight = Number(areaconfigDiv) - Number(searchFormHeight) - 40;
        }, 200);
      },
        // 初始化列表
        initList(){
          this.loading = true
            this.requestMethodGet('/web/sys/conf/area/selectRoleArea').then(res=>{
                const data = res.data
                this.loading = false
                if(data.code == 1000){
                    this.tableData = data.data
                }
            }).catch(err=>{
                this.loading = false
            })
        },
        // 编辑 、
        editRow(val){
            this.editDistributeCode = val.roleId
            this.editDistributeName = val.roleName
            this.rowAreaList = val.areaName.split('、')
            this.cancelDisabled = !(val.areaName.indexOf('&') !=-1)
            this.dialogVisible = true
        },
        // 取消合并
        cancelArea(){
            const params = {
                    roleId:this.editDistributeCode
                }
                this.requestMethodGet('/web/sys/conf/area/removeAreaMerge',params).then(res=>{
                    const data = res.data
                    if(data.code == 1000){
                        this.rowAreaList = this.defaultAreaList
                        this.cancelDisabled = !this.cancelDisabled
                    }else{}
                }).catch(err=>{})
        },
        // 合并
        mergeArea(){
            const str = this.checkList.join(',')
            let checkedArr = []
            let notCheckArea = []
            // 必须勾选两个以上才可以
            if(this.checkList.length>1){
                // 转换成接口需要参数结构
                this.checkList.forEach(it=>{
                    this.areaList.forEach(item=>{
                        let obj = {}
                        obj.name = item.label
                        obj.code = item.value
                        if(it === item.label){
                            obj.checkedFlag = 1
                            checkedArr.push(obj)
                        }else{
                            obj.checkedFlag = 0
                            notCheckArea.push(obj)
                        }
                    })
                })
                let arr = [...checkedArr,...notCheckArea]
                let obj = {};
                let checkedAreaList = arr.reduce((cur,next) => {
                    obj[next.code+next.name] ? "" : obj[next.code+next.name] = true && cur.push(next);
                    return cur;
                },[]) 
                const params = {
                    roleId:this.editDistributeCode,
                    roleName:this.editDistributeName,
                    areaList:checkedAreaList
                }
                this.requestMethodPost('/web/sys/conf/area/saveRoleArea',params).then(res=>{
                    const data = res.data
                    if(data.code == 1000){
                        // 合并后区域选项显示字段
                        let mergeName = []
                        let noMergeName = []
                        checkedAreaList.forEach(it=>{
                            if(!it.checkedFlag){
                                noMergeName.push(it.name)
                            }else{
                                mergeName.push(it.name)
                            }
                        })
                        const mergeStr = mergeName.join('&')
                        noMergeName.push(mergeStr)
                        this.rowAreaList = noMergeName
                        this.checkList = []
                        this.cancelDisabled = false
                        // console.log(this.rowAreaList)
                        // console.log('checkedArr',noMergeName,mergeName)
                    }
                })
            }else{
                this.$message({
                    message: '至少选择两个区域',
                    type: 'warning'
                });
            }
        },
        // 大小改变
        handleSizeChange(){

        },
        // 页数改变
        handleCurrentChange(){

        },
    },
    beforeDestroy() {
      window.removeEventListener("resize", () => {
        this.handleTableHeight();
      });
    }
}
</script>

<style lang="less" scoped>
@import "../../assets/css/customTable.less";
.area-content{
    display: flex;
    border: 1px solid #DCDFE6;
    align-items: center;
    justify-content: center;
    padding: 5px 30px;
    border-radius: 5px;
}
.area{
    width: 50px;
}
.area-config {
  padding: 0 20px 20px;
  height: 100%;
  position: relative;
  overflow: auto;
  &-serach-item {
    label {
      display: inline-block;
      width: auto;
      text-align: left;
      margin-right: 12px;
      padding-bottom: 10px;
    }
  }
}
</style>