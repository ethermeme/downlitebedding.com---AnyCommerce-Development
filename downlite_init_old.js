
myApp.rq.push(['script',0,(document.location.protocol == 'file:') ? myApp.vars.testURL+'jsonapi/config.js' : myApp.vars.baseURL+'jsonapi/config.js',function(){
//in some cases, such as the zoovy UI, zglobals may not be defined. If that's the case, certain vars, such as jqurl, must be passed in via P in initialize:
//	myApp.u.dump(" ->>>>>>>>>>>>>>>>>>>>>>>>>>>>> zGlobals is an object");
	myApp.vars.username = zGlobals.appSettings.username.toLowerCase(); //used w/ image URL's.
//need to make sure the secureURL ends in a / always. doesn't seem to always come in that way via zGlobals
	myApp.vars.secureURL = zGlobals.appSettings.https_app_url;
	myApp.vars.domain = zGlobals.appSettings.sdomain; //passed in ajax requests.
	myApp.vars.jqurl = (document.location.protocol === 'file:') ? myApp.vars.testURL+'jsonapi/' : '/jsonapi/';
}]); //The config.js is dynamically generated.
	
myApp.rq.push(['extension',0,'order_create','extensions/checkout/extension.js']);
myApp.rq.push(['extension',0,'cco','extensions/cart_checkout_order.js']);

//myApp.rq.push(['extension',0,'store_routing','extensions/store_routing.js']);

myApp.rq.push(['extension',0,'store_downlite','extensions/_store_downlite.js','init']);

myApp.rq.push(['extension',0,'store_prodlist','extensions/store_prodlist.js']);
myApp.rq.push(['extension',0,'store_navcats','extensions/store_navcats.js']);
myApp.rq.push(['extension',0,'store_search','extensions/store_search.js']);
myApp.rq.push(['extension',0,'store_product','extensions/store_product.js']);
myApp.rq.push(['extension',0,'cart_message','extensions/cart_message/extension.js']);
myApp.rq.push(['extension',0,'store_crm','extensions/store_crm.js']);
myApp.rq.push(['extension',0,'myRIA','app-quickstart.js','startMyProgram']);
//myApp.rq.push(['extension',0,'entomologist','extensions/entomologist/extension.js']);
//myApp.rq.push(['extension',0,'tools_animation','extensions/tools_animation.js']);

myApp.rq.push(['extension',0,'tracking_hubspot','extensions/tracking_hubspot.js','startExtension']);

//myApp.rq.push(['extension',1,'google_analytics','extensions/partner_google_analytics.js','startExtension']);
//myApp.rq.push(['extension',1,'tools_ab_testing','extensions/tools_ab_testing.js']);
//myApp.rq.push(['extension',0,'partner_addthis','extensions/partner_addthis.js']);
//myApp.rq.push(['extension',1,'resellerratings_survey','extensions/partner_buysafe_guarantee.js','startExtension']); /// !!! needs testing.
//myApp.rq.push(['extension',1,'buysafe_guarantee','extensions/partner_buysafe_guarantee.js','startExtension']);
//myApp.rq.push(['extension',1,'powerReviews_reviews','extensions/partner_powerreviews_reviews.js','startExtension']);
//myApp.rq.push(['extension',0,'magicToolBox_mzp','extensions/partner_magictoolbox_mzp.js','startExtension']); // (not working yet - ticket in to MTB)
myApp.rq.push(['extension',0,'google_dynamicremarketing','extensions/partner_google_dynamicremarketing.js']); 
myApp.rq.push(['extension',0,'prodlist_infinite','extensions/prodlist_infinite.js']);
myApp.rq.push(['extension',0,'_store_filter','extensions/_store_filter.js']);
//

//myApp.rq.push(['script',0,(document.location.protocol == 'file:') ? myApp.vars.testURL+'jsonapi/config.js' : myApp.vars.baseURL+'jsonapi/config.js']); //The config.js is dynamically generated.
//myApp.rq.push(['script',0,myApp.vars.baseURL+'model.js']); //'validator':function(){return (typeof zModel == 'function') ? true : false;}}
//myApp.rq.push(['script',0,myApp.vars.baseURL+'includes.js']); //','validator':function(){return (typeof handlePogs == 'function') ? true : false;}})

//myApp.rq.push(['script',0,myApp.vars.baseURL+'controller.js']);

myApp.rq.push(['script',0,'jquery-cycle2/jquery.cycle2.min.js']);

myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.showloading-v1.0.jt.js']); //used pretty early in process..
myApp.rq.push(['script',0,myApp.vars.baseURL+'resources/jquery.ui.anyplugins.js']); //in zero pass in case product page is first page.
myApp.rq.push(['css',1,myApp.vars.baseURL+'resources/anyplugins.css']);




//add tabs to product data.
//tabs are handled this way because jquery UI tabs REALLY wants an id and this ensures unique id's between product
/*
myApp.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	var $context = $(myApp.u.jqSelector('#',P.parentID));
	var $tabContainer = $( ".tabbedProductContent",$context);
		if($tabContainer.length)	{
			if($tabContainer.data("widget") == 'anytabs'){} //tabs have already been instantiated. no need to be redundant.
			else	{
				$tabContainer.anytabs();
				}
			}
		else	{} //couldn't find the tab to tabificate.
	}]);
*/

//sample of an onDeparts. executed any time a user leaves this page/template type.
//myApp.rq.push(['templateFunction','homepageTemplate','onDeparts',function(P) {myApp.u.dump("just left the homepage")}]);
/*
myApp.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
	if(myApp.data.cartDetail && myApp.data.cartDetail.ship && myApp.data.cartDetail.ship.postal)	{
		myApp.ext.myRIA.u.fetchTimeInTransit($(myApp.u.jqSelector('#',P.parentID)),new Array(P.pid));
		}
	}]);
*/

myApp.rq.push(['templateFunction','categoryTemplate','onCompletes',function(P) {
	var $context = $(myApp.u.jqSelector('#',P.parentID));
	//**COMMENT TO REMOVE AUTO-RESETTING WHEN LEAVING CAT PAGE FOR FILTERED SEARCH**
	
	myApp.ext._store_filter.vars.catPageID = $(myApp.u.jqSelector('#',P.parentID));  
	
	myApp.u.dump("BEGIN categoryTemplate onCompletes for filtering");
	if(myApp.ext._store_filter.filterMap[P.navcat])	{
		myApp.u.dump(" -> safe id DOES have a filter.");

		var $page = $(myApp.u.jqSelector('#',P.parentID));
		myApp.u.dump(" -> $page.length: "+$page.length);
		if($page.data('filterAdded'))	{} //filter is already added, don't add again.
		else	{
			$page.data('filterAdded',true)
			var $form = $("[name='"+myApp.ext._store_filter.filterMap[P.navcat].filter+"']",'#appFilters').clone().appendTo($('.catProdListSidebar',$page));
			$form.on('submit.filterSearch',function(event){
				event.preventDefault()
				myApp.u.dump(" -> Filter form submitted.");
				myApp.ext._store_filter.a.execFilter($form,$page);
				});
	
			if(typeof myApp.ext._store_filter.filterMap[P.navcat].exec == 'function')	{
				myApp.ext._store_filter.filterMap[P.navcat].exec($form,P)
				}
	
	//make all the checkboxes auto-submit the form and show results list.
			$(":checkbox",$context).off('click.formSubmit').on('click.formSubmit',function() {
				$form.submit(); 
				//myApp.u.dump("A filter checkbox was clicked.");
				$("#resultsProductListContainer",$context).hide();  
				
				$group1 = $('.fsCheckbox',$context);
				
				if(($group1.filter(':checked').length === 0) && ($(".sliderValue",$context).val() == "$0 - $1000")){
					//myApp.u.dump("All checkboxes removed. Showing stock product list.");
					$(".nativeProductList", $context).show(); 
					$(".searchFilterResults", $context).hide(); 
				}
				else{
					//myApp.u.dump("Checkbox is active. Showing Search results.");
					$(".nativeProductList", $context).hide(); 
					$(".searchFilterResults", $context).show();  
				}  
			});
			
			//myApp.u.dump($(".sliderValue",$context));
		}
	}
		
				
			
		
		$('.resetButton', $context).click(function(){
			$('.fsCheckbox').attr('checked', false);
			$(".nativeProductList").show(); 
			$(".searchFilterResults").hide();    
		});
		
		//**ADD ID/FOR VALUES FOR CHECKBOX VISUAL MODIFIER**
		/*
		$('.filterCB', $context).each(function() {
			$(this).attr('id', 'filterCB'+filterIDNum);
			filterIDNum += 1;
		});
		$('.break', $context).each(function() {
			$(this).attr('for', 'filterCB'+filterForNum);
			filterForNum += 1;
		});
		*/
		
		
}]);




//Cart Messaging Responses.

myApp.cmr.push(['chat.join',function(message){
	var $ui = myApp.ext.myRIA.a.showBuyerCMUI();
	$("[data-app-role='messageInput']",$ui).show();
	$("[data-app-role='messageHistory']",$ui).append("<p class='chat_join'>"+message.FROM+" has joined the chat.<\/p>");
	$('.show4ActiveChat',$ui).show();
	$('.hide4ActiveChat',$ui).hide();
	}]);

myApp.cmr.push(['goto',function(message,$context){
	var $history = $("[data-app-role='messageHistory']",$context);
	$P = $("<P>")
		.addClass('chat_post')
		.append("<span class='from'>"+message.FROM+"<\/span> has sent over a "+(message.vars.pageType || "")+" link for you within this store. <span class='lookLikeLink'>Click here<\/span> to view.")
		.on('click',function(){
			showContent(myApp.ext.myRIA.u.whatAmIFor(message.vars),message.vars);
			});
	$history.append($P);
	$history.parent().scrollTop($history.height());
	}]);


//gets executed from app-admin.html as part of controller init process.
//progress is an object that will get updated as the resources load.
/*
'passZeroResourcesLength' : [INT],
'passZeroResourcesLoaded' : [INT],
'passZeroTimeout' : null //the timeout instance running within loadResources that updates this object. it will run indef unless clearTimeout run here OR all resources are loaded.

*/
myApp.u.showProgress = function(progress)	{
	function showProgress(attempt)	{
		if(progress.passZeroResourcesLength == progress.passZeroResourcesLoaded)	{
			//All pass zero resources have loaded.
			//the app will handle hiding the loading screen.
			}
else if(attempt > 150)	{
			//hhhhmmm.... something must have gone wrong.
			clearTimeout(progress.passZeroTimeout); //end the resource loading timeout.
			}
		else	{
			var percentPerInclude = (100 / progress.passZeroResourcesLength);
			var percentComplete = Math.round(progress.passZeroResourcesLength * percentPerInclude); //used to sum how many includes have successfully loaded.
//			dump(" -> percentPerInclude: "+percentPerInclude+" and percentComplete: "+percentComplete);
			$('#appPreViewProgressBar').val(percentComplete);
			$('#appPreViewProgressText').empty().append(percentComplete+"% Complete");
			attempt++;
			setTimeout(function(){showProgress(attempt);},250);
			}
		}
	showProgress(0)
	}
	myApp.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
		
	}]);
		
/*
app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
		var $target=$('#wideSlideshow');
		if(!$target.hasClass('slideshow')){		
			$target.addClass('slideshow');
	//		$target.cycle({fx:'fade',speed:'slow',timeout:5000,pager:'#slideshowNav',pagerAnchorBuilder:function(index,el){return'<a href="#"> </a>';},slideExpr:'li'});	
			$target.cycle({fx:'fade',speed:'slow',timeout:5000,pager:'#slideshowNav',pagerAnchorBuilder:function(index,el){return'<a href="#">'+(index+1)+'</a>';}});
			}
		}]);
*/

//Any code that needs to be executed after the app init has occured can go here.
//will pass in the page info object. (pageType, templateID, pid/navcat/show and more)
myApp.u.appInitComplete = function(P)	{
	myApp.u.dump("Executing myAppIsLoaded code...");
	
	myApp.ext.order_create.checkoutCompletes.push(function(vars,$checkout){
//append this to 
		$("[data-app-role='thirdPartyContainer']",$checkout).append("<h2>What next?</h2><div class='ocm ocmFacebookComment pointer zlink marginBottom checkoutSprite  '></div><div class='ocm ocmTwitterComment pointer zlink marginBottom checkoutSprit ' ></div><div class='ocm ocmContinue pointer zlink marginBottom checkoutSprite'></div>");
		$('.ocmTwitterComment',$checkout).click(function(){
			window.open('http://twitter.com/home?status='+cartContentsAsLinks,'twitter');
			_gaq.push(['_trackEvent','Checkout','User Event','Tweeted about order']);
			});
		//the fb code only works if an appID is set, so don't show banner if not present.				
		if(myApp.u.thisNestedExists("zGlobals.thirdParty.facebook.appId") && typeof FB == 'object')	{
			$('.ocmFacebookComment',$checkout).click(function(){
				myApp.ext.myRIA.thirdParty.fb.postToWall(cartContentsAsLinks);
				_gaq.push(['_trackEvent','Checkout','User Event','FB message about order']);
				});
			}
		else	{$('.ocmFacebookComment').hide()}
		})

//Go get the brands and display them.	
	myApp.ext.store_navcats.calls.appCategoryList.init('.brands',{'callback':'getChildData','extension':'store_navcats','parentID':'brandCategories','templateID':'categoryListTemplateThumb'},'passive');
	myApp.model.dispatchThis('passive'); //use passive or going into checkout could cause request to get muted.		
//Adding category nav tabs
	myApp.ext.myRIA.renderFormats.simpleSubcats = function($tag,data)	{
	//app.u.dump("BEGIN control.renderFormats.subcats");
	var L = data.value.length;
	var thisCatSafeID; //used in the loop below to store the cat id during each iteration
	//app.u.dump(data);
	for(var i = 0; i < L; i += 1)	{
		thisCatSafeID = data.value[i].id;
		if(data.value[i].pretty.charAt(0) == '!')	{
			//categories that start with ! are 'hidden' and should not be displayed.
			}
		else	{
			$tag.append(myApp.renderFunctions.transmogrify({'id':thisCatSafeID,'catsafeid':thisCatSafeID},data.bindData.loadsTemplate,data.value[i]));
			}
		}
			} //simpleSubcats
// Homepage Slideshow
//	myApp.ext.myRIA.template.homepageTemplate.onCompletes.push(function(){
//		$('#wideSlideshow').cycle({
//			fx:     'fade',
//			speed:  'slow',
//			timeout: 5000,
//			pager:  '#slideshowNav',
//			slideExpr: 'li'
//			});
//		}) //homepageTemplate.onCompletes
	
		
		
// add link, css, etc to hotel finder.
// FOR 201248 UPGRADE CLIENT ASKED THAT LINK GO TO HOTELS CAT PAGE NOT MODAL
//	$('.hotelFinder').removeClass('disabled').addClass('pointer').click(function () {
//		$('#hotelListContainer').dialog({
//			'autoOpen':false,
//			'width':'60%',
//			'modal':'true',
//			'height':'500'
//			});
//		$('#hotelListContainer').dialog('open');
	//only render the menu the first time the modal is opened. saves cycles and eliminates duplicates appearing
//		if($('#hotelListContainerUL > li').length < 1)	{
//			myApp.renderFunctions.translateSelector('#hotelListContainer',myApp.data['appCategoryDetail|.hotels']);
//			}
//		});
	//addthis code for productTemplate - replaced by partner_addthis extension
//	myApp.rq.push(['templateFunction','productTemplate','onCompletes',function(P) {
//	var url = zGlobals.appSettings.http_app_url+"product/"+P.pid+"/";
	//update the openGraph and meta content. mostly for social/addThis.
//	$('#ogTitle').attr('content',myApp.data[P.datapointer]['%attribs']['zoovy:prod_name']);
//	$('#ogImage').attr('content',myApp.u.makeImage({"name":myApp.data[P.datapointer]['%attribs']['zoovy:prod_image1'],"w":150,"h":150,"b":"FFFFFF","tag":0}));
//	$('#ogDescription, #metaDescription').attr('content',myApp.data[P.datapointer]['%attribs']['zoovy:prod_desc']);
//			addthis.toolbox('#socialLinks');
//	if(typeof addthis == 'object' && addthis.update)	{
//		addthis.update('share','url',url);
//		$("#socialLinks .addthis_button_facebook_like").attr("fb:like:href",url);
//		$("#socialLinks .addthis_button_pinterest_pinit").attr({"pi:pinit:media":myApp.u.makeImage({"h":"300","w":"300","b":"ffffff","name":myApp.data['appProductGet|'+P.pid]['%attribs']['zoovy:prod_image1'],"tag":0}),"pi:pinit:url":url});	
//		}

//		}]); //addThis productTemplate code		
}


//myApp.rq.push(['templateFunction','homepageTemplate','onCompletes',function(P) {
//	var $target=$('#wideSlideshow');
//	$target.cycle({fx:'fade',speed:'slow',timeout:5000,pager:'#slideshowNav',pagerAnchorBuilder:function(index,el){return'<a href="#"> </a>';},slideExpr:'li'});	
//	}]);

//don't execute script till both jquery AND the dom are ready.
	$(document).ready(function(){
		myApp.u.handleRQ(0);
		//instantiate wiki parser.
	myCreole = new Parse.Simple.Creole(); //needs to happen before controller is instantiated.
		
		//Offer a mobile redirect
		var uagent = navigator.userAgent.toLowerCase();
		var promptmobile = false;
		if (promptmobile ||
			uagent.search("ipad") > -1 ||
			uagent.search("iphone") > -1 ||
			uagent.search("ipod") > -1 ||
			uagent.search("android") > -1 ||
			(uagent.search("webkit") > -1 && (uagent.search("series60") > -1 || uagent.search("symbian") > -1)) ||
			uagent.search("windows ce") > -1 ||
			uagent.search("palm") > -1 ){
			
			var $popup = $("<div><h3>It appears you are using a mobile device, would you like to use our mobile site?</h3><button class='yesbtn floatLeft'>Yes</button><button class='nobtn floatRight'>No</button></div>");
			$('.yesbtn', $popup).on('click', function(){
				window.location = "http://m.downlitebedding.com";
				});
			$('.nobtn', $popup).on('click', function(){
				$popup.dialog('close');
				});
			$popup.dialog({
				'title':'',
				'dialogClass' : 'hideTitleBarAndClose',
				'noCloseModal' : true,
				'modal' : true
			});
		}
	//if you wish to add init, complete or depart events to your templates w/ JS, this is a good place to do it.
	// ex:  $("#productTemplate").on('complete.someIndicator',function($ele,infoObj){doSomethingWonderful();})

	});

