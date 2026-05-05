export interface User{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    createdAt?: string;
}

export interface LoginResponse{
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "STAFF";
    token: string;
}

export interface Category{
    id: string;
    name: string;
    createdAt: string;  
}

export interface Product{
    id: string;
    name: string;
    price: number;  
    description: string;
    category_id: string;
    createdAt: string;
    banner: string;
    disable: boolean;
    category?: Category;
}

export interface Item{
    id: string;
    amount: number;
    order_id: string;
    product_id: string;
    createdAt: string;
    product: Product;
}

export interface CreateOrderRequest{
    table: number;
    name?: string;
}

export interface AddItemRequest{
    order_id: string;
    product_id: string;
    amount: number;
}

export interface SendOrderRequest{
    order_id: string;
}

export interface Order{
    id: string;
    name?: string | null;
    status: boolean;
    table: number;
    draft: boolean;
    createdAt: string;
    items?: Item[];
}