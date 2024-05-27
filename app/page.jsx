"use client"
import { IoArrowRedoCircleOutline } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";
import { CiCircleAlert } from "react-icons/ci";
import { FaUserDoctor } from "react-icons/fa6";
import { GoPerson } from "react-icons/go";
import React, {useState, useEffect, useRef} from "react";


export default function Home() {
  const [isIntro, setIsIntro] = useState(true);
  const [context, setContext] = useState([]);
  const [relativeResponse, setRelativeResponse] = useState([]);
  const [docResponse, setDocResponse] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("Type 'start' to begin. Try to keep responses under 2 sentences and use correct grammar. This is just a demo.");
  
  {/* onClick function to send post request to server and generate conversations */}
  const onclick = () => {
    if (isLoading) {
      return;
    }
    if (inputText === "" || inputText === " " || inputText === NaN || inputText === undefined || inputText === null) {
      setMessage("Please enter a message.")
      return;
    }
    if (isIntro && inputText.toLowerCase() !== "start") {
      setMessage("Please enter 'Start' to begin.")
      return;
    }
    setInputText("");
    setIsLoading(true);
    setMessage("Loading...");
    const apiUrl = process.env.REACT_APP_API_URL;
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({inputText, isIntro}),
    })
    .then((response) => response.json())
    .then((data) => {
      if (isIntro) {
        setIsIntro(false);
        setContext([...context, data.context]);
        setRelativeResponse([...relativeResponse, data.rel_response]);
        setDocResponse([...docResponse, data.doc_response]);
        setIsLoading(false);
      }
      setRelativeResponse([...relativeResponse, data.rel_response]);
      setDocResponse([...docResponse, data.doc_response]);
      setIsLoading(false);
      setMessage("Type your response below.")
    })
  };
  
  {/* Set input dynamically */}
  const handleResponseChange = (event) => {
    setInputText(event.target.value);
  };

  {/* Handle enter key press */}
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      onclick(docResponse)
    }
  };

  {/* Combines doctor response and relative response and scrolls when new items added*/}
  const combined = docResponse.flatMap((item, index) => [item, relativeResponse[index]]);
  const lastItemRef = useRef(null);
  useEffect (() => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [combined]);

  
  return (
    <section>
      <header className="flex flex-col items-center">
        <p className="text-4xl mt-5 font-bold text-blue-600">Mediresponse V1</p>  
        <p className="text-xl m-5">Helping <span className="font-bold">you</span> with the hardest part in the medical field.</p>
      </header>
      <section>
        <main className="flex flex-col items-center">
          {/* Output text */}
          <div className="bg-blue-50 h-screen-65 w-8/12 overflow-y-scroll shadow-xl rounded-b-none rounded-xl">
            <div className="mt-5 ml-5 flex"><span className="text-2xl mr-2 text-red-500"><CiCircleAlert /></span>{message}</div>
            {/* Context  */}
            <p className="p-10 font-bold">
              {context}
            </p>
            {/* Doctor */}
            <p className="mx-10">
              {
                combined.map((item, index) => {
                  if (index % 2 === 0) {
                    return <div lassName="flex flex-col">
                    <span className="flex items-center"><h2 className="mb-2 font-bold">Doctor(You)</h2><FaUserDoctor className="mb-2 ml-2 text-blue-600"/></span>
                    <p className="mb-6" key={index}>{item}</p>
                    </div>;
                  } else {
                    return <div className="flex flex-col items-end" ref={index === combined.length - 1 ? lastItemRef : null}>
                      <span className="flex items-center"><GoPerson className="mb-2 mr-2 text-blue-600"/><h2 className="mb-2 font-bold">Relative/Friend</h2></span>
                      <p className="mb-6" key={index}>{item}</p>
                      </div>;
                  }
                })
              }
            </p>
          </div>
          {/* Divider */}
          <div className="flex bg-blue-50 w-8/12 justify-center">
            <div className="bg-neutral-300 h-0.5 w-9/12"></div>  
          </div>
          {/* Input text */}
          <div className="bg-blue-50 h-screen-15 w-8/12 flex justify-center items-center rounded-xl rounded-t-none">
            <div className="flex justify-center items-center w-10/12 bg-white rounded-xl">
              <input className="text-2xl w-full h-full p-2 focus:border-transparent focus:outline-none" value={inputText} onChange={handleResponseChange} onKeyDown={handleKeyPress}></input> 
              <span className="flex text-4xl text-neutral-600 hover:text-neutral-200 cursor-pointer p-2" onClick={() => onclick(docResponse)}>
                {isLoading ? <ImSpinner8 className="animate-spin mr-3" /> : <IoArrowRedoCircleOutline />}
              </span>
            </div>
          </div>
        </main>
      </section>
    </section>
  );
}
