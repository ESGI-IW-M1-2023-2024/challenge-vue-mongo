<template></template>

<script lang="ts" setup>
definePageMeta({
  layout: "landing",
});

onMounted(() => {
  const callFrame = window.Daily.createFrame();
  callFrame.join({ url: "https://loan.daily.co/u6yHGnWtqpY2GqLuvr8C" });
});
</script>

<style lang="css">
iframe {
  width: 90vw;
  height: 90vh;
}
</style>
