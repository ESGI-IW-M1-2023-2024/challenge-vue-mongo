<script setup lang="ts">
import Card from '~/components/landing/Card.vue';
import type { IUser } from '../../../back/src/models/user';

definePageMeta({
  layout: 'landing',
});

const users = ref<IUser[]>([]);
const errorMessage = ref('');
const loading = ref(true);
const currentPage = ref(1);
const usersPerPage = ref(10);
const totalUsers = ref(0);
const totalPages = ref(1);
const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.tokenRef) {
    router.push('/login');
  }

  try {
    const response = await fetch('http://localhost:3000/api/users/mentors', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      users.value = data.results;
      totalUsers.value = data.totalResults;
      totalPages.value = data.totalPages;
      usersPerPage.value = data.limit;
      currentPage.value = data.page;

      loading.value = false;
    } else {
      const data = await response.json();
      errorMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
  }
});

const calculateColWidth = (userCount: number) => {
  // Si moins de 4 utilisateurs, diviser 12 (nombre total de colonnes dans le système de grille) par le nombre d'utilisateurs
  // Sinon, utiliser 4 comme largeur de colonne standard
  return userCount < 4 ? Math.max(12 / userCount, 4) : 4;
};
</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Rechercher des experts</template>
      <template v-slot:desc>Trouvez les experts chauds dans votre région</template>
    </LandingSectionhead>

    <v-text-field append-inner-icon="mdi-magnify" density="compact" label="Rechercher par techno" variant="solo" hide-details single-line class="mx-auto mt-5"></v-text-field>

    <v-container v-if="!loading">
      <v-row class="items-stretch">
        <v-col :cols="calculateColWidth(users.length)" v-for="user of users" :key="user._id.toString">
          <Card class="group" :image="user?.imageUrl" :title="user?.firstName + ' ' + user.lastName" :to="'/experts/' + user?._id" :reviews="user?.likes">
            <v-container>
              <v-row no-gutters class="gap-1">
                <v-col v-for="techno of user?.technologies" style="max-width: fit-content">
                  <v-chip>
                    {{ techno.label }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-container>
          </Card>
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
    <v-pagination :length="totalPages" class="my-10" v-model="currentPage"></v-pagination>
  </LandingContainer>
</template>
