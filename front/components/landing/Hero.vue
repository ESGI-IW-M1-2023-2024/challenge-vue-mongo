<template>
  <main class="grid lg:grid-cols-2 place-items-center pt-16 pb-8 md:pt-8">
    <div class="p-24 md:order-1 hidden md:block">
      <img class="rounded-full transition-transform transform hover:scale-125" src="~/assets/img/hero.jpg" alt="Starship starts the engine" loading="eager" format="avif" width="512" height="512" />
    </div>

    <div>
      <h1 class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight">Bienvenue sur AirMentor</h1>
      <p class="text-lg mt-4 text-slate-600 max-w-xl">
        AirMentor est la plateforme qui met en relation les experts et les personnes ayant des problèmes techniques spécifiques. Que vous soyez un développeur débutant ou un professionnel chevronné, vous trouverez ici l'aide dont vous avez besoin
        pour surmonter vos défis.
      </p>
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <LandingLink href="/experts" rel="noopener">Voir les mentors</LandingLink>
        <LandingLink size="lg" styleName="outline" rel="noopener" href="/signup">S'inscrire</LandingLink>
      </div>
    </div>
  </main>
</template>
