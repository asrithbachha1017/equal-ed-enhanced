
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getApiUrl = (path: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    // If running in browser and URL is relative, let it be relative (proxy/same-origin)
    // If API_BASE_URL is set, prepend it.
    if (API_BASE_URL) {
        return `${API_BASE_URL}/${cleanPath}`;
    }

    // Default to relative path for same-origin
    return `/${cleanPath}`;
};
