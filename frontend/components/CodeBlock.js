import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CodeEditor = ({ value, onChange }) => {
  const handleEditorChange = (newValue) => {
    onChange(newValue);
  };

  return (
    <Editor
      className="border-2"
      height="15vh"
      language="python"
      defaultValue="# write your python code here"
      theme="vs-dark"
      value={value}
      onChange={handleEditorChange}
    />
  );
};

const OutputBlock = ({ text }) => {
  return text.length > 0 ? (
    <div className="bg-slate-400 my-4 rounded">
      <div className="p-1">
        <h1 className="text-sm">Output:</h1>
      </div>

      <hr />
      <div className="p-2">{text}</div>
    </div>
  ) : null;
};

const IDBlock = ({ id }) => {
  return <h1>{id}</h1>;
};

function CodeBlock({
  handleAddNewBlock,
  handleDeleteBlock,
  index,
  currentCode,
  currentOutput,
  onUpdateCode,
  onUpdateOutput,
  webSocket,
}) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    onUpdateCode(index, newValue);
  };

  const handleCodeRun = async () => {
    if (webSocket) {
      //const message = JSON.stringify({ code });
      const message = JSON.stringify({ code: code, block_id: index });
      webSocket.send(message);
    }

    // const data = {"code": code};
    // const res = await axios.post("http://0.0.0.0:8000/execute", data, {headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}`}});
    // console.log(res.data);
    // setOutput(res.data.output);
    // onUpdateOutput(index, res.data.output);
    //console.log(index);
  };

  const handleWebsocketOutput = (websocketOutput) => {
    onUpdateOutput(websocketOutput.block_id, websocketOutput.output);
  };

  const handleAddBlock = () => {
    handleAddNewBlock(index);
  };

  const handleDelete = () => {
    handleDeleteBlock(index);
  };

//   const handleWebSocketMessage = (event) => {
//     const message = JSON.parse(event.data);
//     console.log(message.output);
//     setOutput(message.output);
//     onUpdateOutput(message.block_id, message.output);

//     // setOutput((prevOutput) => {
//     //     if (prevOutput === currentOutput) {
//     //       return out; // Only update the output if it hasn't changed
//     //     }
//     //     return prevOutput;
//     //   });
//     //   onUpdateOutput(index, out);
//   };

  //   webSocket.current.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     setOutput(data.output);
  //     // console.log(data.block_id, data.output);
  //     onUpdateOutput(data.block_id, data.output);
  //     // console.log(index);
  //     // console.log(data);
  //  }

  //   useEffect(() => {
  //     let isMounted = true;
  //     //   if(isMounted && webSocket){
  //     //     console.log("index in effect: ", index);
  //     //     setCode(currentCode);
  //     //     setOutput(currentOutput);
  //     //     // webSocket.addEventListener('message', handleWebSocketMessage);
  //     //     webSocket.current.onmessage = (event) => {
  //     //         const data = JSON.parse(event.data);
  //     //         console.log(index, data);
  //     //         // setOutput(data.output);
  //     //     }
  //     //   }

  //     if (isMounted && currentCode.length > 0) {
  //         setCode(currentCode);
  //         setOutput(currentOutput);

  //         // webSocket.current.onmessage = (event) => {
  //         // const data = JSON.parse(event.data);
  //         // // console.log(index, data);
  //         //     setOutput(data.output);
  //         //     onUpdateOutput(data.block_id, data.output);
  //         // }

  //     }

  //     // if(webSocket){
  //     //     console.log("index: ", index);
  //     //     webSocket.onmessage = (event) => {
  //     //     const data = JSON.parse(event.data);
  //     //     console.log(data.output);
  //     //     setOutput(data.output);
  //     //     onUpdateOutput(index, data.output);
  //     //     };
  //     // }

  //     return () => {
  //         isMounted = false;
  //         // if (webSocket) {
  //         //     webSocket.removeEventListener('message', handleWebSocketMessage);
  //         // }
  //     };
  //   }, []);

  useEffect(() => {
    setCode(currentCode);
    setOutput(currentOutput);

    webSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const block_id = data.block_id;
      const out = data.output;
      handleWebsocketOutput(data);
    };
  }, [currentCode, currentOutput]);

  return (
    <div className="bg-slate-200 rounded-md py-3 mb-10">
      <div className="flex items-center justify-end mb-3">
        <div
          className="p-2.5 mr-10 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-emerald-400 hover:bg-emerald-600 text-white"
          onClick={handleAddBlock}
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
            Add Block
          </span>
        </div>

        <div
          className="p-2.5 mr-10 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-red-500 hover:bg-red-700 text-white"
          onClick={handleDelete}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="white"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>

          <span className="text-[15px] ml-4 text-white font-medium">
            Delete
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <div
          className="flex items-center justify-center w-1/12 p-5 cursor-pointer"
          onClick={handleCodeRun}
        >
          <div className="rounded-full bg-emerald-400 p-3 hover:bg-emerald-600 duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
          </div>
        </div>

        <div className="w-11/12 px-10">
          {/* <IDBlock id={index}/> */}
          <CodeEditor value={code} onChange={handleCodeChange} />
          <OutputBlock text={output} />
        </div>
      </div>
    </div>
  );
}

export default CodeBlock;
