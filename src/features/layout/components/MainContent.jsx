import React from "react";
import Card from "../common/Card.jsx";
import "../../styles/MainContent.css";

const MainContent = () => {
    const recommendations = [
        {
            id: 1,
            title: "Années 90",
            description: "Le meilleur des années 90 en 90...",
            image: "https://via.placeholder.com/400",
        },
        {
            id: 2,
            title: "Hits du moment",
            description: "Stromae, Pomme au sommet de la...",
            image: "https://via.placeholder.com/400",
        },
        {
            id: 3,
            title: "Grand Hit",
            description: "Mauvais garçon d'Helena est le...",
            image: "https://via.placeholder.com/400",
        },
    ];

    const categories = [
        { id: 1, name: "Tout" },
        { id: 2, name: "Musique" },
        { id: 3, name: "Podcasts" },
        { id: 4, name: "Livres audio" },
    ];

    return (
        <main className="main-content">
            <nav className="category-nav">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={
                            category.id === 1
                                ? "category-btn active"
                                : "category-btn"
                        }
                    >
                        {category.name}
                    </button>
                ))}
            </nav>

            <section className="content-section">
                <div className="section-header">
                    <h2>Recommandés pour vous</h2>
                    <button className="see-all-btn">Tout afficher</button>
                </div>

                <div className="cards-grid">
                    {recommendations.map((item) => (
                        <Card
                            key={item.id}
                            image={item.image}
                            title={item.title}
                            description={item.description}
                        />
                    ))}
                </div>
            </section>

            <section className="content-section">
                <div className="section-header">
                    <h2>Classements recommandés</h2>
                    <button className="see-all-btn">Tout afficher</button>
                </div>

                <div className="cards-grid">
                    {recommendations.map((item) => (
                        <Card
                            key={item.id}
                            image={item.image}
                            title={`Top ${item.title}`}
                            description={item.description}
                            type="playlist"
                        />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default MainContent;
