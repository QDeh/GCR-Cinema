let page = 1
let API_KEY;

fetch('/.env')
    .then(response => response.text())
    .then(response => response.split('=').pop())
    .then((result) => {
        API_KEY = result
        main()
    })


async function getMovieByPage(page) {
    const url = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort=primary_release_date.asc`)
    return await url.json()
}

async function getDetails(movie_id) {
    const url = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_KEY}`)
    return await url.json()
}


async function main() {
    getMovieByPage(page).then(async (pageResult) => {
        const section = document.querySelector('main')
        for (let movie of pageResult.results) {

            const movieArticle = document.createElement("article")
            movieArticle.className = "movie-article"

            const movieName = document.createElement("h2")
            movieName.textContent = `Movie : ${movie.original_title}`

            const movieReleaseDate = document.createElement("p")
            movieReleaseDate.className = "movie-release-date"
            movieReleaseDate.textContent = `Release Date : ${movie.release_date}`

            const image = movie.poster_path
            const moviePoster = document.createElement("img")
            moviePoster.className = "movie-poster"
            moviePoster.src = `https://image.tmdb.org/t/p/w500${image}`

            const details = await getDetails(movie.id)

            const movieRuntime = document.createElement("p")
            movieRuntime.className = "movie-runtime"
            movieRuntime.textContent = `Duration : ${details.runtime} minutes`

            movieArticle.appendChild(movieName)
            movieArticle.appendChild(moviePoster)
            movieArticle.appendChild(movieReleaseDate)
            movieArticle.appendChild(movieRuntime)

            const genreTitle = document.createElement("h3")
            genreTitle.className = "genre-title"
            genreTitle.textContent = `Genre :`
            movieArticle.appendChild(genreTitle)

            for (let genre of details.genres) {

                const movieGenre = document.createElement("p")
                movieGenre.className = "movie-genre"
                movieGenre.textContent = genre.name
                movieArticle.appendChild(movieGenre)
            }
            section.appendChild(movieArticle)
        }
    })

}



