import { defineStore } from 'pinia';

export interface IUserStore {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const useUserStore = defineStore('user', () => {
  const userRef = ref<IUserStore | null>(null);
  const tokenRef = ref<string | null>(null);

  // const setUser = (userId: string) => {
  //   // fetch user from backend
  //   const fetchUser = async (userId: string) => {
  //     try {
  //       const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${tokenRef.value}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       if (response.ok) {
  //         const user = await response.json();
  //         userRef.value = user;
  //       } else {
  //         throw new Error('Failed to fetch user');
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchUser(userId);
  // }
  const clearUser = () => {
    userRef.value = null;
  }

  const setToken = (token: string) => {
    tokenRef.value = token;
  }

  const setUser = (user: IUserStore) => {
    userRef.value = user;
  }



  return { setUser, clearUser, setToken, userRef, tokenRef }
},
  {
    persist: true
  }
);