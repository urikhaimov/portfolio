const API = {
  businesses: {
    store: 'businesses',
    get: 'businesses/:businessId',
    workingHours: 'businesses/:businessId/business-hours',
    addresses: 'businesses/:businessId/addresses',
    services: 'businesses/:businessId/products',
  },
  addresses: {
    rules: 'addresses/rules',
  },
};

module.exports = { API };

