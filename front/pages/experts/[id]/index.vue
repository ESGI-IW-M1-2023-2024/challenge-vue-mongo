<script setup lang="ts">
import type { IUser } from '../../../../back/src/models/user';

definePageMeta({
  layout: 'landing',
});

const user = ref<IUser | null>(null);
const route = useRoute();
const loading = ref(true);
const userStore = useUserStore();
const idMentor = route.params.id;

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users/' + idMentor, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      user.value = data;
      console.log(user.value);
      loading.value = false;
    } else {
      const data = await response.json();
      return navigateTo('/login');
    }
  } catch (error) {
    console.error(error);
  }
});

const navigateToContact = () => {
  navigateTo(window.location.href + '/contact');
};
</script>

<template>
  <!-- bouton retour en arrière -->
  <v-btn icon @click="$router.go(-1)" class="m-5 -mb-5">
    <v-icon>mdi-arrow-left</v-icon>
  </v-btn>
  <v-container v-if="!loading">
    <LandingContainer>
      <LandingSectionhead>
        <template v-slot:title>{{ user?.firstName }} {{ user?.lastName }}</template>
        <template v-slot:desc>Expert</template>
      </LandingSectionhead>
      <v-container>
        <v-row justify="start">
          <v-col v-for="techno of user?.technologies" style="max-width: fit-content"
            ><v-chip color="primary">{{ techno.label }}</v-chip></v-col
          >
        </v-row>
      </v-container>
      <v-img class="rounded-xl w-1/4 mx-auto" :src="user?.imageUrl"></v-img>
      <v-container class="w-2/3">
        <v-row justify="center">
          <v-col cols="12">
            <v-card class="rounded-lg px-3 py-2" color="secondary">
              <v-card-title class="mb-3">
                <v-icon icon="mdi-star-four-points" class="mr-1"></v-icon>
                Biographie
              </v-card-title>
              <v-card-text> {{ user?.biography }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-btn color="primary" :to="'/experts/' + user?._id + '/contact'" class="mx-auto">Entrer en contact</v-btn>
      </v-container>
    </LandingContainer>
  </v-container>
  <v-container v-else>
    <v-row justify="center">
      <v-progress-circular indeterminate color="accent"></v-progress-circular>
    </v-row>
  </v-container>
</template>
