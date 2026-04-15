import MP3 from "./mp3.js"

window.muse = {
	async process({target : {files}}){
		const mp3 = await new MP3(files[0])
		const start = prompt('Type in the seconds of the start position (in decimals)') * 1.0
		const end = prompt('Type in the seconds of the end position (in decimals)') * 1.0
		const a = document.createElement('a')
		a.download = crypto.randomUUID() + '.mp3'
		a.href = window.URL.createObjectURL(new Blob([await mp3.extract(start, end)], {type : 'audio/mp3'}))
		a.text = 'Download file'
		const pre = document.createElement('pre')
		pre.innerHTML = JSON.stringify(mp3.mpeg, null, '\t') + '\n' + JSON.stringify(mp3,null, '\t')
		
		document.body.append(a, pre)

	}
}

// const muse = window.muse = {
// 	init(){
// 		const db = indexedDB.open('muse'),
// 		decoder = new TextDecoder()

// 		db.onupgradeneeded = ()=>{
// 			const store = db.result.createObjectStore('song', {autoIncrement : true, keyPath : 'id'})
// 			store.createIndex('uid', 'uid', {unique : true})
// 			store.createIndex('name', 'name')
// 			store.createIndex('artist', 'artist')
// 			store.createIndex('duration', 'duration')
// 		}

// 		db.onsuccess = ()=>{
// 			const result = db.result.transaction('song', 'readonly').objectStore('song')
// 			result.get(1).onsuccess = async ({target : {result}})=>{
// 				const mp3 = await new MP3(result.file)
// 				console.log(await mp3.extract(32.80, 40))
// 			}
// 		}
// 	},
// 	async process(e){
	
// 	}
// }

// muse.init()
