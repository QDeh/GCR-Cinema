let currentPage = 1
const pagesCount = 500
let API_KEY;

function renderPagination(current, total) {

    const container = document.querySelector('#pagination')
    container.innerHTML = ''

    // add the prev button only when the displayed page isn't 1
    if (currentPage != 1) { 
        const prevBtn = document.createElement('button')
        prevBtn.textContent = "<<"
        container.appendChild(prevBtn)
        prevBtn.addEventListener("click", (event) => {
            currentPage--
            window.scrollTo(0, 0)
            renderMovies()
            renderPagination(currentPage, total)
        })
    }

    let pages = [1]

    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)

    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    if (end < total - 1) pages.push('...')
    if (total > 1) pages.push(total)

    for (let page of pages) {
        const btn = document.createElement('button')
        btn.textContent = page
        btn.className = (page === current) ? 'active' : ''

        if (page === "...") {
            btn.disabled = true
            btn.classList.add('dots')
        }
        else if (page != current) {
            btn.classList.add('pagination-number')
            btn.addEventListener("click", (event) => {
                currentPage = page
                window.scrollTo(0, 0)
                renderMovies()
                renderPagination(page, total)
            })
        }
        container.appendChild(btn)
    }
    // add the next button only when the displayed page isn't the maxium number
    if (currentPage != pagesCount) {
        const nextBtn = document.createElement('button')
        nextBtn.textContent = ">>"
        container.appendChild(nextBtn)
        nextBtn.addEventListener("click", (event) => {
            currentPage++
            window.scrollTo(0, 0)
            renderMovies()
            renderPagination(currentPage, total)
        })
    }
}

fetch('/.env')
    .then(response => response.text())
    .then(response => response.split('=').pop())
    .then((result) => {
        API_KEY = result
        main()
    })


async function getMovieByPage(page) {
    const url = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=primary_release_date.desc`)
    return await url.json()
}

async function getDetails(movie_id) {
    const url = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_KEY}`)
    return await url.json()
}

async function main() {
    renderPagination(currentPage, pagesCount)
    renderMovies()
}

async function renderMovies() {
    getMovieByPage(currentPage).then(async (pageResult) => {
        const movieSection = document.querySelector('#movies')
        movieSection.innerHTML = ''

        for (let movie of pageResult.results) {
            // create the movie card
            const movieArticle = document.createElement("article")
            movieArticle.className = "movie-card"
            // display the movie title
            const movieName = document.createElement("h2")
            movieName.textContent = `Movie : ${movie.original_title}`
            // display the poster
            const image = movie.poster_path
            const moviePoster = document.createElement("img")
            moviePoster.className = "movie-poster"
            moviePoster.src = `https://image.tmdb.org/t/p/w500${image}`
            // display the release date
            const movieReleaseDate = document.createElement("p")
            movieReleaseDate.className = "movie-release-date"
            movieReleaseDate.textContent = `Release Date : ${movie.release_date}`

            const details = await getDetails(movie.id)
            // display the movie duration
            const movieRuntime = document.createElement("p")
            movieRuntime.className = "movie-runtime"
            movieRuntime.textContent = `Duration : ${details.runtime} minutes`
            // insert the elements
            movieArticle.appendChild(movieName)
            movieArticle.appendChild(moviePoster)
            movieArticle.appendChild(movieReleaseDate)
            movieArticle.appendChild(movieRuntime)
            // display the "Genre :"
            const genreTitle = document.createElement("h3")
            genreTitle.className = "genre-title"
            genreTitle.textContent = `Genre :`
            movieArticle.appendChild(genreTitle)

            // display all the genres of the movie
            for (let genre of details.genres) {

                const movieGenre = document.createElement("p")
                movieGenre.className = "movie-genre"
                movieGenre.textContent = genre.name
                movieArticle.appendChild(movieGenre)
            }
            // insert the card in the page
            movieSection.appendChild(movieArticle)

            // makes the click on the card possible
            movieArticle.addEventListener("click", (event) => {
                const existingDialog = document.querySelector("dialog")
                // check if a dialog element exists and removes it
                if (existingDialog) {
                    existingDialog.remove()
                }
                //create the bialog element
                const movieDetails = document.createElement("dialog")
                movieSection.appendChild(movieDetails)

                const dialogForm = document.createElement("form")
                dialogForm.method = "dialog"

                const closeBtn = document.createElement("button")
                closeBtn.textContent = "Close"

                dialogForm.appendChild(closeBtn)
                movieDetails.appendChild(dialogForm)
                // display further info about the movie in the dialog
                const movieName = document.createElement("h2")
                movieName.textContent = `Movie : ${movie.original_title}`

                const moviePoster = document.createElement("img")
                moviePoster.className = "detailed-poster"
                moviePoster.src = `https://image.tmdb.org/t/p/w500${image}`

                const movieOverview = document.createElement("p")
                movieOverview.className = "movie-overview"
                movieOverview.textContent = `Overview : ${movie.overview}`

                const movieReleaseDate = document.createElement("p")
                movieReleaseDate.className = "movie-release-date"
                movieReleaseDate.textContent = `Release Date : ${movie.release_date}`

                const movieRuntime = document.createElement("p")
                movieRuntime.className = "movie-runtime"
                movieRuntime.textContent = `Duration : ${details.runtime} minutes`

                const genreTitle = document.createElement("h3")
                genreTitle.className = "genre-title"
                genreTitle.textContent = `Genre :`

                movieDetails.appendChild(movieName)
                movieDetails.appendChild(moviePoster)
                movieDetails.appendChild(movieOverview)
                movieDetails.appendChild(movieReleaseDate)
                movieDetails.appendChild(movieRuntime)
                movieDetails.appendChild(genreTitle)

                for (let genre of details.genres) {

                    const movieGenre = document.createElement("p")
                    movieGenre.className = "movie-genre"
                    movieGenre.textContent = genre.name
                    movieDetails.appendChild(movieGenre)
                }

                const voteAverage = document.createElement("p")
                voteAverage.className = "vote-average"
                voteAverage.textContent = `Average grade : ${details.vote_average}/10`

                const voteCount = document.createElement("p")
                voteCount.className = "vote-count"
                voteCount.textContent = `Vote count : ${details.vote_count}`

                movieDetails.appendChild(voteAverage)
                movieDetails.appendChild(voteCount)

                const producers = document.createElement("section")

                const producer = document.createElement("h3")
                producer.textContent = `Producers :`

                producers.appendChild(producer)

                for (let company of details.production_companies) {

                    const logo = company.logo_path
                    const companyLogo = document.createElement("img")
                    companyLogo.className = "company-logo"
                    companyLogo.src = `https://image.tmdb.org/t/p/w500${logo}`
                    producers.appendChild(companyLogo)
                }

                movieDetails.appendChild(producers)
                movieDetails.showModal()
            })
        }
    })
}