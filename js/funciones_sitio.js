var GIS_filtro=false;
var GIS_result=false;
var GIS_iso=false;
var GIS_capas=false;
var GIS_antena=false;
var GIS_DRAG=false;
/* 1 direccion 2 servicio ondemand 3 antenas*/
var GIS_tipo_result=Array();
var GIS_id_result=Array();
var GIS_id_serv_result=Array();
	var CM_datos,CM_data2;
var GIS_id="";
var GIS_tipo="";
var GIS_serv="";
var	directionsService = new google.maps.DirectionsService();
 var GIS_origin;
 var GIS_ultimo=1;
 var GIS_lonlat=Array();
var CM_serviciosEspecifico=Array();
var CM_servicios_estadoEspecifico=Array();
var CM_servicios_iconoEspecifico=Array();

var GIS_OPC_DIR=1;
var GIS_OPC_LUG=0;

var DRAG_LON,DRAG_LAT;
		function abrir(DM_div)
		{
			$( "#opc_"+DM_div ).css("border","2px solid #FFFFFF");
			$( "#main_mapa" ).css("margin-top","19%");
			$("#"+DM_div).slideDown("slow");
		}
		function esconder(DM_div)
		{
			$( "#opc_"+DM_div ).css("border","0px");
			$("#"+DM_div).slideUp("fast",function(){
				$( "#main_mapa" ).css("margin-top","0");
				});
				GIS_filtro=false;	
			GIS_result=false;
			GIS_iso=false;
			GIS_capas=false;
			GIS_antena=false;
		}
		function cerrar(DM_div)
		{
			$( "#opc_"+DM_div ).css("border","0px");
			$("#"+DM_div).slideUp("fast");
			GIS_filtro=false;	
			GIS_result=false;
			GIS_iso=false;
			GIS_capas=false;
			GIS_antena=false;
				
		}
	function focusInput(DM_div)
	{
		$("#"+DM_div).focus();
	}
	function opc_filtro()
	{
		if(GIS_filtro)
		{
			esconder('uno');
			GIS_filtro=false;
			GIS_result=false;
			GIS_iso=false;
			GIS_capas=false;
			GIS_antena=false;
			
		}else
		{
			cerrar('dos');
			cerrar('tres');
			cerrar('cuatro');
			cerrar('cinco');
			abrir('uno');
			focusInput('query');
			GIS_filtro=true;	
			GIS_result=false;
			GIS_iso=false;
			GIS_capas=false;
			GIS_antena=false;
		}
	}
	function opc_result()
	{
		if(GIS_result)
		{
			esconder('dos');
			
			GIS_result=false;
			GIS_filtro=false;
			GIS_iso=false;
			GIS_capas=false;
			GIS_antena=false;
		}else
		{
			cerrar('uno');
			cerrar('cinco');
			cerrar('tres');
			abrir('dos');
			cerrar('cuatro');
			GIS_result=true;	
			GIS_filtro=false;
			GIS_iso=false;
			GIS_antena=false;
			GIS_capas=false;
		}
	}
		function opc_iso()
	{
		if(GIS_iso)
		{
			esconder('tres');
			GIS_iso=false;
			GIS_filtro=false;
			GIS_result=false;
			GIS_antena=false;
			GIS_capas=false;
		}else
		{
			cerrar('dos');
			cerrar('uno');
			cerrar('cinco');
			cerrar('cuatro');
			abrir('tres');
			focusInput('query');
			GIS_filtro=false;	
			GIS_iso=true;
			GIS_antena=false;
			GIS_result=false;
			GIS_capas=false;
		}
	}
			function opc_antena()
	{
		if(GIS_antena)
		{
			esconder('cinco');
			GIS_iso=false;
			GIS_filtro=false;
			GIS_result=false;
			GIS_capas=false;
			GIS_antena=false;
		}else
		{
			cerrar('dos');
			cerrar('uno');
			cerrar('cuatro');
			cerrar('tres');
			abrir('cinco');
			focusInput('query');
			GIS_filtro=false;	
			GIS_iso=false;
			GIS_antena=true;
			GIS_result=false;
			GIS_capas=false;
		}
	}
	function opc_capa()
	{
		if(GIS_capas)
		{
			esconder('cuatro');
			cerrar('cuatro');
			GIS_iso=false;
			GIS_filtro=false;
			GIS_result=false;
			GIS_capas=false;
			GIS_antena=false;
		}else
		{
			cerrar('dos');
			cerrar('cinco');
			cerrar('uno');
			abrir('cuatro');
			cerrar('tres');
			focusInput('query');
			GIS_filtro=false;	
			GIS_iso=false;
			GIS_result=false;
			GIS_capas=true;
		}
	}
	function loadData()
	{
		showMensaje("Generando Plantilla...<br><img src='images/load_central.gif'>");
		GIS_id=GIS_id_result.join("|");
		//alert(GIS_id);
		GIS_tipo=GIS_tipo_result.join("|");
		GIS_serv=GIS_id_serv_result.join("|");
		//GIS_id=replaceAll(GIS_id,"||","");
		GIS_tipo=replaceAll(GIS_tipo,"||","");
		GIS_serv=replaceAll(GIS_serv,"||","");
		 $("#grilla").load("includes/query.php", 
			{tipo:12, gr_tipo:GIS_tipo, gr_id:GIS_id, gr_serv:GIS_serv} 
				,function(){	
					closeModalWeb();
					$( "#grilla" ).dialog( "open" );
						
				}
			);
	}
	
	function loadGrilla(gr_tipo,gr_id,gr_serv)
	{
		if(GIS_tipo_result.length>0)
		{
				GIS_tipo_result[GIS_tipo_result.length]=gr_tipo;		  	
		  	GIS_id_result[GIS_id_result.length]=gr_id;		  	
		  	GIS_id_serv_result[GIS_id_serv_result.length]=gr_serv;
		}else
		{
				GIS_tipo_result[0]=gr_tipo;		  	
		  	GIS_id_result[0]=gr_id;		  	
		  	GIS_id_serv_result[0]=gr_serv;
		}
	}
	function buscar()
{
	var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
	
	var query=$.trim(document.getElementById("query").value);
	var radio=0;
	var mis_poli;
 try
 {
	radio=$.trim(document.getElementById("radio_fil").value);
	mis_poli=$.trim(document.getElementById("mis_poli").value);
	}catch(e){}
	
	if(query!="" && (radio=="" || $.isNumeric(radio)))
	{
		showMensaje("Buscando...<br><img src='images/load_central.gif'>");
		limpiarmapa();
		$("#resultado_map").hide();
		if(GIS_OPC_DIR==1)//direccion
		{
			//$("#load").show("fast");
			$("#list").load("includes/query.php", 
			{tipo:1, consulta:encodeURI(query), lon:CM_centro.lon, lat:CM_centro.lat,radio:radio,poli:mis_poli} 
				,function(){	
					$("#resultado_map").show("slow");
					$("#resultado_map .glyphicon-chevron-down").click();
					closeModalWeb();
				}
			);
		}
		
					try
  				{
    				if(GIS_OPC_LUG==1)//lugar
						{
							var AM_exten = getExtencion();
							deleteMarkerDireccion();
							//$("#load").show("fast");
							$("#list").load("includes/query.php", 
							{tipo:11, consulta:encodeURI(query), lon:CM_centro.lon, lat:CM_centro.lat,radio:radio,poli:mis_poli} 
								,function(){	
									$("#resultado_map").show("slow");
									$("#resultado_map .glyphicon-chevron-down").click();
									closeModalWeb();
								}
							);
						}
  				}catch(e){}
						
				


	}else
	{
		if(radio!="" && !$.isNumeric(radio))
		{
			showMensaje("El radio debe ser de valor numerico");
			
		}else
			{
				showMensaje("Debe ingresar una consulta.");
			}
	}
}
	function BuscarIso()
	{
		CM_datos="";
		CM_data2="";
  	
		var minutos_iso=$.trim(document.getElementById("min_iso").value);
		if(minutos_iso!="" && $.isNumeric(minutos_iso) && minutos_iso<=30 && minutos_iso >0)
		{
			
			var CM_centro= map.getCenter().transform(
  	      new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
  	      new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
  	    );
  	  $("#output").load("includes/query.php", 
				{tipo:13, lon:CM_centro.lon, lat:CM_centro.lat, minutos:minutos_iso} 
					,function(){	
					
						
					}
				);  
			}else
			{
				showMensaje("El valor MINUTOS debe ser n&uacute;merico menor a 30.");
			}
	}

	function isoGoogle(data_lonlat,minutos)
	{
		var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
    GIS_origin = new google.maps.LatLng(CM_centro.lat,CM_centro.lon);
		var data_arr=data_lonlat.split("|");
		for(i=0;i< data_arr.length;i++)
		{
			lonlat=data_arr[0].split(' ');
			destino = new google.maps.LatLng(lonlat[1],lonlat[0]);
			
       setTimeout("buscaRuta(destino,minutos);",1500);
       

			
			
		}
	}
	function buscaRuta(origin,destino,minutos)
	{
		//alert(GIS_ultimo);
		if(GIS_ultimo==1)
		{
			var request = {
    	  	origin:GIS_origin,
    	  	destination:destino,
    	  	travelMode: google.maps.DirectionsTravelMode.DRIVING,        
    	  	unitSystem:google.maps.DirectionsUnitSystem.METRIC
    		};
			 directionsService.route(
    	  request,
    	  function(result, status) {     
    	  	showMensaje('Busca ' + destino.lat() + ',' + destino.lng() + '');                
    	    if (status == google.maps.DirectionsStatus.OK) {
							tiempo=result.routes[0].legs[0].duration.value;
    	        minu=(tiempo/60);
							//alert(minu);
    	        if(minu <= minutos)
    	        {
    	        	showMensaje("encontro:"+minu);
    	        	addMarcadorServicio('img/iconos/place.png','30,30',destino.lat(),destino.lng(),'');		
    	        }else
    	        	{
    	        		GIS_ultimo=0;
    	        	  //alert("paro :"+minu);
    	        	}
    	    }
    	    else {
    	      showMensaje('DirectionsService Status:' + status + ', origin: (' + destino.lat() + ',' + destino.lng() + ')');
    	    }
    	  });
    }
	}
	function closeModalWeb()
{
	
	 $('#popup_web').fadeOut('slow');
}

function showMensaje(CM_texto)
{
	$('.cont_web').html(CM_texto);
 $('#popup_web').fadeIn('fast');
 //$('#popup_web').fadeOut(1500);
				
}
function salir()
{
	$("#output").load("includes/query.php", 
				{tipo:15} 
					,function(){	
						window.location.href="login.php";						
					}
				);  
}
function printMapa()
{
  
   w=window.open();
	 w.document.write($('#mapa').html());
	 w.print();
	 w.close();
   
   
}   
function savePoli(lon,lat)
{
	var nombre=document.getElementById('nom_poli').value;
	var vertices=getVerticesPoligono(vlayer);
	//alert(vertices);
	$("#contenido_cuatro").load("includes/query.php", 
				{tipo:16, puntos:vertices, lat:lat, lon:lon, nombre:nombre} 
					,function(){	
						showMensaje("Poligono Almacenado!");
					try
  				{
  					popup_mini_nativo.destroy();
  				}catch(e){} 
  					
						
					}
				);  
	
}
function loadMisPoligonos()
{
	
	$("#contenido_cuatro").load("includes/query.php", 
				{tipo:17} 
					,function(){	
											$("#mis_poligonos").show("slow");
	
					}
				);  
	
}


function addServiciosEspecifico(CM_nombre,CM_id,CM_id_serv,CM_icono)
{
	 CM_serviciosEspecifico[CM_id]=CM_id_serv; //id original servicios BD
	 CM_servicios_estadoEspecifico[CM_id]=1; //inactivo
	 CM_servicios_iconoEspecifico[CM_id]=CM_icono; //inactivo
	 markers_ondemandEspecifico[CM_id] = new OpenLayers.Layer.Markers( ""+CM_nombre+"",{displayInLayerSwitcher:false} );
   map.addLayer( markers_ondemandEspecifico[CM_id]);
   
   //markers_ondemandEspecifico[CM_id].setZIndex(zindex_marcador);
   
}
function activarServicioEspecifico(CM_id)
{
	 CM_servicios_estadoEspecifico[CM_id]=0;
}
function desactivarServicioEspecifico(CM_id)
{
	 CM_servicios_estadoEspecifico[CM_id]=1;
	 
}
function getEstadoServicioEspecifico(CM_id)
{
	 return CM_servicios_estadoEspecifico[CM_id];
}
function checkServEspecifico(CM_id_servicio_gis,CM_icono,CM_id)
{
	
	var elm = document.getElementById("imgEsp_"+CM_id);
	
	if(getEstadoServicioEspecifico(CM_id)==0)
	{
		elm.className="img_control_off";
		limpiarDataGrillaServicio(CM_servicios[CM_id],2);
		desactivarServicioEspecifico(CM_id);
		deleteServicioMapaEspecifico(CM_id);
	}else
	{
		if(getEstadoServicioEspecifico(CM_id)==1)
		{
			elm.className="img_control_on";
			activarServicioEspecifico(CM_id);
			loadServEspCli(CM_id_servicio_gis,CM_icono,CM_id);
		}
	}
	
}
function loadServEspCli(CM_id_servicio_gis,CM_icono,CM_id)
{
	showMensaje("Cargando...<br><img src='images/load_central.gif'>");
	activarServicioEspecifico(CM_id);
	deleteServicioMapaEspecifico(CM_id);
	//markers_ondemandEspecifico[CM_id].setZIndex(zindex_vector+1000);
			
	var AM_exten = getExtencion();
	var body = document.getElementsByTagName("body")[0];
	var scr = document.createElement("script");
	scr.setAttribute("type","text/javascript");
	scr.setAttribute("src","includes/query.php?tipo=18&loni="+AM_exten.left+"&lati="+AM_exten.bottom+"&lond="+AM_exten.right+"&lats="+AM_exten.top+"&id="+CM_id_servicio_gis+"&icono="+CM_icono+"&id_serv="+CM_id+"");
	scr.setAttribute("id","scriptTemporal");
	body.appendChild(scr);
}
function limpiarGrilla()
{
	GIS_tipo_result=Array();
	GIS_id_result=Array();
	GIS_id_serv_result=Array();
}
function showMensajeestatico(CM_texto)
{
	$('.cont_web').html(CM_texto); 
	$('#popup_web').show();
				
}

function getDataManz()
{
	
	deleteMarkerDireccion();
	var radio=$.trim(document.getElementById("radio_censo").value);
	var CM_centro= map.getCenter().transform(
  	      new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
  	      new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
  	    );
  	    
  if($.isNumeric(radio))  	    
  {
  	showMensaje("Buscando...<br><img src='images/load_central.gif'>");
	/*	var body = document.getElementsByTagName("body")[0];
		var scr = document.createElement("script");
		scr.setAttribute("type","text/javascript");
		scr.setAttribute("src","includes/query.php?tipo=23&lon="+CM_centro.lon+"&lat="+CM_centro.lat+"&radio="+radio+"");
		scr.setAttribute("id","scriptTemporal");
		body.appendChild(scr);*/
		
		$("#output").load("includes/query.php", 
				{tipo:23,lat:CM_centro.lat, lon:CM_centro.lon, radio:radio} 
					,function(){	
						
						closeModalWeb();
					}
				);  
	}else
		{
			showMensaje("Radio debe ser numerico");
		}
}
function showMensajeTiming(CM_texto,time)
{
	$('.cont_web').html(CM_texto);
  $('#popup_web').fadeIn('fast');
  $('#popup_web').fadeOut(time);
				
}
function controlPoligono()
{
	if(CM_polygon_draw)
	{
		
		showMensajeTiming("<div id=msg_alert>Control poligono Activado!. Para desactivarlo haz click en el mismo icono</div>",2000);
		$( "#pd" ).css("border","2px solid #2FA4E7");
	}else
		{
			$( "#pd" ).css("border","0px");
			showMensajeTiming("<div id=msg_alert>Control poligono desactivado.</div>",1500);
			
		}
}
function loadListaPoligono()
{
	$("#mis_poli").load("includes/query.php", 
				{tipo:25} 
					,function(){	
						
						
					}
				);  
}

function deletePoligono(id_poli)
{
		$("#output").load("includes/query.php", 
				{tipo:26,id:id_poli} 
					,function(){	
						 loadMisPoligonos();
						
					}
				); 
}
function disableTest(cm_div){

            document.getElementById(cm_div).disabled = true;
            var nodes = document.getElementById(cm_div).getElementsByTagName('*');
            for(var i = 0; i < nodes.length; i++){
            	
                nodes[i].disabled = true;
            }
            document.getElementById("radio_fil").disabled = false;
            

 }
 function enableTest(cm_div){

            document.getElementById(cm_div).disabled = false;
            var nodes = document.getElementById(cm_div).getElementsByTagName('*');
            for(var i = 0; i < nodes.length; i++){
                nodes[i].disabled = false;
            }

 }
 function moveDrag(feature, pixel)
{
	
    		lon=feature.geometry['x'];
    		lat=feature.geometry['y'];
    		lonlat=new OpenLayers.LonLat(lon,lat).transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
  			);
  			DRAG_LON=lonlat.lon;
  			DRAG_LAT=lonlat.lat;
    		//alert(lonlat.lon);
        // document.getElementById(LC_lon).value=lonlat.lon;
         //document.getElementById(LC_lat).value=lonlat.lat;
  
}

function activarMarcador(nom_cat,id_cat)
{
	if(!GIS_DRAG)
	{
		
		
		$( "#md" ).css("border","2px solid #2FA4E7");
		showMensaje("Para corregir ubicacion debe mover el marcador sobre el mapa <img height=20px width=20px src='images/iconos/marker2.png'>.<br>Para desactivar el control haga click en este control");
		GIS_DRAG=true;
		limpiarPuntosDrag();
		var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
      DRAG_LON=CM_centro.lon;
  	DRAG_LAT=CM_centro.lat;
      var id_cate=id_cat.split(",");
      var nom_cate=nom_cat.split(",");
      var sel="<select id=id_cat_sel name=id_cat_sel>";
      for(i=0;i<id_cate.length;i++)
      {
      	sel +="<option value="+id_cate[i]+">"+nom_cate[i]+"</option>";
      }
       sel +="</select>";
     CM_texto="<div id=pop_titulo1>Guardar Marcador</div><table><tr><td width=30%>Categoria</td><td width=70%>"+sel+"</td></tr><tr><td width=30%>Nombre</td><td width=70%><input type='text' id='nom_marcador' name='nom_marcador'></td></tr><tr><td width=30%>Calle</td><td width=70%><input type='text' id='calle_marcador' name='calle_marcador'></td></tr><tr><td width=30%>N&uacute;mero</td><td width=70%><input type='text' id='num_marcador' name='num_marcador'></td></tr><tr><td width=30%>Comuna</td><td width=70%><input type='text' id='com_marcador' name='com_marcador'></td></tr><tr><td width=30%>Descripcion</td><td width=70%><textarea row=5 cols=10 id=cont_marcador name=cont_marcador></textarea></td></tr><tr><td width=30%></td><td width=70%><input type='button' onclick='saveMarcador("+CM_centro.lon+","+CM_centro.lat+",9999999999,0);' value='Guardar'></td></tr></table>";
      /* se reinicia variable principal para que setee index del onjeto*/
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
    /**/
		addMarcadorVector(CM_centro.lon,CM_centro.lat,CM_texto,"images/iconos/marker2.png",30,30);;
		activarDrag();
		
	}else
		{
			$( "#md" ).css("border","none");
			showMensaje("Control desactivado.");
			GIS_DRAG=false;
			desactivarDrag();
			
			/*sprintersLayer.setZIndex(6000);*/
			
		}
}

function saveMarcador(lon,lat,id_div,id_serv)
{
	
	if(id_div==9999999999)
	{
		id_div="";
		lon=DRAG_LON;
		lat=DRAG_LAT;
		
	}
	
	var detalle=document.getElementById('cont_marcador'+id_div).value;
	var categoria=0;
	try
	{
   categoria=document.getElementById('id_cat_sel'+id_div).value;
		
	}catch(e){}
	var nombre=document.getElementById('nom_marcador'+id_div).value;
	
	var calle=document.getElementById('calle_marcador'+id_div).value;
	var numero=document.getElementById('num_marcador'+id_div).value;
	var comuna=document.getElementById('com_marcador'+id_div).value;
	
	if($.trim(nombre)!="" && $.trim(lon)!="" && $.trim(lat) !="" && ($.isNumeric(numero) || $.trim(numero)==""))
	{
		showMensaje("<img src='images/load_central.gif'>");
	$("#contenido_cuatro").load("includes/query.php", 
				{tipo:27,lat:lat, lon:lon, detalle:detalle,categ:categoria,nom:nombre,detalle:detalle,calle:calle,numero:numero,comuna:comuna,id_ser:id_serv} 
					,function(){	
						if(id_serv == 0)
						{
							showMensaje("Punto Almacenado!");
							try
		  				{
  							popup_mini_nativo.destroy();
  						}catch(e){} 
  					}else
  						{
  							$("#list_puntos").load("includes/query.php", 
									{tipo:29,categoria:categoria,ver:0} 
								,function(){	
											
									}
								);  
  							showMensaje("Punto Guardado!");
  							
  						}
  						closeModalWeb();
						
					}
				);  
	}else
		{
			showMensaje("<div id=msg_alert>Debe ingresar un nombre o titulo para el punto<br>El n&uacute;mero municipal debe ser de tipo n&uacute;merico</div>");
		}
}

function loadMisPuntos()
{
	//showMensaje("<img src='images/load_central.gif'>");
	
	$("#contenido_cuatrob").load("includes/query.php", 
				{tipo:28} 
					,function(){	
						$("#mis_puntos").show("slow");
											//closeModalWeb();
					}
				);  
	
}
function loadMisPuntosId()
{
	deleteMarkerServicio();
	var id_catg=document.getElementById('cat_pto').value;
	var all_marker=0;
	if(document.getElementById('all_marker').checked)
	{
		all_marker=1;
	}
	//showMensaje("<img src='images/load_central.gif'>");
	$("#list_puntos").load("includes/query.php", 
				{tipo:29,categoria:id_catg,ver:all_marker} 
					,function(){	
											
					}
				);  
	
}
function loadAddCateg()
{
	
	
	$("#categ_add").toggle();
	
	
}
function loadAddCategFile()
{
	
	
	$("#categ_file").toggle();
	
	
}
function saveCat(id_control)
{
	showMensaje("<img src='images/load_central.gif'>");
	var nom=document.getElementById('nom_cat').value;
	var cat=document.getElementById('cat_pto').value;
	if(id_control==1)
	{
		if(nom!="")
		{
			$("#output").load("includes/query.php", 
					{tipo:30,nombre:nom,tip:id_control} 
						,function(){	
								closeModalWeb();
						}
					);  
		}else
			{
				closeModalWeb();
				showMensajeestatico("<div id=msg_alert>Debe ingresar un nombre para la nueva categoria.</div>");
			}
	}
	if(id_control==2)
	{
		if(cat>0)
		{
			$("#output").load("includes/query.php", 
					{tipo:30,nombre:nom,tip:id_control,cat:cat} 
						,function(){	
							loadMisPuntos();
							closeModalWeb();
								showMensajeestatico("<div id=msg_alert>Categoria Eliminada.</div>");
						}
					);  
		}else
			{
				showMensajeestatico("<div id=msg_alert>Debe seleccionar una categoria para ser eliminada.</div>");
				closeModalWeb();
			}
	}
}
function upServicioCli(id_serv,id_cat)
{
	showMensaje("<img src='images/load_central.gif'>");
	$("#output").load("includes/query.php", 
					{tipo:31,serv:id_serv} 
						,function(){	
							loadMisPuntosId(id_cat);
							closeModalWeb();
								showMensajeestatico("<div id=msg_alert>Punto Eliminado.</div>");
						}
					);  
	
}
function editPtoLoad(id_div,id_serv)
{
	showMensaje("<img src='images/load_central.gif'>");
	$("#ptoEdit_"+id_div).load("includes/query.php", 
					{tipo:32,id_div:id_div,id_serv:id_serv} 
						,function(){	
							$("#ptoEdit_"+id_div).toggle("slow");
							closeModalWeb();
						}
					);  
	
}
var cat;
function LoadFileCateg()
{
	cat=document.getElementById('cat_pto').value;
	
	if (typeof $("#i_file")[0].files[0] != "undefined" && cat > 0)
  {
  	var file = $("#i_file")[0].files[0];
    //obtenemos el nombre del archivo
    var fileName = file.name;
    var ext=fileName.split(".");
    ext=ext[1];
    sizea=file.size;    
    var formData = new FormData($(".formulario")[0]);
    if(ext=="txt" || ext=="TXT")
    {
    			$.ajax({
        		    url: 'includes/query.php?tipo=33&categoria='+cat,  
        		    type: 'POST',
        		    // Form data
        		    //datos del formulario
        		    data: formData,
        		    //necesario para subir archivos via ajax
        		    cache: false,
        		    contentType: false,
        		    processData: false,
        		    //mientras enviamos el archivo
        		    beforeSend: function(){
        		       showMensaje("<img src='images/load_central.gif'>");   
        		    },
        		    //una vez finalizado correctamente
        		    success: function(data){
        		       
        		       closeModalWeb();
        		       loadMisPuntosId(cat);
        		    },
        		    //si ha ocurrido un error
        		    error: function(){
        		    	closeModalWeb();
        		      showMensajeestatico("<div id=msg_alert>Error al subir archivo.</div>");
        		       
        		    }
        		});
    	
    }else
    	{
    		showMensajeestatico("<div id=msg_alert>Debe seleccionar un archivo .txt</div>");
    	}
  }else
  {
  		showMensajeestatico("<div id=msg_alert>Debe seleccionar un archivo .txt y una categoria</div>");
  }
}

function opcBus(tipo)
{
	if(tipo==0)//direccion
	{		
		GIS_OPC_DIR=1;
		GIS_OPC_LUG=0;
	}
	if(tipo==1)//lugar
	{		
		GIS_OPC_DIR=0;
		GIS_OPC_LUG=1;
		
	}
	$("#list_opc_bus").load("includes/query.php", 
					{tipo:34,opc:tipo} 
						,function(){	
						
						}
					);  
}

function imprimirMapa()
{
	 w=window.open();
	 w.document.write($('#mapa').html());
	 w.print();
	 w.close();
}