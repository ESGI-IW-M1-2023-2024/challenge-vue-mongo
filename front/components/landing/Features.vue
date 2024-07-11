<script setup>
const features = [
  {
    title: 'Choisissez Votre Expert',
    description: 'Trouvez et sélectionnez les experts dans les technologies et langages spécifiques dont vous avez besoin.',
    icon: 'bx:bxs-briefcase',
  },
  {
    title: 'Réputation et Fiabilité',
    description: 'Les experts sont évalués par la communauté pour garantir des conseils et une aide de qualité.',
    icon: 'bx:bxs-window-alt',
  },
  {
    title: 'Sessions Personnalisées',
    description: "Réservez des sessions one-to-one avec partage d'écran pour une aide personnalisée et en temps réel.",
    icon: 'bx:bxs-data',
  },
  {
    title: 'Intégration Complète',
    description: 'AirMentor se connecte avec GitHub et StackOverflow pour une meilleure reconnaissance des contributions et compétences.',
    icon: 'bx:bxs-bot',
  },
  {
    title: 'Suivi et Historique',
    description: 'Accédez aux commentaires et historiques des interventions pour apprendre des expériences passées.',
    icon: 'bx:bxs-file-find',
  },
  {
    title: 'Communauté Active',
    description: 'Rejoignez une communauté de passionnés, échangez et progressez ensemble dans vos projets.',
    icon: 'bx:bxs-user',
  },
];
</script>

<template>
  <div class="mt-16 md:mt-0">
    <h2 class="text-4xl lg:text-5xl font-bold lg:tracking-tight">Trouvez un Expert</h2>
    <p class="text-lg mt-4 text-slate-600">
      Grâce à notre système de réputation, vous pouvez facilement identifier les spécialistes les plus compétents dans les langages et technologies que vous utilisez. Nos experts sont évalués par la communauté pour garantir un niveau de service
      exceptionnel.
    </p>
  </div>

  <div class="grid sm:grid-cols-2 md:grid-cols-3 mt-16 gap-16">
    <div v-for="item of features" class="flex gap-4 items-start">
      <div class="mt-1 bg-black rounded-full p-2 w-8 h-8 shrink-0">
        <Icon class="text-white" :name="item.icon" />
      </div>
      <div>
        <h3 class="font-semibold text-lg">{{ item.title }}</h3>
        <p class="text-slate-500 mt-2 leading-relaxed">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>
