# Pokemon PKSM LivingDex Tracker

https://livingdextracker.com

## Using the PSKM Script

A PKSM Script version of this file can be found in the `/scripts` subdirectory.

See the [README](https://github.com/mrhappyasthma/Pokemon-PKSM-LivingDex-Tracker/tree/main/static) there for more details.

## Using the website

### Background

[PKSM](https://github.com/FlagBrew/PKSM) is a wonderful alternative to Pokemon Bank if you have access to a CFW 3DS.
It's a great storage manager and stores the storage 'banks' in `.bnk` files.

This utility is designed for folks working toward a [Living Pokedex](https://bulbapedia.bulbagarden.net/wiki/Living_Pok%C3%A9dex)
(i.e. LivingDex) to more easily track their progress and get a report about missing pokemon broken down by version.

### Usage

![Example gif displaing the website UI in action.](https://i.imgur.com/5Fohucj.gif)

### Requirements

At the time of this writing, this script only supports the latest (i.e. `version 3`) pokemon bank files.

TODO: Add support for parsing older v1 and v2 pokemon banks

## Building / Deploying the website

### Prework

1. Create an app engine project.
2. Enable the `Google Picker API` and the `Google Drive API`.
3. Populate `static/project_number.txt` with the project number.
4. Create a `OAuth 2.0 Client ID` and populate `static/client_secret.txt` with the secret.
5. Create an `API Key` (and consider restricting it). And populate `static/google_picker_api_key.txt`

### Running the site locally.

1. Clone the repo.
2. Install python3, if you haven't already.
3. Run the following command to install the dependencies:
```
python3 -m pip install -r requirements.txt
```
4. `cd` into the directory and create a `virtualenv` by running:
```
virtualenv flask
```
5. Run the following command:
```
source flask/Scripts/activate
```
You should now seek `(flask)` in your terminal prompt.
    
6. Run the `main.py` with:
```
python3 main.py
```

### Deploying the site

If you haven't already, install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

If it's your first time deploying, run:

```
gcloud init
```

If you already have an initialized repository, then simply run

```
gcloud app deploy app.yaml
```
