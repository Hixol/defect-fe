export const BASE_URL = process.env.API_URL;
//export const SUPPLIER_ID = 8;
//export const USER_ID = 7;

export const getStockCount = (inventoryCount) => {
  switch (String(inventoryCount)) {
    case '0':
      return 'Out of Stock';
    case '1':
      return 'Available';
    case '2':
      return 'Indent';
    default:
      return '';
  }
};

export const getUnitMeasurement = (unitMeasurement) => {
  switch (String(unitMeasurement)) {
    case '0':
      return 'Bottle';
    case '1':
      return 'Box';
    case '2':
      return 'Packet';
    case '3':
      return 'Piece';
    case '4':
      return 'Sachet';
    case '5':
      return 'Ampoule';
    case '6':
      return 'Vial';
    case '7':
      return 'Bag';
    case '8':
      return 'Tube';
    case '9':
      return 'Unit';
    case '10':
      return 'Set';
    case '11':
      return 'Strip';
    case '12':
      return 'Jar';
    case '13':
      return 'Tub';
    case '14':
      return 'Carton';
    case '15':
      return 'Can';
    case '16':
      return 'Cannister';
    case '17':
      return 'Case';
    case '18':
      return 'Container';
    case '19':
      return 'Each';
    case '20':
      return 'Roll';
    case '99':
      return 'Invalid';
    default:
      return '';
  }
};

export const getProductStatus = (status) => {
  switch (String(status)) {
    case '1':
      return 'Active';
    case '2':
      return 'Pending';
    case '3':
      return 'Rejected';
    case '4':
      return 'Closed';
    default:
      return '';
  }
};

export const getOrderStatus = (status) => {
  switch (String(status)) {
    case '1':
      return 'Approved';
    case '2':
      return 'Pending';
    case '3':
      return 'Rejected';
    case '4':
      return 'Closed';
    case '5':
      return 'Partially Fulfilled';
    case '99':
      return 'Invalid';
    default:
      return '';
  }
};
