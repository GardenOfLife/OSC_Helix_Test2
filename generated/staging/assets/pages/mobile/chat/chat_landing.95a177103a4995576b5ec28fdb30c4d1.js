
RightNow.EventProvider=RightNow.Widgets.extend({constructor:function(){this._events={};this._eventHandlers={};this._eventFilters={}},_addEventHandler:function(a,b){this._eventHandlers[a]=b;return this},_getEventHandlers:function(a){return this._eventHandlers[a]||{}},_addSubscribersFilter:function(a,b,d){if(!b||"function"!==typeof b)throw Error("Subscriber filters must be functions.");this._eventFilters[a]||(this._eventFilters[a]=[]);this._eventFilters[a].push({handler:b,context:d});return this},_getFilteredSubscriberIndices:function(a){var b=this._events[a];a=this._eventFilters[a];var d=[],c;if(a)for(var f=0;f<a.length;f++)c=a[f],c=c.handler.call(c.context,b),this.Y.Array.each(c,function(a){isNaN(a)||d.push(a)},this);return d},fire:function(a,b,d){var c=this._getEventHandlers(a),f=this._getFilteredSubscriberIndices(a),g=this._events[a],e=!0,k=[];c.pre&&(e=c.pre.call(this,b));if(!1!==e){if(g){d="undefined"!==typeof d?[b,d]:[b];for(var e=0,l=g.length,h,m;e<l;e++)-1===this.Y.Array.indexOf(f,e)&&(h=g[e],m=h.handler.call(h.context||window,a,d),h.once&&k.push(e),c.during&&c.during.call(this,m));if(l=k.length)for(e=0;e<l;e++)g.splice(k[e]-e,1)}c.post&&c.post.call(this,b)}return this},on:function(a,b,d,c){this._events[a]=this._events[a]||[];if(b&&"function"===typeof b)return this._events[a].push({handler:b,context:d,once:c}),this;throw Error("Handler specified isn't a callable function");},once:function(a,b,d){return this.on(a,b,d,!0)},detach:function(a,b,d){if(b&&"function"===typeof b){var c;if(c=this._events[a])for(a=c.length-1;0<=a;a--)c[a].handler!==b||d&&d!==c[a].context||c.splice(a,1);return this}throw Error("Handler specified isn't a callable function");}});
RightNow.RequiredLabel=function(){var a=new EJS({text:'<span class="rn_Required" aria-label="<%= requiredLabel %>"><%= requiredMarkLabel %></span>'});EJS.Helpers.prototype.getRequiredLabel=function(b,c){return a.render({requiredLabel:b||RightNow.Interface.getMessage("REQUIRED_LBL"),requiredMarkLabel:c||RightNow.Interface.getMessage("FIELD_REQUIRED_MARK_LBL")})}};
RightNow.Widgets.ChatDisconnectButton=RightNow.Widgets.extend({constructor:function(){this._container=this.Y.one(this.baseSelector);this._disconnectButton=this.Y.one(this.baseSelector+"_Button");if(RightNow.Chat&&RightNow.Chat.Model)
{this._currentState=RightNow.Chat.Model.SEARCHING;}
if(this._container&&this._disconnectButton)
{this._disconnectButton.on("click",this._onButtonClick,this);RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);}},_onButtonClick:function(type,args)
{if(this._currentState!==RightNow.Chat.Model.ChatState.DISCONNECTED&&this._currentState!==RightNow.Chat.Model.ChatState.CANCELLED){RightNow.Event.fire("evt_chatHangupRequest",new RightNow.Event.EventObject(this,{data:{}}));}
else{RightNow.Event.fire("evt_chatCloseButtonClickRequest",new RightNow.Event.EventObject(this,{data:{closingUrl:this.data.attrs.close_redirect_url,openInWindow:this.data.attrs.open_in_window}}));}},_onChatStateChangeResponse:function(type,args)
{var currentState=args[0].data.currentState;var previousState=args[0].data.previousState;var ChatState=RightNow.Chat.Model.ChatState;if(currentState===ChatState.CONNECTED&&previousState!==ChatState.CONNECTED)
{RightNow.UI.show(this._container);}
else if(currentState===ChatState.CANCELLED||currentState===ChatState.DISCONNECTED)
{if(this.data.attrs.mobile_mode||!window.opener)
{RightNow.UI.hide(this._container);}
else
{this._disconnectButton.set('innerHTML',new EJS({text:this.getStatic().templates.closeButton}).render({attrs:this.data.attrs})).set('title',this.data.attrs.label_tooltip_close);}}
this._currentState=currentState;}});
RightNow.Widgets.ChatServerConnect=RightNow.Widgets.extend({constructor:function(){this._resumeSessionDialog=null;this._miscellaneousData=null;this._validChatRequest=true;this._connectionStatus=this.Y.one(this.baseSelector+"_ConnectionStatus");this._connectingIconElem=this.Y.one(this.baseSelector+"_ConnectingIcon");this._errorMessageDiv=this.Y.one(this.baseSelector+"_ErrorLocation");this._startPersistentChat=false;if(this.Y.one(this.baseSelector+"_Connector")){RightNow.Event.subscribe("evt_chatEventBusInitializedResponse",this._validateChatParameters,this);RightNow.Event.subscribe("evt_chatConnectResponse",this._onChatConnectResponse,this);RightNow.Event.subscribe("evt_chatFetchUpdateResponse",this._onFetchUpdateResponse,this);RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);RightNow.Event.subscribe("evt_chatSetParametersResponse",this._onChatSetParametersResponse,this);RightNow.Event.subscribe("evt_startPersistentChatRequest",this._onStartPersistentChatRequest,this);RightNow.Event.subscribe("evt_chatValidateParametersResponse",this._onChatValidateParametersResponse,this);RightNow.Event.subscribe("evt_chatCheckAnonymousResponse",this._onChatCheckAnonymousResponse,this);}
if(this.data.attrs.is_persistent_chat){this._ls=RightNow.Chat.LS;}
if(RightNow.Chat&&RightNow.Chat.UI&&RightNow.Chat.UI.EventBus!==null&&RightNow.Chat.UI.EventBus.isEventBusInitialized!==undefined&&RightNow.Chat.UI.EventBus.isEventBusInitialized()){this._validateChatParameters();}},_validateChatParameters:function(){var eventObject;this._setMiscellaneousData();eventObject=new RightNow.Event.EventObject(this,{data:{email:this.data.js.contactEmail||RightNow.Url.getParameter("Contact.Email.0.Address"),prod:RightNow.Url.getParameter("p"),cat:RightNow.Url.getParameter("c"),miscellaneousData:this._miscellaneousData,customFields:this.data.js.customFields}});RightNow.Event.fire("evt_chatValidateParametersRequest",eventObject);this._checkAnonymousRequest();this._displayErrors();this._setChatParameters();},_onChatValidateParametersResponse:function(type,args){var eventObject=args[0];this._validChatRequest=eventObject.data.valid;if(this._validChatRequest){return;}
if(!this._errorMessages)
this._errorMessages=[];this._errorMessages.push(this.data.attrs.label_validation_fail);},_checkAnonymousRequest:function(){if(!this.data.attrs.first_name_required&&!this.data.attrs.last_name_required&&!this.data.attrs.email_required)
return;var eventObject=new RightNow.Event.EventObject(this,{data:{firstName:this.data.js.contactFirstName||RightNow.Url.getParameter("Contact.Name.First")||RightNow.Url.getParameter("contacts.first_name"),firstNameRequired:this.data.attrs.first_name_required,lastName:this.data.js.contactLastName||RightNow.Url.getParameter("Contact.Name.Last")||RightNow.Url.getParameter("contacts.last_name"),lastNameRequired:this.data.attrs.last_name_required,email:this.data.js.contactEmail||RightNow.Url.getParameter("Contact.Email.0.Address")||RightNow.Url.getParameter("contacts.email"),emailRequired:this.data.attrs.email_required}});RightNow.Event.fire("evt_chatCheckAnonymousRequest",eventObject);},_onChatCheckAnonymousResponse:function(type,args){var eventObject=args[0];if(!eventObject.data.anonymousRequest)
return;if(!this._errorMessages)
this._errorMessages=[];this._errorMessages.push(this.data.attrs.label_prevent_anonymous_chat);this._validChatRequest=false;},_displayErrors:function()
{if(this._validChatRequest||!this._errorMessages||this._errorMessages.length<=0)
return;var errorMessageList=this.Y.Node.create(new EJS({text:this.getStatic().templates.errorMessageList}).render({errors:this._errorMessages,attrs:this.data.attrs}));this._errorMessageDiv.appendChild(errorMessageList);this._errorMessageDiv.addClass("rn_MessageBox").addClass("rn_ErrorMessage").removeClass("rn_Hidden").scrollIntoView();RightNow.UI.hide(this._connectionStatus);},_setChatParameters:function(){if(!this._validChatRequest)
return;var surveyCompID=RightNow.Url.getParameter("survey_comp_id");var surveyTermID=RightNow.Url.getParameter("survey_term_id");var surveyCompAuth=RightNow.Url.getParameter("survey_comp_auth");var surveyTermAuth=RightNow.Url.getParameter("survey_term_auth");var eventObject=new RightNow.Event.EventObject(this,{data:{connectionData:{absentInterval:RightNow.Interface.getConfig("ABSENT_INTERVAL","RNL"),absentRetryCount:RightNow.Interface.getConfig("USER_ABSENT_RETRY_COUNT","RNL"),chatServerHost:RightNow.Interface.getConfig("SRV_CHAT_HOST","RNL"),chatServerPort:RightNow.Interface.getConfig("SERVLET_HTTP_PORT","RNL"),dbName:RightNow.Interface.getConfig("DB_NAME","COMMON"),useHttps:window.location.protocol.indexOf('https:')===0},surveyBaseUrl:this.data.js.maUrl,agentAbsentRetryCount:RightNow.Interface.getConfig("AGENT_ABSENT_RETRY_COUNT","RNL"),terminateChatSessionString:this.data.attrs.label_terminate_session}});if(surveyCompID)
eventObject.data.surveyCompID=surveyCompID;if(surveyTermID)
eventObject.data.surveyTermID=surveyTermID;if(surveyCompAuth)
eventObject.data.surveyCompAuth=surveyCompAuth;if(surveyTermAuth)
eventObject.data.surveyTermAuth=surveyTermAuth;RightNow.Event.fire("evt_chatSetParametersRequest",eventObject);},_onStartPersistentChatRequest:function(type,args){this._startPersistentChat=true;},_onChatSetParametersResponse:function(type,args){this._connect();},_connect:function(resume,type){var subject=RightNow.Url.getParameter('Incident.Subject')||RightNow.Url.getParameter("incidents.subject");if(subject===null||subject===''){subject=this.data.js.postedSubject;}
if(this.data.attrs.is_persistent_chat){var udata={};if(this._startPersistentChat){udata.s=subject=this.Y.one('#rn_PersistentChatLaunchForm input[name="Incident.Subject"]').get('value');if(!this.data.attrs.is_anonymous&&!RightNow.Profile.isLoggedIn()){udata.fn=this.data.js.contactFirstName=this.Y.one('#rn_PersistentChatLaunchForm input[name="Contact.Name.First"]').get('value');udata.ln=this.data.js.contactLastName=this.Y.one('#rn_PersistentChatLaunchForm input[name="Contact.Name.Last"]').get('value');udata.em=this.data.js.contactEmail=this.Y.one('#rn_PersistentChatLaunchForm input[name="Contact.Emails.PRIMARY.Address"]').get('value');}
if(RightNow.Profile.isLoggedIn()){udata.fn=this.data.js.contactFirstName;udata.ln=this.data.js.contactLastName;udata.em=this.data.js.contactEmail;}
this._ls.setItem(this._ls._udataKey,udata);}
else{try{udata=this._ls.getItem(this._ls._udataKey)
subject=udata.s;this.data.js.contactFirstName=udata.fn?udata.fn:undefined;this.data.js.contactLastName=udata.ln?udata.ln:undefined;this.data.js.contactEmail=udata.em?udata.em:undefined;}catch(e){}}}
var eventObject=new RightNow.Event.EventObject(this,{data:{interfaceID:this.data.js.interfaceID,firstName:this.data.js.contactFirstName||RightNow.Url.getParameter("Contact.Name.First")||RightNow.Url.getParameter("contacts.first_name"),lastName:this.data.js.contactLastName||RightNow.Url.getParameter("Contact.Name.Last")||RightNow.Url.getParameter("contacts.last_name"),email:this.data.js.contactEmail||RightNow.Url.getParameter("Contact.Email.0.Address")||RightNow.Url.getParameter("contacts.email"),contactID:this.data.js.contactID,organizationID:this.data.js.organizationID,subject:subject,prod:this.data.js.postedProduct||RightNow.Url.getParameter("p")||RightNow.Url.getParameter("incidents.prod"),cat:this.data.js.postedCategory||RightNow.Url.getParameter("c")||RightNow.Url.getParameter("incidents.cat"),resume:resume,queueID:RightNow.Url.getParameter("q_id"),requestSource:this.data.js.requestSource,surveySendID:RightNow.Url.getParameter("survey_send_id"),surveySendDelay:RightNow.Url.getParameter("survey_send_delay"),surveySendAuth:RightNow.Url.getParameter("survey_send_auth"),sessionID:this.data.js.sessionID,miscellaneousData:this._miscellaneousData,incidentID:RightNow.Url.getParameter("i_id"),routingData:this.data.js.chat_data||RightNow.Url.getParameter("chat_data"),referrerUrl:this._getReferrerUrl(),coBrowsePremiumSupported:typeof CoBrowseLauncher!=="undefined"&&CoBrowseLauncher.isEnvironmentSupported(CoBrowseLauncher.getEnvironment())?0:1,isSpider:this.data.js.isSpider}});RightNow.Event.fire("evt_chatConnectRequest",eventObject);},_setMiscellaneousData:function(){if(this._miscellaneousData)
return;this._miscellaneousData=[];for(var customFieldID in this.data.js.customFields){var customField=this.data.js.customFields[customFieldID],columnName=customField.col_name.split("c$")[1],postedCustomFieldName="Incident_CustomFields_c_"+columnName,urlCustomFieldName="Incident.CustomFields.c."+columnName,url2CustomFieldName="incidents.c$"+columnName,postedCustomFields=this.data.js.postedCustomFields||{},Url=RightNow.Url,customFieldValue=postedCustomFields[postedCustomFieldName]||Url.getParameter(urlCustomFieldName)||Url.getParameter(url2CustomFieldName);if(customFieldValue===null&&(customField.data_type===this.data.js.dateField||customField.data_type===this.data.js.dateTimeField)){var year=postedCustomFields[postedCustomFieldName+"_year"]||Url.getParameter(urlCustomFieldName+"_year"),month=postedCustomFields[postedCustomFieldName+"_month"]||Url.getParameter(urlCustomFieldName+"_month"),day=postedCustomFields[postedCustomFieldName+"_day"]||Url.getParameter(urlCustomFieldName+"_day"),hour=postedCustomFields[postedCustomFieldName+"_hour"]||Url.getParameter(urlCustomFieldName+"_hour"),minute=postedCustomFields[postedCustomFieldName+"_minute"]||Url.getParameter(urlCustomFieldName+"_minute");if(year!==null)
this._miscellaneousData[urlCustomFieldName]=year||month||day?[[year,month,day].join("-"),hour||minute?[hour,minute].join(":"):""].join(" "):null;continue;}
else if(customField.data_type===this.data.js.radioField){customFieldValue=customFieldValue==="true"?"1":customFieldValue==="false"?"0":customFieldValue;}
if(customFieldValue!==null)
this._miscellaneousData[urlCustomFieldName]=customFieldValue;}},_getReferrerUrl:function(){var referrerUrl;if(this.data.js.referrerUrl!=null){referrerUrl=this.data.js.referrerUrl;}
else{var chatData=RightNow.Text.Encoding.base64Decode(RightNow.Url.getParameter("chat_data"));var dataValues=chatData.split('&');for(var index=0;index<dataValues.length;index++){var value=dataValues[index].split('=');if(value[0]==="referrerUrl"){referrerUrl=decodeURIComponent(value[1]);break;}}
if(!referrerUrl){referrerUrl=document.referrer;if(!referrerUrl&&window.opener&&window.opener.location){try{referrerUrl=window.opener.location.href;}catch(e){}}}}
return referrerUrl;},_onChatConnectResponse:function(type,args){var eventObject=args[0];var messageElement=this.Y.one(this.baseSelector+"_Message");RightNow.UI.hide(this._connectingIconElem);if(eventObject.data.connected){if(messageElement)
messageElement.set("innerHTML",this.data.attrs.label_connection_success);}
else if(messageElement){messageElement.set("innerHTML",this.data.attrs.label_connection_fail);}
if(eventObject.data.connected&&eventObject.data.existingSession){if(this.data.attrs.is_persistent_chat){this._connect(true);}
else{this._displayResumeSessionDialog();return;}}
if(eventObject.data.connected){this._fetchUpdate();}},_displayResumeSessionDialog:function(){var buttons=[{text:RightNow.Interface.getMessage("OK_LBL"),handler:{fn:this._resumeSession,scope:this},isDefault:true},{text:RightNow.Interface.getMessage("CANCEL_LBL"),handler:{fn:this._startNewSession,scope:this},isDefault:false}];var dialogBody=this.Y.Node.create("<div>").addClass("rn_dialogLeftAlign").addClass("rn_ChatResumeSessionDialog").set("innerHTML",RightNow.Interface.getMessage("EXISTING_CHAT_SESS_FND_RESUME_SESS_MSG"));this._resumeSessionDialog=RightNow.UI.Dialog.actionDialog(RightNow.Interface.getMessage("EXISTING_CHAT_SESSION_LBL"),dialogBody,{"buttons":buttons});RightNow.UI.Dialog.addDialogEnterKeyListener(this._resumeSessionDialog,this._resumeSession,this);this._resumeSessionDialog.show();},_resumeSession:function(){this._resumeSessionDialog.hide();this._connect(true);},_startNewSession:function(){this._resumeSessionDialog.hide();this._connect(false);},_fetchUpdate:function(){RightNow.Event.fire("evt_chatFetchUpdateRequest",new RightNow.Event.EventObject(this,{data:{}}));},_onFetchUpdateResponse:function(){this._fetchUpdate();},_onChatStateChangeResponse:function(type,args){RightNow.UI.hide(this.baseSelector);}});
RightNow.Widgets.ChatEngagementStatus=RightNow.Widgets.extend({constructor:function(){this._currentState=null;this._previousState=null;this._reason=null;this._widgetElement=this.Y.one(this.baseSelector);if(this.Y.UA.ie>0&&this.Y.UA.ie<=8)
{this._onChatStateChangeResponse(null,[{'data':{'currentState':RightNow.Chat.Model.ChatState.DISCONNECTED,'reason':RightNow.Chat.Model.ChatDisconnectReason.BROWSER_UNSUPPORTED}}]);return;}
if(this._widgetElement)
{RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);this._widgetElement.setAttribute("aria-live","assertive").setAttribute("role","alert");}
if(this.data.attrs.is_persistent_chat)
{this._ls=RightNow.Chat.LS;if(this._ls.isSupported)
{this._ls.attachStoreEvent();}}},_onChatStateChangeResponse:function(type,args)
{this._currentState=args[0].data.currentState;this._previousState=args[0].data.previousState;this._reason=args[0].data.reason;if(this.data.attrs.is_persistent_chat&&this._ls.isSupported)
{var data={currentState:this._currentState,previousState:this._previousState,reason:this._reason,type:'CHAT_CONNECT_STATUS',chatWindowId:this._ls._thisWindowId};this._ls.setItem(this._ls._connectStatusKey,data);}
this._updateStatus();RightNow.UI.show(this._widgetElement);this._updateSearchingDetail();this._updateRequeuedDetail();this._updateCanceledDetail();},_updateStatus:function()
{var statusElement=this.Y.one(this.baseSelector+"_Status");if(!statusElement)
return;var ChatState=RightNow.Chat.Model.ChatState;switch(this._currentState)
{case ChatState.SEARCHING:case ChatState.REQUEUED:{statusElement.set("innerHTML",this.data.attrs.label_status_searching);break;}
case ChatState.CONNECTED:{statusElement.set("innerHTML",this.data.attrs.label_status_connected);break;}
case ChatState.RECONNECTING:{if(this._previousState===RightNow.Chat.Model.CONNECTED)
statusElement.set("innerHTML",this.data.attrs.label_status_reconnecting);break;}
case ChatState.CANCELLED:case ChatState.DEQUEUED:{statusElement.set("innerHTML",this.data.attrs.label_status_canceled);break;}
case ChatState.DISCONNECTED:{if(this._reason&&this._reason==='RECONNECT_FAILED')
statusElement.set("innerHTML",RightNow.Interface.getMessage("COMM_RN_LIVE_SERV_LOST_CHAT_SESS_MSG"));else
statusElement.set("innerHTML",this.data.attrs.label_status_disconnected);break;}}},_updateSearchingDetail:function()
{var searchingDetailElement=this.Y.one(this.baseSelector+"_Searching");if(!searchingDetailElement)
return;var ChatState=RightNow.Chat.Model.ChatState;if(this._currentState===ChatState.RECONNECTING)
return;if(this._currentState==ChatState.SEARCHING||this._currentState==ChatState.REQUEUED)
{RightNow.UI.show(searchingDetailElement);}
else
{RightNow.UI.hide(searchingDetailElement);RightNow.Event.fire('evt_chatQueueSearchEnd',new RightNow.Event.EventObject(this,{}));}},_updateRequeuedDetail:function()
{var requeuedDetailElement=this.Y.one(this.baseSelector+"_Requeued");if(!requeuedDetailElement)
return;var ChatState=RightNow.Chat.Model.ChatState;if(this._currentState===ChatState.RECONNECTING)
return;if(this._currentState==ChatState.REQUEUED)
RightNow.UI.show(requeuedDetailElement);else
RightNow.UI.hide(requeuedDetailElement);},_updateCanceledDetail:function()
{var canceledUserDetailElement=this.Y.one(this.baseSelector+"_Canceled_User");var canceledSelfServiceDetailElement=this.Y.one(this.baseSelector+"_Canceled_Self_Service");var canceledNoAgentsAvailDetailElement=this.Y.one(this.baseSelector+"_Canceled_NoAgentsAvail");var canceledQueueTimeoutDetailElement=this.Y.one(this.baseSelector+"_Canceled_Queue_Timeout");var canceledDequeuedDetailElement=this.Y.one(this.baseSelector+"_Canceled_Dequeued");var canceledBrowserDetailElement=this.Y.one(this.baseSelector+"_Canceled_Browser");var ChatState=RightNow.Chat.Model.ChatState;var ChatDisconnectReason=RightNow.Chat.Model.ChatDisconnectReason;if(this._currentState===ChatState.RECONNECTING)
return;if(this._currentState==ChatState.CANCELLED)
{if(canceledUserDetailElement&&this._reason===ChatDisconnectReason.ENDED_USER_CANCEL)
RightNow.UI.show(canceledUserDetailElement);else if(canceledSelfServiceDetailElement&&this._reason===ChatDisconnectReason.ENDED_USER_DEFLECTED)
RightNow.UI.show(canceledSelfServiceDetailElement);else if(canceledNoAgentsAvailDetailElement&&this._reason===ChatDisconnectReason.FAIL_NO_AGENTS_AVAIL)
RightNow.UI.show(canceledNoAgentsAvailDetailElement);else if(canceledQueueTimeoutDetailElement&&this._reason===ChatDisconnectReason.QUEUE_TIMEOUT)
RightNow.UI.show(canceledQueueTimeoutDetailElement);}
else if(this._currentState==ChatState.DEQUEUED&&canceledDequeuedDetailElement)
{RightNow.UI.show(canceledDequeuedDetailElement);}
else if(this._currentState===ChatState.DISCONNECTED&&this._reason===ChatDisconnectReason.NO_AGENTS_AVAILABLE&&canceledUserDetailElement)
{RightNow.UI.show(canceledNoAgentsAvailDetailElement);}
else if(this._currentState===ChatState.DISCONNECTED&&typeof ChatDisconnectReason.BROWSER_UNSUPPORTED!=='undefined'&&this._reason===ChatDisconnectReason.BROWSER_UNSUPPORTED&&canceledBrowserDetailElement)
{RightNow.UI.show(canceledBrowserDetailElement);}
else
{if(canceledUserDetailElement)
RightNow.UI.hide(canceledUserDetailElement);if(canceledSelfServiceDetailElement)
RightNow.UI.hide(canceledSelfServiceDetailElement);if(canceledNoAgentsAvailDetailElement)
RightNow.UI.hide(canceledNoAgentsAvailDetailElement);if(canceledQueueTimeoutDetailElement)
RightNow.UI.hide(canceledQueueTimeoutDetailElement);if(canceledDequeuedDetailElement)
RightNow.UI.hide(canceledDequeuedDetailElement);}}});
RightNow.Widgets.ChatQueueWaitTime=RightNow.Widgets.extend({constructor:function(){RightNow.Event.subscribe("evt_chatEventBusInitializedResponse",this._initialize,this);this._estimatedWaitTimeDisplayed=false;this._queueWaitTimeContainer=this.Y.one(this.baseSelector);this._queuePositionElement=this.Y.one(this.baseSelector+"_QueuePosition");this._estimatedWaitTimeElement=this.Y.one(this.baseSelector+"_EstimatedWaitTime");this._averageWaitTimeElement=this.Y.one(this.baseSelector+"_AverageWaitTime");this._leaveScreenWarningElement=this.Y.one(this.baseSelector+"_BrowserWarning");if(this._queuePositionElement||this._estimatedWaitTimeElement||this._averageWaitTimeElement){RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);RightNow.Event.subscribe("evt_chatQueuePositionNotificationResponse",this._onChatQueuePositionNotificationResponse,this);}
RightNow.Event.subscribe("evt_chatReconnectUpdateResponse",this._reconnectUpdateResponse,this);this._displayQueuePosition=this._queuePositionElement&&(this.data.attrs.type==='position'||this.data.attrs.type==='all');this._displayEstimatedWaitTime=this._estimatedWaitTimeElement&&(this.data.attrs.type==='estimated'||this.data.attrs.type==='all');this._displayAverageWaitTime=this._averageWaitTimeElement&&(this.data.attrs.type==='average'||this.data.attrs.type==='all');if(RightNow.Chat&&RightNow.Chat.UI&&RightNow.Chat.UI.EventBus!==null&&RightNow.Chat.UI.EventBus.isEventBusInitialized!==undefined&&RightNow.Chat.UI.EventBus.isEventBusInitialized())
{this._initialize();}},_initialize:function()
{var uiUtils=RightNow.Chat.UI.Util;this._queuePositionMsg=uiUtils.doPositionAndWaitTimeVariableSubstitution(this.data.attrs.label_queue_position,this.instanceID+"_QueuePosition",RightNow.Interface.getConfig("ESTIMATED_WAIT_TIME_SAMPLES","RNL"));this._estimatedWaitTimeMsg=uiUtils.doPositionAndWaitTimeVariableSubstitution(this.data.attrs.label_estimated_wait_time,this.instanceID+"_EstimatedWaitTime",RightNow.Interface.getConfig("ESTIMATED_WAIT_TIME_SAMPLES","RNL"));this._averageWaitTimeMsg=uiUtils.doPositionAndWaitTimeVariableSubstitution(this.data.attrs.label_average_wait_time,this.instanceID+"_AverageWaitTime",RightNow.Interface.getConfig("ESTIMATED_WAIT_TIME_SAMPLES","RNL"));this._queuePositionElement.setAttribute("aria-live","polite").setAttribute("aria-atomic","true");this._estimatedWaitTimeElement.setAttribute("aria-live","polite").setAttribute("aria-atomic","true");this._averageWaitTimeElement.setAttribute("aria-live","polite").setAttribute("aria-atomic","true");if(uiUtils.hasLeaveScreenIssues())
{RightNow.UI.show(this._leaveScreenWarningElement);}},_onChatStateChangeResponse:function(type,args)
{if(args[0].data.currentState===RightNow.Chat.Model.ChatState.SEARCHING||args[0].data.currentState===RightNow.Chat.Model.ChatState.REQUEUED)
{this._estimatedWaitTimeDisplayed=false;if(this._displayQueuePosition)
{this._queuePositionElement.set('innerHTML',this.data.attrs.label_queue_position_not_available);RightNow.UI.show(this._queuePositionElement);}
if(this._displayEstimatedWaitTime)
{this._estimatedWaitTimeElement.set('innerHTML',this.data.attrs.label_estimated_wait_time_not_available);RightNow.UI.show(this._estimatedWaitTimeElement);}
if(this._displayAverageWaitTime)
{this._averageWaitTimeElement.set('innerHTML',this.data.attrs.label_average_wait_time_not_available);RightNow.UI.show(this._averageWaitTimeElement);}
RightNow.UI.show(this._queueWaitTimeContainer);}
else if(args[0].data.currentState===RightNow.Chat.Model.ChatState.RECONNECTING)
{return;}
else
{RightNow.UI.hide(this._queueWaitTimeContainer);}},_onChatQueuePositionNotificationResponse:function(type,args){this._updateQueuePosition(args[0].data.position);this._updateEstimatedWaitTime(args[0].data.expectedWaitSeconds);this._updateAverageWaitTime(args[0].data.averageWaitSeconds);},_updateQueuePosition:function(position)
{if(this._displayQueuePosition)
{this._updateQueuePositionMessage(position);this._updateQueuePositionValue(position);}},_updateQueuePositionMessage:function(position)
{this._queuePositionElement.set('innerHTML',position>0?this._queuePositionMsg:this.data.attrs.label_queue_position_not_available);},_updateQueuePositionValue:function(position)
{var queuePositionValueElem=this.Y.one(this.baseSelector+"_QueuePosition_QueuePosition");if(!queuePositionValueElem)
return;queuePositionValueElem.set('innerHTML',position>0?position:"");},_updateEstimatedWaitTime:function(estimatedWaitSeconds)
{if(this._displayEstimatedWaitTime)
{this._updateEstimatedWaitTimeMessage(estimatedWaitSeconds);this._updateEstimatedWaitTimeValue(estimatedWaitSeconds);}},_updateEstimatedWaitTimeMessage:function(estimatedWaitSeconds)
{if(estimatedWaitSeconds>0)
{this._estimatedWaitTimeDisplayed=true;this._estimatedWaitTimeElement.set('innerHTML',this._estimatedWaitTimeMsg);}
else
{this._estimatedWaitTimeElement.set('innerHTML',(estimatedWaitSeconds==0&&!this._estimatedWaitTimeDisplayed?this.data.attrs.label_estimated_wait_time_not_available:this.data.attrs.label_estimated_wait_time_exceeded));}},_updateEstimatedWaitTimeValue:function(estimatedWaitSeconds)
{var estimatedWaitTimeValueElem=this.Y.one(this.baseSelector+"_EstimatedWaitTime_EstimatedWaitTime");if(!estimatedWaitTimeValueElem)
return;estimatedWaitTimeValueElem.set('innerHTML',estimatedWaitSeconds>0?RightNow.Chat.UI.Util.toIso8601Time(estimatedWaitSeconds):"");},_updateAverageWaitTime:function(averageWaitSeconds)
{if(this._displayAverageWaitTime)
{this._updateAverageWaitTimeMessage(averageWaitSeconds);this._updateAverageWaitTimeValue(averageWaitSeconds);}},_updateAverageWaitTimeMessage:function(averageWaitSeconds)
{this._averageWaitTimeElement.set('innerHTML',averageWaitSeconds>0?this._averageWaitTimeMsg:this.data.attrs.label_average_wait_time_not_available);},_updateAverageWaitTimeValue:function(averageWaitSeconds)
{var averageWaitTimeValueElem=this.Y.one(this.baseSelector+"_AverageWaitTime_AverageWaitTime");if(!averageWaitTimeValueElem)
return;averageWaitTimeValueElem.set('innerHTML',averageWaitSeconds>0?RightNow.Chat.UI.Util.toIso8601Time(averageWaitSeconds):"");},_reconnectUpdateResponse:function(type,args)
{if(this._displayQueuePosition)
{this._queuePositionElement.set('innerHTML',RightNow.Interface.getMessage("COMM_RN_LIVE_SERV_LOST_PLS_WAIT_MSG")+" "+RightNow.Interface.getMessage("DISCONNECTION_IN_0_SECONDS_MSG").replace("{0}",args[0].data.secondsLeft));RightNow.UI.show(this._queuePositionElement);}}});
RightNow.Widgets.VirtualAssistantAvatar=RightNow.Widgets.extend({constructor:function(){RightNow.Event.subscribe('evt_chatPostResponse',this._onChatPostResponse,this);RightNow.Event.subscribe('evt_chatEngagementParticipantAddedResponse',this._onChatEngagementParticipantAddedResponse,this);RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);this.baseElement=this.Y.one(this.baseSelector);this.emotionElement=this.Y.one(this.baseSelector+' .rn_Emotion');this.previousEmotion='';this.displayAvatar=false;},_onChatPostResponse:function(type,args){if(!args[0].data.isEndUserPost&&args[0].data.vaResponse!==undefined&&args[0].data.vaResponse!==null){var vaResponse=args[0].data.vaResponse,emotion=vaResponse.emotion;if(this.previousEmotion!==''){this.emotionElement.removeClass(this.previousEmotion);}
this.emotionElement.addClass(emotion);this.previousEmotion=emotion;}},_onChatEngagementParticipantAddedResponse:function(type,args){var vaMode=(args[0].data.virtualAgent===undefined)?false:args[0].data.virtualAgent;if(vaMode===false){if(this.data.attrs.default_chat_avatar!==''){this.emotionElement.addClass(this.data.attrs.default_chat_avatar);}
else{this.baseElement.addClass('rn_Hidden');}}
else{if(this.data.attrs.default_chat_avatar!==''){this.emotionElement.removeClass(this.data.attrs.default_chat_avatar);}
this.displayAvatar=true;}
if(this.displayAvatar)
this.baseElement.removeClass('rn_Hidden');},_onChatStateChangeResponse:function(type,args){var eventObject=args[0];if(eventObject.data.currentState===RightNow.Chat.Model.ChatState.REQUEUED)
this.baseElement.addClass('rn_Hidden');}});
RightNow.Widgets.VirtualAssistantBanner=RightNow.Widgets.extend({constructor:function(){RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);RightNow.Event.subscribe("evt_chatPostResponse",this._onChatPostResponse,this);RightNow.Event.subscribe("evt_chatEngagementParticipantAddedResponse",this._onChatEngagementParticipantAddedResponse,this);this.baseElement=this.Y.one(this.baseSelector);this.bannerElement=this.Y.one(this.baseSelector+"_Banner");this.bannerElement.setAttribute('aria-live','polite');this._vaMode=false;},_onChatStateChangeResponse:function(type,args)
{if(!RightNow.Event.fire("evt_handleChatStateChange",new RightNow.Event.EventObject(this,{data:args[0].data})))
return;var currentState=args[0].data.currentState,ChatState=RightNow.Chat.Model.ChatState;switch(currentState)
{case ChatState.REQUEUED:case ChatState.CANCELED:case ChatState.DISCONNECTED:case ChatState.RECONNECTING:this.baseElement.addClass("rn_Hidden");break;case ChatState.CONNECTED:if(this._vaMode===true){this.baseElement.removeClass("rn_Hidden");}
break;}},_onChatPostResponse:function(type,args){if(!args[0].data.isEndUserPost&&args[0].data.vaResponse!==undefined&&args[0].data.vaResponse!==null){var vaResponse=args[0].data.vaResponse;if(vaResponse.banners&&vaResponse.banners.length>0){var templateData=new EJS({text:this.getStatic().templates.view}).render(vaResponse.banners[0]);this.bannerElement.set("innerHTML",templateData);if(vaResponse.banners[0].targetUrl){this.bannerElement.detach('click',this._onClick);this.bannerElement.on('click',this._onClick,this,vaResponse.banners[0].id);}}
else{this.bannerElement.empty();}}},_onClick:function(type,args){var eventData={method:'banner_click',package:{id:args}};RightNow.Event.fire('evt_chatPostOutOfBandDataRequest',new RightNow.Event.EventObject(this,{data:eventData}));},_onChatEngagementParticipantAddedResponse:function(type,args){this._vaMode=(args[0].data.virtualAgent===undefined)?false:args[0].data.virtualAgent;if(this._vaMode===true){this.baseElement.removeClass("rn_Hidden");}
else{this.baseElement.addClass("rn_Hidden");}}});
RightNow.Widgets.ChatAgentStatus=RightNow.Widgets.extend({constructor:function(){this._container=this.Y.one(this.baseSelector);this._roster=this.Y.one(this.baseSelector+"_Roster");if(this._container&&this._roster)
{RightNow.Event.subscribe("evt_chatAgentStatusChangeResponse",this._onChatAgentStatusChangeResponse,this);RightNow.Event.subscribe("evt_chatEngagementParticipantAddedResponse",this._onChatEngagementParticipantAddedResponse,this);RightNow.Event.subscribe("evt_chatEngagementParticipantRemovedResponse",this._onChatEngagementParticipantRemovedResponse,this);RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);}},_onChatEngagementParticipantAddedResponse:function(type,args)
{if(!args[0].data.agent)
return;var agent=args[0].data.agent;this._roster.appendChild(this.Y.Node.create(new EJS({text:this.getStatic().templates.participantAddedResponse}).render({attrs:this.data.attrs,instanceID:this.instanceID,agentName:this.data.attrs.agent_id.replace(/{display_name}/g,agent.name),clientID:agent.clientID})));this._roster.setAttribute('aria-live','polite');RightNow.UI.show(this._container);},_onChatEngagementParticipantRemovedResponse:function(type,args)
{if(!args[0].data.agent)
return;var agent=args[0].data.agent;var element=this.Y.one(this.baseSelector+'_Agent_'+agent.clientID);if(element)
element.remove();},_onChatAgentStatusChangeResponse:function(type,args)
{if(!args[0].data.agent)
return;var agent=args[0].data.agent;var newStatusString="";switch(agent.activityStatus)
{case RightNow.Chat.Model.ChatActivityState.RESPONDING:newStatusString=this.data.attrs.label_status_responding;break;case RightNow.Chat.Model.ChatActivityState.LISTENING:newStatusString=this.data.attrs.label_status_listening;break;case RightNow.Chat.Model.ChatActivityState.ABSENT:newStatusString=this.data.attrs.label_status_absent;break;}
var statusElement=this.Y.one(this.baseSelector+'_AgentStatus_'+agent.clientID);if(statusElement)
{statusElement.setHTML(this.data.attrs.agent_id.replace(/{display_name}/g,agent.name)+"&nbsp;("+newStatusString+")");}},_onChatStateChangeResponse:function(type,args)
{if(!args[0].data.currentState)
return;var currentState=args[0].data.currentState;var ChatState=RightNow.Chat.Model.ChatState;if(currentState===ChatState.CANCELLED||currentState===ChatState.DISCONNECTED||currentState===ChatState.REQUEUED)
RightNow.UI.hide(this._container);}});
RightNow.Widgets.ChatTranscript=RightNow.Widgets.extend({constructor:function(){this._transcriptContainer=this.Y.one(this.baseSelector);this._transcript=this.Y.one(this.baseSelector+'_Transcript');this._anchorRE=new RegExp(/(<a .*?>(.*?)<\/a>)/i);this._hrefRE=new RegExp(/href\s*=\s*['"](.+?)['"]/i);this._titleRE=new RegExp(/title\s*=\s*['"](.+?)['"]/i);this._urlRE=new RegExp(/((http[s]?:\/\/|ftp:\/\/)|(www\.)|(ftp\.))([^\s<>\.\/^{^}]+)\.([^\s<>^{^}]+)/i);this._quotedUrlRE=new RegExp(/['"]+((http[s]?:\/\/|ftp:\/\/)|(www\.)|(ftp\.))([^\s<>\.\/]+)\.([^\s<>]+)['"]+/i);this._tagRE=new RegExp(/(<\/?[\w]+[^>]*>)/i);this._tagBR=new RegExp(/(<\/?br\s*>)/ig);this._endUserName='';this._messageIds={};this._active=true;if(this._transcript)
{if(!this.data.attrs.mobile_mode)
{RightNow.Event.subscribe("evt_chatCobrowseAcceptResponse",this._coBrowseAcceptResponse,this);RightNow.Event.subscribe("evt_fileUploadUpdateResponse",this._fileUploadResponse,this);RightNow.Event.subscribe("evt_chatNotifyFattachUpdateResponse",this._fileNotifyResponse,this);}
RightNow.Event.subscribe("evt_chatCobrowseStatusResponse",this._coBrowseStatusResponse,this);RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);RightNow.Event.subscribe("evt_chatPostResponse",this._onChatPostResponse,this);RightNow.Event.subscribe("evt_chatEngagementParticipantAddedResponse",this._onChatEngagementParticipantAddedResponse,this);RightNow.Event.subscribe("evt_chatEngagementParticipantRemovedResponse",this._onChatEngagementParticipantRemovedResponse,this);RightNow.Event.subscribe("evt_chatEngagementConcludedResponse",this._onChatEngagementConcludedResponse,this);RightNow.Event.subscribe("evt_chatCobrowseInvitationResponse",this._coBrowseInvitationResponse,this);RightNow.Event.subscribe("evt_chatCoBrowsePremiumInvitationResponse",this._coBrowsePremiumInvitationResponse,this);RightNow.Event.subscribe("evt_chatReconnectUpdateResponse",this._reconnectUpdateResponse,this);RightNow.Event.subscribe("evt_chatAgentAbsentUpdateResponse",this._agentAbsentUpdateResponse,this);RightNow.Event.subscribe("evt_chatAgentStatusChangeResponse",this._onAgentStatusChangeResponse,this);RightNow.Event.subscribe("evt_chatPostCompletion",this._onChatPostCompletion,this);RightNow.Event.subscribe("evt_chatCoBrowsePremiumAcceptResponse",this._coBrowseAcceptResponse,this);RightNow.Event.subscribe("evt_chatDisconnectNotification",this._onChatDisconnect,this);RightNow.Event.subscribe("evt_chatVideoChatStatusResponse",this._videoChatStatusResponse,this);RightNow.Event.subscribe("evt_chatVideoChatInvitationResponse",this._videoChatInvitationResponse,this);RightNow.Event.subscribe("evt_chatVideoChatAcceptResponse",this._videoChatAcceptResponse,this);this._preloadImages();this._transcript.setAttribute("aria-live","polite").setAttribute("role","log");var videoInlay=this.Y.one(".inlay-video-container")?this.Y.one(".inlay-video-container").ancestor():null;if(window.oit&&window.oit.allInlaysAreLoaded()){this._onOITLoaded();}else{document.addEventListener('inlay-oracle-chat-video-loaded',this._onOITLoaded.bind(this));}}
if(this.data.attrs.unread_messages_titlebar_enabled)
{this._unreadCount=0;this._windowFocused=document.hasFocus?document.hasFocus():false;this._baseTitle=document.title;var Event=this.Y.Event;if(this.Y.UA.ie>0)
{Event.attach("focusin",this._onApplicationFocus,document,this);Event.attach("focusout",this._onApplicationBlur,document,this);}
else
{Event.attach("focus",this._onApplicationFocus,window,this);Event.attach("blur",this._onApplicationBlur,window,this);}}
if(this.data.attrs.is_persistent_chat)
{this._ls=RightNow.Chat.LS;if(this._ls.isSupported)
{this._ls.attachStoreEvent();}
RightNow.Event.subscribe("evt_addChat",this._appendEJSToOtherChatWindow,this);RightNow.Event.subscribe("evt_notifyChatDisconnect",this._appendEJSToOtherChatWindow,this);}},_onOITLoaded:function(args){document.addEventListener('inlay-oracle-chat-video-statusNotification',this._videoChatStatusResponseInlay.bind(this));},_onChatDisconnect:function(type,args){if(this.data.attrs.is_persistent_chat)
{this._active=false;var messages=[];var context=null;if(args[0].data.isUserDisconnect)
{if(args[0].data.reason==='IDLE_TIMEOUT')
{messages.push(RightNow.Interface.getMessage("DISCONNECTED_CHAT_DUE_INACTIVITY_MSG"));}
else
{messages.push(this.data.attrs.label_you);messages.push(this.data.attrs.label_have_disconnected);context=args[0].data;}}
else
{var agent=args[0].data.agent;messages.push(agent.name);messages.push(this.data.attrs.label_has_disconnected);}
messages.push(this.data.attrs.label_restart_chat_text);var postData={attrs:null,messages:messages,context:context}
var _postData=JSON.parse(JSON.stringify(postData));var key=this._ls._disconnectPrefix+new Date().getTime();_postData.chatWindowId=this._ls._thisWindowId;_postData.type='CHAT_DISCONNECT';this._ls.setItem(key,_postData);setTimeout(function(){this._ls.removeItem(key);},5000);}},_onChatStateChangeResponse:function(type,args)
{var currentState=args[0].data.currentState;var previousState=args[0].data.previousState;var ChatState=RightNow.Chat.Model.ChatState;var newMessage=null;if(currentState===ChatState.CONNECTED)
RightNow.UI.show(this._transcriptContainer);else if(currentState===ChatState.RECONNECTING)
{this._stateBeforeReconnect=previousState;if(previousState===ChatState.CONNECTED)
newMessage=RightNow.Interface.getMessage("COMM_RN_LIVE_SERV_LOST_PLS_WAIT_MSG");}
else if(currentState===ChatState.DISCONNECTED&&(args[0].data.reason==='RECONNECT_FAILED'||args[0].data.reason==='ERROR'))
{newMessage=RightNow.Interface.getMessage("COMM_RN_LIVE_SERV_LOST_CHAT_SESS_MSG");if(this.data.attrs.is_persistent_chat)
{newMessage=null;}}
if(currentState===ChatState.DISCONNECTED||currentState===ChatState.REQUEUED){this._transcript.all('.rn_VideoChatAction').remove();}
if(currentState===ChatState.CONNECTED&&previousState===ChatState.RECONNECTING)
newMessage=RightNow.Interface.getMessage("CONNECTION_RESUMED_MSG");if(newMessage!==null)
{this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[newMessage],context:null});}},_onChatEngagementParticipantAddedResponse:function(type,args)
{var agent=args[0].data.agent;var role=args[0].data.role;var message="";if(role==="LEAD")
{if(RightNow.Chat.UI.Util.hasLeaveScreenIssues())
{this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[this.data.attrs.label_leave_screen_warning],context:null});}
this._transcript.all('.rn_VideoChatAction').remove();message=': '+agent.greeting;}
else
{message=' '+this.data.attrs.label_has_joined_chat;}
this._appendEJSToChat(this.getStatic().templates.participantAddedResponse,{template:'participantAddedResponse',attrs:this.data.attrs,agentName:this._getAgentIdString(args[0].data.agent.name),role:role,message:message,createdTime:args[0].data.createdTime});},_onChatEngagementParticipantRemovedResponse:function(type,args)
{var reason=args[0].data.reason;var agent=args[0].data.agent;if(!agent)
return;this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[this._getAgentIdString(agent.name),(args[0].data.reason===RightNow.Chat.Model.ChatDisconnectReason.TRANSFERRED_TO_QUEUE?this.data.attrs.label_has_disconnected:this.data.attrs.label_has_left_chat)],context:null});},_onChatPostResponse:function(type,args)
{var message=args[0].data.messageBody;var messageId=args[0].data.messageId;var isEndUserPost=args[0].data.isEndUserPost;var postID;var name;if(messageId!==undefined&&typeof(this._messageIds)!=="undefined"){if(this._messageIds[messageId]!==undefined)
return;this._messageIds[messageId]=1;}
if(!this.data.attrs.mobile_mode&&args[0].data.isEndUserPost===true)
message=this._formatLinks(message);else if(args[0].data.richText===undefined||args[0].data.richText===false){var txt=document.createElement("textarea");txt.innerHTML=message;message=this.Y.Escape.html(txt.value).replace(/\n/g,"<br/>");}
else if(!this.data.attrs.mobile_mode)
message=this._formatLinks(message);if(args[0].data.isOffTheRecord)
message=this.data.attrs.label_off_the_record+' '+message;if(args[0].data.isEndUserPost)
{postID='eup_'+messageId;this._setEndUserName(args);name=this._endUserName;}
else
{postID=args[0].data.serviceFinishTime;name=this._getAgentIdString(args[0].data.agent.name);}
this._appendEJSToChat(this.getStatic().templates.chatPostResponse,{template:'chatPostResponse',attrs:this.data.attrs,endUserName:name,agentName:name,message:message,createdTime:args[0].data.createdTime,context:args[0].data},postID);},_setEndUserName:function(args)
{if(!this._endUserName||this._endUserName==='')
{var endUser=args[0].data.endUser;if(endUser.firstName===null&&endUser.lastName===null)
{if(endUser.email===null)
this._endUserName=this.data.attrs.label_enduser_name_default_prefix;else
this._endUserName=endUser.email;}
else
{if(endUser.firstName!==null&&endUser.lastName!==null)
{var internationalNameOrder=RightNow.Interface.getConfig("intl_nameorder","COMMON");this._endUserName=internationalNameOrder?endUser.lastName+" "+endUser.firstName:endUser.firstName+" "+endUser.lastName;}
else if(endUser.firstName!==null)
{this._endUserName=endUser.firstName;}
else
{this._endUserName=endUser.lastName;}
this._endUserName+=RightNow.Interface.getMessage("NAME_SUFFIX_LBL");this._endUserName=this._endUserName.replace(/</g,"&lt;");this._endUserName=this._endUserName.replace(/>/g,"&gt;");}}},_onChatPostCompletion:function(type,args)
{var messageId=args[0];var timestamp=args[1];var post=this.Y.one('#eup_'+messageId);var insertNode;if(post)
{post.set('id',timestamp);if(post.previous()&&post.previous().get('id')>timestamp)
{insertNode=post.previous();post.remove();insertNode.insert(post,"before");}
else if(post.next()&&post.next().id<timestamp)
{insertNode=post.next();post.remove();insertNode.insert(post,"after");}}},_onChatEngagementConcludedResponse:function(type,args)
{var agent=args[0].data.agent;var messages=[];var context=null;this._transcript.all('.rn_CoBrowseAction').remove();this._transcript.all('.rn_VideoChatAction').remove();if(args[0].data.isUserDisconnect)
{if(args[0].data.reason==='IDLE_TIMEOUT')
messages.push(RightNow.Interface.getMessage("DISCONNECTED_CHAT_DUE_INACTIVITY_MSG"));else
{messages.push(this.data.attrs.label_you);messages.push(this.data.attrs.label_have_disconnected);context=args[0].data;}}
else
{messages.push(agent.name);messages.push(this.data.attrs.label_has_disconnected);}
if(this.data.attrs.is_persistent_chat)
{messages.push(this.data.attrs.label_restart_chat_text);}
this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:messages,context:context});},_fileNotifyResponse:function(type,args)
{this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[this.data.attrs.label_file_attachment_started],context:null});},_fileUploadResponse:function(type,args)
{var attachmentInfo=args[0];var message="";if(attachmentInfo.error!==0||attachmentInfo.errorMessage)
{message=this.data.attrs.label_file_attachment_error;}
else
{var fileName=attachmentInfo.name;var fileSize=Math.round((attachmentInfo.size/1024)*100)/100;message=this.data.attrs.label_file_attachment_received.replace("{0}",fileName).replace("{1}",fileSize+'KB');}
this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[message],context:null});},_agentAbsentUpdateResponse:function(type,args)
{if(args[0].data.requeueSeconds)
this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[RightNow.Interface.getMessage("REQUEUED_APPROXIMATELY_0_MSG").replace("{0}",args[0].data.requeueSeconds)],context:null});},_coBrowseInvitationResponse:function(type,args)
{var CoBrowseTypes=RightNow.Chat.Model.ChatCoBrowseType;var type=args[0].data.modeType;var coBrowseUrl=args[0].data.coBrowseUrl;var agent=args[0].data.agent;if(this.data.attrs.mobile_mode)
{RightNow.Widgets.ChatTranscript.sendCoBrowseResponse(false);}
else
{var message="";if(type===CoBrowseTypes.SCREEN||type===CoBrowseTypes.SCREEN_POINTER)
message=this.data.attrs.label_agent_requesting_view_desktop;else
message=this.data.attrs.label_agent_requesting_control_desktop;this._appendEJSToChat(this.getStatic().templates.cobrowseInvitationResponse,{template:'cobrowseInvitationResponse',attrs:this.data.attrs,message:message,agentName:agent.name,url:coBrowseUrl});}},_coBrowsePremiumInvitationResponse:function(type,args)
{var agentEnvironment=args[0].data.agentEnvironment;var coBrowseSessionId=args[0].data.coBrowseSessionId;var agent=args[0].data.agent;this._appendEJSToChat(this.getStatic().templates.CoBrowsePremiumInvitationResponse,{template:'CoBrowsePremiumInvitationResponse',attrs:this.data.attrs,message:this.data.attrs.label_agent_requesting_view_desktop,agentName:agent.name,agentEnvironment:agentEnvironment,coBrowseSessionId:coBrowseSessionId});this.Y.one(this.baseSelector).delegate('click',this.onAllowCoBrowsePremiumClick,'a.rn_CoBrowsePremiumAllow',this);this.Y.one(this.baseSelector).delegate('click',this.onDeclineCoBrowsePremiumClick,'a.rn_CoBrowsePremiumDecline',this);},_coBrowseAcceptResponse:function(type,args)
{var accepted=args[0].data.accepted;var message="";this._transcript.all('.rn_CoBrowseAction').remove();if(accepted)
message=this.data.attrs.label_initializing_screen_sharing_session;else
message=this.data.attrs.label_screen_sharing_session_declined;this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[message],context:null});},_coBrowseStatusResponse:function(type,args)
{var ChatCoBrowseStatusCode=RightNow.Chat.Model.ChatCoBrowseStatusCode;var coBrowseStatus=args[0].data.coBrowseStatus;var message="";switch(coBrowseStatus)
{case ChatCoBrowseStatusCode.STARTED:message=this.data.attrs.label_screen_sharing_session_started;break;case ChatCoBrowseStatusCode.STOPPED:message=this.data.attrs.label_screen_sharing_session_ended;break;case ChatCoBrowseStatusCode.ERROR:var errorCode=parseInt(args[0].data.coBrowseData[0],10);if(errorCode===0)
message=this.data.attrs.label_java_not_detected;else if(errorCode===1)
message=this.data.attrs.label_java_cert_rejected;break;}
this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[message],context:null});},_videoChatInvitationResponse:function(type,args)
{var agent=args[0].data.agent;this.engagementID=args[0].data.engagementID;this._appendEJSToChat(this.getStatic().templates.VideoChatInvitationResponse,{attrs:this.data.attrs,message:RightNow.Interface.getMessage('AGENT_0_IS_OFFERING_VIDEO_CHAT_MSG'),agentName:agent.name});if(window.oit){window.oit.fire(new CustomEvent('inlay-oracle-chat-video-offer',{detail:{offer:true}}));}
this.Y.one(this.baseSelector).delegate('click',this.onAllowVideoChatClick.bind(this),'a.rn_VideoChatAllow',this);this.Y.one(this.baseSelector).delegate('click',this.onDeclineVideoChatClick.bind(this),'a.rn_VideoChatDecline',this);},_videoChatAcceptResponse:function(type,args)
{var accepted=args[0].data.accepted,message="";this._transcript.all('.rn_VideoChatAction').remove();if(accepted)
message=RightNow.Interface.getMessage("THE_VIDEO_CHAT_INVITATION_WAS_ACCEPTED_LBL");else
message=RightNow.Interface.getMessage("THE_VIDEO_CHAT_INVITATION_WAS_DECLINED_LBL");this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[message],context:null});},_videoChatStatusResponse:function(type,args)
{var chatVideoChatStatusCode=RightNow.Chat.Model.ChatVideoChatStatusCode;var videoChatStatus=args[0].data.videoChatStatus;var isRestoringTranscript=args[0].data.isRestoringTranscript;var message="";switch(videoChatStatus)
{case chatVideoChatStatusCode.ACCEPTED:if(isRestoringTranscript)
{this._transcript.all('.rn_VideoChatAction').remove();return;}
break;case chatVideoChatStatusCode.STARTED:message=RightNow.Interface.getMessage("THE_VIDEO_CHAT_SESSION_HAS_STARTED_LBL");if(!isRestoringTranscript)
{RightNow.Widgets.ChatTranscript.sendVideoChatStartedResponse();}
break;case chatVideoChatStatusCode.STOPPED:message=RightNow.Interface.getMessage("THE_VIDEO_CHAT_SESSION_HAS_ENDED_LBL");if(((args[0].data.hasOwnProperty('senderType')&&args[0].data.senderType!=='AGENT')||!args[0].data.hasOwnProperty('senderType'))&&!isRestoringTranscript){RightNow.Widgets.ChatTranscript.sendVideoChatStoppedResponse();}
break;case chatVideoChatStatusCode.ABORTED:message=RightNow.Interface.getMessage("VIDEO_ABORTED_DUE_CONNECTIVITY_ISSUES_LBL");if(!isRestoringTranscript)
{RightNow.Widgets.ChatTranscript.sendVideoChatAbortedResponse();}
break;case chatVideoChatStatusCode.ERROR:message=RightNow.Interface.getMessage("VIDEO_ENCOUNTERED_DUE_LOCAL_PROBLEM_LBL");if(((args[0].data.hasOwnProperty('senderType')&&args[0].data.senderType!=='AGENT')||!args[0].data.hasOwnProperty('senderType'))&&!isRestoringTranscript){message=RightNow.Interface.getMessage("VIDEO_ENCOUNTERED_DUE_REMOTE_PROBLEM_LBL");RightNow.Widgets.ChatTranscript.sendVideoChatErrorResponse();}
break;}
this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[message],context:null});},_videoChatStatusResponseInlay:function(args)
{var chatVideoChatStatusCode=RightNow.Chat.Model.ChatVideoChatStatusCode;var videoChatStatus=args.detail.videoChatStatus;var isRestoringTranscript=args.detail.isRestoringTranscript;var clientResponsible=args.detail.clientResponsible;var fromAgent=args.detail.fromAgent
var logoff=args.detail.logoff;var message="";switch(videoChatStatus)
{case chatVideoChatStatusCode.ACCEPTED:if(isRestoringTranscript)
{this._transcript.all('.rn_VideoChatAction').remove();return;}
break;case chatVideoChatStatusCode.STARTED:if(clientResponsible&&!isRestoringTranscript)
message=RightNow.Interface.getMessage("THE_VIDEO_CHAT_SESSION_HAS_STARTED_LBL");break;case chatVideoChatStatusCode.STOPPED:if(!fromAgent&&!logoff)
message=RightNow.Interface.getMessage("THE_VIDEO_CHAT_SESSION_HAS_ENDED_LBL");break;case chatVideoChatStatusCode.ABORTED:message=RightNow.Interface.getMessage("VIDEO_ABORTED_DUE_CONNECTIVITY_ISSUES_LBL");break;case chatVideoChatStatusCode.ERROR:message=RightNow.Interface.getMessage("VIDEO_ENCOUNTERED_DUE_LOCAL_PROBLEM_LBL");if(clientResponsible&&!isRestoringTranscript)
message=RightNow.Interface.getMessage("VIDEO_ENCOUNTERED_DUE_REMOTE_PROBLEM_LBL");break;}
if(message!==""){this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[message],context:null});}},_reconnectUpdateResponse:function(type,args)
{if(this._stateBeforeReconnect===RightNow.Chat.Model.ChatState.CONNECTED)
this._appendEJSToChat(this.getStatic().templates.systemMessage,{attrs:this.data.attrs,messages:[RightNow.Interface.getMessage("DISCONNECTION_IN_0_SECONDS_MSG").replace("{0}",args[0].data.secondsLeft)],context:null});},_onAgentStatusChangeResponse:function(type,args)
{var agent=args[0].data.agent;if(!agent)
return;var message=null;if(agent.activityStatus===RightNow.Chat.Model.ChatActivityState.ABSENT)
message=RightNow.Interface.getMessage("COMM_DISP_NAME_LOST_PLS_WAIT_MSG");else if(args[0].data.previousState===RightNow.Chat.Model.ChatActivityState.ABSENT)
message=RightNow.Interface.getMessage("COMM_DISPLAY_NAME_RESTORED_MSG");if(message!==null)
this._appendEJSToChat(this.getStatic().templates.agentStatusChangeResponse,{template:'agentStatusChangeResponse',attrs:this.data.attrs,message:message,agentName:agent.name});},_preloadImages:function()
{var imageArray=[];imageArray.push(this.data.attrs.alert_icon_path);imageArray.push(this.data.attrs.agent_message_icon_path);imageArray.push(this.data.attrs.off_the_record_icon_path);imageArray.push(this.data.attrs.video_chat_icon_path);if(!this.data.attrs.mobile_mode)
imageArray.push(this.data.attrs.cobrowse_icon_path);if(this.data.attrs.enduser_message_icon_path)
imageArray.push(this.data.attrs.enduser_message_icon_path);for(var x=0;x<imageArray.length;x++)
eval("var imageObject"+x+" = new Image(); imageObject"+x+".src = imageArray[x];");},_appendEJSToChat:function(postText,postData,postID)
{var newEntry=this.Y.Node.create(new EJS({text:postText}).render(postData));var _postData;if(postID!==undefined)
{newEntry.set("id",postID);}
this._transcript.appendChild(newEntry);if(this.data.attrs.is_persistent_chat&&this._ls.isSupported&&this.Y.Cookie.get("CHAT_SESSION_ID"))
{_postData=JSON.parse(JSON.stringify(postData));delete _postData.attrs;if(_postData.context)
{delete _postData.context.w_id;delete _postData.context.rn_contextData;delete _postData.context.rn_contextToken;delete _postData.context.rn_timestamp;delete _postData.context.rn_formToken;}
var key=this._ls._transcriptPrefix+new Date().getTime(),chatSessionID=this.Y.Cookie.get("CHAT_SESSION_ID");_postData.chatWindowId=this._ls._thisWindowId;_postData.type='CHAT_TRANSCRIPT';if(_postData&&_postData.createdTime)
{var lastUpdatedKey=this._ls._lastUpdateKey+chatSessionID,lastUpdated=this._ls.getItem(lastUpdatedKey);if(!lastUpdated||lastUpdated<_postData.createdTime)
{this._ls.setItem(key,_postData);this._ls.bufferItem(chatSessionID,_postData);this._ls.setItem(lastUpdatedKey,_postData.createdTime);}}
else
{this._ls.bufferItem(chatSessionID,_postData);this._ls.setItem(key,_postData);}
var ls=this._ls;setTimeout(function(){ls.removeItem(key);},2500);}
var scrollAnim=new this.Y.Anim({node:this._transcriptContainer,to:{scroll:function(node){return[0,node.get('scrollHeight')]}}}).run();if(this.data.attrs.unread_messages_titlebar_enabled&&!this._windowFocused)
{document.title='('+(++this._unreadCount)+') '+this._baseTitle;}},_appendEJSToOtherChatWindow:function(type,args)
{if((!this.Y.Cookie.get("CHAT_SESSION_ID")||this._active===false)&&type!=='evt_notifyChatDisconnect')
{return;}
if(type==='evt_notifyChatDisconnect')
{this._active=false;}
var postText,postData=args[0].data,template=postData.template?postData.template:'';postData.attrs=this.data.attrs;switch(template)
{case'chatPostResponse':postText=this.getStatic().templates.chatPostResponse;break;case'participantAddedResponse':postText=this.getStatic().templates.participantAddedResponse;break;case'agentStatusChangeResponse':postText=this.getStatic().templates.agentStatusChangeResponse;break;case'CoBrowsePremiumInvitationResponse':postText=this.getStatic().templates.CoBrowsePremiumInvitationResponse;break;case'systemMessage':postText=this.getStatic().templates.systemMessage;break;}
if(postText===undefined)
{postText=this.getStatic().templates.systemMessage;postData.messages=postData.messages||[];}
if(postData&&postData.context&&postData.context.isEndUserPost&&this._transcript.one('.rn_AgentTextPrefix'))
{var newEntry=this.Y.Node.create(new EJS({text:postText}).render(postData));this._transcript.appendChild(newEntry);}
else
{var newEntry=this.Y.Node.create(new EJS({text:postText}).render(postData));this._transcript.appendChild(newEntry);}
var scrollAnim=new this.Y.Anim({node:this._transcriptContainer,to:{scroll:function(node){return[0,node.get('scrollHeight')]}}}).run();if(this.data.attrs.unread_messages_titlebar_enabled&&!this._windowFocused)
{document.title='('+(++this._unreadCount)+') '+this._baseTitle;}},_formatLinks:function(text)
{var newText='';var stringArray;var tempString=text;var titles={};var hrefs={};var descs={};var tags={};var quotedUrls={};var aMatches=0;var qMatches=0;var tMatches=0;var anchorMatch="";while(anchorMatch=tempString.match(this._anchorRE))
{descs[aMatches]=anchorMatch[2];stringArray=tempString.split(anchorMatch[0]);var title=anchorMatch[0].match(this._titleRE);if(title!=null)
titles[aMatches]=title[1];href=hrefs[aMatches]=anchorMatch[0].match(this._hrefRE);if(href!=null)
{hrefs[aMatches]=href[1];if(!hrefs[aMatches].match(/^(http(s)?)/i)&&!hrefs[aMatches].match(/^(mailto:)/i))
hrefs[aMatches]="http://"+hrefs[aMatches];newText+=stringArray[0]+"{RNTAMATCH"+aMatches+"}";aMatches++;}
if(stringArray.length>0)
{stringArray.shift();tempString=stringArray.join(anchorMatch[0]);}}
if(aMatches!==0)
{newText+=tempString;tempString=newText;newText="";}
tempString=tempString.replace(this._tagBR,'{BR}');while(urlMatch=tempString.match(this._tagRE))
{tags[tMatches]=urlMatch[0];tempString=tempString.replace(urlMatch[0],"{RNTTMATCH"+tMatches+"}");tMatches++;}
var urlMatch="";while(urlMatch=tempString.match(this._quotedUrlRE))
{quotedUrls[qMatches]=urlMatch[0];tempString=tempString.replace(urlMatch[0],"{RNTQMATCH"+qMatches+"}");qMatches++;}
while(urlMatch=tempString.match(this._urlRE))
{var href=urlMatch[0];stringArray=tempString.split(urlMatch[0]);if(urlMatch[0].match(/^ftp\./i))
href="ftp://"+urlMatch[0];else if(!urlMatch[0].match(/^(http(s)?|ftp)/i))
href="http://"+urlMatch[0];var replace="<a href='"+href+"' target='_blank'>"+urlMatch[0]+"</a>";newText+=stringArray[0]+replace;if(stringArray.length>0)
{stringArray.shift();tempString=stringArray.join(urlMatch[0]);}}
newText+=tempString;if(qMatches>0)
{for(var x=0;x<qMatches;x++)
newText=newText.replace("{RNTQMATCH"+x+"}",quotedUrls[x]);}
if(tMatches>0)
{for(var x=0;x<tMatches;x++)
newText=newText.replace("{RNTTMATCH"+x+"}",tags[x]);}
if(aMatches>0)
{for(var x=0;x<aMatches;x++)
{if(this.data.attrs.mobile_mode)
newText=newText.replace("{RNTAMATCH"+x+"}",descs[x]==null?hrefs[x]:descs[x]+' ('+hrefs[x]+')');else
newText=newText.replace("{RNTAMATCH"+x+"}","<a href='"+hrefs[x]+"' "+(titles[x]==null?"":"title=\""+titles[x]+"\" ")+" target=\"_blank\">"+(descs[x]==null?hrefs[x]:descs[x])+"</a>");}}
newText=newText.replace(/{BR}/g,"</br>");return newText;},_getAgentIdString:function(agentName)
{return this.data.attrs.agent_id.replace(/{display_name}/g,agentName);},_onApplicationFocus:function()
{this._windowFocused=true;this._unreadCount=0;document.title=this._baseTitle;},_onApplicationBlur:function()
{this._windowFocused=false;},onAllowCoBrowsePremiumClick:function(e)
{e.halt();var target=e.currentTarget,agentEnvironment=target.getAttribute('data-agentEnvironment'),coBrowseSessionId=target.getAttribute('data-coBrowseSessionId');RightNow.Widgets.ChatTranscript.sendCoBrowsePremiumResponse(true,agentEnvironment,coBrowseSessionId);},onDeclineCoBrowsePremiumClick:function()
{RightNow.Widgets.ChatTranscript.sendCoBrowsePremiumResponse(false);},onAllowVideoChatClick:function(e)
{e.halt();var target=e.currentTarget;RightNow.Event.fire("evt_chatVideoChatAllowClicked",e);var target=e.currentTarget,videoChatSessionId=target.getAttribute('data-videoChatSessionId');RightNow.Widgets.ChatTranscript.sendVideoChatResponse(this,true,videoChatSessionId);},onDeclineVideoChatClick:function()
{RightNow.Widgets.ChatTranscript.sendVideoChatResponse(this,false);}},{sendCoBrowseResponse:function(accepted,coBrowseUrl)
{var eo=new RightNow.Event.EventObject(this,{data:{}});if(accepted)
{eo.data={coBrowseUrl:coBrowseUrl};RightNow.Event.fire('evt_chatCoBrowseAcceptRequest',eo);}
else
{RightNow.Event.fire('evt_chatCoBrowseDenyRequest',eo);}},sendCoBrowsePremiumResponse:function(accepted,agentEnvironment,coBrowseSessionId)
{var eo=new RightNow.Event.EventObject(this,{data:{}});if(accepted)
{eo.data={agentEnvironment:agentEnvironment,coBrowseSessionId:coBrowseSessionId};RightNow.Event.fire('evt_chatCoBrowsePremiumAcceptRequest',eo);}
else
{RightNow.Event.fire('evt_chatCoBrowsePremiumDenyRequest',eo);}},sendVideoChatResponse:function(scope,accepted,videoChatSessionId)
{var eo=new RightNow.Event.EventObject(this,{data:{}});var chatSessionID=scope.Y.Cookie.get("CHAT_SESSION_ID");if(accepted)
{eo.data={videoChatSessionId:videoChatSessionId};RightNow.Event.fire('evt_chatVideoChatAcceptRequest',eo);if(window.oit){window.oit.fire(new CustomEvent('inlay-oracle-chat-video-invitationResponse',{detail:{accepted:true,chatSessionId:chatSessionID,engagementID:scope.engagementID}}));}}
else
{RightNow.Event.fire('evt_chatVideoChatDenyRequest',eo);if(window.oit){window.oit.fire(new CustomEvent('inlay-oracle-chat-video-invitationResponse',{detail:{accepted:false,chatSessionId:chatSessionID,engagementID:scope.engagementID}}));}}},sendVideoChatStartedResponse:function()
{var eo=new RightNow.Event.EventObject(this,{data:{}});RightNow.Event.fire('evt_chatVideoChatStart',eo);},sendVideoChatStoppedResponse:function()
{var eo=new RightNow.Event.EventObject(this,{data:{}});RightNow.Event.fire('evt_chatVideoChatStop',eo);},sendVideoChatAbortedResponse:function()
{var eo=new RightNow.Event.EventObject(this,{data:{}});RightNow.Event.fire('evt_chatVideoChatAbort',eo);},sendVideoChatErrorResponse:function(error)
{var eo=new RightNow.Event.EventObject(this,{data:{videoChatStatus:error}});RightNow.Event.fire('evt_chatVideoChatError',eo);}});
RightNow.Widgets.ChatCancelButton=RightNow.Widgets.extend({constructor:function(){this._container=this.Y.one(this.baseSelector);var cancelButton=this.Y.one(this.baseSelector+"_Button");if(cancelButton)
{cancelButton.on("click",this._onButtonClick,this);RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);}},_onButtonClick:function(type,args)
{RightNow.Event.fire("evt_chatHangupRequest",new RightNow.Event.EventObject(this,{data:{isCancelled:true,cancelingUrl:this.data.attrs.canceling_url}}));},_onChatStateChangeResponse:function(type,args)
{var currentState=args[0].data.currentState;var previousState=args[0].data.previousState;var ChatState=RightNow.Chat.Model.ChatState;if(currentState===ChatState.RECONNECTING)
return;if(currentState===ChatState.SEARCHING)
RightNow.UI.show(this._container);else
RightNow.UI.hide(this._container);}});
RightNow.Widgets.ChatRequestEmailResponseButton=RightNow.Widgets.extend({constructor:function(){this._container=this.Y.one(this.baseSelector);this._requestEmailResponseButton=this.Y.one(this.baseSelector+"_Button");this._currentState=RightNow.Chat.Model.SEARCHING;if(this._container&&this._requestEmailResponseButton)
{this._requestEmailResponseButton.on("click",this._onButtonClick,this);RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);}},_onChatStateChangeResponse:function(type,args){var reason=args[0].data.reason;var currentState=args[0].data.currentState;if((currentState===RightNow.Chat.Model.ChatState.CANCELLED&&(reason==="FAIL_NO_AGENTS_AVAIL"||reason==="QUEUE_TIMEOUT"))||currentState===RightNow.Chat.Model.ChatState.DEQUEUED||currentState===RightNow.Chat.Model.ChatState.DISCONNECTED&&reason==="NO_AGENTS_AVAILABLE")
RightNow.UI.show(this._container);else
RightNow.UI.hide(this._container);},_onButtonClick:function(type,args)
{var pageToDisplay=this.Y.Lang.trim(this.data.attrs.page_url);if(pageToDisplay===''){pageToDisplay=this.data.js.baseUrl+"/app/ask";}
window.open(pageToDisplay);}});
RightNow.Widgets.ChatSendButton=RightNow.Widgets.extend({constructor:function(){this._container=this.Y.one(this.baseSelector);var sendButton=this.Y.one(this.baseSelector+"_Button");if(sendButton)
{sendButton.on("click",this._onButtonClick,this);RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);}},_onButtonClick:function(type,args)
{RightNow.Event.fire("evt_chatSendButtonClickRequest",new RightNow.Event.EventObject(this));},_onChatStateChangeResponse:function(type,args)
{var currentState=args[0].data.currentState;var ChatState=RightNow.Chat.Model.ChatState;if(currentState===ChatState.CONNECTED)
{this._container.addClass("rn_ChatSendButtonShown");RightNow.UI.show(this._container);}
else if(currentState===ChatState.REQUEUED||currentState===ChatState.DISCONNECTED||currentState===ChatState.RECONNECTING)
{this._container.removeClass("rn_ChatSendButtonShown");RightNow.UI.hide(this._container);}}});
RightNow.Widgets.VirtualAssistantSimilarMatches=RightNow.Widgets.extend({constructor:function()
{RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);RightNow.Event.subscribe("evt_chatPostResponse",this._onChatPostResponse,this);RightNow.Event.subscribe("evt_chatEngagementParticipantAddedResponse",this._onChatEngagementParticipantAddedResponse,this);this.baseElement=this.Y.one(this.baseSelector);this.matchesElement=this.Y.one(this.baseSelector+"_Matches");this.matchesElement.setAttribute('aria-live','polite');this.matchesElement.delegate('click',this._onMatchClick,'a',this);this._clickable=true;this._vaMode=false;},_onMatchClick:function(type,args)
{if(this._clickable===false)
return;this._clickable=false;type.preventDefault();var text=type.currentTarget.get("innerHTML");if(text.replace(/^\s*/,"").length==0||text.length>349525)
return;var eo=new RightNow.Event.EventObject(this,{data:{messageBody:text,isEndUserPost:true,isOffTheRecord:this.data.attrs.all_posts_off_the_record}});RightNow.Event.fire("evt_chatPostMessageRequest",eo);},_onChatStateChangeResponse:function(type,args)
{if(!RightNow.Event.fire("evt_handleChatStateChange",new RightNow.Event.EventObject(this,{data:args[0].data})))
return;var currentState=args[0].data.currentState,ChatState=RightNow.Chat.Model.ChatState;switch(currentState)
{case ChatState.REQUEUED:case ChatState.CANCELED:case ChatState.DISCONNECTED:case ChatState.RECONNECTING:this._clickable=true;this.baseElement.addClass("rn_Hidden");break;case ChatState.CONNECTED:if(this._vaMode===true){this.baseElement.removeClass("rn_Hidden");}
break;}},_onChatPostResponse:function(type,args)
{if(!args[0].data.isEndUserPost&&args[0].data.vaResponse!==undefined&&args[0].data.vaResponse!==null)
{this._clickable=true;var vaResponse=args[0].data.vaResponse;if(vaResponse.questionlist&&vaResponse.questionlist.length>0)
{var templateData={records:vaResponse.questionlist,label_also:RightNow.Interface.getMessage("ALSO_MATCHES_WITH_COLON_LBL"),length:(this.data.attrs.max_items_to_show>0&&this.data.attrs.max_items_to_show<vaResponse.questionlist.length)?this.data.attrs.max_items_to_show:vaResponse.questionlist.length},template=new EJS({text:this.getStatic().templates.view}).render(templateData);this.matchesElement.set("innerHTML",template);}
else
{this.matchesElement.empty();}}},_onChatEngagementParticipantAddedResponse:function(type,args)
{this._vaMode=(args[0].data.virtualAgent===undefined)?false:args[0].data.virtualAgent;if(this._vaMode===false)
{this.baseElement.addClass("rn_Hidden");}
else
{this.baseElement.removeClass("rn_Hidden");}}});
RightNow.Widgets.ChatPostMessage=RightNow.Widgets.extend({constructor:function(){this.container=this.Y.one(this.baseSelector);this.input=this.Y.one(this.baseSelector+"_Input");this.isOffTheRecord=this.data.attrs.all_posts_off_the_record;this._errorDialog=null;this._vaMode=false;if(this.input)
{RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);RightNow.Event.subscribe("evt_chatSendButtonClickResponse",this.sendText,this);RightNow.Event.subscribe("evt_chatPostLengthExceededResponse",this._onChatPostLengthExceededResponse,this);RightNow.Event.subscribe("evt_chatEngagementParticipantAddedResponse",this._onChatEngagementParticipantAddedResponse,this);RightNow.Event.subscribe("evt_chatPostResponse",this._onChatPostResponse,this);this.input.on("valueChange",this._onValueChange,this);this.input.on("key",this._onEnterKey,"enter",this);}},_onChatStateChangeResponse:function(type,args)
{if(!RightNow.Event.fire("evt_handleChatStateChange",new RightNow.Event.EventObject(this,{data:args[0].data})))
return;var currentState=args[0].data.currentState;var ChatState=RightNow.Chat.Model.ChatState;if(currentState===ChatState.CONNECTED)
{this.input.set('disabled',false);RightNow.UI.show(this.container);if(this.data.attrs.initial_focus&&this.input.focus)
{top.window.focus();this.input.focus();}}
else if(currentState===ChatState.CANCELLED||currentState===ChatState.DISCONNECTED||currentState===ChatState.REQUEUED)
{this.input.set('disabled',true);RightNow.UI.hide(this.container);}
else if(currentState===ChatState.RECONNECTING)
{this.input.set('disabled',true);}},_onValueChange:function(e)
{var eo=new RightNow.Event.EventObject(this,{data:{keyEvent:e,inputValue:e.newVal,inputValueBeforeChange:e.prevVal,isOffTheRecord:this.isOffTheRecord}});RightNow.Event.fire("evt_chatPostMessageKeyUpRequest",eo);},_onEnterKey:function(e)
{if(e.shiftKey)
return;if(this.input.get('value')!=='\r\n')
this.sendText();else
this.input.set('value',"");e.preventDefault();if(this.data.attrs.mobile_mode)
this.input.blur();},_onChatPostLengthExceededResponse:function(type,eventObject)
{if(eventObject[0].w_id!==this.instanceID)
return;this.input.set('value',eventObject[0].data.inputValueBeforeChange).set('disabled',true);if(this._errorDialog){this._errorDialog.show();}
else{this._errorDialog=RightNow.UI.Dialog.messageDialog(RightNow.Interface.getMessage("THE_INPUT_IS_TOO_LONG_MSG"),{icon:"WARN",exitCallback:{fn:this._enableControls,scope:this}});}},_enableControls:function()
{this.input.set('disabled',false).focus();},sendText:function()
{var text=this.input.get('value');if(text.replace(/^\s*/,"").length==0||text.length>349525)
return;var ch,c,newText="";for(i=0;i<text.length;i++)
{ch=text[i];c=text.charCodeAt(i);if(c==RightNow.UI.KeyMap.VTAB)
newText+="\n";else if(c<32&&c!==RightNow.UI.KeyMap.LINEFEED&&c!==RightNow.UI.KeyMap.RETURN&&c!==RightNow.UI.KeyMap.TAB)
{newText+="&#00";newText+=(c<10)?"0"+c.toString():c.toString();}
else
newText+=text.substr(i,1);}
text=newText;this.input.set('value',"");if(this._vaMode)
this.input.set('disabled',true);var eo=new RightNow.Event.EventObject(this,{data:{messageBody:text,isEndUserPost:true,isOffTheRecord:this.isOffTheRecord}});RightNow.Event.fire("evt_chatPostMessageRequest",eo);if(!this.data.attrs.mobile_mode)
this.input.focus();},_onChatPostResponse:function(type,args)
{if(!args[0].data.isEndUserPost)
{this.input.set('disabled',false);if(this.data.attrs.focus_on_incoming_messages)
{top.window.focus();this.input.focus();}
else if(this._vaMode)
{this.input.focus();}}},_onChatEngagementParticipantAddedResponse:function(type,args)
{this._vaMode=args[0].data.virtualAgent===undefined?false:args[0].data.virtualAgent;}});
RightNow.Widgets.AnswerFeedback=RightNow.Widgets.extend({constructor:function(){this._dialog=this._keyListener=this._thanksLabel=null;this._rate=0;var Event=this.Y.Event;if(this.data.js.buttonView){var noButton=this.Y.one(this.baseSelector+"_RatingNoButton"),yesButton=this.Y.one(this.baseSelector+"_RatingYesButton");Event.attach("click",this._onClick,noButton,this,1);Event.attach("click",this._onClick,yesButton,this,2);}
else if(this.data.attrs.use_rank_labels){var ratingButton=this.baseSelector+"_RatingButton_";for(var i=1,ids=[];i<=this.data.attrs.options_count;++i){ids.push(ratingButton+i);}
this.Y.Array.each(ids,function(id,i){Event.attach("click",this._onClick,id,this,i+1);},this);}
else{var ratingCell=this.baseSelector+"_RatingCell_";for(i=1,ids=[];i<=this.data.attrs.options_count;++i){ids.push(ratingCell+i);}
this.Y.Array.each(ids,function(id,i){var j=i+1;Event.attach("mouseover",this._onCellOver,id,this,j);Event.attach("focus",this._onCellOver,id,this,j);Event.attach("mouseout",this._onCellOut,id,this,j);Event.attach("blur",this._onCellOut,id,this,j);Event.attach("click",this._onClick,id,this,j);},this);}
RightNow.Event.subscribe("evt_formTokenUpdate",this._onFormTokenUpdate,this);},_onClick:function(event,rating){this._rate=rating;this._submitAnswerRating();if(this._rate<=this.data.attrs.dialog_threshold){if(this.data.attrs.feedback_page_url){var pageString=this.data.attrs.feedback_page_url;pageString=RightNow.Url.addParameter(pageString,"a_id",this.data.js.answerID);pageString=RightNow.Url.addParameter(pageString,"session",RightNow.Url.getSession());window.open(pageString,'',"resizable, scrollbars, width=630, height=400");}
else{this._showDialog();}}},_showDialog:function(){RightNow.Event.fire("evt_formTokenRequest",new RightNow.Event.EventObject(this,{data:{formToken:this.data.js.f_tok}}));if(!this._dialog){this.Y.augment(this,RightNow.RequiredLabel);var buttons=[{text:this.data.attrs.label_send_button,handler:{fn:this._onSubmit,scope:this},isDefault:true},{text:this.data.attrs.label_cancel_button,handler:{fn:this._onCancel,scope:this},isDefault:false}],templateData={domPrefix:this.baseDomID,labelDialogDescription:this.data.attrs.label_dialog_description,labelEmailAddress:this.data.attrs.label_email_address,labelCommentBox:this.data.attrs.label_comment_box,isProfile:this.data.js.isProfile,userEmail:this.data.js.email},dialogForm=this.Y.Node.create(new EJS({text:this.getStatic().templates.feedbackForm}).render(templateData));this._dialog=RightNow.UI.Dialog.actionDialog(this.data.attrs.label_dialog_title,dialogForm,{"buttons":buttons,"dialogDescription":this.baseDomID+"_DialogDescription","width":this.data.attrs.dialog_width||''});this._keyListener=RightNow.UI.Dialog.addDialogEnterKeyListener(this._dialog,this._onSubmit,this);RightNow.UI.show(dialogForm);this.Y.one('#'+this._dialog.id).addClass('rn_AnswerFeedbackDialog');}
this._emailField=this._emailField||this.Y.one(this.baseSelector+"_EmailInput");this._errorDisplay=this._errorDisplay||this.Y.one(this.baseSelector+"_ErrorMessage");this._feedbackField=this._feedbackField||this.Y.one(this.baseSelector+"_FeedbackTextarea");if(this._errorDisplay){this._errorDisplay.set("innerHTML","").removeClass('rn_MessageBox rn_ErrorMessage');}
this._dialog.show();var focusElement;if(this._emailField&&this._emailField.get("value")==='')
focusElement=this._emailField;else
focusElement=this._feedbackField;focusElement.focus();RightNow.UI.Dialog.enableDialogControls(this._dialog,this._keyListener);},_onSubmit:function(type,args){var target=(args&&args[1])?(args[1].target||args[1].srcElement):null;if(type==="keyPressed"&&target){var tag=target.get('tagName'),innerHTML=target.get('innerHTML');if(tag==='A'||tag==='TEXTAREA'||innerHTML===this.data.attrs.label_send_button||innerHTML===this.data.attrs.label_cancel_button){return;}}
if(!this._validateDialogData()){return;}
RightNow.UI.Dialog.disableDialogControls(this._dialog,this._keyListener);this._incidentCreateFlag=true;this._submitFeedback();},_onCancel:function(){RightNow.UI.Dialog.disableDialogControls(this._dialog,this._keyListener);this._closeDialog(true);},_validateDialogData:function(){this._errorDisplay.set("innerHTML","").removeClass('rn_MessageBox rn_ErrorMessage');var returnValue=true;if(this._emailField){this._emailField.set("value",this.Y.Lang.trim(this._emailField.get("value")));if(this._emailField.get("value")===""){this._addErrorMessage(RightNow.Text.sprintf(RightNow.Interface.getMessage("PCT_S_IS_REQUIRED_MSG"),this.data.attrs.label_email_address),this._emailField.get("id"));returnValue=false;}
else if(!RightNow.Text.isValidEmailAddress(this._emailField.get("value"))){this._addErrorMessage(this.data.attrs.label_email_address+' '+RightNow.Interface.getMessage("FIELD_IS_NOT_A_VALID_EMAIL_ADDRESS_MSG"),this._emailField.get("id"));returnValue=false;}}
this._feedbackField.set("value",this.Y.Lang.trim(this._feedbackField.get("value")));if(this._feedbackField.get("value")===""){this._addErrorMessage(RightNow.Text.sprintf(RightNow.Interface.getMessage("PCT_S_IS_REQUIRED_MSG"),this.data.attrs.label_comment_box),this._feedbackField.get("id"));returnValue=false;}
return returnValue;},_closeDialog:function(cancelled){if(!cancelled){this._feedbackField.set("value","");}
if(this._errorDisplay){this._errorDisplay.set("innerHTML","").removeClass('rn_MessageBox rn_ErrorMessage');}
if(this._dialog){this._dialog.hide();}},_submitFeedback:function(){var eventObject=new RightNow.Event.EventObject(this,{data:{a_id:this.data.js.answerID,rate:this._rate,threshold:this.data.attrs.dialog_threshold,options_count:this.data.attrs.options_count,message:this._feedbackField.get('value'),email:(this._emailField)?this._emailField.get('value'):this.data.js.email,f_tok:this.data.js.f_tok}});if(RightNow.Event.fire("evt_answerFeedbackRequest",eventObject)){RightNow.Ajax.makeRequest(this.data.attrs.submit_feedback_ajax,eventObject.data,{successHandler:this._onResponseReceived,scope:this,data:eventObject,json:true});}},_onResponseReceived:function(response,originalEventObj){if(RightNow.Event.fire("evt_answerFeedbackResponse",response,originalEventObj)){if(this._incidentCreateFlag){this._incidentCreateFlag=false;if(response&&response.ID){this._closeDialog();RightNow.UI.displayBanner(this.data.attrs.label_feedback_submitted,{focusElement:this._thanksLabel,baseClass:"rn_ThanksLabel"});}
else{var message=(response&&response.error)?response.error:response;this._addErrorMessage(message,null);RightNow.UI.Dialog.enableDialogControls(this._dialog,this._keyListener);}}
else{this._closeDialog();}}},_submitAnswerRating:function(){var eventObject=new RightNow.Event.EventObject(this,{data:{a_id:this.data.js.answerID,rate:this._rate,options_count:this.data.attrs.options_count}});RightNow.ActionCapture.record('answer','rate',this.data.js.answerID);RightNow.ActionCapture.record('answer','rated',((this._rate-1)/(this.data.attrs.options_count-1))*100);if(RightNow.Event.fire("evt_answerRatingRequest",eventObject)){RightNow.Ajax.makeRequest(this.data.attrs.submit_rating_ajax,eventObject.data,{successHandler:this._onRatingResponseReceived,scope:this,data:{eventName:"evt_answerRatingResponse",data:eventObject},json:true});this._replaceRatingElementsWithMessage();}},_replaceRatingElementsWithMessage:function(){var ratingElement=this.Y.one(this.baseSelector+((this.data.js.buttonView||this.data.attrs.use_rank_labels)?"_RatingButtons":"_RatingMeter"));if(ratingElement){this._thanksLabel=this.Y.Node.create('<div id="rn_'+this.instanceID+'_ThanksLabel" class="rn_ThanksLabel">');this._thanksLabel.set('innerHTML',this.data.attrs.label_feedback_thanks).set('tabIndex',-1);ratingElement.replace(this._thanksLabel);this._thanksLabel.focus();}},_onRatingResponseReceived:function(response,originalEventObj){RightNow.Event.fire("evt_answerRatingResponse",response,originalEventObj);},_addErrorMessage:function(message,focusElement){if(this._errorDisplay){this._errorDisplay.addClass('rn_MessageBox rn_ErrorMessage');var newMessage=focusElement?'<a href="javascript:void(0);" onclick="document.getElementById(\''+focusElement+'\').focus(); return false;">'+message+'</a>':message,oldMessage=this._errorDisplay.get("innerHTML");if(oldMessage!==""){newMessage=oldMessage+'<br>'+newMessage;}
this._errorDisplay.set("innerHTML",newMessage);this._errorDisplay.one("h2")?this._errorDisplay.one("h2").setHTML(RightNow.Interface.getMessage("ERRORS_LBL")):this._errorDisplay.prepend("<h2>"+RightNow.Interface.getMessage("ERROR_LBL")+"</h2>");this._errorDisplay.one("h2").setAttribute('role','alert');if(focusElement){this._errorDisplay.one('a').focus();}}},_onCellOver:function(event,chosenRating){if(this._rate<1){this._updateCellClass(1,chosenRating,"add");this._updateCellClass(chosenRating+1,this.data.attrs.options_count,"remove");}},_updateCellClass:function(minBound,maxBound,removeOrAddClass){var elementID=this.baseSelector+"_RatingCell_";for(var i=minBound;i<=maxBound;i++){if(removeOrAddClass==="add"){this.Y.one(elementID+i).addClass('rn_RatingCellOver');}else{this.Y.one(elementID+i).removeClass('rn_RatingCellOver');}}},_onCellOut:function(event,args){if(this._rate<1)
this._updateCellClass(1,this.data.attrs.options_count,"remove");},_onFormTokenUpdate:function(type,args){var eventObject=args[0];if(eventObject.data.newToken&&this.instanceID===eventObject.w_id){this.data.js.f_tok=eventObject.data.newToken;}}});
RightNow.Widgets.VirtualAssistantFeedback=RightNow.Widgets.AnswerFeedback.extend({overrides:{constructor:function(){this.parent();RightNow.Event.subscribe("evt_chatStateChangeResponse",this._onChatStateChangeResponse,this);RightNow.Event.subscribe("evt_chatPostCompletion",this._onChatPostCompletion,this);RightNow.Event.subscribe("evt_chatEngagementParticipantAddedResponse",this._onChatEngagementParticipantAddedResponse,this);this._vaMode=false;this._baseElement=this.Y.one(this.baseSelector);this._thanksMessage=null;},_onClick:function(event,rating){var data={method:'feedback',package:{rating:0}},ratings={5:[0,25,50,75,100],4:[0,33,66,100],3:[0,50,100],2:[100,0]};event.preventDefault();if(this.data.js.buttonView||this.data.attrs.use_rank_labels)
{this.Y.one(this.baseSelector+'_RatingNoButton').set('disabled',true);this.Y.one(this.baseSelector+'_RatingYesButton').set('disabled',true);}
else
{this._onCellOver(1,rating);event.preventDefault();var rateMeter=this.Y.one(this.baseSelector+"_RatingMeter");if(rateMeter)
rateMeter.purge(true);for(var cell,i=0;i<=this.data.attrs.options_count;++i)
{cell=this.Y.one(this.baseSelector+"_RatingCell_"+i);if(cell)
{cell.all('span.rn_ScreenReaderOnly').setHTML(RightNow.Text.sprintf(RightNow.Interface.getMessage("PCT_D_OF_PCT_D_SELECTED_LBL"),rating,this.data.attrs.options_count));this.Y.Event.attach("click",function(e){e.preventDefault();},cell);}}}
if(ratings[this.data.attrs.options_count]&&ratings[this.data.attrs.options_count][rating-1]){data.package.rating=ratings[this.data.attrs.options_count][rating-1];}
if(this._thanksMessage===null){this._thanksMessage=this.Y.Node.create('<span class="rn_ThanksLabel">');this.Y.one(this.baseSelector+((this.data.js.buttonView||this.data.attrs.use_rank_labels)?'_RatingButtons':'_RatingMeter')).append(this._thanksMessage);}
this._thanksMessage.set('innerHTML',this.data.attrs.label_feedback_submitted).setAttribute('role','alert');RightNow.Event.fire('evt_chatPostOutOfBandDataRequest',new RightNow.Event.EventObject(this,{data:data}));}},_reEnable:function(){if(this.data.js.buttonView||this.data.attrs.use_rank_labels){this.Y.one(this.baseSelector+'_RatingNoButton').set('disabled',false);this.Y.one(this.baseSelector+'_RatingYesButton').set('disabled',false);}
else{var rateMeter=this.Y.one(this.baseSelector+"_RatingMeter");if(rateMeter)
rateMeter.purge(true);var ratingCell=this.baseSelector+"_RatingCell_";for(i=1,ids=[];i<=this.data.attrs.options_count;++i){ids.push(ratingCell+i);}
this.Y.Array.each(ids,function(id,i){var j=i+1;this.Y.Event.attach("mouseover",this._onCellOver,id,this,j);this.Y.Event.attach("focus",this._onCellOver,id,this,j);this.Y.Event.attach("mouseout",this._onCellOut,id,this,j);this.Y.Event.attach("blur",this._onCellOut,id,this,j);this.Y.Event.attach("click",this._onClick,id,this,j);},this);for(var cell,i=0;i<=this.data.attrs.options_count;++i){cell=this.Y.one(this.baseSelector+"_RatingCell_"+i);if(cell){cell.all('span.rn_ScreenReaderOnly').setHTML(RightNow.Text.sprintf(this.data.attrs.label_accessible_option_description,i,this.data.attrs.options_count));}}
this._onCellOver(1,0);}},_onChatStateChangeResponse:function(type,args)
{if(!RightNow.Event.fire("evt_handleChatStateChange",new RightNow.Event.EventObject(this,{data:args[0].data})))
return;var currentState=args[0].data.currentState,ChatState=RightNow.Chat.Model.ChatState;switch(currentState)
{case ChatState.REQUEUED:case ChatState.CANCELED:case ChatState.DISCONNECTED:case ChatState.RECONNECTING:this._baseElement.addClass("rn_Hidden");break;case ChatState.CONNECTED:if(this._vaMode===true){this._baseElement.removeClass("rn_Hidden");}
break;}},_onChatPostCompletion:function(type,args){if(this._vaMode===false){this._baseElement.addClass("rn_Hidden");}
else{this._reEnable();if(this._thanksMessage!==null){this._thanksMessage.set('innerHTML','');}
this._baseElement.removeClass("rn_Hidden");}},_onChatEngagementParticipantAddedResponse:function(type,args){this._vaMode=(args[0].data.virtualAgent===undefined)?false:args[0].data.virtualAgent;}});