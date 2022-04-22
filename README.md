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

## Base de données

Voici le schéma de la base de données utilisée.

```sql
-- Listage de la structure de table simsimi. answers
CREATE TABLE IF NOT EXISTS `answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `question_id` int(10) unsigned NOT NULL,
  `author_discord_id` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `emotion` enum('NORMAL','ANGRY','ASKING','DISGUSTED','LOVE','SLEEPY') COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `message_question_id` (`message`,`question_id`,`emotion`) USING HASH,
  KEY `FK__questions` (`question_id`),
  CONSTRAINT `FK__questions` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1423 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


-- Listage de la structure de table simsimi. channels
CREATE TABLE IF NOT EXISTS `channels` (
  `channel_discord_id` varchar(50) NOT NULL,
  PRIMARY KEY (`channel_discord_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;


-- Listage de la structure de table simsimi. permissions
CREATE TABLE IF NOT EXISTS `permissions` (
  `role_discord_id` varchar(50) NOT NULL,
  PRIMARY KEY (`role_discord_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;


-- Listage de la structure de table simsimi. questions
CREATE TABLE IF NOT EXISTS `questions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `message` mediumtext COLLATE utf8mb4_bin NOT NULL,
  `author_discord_id` varchar(50) COLLATE utf8mb4_bin DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `message` (`message`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=1036 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
```
