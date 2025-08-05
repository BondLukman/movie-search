const inputKeyword = document.querySelector(".input-keyword");
const searchButton = document.querySelector(".search-button");
const movieContainer = document.querySelector(".movie-container");
const errorContainer = document.querySelector(".error-container");

inputKeyword.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();

    try {
      const movies = await getMovieResults(inputKeyword.value);
      updateUI(movies);
    } catch (err) {
      movieContainer.innerHTML = "";
      updateError(err);
    }
  }
});

searchButton.addEventListener("click", async function () {
  try {
    const movies = await getMovieResults(inputKeyword.value);
    updateUI(movies);
  } catch (err) {
    movieContainer.innerHTML = "";
    updateError(err);
  }
});

function getMovieResults(keyword) {
  return fetch("https://www.omdbapi.com/?apikey=1b7b6a96&s=" + keyword)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

// Show Details button with event bindings
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    e.preventDefault();
    const imdbid = e.target.dataset.imdbid;
    const movieDetail = await getMovieDetails(imdbid);
    updateDetails(movieDetail);
  }
});

function getMovieDetails(imdbid) {
  return fetch("https://www.omdbapi.com/?apikey=1b7b6a96&i=" + imdbid)
    .then((response) => response.json())
    .then((m) => m);
}

function updateDetails(m) {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector(".modal-body");
  modalBody.innerHTML = movieDetail;
  const modal = new bootstrap.Modal(
    document.getElementById("movieDetailModal")
  );
  modal.show();
}

function updateUI(movies) {
  errorContainer.innerHTML = "";
  let cards = "";
  movies.forEach((m) => (cards += showCards(m)));

  movieContainer.innerHTML = cards;
}

function updateError(err) {
  errorContainer.innerHTML = showError(err);
}

function showCards(m) {
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-4">
        <div class="card" style="width: 18rem">
          <img src="${m.Poster}" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">${m.Title}</h5>
            <h6 class="card-subtitle mb-2 text-body-secondary">${m.Year}</h6>
            <a href="#" class="btn btn-primary modal-detail-button" data-imdbid="${m.imdbID}">Show Details</a>
          </div>
        </div>
    </div>
        `;
}

function showMovieDetail(m) {
  return `
    <div class="container-fluid">
              <div class="row">
                <div class="col-md-3">
                  <img src="${m.Poster}" class="img-fluid" />
                </div>
                <div class="col-md">
                  <ul class="list-group">
                    <li class="list-group-item"><h4>${m.Title} ${m.Year}</h4></li>
                    <li class="list-group-item">
                      <strong>Director :</strong> ${m.Director}
                    </li>
                    <li class="list-group-item">
                      <strong>Actors :</strong> ${m.Actors}
                    </li>
                    <li class="list-group-item">
                      <strong>Writer :</strong> ${m.Writer}
                    </li>
                    <li class="list-group-item">
                      <strong>Plot :</strong> ${m.Plot}
                    </li>
                  </ul>
                </div>
              </div>
            </div>`;
}

function showError(err) {
  return `
   <div class="col-12 col-md-8">
      <div class="card border-danger text-center shadow" style='border-width: 20px;'>
        <div class="card-body">
        <h1
          id="error-message"
          class="text-danger"
          style="font-size: 10rem; font-weight: bold"
        >
          EUWEUH !!
        </h1>
        <p class="card-text text-muted" style='font-size: 1.5rem; font-weight: bold'>${
          err.message || err
        }</p>
      </div>
    </div>
  </div>
  `;
}
