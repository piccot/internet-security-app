# Building Sad Cyber Sam

Sad Cyber Sam is a cordova built application. Install Cordova [HERE][df1] and build follow documentation to build for the appropriate platform

# Future Development

The following is a descrption of each html file. All the files has a css and a js file associated with it of the same name.

### Main Initial

Pulls data from the cybersafegames website and saves it into files to be loaded from the app. An internet connection must be established before going to this page. Links to these pages were provided Kenan-Flagler and can be obtained from them.

### Main

The main page for loading the applications. To add more games clone the following section of code in hte onDeviceReady function with the rest of them "createCard('whack_splash.png','whack.html',0);". The first parameter is the splash screen on the game, this should be a 4x3 image. The second parameter is the path to the main game page (whether it be a splash page or the game itself). The last parameter is the order in which it appears in the list of games, this number needs to be always unique.

### Whack, Virus, Mail

These are the main pages for the 3 games currently in the application, the all start with their respective "Start Game" pages, however all data is loading in the onDeviceReady function and the "Play" and "Back" buttons become available once everything is loaded. Sounds are loaded after you click the play buttton. The reason we do this is because as of now, most Cordova media plugins do not work properly in iOS 9.0+ and in order to use javascript "new Audio()" sounds they must be loaded after an onlick/ontouch event.

Each game has 3 main functions

Main
> This function is for doing nothing but recursivly calling itself and calling the other functions listed.

update
> This function is designed for keeping track of time and for calling editObjects

editObjects
> This function accepts a change in time from last execution and edits the game objects based upon this

render
> This function is called last. It clears and draws all the images to the database.


After each game ends it will bring up an ending popup. Hitting Play again will reset all parameters and start the game over. Hitting Main Menu will captured data to the database the go back to main.html

#Known Bugs

Very rarely the app will freeze with 100% CPU usage. This seems to be a limitation of Cordova when accessing files.

# Credits

Sad Cyber Sad was developed by [Daniel Piccot][dp1] and [Matt Hill][mh1] in coordination with Kenan-Flagler Business School and The University of North Carolina at Chapel Hill.

[df1]: <https://cordova.apache.org/>
[dp1]: <https://www.linkedin.com/in/daniel-piccot-bb6189106/>
[mh1]: <https://www.linkedin.com/in/matthew-hill-250831106/>
  