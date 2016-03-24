# EVOLYON

Ecosysteme vivant en réseau pour les abribus urbains

Pour lancer l'app, utiliser le script.

    ./evolyon start
    
Les ports utilisés sont renseignés dans le script lui-même.

Les commandes ```./evolyon stop``` et ```./evolyon restart``` peuvent aussi être utilisées.

### Configuration

Le port sur lequel l'ootside est connectée doit être renseigné dans le fichier ```config.js```.

Pour trouver le port serial utilisé pat l'ootsidebox, utiliser la commande ```dmesg``` et chercher les infos Arduino. Sur Linux, cela devrait être ```/dev/ttcyAM0``` ou  ```/dev/ttcyAM1```.

### Logs

Les logs sont disponibles dans ```../log``` et le pid et autres info sont dans le dossier ```../run```. Pour créer les dossiers lors d'une nouvelle install : 

    ./evolyon init






