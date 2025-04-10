const FAKE_LOCATION = [
  {
    coords: {
      latitube: 0.78,
      longitube: 31.33,
    },
  },
  {
    coords: {
      latitube: -27.6,
      longitube: 15.55,
    },
  },
  {
    coords: {
      latitube: -33.87,
      longitube: 158.13,
    },
  },
];

export const getFakeLocation = () => {
  return FAKE_LOCATION[Math.floor(Math.random() * FAKE_LOCATION.length)];
};
