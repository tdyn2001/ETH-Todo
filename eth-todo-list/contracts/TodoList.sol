pragma solidity >=0.4.25 <0.9.0;

contract TodoList {
    address owner;
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    constructor() {
        owner = msg.sender;
        createTask("Todo dApp");
    }

    function createTask(string memory _content) public {
        require(bytes(_content).length > 0, "task must not empty");
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }

    function clearTask() public {
        require(msg.sender == owner, "only owner");
        for (uint256 i = 0; i < taskCount; i++) {
            delete tasks[i];
        }
        taskCount = 0;
    }

    event TaskCompleted(uint256 id, bool completed);

    function toggleCompleted(uint256 _id) public {
        Task memory _task = tasks[_id];
        require(_task.completed==false, "task done");
        _task.completed = true;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }
}
