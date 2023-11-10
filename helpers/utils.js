exports.getBiggerResolutionImage = (imageString) => {
  const arr = imageString.split("/");

  const firstNumber = arr[arr.length - 2];

  const lastNumberExtracting = arr[arr.length - 1];
  const arr2 = lastNumberExtracting.split(".");

  const lastNumber = arr2[0];

  return (
    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/" +
    firstNumber +
    "/" +
    lastNumber +
    ".jpg"
  );
};
