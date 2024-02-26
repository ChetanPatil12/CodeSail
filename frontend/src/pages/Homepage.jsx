import React,{useState} from "react";
import Navbar from "../components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

const Homepage = () => {
  const [repoURL , setRepoURL] = useState("");
  const [errorAnimation, setErrorAnimation] = useState("hidden");
// animate-jump-in animate-once animate-duration-[600ms]
  const errorClasses = `alert alert-danger inline-block mt-3 ${errorAnimation}`
  const navigate = useNavigate()
  const handleInputChange = (event)=>{
    setRepoURL(event.target.value);
  }

  function errorHandel (){
    setErrorAnimation("animate-jump-in animate-once animate-duration-[600ms]")
    setTimeout(()=>{
      setErrorAnimation("animate-jump-out animate-once animate-duration-[600ms]")
    },2000)
  } 

  const handleSubmit = () => {
    console.log(repoURL);
    const githubRepoRegex = /^https:\/\/github\.com\/[^/]+\/[^/]+$/;
    if (!githubRepoRegex.test(repoURL)) {
      errorHandel()
    } else {
      navigate(`/deployPage/${encodeURIComponent(repoURL)}`);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-green-50 to-purple-200 h-screen">
      <Navbar />
      <div className="px-20">
        <div className="mt-20 w-[60%]">
          <h1 className="text-7xl font-bold">CODESAIL</h1>
          <p className="ml-2 mt-2 text-[#475569]">
            CodeSail is a platform designed for seamless deployment of web
            applications using GitHub repositories. Empowering developers with a
            streamlined and efficient deployment process, CodeSail simplifies
            the journey from code to deployment, ensuring a hassle-free
            experience.
          </p>
        </div>
        <div className="mt-8">
            <h3 className="text-[#475569] ml-2">Enter your GitHub repo link below 👇</h3>
          <div class="input-group w-[500px] mt-2">
            <input
              type="text"
              className="form-control border-2 placeholder:text-slate-300 "
              placeholder="https://github.com/. . . ."
              aria-label="Sizing example input"
              aria-describedby="inputGroup-sizing-md"
              onChange={handleInputChange}
            />
          </div>
          <button className="btn btn-dark text-lg px-4 mt-2 " onClick={handleSubmit}>Submit</button>
        </div>
        <div className={errorClasses}  role="alert">
        Invalid! GitHub repo link.
</div>
      </div>
      <Footer/>
    </div>
  );
};

export default Homepage;
