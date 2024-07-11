<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: "landing",
});

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const userStore = useUserStore();
const { tokenRef } = storeToRefs(userStore);
const router = useRouter();

const handleSubmit = async () => {

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.user);
      const token = data.token;
      const user = data.user
      userStore.setToken(token);
      userStore.setUser(user);
      window.location.href = '/';
    } else {
      const data = await response.json();
      errorMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'An error occurred. Please try again later.';
  }
};
</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Log in</template>
      <template v-slot:desc>&nbsp;</template>
    </LandingSectionhead>

    <div class="gap-10 mx-auto max-w-4xl mt-16">
      <form
        @submit.prevent="handleSubmit"
        class="needs-validation"
        novalidate
      >
        <div class="mb-5">
          <input
            v-model="email"
            type="text"
            placeholder="Email"
            required
            class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
            name="email"
          />
        </div>
        <div class="mb-3">
          <input
            v-model="password"
            type="password"
            placeholder="Mot de passe"
            required
            class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100"
            name="password"
          ></input>
        </div>
        <LandingButton type="submit" size="lg" block>Login</LandingButton>
        <div id="result" class="mt-3 text-center">{{ errorMessage }}</div>
      </form>
    </div>
  </LandingContainer>
</template>

