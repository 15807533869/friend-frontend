<template>
  <van-card
      v-for="user in userList"
      :desc="user.profile"
      :title="`${user.username}(${user.planetCode})`"
      :thumb="user.avatarUrl"
  >
    <template #tags>
      <van-tag plain type="danger" v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px">
        {{ tag }}
      </van-tag>
    </template>
    <template #footer>
      <van-button size="mini">联系我</van-button>
    </template>
  </van-card>

</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import { Toast } from 'vant';

import myAxios from "../plugins/myAxios.js";

const route = useRoute();
const {tags} = route.query;

onMounted(() => {
  myAxios.get('/user/search/tags', {
    params: {
      tagNameList: tags
    }
  })
      .then(function (response) {
        console.log('/user/search/tags success', response);
        Toast.success('请求成功');
      })
      .catch(function (error) {
        console.log('/user/search/tags error', error);
        Toast.fail('请求失败');
      });
})

const mockUser = {
  id: 12345,
  username: 'morty',
  userAccount: '1234',
  profile: '全干开发工程师，啊是大姑色而且无人情味',
  avatarUrl: 'https://b0.bdstatic.com/80d06dee37f89803c4f25c6f7f218c92.jpg@h_1280',
  gender: 0,
  phone: '15807531234',
  email: '381074137@qq.com',
  userRole: 0,
  planetCode: '1234',
  tags: ['java', 'C++', 'python'],
  createTime: new Date(),
}

const userList = ref([mockUser]);

</script>

<style scoped>

</style>
