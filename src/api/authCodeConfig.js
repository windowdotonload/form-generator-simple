export const requestUrlCodeMap = {
  "web/company/filterSp": "DealerProfile",
  "web/company/getSpsOfAccout": "PC_Customer_changeSP",
  "web/device/newQueryAllDeviceByPage": "EquipmentProfil",
  "weChat/workOrder/getServiceOverview": "servicesoverview",
  "weChat/mobil/company/queryDistributorPool": "DealerProfile",
  "web/customer/queryCompanyListByPage": "CustomerProfileList",
  "web/company/getSpsOfAccout": "PC_Customer_changeSP",
  "lubePoint/getLubePointList": "/EquipLubrListCustomer",
  "weChat/workOrder/customerWithWorkOrderByPage": "NewWorkOrderList",
  "serviceApply/serviceApplyOrderListByPage": "ServiceApply",
  "lubePoint/exportAllLubePointExcel": "LubricationPointList",
  "weChat/workshop/queryWorkshopListByPage": "PC_workshopdata",
  // "web/system/permission/orgSysUserManagae/userListOfOrg": "PC_Customer_user",
  "web/system/permission/userManage/listByPage": "MyTeam",
  "web/system/permission/orgWorkShopManage/overviewByPage": "PC_workshopdata",
  "weChat/comp/myTeam/queryUserNoPage": "MyTeam",
  "weChat/workshop/filterWorkshop": "PC_workshopdata"
};



export const requestUrlCodeMapKeys = Object.keys(requestUrlCodeMap);

export const matchMenuCode = matchURL => {
  try {
    const res = {
      menuCode: "",
      isConfigCode: false
    };
    if (requestUrlCodeMap[matchURL]) {
      res.menuCode = requestUrlCodeMap[matchURL];
      res.isConfigCode = true;
      return res;
    }
    return null;
  } catch (e) {
    console.warn("[error]", e);
  }
};

export const getConfigMenuCode = url => {
  try {
    let res = null;
    if (url.indexOf("/") == 0) {
      const matchURL = url.substring(1, url.length);
      if ((res = matchMenuCode(matchURL)) && res.menuCode) return res;
    }
    if ((res = matchMenuCode(url)) && res.menuCode) return res;
    res = {
      menuCode: "",
      isConfigCode: false
    };
    res.isConfigCode = requestUrlCodeMapKeys.some(keys => {
      if (url.includes(keys)) {
        res.menuCode = requestUrlCodeMap[keys];
        return true;
      }
      return false;
    });
    return res;
  } catch (e) {
    console.warn("[error]", e);
  }
};
