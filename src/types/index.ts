export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    categories: string[];
  }
  
  export interface Category {
    _id: string;
    name: string;
  }