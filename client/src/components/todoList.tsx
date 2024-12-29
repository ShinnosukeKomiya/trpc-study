import { useState } from "react";
import { CSSProperties } from "react";
import { trpc } from "../../utils/trpc";

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#cba471",
  },
  innerContainer: {
    width: "50%",
    height: "50%",
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "#ccd8e1",
    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "12px 20px",
    margin: "8px 0",
    boxSizing: "border-box",
    borderRadius: "4px",
    border: "none",
    outline: "none",
  },
  list: {
    listStyleType: "none",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between", // コンテンツを両端に寄せる
    alignItems: "center", // 垂直方向中央に配置
    backgroundColor: "#f9f9f9",
    margin: "8px 0",
    padding: "12px",
    borderRadius: "4px",
    textAlign: "left",
  },
  addButton: {
    padding: 10,
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  deleteButton: {
    marginLeft: "10px",
    cursor: "pointer",
    color: "red",
    textAlign: "right",
  },
};

const TodoList = () => {
  const test = trpc.test.useQuery();
  console.log(test.data);
  const allTodos = trpc.getTodos.useQuery();
  const allMemos = trpc.getMemos.useQuery();
  const [inputTaskName, setInputTaskName] = useState("");
  const [inputDueDate, setInputDueDate] = useState(new Date());
  const [inputMemo, setInputMemo] = useState("");

  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      allTodos.refetch();
      allMemos.refetch();
    },
  });

  const deleteTodo = trpc.deleteTodo.useMutation({
    onSettled: () => {
      allTodos.refetch();
      allMemos.refetch();
    },
  });

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
        <p style={styles.title}>Todo List</p>
        <input
          type="text"
          placeholder="What needs to be done?"
          style={styles.input}
          value={inputTaskName}
          onChange={(e) => setInputTaskName(e.target.value)}
        />
        <input
          type="date"
          style={styles.input}
          value={inputDueDate.toISOString().split("T")[0]}
          onChange={(e) => setInputDueDate(new Date(e.target.value))}
        />
        <input
          type="text"
          placeholder="Memo"
          style={styles.input}
          value={inputMemo}
          onChange={(e) => setInputMemo(e.target.value)}
        />
        <button
          style={styles.addButton}
          onClick={() => {
            addTodo.mutate({
              content: inputTaskName,
              dueDate: inputDueDate,
              memo: inputMemo,
            });
            setInputTaskName("");
            setInputDueDate(new Date());
            setInputMemo("");
          }}
        >
          Add Todo
        </button>
        <ul style={styles.list}>
          {allTodos.data?.map((todo) => (
            <div style={styles.listItem} key={todo.id}>
              {todo.content} 期日: {todo.dueDate.toLocaleDateString()}
              <div>
                {allMemos.data?.find((memo) => memo.todoId === todo.id)?.memo}
              </div>
                <span
                  style={styles.deleteButton}
                onClick={() => {
                  deleteTodo.mutate(todo.id);
                }}
              >
                ✖
              </span>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
