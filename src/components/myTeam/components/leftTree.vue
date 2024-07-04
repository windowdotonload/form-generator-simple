<template>
<div style="height: 100%;overflow-y: auto;padding-right: 20px;">
  <el-tree
    class="filter-tree"
    :data="treeData"
    node-key="id"
    :indent="25"
    :props="{children: 'children',label: 'name'}"
    :auto-expand-parent="false"
    :expand-on-click-node="false"
    :default-expanded-keys="defaultExpandedList"
    :default-checked-keys="defaultCheckedList"
    @node-click="handleNodeClick"
    ref="deptTree">
    <span class="dept-post-tree-node" slot-scope="{ node,data }" style="">
      <span style="color:#ff9900;margin-right:8px">{{data.type>2?'岗位':''}}</span>
      <span :title="nodeTitle(node,data)">{{node.label}}</span>
      <span><span>{{data.type>2?'（':''}}</span>{{data.type>2?(data.userCount):''}}<span>{{data.type>2?'）':''}}</span></span>
    </span>
  </el-tree>
</div>
</template>

<script>
export default {
  props: {
    companyId: {
      type: Number,
      default: () => {
        return null
      }
    },
    defaultExpandedList:{
      type:Array,
      default:[]
    },
    defaultCheckedList:{
      type:Array,
      default:[]
    }
  },
  data () {
    return {
      treeData: [],
      checkedNodeData:{}
    }
  },
  created () {
    // 获取树数据
    // this.getDeptTreeData()
  },
  methods: {
    getDeptTreeData () {
      let url = ''
      let params = {}
      let userInfo = JSON.parse(this.Decrypt(sessionStorage.getItem('userInfo')))
      if (userInfo.userType < 2) {
        url = '/web/system/permission/orgDeptManage/webDeptTreeByCompanyId'
        params.companyId = this.companyId
      } else {
        url = '/web/system/permission/orgDeptManage/webDeptTreeByCompanyId'
        params.userId = userInfo.userId
      }
      this.requestMethodGet(url, params).then(res => {
        if (res.data.code == 1000) {
          const data = res.data.data
          this.treeData = data
          this.$emit('userTotal', res.data.data[0].userCount)
        } else {
          this.$message({
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    // 找出默认展开的部门和岗位
    findDefaultExpand(){
      let treeCompInstance = this.$refs["deptTree"];
      let allNodes = treeCompInstance.store._getAllNodes();
      let defaultExpandNodes = [];
      allNodes.forEach((node) => {
        node.expanded && defaultExpandNodes.push(node.data.id);
      });
      this.defaultExpandedList = defaultExpandNodes
    },
    formatData (data) {
      for (var i = 0; i < data.length; i++) {
        if (!data[i].childrens || data[i].childrens.length == 0) {
          data[i].childrens = null
        } else {
          if (data[i].name.length > 8) {
            data[i].shortName = data[i].name.slice(0, 8) + '...'
          }
          this.formatData(data[i].childrens)
        }
      }
      return data
    },
    // 节点点击事件
    handleNodeClick (data) {
      this.checkedNodeData = data
      this.$emit('checkedNode', data)
    },
    nodeTitle (node, data) {
      let str = ''
      if (data.type > 2) {
        str = data.name + '\xa0' + '\xa0' + '(' + data.userCount + ')'
      } else {
        str = data.name
      }
      return str
    },
    renderContent (h, { node, data, store }) {
    }
  }
}
</script>
<style lang='less' scoped>
  /deep/.dept-post-tree-node{
    width: 245px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    padding-right: 5px;
  }
</style>
