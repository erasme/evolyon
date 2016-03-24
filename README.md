# EVOLYON

Ecosysteme vivant en réseau pour les abribus urbains

Pour lancer l'app, utiliser le script.

    ./evolyon start
    
Les ports utilisés sont renseignés dans le script lui-même.

### Configuration

Le port sur lequel l'ootside est connectée doit être renseigné dans le fichier ```config.js```.

Pour trouver le port serial utilisé pat l'ootsidebox, utiliser la commande ```dmesg``` et chercher les infos Arduino. Sur Linux, cela devrait être ```/dev/ttcyAM0``` ou  ```/dev/ttcyAM1```.
