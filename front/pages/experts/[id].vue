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
      <v-row justify="start">
        <v-col style="max-width: fit-content;"><v-chip color="accent">test</v-chip></v-col>
        <v-col style="max-width: fit-content;"><v-chip color="accent">test</v-chip></v-col>
      </v-row>
    </v-container>
    <v-img class="rounded-xl w-1/4 mx-auto" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></v-img>
    <v-container class="w-1/2">
      <v-row justify="center">
        <v-col cols="6">
          <v-card class="rounded-lg px-3 py-2" color="secondary">
            <v-card-title class="mb-3">
              <v-icon icon="mdi-star-four-points" class="mr-1"></v-icon>
              Biographie
            </v-card-title>
            <v-card-text>
              Je m'appelle Jean Dupont et je suis expert Java depuis plus de 15 ans. J'ai commencé ma carrière en tant que développeur junior dans une petite entreprise de logiciels, où j'ai rapidement gravi les échelons grâce à ma passion et mon dévouement pour la programmation. Au fil des années, j'ai travaillé sur une multitude de projets allant de petites applications web à des systèmes d'entreprise complexes. Mon expertise couvre une large gamme de technologies Java, y compris Spring, Hibernate, et les microservices. En plus de mes compétences techniques, j'ai aussi une expérience significative en gestion de projet et en leadership d'équipe, ayant dirigé des équipes de développeurs sur plusieurs projets réussis. Aujourd'hui, je continue à me perfectionner et à partager mes connaissances en tant que consultant indépendant et formateur, aidant les entreprises à optimiser leurs solutions technologiques et à former leurs équipes de développement.</v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
    </v-container>
  </LandingContainer>
</template>
