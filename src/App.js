import React, { useState, useEffect } from "react";
import "./App.css";
import Alert from "./components/Alert";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import uuid from "uuid/v4";

// const initialExpenses = [
//   { id: uuid(), charge: "rent", amount: 1600 },
//   { id: uuid(), charge: "car payment", amount: 400 },
//   { id: uuid(), charge: "credit card bill", amount: 1200 }
// ];

const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

console.log(initialExpenses);

function App() {
  // state values
  // all expenses, add expense
  const [expenses, setExpenses] = useState(initialExpenses);
  // single expense
  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState("");

  // value in the state
  const [alert, setAlert] = useState({ show: false }); // the property show=false

  // edit
  const [edit, setEdit] = useState(false);

  // edit item
  const [id, setId] = useState(0);

  // useEffect - runs after every render
  useEffect(() => {
    console.log("we called useEffect", useEffect);
    localStorage.setItem("expenses", JSON.stringify(expenses), [expenses]); // call useEffect only is a change in the expenses arrays
  });

  // functionality
  const handleCharge = e => {
    setCharge(e.target.value);
  };

  const handleAmount = e => {
    setAmount(e.target.value);
  };

  // handle alert
  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text }); // display the alert
    setTimeout(() => {
      setAlert({ show: false }); // hide alert
    }, 2000);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map(item => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
      } else {
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, singleExpense]);

        handleAlert({ type: "success", text: "added successfully" });
      }

      setCharge("");
      setAmount("");
    } else {
      // handle alert
      handleAlert({
        type: "danger",
        text: `charge can't be empty value and amount value has to be bigger than zero`
      });
    }
  };

  // clear all items from the list
  const clearItems = () => {
    console.log("cleared all items");
    setExpenses([]);
    handleAlert({ type: "success", text: "all items deleted" });
  };

  // delete single item
  const handleDelete = id => {
    // return all the items that does not match the given id
    let tempExpenses = expenses.filter(item => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "item deleted" });
  };

  // edit single item

  const handleEdit = id => {
    let expense = expenses.find(item => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>budget calculator</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Total Spending :{" "}
        <span className="total">
          ${" "}
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </span>
      </h1>
    </>
  );
}

export default App;
