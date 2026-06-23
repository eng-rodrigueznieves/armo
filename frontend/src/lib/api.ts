export const API_BASE_URL = 
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api"

export type HealthResponse = {
    status: string;
    service: string;
};

export type EmployeeUser = {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
};

export type AuthResponse = {
    detail?: string;
    user: EmployeeUser;
};

export type ProductImage = {
    id: number;
    image_url: string | null;
    alt_text: string;
    is_primary: boolean;
};

export type ProductDimensions = {
    width: string;
    depth: string;
    height: string;
    unit: string;
};

export type Product = {
    id: number;
    name: string;
    sku: string;
    category: string
    description: string;
    price: string;
    inventory_quantity: number;
    width: string;
    depth: string;
    height: string;
    dimensions: ProductDimensions;
    material: string;
    color: string;
    recommended_space: string;
    recommended_space_label: string;
    recommended_style: string;
    recommended_style_label: string;
    is_active: boolean;
    primary_image: ProductImage | null;
    images: ProductImage[];
    created_at: string;
    updated_at: string;
};

export type ProductListResponse = {
    count: number;
    results: Product[];
};

export type ProductFilters = {
    query?: string;
    space?: string;
    style?: string;
};

function getCookie(name: string): string | null {
    const cookies = document.cookie ? document.cookie.split("; ") : [];

    for (const cookie of cookies) {
        const [cookieName, ...cookieValueParts] = cookie.split("=");

        if (cookieName == name) {
            return decodeURIComponent(cookieValueParts.join("="));
        }
    }

    return null;
}

export async function getHealthStatus(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Unable to reach ARMO Visual API.")
    }

    return response.json();
}

export async function getCsrfToken(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/csrf`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Unable to prepare secure login.");
    }

    const csrfToken = getCookie("csrftoken");

    if (!csrfToken) {
        throw new Error("CSRF token was not set.");
    }

    return csrfToken;
}

export async function loginEmployee(username: string, password: string): Promise<AuthResponse> {
    const csrfToken = await getCsrfToken();

    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({
            username,
            password
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail ?? "Unable to log in.");
    }

    return data;
}

export async function getCurrentEmployee(): Promise<EmployeeUser | null> {
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
        credentials: "include",
    });

    if (response.status === 403 || response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Unable to load current employee.");
    }

    const data: AuthResponse = await response.json();

    return data.user;
}

export async function logoutEmployee(): Promise<void> {
    const csrfToken = await getCsrfToken();

    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRFToken": csrfToken,
        },
    });

    if (!response.ok) {
        throw new Error("Unable to log out.");
    }
}

export async function getProducts(filters: ProductFilters = {},): Promise<ProductListResponse> {
    const params = new URLSearchParams();

    if (filters.query) {
        params.set("q", filters.query);
    }

    if (filters.space) {
        params.set("space", filters.space);
    }

    if (filters.style) {
        params.set("style", filters.style);
    }

    const queryString = params.toString();
    const url = queryString 
        ? `${API_BASE_URL}/products/?${queryString}`
        : `${API_BASE_URL}/products/`;

    const response = await fetch(url, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Unable to load products.");
    }
    
    return response.json();
}