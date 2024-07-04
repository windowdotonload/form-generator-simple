export default {
  filters: {
    lackParams: function(value) {
      if (!value || isNaN(value) || Math.abs(value) == Infinity) return "缺少必要信息";
      return value;
    }
  },
  methods: {
    lackParamsStyle(value) {
      if (!value || isNaN(value) || Math.abs(value) == Infinity) return { color: "#d10000" };
    },
    showUnit(value) {
      if (!value || isNaN(value) || Math.abs(value) == Infinity) return false;
      return true;
    }
  }
};
