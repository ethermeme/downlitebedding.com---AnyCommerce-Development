/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */



//    !!! ->   TODO: replace 'username' in the line below with the merchants username.     <- !!!

var store_downlite = function() {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

	vars : {},

	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				
				app.u.dump("Begin store_downlite.callbacks.init");
				app.templates.homepageTemplate.on('complete.downlite',function(infoObj){
					 app.ext.store_downlite.u.startHomepageSlideshow();
				 });
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {

			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
			loadBanners : function(){
				$.getJSON("_banners.json?_v="+(new Date()).getTime(), function(json){
					app.ext.store_downlite.vars.bannerJSON = json;
					}).fail(function(a,b,c){
						app.ext.store_downlite.vars.bannerJSON = {};
						app.u.dump("BANNERS FAILED TO LOAD");
						});
				},
			startHomepageSlideshow : function(attempts){
				app.u.dump("Begin startHomepageSlideshow function");
				attempts = attempts || 0;
				if(app.ext.store_downlite.vars.bannerJSON){
					app.u.dump("Banners.json detected. Continuing with adding slideshow");
					var $slideshow = $('#wideSlideshow');
					if($slideshow.hasClass('slideshowRendered')){
						//already rendered, do nothing.
						app.u.dump("Slideshow already rendered. Doing nothing.");
						}
					else {
						//app.u.dump(bannerJSON);
						for(var i=0; i < app.ext.store_downlite.vars.bannerJSON.slides.length; i++){
							app.u.dump("slide = " + i);
							var $banner = app.ext.store_downlite.u.makeBanner(app.ext.store_downlite.vars.bannerJSON.slides[i], 661, 432, "FFFFFF");
							$slideshow.append($banner);
							}
						$slideshow.addClass('slideshowRendered').cycle(app.ext.store_downlite.vars.bannerJSON.cycleOptions);
						$slideshow.cycle('next');
						$slideshow.cycle('prev');
						}
					}
				else {
					app.u.dump("Banners.json not detected. Looping function in .3 seconds.");
					setTimeout(function(){app.ext.store_downlite.u.startHomepageSlideshow();}, 250);
					}
				},
			makeBanner : function(bannerJSON, w, h, b){
				var $banner = $('<a></a>');
				
				var $img = $('<img />');
				var src = app.u.makeImage({
					w : w,
					h : h,
					b : b,
					name : bannerJSON.src,
					alt : bannerJSON.alt,
					title : bannerJSON.title
					});
					
				$img.attr('src',src);
				$banner.append($img);
				
				if(bannerJSON.prodLink){
					$banner.data("onClick", "appLink").attr("href","#!product?pid="+bannerJSON.prodLink);
					}
				else if(bannerJSON.catLink){
					$banner.data("onClick", "appLink").attr("href","#!category?navcat="+bannerJSON.catLink);
					}
				else if(bannerJSON.searchLink){
					$banner.data("onClick", "appLink").attr("href","#!category?KEYWORDS="+bannerJSON.searchLink);
					}
				else {
					//just a banner!
					}
				return $banner;
				}
			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}