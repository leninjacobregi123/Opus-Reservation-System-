export const getRestaurantImage = (id) => {
  const images = [
    "/assets/images/venue_lively.jpg",
    "/assets/images/hero_main.jpg",
    "/assets/images/venue_corporate.jpg",
    "/assets/images/venue_wedding.jpg",
    "/assets/images/venue_private.jpg",
    "/assets/images/venue_rooftop.jpg"
  ];
  return images[id % images.length];
};
