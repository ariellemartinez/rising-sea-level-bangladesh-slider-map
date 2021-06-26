var tileSize,
	everyOther = true,
	drawElev = false;

var southWest = L.latLng(19.887674, 95.922415),
	northEast = L.latLng(27.163810, 84.738333),
	bounds = L.latLngBounds(southWest, northEast);

L.mapbox.accessToken = 'pk.eyJ1Ijoid2VibWFzdGVyY2ZyIiwiYSI6ImNsT2lZNU0ifQ.uufuabBAFtq7dOpW0Lzd5w';

var map = L.map('map', {
	worldCopyJump: true,
	doubleClickZoom: false,
	center: [23.598, 90.344],
	zoom: 7,
	scrollWheelZoom: false,
	minZoom: 6,
	maxBounds: bounds
});

var hash = L.hash(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Start elevTiles0

var elevTiles0 = new L.TileLayer.Canvas({
	unloadInvisibleTiles: true,
	attribution: "Imagery &copy; <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap contributors</a>, Data &copy; <a href='https://choices.climatecentral.org/' target='_blank'>Climate Central Mapping Choices</a>"
});


elevTiles0.on('tileunload', function (e) {
	//Send tile unload data to elevWorker to delete un-needed pixel data
	elevWorker0.postMessage({
		'data': e.tile._tilePoint.id,
		'type': 'tileunload'
	});
});

var elevWorker0 = new Worker('js/imagedata.js');

var tileContextsElev0 = {};

elevWorker0.postMessage({
	data: 0,
	type: 'setfilter'
});

elevTiles0.drawTile = function (canvas, tile, zoom) {
	tileSize = this.options.tileSize;

	var context = canvas.getContext('2d'),
		imageObj = new Image(),
		tileUID = '' + zoom + '/' + tile.x + '/' + tile.y;

	var drawContext = canvas.getContext('2d');

	// To access / delete elevTiles later
	tile.id = tileUID;

	tileContextsElev0[tileUID] = drawContext;

	imageObj.onload = function () {
		// Draw Image Tile
		context.drawImage(imageObj, 0, 0);

		// Get Image Data
		var imageData = context.getImageData(0, 0, tileSize, tileSize);

		elevWorker0.postMessage({
			data: {
				tileUID: tileUID,
				tileSize: tileSize,
				array: imageData.data,
				drawElev: drawElev
			},
			type: 'tiledata'
		}, [imageData.data.buffer]);
	};

	// Source of image tile
	imageObj.crossOrigin = 'Anonymous';
	imageObj.src = 'https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/' + zoom + '/' + tile.x + '/' + tile.y + '.pngraw?access_token=' + L.mapbox.accessToken;

};

elevWorker0.addEventListener('message', function (response) {
	if (response.data.type === 'tiledata') {
		var dispData = tileContextsElev0[response.data.data.tileUID].createImageData(tileSize, tileSize);
		dispData.data.set(response.data.data.array);
		tileContextsElev0[response.data.data.tileUID].putImageData(dispData, 0, 0);
	}
}, false);

elevTiles0.addTo(map);

// End elevTiles0

// Start elevTiles8Point9

var elevTiles8Point9 = new L.TileLayer.Canvas({
	unloadInvisibleTiles: true,
	attribution: "Imagery &copy; <a href='https://www.openstreetmap.org/copyright' target='_blank'>OpenStreetMap contributors</a>, Data &copy; <a href='https://choices.climatecentral.org/' target='_blank'>Climate Central Mapping Choices</a>"
});


elevTiles8Point9.on('tileunload', function (e) {
	//Send tile unload data to elevWorker to delete un-needed pixel data
	elevWorker8Point9.postMessage({
		'data': e.tile._tilePoint.id,
		'type': 'tileunload'
	});
});

var elevWorker8Point9 = new Worker('js/imagedata.js');

var tileContextsElev8Point9 = {};

elevWorker8Point9.postMessage({
	data: 8.9,
	type: 'setfilter'
});

elevTiles8Point9.drawTile = function (canvas, tile, zoom) {
	tileSize = this.options.tileSize;

	var context = canvas.getContext('2d'),
		imageObj = new Image(),
		tileUID = '' + zoom + '/' + tile.x + '/' + tile.y;

	var drawContext = canvas.getContext('2d');

	// To access / delete elevTiles later
	tile.id = tileUID;

	tileContextsElev8Point9[tileUID] = drawContext;

	imageObj.onload = function () {
		// Draw Image Tile
		context.drawImage(imageObj, 0, 0);

		// Get Image Data
		var imageData = context.getImageData(0, 0, tileSize, tileSize);

		elevWorker8Point9.postMessage({
			data: {
				tileUID: tileUID,
				tileSize: tileSize,
				array: imageData.data,
				drawElev: drawElev
			},
			type: 'tiledata'
		}, [imageData.data.buffer]);
	};

	// Source of image tile
	imageObj.crossOrigin = 'Anonymous';
	imageObj.src = 'https://a.tiles.mapbox.com/v4/mapbox.terrain-rgb/' + zoom + '/' + tile.x + '/' + tile.y + '.pngraw?access_token=' + L.mapbox.accessToken;

};

elevWorker8Point9.addEventListener('message', function (response) {
	if (response.data.type === 'tiledata') {
		var dispData = tileContextsElev8Point9[response.data.data.tileUID].createImageData(tileSize, tileSize);
		dispData.data.set(response.data.data.array);
		tileContextsElev8Point9[response.data.data.tileUID].putImageData(dispData, 0, 0);
	}
}, false);

elevTiles8Point9.addTo(map);

// End elevTiles8Point9

map.touchZoom.disable();
map.doubleClickZoom.disable();

var range = document.getElementById('range');

function clip() {
	var nw = map.containerPointToLayerPoint([0, 0]),
		se = map.containerPointToLayerPoint(map.getSize()),
		clipX = nw.x + (se.x - nw.x) * range.value;
	elevTiles8Point9.getContainer().style.clip = 'rect(' + [nw.y, se.x, se.y, clipX].join('px,') + 'px)';
}

range['oninput' in range ? 'oninput' : 'onchange'] = clip;
map.on('move', clip);
clip();

function formatElev(elev) {
	return Math.round(elev) + ' m';
}

function formatTemp(temp) {
	return Math.round(temp) + '° f';
}

var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this._div.innerHTML = '<p>Swipe between layers to see the difference between Bangladesh with current sea levels (left) and Bangladesh with 8.9 meters (29.2 feet) of global sea level rise (right), which corresponds to global warming reaching 4°C above pre-industrial levels.</p>';
	return this._div;
};

info.addTo(map);