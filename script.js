const API_KEY = "e14c2c3ba16e81f4940b540dd0ec3573";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// ─── 1. Busca filmes na API ───────────────────────────────────────────────────
async function fetchMovies(query = "") {
  let url;

  if (query.trim() !== "") {
    url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`;
  } else {
    url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar filmes: " + response.status);
  }

  const data = await response.json();
  return data.results;
}

// ─── 2. Cria card de um filme ─────────────────────────────────────────────────
function createMovieCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");

  const poster = movie.poster_path
    ? `${IMG_URL}${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=Sem+Imagem";

  const year = movie.release_date
    ? movie.release_date.substring(0, 4)
    : "—";

  const rating = movie.vote_average
    ? movie.vote_average.toFixed(1)
    : "—";

  const overview = movie.overview
    ? movie.overview.length > 120
      ? movie.overview.substring(0, 120) + "..."
      : movie.overview
    : "Sem descrição disponível.";

  const ratingClass = movie.vote_average >= 7
    ? "rating-high"
    : movie.vote_average >= 5
      ? "rating-mid"
      : "rating-low";

  card.innerHTML = `
    <div class="card-poster">
      <img src="${poster}" alt="${movie.title}" loading="lazy" />
      <span class="rating-badge ${ratingClass}">⭐ ${rating}</span>
    </div>
    <div class="card-info">
      <h3 class="movie-title">${movie.title}</h3>
      <span class="movie-year">${year}</span>
      <p class="movie-overview">${overview}</p>
    </div>
  `;

  return card;
}

// ─── 3. Renderiza filmes no DOM ───────────────────────────────────────────────
function renderMovies(movies) {
  const container = document.getElementById("movie-list");
  container.innerHTML = "";

  if (!movies || movies.length === 0) {
    showMessage("Nenhum filme encontrado. Tente outra busca.");
    return;
  }

  showMessage("");
  movies.forEach(movie => {
    const card = createMovieCard(movie);
    container.appendChild(card);
  });
}

// ─── 4. Mostra mensagem de status ─────────────────────────────────────────────
function showMessage(text) {
  const msg = document.getElementById("message");
  msg.textContent = text;
}

// ─── 5. Inicializa a página ───────────────────────────────────────────────────
async function init() {
  showMessage("Carregando filmes...");
  try {
    const movies = await fetchMovies();
    renderMovies(movies);
  } catch (error) {
    showMessage("Erro ao carregar filmes. Tente novamente.");
    console.error(error);
  }
}

// ─── Eventos ──────────────────────────────────────────────────────────────────
document.getElementById("btnSearch").addEventListener("click", async () => {
  const query = document.getElementById("search").value;
  showMessage("Buscando...");
  try {
    const movies = await fetchMovies(query);
    renderMovies(movies);
  } catch (error) {
    showMessage("Erro na busca. Tente novamente.");
    console.error(error);
  }
});

document.getElementById("search").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("btnSearch").click();
  }
});

// Inicia ao carregar a página
init();