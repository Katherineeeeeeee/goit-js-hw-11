import Notiflix from 'notiflix';
import axios from 'axios';

import { Api } from './api';
import creatCards from '../templates/card.hbs';

const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const Pixabay = new Api();

const onSearchFormSubmit = event => {
  event.preventDefault();

  Pixabay.query = event.currentTarget.elements.searchQuery.value;
  Pixabay.page = 1;

  Pixabay.fetchPhotosByQuery()
    .then(response => {
      console.log(response.data);

      if (response.data.total === 0) { 
        galleryEl.innerHTML = '';
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
       
        return;
      }

      Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)
      galleryEl.innerHTML = creatCards(response.data.hits);

      loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(error => {
        Notiflix.Notify.failure(error);
    });
};

const onLoadMoreBtnClick = event => {
  Pixabay.page += 1;

  Pixabay.fetchPhotosByQuery()
    .then(response => {
      if (response.data.hits.length === 0) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.failure("Were sorry, but you've reached the end of search results.");
      }

      galleryEl.insertAdjacentHTML('beforeend', creatCards(response.data.hits));
    })
    .catch(error => {
      console.log(error);
    });
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
