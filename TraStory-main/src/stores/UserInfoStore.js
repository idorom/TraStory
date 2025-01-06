import firebase from "../Firebase";
import { observable, action } from "mobx";

//Get user with all his data include games and likes
const getUser = async (userObs, uid) => {
  try {
    const response = firebase.firestore().collection("users").doc(uid);
    const userData = await response.get();

    let userSignIn = userData.data();
    userSignIn.id = uid;
    await getUserPlayedGames(uid).then((playedGamesData) => {
      userSignIn.playedGames = playedGamesData;
    });
    await getUserlikedStories(uid).then((storyLikesData) => {
      userSignIn.storyLikes = storyLikesData;
    });
    await getUserlikedGames(uid).then((likedGamesData) => {
      userSignIn.likedGames = likedGamesData;
    });

    userObs.setUser(userSignIn);
  } catch (e) {
    console.log("e", e);
    return;
  }
};

//get user likes of stories AND Games
const getNewLikes = async (userObs, user) => {
  try {
    await getUserlikedStories(user.id).then((storyLikesData) => {
      user.storyLikes = storyLikesData;
    });
    await getUserlikedGames(user.id).then((likedGamesData) => {
      user.likedGames = likedGamesData;
    });

    userObs.setUser(user);
  } catch (e) {
    console.log("e", e);
    return;
  }
};

//Helper method- get user "LikedStories"
const getUserlikedStories = async (uid) => {
  try {
    const response = firebase.firestore().collection("users").doc(uid).collection("LikedStories");
    const storyData = await response.get();
    let userSignInStoriesData = {};
    storyData.docs.forEach((item) => {
      userSignInStoriesData[`${item.id}`] = item.data();
    });
    return userSignInStoriesData;
  } catch (e) {
    console.log("e", e);
    return null;
  }
};

//Helper method- get user "LikedGames"
const getUserlikedGames = async (uid) => {
  try {
    const response = firebase.firestore().collection("users").doc(uid).collection("LikedGames");
    const gamesLikesData = await response.get();
    let userSignInLikedGamesData = {};
    gamesLikesData.docs.forEach((item) => {
      userSignInLikedGamesData[`${item.id}`] = item.data();
    });
    return userSignInLikedGamesData;
  } catch (e) {
    console.log("e", e);
    return null;
  }
};

//Helper method- get user "playedGames"
const getUserPlayedGames = async (uid) => {
  try {
    const response = firebase.firestore().collection("users").doc(uid).collection("playedGames");
    const gameData = await response.get();
    let userSignInGamesData = {};
    gameData.docs.forEach((item) => {
      userSignInGamesData[`${item.id}`] = item.data();
      userSignInGamesData[`${item.id}`].GameAdvance = parseInt((userSignInGamesData[`${item.id}`].qNum / userSignInGamesData[`${item.id}`].numOfQuestions) * 100);
    });
    return userSignInGamesData;
  } catch (e) {
    console.log("e", e);
    return null;
  }
};

const getUserTreasureHunt = async (userObs, userID, treasureHuntID) => {};

const getTreasureHunt = async (inTreasureHuntObs, treasureHuntID) => {
  try {
    const response = firebase.firestore().collection("TreasureHunt").doc(treasureHuntID);
    const treasureHuntData = await response.get();
    let treasureHunt = treasureHuntData.data();
    if (treasureHunt) {
      treasureHunt.id = treasureHuntID;
      inTreasureHuntObs.setTreasureHunt(treasureHunt);
    }
  } catch (e) {
    console.log("e", e);
    return;
  }
};

//Store
class UserInfoStore {
  //register user observable
  userObs = observable({
    user: null,
    signInUser: action(async function (currentUser) {
      if (!this.user) {
        //get info from firebase user
        await getUser(this, currentUser.uid).then(() => {
          return this.user;
        });
      } else {
        //Already exsit user
        return this.user;
      }
    }),

    setUser: action(function (userSignIn) {
      return (this.user = userSignIn);
    }),

    updateUserParameters: action(function (parameters) {
      this.user.playedGames[`${parameters.treasureHuntID}`] = {
        qNum: parameters.qnum,
        boolStartGame: parameters.boolStartGame,
        flag: true,
        prevAnswer: parameters.prevAnswer,
        score: parameters.score,
      };
    }),

    get userInfo() {
      return this.user;
    },

    //TH played Methods
    setUserGameProgress: action(async function (user, data, totalQuestions, boolStartGame, treasureHuntID) {
      user.playedGames[`${treasureHuntID}`] = { qNum: 0, numOfQuestions: data.gameList.length, quizName: data?.quizName, boolStartGame: boolStartGame, score: 0, GameAdvance: 0 };
      this.user = user;
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(user.id)
          .collection("playedGames")
          .doc(treasureHuntID)
          .set({
            qNum: 0,
            numOfQuestions: user.playedGames[`${treasureHuntID}`].numOfQuestions,
            quizName: data.quizName,
            boolStartGame: boolStartGame,
            score: 0,
          });
      } catch (e) {
        console.log(e);
        return null;
      }
      return this.user;
    }),

    updateUserGameProgress: action(async function (user, parameters, data, totalQuestions, boolStartGame) {
      user.playedGames[`${parameters.treasureHuntID}`] = {
        qNum: parameters.qNum + 1,
        numOfQuestions: data.gameList.length,
        quizName: data?.quizName,
        boolStartGame: boolStartGame,
        prevAnswer: parameters.prevAnswer,
        score: parameters.score,
        GameAdvance: parseInt(((parameters.qNum + 1) / data.gameList.length) * 100),
      };
      this.user = user;
      try {
        await firebase
          .firestore()
          .collection("users")
          .doc(user.id)
          .collection("playedGames")
          .doc(parameters.treasureHuntID)
          .update({
            qNum: parameters.qNum + 1,
            score: parameters.score,
            prevAnswer: parameters.prevAnswer,
          });
      } catch (e) {
        console.log(e);
        return null;
      }
      return this.user;
    }),

    getUserTreasureHunt: action(async function (userID, treasureHuntID) {
      if (!this.user) {
        //get info from firebase TreasureHunt
        await getUserTreasureHunt(this, userID, treasureHuntID).then(() => {
          return this.user;
        });
      } else {
        //Already exsit TreasureHunt
        return this.user;
      }
    }),

    //TH Cards Methods
    updatesLikesTH: action(async function (user, thID, likesnum, addOrRemove) {
      try {
        const batch = firebase.firestore().batch();
        const sfRef = firebase.firestore().collection("TreasureHunt").doc(thID).collection("gameLikes").doc(user.id);
        const sfRef1 = firebase.firestore().collection("TreasureHunt").doc(thID);
        const sfRef2 = firebase.firestore().collection("users").doc(user.id).collection("LikedGames").doc(thID);
        //if add a like
        if (addOrRemove === true) {
          batch.set(sfRef, {});
          batch.set(sfRef2, {});
          batch.update(sfRef1, {
            treasureHuntLikesNum: likesnum,
          });
          await batch.commit();
          this.user.likedGames[thID] = {};
        } else {
          //if remove a like
          batch.delete(sfRef);
          batch.update(sfRef1, {
            treasureHuntLikesNum: likesnum,
          });
          batch.delete(sfRef2);
          await batch.commit();
          this.user.likedGames[thID] = null;
        }
      } catch (e) {
        console.log(e);
        return null;
      }
      return this.user;
    }),

    //Story Cards Methods
    updatesLikesStory: action(async function (user, sID, likesnum, addOrRemove) {
      try {
        const batch = firebase.firestore().batch();
        const sfRef = firebase.firestore().collection("Stories").doc(sID).collection("storyLikes").doc(user.id);
        const sfRef1 = firebase.firestore().collection("Stories").doc(sID);
        const sfRef2 = firebase.firestore().collection("users").doc(user.id).collection("LikedStories").doc(sID);
        //if add a like
        if (addOrRemove === true) {
          batch.set(sfRef, {});
          batch.set(sfRef2, {});
          batch.update(sfRef1, {
            storyLikesNum: likesnum,
          });
          await batch.commit();
          this.user.storyLikes[sID] = {};
        } else {
          //if remove a like
          batch.delete(sfRef);
          batch.update(sfRef1, {
            storyLikesNum: likesnum,
          });
          batch.delete(sfRef2);
          await batch.commit();
          this.user.storyLikes[sID] = null;
        }
      } catch (e) {
        console.log(e);
        return null;
      }
      return this.user;
    }),

    //get updated likes
    getNewLikesForUser: action(async function () {
      try {
        await getNewLikes(this, this.user);
      } catch (e) {
        console.log(e);
        return null;
      }
      return this.user;
    }),
  });

  //inTreasureHuntObs observable- for game played now
  inTreasureHuntObs = observable({
    treasureHunt: null,
    setTreasureHunt: action(function (treasureHunt) {
      this.treasureHunt = treasureHunt;
    }),

    get getTreasureHunt() {
      return this.treasureHunt;
    },

    initTreasureHunt: action(async function (treasureHuntID) {
      //get info from firebase treasureHunt
      await getTreasureHunt(this, treasureHuntID).then(() => {
        return this.treasureHunt;
      });
    }),

    resetTH: action(function () {
      this.treasureHunt = null;
    }),
  });

  //unregistered user observable
  userUnregisteredObs = observable({
    userUnregistered: null,
    signInUser: action(function () {
      if (!this.userUnregistered) {
        //intialiezed userUnregistered
        this.userUnregistered = {};
      }
      return this.userUnregistered;
    }),

    setUser: action(function (userUnregistered) {
      return (this.userUnregistered = userUnregistered);
    }),

    updateUserParameters: action(function (parameters) {
      this.userUnregistered.playedGames[`${parameters.treasureHuntID}`] = {
        qNum: parameters.qnum,
        boolStartGame: parameters.boolStartGame,
        flag: true,
        prevAnswer: parameters.prevAnswer,
        score: parameters.score,
      };
    }),

    get userInfo() {
      return this.userUnregistered;
    },

    //TH played Methods
    setUserGameProgress: action(function (userUnregistered, data, totalQuestions, boolStartGame, treasureHuntID) {
      userUnregistered.playedGames = {};
      userUnregistered.playedGames[`${treasureHuntID}`] = { qNum: 0, numOfQuestions: data.gameList.length, quizName: data.quizName, boolStartGame: boolStartGame, score: 0 };
      this.userUnregistered = userUnregistered;
      return this.userUnregistered;
    }),

    updateUserGameProgress: action(function (userUnregistered, parameters, data, totalQuestions, boolStartGame) {
      userUnregistered.playedGames[`${parameters.treasureHuntID}`] = {
        qNum: parameters.qNum + 1,
        numOfQuestions: data.gameList.length,
        quizName: data.quizName,
        boolStartGame: boolStartGame,
        prevAnswer: parameters.prevAnswer,
        score: parameters.score,
      };
      this.user = userUnregistered;
      return this.userUnregistered;
    }),

    getUserTreasureHunt: action(function (userID, treasureHuntID) {
      // if(!this.user){
      //   await getUserTreasureHunt(this,userID,treasureHuntID).then(()=>{
      //     console.log("get info from firebase TreasureHunt",this.user);
      //     return this.user;
      //   });
      // }
      // else {
      //   console.log("Already exsit TreasureHunt",this.user);
      //   return this.user;
      // }
    }),
  });
}

export default UserInfoStore;
