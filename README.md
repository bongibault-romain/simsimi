## Lancer le bot

Clone the project

```bash
  git clone https://github.com/bongibault-romain/simsimi
```

Aller dans le dossier du projet

```bash
  cd my-project
```

Installez les dépendances

```bash
  npm install
```

Créez un fichier `./config/.env`. Un exemple peut être trouvé dans ` ./config/example.env`.

```
TOKEN=YOUR_BOT_TOKEN
MAX_LENGTH=400
DATABASE=simsimi
USER=root
PASSWORD=root
HOST=127.0.0.1
```

Démarrez le bot

```bash
  npm run dev
```
