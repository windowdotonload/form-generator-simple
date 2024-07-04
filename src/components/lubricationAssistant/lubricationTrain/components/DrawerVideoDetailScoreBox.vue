<template>
  <div class="score-box-container" v-if="show" v-loading="loading">
    <div class="score-box">
      <i class="el-icon-close" style="position:absolute;top:5px;right:10px;cursor:pointer" @click="cancel" />
      <p class="score-box-title">
        点击星星打分
      </p>
      <p class="score-box-starline">
        <img v-for="item in starInds" :key="item" :src="item <= starLikeCount ? scoreActive : score" style="cursor:pointer" @click="clickStar(item)" />
      </p>
      <p style="text-align:center;font-size:13px;color:#999;height:16px;line-heignt:16px">{{ statusMap[starLikeCount] }}</p>
      <div style="display:flex;justify-content:center" v-show="!disabled">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button size="mini" type="danger" @click="confirmScore">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import score from "@/assets/xingxing.png";
import scoreActive from "@/assets/xingxing_1.png";
import { addGrade } from "../../api/index";
export default {
  inject: ["state", "actions"],
  data() {
    return {
      loading: false,
      show: false,
      score,
      scoreActive,
      starLikeCount: 0,
      starInds: [1, 2, 3, 4, 5],
      disabled: false,
      statusMap: {
        1: "很差",
        2: "较差",
        3: "还行",
        4: "推荐",
        5: "力荐"
      }
    };
  },
  methods: {
    openBox(score) {
      if (score) {
        this.starLikeCount = score;
        this.disabled = true;
      } else {
        this.disabled = false;
      }
      this.show = true;
    },
    cancel(gioTrack = true) {
      this.starLikeCount = 0;
      this.show = false;
      if (!gioTrack) return;
      this.$gio.gradeTrain({
        trainName: this.state.drawerComponentParams.name
      });
    },
    clickStar(item) {
      if (this.disabled) return;
      this.starLikeCount = item;
    },
    async confirmScore() {
      const params = {
        trainId: this.state.drawerComponentParams.id,
        grade: this.starLikeCount
      };
      this.loading = true;
      const res = await addGrade(params);

      if (res.data.code == 1000) {
        this.loading = false;
        this.disabled = true;
        this.state.drawerComponentParams.grade = this.starLikeCount;
        this.cancel(false);
        this.$gio.gradeTrain({
          trainName: this.state.drawerComponentParams.name
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.score-box-container {
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  position: absolute;
  z-index: 999;
}
.score-box {
  position: relative;
  width: 30%;
  height: 150px;
  border-radius: 12px;
  background: #fff;
  justify-content: center;
  padding: 20px;
}
.score-box-title {
  font-size: 16px;
  text-align: center;
  font-weight: bolder;
}
.score-box-starline {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
