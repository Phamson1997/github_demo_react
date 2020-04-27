import React from 'react';

class TaskForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            name: '',
            status: false
        }
    }
    // Chi thuc thi 1 lan sau khi goi form
    componentWillMount() {
        // console.log(this.props.task)
        if (this.props.task) {
            this.setState({
                id: this.props.task.id,
                name: this.props.task.name,
                status: this.props.task.status
            });
            console.log(this.props.state);
        }
    }
    // co the thu thi nhieu lan
    componentWillReceiveProps(nextprops) {
        if (nextprops && nextprops.task) {
            this.setState({
                id: nextprops.id,
                name: nextprops.name,
                status: nextprops.status
            });
            console.log(this.props.state);
        } else if (nextprops && nextprops.task === null) {
            this.setState({
                id: '',
                name: '',
                status: false
            });
        }
    }
    onChangeHand = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        // chua hieu lsm
        if (name === 'status') {
            value = target.value === 'true' ? true : false;
        }
        this.setState({ [name]: value });
    }

    onSubmit = (event) => {
        event.preventDefault();
        // truyen du lieu thong qua props ra App
        // truyen du lieu kieu boolean
        this.props.onSubmit(this.state);
        //console.log(this.state);
        this.onClear();
        this.onCloseForms();
    }
    onCloseForms = () => {
        // Truyen du lieu ra function onCloseForm trong App.js
        this.props.onCloseForm();
    }
    onClear = () => {
        this.setState({
            name: '',
            status: false
        });
    }
    render() {
        var { id } = this.state;
        return (
            <div className="panel panel-warning">
                <div className="panel-heading">
                    <h3 className="panel-title">{id !== '' ? 'Sua Cong Viec' : 'Them Cong Viec'}
                        <span className="fa fa-times-circle text-right mr-auto" onClick={this.onCloseForms}></span></h3>

                </div>
                <div className="panel-body">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Tên :</label>
                            <input type="text"
                                className="form-control"
                                name="name"
                                value={this.state.name}
                                onChange={this.onChangeHand} />
                        </div>
                        <label>Trạng Thái :</label>
                        <select className="form-control"
                            required="required"
                            name="status"
                            value={this.state.status}
                            onChange={this.onChangeHand}>
                            <option value={true}>Kích Hoạt</option>
                            <option value={false}>Ẩn</option>
                        </select>
                        <br />
                        <div className="text-center">
                            <button type="submit" className="btn btn-warning">Thêm</button>&nbsp;
                        <button type="submit" className="btn btn-danger" onClick={this.onClear}>Hủy Bỏ</button>

                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default TaskForm;
