export function setCookie(name: string, value: string, maxAgeSeconds: number, path: string = '/') {
    const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=${path}`;
  }
  
  export function getCookie(name: string): string | null {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const desiredCookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
  
    return desiredCookie ? desiredCookie.split('=')[1] : null;
  }