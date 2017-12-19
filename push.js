const firebase = require('firebase')
const { Observable } = require('rxjs')
const { flow, reject, concat, orderBy } = require('lodash/fp')

/*Initialize Firebase
-------------------*/
const config = {
   
};
firebase.initializeApp(config);


const db = firebase.database()

/* Create Data
------------*/
db.ref('room/-L0cbcWqXopJan6HRg9g/message').push({
    content: 'Want to post',
    userId: '-L0cbcWppDi5Gxz7sjI2',
    timestamp: firebase.database.ServerValue.TIMESTAMP
})





