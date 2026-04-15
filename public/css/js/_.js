const enc = new TextEncoder
const dec = new TextDecoder

function bitmask(value, mask, shift){
	[value, mask_bit, ls] = [...arguments].map(BigInt)
	return Number(((value) & (((1n << mask_bit) - 1n) << ls)) >> ls)
}

/**
 * All available ID3 Tags 
 */
export const ID3_TAG = Object.freeze({
	AENC : 'Audio Encryption', 
	ASPI : 'Audio Seek Point Index', 
	APIC : 'Attached Picture', 
	COMM : 'Comments', 
	COMR : 'Commercial Frame', 
	ENCR : 'Encryption Method Registration', 
	EQUA : 'Equalization', 
	EQU2 : 'Equalization', 
	ETCO : 'Event Timing Codes', 
	GEOB : 'General Encapsulated Object', 
	GRID : 'Group Identification Registration', 
	LINK : 'Linked Information', 
	MCDI : 'Music CD Identifier', 
	MLLT : 'MPEG Location Lookup Table', 
	OWNE : 'Ownership Frame', 
	PRIV : 'Private Frame', 
	PCNT : 'Play Counter', 
	POPM : 'Popularimeter', 
	POSS : 'Position Synchronisation Frame', 
	RBUF : 'Recommended Buffer Size', 
	RVAD : 'Relative Volume Adjustment', 
	RVA2 : 'Relative Volume Adjustment', 
	RVRB : 'Reverb', 
	SEEK : 'Seek Frame', 
	SIGN : 'Signature Frame', 
	SYLT : 'Synchronized Lyric/Text', 
	SYTC : 'Synchronized Tempo Codes', 
	TBPM : 'Beats Per Minute', 
	TKEY : 'Initial Key', 
	TCON : 'Content Type', 
	TMOO : 'Mood', 
	TCOP : 'Copyright Message', 
	TDAT : 'Date', 
	TRDA : 'Recording Dates', 
	TDRC : 'Recording Time', 
	TIME : 'Time', 
	TYER : 'Year', 
	TDRL : 'Release Time', 
	TDTG : 'Tagging Time', 
	TDEN : 'Encoding Time', 
	TENC : 'Encoded By', 
	TSSE : 'Software/Hardware And Settings Used For Encoding', 
	TDLY : 'Playlist Delay', 
	TIT1 : 'Content Group Description', 
	TIT2 : 'Title/Songname/Content Description', 
	TIT3 : 'Subtitle/Description refinement', 
	TALB : 'Album/Movie/Show title', 
	TLAN : 'Language', 
	TLEN : 'Length', 
	TSIZ : 'Size', 
	TFLT : 'File Type', 
	TMED : 'Media Type', 
	TOWN : 'File Owner/Licensee', 
	TPE1 : 'Lead performer(s)/Soloist(s)', 
	TPE2 : 'Band/Orchestra/Accompaniment', 
	TPE3 : 'Conductor/Performer Refinement', 
	TPE4 : 'Interpreted, Remixed, Or Otherwise Modified By', 
	TCOM : 'Composer', 
	TEXT : 'Lyricist/Text Writer', 
	IPLS : 'Involved People List', 
	TIPL : 'Involved People List', 
	TMCL : 'Musician Credits List', 
	TOAL : 'Original Album/Movie/Show Title', 
	TOFN : 'Original Filename', 
	TOLY : 'Original Lyricist(s)/Text Writer(s)', 
	TOPE : 'Original Artist(s)/Performer(s)', 
	TORY : 'Original Release Year', 
	TDOR : 'Original Release Year', 
	TRCK : 'Track Number/Position In Set', 
	TPOS : 'Part Of A Set', 
	TSST : 'Set Subtitle', 
	TPRO : 'Produced Notice', 
	TPUB : 'Publisher', 
	TRSN : 'Internet Radio Station Name', 
	TRSO : 'Internet Radio Station Owner', 
	TSOA : 'Album Sort Order', 
	TSOP : 'Performer Sort Order', 
	TSOT : 'Title Sort Order', 
	TSRC : 'International Standard Recording Code', 
	TXXX : 'User Defined Text Information Frame', 
	UFID : 'Unique File Identifier', 
	USER : 'Terms Of Use', 
	USLT : 'Unsynchronized Lyric/Text Transcription', 
	WCOM : 'Commercial Information', 
	WCOP : 'Copyright/Legal Information', 
	WOAF : 'Official Audio File Webpage', 
	WOAR : 'Official Artist/Performer File Webpage', 
	WOAS : 'Official Audio Source File Webpage', 
	WORS : 'Official Internet Radio Station Homepage', 
	WPAY : 'Payment', 
	WPUB : 'Publishers Official Webpage', 
	WXXX : 'User Defined URL Link Frame',
})

/** Constant bitrate */
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
	version
	size = 0
	flag
	data = {}

	/**
	 * 
	 * @param {DataView|null} data 
	 */
	constructor(data, offset = 0){
		if(!data || !(data instanceof DataView) || !ID3.isID3(data.getUint32(offset)))
			return

		this.version = [0x544147, 0x494433].indexOf(data.getUint32(offset) >> 8) + 1
		offset+= 3

		
		// TAG 
		if(this.version !== 2){
			this.flag = -1
			this.size = 128
		}
		// ID3
		else{
			this.version+= data.getUint16(offset, true) / 10
			this.flag = data.getUint8(offset+=2)

			this.size+= 10
			this.size|= data.getUint8(offset+=1) << 7 * 3
			this.size|= data.getUint8(offset+=1) << 7 * 2
			this.size|= data.getUint8(offset+=1) << 7 * 1
			this.size|= data.getUint8(offset+=1) << 7 * 0

			offset++

			while(offset < this.size){
				const index = offset,
				name = dec.decode(data.buffer.slice(offset, offset+=4)),
				size = data.getUint32(offset),
				result = data.buffer.slice(offset+= 6, offset+= size)

				if(size == 0)
					break

				if(!Array.isArray(this.data[name]))
					this.data[name] = [{name, desc : ID3_TAG[name], size, result, index}]
				else
					this.data[name].push({name, desc : ID3_TAG[name], size, result, index})
			}
		}
	}

	/**
	 * Check if current frame is ID3
	 * @param {DataView} data 
	 */
	static isID3(value){
		const v = value >> 8
		return 0x494433 === v || 0x544147 === v
	}
}

export default class MP3{
	/** ID3 Container */
	id3

	/** Size of the frame */
	size

	/** MPEG version */
	version

	/** Layer */
	layer
	
	/** MP3 bitrate */
	bitrate
	
	/** Samples per second */
	sampling_rate
	
	/** Samples per frame */
	samples_per_frame

	/** MP3 size */
	byteLength = 0

	/** Audio length */
	duration = {minute : 0, second : 0}

	/** Audio data
	 * @type {DataView}
	 */
	data

	/** Frame index  */
	#frame_index = []

	get frame_length(){return this.#frame_index.length}

	/**
	 * @param {ArrayBuffer} data
	 */
	constructor(data){
		let offset = 0,
		max_size = data.byteLength,
		/**@type {DataView} */
		dv = new DataView(data)

		this.data = dv

		while(offset < max_size){
			if(ID3.isID3(dv.getUint32(offset))){
				let id3

				if(!this.id3)
					id3 = this.id3 = new ID3(dv, offset)
				else
					id3 = new ID3(dv, offset)
				offset+= id3.size
			}
			else if(MP3.isMPEGFrame(dv.getUint16(offset))){
				const value = dv.getUint32(offset)

				this.#frame_index.push(offset)

				if(!this.size){
					const version = this.version = bitmask(value, 2, 19)
					const layer = this.layer = (bitmask(value, 2, 17) - 4) * -1
					const bitrate = this.bitrate = BITRATE[bitmask(value, 4, 12)][version === 3 ? layer - 1 : (layer === 1 ? 3 : 4)]
					const samples_per_frame = this.samples_per_frame = SAMPLES_PER_FRAME[version][layer - 1]
					const sampling_rate = this.sampling_rate = SAMPLING_RATE[version][setBit(value, 0x3, 10)]
					
					this.size = Math.floor(samples_per_frame / 8 * bitrate / (sampling_rate / 1000))
				}
				
				offset+= this.size

				if(value & 1 << 9)
					offset++
			}
			else{
				offset++
			}
		}
		const time = this.byteLength * 8 / this.bitrate / 1000 
		this.duration.minute = Math.floor(time / 60)
		this.duration.second = Math.floor(time % 60)
	}

	extract(start, end){
		const frames = this.samples_per_frame / this.sampling_rate
		return new Uint8Array(this.data.buffer.slice(this.#frame_index[start / frames >>> 0], this.#frame_index[end / frames >>> 0]))
	}

	static isMPEGFrame(value){
		return (value & (((1 << 11) - 1) << 5)) >> 5 === 2047
	}
}
