import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { io } from "socket.io-client";
import axios from "axios";
import { Link,useParams } from "react-router-dom";

const socket = io("http://localhost:9001");

const DeployPage = () => {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [deployPreviewURL, setDeployPreviewURL] = useState();
 
  let { repoURL } = useParams();
  const gitRepoLink = decodeURIComponent(repoURL);
  useEffect(()=>{
    console.log(logs);
  },[logs])

  const logContainerRef = useRef(null);



  const handleSocketIncommingMessage = useCallback((message) => {
    if (typeof message === "string") {
      setLogs((prev) => [...prev, message]);
    } else {
      const { log } = JSON.parse(message);
      setLogs((prev) => [...prev, log]);
    }
    logContainerRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    socket.on("message", handleSocketIncommingMessage);

    return () => {
      socket.off("message", handleSocketIncommingMessage);
    };
  }, [handleSocketIncommingMessage]);

  const Deploy = useCallback(async () => {
    setLoading(true);
console.log("called");
    const { data } = await axios.post(`http://localhost:9000/project`, {
      gitURL: gitRepoLink,
      slug: projectId,
    });

    if (data && data.data) {
      const { projectSlug, url } = data.data;
      setProjectId(projectSlug);
      setDeployPreviewURL(url);

      console.log(`Subscribing to logs:${projectSlug}`);
      socket.emit("subscribe", `logs:${projectSlug}`);
    }
  }, [projectId, gitRepoLink]);

 

  return (
    <div className="bg-gradient-to-br from-blue-50 via-green-50 to-purple-200 h-screen">
      <Navbar />
      <div className="pl-4 pt-4">
      <Link to='/'>

        <button className="btn btn-dark ">Back</button>
      </Link>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-[50%]">
          <div className="flex">
            <h2 className="my-2">
              {" "}
              <span className="font-semibold ml-2">Github link:</span>{" "}
              {gitRepoLink}
            </h2>
            <button
              onClick={Deploy}
              disabled={loading}
              className="btn btn-dark font-semibold ml-2"
            >
              {loading ? "In Progress" : "Deploy"}
            </button>
          </div>
          <h2 className="my-2">
            {" "}
            <span className="font-semibold ml-2">Deployed link:</span>
            {deployPreviewURL && (
              <a
                className=" ml-2 underline hover:cursor-pointer"
                href={deployPreviewURL}
                target="_blank"
              >
                {deployPreviewURL}
              </a>
            )}
          </h2>

          <h2 className="mb-2 ml-2 font-semibold mt-4">Logs👇</h2>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-[50%] h-[300px] border-2 rounded-xl bg-white overflow-auto p-4 text-xs">
          {logs.length > 0 && 
          <pre className="flex flex-col gap-1">
            {logs.map((log, i) => (
              <code
                ref={logs.length - 1 === i ? logContainerRef : undefined}
                key={i}
              >{`> ${log}`}</code>
            ))}
          </pre>
          
        }
        </div>
      </div>
      <div className="flex items-center justify-center mt-3">
        <div className="w-[50%]">
        {deployPreviewURL && (
          <Link to={deployPreviewURL}>
                      <button  className="btn btn-dark px-4 py-2 ">
            Go to deployed website
          </button>  
          </Link>
        
        )}

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeployPage;
