<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

definePageMeta({
  layout: "landing",
});

const technologies = ref([]);
const selectedTechno = reactive({ _id: null, label: '' });
const newTechno = reactive({ label: '' });
const technoDialog = ref(null);
const newTechnoModal = ref(null);
const errorMessage = ref('');
const userStore = useUserStore();
const searchQuery = ref('');
const toast = useToast();
const currentPage = ref(1);
const totalPages = ref(1);


const openTechnoModal = (techno) => {
  Object.assign(selectedTechno, techno);
  technoDialog.value.showModal();
};

const closeTechnoModal = () => {
  technoDialog.value.close();
};

const openNewTechnoModal = () => {
  newTechnoModal.value.showModal();
  Object.assign(newTechno, { label: '' });
};

const closeNewTechnoModal = () => {
  newTechnoModal.value.close();
};

const loadTechnoList = async (page = 1) => {
  try {
    const response = await fetch(`http://localhost:3000/api/technologies?page=${page}?search=${searchQuery.value}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      technologies.value = data.results;
      currentPage.value = data.page;
      totalPages.value = data.totalPages;
    } else {
      const data = await response.json();
      toast.error('Erreur lors du chargement de la liste des technologies');
      console.log(data.message);
    }
  } catch (error) {
    toast.error('Erreur lors du chargement de la liste des technologies');
    console.error(error);
  }
}

const deleteTechno = async (user) => {
  try {
    const response = await fetch('http://localhost:3000/api/technologies/' + user._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });
    loadTechnoList();
    toast.success('Technologie supprimée avec succès');
  } catch (error) {
    toast.error('Erreur lors de la suppression de la technologie');
    console.error('Error deleting technologie:', error);
  }
};

const saveTechno = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/technologies/' + selectedTechno._id, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          label: selectedTechno.label,
        }
      ),
    });

    if (response.ok) {
      loadTechnoList();
      toast.success('Technologie modifiée avec succès');
      technoDialog.value.close();
    } else {
      const data = await response.json();
      toast.error('Erreur lors de la modification de la technologie');
      errorMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
    toast.error('Erreur lors de la modification de la technologie');
    errorMessage.value = 'Error saving technology: ', error;
  }
};

const addTechno = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/technologies', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label: newTechno.label,
      }),
    });

    if (response.ok) {
      loadTechnoList();
      toast.success('Technologie créée avec succès');
      newTechnoModal.value.close();
    } else {
      const data = await response.json();
      toast.error('Erreur lors de la création de la technologie');
      errorMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
    toast.error('Erreur lors de la création de la technologie');
    errorMessage.value = 'Error creating technology: ', error;
  }
};

onMounted(() => {
  loadTechnoList();
})
</script>

<style>
  dialog {
    max-width: 500px;
    margin: 10% auto;
  }
</style>
<template>
  <div class="p-4">
    <div class="flex justify-between items-center p-2">
      <h1 class="text-2xl font-bold mb-4">Liste des Technologies</h1>
      <LandingButton @click="openNewTechnoModal()" size="md">Nouvelle Technologie</LandingButton>
    </div>
    <div class="flex justify-between items-center p-2">
      <input v-model="searchQuery" @input="loadTechnoList" class="w-full p-2 border rounded" placeholder="Rechercher une technologie">
    </div>
    <ul class="space-y-2">
      <li v-for="techno in technologies" :key="techno.id" class="flex justify-between items-center p-2 border rounded">
        <div class="flex flex-col">
          <span>{{ techno.label }}</span>
        </div>
        <div>
          <button @click="deleteTechno(techno)" class="ml-4 bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
          <button @click="openTechnoModal(techno)" class="ml-4 bg-blue-500 text-white px-2 py-1 rounded">Modifier</button>
        </div>
      </li>
    </ul>
    <v-pagination 
      :length="totalPages" 
      class="my-10" 
      v-model="currentPage" 
      @update:model-value="loadTechnoList"
    >
    </v-pagination>

    <dialog ref="technoDialog" class="p-6 border rounded-md bg-white w-100">
      <form method="dialog" @submit.prevent="saveTechno" class="space-y-4">
        <h2 class="text-xl font-bold">Modifier Technologie</h2>
        <div>
          <label class="block">Label:</label>
          <input v-model="selectedTechno.label" class="w-full p-2 border rounded" required>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closeTechnoModal" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Sauvegarder</button>
        </div>
        <div id="result" class="mt-3 text-center">{{ errorMessage }}</div>
      </form>
    </dialog>

    <dialog ref="newTechnoModal" class="p-6 border rounded-md bg-white w-100">
      <form method="dialog" @submit.prevent="addTechno" class="space-y-4">
        <h2 class="text-xl font-bold">Nouvelle Technologie</h2>
        <div>
          <label class="block">Label:</label>
          <input v-model="newTechno.label" class="w-full p-2 border rounded" required>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closeNewTechnoModal" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Sauvegarder</button>
        </div>
        <div id="result" class="mt-3 text-center">{{ errorMessage }}</div>
      </form>
    </dialog>
  </div>
</template>
