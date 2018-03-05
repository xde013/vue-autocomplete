## Vue Autocomplete
----------
Please disable <strong>same origin policy </strong> in your browser in order to run this properly. *This is strictly for development, not production use* Add to response header rule *- 'Access-Control-Allow-Origin: *'* or install this <a  href="https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi"> add-on </a> if you are running on Chrome.

# How to run

This is a fairly basic VueJS project, to install simply:
### Navigate into project folder

    $> cd autocomplete-master
### Install live-server if you haven't already

    $> npm install -g live-server 
### Run live-server and open it in your browser

 `$> live-server`

## This isn't finished yet
**TODOs :**

 - Seperate the two file inputs logic into individual modules.
 - Re-write API calls more efficiently to provide more response feedback to the user. ( Loading, searching states..etc)
 - Eventually make less use of watch methods and minimize variables use. 
- Improvements and fixes to minor UI/UX bugs.
- ...
- Do you have some suggestions? hit me up.