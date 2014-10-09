<?php
	function Mysql_db()
	{
		$HostDB="localhost";
		$UserDB="root";
		$PassDB="123";
		$NameDB="mapas";
		
		$db = mysql_connect($HostDB, $UserDB, $PassDB);
		mysql_select_db($NameDB, $db);
		
		
		//staging select
		/*$HostDB="192.168.162.201";
		$UserDB="usr.mapas.test";
		$PassDB="usr.mtest";
		$NameDB="mapas";
		
		$db = mysql_connect($HostDB, $UserDB, $PassDB);
		mysql_select_db($NameDB, $db);*/
		
		return $db;
		
		
	} 
	function pgSql_db()
	{

	  $HostDB="localhost";
    $PortDB="5432";          
    $UserDB="postgres"; 
    $PassDB="12345";
    $NameDB="moxup";
		$dbPg = pg_connect("host=$HostDB port=$PortDB dbname=$NameDB user=$UserDB password=$PassDB");		 

	
return $dbPg;
	}
	function pgSql_db2()
	{
		 $HostDB="localhost";
    $PortDB="5432";          
    $UserDB="postgres"; 
    $PassDB="12345";
    $NameDB="gis";
   
    
		$dbPg = pg_connect("host=$HostDB port=$PortDB dbname=$NameDB user=$UserDB password=$PassDB");		 	
		return $dbPg;
	}

?>
