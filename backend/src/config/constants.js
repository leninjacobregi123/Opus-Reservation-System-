module.exports = {
  // User roles
  ROLES: {
    CUSTOMER: 'customer',
    RESTAURANT_OWNER: 'restaurant_owner',
    ADMIN: 'admin',
  },

  // Booking status
  BOOKING_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
  },

  // Payment status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },

  // Table location types
  LOCATION_TYPES: {
    WINDOW: 'window',
    BALCONY: 'balcony',
    INDOOR: 'indoor',
    OUTDOOR: 'outdoor',
    PRIVATE: 'private',
    ROOFTOP: 'rooftop',
  },

  // Menu categories
  MENU_CATEGORIES: {
    STARTER: 'starter',
    MAIN_COURSE: 'main_course',
    DESSERT: 'dessert',
    BEVERAGE: 'beverage',
    APPETIZER: 'appetizer',
  },

  // Special occasions
  SPECIAL_OCCASIONS: {
    BIRTHDAY: 'birthday',
    ANNIVERSARY: 'anniversary',
    PROPOSAL: 'proposal',
    BUSINESS: 'business',
    CASUAL: 'casual',
    DATE: 'date',
  },

  // Request types
  REQUEST_TYPES: {
    CAKE: 'cake',
    FLOWERS: 'flowers',
    DECORATIONS: 'decorations',
    CUSTOM_MESSAGE: 'custom_message',
    SPECIAL_DIET: 'special_diet',
  },

  // Price ranges
  PRICE_RANGES: {
    BUDGET: '$',
    MODERATE: '$$',
    EXPENSIVE: '$$$',
    LUXURY: '$$$$',
  },

  // Cuisine types
  CUISINE_TYPES: [
    'Italian',
    'Chinese',
    'Indian',
    'Mexican',
    'Japanese',
    'Thai',
    'French',
    'Mediterranean',
    'American',
    'Korean',
    'Vietnamese',
    'Multi-Cuisine',
  ],
};
