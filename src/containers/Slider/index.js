import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );
  // Fonction pour mettre en pause ou reprendre le slider
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  // Gestionnaire d'événements pour la barre d'espace
  const handleKeyPress = (event) => {
    if (event.keyCode === 32) {
      event.preventDefault(); // Empêcher le comportement par défaut de la barre d'espace
      togglePause(); // Mettre en pause ou reprendre le slider
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isPaused) {
        // Si le slider n'est pas en pause
        setIndex((prevIndex) =>
          prevIndex + 1 < byDateDesc?.length ? prevIndex + 1 : 0
        );
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [index, isPaused, byDateDesc]);
  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPaused]);
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div
          key={event.date}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      {/* Pagination */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc?.map((focus, radioIdx) => (
            <input
              key={focus.title}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              readOnly
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Slider;
