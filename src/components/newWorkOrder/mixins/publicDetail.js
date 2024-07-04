export default {
    data () {
        return {
            imgsStar: [
                {
                id: 1,
                },
                {
                id: 2,
                },
                {
                id: 3,
                },
                {
                id: 4,
                },
                {
                id: 5,
                },
            ],
            // 表单验证规则
            closerules: {
                close: [{ required: true, message: "请选择关闭说明", trigger: "change" }],
                text: [{ required: true, message: "请输入关闭原因", trigger: "blur" }]
            },
        }
    },
    created () {
        
    },
    mounted () {
        
    },
    
    methods: {
        // 获取是否有权限跳转（客户根据车间权限判断）
        canGetDevice(val) {
            const params = {
            deviceNumber: val,
            };
            this.requestMethodGet("/web/common/device/canGetDevice", params).then((res) => {
            if (res.data.code == 1000) {
                if (res.data) {
                this.$router.push({
                    path: "/EquipmentProfile/EquipmentProfileDetail",
                    query: {
                    deviceNumber: val,
                    },
                });
                } else {
                this.$message({
                    message: "当前账号权限不足",
                    type: "warning",
                });
                }
            } else {
                this.$message({
                message: res.data.msg,
                type: "warning",
                });
            }
            });
        },
    }
}