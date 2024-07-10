<script setup>
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



  // if (!userStore.token) {
  //   router.push('/login');
  // }

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
      :loading="loading"
      append-inner-icon="mdi-magnify"
      density="compact"
      label="Rechercher par techno"
      variant="solo"
      hide-details
      single-line
      @click:append-inner="onClick"
      class="mx-auto mt-5"
    ></v-text-field>

    <v-container>
      <v-row>
        <v-col cols="4" v-for="item of users">
          <Card 
            class="group"
            :image="item.avatar.src"
            :title="item.name"
            :subtitle="item.title"
            :to="'/experts/' + item.name"
          >
            <v-chip>
              test
            </v-chip>
          </Card>
        </v-col>
      </v-row>
    </v-container>
    <v-pagination :length="4" class="my-10"></v-pagination>
  </LandingContainer>
</template>
