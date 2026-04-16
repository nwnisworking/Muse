export const mpeg_version = [2.5, null, 2, 1]

export const layer = [null, 3, 2, 1]

export const samples_per_frame = {
	// MPEG Version 2.5
	0 : {1 : 576, 2 : 1152, 3 : 384},
	// MPEG Version 2
	2 : {1 : 576, 2 : 1152, 3 : 384},
	// MPEG Version 1
	3 : {1 : 1152, 2 : 1152, 3 : 384}
}

export const sampling_rate = {
	0 : [11025, 12000, 8000],
	2 : [22050, 24000, 16000],
	3 : [44100, 48000, 32000]
}

export const bitrate = {
	// MPEG Version 1
	3 : {
		// Layer 1
		3 : [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448, null], 
		// Layer 2
		2 : [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, null], 
		// Layer 3
		1 : [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, null], 
	},
	// MPEG Version 2
	2 : {
		// Layer 1
		3 : [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, null], 
		// Layer 2
		2 : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null], 
		// Layer 3
		1 : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null], 
	},
	// MPEG Version 2.5
	0 : {
		// Layer 1
		3 : [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, null], 
		// Layer 2
		2 : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null], 
		// Layer 3
		1 : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, null], 
	}
}

export default class MPEG{
	version
	layer
	is_protected
	bitrate
	sampling_rate
	is_padded
	private_bit
	channel
	copyrighted
	original
	emphasis
	sample_per_frame
	total_frame = 0
	total_size

	/**
	 *  
	 * @param {DataView} data 
	 */
	constructor(data, offset){
		const config = val=>[
			11, 2, 2, 1, 
			4, 2, 1, 1, 
			2, 2, 1, 1, 2].reverse().map(e=>{
			const v = val & (1 << e) - 1
			val>>= e
			return v
		}).reverse()

		if(data.getUint16(offset) !== 0xfffb) return false

		const value = config(data.getUint32(offset))
		
		this.version = mpeg_version[value[1]]
		this.layer = layer[value[2]]
		this.is_protected = value[3] === 1
		this.bitrate = bitrate[value[1]][value[2]][value[4]]
		this.sampling_rate = sampling_rate[value[1]][value[5]]
		this.is_padded = value[6]
		this.private_bit = value[7]
		this.channel = value[8]
		this.copyrighted = value[9] === 1
		this.original = value[10] === 1
		this.emphasis = value[11]
		this.sample_per_frame = samples_per_frame[value[1]][value[2]]
		this.size = Math.floor(this.sample_per_frame / 8 * this.bitrate / (this.sampling_rate / 1000)) + this.is_padded

		let i = offset - this.size

		while((i+= this.size) && data.getUint16(i) === 0xfffb)
			this.total_frame++
		
		this.total_size = this.total_frame * this.size
	}
}