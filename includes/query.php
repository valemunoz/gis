<?php
include('funciones.php');
$estado_sesion=estado_sesion();
if($estado_sesion!=0 and $_REQUEST['tipo']!=14)
{
	?>
					<script>
						window.location.href="login.php";
					</script>
<?php

}
$data_server= explode("?",$_SERVER['HTTP_REFERER']);
$CM_path_base="http://localhost/github/gis";
//$CM_path_base="http://gis.chilemap.cl";
if(substr(strtolower($data_server[0]),0,strlen($CM_path_base))==$CM_path_base)
{

if($_REQUEST['tipo']==1)
{
	?>
	<script>
		deleteMarkerDireccion();
	</script>
	<?php
	$data=getDireccionExacta(urldecode($_REQUEST['consulta']),10);
	if(count($data)>0)
	{
		?>
		<br><h5><strong>Direcciones Encontradas(<?=count($data);?>)</strong> </h5>
		<ul id="list">			
		<?php
		foreach($data as $dat)
		{
			?>

 		  <li class="lista">
					<img src="images/img/iconos/direccion.png" class="img_list"><span class="tit_1"> <a class="link_dir" href="javascript:addMarcador('images/img/iconos/direccion.png','35,35',<?=$dat[6]?>,<?=$dat[7]?>,'');moverCentro(<?=$dat[6]?>,<?=$dat[7]?>,16);"><?=ucwords($dat[1])?> # <?=$dat[3]?>, <?=ucwords($dat[4])?></a></span><br>					
					<!--span class="tit_2">Titulo2</span><br>
					<span class="tit_3">Titulo3</span><br-->
				</li>
				
			<?php
		}
		?>
	
	</ul>
	<?php
	}else
	{
	$data=buscarDireccionOSM($_REQUEST['consulta']);
	if(count($data)>0)
	{
		?>
		<br><h5><strong>Direcciones Encontradas(<?=count($data);?>)</strong></h5>
		<ul id="list">			
		<?php
		foreach($data as $dat)
		{
			?>

 		  <li class="lista">
					<img src="images/img/iconos/direccion.png" class="img_list"><span class="tit_1"> <a class="link_dir" href="javascript:addMarcador('images/img/iconos/direccion.png','35,35',<?=$dat[1]?>,<?=$dat[0]?>,'');moverCentro(<?=$dat[1]?>,<?=$dat[0]?>,16);"><?=$dat[3]?> # <?=$dat[2]?>, <?=$dat[4]?></a></span><br>					
					<!--span class="tit_2">Titulo2</span><br>
					<span class="tit_3">Titulo3</span><br-->
				</li>
				
			<?php
		}
		?>
	
	</ul>
	<?php
	}else//buscamos en google
	{
		
		$data=getDireccionGoogle($_REQUEST['consulta']);
		?>
		<br><h5><strong>Direcciones Encontradas(<?=count($data);?>)</strong></h5>
		<ul id="list">
			
		<?php
		foreach($data as $dat)
		{
			?>
				
					<li class="lista">
					<img src="images/img/iconos/direccion.png" class="img_list"><span class="tit_1"> <a class="link_dir" href="javascript:addMarcador('images/img/iconos/direccion.png','35,35',<?=$dat[7]?>,<?=$dat[8]?>,'');moverCentro(<?=$dat[7]?>,<?=$dat[8]?>,16);"><?=$dat[3]?> # <?=$dat[2]?>, <?=$dat[4]?></a></span><br>					
					<!--span class="tit_2">Titulo2</span><br>
					<span class="tit_3">Titulo3</span><br-->
				</li>
			<?php
		}
		?>
	
	</ul>
	<?php
		
	}
}
		
?>
<br>
<?php
}elseif($_REQUEST['tipo']==2) //antenas
{
	//echo "antenas";
	$datos=getAntenasExtend($_REQUEST['lati'],$_REQUEST['lats'],$_REQUEST['lond'],$_REQUEST['loni']);
	foreach($datos as $dat)
	{
	?>
	
		addMarcadorServicio('images/img/iconos/antena.png','50,50',<?=$dat[1]?>,<?=$dat[2]?>,'<strong>ANTENA TELEFONIA</strong> <br> Empresa: <?=$dat[0]?>');			

	<?PHP
	}
	
}elseif($_REQUEST['tipo']==3)
{
	?>
	<br>
	<img class="img_control_off" name="manz" id="manz" title="Informacion Demografica por manzanas" src="images/img/iconos/manzana.png" height=32px class="menu_boton" onclick="javascript:accionManzana();">
	
	<?php
	if(in_array("4", $_SESSION['us_apps']))
	{
		?>
		<img class="img_control_off" name="clus" id="clus" title="Cluster ABC1" src="images/img/iconos/cluster.png" height=32px class="menu_boton" onclick="javascript:loadDataCluster();">
		<?php
	}
	?>
	
	<?php
	if(in_array("6", $_SESSION['us_apps']))
	{
		?>
		<img class="img_control_off" name="hm_2" id="hm_2" title="HeatMap ABC1" src="images/img/iconos/es_abc.png" height=32px class="menu_boton" onclick="javascript:heatMap2('abc1');">
		<?php
	}
	?>
	
	<?php
	if(in_array("5", $_SESSION['us_apps']))
	{
		?>
		<img class="img_control_off" name="hm" id="hm" title="HeatMap E" src="images/img/iconos/es_e.png" height=32px class="menu_boton" onclick="javascript:heatMap2('e');">
		<?php
	}
	
	if(in_array("10", $_SESSION['us_apps']))
	{
		?>
		<img class="img_control_off" name="clus_antena" id="clus_antena" title="Cluster Antenas" src="images/img/iconos/antena.png" height=32px class="menu_boton" onclick="javascript:loadDataClusterAntenas();">
		<?php
	}
	if(in_array("9", $_SESSION['us_apps']))
	{
		?>
		<img class="img_control_off" name="heat_antena" id="heat_antena" title="Heatmap Antenas" src="images/img/iconos/antena.png" height=32px class="menu_boton" onclick="javascript:heatMapAntena();">
		<?php
	}
	
	//fijos
	
	?>
	<img class="img_control_off" name="img_0" id="img_0" title="Activar Bancos" src="images/img/iconos/banco.png" height=32px class="menu_boton" onclick="checkServ(4,'images/img/iconos/banco.png',0);">
	<img class="img_control_off" name="img_1" id="img_1" title="Activar Colegios" src="images/img/iconos/universidad.png" height=32px class="menu_boton" onclick="checkServ(1,'images/img/iconos/universidad.png',1);">
	<img class="img_control_off" name="img_2" id="img_2" title="Activar Supermercados" src="images/img/iconos/supermercado.png" height=32px class="menu_boton" onclick="checkServ(11,'images/img/iconos/supermercado.png',2);">
  	<script>
  		addServicios('Bancos',0,4,'images/img/iconos/banco.png');
  		addServicios('Colegios',1,1,'images/img/iconos/universidad.png');
  		addServicios('Supermercados',2,11,'images/img/iconos/supermercado.png');
  	</script>
	<?php
	$datos=CM_getServiciosActivos($_SESSION['us_id_cli']);
	$datosEspecificos=CM_getServiciosActivosEspecificos($_SESSION['us_id_cli']);
	//print_r($datosEspecificos);
	$ii=3;
	if(count($datos)>0)
	{
		foreach($datos as $i => $dat)
		{
  		?>
  		
  		<img class="img_control_off" name="img_<?=$ii?>" id="img_<?=$ii?>" title="Activar <?=$dat[1]?>" src="images/<?=$dat[5]?>" height=32px class="menu_boton" onclick="checkServ(<?=$dat[2]?>,'<?=$dat[5]?>',<?=$ii?>);">
  		<script>
  			addServicios('<?=$dat[1]?>',<?=$ii?>,<?=$dat[2]?>,'images/<?=$dat[5]?>');
  		</script>
  		<?PHP
  		$ii++;
		}
	}
	if(count($datosEspecificos)>0)
	{
    $ii=0;
		foreach($datosEspecificos as $i => $dat)
		{
  		?>
  		
  		<img class="img_control_off" name="imgEsp_<?=$ii?>" id="imgEsp_<?=$ii?>" title="Activar <?=$dat[1]?>" src="<?=$dat[5]?>" height=32px class="menu_boton" onclick="checkServEspecifico(<?=$dat[2]?>,'<?=$dat[5]?>',<?=$ii?>);">
  		<script>
  			addServiciosEspecifico('<?=$dat[1]?>',<?=$ii?>,<?=$dat[2]?>,'<?=$dat[5]?>');
  		</script>
  		<?PHP
  		$ii++;
		}
	}
	?>
</br>
	<?php
}elseif($_REQUEST['tipo']==5) //manzanas
{
	//echo "antenas";
	$datos=getManzanasExtend($_REQUEST['lati'],$_REQUEST['lats'],$_REQUEST['lond'],$_REQUEST['loni']);
	if(count($datos)>0)
	{
		foreach($datos as $d)
		{
			$data=$d[9];
			//echo "<br>".$data;
			$data=str_replace("MULTIPOLYGON(((","",trim($data));
			$data=str_replace(")))","",$data);
			$data=str_replace(",","|",$data);
			$data=str_replace(" ",",",$data);
			$estrato=$d[8];
			if(trim($estrato)=="")
			{
				$estra=0;
				
				if($d[2]> $estra)
				{
					$estra=$d[2];
					$estrato="e";
				}
				if($d[3]> $estra)
				{
					$estra=$d[3];
					$estrato="d";
				}
				if($d[4]> $estra)
				{
					$estra=$d[4];
					$estrato="c3";
				}
				if($d[5]> $estra)
				{
					$estra=$d[5];
					$estrato="c2";
				}
				if($d[6]> $estra)
				{
					$estra=$d[6];
					$estrato="abc1";
				}
					
					
				
			}
			$texto="<div id=pop_titulo1>DATOS MANZANA</div>";
			$texto.="<div id=pop_titulo2>Estrato social: ".$estrato."</Div>";
			if(in_array("3", $_SESSION['us_apps']))
			{
				$texto.="<div id=pop_titulo2>Total Hogares: ".$d[7]."</div>";			
				$texto.="<div id=pop_titulo2>Mujeres: ".$d[13]."</div>";
				$texto.="<div id=pop_titulo2>Hombres: ".$d[12]."</div>";			
				$texto.="<div id=pop_titulo2>Total Personas: ".$d[10]."</div>";
			}
  	
			
  	
			//echo "<br><br>".$data;
			if(strtolower($estrato)=="e")
			{
				?>
				opt_style=CM_myStyles;
			<?PHP
			}elseif(strtolower($estrato)=="d")
			{
				?>
				opt_style=CM_myStyles2;
			<?PHP
			}elseif(strtolower($estrato)=="c2")
			{
				?>
				opt_style=CM_myStyles3;
			<?PHP
			}elseif(strtolower($estrato)=="c3")
			{
				?>
				opt_style=CM_myStyles4;
			<?PHP
			}elseif(strtolower($destrato)=="abc1")
			{
				?>
				opt_style=CM_myStyles5;
			<?PHP
			}else
			{
				?>
				opt_style=CM_myStyles_default;
			<?PHP
			}
			?>
				addPoligono('<?=$data?>','<?=$texto?>',opt_style);	
			<?PHP
  	
		}
	}
	?>
		loadS();
		closeModalWeb();
	<?PHP
	
	
}elseif($_REQUEST['tipo']==6)//servicios especificos sin registro
{
	$datos=getServicioExtend($_REQUEST['id'],$_REQUEST['lati'],$_REQUEST['lats'],$_REQUEST['lond'],$_REQUEST['loni']);
	if(count($datos)>0)
	{
		foreach($datos as $i => $dat)
		{
  	  $texto_html="<div id=pop_titulo1>".trim(strtoupper($dat[10]))."</div>";
			$texto_html .= "<div id=pop_titulo2>".trim(ucwords($dat[3]))." #".trim($dat[4])."</div>";
			$texto_html .= "<div id=pop_titulo3>".trim(strtoupper($dat[5]))."</div>";
			//$texto_html="test";
		?>
			
			addMarcadorOnDemand('<?=$_REQUEST['icono']?>','30,30',<?=$dat[1]?>,<?=$dat[2]?>,'<?=$texto_html?>',<?=$_REQUEST['id_serv']?>);			
			loadGrilla(2,"<?=$dat[11]?>","<?=$_REQUEST['id']?>");	  
		  
		<?PHP
		}
	}
	?>
	closeModalWeb();
	<?php
}elseif($_REQUEST['tipo']==7)// servicios por radio
{
	$data=getServiciosXRadio($_REQUEST['lat'],$_REQUEST['lon'],1);
	?>
	<script>
		DibujarCirculoAdap("blue","yellow",1200,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,0);
	</script>
</br>
	<div>
		<b>Comercios-Servicios Encontrados(<?=count($data)?>)</b>
	</div>
</br>
	<ul>
		<?php
		foreach($data as $i => $dat)
		{
			 
			?>
			<script>
				addMarcadorNativo("images/img/iconos/circle.png","13,13",<?=$dat[3]?>,<?=$dat[4]?>,"<b><?=ucwords($dat[1])?></b>");
				</script>
			<li class="li_result" onclick="moverCentro(<?=$dat[3]?>,<?=$dat[4]?>,17);popNativo('<b><?=ucwords($dat[1])?></b>',0,<?=$dat[4]?>,<?=$dat[3]?>);"><b><?=$i+1?>:</b><b><?=ucwords($dat[1])?></b> <br>Categoria:<?=ucwords($dat[2])?> <br>Distancia:<?=round($dat[5],2)?> Km</li>
			<?php
		}
		?>
	</ul>
	<?php
}elseif($_REQUEST['tipo']==8)//heatMap
{
	$data=getManzanasES($_REQUEST['tip']);
	?>
		 heat = new Heatmap.Layer("Heatmap");
	<?php
	foreach($data as $dat)
	{
		$latlon=str_replace("POINT(","",$dat[1]);
		$latlon=str_replace(")","",$latlon);
		$latlon=explode(" ",trim($latlon));
		?>
			 heat.addSource(new Heatmap.Source(new OpenLayers.LonLat(<?=$latlon[0]?>, <?=$latlon[1]?>).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  ),10));

		<?php
	}
	?>
		heat.setOpacity(0.50);
		map.addLayer(heat);
	 closeModalWeb();
	<?php
	

}elseif($_REQUEST['tipo']==9)//cluster
{
	$data=getManzanasES("abc1");
	foreach($data as $i => $dat)
	{
		$latlon=str_replace("POINT(","",$dat[1]);
		$latlon=str_replace(")","",$latlon);
		//$latlon=explode(" ",trim($latlon));
		if($i==0)
			$latlon_string =trim(str_replace(" ",",",$latlon));
		else	
			$latlon_string .="|".trim(str_replace(" ",",",$latlon));
	}
	?>
	<script>
		loadCluster('<?=$latlon_string?>')
		
		</script>
	<?php
	
}elseif($_REQUEST['tipo']==10)//cluster
{
	
	$coord=$_REQUEST['coord'];
	$coord=str_replace("POINT(","",$coord);
	$coord=str_replace(")","",$coord);
	$coordenadas="POLYGON((".$coord."))";
	$data=getServiciosContein($coordenadas);
	?>
	<ul>
	<?php
	foreach($data as $i => $dat)
	{
		?>
		
			<script>
				addMarcadorNativo("images/img/iconos/circle.png","13,13",<?=$dat[1]?>,<?=$dat[2]?>,"<b><?=ucwords($dat[0])?></b>");
			</script>
			<li class="li_result" onclick="moverCentro(<?=$dat[1]?>,<?=$dat[2]?>,16);popNativo('<?=$dat[0]?>',0,'<?=$dat[2]?>','<?=$dat[1]?>');">
				<b><?=$i+1?>:</b><b><?=ucwords($dat[0])?>
			</li>
		
		<?php
	}
		?>
	</ul>
	<?php
}
elseif($_REQUEST['tipo']==11)// Lugares
{
	//$data=getServicioExtendFull($_REQUEST['consulta'],$_REQUEST['lati'],$_REQUEST['lats'],$_REQUEST['lond'],$_REQUEST['loni']);
	$radio=100000000;
	$ditancia=false;
	if($_REQUEST['radio']!="")
	{
		$radio=$_REQUEST['radio'];
		$distancia=true;
	}
	if(is_numeric($_REQUEST['poli']))
	{
		
		$poli=getMisPoligonosQR(" and id_poligono=".$_REQUEST['poli']."");
		
		$data=getServiciosFullPoligono($_REQUEST['consulta'],$_REQUEST['lat'],$_REQUEST['lon'],$poli[0][8]);
		$dataCli=getServiciosCliFullPoligono($_REQUEST['consulta'],$_REQUEST['lat'],$_REQUEST['lon'],$poli[0][8]);
		if(count($data)>0 and count($dataCli)>0)
			$data=array_merge($data,$dataCli);
		elseif(count($dataCli)>0)	
			$data=$dataCli;
		?>
		<script>
			//alert('<?=$poli[0][1]?>');
			addPoligono('<?=$poli[0][1]?>','tets',CM_myStyles3);
			
		</script>
		<?php
	}else
	{
		$data=getServiciosFull($_REQUEST['consulta'],$_REQUEST['lat'],$_REQUEST['lon'],$radio);
		$dataCli=getServiciosCliFull($_REQUEST['consulta'],$_REQUEST['lat'],$_REQUEST['lon'],$radio);
		//		print_r($dataCli);
		if(count($data)>0 and count($dataCli)>0)
			$data=array_merge($data,$dataCli);
		elseif(count($dataCli)>0)	
			$data=$dataCli;
	}
	//print_r($data);
	?>
		<br><h5><strong>Lugares Encontrados(<?=count($data);?>)</strong></h5>
		<ul id="list">			
		<?php
		foreach($data as $dat)
		{
			$tipo_serv=2;
			if($dat[10]>0)
			{
				$tipo_serv=$dat[10];
			}
			$categ=$dat[2];
			if(is_numeric($categ))
			{
				$cat=getCategoriasCliente($categ);
				$categ=$cat[0][1];
			}
			$texto="<div id=pop_titulo1>".strtoupper($dat[1])."</div>";
			$texto.="<div id=pop_titulo2>".ucwords($categ)."</div>";
			if(trim($dat[6])!="")
			{
				$texto.="<div id=pop_titulo3>".ucwords($dat[6])." #".$dat[7]."</div>";
			}
			$texto.="<div id=pop_titulo3>".ucwords($dat[8])."</div>";
			$text_dis="";
			if($distancia or is_numeric($_REQUEST['poli']))
			{
				$texto.="<div id=pop_titulo3>Distancia: ".round($dat[5]/1000,2)."Km</div>";
					$text_dis="Distancia: ".round($dat[5]/1000,2)."Km";	
					?>
					<script>
						addMarcadorNativo('images/img/iconos/place.png','35,35',<?=$dat[3]?>,<?=$dat[4]?>,'<?=$texto?>');
						</Script>
					<?php
			}
			if(trim($dat[9])!="")
			{
				$texto .="<div id=pop_titulo4>".ucwords($dat[9])."</div>";
			}
			?>
				
 		  <li class="lista">
 		  	<?php
 		  	if(!$distancia and !is_numeric($_REQUEST['poli']))
				{
				?>
					<img src="images/img/iconos/place.png" class="img_list"><span class="tit_1"> <a class="link_dir" href="javascript:addMarcadorNativo('images/img/iconos/place.png','35,35',<?=$dat[3]?>,<?=$dat[4]?>,'<?=$texto?>');moverCentro(<?=$dat[3]?>,<?=$dat[4]?>,16);"><?=ucwords($dat[1])?>, <?=ucwords($dat[8])?> <?=$text_dis?></a></span><br>					
				<?php
				}else
				{
					?>
					<img src="images/img/iconos/place.png" class="img_list"><span class="tit_1"> <a class="link_dir" href="javascript:moverCentro(<?=$dat[3]?>,<?=$dat[4]?>,17);popNativo('<?=$texto?>',0,<?=$dat[4]?>,<?=$dat[3]?>);"><?=ucwords($dat[1])?>, <?=ucwords($dat[8])?> <?=$text_dis?></a></span><br>					
					<?php
				}
				?>		
					<!--span class="tit_2">Titulo2</span><br>
					<span class="tit_3">Titulo3</span><br-->
				</li>
				<script>
					loadGrilla(<?=$tipo_serv?>,"<?=$dat[0]?>",0);
					</Script>
			<?php
		}
		?>
	
	</ul>
	<?php
	if($distancia)
	{
		?>
	<script>
		EliminarCirculos();
		DibujarCirculoAdap("blue","yellow",<?=$radio?>,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,0,3);
		DibujarCirculoAdap("red","yellow",<?=$radio*3/100?>,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,0.8);
		map.zoomToExtent(vectorCirculo.getDataExtent(),false);
		</script>
	<?php
	}
	if(is_numeric($_REQUEST['poli']))
	{
		?>
		<script>
			extendPoligonos();
			</script>
		<?php
	}

}elseif($_REQUEST['tipo']==12)// load grilla resultados
{
	$nom_archivo="resultado_".date("YmdHis").".csv";
	?>
	<span id=tit_grilla>Resultados Mapa</span>
	<div id="header_grilla">
		
		<img src="images/img/down.png" title="Descargar CSV" onclick="javascript:window.location='csv/<?=$nom_archivo?>'" class="menu_boton">
	</div>
	<br>
	<table id="tbl" border=1>
		<tr>
			<td>
				
			</td>
			<td>
				<strong>NOMBRE</strong>
			</td>
			<td>
				<strong>DIRECCION</strong>
			</td>
			<!--td>
				Tipo
			</td>
			<td>
				Contenido
			</td-->
		</tr>
		<?php
		//print_r($_REQUEST);
		
		$id=explode("|",$_REQUEST['gr_id']);		
		//print_r($_REQUEST['gr_id']);
		$tip=explode("|",$_REQUEST['gr_tipo']);
		//print_r($_REQUEST['gr_tipo']);
		$contenido_arr=array();
		foreach($tip as $i => $tipo)
		{
			//echo "<br>".$id[$i];
			if(trim($id[$i])!="")
			{
				if($tipo==2)
				{
					$data=getServiciosXId($id[$i]);
					$id_dat=$id[$i];
					$titulo=$data[1];
					$direccion="".$data[5]." ".$data[6].", ".$data[7]."";
					$contenido=$data[8];
					$cont=array();
					$cont[]=$id_dat;
					$cont[]=$titulo;
					$cont[]=$direccion;
					$cont[]=$tipo;
					$cont[]=$contenido;
				}
				if($tipo==3)//servicios del cliente
				{
					$data=getServiciosClienteXId($id[$i]);
					$id_dat=$id[$i];
					$titulo=$data[1];
					$direccion="".$data[2]." ".$data[3].", ".$data[4]."";
					$contenido=$data[5];
					$cont=array();
					$cont[]=$id_dat;
					$cont[]=$titulo;
					$cont[]=$direccion;
					$cont[]=$tipo;
					$cont[]=$contenido;
				}
				
				$contenido_arr[]=$cont;
				?>
				<tr>
					<td>
						<?=$i+1;?>
					</td>
					<td>
						<?=ucwords($titulo)?>
					</td>
					<td>
						<?=ucwords($direccion)?>
					</td>
					<!--td>
						<?=$tipo?>
					</td>
					<td>
						<?=$contenido?>
					</td-->
				</tr>
				<?php
			}
		}
		
		createCsv($contenido_arr,$nom_archivo);
		?>
	</table>
	<?php
}elseif($_REQUEST['tipo']==13)
{
	/*
	$radio=($_REQUEST['minutos']/2) *1000;
	$radio_ini=$radio*50/100;
	list($direcciones,$poli,$lonlat)=getDireccionRadio($_REQUEST['lon'],$_REQUEST['lat'],$radio,$radio_ini);
	//print_r($direcciones);

	$poli=str_replace("MULTILINESTRING","",$poli);
	$poli=str_replace("MULTIPOLYGON","",$poli);
	$poli=str_replace("POLYGON","",$poli);
	$poli=str_replace("((","",$poli);
	$poli=str_replace("))","",$poli);
	$poli=str_replace(",","|",$poli);
	$poli=str_replace(" ",",",$poli);
   
	*/
	?>
	<script>
		/*var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
    GIS_origin = new google.maps.LatLng(CM_centro.lat,CM_centro.lon);*/
		</Script>
	<?php
	/*foreach($lonlat as $i => $ll)
	{
		$dat=explode(" ",$ll);		
		
		?>
		<script>
			var destino = new google.maps.LatLng(<?=$dat[1]?>,<?=$dat[0]?>);
			buscaRuta(GIS_origin,destino,<?=$_REQUEST['minutos']?>);			
		</script>
		<?php
		sleep(1.5);
		if($i>10)
			break;
	}*/
	
	?>
	<script>
		 limpiarmapa();
			var CM_centro= map.getCenter().transform(
        new OpenLayers.Projection("EPSG:900913"), // de WGS 1984
        new OpenLayers.Projection("EPSG:4326") // a Proyección Esférica Mercator
      );
    	GIS_origin = new google.maps.LatLng(CM_centro.lat,CM_centro.lon);
			addMarcadorServicio('images/img/iconos/place.png','30,30',CM_centro.lat,CM_centro.lon,'');	
			moverCentro(CM_centro.lat,CM_centro.lon,14);	
			if(document.getElementById("ap").checked)
			   modo_iso="walking";
			if(document.getElementById("auto").checked)
				 modo_iso="driving";
				   
			loadIso(GIS_origin,modo_iso,<?=$_REQUEST['minutos']?>);//walking
			

		
		</script>
	<?php
}elseif($_REQUEST['tipo']==14)//inicio sesion
{
	$usuario=getUsuario($_REQUEST['mail']);
	//print_r($usuario);
	
	if(count($usuario) > 0 and $usuario[3]==$_REQUEST['clave'])
	{
		$cliente=getCliente($usuario[8]);
		if($cliente[1]==0 and count($cliente)>0)
		{
			if($usuario[6] <= getFecha() and $usuario[7] >= getFecha())
			{
				$capas=GetCapas($usuario[8]);
				inicioSesion($_REQUEST['mail'],$usuario[1],$usuario[0],$usuario[8],$capas);
				
				?>
					<script>
						window.location.href="index.php";
					</script>
				<?php
			}else
			{
				echo "Cuenta caducada, por favor contactarse con chilemap/mox-up.";
			}
		}else
		{
			echo "Cliente no valido, por favor contactarse con chilemap/mox-up.";
		}
		
	}else
	{
		echo "Usuario invalido.";
	}
}elseif($_REQUEST['tipo']==15)
{
	cerrar_sesion();
}elseif($_REQUEST['tipo']==16)
{
	addPoligono($_REQUEST['puntos'],$_REQUEST['lat'],$_REQUEST['lon'],$_SESSION["us_id"],$_REQUEST['nombre']);
}elseif($_REQUEST['tipo']==17)
{
	
	$poligonos=getMisPoligonos($_SESSION["us_id"]);
	//print_r($poligonos);
	?>
	<ul id="list">
<?php
foreach($poligonos as $ii => $pol)
{
	$texto="<div class=txt_mody>".ucwords($pol[6])."</div>";
	$texto .="<div class=txt_mody2><a href=javascript:activarModifyPoligono(".$ii.");>Modificar Poligono</a> | <a href=javascript:desactivarPoligonoModify(".$ii.");terminoModificacion(".$ii.",".$pol[0].");>Guardar</a></div>";
	
	?>
<li class="lista_poli"><a class=link_dir href="javascript:addPoligonoModify('<?=$pol[1]?>','<?=$texto?>',CM_myStyles3,<?=$ii?>);extendPoligonosDraw(<?=$ii?>);"><?=ucwords(strtolower($pol[6]))?></br>
	<span class=tit3>Fecha:<?=$pol[7]?></span></a> <span class=img_lista>
		<i onclick="addPoligonoModify('<?=$pol[1]?>','<?=$texto?>',CM_myStyles3,<?=$ii?>);extendPoligonosDraw(<?=$ii?>);activarModifyPoligono(<?=$ii?>);" class="glyphicon glyphicon-edit" title='Modificar poligono'></i>
	<span>   </span><i class='glyphicon glyphicon-remove' onclick='deletePoligono(<?=$pol[0]?>);' class=menu_boton src='images/iconos/delete.png' title='Eliminar poligono'></i></li>
	<?php
}
?>		
	</ul>
	<?php
}elseif($_REQUEST['tipo']==18)//servicios especificos sin registro cliente
{
	$datos=getServicioExtendEspecificos($_REQUEST['id'],$_REQUEST['lati'],$_REQUEST['lats'],$_REQUEST['lond'],$_REQUEST['loni']);
	if(count($datos)>0)
	{
		foreach($datos as $i => $dat)
		{
  	  $texto_html="<div id=pop_titulo1>".trim(strtoupper($dat[1]))."</div>";
			$texto_html .= "<div id=pop_titulo2>".trim(ucwords($dat[10]))." #".trim($dat[11])."</div>";
			$texto_html .= "<div id=pop_titulo3>".trim(strtoupper($dat[12]))."</div>";
			if(trim($dat[9])!="")
			{
				$texto_html .= "<div id=pop_titulo4>".trim(ucwords(strtolower($dat[9])))."</div>";
			}
			//$texto_html="test";
		?>
			
			addMarcadorOnDemandEspecifico('<?=$_REQUEST['icono']?>','30,30',<?=$dat[6]?>,<?=$dat[7]?>,'<?=$texto_html?>',<?=$_REQUEST['id_serv']?>);			
			loadGrilla(3,"<?=$dat[0]?>","<?=$_REQUEST['id']?>");	  
		  
		<?PHP
		}
	}
	?>
	closeModalWeb();
	<?php
}elseif($_REQUEST['tipo']==19)//cluster antenas
{
	$data=getAntenasFull();
	foreach($data as $i => $dat)
	{
		//$latlon=str_replace("POINT(","",$dat[1]);
		//$latlon=str_replace(")","",$latlon);
		//$latlon=explode(" ",trim($latlon));
		if($i==0)
			$latlon_string ="".$dat[2].",".$dat[1]."";
		else	
			$latlon_string .="|".$dat[2].",".$dat[1]."";
	}
	?>
	<script>
		loadCluster('<?=$latlon_string?>')
		
		</script>
	<?php
	
}elseif($_REQUEST['tipo']==20)//heatMap antena
{
	$data=getAntenasFull();
	//$data=getManzanasES('e');
	?>
		 heat = new Heatmap.Layer("Heatmap");
	<?php
	foreach($data as $dat)
	{
		$latlon=str_replace("POINT(","",$dat[1]);
		$latlon=str_replace(")","",$latlon);
		$latlon=explode(" ",trim($latlon));
		?>
			 heat.addSource(new Heatmap.Source(new OpenLayers.LonLat(<?=$dat[2]?>, <?=$dat[1]?>).transform(
        new OpenLayers.Projection("EPSG:4326"), // de WGS 1984
        new OpenLayers.Projection("EPSG:900913") // a Proyección Esférica Mercator
  ),10));

		<?php
	}
	?>
		heat.setOpacity(0.50);
		map.addLayer(heat);
	 closeModalWeb();
	<?php
	

}elseif($_REQUEST['tipo']==21)//algoritmo antena
{
	$data=antenasRadio($_REQUEST['lat'],$_REQUEST['lon'],50);
	//	print_r($data);
	?>
	<script>
		EliminarCirculos();
		DibujarCirculoAdap("#F8F107","#F8F107",50,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,0);
		DibujarCirculoAdap("#5C3DDC","#5C3DDC",3,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,1);
		map.zoomToExtent(vectorCirculo.getDataExtent(),false);
	</script>
	<?php
	if(count($data)>0)
	{
		?>
		<script>
			//closeModalWeb();
			//esconder('cinco');
			showMensaje("Se encontraron <?=count($data)?> antenas en un radio de 50mts");
			</Script>
		<?php
		$html_lista="<h4>Antenas Encontradas a 50 mts</h4>";
		$i=0;
		foreach($data as $antena)
		{
			$i++;
			$html="Empresa: ".$antena[1]."";
			$html .="<br>Distancia: ".$antena[4]."mts";
			$html_lista .='<li class=lista><h5>'.$i.'- '.utf8_encode(ucwords(strtolower(utf8_decode($antena[1])))).', Distancia: '.rand($antena[4],2).'mts</h5></li>';
			?>
			<SCRIPT>
				addMarcadorNativo("images/img/iconos/antena2.png","30,30",<?=$antena[2]?>,<?=$antena[3]?>,"<?=$html?>");
			</script>
			<?PHP
		
		}
		?>
		<script>
			$("#list").html("<?=$html_lista?>");
				$("#resultado_map").show("slow");
				$("#resultado_map .glyphicon-chevron-down").click();
			</Script>
		<?php
		
	}else
	{
		?>
		<script>
			//closeModalWeb();
			showMensaje("No se encontraron antenas en un radio de 50mts");
			</Script>
		<?php
	}

}elseif($_REQUEST['tipo']==22)//algoritmo antena2
{
	$radio=50;
	if($_REQUEST['mts_antena'] > 12)
	{
		$radio=$_REQUEST['mts_antena']*4;
	}
	if($radio < 50)
	  $radio=50;
	  
	  
	$data=antenasRadio($_REQUEST['lat'],$_REQUEST['lon'],$radio);
	$servicios=getServiciosXRadioEspecificos($_REQUEST['lat'],$_REQUEST['lon'],$radio);
	//	print_r($servicios);
	?>
	<script>
		EliminarCirculos();
		DibujarCirculoAdap("#F8F107","#F8F107",<?=$radio?>,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,0);
		DibujarCirculoAdap("#5C3DDC","#5C3DDC",<?=$radio*3/100?>,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,1);
		map.zoomToExtent(vectorCirculo.getDataExtent(),false);
	</script>
	<?php
	$html_lista="<h4>Puntos Sensibles</h4>";
	foreach($data as $antena)
		{
			
			$html="<div id=pop_titulo1>Empresa: ".ucwords(strtolower($antena[1]))."</div>";
			$html .="<div id=pop_titulo1>Distancia: ".rand($antena[4],2)." mts</div>";
			
			//$html_lista .='<li class=lista><h5>'.ucwords(strtolower($antena[1])).', Distancia: '.rand($antena[4],2).'mts</h5></li>';
			?>
			<SCRIPT>
				addMarcadorNativo("images/img/iconos/antena2.png","30,30",<?=$antena[2]?>,<?=$antena[3]?>,"<?=$html?>");
			</script>
			<?PHP
		
		}
		//servicios confilctivos
		$i=1;
		foreach($servicios as $serv)
		{
			$html_lista .='<li class=lista><h5>'.$i.'- '.utf8_encode(ucwords(strtolower(utf8_decode($serv[1])))).'['.ucwords($serv[2]).'], Distancia: '.rand($serv[5],2).'mts</h5></li>';
			$i++;
		}
		?>
			<script>
				$("#list").html("<?=$html_lista?>");
				$("#resultado_map").show("slow");
				$("#resultado_map .glyphicon-chevron-down").click();
				
				//loadGrilla(2,"<?=$serv[0]?>",0);	
			</script>
			<?php
	if(count($servicios)>0)
	{
		?>
		<script>
			//closeModalWeb();
			//esconder('cinco');
			showMensaje("Se encontraron <?=count($data)?> antenas en un radio de <?=$radio?>mts <br> y es una zona sensible con <?=count($servicios)?> puntos.");
			</Script>
		<?php
		
	}else
	{
		?>
		<script>
			//closeModalWeb();
			showMensajeestatico("Se encontraron <?=count($data)?> antenas en un radio de <?=$radio?>mts<br>El lugar no es zona sensible");
			</Script>
		<?php
	}

}elseif($_REQUEST['tipo']==23) //manzanas busqueda radio
{
	//echo "antenas";
	//$datos=getManzanasExtend($_REQUEST['lati'],$_REQUEST['lats'],$_REQUEST['lond'],$_REQUEST['loni']);
  list($tot_hogar,$tot_muj,$tot_hom,$tot_per,$tot_e,$tot_d,$tot_c3,$tot_c2,$tot_abc)=getManzanasRadio($_REQUEST['lon'],$_REQUEST['lat'],$_REQUEST['radio']);
  $radio=$_REQUEST['radio'];
  $texto_html="<div id=pop_titulo1>DATOS</div>";
			$texto_html .= "<div id=pop_titulo2>Hogares	: ".$tot_hogar."</div>";
			$texto_html .= "<div id=pop_titulo2>Mujeres	: ".$tot_muj."</div>";
			$texto_html .= "<div id=pop_titulo2>Hombres	: ".$tot_hom."</div>";  
			$texto_html .= "<div id=pop_titulo2>Personas: ".$tot_per."</div>";  
			
			$texto_html .= "<div id=pop_titulo2>E				: ".$tot_e."</div>";  
			$texto_html .= "<div id=pop_titulo2>D				: ".$tot_d."</div>";  
			$texto_html .= "<div id=pop_titulo2>C2			: ".$tot_c2."</div>";  
			$texto_html .= "<div id=pop_titulo2>C3			: ".$tot_c3."</div>";  
			$texto_html .= "<div id=pop_titulo2>ABC1		: ".$tot_abc."</div>";  
			
			
  
	?>
	<script>
		EliminarCirculos();
		DibujarCirculoAdap("#F8F107","#F8F107",<?=$radio?>,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,0);
		DibujarCirculoAdap("#5C3DDC","#5C3DDC",<?=$radio*3/100?>,<?=$_REQUEST['lon']?>,<?=$_REQUEST['lat']?>,1);
		map.zoomToExtent(vectorCirculo.getDataExtent(),false);
		addMarcadorNativo("images/img/charts.ico","24,24",<?=$_REQUEST['lat']?>,<?=$_REQUEST['lon']?>,"<b><?=$texto_html?></b>");		
	</script>
	<?php
}elseif($_REQUEST['tipo']==24) //update poligono
{
	$puntos=$_REQUEST['puntos'];
	updatePoligono($puntos,$_REQUEST['id']);
}elseif($_REQUEST['tipo']==25) //load poligonos lista
{
	$poligonos=getMisPoligonos($_SESSION["us_id"]);
	?>
	<option value='no'>No</option>
						<?php
						foreach($poligonos as $pol)
						{
							?>
							<option value="<?=$pol[0]?>"><?=ucwords(substr($pol[6],0,10))?></option>
							<?php
						}
						?>
	<?php
}elseif($_REQUEST['tipo']==26) //elimina poligo mis favoritos
{
	deletePoligono($_REQUEST['id']);
}elseif($_REQUEST['tipo']==27) //Guardar MArcador
{
	$id=$_REQUEST['id_ser'];
	$categoria=$_REQUEST['categ'];
	if($id==0)//nuevo punto
	{
		$data=array();
		$data[]=strtolower(elimina_acentos(trim($_REQUEST['nom'])));
		$data[]=strtolower(elimina_acentos(trim($_REQUEST['lon'])));
		$data[]=strtolower(elimina_acentos(trim($_REQUEST['lat'])));
		$data[]=strtolower(elimina_acentos(trim($_REQUEST['categ'])));
		$data[]=strtolower(elimina_acentos(trim($_REQUEST['detalle'])));
		$data[]=strtolower(elimina_acentos(trim($_REQUEST['calle'])));		
		$data[]=strtolower(elimina_acentos(trim($_REQUEST['numero'])));
		$data[]=strtolower(elimina_acentos(trim($_REQUEST['comuna'])));
		addServicioCli($data);
		
		
	}else //update punto
	{
		updateServicioCli(" nombre='".$_REQUEST['nom']."', calle='".$_REQUEST['calle']."',numero_municipal='".$_REQUEST['numero']."',comuna='".$_REQUEST['comuna']."',descripcion='".$_REQUEST['detalle']."'",$id);
	}
	
	
}elseif($_REQUEST['tipo']==28)
{
	$categorias=getCategoriasCliente($_SESSION['us_id_cli']);
	//print_r($categorias);
	$puntos=getServiciosClienteQR(" and id_cliente=".$_SESSION['us_id_cli']." and estado=0 order by id_gis_categoria");
	//print_r($poligonos);
	?>
	

	<hr>
	<h4>Filtro de b&uacute;squedas</h4>
	<hr>
	<h5>Categoria :<select class=input_form id="cat_pto" name="cat_pto">
		<option value=0>Todos</option>
		<?php
		foreach($categorias as $cat)
		{
		?>
			<option value=<?=$cat[0]?>><?=ucwords(strtolower($cat[1]))?></option>
		<?php
		}
		?>
	</select><span>   </span><i  class="glyphicon glyphicon-eye-open mano" onclick="loadMisPuntosId();" title="Ver Puntos"></i><span>   </span> <i class="glyphicon glyphicon-plus mano" onclick="loadAddCateg();" title="Nuevo"></i><span>   </span><i class="glyphicon glyphicon-remove mano"  title="Eliminar" onclick="saveCat(2);" ></i><span>   </span><i class=" glyphicon glyphicon-upload mano" onclick="loadAddCategFile();" title="Carga Archivo"></i> </h5>
<h5><input type="checkbox" name="all_marker" id="all_marker" value="">Mostrar en el mapa</h5>
	<div id='categ_add'>
	<h5>Nueva Categoria</h5>
	<hr>	
		<span><h5>Nombre :<input class=input_form type="text" id="nom_cat" name="nom_cat"><button type="button" class="btn btn-default" data-dismiss="modal" onclick="saveCat(1);">Guardar</button> </h5></span>
		
	</div>
		<div id='categ_file'>
	
	<h5>Carga por Archivos</h5>
	<hr>
		<form enctype="multipart/form-data" class="formulario">
 						
 						
 						<input type="file" name="i_file" id="i_file" value="">
 						
 						<button type="button" class="btn btn-default" data-dismiss="modal" id="but_check" name="but_check" onclick="LoadFileCateg();">Subir</button>
 						
				   </br><span class="txt_ejemplo">Debe seleccionar una categoria antes de subir el archivo.</span>
				   	
				  </form>
		
	</div>
	<hr>
	<h4>Resultados</h4>
	<ul id="list_puntos">

	</ul>
		<script>
			loadMisPuntosId();
	</Script>
	<?php

}elseif($_REQUEST['tipo']==29)
{
	
	$qr="";
	if($_REQUEST['categoria']>0)
	{
		$qr=" and id_gis_categoria=".$_REQUEST['categoria']."";
	}
	$qr .=" and id_cliente=".$_SESSION['us_id_cli']." and estado=0 order by nombre";
	$puntos=getServiciosClienteQR($qr);
	//print_r($puntos);

foreach($puntos as $ii => $pol)
{
	$texto="<div id=pop_titulo1>".ucwords($pol[1])."</div>";
	$texto .="<div id=pop_titulo3>".ucwords($pol[2])." #".$pol[3].", ".ucwords($pol[4])."</div>";
	$texto .="<div id=pop_titulo4>".ucwords(strtolower($pol[5]))."</div>";
	if($_REQUEST['ver']==1)
	{
		?>
		<script>
			addMarcadorServicio('images/iconos/point_fav.png','35,35',<?=$pol[6]?>,<?=$pol[7]?>,'<?=$texto?>');
			</Script>
		<?php
	}
	?>
<li class="lista_poli"> <a class="link_dir" href="javascript:addMarcadorServicio('images/iconos/point_fav.png','35,35',<?=$pol[6]?>,<?=$pol[7]?>,'<?=$texto?>');moverCentro(<?=$pol[6]?>,<?=$pol[7]?>,16);"><?=ucwords($pol[1])?>  </a><i class='glyphicon glyphicon-remove mano' onclick='upServicioCli(<?=$pol[0]?>,<?=$pol[8]?>);' title='Eliminar Punto'></i><span>   </span><i class='glyphicon glyphicon-edit mano'  onclick='editPtoLoad(<?=$ii?>,<?=$pol[0]?>);' title='Editar Punto'> </i></span></li>
	<div id="ptoEdit_<?=$ii?>" class=box1 >
		
	</div>
	<?php
}
if($_REQUEST['ver']==1)
	{
		?>
		<script>
			verMarcadoresServicio();
			</script>
			<?php
	}
			
}elseif($_REQUEST['tipo']==30)
{
	if($_REQUEST['tip']==1)
	{
		$catego=getCategoriaCli(" and nombre ilike '".$_REQUEST['nombre']."' and id_cliente=".$_SESSION['us_id_cli']."");
		if(count($catego)==0)
		{
			$data=array();
			$data[]=strtolower($_REQUEST['nombre']);
			$data[]=$_SESSION['us_id_cli'];
			addCategoria($data);
			?>
			<script>	
				//$("#categ_add").hide();
				loadMisPuntos();
				showMensaje("Categoria <?=strtoupper($_REQUEST['nombre'])?> Creada.");
			</Script>
			<?php
		}else
		{
			?>
			<script>	
				showMensaje("Categoria <?=strtoupper($_REQUEST['nombre'])?> ya existe, por favor modifique los datos ingresados.");
				
			</Script>
			<?php
		}
	}elseif($_REQUEST['tip']==2)
	{
		UpdateCategoria(" estado=1 ",$_REQUEST['cat']);
	}
}elseif($_REQUEST['tipo']==31)
{
	updateServicioCli(" estado=1 ",$_REQUEST['serv']);
}elseif($_REQUEST['tipo']==32) //edit servicio punto
{
	$ii=$_REQUEST['id_div'];
	$qr =" and id_cliente=".$_SESSION['us_id_cli']." and id_gis_servicio=".$_REQUEST['id_serv']."";
	$puntos=getServiciosClienteQR($qr);
	$cat=getCategoriaCli(" and id_gis_categoria=".$puntos[0][9]."");
	?>
	<table>
		<tr>
				<td>Categoria</td>
				<td><?=strtoupper($cat[0][0])?><input type="hidden" id="id_cat_sel<?=$ii?>" name="id_cat_sel<?=$ii?>" value="<?=$puntos[0][9]?>"></td>
			</tr>
			<tr>
				<td>Nombre/Titulo</td>
				<td><input type="text" class=input_form2 id="nom_marcador<?=$ii?>" name="nom_marcador<?=$ii?>" value="<?=$puntos[0][1]?>"></td>
			</tr>
			<tr>
				<td>Direccion</td>
				<td><input type="text" class=input_form2 id="calle_marcador<?=$ii?>" name="calle_marcador<?=$ii?>" value="<?=$puntos[0][2]?>"> # <input type="text" value="<?=$puntos[0][3]?>" class=input_form id="num_marcador<?=$ii?>" name="num_marcador<?=$ii?>"></td>
			</tr>
			<tr>
				<td>Comuna</td>
				<td><input type="text" class=input_form2 id="com_marcador<?=$ii?>" name="com_marcador<?=$ii?>" value="<?=$puntos[0][4]?>"></td>
			</tr>
			<tr>
				<td>Descripci&oacute;n</td>
				<td><textarea row=7 cols=30 id="cont_marcador<?=$ii?>" name="cont_marcador<?=$ii?>" ><?=$puntos[0][5]?></textarea></td>
			</tr>
			<tr>
				<td></td>
				<td><button type="button" class="btn btn-default" data-dismiss="modal" onclick="saveMarcador(<?=$puntos[0][7]?>,<?=$puntos[0][6]?>,<?=$ii?>,<?=$_REQUEST['id_serv']?>);">Guardar</button></td>
			</tr>
			
		</table>
	<?php
}elseif($_REQUEST['tipo']==33) //load masico
{
	
	$ar=fopen($_FILES['i_file']['tmp_name'],"r") or
    		die("No se pudo abrir el archivo");
		    $cont=0;
		    
			  while (!feof($ar))
			  {
			    $linea=fgets($ar);
			    $linea_arr=explode(";",trim($linea));
			    if(count($linea_arr)==7)
			    {
			    	$titulo=trim($linea_arr[0]);
			    	$descripcion=strtolower(elimina_acentos(trim($linea_arr[1])));
			    	$calle=strtolower(elimina_acentos(trim($linea_arr[2])));
			    	$numero=trim($linea_arr[3]);
			    	$comuna=strtolower(elimina_acentos(trim($linea_arr[4])));
			    	$lat=trim($linea_arr[5]);
			    	$lon=trim($linea_arr[6]);
			    	$lat=str_replace(",",".",$lat);
			    	$lon=str_replace(",",".",$lon);
			    	if($calle!="" and $numero!="" and $comuna!="" and  ($lat=="" or $lon=="")) //normaliza segun bd
			    	{
			    		$url_file=file_get_contents("http://www.chilemap.cl/ws/ws.php?query=".str_replace(" ","+",$calle)."+".str_replace(" ","+",$numero)."+".str_replace(" ","+",$comuna)."");
			    		if(trim($url_file)!="0")
			    		{
			    			$data_ur=explode(",",$url_file);
			    			$lat=$data_ur[6];
			    			$lon=$data_ur[7];
			    		}
			    	}
			    	if($lat!="" and $lon!="") //add a la BD
			    	{
			    			$data=array();
								$data[]=$titulo;
								$data[]=$lon;
								$data[]=$lat;
								$data[]=$_REQUEST['categoria'];
								$data[]=$descripcion;
								$data[]=$calle;		
								$data[]=$numero;
								$data[]=$comuna;
								addServicioCli($data);
			    	}
			    	
			    }
			    
			  }
			  ?>
			  <script>
			  	showMensaje("Datos Cargados.");
			  	</script>
			  <?php
}elseif($_REQUEST['tipo']==34)
{
	if($_REQUEST['opc']==0)
	{
	?>
	
                    <a href="" data-toggle="dropdown"><i class="glyphicon glyphicon glyphicon-ok"></i> Direcci&oacuten <span
                            class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        
                        <li><a href="javascript:opcBus(1);">Lugar</a></li>
                        
                    </ul>
                
	<?php
}
if($_REQUEST['opc']==1)
	{
	?>
	
                    <a href="" data-toggle="dropdown"><i class="glyphicon glyphicon glyphicon-ok"></i> Lugar <span
                            class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="javascript:opcBus(0);">Direcci&oacute;n</a></li>
                        
                        
                    </ul>
                
	<?php
}
}

}
?>
