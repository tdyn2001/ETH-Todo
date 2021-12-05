import './App.css';
import React, { useState, useEffect } from "react";
import Web3 from 'web3';
import { TODO_LIST_ADDRESS } from './config'
import TodoListContract from './contract/TodoList.json'
import TodoList from './TodoList'

function App() {
  const [account, setAccount] = useState("");
  const [todoListContract, setTodoList] = useState({});
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const createTask = (content) => {
    setLoading(true)
    setErrorMessage("")

    todoListContract.methods.createTask(content).send({ from: account })
      .once('receipt', (receipt) => {
        setLoading(false)
        loadData(todoListContract)
        // console.log("receipt: " + JSON.stringify(receipt))
      })
      .on('error', function (error) {
        setLoading(false)
        var _error = JSON.stringify(error, null, "\t");
        setErrorMessage(_error)
      })
  }

  const clearAll = () => {
    setLoading(true)
    setErrorMessage("")

    todoListContract.methods.clearTask().send({
      from: account,
      // gas: 150000,
      // gasPrice: '150000'
    })
      .once('receipt', (receipt) => {
        setLoading(false)
        loadData(todoListContract)
        // console.log("receipt: " + JSON.stringify(receipt))
      })
      .on('error', function (error) {
        setLoading(false)
        var _error = JSON.stringify(error, null, "\t");
        setErrorMessage(_error)
      })
  }

  const loadBlockchainData = async () => {
    await connectWallet()
    var web3 = new Web3(window.web3.currentProvider || new Web3.providers.HttpProvider('http://localhost:7545'));
    const _todoList = new web3.eth.Contract(TodoListContract.abi, TODO_LIST_ADDRESS)

    const eventProvider = new Web3.providers.WebsocketProvider('ws://localhost:7545')
    var sWeb3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    sWeb3.setProvider(eventProvider)
    const wsTodoList = new sWeb3.eth.Contract(TodoListContract.abi, TODO_LIST_ADDRESS)
    wsTodoList.events.TaskCompleted({ filter: {}, fromBlock: "latest" },
      (errors, events) => {
        console.log("event error: " + errors)
        console.log("event event: " + JSON.stringify(events))
        setTimeout(() => {
          loadData(_todoList)
        }, 500)
      })

    setTodoList(_todoList)
    await loadData(_todoList)
  }

  const connectWallet = async () => {
    if (window.ethereum) { //check if Metamask is installed
      try {
        const address = await window.ethereum.enable(); //connect Metamask
        console.log(JSON.stringify(address))
        setAccount(address[0])
        const obj = {
          connectedStatus: true,
          status: "",
          address: address
        }
        return obj;

      } catch (error) {
        return {
          connectedStatus: false,
          status: "🦊 Connect to Metamask using the button on the top right."
        }
      }

    } else {
      return {
        connectedStatus: false,
        status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
      }
    }
  };

  const loadData = async (_todoList) => {
    const _taskCount = await _todoList.methods.taskCount().call()
    var _tasks = []
    for (var i = 1; i <= _taskCount; i++) {
      const task = await _todoList.methods.tasks(i).call()
      _tasks.push(task)
    }
    console.log(JSON.stringify(_tasks))
    setTasks(_tasks)
  }

  const toggleCompleted = (taskId) => {
    setLoading(true)
    setErrorMessage("")
    todoListContract.methods.toggleCompleted(taskId).send({ from: account })
      .once('receipt', (receipt) => {
        setLoading(false)
      })
      .on('error', function (error) {
        setLoading(false)
        var _error = JSON.stringify(error, null, "\t");
        setErrorMessage(_error)
      })
  }

  useEffect(() => {
    (async function () {
      await loadBlockchainData();
    })();
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      })
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })
    }
  }, []);

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-sm-3 col-md-2 mr-0" target="_blank">Dapp Todo List</a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small><a className="nav-link" href="#"><span id="account"></span></a></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex justify-content-center">
            {loading
              ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
              : <TodoList createTask={createTask} tasks={tasks} clearAll={clearAll} error={errorMessage} toggleCompleted={toggleCompleted} />
            }
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
