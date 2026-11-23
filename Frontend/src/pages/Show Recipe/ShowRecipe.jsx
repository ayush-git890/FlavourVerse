import { API_URL } from "../../config.js";
import React, { useEffect, useState } from "react";
import AboutRecipe from "../../Components/About Recipe/AboutRecipe";
import MyNav from "../../Components/Navbar/MyNav";
import RecipeMenu from "../../Components/Menu/RecipeMenu";
import Footer from "../../Components/footer/Footer";
import Review from "../../Components/Reviews/Review";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewRecipe from "../../Components/Reviews/ReviewRecipe";

const ShowRecipe = () => {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function recipeDataFetcher() {
      try {
        const data = (await axios.get(`${API_URL}/recipe/${id}`)).data;
        if (!data) throw new Error("Recipe not found");
        if (active) setRecipe(data);
      } catch (error) {
        console.error("Unable to load recipe", error);
        if (active) setError("This recipe could not be found or loaded.");
      }
    }
    setRecipe(null);
    setError("");
    recipeDataFetcher();
    return () => { active = false; };
  }, [id]);

  if (error) return <p role="alert" className="container my-4">{error}</p>;
  if (!recipe) return <p role="status" className="container my-4">Loading recipe...</p>;

  return (
    <>
      {/* <MyNav /> */}
      <AboutRecipe recipe={recipe} />
      <RecipeMenu recipe={recipe} />
      <ReviewRecipe recipe={recipe} />
      <Footer />
    </>
  );
};

export default ShowRecipe;
