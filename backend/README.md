# Traitement de GeoJSON vers Base de Données

Ce script traite un fichier GeoJSON, extrait les entités ponctuelles, convertit leurs coordonnées en index H3 à une résolution spécifiée, et télécharge les comptages de ces index dans une base de données.

## Utilisation

Pour utiliser cet outil, suivez ces étapes :

1. **Installer les Dépendances**: Assurez-vous d'avoir installé les dépendances nécessaires. Vous pouvez les installer avec pip :

   ```bash
   pip install h3 xata python-dotenv
   ```

2. **Préparer Votre Fichier GeoJSON**: Assurez-vous que votre fichier GeoJSON contient des entités ponctuelles. Le script extraira ces points et les traitera.

3. **Configurer les Variables d'Environnement**: Créez un fichier `.env` dans le même répertoire que le script si ce n'est pas déjà fait, et spécifiez les variables d'environnement nécessaires :

   ```plaintext
   XATA_API_KEY=votre_clé_api
   XATA_DATABASE_URL=URL_de_votre_base_de_données
   ```

   Remplacez `votre_clé_api` et `URL_de_votre_base_de_données` par vos informations Xata.

4. **Exécuter le Script**: Lancez le script depuis la ligne de commande en fournissant les arguments requis :

   ```bash
   python geojson_to_database.py --filepath chemin/vers/votre/fichier_geojson --table nom_de_votre_table --column nom_de_votre_colonne --resolution votre_résolution
   ```

   - `--filepath` : Chemin vers le fichier GeoJSON contenant des points.
   - `--table` : Nom de la table dans la base de données.
   - `--column` : Nom de la colonne dans la table.
   - `--resolution` : Résolution H3 pour l'analyse (de 0 à 15). La valeur par défaut est 9.

## Source des GeoJSONs que nous avons utilisés

Les fichiers GeoJSON ont tous été obtenus à partir de [Données Québec](https://www.donneesquebec.ca/)

- **Arbres de Longueuil** : [lien](https://www.donneesquebec.ca/recherche/dataset/arbres)
- **Arbres de Québec** : [lien](https://www.donneesquebec.ca/recherche/dataset/vque_26)
- **Adresses de Longueuil** : [lien](https://www.donneesquebec.ca/recherche/dataset/adresses)
- **Adresses de Québec** : [lien](https://www.donneesquebec.ca/recherche/dataset/adresses-de-la-ville-de-quebec)

## Exemple d'Utilisation

Disons que vous avez un fichier GeoJSON nommé `data.geojson` contenant des entités ponctuelles représentant des emplacements. Vous souhaitez stocker les comptages de ces emplacements dans une table nommée `location_counts` dans votre base de données, avec le comptage stocké dans une colonne nommée `count`. Vous pouvez utiliser le script comme suit :

```bash
python geojson_to_database.py --filepath data.geojson --table location_counts --column count --resolution 9
```

Cette commande traitera le fichier GeoJSON, calculera les index H3 pour chaque point à la résolution 9, et téléchargera les comptages dans la table de base de données spécifiée.