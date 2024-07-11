<script setup lang="ts">
interface Props {
  block?: boolean;
  styleName?: "outline" | "primary" | "inverted";
  className?: string;
  [x: string]: any;
  image: string;
  title: string;
  subtitle: string;
  reviews: [];
}

const props = withDefaults(defineProps<Props>(), {
  styleName: "primary",
  image: "",
});


const styles = {
  outline: "border-2 border-black hover:bg-black text-black hover:text-white",
  primary:
    "bg-primary text-white hover:bg-slate-900  border-2 border-transparent",
};

const goodReviewsPercentage = ref(0);


const calculateScore = () => {
  let reviewsScore = 0;
  for (const element of props.reviews) {
    if (element.score > 0) {
      reviewsScore++;
    }
  }
  const totalReviews = props.reviews.length;
  if (totalReviews > 0) {
    goodReviewsPercentage.value = (reviewsScore / totalReviews) * 100; // Calculer le pourcentage
  }
};
calculateScore();
</script>

<template>
  <v-card
    :class="[
      block && 'w-full',
      styles[styleName],
      className,
    ]"
    hover
    link
    to="/"
  >
    <v-img
      class="align-end text-white"
      height="200"
      :src="image"
      cover
      gradient="to top, rgba(128,128,128,.50), rgba(25,32,72,0)"
    >
    
      <v-card-title>{{ title }}</v-card-title>
    </v-img>
    <div class="absolute right-0 mr-2 -translate-y-1/2 bg-white px-2 rounded-full">{{goodReviewsPercentage}}</div>
    <v-card-subtitle class="pt-4">
      {{ subtitle }}
    </v-card-subtitle>
    <v-card-text>
      <slot />
    </v-card-text>
    <v-card-actions>
      <v-btn text="Voir plus"></v-btn>
    </v-card-actions>
  </v-card>
</template>
