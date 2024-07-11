<script setup>
definePageMeta({
  layout: 'landing',
});

const pricing = [
  {
    name: 'Client',
    price: '50€ / 50 crédits',
    popular: false,
    features: ["1 crédit -> 5 min d'aide", 'Discution par chat', 'Discution en audio', "Partage d'écran avec le mentor"],
    button: {
      text: 'Acheter',
      link: '/',
    },
  },
  {
    name: 'Client',
    price: '250€ / 300 crédits',
    popular: true,
    features: ["1 crédit -> 5 min d'aide", '50 crédits offerts', 'Discution par chat', 'Discution en audio', "Partage d'écran avec le mentor"],
    button: {
      text: 'Acheter',
      link: '/',
    },
  },
  {
    name: 'Mentor',
    price: 'Gratuit',
    popular: false,
    features: ['Rémunération par minutes', 'Chat avec les clients', 'Suivi des interventions', 'Collaborations illimitées', "Partage d'écran", 'Support prioritaire'],
    button: {
      text: "S'inscrire",
      link: '/register',
    },
  },
];
</script>

<template>
  <LandingContainer>
    <LandingSectionhead>
      <template v-slot:title>Tarifs</template>
      <template v-slot:desc>Simple, prédictible, sans surprise</template>
    </LandingSectionhead>

    <div class="grid md:grid-cols-3 gap-10 mx-auto max-w-screen-lg mt-12">
      <LandingPricing v-for="item of pricing" :plan="item" />
    </div>
  </LandingContainer>
</template>
