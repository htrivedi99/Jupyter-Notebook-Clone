import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import CodeBlock from "../../components/CodeBlock";
import Header from "../../components/Header";
import { v4 as uuidv4 } from "uuid";

function NotebookPage() {
  const router = useRouter();
  const [notebookId, setNotebookId] = useState("");
  const [codeBlocks, setCodeBlocks] = useState([]);
  const [notebookName, setNotebookName] = useState("");
  const [webSocket, setWebSocket] = useState(null);
  const webSocketRef = useRef(null);

  const addNewBlock = (block_id) => {
    const index = codeBlocks.findIndex((x) => x.id === block_id);
    const newBlock = { id: uuidv4(), code: "", output: "" };
    let newBlocks = [
      ...codeBlocks.slice(0, index + 1),
      newBlock,
      ...codeBlocks.slice(index + 1),
    ];
    setCodeBlocks(newBlocks);
  };

  const deleteBlock = (block_id) => {
    const filtered = codeBlocks.filter((item) => item.id !== block_id);
    setCodeBlocks(filtered);
  };

  const updateCode = (block_id, newCode) => {
    const index = codeBlocks.findIndex((x) => x.id === block_id);
    const updatedBlocks = [...codeBlocks];
    updatedBlocks[index].code = newCode;
    setCodeBlocks(updatedBlocks);
  };

  const updateResult = (block_id, output) => {
    console.log(block_id, output);
    console.log(codeBlocks);
    const index = codeBlocks.findIndex((x) => x.id === block_id);
    let updatedBlocks = [...codeBlocks];
    updatedBlocks[index].output = output;
    console.log("updated blocks: ", updatedBlocks);
    setCodeBlocks(updatedBlocks);
  };

  const saveNotebook = async (data) => {
    console.log("notebook saved with name: ", data.notebookName);
    console.log(codeBlocks);
    const payload = {
      notebook_id: router.query.slug,
      notebook_name: data.notebookName,
      code_blocks: codeBlocks,
    };

    console.log(payload);

    const res = await axios.post("http://0.0.0.0:8000/save_notebook", payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    console.log(res.data);
  };

  const deleteNotebook = async () => {
    console.log("notebook to delete: ", notebookId);
    const payload = {
      notebook_id: notebookId,
    };
    const res = await axios.post(
      "http://0.0.0.0:8000/delete_notebook",
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    if (res.data.status === 200) {
      router.push({
        pathname: "/home",
      });
    }
  };

  const getNotebookData = async (notebook_id) => {
    const payload = { notebook_id: notebook_id };
    const res = await axios.post("http://0.0.0.0:8000/get_notebook", payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    console.log(res.data);
    if (res.data.status === 200) {
      setNotebookName(res.data.data.notebook_name);
      setCodeBlocks(res.data.data.code_blocks);
    } else {
      setCodeBlocks([{ id: uuidv4(), code: "", output: "" }]);
    }
  };

  // The struggle is real :(
    
  // useEffect(() => {
  //   let isMounted = true;

  //   if (isMounted && codeBlocks.length === 0) {
  //     const authToken = localStorage.getItem('authToken');
  //       if(!authToken){
  //           navigate.push('/login');
  //       }else{
  //         setNotebookId(router.query.slug);
  //         console.log('router query: ', router.query);
  //         getNotebookData(router.query.slug);

  //         const newWebSocket = new WebSocket(`ws://localhost:8000/notebook/${router.query.slug}`);
  //         setWebSocket(newWebSocket);
  //         webSocketRef.current = newWebSocket;

  //       // Event handler for when the WebSocket connection is opened
  //       newWebSocket.onopen = () => {
  //         console.log('WebSocket connection opened');
  //       };

  //       // Event handler for receiving messages from the WebSocket server
  //       // newWebSocket.onmessage = (event) => {
  //       //   const data = JSON.parse(event.data);
  //       //   const block_id = data.block_id
  //       //   const out = data.output;
  //       //   console.log("code blocks before ", codeBlocks);
  //       //   updateResult(block_id, out);
  //       //   //console.log(data);
  //       // };

  //       // Event handler for when the WebSocket connection is closed
  //       newWebSocket.onclose = () => {
  //         console.log('WebSocket connection closed');
  //       };
  //       }

  //     //setCodeBlocks([{"id": uuidv4(), "code": "", "output": ""}]);
  //   }

  //   return () => {
  //     isMounted = false;
  //     if (webSocketRef.current) {
  //       webSocketRef.current.close();
  //       setWebSocket(null);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate.push("/login");
    } else {
      setNotebookId(router.query.slug);
      getNotebookData(router.query.slug);
      const newWebSocket = new WebSocket(
        `ws://localhost:8000/notebook/${router.query.slug}`
      );
      setWebSocket(newWebSocket);

      newWebSocket.onopen = () => {
        console.log("WebSocket connection opened");
      };

      newWebSocket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }

    return () => {
      if (webSocket) {
        setWebSocket(null);
      }
    };
  }, []);

  return (
    <div className="px-10">
      <Header
        currentNotebookName={notebookName}
        handleSaveNotebook={saveNotebook}
        handleNotebookDelete={deleteNotebook}
      />
      {codeBlocks.map((block, index) => (
        <CodeBlock
          key={index}
          index={block.id}
          currentCode={block.code}
          currentOutput={block.output}
          handleAddNewBlock={addNewBlock}
          handleDeleteBlock={deleteBlock}
          onUpdateCode={updateCode}
          onUpdateOutput={updateResult}
          webSocket={webSocket}
        />
      ))}
    </div>
  );
}

export default NotebookPage;
