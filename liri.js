require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys")
var spotify = new Spotify(keys.spotify);
var searchQuery = process.argv.slice(3).join("%20");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var searchType = process.argv[2];

function runProgram(searchType, searchQuery){
    // Bands in Town API Call
    if (searchType === "concert-this"){
        axios.get("https://rest.bandsintown.com/artists/" + searchQuery + "/events?app_id=codingbootcamp").then(
            function(response) {
                // console.log(response.data[0])
                // Prevents error when selected Artist has no planned events
                if (response.data[0] !== undefined){
                    // Added hard limit of 5 results to avoid HUGE responses (e.g. Arianna Grande has 40+ responses)
                    for (var i = 0; i < response.data.length && i < 5; i++) {
                        console.log("\n ================== \n");
                        console.log("Event #" + (i + 1) + " Info:");
                        console.log("Name of Venue: " + response.data[i].venue.name);

                        // If statement to make sure the region only displays if it exists in the response object
                        if (response.data[i].venue.region > -1){
                            console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.country);
                        } else {
                            console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                        }
                        
                        console.log("Date of Event: " + moment(response.data[i].datetime).format('LLLL'));
                    }
                }
                else {
                    console.log("Sorry, that artist currently does not have any planned events. Please try a different one!")
                }
            }
        );
    }

    // Spotify API Call
    if (searchType === "spotify-this-song"){
        if (searchQuery > -1){
            spotify.search({ type: 'track', query: "The Sign Ace of Base", limit: 1 }, function(err, data) {
                if (err) {
                return console.log('Error occurred: ' + err);
                } 
                else {
                    for (var j = 0; j < data.tracks.items.length; j++){
                        console.log("\n ================== \n");
                        console.log("Result #" + (j + 1) + " Info:");
                        console.log("Artist(s): " + data.tracks.items[j].album.artists[0].name);
                        console.log("Song Name: " + data.tracks.items[j].name); 
                        console.log("Album Name: " + data.tracks.items[j].album.name); 
                        console.log("Preview URL (30 seconds): " + data.tracks.items[j].preview_url); 
                        console.log("Link to Full Song in Spotify: " + data.tracks.items[j].external_urls.spotify); 
                    }
                };
            })            
        }
        else {
            spotify.search({ type: 'track', query: searchQuery, limit: 5 }, function(err, data) {
                if (err) {
                return console.log('Error occurred: ' + err);
                } 
                else {
                    for (var j = 0; j < data.tracks.items.length; j++){
                        console.log("\n ================== \n");
                        console.log("Result #" + (j + 1) + " Info:");
                        console.log("Artist(s): " + data.tracks.items[j].album.artists[0].name);
                        console.log("Song Name: " + data.tracks.items[j].name); 
                        console.log("Album Name: " + data.tracks.items[j].album.name); 
                        console.log("Preview URL (30 seconds): " + data.tracks.items[j].preview_url); 
                        console.log("Link to Full Song in Spotify: " + data.tracks.items[j].external_urls.spotify); 
                    }
                };
            })
        }
    }

    // OMDb API Call
    if (searchType === "movie-this"){
        if (searchQuery > -1){
            axios.get("http://www.omdbapi.com/?t=Mr%20Nobody&y=&plot=short&apikey=trilogy").then(
                function(response) {
                console.log("Movie Title: " + response.data.Title);
                console.log("Release Year: " + response.data.Year);
                console.log("IMDb Rating: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
                }
            );
        }
        else {
            axios.get("http://www.omdbapi.com/?t=" + searchQuery + "&y=&plot=short&apikey=trilogy").then(
                function(response) {
                    if (response.data.Title !== undefined){
                        console.log("Movie Title: " + response.data.Title);
                        console.log("Release Year: " + response.data.Year);
                        console.log("IMDb Rating: " + response.data.imdbRating);
                        console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                        console.log("Country: " + response.data.Country);
                        console.log("Language: " + response.data.Language);
                        console.log("Plot: " + response.data.Plot);
                        console.log("Actors: " + response.data.Actors);
                    }
                    else {
                        console.log("Sorry, we were unable to find a movie with that title. Please try a different one!")
                    }
                }
            );
        }
    }

    // FS read file
    if (searchType === "do-what-it-says"){
        fs.readFile("random.txt", "utf8", function(error, data){
            if (error) {
                return console.log(error);
            }
            else {
                var dataArr = data.split(",");
                runProgram(dataArr[0],dataArr[1]);
            }
        })
    }
}

runProgram(searchType, searchQuery);


  