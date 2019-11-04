const API_KEY = "6776bf95";
const url = 'http://www.omdbapi.com/?apikey=6776bf95&type=series&r=json&';

const buttonElement = document.querySelector("#search");
const inputElement = document.querySelector("#inputValue");
const searchedMovie = document.querySelector("#movie-list");

/**
 * @description Fetches movies list depending on search text
 * @param {string} search Search text typed by user
 */
async function getMovieListBySearch(search) {
    try {
        const res = await fetch(search);
        
        console.log(res);
        return res.json();
        
    }
    catch (error) {
        console.log("Error: ", error);
    }
}

/**
 * @description Fetches movie's plot (default short) from given movie object
 * @param {Object} movie movie Object which contains imdbID
 * @param {Boolean} short Determines wheter Plot should be short of full
 */
async function getPlotByMovie(movie, short) {
    try {
        const res = await fetch(`${url}i=${movie.imdbID}&plot=${short ? 'short' : 'full'}`);
        return res.json();
    }
    catch (error) {
        console.log("Error: ", error);
    }
}

/**
 * @description Prepares template depending on given movie object
 * @param {Object} movie movie Object
 */
function prepareTemplateFromMovie(movie) {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');
    const movieTemplate = `
          <img src="${movie.Poster == "N/A" ? 'css/noImage.png' : movie.Poster}" data-movie-id=${movie.imdbID}/>
          <div class='info'>
            <h2>${movie.Title}</h2>
            <p>${movie.Plot =="N/A" ? 'No description found' : movie.Plot}</p>
          </div>`;
    movieElement.innerHTML = movieTemplate;
    return movieElement;
}

/**
 * @description Main function triggered after Search button click
 */
buttonElement.addEventListener('click', async (event) => {
    try{
    event.preventDefault();
    searchedMovie.innerHTML = "";
    // #1 get movies
    const movies = await getMovieListBySearch(`${url}s=${inputElement.value || ''}`);

        if(movies.Search.length > 0){ 
               // #2 append plots to them
        movies.Search.map(async movie => {
            const details = await getPlotByMovie(movie, true);
            // #3 prepare template and append it to searchedMovie Element
            searchedMovie.appendChild(prepareTemplateFromMovie(details));
            inputElement.value = "";
        })
        
            
        }else{
            console.log('Brak wyników');
          }
          
        }
        
        catch(error){
        console.log(error);
    }
});
