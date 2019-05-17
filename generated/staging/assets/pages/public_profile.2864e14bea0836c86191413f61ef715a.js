
RightNow.Widgets.SimpleSearch=RightNow.Widgets.extend({constructor:function(){this._searchField=this.Y.one(this.baseSelector+"_SearchField");if(!this._searchField)return;if(this.data.attrs.initial_focus&&this._searchField.focus)
this._searchField.focus();this.Y.Event.attach("click",this._onSearch,this.baseSelector+"_Submit",this);},_onSearch:function(){var searchValue=this._searchField.get('value'),searchString=searchValue===this.data.attrs.label_hint?'':searchValue;if(this.Y.Lang.trim(searchString)===''){RightNow.UI.displayBanner(this.data.attrs.label_enter_search_keyword,{type:'WARNING',focusElement:this._searchField});}
else{var url=this.data.attrs.report_page_url+this._urlParameters(this.Y.merge({kw:searchString,session:RightNow.Url.getSession()},this.data.js.url_parameters));RightNow.Url.navigate(this._addSearchParam(url));}},_urlParameters:function(parameters){var url='';if(typeof parameters==='object'){this.Y.Object.each(parameters,function(value,parameter){url=RightNow.Url.addParameter(url,parameter,value);});}
return url;},_addSearchParam:function(url){var searchParam='/search/1';if(url.indexOf(searchParam)===-1){url+=searchParam;}
return url;}});
RightNow.Widgets.ModerationInlineAction=RightNow.Widgets.extend({constructor:function(){this.Y.one(this.baseSelector).delegate('click',this._toggleDropdown,'div.rn_ActionMenu',this);this.Y.one(this.baseSelector).delegate('click',this._onModeratorActionSubmit,'a.rn_Action',this);RightNow.Event.subscribe('evt_inlineModerationAuthorStatusUpdate',this._authorStatusUpdateEventListener,this);},_toggleDropdown:function(e){this._dropdown||(this._dropdown=this._createDropdown(this._renderDropdown()));if(this._dropdown.get('visible')){this._dropdown.hide();}
else{this._dropdown.show().get('contentBox').one('a').focus();}},_createDropdown:function(contentNode){return new this.Y.Panel({srcNode:contentNode,align:{node:this.baseSelector,points:[this.Y.WidgetPositionAlign.TR,this.Y.WidgetPositionAlign.BR]},visible:false,zIndex:1,render:this.baseSelector,buttons:[],hideOn:[{eventName:'clickoutside'},{node:contentNode.all('a').slice(-1).item(0),eventName:'keydown',keyCode:RightNow.UI.KeyMap.TAB}]});},_onModeratorActionSubmitSuccess:function(response){var moderateButton=this.Y.one(this.baseSelector+'_Button');this._hideProgressIcon();if(response.updatedObject.ID){if(!this.data.attrs.refresh_page_on_moderator_action){RightNow.UI.displayBanner(response.updatedObject.successMessage,{focusElement:moderateButton});}
this._fireStatusUpdateEvent(response);if(this._isUserDeleteAction(response.updatedObject.statusID)){RightNow.Url.navigate(this.data.attrs.deleted_user_redirect_url);}
else{if(response.updatedObject.objectType==='SocialUser'&&this.data.attrs.object_type!=='SocialUser'){this._fireAuthorStatusUpdateEvent(response);}
this.data.js.userActions=response.updatedUserActions;this.data.js.contentActions=response.updatedContentActions;if(this.data.attrs.refresh_page_on_moderator_action){RightNow.Url.navigate(window.location.href);}}
this._dropdown=null;}
else{RightNow.UI.displayBanner(response.error||this.data.attrs.label_on_failure_banner,{focusElement:moderateButton,type:'ERROR'});}},_isUserDeleteAction:function(statusID){return this.data.js.userDeleteStatuses&&typeof this.data.js.userDeleteStatuses[parseInt(statusID,10)]!=='undefined';},_fireStatusUpdateEvent:function(response){var eventObject=new RightNow.Event.EventObject(this,{data:{w_id:this.data.info.w_id,object_data:{updatedObject:response.updatedObject}}});RightNow.Event.fire("evt_inlineModerationStatusUpdate",eventObject);},_fireAuthorStatusUpdateEvent:function(response){var eventObject=new RightNow.Event.EventObject(this,{data:{w_id:this.data.info.w_id,object_data:response}});RightNow.Event.fire("evt_inlineModerationAuthorStatusUpdate",eventObject);},_authorStatusUpdateEventListener:function(e,eventData){if(this.data.js.authorID===eventData[0].data.object_data.updatedObject.ID){this.data.js.userActions=eventData[0].data.object_data.updatedUserActions;}},_showProgressIcon:function(){RightNow.UI.show(this.baseSelector+'_LoadingIcon');},_hideProgressIcon:function(){RightNow.UI.hide(this.baseSelector+'_LoadingIcon');},_onModeratorActionSubmit:function(e){this._toggleDropdown(e);if(this._isUserDeleteAction(e.currentTarget.getAttribute('data-action-id'))){this._deleteUserConfirm(e);return;}
this._submitRequest(e);},_submitRequest:function(e){var actionID=e.currentTarget.getAttribute('data-action-id');var objectType=e.currentTarget.getAttribute('data-object-type');var eo=new RightNow.Event.EventObject(this,{data:{actionID:actionID,objectType:objectType,w_id:this.data.info.w_id}});this._showProgressIcon();RightNow.Ajax.makeRequest(this.data.attrs.submit_moderator_action_ajax,eo.data,{data:eo,json:true,scope:this,successHandler:this._onModeratorActionSubmitSuccess});},_renderDropdown:function(){return this.Y.Node.create(this._getDropdownContent());},_deleteUserConfirm:function(e){var confirmElement=this.Y.Node.create('<p>').addClass('rn_UserDeleteDialog').set('innerHTML',this.data.attrs.label_user_delete_confirm);this._deleteDialog=RightNow.UI.Dialog.actionDialog(this.data.attrs.label_user_delete_confirm_title,confirmElement,{buttons:[{text:RightNow.Interface.getMessage('YES_LBL'),handler:{fn:function(){this._deleteDialog.hide();this._submitRequest(e);},scope:this},isDefault:true},{text:RightNow.Interface.getMessage('NO_LBL'),handler:{fn:function(){this._deleteDialog.hide();},scope:this},isDefault:false}]});this._deleteDialog.show();},_getDropdownContent:function(){return new EJS({text:this.getStatic().templates.view}).render({contentActions:this.data.js.contentActions,socialContentObjectType:this.data.attrs.object_type,userActions:this.data.js.userActions});}});