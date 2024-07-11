<script setup lang="ts">
import type { IUser } from '../../../../back/src/models/user';

definePageMeta({
  layout: 'landing',
});

const mentor = ref<IUser | null>(null);
const route = useRoute();
const loading = ref(true);
const userStore = useUserStore();
const idMentor = route.params.id;

const title = ref('');
const comment = ref('');
const selectedTechnologies = ref(null);

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
      mentor.value = data;

      loading.value = false;
    } else {
      const data = await response.json();
      return navigateTo('/login');
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <v-container v-if="!loading">
    <LandingContainer>
      <LandingSectionhead>
        <template v-slot:title>Entrez en contact avec {{ mentor?.firstName }} {{ mentor?.lastName }}</template>
        <template v-slot:desc>Donnez un maximum de descriptions à votre mentor afin qu'il puisse accepter votre demande et vous recontacter.</template>
      </LandingSectionhead>
    </LandingContainer>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-text-field label="Title" v-model="title" />
          </v-col>
          <v-col cols="12">
            <v-textarea label="Comment" v-model="comment" />
          </v-col>
          <v-col cols="12">
            <select name="technologies" id=""></select>
            <v-select label="Technologies" v-model="selectedTechnologies" :items="mentor?.technologies" item-title="label" item-value="_id" multiple chips />
          </v-col>
          <v-col cols="12">
            <v-btn type="submit" color="primary">Submit</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-container>
  <v-container v-else>
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </v-container>
</template>
