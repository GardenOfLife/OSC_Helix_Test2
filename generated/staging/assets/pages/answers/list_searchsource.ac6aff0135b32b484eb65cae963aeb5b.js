
(function(){function r(f){function h(a,b){b=b?RightNow.Url.convertToSegment(RightNow.Url.convertToArray(1,b)):"";d.add({state:a},{url:p.getCurrentPage()+b})}function k(a){return function(){g||a.apply(this,arguments)}}var c={},e={},a={},b="",g=!1,d=new f.HistoryHTML5;d.on("change",function(a){var b;a.src===f.HistoryHTML5.SRC_POPSTATE&&(a=a.changed.state||a.changed[RightNow.Event.browserHistoryManagementKey],b=m.get(),g=!0,a?f.Object.each(a.newVal,function(a){q.ajaxCallback(a.response,a.data)}):f.Object.each(b,function(a){a.fire("reset").fire("send")}),g=!1)});return{enabled:!0,setCache:function(a,b,g){c[a]||(c[a]={});c[a][b]=g},checkCache:function(a,b){return c[a]?c[a][b]:null},restoreCache:k(function(c){if(f.Object.isEmpty(e)){var g=Object.keys(a)[0];g&&a[g]&&(a={newTransactionID:c});h(a,b+=c.friendly)}b=""}),addRequest:k(function(c,g){f.Object.isEmpty(e)&&(q.searchesPerformed++,a={},b="");e[g]=c}),addResponse:k(function(c,g){var d=e[g];if(d){var k=b+=d.friendly,d=f.merge(d,c);a[g]=d;delete e[g];f.Object.isEmpty(e)&&h(a,k)}}),clearCache:function(a){c[a]=null},doesCacheExist:function(a){return c[a]?!0:!1}}}var l,q,p,m;"pushState"in window.history?YUI().use("history-html5",function(f){l=r(f)}):l={enabled:!1};q=function(){function f(a,b,c){var d="undefined"===typeof c;a&&!d&&l.addResponse({response:a,data:b},c);l.setCache(b.searchSource,b.cacheKey,a);c=m.get(b.searchSource);d&&(c.once("send",function(){return!1}).fire("send",b.allFilters),a.fromHistoryManager=!0);c.fire("response",new RightNow.Event.EventObject(null,{data:a,filters:b.allFilters}))}function h(a,b,c,d){a=RightNow.Ajax.makeRequest(a,b,{successHandler:f,failureHandler:function(a){var b=RightNow.Interface.getMessage("THERE_PROB_REQ_ACTION_COULD_COMPLETED_MSG");403===a.status&&void 0!==a.responseText&&(b=a.responseText);RightNow.UI.Dialog.messageDialog(b,{icon:"WARN",exitCallback:function(){window.location.reload(!0)}})},json:!0,data:c,timeout:1E4});l.addRequest(d,a.id+"")}function k(a,b,c,d){var f=["keyword"].concat(a.filters||[]),s=f.length,h,k,l={};c=RightNow.Lang.cloneObject(c);a.params&&(c=e.mix(c,a.params));if(b&&b.allFilters)for(a=0;a<s;a++)h=f[a],(k=b.allFilters[h])&&k.filters&&k.filters.data&&!c[h]&&("keyword"!==h||d||(h="kw"),l[h]=c[h]=k.filters.data);c.page&&!l.page&&(l.page=c.page);return{filtersToInclude:l,params:c}}function c(a,b){b&&1!==b||(a=RightNow.Url.addParameter(a,"search","1"));return a}var e=YUI();return{searchesPerformed:0,go:function(a,b,g,d,e){if("report"===d.type){if("undefined"===typeof b)throw Error("No search filters have been defined for report "+d.id);RightNow.Event.fire("evt_searchRequest",new RightNow.Event.EventObject(this,{filters:b}));if(!l.enabled||!0===a.newPage||a.reportPage&&!RightNow.Url.isSameUrl(a.reportPage))if(g=RightNow.Url,d=a.reportPage||p.getCurrentPage(),e=a.target||"_self",!a.page&&b.allFilters.page&&(a.page=1,b.allFilters.page=1),d=g.convertSearchFiltersToParms(d,b.allFilters,0),d=g.addParameter(d,"session",g.getSession()),d=c(d,b.allFilters.page),a.popupWindow){b=window.screenX||window.screenLeft;g=window.screenY||window.screenTop;var f;f=b+document.body.clientWidth;e=screen.width*a.width/100;a=screen.height*a.height/100;f=b>screen.width-f?b-e-15:f+15;var n=window.screenY?window.screenY:window.screenTop;0>f&&(f=b+100);0>n&&(n=g+100);window.open(d,"_blank","scrollbars=1,resizable=1,left="+f+",top="+n+",width="+e+"px,height="+a+"px")}else window.open(d,e);else a.page?delete b.allFilters.search:b.allFilters.page=1,a=d.id,d=d.type+d.id,g=p.buildReportRequestParameters(a,b.allFilters,b.format,b.token,0),e=RightNow.Url.convertSearchFiltersToParms("",b.allFilters,""),f=g.sf,1===f.page&&(f.search=1),f=RightNow.JSON.stringify(f),n=l.checkCache(d,f),e={friendly:e,response:n,data:{allFilters:b,cacheKey:f,key:d}},n?(l.restoreCache(e),m.get(d).fire("response",new RightNow.Event.EventObject(null,{data:n,filters:b}))):h("/ci/ajaxRequest/getReportData",{filters:f,report_id:a,r_tok:g.token,format:RightNow.JSON.stringify(g.fmt)},{searchSource:d,allFilters:b,cacheKey:f},e)}else if(g&&"object"===typeof g&&d.id)if(RightNow.Event.fire("evt_searchRequest",new RightNow.Event.EventObject(this,{filters:b})),l.enabled&&!0!==a.newPage){a=e.endpoint;b=k(e,b,g,!0);g=b.filtersToInclude;b=b.params;if(!a)throw Error("An endpoint hasn't been specified");d=d.type+d.id;e=RightNow.JSON.stringify(b);f=l.checkCache(d,e);g={key:d,friendly:RightNow.Url.convertToSegment(g)};f?(l.restoreCache(g),m.get(d).fire("response",new RightNow.Event.EventObject(null,{data:f,filters:b}))):h(a,b,{searchSource:d,allFilters:b,cacheKey:e},g)}else a=RightNow.Url,d=p.getCurrentPage(),b=k(e,b,g,!1).filtersToInclude,d+=a.convertToSegment(b),d=a.addParameter(d,"session",a.getSession()),d=c(d,b.page),window.open(d,"_self")},ajaxCallback:f}}();p={buildReportRequestParameters:function(f,h,k,c,e){var a=RightNow.Lang.cloneObject(h),b;for(b in a)a.hasOwnProperty(b)&&(a[b].filters&&(a[b].filters.report_id=parseInt(f,10)),a[b].data&&delete a[b].data);k||(k={});k.urlParms=RightNow.Url.buildUrlLinkString(h,k.parmList);return{c:e,id:f,sf:a,fmt:k,token:c}},getCurrentPage:function(){var f=window.location,h=f.pathname,f=f.origin||f.protocol+"//"+f.host;return"/"===h||"/app"===h||"/app/"===h?f+"/app/"+RightNow.Interface.getConfig("CP_HOME_URL"):h.split("/").slice(0,RightNow.Url.getParameterSegment()-1).join("/")}};m=function(){function f(c){if(!c||!c.length||2>c.length)throw Error("You're doing it wrong");this.sources=c;this.multiple=!0}var h={},k=RightNow.EventProvider.extend({overrides:{constructor:function(c,e){this.parent();this.Y=c;delete this.data;delete this.baseDomID;delete this.baseSelector;this.searchSource=e;this.instanceID=e.id;this._addEventHandler("search",{pre:function(a){this._params||(this._params={});a instanceof RightNow.Event.EventObject&&(this._originalEventObject=RightNow.Lang.cloneObject(a),this._collectSearchFilters(a),this._params.newPage=a.filters.newPage)},during:function(a){a instanceof RightNow.Event.EventObject&&this._collectSearchFilters(a)},post:function(){var a,b;if(this._excludedFilters)for(a=0;a<this._excludedFilters.length;a++)b=this._excludedFilters[a],this._respondingFilters&&!this._respondingFilters[b]&&(b=this._filters.allFilters[b])&&b.filters&&(b.filters.data[0]?b.filters.data[0]=null:b.filters.data=null);this.fire("send",this._filters,this._params)}})._addEventHandler("send",{pre:function(a){this._originalEventObject||(this._originalEventObject={filters:{page:1,newPage:!1}});this._eventCancelled=!1},during:function(a){!1===a&&(this._eventCancelled=!0)},post:function(a){this._eventCancelled||(this._excludedFilters=[],q.go(this._originalEventObject.filters,this._filters,this._params,this.searchSource,this))}})._addEventHandler("setInitialFilters",{post:function(a){this._setInitialFilters(a)}})._addEventHandler("appendFilter",{post:function(a){this._originalEventObject||(this._originalEventObject=RightNow.Lang.cloneObject(a));this._mergeFilters(a)}})._addEventHandler("excludeFilterFromNextSearch",{post:function(a){this._excludedFilters||(this._excludedFilters=[]);this._excludedFilters.push(a.data.name)}})._addEventHandler("reset").on("reset",function(){this._filters=RightNow.Lang.cloneObject(this._initialFilters);if(this._params&&this._filters&&this._filters.allFilters){var a=this._filters.allFilters;this._initialParams&&(this._params=RightNow.Lang.cloneObject(this._initialParams));this.Y.Object.each(this._params,function(b,c,d){a[c]&&a[c].filters&&"data"in a[c].filters&&(d[c]=a[c].filters.data)})}},this)}},clearCache:function(){l.enabled&&l.clearCache(this.searchSource.type+this.searchSource.id)},doesCacheExist:function(){return l.enabled?l.doesCacheExist(this.searchSource.type+this.searchSource.id):!1},_setFilters:function(c){this._filters=c},_setInitialFilters:function(c){c instanceof RightNow.Event.EventObject&&(this.Y.Object.isEmpty(c.filters)||(this._filters=c.filters,this._initialFilters=RightNow.Lang.cloneObject(c.filters)),this.Y.Object.isEmpty(c.data)||(this._params=c.data,this._initialParams=RightNow.Lang.cloneObject(c.data)))},_mergeFilters:function(c){this._filters.allFilters=this.Y.mix(this._filters.allFilters,c.filters,!0,null,0,!0)},_collectSearchFilters:function(c){c=new RightNow.Event.EventObject({instanceID:c.w_id},RightNow.Lang.cloneObject(c));c.filters.searchName?(this._respondingFilters||(this._respondingFilters={}),this._respondingFilters[c.filters.searchName]=!0,this._filters||(this._filters={}),this._filters.allFilters||(this._filters.allFilters={}),this._filters.allFilters[c.filters.searchName]=c):"generic"===this.searchSource.type&&(this._params=this.Y.mix(this._params||{},c.data,!0))}});f.prototype={_invoke:function(c,e,a,b){for(var f=0;f<this.sources.length;f++)this.sources[f][c](e,a,b);return this},on:function(c,e,a){return this._invoke("on",c,e,a)},fire:function(c,e,a){return this._invoke("fire",c,e,a)}};return{multipleSourcesWrapper:f,get:function(c){return"undefined"===typeof c?h:h[c]},add:function(c,e){if(c&&e instanceof k&&!h[c])return h[c]=e},getSearchSources:function(c,e){var a=c?(c+"").split(","):[],b=e?(e+"").split(","):[],f=[],d;for(d=0;d<a.length;d++)f.push({type:"report",id:a[d]});for(d=0;d<b.length;d++)f.push({type:"generic",id:b[d]});return{report:a,source:b,keys:f}},searchSource:k,findNamedSource:function(c,e){if(e){this.findNamedSource.findSource||(this.findNamedSource.findSource=function(a,b){if(b.multiple)for(var c=0;c<b.sources.length;c++){if(b.sources[c].instanceID===a)return b.sources[c]}else if(b.instanceID===a)return b});this.findNamedSource.warning||(this.findNamedSource.warning=function(a){RightNow.UI.DevelopmentHeader&&RightNow.UI.DevelopmentHeader.addJavascriptWarning(RightNow.Text.sprintf(RightNow.Interface.getMessage("PCT_D_SRCH_SRC_ID_RPT_ID_SRC_ID_LBL"),a))});var a=[],b=[];if("string"===typeof e||"number"===typeof e){e=(e+"").split(",");if(1<e.length){for(var g=0,d;g<e.length;g++)(d=this.findNamedSource.findSource(e[g],c))?a.push(d):b.push(e[g]);b.length&&this.findNamedSource.warning(b.join(", "));if(a.length)return 1<a.length?new f(a):a[0]}else if(a=this.findNamedSource.findSource(e[0],c))return a;!b.length&&this.findNamedSource.warning(e[0]);return c}if("object"===typeof e){for(g in e)e.hasOwnProperty(g)&&((d=this.findNamedSource.findSource(g,c))?(d=YUI().mix(d,e[g]),a.push(d)):b.push(g));b.length&&this.findNamedSource.warning(b.join(", "));if(a.length)return 1<a.length?new f(a):a[0]}}if(!c)throw Error("The widget extending from RightNow.SearchFilter doesn't have report_id or source_id attributes.");return c}}}();RightNow.SearchFilter=RightNow.Widgets.extend({constructor:function(){for(var f=m.getSearchSources(this.data.attrs.report_id,this.data.attrs.source_id),h=[],k=0,c,e;k<f.keys.length;k++)e=f.keys[k],c=m.get(e.type+e.id),c||(c=new m.searchSource(this.Y,e),m.add(e.type+e.id,c)),h.push(c);1<h.length&&(c=new m.multipleSourcesWrapper(h));this.searchSource=function(a){return m.findNamedSource(c,a)}}});RightNow.ResultsDisplay=RightNow.SearchFilter})();
RightNow.Widgets.ResultInfo=RightNow.SearchFilter.extend({overrides:{constructor:function(){this.parent();this._searchSources=0;if(this.data.attrs.display_knowledgebase_results){this.searchSource(this.data.attrs.report_id).on('response',this._onReportChanged,this);}
if(this.data.attrs.combined_results){this._searchTerm=this.data.js.searchTerm;if(this.data.js.social){if(this.data.js.social){this._searchSources++;}
this.searchSource(this.data.attrs.source_id).on('response',this._reportCombinedResults,this);}
this.searchSource().on('appendFilter',function(evt,args){if(args[0].filters.page&&args[0].data){this._page=args[0].data.page;}},this);this.searchSource(this.data.attrs.report_id).on('send',this._watchSearchFilterChange,this);}
if(this.data.js.error){RightNow.UI.Dialog.messageDialog(this.data.js.error,{"icon":"WARN"});}}},_onReportChanged:function(type,args)
{var newData=args[0].data,resultQuery="",parameterList=(this.data.attrs.add_params_to_url)?RightNow.Url.buildUrlLinkString(args[0].filters.allFilters,this.data.attrs.add_params_to_url):'';this._determineNewResults(args[0]);if(!this.data.attrs.combined_results&&this.data.attrs.display_results&&newData.search_term)
{var stopWords=newData.stopword,noDictWords=newData.not_dict,searchTerms=newData.search_term.split(" "),displayedNoResultsMsg=false;for(var i=0,word,strippedWord;i<searchTerms.length;i++)
{word=searchTerms[i];strippedWord=word.replace(/\W/,"");if(stopWords&&strippedWord&&stopWords.indexOf(strippedWord)!==-1)
word="<span class='rn_Strike' title='"+this.data.attrs.label_common+"'>"+word+"</span>";else if(noDictWords&&strippedWord&&noDictWords.indexOf(strippedWord)!==-1)
word="<span class='rn_Strike' title='"+this.data.attrs.label_dictionary+"'>"+word+"</span>";else
word="<a href='"+RightNow.Url.addParameter(this.data.js.linkUrl+encodeURIComponent(word.replace(/\&amp;/g,"&"))+parameterList+"/search/1","session",RightNow.Url.getSession())+"'>"+word+"</a>";resultQuery+=word+" ";}
resultQuery=this.Y.Lang.trim(resultQuery);}
var suggestedDiv=this.Y.one(this.baseSelector+"_Suggestion");if(suggestedDiv)
{if(newData.ss_data)
{var links=this.data.attrs.label_suggestion+" <ul>";for(var i=0;i<newData.ss_data.length;i++)
links+='<li><a href="'+this.data.js.linkUrl+newData.ss_data[i]+'/suggested/1'+parameterList+'">'+newData.ss_data[i]+'</a></li>';links+="</ul>";suggestedDiv.set('innerHTML',links).removeClass('rn_Hidden');}
else
{RightNow.UI.hide(suggestedDiv);}}
var spellingDiv=this.Y.one(this.baseSelector+"_Spell");if(spellingDiv)
{if(newData.spelling)
{spellingDiv.set('innerHTML',this.data.attrs.label_spell+' <a href="'+this.data.js.linkUrl+newData.spelling+'/dym/1/'+parameterList+'">'+newData.spelling+' </a>').removeClass('rn_Hidden');}
else
{RightNow.UI.hide(spellingDiv);}}
if(!(newData.data!==undefined&&newData.data.length!==undefined&&newData.data.length=='0'&&RightNow.Url.getParameter('page')!=='1'))
this._updateSearchResults({searchTermToDisplay:resultQuery,userSearchedOn:newData.search_term,topics:newData.topics,truncated:newData.truncated});if(!this.data.attrs.combined_results)
{this.data.js.totalResults=0;this.data.js.firstResult=0;this.data.js.lastResult=0;}},_updateSearchResults:function(options)
{options=options||{};var noResultsDiv=this.Y.one(this.baseSelector+"_NoResults"),resultsDiv=this.Y.one(this.baseSelector+"_Results"),searchTermToDisplay=options.searchTermToDisplay,displayedNoResultsMsg=false;if(noResultsDiv)
{if(this.data.js.totalResults===0&&options.userSearchedOn&&(!options.topics||options.topics.length===0))
{noResultsDiv.set('innerHTML',this.data.attrs.label_no_results+"<br/><br/>"+this.data.attrs.label_no_results_suggestions).removeClass('rn_Hidden');displayedNoResultsMsg=true;}
else
{RightNow.UI.hide(noResultsDiv);}}
if(resultsDiv)
{if(!displayedNoResultsMsg&&!options.truncated)
{resultsDiv.set('innerHTML',(searchTermToDisplay&&searchTermToDisplay.length>0)?RightNow.Text.sprintf(this.data.attrs.label_results_search_query,this.data.js.firstResult,this.data.js.lastResult,this.data.js.totalResults,searchTermToDisplay):RightNow.Text.sprintf(this.data.attrs.label_results,this.data.js.firstResult,this.data.js.lastResult,this.data.js.totalResults));RightNow.UI.show(resultsDiv);}
else
{RightNow.UI.hide(resultsDiv);}}},_determineNewResults:function(eventObject){var reportData=eventObject.data;if(this.data.attrs.combined_results){if(this.data.js.totalResults===0||this.data.js.totalResults===this.data.js.combinedResults){this.data.js.totalResults+=reportData.total_num;}
if(typeof reportData.pruned==="number"){this.data.js.totalResults-=reportData.pruned;}
if(typeof this.data.js.prunedAnswers==="number"&&!reportData.pruned){reportData.start_num-=this.data.js.prunedAnswers;reportData.end_num-=this.data.js.prunedAnswers;reportData.pruned=true;}}
else{this.data.js.totalResults=reportData.total_num;}
this.data.js.firstResult=reportData.start_num;if(reportData.page!==1){this.data.js.firstResult+=this.data.js.combinedResults;}
if(this.data.js.firstResult===0&&this.data.js.combinedResults!==0){this.data.js.firstResult=1;}
this.data.js.lastResult=reportData.end_num+this.data.js.combinedResults;this._page=reportData.page;if(reportData.pruned&&eventObject.w_id&&eventObject.w_id.indexOf("CombinedSearchResults")>-1){this.data.js.prunedAnswers=(this.data.js.prunedAnswers===reportData.pruned)?false:reportData.pruned;}},_reportCombinedResults:function(evt,args){args=args[0];if(!args.data)return;var newTotal=0,argData=args.data,jsData=this.data.js;if(jsData.social&&argData.social){newTotal+=Math.min(argData.social.data.totalResults,20)||0;}
if(!this._page||this._page<2){jsData.combinedResults+=newTotal;jsData.lastResult+=newTotal;jsData.totalResults+=newTotal;jsData.firstResult=((jsData.combinedResults)?1:0);if(jsData.totalResults===0||this.data.js.combinedResults>0){this._updateSearchResults({userSearchedOn:true});}}},_watchSearchFilterChange:function(evt,args){args=args[0];if(!args)return;var filters=args.allFilters;if(filters&&((filters.keyword&&filters.keyword.filters.data!==this._searchTerm)||(filters.page===1))){this._page=1;this._searchTerm=filters.keyword.filters.data;this.data.js.totalResults=0;this.data.js.combinedResults=0;this.data.js.lastResult=0;this.data.js.firstResult=0;this.data.js.prunedAnswers=false;}}});
RightNow.Widgets.Paginator=RightNow.SearchFilter.extend({overrides:{constructor:function(){this.parent();this._currentPage=this.data.js.currentPage;for(var i=this.data.js.startPage;i<=this.data.js.endPage;i++)
{var pageLinkID=this.baseSelector+"_PageLink_"+i;if(this.Y.one(pageLinkID))
this.Y.one(pageLinkID).on("click",this._onPageChange,this,i);}
this._instanceElement=this.Y.one(this.baseSelector);this._cloneForwardAndBackwardButton();this.Y.one(this.baseSelector).delegate("click",this._onDirection,".rn_NextPage",this,true);this.Y.one(this.baseSelector).delegate("click",this._onDirection,".rn_PreviousPage",this,false);this._eo=new RightNow.Event.EventObject(this,{filters:{report_id:this.data.attrs.report_id,per_page:this.data.attrs.per_page,page:this._currentPage}});this.searchSource(this.data.attrs.report_id).on("response",this._onReportChanged,this);}},_onPageChange:function(evt,pageNumber)
{evt.preventDefault();if(this._currentlyChangingPage||!pageNumber||pageNumber===this._currentPage)
return;this._currentlyChangingPage=true;pageNumber=(pageNumber<1)?1:pageNumber;this._eo.filters.page=this._currentPage=pageNumber;if(RightNow.Event.fire("evt_switchPagesRequest",this._eo)){this.searchSource().fire("appendFilter",this._eo).fire("search",this._eo);}},_onDirection:function(evt,isForward)
{evt.preventDefault();if(this._currentlyChangingPage)
return;this._currentlyChangingPage=true;if(isForward)
this._currentPage++;else
this._currentPage--;this._eo.filters.page=this._currentPage;if(RightNow.Event.fire("evt_switchPagesRequest",this._eo)){this.searchSource().fire("appendFilter",this._eo).fire("search",this._eo);}},_onReportChanged:function(type,args)
{var newData=args[0];newData=newData.data;if(args[0].filters.report_id==this.data.attrs.report_id)
{this._currentPage=newData.page;var totalPages=newData.total_pages;if(totalPages<2||newData.truncated)
{RightNow.UI.hide(this._instanceElement);}
else
{var pagesContainer=this.Y.one(this.baseSelector+" ul");if(pagesContainer)
{pagesContainer.set('innerHTML',"");var startPage,endPage;if(totalPages>this.data.attrs.maximum_page_links)
{var split=Math.round(this.data.attrs.maximum_page_links/2);if(this._currentPage<=split)
{startPage=1;endPage=this.data.attrs.maximum_page_links;}
else
{var offsetFromMiddle=this._currentPage-split;var maxOffset=offsetFromMiddle+this.data.attrs.maximum_page_links;if(maxOffset<=newData.total_pages)
{startPage=1+offsetFromMiddle;endPage=maxOffset;}
else
{startPage=newData.total_pages-(this.data.attrs.maximum_page_links-1);endPage=newData.total_pages;}}}
else
{startPage=1;endPage=totalPages;}
pagesContainer.appendChild(this._backButton);for(var i=startPage,link,titleString;i<=endPage;i++)
{if(i===this._currentPage)
{var currentPageTitle=RightNow.Text.sprintf(this.data.attrs.label_current_page,i,totalPages)
link=this.Y.Node.create("<span/>").addClass("rn_CurrentPage").set('innerHTML',i).set('title',currentPageTitle).set('aria-label',currentPageTitle).setAttribute('tabindex','0');}
else if(this._shouldShowPageNumber(i,this._currentPage,endPage))
{link=this.Y.Node.create("<a/>").set('id',this.baseDomID+"_PageLink_"+i).set('href',this.data.js.pageUrl+i).set('innerHTML',i+'<span class="rn_ScreenReaderOnly">'+RightNow.Text.sprintf(this.data.attrs.label_page,i,totalPages)+'</span>');titleString=this.data.attrs.label_page;if(titleString)
{titleString=titleString.replace(/%s/,i).replace(/%s/,newData.total_pages);link.set('title',titleString);}}
else if(this._shouldShowHellip(i,this._currentPage,endPage))
{link=this.Y.Node.create("<span/>").set('class','rn_PageHellip').set('innerHTML',"&hellip;");}
else{continue;}
pagesContainer.appendChild(this.Y.Node.create("<li/>").append(link));link.on("click",this._onPageChange,this,i);}
pagesContainer.appendChild(this._forwardButton);RightNow.UI.show(this._instanceElement);}}
if(this._backButton)
{if(newData.page>1)
this._backButton.removeClass("rn_Hidden").set('href',this.data.js.pageUrl+(this._currentPage-1));else
RightNow.UI.hide(this._backButton);}
if(this._forwardButton)
{if(newData.total_pages>newData.page)
this._forwardButton.removeClass("rn_Hidden").set('href',this.data.js.pageUrl+(this._currentPage+1));else
RightNow.UI.hide(this._forwardButton);}
this._cloneForwardAndBackwardButton();}
this._currentlyChangingPage=false;},_shouldShowHellip:function(pageNumber,currentPage,endPage){return Math.abs(pageNumber-currentPage)===((currentPage===1||currentPage===endPage)?3:2);},_shouldShowPageNumber:function(pageNumber,currentPage,endPage){return pageNumber===1||(pageNumber===endPage)||(Math.abs(pageNumber-currentPage)<=((currentPage===1||currentPage===endPage)?2:1));},_cloneForwardAndBackwardButton:function(){this._forwardButton=this.Y.one(this.baseSelector+" .rn_NextPage").cloneNode(true);this._backButton=this.Y.one(this.baseSelector+" .rn_PreviousPage").cloneNode(true);}});
RightNow.Widgets.SiteFeedback=RightNow.Widgets.extend({constructor:function(){this._dialog=this._keyListener=null;this._resetElements();if(!this._feedbackField)
{RightNow.UI.DevelopmentHeader.addJavascriptError(RightNow.Text.sprintf(RightNow.Interface.getMessage("SITEFEEDBACK_DIALOG_MISSING_REQD_MSG"),"rn_"+this.instanceID+"_FeedbackTextarea"));return;}
this.Y.one(this.baseSelector+"_FeedbackLink").on("click",this._onGiveFeedbackClick,this);RightNow.Event.subscribe("evt_formTokenUpdate",this._onFormTokenUpdate,this);},_resetElements:function()
{this._errorDisplay=this.Y.one(this.baseSelector+"_ErrorMessage");this._emailField=this.Y.one(this.baseSelector+"_EmailInput");this._feedbackField=this.Y.one(this.baseSelector+"_FeedbackTextarea");},_onGiveFeedbackClick:function()
{if(this.data.attrs.feedback_page_url)
{window.open(RightNow.Url.addParameter(this.data.attrs.feedback_page_url,"session",RightNow.Url.getSession()),"","resizable, scrollbars, width=630, height=400");}
else
{this._showDialog();}},_onFormTokenUpdate:function(type,args){var eventObject=args[0];if(eventObject.data.newToken&&this.instanceID===eventObject.w_id){this.data.js.f_tok=eventObject.data.newToken;}},_showDialog:function()
{RightNow.Event.fire("evt_formTokenRequest",new RightNow.Event.EventObject(this,{data:{formToken:this.data.js.f_tok}}));if(!this._dialog)
{var buttons=[{text:this.data.attrs.label_send_button,handler:{fn:this._onSubmit,scope:this},isDefault:true},{text:this.data.attrs.label_cancel_button,handler:{fn:this._onCancel,scope:this},isDefault:false}];this._dialog=RightNow.UI.Dialog.actionDialog(this.data.attrs.label_dialog_title,this.Y.one(this.baseSelector+"_SiteFeedbackForm"),{buttons:buttons});this._keyListener=RightNow.UI.Dialog.addDialogEnterKeyListener(this._dialog,this._onSubmit,this);this.Y.one("#"+this._dialog.id).addClass('rn_SiteFeedbackDialog');}
if(this._errorDisplay)
{this._errorDisplay.set("innerHTML","").removeClass('rn_MessageBox rn_ErrorMessage');}
RightNow.ActionCapture.record('siteFeedback','click');this._dialog.show();this._resetElements();var focusElement;if(this._emailField&&this._emailField.get('value')==='')
focusElement=this._emailField;else
focusElement=this._feedbackField;focusElement.focus();RightNow.UI.Dialog.enableDialogControls(this._dialog,this._keyListener);},_onSubmit:function(type,args)
{var target=(args&&args[1])?(args[1].target||args[1].srcElement):null;if((type==="keyPressed"&&target&&(target.get('tagName')==='A'||target.get('tagName')==='TEXTAREA'||target.getHTML()===this.data.attrs.label_send_button||target.getHTML()===this.data.attrs.label_cancel_button))||!this._validateDialogData()){return;}
RightNow.UI.Dialog.disableDialogControls(this._dialog,this._keyListener);this._submitFeedback();},_onCancel:function()
{RightNow.UI.Dialog.disableDialogControls(this._dialog,this._keyListener);this._closeDialog(true);},_validateDialogData:function()
{this._errorDisplay.removeClass('rn_MessageBox rn_ErrorMessage').set("innerHTML","");var returnValue=true;if(this._emailField)
{this._emailField.set('value',this.Y.Lang.trim(this._emailField.get('value')));this._emailField.set('value',this._emailField.get('value').replace(/\s*[,;]$/g,''));if(this._emailField.get('value')==="")
{this._addErrorMessage(RightNow.Text.sprintf(RightNow.Interface.getMessage("PCT_S_IS_REQUIRED_MSG"),this.data.attrs.label_email_address),this._emailField.get('id'));returnValue=false;}
else if(!RightNow.Text.isValidEmailAddress(this._emailField.get('value')))
{this._addErrorMessage(this.data.attrs.label_email_address+' '+RightNow.Interface.getMessage("FIELD_IS_NOT_A_VALID_EMAIL_ADDRESS_MSG"),this._emailField.get('id'));returnValue=false;}
else
{var email=this._emailField.get('value');var flag=false;for(var index=0;index<email.length;index++){if((email[index]===";")||(email[index]===",")){flag=true;break;}}
if(flag&&index!=email.length-1){for(var i=index+1;i<email.length;i++)
{if(!(email[i]===";"||email[i]===",")){this._addErrorMessage(RightNow.Interface.getMessage("PLEASE_ENTER_SINGLE_EMAIL_ADDRESS_LBL"),this._emailField.get('id'));returnValue=false;break;}}
if(i===email.length){this._emailField.set('value',email.substring(0,index));}}}}
this._feedbackField.set('value',this.Y.Lang.trim(this._feedbackField.get('value')));if(this._feedbackField.get('value')==="")
{this._addErrorMessage(RightNow.Text.sprintf(RightNow.Interface.getMessage("PCT_S_IS_REQUIRED_MSG"),this.data.attrs.label_comment_box),this._feedbackField.get('id'));returnValue=false;}
return returnValue;},_closeDialog:function(cancelled)
{if(!cancelled)
{this._feedbackField.set('value',"");}
if(this._errorDisplay)
{this._errorDisplay.set("innerHTML","").removeClass('rn_MessageBox rn_ErrorMessage');}
if(this._dialog)
this._dialog.hide();},_submitFeedback:function()
{var eventObject=new RightNow.Event.EventObject(this,{data:{"w_id":this.data.info.w_id,"a_id":null,"rate":0,"f_tok":this.data.js.f_tok,"message":this._feedbackField.get('value')}});if(this.data.js.isProfile)
eventObject.data.email=this.data.js.email;else if(this._emailField)
eventObject.data.email=this._emailField.get('value');if(RightNow.Event.fire("evt_siteFeedbackRequest",eventObject))
{RightNow.Ajax.makeRequest(this.data.attrs.submit_site_feedback_ajax,eventObject.data,{successHandler:this._onResponseReceived,scope:this,data:eventObject,json:true});}
return false;},_onResponseReceived:function(response,originalEventObj)
{if(RightNow.Event.fire("evt_siteFeedbackSubmitResponse",{data:originalEventObj,response:response}))
{this._closeDialog();if(!response){return;}
var error;if((error=response.error)||!response.ID){RightNow.UI.Dialog.messageDialog(error||RightNow.Interface.getMessage("SORRY_ERROR_SUBMISSION_LBL"),{icon:"WARN",exitCallback:{fn:this._dialog.enableButtons,scope:this._dialog}});}
else{RightNow.UI.Dialog.messageDialog(this.data.attrs.label_feedback_confirmation,{exitCallback:{fn:this._closeDialog,scope:this}});}}},_addErrorMessage:function(message,focusElement)
{if(this._errorDisplay)
{var newMessage='<a href="javascript:void(0);" onclick="document.getElementById(\''+focusElement+'\').focus(); return false;">'+message+'</a>',oldMessage=this._errorDisplay.get("innerHTML");this._errorDisplay.addClass('rn_MessageBox rn_ErrorMessage').set("innerHTML",((oldMessage==="")?newMessage:oldMessage+'<br/>'+newMessage));this._errorDisplay.get('children').item(0).focus();this._errorDisplay.one("h2")?this._errorDisplay.one("h2").setHTML(RightNow.Interface.getMessage("ERRORS_LBL")):this._errorDisplay.prepend("<h2>"+RightNow.Interface.getMessage("ERROR_LBL")+"</h2>");this._errorDisplay.one("h2").setAttribute('role','alert');}}});
RightNow.Widgets.ConditionalChatLink=RightNow.Widgets.extend({constructor:function()
{this._container=this.Y.one(this.baseSelector);this._isPersistentChat=this.data.attrs.is_persistent_chat;this._pollingBegan=null;this._linkClicked=false;this._offerRecorded=this.data.js.offer_recorded;this._queueReceivedEventSubscribed=false;this._linkUrl=this.data.js.link_url;this._eeWidgetId=null;this._offered=false;if(this.data.attrs.is_persistent_chat)
{this._ls=RightNow.Chat.LS;if(!this._ls.isSupported)
{this._isPersistentChat=false;}}
var initialResult={};if(this.data.attrs.initiate_by_event)
{if(this.data.attrs.hide_on_unavailable)
{initialResult.stats={availableSessionCount:0,expectedWaitSeconds:0};}}
else if(this.data.js.unavailable_hours)
{initialResult.out_of_hours=true;}
else if(this.data.js.available_session_count!==undefined&&this.data.js.expected_wait_seconds!==undefined)
{initialResult.stats={availableSessionCount:this.data.js.available_session_count,expectedWaitSeconds:this.data.js.expected_wait_seconds};}
this._eo=new RightNow.Event.EventObject(this,{data:{wait_threshold:this.data.attrs.wait_threshold,min_agents_avail:this.data.attrs.min_sessions_avail,interface_id:this.data.js.interface_id,contact_email:this.data.js.contact_email,contact_fname:this.data.js.contact_fname,contact_lname:this.data.js.contact_lname,prod:this.data.js.prod,cat:this.data.js.cat,c_id:this.data.js.c_id,org_id:this.data.js.org_id,cacheable:true,avail_type:this.data.js.avail_type,ccl:true,name:'ConditionalChatLink'}});this._onQueueReceived(initialResult);RightNow.Event.subscribe("evt_productCategoryFilterSelected",this._onProdCatChanged,this);if(!this.data.attrs.initiate_by_event&&this.data.attrs.enable_availability_check&&this.data.attrs.enable_polling)
this._startPollingTimer(false);if(this.data.attrs.initiate_by_event)
{RightNow.Event.subscribe("evt_customInitialization",this._startPollingTimer,this,true);RightNow.Event.fire("evt_CCLReady");RightNow.Event.subscribe("evt_isCCLReady",function(){RightNow.Event.fire("evt_CCLReady");},this);}},_generateEncodedChatData:function(args)
{var chatData=this.data.js.routeData||'';if(args!==undefined&&args[0]!==undefined&&args[0].data!==undefined)
{var data=args[0].data;this._eeWidgetId=data.instance_id;chatData=this._addChatDataParam(chatData,'referrerUrl',encodeURIComponent(window.location.href));chatData=this._addChatDataParam(chatData,'v_id',data.visitor_id);chatData=this._addChatDataParam(chatData,'ee_id',data.ee_id);chatData=this._addChatDataParam(chatData,'es_id',data.estara_id);chatData=this._addChatDataParam(chatData,'ee_s_id',data.ee_session_id);}
chatData=this._addChatDataParam(chatData,'hash',new Date().getTime()+Math.random().toString(36).substring(7));return RightNow.Text.Encoding.base64Encode(chatData);},_startPollingTimer:function(startImmediately,args)
{var chatData=this._generateEncodedChatData(args);if(chatData.length!==0)
this._linkUrl=RightNow.Url.addParameter(this._linkUrl,'chat_data',chatData);if(this._pollingBegan!==null&&this.data.attrs.enable_polling)
return;if(!this._queueReceivedEventSubscribed)
RightNow.Event.subscribe("evt_chatQueueResponseCCL",this._onQueueReceived,this);this._pollingBegan=new Date().getTime();if(startImmediately)
{this._onPollingTimerElapsed();}
else
{this.Y.later(12000,this,this._onPollingTimerElapsed);}},_onPollingTimerElapsed:function()
{var eventObject=RightNow.Lang.cloneObject(this._eo);if(RightNow.Event.fire("evt_chatQueueRequest",eventObject))
{delete eventObject.data.rn_contextData;delete eventObject.data.rn_contextToken;delete eventObject.data.rn_formToken;delete eventObject.data.rn_timestamp;delete eventObject.data.w_id;RightNow.Ajax.makeRequest(this.data.attrs.get_chat_info_ajax,eventObject.data,{successHandler:this._onQueueReceived,failureHandler:function(){},scope:this,json:true,data:eventObject,type:"GETPOST",cors:true});}
var timeElapsed=new Date().getTime()-this._pollingBegan;var newTimeout=timeElapsed>=300000?60000:12000;if(this.data.attrs.enable_polling)
this.Y.later(newTimeout,this,this._onPollingTimerElapsed);},_openChatLink:function()
{var callback=null;if(this.data.attrs.open_in_new_window)
window.open(this._linkUrl,'chatLauncher','width='+this.data.attrs.chat_login_page_width+',height='+this.data.attrs.chat_login_page_height+',scrollbars=1,resizable=1');else
callback=function(){window.location.href=this._linkUrl;};if(!this._linkClicked)
{this._linkClicked=true;this._publishStats({w:this.data.js.dqaWidgetType.toString(),accepts:1},callback);}
var eo=new RightNow.Event.EventObject(this,{data:{id:this._eeWidgetId,name:'ConditionalChatLink'}});RightNow.Event.fire("evt_CCLChatAccepted",eo);},_onQueueReceived:function(result)
{if(result&&result.out_of_hours)
{this._container.setContent(this.Y.Node.create(new EJS
({text:this.getStatic().templates.unavailableHoursMessage}).render({instanceID:this.instanceID,linkTitle:RightNow.Interface.getMessage("LIVE_CHAT_LBL"),message:this.data.attrs.label_unavailable_hours})));this._addClickHandler(this.Y.one(this.baseSelector+'_UnavailableHoursLink'));}else if(result&&result.stats&&RightNow.Event.fire("evt_chatQueueResponse",{data:{w_id:this._eo.w_id,name:"ConditionalChatLink"},response:{stats:{expectedWaitSeconds:parseInt(result.stats.expectedWaitSeconds,10)}}}))
{var availableSessionCount=0,expectedWaitSeconds=0;var availableImmediately=false,availableWithWait=false,unavailableBusy=false,unavailableHours=false;if(result===null||result===undefined){result={};}
var eoData=this._eo.data;this._linkUrl=eoData.prod?RightNow.Url.addParameter(this._linkUrl,'p',eoData.prod):RightNow.Url.deleteParameter(this._linkUrl,'p');this._linkUrl=eoData.cat?RightNow.Url.addParameter(this._linkUrl,'c',eoData.cat):RightNow.Url.deleteParameter(this._linkUrl,'c');if(result.stats)
{availableSessionCount=parseInt(result.stats.availableSessionCount,10);expectedWaitSeconds=parseInt(result.stats.expectedWaitSeconds,10);if(expectedWaitSeconds<=this.data.attrs.wait_threshold&&availableSessionCount>=this.data.attrs.min_sessions_avail&&(expectedWaitSeconds>0||availableSessionCount>0))
{if(expectedWaitSeconds===0)
availableImmediately=true;else
availableWithWait=true;}
else
{unavailableBusy=true;}}
else if(result.out_of_hours)
{unavailableHours=true;}
this._container.removeClass('rn_Hidden');if(this.data.attrs.hide_on_unavailable&&(unavailableHours||unavailableBusy))
{this._container.addClass('rn_Hidden');}
else if(availableImmediately||availableWithWait)
{if(!this._offerRecorded)
{this._offerRecorded=true;this._publishStats({w:this.data.js.dqaWidgetType.toString(),offers:1},null);}
if(availableImmediately)
{this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.availableImmediatelyMessage}).render({instanceID:this.instanceID,linkTitle:RightNow.Interface.getMessage("LIVE_CHAT_LBL"),message:this._parseMacro(this.data.attrs.label_available_immediately_template,expectedWaitSeconds)})));if(this._isPersistentChat)
{this.data.attrs.enable_polling=false;this._addPersistentChatClickHandler(this.Y.one(this.baseSelector+'_AvailableImmediatelyLink'));}
else
{this._addClickHandler(this.Y.one(this.baseSelector+'_AvailableImmediatelyLink'));}}
else
{this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.availableWithWaitMessage}).render({instanceID:this.instanceID,linkTitle:RightNow.Interface.getMessage("LIVE_CHAT_LBL"),message:this._parseMacro(this.data.attrs.label_available_with_wait_template,expectedWaitSeconds)})));if(this._isPersistentChat)
{this.data.attrs.enable_polling=false;this._addPersistentChatClickHandler(this.Y.one(this.baseSelector+'_AvailableWithWaitLink'));}
else
{this._addClickHandler(this.Y.one(this.baseSelector+'_AvailableWithWaitLink'));}}
if(!this._offered)
{this._offered=true;var eo=new RightNow.Event.EventObject(this,{data:{id:this._eeWidgetId,name:'ConditionalChatLink'}});RightNow.Event.fire("evt_CCLChatOffered",eo);}}
else if(unavailableBusy)
{if(this._isPersistentChat)
{this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.persistentMessage}).render({instanceID:this.instanceID,message:this._parseMacro(this.data.attrs.label_unavailable_busy_template,expectedWaitSeconds)})));}
else
{this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.unavailableBusyMessage}).render({instanceID:this.instanceID,linkTitle:RightNow.Interface.getMessage("LIVE_CHAT_LBL"),message:this._parseMacro(this.data.attrs.label_unavailable_busy_template,expectedWaitSeconds)})));this._addClickHandler(this.Y.one(this.baseSelector+'_UnavailableBusyLink'));}}
else if(unavailableHours)
{if(this._isPersistentChat)
{this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.persistentMessage}).render({instanceID:this.instanceID,message:this._parseMacro(this.data.attrs.label_unavailable_hours)})));}
else
{this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.unavailableHoursMessage}).render({instanceID:this.instanceID,linkTitle:RightNow.Interface.getMessage("LIVE_CHAT_LBL"),message:this.data.attrs.label_unavailable_hours})));this._addClickHandler(this.Y.one(this.baseSelector+'_UnavailableHoursLink'));}}
else
{this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.defaultMessage}).render({instanceID:this.instanceID,linkTitle:RightNow.Interface.getMessage("LIVE_CHAT_LBL"),message:this.data.attrs.label_default})));this._addClickHandler(this.Y.one(this.baseSelector+'_DefaultLink'));}}
else if(!this.data.attrs.enable_availability_check)
{var eoData=this._eo.data;this._linkUrl=eoData.prod?RightNow.Url.addParameter(this._linkUrl,'p',eoData.prod):RightNow.Url.deleteParameter(this._linkUrl,'p');this._linkUrl=eoData.cat?RightNow.Url.addParameter(this._linkUrl,'c',eoData.cat):RightNow.Url.deleteParameter(this._linkUrl,'c');this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.defaultMessage}).render({instanceID:this.instanceID,linkTitle:RightNow.Interface.getMessage("LIVE_CHAT_LBL"),message:this.data.attrs.label_default})));this._addClickHandler(this.Y.one(this.baseSelector+'_DefaultLink'));}
else
{this._container.setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.unavailableMessage}).render({instanceID:this.instanceID,message:this.data.attrs.label_unavailable})));}},_addPersistentChatClickHandler:function(elementNode){elementNode.on('click',this._launchPersistentChat,this);},_launchPersistentChat:function(){RightNow.UI.hide(this.Y.one(this.baseSelector+'.rn_ConditionalChatLink'));RightNow.Event.fire("evt_launchPersistentChat",{});},_addClickHandler:function(elementNode)
{if(elementNode)
{elementNode.on('click',this._openChatLink,this);}},_parseMacro:function(message,expectedWaitSeconds)
{var expectedWaitMinutes=Math.floor(expectedWaitSeconds/60);if(message.indexOf('{NUM_MINUTES}'!==-1))
{expectedWaitSeconds=expectedWaitSeconds%60;message=message.replace('{NUM_MINUTES}',expectedWaitMinutes).replace('{MINUTES}',expectedWaitMinutes===1?RightNow.Interface.getMessage("MINUTE_LC_LBL"):RightNow.Interface.getMessage('MINUTES_LWR_LBL'));}
var expectedWaitSecondsPadded=expectedWaitSeconds<10?'0'+expectedWaitSeconds.toString():expectedWaitSeconds;message=message.replace('{TIME}',expectedWaitMinutes+':'+expectedWaitSecondsPadded);return message.replace('{NUM_SECONDS}',expectedWaitSeconds).replace('{SECONDS}',expectedWaitSeconds===1?RightNow.Interface.getMessage('SECOND_LBL'):RightNow.Interface.getMessage('SECONDS_LC_LBL'));},_publishStats:function(data,callback)
{RightNow.Ajax.CT.submitAction(RightNow.Ajax.CT.WIDGET_STATS,data,callback,this);},_addChatDataParam:function(chatData,key,value)
{if(chatData===undefined)
chatData='';if(value===undefined||value.length===0)
return chatData;if(chatData.length!==0)
chatData+='&';chatData+=key+'='+value;return chatData;},_onProdCatChanged:function(type,args)
{var prodCatType=args[0].data.data_type;var value=args[0].data.value;if(prodCatType.indexOf("Category")>-1)
this._eo.data.cat=value;else
this._eo.data.prod=value;}});
RightNow.Widgets.SourceResultDetails=RightNow.SearchConsumer.extend({overrides:{constructor:function(){this.parent();this.searchSource().on('response',this.onSearchComplete,this);}},onSearchComplete:function(evt,args){this.Y.one(this.baseSelector).setHTML(this.getResultText(args[0].data));},getResultText:function(result){if(!result.size)return'';var label=(result.total&&this.data.attrs.label_known_results)?this.data.attrs.label_known_results:this.data.attrs.label_results;return RightNow.Text.sprintf(label,result.offset+1,result.offset+result.size,result.total);}});
RightNow.Widgets.SourceResultListing=RightNow.SearchConsumer.extend({overrides:{constructor:function(){this.parent();this._contentDiv=this.Y.one(this.baseSelector+"_Content");if(!this._contentDiv)return;var searchSourceOptions={endpoint:this.data.attrs.search_results_ajax}
if('per_page'in this.data.attrs){searchSourceOptions.limit=this.data.attrs.per_page;}
this.searchSource().setOptions(searchSourceOptions).on('search',this.searchInProgress,this).on('response',this.onSearchComplete,this).fire('initializeFilters',new RightNow.Event.EventObject(this,{data:this.data.js.filters}));}},onSearchComplete:function(e,result){var results=result[0].data;this.updateLoadingIndicators(false);this.updateAriaAlert(results&&results.total);RightNow.Url.transformLinks(this._contentDiv.setHTML(results.html));this.updateMoreLink(results);if(this.data.attrs.hide_when_no_results){this.Y.one(this.baseSelector).toggleClass('rn_Hidden',!results.total);}},searchInProgress:function(){this._contentDiv.setHTML('');this.updateLoadingIndicators(true);},updateMoreLink:function(results){if(!this.data.attrs.more_link_url)return;var label=this.data.attrs.label_heading?(this.data.attrs.label_more_link+' '+this.data.attrs.label_heading):this.data.attrs.label_more_link;var link=(results.total>0&&results.total>results.filters.limit.value)?new EJS({text:this.getStatic().templates.moreResultsLink}).render({href:this.addSearchParametersToUrl(this.data.attrs.more_link_url,results.filters),label:label}):'';this.Y.one(this.baseSelector+' .rn_AdditionalResults').setHTML(link);},addSearchParametersToUrl:function(url,filters){this.Y.Object.each(filters,function(filter){if(filter.key&&filter.value){url=RightNow.Url.addParameter(url,filter.key,filter.value);}});return RightNow.Url.addParameter(url,'session',RightNow.Url.getSession());},updateLoadingIndicators:function(loading){var loadingState={toLoading:{ariaBusy:true,method:'addClass',opacity:0},fromLoading:{ariaBusy:false,method:'removeClass',opacity:1}},state=loadingState[loading?'toLoading':'fromLoading'];this._contentDiv.setStyle("height",loading?this._contentDiv.get("offsetHeight")+"px":"auto");document.body.setAttribute("aria-busy",state.ariaBusy+"");if(this.Y.UA.ie&&this.Y.UA.ie<11){this._contentDiv[state.method]("rn_Hidden");}
else{this._contentDiv[state.method]("rn_Loading");this._contentDiv.transition({opacity:state.opacity,duration:1.5});}},updateAriaAlert:function(newResults){var label=(newResults)?this.data.attrs.label_screen_reader_search_success_alert:this.data.attrs.label_screen_reader_search_no_results_alert;if(!label)return;this._ariaAlert=this._ariaAlert||this.Y.one(this.baseSelector+"_Alert");if(this._ariaAlert){this._ariaAlert.set("innerHTML",this.data.attrs.label_heading+' '+label);}}});
RightNow.Widgets.SourcePagination=RightNow.SearchProducer.extend({overrides:{constructor:function(){this.parent();this.Y.one(this.baseSelector).delegate('click',this.onPageClick,'a',this);this.searchSource().setOptions(this.data.js.sources).on('response',this.onSearchComplete,this);}},onPageClick:function(e){e.halt();var pageNumber=this.determinePageNumber(e.currentTarget.getAttribute('data-rel'));if(pageNumber){this.data.js.filter.value=pageNumber;this.triggerSearch();}},triggerSearch:function(){this.searchSource().fire('search',new RightNow.Event.EventObject(this,{data:{page:this.data.js.filter,sourceCount:1}}));},determinePageNumber:function(domPageValue){if(!domPageValue||domPageValue==this.data.js.currentPage)return;if(domPageValue==='next'){return this.data.js.filter.value+1;}
if(domPageValue==='previous'){return this.data.js.filter.value-1;}
return parseInt(domPageValue,10);},onSearchComplete:function(evt,args){var result=args[0].data;this.data.js.currentPage=result.filters.page.value;if(result.filters.page.value!==this.data.js.filter.value){this.data.js.filter.value=result.filters.page.value;}
var previousLink=this.renderPreviousLink(result),nextLink=this.renderNextLink(result),pages=this.renderPageLinks(result);this.Y.one(this.baseSelector+' ul').setHTML(previousLink+pages+nextLink);},renderPreviousLink:function(result){if(this.data.js.filter.value<=1||!result.size)return'';var previousPage=this.data.js.filter.value-1;return new EJS({text:this.getStatic().templates.navigationLink}).render({href:this.url(previousPage),rel:'previous',label:RightNow.Interface.getMessage('PREVIOUS_LBL'),className:'rn_PreviousPage'});},renderNextLink:function(result){if(result.total>result.size&&result.offset+result.size<result.total){var nextPage=this.data.js.filter.value+1;return new EJS({text:this.getStatic().templates.navigationLink}).render({href:this.url(nextPage),rel:'next',label:RightNow.Interface.getMessage('NEXT_LBL'),className:'rn_NextPage'});}
return'';},renderPageLinks:function(result){var numberOfPages=result.size?Math.ceil(result.total/this.data.js.limit):0;if(numberOfPages<=1)return'';return new EJS({text:this.getStatic().templates.pageLink}).render({numberOfPages:numberOfPages,currentPage:this.data.js.filter.value,label_page:this.data.attrs.label_page,label_current_page:this.data.attrs.label_current_page,filter:this.data.js.filter,paginationLinkTitle:this.Y.bind(this.paginationLinkTitle,this),pageLink:this.Y.bind(this.url,this),shouldShowPageNumber:this.Y.bind(this.shouldShowPageNumber,this),shouldShowHellip:this.Y.bind(this.shouldShowHellip,this)});},url:function(pageNumber){return RightNow.Url.addParameter(window.location.href,this.data.js.filter.key,pageNumber);},shouldShowHellip:function(pageNumber,currentPage,endPage){return Math.abs(pageNumber-currentPage)===((currentPage===1||currentPage===endPage)?3:2);},shouldShowPageNumber:function(pageNumber,currentPage,endPage){return pageNumber===1||(pageNumber===endPage)||(Math.abs(pageNumber-currentPage)<=((currentPage===1||currentPage===endPage)?2:1));},paginationLinkTitle:function(labelPage,pageNumber,endPage){return RightNow.Text.sprintf(labelPage,pageNumber,endPage);}});
RightNow.Widgets.Multiline=RightNow.ResultsDisplay.extend({overrides:{constructor:function(){this.parent();this._contentDiv=this.Y.one(this.baseSelector+"_Content");this._loadingDiv=this.Y.one(this.baseSelector+"_Loading");(RightNow.Event.isHistoryManagerFragment()&&this._setLoading(true));this.searchSource(this.data.attrs.report_id).on("response",this._onReportChanged,this).on("send",this._searchInProgress,this);this._setFilter();this._displayDialogIfError(this.data.js.error);}},_setFilter:function(){var eo=new RightNow.Event.EventObject(this,{filters:{token:this.data.js.r_tok,format:this.data.js.format,report_id:this.data.attrs.report_id,allFilters:this.data.js.filters}});eo.filters.format.parmList=this.data.attrs.add_params_to_url;this.searchSource().fire("setInitialFilters",eo);},_searchInProgress:function(evt,args){var params=args[1];if(!params||!params.newPage)
this._setLoading(true);},_setLoading:function(loading){if(this._contentDiv&&this._loadingDiv){var method,toOpacity,ariaBusy;if(loading){ariaBusy=true;method="addClass";toOpacity=0;this._contentDiv.setStyle("height",this._contentDiv.get("offsetHeight")+"px");}
else{ariaBusy=false;method="removeClass";toOpacity=1;this._contentDiv.setStyle("height","auto");}
document.body.setAttribute("aria-busy",ariaBusy+"");if(this.Y.UA.ie){this._contentDiv[method]("rn_Hidden");}
else{this._contentDiv.transition({opacity:toOpacity,duration:0.4});}
this._loadingDiv[method]("rn_Loading");}},_onReportChanged:function(type,args){var newdata=args[0].data,ariaLabel,firstLink,newContent="";this._displayDialogIfError(newdata.error);if(!this._contentDiv)return;if(newdata.total_num>0){ariaLabel=this.data.attrs.label_screen_reader_search_success_alert;newdata.hide_empty_columns=this.data.attrs.hide_empty_columns;newdata.hide_columns=this.data.js.hide_columns;newContent=new EJS({text:this.getStatic().templates.view}).render(newdata);}
else{ariaLabel=this.data.attrs.label_screen_reader_search_no_results_alert;}
this._updateAriaAlert(ariaLabel);this._contentDiv.set("innerHTML",newContent);if(this.data.attrs.hide_when_no_results){this.Y.one(this.baseSelector)[((newContent)?'removeClass':'addClass')]('rn_Hidden');}
this._setLoading(false);RightNow.Url.transformLinks(this._contentDiv);},_displayDialogIfError:function(error){if(error){RightNow.UI.Dialog.messageDialog(error,{"icon":"WARN"});}},_updateAriaAlert:function(text){if(!text)return;this._ariaAlert=this._ariaAlert||this.Y.one(this.baseSelector+"_Alert");if(this._ariaAlert){this._ariaAlert.set("innerHTML",text);}}});