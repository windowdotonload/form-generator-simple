<!--
* @description 账号管理
* @fileName accountManagement.vue
* @author vvx
* @date 2020/05/15 15:30:23
* @version V1.0.0
!-->
<template>
<div style="position:relative">
    <div style="position:absolute;top:-55px;width:100%;height:60px;line-height:60px;text-align:center;cursor:pointer;color:#009900" v-if="showMslaSuccess">
        <i class="el-icon-info"></i> MSLA系统的商品库更新成功，请前往仓库中的商品进行<span style="color:#3399FF" @click="activeName = 'third'">查看</span>
    </div>
    <div class="equipment-management" :style="mainminheight">
    <div style="padding:20px 0;">
        <label for>关键字查询：</label>
        <el-input
        v-model="queryParams.productNumber"
        @change="handleSearchTableData"
        size="small"
        maxlength="50"
        placeholder="请输入商品ID/名称"
        style="width:22%;margin-right:20px"
        clearable
        ></el-input>
        <el-button type="danger" plain icon="el-icon-refresh" @click="handleRefresh" style="float:right;margin-left:20px" size="small" v-has="GoodsRefreshBtn">MSLA商品同步</el-button>
        <el-button type="danger" plain icon="el-icon-download" @click="handleDownRecord" style="float:right;margin-left:20px" size="small" v-has="GoodsRecordBtn">操作日志</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部商品" name="first">
            <!-- 表格 -->
            <el-table
            ref="accountTable"
            :key="key"
            row-key="id"
            :data="goodsTableData"
            @cell-click="handleLookGoods"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{background:'#f7f7f7'}"
            v-loading="loading"
            stripe
            >
            <el-table-column prop="businessLineName" label="业务类型" min-width="8%"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="productNumber" label="商品编号" min-width="10%"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="coverImgUrl" label="商品头图" min-width="15%"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <div style="max-height:200px;"><el-image :src="scope.row.coverImgUrl?scope.row.coverImgUrl:''" :preview-src-list="[scope.row.coverImgUrl]" fit="contain" style="max-width: 100px; max-height: 120px">
                        <div slot="error" class="image-slot">
                            暂无图片
                            </div></el-image></div>
                </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称" min-width="10%"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="productPrice" label="价格" min-width="8%"  show-overflow-tooltip>
                 <template slot-scope="scope">
                    <span>{{scope.row.productPrice == '0.00'?'':scope.row.unit}}{{scope.row.productPrice == '0.00'?'暂无':scope.row.productPrice}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="maxNum" label="单次限购数量" min-width="6%" ></el-table-column>
            <el-table-column prop="stateDesc" label="状态" min-width="10%" ></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="10%" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" min-width="8%">
                <template slot-scope="scope">
                <el-link
                    type="danger"
                    v-has="GoodsEditBtn"
                    @click="editGoods(scope.row)"
                    style="margin-right:10px;color:#fe000c"
                >编辑</el-link>
                <el-dropdown @command="handleCommand($event,scope)" v-has="GoodsMoreBtn">
                    <span class="el-dropdown-link" style="color:#fe000c;cursor:pointer">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item style="text-align:center" v-if="scope.row.state == 1 && scope.row.topFlag == 'N'" command="a" >
                            <el-link
                                type="danger"
                                style="color:#fe000c;"
                            >置顶</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item style="text-align:center" v-if="scope.row.state == 1 && scope.row.topFlag == 'Y'" command="b" >
                            <el-link
                                type="danger"
                                style="color:#fe000c;"
                            >取消置顶</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item style="text-align:center" v-if="scope.row.moveDown != 'hide' && scope.row.state == 1" command="c">
                            <el-link
                            type="danger"
                            >{{scope.row.moveDown?'下移':'上移'}}</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item style="text-align:center" command="d">
                            <el-link
                            type="danger"
                            >{{scope.row.state == 1?'下架':'上架'}}</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item style="text-align:center" v-if="scope.row.state != 1" command="e">
                            <el-link
                            type="danger"
                            >删除</el-link>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                    <img src="../../assets/topIcon.png" alt="置顶" style="vertical-align:bottom;position:absolute;right:10px;"  v-if="scope.row.topFlag == 'Y' && scope.row.state == 1">
                </template>
            </el-table-column>
            </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="上架的商品" name="second">    
              <!-- 表格 -->
                <el-table
                ref="upGoodsTableData"
                :key="key"
                row-key="id"
                :data="upGoodsTableData"
                tooltip-effect="dark"
                @cell-click="handleLookGoods"
                style="width: 100%"
                :header-cell-style="{background:'#f7f7f7'}"
                v-loading="loading"
                stripe
                >
                <el-table-column prop="businessLineName" label="业务类型" min-width="8%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productNumber" label="商品编号" min-width="10%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="coverImgUrl" label="商品头图" min-width="15%"  show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div style="max-height:200px;"><el-image :src="scope.row.coverImgUrl?scope.row.coverImgUrl:''" :preview-src-list="[scope.row.coverImgUrl]" fit="contain" style="max-width: 100px; max-height: 120px">
                            <div slot="error" class="image-slot">
                                暂无图片
                            </div></el-image></div>
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品名称" min-width="10%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productPrice" label="价格" min-width="8%"  show-overflow-tooltip>
                     <template slot-scope="scope">
                        <span>{{scope.row.productPrice == '0.00'?'':scope.row.unit}}{{scope.row.productPrice == '0.00'?'暂无':scope.row.productPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="maxNum" label="单次限购数量" min-width="6%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="stateDesc" label="状态" min-width="10%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="publishTime" label="发布时间" min-width="10%"  show-overflow-tooltip></el-table-column>
          
                <el-table-column label="操作" min-width="8%" >
                <template slot-scope="scope">
                <el-link
                    type="danger"
                    v-has="GoodsEditBtn"
                    @click="editGoods(scope.row)"
                    style="margin-right:10px;color:#fe000c"
                >编辑</el-link>
                <el-dropdown @command="handleCommand($event,scope)" v-has="GoodsMoreBtn">
                    <span class="el-dropdown-link" style="color:#fe000c;cursor:pointer">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item style="text-align:center" v-if="scope.row.topFlag == 'N'" command="a">
                            <el-link
                                type="danger"
                                style="color:#fe000c;"
                            >置顶</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item style="text-align:center" v-if="scope.row.topFlag == 'Y'" command="b">
                            <el-link
                                type="danger"
                                style="color:#fe000c;"
                            >取消置顶</el-link>
                        </el-dropdown-item>
                        <el-dropdown-item style="text-align:center" v-if="scope.row.moveDown != 'hide'" command="c">
                            <el-link
                            type="danger"
                            >{{scope.row.moveDown?'下移':'上移'}}</el-link>
                        </el-dropdown-item>
                         <el-dropdown-item style="text-align:center" command="d">
                            <el-link
                            type="danger"
                            >{{scope.row.state == 1?'下架':'上架'}}</el-link>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                    <img src="../../assets/topIcon.png" alt="置顶" style="vertical-align:bottom;position:absolute;right:10px;"  v-if="scope.row.topFlag == 'Y'">
                </template>
                </el-table-column>
                </el-table>
        </el-tab-pane>
        <!-- 仓库中的商品 -->
        <el-tab-pane label="仓库中的商品" name="third">    
              <!-- 表格 -->
                <el-table
                ref="downGoodsTableData"
                :key="key"
                row-key="id"
                :data="downGoodsTableData"
                tooltip-effect="dark"
                @cell-click="handleLookGoods"
                style="width: 100%"
                :header-cell-style="{background:'#f7f7f7'}"
                v-loading="loading"
                stripe
                >
                <el-table-column prop="businessLineName" label="业务类型" min-width="15%"  show-overflow-tooltip></el-table-column>
                  <el-table-column prop="productNumber" label="商品编号" min-width="12%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productName" label="商品名称" min-width="15%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="productPrice" label="价格" min-width="8%"  show-overflow-tooltip>
                     <template slot-scope="scope">
                        <span>{{scope.row.productPrice == '0.00'?'':scope.row.unit}}{{scope.row.productPrice == '0.00'?'暂无':scope.row.productPrice}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="maxNum" label="单次限购数量" min-width="10%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="stateDesc" label="状态" min-width="10%"  show-overflow-tooltip></el-table-column>
                <el-table-column prop="updateTime" label="更新时间" min-width="10%"  show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" min-width="8%" >
                    <template slot-scope="scope">
                    <el-link
                        type="danger"
                        @click="editGoods(scope.row)"
                        v-has="GoodsEditBtn"
                        style="margin-right:10px;color:#fe000c"
                    >编辑</el-link>
                    <el-link
                        type="danger"
                        @click="updateGoodsStatus(scope.row)"
                        v-has="GoodsMoreBtn"
                        style="margin-right:10px;color:#fe000c"
                    >上架</el-link>
                    <el-link
                        type="danger"
                        style="color:#fe000c"
                        v-has="GoodsMoreBtn"
                        @click="handleDeleteGoods(scope.row)"
                    >删除</el-link>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
    <el-pagination
    v-if="totalNumber>0"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenation.current"
    :page-size="pagenation.size"
    :page-sizes="[5,10,20,30,50]"
    layout="total, sizes, prev, pager, next, jumper"
    :total="totalNumber"
    style="float: right;display:flex; margin-top: 10px"
    ></el-pagination>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      activeName:'first',
      mainminheight: `height:${document.documentElement.clientHeight - 200}px`,
      queryParams: {
        productNumber: ""
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
      totalNumber: 0, //总条数
      goodsTableData: [],
      selectList: [],
      upGoodsTableData:[],
      downGoodsTableData:[],
      dialogFormVisible: false, //新增账号对话框
      ruleForm: {
        companyNumber: "", //公司名称
        deviceNumber: "", //设备名称
        lubricationPointNumber: ''
      },
      dialogTitle: "",
      showMslaSuccess:false,
      loading: false, //是否加载
      isloading:false,//远程搜索loading
    };
  },

  components: {},

  computed: {},
  created() {
  },
  beforeRouteLeave(to, from, next) {
    this.queryParams.current = this.pagenation.current
    this.queryParams.size = this.pagenation.size
    this.queryParams.activeName = this.activeName
    sessionStorage.setItem("queryParams", JSON.stringify(this.queryParams));
    next();
  },
  beforeRouteEnter(to, from, next) {
    if (from.path == "/GoodsManagement/EditGoods" || from.path == "/GoodsManagement/LookGoods") {
      to.params.isSaveQuery = true;
    }
    next();
  },
  mounted() {
    if (this.$route.params.isSaveQuery) {
      this.queryParams = JSON.parse(sessionStorage.getItem("queryParams"));
      this.pagenation.current = this.queryParams.current 
      this.pagenation.size = this.queryParams.size
      if(this.$route.params.activeName) {
        this.activeName = this.$route.params.activeName
        this.pagenation.current = 1
      } else {
        this.activeName = this.queryParams.activeName
      }
    } 
    this.$_queryGoodsList(); //获取商品列表
  },
  methods: {
    // 操作
    handleCommand(command,scope) {
        if(command == 'a') {
            this.handleTop(scope.row)
        }
        if(command == 'b') {
            this.handleDown(scope.row)
        }
        if(command == 'c') {
            this.moveRow(scope.row)
        }
        if(command == 'd') {
            this.updateGoodsStatus(scope.row)
        }
        if(command == 'e') {
            this.handleDeleteGoods(scope.row)
        }
    },
    // 刷新数据
    handleRefresh(e) {
      let target = e.target;
      if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
          target = e.target.parentNode;
      }
      target.blur()
      this.loading = true;
      this.requestMethodPost("/msla/kit/syncProduct", {},true)
        .then(res => {
          res = res.data;
          if (res.code == 1000) {
            this.showMslaSuccess = true
            setTimeout(()=>{
                this.showMslaSuccess = false
            },5000)
            this.$_queryGoodsList(); //获取商品列表
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
    handleDownRecord(e){
      let target = e.target;
      if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
          target = e.target.parentNode;
      }
      target.blur()
      const loading = this.$loading({
          lock: true,
          text: '数据下载中，请稍后',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        let paramObj = {
          responseTypeBlob: true
        }
        this.requestMethodGet("/msla/kit/operateLog/exportAll", paramObj).then(res => {
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
              link.setAttribute("download", "商品操作日志.xls");
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
    moveRow(row){
        let params = {
            id:row.id, 
            topFlag:row.topFlag, 
            upOrDown:1  
        };
        if(row.moveDown) {
            params.upOrDown = 2
        }
        this.requestMethodPost("/msla/kit/updateProductUpOrDown", params,true)
            .then(res => {
            res = res.data;
            if (res.code == 1000) {
                this.$message({
                    message: `移动成功`,
                    type: "success"
                });
                this.$_queryGoodsList('move') 
            } else {
                this.$message({
                    message: res.msg,
                    type: "warning"
                });
            }
            }).catch(res => {});
    },
        // 点击置顶 
    handleTop(row) {
        let params = {
            id:row.id,
        }
        this.requestMethodPost("/msla/kit/updateProductToTop",params,true).then(res => {
            if(res.data.code == 1000) {
                this.$message({
                    message: "置顶成功",
                    type: "success"
                });
                this.$_queryGoodsList() 
            }else {
                this.$message({
                    message: res.data.msg,
                    type: "warning"
                });
            }
        }).catch(res => {
        });
    },
    // 取消置顶 
    handleDown(row) {
        let params = {
            id:row.id,
        }
        this.requestMethodPost("/msla/kit/updateProductRemoveTop",params,true).then(res => {
            if(res.data.code == 1000) {
                this.$message({
                    message: "取消置顶成功",
                    type: "success"
                });
                this.$_queryGoodsList() 
            }else {
                this.$message({
                    message: res.data.msg,
                    type: "warning"
                });
            }
        }).catch(res => {
        });
    },
    // 上下架商品
    updateGoodsStatus(row){
        
        let params = {
            id:row.id,
        }
        let url = "/msla/kit/updateProductOnShelf"
        let status = '上架'
        if(row.state == 1) {
            url = "/msla/kit/updateProductOffShelf"
            status = '下架'
        }
        this.$confirm(`是否${status}该商品?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass:'deletBtn',
          type: 'warning'
        }).then(() => { 
            this.requestMethodPost(url,params,true).then(res => {
                if(res.data.code == 1000) {
                    let msg = '上架成功'
                    if(row.state == 1) {
                        msg = '下架成功'
                    }
                    this.$message({
                        message: msg,
                        type: "success"
                    });
                    this.$_queryGoodsList() 
                }else {
                    this.$message({
                        message: res.data.msg,
                        type: "warning"
                    });
                }
            }).catch(res => {
            });
         }).catch(() => {});

    },
    // 删除商品
    handleDeleteGoods(row){
        this.$confirm('此操作将永久删除该数据, 是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass:'deletBtn',
          type: 'warning'
        }).then(() => {
            let params = {
                id:row.id
            }
            this.requestMethodPost('/msla/kit/updateProductDel',params,true).then(res => {
                if(res.data.code == 1000) {
                    this.$message({
                        message: '删除成功',
                        type: "success"
                    });
                    this.$_queryGoodsList() 
                }else {
                    this.$message({
                        message: res.data.msg,
                        type: "warning"
                    });
                }
            }).catch(res => {});
        }).catch(() => {});

    },
    onResize() {
      this.mainminheight = `height:${document.documentElement.clientHeight -
        200}px`;
    },
    handleClick(val)  {
        this.activeName =val.name
        this.pagenation.current = 1
        this.$_queryGoodsList();
    },
       // 获取全部商品数据
    $_queryGoodsList(val) {
        if(!val){
            this.loading = true;
        }
      let params = { 
        productNumber:this.queryParams.productNumber,
        current:this.pagenation.current,
        size:this.pagenation.size
      };
      if(this.activeName == 'third') {
          params.state = 2
      } 
      if(this.activeName == 'second') {
          params.state = 1
      }
    //   this.goodsTableData = []
      this.requestMethodGet("/msla/kit/queryProductListByPage", params)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            let firstN = res.data.list.findIndex(item => {
                return item.topFlag == 'N'
            })
            res.data.list.forEach((item,index) =>{
                if(this.pagenation.current == 1) {
                    if(firstN == 0) {
                        if(index == 0){
                            item.moveDown = true
                        }else {
                            item.moveDown = false
                        }
                    }else {
                        if(index == firstN-1) {
                            item.moveDown = false
                        }else if(index == firstN){
                            item.moveDown = true
                        }else {
                            item.moveDown = false
                        }
                        if(index == 0 && firstN-1 != 0){
                            item.moveDown = true
                        }
                        if(index == 0 && firstN == 1) {
                            item.moveDown = 'hide'
                        }
                    }
                }else {
                    if(firstN > 0) {
                        if(index == firstN) {
                            item.moveDown = true
                        }else {
                            item.moveDown = false
                        }
                    }else {
                        item.moveDown = false
                    }
                }

            })
            if(this.activeName == 'third') {
                this.downGoodsTableData = res.data.list;
            } else if(this.activeName == 'second') {
                this.upGoodsTableData = res.data.list;
            } else {
                this.goodsTableData = res.data.list;
            }
             this.totalNumber = res.data.totalCount;
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
      this.$_queryGoodsList(); //获取商品列表
      let target = e.target;
      if(target.nodeName == 'SPAN' || target.nodeName == 'I'){
          target = e.target.parentNode;
      }
      target.blur()
    },
    //跳转编辑商品页面
    editGoods(row){
        this.$router.push({
            path: "/GoodsManagement/EditGoods",
            query: {
                id: row.id,
            }
        });
    },
    //跳转查看商品页面
    handleLookGoods(row,column, cell, event){
        if(column.label != '操作' && column.label != '商品头图'){
            this.$router.push({
                path: "/GoodsManagement/LookGoods",
                query: {
                    id: row.id,
                }
            });
        }

    },
    // page change  事件
    handleCurrentChange(page) {
      this.pagenation.current = page;
      this.$_queryGoodsList(); //获取商品列表
    },
    // size change 事件
    handleSizeChange(size) {
      this.pagenation.size = size;
      this.pagenation.current = 1;
      this.$_queryGoodsList(); //获取商品列表
    },
  }
};
</script>
<style lang='less'>
.equipment-management {
  padding: 10px 25px;
  height: 100%;
  position:relative;
  overflow: auto;
  &-serach-item {
    margin: 15px 0 30px;
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color:rgba(254, 0, 12, 1) !important;
      border-color:rgba(254, 0, 12, 1) !important;
  }
  .el-radio-button__inner:hover{
      color: rgba(254, 0, 12, 1) !important;
  }
  .is-active .el-radio-button__inner:hover {
      color: #fff !important;
  }
  .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: #f5f7fa !important;
  }
  //  .el-pagination.is-background .el-pager li:not(.disabled).active {
  //   background:#fe000c !important;
  // }
   .el-tabs__item.is-active {
    color:#fe000c !important;
    font-weight: 900 !important;
  }
  .el-tabs__active-bar {
    background-color: #fe000c !important;
  }
  .el-tabs__item:hover {
    color:#fe000c !important;
  }
  .el-pagination{
    position: fixed;
    bottom:25px;
    right: 25px;
  }
  .deletBtn .el-button--primary {
    background-color:#fe000c !important;
    border-color:#fe000c !important;
    }   
  .deletBtn .el-message-box__container {
        position: relative;
    }
  .deletBtn .el-icon-warning {
    color: #fe000c !important;
    top: 15px !important;
  }
}
</style>
<style>
.equipment-management .el-form--label-top .el-form-item__label {
  padding: 0 !important;
}
</style>