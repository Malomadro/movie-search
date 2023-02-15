export let movieList = null
export let inputSearch = null
export let triggerMode = false

const createElement = ({
  type,
  attrs,
  container = null,
  position = 'append',
  evt,
  handler
}) => {
  const el = document.createElement(type)
  Object.keys(attrs).forEach((key) => {
    if (key !== 'innerHTML') el.setAttribute(key, attrs[key])
    else el.innerHTML = attrs[key];
  });

  if (container && position === 'append') container.append(el)
  if (container && position === 'prepend') container.prepend(el)
  if (evt && handler && typeof handler === 'function') el.addEventListener(evt, handler)
  return el;
}

export const createStyle = () => {

  createElement({
    type: 'style',
    attrs: {
      innerHTML: `
      * {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    h1 {
      text-align: center;
      z-index: 10;
      position: relative;
    }
    
    body {
      
      margin: 0;
      background-color: rgb(59, 56, 56);
      overflow-y: scroll;
    }
    
    .container {
      padding: 0 20px;
      max-width: 1340px;
      margin: 0 auto;
      border: 1px solid black;
      box-shadow: 0 0 20px white;
    }
    
    .movies {
      display: grid;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    
    .movie {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
    
    .movie__image {
      width: 100%;
      -o-object-fit: cover;
      object-fit: cover;
    }
    
    .search {
      margin-bottom: 30px;
      display: grid;
    }
    
    .search__label-input {
      color: #df5e14;
      display: block;
      margin-bottom: 15px;
      transform: translate(-20px, 3px);
      font-size: 24px;
      font-weight: 700;
    }
    
    .search__input {
      background-color: lightgray;
      max-width: 400px;
      width: 100%;
      padding: 10px 15px;
      margin-bottom: 10px;
      border: 3px solid black;
      border-radius: 4px;
    }
    
    .search__label-checkbox {
      transform: translate(7px, -2px);
    }
    
    .search__group-checkbox {
      display: flex;
    }
    
    .search__group {
      display: flex;
      justify-content: end;
      margin-top: 30px;
      margin-right: 50px;
    }
      `
    },
    container: document.head
  })
}

export const createMarkup = () => {

  const container = createElement({
    type: 'div',
    attrs: { class: 'container' },
    container: document.body,
    position: 'prepend'
  })

  createElement({
    type: 'h1',
    attrs: { innerHTML: 'Приложение для поиска фильмов' },
    container
  })

  const searchBox = createElement({
    type: 'div',
    attrs: { class: 'search' },
    container
  })

  const inputBox = createElement({
    type: 'div',
    attrs: { class: 'search__group search__group--input' },
    container: searchBox
  })

  const checkBox = createElement({
    type: 'div',
    attrs: { class: 'search__group search__group--checkbox' },
    container: searchBox
  })

  createElement({
    type: 'label',
    attrs: {
      class: 'search__label-input',
      for: 'search',
      innerHTML: 'Поиск фильмов:'
    },
    container: inputBox
  })

  inputSearch = createElement({
    type: 'input',
    attrs: {
      class: 'search__input',
      id: 'search',
      type: 'search',
      placeholder: 'Начините вводить текст...'
    },
    container: inputBox
  })
  
  createElement({
    type: 'input',
    attrs: {
      class: 'search__checkbox',
      id: 'checkbox',
      type: 'checkbox'
    },
    container: checkBox,
    evt: 'click',
    handler: () => triggerMode = !triggerMode
  })

  createElement({
    type: 'label',
    attrs: {
      class: 'search__label-checkbox',
      for: 'checkbox',
      innerHTML: 'Добавлять фильмы к существующим спискам '
    },
    container: checkBox
  })

  const movies = createElement({
    type: 'div',
    attrs: { class: 'movies' },
    container
  })
  movieList = document.querySelector('.movies')
}

export const addMovieToList = (movie) => {
  const item = createElement({
    type: 'div',
    attrs: { class: 'movie' },
    container: movieList
  })

  createElement({
    type: 'img',
    attrs: {
      class: 'movie__image',
      src: /(http|https):\/\//i.test(movie.Poster) ? movie.Poster : 'assets/image/favicon.png',
      alt: movie.Title,
      title: movie.Title
    },
    container: item
  },
  )
};

export const clearMoviesMarkup = (el) => {
  el && (el.innerHTML = '')
}