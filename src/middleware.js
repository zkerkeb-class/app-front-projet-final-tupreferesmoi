import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("token");
    const { pathname } = request.nextUrl;

    // Liste des routes protégées qui nécessitent une authentification
    const protectedRoutes = [
        "/profile",
        "/settings",
        // Ajoutez d'autres routes protégées ici
    ];

    // Liste des routes publiques accessibles uniquement aux utilisateurs non connectés
    const authRoutes = ["/login", "/register"];

    // Redirection des utilisateurs non connectés vers la page de connexion
    if (protectedRoutes.some((route) => pathname.startsWith(route)) && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirection des utilisateurs connectés vers la page d'accueil s'ils tentent d'accéder aux pages de connexion/inscription
    if (authRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Ajouter le token aux headers si présent
    if (token) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('Authorization', `Bearer ${token.value}`);
        
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile/:path*", "/settings/:path*", "/login", "/register", "/api/:path*"],
};
