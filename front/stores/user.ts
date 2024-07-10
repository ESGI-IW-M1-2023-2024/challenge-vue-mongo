import { defineStore } from 'pinia';
import type { IUser } from '../../back/src/models/user'

export const useUserStore = defineStore('user', () => {
  const userRef = ref<IUser | null>(null);
  const tokenRef = ref<string | null>(null);

  const setUser = (userId: string) => {
    // fetch user from backend
    const fetchUser = async (userId: string) => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenRef.value}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const user = await response.json();
          userRef.value = user;
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser(userId);
  }
  const clearUser = () => {
    userRef.value = null;
  }

  const setToken = (token: string) => {
    tokenRef.value = token;
  }




  return { setUser, clearUser, setToken, userRef, tokenRef }
});