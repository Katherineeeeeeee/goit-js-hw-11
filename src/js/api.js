'use strict';

import axios from 'axios';

export class Api {
  #URL = 'https://pixabay.com/api';
  #API_KEY = '28738379-3ebe6166d3971e346b98a5bc0';

  constructor() {
    this.page = 1;
    this.query = null;
  }

  fetchPhotosByQuery() {
    const searchParams = new URLSearchParams({
    page: this.page,
    per_page: 10, 

    key: this.#API_KEY,
    q: this.query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true
    })

    return axios.get(`${this.#URL}/?${searchParams}`);
}
}
