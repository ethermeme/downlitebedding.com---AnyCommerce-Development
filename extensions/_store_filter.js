/* **************************************************************

   Copyright 2011 Zoovy, Inc.

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

/*
An extension for acquiring and displaying 'lists' of categories.
The functions here are designed to work with 'reasonable' size lists of categories.
*/


var _store_filter = function(_app) {
	var r = {
		
	vars : {
		catPageID: "",
		'templates' : []
		},

					////////////////////////////////////   CALLS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\		


//store_search contains the maintained elastic query search. use that.
	calls : {}, //calls
//key is safe id. value is name of the filter form.
	filterMap : {
		/*
		"searchPage":{
		"filter": "SearchPageFilterSearchForm",
		"exec" : function($form,infoObj){_app.ext._store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:2000});}
		},
		*/
		//HOTEL FINDER
			".hotels":{
			"filter": "hotelFinderFilterForm",
			"exec" : function($form,infoObj){_app.ext._store_filter.u.renderSlider($form, infoObj, {MIN:0,MAX:10000});}
			},
			
			
			
		},

					////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//callbacks.init need to return either a true or a false, depending on whether or not the file will execute properly based on store account configuration. Use this for any config or dependencies that need to occur.
//the callback is auto-executed as part of the extensions loading process.
		init : {
			onSuccess : function()	{
//				_app.u.dump('BEGIN _app.ext.store_navcats.init.onSuccess ');
				var r = true; //return false if extension won't load for some reason (account config, dependencies, etc).
				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
				}
			},
			
		startExtension : {
			onSuccess : function()	{
				_app.u.dump('BEGIN _app.ext._store_filter.startExtension.onSuccess ');
				_app.templates.categoryTemplate.on('complete',function(event, $context, infoObj){
					//var $context = $(_app.u.jqSelector('#',infoObj.parentID));
					//**COMMENT TO REMOVE AUTO-RESETTING WHEN LEAVING CAT PAGE FOR FILTERED SEARCH**
					
					_app.ext._store_filter.vars.catPageID = $context;
					
					//_app.u.dump($context);
					//_app.u.dump(infoObj);  
					
					_app.u.dump("BEGIN categoryTemplate onCompletes for filtering");
					if(_app.ext._store_filter.filterMap[infoObj.navcat])	{
						_app.u.dump(" -> safe id DOES have a filter.");
				
						var $page = $(_app.u.jqSelector('#',infoObj.parentID));
						_app.u.dump(" -> $page.length: "+$page.length);
						if($page.data('filterAdded'))	{} //filter is already added, don't add again.
						else	{
							$page.data('filterAdded',true)
							var $form = $("[name='"+_app.ext._store_filter.filterMap[infoObj.navcat].filter+"']",'#appFilters').clone().appendTo($('.catProdListSidebar',$page));
							$form.on('submit.filterSearch',function(event){
								event.preventDefault()
								_app.u.dump(" -> Filter form submitted.");
								_app.ext._store_filter.a.execFilter($form,$page);
								});
					
							if(typeof _app.ext._store_filter.filterMap[infoObj.navcat].exec == 'function')	{
								_app.ext._store_filter.filterMap[infoObj.navcat].exec($form,infoObj)
								}
					
					//make all the checkboxes auto-submit the form and show results list.
							$(":checkbox",$context).off('click.formSubmit').on('click.formSubmit',function() {
								$form.submit(); 
								//_app.u.dump("A filter checkbox was clicked.");
								$("#resultsProductListContainer",$context).hide();  
								
								$group1 = $('.fsCheckbox',$context);
								
								if(($group1.filter(':checked').length === 0) && ($(".sliderValue",$context).val() == "$0 - $1000")){
									//_app.u.dump("All checkboxes removed. Showing stock product list.");
									$(".nativeProductList", $context).show(); 
									$(".searchFilterResults", $context).hide(); 
								}
								else{
									//_app.u.dump("Checkbox is active. Showing Search results.");
									$(".nativeProductList", $context).hide(); 
									$(".searchFilterResults", $context).show();  
								}  
							});
							
							//_app.u.dump($(".sliderValue",$context));
						}
					}
						
								
							
						
						$('.resetButton', $context).click(function(){
							$('.fsCheckbox', $context).attr('checked', false);
							//dump("$('.ui-slider-range', $context).val() = " + $('.ui-slider-range', $context).val());
							//$('.sliderValue', $context).val() = "$0 - $1000";
							$(".nativeProductList",$context).show(); 
							$(".searchFilterResults",$context).hide();
							setTimeout(function(){$(".categoryList",$context).show();},150); 
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
						
						
				});
				var r = true; //return false if extension won't load for some reason (account config, dependencies, etc).
				return r;
			},
			onError : function()	{
				dump("filter startExtension failed.");
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
			}
		}

	}, //callbacks


////////////////////////////////////   getFilterObj    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		getElasticFilter : {
			
			slider : function($fieldset){
				var r = false; //what is returned. Will be set to an object if valid.
				var $slider = $('.slider-range',$fieldset);
				if($slider.length > 0)	{
					r = {"range":{}}
//if data-min and/or data-max are not set, use the sliders min/max value, respectively.
					r.range[$fieldset.attr('data-elastic-key')] = {
						"from" : $slider.slider('values', 0 ) * 100,
						"to" : $slider.slider("values",1) * 100
						}
					}
				else	{
					_app.u.dump("WARNING! could not detect .ui-slider class within fieldset for slider filter.");
					}
				return r;
				}, //slider
			hidden : function($fieldset){
				return _app.ext._store_filter.u.buildElasticTerms($("input:hidden",$fieldset),$fieldset.attr('data-elastic-key'));
				},
			hiddenOr : function($fieldset){
				var r = {"or":[]};
				$("input:hidden",$fieldset).each(function(){
					r.or.push(_app.ext._store_filter.u.buildElasticTerms($(this),$fieldset.attr('data-elastic-key')));
					});
				return r;
				},
			checkboxes : function($fieldset)	{
				return _app.ext._store_filter.u.buildElasticTerms($(':checked',$fieldset),$fieldset.attr('data-elastic-key'));
				} //checkboxes
			
			}, //getFilterObj




////////////////////////////////////   Actions    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		a : {
			
			execFilter : function($form,$page){

_app.u.dump("BEGIN store_filter.a.filter");
var $prodlist = $("[data-app-role='productList']",$page).first().empty();


$('.categoryList',$page).hide(); //hide any subcategory lists in the main area so customer can focus on results
$('.categoryText',$page).hide(); //hide any text blocks.

if(_app.ext._store_filter.u.validateFilterProperties($form))	{
//	_app.u.dump(" -> validated Filter Properties.")
	var query = {
		"mode":"elastic-native",
		"size":50,
		"filter" : _app.ext._store_filter.u.buildElasticFilters($form),
		}//query
//	_app.u.dump(" -> Query: "); _app.u.dump(query);
	if(query.filter.and.length > 0)	{
		$prodlist.addClass('loadingBG');
		_app.ext.store_search.calls.appPublicProductSearch.init(query,{'callback':function(rd){

			if(_app.model.responseHasErrors(rd)){
				$page.anymessage({'message':rd});
				}
			else	{
				var L = _app.data[rd.datapointer]['_count'];
				$prodlist.removeClass('loadingBG')
				if(L == 0)	{
					$page.anymessage({"message":"Your query returned zero results."});
					}
				else	{
					$prodlist.append(_app.ext.store_search.u.getElasticResultsAsJQObject(rd));
					}
				}
			
			},'datapointer':'appPublicSearch|elasticFiltering',
			'templateID': $form.data('loadstemplate') || 'productListHotelFilteredSearch'
			});
			_app.u.dump(JSON.stringify(query));
		_app.model.dispatchThis();
		}
	else	{
		$page.anymessage({'message':"Please make some selections from the list of filters"});
		}
	}
else	{
	$page.anymessage({"message":"Uh Oh! It seems an error occured. Please try again or contact the site administator if error persists."});
	}
$('html, body').animate({scrollTop : 850},0); //new page content loading. scroll to top.

				
				},//filter
				
				
				showFilterResultsOnPriceChange : function($context){
					//Make all altering of the price slider submit the form and show results list.
						$context.submit(); 
						//app.u.dump("The price slider was moved.");
						$("#resultsProductListContainer",$context).hide();  
		
						$group1 = $('.fsCheckbox',$context);
						$priceGroup = $( ".sliderValue",$context ).val().toString();
						
						if($(".sliderValue",$context).val() == "$0 - $1000"){
							//app.u.dump("Price slider is set to stock. Checking For filter options being checked.");
							if($group1.filter(':checked').length === 0){
								//app.u.dump("No filter options checked. Showing stock product list.");
								$(".nativeProductList", ($context.parent().parent().parent())).show(); 
								$(".searchFilterResults", ($context.parent().parent().parent())).hide(); 
							}
							else{
								//app.u.dump("One or more filter options were checked. Still showing filter search results.");
							}
						}
						else{
							//app.u.dump("Price slider is set to custom value. Showing Search results.");
							$(".nativeProductList", ($context.parent().parent().parent())).hide(); 
							$(".searchFilterResults", ($context.parent().parent().parent())).show();  
						}  
				},
				
				
				filterSelected : function(checkbox,$context){
					//dump(checkbox);
					//dump($context);
					$("input.fsCheckbox", $context).removeClass("fsCBSelected");
					$(checkbox).addClass("fsCBSelected");
					$("input.fsCheckbox:not(input.fsCBSelected)", $context).attr('checked', false);
				},
				
				
				hotelTypeSelected : function(radioButton,$context){
					var hotelType = $(radioButton, $context).val();
					dump(hotelType);
					switch(hotelType){
						case "natChainHotel":
							$(".filterCat", $context).hide();
							$(".filterNatHotelCat", $context).slideDown(1000);
						break;
						case "luxResortHotel":
							$(".filterCat", $context).hide();
							$(".filterLuxResortCat", $context).slideDown(1000);
						break;
						case "luxHotel":
							$(".filterCat", $context).hide();
							$(".filterluxHotelCat", $context).slideDown(1000);
						break;
						case "boutHotel":
							$(".filterCat", $context).hide();
							$(".filterBoutHotelCat", $context).slideDown(1000);
						break;
						case "cruiseLine":
							$(".filterCat", $context).hide();
							$(".filterCruiseLineCat", $context).slideDown(1000);
						break;
						case "bnb":
							$(".filterCat", $context).hide();
							$(".filterBNBCat", $context).slideDown(1000);
						break;
						case "lasVegasHotel":
							$(".filterCat", $context).hide();
							$(".filterLasVegasHotelCat", $context).slideDown(1000);
						break;
						case "casinoHotel":
							$(".filterCat", $context).hide();
							$(".filterCasinoHotelCat", $context).slideDown(1000);
						break;
						case "golfResort":
							$(".filterCat", $context).hide();
							$(".filterGolfResortCat", $context).slideDown(1000);
						break;
						case "beachHotel":
							$(".filterCat", $context).hide();
							$(".filterBeachHotelCat", $context).slideDown(1000);
						break;
						case "confCenterHotel":
							$(".filterCat", $context).hide();
							$(".filterConfCenterHotelCat", $context).slideDown(1000);
						break;
						case "nycHotel":
							$(".filterCat", $context).hide();
							$(".filterNYCHotelCat", $context).slideDown(1000);
						break;
					}
				}
				
			
			}, //actions


////////////////////////////////////   UTIL    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


		u : {
//pass in form as object.  This function will verify that each fieldset has the appropriate attributes.
//will also verify that each filterType has a getElasticFilter function.
			validateFilterProperties : function($form)	{
				var r = true, //what is returned. false if form doesn't validate.
				$fieldset, filterType; //recycled.

				$('fieldset',$form).each(function(index){
					$fieldset = $(this);
					filterType = $fieldset.attr('data-filtertype');
					if(!filterType)	{
						r = false;
						$form.anymessage({"message":"In _store_filters.u.validateFilterProperties,  no data-filtertype set on fieldset. can't include as part of query. [index: "+index+"]",gMessage:true});
						}
					else if(typeof _app.ext._store_filter.getElasticFilter[filterType] != 'function')	{
						r = false;
						$form.anymessage({"message":"WARNING! type ["+filterType+"] has no matching getElasticFilter function. [typoof: "+typeof _app.ext._store_filter.getElasticFilter[filterType]+"]",gMessage:true});
						}
					else if(!$fieldset.attr('data-elastic-key'))	{
						r = false;
						$form.anymessage({"message":"WARNING! data-elastic-key not set for filter. [index: "+index+"]",gMessage:true});
						}
					else	{
						//catch.
						}
					});
				return r;
				},
			
			
			buildElasticFilters : function($form)	{

var filters = {
	"and" : [] //push on to this the values from each fieldset.
	}//query


$('fieldset',$form).each(function(){
	var $fieldset = $(this),
	filter = _app.ext._store_filter.getElasticFilter[$fieldset.attr('data-filtertype')]($fieldset);
	if(filter)	{
		filters.and.push(filter);
		}
	});

	filters.and.push({'not':{'term':{'prod_outofstock':'1'}}});

//and requires at least 2 inputs, so add a match_all.
//if there are no filters, don't add it. the return is also used to determine if any filters are present
 	if(filters.and.length == 1)	{
		filters.and.push({match_all:{}})
 		}
		_app.u.dump("$( '.sliderValue',$form ).val() = " + $( ".sliderValue",$form ).val())

return filters;				
				
				},

//pass in a jquery object or series of objects for form inputs (ex: $('input:hidden')) and a single term or a terms object will be returned.
//false is returned in nothing is checked/selected.
//can be used on a series of inputs, such as hidden or checkbox 
			buildElasticTerms : function($obj,attr)	{
				var r = false; //what is returned. will be term or terms object if valid.
				if($obj.length == 1)	{
					r = {term:{}};
					r.term[attr] = $obj.val().toLowerCase();
					}
				else if($obj.length > 1)	{
					r = {terms:{}};
					r.terms[attr] = new Array();
					$obj.each(function(){
						r.terms[attr].push($(this).val().toLowerCase());
						});
					}
				else	{
					//nothing is checked.
					}
				return r;
				},


			renderSlider : function($form, infoObj, props){
				$( ".slider-range" ).slider({
					range: true,
					min: props.MIN,
					max: props.MAX,
					values: [ props.MIN, props.MAX ],
					stop : function(){
						_app.ext._store_filter.a.showFilterResultsOnPriceChange($form);
						},
					slide: function( event, ui ) {
						$( ".sliderValue",$form ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
						}
					});
				$( ".sliderValue",$form ).val( "$" + $( ".slider-range" ).slider( "values", 0 ) + " - $" + $( ".slider-range" ).slider( "values", 1 ) );
				} //renderSlider

			} //u


		
		} //r object.
	return r;
	}