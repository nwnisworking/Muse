const dec = new TextDecoder

export const BITRATE = [
	[0, 0, 0, 0, 0], 
	[32, 32, 32, 32, 8], 
	[64, 48, 40, 48, 16], 
	[96, 56, 48, 56, 24], 
	[128, 64, 56, 64, 32], 
	[160, 80, 64, 80, 40], 
	[192, 96, 80, 96, 48], 
	[224, 112, 96, 112, 56], 
	[256, 128, 112, 128, 64], 
	[288, 160, 128, 144, 80], 
	[320, 192, 160, 160, 96], 
	[352, 224, 192, 176, 112], 
	[384, 256, 224, 192, 128], 
	[416, 320, 256, 224, 144], 
	[448, 384, 320, 256, 160], 
	[-1, -1, -1, -1, -1], 
]

/** Number of samples per second */
export const SAMPLING_RATE = [
	[11025, 12000, 8000, 0],
	[0, 0, 0, 0],
	[22050, 24000, 16000, 0],
	[44100, 48000, 32000, 0]
]

/** Samples per frame */
export const SAMPLES_PER_FRAME = [
	[384, 1152, 576],
	null,
	[384, 1152, 576],
	[384, 1152, 1152]
]

export class ID3{
	type
	version
	flag
	size
	data = []

	/**
	 * 
	 * @param {DataView} data 
	 */
	constructor(data, offset = 0){
		this.type = dec.decode(data.buffer.slice(offset, offset+=3))
		this.version = data.getUint16(offset, true)
		this.flag = data.getUint8(offset+=2)
		this.size = (
			data.getUint8(offset+=1) << 7 * 3 |
			data.getUint8(offset+=1) << 7 * 2 |
			data.getUint8(offset+=1) << 7 * 1 |
			data.getUint8(offset+=1) << 7 * 0
		) + 10

		offset++

		for(; offset < this.size; offset+= 10){
			const name = dec.decode(data.buffer.slice(offset, offset + 4)),
			size = data.getUint32(offset + 4),
			text = dec.decode(data.buffer.slice(offset + 10, offset + 10 + size))
			if(size === 0) break

			this.data.push({name, size, text})

			offset+= size
		}
	}
}

export class MPEG{
	type
	size
	byteLength
	flag
	frame
	version
	layer
	bitrate
	sample_rate
	sample_frame

	/**
	 * 
	 * @param {DataView} data 
	 */
	constructor(data, offset = 0){
		const ver_layer = data.getUint8(offset + 1) >> 1
		const bit_sample = data.getUint8(offset + 2) >> 2

		this.version = (ver_layer & 0xc) >> 2
		this.layer = ((ver_layer & 0x3) - 4) * -1
		this.bitrate = BITRATE[(bit_sample & 0x3c) >> 2][this.version === 3 ? this.layer - 1 : (this.layer === 1 ? 3 : 4)]
		this.sample_rate = SAMPLING_RATE[this.version][bit_sample & 0x3]
		this.sample_frame = SAMPLES_PER_FRAME[this.version][this.layer - 1]

		offset+= 36

		this.type = dec.decode(data.buffer.slice(offset, offset + 4))
		this.flag = data.getUint32(offset + 4)
		
		offset+= 4

		// Total number of frames in file
		if(0x01 & this.flag)
			this.size = data.getUint32(offset+=4)
		
		// Get the total byte length
		if(0x02 & this.flag)
			this.byteLength = data.getUint32(offset+= 4)
	
		if(0x01 & this.flag && 0x02 & this.flag)
			this.frame = Math.floor(this.byteLength / this.size)

	}
}
