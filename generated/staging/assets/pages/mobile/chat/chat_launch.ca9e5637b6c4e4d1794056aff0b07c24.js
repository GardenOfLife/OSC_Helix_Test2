
RightNow.Widgets.FormSubmit=RightNow.Form.extend({overrides:{constructor:function(){this.parent();this.inputDataChanged=false;this._formButton=this.Y.one(this.baseSelector+"_Button");this._formSubmitFlag=this.Y.one(this.baseSelector+"_Submission");this._navigateToUrlFlag=false;if(!this._formButton||!this._formSubmitFlag)return;if(this._formSubmitFlag.get("checked")){this._formButton.set("disabled","true");return;}
this.on("validation:fail",this._onFormValidationFail,this).on("validation:fail",this._resetFormButton,this,false).on("validation:pass",this._onFormValidated,this).on("response",this._defaultFormSubmitResponse,this).on("response",this._resetFormButton,this).on("submitRequest",this._onButtonClick,this).on("reset",this._resetFormForSubmission,this).on("responseError",this._onErrorResponse,this).on("formUpdated",this._onFormUpdated,this);this._toggleClickListener(true);RightNow.Event.subscribe("evt_formToggleButton",function(type,args){this._toggleClickListener(args[0]);},this);RightNow.Event.subscribe("evt_formInputDataChanged",function(){this.inputDataChanged=true;},this);if(this.data.attrs.unsaved_data_dialog){var that=this;window.onbeforeunload=function(e){if(that.inputDataChanged){return"";}};}}},_onButtonClick:function(evt){this.inputDataChanged=false;if(evt&&evt.halt){evt.halt();}
if(this._requestInProgress)return false;this._toggleClickListener(false);this._removeFormErrors();if(this.Y.UA.ie&&window.external&&"AutoCompleteSaveForm"in window.external){window.external.AutoCompleteSaveForm(document.getElementById(this._parentForm));}
this._fireSubmitRequest();},_fireSubmitRequest:function(){var eo=new RightNow.Event.EventObject(this,{data:{form:this._parentForm,f_tok:this.data.js.f_tok,error_location:this._errorMessageDiv.get("id"),timeout:this.data.attrs.timeout*1000}});RightNow.Event.fire("evt_formButtonSubmitRequest",eo);this.fire("collect",eo);},_onFormValidated:function(){this._toggleLoadingIndicators(true);this.fire("send",this.getValidatedFields());},_onFormValidationFail:function(){this._displayErrorMessages(this._errorMessageDiv);RightNow.Event.fire("evt_formValidateFailure",new RightNow.Event.EventObject(this));},_clearFlashData:function(){var infoDiv=this.Y.one('.rn_MessageBox.rn_InfoMessage');if(infoDiv){var parentClass=infoDiv.ancestor().getAttribute('class');if(parentClass&&parentClass.search("rn_SmartAssistantDialog")===-1)
infoDiv.set('innerHTML','').removeClass('rn_InfoMessage');}},_absoluteOffset:function(element){var top=0;do{top+=element.get('offsetTop');element=element.get('offsetParent');}
while(element);return top;},_displayErrorMessages:function(messageArea){messageArea.addClass("rn_MessageBox").addClass("rn_ErrorMessage").removeClass("rn_Hidden");this._clearFlashData();if(!this.Y.DOM.inViewportRegion(this.Y.Node.getDOMNode(messageArea),true)){(new this.Y.Anim({node:this.Y.one(document.body),to:{scrollTop:this._absoluteOffset(messageArea)-40},duration:0.5})).run();}
var firstField=messageArea.one("a");if(firstField){firstField.focus();firstField.setAttribute('role','alert');messageArea.removeAttribute('tabIndex');}
else{messageArea.set('tabIndex',0);messageArea.setAttribute('role','alert');messageArea.focus();}
var errorLbl=messageArea.all("div").size()>1?RightNow.Interface.getMessage("ERRORS_LBL"):RightNow.Interface.getMessage("ERROR_LBL");messageArea.prepend("<h2>"+errorLbl+"</h2>");messageArea.one("h2").setAttribute('role','alert');},_defaultFormSubmitResponse:function(type,args){if(this.fire('defaultResponseHandler',args[0])){this._formSubmitResponse(type,args);}},_formSubmitResponse:function(type,args){var responseObject=args[0].data,result;if(!this._handleFormResponseFailure(responseObject)&&responseObject.result){result=responseObject.result;if(!result.sa){if(result.transaction||result.redirectOverride){return this._handleFormResponseSuccess(result);}
else{this._displayErrorDialog();}}}
args[0].data||(args[0].data={});args[0].data.form=this._parentForm;RightNow.Event.fire('evt_formButtonSubmitResponse',args[0]);},_handleFormResponseSuccess:function(result){this._formSubmitFlag.set("checked",true);if(this.data.attrs.label_on_success_banner){RightNow.UI.displayBanner(this.data.attrs.label_on_success_banner,{focusElement:this._formButton}).on('close',function(){this._confirmOnNavigate(result);},this);return;}
this._confirmOnNavigate(result);},_handleFormResponseFailure:function(responseObject){if(!responseObject){this._displayErrorDialog(RightNow.Interface.getMessage("THERE_PROB_REQ_ACTION_COULD_COMPLETED_MSG"));return true;}
if(responseObject.errors){var errorMessage="";this.Y.Array.each(responseObject.errors,function(error){errorMessage+="<div><b>"+error.externalMessage+"</b></div>";});this._errorMessageDiv.append(errorMessage);this._onFormValidationFail();return true;}
if(!responseObject.result){this._displayErrorDialog();return true;}
return false;},_navigateToUrl:function(result){var url;if(result.redirectOverride){url=result.redirectOverride+result.sessionParam;}
else if(this.data.attrs.on_success_url){var paramsToAdd='';this.Y.Object.each(result.transaction,function(details){if(details.key){paramsToAdd+='/'+details.key+'/'+details.value;}});if(paramsToAdd){url=this.data.attrs.on_success_url+paramsToAdd+result.sessionParam;}
else{var sessionValue=result.sessionParam.substr(result.sessionParam.lastIndexOf("/")+1);if(!sessionValue&&this.data.js.redirectSession)
sessionValue=this.data.js.redirectSession;url=RightNow.Url.addParameter(this.data.attrs.on_success_url,'session',sessionValue);}}
else{url=window.location+result.sessionParam;}
RightNow.Url.navigate(url+this.data.attrs.add_params_to_url);},_confirmOnNavigate:function(result){if(this.data.attrs.on_success_url!=='none'){if(this.data.attrs.label_confirm_dialog!==''){RightNow.UI.Dialog.messageDialog(this.data.attrs.label_confirm_dialog,{exitCallback:{fn:function(){this._navigateToUrl(result);},scope:this},width:'250px'});}
else{if(this.Y.Lang.trim(this.data.attrs.on_success_url)!==''){this._navigateToUrlFlag=true;}
this._navigateToUrl(result);}}},_resetFormForSubmission:function(){this._navigateToUrlFlag=false;this._removeFormErrors();this._resetFormButton();},_onFormUpdated:function(){if(this._errorMessageDiv.all('[data-field]').size()===0){this._errorMessageDiv.addClass("rn_Hidden").set("innerHTML","");}},_onErrorResponse:function(response){this._displayErrorDialog(response.suggestedErrorMessage||RightNow.Interface.getMessage("THERE_PROB_REQ_ACTION_COULD_COMPLETED_MSG"));this._resetFormButton();},_resetFormButton:function(){if(this._navigateToUrlFlag){return;}
this._toggleLoadingIndicators(false);this._toggleClickListener(true);},_removeFormErrors:function(){this._errorMessageDiv.addClass("rn_Hidden").setHTML("");},_displayErrorDialog:function(message){RightNow.UI.Dialog.messageDialog(message||RightNow.Interface.getMessage('ERROR_PAGE_PLEASE_S_TRY_MSG'),{icon:"WARN"});},_toggleLoadingIndicators:function(turnOn){this._formButton.setHTML((turnOn)?this.data.attrs.label_submitting_message:this.data.attrs.label_button).toggleClass('rn_Loading',turnOn);},_toggleClickListener:function(enable){if(this.Y.UA.ie){this._formButton.set("disabled",false);this.Y.one(this.baseSelector+" button").toggleClass("rn_IeFormButton",!enable);}
else{this._formButton.set("disabled",!enable);}
this._requestInProgress=!enable;this.Y.Event[((enable)?"attach":"detach")]("click",this._onButtonClick,this._formButton,this);}});
RightNow.Widgets.ChatLaunchButton=RightNow.Widgets.FormSubmit.extend({overrides:{constructor:function(data,instanceID,Y){this.parent();this._isProactiveChat=RightNow.Url.getParameter('pac')!==null;if(!this._parentForm||!this._formButton)return;this._addHiddenPostField('referrerUrl',this._getReferrerUrl());if(!this.data.js.showForm)
{if(!this.data.js.isBrowserSupported){Y.one('#'+this._parentForm).get('parentNode').insert(RightNow.Interface.getMessage("CHAT_SUPP_BROWSER_CHAT_AVAIL_MSG"),'before');}
RightNow.UI.hide(this._parentForm);return;}
if(RightNow.Profile.isLoggedIn()&&this._isProactiveChat)
{var eo=new RightNow.Event.EventObject(this,{data:{"form":this._parentForm,"error_location":this._errorMessageDiv.get("id"),"f_tok":this.data.js.f_tok}});this.fire("collect",eo);}},_getReferrerUrl:function()
{var referrerUrl;var chatData=RightNow.Text.Encoding.base64Decode(RightNow.Url.getParameter("chat_data"));var dataValues=chatData.split('&');for(var index=0;index<dataValues.length;index++)
{var value=dataValues[index].split('=');if(value[0]==="referrerUrl")
{referrerUrl=decodeURIComponent(value[1]);break;}}
if(!referrerUrl)
{referrerUrl=document.referrer;if(!referrerUrl&&window.opener&&window.opener.location)
referrerUrl=window.opener.location.href;}
return referrerUrl;},_openChatWindow:function(){var parentForm=this.Y.one("#"+this._parentForm);if(!this._isProactiveChat)
{var leftPos=(screen.width/2)-(this.data.attrs.launch_width/2);var topPos=(screen.height/2)-(this.data.attrs.launch_height/2);var url='/euf/core/static/blank.html';if(this.Y.UA.ie===6)
url='';var chatWindowName=this.data.js.chatWindowName||'chatWindow';try
{if(this.data.attrs.open_in_new_window)
{if(!(this.Y.UA.chrome&&this.Y.UA.ios)){this.chatWindow=window.open(url,chatWindowName,'status=1,toolbar=0,menubar=0,location=0,resizable=1'+(this.data.attrs.enable_scrollbars?',scrollbars=1':'')+',height='+this.data.attrs.launch_height+'px,width='+this.data.attrs.launch_width+'px,left='+leftPos+',top='+topPos);this.chatWindow.focus();parentForm.set('target',chatWindowName);}
else
{parentForm.set('target','_blank');}}}
catch(e)
{this._toggleLoadingIndicators(false);return;}}
else
{try
{resizeTo(this.data.attrs.launch_height,this.data.attrs.launch_height+47);}
catch(e){}}
try
{this.fire("send",this.getValidatedFields());}
catch(e){}},_onFormValidated:function()
{if(this.data.attrs.is_persistent_chat)
{RightNow.Event.fire("evt_startPersistentChatRequest",new RightNow.Event.EventObject(this,{}));var UI=RightNow.Chat.UI;UI.EventBus=new UI.EventBus();UI.EventBus.initializeEventBus();}
else
{this._openChatWindow();}
if(RightNow.Profile.isLoggedIn())
{RightNow.Ajax.makeRequest("/ci/ajaxRequest/validateChatForm",{formToken:this.data.js.f_tok},{successHandler:this._onLoggedInVerification,scope:this,json:true});}
else
{this._onLoggedInVerification({status:true});}},_showErrorMessage:function(errorMessage)
{var error_span;if(this._errorLocation)
{error_span=document.getElementById(this._errorLocation);}
else
{if(this.data.attrs.is_persistent_chat)
{error_span=document.getElementById("rn_PCErrorLocation");}
else
{error_span=document.getElementById("rn_ErrorLocation");}}
error_span.style.display='block';var error_message=document.createElement("span");error_span.className="rn_MessageBox rn_ErrorMessage";error_message.className="ErrorSpan";error_message.innerHTML=errorMessage;error_span.appendChild(error_message);},_onLoggedInVerification:function(serverResponse)
{if(serverResponse.status===false)
{this._showErrorMessage(serverResponse.error);this.chatWindow.close();this._eventCanceled=true;return;}
this._toggleLoadingIndicators(false);},_addHiddenPostField:function(name,value)
{if(name!==undefined&&value!==undefined)
{var parentForm=this.Y.one("#"+this._parentForm);var input=this.Y.Node.create('<input name="'+name+'" type="hidden" value="'+this.Y.Escape.html(value)+'">');parentForm.appendChild(input);RightNow.Form.find(this._parentForm,this.instanceID).on("submit",function(){var eventObject=new RightNow.Event.EventObject(this,{data:{name:name,value:value,required:false,form:this._parentForm}});RightNow.Event.fire("evt_formFieldValidatePass",eventObject);return eventObject;},this);}}}});