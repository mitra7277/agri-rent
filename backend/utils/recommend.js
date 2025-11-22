// utils/recommend.js
function recommendEquipment(list, userLocation, preferredType) {
  return list.filter((item) => {
    const locMatch =
      item.location?.toLowerCase() === userLocation?.toLowerCase();
    const typeMatch =
      item.type?.toLowerCase() === preferredType?.toLowerCase();

    return locMatch || typeMatch;
  });
}

module.exports = { recommendEquipment };
