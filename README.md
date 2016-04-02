# EVOLYON

Ecosysteme vivant en réseau pour les abribus urbains

#### Pour lancer l'app côté client (au démarrage de la machine) :

``cd www/evolyon/evolyon/ootsidebox-client && sudo node ootside.js``

#### Pour lancer l'app côté serveur (uniquement pour mettre à jour) :

Depuis une machine en SSH, utiliser Fabric (``sudo apt-get install pip`` et ``pip install fabric``) :

Pour relancer le serveur si besoin :

- Faire un ``fab lab deploy`` depuis une machine en SSH

Si c'est la galère sur le serveur :

1. Faire un ``ps aux | grep forever`` et ``kill XXX`` avec XXX = pid
2. Faire un ``ps aux | grep node`` et ``kill XXX`` avec XXX = pid
3. Faire ``fab lab start``


### Configuration

Le port sur lequel l'ootside est connectée doit être renseigné dans le fichier ```config.js```.

Pour trouver le port serial utilisé pat l'ootsidebox, utiliser la commande ```dmesg``` et chercher les infos Arduino. Sur Linux, cela devrait être ```/dev/ttcyACM0``` ou  ```/dev/ttcyACM1```.

### Logs

Les logs sont disponibles dans ```../log``` et le pid et autres info sont dans le dossier ```../run```. Pour créer les dossiers lors d'une nouvelle install : 

    ./evolyon init

### Déploiement

Pour déployer en ligne, vous pouvez utiliser Python et [fabric-node-deploy](https://github.com/clemsos/fabric-node-deploy). Cela permet d'automatiser les git pull, server restart, etc.






