import Vue from "vue";

const authstrategyMap = {
  sp: "授权经销商的",
  hand_managed_sp: "手动分管的经销商的",
  assetGroup: "授权客户的",
  service_assetGroup: "授权直供客户的",
  assistance_assetGroup: "授权经销商客户的",
  personal: "个人的",
  company: "本公司的",
};

const getAuthorityScopesOfUser = (menuCodes) => {
  if (typeof menuCodes == "string") menuCodes = [menuCodes];
  return Vue.prototype.requestMethodPostTip("/weChat/common/getAuthorityScopesOfUser", {
    userId: Vue.prototype.$userInfo.userId,
    orgId: Vue.prototype.$userInfo.orgInfo.companyId,
    menuCodes: menuCodes,
  });
};

/**
 * @typedef {Object} AuthRangeBackendItem
 * @property {Array<{
 *  strategyName: String,
 *  dataOfStrategy: Array<{
 *    spId: number,
 *    accountId: number,
 *    dataId:number,
 *  }>}
 * } authorityScopeBeans
 * @property {Array<String>} menuCodes
 *
 *
 * @typedef {Array<AuthRangeBackendItem>} AuthRangeBackend
 * @param {*} el
 * @param {*} atuhBucket
 * @param {AuthRangeBackend} authRangeBackend
 */
const authStrategy = (el, atuhBucket, authRangeBackend) => {
  let { menuCodes, strategyNames, strategySource, matchKey } = atuhBucket;
  if (!strategyNames || !strategyNames.length) {
    strategyNames = Object.keys(strategySource);
  }
  if (typeof menuCodes == "string") {
    authRangeBackend.some((auth) => {
      // 查找对应的menuCode
      if (auth.menuCodes.includes(menuCodes)) {
        const { authorityScopeBeans } = auth;
        // 从后端返回的结果判断是否显示
        return authorityScopeBeans.some((scope) => {
          if (strategyNames.includes(scope.strategyName)) {
            const key = matchKey ? matchKey[scope.strategyName] : "dataId";
            const dataIds = scope.dataOfStrategy.map((item) => item[key]);
            const frontCurrentStrategyNameSource = parseInt(strategySource[scope.strategyName]);

            if (frontCurrentStrategyNameSource && dataIds.includes(frontCurrentStrategyNameSource)) {
              Vue.prototype.$nextTick(() => {
                el.style.display = "";
              });
              return true;
            } else {
              Vue.prototype.$nextTick(() => {
                el.style.display = "none";
              });
              return false;
            }
          }
        });
      }
    });
  }
};
Vue.directive("auth", {
  bind(el, binding) {
    const { value } = binding;
    const { menuCodes, strategyNames, strategySource } = value;
    if (Vue.prototype.$isMobilAdmin) return Vue.prototype.$_has(Array.isArray(menuCodes) ? menuCodes[0] : menuCodes);
    el.style.display = "none";
    getAuthorityScopesOfUser(menuCodes).then((res) => {
      const authRange = res.data.data;
      if (!authRange || !authRange.length) return;
      authStrategy(el, value, authRange);
    });
  },
});

const has = Vue.directive("has", {
  inserted: function (el, binding) {
    // 获取按钮权限
    if (!Vue.prototype.$_has(binding.expression)) {
      el.parentNode.removeChild(el);
    }
  },
});

Vue.prototype.$_has = function (value) {
  let isExit = false;
  let buttonpermsStr = JSON.parse(sessionStorage.getItem("btnPremissions"));
  if (buttonpermsStr === undefined || buttonpermsStr === null) {
    return false;
  }
  for (let i = 0; i < buttonpermsStr.length; i++) {
    if (value === buttonpermsStr[i].menuCode) {
      isExit = true;
      break;
    }
  }
  return isExit;
};
export { has, getAuthorityScopesOfUser };
