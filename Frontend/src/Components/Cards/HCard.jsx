import React, { useEffect, useState } from "react";
import axios from "axios";
import HomeCard from "./HomeCard";

const HCard = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/recipe/")
      .then((res) => setRecipes(res.data.slice(0, 4)))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h4 className="mt-5 text-center">Recipes</h4>
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
