import React from 'react';
import './App.css';
import TaskForm from './Components/TaskForm';
import Controll from './Components/Controls';
import TableControll from './Components/TableControll';
import _ from'lodash';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [], //id, name, status
      isDisplayForm: false,
      taskEditing: false,
      filter: {
        name: '',
        status: -1
      },
      keyword :'',
      sortBy: 'name',
      sortValue: 1
    }
  }
  // life cycle
  // chi duoc goi duy nhat 1 lan
  componentWillMount() {
    if (localStorage && localStorage.getItem('tasks')) {
      var tasks = JSON.parse(localStorage.getItem('tasks'));
      this.setState({
        tasks: tasks

      });
    }
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  generateID() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4();
  }
  onToggle = () => {
    if (this.state.isDisplayForm && this.state.taskEditing !== null) {
      this.setState({
        isDisplayForm: true,
        taskEditing: null
      });
    } else {
      this.setState({
        isDisplayForm: !this.state.isDisplayForm,
        taskEditing: null
      });
    }
  }
  onCloseForm = () => {
    this.setState({
      isDisplayForm: false
    });
  }
  onSubmit = (data) => {
    // danh sach task
    var { tasks } = this.state;
    if (data.id === '') {
      data.id = this.generateID();
      tasks.push(data);
    } else {
      // Editing
      var index = this.findindex(data.id);
      tasks[index] = data;
    }
    this.setState({
      tasks: tasks,
      taskEditing: null
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  onUpdateStatus = (id) => {
    var { tasks } = this.state;
  //  var index = this.findindex(id);
  // lodash
  var index = _.findIndex(tasks, (task) =>{
    return task.id === id;
  });
 ///   if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
  //  }
  }
  onDelete = (id) => {
    var { tasks } = this.state;
    var index = this.findindex(id);
    if (index !== -1) {
      // splice phuong thc xoa trong js| xoa 1 phan tu 
      tasks.splice(index, 1);
      this.setState({
        tasks: tasks
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // xoa xog dong form
    this.onCloseForm();
  }
  onUpdate = (id) => {
    //console.log(id);
    var { tasks } = this.state;
    var index = this.findindex(id);
    var taskEditing = tasks[index];
    this.setState({
      taskEditing: taskEditing
    });
    this.onShowForm();
  }
  onFilter = (filterName, filterStatus) => {
    // console.log(filterName, '-',filterStatus);
    filterStatus = parseInt(filterStatus, 10);
    this.setState({
      filter: {
        name: filterName.toLowerCase(),
        status: filterStatus
      }
    })

  }
  onSort = (sortBy, sortValue) =>{
    this.setState({
        sortBy: sortBy,
        sortValue :sortValue
    });
    console.log(this.state.sort);
  }
  onShowForm = () => {
    this.setState({
      isDisplayForm: true
    });
  }
  // Search
  onSearch = (keyword) =>{
   this.setState({  
     keyword
   });
  }
  // get id in array
  findindex = (id) => {
    var { tasks } = this.state;
    var result = -1;
    tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result;
  }
  render() {
    // data task
    var { tasks, isDisplayForm, taskEditing, filter, keyword, sortBy, sortValue } = this.state; // var tasks = this.state.tasks
    //  filter 
    if (filter) {
      if (filter.name) {
        tasks = tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }
      // if(filter.status){ // null | !=0 | undefind
        tasks = tasks.filter((task) =>{
          if(filter.status === -1){
            return task;
          }else{
            return task.status === ( filter.status === 1 ? true : false );
          }
        });
     // }
    }
    // khong tim duoc
    // if(keyword){
    //   console.log(keyword);
    //   tasks = tasks.filter((task) => {
    //     console.log(task.name.toLowerCase().indexOf(keyword) !== -1);
    //   });
    // }


    // lodash
    tasks = _.filter(tasks, (task)=>{
      return task.name.toLowerCase().indexOf(keyword)!== -1;
    });
    if(sortBy === 'name'){
      tasks.sort((a, b) =>{
        if(a.name > b.name) return sortValue;
        else if(a.name < b.name) return -sortValue;
        else return 0;
      });
    }else{
      tasks.sort((a, b) =>{
        if(a.status > b.status) return -sortValue;
        else if(a.status < b.status) return sortValue;
        else return 0;
      });
    }
    // Nhan du lieu tu task form
    var elementsform = isDisplayForm ? <TaskForm
      onSubmit={this.onSubmit}
      onCloseForm={this.onCloseForm}
      //  truyen gia tri object vao form
      task={taskEditing}
      onSetUpdate={this.onSetUpdate}
    /> : ''; // isDisplayForm === true ? <TaskForm/> : '';
    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>
          <hr />
        </div>
        <div className="row">
          <div className={isDisplayForm ? 'col-xs-4 col-sm-4 col-md-4 col-lg-4' : ''}>
            {/* Task Form */}
            {elementsform}
          </div>
          <div className={isDisplayForm ? 'col-xs-8 col-sm-8 col-md-8 col-lg-8 p3' : 'col-xs-12 col-sm-12 col-md-12 col-lg-12 p3'}>
            <button type="button" className="btn btn-primary" onClick={this.onToggle}>
              Thêm Công Việc
                </button>
            {/* Search-Sort */}
            <Controll 
            onSearch = {this.onSearch}
            onSort = {this.onSort}
            sortBy={sortBy}
            sortValue={sortValue}
            />
            {/* Table Controll */}
            <TableControll tasks={tasks}
              onUpdateStatus={this.onUpdateStatus}
              onDelete={this.onDelete}
              onUpdate={this.onUpdate}
              onFilter={this.onFilter}
             
            />

          </div>
        </div>
      </div>
    );
  }
}

export default App;
