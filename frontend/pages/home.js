import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";

function Home() {
  const [notebooks, setNotebooks] = useState([]);
  const navigate = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate.push("/login");
    } else {
      getAllNotebooks();
    }
  }, []);

  const getAllNotebooks = async () => {
    const res = await axios.get("http://0.0.0.0:8000/get_all_notebooks", {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    console.log(res.data);
    setNotebooks(res.data.data);
  };

  const handleCreateNewNotebook = () => {
    const newNotebookId = uuidv4();
    navigate.push({
      pathname: `/notebook/${newNotebookId}`,
    });
    console.log("new notebook created!");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate.push("/login");
  };

  const navigateToNotebook = (book) => {
    console.log(book);
    navigate.push({
      pathname: `/notebook/${book.notebook_id}`,
    });
  };

  return (
    <div className="px-10">
      <div className="p-5 flex items-center justify-between">
        <h1 className="text-3xl">My Notebooks</h1>
        <div
          className="p-2.5 mr-10 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-red-400 hover:bg-red-600 text-white"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>

          <span className="text-[15px] ml-4 text-white font-medium">
            Logout
          </span>
        </div>
      </div>

      <hr />

      {notebooks.length === 0 ? (
        <div className="w-full h-[50vh] flex items-center justify-center">
          <div
            className="p-2.5 mr-10 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-emerald-400 hover:bg-emerald-600 text-white"
            onClick={handleCreateNewNotebook}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="white"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-[15px] ml-4 text-white font-medium">
              Create New Notebook
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-10 flex items-center flex-wrap">
          <div className="w-full flex items-center justify-start mb-10">
            <div
              className="p-2.5 mr-10 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-emerald-400 hover:bg-emerald-600 text-white"
              onClick={handleCreateNewNotebook}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="white"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-[15px] ml-4 text-white font-medium">
                Create New Notebook
              </span>
            </div>
          </div>
          
          {notebooks.map((book, index) => (
            <div
              key={book.notebook_id}
              className="cursor-pointer mr-10"
              onClick={() => navigateToNotebook(book)}
            >
              <div className="border-2 rounded-lg p-3 w-[200px]">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-16 h-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                    />
                  </svg>
                </div>

                <hr />
                <h1 className="mt-3 text-lg text-center">
                  {book.notebook_name}
                </h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
