const firebase = require('firebase')
const { Observable } = require('rxjs')
const { flow, reject, concat, orderBy} = require('lodash/fp')

/*Initialize Firebase
-------------------*/
const config = {
    
};
firebase.initializeApp(config);


const db = firebase.database()


const subscribeFirebase = (event, path) =>
    Observable.create((o) => {
        const ref = db.ref(path)
        const fn = ref.on(event, (snapshot) => {
            o.next(Object.assign({}, snapshot.val(), { id: snapshot.key }))
        }, (err) => {
            o.error(err)
        })
        return () => ref.off(event, fn)
    })

/*function getUser
----------------*/

const getUser = (userId) => subscribeFirebase('value', `user/${userId}`)


/* Get data room chart
----------------------*/
subscribeFirebase('child_added', 'room/-L0cbcWqXopJan6HRg9g/message')
    .flatMap((msg) => getUser(msg.userId), (msg, user) => ({
        id: msg.id,
        content: msg.content,
        timestamp: msg.timestamp,
        user
    }))
    //func scan รับ ค่าตัวแปลก่อนหน้า กับ ค่าตัวแปลปัจจุบัน
    //ใส่ค่าเริ่มต้น (seed) เป็น array เปล่า

    // remove msg from p
    // push msg to p
    // order msg by timestamp
    .scan((p, v) => flow(
        reject({id: v.id}),
        concat(v),
        orderBy(['timestamp'], ['asc'])
    )(p), [])
    .debounceTime(100)
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



