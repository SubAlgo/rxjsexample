const firebase = require('firebase')
const { Observable } = require('rxjs')

/*Initialize Firebase
-------------------*/
   const config = {
  
  };
  firebase.initializeApp(config);


const db = firebase.database()

/* Create Data

db.ref('user').push({ name: 'test1' })
db.ref('user').push({ name: 'test2' })
db.ref('user').push({ name: 'test3' })

db.ref('room').push({ metadata: { name: 'room1' } })
db.ref('room').push({ metadata: { name: 'room2' } })
------------*/

/* Create Post

db.ref('room/-L0cbcWqXopJan6HRg9g/message')
  .push({ 
      content: 'Post by test2',
      userId: '-L0cbcWppDi5Gxz7sjI2',
      timestamp: firebase.database.ServerValue.TIMESTAMP
        })
-------------*/

/*รับ (event , path) และ return Observable.create

const subscribeFirebase = (event, path) => 
  Observable.create((o) => {
      const ref = db.ref(path)
      const fn = ref.on(event, (snapshot) => {
        o.next(snapshot.val())
      }, (err) => {
          o.error(err)
      })
      return () => ref.off(event, fn)
  })
----------------------------------------------*/

/*  o.next(Object.assign({}, snapshot.val(), { id: snapshot.key}))
-------------------------------------------------*/
const subscribeFirebase = (event, path) =>
    Observable.create((o) => {
        const ref = db.ref(path)
        const fn = ref.on(event, (snapshot) => {
            o.next(Object.assign({}, snapshot.val(), { id: snapshot.key}))
        }, (err) => {
            o.error(err)
        })
        return () => ref.off(event, fn)
    })

const getUser = (userId) => subscribeFirebase('value', `user/${userId}`)


/* subscribe Event: 'value'| Path: 'name'

subscribeFirebase('value', 'name')
  .subscribe(
      (x) => {
          console.log(x)
      },
      (err) => {
          console.log('Error: '+ err)
      },
      () => {
          console.log('Completed')
      }
  )
--------------------------------------*/

/* Get data room chart
----------------------*/
subscribeFirebase('child_added', 'room/-L0cbcWqXopJan6HRg9g/message')
    .subscribe(
    (x) => {
        console.log(x)
    },
    (err) => {
        console.log('Error: ' + err)
    },
    () => {
        console.log('Completed')
    }
    )


/* on จะเป็นการ subcribe ตัว server ถ้า server มีการเปลี่ยนแปลง การแสดงผลก็จะเปลี่ยนค่าตาม


db.ref('name').on('value', (snapshot) => {
    console.log(snapshot.val())
} )
------------------------------------------------------------------------------*/

    
