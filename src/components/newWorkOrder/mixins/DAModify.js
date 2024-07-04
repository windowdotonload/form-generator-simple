export default {
  data() {
    return {
      active: 1,
      roleBtbCss: {
        cursor: "pointer",
        display: "inline-block",
        "font-size": "18px",
        "margin-right": "20px",
        "padding-bottom": "6px"
      },
      activeCss: {
        "border-bottom": "2px solid #d10000"
      },
      templateContent: "",
      woInfo: null
    };
  },
  methods: {
    DA_judgeDAOPAuth(info, userInfo, opType, isCoreInfoFlag) {
      /* opType:[{0:制作报告/编辑/添加润滑点/移除/取消注册}  {1:重新分配/关闭工单}  {2:完结工单}*/
      // isCoreInfoFlag
      // ||(!info.haveDraftFlag && info.coreDataTemplateId && isCoreInfoFlag && !info.reportType)
      switch (opType) {
        case 0:
          return info.executePersonNumber == userInfo.userNumber;
        case 1:
          return (
            // customerType 【1】直供客户 【2】 非直供客户
            (info.customerType == 2 && userInfo.userType == 1) ||
            (info.customerType == 1 && userInfo.userType == 0) ||
            info.distributorCompanyNumber == userInfo.companyNumber ||
            info.executePersonNumber == userInfo.userNumber
          );
        case 2:
          return (
            info.workOrderStatus == "1" &&
            userInfo.userNumber === info.executePersonNumber &&
            (info.haveDraftFlag || (!info.haveDraftFlag && info.serviceDtoList && info.serviceDtoList.length) || (!info.haveDraftFlag && info.coreDataTemplateId && isCoreInfoFlag && !info.reportType))
          );
      }
    },
    DA_setInitialActive(customerType) {
      if (this.userInfo.userType == "0" && customerType == "1") {
        return;
      } else if (this.userInfo.userType == "1" && customerType == "1") {
        this.active = 2;
      } else if (this.userInfo.userType == "1" && customerType == "2") {
        this.active = 2;
      } else if (this.userInfo.userType == "0" && customerType == "2") {
        this.active = 3;
      }
    },
    generateStyle(cssObj) {
      return Object.entries(cssObj)
        .map(css => `${css[0]}:${css[1]};`)
        .join("");
    },
    generateActiveStyle(cssObj, tab) {
      if (tab != this.active) return;
      return this.generateStyle(cssObj);
    },
    initTemplateContent(woInfo) {
      if (!woInfo) return;
      this.woInfo = woInfo;
      const roleType = this.$userInfo.userType;
      const customerType = woInfo.customerType;
      if (roleType == "0" && customerType == "1") {
        return `<span style="${this.generateStyle(this.roleBtbCss) + this.generateActiveStyle(this.activeCss, 1)}" data-type="1" data-target="roleType">美孚</span>
        <span style="${this.generateStyle(this.roleBtbCss) + this.generateActiveStyle(this.activeCss, 2)}" data-type="2" data-target="roleType">服务商</span>`;
      } else if (roleType == "0" && customerType == "2") {
        return `<span style="${this.generateStyle(this.roleBtbCss) + this.generateActiveStyle(this.activeCss, 1)}" data-type="1" data-target="roleType">美孚</span>
        <span style="${this.generateStyle(this.roleBtbCss) + this.generateActiveStyle(this.activeCss, 3)}" data-type="3" data-target="roleType">经销商</span>`;
      } else if (roleType == "1" && customerType == "1") {
        return "服务商";
      } else if (roleType == "1" && customerType == "2") {
        return "经销商";
      } else {
        return woInfo.distributorCompanyName;
      }
    },
    async clickRoleType(e) {
      const currentTarget = e.path ? e.path[0] : e.target;
      const type = currentTarget.getAttribute("data-type");
      if (!type) return;
      this.active = type;
      await this.handleDistributive("first", false);
    }
  }
};
