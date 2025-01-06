import React from 'react';

//From: https://github.com/florinpop17/quiz-app
class Answers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAnswered: props.questionAnswered,
            classNames: ['', '', '', '']
        }
        this.checkAnswer = this.checkAnswer.bind(this);
    }
    
    checkAnswer(e) {
        let { isAnswered } = this.props;
        
        if(!isAnswered) {
            let elem = e.currentTarget;
            let { correct, increaseScore } = this.props;
            let answer = Number(elem.dataset.id);
            let updatedClassNames = this.state.classNames;

            if(answer === correct){
                updatedClassNames[answer-1] = 'right';
                increaseScore();
            }
            else {
                updatedClassNames[answer-1] = 'wrong';
                updatedClassNames[correct-1] = 'right';
            }
            
            this.setState({
                classNames: updatedClassNames,
                isAnswered: true
            })
            new Promise(resolve => setTimeout(resolve, 600)).then(()=>{
                this.setState({
                    classNames: ['', '', '', '']
                });
                this.props.showButton();
            })  
        }
    }
    
    shouldComponentUpdate() {
        if (!this.state) {
            this.setState({
                classNames: ['', '', '', '']
            });
        }
        return true;
    }
    
    render() {
        let { answers } = this.props;
        let { classNames,isAnswered } = this.state;
  
        return (
            <div id="answers">
                <ul>
                    <button onClick={this.checkAnswer} disabled={isAnswered} className={classNames[0]} data-id="1"><span>א</span> <p>{answers[0]}</p></button>
                    <button onClick={this.checkAnswer} disabled={isAnswered} className={classNames[1]} data-id="2"><span>ב</span> <p>{answers[1]}</p></button>
                    <button onClick={this.checkAnswer} disabled={isAnswered} className={classNames[2]} data-id="3"><span>ג</span> <p>{answers[2]}</p></button>
                    <button onClick={this.checkAnswer} disabled={isAnswered} className={classNames[3]} data-id="4"><span>ד</span> <p>{answers[3]}</p></button>
                </ul>
            </div>
        );
    }
}
export default Answers