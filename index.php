<?php
include("includes/funciones.php");
$estado_sesion=estado_sesion();
//print_r($_SESSION['us_apps']);
if($estado_sesion!=0)
{
?>
					<script>
						window.location.href="login.php";
					</script>
<?php
}			
?>
<!DOCTYPE html>
<html lang="en">
<head>
   
    <meta charset="utf-8">
    <title>Gis By Chilemap.cl</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Charisma, a fully featured, responsive, HTML5, Bootstrap admin template.">
    <meta name="author" content="Muhammad Usman">

    <!-- The styles -->
    <link id="bs-css" href="css/bootstrap-cerulean.min.css" rel="stylesheet">

    <link href="css/charisma-app.css" rel="stylesheet">
    <link href='bower_components/fullcalendar/dist/fullcalendar.css' rel='stylesheet'>
    <link href='bower_components/fullcalendar/dist/fullcalendar.print.css' rel='stylesheet' media='print'>
    <link href='bower_components/chosen/chosen.min.css' rel='stylesheet'>
    <link href='bower_components/colorbox/example3/colorbox.css' rel='stylesheet'>
    <link href='bower_components/responsive-tables/responsive-tables.css' rel='stylesheet'>
    <link href='bower_components/bootstrap-tour/build/css/bootstrap-tour.min.css' rel='stylesheet'>
    <link href='css/jquery.noty.css' rel='stylesheet'>
    <link href='css/noty_theme_default.css' rel='stylesheet'>
    <link href='css/elfinder.min.css' rel='stylesheet'>
    <link href='css/elfinder.theme.css' rel='stylesheet'>
    <link href='css/jquery.iphone.toggle.css' rel='stylesheet'>
    <link href='css/uploadify.css' rel='stylesheet'>
    <link href='css/animate.min.css' rel='stylesheet'>
    <link href='css/style.css' rel='stylesheet'>

    <!-- jQuery -->
    <script src="bower_components/jquery/jquery.min.js"></script>

    <!-- The HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- The fav icon -->
    
    <link rel="shortcut icon" href="images/point.png">
    <script src="js/jquery-1.10.2.min.js"></script>
  <script src="http://maps.google.com/maps/api/js?v=3&amp;sensor=false"></script>
  <script src="http://www.chilemap.cl/OpenLayers/OpenLayers.js"></script>
  
  <script type="text/javascript" src="js/heatm.js"></script>
  <script type="text/javascript" src="js/animatedcluster.js"></script>
  <script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>

  <script src="js/funciones.js"></script>
  <script src="js/funciones_sitio.js"></script>
  
  <script src="js/isocro.js"></script>

</head>

<body>
    <!-- topbar starts -->
    <div class="navbar navbar-default" role="navigation">

        <div class="navbar-inner">
            <button type="button" class="navbar-toggle pull-left animated flip">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="index.php"> 
                <img src="images/gis2_blanco.png" id="img_header"></a>

            <!-- user dropdown starts -->
            <div class="btn-group pull-right">
                <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <i class="glyphicon glyphicon-user"></i><span class="hidden-sm hidden-xs"> <?=trim($_SESSION['us_nombre'])?></span>
                    <span class="caret"></span>
                </button>
                <ul class="dropdown-menu">
                    <!--li><a href="#">Profile</a></li-->
                    <li class="divider"></li>
                    <li><a href="login.php">Logout</a></li>
                </ul>
            </div>
            <!-- user dropdown ends -->

  
            <!-- theme selector ends -->

            <ul class="collapse navbar-collapse nav navbar-nav top-menu">
                
                <li class="dropdown" id="list_opc_bus">
                    <a href="" data-toggle="dropdown"><i class="glyphicon glyphicon-star"></i> Direcci&oacute;n <span
                            class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        
                        <?php
												if(in_array("1", $_SESSION['us_apps']))
												{
												?>
                        	<li><a href="javascript:opcBus(1);">Lugar</a></li>
                        <?php
                      	}
                        ?>
                        
                    </ul>
                </li>
                <li>
                    
                        <input  autocomplete=off placeholder="Carmen 443 santiago/Bancos" class="search-query form-control col-md-10" id="query" name="query" onKeyPress="enterpressalert(event, this,1);"  type="text"><button type="button" class="btn btn-default" data-dismiss="modal" onclick="buscar();">Buscar</button>
                        
                    
                </li>
            </ul>       

        </div>
    </div>
    <!-- topbar ends -->
<div class="ch-container">
    <div class="row">
        
        <!-- left menu starts -->
        <div class="col-sm-2 col-lg-2">
            <div class="sidebar-nav">
                <div class="nav-canvas">
                    <div class="nav-sm nav nav-stacked">

                    </div>
                    <ul class="nav nav-pills nav-stacked main-menu">
                        <li class="nav-header">Main</li>
                        <li><a class="ajax-link" href="index.php"><i class="glyphicon glyphicon-home"></i><span> Inicio</span></a>        </li>
                        <li><a class="ajax-link" href="javascript:limpiarmapa();"><i class="glyphicon glyphicon-eye-open"></i><span id="md">Limpiar Mapa</span></a></li>
                         <li class="accordion">
                        	<a href="#" id="controles"><i class="glyphicon glyphicon-th"></i><span>Controles</span></a>
                        	<ul class="nav nav-pills nav-stacked" id="centro">
               					</ul>
                        	</li> 
                         <li class="accordion">
                            <a href="#"><i class="glyphicon glyphicon-star"></i><span> Mis Capas</span></a>
                           
                            	<ul class="nav nav-pills nav-stacked">
                            		<?php
																if(in_array("11", $_SESSION['us_apps']))
																{
																	
															?>
               
                            	    <li> <button type="button" class="btn btn-default" data-dismiss="modal" onclick="loadMisPoligonos();">Mis Poligonos</button> 	    </li>
                            	    <li> <button type="button" class="btn btn-default" data-dismiss="modal" onclick="loadMisPuntos();">Mis Puntos</button> 	    </li>
															<?php
														}else
														{
															echo "No esta autorizado";
														}
															?>			
                            
                            	</ul>                         
                            
                        </li>     
                        <?php
												if(in_array("7", $_SESSION['us_apps']))
												{
												?>	
                        	<li><a class="ajax-link" href="javascript:activarPoligono();controlPoligono();"><i class="glyphicon glyphicon-edit"></i><span id="pd"> Dibujar Poligono</span></a>
                        <?php
                      	}else
                      	{
                      		?>
                      		<li><a class="ajax-link" href="javascript:alert('Control no activado');"><i class="glyphicon glyphicon-edit"></i><span> Dibujar Poligono</span></a>
                      		<?php
                      	}
                        ?>
                        </li>
                        <?php
												if(in_array("7", $_SESSION['us_apps']))
												{
													$categorias=getCategoriasCliente($_SESSION['us_id_cli']);
													foreach($categorias as $cat)
													{
														$id_cat[]=$cat[0];
														$nom_cat[]=$cat[1];
													}
													$id_cat=implode(",",$id_cat);
													$nom_cat=implode(",",$nom_cat);
												?>	
                        	<li><a class="ajax-link" href="javascript:activarMarcador('<?=$nom_cat?>','<?=$id_cat?>');"><i class="glyphicon glyphicon-plus"></i><span id="md">Nuevo Punto</span></a>
                        <?php
                      	}else
                      	{
                      		?>
                      		<li><a class="ajax-link" href="javascript:alert('Control no activado');"><i class="glyphicon glyphicon-plus"></i><span>Nuevo Punto</span></a>
                      		<?php
                      	}
                        ?>
                        </li>
                        <li class="accordion">
                        	<a href="#"><i class="glyphicon glyphicon-edit"></i><span>Isocronas</span></a>
                        	<ul class="nav nav-pills nav-stacked">
               						<?php
													if(in_array("2", $_SESSION['us_apps']))
													{
													?>	
                            	    <li><h5>Minutos <input type="text" name="min_iso" id="min_iso" ></h5></li>
                            	    <li><span class="txt_ejemplo">Valor n&uacute;merico no mayor a 30.</span></li>
                            	    <li>
                            	    	<h5>
                            	    	<input type="radio" class="radio_orden" id="ap" name="group3" value="walking" checked> A pie
																		<input type="radio" class="radio_orden" id="auto" name="group3" value="driving"> En auto
																	</h5>
                            	    	</li>
                            	    <li> <button type="button" class="btn btn-default" data-dismiss="modal" onclick="BuscarIso();">Generar</button> 	    </li>
																		
                            <?php
                          }else
                          {
                          	echo "No esta autorizado";
                          }
                            ?>
                            	</ul> 
                        	</li>              	
                        	
                        	 <li class="accordion">
                        	<a href="#"><i class="glyphicon glyphicon-eye-open"></i><span>Antenas</span></a>
                        	<ul class="nav nav-pills nav-stacked">
               						<?php
													if(in_array("8", $_SESSION['us_apps']))
													{
													?>	
                            	    <li><h5>Altura antena en mts <input type="text"  name="mts_antena" id="mts_antena" ></h5></li>
                            	    <li><span class="txt_ejemplo">Valor n&uacute;merico.</span></li>
                            	    
                            	    <li> <button type="button" class="btn btn-default" data-dismiss="modal" onclick="viabilidadAntena();">Consultar</button> 	    </li>
                            	    <li> <button type="button" class="btn btn-default" data-dismiss="modal" onclick="checkAntena();">Radio de 50mts</button> 	    </li>
																		
                            <?php
                          }else
                          {
                          	echo "No esta autorizado";
                          }
                            ?>
                            	</ul> 
                        	</li>     
                        
                        <li class="nav-header hidden-md">Opciones de B&uacute;squeda</li>

                        <li class="accordion">
                            <a href="#"><i class="glyphicon glyphicon-plus"></i><span> Filtro Lugares</span></a>
                           
                            	<ul class="nav nav-pills nav-stacked">
                            		 <?php
														if(in_array("11", $_SESSION['us_apps']))
														{
														?>
                            	    <li>Radio:<input type="text" id='radio_fil' name='radio_fil'>Mts</li>
                            	    <li>Mis Poligonos <br>
                            	    	<select class=input_form id=mis_poli name=mis_poli>					
																		</Select></li>
																			<script>
																			loadListaPoligono();
																			</script>
																		<?php
                            }else
                            {
                            	echo "No esta autorizado";
                            }
                            ?>
                            	</ul>                         
                            
                        </li>
                        <li class="accordion">
                            <a href="#"><i class="glyphicon glyphicon-plus"></i><span> Filtro Censo</span></a>
                           
                            	<ul class="nav nav-pills nav-stacked">
               
                            	    <li>Radio:<input type="text" id='radio_censo' name='radio_censo'>Mts</li>
                            	    <li> <button type="button" class="btn btn-default" data-dismiss="modal" onclick="getDataManz();">Buscar</button> 	    </li>
																		
                            
                            	</ul>                         
                            
                        </li>            	
                        
                       
                        
                    </ul>
                    
                </div>
            </div>
        </div>
        <!--/span-->
        <!-- left menu ends -->

        <noscript>
            <div class="alert alert-block col-md-12">
                <h4 class="alert-heading">Warning!</h4>

                <p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a>
                    enabled to use this site.</p>
            </div>
        </noscript>

        <div id="content" class="col-lg-10 col-sm-10">
            <!-- content starts -->
            <div>

</div>


<div class="row" id="resultado_map">
    <div class="box col-md-12">
        <div class="box-inner">
            <div class="box-header well">
                <h2><i class="glyphicon glyphicon-align-justify"></i> Resultados</h2>

                <div class="box-icon">
              
                    <a href="#" class="btn btn-minimize btn-round btn-default"><i
                            class="glyphicon glyphicon-chevron-up"></i></a>
                    
                </div>
            </div>
            <div class="box-content row" >
                <div class="col-lg-7 col-md-12" id="resultado_mapInt">
                    <ul id="list">
											<span class="txt_ejemplo">Aqu&iacute; se desplegaran los resultados de b&uacute;squeda</span>

			
										</ul>
                </div>


            </div>
        </div>
    </div>
</div>

<div class="row" id="mis_poligonos">
    <div class="box col-md-12">
        <div class="box-inner">
            <div class="box-header well">
                <h2><i class="glyphicon glyphicon-th"></i> Mis Poligonos</h2>

                <div class="box-icon">
              
                    <a href="#" class="btn btn-minimize btn-round btn-default"><i
                            class="glyphicon glyphicon-chevron-up"></i></a>
                                                
                    
                </div>
            </div>
            <div class="box-content row" >
                <div class="col-lg-7 col-md-12" id="contenido_cuatro">
                    
                </div>
								

            </div>
        </div>
    </div>
</div>
<div class="row" id="mis_puntos">
    <div class="box col-md-12">
        <div class="box-inner">
            <div class="box-header well">
                <h2><i class="glyphicon glyphicon-align-justify"></i> Mis Puntos</h2>

                <div class="box-icon">
              
                    <a href="#" class="btn btn-minimize btn-round btn-default"><i
                            class="glyphicon glyphicon-chevron-up"></i></a>
                                          
                    
                </div>
            </div>
            <div class="box-content row" >

								<div class="col-lg-7 col-md-12" id="contenido_cuatrob">
                    
                </div>

            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="box col-md-12">
        <div class="box-inner">
            <div class="box-header well">
                <h2><i class="glyphicon glyphicon-globe"></i> Mapa</h2>

                <div class="box-icon">
                    
                    <a href="#" class="btn btn-minimize btn-round btn-default"><i
                            class="glyphicon glyphicon-chevron-up"></i></a>
                    
                </div>
            </div>
            <div class="box-content row">
                <div class="col-lg-50 col-md-12">
                   <div id="mapa"></div>
                </div>
 

            </div>
        </div>
    </div>
</div>






    <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
         aria-hidden="true">

        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">×</button>
                    <h3>Settings</h3>
                </div>
                <div class="modal-body">
                    <p>Here settings can be configured...</p>
                </div>
                <div class="modal-footer">
                    <a href="#" class="btn btn-default" data-dismiss="modal">Close</a>
                    <a href="#" class="btn btn-primary" data-dismiss="modal">Save changes</a>
                </div>
            </div>
        </div>
    </div>

    <footer class="row">
        <p class="col-md-9 col-sm-9 col-xs-12 copyright">&copy; <a href="http://www.mox-up.com" target="_blank">Mox-up.com</p>

        <p class="col-md-3 col-sm-3 col-xs-12 powered-by">Powered by: <a
                href="http://www.chilemap.cl">Chilemap.cl</a></p>
    </footer>

</div><!--/.fluid-container-->

<!-- external javascript -->

<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>

<!-- library for cookie management -->
<script src="js/jquery.cookie.js"></script>
<!-- calender plugin -->
<script src='bower_components/moment/min/moment.min.js'></script>
<script src='bower_components/fullcalendar/dist/fullcalendar.min.js'></script>
<!-- data table plugin -->
<script src='js/jquery.dataTables.min.js'></script>

<!-- select or dropdown enhancer -->
<script src="bower_components/chosen/chosen.jquery.min.js"></script>
<!-- plugin for gallery image view -->
<script src="bower_components/colorbox/jquery.colorbox-min.js"></script>
<!-- notification plugin -->
<!--script src="js/jquery.noty.js"></script-->
<!-- library for making tables responsive -->
<script src="bower_components/responsive-tables/responsive-tables.js"></script>
<!-- tour plugin -->
<script src="bower_components/bootstrap-tour/build/js/bootstrap-tour.min.js"></script>
<!-- star rating plugin -->
<script src="js/jquery.raty.min.js"></script>
<!-- for iOS style toggle switch -->
<script src="js/jquery.iphone.toggle.js"></script>
<!-- autogrowing textarea plugin -->
<script src="js/jquery.autogrow-textarea.js"></script>
<!-- multiple file upload plugin -->
<script src="js/jquery.uploadify-3.1.min.js"></script>
<!-- history.js for cross-browser state change on ajax -->
<script src="js/jquery.history.js"></script>
<!-- application script for Charisma demo -->
<script src="js/charisma.js"></script>
<script>
	$("#resultado_map").hide();
	$("#mis_poligonos").hide();
	$("#mis_puntos").hide();
	init('mapa');
	loadServicios();
	$("#query").focus();
	
	</script>
<?php
if(isset($_REQUEST['query']) and trim($_REQUEST['query'])!="")
{
	?>
	<script>
		document.getElementById('query').value="<?=$_REQUEST['query']?>";
		buscar();
		</script>
	<?php
}


?>
<div id='output'></div>
<div id="popup_web">
    <div class="content-popup">
        <div class="close_web"><a href="javascript:closeModalWeb();" id="close_web"><img src="images/img/cerrar.png"/></a></div>
        <div class="cont_web">Contenido POPUP</div>
    </div>
</div>
</body>
</html>
