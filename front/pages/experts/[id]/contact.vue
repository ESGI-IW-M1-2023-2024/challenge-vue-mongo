<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '~/stores/user';
import type { IUser } from '../../../../back/src/models/user';
import type { ITechnology } from '../../../../back/src/models/technology';

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
const selectedTechnologies = ref([]);

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
      navigateTo('/login');
    }
  } catch (error) {
    console.error(error);
  }
});

const submit = async () => {
  console.log(title.value, comment.value, selectedTechnologies.value);

  // reconstruct the array object technologies
  let technologies: ITechnology[] = [];

  if (selectedTechnologies.value.length > 0) {
    technologies = await Promise.all(
      selectedTechnologies.value.map(async (id: string) => {
        try {
          const techno = await fetch('http://localhost:3000/api/technologies/' + id, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${userStore.tokenRef}`,
              'Content-Type': 'application/json',
            },
          });
          if (techno.ok) {
            return techno.json();
          }
          return null;
        } catch (error) {
          console.error(error);
        }
      })
    );
  } else {
    technologies = [];
  }
  console.log(technologies);

  try {
    const response = await fetch('http://localhost:3000/api/issues', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUser: userStore.userRef?.id,
        idMentor: mentor.value?._id,
        technologies: technologies,
        title: title.value,
        messages: [
          {
            title: title.value,
            content: comment.value,
          },
        ],
      }),
    });

    if (response.ok) {
      navigateTo('/experts/' + idMentor);
    } else {
      const data = await response.json();
      console.error(data);
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <v-container v-if="!loading">
    <LandingContainer>
      <LandingSectionhead>
        <template v-slot:title>Entrez en contact avec {{ mentor?.firstName }} {{ mentor?.lastName }}</template>
        <template v-slot:desc>Donnez un maximum de descriptions à votre mentor afin qu'il puisse accepter votre demande et vous recontacter.</template>
      </LandingSectionhead>
    </LandingContainer>
    <v-form @submit.prevent="submit">
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
