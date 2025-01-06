import firebase from "../Firebase";
import { observable, action } from "mobx";

//---------Sites:----------
//Get all sites
const fetchSites = async (siteObs) => {
  try {
    const response = firebase.firestore().collection("Sites");
    const data = await response.get();
    let temp = [];
    data.docs.forEach((item) => {
      let siteTemp = item.data();
      siteTemp.id = item.id;
      temp.push(siteTemp);
    });
    return await temp;
  } catch (e) {
    console.log(e);
    return;
  }
};

//Decline selected sites
const declineAllSitesMain = async (siteObs, sitesToChange) => {
  try {
    await declineAllSites(sitesToChange).then(async () => {
      console.log("File deleted successfully");
      siteObs.initSites();
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

//Helper method: to declineAllSitesMain(), decline/remove a site and it's data
async function declineAllSites(sitesToChange) {
  try {
    for (const site of sitesToChange) {
      await removeSiteCollectionsData(site).then(async () => {
        let siteName = site.siteName;
        await removeAllSiteTreasureHunt(siteName).then(() => {});
        await firebase.firestore().collection("Sites").doc(site.id).delete();
      });
    }
  } catch (e) {
    console.log(e);
    return;
  }
}

//Helper method: to declineAllSites(), remove a subSite of a site and it's data
async function removeSiteCollectionsData(site) {
  try {
    const response = firebase.firestore().collection("Sites").doc(site.id).collection("subSites");
    const data = await response.get();
    await Promise.all(
      data.docs.forEach(async (subSite) => {
        //using removeSubSiteCollectionsData (also a helper method  of delete site's data)
        await removeSubSiteCollectionsData(subSite, site.id).then(async () => {
          let subSiteName = subSite.data().placeName;
          try {
            await firebase.firestore().collection("Sites").doc(site.id).collection("subSites").doc(subSite.id).delete();
          } catch (e) {
            console(e);
          }
          await removeAllSubSiteStories(subSiteName);
        });
      })
    );
  } catch (e) {
    console.log(e);
    return;
  }
}

//Helper method: to removeAllSubSiteStories(), remove for all stories of this subsite
async function removeAllSubSiteStories(subSiteName) {
  try {
    const data = await firebase.firestore().collection("Stories").where("placeName", "==", `${subSiteName}`).get();
    await Promise.all(
      data.docs.forEach(async (story) => {
        await declineStory(story).then({});
      })
    );
  } catch (e) {
    console.log(e);
    return;
  }
}

//Helper method: to removeAllSubSiteStories(), remove for all stories of this subsite
async function removeAllSiteTreasureHunt(siteName) {
  try {
    await firebase
      .firestore()
      .collection("TreasureHunt")
      .where("siteName", "==", `${siteName}`)
      .get()
      .then(async (docs) => {
        let temp = [];
        docs.forEach((th) => {
          let THtemp = {};
          THtemp.siteName = th.data();
          THtemp.id = th.id;
          temp.push(THtemp);
        });
        await declineTreasureHunt(temp).then({});
      });
  } catch (e) {
    console.log(e);
    return;
  }
}

//Helper method: to removeSiteCollectionsData(), remove for a subSite all of it's data
async function removeSubSiteCollectionsData(subSite, siteID) {
  try {
    await removeCluesOFSubSiteData(subSite.id, siteID).then(async () => {
      await removeQustionsOFSubSiteData(subSite.id, siteID).then(async () => {
        return;
      });
    });
  } catch (e) {
    console.log(e);
    await removeQustionsOFSubSiteData(subSite.id, siteID).then(async () => {
      return;
    });
    return;
  }
}
//Helper method: to removeSubSiteCollectionsData(), remove for a subSite all of it's clues
async function removeCluesOFSubSiteData(subSiteID, siteID) {
  try {
    const response = firebase.firestore().collection("Sites").doc(siteID).collection("subSites").doc(subSiteID).collection("clues");
    const data = await response.get();
    await Promise.all(
      data.docs.forEach(async (clue) => {
        await firebase.firestore().collection("Sites").doc(siteID).collection("subSites").doc(subSiteID).collection("clues").doc(clue.id).delete();
      })
    );
  } catch (e) {
    console.log(e);
    return;
  }
}
//Helper method: to removeSubSiteCollectionsData(), remove for a subSite all of it's questions
async function removeQustionsOFSubSiteData(subSiteID, siteID) {
  try {
    const response = firebase.firestore().collection("Sites").doc(siteID).collection("subSites").doc(subSiteID).collection("questions");
    const data = await response.get();
    await Promise.all(
      data.docs.forEach(async (question) => {
        await firebase.firestore().collection("Sites").doc(siteID).collection("subSites").doc(subSiteID).collection("questions").doc(question.id).delete();
      })
    );
  } catch (e) {
    console.log(e);
    return;
  }
}
//-------------------

//---------subSites:----------
//Get subSites of a spesific site
const fetchSubSites = async (subSiteObs, siteID) => {
  try {
    const response = firebase.firestore().collection("Sites").doc(siteID).collection("subSites");
    const data = await response.get();
    data.docs.forEach((item) => {
      let subsiteTemp = item.data();
      subsiteTemp.id = item.id;
      console.log("subsite", subsiteTemp);
      subSiteObs.addSubSite(subsiteTemp);
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

//Get all subSites
const fetchAllSubSites = async (subSiteObs) => {
  try {
    const response = firebase.firestore().collectionGroup("subSites");
    const data = await response.get();
    data.docs.forEach((item) => {
      let subsiteTemp = item.data();
      subsiteTemp.id = item.id;
      subSiteObs.addSubSite(subsiteTemp);
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

// Decline selected sites
const declineSubSite = async (subSiteObs, subSitesToChange) => {
  try {
    await Promise.all(
      subSitesToChange.forEach(async (subSite) => {
        //using removeSubSiteCollectionsData (also a helper method  of delete site's data)
        await removeSubSiteCollectionsData(subSite, subSite.siteID).then(async () => {
          try {
            //delete all subsites stories
            await removeAllSubSiteStories(subSite.placeName);
          } catch (e) {
            console.log(e);
          }
          await firebase.firestore().collection("Sites").doc(subSite.siteID).collection("subSites").doc(subSite.id).delete();
        });
      })
    ).then(async () => {
      subSiteObs.initAllSubSites();
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

//----------Sub Site Data-------------
//Get SubSite info
const fetchSubSite = async (subSiteObs, siteID, subSiteID) => {
  try {
    let subSiteTemp = { siteData: null, subSiteData: null };
    const response1 = firebase.firestore().collection("Sites").doc(siteID);
    const siteData = await response1.get();
    const response2 = firebase.firestore().collection("Sites").doc(siteID).collection("subSites").doc(subSiteID);
    const subSiteData = await response2.get();
    subSiteTemp = { siteData: siteData.data(), subSiteData: subSiteData.data() };
    subSiteObs.setSubSiteinfo(subSiteTemp);
  } catch (e) {
    console.log("error_fetchSubSite", e);
    return;
  }
};
//Helper method- Get site info
const fetchSiteInfo = async (subSiteObs, siteID) => {
  try {
    let subSiteTemp = { siteData: null, subSiteData: null };
    const response1 = firebase.firestore().collection("Sites").doc(siteID);
    const siteData = await response1.get();
    subSiteTemp = { siteData: siteData.data() };
    subSiteObs.setSubSiteinfo(subSiteTemp);
  } catch (e) {
    console.log("error_fetchSiteInfo", e);
    return;
  }
};
//-------------------

//---------Clues:----------
//Get clues of specific subSites
const fetchClues = async (clueObs, siteID, subSiteID) => {
  try {
    const response = firebase.firestore().collection("Sites").doc(siteID).collection("subSites").doc(subSiteID).collection("clues");
    const data = await response.get();
    data.docs.forEach((item) => {
      let clueTemp = item.data();
      clueTemp.id = item.id;
      clueTemp.subSiteID = subSiteID;
      clueTemp.siteID = siteID;
      //If not need to be isOnlyAprrove OR need to be isOnlyAprrove and the clueTemp aprroved
      if (clueTemp.isApproved) {
        clueObs.addClue(clueTemp);
      }
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

//Get All clues
const fetchAllClues = async (clueObs) => {
  try {
    const response = firebase.firestore().collectionGroup("clues");
    const data = await response.get();
    data.docs.forEach((item) => {
      let clueTemp = item.data();
      clueTemp.id = item.id;

      clueTemp.path = item.ref.path;
      let arrayPath = clueTemp.path.split("/");
      let sizeUrl = arrayPath.length;
      clueTemp.siteID = arrayPath[sizeUrl - 5];
      clueTemp.subSiteID = arrayPath[sizeUrl - 3];
      clueObs.addClue(clueTemp);
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

// Approve selected clues
const approveClues = async (clueObs, cluesToChange) => {
  try {
    const batch = firebase.firestore().batch();
    cluesToChange.forEach((item) => {
      let arrayPath = item.path.split("/");
      let sizeUrl = arrayPath.length;
      const sfRef = firebase
        .firestore()
        .collection("Sites")
        .doc(arrayPath[sizeUrl - 5])
        .collection("subSites")
        .doc(arrayPath[sizeUrl - 3])
        .collection("clues")
        .doc(arrayPath[sizeUrl - 1]);
      batch.update(sfRef, {
        isApproved: true,
      });
    });
    await batch.commit();
  } catch (e) {
    console.log(e);
    return;
  }
};

// Decline selected clues
const declineClues = async (clueObs, cluesToChange) => {
  try {
    for (const item of cluesToChange) {
      await firebase.firestore().collection("Sites").doc(item.siteID).collection("subSites").doc(item.subSiteID).collection("clues").doc(item.id).delete();
    }
  } catch (e) {
    console.log(e);
    return;
  }
};
//-------------------

//---------Questions:----------
//Get All questions
const fetchQuestions = async (questionObs, siteID, subSiteID) => {
  try {
    const response = firebase.firestore().collection("Sites").doc(siteID).collection("subSites").doc(subSiteID).collection("questions");
    const data = await response.get();
    data.docs.forEach((item) => {
      let questionTemp = item.data();
      questionTemp.id = item.id;
      questionTemp.siteID = siteID;
      questionTemp.subSiteID = subSiteID;
      //If not need to be isOnlyAprrove OR need to be isOnlyAprrove and the questionTemp aprroved
      if (questionTemp.isApproved) {
        questionObs.addQuestion(questionTemp);
      }
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

// Get all questions
const fetchAllQuestions = async (questionObs) => {
  try {
    const response = firebase.firestore().collectionGroup("questions");
    const data = await response.get();
    data.docs.forEach((item) => {
      let questionTemp = item.data();
      questionTemp.id = item.id;
      questionTemp.path = item.ref.path;
      let arrayPath = questionTemp.path.split("/");
      let sizeUrl = arrayPath.length;
      questionTemp.siteID = arrayPath[sizeUrl - 5];
      questionTemp.subSiteID = arrayPath[sizeUrl - 3];
      questionObs.addQuestion(questionTemp);
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

// Approve selected questions
const approveQuestions = async (questionObs, questionsToChange) => {
  try {
    const batch = firebase.firestore().batch();
    questionsToChange.forEach((item) => {
      let arrayPath = item.path.split("/");
      let sizeUrl = arrayPath.length;
      const sfRef = firebase
        .firestore()
        .collection("Sites")
        .doc(arrayPath[sizeUrl - 5])
        .collection("subSites")
        .doc(arrayPath[sizeUrl - 3])
        .collection("questions")
        .doc(arrayPath[sizeUrl - 1]);
      batch.update(sfRef, {
        isApproved: true,
      });
    });
    await batch.commit();
  } catch (e) {
    console.log(e);
    return;
  }
};

// Approve selected questions
const declineQuestions = async (questionObs, questionsToChange) => {
  try {
    for (const item of questionsToChange) {
      await firebase.firestore().collection("Sites").doc(item.siteID).collection("subSites").doc(item.subSiteID).collection("questions").doc(item.id).delete();
    }
  } catch (e) {
    console.log(e);
    return;
  }
};

//---------stories:----------
//Get All stories
const fetchStories = async (storiesObs, isOnlyAprrove) => {
  try {
    const response = firebase.firestore().collection("Stories");
    const data = isOnlyAprrove ? await response.orderBy("storyLikesNum", "desc").get() : await response.get();
    let temp = [];
    data.docs.forEach((item) => {
      let storyTemp = item.data();
      storyTemp.id = item.id;
      //If not need to be isOnlyAprrove OR need to be isOnlyAprrove and the storyTemp aprroved
      if (!isOnlyAprrove || (isOnlyAprrove && storyTemp.isApproved)) {
        temp.push(storyTemp);
      }
    });
    return temp;
  } catch (e) {
    console.log(e);
    return;
  }
};

//---------Approve stories:----------
const approveStories = async (storyObs, storiesToChange) => {
  try {
    await approveTreasureHuntsOrStories(storiesToChange, "Stories");
  } catch (e) {
    console.log(e);
    return;
  }
};
//---------Decline stories:----------
const declineStories = async (storyObs, storiesToChange) => {
  try {
    await declineTreasureHuntOrStory(storiesToChange, "Stories", "storyLikes");
  } catch (e) {
    console.log(e);
    return;
  }
};

//---------Decline a story:----------
const declineStory = async (storiesToChange) => {
  try {
    const batch = firebase.firestore().batch();

    const sfReflikes = await firebase.firestore().collection("Stories").doc(storiesToChange.id).collection("storyLikes").get();
    const sfRef = firebase.firestore().collection("Stories").doc(storiesToChange.id);

    // delete users likes from their collections likes OR playedGames//
    await removeTreasureHuntFromAllTheUsers(storiesToChange.id, "Stories");

    if (storiesToChange.imageURL) {
      const desertRef = firebase.storage().refFromURL(storiesToChange.imageURL);
      await desertRef
        .delete()
        .then(function () {
          console.log("File deleted successfully");
        })
        .catch(function (error) {
          console.log("Uh-oh, an error occurred!");
        });
    }
    sfReflikes.docs.forEach((item) => {
      batch.delete(firebase.firestore().collection("Stories").doc(storiesToChange.id).collection("storyLikes").doc(item.id));
    });
    batch.delete(sfRef);
    await batch.commit();
  } catch (e) {
    console.log("e", e);
  }
};

//----------Treasure hunt games-------------
//Get TreasureHunts of a spesific site
const fetchTreasureHunt = async (treasureHuntObs, isOnlyAprrove) => {
  try {
    const response = firebase.firestore().collection("TreasureHunt");
    const data = isOnlyAprrove ? await response.orderBy("treasureHuntLikesNum", "desc").get() : await response.get();
    let temp = [];
    data.docs.forEach((item) => {
      let treasureHuntTemp = item.data();
      treasureHuntTemp.id = item.id;

      treasureHuntObs.addTreasureHunt(treasureHuntTemp);
      //If not need to be isOnlyAprrove OR need to be isOnlyAprrove and the storyTemp aprroved
      if (!isOnlyAprrove || (isOnlyAprrove && treasureHuntTemp.isApproved)) {
        temp.push(treasureHuntTemp);
      }
    });
    return temp;
  } catch (e) {
    console.log(e);
  }
};

//---------Approve Treasure Hunt games:----------
const approveTreasureHunt = async (treasureHuntObs, treasureHuntToChange) => {
  try {
    await approveTreasureHuntsOrStories(treasureHuntToChange, "TreasureHunt");
  } catch (e) {
    console.log(e);
    return;
  }
};
//---------Decline Treasure Hunt games:----------
const declineTreasureHunt = async (treasureHuntToChange) => {
  try {
    await declineTreasureHuntOrStory(treasureHuntToChange, "TreasureHunt", "gameLikes");
  } catch (e) {
    console.log(e);
  }
};

//Helper method: Decline list of TreasureHunts Or Stories
const declineTreasureHuntOrStory = async (items, TreasureHuntOrStory, likesCollection) => {
  try {
    const batch = firebase.firestore().batch();

    for (const item of items) {
      const sfRef = firebase.firestore().collection(TreasureHuntOrStory).doc(item.id);
      // delete users likes from their collections likes OR playedGames//
      await removeTreasureHuntFromAllTheUsers(item.id, TreasureHuntOrStory);
      // delete story's OR treasureHunt's likes//
      if (item?.treasureHuntLikesNum > 0 || item?.storyLikesNum > 0) {
        const sfReflikes = await firebase.firestore().collection(TreasureHuntOrStory).doc(item.id).collection(likesCollection).get();
        try {
          for (const like of sfReflikes.docs) {
            batch.delete(firebase.firestore().collection(TreasureHuntOrStory).doc(item.id).collection(likesCollection).doc(like.id));
          }
        } catch (e) {
          console.log(e);
        }
      }
      //delete treasureHunt's image if exist and not the site or subsite difualt image//
      if (item.imageURL && !item.imageURL.includes("siteImages") && !item.imageURL.includes("subSitesImages")) {
        const desertRef = firebase.storage().refFromURL(item.imageURL);
        desertRef
          .delete()
          .then(function () {
            console.log("File deleted successfully");
          })
          .catch(function (error) {
            console.log("Uh-oh, an error occurred!");
          });
      }
      batch.delete(sfRef);
    }
    await batch.commit();
  } catch (e) {
    console.log(e);
    return;
  }
};

//Helper method: Remove from collection from all users all the docs of the deleted "TreasureHuntOrStory"
const removeTreasureHuntFromAllTheUsers = async (itemID, TreasureHuntOrStory) => {
  try {
    //Remove all "LikedStories" with this "itemID"
    if (TreasureHuntOrStory === "Stories") {
      //get and
      const response = firebase.firestore().collectionGroup("LikedStories");
      const data = await response.get();
      let temp = [];
      data.docs.forEach((t) => {
        if (t.id === itemID) temp.push(t);
      });
      temp.forEach((item) => {
        let ItemPath = item.ref.path;
        try {
          const ref = firebase.firestore().doc(ItemPath);
          ref.delete();
        } catch (e) {
          console.log(e);
        }
      });
    } else {
      //Remove all "playedGames" with this "itemID"
      const response1 = firebase.firestore().collectionGroup("playedGames");
      const data1 = await response1.get();
      let temp1 = [];
      data1.docs.forEach((t) => {
        if (t.id === itemID) temp1.push(t);
      });
      temp1.forEach((item) => {
        let ItemPath = item.ref.path;
        try {
          const ref = firebase.firestore().doc(ItemPath);
          ref.delete();
        } catch (e) {
          console.log(e);
        }
      });
      //Remove all "LikedGames" with this "itemID"
      const response2 = firebase.firestore().collectionGroup("LikedGames");
      const data2 = await response2.get();
      let temp2 = [];
      data2.docs.forEach((t) => {
        if (t.id === itemID) temp2.push(t);
      });
      temp2.forEach((item) => {
        let ItemPath = item.ref.path;
        try {
          const ref = firebase.firestore().doc(ItemPath);
          ref.delete();
        } catch (e) {
          console.log(e);
        }
      });
    }
  } catch (e) {
    console.log(e);
    return;
  }
};

//Helper method: Approve list of TreasureHunts Or Stories
const approveTreasureHuntsOrStories = async (dataToChange, collectionName) => {
  try {
    const batch = firebase.firestore().batch();
    dataToChange.forEach((item) => {
      const sfRef = firebase
        .firestore()
        .collection(collectionName === "Stories" ? "Stories" : "TreasureHunt")
        .doc(item.id);
      batch.update(sfRef, {
        isApproved: true,
      });
    });
    await batch.commit();
  } catch (e) {
    console.log(e);
    return;
  }
};

//---------Users:----------
const fetchUsers = async (userObs) => {
  try {
    const response = firebase.firestore().collection("users");
    const data = await response.get();
    data.docs.forEach((item) => {
      let userTemp = item.data();
      userTemp.id = item.id;
      userObs.addUser(userTemp);
    });
  } catch (e) {
    console.log(e);
  }
};

//Approve selected users:
const approveUsers = async (userObs, usersToChange) => {
  try {
    const batch = firebase.firestore().batch();
    usersToChange.forEach((item) => {
      const sfRef = firebase.firestore().collection("users").doc(item.id);
      batch.update(sfRef, {
        isApproved: true,
        type: "creator",
        declined: false,
      });
    });
    await batch.commit();
  } catch (e) {
    console.log(e);
  }
};

//Decline selected users:
const declineUsers = async (userObs, usersToChange) => {
  try {
    const batch = firebase.firestore().batch();
    usersToChange.forEach((item) => {
      const sfRef = firebase.firestore().collection("users").doc(item.id);
      batch.update(sfRef, {
        declined: true,
      });
    });
    await batch.commit();
  } catch (e) {
    console.log(e);
  }
};

class Store {
  //---------Questions:----------
  //questions observable
  questionObs = observable({
    questions: [],
    addQuestion: action(function (e) {
      this.questions.push(e);
    }),
    get questionsCount() {
      return this.questions.length;
    },

    get questionsList() {
      return this.questions;
    },

    decline: action(async function (questionsToChange) {
      this.questions = [];
      let temp = questionsToChange;
      if (!Array.isArray(questionsToChange)) {
        temp = [];
        temp[0] = questionsToChange;
      }
      await declineQuestions(this, temp).then({});
    }),

    approve: action(async function (questionsToChange) {
      this.questions = [];
      await approveQuestions(this, questionsToChange).then({});
    }),

    initQuestions: action(async function (siteID, subSiteID) {
      this.questions = [];
      await fetchQuestions(this, siteID, subSiteID).then({});
    }),

    initAllQuestions: action(async function () {
      this.questions = [];
      await fetchAllQuestions(this).then({});
    }),

    getAllQuestions: action(function () {
      return this.questions;
    }),
  });

  //---------Clues:----------
  //clues observable
  clueObs = observable({
    clues: [],
    addClue: action(function (e) {
      this.clues.push(e);
    }),
    get cluesCount() {
      return this.clues.length;
    },

    get cluesList() {
      return this.clues;
    },

    decline: action(async function (cluesToChange) {
      this.clues = [];
      let temp = cluesToChange;
      if (!Array.isArray(cluesToChange)) {
        temp = [];
        temp[0] = cluesToChange;
      }
      await declineClues(this, temp).then({});
    }),

    approve: action(async function (cluesToChange) {
      this.clues = [];
      await approveClues(this, cluesToChange).then({});
    }),

    initClues: action(async function (siteID, subSiteID) {
      this.clues = [];
      await fetchClues(this, siteID, subSiteID).then({});
    }),

    initAllClues: action(async function () {
      this.clues = [];
      await fetchAllClues(this).then({});
    }),

    getAllClues: action(function () {
      return this.clues;
    }),
  });

  //---------subSites:----------
  //subSites observable
  subSiteObs = observable({
    subSites: [],
    subSite: {},
    addSubSite: action(function (e) {
      this.subSites.push(e);
    }),
    get subSitesCount() {
      return this.subSites.length;
    },

    get subSitesList() {
      return this.subSites;
    },

    initSubSites: action(async function (e) {
      this.subSites = [];
      let id = e;
      await fetchSubSites(this, id).then({});
    }),

    initAllSubSites: action(async function () {
      this.subSites = [];
      await fetchAllSubSites(this).then({});
    }),

    decline: action(async function (subSitesToChange) {
      this.subSites = [];
      await declineSubSite(this, subSitesToChange).then({});
    }),

    getAllSubSites: action(function () {
      return this.subSites;
    }),

    get subSiteInfo() {
      return this.subSite;
    },

    initSubSite: action(async function (siteID, subSiteID) {
      this.subSite = {};
      if (siteID !== undefined && siteID !== subSiteID)
        await fetchSubSite(this, siteID, subSiteID).then(() => {
          return this.subSite;
        });
      else if (siteID !== undefined && siteID === subSiteID)
        await fetchSiteInfo(this, siteID).then(() => {
          return this.subSite;
        });
    }),

    setSubSiteinfo: action(function (subSiteTemp) {
      return (this.subSite = subSiteTemp);
    }),
  });

  //---------Sites:----------
  //Sites observable
  siteObs = observable({
    sites: [],
    addSite: action(function (e) {
      this.sites.push(e);
    }),
    get sitesCount() {
      return this.sites.length;
    },

    get SitesList() {
      return this.sites;
    },

    initSites: action(async function (e) {
      this.sites = [];
      await fetchSites(this).then(async (sites) => {
        this.sites = sites;
      });
    }),

    decline: action(async function (sitesToChange) {
      this.sites = [];
      await declineAllSitesMain(this, sitesToChange).then({});
    }),

    getAllSites: action(function () {
      return this.sites;
    }),
  });

  //------stories object----
  //stories observable
  storiesObs = observable({
    stories: [],
    addStory: action(function (e) {
      this.stories.push(e);
    }),
    get storiesCount() {
      return this.stories.length;
    },

    get storiesList() {
      return this.stories;
    },

    decline: action(async function (storiesToChange) {
      this.stories = [];
      //from component ApprovalTable
      if (Array.isArray(storiesToChange)) {
        await declineStories(this, storiesToChange).then({});
      } else {
        //from component EditContent
        await declineStory(storiesToChange).then({});
      }
    }),
    approve: action(async function (storiesToChange) {
      this.stories = [];
      await approveStories(this, storiesToChange).then({});
    }),

    initStories: action(async function (isOnlyAprrove) {
      this.stories = [];
      await fetchStories(this, isOnlyAprrove).then((stories) => {
        this.stories = stories;
      });
    }),

    getAllStories: action(function () {
      return this.stories;
    }),
  });

  //------TreasureHunt object----
  //TreasureHunts observable
  treasureHuntObs = observable({
    treasureHunt: [],
    addTreasureHunt: action(function (e) {
      this.treasureHunt.push(e);
    }),
    get treasureHuntCount() {
      return this.treasureHunt.length;
    },

    get treasureHuntList() {
      return this.treasureHunt;
    },
    decline: action(async function (treasureHuntToChange) {
      this.treasureHunt = [];
      let temp = treasureHuntToChange;
      if (!Array.isArray(treasureHuntToChange)) {
        temp = [];
        temp[0] = treasureHuntToChange;
      }
      await declineTreasureHunt(temp).then({});
    }),

    approve: action(async function (treasureHuntToChange) {
      this.stories = [];
      await approveTreasureHunt(this, treasureHuntToChange).then({});
    }),

    initTreasureHunt: action(async function (isOnlyAprrove) {
      this.treasureHunt = [];

      await fetchTreasureHunt(this, isOnlyAprrove).then((treasureHunt) => {
        this.treasureHunt = treasureHunt;
      });
    }),

    getAllTreasureHunt: action(function () {
      return this.treasureHunt;
    }),
  });

  //---------user:----------
  //users observable
  userObs = observable({
    users: [],
    addUser: action(function (e) {
      this.users.push(e);
    }),
    get userCount() {
      return this.users.length;
    },

    get usersList() {
      return this.users;
    },

    approve: action(async function (usersToChange) {
      this.users = [];
      await approveUsers(this, usersToChange).then({});
    }),

    decline: action(async function (usersToChange) {
      this.users = [];
      await declineUsers(this, usersToChange).then({});
    }),
    initUsers: action(async function (e) {
      this.users = [];
      await fetchUsers(this).then({});
    }),
  });
}
export default Store;
