export const LOCAL_IMAGES = {
  hero: "/assets/images/hero_main.jpg",
  corporate: "/assets/images/venue_corporate.jpg",
  wedding: "/assets/images/venue_wedding.jpg",
  private: "/assets/images/venue_private.jpg",
  rooftop: "/assets/images/venue_rooftop.jpg",
  food: "/assets/images/food_1.jpg",
  beverage: "/assets/images/beverage_1.jpg",
  blueprint_axis: "/assets/images/blueprint_axis.jpg",
  blueprint_perimeter: "/assets/images/blueprint_perimeter.jpg",
  blueprint_constellation: "/assets/images/blueprint_constellation.jpg",
  event_corporate: "/assets/images/event_corporate.jpg",
  event_romance: "/assets/images/event_romance.jpg",
  event_wedding: "/assets/images/event_wedding.jpg",
  event_private: "/assets/images/event_private.jpg"
};

export const EVENT_TYPES = [
  { id: 'corporate', label: 'Corporate Gala', icon: 'Briefcase', img: LOCAL_IMAGES.event_corporate },
  { id: 'romance', label: 'Intimate Anniversary', icon: 'Heart', img: LOCAL_IMAGES.event_romance },
  { id: 'wedding', label: 'Wedding Reception', icon: 'PartyPopper', img: LOCAL_IMAGES.event_wedding },
  { id: 'private', label: 'Private Reserve', icon: 'Shield', img: LOCAL_IMAGES.event_private }
];

export const BLUEPRINTS = [
  { id: 'B1', name: 'The Imperial Axis', cap: '10-50 Guests', desc: 'A grand central table alignment maximizing conversational flow.', image: LOCAL_IMAGES.blueprint_axis },
  { id: 'B2', name: 'Secluded Perimeter', cap: '2-12 Guests', desc: 'Discreet alcove arrangements prioritizing acoustic privacy.', image: LOCAL_IMAGES.blueprint_perimeter },
  { id: 'B3', name: 'Gala Constellation', cap: '50+ Guests', desc: 'Distributed cluster seating fostering a dynamic, roaming networking environment.', image: LOCAL_IMAGES.blueprint_constellation }
];
