import * as reactGeocode from 'react-geocode';

import { stub } from '@/utils/function';

const showOnMap = (e, setAddress = stub) => {
  e.preventDefault();
  e.stopPropagation();

  reactGeocode.setDefaults({
    key: MAP_KEY,
    language: 'en'
  });

  reactGeocode.geocode(
      reactGeocode.RequestType.ADDRESS,
      'Eiffel Tower'
  ).then(({ results }) => {

    const { lat, lng } = results[0].geometry.location;
    setAddress({
      address: {
        coordinate: {
          latitude: lat,
          longitude: lng
        }
      }
    });

  }).catch(console.error);
};