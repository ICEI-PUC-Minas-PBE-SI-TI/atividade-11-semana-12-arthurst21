const API_KEY = "c744457c4232c060d64a0e8584b47187";
const movieList = document.getElementById("movie-list");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function showSkeletons(n=12){
    movieList.innerHTML=Array.from({length:n},()=>`<div class="skeleton"><div class="skeleton-poster"></div><div class="skeleton-info"><div class="skeleton-line"></div><div class="skeleton-line short"></div></div></div>`).join("");
}

async function fetchMovies(query=""){
    showSkeletons();
    showMessage("Carregando filmes...");
    try{
        const url=query
            ?`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}`
            :`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
        const res=await fetch(url);
        if(!res.ok)throw new Error();
        return(await res.json()).results;
    }catch{
        showMessage("Erro ao carregar filmes.",true);
        return[];
    }
}

function createMovieCard(m){
    const card=document.createElement("div");
    card.classList.add("movie-card");
    card.innerHTML=`
        <div class="poster-wrap">
            <img src="${m.poster_path?`${IMAGE_URL}${m.poster_path}`:"https://via.placeholder.com/500x750/111/7A7068?text=Sem+Imagem"}" alt="${m.title}" loading="lazy">
            <div class="rating-badge">★ ${m.vote_average?m.vote_average.toFixed(1):"—"}</div>
            <div class="movie-overlay"><p class="overlay-text">${m.overview||"Sem descrição."}</p></div>
        </div>
        <div class="movie-info">
            <h3 title="${m.title}">${m.title}</h3>
            <span class="movie-year">${m.release_date?m.release_date.slice(0,4):"—"}</span>
        </div>`;
    return card;
}

function renderMovies(movies){
    movieList.innerHTML="";
    if(!movies.length){showMessage("Nenhum filme encontrado.");return;}
    showMessage("");
    movies.forEach(m=>movieList.appendChild(createMovieCard(m)));
}

function showMessage(text,error=false){
    message.textContent=text;
    message.classList.toggle("error",error);
}

async function handleSearch(){
    renderMovies(await fetchMovies(searchInput.value.trim()));
}

document.getElementById("btnSearch").addEventListener("click",handleSearch);
searchInput.addEventListener("keypress",e=>e.key==="Enter"&&handleSearch());
fetchMovies().then(renderMovies);
