const firebase = require('firebase')
const { Observable } = require('rxjs')
const { flow, reject, concat, orderBy } = require('lodash/fp')

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

//แปลง Object -> Array
const onArrayEvent = (event, path) =>
    Observable.create((o) => {
        const ref = db.ref(path)
        const fn = ref.on(event, (snapshots) => {
            const r = []
            //ใช้ forEach ที่มาจาก firebase เพราะมันจะเรียงลำดับให้
            snapshots.forEach((snapshort) => {
                r.push(Object.assign({}, snapshort.val(), { id: snapshort.key}))
            })
           o.next(r)
        }, (err) => {
            o.error(err)
        })
        return () => ref.off(event, fn)
    })

/*function getUser
----------------*/

const getUser = (userId) => subscribeFirebase('value', `user/${userId}`)


/* Get data room chart
1.11.15
----------------------*/
const room1 = onArrayEvent('value', 'room/-L0cbcWqXopJan6HRg9g/message')
    //ดูเพิ่ม 55.00
    .flatMap((xs) => Observable.from(xs)
        .flatMap((msg) => getUser(msg.userId).first(), (msg, user) => ({
            id: msg.id,
            content: msg.content,
            timestamp: msg.timestamp,
            user,
        }))
        .toArray()
        .map(orderBy(['timestamp'], ['asc']))
    )

    room1.subscribe(
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



