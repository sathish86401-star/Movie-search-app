const movieInput = document.getElementById("movieInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const movieList = document.getElementById("movieList");

searchButton.addEventListener("click", searchMovies);

movieInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

async function searchMovies() {
  const movieName = movieInput.value.trim();

  if (movieName === "") {
    message.textContent = "Please enter a movie name.";
    movieList.innerHTML = "";
    return;
  }

  message.textContent = "Searching movies...";
  movieList.innerHTML = "";

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(movieName)}&media=movie&limit=12`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.resultCount === 0) {
      message.textContent = "No movies found. Try another name.";
      return;
    }

    message.textContent = `${data.resultCount} movie(s) found.`;

    data.results.forEach((movie) => {
      const card = document.createElement("article");
      card.className = "movie-card";

      const poster = movie.artworkUrl100.replace("100x100", "600x600");

      card.innerHTML = `
        <img src="${poster}" alt="${movie.trackName}">
        <div class="movie-info">
          <h2>${movie.trackName}</h2>
          <p>Year: ${movie.releaseDate ? movie.releaseDate.slice(0, 4) : "Not available"}</p>
          <p>Genre: ${movie.primaryGenreName || "Not available"}</p>
          <a href="${movie.trackViewUrl}" target="_blank">View Movie</a>
        </div>
      `;

      movieList.appendChild(card);
    });
  } catch {
    message.textContent = "Unable to load movies. Check your internet connection.";
  }
}