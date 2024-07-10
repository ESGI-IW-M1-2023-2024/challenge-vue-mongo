<script setup>
import Card from '~/components/landing/Card.vue';

definePageMeta({
  layout: "landing",
});

const user = ref({});
const route = useRoute()
const id = route.params.id

onMounted(async () => {

try {
  const response = await fetch('http://localhost:3000/api/users/'+  id, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    const data = await response.json();
    users.value = data;
    loading.value = false;
  } else {
    const data = await response.json();
    errorMessage.value = data.message;
    return navigateTo('/login');
  }
} catch (error) {
  console.error(error);
}
});


</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Michel Palaref</template>
      <template v-slot:desc>Expert</template>
    </LandingSectionhead>
    <v-container>
      <v-row>
        <v-col></v-col>
      </v-row>
    </v-container>
  </LandingContainer>
</template>
