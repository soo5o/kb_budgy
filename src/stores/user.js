// stores/user.js
import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  const state = reactive({ userInfo: [] });
  const MEMBERSURL = 'http://localhost:3000/members';
  const matchUserInfo = async (email, pwd) => {
    try {
      console.log(email, pwd);
      const response = await axios.get(
        MEMBERSURL + `?email=${email}&password=${pwd}`
      );
      console.log(response);
      if (response.data.length > 0) {
        state.userInfo = response.data; //데이터 저장
        localStorage.setItem('userInfo', JSON.stringify(response.data)); //localStorage에 저장

        console.log('내 정보: ', [...state.userInfo]);
        return true;
      } else if (response.data.length == 0) {
        console.log('user.js의 데이터 길이', response.data.length);
        return false;
      }
    } catch (error) {
      console.error('에러발생: ', error);
    }
  };
  const checkAccount = async (email) => {
    try {
      const response = await axios.get(MEMBERSURL + `?email=${email}`);
      if (response.data.length > 0) {
        return false; // 이미 있는 계정
      }
      return true;
    } catch (error) {
      console.error('에러발생: ', error);
    }
  };
  const addUserInfo = async (user) => {
    try {
      await axios.post(MEMBERSURL, { ...user });
      return true;
    } catch (error) {
      console.error('에러발생: ', error);
      return false;
    }
  };
  const loadUserInfo = () => {
    const savedInfo = localStorage.getItem('userInfo');
    if (savedInfo) {
      state.userInfo = JSON.parse(savedInfo);
    }
  };
  const userInfo = computed(() => [...state.userInfo]);
  return { matchUserInfo, checkAccount, addUserInfo, loadUserInfo, userInfo };
});
