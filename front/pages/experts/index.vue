<script setup>
import Card from '~/components/landing/Card.vue';

definePageMeta({
  layout: "landing",
});

const TeamImg1 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const TeamImg2 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const TeamImg3 = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const team = [
  {
    name: "Janette Lynch",
    title: "Senior Director",
    avatar: {
      src: TeamImg1,
      width: 480,
      height: 560,
    },
  },
  {
    name: "Marcell Ziemann",
    title: "Principal Strategist",
    avatar: {
      src: TeamImg2,
      width: 580,
      height: 580,
    },
  },
  {
    name: "Robert Palmer",
    title: "Marketing Engineer",
    avatar: {
      src: TeamImg3,
      width: 580,
      height: 580,
    },
  },
  {
    name: "Sabu Chtonqu",
    title: "Cooker",
    avatar: {
      src: TeamImg3,
      width: 580,
      height: 580,
    },
  },
];
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
        <v-col cols="4" v-for="item of team">
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
