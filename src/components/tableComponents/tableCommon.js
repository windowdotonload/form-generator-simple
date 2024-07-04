export default {
  methods:{
    // 复制邮箱
    onCopyMail(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制邮箱
    onErrorMail(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    // 复制手机号
    onCopyTel(row) {
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
    },
    // 复制失败
    onErrorTel(row) {
      this.$message({
        showClose: true,
        message: "该浏览器不支持自动复制",
        type: "error"
      });
    },
    formatPhonenumber(value){
      let phoneNumber = ''
      if(value){
        phoneNumber = value.slice(0, 3) + "****" + value.slice(value.length - 4); 
      }
      return phoneNumber || '-'
    },
    //邮箱脱敏
    formatEmail(email){
      let new_email = email;
      if (String(email).indexOf("@") > 0) {
        let str = email.split("@");
        let _s = "";
        if (str[0].length > 2) {
          //@前面多于3位
          for (let i = 2; i < str[0].length; i++) {
            _s += "*";
          }
          new_email = str[0].substr(0, 2) + _s + "@" + str[1];
        } else {
          //@前面小于等于于3位
          for (let i = 1; i < str[0].length; i++) {
            _s += "*";
          }
          new_email = str[0].substr(0, 1) + _s + "@" + str[1];
        }
      }
      return new_email||'-';
    }
  }
}