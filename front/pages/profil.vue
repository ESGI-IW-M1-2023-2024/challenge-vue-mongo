<script setup>
import { ref, onMounted } from 'vue';

definePageMeta({
  layout: "landing",
});

const user = ref({});

onMounted(async () => {
  // const user = $fetch('http://localhost:3000/api/users/' + localStorage.getItem('userId'), {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //     'Content-Type': 'application/json'
  //   }
  // });
  try {
    const response = await fetch('http://localhost:3000/api/users/' + localStorage.getItem('userId'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      user.value = data;
    } else {
      const data = await response.json();
      errorMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
  }
})
</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Profil</template>
      <template v-slot:desc>&nbsp;</template>
    </LandingSectionhead>
    {{ user.firstName }}
  </LandingContainer>
</template>
