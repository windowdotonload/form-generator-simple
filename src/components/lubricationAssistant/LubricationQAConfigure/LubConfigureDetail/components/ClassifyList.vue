<template>
  <div class="menulist-container" v-loading="calssifyLoading">
    <div class="classify-list-bar empty-content" style="width:50%;height:100%;border-right:1px solid #e9e9e9;overflow-y:auto" @scroll="scrollLoad($event, 1)">
      <div class="list-item" :class="{ active: item.id == firstActiveId.value }" :key="item.name" v-for="item in ClassifyListLevel_1" @click="clickClassifyItem(item)">
        <p class="circle-icon" :style="{ background: !item.status ? '#dd0000' : '' }" />
        <p class="list-item-text">{{ item.name }}</p>
      </div>
    </div>
    <div class="classify-list-bar empty-content" style="width:50%;height:100%;;overflow-y:auto" @scroll="scrollLoad($event, 2)">
      <div class="list-item" :class="{ active: item.id == secondActiveId.value }" :key="item.name" v-for="item in ClassifyListLevel_2" @click="switchCate(item)">
        <p class="circle-icon" :style="{ background: !item.status ? '#dd0000' : '' }" />
        <p class="list-item-text">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getClassifyList } from "../../../api/LubQA";
export default {
  inject: ["provide"],
  data() {
    return {
      calssifyLoading: false,
      ClassifyListLevel_1: [],
      ClassifyListLevel_1_total: 0,
      ClassifyListLevel_2: [],
      ClassifyListLevel_2_total: 0,
      firstActiveId: { value: "" },
      secondActiveId: { value: "" },
      ClassifyListLevel_1_pageInfo: {
        current: 1,
        size: 50
      },
      ClassifyListLevel_2_pageInfo: {
        current: 1,
        size: 50
      }
    };
  },
  created() {
    this.getClassifyList(1);
  },
  methods: {
    scrollLoad(e, level) {
      const { scrollHeight, scrollTop, offsetHeight } = e.target;
      if (scrollTop + offsetHeight >= scrollHeight) {
        if (this[`ClassifyListLevel_${level}`].length == this[`ClassifyListLevel_${level}_total`]) return;
        this[`ClassifyListLevel_${level}_pageInfo`].current++;
        this.getClassifyList(level);
      }
    },
    clickClassifyItem(item) {
      this.firstActiveId.value = item.id;
      this.secondActiveId.value = "";
      this.ClassifyListLevel_2 = [];
      this.provide.lv1CatalogueItem = item;
      this.provide.lv2CatalogueItem = {};
      this.getClassifyList(2);
    },
    switchCate(item) {
      if (!item) return;
      this.secondActiveId.value = item.id;
      this.provide.lv2CatalogueItem = item;
    },

    async getClassifyList(level = 1) {
      this.calssifyLoading = true;
      const params = {
        level,
        ...this[`ClassifyListLevel_${level}_pageInfo`]
      };
      if (level == 2) params.parentId = this.firstActiveId.value;

      const res = await getClassifyList(params);
      if (!this.ClassifyListLevel_1 || (this.ClassifyListLevel_1 && this.ClassifyListLevel_1.length == 0)) this.provide.lv1CatalogueItem = res.data.data.list[0];
      this[`ClassifyListLevel_${level}`] = this[`ClassifyListLevel_${level}`].concat(res.data.data.list);
      this[`ClassifyListLevel_${level}_total`] = res.data.data.totalCount;
      const keyName = level == 1 ? "firstActiveId" : "secondActiveId";
      this[keyName].value = this[keyName].value ? this[keyName].value : (this[`ClassifyListLevel_${level}`].length > 0 && this[`ClassifyListLevel_${level}`][0].id) || "";
      if (level == 2) this.switchCate(this.ClassifyListLevel_2.length > 0 ? this.ClassifyListLevel_2[0] : null);

      if (level == 1) {
        if (this.ClassifyListLevel_2.length > 0) return (this.calssifyLoading = false);
        const subParams = {
          level: 2,
          parentId: this.firstActiveId.value || null,
          ...this.ClassifyListLevel_2_pageInfo
        };
        if (!subParams.parentId) return (this.calssifyLoading = false);

        const subRes = await getClassifyList(subParams);
        this.ClassifyListLevel_2 = subRes.data.data.list;
        this.secondActiveId.value = this.ClassifyListLevel_2.length > 0 ? this.ClassifyListLevel_2[0].id : "";
        if (this.ClassifyListLevel_2[0]) this.switchCate(this.ClassifyListLevel_2[0]);
        this[`ClassifyListLevel_2_total`] = subRes.data.data.totalCount;
      }

      this.calssifyLoading = false;
    }
  }
};
</script>

<style lang="less" scoped>
.menulist-container {
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  height: calc(100% - 110px);
}
.classify-list-bar::-webkit-scrollbar {
  width: 3px !important;
}

.list-item {
  box-sizing: border-box;
  width: 100%;
  padding-left: 10%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  cursor: pointer;
  &:hover {
    background: #ecf5ff;
  }
  .circle-icon {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #008787;
    margin-right: 8px;
  }
}

.list-item-text {
  width: 90%;
  height: 15px;
  line-height: 15px;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.active {
  background: #f5f7fa;
}
</style>
