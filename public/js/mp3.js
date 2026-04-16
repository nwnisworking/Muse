import ID3 from "./id3.js"
import MPEG from "./mpeg.js"

export default class MP3{
	name
	duration = {hour : 0, minute : 0, second : 0}
	file
	/**@type {ID3} */
	id3
	/**@type {MPEG} */
	mpeg

	/**
	 * 
	 * @param {File|Blob} file 
	 */
	constructor(file){
		this.file = file
		this.name = file.name.replace(/\.[^\.]+$/, '')
		
		return new Promise(res=>{
			file.arrayBuffer().then(e=>{
				const dv = new DataView(e)
				this.id3 = new ID3(dv, 0)
				this.mpeg = new MPEG(dv, this.id3.size)

				const time = this.mpeg.total_size * 8 / this.mpeg.bitrate / 1000
				this.duration.minute = Math.floor(time / 60)
				this.duration.second = Math.floor(time % 60)
				res(this)
			})
		})
	}

	extract(start, end){
		return this.file.arrayBuffer().then(e=>{
			const frames_per_mil = this.mpeg.sample_per_frame / this.mpeg.sampling_rate
			return new Uint8Array(e.slice(this.id3.size).slice(start / frames_per_mil * this.mpeg.size, end / frames_per_mil * this.mpeg.size))
		})
	}
}
