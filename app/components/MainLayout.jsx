import React from 'react';
import Header from './Header.jsx';
import NavBar from './NavBar.jsx';
import Footer from './Footer.jsx';
import Home from './Home.jsx';
import Tasks from './Tasks.jsx';
import About from './About.jsx';
import Notifications, {notify} from 'react-notify-toast';
import TimerStatStore from '../stores/TimerStatStore';
import TaskStore from '../stores/TaskStore';

class MainLayout extends React.Component{
    constructor(props) {
        super(props);

        this.handleTimerStatChange = this.handleTimerStatChange.bind(this);
    }

    componentWillMount() {
        TimerStatStore.on('change', this.handleTimerStatChange);
    }

    componentWillUnmount() {
        TimerStatStore.removeListener('change', this.handleTimerStatChange);
    }

    handleTimerStatChange() {
        if (TimerStatStore.isTimerExpired()) {
            let timerStat = TimerStatStore.getPreviousTimerStat();

            if (timerStat){
                let task = TaskStore.getTask(timerStat.taskId);

                if (task){
                    let myColor = { background: '#50D10F', text: '#FFFFFF' };
                    notify.show(`Timer for ${task.Name} completed.`, 'custom', 10000, myColor);
                }
            }
        }   
    }

    render() {       
        return ( 
            <div>
                <Notifications />
                <Header />
                <NavBar />              
                {this.props.children}
                <Footer />
            </div>
        ); 
    }
};

export default MainLayout;
