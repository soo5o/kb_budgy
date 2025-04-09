// stores/user.js
import { computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserStore = defineStore('user', () => {
  const state = reactive({ userInfo: [] });
  const MEMBERSURL = 'http://localhost:3000/members';
  const MONEYURL = 'http://localhost:3000/money';
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
  const getMoneyList = async (userId, targetYear, targetMonth) => {
    const response = await axios.get(MONEYURL + `?userId=${userId}`);
    const allData = response.data;
    const filtered = allData.filter((item) => {
      const [year, month] = item.consumptionDate.split('-');
      return Number(year) === targetYear && Number(month) === targetMonth;
    });
    return filtered;
  };
  const changeUserInfo = async (user, changeInfo) => {
    try {
      const newInfo = changeInfo;
      console.log('newInfo', newInfo.name);
      if (newInfo.password && newInfo.password.length > 0) {
        await axios.put(MEMBERSURL + `/${user.id}`, {
          ...user,
          name: newInfo.name,
          password: newInfo.password,
        });
      } else {
        await axios.put(MEMBERSURL + `/${user.id}`, {
          ...user,
          name: newInfo.name,
        });
      }
      // 업데이트된 사용자 정보 다시 가져오기
      const updatedResponse = await axios.get(MEMBERSURL + `?id=${user.id}`);
      state.userInfo = updatedResponse.data;

      localStorage.setItem('userInfo', JSON.stringify(updatedResponse.data));
      return true;
    } catch (error) {
      console.error('에러발생: ', error);
      return false;
    }
  };
  const clearUser = () => {
    userInfo.value = [];
  };
  const userInfo = computed(() => [...state.userInfo]);
  return {
    matchUserInfo,
    checkAccount,
    addUserInfo,
    loadUserInfo,
    getMoneyList,
    changeUserInfo,
    userInfo,
    clearUser,
  };
});
