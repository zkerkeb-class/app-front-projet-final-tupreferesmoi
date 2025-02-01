"use client";

import React, { useState, useRef, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@features/auth/AuthContext";

const UserMenu = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = useCallback(() => {
        logout();
        router.push("/");
        router.refresh();
    }, [logout, router]);

    const toggleMenu = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const styles = {
        container: {
            position: "relative",
            display: "inline-block",
        },
        button: {
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#282828",
            border: "none",
            borderRadius: "500px",
            color: "#fff",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "600",
        },
        menu: {
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "0.5rem",
            backgroundColor: "#282828",
            borderRadius: "4px",
            padding: "0.5rem",
            minWidth: "200px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
        },
        menuItem: {
            display: "block",
            padding: "0.75rem 1rem",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "2px",
            fontSize: "0.875rem",
            cursor: "pointer",
        },
        menuItemHover: {
            backgroundColor: "#333",
        },
        avatar: {
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            backgroundColor: "#1db954",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: "600",
        },
    };

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    if (!user) {
        return (
            <Link href="/login" style={styles.button}>
                Se connecter
            </Link>
        );
    }

    return (
        <div style={styles.container} ref={menuRef}>
            <button onClick={toggleMenu} style={styles.button}>
                <div style={styles.avatar}>
                    {user.username.charAt(0).toUpperCase()}
                </div>
                {user.username}
            </button>

            {isOpen && (
                <div style={styles.menu}>
                    <div
                        style={styles.menuItem}
                        onClick={handleLogout}
                        onMouseEnter={(e) =>
                            Object.assign(e.target.style, styles.menuItemHover)
                        }
                        onMouseLeave={(e) =>
                            Object.assign(e.target.style, {
                                backgroundColor: "transparent",
                            })
                        }
                    >
                        Se déconnecter
                    </div>
                </div>
            )}
        </div>
    );
});

UserMenu.displayName = 'UserMenu';

export default UserMenu;
