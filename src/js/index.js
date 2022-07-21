import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { Api } from './api';
import creatCards from '../templates/card.hbs';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const Pixabay = new Api();

// підключення бібліотеки
const lightbox = new SimpleLightbox('.gallery div', {
  sourceAttr: 'data-url',
  captionsData: 'alt',
  captionDelay: 250,
});

const onSearchFormSubmit = async event => {
  event.preventDefault();

  Pixabay.query = event.currentTarget.elements.searchQuery.value;
  Pixabay.page = 1;

  try {
    const response = await Pixabay.fetchPhotosByQuery();

    if (response.data.total === 0) {
      event.target.elements.searchQuery.value = ' ';
      loadMoreBtn.classList.add('is-hidden');
      galleryEl.innerHTML = '';
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');

      return;
    }
    Pixabay.totalHits = response.data.totalHits;

    if (response.data.totalHits === 1) {
      galleryEl.innerHTML = creatCards(response.data.hits);
      loadMoreBtn.classList.remove('is-hidden');
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
    galleryEl.innerHTML = creatCards(response.data.hits);
    lightbox.refresh();

    loadMoreBtn.classList.remove('is-hidden');
  } catch (error) {
    Notiflix.Notify.failure(console.log(error));
  }

  //   плавне прокручування
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 2,
//     behavior: 'smooth',
//   });
};

const onLoadMoreBtnClick = async event => {
  if (!Pixabay.isNextDataExist()) {
    loadMoreBtn.classList.add('is-hidden');
    Notiflix.Notify.failure("Were sorry, but you've reached the end of search results.");
    return;
  }
  Pixabay.page += 1;

  try {
    const response = await Pixabay.fetchPhotosByQuery();

    if (response.data.hits.length === 0) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure("Were sorry, but you've reached the end of search results.");
    }

    galleryEl.insertAdjacentHTML('beforeend', creatCards(response.data.hits));
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }

  //   плавне прокручування
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

//? then/catch
// const onSearchFormSubmit = event => {
//     event.preventDefault();

//     Pixabay.query = event.currentTarget.elements.searchQuery.value;
//     Pixabay.page = 1;
//   Pixabay.fetchPhotosByQuery()
//     .then(response => {
//       console.log(response.data);

//       if (response.data.totalHits === 0) {
//         galleryEl.innerHTML = '';
//         loadMoreBtn.classList.add('is-hidden');
//         lightbox.refresh();

//         event.еarget.elements.searchQuery.value = ' ';
//         return;
//       }

//       Pixabay.totalHits = response.data.totalHits;

//   if (response.data.hits === []) {
//     galleryEl.innerHTML = creatCards(response.data.hits);
//     // loadMoreBtn.classList.add('is-hidden'); // коли одна - картинка кнопка є
//     return;
//   }

//       Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
//       galleryEl.innerHTML = creatCards(response.data.hits);

//       loadMoreBtn.classList.remove('is-hidden');
//     })
//     .catch(error => {
//       Notiflix.Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     });
// };

// const onLoadMoreBtnClick = event => {
//     if(!Pixabay.isNextDataExist()) {
//         loadMoreBtn.classList.add('is-hidden');
//         Notiflix.Notify.failure("Were sorry, but you've reached the end of search results.");
//         return;
//     }
//     Pixabay.page += 1;
//   Pixabay.fetchPhotosByQuery()

//     .then(response => {
//       if (response.data.hits.length === 0) {
//         loadMoreBtn.classList.add('is-hidden');
//         Notiflix.Notify.failure("Were sorry, but you've reached the end of search results.");
//       }

//       galleryEl.insertAdjacentHTML('beforeend', creatCards(response.data.hits));
//     //   lightbox.refresh();
//     })
//     .catch(error => {
//       console.log(error);
//     });
// };
