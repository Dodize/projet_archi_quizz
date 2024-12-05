# projet_archi_quizz
projet 2A archi web

# Lancer le front :
npm i <br>
npx vite

# Lancer le back
npm i <br>
node src/server.cjs

# Mise à jour de la database (si besoin de modifier le modèle)
mettre à le jour le schéma dans le fichier schema.prisma
npx prisma migrate dev --name <nom_de_la_migration>
npx prisma db pull
