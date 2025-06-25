export interface SnackPrice {
    amount: string | number;
    currency: string;
  }
  
  export interface Snack {
    id: string;
    name: string;
    image: string;
    description: string;
    price: SnackPrice | number;
    country: string;
    flag: string;
    tags?: string[];
    category?: string;
    handle?: string;
  }
  
  export interface SelectedItem {
    id: string;
    quantity: number;
  }