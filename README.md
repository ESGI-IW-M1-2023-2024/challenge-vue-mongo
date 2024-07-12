# AirMentor
Un projet de Arnaud GOUEL, Yvan SCHMITT, Loan COURCHINOUX-BILLONET et Olivier PERDRIX

## Installation du projet

- Dans le dossier `back`, dupliquer le fichier `.env.example` et le renommer `.env`
- dans le dossier `back/bruno/environsments` dupliquer le fichier `dev.bru.example` et le renommer `dev.bru`

Lancer la commande suivante :

```shell
docker-compose up -d --build
```

Se rendre sur l'adresse http://localhost:3002 pour accéder à l'application

## Utilisation de l'API

L'API est accessible sur l'adresse http://localhost:3000/api
 
- Installer l'application [Bruno](https://www.usebruno.com/).

- Dans Bruno, ouvrez un nouveau projet depuis ./back/bruno/challenge-vue-hono
Sélectionnez l'environnement Dev et le configurer avec les bons identifiants.

- Exécuter la route /login du dossier Auth (le token sera automatiquement écrit dans le fichier dev.bru et utilisé dans toutes les routes configurées dans Bruno)
