// here we uppercase the API_KEY to signal it’s something that
// doesn’t change
const API_KEY = 'eXNx6PeCIoXPUM1qctLRviraOlPn9gqL';
// here we grab our search input
const searchEl = document.querySelector('.search-input');
// here we grab our search hint
const hintEl = document.querySelector('.search-hint');
// here we grab our videos element and then append our newly created video to it
const videosEl = document.querySelector('.videos');
// this is for our clear search button
const clearEl = document.querySelector('.search-clear');

function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

function createVideo(src) {
  const video = document.createElement('video');

  video.src = src;
  video.autoplay = true;
  video.loop = true;
  video.className = 'video';

  console.log(video);
  return video;
}

const toggleLoading = state => {
  //   console.log('we are loading', state)
  // in here we toggle the page loading state between loading and not loading
  // if our state is true, we add a loading class to our body
  if (state) {
    document.body.classList.add('loading');
    // here we disable the input so users can’t interfere with it
    // whilst it’s searching
    searchEl.disabled = true;
  } else {
    // otherwise we remove our loading class
    document.body.classList.remove('loading');
    // here we enable the input again
    searchEl.disabled = false;
    searchEl.focus();
  }
};

const searchGif = searchTerm => {
  toggleLoading(true);
  console.log(searchTerm);
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=pg-13&lang=en&bundle=messaging_non_clips`
  )
    .then(response => {
      // Convert to JSON
      return response.json();
    })
    .then(json => {
      const gif = randomChoice(json.data);
      const src = gif.images.original.mp4;
      console.log(src);

      const video = createVideo(src);

      videosEl.appendChild(video);
      video.addEventListener('loadeddata', event => {
        video.classList.add('visible');
        toggleLoading(false);
        document.body.classList.add('has-results');
        hintEl.innerHTML = `Hit enter to search another ${searchTerm}`;
      });
    })
    .catch(error => {
      toggleLoading(false);
      hintEl.innerHTML = `No result for ${searchTerm}`;
      searchEl.value = '';
    });
};

const doSearch = event => {
  const searchTerm = searchEl.value;

  if (searchTerm.length > 2) {
    document.body.classList.add('show-hint');
    hintEl.innerHTML = `Hit enter to search ${searchTerm}`;
  } else {
    document.body.classList.remove('show-hint');
  }

  if (event.key === 'Enter' && searchTerm.length > 2) {
    searchGif(searchTerm);
  }
};

const clearSearch = () => {
  document.body.classList.remove('has-results');
  videosEl.innerHTML = '';
  hintEl.innerHTML = '';
  searchEl.value = '';
  searchEl.focus();
};

// here we listen out for keyup events globally across the whole page
// we use the document keyword and attach the addEventListener to it
document.addEventListener('keyup', event => {
  // if we press the escape key, fire the clearSearch function
  if (event.key === 'Escape') {
    clearSearch();
  }
});

searchEl.addEventListener('keyup', doSearch);
clearEl.addEventListener('click', clearSearch);
