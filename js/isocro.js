//define(['knockout-min', 'contextmenu'], function(ko) {

	/* 
	Creacion de Isocronas
	Creado en base a repositorio bitbucket.org/tasyrkin

	Tiempos Estimados
	Walking: 5 Km/H
	Driving: 40 Km/H

	# Actualmente no habilitado
	Soporte isocronas por transporte publico (TRANSIT) y en bicicleta (BICYCLING) 
	TRANSIT: 20 Km/H (segun estudio en Marzo 2013) [El tiempo de solicitud a Google debe ser mayor que en las otras opciones, ya que se demora más en calcular las rutas de un punto a  otro]
	BICYCLING: No definido

	# Update 16/09/2013
	Se quitó el parametro 'minutos'.
	Minutos esta establecido en la variable arayMinutos, que con tiene los 3 tiempos 5, 10, 15
	Se creo la funcion generateIsochroneMin, que invoca generateIsochrone con la posicion siguiente del array de minutos

*/


	function loadIso(origin, modo,tiempo_min) {
		alert("Calculando Isocronas");

		var arrayMinutos = [tiempo_min];
		var contMinutos = 0;
		var arrayorder = 0;
		var isochroneFull=Array();

		var directionsService = null;
		var directionsDisplay = null;
		var samePointDistanceInM = 10;
		var show_cover = false;
		var isochroneObjects = [];
		var isochrone = [];
		var colores = ['#00CC00', '#CCCC00', '#FF9900', '#990000'];
		var pathCollection = [];
		var placename = "";

		var name = 'isochrone ';
		var handle;
		var speed = 0;
		var distance = 0;

		var cummulativePolygonPath = [];
		var currentArray = [];
		var isochronePolygon = null;
		var isIsochronePolygonShown = false;
		var displayOptions = {
			preserveViewport: true
		};

		directionsService = new google.maps.DirectionsService();
		directionsDisplay = new google.maps.DirectionsRenderer();

		directionsDisplay.setOptions(displayOptions);
		//directionsDisplay.setMap(instaGIS.map);
		//instaGIS.map.setCenter(origin);
		var polygons_ids = [];
		/*instaGIS.getNewPolygonId(function(id_polygon) {
			polygons_ids.push(id_polygon);
			instaGIS.getNewPolygonId(function(id_polygon) {
				polygons_ids.push(id_polygon);
				instaGIS.getNewPolygonId(function(id_polygon) {
					polygons_ids.push(id_polygon);
				});
			});
		});*/



		/* Genera Isocrona en la posicion 0 (15 minutos) */
		calcIsochroneSpiral(modo, arrayMinutos);

		function SortAngles(origin, pointarray, contador) {
			var sortedarray = {},
				indexedarray = {},
				puntollegada = {},
				puntopartida = {},
				data = [];
			pointarray.push(pointarray[0]);
			//console.log(pointarray);

			for (var punto = 0; punto < pointarray.length; punto++) {
				try {
					var angulohdp = parseInt(google.maps.geometry.spherical.computeHeading(origin, pointarray[punto]), 10);
					indexedarray[180 + angulohdp] = {
						punto: pointarray[punto],
						angulo: angulohdp,
						distancia: google.maps.geometry.spherical.computeDistanceBetween(origin, pointarray[punto])
					};
					//console.log('Round '+contador, punto, angulohdp, pointarray[punto]);
				} catch (e) {
					//console.log('Round ' + contador, punto, pointarray[punto], e);
				}

			}


			for (var angulo in indexedarray) {
				if (contador > 0 && currentelement) {
					var lastelement = currentelement;
					var currentelement = indexedarray[angulo];
					var angulopromedio = parseInt((lastelement.angulo + currentelement.angulo) / 2, 10);
					var distanciapromedio = parseInt((lastelement.distancia + currentelement.distancia) / 2, 10);
					var midelement = {
						punto: google.maps.geometry.spherical.computeOffset(origin, distanciapromedio, angulopromedio),
						angulo: angulopromedio,
						distancia: distanciapromedio
					};
					data.push(midelement.punto);
					//	console.log(lastelement,currentelement,midelement);

				} else {
					var currentelement = indexedarray[angulo];
					var firstelement = indexedarray[angulo];
				}
				data.push(currentelement.punto);

			}
			if (contador > 0) {
				var angulopromedio = parseInt((360 + firstelement.angulo + currentelement.angulo) / 2);
				var distanciapromedio = parseInt((firstelement.distancia + currentelement.distancia) / 2);
				var midelement = {
					punto: google.maps.geometry.spherical.computeOffset(origin, distanciapromedio, angulopromedio),
					angulo: angulopromedio,
					distancia: distanciapromedio
				};
				data.push(midelement.punto);
				//	console.log(firstelement,currentelement,midelement);
			}

			return data;
		};


		function drawThePolygon(contador, cummulativePolygonPath, thename) {
			var color = colores[contador];

			//cummulativePolygonPath[contador]=SortAngles(origin,cummulativePolygonPath[contador]);
			//
			cummulativePolygonPath[contador] = SortAngles(origin, cummulativePolygonPath[contador], contador);
			//cummulativePolygonPath[contador]=chainHull_2D(cummulativePolygonPath[contador]);
			//console.log(contador,cummulativePolygonPath[contador],chainHull_2D(cummulativePolygonPath[contador]));
			if (contador == 0) {
				var isoObject = new google.maps.Polygon({
					paths: cummulativePolygonPath[contador].slice(0)
				});
			} else {
				var isoObject = new google.maps.Polygon({
					paths: [cummulativePolygonPath[contador].slice(0), cummulativePolygonPath[contador - 1].reverse().slice(0)]
				});
			}



			isoObject.setOptions({
				fillColor: color,
				fillOpacity: 0.4,
				strokeOpacity: 0.8,
				strokeWeight: 2,
				strokeColor: '#1E90FF',
				order: contador,
				editable: true,
				draggable: true,
				clickable: true,
				zIndex: (100 - 10 * contador)
			});

			/*soObject.geometry = instaGIS.vertices2geometry(isoObject.getPaths().getArray(), 'polygons');
			isoObject.center = instaGIS.vertices2geometry(placename, 'point');
			isoObject.format = 'wkt';
			isoObject.name = thename;
			isoObject.type = 'isochrone';
			isoObject.id_polygon = polygons_ids.pop();
			isoObject.radius = 0;
			isoObject.id_polygonset = 'currentmap';
			isoObject.category = 'feature';
			isoObject.setMap(globalmap);
			isoObject.prefix = 'currentpolygonlabel_';
			isoObject.removaltype = 'current_polygon';
			instaGIS.drawingManager.setDrawingMode(null);
			jQuery('button#select', '#botonera').click();
			clearMap();
			if (jQuery('#' + isoObject.prefix + isoObject.id_polygon).length == 0) {
				isoObject.setMap(null);

				//console.log(jQuery('#'+isoObject.prefix+isoObject.id_polygon));
				ko.applyBindings(new instaGIS.Feature(isoObject, '#current_polygons', true, true), jQuery('#' + isoObject.prefix + isoObject.id_polygon)[0]);
			}*/




		}


		function Consulta(origin, destinos, cummulativePolygonPath, parameters) {

			var i = 0;
			handle = setInterval(function() {
				if (i >= destinos.length) {
					clearInterval(handle);
					initIsochronePolygon(isochrone, true);

					for (k = 0; k < cummulativePolygonPath.length; k++) {
						drawThePolygon(k, cummulativePolygonPath, parameters.intervals[k].name);
					}

					//console.log('Terminado', cummulativePolygonPath);

				} else {

					origin.index = i;
					buildDirectionsServiceRoute(origin, destinos, cummulativePolygonPath, parameters);
				}

				i++;

			}, parameters.timeInterval);
		}



		/*
		***************************************************************
		Function building an isochrone path
		***************************************************************
		*/

		function buildDirectionsServiceRoute(origin, destinos, cummulativePolygonPath, parameters) {
			//console.log('Calc Route',origin.index);
			if (origin.index / 2 == parseInt(origin.index / 2)) {
				origin.limit = parameters.intervals.length;
				var request = {
					origin: origin,
					destination: destinos[origin.index].endpoint,
					travelMode: parameters.travelmode,
					unitSystem: google.maps.DirectionsUnitSystem.METRIC
				};
			} else {
				origin.limit = 1;
				var request = {
					origin: origin,
					waypoints: destinos[origin.index].waypoint,
					destination: destinos[origin.index].endpoint,
					travelMode: parameters.travelmode,
					unitSystem: google.maps.DirectionsUnitSystem.METRIC
				};
				//console.log('Route',origin.index);
			}


			directionsService.route(request, function(result, status) {

				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(result);

					for (j = 0; j < request.origin.limit; j++) {


						cummulativePolygonPath[j] = cummulativePolygonPath[j] || [];

						var isochronePath = new Array();

						var currDistance = 0;
						var progressiveDistance = 0;
						var cntStep = 0;
						var lastPointFound = false;
						var drawIsochronePath = true;

						for (cntStep in result.routes[0].legs[0].steps) {
							currDistance = result.routes[0].legs[0].steps[cntStep].distance.value;
							progressiveDistance += currDistance;
							//alert(result.routes[0].legs[0].steps[cntStep].start_location);
							isochronePath.push(result.routes[0].legs[0].steps[cntStep].start_location);
							
							
						//progressiveDistance >= parameters.intervals[j].distance
						//console.log(''+progressiveDistance+' >= '+parameters.intervals[j].distance+' --> '+result.routes[0].legs[0].steps[cntStep].start_location+'');
						if (modo == 'walking')
								{
									var cont2=cntStep;
								}else
									{
										var cont2=cntStep-1;
									}
							if (progressiveDistance >= parameters.intervals[j].distance) {
								lastPointFound = true;
								
								isochroneFull.push(result.routes[0].legs[0].steps[cont2].start_location);
								//alert(result.routes[0].legs[0].steps[cntStep-1].duration.value/60);
								break;
							}
							if(cntStep >= result.routes[0].legs[0].steps.length-1)
							{
								isochroneFull.push(result.routes[0].legs[0].steps[cont2].start_location);
							  //alert(result.routes[0].legs[0].steps[cntStep-1].duration.value/60);
							  lastPointFound = true;
							}
						}

						if (lastPointFound == true) {

							var pointAfterIsochronePoint = result.routes[0].legs[0].steps[cntStep].end_location;
							var pointBeforeIsochronePoint = result.routes[0].legs[0].steps[cntStep].start_location;
							var restDistance = parameters.intervals[j].distance - (progressiveDistance - currDistance);
							var isochroneLat = (restDistance / currDistance) * (pointAfterIsochronePoint.lat() - pointBeforeIsochronePoint.lat()) + pointBeforeIsochronePoint.lat();
							var isochroneLng = (restDistance / currDistance) * (pointAfterIsochronePoint.lng() - pointBeforeIsochronePoint.lng()) + pointBeforeIsochronePoint.lng();
							var isochronePoint = new google.maps.LatLng(isochroneLat, isochroneLng);
							isochronePath.push(isochronePoint);
							isochrone.push(isochronePoint);
							var isoPointCnt;


							if (j == 0) {
								var proportionalindex = request.origin.index;
								/*for(isoPointCnt = cummulativePolygonPath[j].length-1; isoPointCnt >= 0; isoPointCnt--) {
									var latLngDist = latLngDistance(cummulativePolygonPath[j][isoPointCnt],isochronePoint);
									if(latLngDist < samePointDistanceInM) {
										drawIsochronePath = false;
										break;
									}
								}*/
								if (drawIsochronePath == true) {
									placename = isochronePoint;
									cummulativePolygonPath[j][proportionalindex] = isochronePoint;

								}

							} else {
								var proportionalindex = parseInt(request.origin.index / 2);

								if (drawIsochronePath == true) {
									placename = isochronePoint;
									cummulativePolygonPath[j].push(isochronePoint);

								}
							}
						}

						if (drawIsochronePath == true) {
							placeIsochroneMarker(isochronePoint, parameters.intervals[j].time, parameters.intervals[j].color);
						}
					}

				} else {
					//console.log('Info: DirectionsService Status:' + status);
				}

				origin.index = origin.index + 1;

				if (origin.index >= destinos.length) {
					
					var iso=String(isochrone);
					var iso_arr=String(isochrone).split("),(");
					var data_poli="";
					for (k = 0; k < iso_arr.length; k++)
					{
						iso_arr[k]=iso_arr[k].replace("(","");
						iso_arr[k]=iso_arr[k].replace(")","");
						//alert(iso_arr[k]);
						ll=iso_arr[k].split(",");
						addMarcadorServicio('images/img/iconos/punto.png','15,15',ll[0],ll[1],'');		
						if(k>0)
						{
							data_poli +="|";
						}
						data_poli +=""+ll[1]+","+ll[0]+"";  
					}
					 //data_poli +="|"+CM_centro.lon+","+CM_centro.lat+"";
					var style_blue = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
  		style_blue.strokeColor = "red"; 
  		style_blue.fillColor = "blue";
  		style_blue.fillOpacity=0.4;	 
  		style_blue.stroke=false;
  		//alert(data_poli);
			addPoligono(data_poli,"",style_blue);
	    //extendPoligonos();
	    markers_servicio.setZIndex(zindex_marcador_direccion);
	    
	    
	    
	    
	    closeModalWeb();
	    
					/*initIsochronePolygon(isochrone, true);

					for (k = 0; k < cummulativePolygonPath.length; k++) {
						drawThePolygon(k, cummulativePolygonPath, parameters.intervals[k].name);
					}

					console.log('Terminado', cummulativePolygonPath);*/

				} else {
					setTimeout(function() {
						buildDirectionsServiceRoute(origin, destinos, cummulativePolygonPath, parameters);
					}, 1000);

				}


			});

		}


		/*
		***************************************************************
		Function providing CIRCULAR covering pattern
		***************************************************************
		*/


		function calcIsochroneSpiral(modo, arrayMinutos) {

			var travelmode = '';

			/* Modo Transporte Publico */
			/*
			travelmode = google.maps.DirectionsTravelMode.TRANSIT;
			var radiusSlices 	= 2; 		// 6
			var radius 			= 0.05; 	// 0.003
			var radiusIncrement = 0.005;	// 0.005
			var radiusCnt 		= 0;		// 0
			var slices 			= 6; 		// 10
			timeInterval 		= 4500;
			*/
			var parameters = {};
			parameters.origin = origin;
			parameters.contMinutos = contMinutos;
			parameters.slices = 12; //12
			parameters.timeInterval = 700;
			if (modo == 'walking') {
				parameters.travelmode = google.maps.DirectionsTravelMode.WALKING;
				parameters.speed = 5;

				parameters.radius = 1000 * parameters.speed / 4;
				parameters.intervals = [];
				for (i = 0; i < arrayMinutos.length; i++) {
					var time = arrayMinutos[i];
					parameters.intervals[i] = {
						index: i,
						time: time,
						zoom: parseInt(15 - time / 3),
						color: colores[i],
						name: 'Iso ' + modo + ' ' + time + 'min',
						distance: Number(1000 * (parameters.speed * time / 60)).toFixed(3)
					};
				}

			} else if (modo == 'driving') {
				parameters.speed = 40;
				parameters.travelmode = google.maps.DirectionsTravelMode.DRIVING;

				parameters.radius = 1000 * parameters.speed / 4; 
				parameters.intervals = [];
				for (i = 0; i < arrayMinutos.length; i++) {
					var time = arrayMinutos[i];
					parameters.intervals[i] = {
						index: i,
						time: time,
						zoom: parseInt(15 - time / 3),
						color: colores[i],
						name: 'Iso ' + modo + ' ' + time + 'min',
						distance: Number(1000 * (parameters.speed * time / 60)).toFixed(3)
					};
				}

			}

			var destinos = [];
			var d2r = Math.PI / 180; // degrees to radians 
			var r2d = 180 / Math.PI; // radians to degrees 
			parameters.radius = parameters.radius / 1609; //meters to miles
			var earthsradius = 3963; // 3963 is the radius of the earth in miles

			var rlat = (parameters.radius / earthsradius) * r2d;
			var rlng = rlat / Math.cos(origin.lat() * d2r);
			var extp = new Array();
			for (var i = 0; i < parameters.slices; i++) {
				var theta = (Math.PI / 6 + Math.PI * (i / (parameters.slices / 2)));

				ey = origin.lng() + (rlng * Math.cos(theta)); // center a + radius x * cos(theta) 
				ex = origin.lat() + (rlat * Math.sin(theta)); // center b + radius y * sin(theta) 
				var endpoint = new google.maps.LatLng(ex, ey);

				var waypoint = [];

				wayLng = origin.lng() + (rlng * Math.cos(theta) / 2); // center a + radius x * cos(theta) 
				wayLat = origin.lat() + (rlat * Math.sin(theta) / 2); // center b + radius y * sin(theta) 
				var thiswaypoint = new google.maps.LatLng(wayLat, wayLng);
				waypoint.push({
					location: thiswaypoint,
					stopover: false
				});

				destinos.push({
					waypoint: waypoint,
					endpoint: endpoint
				});
				//placeIsochroneMarker(endpoint,'Z','#CC0000');
			}


			parameters.destinos = destinos;


			//Consulta(origin, destinos, cummulativePolygonPath, parameters);
			origin.index = 0;
			buildDirectionsServiceRoute(origin, destinos, cummulativePolygonPath, parameters);
		}


		function clearMap() {
			var cnt = 0;
			directionsDisplay.setMap(null);
			for (cnt in isochroneObjects) {
				isochroneObjects[cnt].setMap(null);
			}
			cummulativePolygonPath = new Array();
			deinitIsochronePolygon();
			isochrone = new Array();
			isochroneObjects = new Array();
		}



		/*
		***************************************************************
		Functions placing markers
		***************************************************************
		*/


		function placeIsochroneMarker(position, letter, color) {

		}

		function placeCoverMarker(position, letter, color) {
			letter = letter || 'C';
			color = color || '#FF0000';
			var markerOpts = {
				position: position,
				map: instaGIS.map,
				clickable: false,
				visible: true,
				icon: instaGIS.autoIcon(letter, color)
			};

			var marker = new google.maps.Marker(markerOpts);
			isochroneObjects.push(marker);
		}

		function placeIsochroneLine(isochronePath) {
			var isochroneOpts = {
				path: isochronePath,
				map: instaGIS.map,
				clickable: false,
				geodesic: false,
				visible: true,
				strokeColor: '#00AAFF',
				strokeOpacity: 0.2,
				strokeWeight: 5
			};

			var isochroneLine = new google.maps.Polyline(isochroneOpts);
			isochroneObjects.push(isochroneLine);
		}

		function placePolygon(i_polygonArray) {
			var l_polygonOpts = {
				fillColor: colores[Math.floor(colores.length * Math.random())],
				fillOpacity: 0.2,
				geodesic: false,
				map: instaGIS.map,
				paths: i_polygonArray,
				strokeColor: "#FF00FF",
				strokeOpacity: 0.1,
				strokeWeight: 1
			};

			var l_isochronePolygon = new google.maps.Polygon(l_polygonOpts);
			isochroneObjects.push(l_isochronePolygon);
		}

		/*
		***************************************************************
		Functions related to isochrone polygon
		***************************************************************
		*/
		function chainHull_2D(P) {
			// the output array H[] will be used as the stack
			var bot = 0,
				top = (-1); // indices for bottom and top of the stack
			var i; // array scan index
			var H = [];
			var n = P.length;
			// Get the indices of points with min x-coord and min|max y-coord
			var minmin = 0,
				minmax;
			var xmin = P[0].lng();
			for (i = 1; i < n; i++)
				if (P[i].lng() != xmin) break;
			minmax = i - 1;
			if (minmax == n - 1) { // degenerate case: all x-coords == xmin
				H[++top] = P[minmin];
				if (P[minmax].lat() != P[minmin].lat()) // a nontrivial segment
					H[++top] = P[minmax];
				H[++top] = P[minmin]; // add polygon endpoint
				return top + 1;
			}

			// Get the indices of points with max x-coord and min|max y-coord
			var maxmin, maxmax = n - 1;
			var xmax = P[n - 1].lng();
			for (i = n - 2; i >= 0; i--)
				if (P[i].lng() != xmax) break;
			maxmin = i + 1;

			// Compute the lower hull on the stack H
			H[++top] = P[minmin]; // push minmin point onto stack
			i = minmax;
			while (++i <= maxmin) {
				// the lower line joins P[minmin] with P[maxmin]
				if (instaGIS.isLeft(P[minmin], P[maxmin], P[i]) >= 0 && i < maxmin)
					continue; // ignore P[i] above or on the lower line

				while (top > 0) // there are at least 2 points on the stack
				{
					// test if P[i] is left of the line at the stack top
					if (instaGIS.isLeft(H[top - 1], H[top], P[i]) > 0)
						break; // P[i] is a new hull vertex
					else
						top--; // pop top point off stack
				}
				H[++top] = P[i]; // push P[i] onto stack
			}

			// Next, compute the upper hull on the stack H above the bottom hull
			if (maxmax != maxmin) // if distinct xmax points
				H[++top] = P[maxmax]; // push maxmax point onto stack
			bot = top; // the bottom point of the upper hull stack
			i = maxmin;
			while (--i >= minmax) {
				// the upper line joins P[maxmax] with P[minmax]
				if (instaGIS.isLeft(P[maxmax], P[minmax], P[i]) >= 0 && i > minmax)
					continue; // ignore P[i] below or on the upper line

				while (top > bot) // at least 2 points on the upper stack
				{
					// test if P[i] is left of the line at the stack top
					if (instaGIS.isLeft(H[top - 1], H[top], P[i]) > 0)
						break; // P[i] is a new hull vertex
					else
						top--; // pop top point off stack
				}

				// 1.0.1: Fixed bug that was causing the algorithm to double back onto itself.
				// from https://github.com/mgomes/ConvexHull
				//        if (P[i].x == H[0].x && P[i].y == H[0].y) {
				//            return top + 1; // special case (mgomes)
				//        }

				H[++top] = P[i]; // push P[i] onto stack
			}
			if (minmax != minmin)
				H[++top] = P[minmin]; // push joining endpoint onto stack

			return H;
		}


		function initIsochronePolygon(i_polygonArray, i_showIsochronePolygon) {
			
		}

		function changeVisibilityOfIsochronePolygon() {
			if (isIsochronePolygonShown == true) {
				hideIsochronePolygon();
			} else {
				showIsochronePolygon();
			}
		}

		function showIsochronePolygon() {
			if (isochronePolygon != null) {
				isIsochronePolygonShown = true;
				isochronePolygon.setMap(instaGIS.map);
			}
		}

		function hideIsochronePolygon() {
			if (isochronePolygon != null) {
				isIsochronePolygonShown = false;
				isochronePolygon.setMap(null);
			}
		}

		function deinitIsochronePolygon() {
			if (isochronePolygon != null) {
				hideIsochronePolygon();
				isochronePolygon = null;
				isochrone = [];
			}
		}

		/*
		***************************************************************
		Function calculating a distance between 2 points
		***************************************************************
		*/

		function latLngDistance(p1, p2) {
			var x = (Math.cos(Math.PI / 180 * p1.lng()) - Math.cos(Math.PI / 180 * p2.lng()));
			var x2 = Math.pow(x, 2);
			var y = (Math.sin(Math.PI / 180 * p1.lng()) - Math.sin(Math.PI / 180 * p2.lng()));
			var y2 = Math.pow(y, 2);
			var z = (Math.sin(Math.PI / 180 * p1.lat()) - Math.sin(Math.PI / 180 * p2.lat()));
			var z2 = Math.pow(z, 2);
			var dist = Math.sqrt(x2 + y2 + z2);
			return 6371000 * dist;
		}

		/*
		***************************************************************
		Function comparing 2 points, used in sorting function
		***************************************************************
		*/

		function comparePoints(a, b) {
			var radiusa = Math.sqrt(Math.pow(origin.lat() - a.lat(), 2) + Math.pow(origin.lng() - a.lng(), 2));
			var sina = (a.lat() - origin.lat()) / radiusa;
			var cosa = (a.lng() - origin.lng()) / radiusa;
			var quatera = determinePointPlaneQuater(sina, cosa);

			var radiusb = Math.sqrt(Math.pow(origin.lat() - b.lat(), 2) + Math.pow(origin.lng() - b.lng(), 2));
			var sinb = (b.lat() - origin.lat()) / radiusb;
			var cosb = (b.lng() - origin.lng()) / radiusb;
			var quaterb = determinePointPlaneQuater(sinb, cosb);

			if (quatera == quaterb) {
				if ((sina >= 0 && cosa > 0) || (sina <= 0 && cosa < 0)) {
					return 1000 * (Math.abs(sina) - Math.abs(sinb));
				} else if ((sina < 0 && cosa >= 0) || (sina > 0 && cosa <= 0)) {
					return 1000 * (Math.abs(cosa) - Math.abs(cosb));
				}
				return 0;
			}
			return quatera - quaterb;
		}

		function determinePointPlaneQuater(sinus, cosinus) {
			var quater = 0;
			if (sinus >= 0 && cosinus >= 0) {
				quater = 1000;
			} else if (sinus > 0 && cosinus <= 0) {
				quater = 2000;
			} else if (sinus <= 0 && cosinus < 0) {
				quater = 3000;
			} else if (sinus < 0 && cosinus >= 0) {
				quater = 4000;
			}
			return quater;
		}

	}

//});