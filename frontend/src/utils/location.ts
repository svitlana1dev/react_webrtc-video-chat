export const calculateDistanceBetweenCoords = (coord1: any, coord2: any) => {
  return getDistanceFromLatLonInKm(
    coord1.lat,
    coord1.lng,
    coord2.lat,
    coord2.lng
  );
};

function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return roundToTwoDecimals(d);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

const roundToTwoDecimals = (num: any) => {
  return +(Math.round(num + "e+2") + "e-2");
};
