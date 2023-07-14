import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import Layout from "../components/Layout";
import bgr from "../pic.jpg";
import { Link } from "react-router-dom";
import "../styles/homestyle.css";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);

  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, []);

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <Layout>
      <div className="home" style={{ backgroundImage: `url(${bgr})` }}>
        <div className="headerContainer">
          <h1>Recipe Blog Website</h1>
          <p id="h2w">Best Recipies Available Here</p>
          <Link to="/create-recipe">
            <button id="obtn">CREATE RECIPE</button>
          </Link>
        </div>
      </div>
      <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div >
              <h2>{recipe.name}</h2>
              <button class="btn"
                onClick={() => saveRecipe(recipe._id)}
                disabled={isRecipeSaved(recipe._id)}
              >
                {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <p>Cooking Time: {recipe.cookingTime} minutes</p>
          </li>
        ))}
      </ul>
    </div>
    </Layout>

  );
};