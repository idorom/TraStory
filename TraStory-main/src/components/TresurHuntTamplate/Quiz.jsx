import React from 'react';
// import dataFrom from '../../data/data';
import Answers from './Answers';
import { Link, withRouter } from 'react-router-dom'; 
import './Quiz.css';

//From: https://github.com/florinpop17/quiz-app
class Quiz extends React.Component {    
    constructor(props) {
        super(props);
       
        this.state = {
            qNum: this.props.myqNum,
            total: this.props.totalQuestions,
            showButton: false,
            questionAnswered: false,
            score: this.props.myScore,
            lastscore: this.props.myScore,
            isOnlyQuiz: this.props.isOnlyQuiz,
            thID: this.props.thID,
            dataQuestions: this.props.dataQuestions
            // displayPopup: 'flex'
        }
        // alert("qnum "+this.state.qNum);
        this.nextQuestion = this.nextQuestion.bind(this);
        this.handleShowButton = this.handleShowButton.bind(this);
        this.handleStartQuiz = this.handleStartQuiz.bind(this);
        this.handleIncreaseScore = this.handleIncreaseScore.bind(this);        
    }
    
    pushData(qNum,dataQuestions) {
        this.setState({
            question: dataQuestions.question,
            answers: [dataQuestions.answers[0], dataQuestions.answers[1], dataQuestions.answers[2], dataQuestions.answers[3]],
            correct: dataQuestions.correct,
            qNum: this.state.qNum + 1
        });
    }


    componentWillMount() {        
        let {qNum, dataQuestions} = this.state;
        this.pushData(qNum,dataQuestions);
    }

    nextQuestion() {
        let {qNum, total, score, dataQuestions} = this.state;
        // alert(qNum)
         if(qNum === total){     
            //התחלף בהמשך לדף שמודיעה על הציון וסיום המשחק
            alert("הציון שלך הוא "+score);
            this.setState({
                // displayPopup: 'flex'
                qNum:1
            });
            this.props.history.push({pathname: '/tresurHuntOnly'})
        } 
        else {
            this.pushData(qNum,dataQuestions);

            this.setState({
                // showButton: false,
                questionAnswered: false
            });
        }
    }
        

    handleShowButton() {
        let {isOnlyQuiz, qNum, lastscore,thID}=this.state;
        
        if(isOnlyQuiz){
            this.setState({
                // showButton: true,
                questionAnswered: true
            })            
            this.nextQuestion();
            this.setState({
                // showButton: false,
                questionAnswered: false
            });
        }
        else{
            this.setState({
                // showButton: true,
                questionAnswered: true
            })
            new Promise(resolve => setTimeout(resolve, 600)).then(()=>{                
                this.props.history.push({
                    pathname: `/treasureHunt/${thID}`,
                    state: {
                        score:this.state.score, qNum:(qNum+1) ,isFlag:true, prevAnswer:(lastscore!==this.state.score), isJustAnswerd:true
                    },
                })
            })
        }
    }

    handleStartQuiz() {
        this.setState({
            // displayPopup: 'none',
            qNum: 1
        });
    }

    handleIncreaseScore() {
        this.setState({
            score: this.state.score + 1
        });
    }

    render() {
        let { qNum, total, question, answers, correct, showButton, questionAnswered, isOnlyQuiz, score} = this.state;

        return (            
            <div className="container quizBody">
                <br />
                 <div className="row">
                    <div className="col-lg-10 col-lg-offset-1">
                        <div id="question">
                            <h4>שאלה {qNum+1}/{total}</h4>
                            <p>{question}</p>
                        </div>
                        <Answers answers={answers} correct={correct} showButton={this.handleShowButton}
                         isAnswered={questionAnswered} increaseScore={this.handleIncreaseScore}/>   
                    </div>
                </div>
            </div>
        );
    }
}; 

export default withRouter(Quiz)

                        {/* {isOnlyQuiz ?
                        <div id="submit">
                            {showButton ? <button className="fancy-btn" onClick={this.nextQuestion}>{qNum===total ? 'סיימת את המשחק' : 'מצא את המקום הבאה'}</button> : null}
                        </div> 
                        : 
                        <div id="submit">
                            {showButton ? <Link to={{
                                pathname: '/clue',
                                state: {
                                    score: score, qNum: (qNum+1) , isFlag:true
                                },
                                }}><button type="button" className="fancy-btn">{qNum===total ? 'סיימת את המשחק' : 'מצא את המקום הבאה'}</button></Link>: null}
                        </div>} */}