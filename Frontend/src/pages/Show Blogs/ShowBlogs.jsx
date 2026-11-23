import { API_URL } from "../../config.js";
import  { useEffect, useState } from "react";
import MyNav from "../../Components/Navbar/MyNav";
import Footer from "../../Components/footer/Footer";
import AboutBlogs from "../../Components/About Blogs/AboutBlogs";
import Review from "../../Components/Reviews/Review";
import axios from "axios";
import { useParams } from "react-router-dom";

export const ShowBlogs = () => {


  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const blog = (await axios.get(`${API_URL}/blog/${id}`)).data;
        if (!blog) throw new Error("Blog not found");
        if (active) setData(blog);
      } catch (error) {
        console.error("Unable to load blog", error);
        if (active) setError("This blog could not be found or loaded.");
      }
    };

    setData(null);
    setError("");
    fetchData();
    return () => { active = false; };
  }, [id]);

  if (error) return <p role="alert" className="container my-4">{error}</p>;
  if (!data) return <p role="status" className="container my-4">Loading blog...</p>;

  return (
    <div>
     
        
        <AboutBlogs data={data} />
        <Review data={data} />
        <Footer />
  
    </div>
  );
};
