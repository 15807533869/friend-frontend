<template>
  <div id="teamCardList">
    <van-card
        v-for="team in props.teamList"
        :thumb="ikun"
        :desc="team.description"
        :title="`${team.name}`"
    >
      <template #tags>
        <van-tag plain type="danger" style="margin-right: 8px; margin-top: 8px">
          {{ teamStatusMap[team.status] }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          {{ '最大人数：' + team.maxNum }}
        </div>
        <div v-if="team.expireTime">
          {{ '过期时间：' + team.expireTime }}
        </div>
        <div v-if="team.createTime">
          {{ '创建时间：' + team.createTime }}
        </div>
      </template>
      <template #footer>
        <van-button size="small" type="primary" plain @click="doJoinTeam(team.id)">加入队伍</van-button>
      </template>
    </van-card>
  </div>
</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStatusMap} from "../constants/team";
import ikun from '../assets/ikun.png';
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";

interface TeamCardListProps {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  teamList: [] as TeamType[],
});

// 加入队伍
const doJoinTeam = async (teamId: number) => {
  const res = await myAxios.post('/team/join', {
    teamId
  });
  if (res?.code === 0) {
    showSuccessToast('加入队伍成功');
  } else {
    showFailToast('加入队伍失败' + (res.description ? `,${res.description}` : ''));
  }
};

</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 128px;
  object-fit: unset;
}
</style>
