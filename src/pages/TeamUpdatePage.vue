<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";

const router = useRouter();
const route = useRoute();
// 展示日期选择器
const showPicker = ref(false)

const minDate = new Date();

const id = route.query.id;

// 需要用户填写的表单数据
const addTeamData = ref({});

// 获取之前的队伍信息
onMounted(async () => {
  if (id <= 0) {
    showFailToast("加载队伍失败，请刷新重试！");
    return;
  }
  const res = await myAxios.get("/team/get", {
    params: {
      id,
    },
  });
  if (res?.code === 0) {
    addTeamData.value = res?.data;
    // 处理 expireTime
    if (addTeamData.value.expireTime) {
      const expireDate = new Date(addTeamData.value.expireTime); // 确保是一个 Date 对象
      const year = expireDate.getFullYear();
      const month = (expireDate.getMonth() + 1).toString().padStart(2, '0');
      const day = expireDate.getDate().toString().padStart(2, '0');

      // 设置为 YYYY-MM-DD 格式
      formattedExpireTime.value = `${year}-${month}-${day}`;
      // 更新 pickerValue 以反映日期选择器中的当前选定值
      pickerValue.value = [year, month, day];
    }
  } else {
    showFailToast("加载队伍失败，请刷新重试！");
  }
});

const formattedExpireTime = ref<string | null>(null);  // 用来展示格式化后的日期
const pickerValue = ref([new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]);  // 初始值为当前日期的字符串数组

// 当日期选择器确认时，将选中的值转为 Date 对象并格式化显示
const onConfirm = (value: string[]) => {
  showPicker.value = false;
  // 设置 expireTime 为 Date 对象
  addTeamData.value.expireTime = new Date(Number(value.selectedValues[0]), Number(value.selectedValues[1]) - 1, Number(value.selectedValues[2]));
  // 格式化日期为 YYYY-MM-DD 并显示
  formattedExpireTime.value = `${value.selectedValues[0]}-${value.selectedValues[1].padStart(2, '0')}-${value.selectedValues[2].padStart(2, '0')}`;
};

const doSubmit = async () => {
  const postDate = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status),
    maxNum: Number(addTeamData.value.maxNum),
  }
  // todo 前端参数校验
  const res = await myAxios.post("/team/update", postDate);
  if (res.code === 0 && res.data) {
    showSuccessToast('更新成功');
    router.push({
      path: "/team",
      replace: true,
    });
  } else {
    showFailToast("更新失败");
  }
}

</script>

<template>

  <div id="teamAddForm">
    <van-form @submit="doSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队伍名"
            placeholder="请输入队伍名"
            :rules="[{ required: true, message: '请输入队伍名' }]"
        />
        <van-field
            v-model="addTeamData.description"
            rows="4"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field
            is-link
            readonly
            name="datePicker"
            label="过期时间"
            :placeholder="formattedExpireTime ?? '点击选择过期时间'"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-date-picker
              :columns-type="['year', 'month', 'day']"
              v-model="pickerValue"
              @confirm="onConfirm"
              title="请选择过期时间"
              :min-date="minDate"
          />
        </van-popup>
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请输入队伍密码' }]"
        />

      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>

</template>

<style scoped>

</style>
