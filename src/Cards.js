import React, { useEffect, useState } from "react";
import CardComponent from "./CardComponent";
import axios from "axios";

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

const Cards = () => {
  const [currentDeck, setCurrentDeck] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    const fetchNewDeck = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/new/shuffle/`);
        setCurrentDeck(response.data);
      } catch (error) {
        console.error("Error fetching new deck:", error.message);
      }
    };

    fetchNewDeck();
  }, []);

  const drawCard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${currentDeck.deck_id}/draw/`);

      if (response.data.remaining === 0) {
        throw new Error("The deck is empty!");
      }

      const card = response.data.cards[0];

      setDrawnCards((prevDrawn) => [
        ...prevDrawn,
        {
          id: card.code,
          name: `${card.suit} ${card.value}`,
          image: card.image,
        },
      ]);
    } catch (error) {
      alert(error.message);
    }
  };

  const shuffleDeck = async () => {
    setIsShuffling(true);

    try {
      await axios.get(`${API_BASE_URL}/${currentDeck.deck_id}/shuffle/`);
      setDrawnCards([]);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsShuffling(false);
    }
  };

  const renderDrawButton = () => (
    <button
      className="Card-Draw"
      onClick={drawCard}
      disabled={isShuffling || !currentDeck}
    >
      Draw a Card
    </button>
  );

  const renderShuffleButton = () => (
    <button
      className="Card-Shuffle"
      onClick={shuffleDeck}
      disabled={isShuffling || !currentDeck}
    >
      Shuffle Deck
    </button>
  );

  return (
    <div className="Cards">
      <div className="Cards-Container">
        {drawnCards.map((card) => (
          <CardComponent key={card.id} name={card.name} image={card.image} />
        ))}
      </div>
      <div className="Cards-ButtonContainer">
        {renderDrawButton()}
        {renderShuffleButton()}
      </div>
    </div>
  );
};

export default Cards;
