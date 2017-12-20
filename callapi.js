const firebase = require('firebase')
const { Observable } = require('rxjs')
const axios = require('axios')

const callAPI = () => Observable.fromPromise(axios.get('https://api.github.com/search/repositories?q=rxjs'))
        .map((resq) => resq.data)
        .do(() => { console.log('api called') })
        
        
const response = callAPI().share()


response.map((resp) => resp.item)
    .subscribe(
    (data) => {
        console.log('got item')
    }
    )
    


response.map((resp) => resp.total_count)
    .subscribe(
    (data) => {
        console.log('got total_count')
    }
    )


//callAPI.map((resp) => resp.list)
//    .subscribe(
//    (list) => {
//        console.log(list)
//    }
//    )
//
//callAPI.map((resp) => resp.total)
//    .subscribe(
//    (data) => {
//        console.log('total: ' + data)
//    }
//    )