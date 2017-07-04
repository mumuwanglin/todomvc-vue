// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import 'todomvc-app-css/index.css'
import './store'

var filters = {
  all(todos) {
    return todos
  },
  active(todos) {
    return todos.filter((todo) => {
      return !todo.completed
    })
  },
  completed(todos) {
    return todos.filter((todo) => {
      return todo.completed
    })
  }
}

var app = new Vue({
  el: '.todoapp',
  data: {
    todos:todoStorage.fetch() || [],
    newTodo: '',
    editedTodo: null,
    hashName: 'all'
  },
  watch: {
    todos: {
      deep: true,
      handler: todoStorage.save
    }
  },
  computed: {
    remain: function() {
      return filters.active(this.todos).length
    },
    isAll:  {
      get: function () {
        return this.remain === 0;
      },
      set: function (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value;
        });
      }
    },
    filteredTodos: function(){

      return filters[this.hashName](this.todos)
    }
  },
  methods:{
    addTodo:function () {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.push({ title: value, completed: false });
      this.newTodo = '';
    },
    removeTodo:function (todo) {
      var index = this.todos.indexOf(todo)
      this.todos.splice(index,1)
    },
    editTodo: function (todo) {
      this.editedTodo = todo
      this.beforeEditCache = todo.title
    },
    doneEdit: function (todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim()
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },
    cancelEdit: function (todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },
    removeCompleted: function () {
      this.todos = filters.active(this.todos)
    }
  },
  directives: {
    'todo-focus': function (el, binding) {
      if (binding){
        el.focus()
      }
    }
  }
})

function hashChange() {
  let hashName = location.hash.replace(/#\/?/,'')
  if (filters[hashName]){
    app.hashName = hashName
  }else {
    location.hash = ''
    app.hashName = 'all'
  }
}

window.addEventListener('hashchange',hashChange)


