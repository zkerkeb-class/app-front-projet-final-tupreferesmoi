"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "react-feather";
import { useAuth } from "@features/auth/AuthContext";
import { useTranslation } from "react-i18next";
import styles from "@styles/auth.module.css";

const validatePassword = (password) => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[#?!@$%^&*-]/.test(password);
    const hasMinLength = password.length >= 8;

    return hasLetter && (hasNumber || hasSpecial) && hasMinLength;
};

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
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

        if (!validatePassword(formData.password)) {
            setError(t('auth.register.passwordError'));
            return;
        }

        setIsLoading(true);

        try {
            await register(formData);
            router.push("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                t('auth.register.error')
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h1 className={styles.title}>{t('auth.register.title')}</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>
                            {t('auth.register.emailLabel')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="username" className={styles.label}>
                            {t('auth.register.usernameLabel')}
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>
                            {t('auth.register.passwordLabel')}
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
                        <small className={styles.hint}>
                            {t('auth.register.passwordRequirements')}
                        </small>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        className={styles.button}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t('auth.register.loadingButton')
                            : t('auth.register.submitButton')}
                    </button>
                </form>

                <Link href="/login" className={styles.link}>
                    {t('auth.register.hasAccount')}
                </Link>
            </div>
        </div>
    );
}
