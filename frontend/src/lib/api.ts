export const API_BASE_URL = 
    import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api"

export type HealthResponse = {
    status: string;
    service: string;
};

export async function getHealthStatus(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/health`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Unable to reach ARMO Visual API.")
    }

    return response.json();
}