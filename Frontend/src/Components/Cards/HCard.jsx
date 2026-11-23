import { API_URL } from "../../config.js";
import React, { useEffect, useState } from "react";
import axios from "axios";
import HomeCard from "./HomeCard";

const HCard = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/recipe/`)
      .then((res) => setRecipes(res.data.slice(0, 4)))
      .catch((err) => {
        console.error("Failed to load recipes", err);
        setError("Recipes could not be loaded. Please try again later.");
      });
  }, []);

  return (
    <>
      <h4 className="mt-5 text-center">Recipes</h4>
      {error && <p role="alert" className="text-center text-danger">{error}</p>}
      <div className="container card-container d-flex justify-content-around flex-wrap">
        {recipes.map((r) => (
          <HomeCard
            key={r._id}
            image={r.image}
            name={r.title}
            text={r.body.slice(0, 90) + "..."}
            url={`/showRecipe/${r._id}`}
          />
        ))}
      </div>
    </>
  );
};

export default HCard;
