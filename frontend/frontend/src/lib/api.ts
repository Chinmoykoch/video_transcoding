const Base_Url = "http://localhost:8000/api/v1"

export async function registerUser(userData: any) {
    const response = await fetch(`${Base_Url}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Registration failed");
    }
    return data;
}

export async function uploadVideo(formData: FormData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${Base_Url}/videos/upload`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Upload failed");
    }
    return data;
}

export async function getVideos() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${Base_Url}/videos`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch videos");
    }
    return data;
}

export async function loginUser(credentials: any) {
    const response = await fetch(`${Base_Url}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Login failed");
    }

    // Store tokens in local storage
    if (data.token) {
        localStorage.setItem("token", data.token);
    }
    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
    }
    if (data.creator) {
        localStorage.setItem("creator", JSON.stringify(data.creator));
    }

    return data;
}