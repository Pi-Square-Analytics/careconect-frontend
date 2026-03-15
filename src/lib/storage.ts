
// Pure Cookie-based storage to avoid localStorage SSR issues
export const safeLocalStorage = {
    getItem: (key: string): string | null => {
        return getCookie(key);
    },
    setItem: (key: string, value: string): void => {
        setCookie(key, value);
    },
    removeItem: (key: string): void => {
        removeCookie(key);
    },
    clear: (): void => {
        removeCookie('accessToken');
        removeCookie('refreshToken');
        removeCookie('user');
        removeCookie('medications');
        removeCookie('allergies');
        removeCookie('invoices');
        removeCookie('consultations');
    },
};

function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function setCookie(name: string, value: string, days = 7) {
    if (typeof document === 'undefined') return;
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value || "") + expires + "; path=/; SameSite=Lax";
}

function removeCookie(name: string) {
    if (typeof document === 'undefined') return;
    document.cookie = name + '=; Max-Age=-99999999; path=/;';
}
