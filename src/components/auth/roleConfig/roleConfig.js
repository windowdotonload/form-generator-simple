export const roleRuleConfigOptions = {
  0: [
    {
      label: "授权经销商的",
      value: "sp"
    },
    {
      label: "手动分管的经销商的",
      value: "hand_managed_sp"
    },
    {
      label: "授权客户的",
      value: "assetGroup"
    },
    {
      label: "授权直供客户的",
      value: "service_assetGroup"
    },
    {
      label: "授权经销商客户的",
      value: "assistance_assetGroup"
    },
    {
      label: "个人的",
      value: "personal"
    },
    {
      label: "本公司的",
      value: "company"
    }
  ],
  1: [
    {
      label: "授权客户的",
      value: "assetGroup"
    },
    {
      label: "授权经销商客户的",
      value: "service_assetGroup"
    },
    {
      label: "授权直供客户的",
      value: "assistance_assetGroup"
    },
    {
      label: "个人的",
      value: "personal"
    },
    {
      label: "本公司的",
      value: "company"
    }
  ],
  2: [
    {
      label: "本公司授权的",
      value: "assetGroup"
    },
    {
      label: "个人的",
      value: "personal"
    },
    {
      label: "本公司的",
      value: "company"
    },
    {
      label: "车间的",
      value: "workshop"
    }
  ]
};

export const roleRuleConfigOptionsMapText = {
  0: {
    sp: "授权经销商的",
    hand_managed_sp: "手动分管的经销商的",
    assetGroup: "授权客户的",
    service_assetGroup: "授权直供客户的",
    assistance_assetGroup: "授权经销商客户的",
    personal: "个人的",
    company: "本公司的"
  },
  1: {
    assetGroup: "授权客户的",
    service_assetGroup: "授权经销商客户的",
    assistance_assetGroup: "授权直供客户的",
    personal: "个人的",
    company: "本公司的"
  },
  2: {
    assetGroup: "本公司授权的",
    personal: "个人的",
    company: "本公司的"
  }
};
