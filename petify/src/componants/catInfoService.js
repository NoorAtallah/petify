const CAT_API_KEY = 'live_kDhIW5LFBjujGVPbgj6kQgFGSIj9ZS2lqKWp9m8n7rQ4ZbfO9GWj08D9WOOdNyrZ';
const DOG_API_KEY = 'live_B6NrZIQ5W25u7bjcvxBY7woJMpzBpVepneYRhbWsf3dKUUN5blmr0TFMD3Ld78HZ';

export const fetchCatBreeds = async () => {
  const response = await fetch('https://api.thecatapi.com/v1/breeds', {
    headers: {
      'x-api-key': CAT_API_KEY,
    },
  });
  const data = await response.json();
  return data;
};

export const fetchDogBreeds = async () => {
  const response = await fetch('https://api.thedogapi.com/v1/breeds', {
    headers: {
      'x-api-key': DOG_API_KEY,
    },
  });
  const data = await response.json();
  return data;
};