
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      roleMap: {
        0: "美孚",
        1: "经销商",
        2: "客户"
      },
      roleList: []
    };
  },
  methods: {
    async getRoleList() {
      const params = {
        roleType: 0,
        current: 1,
        size: 300
      };
      const res = await this.requestMethodGet("/web/system/permission/roleManage/listByPage", params);
      res.data.data.list.forEach(role => {
        role.label = this.roleMap[role.roleType] + " - " + role.roleName;
        role.key = role.roleId.toString();
      });
      this.roleList = res.data.data.list;
    },
    filterRoleMethod(query, item) {
      return item.accessTemplateName.indexOf(query) > -1;
    }
  }
};
