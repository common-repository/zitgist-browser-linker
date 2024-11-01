<?php

function do_post($url, $request, &$success) 
{
   $response = "";
   $success  = true;

   // create a new cURL resource
   $ch = curl_init();

   // set URL and other appropriate options
   curl_setopt($ch, CURLOPT_URL, $url . $request);
   curl_setopt($ch, CURLOPT_HEADER, 0);
   curl_setopt($ch, CURLOPT_POST, 0);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);

   // header
   header('Content-type: text/xml');

   // grab URL and pass it to the browser
   $response = curl_exec($ch);

   // close cURL resource, and free up system resources
   curl_close($ch);
}

// Initialization

if (isset($_GET['uri'])) 
{
    $uri = $_GET['uri'];
}

if (isset($_GET['service'])) 
{
    $service = $_GET['service'];
}

if (isset($_GET['from'])) 
{
    $from = urlencode($_GET['from']);
}


switch ($service) 
{
	case "webpage" :
		$url     = "http://ws2.zitgist.com/";
		$request = "?from=$from&htmlonly=true&uri=" . $uri;
	break;
	
	case "all" :
		$url     = "http://ws2.zitgist.com/";
		$request = "?from=$from&uri=" . $uri;
	break;

	case "rdf" :
		$url     = "http://ws1.zitgist.com";
		$request = "?from=$from&uri=" . $uri;
	break;
	
	default :
		$url = "";
		$request = "";
	break;
}


if ((strlen($uri) > 0) && (strlen($url) > 0)) 
{
    $reponse = do_post($url, $request, $success);
} 
else 
{
    header('Content-type: text/xml'); 
	
?>

	<response>
		<error>
			Bad Call
		</error>
	</response>
	
<? 

} 

?>
