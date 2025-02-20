"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "react-feather";
import { useAuth } from "@features/auth/AuthContext";
import { useTranslation } from "react-i18next";
import styles from "@styles/auth.module.css";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await login(formData);
            router.push("/");
        } catch (err) {
            setError(
                err.response?.data?.message || t('auth.login.error')
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h1 className={styles.title}>{t('auth.login.title')}</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            {t('auth.login.emailLabel')}
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            {t('auth.login.passwordLabel')}
                        </label>
                        <div className={styles.passwordInput}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className={styles.passwordToggle}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading ? t('auth.login.loadingButton') : t('auth.login.submitButton')}
                    </button>
                </form>

                <Link href="/register" className={styles.link}>
                    {t('auth.login.noAccount')}
                </Link>
            </div>
        </div>
    );
}
