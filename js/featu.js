define(['jquery',
	'underscore',
	'contextmenu',
	'wicket',
	'knockout-min',
	'app/instaGIS',
	'app/dialogs',
	'app/representations',
	'gmaps',
	'shapearray'
], function(jQuery, _, ContextMenu, Wkt, ko, instaGIS) {

	//instaGIS=instaGIS || {};



	ko.extenders.wkt2kmlcenter = function(target, viewModel) {
		var result = ko.computed({
			read: target,
			write: function(newValue) {
				var current = target();
				if (newValue != current) {
					target(newValue);
					var currentposition = instaGIS.geom2point(newValue);
					viewModel.feature.set('center', currentposition);
				}
			}
		});
		result(target());
		return result;
	};

	ko.extenders.wkt2kmlgeometry = function(target, viewModel) {
		var result = ko.computed({
			read: target,
			write: function(newValue) {
				var current = target();
				if (newValue != current) {
					target(newValue);
					viewModel.feature.set('geometry', newValue);
					//console.log('updated geometry',newValue);
					globalmap.listentriggers && instaGIS.enqueueSavePolygons(viewModel.feature);
				}
			}
		});
		result(target());
		return result;
	};

	ko.extenders.rename = function(target, viewModel) {
		var result = ko.computed({
			read: target,
			write: function(newValue) {
				var current = target();
				if (newValue != current) {
					target(newValue);
					viewModel.feature.set('name', newValue);
				}
			}
		});
		result(target());
		return result;
	};

	ko.extenders.changecolor = function(target, viewModel) {
		var result = ko.computed({
			read: target,
			write: function(newValue) {
				var current = target();
				if (newValue != current) {
					target(newValue);
					viewModel.feature.set('fillColor', String('#' + newValue).replace('##', '#'));
				}
			}
		});
		result(target());
		return result;
	};

	ko.extenders.updateradius = function(target, viewModel) {
		var result = ko.computed({
			read: target,
			write: function(newValue) {
				var current = target();
				if (newValue != current) {
					target(newValue);
					viewModel.feature.set('radius', newValue);

				}
			}
		});
		result(target());
		return result;
	};

	ko.extenders.setMap = function(target, viewModel) {
		var result = ko.computed({
			read: target,
			write: function(newValue) {
				var current = target();
				if (newValue != current) {
					target(newValue);
					if (newValue) {
						viewModel.feature.setMap(globalmap);
						viewModel.feature.label && viewModel.feature.label.setMap(globalmap);
					} else {
						viewModel.feature.setMap(null);
						viewModel.feature.label && viewModel.feature.label.setMap(null);
					}
				}
			}
		});
		result(target());
		return result;
	};


	instaGIS.SimpleRectangle = function() {
		var position = globalmap.getCenter();
		var X0Y0 = new google.maps.LatLng(Number(position.lat()).toFixed(3) - 0.0001, Number(position.lng()).toFixed(3) - 0.0001);
		var X1Y1 = new google.maps.LatLng(Number(Number(position.lat()).toFixed(3)) + 0.0001, Number(Number(position.lng()).toFixed(3)) + 0.0001);
		console.log(X0Y0, X1Y1);
		var Rectangle = new google.maps.Rectangle({
			map: globalmap,
			bounds: new google.maps.LatLngBounds(X0Y0, X1Y1),
			draggable: true,
			editable: true

		});
	};

	instaGIS.Feature = function(polygon, container, addToGlobalmap, saveAfterInsert) {
		var id_user = instaGIS.getUser();
		var self = this;
		contenedor = container || '#current_polygons';
		globalmap.multipolygon = globalmap.multipolygon || {};

		polygon.fillColor = String('#' + polygon.fillColor).replace('##', '#');
		self.category = 'featureModel';
		self.prefix = polygon.prefix;

		var currentposition = instaGIS.geom2point(polygon.center);
		self.position = ko.observable(currentposition);

		self.removaltype = polygon.removaltype;
		self.type = polygon.type;
		self.name = ko.observable(polygon.name).extend({
			rename: self
		});
		self.fillColor = polygon.fillColor; //ko.observable(polygon.fillColor).extend({changecolor:self});
		self.geometry = ko.observable(polygon.geometry).extend({
			wkt2kmlgeometry: self
		});
		self.id_owner = polygon.owner_polygon || id_user;
		self.radius = ko.observable(polygon.radius).extend({
			updateradius: self
		});
		self.center = ko.observable(polygon.center).extend({
			wkt2kmlcenter: self
		});
		self.id_polygon = polygon.id_polygon; //ko.observable(polygon.id_polygon);


		self.id_polygonset = polygon.id_polygonset;

		self.get = function(property) {
			return self[property]();
		};

		self.set = function(property, value) {
			return self[property](value);
		};

		self.checked = ko.observable(polygon.visible).extend({
			setMap: self
		});

		self.map = ko.computed(function() {
			if (self.checked()) {
				if (globalmap.tour_guide && globalmap.tour_guide.status && (globalmap.tour_guide.type = 'polygon') && jQuery.prompt.currentStateName == 2) {
					jQuery.prompt.nextState();
				}
				return globalmap;
			} else {
				return null;
			}
		}, self);


		if (self.type == 'circle') {
			self.feature = new google.maps.Circle({
				radius: self.radius(),
				center: self.position(),
			});
		} else if (self.type == 'polygon') {
			self.feature = new google.maps.Polygon({
				paths: instaGIS.geom2poly(self.geometry()),
			});

		} else if (self.type == 'isochrone') {
			self.feature = new google.maps.Polygon({
				paths: instaGIS.geom2poly(self.geometry()),
			});
		}

		jQuery(contenedor).append('<label id="' + polygon.prefix + polygon.id_polygon + '" data-bind="attr: {\'data-id_polygonset\': id_polygonset, \'data-type\':type, \'data-id_polygon\':id_polygon, \'data-name\':name  }" class="checkbox polygon">&nbsp;&nbsp;</label>');
		jQuery('#' + polygon.prefix + polygon.id_polygon).prepend('<i  data-bind="style: { color: fillColor }" class="icon-shape-' + polygon.type + '"/>');
		jQuery('#' + polygon.prefix + polygon.id_polygon).append('<span  data-bind="html: name" ></span>');
		jQuery('#' + polygon.prefix + polygon.id_polygon).prepend('<input type="checkbox" class="mypolygons" id="mypolygons_' + polygon.id_polygon + '"  data-bind="checked:checked , attr: {\'data-id_polygon\':id_polygon,  \'data-geometry\':geometry , \'data-fillcolor\':fillColor, \'data-radius\':radius, \'data-type\':type , \'data-id_current_polygon\':id_polygon, \'data-name\':name, \'data-center\':center }" >');

		if (globalmap.isPublic == undefined || !globalmap.isPublic) {
			jQuery('#' + polygon.prefix + polygon.id_polygon).prepend('<div  data-bind="attr: {\'data-id_current_polygon\':id_polygon, \'data-name\':name, \'data-type\':removaltype  }"   title="remove this polygon"  class="remove-element icon-remove"></div>');
		}

		jQuery('#' + polygon.prefix + polygon.id_polygon).prepend('<div  data-bind="attr: {\'data-id_polygon\':id_polygon,  \'data-name\':name,  \'data-type\':type }"  title="zoom to this polygon"  class="fitbounds-element icon-pushpin"></div>');


		var thischeckbox = jQuery('#mypolygons_' + polygon.id_polygon, contenedor);
		self.feature.setOptions({
			fillColor: self.fillColor,
			fillOpacity: 0.4,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			strokeColor: '#1E90FF',
			map: self.map(),
			position: self.position(),
			type: self.type,
			geometry: self.geometry(),
			name: self.name(),
			id_feature: self.type + '_' + self.id_polygon

		});


		self.feature.updatepending = 0;
		self.feature.order = self.order || 1;


		self.feature.geometry = self.geometry();
		self.feature.type = self.type;
		self.feature.center = self.feature.getCenter();
		self.feature.position = self.center();
		self.id = self.feature.id = self.type + '_' + self.id_polygon;
		self.feature.id_polygon = self.id_polygon;
		self.feature.id_polygonset = self.id_polygonset;
		self.feature.category = 'feature';
		self.feature.checkbox = thischeckbox;
		thischeckbox.data('feature', self.feature);



		var showMeasures = function(feature) {

			var name, measurement, squareMeters = 0;

			if (_.size(globalmap.multipolygon) <= 1 || !_.has(globalmap.multipolygon, feature.id)) {
				measurement = google.maps.geometry.spherical.computeArea(feature.getPath());
				squareMeters = measurement.toFixed(2);
				name = feature.name;
			} else {
				for (id in globalmap.multipolygon) {
					measurement = google.maps.geometry.spherical.computeArea(globalmap.multipolygon[id].getPath());
					squareMeters += parseFloat(measurement.toFixed(2));
				}
				name = "MULTIPOLYGON";
			}

			var polygconControlDiv = $('#polygonControl');

			polygconControlDiv.html('<b>' + name + '</b> with ' + squareMeters + '  square meters.');
			polygconControlDiv.show();
		}

		var hideMeasures = function() {
			$('#polygonControl').hide();
		}


		google.maps.event.addListener(self.feature, 'dragend', function() {
			self.center(instaGIS.vertices2geometry(self.feature.getCenter(), 'point'));
			self.geometry(
				(self.type == 'circle') ?
				instaGIS.vertices2geometry(self.feature.getVertices(), 'polygon') :
				instaGIS.vertices2geometry(self.feature.getPaths().getArray(), 'polygons')
			);
			console.log('dragend');

		}.bind(self));

		google.maps.event.addListener(self.feature, 'fillcolor_changed', function() {
			self.fillColor = self.feature.get('fillColor');
			//console.log('fillColor_changed');
			globalmap.listentriggers && instaGIS.enqueueSavePolygons(self.feature);
		}.bind(self));

		google.maps.event.addListener(self.feature, 'name_changed', function() {
			newvalue = self.feature.get('name');
			self.feature.label && self.feature.label.set('text', newvalue);
			if (newvalue != self.name()) {
				self.name(newvalue);
				console.log('feature name changed');
				globalmap.listentriggers && instaGIS.enqueueSavePolygons(self.feature);
			}
		}.bind(self));

		google.maps.event.addListener(self.feature, 'radius_changed', function() {
			self.radius(self.feature.getRadius());
			self.geometry(
				(self.type == 'circle') ?
				instaGIS.vertices2geometry(self.feature.getVertices(), 'polygon') :
				instaGIS.vertices2geometry(self.feature.getPaths().getArray(), 'polygons')
			);
			console.log('radius_changed');
			showMeasures(this.feature);

		}.bind(self));



		google.maps.event.addListener(self.feature, 'center_changed', function() {
			var newcenterKML = self.feature.getCenter();
			var newcenterWKT = instaGIS.vertices2geometry(newcenterKML, 'point');
			if (newcenterWKT != self.center()) {
				self.center(newcenterWKT);
				self.geometry(
					(self.type == 'circle') ?
					instaGIS.vertices2geometry(self.feature.getVertices(), 'polygon') :
					instaGIS.vertices2geometry(self.feature.getPaths().getArray(), 'polygons')
				);
				console.log('center_changed');
				//instaGIS.enqueueSavePolygons(self.feature);

			}
			self.feature.label.set('position', newcenterKML);
		}.bind(self));



		google.maps.event.addListener(self.feature, 'paths_changed', function() {
			self.position(self.feature.getCenter());
			self.center(instaGIS.vertices2geometry(self.feature.getCenter(), 'point'));
			self.geometry(
				instaGIS.vertices2geometry(self.feature.getPaths().getArray(), 'polygons')
			);
			console.log('paths_changed');
		}.bind(self));

		if (self.type == 'polygon' || self.type == 'isochrone') {
			var thePath = self.feature.getPath();
			thePath.parent = self.feature;
			google.maps.event.addListener(thePath, 'set_at', function() {

				self.center(instaGIS.vertices2geometry(thePath.parent.getCenter(), 'point'));
				self.geometry(
					instaGIS.vertices2geometry(thePath.parent.getPaths().getArray(), 'polygons')
				);
				//console.log('set at',thePath.parent.getPaths().getArray());
				self.position(self.feature.getCenter());
				//instaGIS.enqueueSavePolygons(self.feature);
				showMeasures(this.feature);
			}.bind(self));

			google.maps.event.addListener(thePath, 'insert_at', function() {

				self.center(instaGIS.vertices2geometry(thePath.parent.getCenter(), 'point'));
				self.geometry(
					instaGIS.vertices2geometry(thePath.parent.getPaths().getArray(), 'polygons')
				);
				self.position(self.feature.getCenter());
				//console.log('insert_at',thePath.parent.getPaths().getArray());
				//instaGIS.enqueueSavePolygons(self.feature);

			}.bind(self));
		}

		google.maps.event.addListener(self.feature, 'mouseover', function(event) {
			if (_.has(globalmap.multipolygon, self.feature.id)) {
				showMeasures(this.feature);
				return;
			}
			if (globalmap.inmenu) return;
			self.feature.setEditable(true);
			self.feature.setOptions({
				zIndex: 5000,
				fillOpacity: 0.8,
				strokeColor: '#0a0'
			});
			jQuery('#polygonlabel_' + self.feature.id_polygon).addClass('highlight');
			jQuery('#currentpolygonlabel_' + self.feature.id_polygon).addClass('highlight');
			showMeasures(this.feature);
		}.bind(self));

		google.maps.event.addListener(self.feature, 'mouseout', function(event) {
			if (_.has(globalmap.multipolygon, self.feature.id)) {
				hideMeasures();
				return;
			}
			self.feature.setEditable(false);
			self.feature.setOptions({
				zIndex: self.feature.order,
				fillOpacity: 0.40,
				strokeColor: '#1E90FF'
			});
			jQuery('#polygonlabel_' + self.feature.id_polygon).removeClass('highlight');
			jQuery('#currentpolygonlabel_' + self.feature.id_polygon).removeClass('highlight');
			hideMeasures();
		}.bind(self));


		google.maps.event.addListener(self.feature, 'click', function() {
			if (globalmap.inmenu) return;
			var shiftKey = window.event.shiftKey;
			if (shiftKey) {
				globalmap.multipolygon[self.feature.id] = self.feature;
				instaGIS.selectedPolygons(globalmap.multipolygon, shiftKey);
			} else {
				instaGIS.selectedPolygons(globalmap.multipolygon, shiftKey);
				globalmap.multipolygon = {};
			}
		}.bind(self));

		google.maps.event.addListener(self.feature, 'rightclick', function(mouseEvent) {
			instaGIS.hideAllMenus();
			jQuery('#menuclickderecho_polygons').data('feature', null);
			jQuery("#polygon_mycolor").colorpicker({
				color: self.feature.get('fillColor')
			});
			instaGIS.updateGeoLocation(mouseEvent.latLng);

			//console.log(jQuery('#menuclickderecho_polygons').data() );
			//jQuery('.evo-pointer','#menuclickderecho_polygons').css('background',self.feature.get('fillColor'));




			jQuery('.evo-pointer', '#menuclickderecho_polygons').css('background', self.feature.get('fillColor'));
			if (!self.feature.center) {
				self.feature.center = self.feature.getCenter();
			}
			jQuery('#menuclickderecho_polygons').data('position', self.feature.center);

			console.log('rightclick on element', self.feature);


			jQuery('#menuclickderecho_polygons').data('feature', self.feature);
			jQuery('#menuclickderecho_polygons').data('geometry', self.feature.geometry);
			jQuery('#menuclickderecho_polygons').data('type', self.feature.type);
			if (self.feature.category == 'feature') {
				jQuery('#polygon_delete').show();
			} else {
				console.log(self.feature.category);
				jQuery('#polygon_delete').hide();
			}



			if (!self.feature.center) {
				self.feature.center = self.feature.getCenter();
			}
			jQuery('#menuclickderecho_polygons').data('position', self.feature.center);

			if (_.size(globalmap.multipolygon) > 1 && _.has(globalmap.multipolygon, self.feature.id)) {
				jQuery('#polygon_change_color', '#menuclickderecho_polygons').hide();
				jQuery('#polygon_make_draggable', '#menuclickderecho_polygons').hide();
				jQuery('#polygon_ocultar', '#menuclickderecho_polygons').hide();
			} else {
				jQuery('#polygon_change_color', '#menuclickderecho_polygons').show();
				jQuery('#polygon_make_draggable', '#menuclickderecho_polygons').show();
				jQuery('#polygon_ocultar', '#menuclickderecho_polygons').show();
			} if (instaGIS.contextMenu['polygons'])
				instaGIS.contextMenu['polygons'].show(mouseEvent.latLng);

			jQuery("#polygon_mycolor").colorpicker({
				color: self.feature.get('fillColor')
			});
		}.bind(self));


		if (self.feature.type == 'isochrone') {
			instaGIS.drawingManager.setDrawingMode(null);
			self.feature.label = new google.maps.Label({
				position: self.feature.getPath().getArray()[0],
				map: self.map(),
				text: self.name(),
				fontSize: 14,
				align: 'center'
			}, 'elementlabel');
		} else {
			instaGIS.drawingManager.setDrawingMode(null);
			self.feature.label = new google.maps.Label({
				position: self.position(),
				map: self.map(),
				text: self.name(),
				fontSize: 14,
				align: 'center'
			}, 'elementlabel');
		}
		addToGlobalmap && instaGIS.addToGlobalmap(self.feature);
		addToGlobalmap && instaGIS.addToGlobalmap(self);

		if (saveAfterInsert) {
			_.delay(instaGIS.enqueueSavePolygons, 200, self.feature);
		}
	};


	instaGIS.selectedPolygons = function(multipolygon, key) {
		if (_.size(multipolygon) == 0) return;
		if (key) {
			_.each(multipolygon, function(obj) {
				obj.setEditable(true);
				obj.setOptions({
					zIndex: 5000,
					fillOpacity: 0.8,
					strokeColor: '#0a0'
				});
				jQuery('#polygonlabel_' + obj.id_polygon).addClass('highlight');
				jQuery('#currentpolygonlabel_' + obj.id_polygon).addClass('highlight');
			});
		} else {
			_.each(multipolygon, function(obj) {
				obj.setEditable(false);
				obj.setOptions({
					zIndex: obj.order,
					fillOpacity: 0.40,
					strokeColor: '#1E90FF'
				});
				jQuery('#polygonlabel_' + obj.id_polygon).removeClass('highlight');
				jQuery('#currentpolygonlabel_' + obj.id_polygon).removeClass('highlight');
			});
		}
	};


	instaGIS.loadMapFeatures = function(id_map) {
		id_map = id_map || globalmap.id_map;
		jQuery.ajax({
			url: '/interfaces/polygon/by_map/' + id_map,
			type: 'GET',
			dataType: 'json'
		}).done(function(polygons) {
			//console.log(polygons);
			for (i = 0; i < polygons.length; i++) {
				instaGIS.loadFeature(polygons[i], 'DB');
			}
		});
	};


	instaGIS.loadSingleFeature = function(id_polygon, callback) {
		jQuery.ajax({
			url: '/interfaces/polygon/by_map/' + globalmap.id_map + '/' + id_polygon,
			type: 'GET',
			dataType: 'json'
		}).done(function(polygons) {
			callback && callback(polygons[0]);
		});
	};

	instaGIS.loadFeature = function(polygon, origin) {

		if (!polygon) return;
		//instaGIS.updatePolygon(polygon,polygon.visible,);	
		polygon.id = polygon.id || instaGIS.cleanString(polygon.name);
		polygon.id_polygon = polygon.id_polygon || polygon.id.split('_')[1];
		polygon.fillColor = polygon.fillColor || '#1E90FF';
		polygon.container = polygon.container || '#current_polygons';
		polygon.id_polygonset = polygon.id_polygonset || 'currentmap';
		if (polygon.container == '#current_polygons') {
			polygon.prefix = 'currentpolygonlabel_';
			polygon.removaltype = 'current_polygon';
		} else {
			polygon.prefix = 'polygonlabel_';
			polygon.removaltype = 'polygon';
		}
		polygon.radius = parseFloat(polygon.radius);
		polygon.fillColor = polygon.fillcolor;
		//console.log('#' + polygon.prefix + polygon.id_polygon);
		if (jQuery('#' + polygon.prefix + polygon.id_polygon).length === 0) {
			ko.applyBindings(new instaGIS.Feature(polygon, polygon.container, true), jQuery('#' + polygon.prefix + polygon.id_polygon)[0]);
			instaGIS.loadingcircle(null, 0, null, '#polygonsmsg');
		} else {
			var handle = polygon.type + '_' + polygon.id_polygon;
			globalmap.featureModel[handle].fillColor = polygon.fillColor;
			globalmap.featureModel[handle].name(polygon.name);
			globalmap.featureModel[handle].center(polygon.center);
			globalmap.featureModel[handle].radius(polygon.radius);

			if (polygon.type != 'circle') {
				globalmap.feature[handle].setPaths(instaGIS.geom2poly(polygon.geometry));
			}

			if (polygon.visible) {
				globalmap.feature[handle].setMap(globalmap);
			} else {
				globalmap.feature[handle].setMap(null);
			}
			//instaGIS.enqueueSavePolygons(self.feature);



		}
	}


	instaGIS.getMyPolygonSets = function(id_polygon) {

		instaGIS.loadingcircle('Refreshing polygons...', 1, null, '#polygons_library');
		jQuery.ajax({
			url: '/interfaces/polygon/getsets',
			type: 'GET',
			dataType: 'json',
			beforeSend: function(xhr) {
				xhr.onreadystatechange = function(a, b, c) {
					console.log('State Change', a, b, c);
				};
			}
		}).done(function(polygonsets) {
			console.log(polygonsets);
			arraypolygons = {};
			for (i = 0; i < polygonsets.length; i++) {
				polygonset = polygonsets[i];
				arraypolygons[polygonset.id_polygonset] = arraypolygons[polygonset.id_polygonset] || {
					owner_set: polygonset.owner_set,
					name_set: polygonset.name_set,
					polygons: []
				};
				if (polygonset.id_polygon) arraypolygons[polygonset.id_polygonset].polygons.push({
					id_polygon: polygonset.id_polygon,
					type: polygonset.type,
					name: polygonset.name_polygon,
					fillColor: polygonset.fillColor,
					geometry: polygonset.geometry,
					id_owner: polygonset.owner_polygon,
					radius: polygonset.radius,
					center: polygonset.center,
					id_polygonset: polygonset.id_polygonset
				});

				if (i == 0) var default_polygonset = polygonset.id_polygonset;
			}

			for (i in arraypolygons) {
				var elemento = {
					domid: 'set' + i,
					id: i,
					name: arraypolygons[i].name_set,
					type: 'polygonset',
					category: 'polygonset',
					collapsed: '',
					clickable: false,
					iconclass: 'icon-plus',
					container: 'polygons_library',
					image: 'http://static.instagis.com/img/icons/glyphicons_099_vector_path_all.png'
				};
				console.log(i);

				if ($('#accordion-group_set' + i).length == 0) {
					instaGIS.addCollapsible(elemento);
				}
				for (k = 0; k < arraypolygons[i].polygons.length; k++) {
					polygon = arraypolygons[i].polygons[k];
					instaGIS.updatePolygon(polygon, false, '#polygonset_set' + i + ' .polygonset');
				}
			}

			jQuery('#polygonset_' + default_polygonset + ' .polygonset').attr('id', 'default_polygonset');
			instaGIS.loadingcircle('', 0, null, '#polygons_library');
			if (id_polygon) jQuery('#mypolygons_' + id_polygon).click();
		}).fail(function() {
			instaGIS.loadingcircle('', 0, null, '#polygons_library');
		});

	};





	instaGIS.updatePolygon = function(polygon, visible, container) {
		container = container || '#current_polygons';
		polygon.id_polygonset = polygon.id_polygonset || 'currentmap';

		if (container == '#current_polygons') {
			prefix = 'currentpolygonlabel_';
			removaltype = 'current_polygon';
		} else {
			prefix = 'polygonlabel_';
			removaltype = 'polygon';
		}
		//console.log(prefix+polygon.id_polygon);


		if (jQuery(prefix + polygon.id_polygon).length == 0) {
			jQuery(container).append('<label id="' + prefix + polygon.id_polygon + '" data-id_polygonset="' + polygon.id_polygonset + '" data-type="' + polygon.type + '" data-id_polygon="' + polygon.id_polygon + '" data-name="' + polygon.name + '" class="checkbox polygon"><i class="icon-shape-' + polygon.type + '"/>&nbsp;&nbsp;<span>' + polygon.name + '</span></label>');
			jQuery('#' + prefix + polygon.id_polygon).prepend('<input type="checkbox"  id="mypolygons_' + polygon.id_polygon + '" data-id_polygonset="' + polygon.id_polygonset + '" class="mypolygons" data-fillcolor="' + polygon.fillColor + '" data-geometry="' + polygon.geometry + '" data-name="' + polygon.name + '"  data-center="' + polygon.center + '"   data-radius="' + polygon.radius + '"  data-type="' + polygon.type + '"  data-id_polygon="' + polygon.id_polygon + '" >');
			jQuery('#' + prefix + polygon.id_polygon).prepend('<div  data-id_' + removaltype + '="' + polygon.id_polygon + '" data-name="' + polygon.name + '" title="remove this polygon" data-type="' + removaltype + '" class="remove-element icon-remove"></div>');
			jQuery('#' + prefix + polygon.id_polygon).prepend('<div  data-id_polygon="' + polygon.id_polygon + '" data-name="' + polygon.name + '" title="zoom to this polygon" data-type="' + polygon.type + '" class="fitbounds-element icon-pushpin"></div>');
		} else {
			jQuery('#' + prefix + polygon.id_polygon + ' span', container).html(polygon.name);
			jQuery('#mypolygons_' + polygon.id_polygon, container).data('fillcolor', polygon.fillColor);
			if (polygon.geometry) {
				jQuery('#' + prefix + polygon.id_polygon, container).data('geometry', polygon.geometry);
			}
			if (polygon.center) {
				jQuery('#' + prefix + polygon.id_polygon, container).data('center', polygon.center);
			}
			jQuery('#' + prefix + polygon.id_polygon, container).data('name', polygon.name);
			jQuery('#' + prefix + polygon.id_polygon, container).data('radius', polygon.radius);
			jQuery('#' + prefix + polygon.id_polygon, container).data('type', polygon.type);
		}
		if (visible && !jQuery('#mypolygons_' + polygon.id_polygon, container).is(':checked')) {
			jQuery('#mypolygons_' + polygon.id_polygon, container).click();
		}
		jQuery('#polygonlabel_' + polygon.id_polygon).draggable({
			revert: "invalid",
			scroll: false,
			cursorAt: {
				top: 15
			},
			helper: 'clone',
			zIndex: 2100,
			containment: '#controles',
			drag: function(event, ui) {
				ui.helper.closest('.collapse').addClass('overflower');
				jQuery('#controles_lateral').addClass('overflower');

			},
			stop: function(event, ui) {
				ui.helper.closest('.collapse').removeClass('overflower');
				jQuery('#controles_lateral').removeClass('overflower');
			}
		});
	};



	instaGIS.createPolygonSet = function(polygonset_name) {
		instaGIS.loadingcircle('Refreshing polygons...', 1, null, '#polygons_library');
		jQuery.ajax({
			url: '/interfaces/polygon/createset',
			type: 'POST',
			dataType: 'json',
			data: {
				name: polygonset_name
			}
		}).done(function(polygonset) {
			//console.log(polygonset)	;
			if (polygonset.status == 'success') {
				var elemento = {
					id: polygonset.id_polygonset,
					name: polygonset.name_set,
					type: 'polygonset',
					category: 'polygonset',
					collapsed: '',
					clickable: false,
					iconclass: 'icon-plus',
					container: 'polygons_library'
				};
				if (jQuery('#accordion-group_' + i).length == 0) instaGIS.addCollapsible(elemento);
			}
		}).always(function() {
			instaGIS.loadingcircle('', 0, null, '#polygons_library');
		});
	};



	instaGIS.getmypolygons = function(id_user, id_polygon) {
		instaGIS.loadingcircle('Refreshing polygons...', 1, null, '#polygons_library');
		jQuery.ajax({
			url: '/interfaces/polygon/' + id_user,
			type: 'GET',
			dataType: 'json'
		}).done(function(polygons) {
			//console.log(polygons);
			for (i = 0; i < polygons.length; i++) {
				var polygon = polygons[i];
				jQuery('#loadinganimation').remove();
				var id_polygonset = jQuery('#polygons_library .accordion-group').eq(0).data('id_polygonset');
				instaGIS.updatePolygon(polygon, false, '#polygonset_' + id_polygonset + ' .polygonset');
			}
			if (id_polygon) jQuery('#mypolygons_' + id_polygon).click();
		}).fail(function() {
			instaGIS.loadingcircle('', 0, null, '#polygons_library');
		});
	};



	instaGIS.renamePolygon = function(id_polygon, name_polygon) {
		console.log(id_polygon, name_polygon);
		if (jQuery('#currentpolygonlabel_' + id_polygon).length > 0) {
			var theid = 'currentpolygonlabel_' + id_polygon;
			var target = '#current_polygons';
		} else {
			var theid = 'polygonlabel_' + id_polygon;
			var target = '#polygons_library';
		}
		currentlabel = jQuery('#' + theid);
		jQuery('.inputlayername', '#mypolygons').each(function() {
			thelabel = jQuery(this).data('label');
			jQuery(this).remove();
			jQuery('#' + thelabel, '#mypolygons').show();
		});
		currentlabel.append('<input type="text" id="layernameeditor" data-label="' + theid + '" data-target="' + target + '" class="info inputlayername" data-trigger="manual" data-placement="right" data-title="Edit polygon name. Press ENTER when done" data-container="body" value="' + name_polygon + '" />');
		jQuery('#' + theid + ' span').hide();
		jQuery('#layernameeditor').focus().tooltip('show');


	};



	instaGIS.cancelRenamePolygon = function(id_polygon) {
		var theid = 'polygonlabel_' + id_polygon;
		jQuery('#' + theid + ' span').show();
		jQuery('#layernameeditor').tooltip('hide');
		jQuery('#layernameeditor').hide();
		console.log('cancelando rename de poligono');
	};






	instaGIS.getNewPolygonId = function(callback) {
		jQuery.ajax({
			url: '/interfaces/polygon/getid',
			type: 'POST'
		}).done(function(response) {
			callback && callback(response);
		});

	};

	instaGIS.updateFeature = function(FeatureUpdateListener, id_feature, type) {
		if (!id_feature || !type) {
			var feature = jQuery('#menuclickderecho_polygons').data('feature');
			id_feature = feature.id_polygon;
			type = feature.type;
		}

		if (!globalmap.id_map) {
			instaGIS.createNewMap(true, function() {
				instaGIS.updateFeature(FeatureUpdateListener, id_feature, type);
			});
		} else {
			if (!globalmap.feature) return;
			//console.log('updateFeature',id_feature,type);
			var element = globalmap.feature[type + '_' + id_feature];
			if (!element) return;
			var viewModel = globalmap.featureModel[type + '_' + id_feature];
			if (!element) {
				console.log('no element');
				return id_feature;
			}
			element.id_polygon = parseInt(id_feature);
			if (isNaN(element.id_polygon)) {
				instaGIS.getNewPolygonId(function(id_polygon) {
					element.id_polygon = id_polygon;
					instaGIS.updateFeature(FeatureUpdateListener, id_polygon, type);
				});
			}
			element.center = element.getCenter();
			element.radius = element.getRadius();
			element.centerwkt = instaGIS.vertices2geometry(element.center, 'point');
			element.vertices = element.getVertices();
			element.id_polygonset = element.id_polygonset || globalmap.default_dataset;
			element.geometry = element.geometry || instaGIS.vertices2geometry(element.getPaths().getArray(), 'polygons');
			var id_user = instaGIS.getUser();
			jQuery('#mypolygons_' + id_feature).data('geometry', element.geometry);

			var feature = {
				geometry: element.geometry,
				format: 'wkt',
				name: element.name,
				type: element.type,
				center: element.centerwkt,
				radius: element.radius,
				fillcolor: element.fillColor || '#003399',
				id_polygonset: element.id_polygonset,
				id_map: globalmap.id_map
			};
			if (element.getPaths().length == 1) feature.encodedpath = google.maps.geometry.encoding.encodePath(element.getPath());
			jQuery.ajax({
				url: '/interfaces/polygon/' + id_user + '/update/' + id_feature,
				type: 'POST',
				dataType: 'json',
				data: feature
			}).done(function(polygon) {
				console.log('updated polygon', polygon);
				globalmap.conn && globalmap.conn.emit('updatefeature', id_feature);
			}).fail(function() {
				console.log('no se pudo editar poligono');
			}).always(function() {
				FeatureUpdateListener && FeatureUpdateListener.resolve();
				return id_feature;
			});
		}

	};



	instaGIS.createPolygon = function(WKT) {
		var pos = parseInt(Math.random() * instaGIS.colorpicker["marker_mycolor"].subThemeColors.length, 10);
		var thecolor = '#' + instaGIS.colorpicker["marker_mycolor"].subThemeColors[pos];
		var paths = globalmap.instaGIS.geom2poly(WKT);
		var polygon = new google.maps.Polygon({
			strokeColor: thecolor,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: thecolor,
			fillOpacity: 0.35,
			map: globalmap,
			paths: paths,
			editable: true
		});
		globalmap.setCenter(paths[0][0]);
	};

	instaGIS.createRectangle = function(WKT) {
		var pos = parseInt(Math.random() * instaGIS.colorpicker["marker_mycolor"].subThemeColors.length, 10);
		var thecolor = '#' + instaGIS.colorpicker["marker_mycolor"].subThemeColors[pos];
		var paths = globalmap.instaGIS.geom2poly(WKT);
		var newbounds = new google.maps.LatLngBounds(
			paths[0][0], paths[0][1]
		);

		var polygon = new google.maps.Rectangle({
			strokeColor: thecolor,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: thecolor,
			fillOpacity: 0.35,
			map: globalmap,
			paths: paths,
			bounds: newbounds
		});
		globalmap.setCenter(paths[0][0]);
	};



	instaGIS.WKT2Object = function(WKT) {
		var wkt = new Wkt.Wkt();
		try {
			wkt.read(WKT);
		} catch (e) {
			console.log('Imposible leer geometría', WKT);
			return false;
		}
		try {
			var obj = wkt.toObject(); // Make an object
			obj.wkt = wkt;
			return obj;
		} catch (e) {
			console.log('Imposible exportar geometría', WKT);
			return false;
		}

	};



	instaGIS.vertices2geometry = function(verticesarray, type) {
		var pointarray = [],
			polygonarray = [],
			lastpoint = null,
			WKT;
		if (type == 'polygons') {
			for (i = 0; i < verticesarray.length; i++) {
				pointarray = [];
				var vertices = verticesarray[i].b;
				//console.log(verticesarray,i,verticesarray[i].getArray(),  vertices);
				jQuery.each(vertices, function(key, vertice) {
					if (key === 0) {
						lastpoint = vertice.lng() + ' ' + vertice.lat();
					}
					pointarray.push(vertice.lng() + ' ' + vertice.lat());
				});
				pointarray.push(lastpoint);
				polygonarray.push('(' + pointarray.join(',') + ')');

			}
			WKT = 'POLYGON(' + polygonarray.join(',') + ')';
			//console.log(WKT);

		} else if (type == 'polygon') {
			jQuery.each(verticesarray, function(key, vertice) {
				if (key === 0) {
					lastpoint = vertice.lng() + ' ' + vertice.lat();
				}
				pointarray.push(vertice.lng() + ' ' + vertice.lat());
			});
			pointarray.push(lastpoint);
			WKT = type.toUpperCase() + '((';

			WKT += pointarray.join(',');
			WKT += '))';
		} else if (type == 'point') {
			WKT = type.toUpperCase() + '(';
			WKT += verticesarray.lng() + ' ' + verticesarray.lat();
			WKT += ')';
		}
		return WKT;
	};



	instaGIS.geom2point = function(point) {
		xy = instaGIS.Wkt.read(point);
		return new google.maps.LatLng(xy[0].y, xy[0].x);
	};



	instaGIS.geom2poly = function(poly) {

		var polygonarray = [];
		var regex = /\(([^()]+)\)/g;
		var Rings = [];
		var results;
		while (results = regex.exec(poly)) {
			Rings.push(results[1]);
		}

		for (var i = 0; i < Rings.length; i++) {
			var pointarray = [];
			var pointsData = Rings[i].split(",");
			for (var j = 0; j < pointsData.length; j++) {
				var xy = pointsData[j].split(" ");
				var pt = new google.maps.LatLng(xy[1], xy[0]);
				pointarray.push(pt);
			}
			polygonarray.push(pointarray);
			// console.log(Rings,polygonarray);
		}

		return polygonarray;
	};




	instaGIS.makeGrid = function(options) {
		options = options || {};
		offsetx = options.offsetx || 0;
		offsety = options.offsety || 0;
		offsetx = parseInt(offsetx, 10);
		offsety = parseInt(offsety, 10);
		xslices = options.xslices || 60;
		yslices = options.yslices || 20;
		var thebounds = options.bounds || this.map.getBounds();
		var esquinas = {
			south: Math.floor(thebounds.getSouthWest().lat() * 100) / 100,
			west: Math.floor(thebounds.getSouthWest().lng() * 100) / 100,
			north: Math.ceil(thebounds.getNorthEast().lat() * 100) / 100,
			east: Math.ceil(thebounds.getNorthEast().lng() * 100) / 100
		};
		esquinas.themap = this.map;
		esquinas.deltax = (0.0000001 + esquinas.east - esquinas.west);
		esquinas.deltay = (0.0000001 + esquinas.north - esquinas.south);
		esquinas.ancho = 1 * Number(esquinas.deltax / xslices).toFixed(4);
		esquinas.alto = 1 * Number(esquinas.deltay / yslices).toFixed(4);
		//console.log(esquinas);
		esquinas.x0 = esquinas.west;
		esquinas.y0 = esquinas.south;
		esquinas.y1 = esquinas.south;
		esquinas.Rectangles = [];


		for (var filas = offsety; filas < (yslices - offsety); filas++) {
			for (var columnas = offsetx; columnas < (xslices - offsetx); columnas++) {
				esquinas.x0 = esquinas.west + columnas * esquinas.ancho;
				esquinas.y0 = 1 * esquinas.south + filas * esquinas.alto;
				esquinas.x1 = esquinas.x0 + esquinas.ancho;
				esquinas.y1 = esquinas.y0 + esquinas.alto;
				thebounds = new google.maps.LatLngBounds(new google.maps.LatLng(esquinas.y0, esquinas.x0), new google.maps.LatLng(esquinas.y1, esquinas.x1));
				var Rectangle = new google.maps.Rectangle({
					fillOpacity: 0.1,
					strokeWeight: 0.1,
					bounds: thebounds
				});
				if (options.map) Rectangle.setMap(options.map);
				esquinas.Rectangles.push(Rectangle);
			}
		}
		return esquinas.Rectangles;
	};

	instaGIS.makeComb = function(xslices) {

		var thebounds = this.map.getBounds();
		var divisor = [500, 500];
		var esquinas = {
			south: Math.floor(thebounds.getSouthWest().lat() * divisor[1]) / divisor[1],
			west: Math.floor(thebounds.getSouthWest().lng() * divisor[0]) / divisor[0],
			north: Math.ceil(thebounds.getNorthEast().lat() * divisor[1]) / divisor[1],
			east: Math.ceil(thebounds.getNorthEast().lng() * divisor[0]) / divisor[0]
		};
		esquinas.xslices = xslices || 40;

		esquinas.themap = this.map;
		esquinas.deltax = (0.0000001 + esquinas.east - esquinas.west);
		esquinas.deltay = (0.0000001 + esquinas.north - esquinas.south);
		esquinas.dLng = 1 * Number(esquinas.deltax / esquinas.xslices).toFixed(4);


		esquinas.polygons = [];


		esquinas.anchodelmapa = google.maps.geometry.spherical.computeDistanceBetween(thebounds.getSouthWest(), new google.maps.LatLng(esquinas.south, esquinas.east));
		esquinas.altodelmapa = google.maps.geometry.spherical.computeDistanceBetween(thebounds.getSouthWest(), new google.maps.LatLng(esquinas.north, esquinas.west));

		/**
		 * [dx distancia en metros del lado de un hexágono]
		 * @type {[float]}
		 * [dy distancia en metros de la transversal de un hexágono]
		 * @type {[float]}
		 */
		esquinas.dx = esquinas.anchodelmapa / (3 * esquinas.xslices);
		esquinas.dy = esquinas.dx * Math.sqrt(3) / 2;


		esquinas.transversal = google.maps.geometry.spherical.computeOffset(thebounds.getSouthWest(), esquinas.dy, 0);

		esquinas.yslices = Math.ceil(esquinas.altodelmapa / esquinas.dy);
		esquinas.dLat = 1 * Number(esquinas.deltay / esquinas.yslices).toFixed(5);
		console.log(esquinas);
		//return;


		for (var filas = 0; filas < esquinas.yslices; filas++) {
			if (filas % 2) {
				for (var columnas = 0; columnas <= esquinas.xslices; columnas++) {
					var Hexagon = window.google.maps.drawCircle(
						new google.maps.LatLng(esquinas.south + esquinas.dLat * filas, esquinas.west + esquinas.dLng * (3 * columnas - 2) / 3), esquinas.dx, {
							vertices: 6,
							map: esquinas.themap,
							strokeWeight: 0.1,
							fillColor: 'rgba(255,255,255,0)'
						}
					);
					esquinas.polygons.push(Hexagon);
				}
			} else {
				for (var columnas = 0; columnas <= esquinas.xslices; columnas++) {
					var Hexagon = window.google.maps.drawCircle(
						new google.maps.LatLng(esquinas.south + esquinas.dLat * filas, esquinas.west + esquinas.dLng * (3 * columnas - 0.5) / 3), esquinas.dx, {
							vertices: 6,
							map: esquinas.themap,
							strokeWeight: 0.1,
							fillColor: 'rgba(255,255,255,0)'
						}
					);
					esquinas.polygons.push(Hexagon);
				}
			}


		}
	};


	instaGIS.featureListeners = function(element) {
		element.setDraggable(false);
		element.originalopacity = element.get('fillOpacity');
		element.originalstrokeColor = element.get('strokeColor');
		element.originalEditable = element.get('editable');
		google.maps.event.addListener(element, 'mouseover', function(event) {
			if (globalmap.inmenu) return;
			this.unbind('fillOpacity');
			if (element.type != 'administrative' && element.type != 'county') {
				if (element.originalEditable) this.setEditable(true);
			} else if ((element.type == 'administrative' || element.type != 'county') && !globalmap.noLabels) {
				element.label.setOptions({
					position: element.center,
					map: instaGIS.map
				});
			}
			this.setOptions({
				zIndex: 5000,
				fillOpacity: 0.7,
				strokeColor: '#0a0'
			});
			jQuery('#polygonlabel_' + element.id_polygon + ', #currentpolygonlabel_' + element.id_polygon).addClass('highlight');
		});

		google.maps.event.addListener(element, 'mouseout', function(event) {
			this.setEditable(false);
			this.setOptions({
				zIndex: element.order,
				strokeColor: this.originalstrokeColor
			});
			jQuery('#polygonlabel_' + element.id_polygon + ', #currentpolygonlabel_' + element.id_polygon).removeClass('highlight');
			if (element.type == 'administrative' || element.type == 'county') {
				element.label.setMap(null);
			}
			if (this.modelFeature) {
				var modelOpacity = this.modelFeature.get('fillOpacity');
				this.setOptions({
					fillOpacity: modelOpacity,
					strokeOpacity: modelOpacity
				});
				this.bindTo('fillOpacity', this.modelFeature);
			} else {
				this.set('fillOpacity', this.originalopacity);
			}
		});

		google.maps.event.addListener(element, 'dblclick', function(event) {
			if (!jQuery('#mypolygons').hasClass('active')) jQuery('#tab_mypolygons').click();
			instaGIS.renamePolygon(element.id_polygon, element.name);
		});


		google.maps.event.addListener(element, 'rightclick', function(mouseEvent) {
			instaGIS.updateGeoLocation(mouseEvent.latLng);
			jQuery('#menuclickderecho_polygons').data('feature', null);
			instaGIS.hideAllMenus();
			jQuery("#polygon_mycolor").colorpicker({
				color: element.get('fillColor')
			});
			jQuery('.evo-pointer', '#menuclickderecho_polygons').css('background', element.get('fillColor'));
			if (!element.center) {
				element.center = element.getCenter();
			}
			jQuery('#menuclickderecho_polygons').data('position', element.center);

			console.log('rightclick on element', element);



			jQuery('#menuclickderecho_polygons').data('feature', element);
			jQuery('#menuclickderecho_polygons').data('geometry', element.geometry);
			jQuery('#menuclickderecho_polygons').data('type', element.type);
			jQuery('#menuclickderecho_polygons').data('category', element.category);

			instaGIS.contextMenu['polygons'].show(mouseEvent.latLng);
			if (element.category == 'feature') {
				jQuery('#polygon_delete').show();
			} else {
				console.log(element.category);
				jQuery('#polygon_delete').hide();
			}

		});

		google.maps.event.addListener(element, 'dragend', function(event) {
			element.label.position = element.getCenter();
			element.label.draw();
			console.log('dragend');
		});


	};






	instaGIS.DrawCounty = function(center, callback) {
		console.log('DrawCounty');
		var DeferredGetCountyInfo = new jQuery.Deferred();
		instaGIS.GetCountyInfo(center, DeferredGetCountyInfo);
		DeferredGetCountyInfo.done(function() {
			instaGIS.fillBoundariesArray(DeferredGetCountyInfo, callback);
		});
	};


	instaGIS.fillBoundariesArray = function(DeferredGetCountyInfo, callback) {
		var finalbounds = new google.maps.LatLngBounds();
		var counties = DeferredGetCountyInfo.counties
		var elemento = {};
		jQuery('#tab_datasets').click();
		if (DeferredGetCountyInfo.name) {
			elemento.name = DeferredGetCountyInfo.unit + ' ' + DeferredGetCountyInfo.name;
		} else {
			elemento.name = DeferredGetCountyInfo.unit + ' ' + (DeferredGetCountyInfo.divisiones.administrative_area_level_1 || 'Boundaries ' + instaGIS.randomname());
		}

		elemento.id = elemento.id_dataset = instaGIS.cleanString(elemento.name);
		elemento.category = 'demographics';
		elemento.iconclass = 'icon-minus';
		elemento.clickable = false;
		elemento.deletable = true;
		elemento.image = 'http://static.instagis.com/img/icons/glyphicons_096_vector_path_polygon.png';
		instaGIS.visualizationsOff(elemento, function() {

			elemento.pointarray = [];
			elemento.fields = {
				area: {
					label: 'Area',
					value: 'area',
					min: 1,
					max: 1
				},
				perimeter: {
					label: 'Perimeter',
					value: 'perimeter'
				},
			};
			elemento.quantityfilters = {
				area: {
					label: 'Area',
					value: 'area'
				}
			};



			instaGIS.addMVCArray(elemento, null, null, 'fillBoundariesArray', function(MVCArray) {
				for (i = 0; i < counties.length; i++) {
					var county = counties[i];
					var pos = parseInt(Math.random() * instaGIS.colorpicker["gradient_mycolor"].subThemeColors[0].length);
					var thecolor = instaGIS.colorpicker["gradient_mycolor"].subThemeColors[0][pos];
					//county.name=instaGIS.cleanString(county.name);
					county.geometry = county.geometry || county.shape;
					county.center = instaGIS.geom2point(county.center);
					county.lat_google = county.center.lat();
					county.lon_google = county.center.lng();
					county.location = county.center;
					county.position = county.center;
					county.type = 'administrative';
					county.strokeColor = thecolor;
					county.strokeOpacity = 0.8;
					county.strokeWeight = 2;
					county.fillColor = thecolor;
					county.fillOpacity = 0.1;
					MVCArray.push(county);
				}
				MVCArray.visualizations = {
					'marker': false,
					'shape': true,
					'heatmap': false,
					/*'grid':false, 'xls':false*/
				};
				MVCArray.fields = instaGIS.findFields(MVCArray);
				MVCArray.quantityfilters = instaGIS.clone(MVCArray.fields);
				MVCArray.quantityfilters = instaGIS.addMinMax(MVCArray);
				MVCArray.originalarray = MVCArray.getArray();
				MVCArray.length = MVCArray.getArray();


				if (jQuery('#accordion-group_' + MVCArray.id_dataset).length == 0) {
					MVCArray.collapsed = 'in';
					MVCArray.container = 'current_layers';
					MVCArray.containerclass = 'countyboundaries';
					MVCArray.clickable = false;

					MVCArray.removaltype = 'current_demographics';
					MVCArray.deletable = true;
					MVCArray.checked = 'checked';
					MVCArray.collapsed = 'in';
					MVCArray.iconclass = 'icon-minus';
					MVCArray.type = 'dataset';
					instaGIS.addCollapsible(MVCArray, 'shape');
				} else {
					console.log('Ya existe Collapsible', elemento);
				}

				instaGIS.saveMapAttachment(instaGIS.serializeDataset(MVCArray, 'demographics'));
				callback && callback();
			});
		});
	};




	instaGIS.drawFeature = function(thischeckbox, addToGlobalmap) {

		var geometry = thischeckbox.data('geometry');
		var format = thischeckbox.data('format');
		var id_polygon = thischeckbox.data('id_polygon');
		var radio = parseFloat(thischeckbox.data('radius'));
		var type = thischeckbox.data('type');
		var name = thischeckbox.data('name');
		var fillColor = thischeckbox.data('fillcolor');
		var id_polygonset = thischeckbox.data('id_polygonset');

		if (type == 'circle') {
			var newfeature = new google.maps.Circle({
				radius: radio,
				center: instaGIS.geom2point(thischeckbox.data('center')),
			});
		} else if (type == 'polygon') {
			var newfeature = new google.maps.Polygon({
				paths: instaGIS.geom2poly(geometry),
			});
		} else if (type == 'isochrone') {
			var newfeature = new google.maps.Polygon({
				paths: instaGIS.geom2poly(geometry),
			});
		}


		newfeature.setOptions({
			fillColor: fillColor,
			fillOpacity: 0.4,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			strokeColor: '#1E90FF'
		});
		newfeature.order = thischeckbox.data('order') || 1;
		/*newfeature.draggable=true;
			newfeature.editable=true;
			newfeature.clickable=true;*/

		newfeature.geometry = geometry;

		newfeature.name = name;
		newfeature.center = newfeature.getCenter();
		newfeature.type = type;
		newfeature.setMap(instaGIS.map);
		instaGIS.drawingManager.setDrawingMode(null);
		instaGIS.featureListeners(newfeature);
		instaGIS.addLabel(newfeature, newfeature.center, true, name);
		newfeature.checkbox = thischeckbox;
		newfeature.id = newfeature.type + '_' + id_polygon;
		newfeature.id_polygon = id_polygon;
		newfeature.id_polygonset = id_polygonset;
		newfeature.category = 'feature';
		thischeckbox.data('feature', newfeature);


		addToGlobalmap && instaGIS.addToGlobalmap(newfeature);


		//console.log('Dibujando poligono',thischeckbox.data(),fillColor,newfeature);
		//console.log(thischeckbox.data());
		//instaGIS.map.setCenter(newfeature.getCenter());

	};




	jQuery(document).ready(function() {


		jQuery(document).on('click', '#map_draw_county', function() {
			var position = jQuery('#menuclickderecho_map').data('position');
			instaGIS.loadingcircle('Gathering Data', 1);
			instaGIS.contextMenu['map'].hide();
			//console.log(position);
			if (position) {
				instaGIS.DrawCounty(position, function() {
					instaGIS.loadingcircle('Gathering Data', 0);
				});
			}
		});

		jQuery(document).on('click', '#polygon_twitter_cloud_tag', function() {
			instaGIS.contextMenu['polygons'].hide();
			if (_.isEmpty(globalmap.socialnetwork)) {
				instaGIS.noTwitterModal();
				return;
			}

			var tweets = false;

			for (var i in globalmap.socialnetwork) {
				console.log(i, i.indexOf('Latest_Tweets'), i.indexOf('Tweet_search_for'));
				if (i.indexOf('Latest_Tweets') != -1 || i.indexOf('Tweet_search_for') != -1) {
					tweets = true;
					break;
				}
			}

			if (tweets == false) {
				instaGIS.noTwitterModal();
				return;
			}

			var wkt = new Wkt.Wkt();
			var arraygeometry = instaGIS.geometryMultipolygon();
			instaGIS.representGeometry(arraygeometry, function(obj) {
				wkt.read(obj.wkt);
				var boundingpolygon = wkt.toObject();
				var tweetarray = [];
				var bigtext = '';
				var wordarray = {};
				jQuery('.accordion_twitter.accordion-group, .tweets.accordion-group').each(function() {
					var datasetname = jQuery(this).data('id_dataset');
					var category = jQuery(this).data('category');
					var thisarray = globalmap.socialnetwork[datasetname].getArray();
					newarray = instaGIS.FilterArrayByPolygon(thisarray, boundingpolygon);

					bigtext += ' ' + instaGIS.TweetWords(newarray, wordarray);
				});
				instaGIS.parseText(bigtext);
			});
		});


		jQuery('#mypolygons').on('mouseover', '.checkbox', function() {
			var feature = jQuery('input', this).data('feature');
			feature && feature.setOptions({
				fillOpacity: 0.7,
				strokeColor: '#0c0'
			});
		});


		jQuery('#mypolygons').on('mouseout', '.checkbox', function() {
			var feature = jQuery('input', this).data('feature');
			feature && feature.setOptions({
				fillOpacity: 0.4,
				strokeColor: '#1E90FF'
			});
		});




		jQuery(document).on('click', '.fitbounds-collapsible', function() {
			var lat = jQuery(this).data('lat');
			var lng = jQuery(this).data('lng');
			var firstPoint = new google.maps.LatLng(lat, lng);
			globalmap.setCenter(firstPoint);
		});


		jQuery(document).on('click', '.fitbounds-element', function() {
			var id_polygon = jQuery(this).data('id_polygon');
			if (jQuery('#mypolygons_' + id_polygon).is(':checked')) {
				event.preventDefault();
			}
			var thisfeature = jQuery('#mypolygons_' + id_polygon).data('feature');
			var type = jQuery(this).data('type');
			var id_polygon = jQuery(this).data('id_polygon');

			globalmap.feature = globalmap.feature || {};
			var feature = globalmap.feature[type + '_' + id_polygon] || thisfeature;
			console.log('fit baundiando', type, id_polygon, feature, thisfeature);
			feature && globalmap.fitBounds(feature.getBounds());
		});


		jQuery(document).on('click', '#polygon_demographic_data', function() {
			//var feature=jQuery(this).parent().data('feature');
			var feature = jQuery('#polygon_demographic_data').parent().data('feature');
			//console.log('generando heatmap para ',feature);
			if (feature && feature.geometry) {
				instaGIS.contextMenu['polygons'].hide();
				var arraygeometry = instaGIS.geometryMultipolygon();
				instaGIS.representGeometry(arraygeometry, function(obj) {
					var thisgeometry = obj.wkt;
					var level = 'block';
					var elemento = {};
					elemento.name = (_.size(globalmap.multipolygon) <= 1) ? feature.name : 'Multipolygon ' + _.random(9999);
					elemento.container = 'current_layers';
					instaGIS.queryDemographic(globalmap.mouseposition.country, level, globalmap.mouseposition.state, thisgeometry, elemento, 'polygon_demographic_data');
				});
			}
		});

		jQuery(document).on('click', '#polygon_create_summary', function(e) {
			var feature = jQuery('#menuclickderecho_polygons').data('feature');
			feature.id_polygon = null;

			if (_.size(globalmap.multipolygon) <= 1 || !_.has(globalmap.multipolygon, feature.id))
				jQuery('.modal-header #myModalLabel', '#dialogomodal').html('Dataset Summary for ' + feature.name);
			else
				jQuery('.modal-header #myModalLabel', '#dialogomodal').html('Dataset Summary for Multipolygon');

			instaGIS.loadingcircle('Retrieving Dataset Information', 1);
			instaGIS.contextMenu['polygons'].hide();

			if (_.isEmpty(globalmap.dataset) && _.isEmpty(globalmap.filter) && _.isEmpty(globalmap.socialnetwork) && _.isEmpty(globalmap.publicdataset)) {
				instaGIS.noDatasetModal();
				return;
			}

			var datasets = [],
				filters = [],
				publicdatasets = [],
				socialnetworks = [],
				demographics  = [];

			var datasets = [];
			jQuery.each(globalmap.dataset || [], function(d) {
				datasets.push(d.replace("dataset", ""));
			});

			var filters = [];
			jQuery.each(globalmap.filter || [], function(d) {
				filters.push(d.replace("filter", ""));
			});

			var publicdatasets = [];
			jQuery.each(globalmap.publicdataset || [], function(d) {
				publicdatasets.push(d.replace("publicdataset_", ""));
			});

			var socialnetworks = [];
			jQuery.each(globalmap.socialnetwork || [], function(d) {
				socialnetworks.push(d.replace("socialnetwork_", "socialnet"));
			});

			jQuery.ajax({
				url: "/interfaces/summary/page",
				type: 'POST',
				data: {
					id_map: globalmap.id_map,
					datasets: datasets,
					filters: filters,
					publicdatasets: publicdatasets,
					socialnetworks: socialnetworks,
					demographics: demographics
				}
			}).done(function(responseText, response) {
				instaGIS.loadingcircle('', 0);

				jQuery('.modal-body', '#dialogomodal').html(responseText);
				instaGIS.setModalClass('summary fade', {
					footer: false
				});
				jQuery('#dialogomodal').modal('show');

				var datasetOptionSelected = jQuery("#dataset_select").val().split('|');

				var datasetId = datasetOptionSelected[0],
					filterId = datasetOptionSelected[1];

				var metric = jQuery("#metric").val();
				var dependentColumnId = jQuery("#column_y_select").val();

				var ds = "" + datasetId;

				if (ds.indexOf("socialnetwork_") == -1 && ds.indexOf("public_") == -1) {
					jQuery("#column_y_select").show();
					jQuery("#dependent_column_select_label").show();
				} else {
					jQuery("#column_y_select").hide();
					jQuery("#dependent_column_select_label").hide();
				}

				if (filterId != undefined) {
					var filter = 'filter_' + filterId;
					instaGIS.setExportDataForSummary(filter);
				} else {
					instaGIS.setExportDataForSummary(datasetId);
				}



				jQuery('#metrics').hide();
				jQuery('.selectpicker').selectpicker();

				if (feature.id_polygon) {
					var url = jQuery.validator.format('/interfaces/summary/dataset/{0}/polygon/{1}/count', datasetId, feature.id_polygon);
					var method = 'GET';
					var request = {
						url: url,
						type: method
					}

				} else {
					var url = jQuery.validator.format('/interfaces/summary/dataset/{0}/count', datasetId);
					var method = 'POST';
					var request = {
						url: url,
						type: method,
						data: {
							geometry: feature.geometry
						}
					};
				}

				jQuery.ajax(request).done(function(responseText, response) {
					var count = responseText;
					globalmap.is_large_dataset = instaGIS.isABigDataset(count);
					jQuery('#alert-section').html('');
					jQuery('#alert-section').append(instaGIS.countBasedAlertHtmlBox(count));

					var arraygeometry = instaGIS.geometryMultipolygon();
					instaGIS.representGeometry(arraygeometry, function(obj) {
						console.log(obj.wkt);
						feature.geometry = obj.wkt;
						instaGIS.ShowSummary(datasetId, jQuery("#column_select").val(), feature, filterId, dependentColumnId, metric);
					});
				});

			});


		});
		jQuery(document).on("change.color", '#polygon_mycolor', function(event, color) {
			var feature = jQuery('#menuclickderecho_polygons').data('feature');
			if (!feature) return;
			console.log(feature.id, feature.name, 'cambiado a color', color);
			feature.originalcolor = color;
			feature.setOptions({
				'fillColor': color
			});
			//console.log('color antes', feature.checkbox.data('fillcolor'));
			feature.checkbox && feature.checkbox.data('fillcolor', color);

			jQuery('.evo-pointer', '#menuclickderecho_polygons').css('background', '#' + color);
			globalmap.listentriggers && instaGIS.enqueueSavePolygons(feature);

		});


		jQuery(document).on('click', '#polygon_change_color', function(event) {

			jQuery("#polygon_mycolor").colorpicker("showPalette");
		});




		jQuery(document).on('click', '#polygon_save_changes', function() {
			var feature = jQuery('#menuclickderecho_polygons').data('feature');
			globalmap.listentriggers && instaGIS.enqueueSavePolygons(feature);
		});



		jQuery(document).on('click', '#polygon_generate_canasta_report', function() {
			var feature = jQuery('#menuclickderecho_polygons').data('feature');
			instaGIS.contextMenu['polygons'].hide();
			var type = jQuery('#menuclickderecho_polygons').data('type');
			console.log('polygon_canasta_report', 'type', type, feature);
			if (feature) {
				instaGIS.loadingcircle('Gathering Data', 1);
				var arraygeometry = instaGIS.geometryMultipolygon();
				instaGIS.representGeometry(arraygeometry, function(obj) {
					feature.geometry = obj.wkt;
					instaGIS.MuestraCanasta(feature, feature.getCenter(), function() {
						instaGIS.loadingcircle('', 0);
					});
				});
			}
		});

		jQuery(document).on('click', '#polygon_export_data', function() {
			instaGIS.exportData();
			instaGIS.contextMenu['polygons'].hide();
		});



		jQuery(document).on('click', '#polygon_search_nearby_places', function() {
			var feature = jQuery('#menuclickderecho_polygons').data('feature');
			console.log(instaGIS.map.getBounds(), feature.getBounds());
			instaGIS.contextMenu['polygons'].hide();
			instaGIS.getGooglePlaces(feature.getBounds());
		});



		jQuery(document).on('click', '#polygon_make_draggable', function() {
			var feature = jQuery('#menuclickderecho_polygons').data('feature');
			console.log(feature);
			if (feature.type == 'administrative' || feature.type == 'county') {
				console.log('You cannot drag an administrative shape');
			} else {
				feature.setDraggable(true);
			}
		});



		jQuery('#controles').on('click', '.mypolygons', function() {
			var thefeature = jQuery(this).data('feature');
			if (jQuery(this).is(':checked')) {
				thefeature && thefeature.setOptions({
					map: instaGIS.map,
					visible: true
				});
				thefeature && thefeature.label.setMap(globalmap);
			} else {
				thefeature && thefeature.setOptions({
					map: null,
					visible: false
				});
				thefeature && thefeature.label.setMap(null);
			}
			globalmap.listentriggers && instaGIS.enqueueSavePolygons(thefeature);
		});


		jQuery('#current_polygons, #polygons_library').on('dblclick', 'label', function(e) {
			if (globalmap.isPublic != undefined & globalmap.isPublic) {
				return;
			}

			e.preventDefault();
			e.stopPropagation();
			instaGIS.renamePolygon(jQuery(this).data('id_polygon'), jQuery(this).data('name'));
			ga('send', 'event', 'map', 'rename_polygon');
		});


		jQuery(document).on('click', '#polygon_generar_infografia', function() {
			var feature = jQuery('#menuclickderecho_polygons').data('feature');
			instaGIS.contextMenu['polygons'].hide();
			var type = jQuery('#menuclickderecho_polygons').data('type');
			console.log('polygon_generar_infografia', 'type', type, feature);
			if (feature) {
				if (globalmap.tour_guide && globalmap.tour_guide.status && (globalmap.tour_guide.type = 'polygon') && jQuery.prompt.currentStateName == 3) {
					jQuery.prompt.finish();
				}
				instaGIS.loadingcircle('Gathering Data', 1);

				var arraygeometry = instaGIS.geometryMultipolygon();
				instaGIS.representGeometry(arraygeometry, function(obj) {
					feature.geometry = obj.wkt;
					instaGIS.MuestraInfografia(feature, feature.getCenter(), function() {
						instaGIS.loadingcircle('', 0);
					});
				});
			}
		});


		jQuery('#current_polygons').on('keyup blur', '#layernameeditor', function() {
			if (jQuery('#layernameeditor').length == 0) return;
			event.preventDefault();
			if (event.type == 'keyup') {
				if (event.keyCode == 27) {
					instaGIS.cancelRenamePolygon(id_polygon);
				} else if (event.keyCode != 13) {
					return false;
				}
			}
			var thislabel = jQuery(this).data('label');
			var id_polygon = jQuery('#' + thislabel).data('id_polygon');
			var type = jQuery('#' + thislabel).data('type');
			var newlabel = jQuery('#layernameeditor').val();

			var thelabel = jQuery(this).closest('label');
			jQuery('#' + thislabel + ' span').html(newlabel);
			jQuery('#' + thislabel).data('name', newlabel).show();
			jQuery('#' + thislabel + ' span').show();
			console.log('Stop, Hammertime');
			globalmap.feature[type + '_' + id_polygon].label.setOptions({
				text: newlabel
			});
			globalmap.feature[type + '_' + id_polygon].name = newlabel;
			jQuery('#layernameeditor').tooltip('hide');

			try {
				if (jQuery('#layernameeditor').length) jQuery('#layernameeditor').remove();
				instaGIS.updateFeature(null, id_polygon, type);

				var hash = jQuery('#savecurrent').data('maphash');
				instaGIS.saveMapFeatures(hash);
			} catch (e) {
				console.log('Exception', e);
			}


		});




		jQuery('#polygons_library').on('keyup blur', '#layernameeditor', function() {
			event.preventDefault();
			var id_polygon = jQuery('#' + thislabel).data('id_polygon');
			if (event.type == 'keyup') {
				if (event.keyCode == 27) {
					instaGIS.cancelRenamePolygon(id_polygon);
				} else if (event.keyCode != 13) {
					return false;
				}
			}
			var thislabel = jQuery(this).data('label');
			var type = jQuery('#' + thislabel).data('type');
			var newlabel = jQuery('#layernameeditor').val();
			var thelabel = jQuery(this).closest('label');
			console.log(thelabel.data);
			jQuery('#' + thislabel + ' span').html(newlabel);
			jQuery('#' + thislabel).data('name', newlabel).show();
			jQuery('#' + thislabel + ' span').show();
			jQuery('#layernameeditor').tooltip('hide');
			jQuery('#layernameeditor').remove();
			instaGIS.updateFeature(null, id_polygon, type);
		});



		jQuery('#current_polygons').droppable({
			accept: 'label.polygon',
			activeClass: "feedme",
			hoverClass: "overfeedme",
			greedy: true,
			drop: function(event, ui) {

				var thischeckbox = jQuery('input.mypolygons', ui.draggable);


				var polygon = thischeckbox.data();

				polygon.container = '#current_polygons';
				polygon.prefix = 'currentpolygonlabel_';
				polygon.removaltype = 'current_polygon';
				polygon.id_polygon = jQuery(ui.draggable).data('id_polygon');
				polygon.id_polygonset = 'currentmap';
				console.log(polygon);
				ko.applyBindings(new instaGIS.Feature(polygon, polygon.container, true), jQuery('#' + polygon.prefix + polygon.id_polygon)[0]);

			}
		});

		jQuery(document).on('click', '#polygon_delete', function() {
			var self = jQuery(this);
			var feature = self.parent().data('feature');
			self.data('type', 'current_polygon');
			self.data('id_current_polygon', feature.id_polygon);
			console.log(self.data());
			if (event.shiftKey) {
				var type = self.data('type');
				var id_element = self.data('id_' + type);
				instaGIS.confirmaEliminar(type, id_element);
				return false;
			} else {
				instaGIS.removeElementDialog(self);
			}
			instaGIS.contextMenu['polygons'].hide();
		});

		jQuery(document).on('click', '#polygon_ocultar', function() {
			var feature = jQuery(this).parent().data('feature');
			console.log('hidefeature', feature.id_feature);
			globalmap.conn && globalmap.conn.emit('hidefeature', feature.id_feature);
			feature.setOptions({
				map: null,
				visible: false
			});
			feature.label.setMap(null);
			if (feature.checkbox) {
				feature.checkbox.prop('checked', false);
				instaGIS.saveMapFeatures(globalmap.maphash);
			}
			instaGIS.contextMenu['polygons'].hide();

		});


		jQuery('.accordion-body', '#polygons_library').droppable({
			accept: function(elem) {
				return !jQuery('.polygonset', this).has(elem).length;
			},
			activeClass: "feedme",
			hoverClass: "overfeedme",
			greedy: true,
			drop: function(event, ui) {
				console.log(jQuery('.polygonset', jQuery(event.target)));
				var id_polygonset = jQuery(event.target).data('id_polygonset');
				var id_polygon = jQuery(ui.draggable).data('id_polygon');
				var from_polygonset = jQuery(ui.draggable).data('id_polygonset');
				if (event.ctrlKey) {
					jQuery.ajax({
						url: '/interfaces/polygon/changeset',
						type: 'POST',
						dataType: 'json',
						data: {
							id_polygonset: id_polygonset,
							id_polygon: id_polygon,
							type: 'insert'
						}
					}).done(function(response) {
						console.log(response);
					});
					jQuery('.polygonset', jQuery(event.target)).append(ui.draggable.clone());
				} else {
					jQuery.ajax({
						url: '/interfaces/polygon/changeset/' + from_polygonset,
						type: 'POST',
						dataType: 'json',
						data: {
							id_polygonset: id_polygonset,
							id_polygon: id_polygon,
							type: 'update'
						}
					}).done(function(response) {
						console.log(response);
					});
					jQuery('.polygonset', jQuery(event.target)).append(ui.draggable);
				}
				jQuery('.polygonset #polygonlabel_' + id_polygon, jQuery(event.target)).data('id_polygonset', id_polygonset).effect("bounce", 200);
				jQuery('#checkbox_set' + id_polygonset).click();
			}
		});

		jQuery(document).on('click', '#polyline_delete', function(e) {
			var contextMenu = instaGIS.contextMenu['markerpolyline'];
			var polyline = jQuery('#' + contextMenu.id).data('polyline');
			polyline.disableObject();
			polyline.destroy();
		});

		jQuery(document).on('click', '#polyline_driving', function() {
			globalmap.instaGIS.hideAllMenus();
			var contextMenu = instaGIS.contextMenu['markerpolyline'];
			var polyline = jQuery('#' + contextMenu.id).data('polyline');
			polyline.displayWith('driving');
		});

		jQuery(document).on('click', '#polyline_transit', function() {
			globalmap.instaGIS.hideAllMenus();
			var contextMenu = instaGIS.contextMenu['markerpolyline'];
			var polyline = jQuery('#' + contextMenu.id).data('polyline');
			polyline.displayWith('transit');

		});

		jQuery(document).on('click', '#polyline_walking', function() {
			globalmap.instaGIS.hideAllMenus();
			var contextMenu = instaGIS.contextMenu['markerpolyline'];
			var polyline = jQuery('#' + contextMenu.id).data('polyline');
			polyline.displayWith('walking');
		});

		jQuery(document).on('click', '#polyline_bicycling', function() {
			globalmap.instaGIS.hideAllMenus();
			var contextMenu = instaGIS.contextMenu['markerpolyline'];
			var polyline = jQuery('#' + contextMenu.id).data('polyline');
			polyline.displayWith('bicycling');
		});


		jQuery(document).on('click', '#polyline_back', function() {
			globalmap.instaGIS.hideAllMenus();
			var contextMenu = instaGIS.contextMenu['markerpolyline'];
			var polyline = jQuery('#' + contextMenu.id).data('polyline');
			polyline.setPathAsLine();

		});



	});
	/* CLOSES JQUERY BLOCK */


});
/* CLOSES REQUIRE.JS BLOCK */