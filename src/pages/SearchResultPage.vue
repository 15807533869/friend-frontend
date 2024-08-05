<template>
  <user-card-list :user-list="userList" />
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空"/>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import myAxios from "../plugins/myAxios.ts";
import qs from "qs";
import {showFailToast, showSuccessToast} from "vant";
import UserCardList from "../components/UserCardList.vue";

const route = useRoute();
const {tags} = route.query;

const userList = ref([]);

onMounted(async () => {
  const userListData = await myAxios.get('/user/search/tags', {
    params: {
      tagNameList: tags
    },
    paramsSerializer: params => {
      return qs.stringify(params, {indices: false})
    },
    //序列化
    // paramsSerializer: {
    //   serialize: params => qs.stringify(params, { indices: false}),
    // }
  })
      .then(function (response) {
        console.log('/user/search/tags success', response);
        showSuccessToast('请求成功');
        return response?.data;
      })
      .catch(function (error) {
        console.log('/user/search/tags error', error);
        showFailToast('请求失败');
      });
  console.log(userListData)
  if (userListData) {
    userListData.forEach(user => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
})

// const mockUser = {
//   id: 12345,
//   username: 'morty',
//   userAccount: '1234',
//   profile: '全干开发工程师，啊是大姑色而且无人情味',
//   avatarUrl: 'https://b0.bdstatic.com/80d06dee37f89803c4f25c6f7f218c92.jpg@h_1280',
//   gender: 0,
//   phone: '15807531234',
//   email: '381074137@qq.com',
//   userRole: 0,
//   planetCode: '1234',
//   tags: ['java', 'C++', 'python'],
//   createTime: new Date(),
// }


</script>

<style scoped>

</style>
