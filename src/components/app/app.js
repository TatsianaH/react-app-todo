import React, {Component} from 'react';
import AppHeader from "../app-header";
import SearchPanel from "../search-panel";
import TodoList from "../todo-list";
import ItemStatusFilter from "../item-status-filter";
import ItemAddForm from "../item-add-form";

export default class App extends Component {
    maxId = 100;
    state = {
        todoData: [
            this.createTodoItem('Drink Coffee'),
            this.createTodoItem('Make Awesome App'),
            this.createTodoItem('Have a lunch'),
        ],
        term: '',
    };

    createTodoItem(label) {
        return {
            label,
            important: false,
            id: this.maxId++,
            done: false,
        }
    }

    deleteItem = (id) => {
        this.setState(({todoData}) => {
            const idx = todoData.findIndex(el => el.id === id);
            const before = todoData.slice(0, idx);
            const after = todoData.slice(idx + 1);
            const newArray = [...before, ...after];
            return {todoData: newArray};
        })
    };

    addItem = (text) => {
        //generate id
        const newItem = this.createTodoItem(text);
        //add elem in array
        this.setState(({todoData}) => {
            const newArr = [...todoData, newItem];

            return {todoData: newArr}
        });
    };

    toggleProperty(arr, id, propName) {
        const idx = arr.findIndex(el => el.id === id);
        //update object
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName]};
        //construct new array
        return [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)];
    }

    onToggleDone = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        });
    };

    onToggleImportant = (id) => {
        this.setState(({todoData}) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            }
        });
    };
    search(items, term){
        if(term.length === 0){
            return items;
        }
        return items.filter(item => {
            return item.label.indexOf(term) > -1;
        })
    }

    render() {
        const {todoData, term} = this.state;
        const visibleItems = this.search(todoData, term);
        const doneCount = todoData.filter(el => el.done).length;
        const todoCount = todoData.length - doneCount;
        return (
            <div className="todo-app">
                <span>{(new Date().toString())}</span>
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className="top=panel d-flex">
                    <SearchPanel/>
                    <ItemStatusFilter/>
                </div>

                <TodoList todos={visibleItems}
                          onDeleted={this.deleteItem}
                          onToggleImportant={this.onToggleImportant}
                          onToggleDone={this.onToggleDone}/>
                <ItemAddForm addItem={this.addItem}/>
            </div>
        );
    };

};
