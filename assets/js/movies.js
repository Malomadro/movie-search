import { addMovieToList, createMarkup, createStyle, movieList, inputSearch, triggerMode, clearMoviesMarkup } from "./dom.js";

const getData = (url) => fetch(url)
  .then((res) => res.json())
  .then((data) => data.Search)


let searchLast = null

const debounce = (() => {

  let timer = null

  return (cb, ms) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(cb, ms)
  }
})()
const inputSearchHandler = (e) => {
  debounce(() => {
    const searchSrting = e.target.value.trim();

    if (searchSrting && searchSrting.length > 3 && searchLast !== searchSrting) {
      if(!triggerMode) clearMoviesMarkup(movieList)
      
      getData(`http://www.omdbapi.com/?apikey=303ac054&s=${searchSrting}`)
        .then((movies) => movies.forEach((movie => addMovieToList(movie))))
        .catch(console.log)
    }
    searchLast = searchSrting 
  }, 2000)
}

export const appInit = () => {
  createStyle()
  createMarkup()
  inputSearch.addEventListener('keyup', inputSearchHandler)
}