# Pokemon PKSM LivingDex Tracker

## Background

[PKSM](https://github.com/FlagBrew/PKSM) is a wonderful alternative to Pokemon Bank if you have access to a CFW 3DS.
It's a great storage manager and stores the storage 'banks' in `.bnk` files.

This utility is designed for folks working toward a [Living Pokedex](https://bulbapedia.bulbagarden.net/wiki/Living_Pok%C3%A9dex)
(i.e. LivingDex) to more easily track their progress and get a report about missing pokemon broken down by version.

## Requirements

At the time of this writing, this script only supports the latest (i.e. `version 3`) pokemon bank files.

See the TODO List below for my backlog.

## TODO List

- Accept bank files from command line
- Print the sets of missing pokemon alongside each generation completion percentage
- Consider turning into a web app w/ a GUI
- Consider using PKSM as a dependency somehow and reusing actual code instead of reimplementing
- Add support for parsing older v1 and v2 pokemon banks
