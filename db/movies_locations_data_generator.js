'use strict';

const fs = require('fs');

const movies_locations = [];

for (let i = 1; i < 299; i++) {
  movies_locations.push({
    movie_id: Math.floor(Math.random() * (275 - 1)) + 1,
    location_id: i
  });
}

for (let i = 1; i < 275; i++) {
  movies_locations.push({
    movie_id: i,
    location_id: Math.floor(Math.random() * (299 - 1)) + 1
  });
}

fs.writeFile('./seeds/data/movies_locations.json', JSON.stringify(movies_locations), 'utf8', (err) => {
  if (err) {
    throw err;
  }
});
