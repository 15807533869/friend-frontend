<script setup lang="ts">

import {useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";

const router = useRouter();
// 展示日期选择器
const showPicker = ref(false)

const initFormData = {
  "name": "",
  "description": "",
  "expireTime": null,
  "maxNum": 3,
  "password": "",
  "status": 0
}

const minDate = new Date();

// 需要用户填写的表单数据
const addTeamData = ref({...initFormData});

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
  const res = await myAxios.post("/team/add", postDate);
  if (res.code === 0 && res.data) {
    showSuccessToast('添加成功');
    router.push({
      path: "/team",
      replace: true,
    });
  } else {
    showFailToast("添加失败");
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
        <van-field name="stepper" label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" max="10" min="3"/>
          </template>
        </van-field>
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
