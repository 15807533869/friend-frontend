<script setup lang="ts">

import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast} from "vant";

const router = useRouter();

// 跳转到加入队伍页
const doJoinTeam = () => {
  router.push({
    path: "team/add"
  })
}

const teamList = ref([]);

// 页面加载时只触发一次
onMounted(async () => {
  const res = await myAxios.get("/team/list");
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    showFailToast("加载队伍失败，请刷新重试！");
  }
})

</script>

<template>
  <div id="teamPage">
    <van-button type="primary" @click="doJoinTeam">加入队伍</van-button>
    <team-card-list :team-list="teamList"/>
  </div>
</template>

<style scoped>

</style>
