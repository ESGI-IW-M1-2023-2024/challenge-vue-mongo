<script setup lang="ts">
import type { IIssue } from '../../../back/src/models/issue';
definePageMeta({
  layout: 'landing',
});

const issues = ref<IIssue[]>([]);
const userStore = useUserStore();
const errorMessage = ref('');
const loading = ref(true);

const fetchIssues = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users/issues', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const issuesWithMentors = await Promise.all(data.map(async (issue: IIssue) => {
        const mentor = await fetchUser(issue.idMentor.toString());
        return { ...issue, mentor };
      }));
      console.log('réponse', data);
      issues.value = issuesWithMentors;

      loading.value = false;
    } else {
      const data = await response.json();
      console.log('error', data);
      loading.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchUser = async (id: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

onMounted(async () => {
  if (!userStore.tokenRef) {
    navigateTo('/login');
  }

  await fetchIssues();
});
</script>

<template>
  <template>
    <LandingContainer>
      <LandingSectionhead>
        <template v-slot:title>Liste de vos tickets</template>
        <template v-slot:desc>Voici tous vos tickets avec vos experts</template>
      </LandingSectionhead>

      <v-container v-if="!loading">
        <v-row class="items-stretch">
          <v-col cols="4" v-for="issue of issues" :key="issue._id.toString()">
            <v-card class="px-3 py-2 h-full">
              {{ issue.mentor ? issue.mentor.firstName + ' ' + issue.mentor.lastName : 'Chargement...' }}
              <v-card-title>{{ issue.title }}</v-card-title>
              <v-card-text>{{ issue.description }}</v-card-text>
              <v-card-text>Status : {{ issue.status }}</v-card-text>
              <v-card-actions>
                <v-btn color="primary">Ouvrir</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-else>
        <v-row>
          <v-col cols="12">
            <v-progress-linear indeterminate color="primary"></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </LandingContainer>
  </template>
</template>
