<script setup lang="ts">
import Card from '~/components/landing/Card.vue';

definePageMeta({
  layout: "landing",
});

const users = ref([]);
const errorMessage = ref('');
const loading = ref(true);
const currentPage = ref(1);
const usersPerPage = 2;
const totalUsers = ref(0);
const totalPages = computed(() => Math.ceil(totalUsers.value / usersPerPage));
const router = useRouter();
const userStore = useUserStore();
const {tokenRef} = storeToRefs(userStore);
console.log('token', tokenRef);

onMounted(async () => {



  if (!userStore.token) {
    router.push('/login');
  }

  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      users.value = data;
      loading.value = false;
      console.log(users.value);
      totalUsers.value = data.length;
    } else {
      const data = await response.json();
      errorMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
  }
});

</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Rechercher des experts</template>
      <template v-slot:desc>Trouvez les experts chauds dans votre région</template>
    </LandingSectionhead>


    <v-text-field
      append-inner-icon="mdi-magnify"
      density="compact"
      label="Rechercher par techno"
      variant="solo"
      hide-details
      single-line
      class="mx-auto mt-5"
    ></v-text-field>

    <v-container v-if="!loading">
      <v-row>
        <v-col cols="4" v-for="item of users">
          <Card 
            class="group"
            image="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            :title="item.firstName"
            :subtitle="item.title"
            :to="'/experts/' + item._id"
            :reviews="item.likes"
          >
          <v-container>
            <v-row no-gutters class="gap-1">
              <v-col v-for="techno of item.technologies" style="max-width: fit-content;">
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
    <v-pagination :length="4" class="my-10"></v-pagination>
  </LandingContainer>
</template>
