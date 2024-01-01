import { useState } from "react";

function Button({ children, onClick, className, type }) {
  return (
    <button onClick={onClick} className={`button ${className}`} type={type}>
      {children}
    </button>
  );
}

export default function App() {
  const [todoItems, setTodoItems] = useState([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [selecedItem, setSelectedItem] = useState(null);
  const [showUpdateItemForm, setShowUpdateItemForm] = useState(false);

  function handleShowAddItemForm() {
    setShowAddItemForm((show) => !show);
  }

  function closeAddItemForm() {
    setShowAddItemForm(false);
  }

  function handleSelectedItem(item) {
    setSelectedItem((curItem) => (curItem?.id === item?.id ? null : item));
    setShowAddItemForm(false);
    setShowUpdateItemForm(false);
  }

  function handleAddItem(item) {
    setTodoItems((list) => [...list, item]);
    setShowAddItemForm(false);
  }

  function handleDeleteItem(removeItem) {
    var confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (confirmDelete == true) {
      setTodoItems((items) =>
        items.filter((item) => item.id !== removeItem.id)
      );
      setSelectedItem(null);
    }

    return;
  }

  function handleShowUpdateItemForm() {
    setShowUpdateItemForm((show) => !show);
  }

  function handleUpdateItem(updateItem) {
    setTodoItems((items) =>
      items.map((item) => {
        if (item.id === updateItem.id) {
          item.name = updateItem.name;
          item.description = updateItem.description;
          item.priority = updateItem.priority;
        }
        return item;
      })
    );

    setShowUpdateItemForm(false);
  }

  function handleCloseUpdateForm() {
    setShowUpdateItemForm(false);
  }

  return (
    <div className="app">
      <h1>📜 TODO Tasks 📜</h1>
      <div className="container">
        <div className="sidebar">
          {todoItems.length > 0 && (
            <TodoList
              todoItems={todoItems}
              onItemSelected={handleSelectedItem}
              selecedItem={selecedItem}
            />
          )}

          {todoItems.length === 0 && (
            <p className="add-item-message">Please add your todo-item</p>
          )}

          {showAddItemForm && (
            <FormAddItem
              onAddItem={handleAddItem}
              onCloseForm={closeAddItemForm}
            />
          )}

          {!showAddItemForm && (
            <Button onClick={handleShowAddItemForm} className="show-add-form">
              ➕ Add item
            </Button>
          )}
        </div>
        <div className="content">
          {selecedItem && (
            <TodoItemDetail
              selecedItem={selecedItem}
              onDeleteItem={handleDeleteItem}
              onToggleUpdateForm={handleShowUpdateItemForm}
            />
          )}
          {selecedItem && showUpdateItemForm && (
            <FormUpdateItem
              selecedItem={selecedItem}
              onUpdateItem={handleUpdateItem}
              onCloseForm={handleCloseUpdateForm}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TodoList({ todoItems, onItemSelected, selecedItem }) {
  debugger;
  return (
    <ul>
      {todoItems.map((item) => (
        <TodoItem
          item={item}
          key={item.id}
          onItemSelected={onItemSelected}
          selecedItem={selecedItem}
        />
      ))}
    </ul>
  );
}

function TodoItem({ item, onItemSelected, selecedItem }) {
  var isSelected = item.id === selecedItem?.id;

  function handleSelectedItem() {
    onItemSelected(item);
  }

  return (
    <li className={isSelected ? "selected" : ""} onClick={handleSelectedItem}>
      <h3>{item.name}</h3>
      <span className={`dot ${item.priority}`}></span>
      {item.priority === "low" && <span>☕</span>}
      {item.priority === "high" && <span>🔥</span>}
      {item.priority === "medium" && <span>🚨</span>}
    </li>
  );
}

function FormAddItem({ onAddItem, onCloseForm }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !description) return;

    const newItem = {
      id: crypto.randomUUID(),
      name: name,
      description: description,
      priority: priority,
      createDate: new Date().toLocaleString(),
    };

    onAddItem(newItem);
  }

  return (
    <form onSubmit={handleSubmit} className="form-add-item">
      <h2>Add Item</h2>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        cols={50}
      ></textarea>

      <label>Priority</label>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button type="button" onClick={onCloseForm}>
        👎 Cancel
      </Button>
      <Button type="submit">👍 Create</Button>
    </form>
  );
}

function TodoItemDetail({ selecedItem, onDeleteItem, onToggleUpdateForm }) {
  function deleteItem() {
    onDeleteItem(selecedItem);
  }

  return (
    <div className="todo-item-detail">
      <div className="detail-header">
        <h1 className="detail-header-title">{selecedItem.name}</h1>
        {selecedItem.priority === "low" && (
          <span className="detail-header-priority low">
            {selecedItem.priority}
          </span>
        )}
        {selecedItem.priority === "medium" && (
          <span className="detail-header-priority medium">
            {selecedItem.priority}
          </span>
        )}
        {selecedItem.priority === "high" && (
          <span className="detail-header-priority high">
            {selecedItem.priority}
          </span>
        )}
      </div>
      <div className="detail-body">
        <p className="detail-body-create-date">{selecedItem.createDate}</p>
        <p>{selecedItem.description}</p>
      </div>
      <div className="detail-footer">
        <Button onClick={onToggleUpdateForm}>🛠 Update</Button>
        <Button onClick={deleteItem}>🗑 Delete</Button>
      </div>
    </div>
  );
}

function FormUpdateItem({ selecedItem, onUpdateItem, onCloseForm }) {
  const [name, setName] = useState(selecedItem?.name);
  const [description, setDescription] = useState(selecedItem?.description);
  const [priority, setPriority] = useState(selecedItem?.priority);

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !description) return;

    const updateItem = {
      ...selecedItem,
      name: name,
      description: description,
      priority: priority,
    };

    onUpdateItem(updateItem);
  }

  return (
    <form className="form-update-item" onSubmit={handleSubmit}>
      <h2>Update Item: {selecedItem?.name}</h2>
      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        cols={50}
      ></textarea>

      <label>Priority</label>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button type="button" onClick={onCloseForm}>
        ❌ Cancel
      </Button>
      <Button type="submit">✅ Save</Button>
    </form>
  );
}
