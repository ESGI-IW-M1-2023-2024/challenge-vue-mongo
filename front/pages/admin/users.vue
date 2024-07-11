<script setup>
import { ref, reactive, onMounted } from 'vue';

definePageMeta({
  layout: "landing",
});

const users = ref([]);
const selectedUser = reactive({ _id: null, firstName: '', lastName: '', email: '', password: '', gender: '', role: '', biography: '', imageUrl: '' });
const newUser = reactive({ firstName: '', lastName: '', email: '', role: '', password: '', gender: '', biography: '', imageUrl: '' });
const userDialog = ref(null);
const newUserModal = ref(null);
const errorMessage = ref('');
const userStore = useUserStore();


const openUserModal = (user) => {
  Object.assign(selectedUser, user);
  selectedUser.password = '';
  userDialog.value.showModal();
};

const closeUserModal = () => {
  userDialog.value.close();
};

const openNewUserModal = () => {
  newUserModal.value.showModal();
  Object.assign(newUser, { firstName: '', lastName: '', email: '', role: '', password: '', gender: '', biography: '', imageUrl: '' });
};

const closeNewUserModal = () => {
  newUserModal.value.close();
};

const loadUserList = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      users.value = data.results;
    } else {
      const data = await response.json();
      console.log(data.message);
    }
  } catch (error) {
    console.error(error);
  }
}

const deleteUser = async (user) => {
  try {
    const response = await fetch('http://localhost:3000/api/users/' + user._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
    });
    loadUserList();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const saveUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users/' + selectedUser._id, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        selectedUser.password.length > 0
          ? {
              firstName: selectedUser.firstName,
              lastName: selectedUser.lastName,
              gender: selectedUser.gender,
              email: selectedUser.email,
              role: selectedUser.role,
              biography: selectedUser.biography,
              imageUrl: selectedUser.imageUrl,
              password: selectedUser.password,
            }
          : {
            firstName: selectedUser.firstName,
            lastName: selectedUser.lastName,
            gender: selectedUser.gender,
            email: selectedUser.email,
            biography: selectedUser.biography,
            imageUrl: selectedUser.imageUrl,
            role: selectedUser.role,
          }
      ),
    });

    if (response.ok) {
      loadUserList();
      userDialog.value.close();
    } else {
      const data = await response.json();
      errorMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Error saving user: ', error;
  }
};

const addUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userStore.tokenRef}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        gender: newUser.gender,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        biography: newUser.biography,
        imageUrl: newUser.imageUrl,
      }),
    });

    if (response.ok) {
      loadUserList();
      newUserModal.value.close();
    } else {
      const data = await response.json();
      errorMessage.value = data.message;
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = 'Error registering user: ', error;
  }
};

onMounted(() => {
  loadUserList();
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
      <h1 class="text-2xl font-bold mb-4">Liste des Utilisateurs</h1>
      <LandingButton @click="openNewUserModal()" size="md">Nouvel Utilisateur</LandingButton>
    </div>
    <ul class="space-y-2">
      <li v-for="user in users" :key="user.id" class="flex justify-between items-center p-2 border rounded">
        <div class="flex flex-col">
          <span>{{ user.firstName }} {{ user.lastName }}</span>
          <span class="text-sm text-gray-500">{{ user.email }} - {{ user.role }}</span>
        </div>
        <div>
          <button @click="deleteUser(user)" class="ml-4 bg-red-500 text-white px-2 py-1 rounded">Supprimer</button>
          <button @click="openUserModal(user)" class="ml-4 bg-blue-500 text-white px-2 py-1 rounded">Modifier</button>
        </div>
      </li>
    </ul>

    <dialog ref="userDialog" class="p-6 border rounded-md bg-white">
      <form method="dialog" @submit.prevent="saveUser" class="space-y-4">
        <h2 class="text-xl font-bold">Modifier Utilisateur</h2>
        <div>
          <label class="block">Prénom:</label>
          <input v-model="selectedUser.firstName" class="w-full p-2 border rounded" required>
        </div>
        <div>
          <label class="block">Nom:</label>
          <input v-model="selectedUser.lastName" class="w-full p-2 border rounded" required>
        </div>
        <div>
          <label class="block">Genre:</label>
          <select class="mt-3 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" v-model="selectedUser.gender">
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
          </select>
        </div>
        <div>
          <label class="block">Email:</label>
          <input v-model="selectedUser.email" class="w-full p-2 border rounded" required type="email">
        </div>
        <div class="mb-5">
          <label class="block">Image:</label>
          <input class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" v-model="selectedUser.imageUrl"/>
        </div>
        <div class="mb-5">
          <label class="block">Biography:</label>
          <textarea class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" v-model="selectedUser.biography">
          </textarea>
        </div>
        <div>
          <label class="block">Mot de passe:</label>
          <input v-model="selectedUser.password" class="w-full p-2 border rounded" type="password">
        </div>
        <div>
          <label class="block">Role:</label>
          <select class="mt-3 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" v-model="selectedUser.role">
            <option value="user">User</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closeUserModal" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Sauvegarder</button>
        </div>
        <div id="result" class="mt-3 text-center">{{ errorMessage }}</div>
      </form>
    </dialog>

    <dialog ref="newUserModal" class="p-6 border rounded-md bg-white">
      <form method="dialog" @submit.prevent="addUser" class="space-y-4">
        <h2 class="text-xl font-bold">Nouvel Utilisateur</h2>
        <div>
          <label class="block">Prénom:</label>
          <input v-model="newUser.firstName" class="w-full p-2 border rounded" required>
        </div>
        <div>
          <label class="block">Nom:</label>
          <input v-model="newUser.lastName" class="w-full p-2 border rounded" required>
        </div>
        <div>
          <label class="block">Genre:</label>
          <select class="mt-3 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" v-model="newUser.gender">
            <option value="male" selected>Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
          </select>
        </div>
        <div>
          <label class="block">Email:</label>
          <input v-model="newUser.email" class="w-full p-2 border rounded" required type="email">
        </div>
        <div class="mb-5">
          <label class="block">Image:</label>
          <input class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" v-model="newUser.imageUrl"/>
        </div>
        <div class="mb-5">
          <label class="block">Biography:</label>
          <textarea class="w-full px-4 py-3 border-2 placeholder:text-gray-800 rounded-md outline-none focus:ring-4 border-gray-300 focus:border-gray-600 ring-gray-100" v-model="newUser.biography">
          </textarea>
        </div>
        <div>
          <label class="block">Role:</label>
          <select class="mt-3 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" v-model="newUser.role">
            <option value="user" selected>User</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label class="block">Mot de passe:</label>
          <input v-model="newUser.password" class="w-full p-2 border rounded" required type="password">
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closeNewUserModal" class="px-4 py-2 bg-gray-300 rounded">Annuler</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Sauvegarder</button>
        </div>
        <div id="result" class="mt-3 text-center">{{ errorMessage }}</div>
      </form>
    </dialog>
  </div>
</template>
