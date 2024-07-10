<script setup>
definePageMeta({
  layout: "landing",
});

const user = await $fetch('/api/users/' + localStorage.getItem('userId'), {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
});

</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Profil</template>
      <template v-slot:desc>&nbsp;</template>
    </LandingSectionhead>
    
  </LandingContainer>
</template>
