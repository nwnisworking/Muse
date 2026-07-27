// class Track {
// 	constructor({ title, artist, length, source }) {
// 		this.title = title;
// 		this.artist = artist;
// 		this.length = length;
// 		this.source = source;
// 	}
// }

// class CacheBucket {
// 	constructor() {
// 		this.store = new Map();
// 	}

// 	get(key) {
// 		return this.store.get(key) ?? null;
// 	}

// 	set(key, value) {
// 		this.store.set(key, value);
// 	}
// }

// class SourceLoader {
// 	async load(sourceType) {
// 		if (sourceType === 'directory') {
// 			return this.loadDirectory();
// 		}

// 		return this.loadBucket();
// 	}

// 	async loadDirectory() {
// 		let sourceLabel = 'Local directory';

// 		if (window.showDirectoryPicker) {
// 			try {
// 				const directoryHandle = await window.showDirectoryPicker();
// 				sourceLabel = directoryHandle.name || sourceLabel;
// 			} catch (error) {
// 				if (error && error.name === 'AbortError') {
// 					throw error;
// 				}
// 			}
// 		}

// 		return {
// 			sourceLabel,
// 			tracks: [
// 				new Track({ title: 'Midnight Bloom', artist: 'Muse Collective', length: '03:42', source: sourceLabel }),
// 				new Track({ title: 'Signal Drift', artist: 'Northline', length: '04:18', source: sourceLabel }),
// 				new Track({ title: 'Glass Transit', artist: 'Solstice', length: '05:01', source: sourceLabel }),
// 			],
// 		};
// 	}

// 	async loadBucket() {
// 		return {
// 			sourceLabel: 'Bucket source',
// 			tracks: [
// 				new Track({ title: 'Soft Static', artist: 'Arc Loop', length: '02:57', source: 'Bucket source' }),
// 				new Track({ title: 'Neon Archive', artist: 'Loop System', length: '04:22', source: 'Bucket source' }),
// 				new Track({ title: 'Pixel Echo', artist: 'Northline', length: '03:34', source: 'Bucket source' }),
// 			],
// 		};
// 	}
// }

// class LibraryController {
// 	constructor() {
// 		this.tracks = [];
// 		this.currentIndex = 0;
// 	}

// 	setTracks(tracks) {
// 		this.tracks = tracks;
// 		this.currentIndex = 0;
// 	}

// 	setCurrentIndex(index) {
// 		if (index < 0 || index >= this.tracks.length) {
// 			return;
// 		}

// 		this.currentIndex = index;
// 	}

// 	getCurrentTrack() {
// 		return this.tracks[this.currentIndex] ?? null;
// 	}

// 	render(root) {
// 		if (!root) {
// 			return;
// 		}

// 		root.innerHTML = `
// 			<div style="overflow: hidden; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); background: rgba(24,24,24,0.92);">
// 				<div style="display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; padding: 18px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);">
// 					<strong style="color: #f5f5f5;">Track table</strong>
// 					<span style="color: #b3b3b3;">Select a row to update the player.</span>
// 				</div>

// 				<table style="width: 100%; border-collapse: collapse;">
// 					<thead>
// 						<tr>
// 							<th style="text-align: left; padding: 16px 20px; color: #b3b3b3; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.16em;">Title</th>
// 							<th style="text-align: left; padding: 16px 20px; color: #b3b3b3; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.16em;">Artist</th>
// 							<th style="text-align: left; padding: 16px 20px; color: #b3b3b3; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.16em;">Length</th>
// 							<th style="text-align: left; padding: 16px 20px; color: #b3b3b3; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.16em;">Status</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 						${this.renderRows()}
// 					</tbody>
// 				</table>
// 			</div>
// 		`;

// 		root.querySelectorAll('[data-action="select-track"]').forEach((button) => {
// 			button.addEventListener('click', () => {
// 				const index = Number(button.dataset.trackIndex);
// 				this.setCurrentIndex(index);
// 			});
// 		});
// 	}

// 	renderRows() {
// 		if (!this.tracks.length) {
// 			return `
// 				<tr>
// 					<td colspan="4" style="padding: 16px 20px; color: #b3b3b3;">No tracks found.</td>
// 				</tr>
// 			`;
// 		}

// 		return this.tracks
// 			.map((track, index) => `
// 				<tr>
// 					<td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);">
// 						<button
// 							type="button"
// 							data-action="select-track"
// 							data-track-index="${index}"
// 							style="all: unset; cursor: pointer; display: block; width: 100%;"
// 						>
// 							<div style="font-weight: 700; color: #f5f5f5;">${track.title}</div>
// 							<div style="color: #b3b3b3; font-size: 0.92rem;">${track.source}</div>
// 						</button>
// 					</td>
// 					<td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #e4e4e7;">${track.artist}</td>
// 					<td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #e4e4e7;">${track.length}</td>
// 					<td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); color: #e4e4e7;">${index === this.currentIndex ? 'Selected' : 'Ready'}</td>
// 				</tr>
// 			`)
// 			.join('');
// 	}
// }

// class PlayerController {
// 	constructor() {
// 		this.tracks = [];
// 		this.currentIndex = 0;
// 	}

// 	setTracks(tracks) {
// 		this.tracks = tracks;
// 		this.currentIndex = 0;
// 	}

// 	setCurrentIndex(index) {
// 		if (index < 0 || index >= this.tracks.length) {
// 			return;
// 		}

// 		this.currentIndex = index;
// 	}

// 	getCurrentTrack() {
// 		return this.tracks[this.currentIndex] ?? null;
// 	}

// 	next() {
// 		if (!this.tracks.length) {
// 			return;
// 		}

// 		this.currentIndex = (this.currentIndex + 1) % this.tracks.length;
// 	}

// 	previous() {
// 		if (!this.tracks.length) {
// 			return;
// 		}

// 		this.currentIndex = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
// 	}

// 	render(root) {
// 		if (!root) {
// 			return;
// 		}

// 		const currentTrack = this.getCurrentTrack();

// 		root.innerHTML = currentTrack
// 			? `
// 				<div style="display: grid; gap: 6px; min-width: 0;">
// 					<strong style="color: #f5f5f5;">${currentTrack.title}</strong>
// 					<span style="color: #b3b3b3;">${currentTrack.artist} · ${currentTrack.length}</span>
// 				</div>
// 			`
// 			: `
// 				<div style="display: grid; gap: 8px; color: #b3b3b3;">
// 					<strong style="color: #f5f5f5;">Nothing is playing</strong>
// 					<span>Select a track to start playback.</span>
// 				</div>
// 			`;
// 	}
// }

// class Page {
// 	constructor({ root, loadingTemplate }) {
// 		this.root = root;
// 		this.loadingTemplate = loadingTemplate;
// 	}

// 	showHero() {
// 		this.root.innerHTML = `
// 			<section class="container" style="display: grid; gap: 20px; padding: 36px 0;">
// 				<div style="padding: 28px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); background: rgba(24,24,24,0.88); box-shadow: 0 30px 80px rgba(0,0,0,0.35);">
// 					<h1 style="margin: 0 0 12px; font-size: clamp(3rem, 10vw, 5rem); letter-spacing: -0.06em;">Muse</h1>
// 					<p style="margin: 0; max-width: 56ch; color: #d4d4d8; line-height: 1.6;">
// 						Choose a source to load music into the workspace.
// 					</p>
// 				</div>

// 				<div style="display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr));">
// 					<button data-action="choose-directory" style="padding: 18px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.05); color: #f5f5f5; font: inherit; cursor: pointer; text-align: left;">
// 						<strong style="display: block; margin-bottom: 8px;">Open directory</strong>
// 						<span style="color: #b3b3b3;">Load music from a local folder.</span>
// 					</button>

// 					<button data-action="use-bucket" style="padding: 18px 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.05); color: #f5f5f5; font: inherit; cursor: pointer; text-align: left;">
// 						<strong style="display: block; margin-bottom: 8px;">Use bucket</strong>
// 						<span style="color: #b3b3b3;">Load music from a managed source.</span>
// 					</button>
// 				</div>
// 			</section>
// 		`;
// 	}

// 	showLoading(sourceType) {
// 		const fragment = this.loadingTemplate.content.cloneNode(true);
// 		const loadingScreen = fragment.querySelector('#loading-screen');
// 		const title = fragment.querySelector('h2');
// 		const body = fragment.querySelector('p');

// 		if (loadingScreen) {
// 			loadingScreen.setAttribute('aria-busy', 'true');
// 			loadingScreen.setAttribute('aria-live', 'polite');
// 		}

// 		if (title) {
// 			title.textContent = 'Loading Muse';
// 		}

// 		if (body) {
// 			body.textContent = sourceType === 'directory'
// 				? 'Preparing your local folder.'
// 				: 'Preparing your bucket source.';
// 		}

// 		this.root.replaceChildren(fragment);
// 	}

// 	showWorkspaceShell({ sourceLabel }) {
// 		this.root.innerHTML = `
// 			<section class="container" style="display: grid; gap: 18px; padding: 24px 0 140px;">
// 				<header style="display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; align-items: end;">
// 					<div>
// 						<p style="margin: 0 0 8px; color: #b3b3b3; text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.72rem;">Muse workspace</p>
// 						<h2 style="margin: 0; font-size: clamp(1.8rem, 4vw, 2.6rem); letter-spacing: -0.05em;">${sourceLabel}</h2>
// 					</div>
// 					<span style="padding: 10px 14px; border-radius: 999px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); color: #f5f5f5;">Library ready</span>
// 				</header>

// 				<section data-library></section>
// 			</section>

// 			<div style="position: fixed; left: 0; right: 0; bottom: 0; padding: 0 20px 18px; pointer-events: none;">
// 				<footer style="width: 100%; display: grid; grid-template-columns: 1.2fr 1fr auto; gap: 16px; align-items: center; padding: 16px 18px; border-radius: 22px; background: rgba(18,18,18,0.95); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 30px 80px rgba(0,0,0,0.55); backdrop-filter: blur(18px); pointer-events: auto;">
// 					<div data-player></div>

// 					<div style="display: flex; gap: 10px; justify-content: flex-end;">
// 						<button data-action="player-prev" style="min-width: 44px; height: 44px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.08); color: #f5f5f5;">⟨⟨</button>
// 						<button data-action="player-toggle" style="min-width: 44px; height: 44px; border-radius: 14px; border: 0; background: linear-gradient(135deg, #fbbf24, #f97316); color: #111111;">▶</button>
// 						<button data-action="player-next" style="min-width: 44px; height: 44px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.10); background: rgba(255,255,255,0.08); color: #f5f5f5;">⟩⟩</button>
// 					</div>
// 				</footer>
// 			</div>
// 		`;
// 	}

// 	getLibraryMount() {
// 		return this.root.querySelector('[data-library]');
// 	}

// 	getPlayerMount() {
// 		return this.root.querySelector('[data-player]');
// 	}

// 	bindSourceSelection(handler) {
// 		this.root.addEventListener('click', (event) => {
// 			const action = event.target?.dataset?.action;

// 			if (action === 'choose-directory') {
// 				handler('directory');
// 			}

// 			if (action === 'use-bucket') {
// 				handler('bucket');
// 			}
// 		});
// 	}
// }

// class App {
// 	constructor({ page, sourceLoader, cacheBucket, libraryController, playerController }) {
// 		this.page = page;
// 		this.sourceLoader = sourceLoader;
// 		this.cacheBucket = cacheBucket;
// 		this.libraryController = libraryController;
// 		this.playerController = playerController;
// 		this.context = null;
// 	}

// 	createContext() {
// 		return {
// 			setTitle: (title) => {
// 				document.title = title;
// 			},
// 			showLoading: (message) => {
// 				this.page.showLoading(message);
// 			},
// 			showHero: () => {
// 				this.page.showHero();
// 			},
// 			getLibraryMount: () => this.page.getLibraryMount(),
// 			getPlayerMount: () => this.page.getPlayerMount(),
// 			getRoot: () => this.page.root,
// 		};
// 	}

// 	setContext(context) {
// 		this.context = context;
// 	}

// 	start() {
// 		this.context?.showHero?.() ?? this.page.showHero();
// 		this.page.bindSourceSelection((sourceType) => this.loadSource(sourceType));
// 	}

// 	async loadSource(sourceType) {
// 		this.context?.showLoading?.(sourceType) ?? this.page.showLoading(sourceType);
// 		this.context?.setTitle?.('Loading Muse');

// 		try {
// 			const cached = this.cacheBucket.get(sourceType);
// 			const payload = cached ?? await this.sourceLoader.load(sourceType);

// 			if (!cached) {
// 				this.cacheBucket.set(sourceType, payload);
// 			}

// 			this.libraryController.setTracks(payload.tracks);
// 			this.playerController.setTracks(payload.tracks);
// 			this.context?.setTitle?.(`Muse · ${payload.sourceLabel}`);

// 			this.page.showWorkspaceShell({ sourceLabel: payload.sourceLabel });

// 			const libraryMount = this.page.getLibraryMount();
// 			const playerMount = this.page.getPlayerMount();

// 			this.libraryController.render(libraryMount);
// 			this.playerController.render(playerMount);

// 			this.bindWorkspaceControls();
// 		} catch (error) {
// 			if (error && error.name === 'AbortError') {
// 				this.page.showHero();
// 				return;
// 			}

// 			console.error(error);
// 		}
// 	}

// 	bindWorkspaceControls() {
// 		this.page.root.querySelectorAll('[data-action="player-prev"]').forEach((button) => {
// 			button.onclick = () => {
// 				this.playerController.previous();
// 				this.libraryController.setCurrentIndex(this.playerController.currentIndex);
// 				this.rerenderWorkspace();
// 			};
// 		});

// 		this.page.root.querySelectorAll('[data-action="player-next"]').forEach((button) => {
// 			button.onclick = () => {
// 				this.playerController.next();
// 				this.libraryController.setCurrentIndex(this.playerController.currentIndex);
// 				this.rerenderWorkspace();
// 			};
// 		});

// 		this.page.root.querySelectorAll('[data-action="player-toggle"]').forEach((button) => {
// 			button.onclick = () => {
// 				const currentTrack = this.playerController.getCurrentTrack();
// 				if (currentTrack) {
// 					console.log(`Playing ${currentTrack.title}`);
// 				}
// 			};
// 		});
// 	}

// 	rerenderWorkspace() {
// 		const libraryMount = this.page.getLibraryMount();
// 		const playerMount = this.page.getPlayerMount();

// 		this.libraryController.render(libraryMount);
// 		this.playerController.render(playerMount);
// 		this.bindWorkspaceControls();
// 	}
// }

// window.Muse = {
// 	Track,
// 	CacheBucket,
// 	SourceLoader,
// 	LibraryController,
// 	PlayerController,
// 	Page,
// 	App,
// };
