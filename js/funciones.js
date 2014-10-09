/*MAPA*/
var map;
//var $j_cm = jQuery.noConflict();
var contenedor_resultado="resultados";
var markers_ondemand=Array();
var markers_ondemandEspecifico=Array();
var CM_servicios=Array();
var CM_servicios_estado=Array();
var CM_servicios_icono=Array();
var CM_vectorLineas,vector_cluster;
var CM_manzana=false;
var MIN_ZOOM_MARKER=14;
var MIN_ZOOM_MARKER2=15;
var zindex_marcador=4000;
var zindex_marcador_direccion=3000;
var zindex_marcador_circulo=3000;
var zindex_vector=3005;
var CM_myStyles2;
var CM_myStyles,CM_myStyles_default;
var opt_style;
var hm_e=false;
var hm_abc=false;
var heat;
var transformedTestData_abc,transformedTestData_e;
var CM_busqueda=Array();
var CM_busqueda_texto=Array();
var CM_busqueda_icono=Array();
var hm_antena=false;
var antenas=false;
var CM_cluster=false;
var CM_cluster_ant=false;
var CM_polygon_draw=false;
var vectores_arr=Array();
var control_modi=Array();
var CM_selectCtrl3,control_arr=Array();
var layer,vlayer,control,vector_almacenaje,control_al,CM_selectCtrl2,control_modi;
var sprintersLayer,drag,selectControl;
var ptos_vector=[];
/*
	Inicia MAPA
*/
function init(CM_div)
{
	var extent=new OpenLayers.Bounds(-13833619.268151,-7439463.1207699,-136103.80135396,387688.57454255);
	  map = new OpenLayers.Map(CM_div,{
	  	maxExtent: extent,
	  	restrictedExtent: extent,
	  	controls: []});
	  //-14928852.005097,-7870412.6975245,-1231336.5382998,-43261.00221205
    /*layer = new OpenLayers.Layer.OSM(
        "OpenStreet Maps", null, {
        resolutions: [19567.87923828125, 9783.939619140625,
            4891.9698095703125, 2445.9849047851562, 1222.9924523925781,
            611.4962261962891, 305.74811309814453, 152.87405654907226,
            76.43702827453613, 38.218514137268066, 19.109257068634033,
            9.554628534317017, 4.777314267158508, 2.388657133579254,
            1.194328566789627, 0.5971642833948135, 0.29858214169740677,
            0.14929107084870338, 0.07464553542435169],
        serverResolutions: [156543.03390625, 78271.516953125,
            39135.7584765625, 19567.87923828125, 9783.939619140625,
            4891.9698095703125, 2445.9849047851562, 1222.9924523925781,
            611.4962261962891, 305.74811309814453, 152.87405654907226,
            76.43702827453613, 38.218514137268066, 19.109257068634033,
            9.554628534317017, 4.777314267158508, 2.388657133579254,
            1.194328566789627, 0.5971642833948135, 0.29858214169740677,
            0.14929107084870338, 0.07464553542435169]
        }
      );*/
      layer = new OpenLayers.Layer.OSM();
    layer.transitionEffect = "resize";
    map.addLayer(layer);
    map.addControl(new OpenLayers.Control.Attribution());
    var layer2=new OpenLayers.Layer.Google(
                "Google Satellite",
                {type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
    );
    map.addLayer(layer2);
    markers = new OpenLayers.Layer.Markers( "Direcciones",{displayInLayerSwitcher:false} );
    map.addLayer(markers);
    
    markers.setZIndex(zindex_marcador_direccion);
    markers_servicio = new OpenLayers.Layer.Markers( "Servicios",{displayInLayerSwitcher:false} );
    map.addLayer(markers_servicio);
    markers_servicio.setZIndex(zindex_marcador);
		map.addControl(new OpenLayers.Control.LayerSwitcher());		
		//$j_cm(".baseLbl").html("Capas");
		vectorCirculo = new OpenLayers.Layer.Vector("Circulos",{displayInLayerSwitcher:false});
  	map.addLayer(vectorCirculo);
    map.addControl(new OpenLayers.Control.ScaleLine({geodesic: true}));

            

     /*Poligonos draw*/
     
    			vlayer = new OpenLayers.Layer.Vector( "Editable",{displayInLayerSwitcher:false} );
    			//vlayer.setZIndex(zindex_vector);
          control=new OpenLayers.Control.DrawFeature(vlayer,
                                OpenLayers.Handler.Polygon);
                       
          map.addControl(control);
         map.addLayer(vlayer);  
        control_modi=new OpenLayers.Control.ModifyFeature(vlayer); 
        
        map.addControl(control_modi);    
       // vlayer.events.register("afterfeaturemodified", vlayer, function(evt) {terminoModificacion();  OpenLayers.Event.stop(evt); }); 
          CM_selectCtrl2 = new OpenLayers.Control.SelectFeature(
					vlayer,
						{ highlightOnly:true, toggle: true, onSelect: selectPoli, onUnselect: unselectPoli }
						);
						map.addControl(CM_selectCtrl2);   
						//vlayer.setZIndex(5001);  
						control.events.register("featureadded", control, function(evt) {desactivarPoligono();  OpenLayers.Event.stop(evt); }); 
						
	CM_selectCtrl3 = new OpenLayers.Control.SelectFeature(
	vlayer,
				{ highlightOnly:true, toggle: true, onSelect: selectLinea, onUnselect: unselectLinea, onClick:click_vector }
			);
	map.addControl(CM_selectCtrl3);
     /**/
     
     /*Poligonos almacenar*/
    			vector_almacenaje = new OpenLayers.Layer.Vector( "Editable",{displayInLayerSwitcher:false} );
    			//vector_almacenaje.setZIndex(zindex_vector);
          control_al=new OpenLayers.Control.DrawFeature(vector_almacenaje,
                                OpenLayers.Handler.Polygon);
                             
          map.addControl(control_al);
         map.addLayer(vector_almacenaje);   
         CM_selectCtrl = new OpenLayers.Control.SelectFeature(
					vector_almacenaje,
						{ highlightOnly:true, toggle: true, onSelect: selectPoli, onUnselect: unselectPoli }
						);
						map.addControl(CM_selectCtrl);
						
						
						//vector_almacenaje.setZIndex(zindex_vector);
						
    
     /**/
    //markers.setZIndex(2000); //cambio
    //map.addControl(new OpenLayers.Control.MousePosition());
    map.addControl(new OpenLayers.Control.Navigation({'handleRightClicks':true,'zoomWheelEnabled': true}));		
			map.addControl(new OpenLayers.Control.NavToolbar());	
			var container = document.getElementById("barra_mapa2");	
			map.addControl(new OpenLayers.Control.EditingToolbar(vector_almacenaje, {div: container}));
    map.addControl(new OpenLayers.Control.MousePosition(new OpenLayers.Control.PanZoom()));  
    map.setCenter(new OpenLayers.LonLat(-70.656235,-33.458943).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), 10);
      
    map.events.register("moveend", null, loadMovimiento);  
      
      	//addMarcador('iconos/direccion.png','50,50',-33.414722,-70.600556,'Antena');
			//verMarcadores();
			
			/*cluster*/
			      var colors = {
                low: "rgb(181, 226, 140)", 
                middle: "rgb(241, 211, 87)", 
                high: "rgb(253, 156, 115)"
            };
            
            // Define three rules to style the cluster features.
            var lowRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.LESS_THAN,
                    property: "count",
                    value: 15
                }),
                symbolizer: {
                    fillColor: colors.low,
                    fillOpacity: 0.9, 
                    strokeColor: colors.low,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 10,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
            });
            var middleRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.BETWEEN,
                    property: "count",
                    lowerBoundary: 15,
                    upperBoundary: 50
                }),
                symbolizer: {
                    fillColor: colors.middle,
                    fillOpacity: 0.9, 
                    strokeColor: colors.middle,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 15,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
            });
            var highRule = new OpenLayers.Rule({
                filter: new OpenLayers.Filter.Comparison({
                    type: OpenLayers.Filter.Comparison.GREATER_THAN,
                    property: "count",
                    value: 50
                }),
                
                symbolizer: {
                    fillColor: colors.high,
                    fillOpacity: 0.9, 
                    strokeColor: colors.high,
                    strokeOpacity: 0.5,
                    strokeWidth: 12,
                    pointRadius: 20,
                    label: "${count}",
                    labelOutlineWidth: 1,
                    fontColor: "#ffffff",
                    fontOpacity: 0.8,
                    fontSize: "12px"
                }
                
            });
            
            
            
            // Create a Style that uses the three previous rules
            var style = new OpenLayers.Style(null, {
                rules: [lowRule, middleRule, highRule]
            });            
            
            
             vector_cluster = new OpenLayers.Layer.Vector("Features", {displayInLayerSwitcher:false,
    renderers: ['Canvas','SVG'],
    strategies: [
        new OpenLayers.Strategy.AnimatedCluster({
            distance: 100,
            animationMethod: OpenLayers.Easing.Expo.easeOut,
            animationDuration: 20
        })
    ],
    styleMap:  new OpenLayers.StyleMap(style)
});
/*
var select = new OpenLayers.Control.SelectFeature(
                    vector_cluster, {hover: true,toggle: true}
                );
                map.addControl(select);
                select.activate();
                vector_cluster.events.on({"featureselected": displayDataCluster});
                */
				map.addLayer(vector_cluster);


			/*Fin cluester*/
			  //enrutamiento Dmapas
		CM_myStyles ={
			strokeColor: "pink",
			strokeWidth: 1,
			fillColor : "pink",
			strokeOpacity: 0.3,
			strokeDashstyle: "solid", 
      cursor: "pointer",
		};
	
		CM_myStyles2 = { 
                        strokeColor: "green", 
                        fillColor: "green", 
                        fillOpacity: 0.3, 
                        strokeWidth: 1, 
                        strokeDashstyle: "solid", 
                        cursor: "pointer",
                }; 
		CM_myStyles3 = { 
                        strokeColor: "yellow", 
                        fillColor: "yellow", 
                        fillOpacity: 0.3, 
                        strokeWidth: 1, 
                        strokeDashstyle: "solid", 
                        cursor: "pointer",
                };                 
                		CM_myStyles4 = { 
                        strokeColor: "red", 
                        fillColor: "red", 
                        fillOpacity: 0.3, 
                        strokeWidth: 1, 
                        strokeDashstyle: "solid", 
                        cursor: "pointer",
                }; 
                		CM_myStyles5 = { 
                        strokeColor: "blue", 
                        fillColor: "blue", 
                        fillOpacity: 0.3, 
                        strokeWidth: 1, 
                        strokeDashstyle: "solid", 
                        cursor: "pointer",
                }; 
                
  CM_myStyles_default = { 
                        strokeColor: "brown", 
                        fillColor: "brown", 
                        fillOpacity: 0.3, 
                        strokeWidth: 1, 
                        strokeDashstyle: "solid", 
                        cursor: "pointer",
                }; 
	CM_vectorLineas = new OpenLayers.Layer.Vector("Poligonos", {displayInLayerSwitcher:false,styleMap: CM_myStyles});
	map.addLayer(CM_vectorLineas);
		
	CM_selectCtrl = new OpenLayers.Control.SelectFeature(
	CM_vectorLineas,
				{ highlightOnly:true, toggle: true, onSelect: selectLinea, onUnselect: unselectLinea, onClick:click_vector }
			);
	map.addControl(CM_selectCtrl);

//	CM_vectorLineas.setZIndex(zindex_vector);

/*INICIO MARCADORES DRAG*/
	styleMapDis= new OpenLayers.StyleMap({
            externalGraphic: "img/servicio.png",
            graphicOpacity: 1.0,
            graphicWidth: 26,
            graphicHeight: 26,
            graphicYOffset: -26
    });
     
    sprintersLayer = new OpenLayers.Layer.Vector("Sprinters", {styleMap:styleMapDis});
     
    map.addLayer(sprintersLayer);
     
   	selectControl = new OpenLayers.Control.SelectFeature(
	  		sprintersLayer,
				{ highlightOnly:true, toggle: true, onSelect: selectPunto, onUnselect: unselectLinea }
		);
    map.addControl(selectControl);
    /*selectControl.activate();*/
   
    drag=new OpenLayers.Control.DragFeature(sprintersLayer,{    
     'onComplete':moveDrag});
    map.addControl(drag);
/*FIN MARCADORES DRAG*/
}
function addServicios(CM_nombre,CM_id,CM_id_serv,CM_icono)
{
	 CM_servicios[CM_id]=CM_id_serv; //id original servicios BD
	 CM_servicios_estado[CM_id]=1; //inactivo
	 CM_servicios_icono[CM_id]=CM_icono; //inactivo
	 markers_ondemand[CM_id] = new OpenLayers.Layer.Markers( ""+CM_nombre+"",{displayInLayerSwitcher:false} );
	 markers_ondemand[CM_id].setZIndex(zindex_vector+1000);
   map.addLayer(markers_ondemand[CM_id]);
   
   
}
function activarServicio(CM_id)
{
	 CM_servicios_estado[CM_id]=0;
}
function desactivarServicio(CM_id)
{
	 CM_servicios_estado[CM_id]=1;
	 
}
function getEstadoServicio(CM_id)
{
	 return CM_servicios_estado[CM_id];
}

function loadMovimiento()
{
	//deleteMarkerServicio();
	limpiarGrilla();
	if(CM_manzana==true && map.getZoom()>=MIN_ZOOM_MARKER)
	{
			deletePoligonos(); 
			loadManzanas();
			setTimeout("loadS();",2000);
			
			
	}else
	{
		  
			
			for(i=0;i<CM_servicios.length;i++)
			{
		
				if(CM_servicios_estado[i]==0)
				{
					
					deleteServicioMapa(i);
					
					
					loadServEsp(CM_servicios[i],CM_servicios_icono[i],i);
					
				}
			}
			for(i=0;i<CM_serviciosEspecifico.length;i++)
			{
		
				if(CM_servicios_estadoEspecifico[i]==0)
				{
					
					deleteServicioMapaEspecifico(i);
					loadServEspCli(CM_serviciosEspecifico[i],CM_servicios_iconoEspecifico[i],i);
				}
			}
	}
	//antenas
	
	if(antenas && map.getZoom()>=MIN_ZOOM_MARKER2)
	{
		deleteMarkerServicio();
		loadAntenas();
	}
	
	markers.setZIndex(5000);

}
function limpiarDataGrilla()
{
	
	for(i=0;i<GIS_tipo_result.length;i++)
	{
		try
		{
			if(GIS_tipo_result[i]==2)
			{
				GIS_tipo_result[i]="";
				GIS_id_result[i]="";
				GIS_id_serv_result[i]="";
				
							
			}
		}catch(e){}
	}
	

	
}

function limpiarDataGrillaServicio(gr_serv,gr_tipo)
{
	
	for(i=0;i<GIS_tipo_result.length;i++)
	{

			if(GIS_tipo_result[i]==gr_tipo && GIS_id_serv_result[i]==gr_serv)
			{
				GIS_tipo_result[i]="";				
				GIS_id_result[i]="";				
				GIS_id_serv_result[i]="";			
				
			}

	}

	

	
}
function loadS()
{
	
	for(i=0;i<CM_servicios.length;i++)
			{
		
				if(CM_servicios_estado[i]==0)
				{
					deleteServicioMapa(i);
					loadServEsp(CM_servicios[i],CM_servicios_icono[i],i);
				}
			}
}

function addMarcador(CM_icono,CM_size,CM_lat,CM_lon,CM_texto)
{
	//alert(CM_size)
	var cm_s=CM_size.split(",");
	var size = new OpenLayers.Size(cm_s[0],cm_s[1]);	
	var offset = new OpenLayers.Pixel(-(size.w/3), -size.h);
	var icon = new OpenLayers.Icon(CM_icono,size,offset);      	
	marker = new OpenLayers.Marker(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  ),icon.clone());
  // marker.events.register('mousedown', marker, function(evt) { popNativo(CM_texto,this,CM_lon,CM_lat); OpenLayers.Event.stop(evt); });  
  if(CM_texto!="")
  {
 		marker.events.register('mousedown', marker, function(evt) { levantarPopup(CM_texto); OpenLayers.Event.stop(evt); });  
  	marker.events.register('mouseover', marker, function(evt) { mano(CM_lat, CM_lon); OpenLayers.Event.stop(evt); });
		marker.events.register('mouseout', marker, function(evt) { noMano(); OpenLayers.Event.stop(evt); });
	}
		
  markers.addMarker(marker);  
  //moverCentro(CM_lat,CM_lon,13);
}



function addMarcadorOnDemand(CM_icono,CM_size,CM_lat,CM_lon,CM_texto,CM_id)
{
	var size = new OpenLayers.Size(30,30);	
	var offset = new OpenLayers.Pixel(-(size.w/3), -size.h);
	var icon = new OpenLayers.Icon(CM_icono,size,offset);      	
	marker_servicio = new OpenLayers.Marker(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  ),icon.clone());
   marker_servicio.events.register('mousedown', marker_servicio, function(evt) { popNativo(CM_texto,this,CM_lon,CM_lat); OpenLayers.Event.stop(evt); });  
  //marker_servicio.events.register('mousedown', marker_servicio, function(evt) { levantarPopup(CM_texto); OpenLayers.Event.stop(evt); });  
  marker_servicio.events.register('mouseover', marker_servicio, function(evt) { mano(CM_lat, CM_lon); OpenLayers.Event.stop(evt); });
	marker_servicio.events.register('mouseout', marker_servicio, function(evt) { noMano(); OpenLayers.Event.stop(evt); });
		
  markers_ondemand[CM_id].addMarker(marker_servicio);
  markers_ondemand[CM_id].setZIndex(5000);
 	
  //moverCentro(CM_lat,CM_lon,13);
}
function addMarcadorOnDemandEspecifico(CM_icono,CM_size,CM_lat,CM_lon,CM_texto,CM_id)
{
	var size = new OpenLayers.Size(30,30);	
	var offset = new OpenLayers.Pixel(-(size.w/3), -size.h);
	var icon = new OpenLayers.Icon(CM_icono,size,offset);      	
	marker_servicio = new OpenLayers.Marker(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  ),icon.clone());
   marker_servicio.events.register('mousedown', marker_servicio, function(evt) { popNativo(CM_texto,this,CM_lon,CM_lat); OpenLayers.Event.stop(evt); });  
  //marker_servicio.events.register('mousedown', marker_servicio, function(evt) { levantarPopup(CM_texto); OpenLayers.Event.stop(evt); });  
  marker_servicio.events.register('mouseover', marker_servicio, function(evt) { mano(CM_lat, CM_lon); OpenLayers.Event.stop(evt); });
	marker_servicio.events.register('mouseout', marker_servicio, function(evt) { noMano(); OpenLayers.Event.stop(evt); });
		
  markers_ondemandEspecifico[CM_id].addMarker(marker_servicio);
 	markers_ondemandEspecifico[CM_id].setZIndex(5000);
  //moverCentro(CM_lat,CM_lon,13);
}
function moverCentro(CM_lat,CM_lon,CM_zoom)
{
	map.setCenter(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      ), CM_zoom);

}
function verMarcadores()
{
	map.zoomToExtent(markers.getDataExtent(),false);
}

function verMarcadoresServicio()
{
	map.zoomToExtent(markers_servicio.getDataExtent(),false);
}
function popNativo(CM_texto,CM_id,CM_lon,CM_lat)
{
	try
  {
  	popup_mini_nativo.destroy();
  }catch(e){}          
  popup_mini_nativo = new OpenLayers.Popup.FramedCloud("popup_nativo", 
  	new OpenLayers.LonLat(CM_lon,CM_lat).transform(
  	new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
  	new OpenLayers.Projection("EPSG:900913")),
  	new OpenLayers.Size(100,200),
  	CM_texto,    
  	null,                                     
  	true); 
                                  
	/*popup_mini_nativo = new OpenLayers.Popup("chicken", 
  	new OpenLayers.LonLat(CM_lon,CM_lat).transform(
  	new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
  	new OpenLayers.Projection("EPSG:900913")),
  	new OpenLayers.Size(200,100),
  	CM_texto,                                         
  	false);   
	*/
	popup_mini_nativo.closeOnMove = true;   
	popup_mini_nativo.autoSize=true;
	popup_mini_nativo.keepInMap=true;
	//popup_mini_nativo.setOpacity(0,5);
	//popup_mini_nativo.updateSize();
  map.addPopup(popup_mini_nativo);  
  map.Z_INDEX_BASE['popup'] = 9999999999;
  //popup_mini.setBackgroundColor("red");
  
  //popup_mini_nativo.setBorder("1px solid"); 

}

/*
FUNCION: EJECUTA POPUP DE UN MARCADOR de highlight
*/
function levantarPopup(CM_texto)       
{
	
	replaceRegex = new RegExp('\\+|%20', 'g'); 
	CM_texto=CM_texto.replace(replaceRegex," ");
	document.getElementById('contenido').innerHTML=CM_texto;
	document.getElementById('popup_CM').onclick();
}
/*
FUNCION:EJECUTA POPUP
*/
function levantar(CM_id)
{
 	hs.htmlExpand(CM_id, { contentId: 'highslide-html' } );
}

/*
funcion cambia imagen del cursor a una mano
*/
function mano(CM_lat,CM_lon)
{	
	
	document.getElementById("mapa").style.cursor = "pointer";  
	
	/*if(texto_mini.length > 2)
	{
		addPopUp(lat_,lon_,texto_mini);
	}*/
	
}

function noMano()
{
	try
	{	

		document.getElementById("mapa").style.cursor="default";
	/*	if (typeof popup_mini != "undefined")
		{
			popup_mini.destroy();
		}*/
	}catch(e){}
}

function deleteMarkerDireccion()
{
	try
  {
  	markers.destroy();
    markers = new OpenLayers.Layer.Markers( "puntos_mapas",{displayInLayerSwitcher:false});
    map.addLayer(markers);
    markers.setZIndex(zindex_marcador_direccion);    
    CM_busqueda=Array();
		CM_busqueda_texto=Array();
		CM_busqueda_icono=Array();

  }catch(e){}    
}
function deleteServicioMapa(CM_id)
{
	
	try{
		
		  markers_ondemand[CM_id].destroy();
		  markers_ondemand[CM_id] = new OpenLayers.Layer.Markers( "puntos",{displayInLayerSwitcher:false} );
		  //markers_ondemand[CM_id].setZIndex(zindex_vector+1000);
    	map.addLayer(markers_ondemand[CM_id]);    	
    	
}catch(e){}
	
	
}
function deleteServicioMapaEspecifico(CM_id)
{

	try{
		
		  markers_ondemandEspecifico[CM_id].destroy();
		  markers_ondemandEspecifico[CM_id] = new OpenLayers.Layer.Markers( "puntos",{displayInLayerSwitcher:false} );
    	map.addLayer(markers_ondemandEspecifico[CM_id]);    	
    	//markers_ondemandEspecifico[CM_id].setZIndex(zindex_marcador);
}catch(e){}
}
function deleteMarcadores()
{
	try
  {
  	deleteMarkerDireccion();
  	deleteMarkerServicio();
  	deletePoligonos();

  }catch(e){}  
}



function getExtencion()
{
	var AM_exten=map.getExtent().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
   /*   alert("LonI"+AM_exten.left);
			alert("LatI"+AM_exten.bottom);
	
			alert("lonD"+AM_exten.right);
	alert("lats"+AM_exten.top);*/
	return AM_exten;
}
function checkServ(CM_id_servicio_gis,CM_icono,CM_id)
{
	
	var elm = document.getElementById("img_"+CM_id);
	
	if(getEstadoServicio(CM_id)==0)
	{
		elm.className="img_control_off";
		limpiarDataGrillaServicio(CM_servicios[CM_id],2);
		desactivarServicio(CM_id);
		deleteServicioMapa(CM_id);
	}else
	{
		if(getEstadoServicio(CM_id)==1)
		{
			elm.className="img_control_on";
			activarServicio(CM_id);
			loadServEsp(CM_id_servicio_gis,CM_icono,CM_id);
		}
	}
	
}
function loadServEsp(CM_id_servicio_gis,CM_icono,CM_id)
{
	showMensaje("Cargando...<br><img src='images/load_central.gif'>");
	activarServicio(CM_id);
	//deleteServicioMapa(CM_id);	
	var AM_exten = getExtencion();
	var body = document.getElementsByTagName("body")[0];
	var scr = document.createElement("script");
	scr.setAttribute("type","text/javascript");
	scr.setAttribute("src","includes/query.php?tipo=6&loni="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"&id="+CM_id_servicio_gis+"&icono="+CM_icono+"&id_serv="+CM_id+"");
	scr.setAttribute("id","scriptTemporal");
	body.appendChild(scr);
}
function addPoligono(CM_datos,CM_datos_texto,CM_stilo)
{

	var CM_datos_arr=CM_datos.split("|");
	
	var CM_points=[];
	for(i=0;i<CM_datos_arr.length;i++)
	{
		//alert(CM_datos_arr[i]);
		var CM_lonlat_arr=CM_datos_arr[i].split(",");
		
		var CM_lonLat = new OpenLayers.LonLat(CM_lonlat_arr[0], CM_lonlat_arr[1]).transform(new OpenLayers.Projection('EPSG:4326'), map.getProjectionObject());
		CM_points.push(new OpenLayers.Geometry.Point(CM_lonLat.lon, CM_lonLat.lat));
	}
	
	var linear_ring = new OpenLayers.Geometry.LinearRing(CM_points);
	
	
	var poligono=new OpenLayers.Geometry.Polygon([linear_ring]);
	
	polygonFeature = new OpenLayers.Feature.Vector(poligono,{'data':CM_datos_texto, 'centro':poligono.getCentroid()},CM_stilo);
  CM_vectorLineas.addFeatures([polygonFeature]);
  if(CM_datos_texto!="")
  {
  	CM_selectCtrl.activate();	
  }
	//CM_vectorLineas.setZIndex(zindex_vector);
	
	
}
function extendPoligonos()
{
	map.zoomToExtent(CM_vectorLineas.getDataExtent(),false);
}
function deletePoligonos()
{
	try
  {
  	 	CM_vectorLineas.destroyFeatures();		
  }catch(e){}    
	
}

function selectLinea(feature)
{
	
	 /*for (var key in feature.attributes) {
                        //levantarPopup(feature.attributes[key]);
                      
                        
                     
                    }*/
                    var latlon=feature.attributes['centro'];
                  latlon=replaceAll(latlon,'POINT','');
                  latlon=replaceAll(latlon,')','');
                  latlon=replaceAll(latlon,'(','');
                  var latlon_arr=Array();
                  latlon_arr=latlon.split(' ');
                  var CM_lonLat = new OpenLayers.LonLat(latlon_arr[0],latlon_arr[1]).transform(
        						new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        						new OpenLayers.Projection("EPSG:4326"));                  
                    popNativo(feature.attributes['data'],this,CM_lonLat.lon,CM_lonLat.lat);
                   
}
function replaceAll( text, busca, reemplaza ){

  while (text.toString().indexOf(busca) != -1)

      text = text.toString().replace(busca,reemplaza);

  return text;

}

function unselectLinea()
{
	//alert("desselecciono");
}

function click_vector()
{
	alert("click");
}

function loadManzanas()
{
  showMensaje("Cargando...<br><img src='images/load_central.gif'>");
	var AM_exten = getExtencion();
	//alert("query.php?tipo=6&lon="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"&id="+CM_id_servicio_gis+"&icono="+CM_icono+"&id_serv="+CM_id+"");
	var body = document.getElementsByTagName("body")[0];
	var scr = document.createElement("script");
	scr.setAttribute("type","text/javascript");
	scr.setAttribute("src","includes/query.php?tipo=5&loni="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"");
	scr.setAttribute("id","scriptTemporal");
	body.appendChild(scr);
	
		var AM_exten = getExtencion();
	var capaContenedora = document.getElementById("resultados");
	
		
}
function accionManzana()
{
	
	var elm = document.getElementById("manz");
	if(CM_manzana==false)
	{
		
		
		elm.className="img_control_on";
		CM_manzana=true;
		if(map.getZoom()>=MIN_ZOOM_MARKER)
		{
			loadManzanas();
		}else
			{
					alert("Se activaron las manzanas, necesitas un minimo de zoom de "+MIN_ZOOM_MARKER+" para desplegar.");
					closeModalWeb();
			}
	}else
		{
			elm.className="img_control_off";
			deletePoligonos();
			CM_manzana=false;
		}
		
}

function getMarcadores()
{
	var valor=map.getLayersByClass("OpenLayers.Layer.Markers").markers_servicio;
	alert(valor);
}


/*FINMAPA*/


function loadServicios()
{
			
			$("#centro").load("includes/query.php", 
			{tipo:3} 
				,function(){	
					$("#controles").click();
				}
		);
}

function removeHeat(heatmap)
{
	try
	{
		
		var testData={
   			max: 46,
    	  data: [{}]
   	};
   	var transformedTestData = { max: testData.max , data: [] },
   		data = testData.data,
   		datalen = data.length,
   		nudata = [];
   		var config = {
        element: document.getElementById("mapa"),
        radius: 10,
        opacity: 80,
        legend: {
            position: 'br',
            title: 'Mouse Movement Distribution'
        }   
    };
    var heatmap = h337.create(config);
   		heatmap.setDataSet(transformedTestData);
   		//map.removeLayer(heatmap);
   		var elm = document.getElementById("hm").className="img_control_off";
   		var elm = document.getElementById("hm_2").className="img_control_off";
   		 hm_e=false;
			 hm_abc=false;
  }catch(e){}   
}


function checkAntenas()
{
	if(map.getZoom()>=MIN_ZOOM_MARKER2)
	{
		if(antenas==false)	
		{	
			antenas=true;
			document.getElementById("ant").className="img_control_on";					
			loadAntenas();
			
		}else
		{
			document.getElementById("ant").className="img_control_off";					
			antenas=false;
			deleteMarkerServicio();
			
		}
	}else
		{
			alert("Para poder vizualizar antenas el zoom debe ser mas alto.");
		}
}


function loadAntenas()
{
	antenas=true;
	
	var AM_exten = getExtencion();
			//alert("query.php?tipo=6&lon="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"&id="+CM_id_servicio_gis+"&icono="+CM_icono+"&id_serv="+CM_id+"");
			var body = document.getElementsByTagName("body")[0];
			var scr = document.createElement("script");
			scr.setAttribute("type","text/javascript");
			scr.setAttribute("src","includes/query.php?tipo=2&loni="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"");
			scr.setAttribute("id","scriptTemporal");
			body.appendChild(scr);
			
			/*$("#resultado_seccion").load("includes/query.php", 
				{tipo:2, loni:AM_exten.left, lati:AM_exten.bottom, lond:AM_exten.right, lats:AM_exten.top} 
					,function(){	
					}
			);*/
}
function deleteMarkerServicio()
{
	try
  {
  	
  	markers_servicio.destroy();
    markers_servicio = new OpenLayers.Layer.Markers( "puntos_mapas",{displayInLayerSwitcher:false} );
    map.addLayer(markers_servicio);
		markers_servicio[CM_id].setZIndex(zindex_marcador);
		CM_busqueda=Array();
		CM_busqueda_texto=Array();
		CM_busqueda_icono=Array();
  }catch(e){}    
}

function addMarcadorServicio(CM_icono,CM_size,CM_lat,CM_lon,CM_texto)
{
	markers_servicio.setZIndex(zindex_vector+1000);
  var size_arr=CM_size.split(",");
	var size = new OpenLayers.Size(size_arr[0],size_arr[1]);	
	var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	var icon = new OpenLayers.Icon(CM_icono,size,offset);      	
	marker_servicio = new OpenLayers.Marker(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  ),icon.clone());
  if(CM_texto!="")
  {
   	marker_servicio.events.register('mousedown', marker_servicio, function(evt) { popNativo(CM_texto,this,CM_lon,CM_lat); OpenLayers.Event.stop(evt); });  
 
 		//marker_servicio.events.register('mousedown', marker_servicio, function(evt) { levantarPopup(CM_texto); OpenLayers.Event.stop(evt); });  
  	marker_servicio.events.register('mouseover', marker_servicio, function(evt) { mano(CM_lat, CM_lon); OpenLayers.Event.stop(evt); });
		marker_servicio.events.register('mouseout', marker_servicio, function(evt) { noMano(); OpenLayers.Event.stop(evt); });
	}	
  markers_servicio.addMarker(marker_servicio);  
  //moverCentro(CM_lat,CM_lon,13);
}

function loadServiciosRadio()
{
	EliminarCirculos();
	deleteMarkerDireccion();
	$("dd").hide();
  $("#radio").show();
	var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
			
			$("#resul_radio").load("includes/query.php", 
				{tipo:7, lon:CM_centro.lon, lat:CM_centro.lat} 
					,function(){	
					}
			);
}


function DibujarCirculoAdap(color,linea_color,radio,lon_circulo,lat_circulo,opc)
{
	
	var points = new OpenLayers.Geometry.Point(lon_circulo,lat_circulo).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
      );
	var style_blue = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
  style_blue.strokeColor = linea_color; 
  style_blue.fillColor = color;
  if(opc>0)
  	style_blue.fillOpacity=opc;
  else
  	style_blue.fillOpacity=0.4;	 
  style_blue.stroke=false;
//  radius = radio * map.getExtent().getHeight();
  var radio_final=radio/Math.cos(35*(Math.PI/180));
  //var radio_final=radio;
	var pointFeature = new OpenLayers.Feature.Vector( 
 	OpenLayers.Geometry.Polygon.createRegularPolygon( points, radio_final, 50, 0 ), null,  style_blue ); 

/*circleFeature.geometry.transform( new 
OpenLayers.Projection("EPSG:4326"), new 
OpenLayers.Projection("EPSG:900913") ); */
vectorCirculo.addFeatures( [pointFeature] );
//addMarcador("img/iconos/circle.png","10,10",lat_circulo,lon_circulo,""); 
}

function EliminarCirculos()
{
try
{
		vectorCirculo.destroyFeatures();
		
	}catch(e){}   
}

function addMarcadorNativo(CM_icono,CM_size,CM_lat,CM_lon,CM_texto)
{
	
	var cm_s=CM_size.split(",");
	var size = new OpenLayers.Size(cm_s[0],cm_s[1]);	
	var offset = new OpenLayers.Pixel(-(size.w/3), -size.h);
	var icon = new OpenLayers.Icon(CM_icono,size,null);      	
	marker = new OpenLayers.Marker(new OpenLayers.LonLat(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  ),icon.clone());
  // marker.events.register('mousedown', marker, function(evt) { popNativo(CM_texto,this,CM_lon,CM_lat); OpenLayers.Event.stop(evt); });  
  
  if(CM_texto!="")
  {
 		 marker.events.register('mousedown', marker, function(evt) { popNativo(CM_texto,this,CM_lon,CM_lat); OpenLayers.Event.stop(evt); }); 
  	marker.events.register('mouseover', marker, function(evt) { mano(CM_lat, CM_lon); OpenLayers.Event.stop(evt); });
		marker.events.register('mouseout', marker, function(evt) { noMano(); OpenLayers.Event.stop(evt); });
	}
		
  markers.addMarker(marker);  
  markers.setZIndex(5000);  
  //moverCentro(CM_lat,CM_lon,13);
}

function limpiarmapa()
{
	eliminarPoligonosDraw();
	EliminarCirculos();
	deleteMarcadores();
	EliminarPoligonoDraw();
	try
      {
				heat.destroy(); 
			}catch(e){} ;
	try
  {
  	popup_mini_nativo.destroy();
  	
  }catch(e){} 
  	
  	for(i=0;i<CM_servicios.length;i++)
			{
		
				if(CM_servicios_estado[i]==0)
				{
					deleteServicioMapa(i);
					
				}
			}
			for(i=0;i<CM_serviciosEspecifico.length;i++)
			{
		
				if(CM_servicios_estadoEspecifico[i]==0)
				{
					
					deleteServicioMapaEspecifico(i);
				}
			}
			try
			{
				limpiarPuntosDrag();
				desactivarDrag();
			}catch(e){}
				
				desactivarPoligono();
}

function heatMap2(esocial)
{
	showMensaje("Cargando...<br><img src='images/load_central.gif'>");
			var hm;
			 try
      {
				heat.destroy(); 
			}catch(e){} ;
			if(esocial=='e')
			{
				var elm = document.getElementById("hm");
			   hm=hm_e;
			 }
			if(esocial=='abc1')
			{
				var elm = document.getElementById("hm_2");
			   hm=hm_abc;   
			 }
     
			if(!hm)	
			{				
					hm=true;
					elm.className="img_control_on";
					/*$("#resul_radio").load("includes/query.php", 
					{tipo:8, tip:esocial} 
						,function(){	
						}
						);*/
						
						var body = document.getElementsByTagName("body")[0];
			var scr = document.createElement("script");
			scr.setAttribute("type","text/javascript");
			scr.setAttribute("src","includes/query.php?tipo=8&tip="+esocial);
			scr.setAttribute("id","scriptTemporal");
			body.appendChild(scr);
				if(esocial=='e')
				{
					
					hm_e=true;
					 elm = document.getElementById("hm_2");
					elm.className="img_control_off";
				 }
				if(esocial=='abc1')
				{					
						hm_abc=true;  
						 elm = document.getElementById("hm");
					elm.className="img_control_off";					
						
				 }
   		}else
   		{
   			
   			if(esocial=='e')
			{
				
				hm_e=false;
				
			 }
			if(esocial=='abc1')
			{
				
					hm_abc=false;  
					
					
			 }
   			
   			elm.className="img_control_off";
   		
   			closeModalWeb();
   		}
		}
		
		function loadCluster(data_cluster)
		{
			showMensaje("Cargando...<br><img src='images/load_central.gif'>");
			var dat_cluster=data_cluster.split("|");
			// Create some random features
			var features = [];
			for(var i=0; i< dat_cluster.length; i++) 
			{
				var dat=dat_cluster[i].split(",");
    		var lon = dat[0];
    		var lat = dat[1];

    		var lonlat = new OpenLayers.LonLat(lon, lat);
    		lonlat.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

    		var f = new OpenLayers.Feature.Vector( new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
    		features.push(f);
			}
			vector_cluster.addFeatures(features);
			closeModalWeb();
		}
		
		function loadDataCluster()
		{
			showMensaje("Cargando...<br><img src='images/load_central.gif'>");
			if(CM_cluster==false)
			{
				CM_cluster=true;
				 elm = document.getElementById("clus");
					elm.className="img_control_on";
				var capaContenedora = document.getElementById("servicios");
				$("#output").load("includes/query.php", 
				{tipo:9} 
					,function(){	
						closeModalWeb();
					});
			}else
				{
					CM_cluster=false;
					elm = document.getElementById("clus");
					elm.className="img_control_off";
					destroyCluster();
					closeModalWeb();
				}
		
		}
		
function destroyCluster()
{
	try
  {
  	 	vector_cluster.destroyFeatures();		
  }catch(e){}    
	
}

function displayDataCluster(event) {
                var f = event.feature;
                var el = document.getElementById("output");
                if(f.cluster) {
                    var msg = "cluster of " + f.attributes.count;
                    /*for(i=0;i<f.attributes.count;i++)
                    {
                    	msg +="<br>"+f.attributes[i].geometry;
                    }*/
                    el.innerHTML=msg;
                    f=f['cluster'];
                    for (atributo in f) alert("f[" + atributo + "] = " + f[atributo]);
                } else {
                    el.innerHTML = "unclustered " + f.geometry;
                }
         				//for (atributo in f) alert("f[" + atributo + "] = " + f[atributo]);
            }
            
            function activarPoligono()
            {
            	if(CM_polygon_draw)
            	{
            		CM_polygon_draw=false;
            		//elm = document.getElementById("pd");
								//elm.className="img_control_off";
            		desactivarPoligono();
            		CM_selectCtrl2.activate();
            		
            	}else
            		{
            			
            			//elm = document.getElementById("pd");
									//elm.className="img_control_on";
            			CM_polygon_draw=true;
            			CM_selectCtrl2.activate();
            			control.activate();
            			selectControl.deactivate();
            			limpiarPuntosDrag();
            			//vlayer.setZIndex(zindex_vector);   
            				
            		}
            }
            
            function desactivarPoligono()
            {
            	control.deactivate();      	
            }
            
            function getVerticesPligono()
            {
            	//vertices=vlayer.features[0].geometry.getBounds();
            	//vertices=vlayer.features[0].geometry.getVertices().length;
            	largo=vlayer.features.length;
            	largo=largo-1;
            	
            	for(i=0;i<vlayer.features[largo].geometry.getVertices().length;i++)
            	{
            		myPoint = new OpenLayers.Geometry.Point(vlayer.features[largo].geometry.getVertices()[i].x,
                              vlayer.features[largo].geometry.getVertices()[i].y ).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                           
               if(i==0)
               {
               	vertices =myPoint;              
               	myPoint_final=myPoint;
               }
               else
               	vertices +=","+myPoint;              
            	}
            	vertices +=","+myPoint_final;
            	/*var myPoint = new OpenLayers.Geometry.Point(vectors.features[0].geometry.getVertices()[0].x,
                              vectors.features[0].geometry.getVertices()[0].y )*/
            	return vertices;
            }

            function loadServiciosPoligono()
            {
            	try
            	{
            		markers.setZIndex(5000);
            		
            		
            		//vlayer.setZIndex(zindex_vector);
            	}catch(e){}   
            		try
            		{
            	var vert=getVerticesPligono();
            	
            	//.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
							//alert(vert);
            	$("#resul_poligono").load("includes/query.php", 
								{tipo:10, coord: ''+vert+''} 
								,function(){	
							});
							}catch(e){}   
            }
            
            function EliminarPoligonoDraw()
{
try
{
		vlayer.destroyFeatures();
		
	}catch(e){}   
		try
{
		vector_almacenaje.destroyFeatures();
		
	}catch(e){}   
		
			
				
				
			
		
}

function enterpressalert(e, textarea,id){
	
	var code = (e.keyCode ? e.keyCode : e.which);
	if(code == 13) 
	{ //Enter keycode
		if(id==1)
		{
			
			buscar();
			
		}
		
 		
	}
}


            function getVerticesPoligono(vector_var)
            {
            	
            	//vertices=vlayer.features[0].geometry.getBounds();
            	//vertices=vlayer.features[0].geometry.getVertices().length;
            	largo=vector_var.features.length;
            	largo=largo-1;
            	
            	for(i=0;i<vector_var.features[largo].geometry.getVertices().length;i++)
            	{
            		myPoint = new OpenLayers.LonLat(vector_var.features[largo].geometry.getVertices()[i].x,
                              vector_var.features[largo].geometry.getVertices()[i].y ).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                       
               if(i==0)
               {
               	vertices =""+myPoint.lon+","+myPoint.lat+"";              
               	myPoint_final=""+myPoint.lon+","+myPoint.lat+"";
               }
               else
               	vertices +="|"+myPoint.lon+","+myPoint.lat;              
            	}
            	vertices +="|"+myPoint_final;
            	/*var myPoint = new OpenLayers.Geometry.Point(vectors.features[0].geometry.getVertices()[0].x,
                              vectors.features[0].geometry.getVertices()[0].y )*/
            	return vertices;
            }
            

function selectPoli(feature)
{
	//alert("selecciiono" +getVerticesPoligono(vlayer));
	//alert(vlayer.features[0].geometry.getCentroid());
	
	var poli=vlayer.features[0].geometry.getCentroid();
	poli=replaceAll(poli,'POINT','');
                  poli=replaceAll(poli,')','');
                  poli=replaceAll(poli,'(','');
                  var latlon_arr=Array();
                  latlon_arr=poli.split(' ');
   var point=new OpenLayers.LonLat(latlon_arr[0],latlon_arr[1] ).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));               
   //alert(latlon_arr[0]);
	popNativo("<div id=pop_titulo1>Opciones Poligono</div><div id=pop_titulo2><br>Agregar a Favoritos <input type='text' id='nom_poli' name='nom_poli'><img onclick='savePoli("+point.lon+","+point.lat+");' src='img/27.png' width=22px class=img_boton_save title='Agregar a Favoritos'></div>",this,point.lon,point.lat);
}
function unselectPoli()
{
	//alert("click off");
}
function activarPoly()
{
	control_al.activate();
}
function desActivarPoly()
{
	control_al.deactivate();
	CM_selectCtrl2.deactivate();
}

		function loadDataClusterAntenas()
		{
			showMensaje("Cargando...<br><img src='images/load_central.gif'>");
			if(CM_cluster_ant==false)
			{
				CM_cluster_ant=true;
				 elm = document.getElementById("clus_antena");
					elm.className="img_control_on";
				var capaContenedora = document.getElementById("servicios");
				$("#output").load("includes/query.php", 
				{tipo:19} 
					,function(){	
						closeModalWeb();
					});
			}else
				{
					CM_cluster_ant=false;
					elm = document.getElementById("clus_antena");
					elm.className="img_control_off";
					destroyCluster();
					closeModalWeb();
				}
		
		}
		
		
function heatMapAntena()
{
	showMensaje("Cargando...<br><img src='images/load_central.gif'>");
			var hm;
			 try
      {
				heat.destroy(); 
			}catch(e){} ;
			var elm = document.getElementById("heat_antena");
			
			if(!hm_antena)	
			{				
					hm_antena=true;
					elm.className="img_control_on";
					
						
						var body = document.getElementsByTagName("body")[0];
			var scr = document.createElement("script");
			scr.setAttribute("type","text/javascript");
			scr.setAttribute("src","includes/query.php?tipo=20");
			scr.setAttribute("id","scriptTemporal");
			body.appendChild(scr);

   		}else
   		{
   			heat.destroy(); 
   			hm_antena=false;
   			elm.className="img_control_off";   		
   			closeModalWeb();
   		}
		}
function checkAntena()
{
	showMensaje("Calculando...<br><img src='images/load_central.gif'>");
	var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
  );
	$("#output").load("includes/query.php", 
				{tipo:21,lon:CM_centro.lon,lat:CM_centro.lat} 
					,function(){	
						
					});
}
function viabilidadAntena()
{
	var mts_antena=document.getElementById("mts_antena").value;
	if(mts_antena >= 12)
	{
	showMensaje("Calculando...<br><img src='images/load_central.gif'>");
	var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
  );
	$("#output").load("includes/query.php", 
				{tipo:22,lon:CM_centro.lon,lat:CM_centro.lat,mts_antena:mts_antena} 
					,function(){	
						
					});
 }else
 	{
 		showMensaje("La altura debe ser mayor a 12 metros.");
 	}
}
function addPoligonoModify(CM_datos,CM_datos_texto,CM_stilo,CM_id)
{
	
	 eliminarPoligonoID(CM_id);

	var CM_datos_arr=CM_datos.split("|");
	
	var CM_points=[];
	for(i=0;i<CM_datos_arr.length;i++)
	{
		//alert(CM_datos_arr[i]);
		var CM_lonlat_arr=CM_datos_arr[i].split(",");
		
		var CM_lonLat = new OpenLayers.LonLat(CM_lonlat_arr[0], CM_lonlat_arr[1]).transform(new OpenLayers.Projection('EPSG:4326'), map.getProjectionObject());
		CM_points.push(new OpenLayers.Geometry.Point(CM_lonLat.lon, CM_lonLat.lat));
	}
	
	var linear_ring = new OpenLayers.Geometry.LinearRing(CM_points);
	
	
	var poligono=new OpenLayers.Geometry.Polygon([linear_ring]);
	
	polygonFeature = new OpenLayers.Feature.Vector(poligono,{'data':CM_datos_texto, 'centro':poligono.getCentroid()},CM_stilo);
	
	/*Poligonos draw*/
     
    			vectores_arr[CM_id] = new OpenLayers.Layer.Vector( "Editable",{displayInLayerSwitcher:false} );
    			
         map.addLayer(vectores_arr[CM_id]);  
         control_arr[CM_id]=new OpenLayers.Control.DrawFeature(vectores_arr[CM_id],
                                OpenLayers.Handler.Polygon);
                       
          map.addControl(control_arr[CM_id]);
        control_modi[CM_id]=new OpenLayers.Control.ModifyFeature(vectores_arr[CM_id]); 
        
        map.addControl(control_modi[CM_id]);    
       // vlayer.events.register("afterfeaturemodified", vlayer, function(evt) {terminoModificacion();  OpenLayers.Event.stop(evt); }); 
         
						
	CM_selectCtrl3[CM_id] = new OpenLayers.Control.SelectFeature(
	vectores_arr[CM_id],
				{ highlightOnly:true, toggle: true, onSelect: selectLinea, onUnselect: unselectLinea, onClick:click_vector }
			);
	map.addControl(CM_selectCtrl3[CM_id]);
     /**/
  vectores_arr[CM_id].addFeatures([polygonFeature]);
	
	//CM_vectorLineas.setZIndex(zindex_vector);
	  if(CM_datos_texto!="")
  {
  	CM_selectCtrl3[CM_id].activate();	
  }
  
	
}
 function desactivarPoligonoModify(CM_id)
            {
            	
            	control_modi[CM_id].deactivate(); 
            	     	
            }
		function activarModifyPoligono(CM_id)
	{
		control_modi[CM_id].mode = OpenLayers.Control.ModifyFeature.RESHAPE;
  //control_modi.mode |= OpenLayers.Control.ModifyFeature.RESIZE;
  //control_modi.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
  control_modi[CM_id].activate();     
	}
	function extendPoligonosDraw(data_id)
{
	map.zoomToExtent(vectores_arr[data_id].getDataExtent(),false);
}

function terminoModificacion(data_id,id_poli)
{
	var data_poli=getVerticesPoligono(vectores_arr[data_id]);
	//alert(data_poli);
	$("#output").load("includes/query.php", 
								{tipo:24, id:id_poli,puntos:data_poli} 
								,function(){	
									loadMisPoligonos();
									showMensaje("Poligono Guardado!");
					try
  				{
  					popup_mini_nativo.destroy();
  				}catch(e){} 
							});
	
}

function eliminarPoligonosDraw()
{
	
	/*try
{
		vector_almacenaje.destroyFeatures();
		
	}catch(e){}   */
	
	for(a=0;a< vectores_arr.length;a++)
	{
		try
		{
			vectores_arr[a].destroyFeatures();
		}catch(e){}
	}
}
function eliminarPoligonoID(id_poli)
{
	try
		{
			vectores_arr[id_poli].destroyFeatures();
		}catch(e){}
}

/*DRAG MARCADOR*/
function addMarcadorVector(CM_lon,CM_lat,CM_texto,CM_icono,CM_width,CM_height)
{
	 
	
	/*sprintersLayer.setZIndex(6000);*/
var CM_style ={
			externalGraphic: ""+CM_icono+"",
            graphicOpacity: 1.0,
            graphicWidth: CM_width,
            graphicHeight: CM_height,
            graphicYOffset: -26
		};        
	var points_vector = new OpenLayers.Geometry.Point(CM_lon,CM_lat).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  );
	if(CM_texto!="")
	{
		var ptos_vector_ = new OpenLayers.Feature.Vector(points_vector,{'data':CM_texto},CM_style);
	}else
		{
			var ptos_vector_ = new OpenLayers.Feature.Vector(points_vector,{},CM_style);
		}
	
	
	ptos_vector.push(ptos_vector_);
  sprintersLayer.addFeatures(ptos_vector_);
  selectControl.activate();
  
   /*for(fid in sprintersLayer.features) {
                   feature = sprintersLayer.features[fid];
                   alert(feature['geometry']);
                   for (var key in feature) 
                   {
                   	alert(key);
                  }
               }*/
}
function selectPunto(feature)
{
	//alert("paso");
var datas;
		 for (var key in feature.attributes) {
                        
                        if(feature.attributes[key]!="undefined")
                        {
                        	datas =feature.attributes[key];
                        	//alert(datas);
                        	lon=feature.geometry['x'];
    		lat=feature.geometry['y'];
    		lonlat=new OpenLayers.LonLat(lon,lat).transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
  			);
                        	//popNativo(datas,this,lonlat.lon,lonlat.lat);
                        	popNativo(datas,this,lonlat.lon,lonlat.lat);
                        }
                        
                     
                    }
	
}
function activarDrag()
{
	selectControl.activate();
	drag.activate();
}

function desactivarDrag()
{
	drag.deactivate();
	
	
}
function verPuntosDrag()
{
	map2.zoomToExtent(sprintersLayer.getDataExtent(),false);
}
function limpiarPuntosDrag()
{
	try
  {
  	sprintersLayer.removeFeatures(ptos_vector);	
			ptos_vector=[];
  		
		
  }catch(e){}   
}
/*FIN GRAG*/