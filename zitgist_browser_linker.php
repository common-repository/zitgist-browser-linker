<?php
/*

Info for WordPress:
==============================================================================
Plugin Name: Zitgist Browser Linker
Plugin URI: http://www.zitgist.com
Description: Links all URIs from a blog post and comments to its related Semantic Web resources.
Version: 0.1
Author: Zitgist
Author URI: http://www.zitgist.com

*/

function zitgist_browser_linker_content($content)
{
	$link_img_url = get_option('siteurl')."/wp-content/plugins/zitgist-browser-linker/imgs/";
	$local_path_url = get_option('siteurl')."/wp-content/plugins/zitgist-browser-linker/";
	
//	$content = preg_replace( "|<a(.*)href=\"(.*)\"(.*)>([^>]+)(</a.*>)|U", "<a$1href=\"$2\"$3>$4$5 <img src=\"".$link_img_url."mini_rdf.gif\" border=\"0\" style=\"cursor: pointer; padding:0px; margin:0px;\" onmouseover=\"assignPopup(this, '$2', '$local_path_url');\" onclick=\"\" />", $content);

	$content = preg_replace( "|<a(.*)href=\"(.*)\"(.*)>([^>]+)(</a.*>)|Ue", "'<a'.stripslashes('$1').'href=\"'.make_abs('$2', get_permalink()).'\"'.stripslashes('$3').'>'.stripslashes('$4$5').'<img src=\"".$link_img_url."mini_rdf.gif\" border=\"0\" style=\"cursor: pointer; padding:0px 0px 0px 2px; margin:0px;\" onmouseover=\"assignPopup(this, \''.make_abs('$2', get_permalink()).'\', \'$local_path_url\');\" />'", $content);

	//$content = stripslashes($content);

	return $content;
}

function test($str)
{
	return $str."test";
}

function zitgist_browser_linker_comment($content)
{
	$link_img_url = get_option('siteurl')."/wp-content/plugins/zitgist-browser-linker/imgs/";
	$local_path_url = get_option('siteurl')."/wp-content/plugins/zitgist-browser-linker/";
	
//	$content = preg_replace( "|<a(.*)href=\"(.*)\"(.*)>([^>]+)(</a.*>)|U", "<a$1href=\"$2\"$3>$4$5 <img src=\"".$link_img_url."mini_rdf.gif\" border=\"0\" style=\"cursor: pointer; padding:0px; margin:0px;\" onmouseover=\"assignPopup(this, '$2', '$local_path_url');\" onclick=\"\" />", $content);

	$content = preg_replace( "|<a(.*)href=\"(.*)\"(.*)>([^>]+)(</a.*>)|Ue", "'<a'.stripslashes('$1').'href=\"'.make_abs('$2', get_permalink()).'\"'.stripslashes('$3').'>'.stripslashes('$4$5').'<img src=\"".$link_img_url."mini_rdf.gif\" border=\"0\" style=\"cursor: pointer; padding:0px 0px 0px 2px; margin:0px;\" onmouseover=\"assignPopup(this, \''.make_abs('$2', get_permalink()).'\', \'$local_path_url\');\" />'", $content);


	return $content;
}


function zitgist_browser_linker_register_headers()
{
	
	$js_url = get_option('siteurl')."/wp-content/plugins/zitgist-browser-linker/js/";
	$css_url = get_option('siteurl')."/wp-content/plugins/zitgist-browser-linker/css/";
	
	echo '<script language="JavaScript" type="text/javascript" src="' . $js_url . 'script.js"></script>';
	echo '<link rel="stylesheet" type="text/css" href="' . $css_url . 'style.css" />';
	
	
    echo "<script type=\"text/javascript\">\n";
    echo "    var featureList=[\"animation\"];\n";
    echo "    function init() {\n";
    echo "    }\n";
    echo "</script>\n";
    echo "<script type=\"text/javascript\" src=\"".$js_url."oat/loader.js\"></script>\n";
}


function make_abs($rel_uri, $base, $REMOVE_LEADING_DOTS = true) 
{ 

	// check if the base is part of the uri
	if($base == substr($rel_uri, 0, strlen($base)))
	{
		// The "relative URI" already have the "base URI" in it.
		// so this is not a relative URI but a base URI.
		return $rel_uri;
	}
	
	// there is a URI protocol prefix, and the base is not part of the "relative uri"
	// in that case we have two different uris.
	if(preg_match("'^[^:]+://'", $rel_uri))
	{
		return $rel_uri;
	}
	
	// Else we continue

	preg_match("'^([^:]+://[^/]+)/'", $base, $m); 
	
	$base_start = $m[1]; 
	
	if (preg_match("'^/'", $rel_uri)) 
	{ 
	  return $base_start . $rel_uri; 
	} 
	
	$base = preg_replace("{[^/]+$}", '', $base); 
	$base .= $rel_uri; 
	$base = preg_replace("{^[^:]+://[^/]+}", '', $base); 
	$base_array = explode('/', $base); 
	
	if (count($base_array) and!strlen($base_array[0])) 
	  array_shift($base_array); 

	$i = 1; 
	while ($i < count($base_array)) 
	{ 
	  	if ($base_array[$i - 1] == ".") 
		{ 
		   array_splice($base_array, $i - 1, 1); 
		   if ($i > 1) $i--; 
		} 
		elseif ($base_array[$i] == ".." and $base_array[$i - 1]!= "..") 
		{ 
			array_splice($base_array, $i - 1, 2); 
			if ($i > 1) 
			{ 
				$i--; 
				if ($i == count($base_array)) array_push($base_array, ""); 
			} 
		} 
		else 
		{ 
		   $i++; 
  		} 
	} 
	
	if (count($base_array) and $base_array[-1] == ".") 
	  $base_array[-1] = ""; 

	if ($REMOVE_LEADING_DOTS) 
	{ 
		while (count($base_array) and preg_match("/^\.\.?$/", $base_array[0])) 
		{ 
			array_shift($base_array); 
		} 
	} 
	return($base_start . '/' . implode("/", $base_array)); 
}

/*
function zitgist_browser_linker_options_page()
{
}

function zitgist_browser_linker_admin_page()
{
}
*/
      

add_filter('the_content', 'zitgist_browser_linker_content');
add_filter('comment_text', 'zitgist_browser_linker_comment');
add_action('wp_head', 'zitgist_browser_linker_register_headers');
//add_action('admin_menu', 'zitgist_browser_linker_admin_page');

?>
