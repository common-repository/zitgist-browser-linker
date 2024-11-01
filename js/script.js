function assignPopup(element, uri, local_path) 
{

    var zitgist_popup = OAT.Dom.create("div",{},"zitgist_popup");
    OAT.Style.opacity(zitgist_popup, 0);
    OAT.Dom.hide(zitgist_popup);
    document.body.appendChild(zitgist_popup);
	
	var header_container = OAT.Dom.create("div",{},"header_container");
	zitgist_popup.appendChild(header_container);


	var header_link_logo = OAT.Dom.create("a",{},"");
	header_link_logo.href = "http://zitgist.com";
	header_container.appendChild(header_link_logo);

	var header_logo_header = OAT.Dom.create("img",{},"zitgist_logo_img");
	header_logo_header.src = local_path + '/imgs/zitgistlogosml.png';
	header_logo_header.border = 0;
	header_link_logo.appendChild(header_logo_header);


	var service_1_container = OAT.Dom.create("div",{},"service_1_container");
	zitgist_popup.appendChild(service_1_container);

	var service_2_container = OAT.Dom.create("div",{},"service_2_container");
	zitgist_popup.appendChild(service_2_container);

    var a1 = new OAT.AnimationOpacity(zitgist_popup,{opacity:1});
    var a2 = new OAT.AnimationOpacity(zitgist_popup,{opacity:0});



	// First mouseover behavior
	var position = OAT.Dom.position(element);
	zitgist_popup.style.left = position[0]+"px";
	zitgist_popup.style.top = (position[1]+10)+"px";
	
	OAT.Dom.show(zitgist_popup);
	

	if(!OAT.Browser.isIE)
	{
		element["onmouseover"] = false;
	}
	
	load_service_1(uri, service_1_container, local_path); // Web Page + Semantic Page
	load_service_2(uri, service_2_container, local_path); // Semantic Web Entities
	
	a1.start();



    OAT.MSG.attach(a2.animation,OAT.MSG.ANIMATION_STOP,function(){ /* hide after opacity gets to 0 */
        OAT.Dom.hide(zitgist_popup);
    });

	// Re-asign the mouse over event.
    OAT.Event.attach(element,"mouseover",function(event) { /* start displaying on mouseover */
        a2.stop();
        
        var position = OAT.Event.position(event);
        zitgist_popup.style.left = (position[0]+5)+"px";
        zitgist_popup.style.top = (position[1]+5)+"px";
        
        OAT.Dom.show(zitgist_popup);
        a1.start();
    });
    OAT.Event.attach(element,"mouseout",function(event) { /* start hiding on mouseout */
        a1.stop();
        a2.start();
    });
	
	
	

    OAT.Event.attach(zitgist_popup,"mouseover",function(event) { /* start displaying on mouseover */
        a2.stop();
        OAT.Dom.show(zitgist_popup);
        a1.start();
    });

    OAT.Event.attach(zitgist_popup,"mouseout",function(event) { /* start hiding on mouseout */
        a1.stop();
        a2.start();
    });
}


	

 	
	
function load_service_1(uri, element, local_path) 
{
	var imgs_path = local_path + 'imgs/';
	var url     = local_path + 'proxy.php?';
	url           = url + 'service=all&';
	url           = url + 'from='+local_path+'&';
	url           = url + 'uri=' + escape(uri);
	
	var menu = OAT.Dom.create("div",{},"zitgist_menu");		
	element.appendChild(menu);
	
	var waiting_container = OAT.Dom.create("div",{},"waiting_container");
	menu.appendChild(waiting_container);
	
	waiting_container.innerHTML = element.innerHTML + '<img src="' + local_path + '/imgs/waiting_ajax.gif" border="0" style="padding:10px 50px 10px 50px; " />';	

	
	var menu_separator = OAT.Dom.create("div",{},"zitgist_menu_separator");		
	menu.appendChild(menu_separator);					
	
	
	load_service_response_XML_1(url, uri, menu, imgs_path);
}

function load_service_2(uri, element, local_path) 
{
	var imgs_path = local_path + 'imgs/';
	var url     = local_path + 'proxy.php?';
	url           = url + 'service=rdf&';
	url           = url + 'from='+local_path+'&';
	url           = url + 'uri=' + escape(uri);
	
	var menu = OAT.Dom.create("div",{},"zitgist_menu");		
	element.appendChild(menu);
	
	var waiting_container = OAT.Dom.create("div",{},"waiting_container");
	menu.appendChild(waiting_container);
	
	waiting_container.innerHTML = element.innerHTML + '<img src="' + local_path + '/imgs/waiting_ajax.gif" border="0" style="padding:10px 50px 10px 50px; " />';	

	
	load_service_response_XML_2(url, uri, menu, imgs_path);
}


function load_service_response_XML_1(url, uri, element, imgs_path) 
{
	// branch for native XMLHttpRequest object
	if (window.XMLHttpRequest) 
	{
		req = new XMLHttpRequest();
		req.element = element;
		req.imgs_path = imgs_path;
		req.onreadystatechange = process_service_response_1;
		req.open("GET", url, true);
		req.send(null);
	// branch for IE/Windows ActiveX version
	} 
	else if (window.ActiveXObject) 
	{
		req = new ActiveXObject("Microsoft.XMLHTTP");
		if (req) 
		{
			req.element = element;
			req.imgs_path = imgs_path;
			req.onreadystatechange = process_service_response_1;
			req.open("GET", url, true);
			req.send();
		}
	}
}


function load_service_response_XML_2(url, uri, element, imgs_path) 
{
	// branch for native XMLHttpreq2uest object
	if (window.XMLHttpRequest) 
	{
		req2 = new XMLHttpRequest();
		req2.element = element;
		req2.imgs_path = imgs_path;
		req2.onreadystatechange = process_service_response_2;
		req2.open("GET", url, true);
		req2.send(null);
	// branch for IE/Windows ActiveX version
	} 
	else if (window.ActiveXObject) 
	{
		req2 = new ActiveXObject("Microsoft.XMLHTTP");
		if (req2) 
		{
			req2.element = element;
			req2.imgs_path = imgs_path;
			req2.onreadystatechange = process_service_response_2;
			req2.open("GET", url, true);
			req2.send();
		}
	}
}

function process_service_response_1() 
{
	if (req.readyState == 4) 
	{
		window.status = '';
		
		if (req.status == 200) 
		{
			req.element.innerHTML = "";					
			
			if(req.responseXML)
			{
				var response = req.responseXML.documentElement;
	
				if(response.getElementsByTagName('amazon')[0]) 
				{
					var buyurl = response.getElementsByTagName('amazon')[0].getElementsByTagName('buyurl')[0].firstChild.data;
					
					var menu_item = OAT.Dom.create("div",{},"zitgist_menu_item");
					menu_item.innerHTML = '<a href="' + buyurl +'">' + '<img src="' + req.imgs_path + 'amazon.gif" border="0" class="zitgist_menu_img"  />' + 'Buy on Amazon</a>';
					req.element.	appendChild(menu_item);
				}	
	
	
				if(response.getElementsByTagName('webpage')[0]) 
				{
					var menu_item = OAT.Dom.create("div",{},"zitgist_menu_item");
					var url = "";
					
					if(response.getElementsByTagName('amazon')[0])
					{
						url = unescape(response.getElementsByTagName('webpage')[0].firstChild.data) + '/searchcom07-20';
					}
					else
					{
						url = unescape(response.getElementsByTagName('webpage')[0].firstChild.data);
					}
					
					menu_item.innerHTML = '<a href="' + url +'">' + '<img src="' + req.imgs_path + 'webpage.gif" border="0" class="zitgist_menu_img"  />' + 'web page</a>';
					req.element.	appendChild(menu_item);
				}	
				
				if(response.getElementsByTagName('rdfdocument')[0]) 
				{
					var menu_item = OAT.Dom.create("div",{},"zitgist_menu_item");
					menu_item.innerHTML = '<a href="http://browser.zitgist.com/?uri=' + response.getElementsByTagName('rdfdocument')[0].firstChild.data+'">' + '<img src="' + req.imgs_path + 'semanticpage.gif" border="0" class="zitgist_menu_img" />' + 'semantic page</a>';
					req.element.	appendChild(menu_item);
				}	
				
				var menu_separator = OAT.Dom.create("div",{},"zitgist_menu_separator");		
				req.element.appendChild(menu_separator);			
			}
		}
	}
}

function process_service_response_2() 
{
	if (req2.readyState == 4) 
	{
		window.status = '';
		
		if (req2.status == 200) 
		{
			req2.element.innerHTML = "";					

			if(req2.responseXML)
			{
				var response = req2.responseXML.documentElement;			
				
				for(var i = 0; i < response.getElementsByTagName('entity').length; i++)
				{
					if(response.getElementsByTagName('entity')[i]) 
					{
						var menu_item = OAT.Dom.create("div",{},"zitgist_menu_item");
						var entity = response.getElementsByTagName('entity')[i];
						
						var entity_type = extractTypeName(entity.attributes[2].nodeValue)
						var entity_img = req2.imgs_path;
						
						entity_img = entity_img + entity_type + ".gif";
						
						if(entity.attributes[3].nodeValue == "")
						{
							if(entity_type == "")
							{							
								menu_item.innerHTML = '<a href="http://browser.zitgist.com/?uri=' + escape(entity.attributes[0].nodeValue) + '&dataspace='+ escape(entity.attributes[1].nodeValue)  +'">' + '<img onerror="this.onerror=null; this.src=\'' + req2.imgs_path + 'undefined.gif\';" src="' + entity_img + '" border="0" class="zitgist_menu_img" />undefined</a>';
							}
							else
							{
								menu_item.innerHTML = '<a href="http://browser.zitgist.com/?uri=' + escape(entity.attributes[0].nodeValue) + '&dataspace='+ escape(entity.attributes[1].nodeValue)  +'">' + '<img onerror="this.onerror=null; this.src=\'' + req2.imgs_path + 'undefined.gif\';" src="' + entity_img + '" border="0" class="zitgist_menu_img" />' + entity_type + '</a>'				
							}
						}
						else
						{
							if(entity_type == "")
							{
								menu_item.innerHTML = '<a href="http://browser.zitgist.com/?uri=' + escape(entity.attributes[0].nodeValue) + '&dataspace='+ escape(entity.attributes[1].nodeValue)  +'">' + '<img onerror="this.onerror=null; this.src=\'' + req2.imgs_path + 'undefined.gif\';" src="' + entity_img + '" border="0" class="zitgist_menu_img" />' + entity.attributes[3].nodeValue + '</a>';
							}
							else
							{
								menu_item.innerHTML = '<a href="http://browser.zitgist.com/?uri=' + escape(entity.attributes[0].nodeValue) + '&dataspace='+ escape(entity.attributes[1].nodeValue)  +'">' + '<img onerror="this.onerror=null; this.src=\'' + req2.imgs_path + 'undefined.gif\';" src="' + entity_img + '" border="0" class="zitgist_menu_img" />' + entity.attributes[3].nodeValue + ' <em>(' + entity_type + ')</em></a>';								
							}
						}

						req2.element.appendChild(menu_item);
					}		
				}
			}
		}
	}
}


function extractTypeName(typeUri)
{
	if(typeUri.lastIndexOf('#') > 0)
	{
		return typeUri.substring(typeUri.lastIndexOf('#') + 1, typeUri.length).toLowerCase();
	}
	else
	{
		return typeUri.substring(typeUri.lastIndexOf('/') + 1, typeUri.length).toLowerCase();
	}
}

