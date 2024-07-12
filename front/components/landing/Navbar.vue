<script setup lang="ts">
import { useToast } from 'vue-toastification';
const menuitems = [
  {
    title: 'Experts',
    path: '/experts',
    role: '',
  },
  {
    title: 'Tarifs',
    path: '/pricing',
    role: '',
  },
  {
    title: 'A propos',
    path: '/about',
    role: '',
  },
  {
    title: 'Contacts',
    path: '/contact',
    role: '',
  },
  {
    title: 'Utilisateurs',
    path: '/admin/users',
    role: 'admin',
  },
  {
    title: 'Technologies',
    path: '/admin/technologies',
    role: 'admin',
  },
  {
    title: 'Mes Tickets',
    path: '/my-tickets',
    role: '',
  },
];

const open = ref(false);
const isLogged = ref(false);
const userStore = useUserStore();
const toast = useToast();

watch(userStore, () => {
  if (userStore.userRef) {
    isLogged.value = true;
  }
});

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/checkLogin', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      isLogged.value = true;
    } else {
      isLogged.value = false;
    }
  } catch (error) {
    console.error(error);
  }

});
// gestion du logout qui supprime le token du localstorage
const logout = () => {
  userStore.tokenRef = '';
  userStore.userRef = null;
  isLogged.value = false;
  toast.success('Vous êtes maintenant déconnecté');
  navigateTo('/');
  //window.location.href = '/';
};
</script>

<template>
  <LandingContainer>
    <header class="flex flex-col lg:flex-row justify-between items-center my-5">
      <div class="flex w-full lg:w-auto items-center justify-between">
        <a href="/" class="text-lg"><span class="text-slate-500">Air</span><span class="font-bold text-slate-800">Mentor</span> </a>
        <div class="block lg:hidden">
          <button @click="open = !open" class="text-gray-800">
            <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <title>Menu</title>
              <path
                v-show="open"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z"
              ></path>
              <path v-show="!open" fill-rule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z"></path>
            </svg>
          </button>
        </div>
      </div>
      <nav class="w-full lg:w-auto mt-2 lg:flex lg:mt-0" :class="{ block: open, hidden: !open }">
        <ul class="flex flex-col lg:flex-row lg:gap-3">
          <li v-for="item of menuitems">
            <a v-if="item.role == '' || userStore.userRef?.role == 'admin' || userStore.userRef?.role == item.role" :href="item.path" class="flex lg:px-3 py-2 text-gray-600 hover:text-gray-900">
              {{ item.title }}
            </a>
          </li>
        </ul>
        <div v-if="!isLogged" class="lg:hidden flex items-center mt-3 gap-4">
          <LandingLink href="/login" styleName="muted" block size="md">Se connecter</LandingLink>
          <LandingLink href="/signup" size="md" block>S'inscrire</LandingLink>
        </div>
        <div v-else class="lg:hidden flex items-center mt-3 gap-4">
          <LandingLink href="/profil" styleName="muted" size="md" class="flex flex-col">
            <p>Bienvenue {{ userStore.userRef?.firstName }} !</p>
            <p class="text-sm text-gray-500">{{ userStore.userRef?.role }}</p>
          </LandingLink>
          <a href="#" @click="logout()">Se déconnecter</a>
        </div>
      </nav>
      <div>
        <div v-if="!isLogged" class="hidden lg:flex items-center gap-4">
          <a href="/login">Se connecter</a>
          <LandingLink href="/signup" size="md">S'inscrire</LandingLink>
        </div>
        <div v-else class="hidden lg:flex items-center gap-4">
          <LandingLink href="/profil" styleName="muted" size="md" class="flex flex-col">
            <p>Bienvenue {{ userStore.userRef?.firstName }} !</p>
            <p class="text-sm text-gray-500">{{ userStore.userRef?.role }}</p>
          </LandingLink>
          <a href="#" @click="logout()">Se déconnecter</a>
        </div>
      </div>
    </header>
  </LandingContainer>
</template>
