
(function(){var l=function(){var b={},a={},f={};return{getDeferred:function(k,d){if(b[k])return b[k];a[d]=a[d]||{events:[]};a[d].form=k;return{on:function(b,c,h){if(c&&"function"===typeof c)return a[d].events.push({name:b,handler:c,context:h}),this;throw Error("Handler specified isn't a callable function");},addField:function(a,c){if(a&&c&&"object"===typeof c)f[k]||(f[k]={}),f[k][a]=c;else throw Error("A non-object field cannot be added to a form");}}},getInstance:function(a){return b[a]},newInstance:function(a,d){d instanceof RightNow.Form&&(b[a]=d)},getDeferredEvents:function(b){var d,e,c={};for(d in a)if(e=a[d],a.hasOwnProperty(d)&&e.form===b&&e.events.length){e=e.events;for(var h=0;h<e.length;h++)c[e[h].name]=c[e[h].name]||[],c[e[h].name].push(e[h])}return c},getDeferredFields:function(a){return f[a]}}}(),g=function(){function b(c,a,b,d){var e={},f=c.getAttribute("target");c.all("input, select, textarea").each(function(c){var a=c.get("type");""!==c.get("name")&&"submit"!==a&&"image"!==a&&(e[c.get("name")]=c.get("value"))});c=a+RightNow.Url.convertToSegment(e)+b;RightNow.Url.getSession()&&(c=RightNow.Url.addParameter(c,"session",RightNow.Url.getSession()));c=d.Y.Node.create("<a class='rn_Hidden'>form</a>").setAttribute("href",c);f&&c.setAttribute("target",f);d.Y.one(document.body).append(c);c=d.Y.Node.getDOMNode(c);document.createEvent?(d=document.createEvent("MouseEvents"),d.initEvent("click",!1,!1),c.dispatchEvent(d)):c.fireEvent("onclick")}function a(c){this.fire("response",new RightNow.Event.EventObject(this,{data:c}))}function f(c){this.fire("responseError",new RightNow.Event.EventObject(this,{data:c}))}function k(c,h,b){if(RightNow.Event.noSessionCookies())for(var d=0,e=b.length;d<e;d++)if("Contact.Login"===b[d].name){document.cookie="cp_login_start=1;path=/";break}b=RightNow.JSON.stringify(b);var k={form:b,updateIDs:RightNow.JSON.stringify({asset_id:RightNow.Url.getParameter("asset_id"),qid:RightNow.Url.getParameter("qid"),product_id:RightNow.Url.getParameter("product_id"),serial_no:RightNow.Url.getParameter("serial_no"),i_id:RightNow.Url.getParameter("i_id"),user_id:RightNow.Url.getParameter("user")})},g={scope:h,json:!0,successHandler:a,failureHandler:f};b=RightNow.UI.Form;null!=b.smartAssistant&&(k.smrt_asst=b.smartAssistant);null!==b.smartAssistantToken&&(k.saToken=b.smartAssistantToken);h.data.attrs.flash_message&&(k.flash_message=h.data.attrs.flash_message);h._originalEventObject&&(h._originalEventObject.data.timeout&&(g.timeout=h._originalEventObject.data.timeout),g=function(c,a){var b=["challengeHandler","challengeHandlerContext"],h,d;for(h=0;h<b.length;++h)d=b[h],c[d]=a[d]||void 0;return c}(g,h._originalEventObject));RightNow.Form.formToken.onNewToken(function(a){k.f_tok=a;RightNow.Ajax.makeRequest(c,k,g)})}var d={},e={};return{submitForm:function(c,a,d){var f=d.Y.one("#"+c),g=f.getAttribute("method"),m=f.getAttribute("action");c=e[c];a=a||"";if(m&&!d.data.attrs.on_success_url)if("post"===g.toLowerCase()||!RightNow.Text.beginsWith(m,"/")&&RightNow.Url.isExternalUrl(m)){a&&f.set("action",m+a);for(a=0;a<c.length;a++)(g=c[a])&&g.value&&((m=f.one('input[name="'+g.name+'"]')||f.one('textarea[name="'+g.name+'"]'))?m.set("value",g.value):f.append(d.Y.Node.create('<input type="hidden" name="'+g.name+'" value="'+d.Y.Escape.html(g.value)+'"/>')));f.submit()}else b(f,m,a,d);else k((m||"/ci/ajaxRequest/sendForm")+a,d,c)},resetValidatedFields:function(a){e[a]=[]},addValidatedField:function(a,b){e[a]||this.resetFormFields(a);delete b.data.form;e[a].push(b.data)},getValidatedFields:function(a){return RightNow.Lang.cloneObject(e[a])},addField:function(a,b,f){d[a]||(d[a]={});d[a][b]=f},findField:function(a,b){return d[a][b]},getAllFields:function(a){return d[a]||{}}}}();RightNow.Form=RightNow.EventProvider.extend({overrides:{constructor:function(){this.parent();this._challengeDivID=this.data.attrs.challenge_location;this._parentForm=RightNow.UI.findParentForm(this.baseSelector);this.Y.one("#"+this._parentForm).on("submit",function(a){a.halt()});this._errorMessageDiv=this.Y.one("#"+this.data.attrs.error_location);this._formButton=this.Y.one(this.baseSelector+"_Button");this._errorMessageDiv||(this._errorMessageDiv=this.Y.Node.create("<div id='rn_"+this.instanceID+"_ErrorLocation'>"),this._formButton.insert(this._errorMessageDiv,"before"));if(this._parentForm){if(l.getInstance(this._parentForm))throw Error("Can't have two different FormSubmits for a single form");l.newInstance(this._parentForm,this)}else throw RightNow.UI.addDevelopmentHeaderError(RightNow.Interface.getMessage("FORMSUBMIT_PLACED_FORM_UNIQUE_ID_MSG")),Error("An inappropriate form was specified");this._events=l.getDeferredEvents(this._parentForm);this.Y.Object.each(l.getDeferredFields(this._parentForm),function(a,b){g.addField(this._parentForm,b,a)},this);this._widgetInstantiationComplete=RightNow.Widgets.isWidgetInstantiationComplete();if(!this._widgetInstantiationComplete)RightNow.Event.on("evt_WidgetInstantiationComplete",function(){this._widgetInstantiationComplete=!0},this);this._addSubscribersFilter("submit",this._filterSubmittedWidgets,this);this._addEventHandler("submit",{pre:function(a){RightNow.Form.formToken.requestNewToken();g.resetValidatedFields(this._parentForm);this._challengeDivID&&(a.challengeHandler=RightNow.Event.createDelegate(this,this._challengeHandler));this._originalEventObject=a},during:function(a){!1===a?this._eventCanceled=!0:a instanceof RightNow.Event.EventObject&&g.addValidatedField(this._parentForm,a)},post:function(a){var b=this._eventCanceled?"fail":"pass";this._eventCanceled=!1;this.fire("validation:"+b,a)}})._addEventHandler("send",{post:function(a){this._eventCanceled||g.submitForm(this._parentForm,this.data.attrs.add_params_to_url,this);this._eventCanceled=!1},during:function(a){!1===a&&(this._eventCanceled=!0)}})._addEventHandler("collect",{pre:function(){this._collectedFields=[]},during:function(a){a&&this._collectedFields.push(a)},post:function(a){this.fire("submit",a)}})._addEventHandler("formUpdated");if(this.data.js.challengeProvider){try{this._challengeProvider=eval(this.data.js.challengeProvider)}catch(b){throw"Failed while trying to parse a challenge provider.  "+b;}this._createChallengeDiv();this._challengeProvider.create(this._challengeDivID,RightNow.UI.AbuseDetection.options);this.on("submit",this._onValidateChallengeResponse,this)}if(!this.data.js.f_tok)throw Error("This widget is required to have a `f_tok` form submission token");RightNow.Form.formToken.init(this.data.js.f_tok,this.data.js.formExpiration)}},_filterSubmittedWidgets:function(b){var a=g.getAllFields(this._parentForm),f=[];this.Y.Object.each(a,function(a,d){this.Y.Array.each(b,function(b,c){b.context===a&&-1===this.Y.Array.indexOf(this._collectedFields,d)&&f.push(c)},this)},this);return f},getValidatedFields:function(){return g.getValidatedFields(this._parentForm)},addField:function(b,a){g.addField(this._parentForm,b,a)},findField:function(b){if(!this._widgetInstantiationComplete)throw Error("Widget instantiation has not completed. This method can only be used after all widgets are constructed");return g.findField(this._parentForm,b)},hide:function(){RightNow.UI.hide(this._formButton)},show:function(){RightNow.UI.show(this._formButton)},disable:function(){this._formButton.set("disabled",!0)},enable:function(){this._formButton.set("disabled",!1)},_createChallengeDiv:function(){this.Y.one("#"+this._challengeDivID)||this._formButton.insert(this.Y.Node.create("<div id='"+this._challengeDivID+"' tabindex='-1'>"),"before")},_reportChallengeError:function(b){b=b||RightNow.Interface.getMessage("PLS_VERIFY_REQ_ENTERING_TEXT_IMG_MSG");this._errorMessageDiv.append("<div><b><a id ='rn_ChallengeErrorLink' href='javascript:void(0);'>"+b+"</a></b></div>");this.Y.one("#rn_ChallengeErrorLink").on("click",RightNow.Event.createDelegate(this,function(){this._challengeProvider.focus(this._challengeDivID);return!1}))},_challengeHandler:function(b,a,f){this._createChallengeDiv();this._challengeProvider||(this._challengeProvider=RightNow.UI.AbuseDetection.getChallengeProvider(b),this.on("submit",this._onValidateChallengeResponse,this),this._challengeProvider.create(this._challengeDivID,RightNow.UI.AbuseDetection.options));this._reportChallengeError(RightNow.UI.AbuseDetection.getDialogCaption(b));this.fire("validation:fail")},_onValidateChallengeResponse:function(){new RightNow.Event.EventObject(this,{data:{form:!1}});var b=this._challengeProvider.getInputs(this._challengeDivID);if(b.abuse_challenge_response)for(var a in b)b.hasOwnProperty(a)&&RightNow.Ajax.addRequestData(a,b[a])}},{find:function(b,a,f){if(b=RightNow.UI.findParentForm(b))return f?b:l.getDeferred(b,a);throw Error("You're using a form that doesn't have a proper form submit button or an id");},formToken:function(){function b(b,h){var e=h[0];if(e.data.newToken&&(!e.w_id||"RightNow.Form"===e.w_id)){a=e.data.newToken;e=f;g=(new Date).getTime()+e;for(var e=0,l=d.length,n;e<l;e++)n=d[e],n.callback.call(n.context,a);d=[]}}var a,f,g,d=[],e;return{init:function(c,d){a=c;var l=f=d;g=(new Date).getTime()+l;e||(RightNow.Event.on("evt_formTokenUpdate",b),e=!0)},requestNewToken:function(){(new Date).getTime()>=g&&RightNow.Event.fire("evt_formTokenRequest",new RightNow.Event.EventObject({instanceID:"RightNow.Form"},{data:{formToken:a}}))},onNewToken:function(b,e){(new Date).getTime()>=g?d.push({callback:b,context:e}):setTimeout(function(){b.call(e,a)},1)}}}()})})();
RightNow.Field=RightNow.Field||RightNow.EventProvider.extend({overrides:{constructor:function(){this.parent();this.data.js.name&&(this._fieldName=this.data.js.name,this._inputSelector=this.baseSelector+"_"+this._fieldName.replace(/\./g,"\\."),this.parentForm().addField(this._fieldName,this),this._addEventHandler("change"),this._addEventHandler("constraintChange",{post:function(){this.parentForm().fire("formUpdated")}}),this.parentForm().on("collect",this.onCollect,this));this.excludeFromValidation=this.data.attrs.hide_on_load||!1}},setConstraints:function(a){this.Y.Object.each({required:function(a){return"false"===a?!1:!!a},required_lvl:function(a){return parseInt(a,10)},min_required_attachments:function(a){return parseInt(a,10)}},function(b,c){a[c]&&(a[c]=b(a[c]))});this.fire("constraintChange",a);this.Y.Object.each(a,function(a,c){this.fire("constraintChange:"+c,{constraint:a})},this);this.parentForm().fire("formUpdated")},onCollect:function(){return this.isVisible()?this._fieldName:!1},isVisible:function(){return!this.excludeFromValidation},hide:function(){RightNow.UI.hide(this.baseSelector);this.excludeFromValidation=!0;var a=this.Y.one("#"+this.lastErrorLocation);this.lastErrorLocation&&a&&a.all("[data-field='"+this._fieldName+"']").remove();this.parentForm().fire("formUpdated")},show:function(){RightNow.UI.show(this.baseSelector);this.excludeFromValidation=!1;this.parentForm().fire("formUpdated")},getFieldName:function(){return this._fieldName},parentForm:function(a){return RightNow.Form.find(a||this.baseDomID,this.instanceID)},getParentFormID:function(){return RightNow.Form.find(this.baseDomID,this.instanceID,!0)},createEventObject:function(){return new RightNow.Event.EventObject(this,{data:{name:this.data.js.name,value:this.getValue(),required:this._isRequired(),form:this._parentForm}})},is:function(a){var b=this.data.js.type;return"text"===a?"Integer"===b||"String"===b||"Thread"===b:"selection"===a?"Boolean"===b||"NamedIDLabel"===b||"Country"===b||"StateOrProvince"===b:"date"===a?"Date"===b||"DateTime"===b:"email"===a?this.isCommonEmailType()||!0===this.data.js.email:"url"===a?this.data.js.url?!0:!1:"product"===a?"ServiceProduct"===b:"category"===a?"ServiceCategory"===b:"attachment"===a?"FileAttachmentIncident"===b:"password"===a?"Contact.NewPassword"===this._fieldName||"Contact.NewPassword_Validate"===this._fieldName:!1},isCommonEmailType:function(){return"Contact.Emails.PRIMARY.Address"===this._fieldName||"Contact.Emails.ALT1.Address"===this._fieldName||"Contact.Emails.ALT2.Address"===this._fieldName||"Incident.CustomFields.c.alternateemail"===this._fieldName},_isRadio:function(){var a=this.input.get("type");return this.Y.Lang.isArray(a)&&"radio"===a[0]},_reportError:function(a){this._errors=this._errors||[];this._errors.push(a)},validate:function(a,b){this._errors=a||[];this._value="undefined"!==typeof b?b:this.getValue();this._checkRequired();this._checkValue();this.is("email")?this._errors.length||this._checkEmail():this.is("url")?this._errors.length||this._checkUrl():this._checkData();return!this._errors.length},_checkValue:function(){var a,b,c;if("Integer"===this.data.js.type){if(""!==this._value&&"number"!==typeof this._value)return this._reportError(RightNow.Interface.getMessage("VALUE_MUST_BE_AN_INTEGER_MSG"));a=parseInt(this._value,10);b=parseInt(this.data.js.constraints.maxValue,10);c=parseInt(this.data.js.constraints.minValue,10);if(this.Y.Lang.isNumber(b)&&a>b)return this._reportError(RightNow.Interface.getMessage("VALUE_IS_TOO_LARGE_MAX_VALUE_MSG")+b+")");if(this.Y.Lang.isNumber(c)&&a<c)return this._reportError(RightNow.Interface.getMessage("VALUE_IS_TOO_SMALL_MIN_VALUE_MSG")+c+")")}else if("Contact.NewPassword"===this.data.js.name&&this.data.js.passwordLength&&(a=RightNow.Text.Encoding.utf8Length(this._value),b=this.data.js.passwordLength,a<b))return this._reportError(RightNow.Text.sprintf(1===b-a?RightNow.Interface.getMessage("CONTAIN_1_CHARACTER_MSG"):RightNow.Interface.getMessage("PCT_D_CHARACTERS_MSG"),b));if(null!==this._value&&(this.data.js.constraints.maxLength||this.data.js.constraints.minLength)){a=this._value.length;c=this.data.js.constraints.maxLength;b=this.data.js.constraints.minLength;if(c&&c<a)return this._reportError(RightNow.Text.sprintf(1===a-c?RightNow.Interface.getMessage("EXCEEDS_SZ_LIMIT_PCT_D_CHARS_1_LBL"):RightNow.Interface.getMessage("EXCEEDS_SZ_LIMIT_PCT_D_CHARS_PCT_D_LBL"),c,a-c));if(b&&b>a)return this._reportError(RightNow.Text.sprintf(1===b-a?RightNow.Interface.getMessage("CONTAIN_1_CHARACTER_MSG"):RightNow.Interface.getMessage("PCT_D_CHARACTERS_MSG"),b))}},_checkData:function(){if(null!==this._value&&""!==this._value){var a=this.data.js.constraints?this.data.js.constraints.regex:null;if(RightNow.Text.beginsWith(this._fieldName,"Contact.Phones.")||"Contact.Address.PostalCode"===this._fieldName){if(!/^[-A-Za-z0-9,# +.()]+$/.test(this._value))return this._reportError("Contact.Address.PostalCode"===this._fieldName?RightNow.Interface.getMessage("PCT_S_IS_AN_INVALID_POSTAL_CODE_MSG"):RightNow.Interface.getMessage("PCT_S_IS_AN_INVALID_PHONE_NUMBER_MSG"))}else{if(a&&!(new RegExp(a)).test(this._value))return this._reportError("Contact.Login"===this._fieldName?RightNow.Interface.getMessage("PCT_S_CONT_SPACES_DOUBLE_QUOTES_LBL"):RightNow.Interface.getMessage("PCT_S_DIDNT_MATCH_EXPECTED_INPUT_LBL"));if(this.data.js.channelID&&/\s/.test(this._value))return this._reportError(RightNow.Interface.getMessage("CONTAIN_SPACES_PLEASE_TRY_MSG"))}}},_checkEmail:function(){if(this._value)if("Incident.CustomFields.c.alternateemail"===this._fieldName)for(var a=0,b=this._value.split(/[,;]+/),c;a<b.length;a++)(c=this.Y.Lang.trim(b[a]))&&!RightNow.Text.isValidEmailAddress(c)&&this._reportError(RightNow.Interface.getMessage("PCT_S_IS_INVALID_MSG"));else RightNow.Text.isValidEmailAddress(this._value)||this._reportError(RightNow.Interface.getMessage("PCT_S_IS_INVALID_MSG"))},_checkUrl:function(){null===this._value||""===this._value||RightNow.Text.isValidUrl(this._value)||this._reportError(RightNow.Interface.getMessage("IS_NOT_A_VALID_URL_MSG"))},_isRequired:function(){return this.is("product")||this.is("category")?this.data.attrs.required_lvl&&0<this.data.attrs.required_lvl||!1:this.is("attachment")?this.data.attrs.min_required_attachments&&0<this.data.attrs.min_required_attachments||!1:this.data.attrs.required?!0:!1},_checkRequired:function(){var a=!1;if(this._isRequired())if(this.is("date"))a=!/\d/.test(this._value);else if(""===this._value||!1===this._value||null===this._value)a=!0;a&&this._reportError(this.data.attrs.label_required);return a},getValue:function(){var a;if(this.is("selection"))this.input.size&&this._isRadio()?(a="",this.input.item(0).get("checked")?a=this.input.item(0).get("value"):this.input.item(1).get("checked")&&(a=this.input.item(1).get("value"))):a="checkbox"===this.input.get("type")?this.input.get("checked"):this.input.get("value");else if(this.is("date")){a="";var b={day:32,month:13,year:1900,hour:0,minute:0};this.input.each(function(a){var e=a.get("name").toLowerCase();this.Y.Object.each(b,function(f,d){null!==e.match(new RegExp(d+"$"))&&(b[d]=parseInt(a.get("value"),10))})},this);a=1900<b.year?b.year+"-"+b.month+"-"+b.day+" "+b.hour+":"+b.minute+":00":""}else this.is("product")||this.is("category")?a=this._selectedNode?this._selectedNode.hierValue||0:this._currentValue||0:this.input&&!this.is("attachment")&&(a=this._getTextFieldValue(this.input));return a},politeFocus:function(a){a&&(this.Y.all("[role=alert], [aria-live=assertive]").some(function(a){return!a.hasClass("rn_Hidden")&&(a.get("textContent")||a.get("innerText"))},this)||a.focus())},_getTextFieldValue:function(a){if(!a)return null;this._trimField(a);a=a.get("value");"Integer"===this.data.js.type?a=a&&!isNaN(Number(a))&&parseInt(a,10)===parseFloat(a)?parseInt(a,10):a:this.is("text")&&!this.is("password")&&""===a&&(a=null);return a},_trimField:function(a){a=a||this.input;if(this.is("text")&&!this.is("password")){var b=a.get("value");this.Y.Lang.isUndefined(b)||""===b||a.set("value",this.Y.Lang.trim(b))}},_initializeHint:function(){if(!this.data.attrs.always_show_hint)if(this.Y.Overlay){var a=this.Y.Node.create("<span id='"+this.baseDomID+"_Hint' aria-hidden='true'>"+this.data.attrs.hint+"</span>"),b={node:this.baseSelector,points:[this.Y.WidgetPositionAlign.TL,this.Y.WidgetPositionAlign.BL]};this.data.info&&"RightNow.Widgets.SelectionInput"===this.data.info.class_name&&"Boolean"!==this.data.js.type?(a.addClass("rn_HintBoxRight"),b.node=this.Y.one(this.baseSelector+" select"),b.points=[this.Y.WidgetPositionAlign.TL,this.Y.WidgetPositionAlign.TR]):a.addClass("rn_HintBox");a=new this.Y.Overlay({bodyContent:a,visible:!1,zIndex:3,align:b});if(this.Y.UA.webkit&&("checkbox"===this.input.get("type")||this._isRadio())){for(var c=this.input instanceof this.Y.NodeList?this.input.item(this.input.size()-1):this.input;c.next();)c=c.next();this.input.on("click",function(){c.focus();a.show()})}else this.input.on("focus",function(){a.show()});this.input.on("blur",function(){a.hide()});a.render(this.baseSelector)}else this.input.get("parentNode").append(this.Y.Node.create("<span class='rn_HintText' aria-hidden='true'>"+this.data.attrs.hint+"</span>"))}},{requires:{standard:["overlay"]}});
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
RightNow.Widgets.SocialUserAvatar=RightNow.Field.extend({overrides:{constructor:function(){this.parent();this.element=this.Y.one(this.baseSelector);this._chooseButton=this.Y.one(this.baseSelector+"_ChooseAvatar");if(this._chooseButton){this._chooseButton.on("click",this._onButtonClick,this);}
this.Y.one(this.baseSelector).delegate('click',this._onCloseClick,'.rn_CloseGallery',this);this.Y.one(this.baseSelector).delegate('keyup',this._updateImageForLibrary,'.rn_UserAvatar img',this);this.Y.one(this.baseSelector).delegate('click',this._updateImageForLibrary,'.rn_UserAvatar img',this);this.Y.one(this.baseSelector).delegate('click',this._onPaginatorClick,'.rn_ImagePaginator a',this);this.Y.one(this.baseSelector).delegate('keypress',this._onKeyPress,'.rn_UserAvatar img',this);if(this.avatarForm=this.element.ancestor('form')){this.submitButton=this.avatarForm.one('.rn_FormSubmit button');}
this.avatarSelectionType='';this.currentAvatarType='';if(this.data.js.socialUser){this._addClickHandlers();this.img=this.element.one('.rn_PreviewImage img');this.defaultImg=this.element.one('.rn_PreviewImage .rn_Default');this._monitorPreviewImage(this.img);this._parentFormID=this.getParentFormID();this.parentForm().on('submit',this.onValidate,this);this.Y.Event.attach("click",this._onSubmitFormClick,this.submitButton,this);this.data.js.name='SocialUser.AvatarURL';}
else{if(this.data.attrs.create_user_on_load){RightNow.Event.subscribe("evt_WidgetInstantiationComplete",function(){RightNow.Event.fire("evt_userInfoRequired");});}
this.element.one('.rn_AddSocialUser').on('click',this._addSocialUser,this);}},getValue:function(){return this.img.hasClass('rn_Hidden')?'':this._getPreviewImage();}},_onKeyPress:function(event){var keyPressed=event.keyCode;if((keyPressed===RightNow.UI.KeyMap.ENTER)||(keyPressed===RightNow.UI.KeyMap.SPACE)){this.data.js.archivedAvatar?this._onSubmitFormClick():this.parentForm(this._parentFormID).fire("submitRequest");}},_onSubmitFormClick:function(){if(this.data.js.archivedAvatar){this._displayArchivedAvatarDialog();return false;}},_displayArchivedAvatarDialog:function(){var buttons=[{text:this.data.attrs.label_yes_button,handler:{fn:this._resumeSubmit,scope:this},isDefault:true},{text:this.data.attrs.label_no_button,handler:{fn:this._cancelSubmit,scope:this},isDefault:false}];var dialogBody=this.Y.Node.create(new EJS({text:this.getStatic().templates.dialogContent}).render({currentAvatar:this.data.js.currentAvatar,selectedAvatar:this.selectedAvatar,attrs:this.data.attrs}));this._archivedAvatarDialog=RightNow.UI.Dialog.actionDialog('',dialogBody,{"buttons":buttons,"width":"600px"});RightNow.UI.Dialog.addDialogEnterKeyListener(this._archivedAvatarDialog,this._resumeSubmit,this);this._archivedAvatarDialog.show();this.Y.one('#'+this._archivedAvatarDialog.id).addClass('rn_SocialUserAvatarDialog');},_cancelSubmit:function(){this._archivedAvatarDialog.hide();return false;},_resumeSubmit:function(){this._archivedAvatarDialog.hide();this.parentForm(this._parentFormID).fire("submitRequest");},_onCloseClick:function(e){this.Y.all(this.baseSelector+" .rn_AvatarLibraryForm").addClass('rn_Hidden');},_onPaginatorClick:function(e)
{var clickedElement,firstPageNumber,lastPageNumber,firstChildVal,lastChildVal;var firstChild=this.Y.one(this.baseSelector+" .rn_ImagePaginator .rn_CurrentPages").one('a:first-child');var lastChild=this.Y.one(this.baseSelector+" .rn_ImagePaginator .rn_CurrentPages").one('a:last-child');firstChildVal=parseInt(firstChild.getAttribute('data-rel'),10);lastChildVal=parseInt(lastChild.getAttribute('data-rel'),10);if(e.target.hasClass('rn_PreviousPage')){clickedElement=firstChildVal-1;firstPageNumber=firstChildVal-1;lastPageNumber=lastChildVal-1;}
else if(e.currentTarget.hasClass('rn_NextPage')){clickedElement=parseInt(lastChild.getAttribute('data-rel'),10)+1;firstPageNumber=firstChildVal+1;lastPageNumber=lastChildVal+1;}
else{clickedElement=parseInt(e.currentTarget.getAttribute('data-rel'),10);firstPageNumber=firstChildVal;lastPageNumber=lastChildVal;}
this.Y.all(this.baseSelector+" .rn_AvatarLibraryForm").setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.avatarImages}).render({files:this.imageFiles,numberOfPages:this.numberOfPages,firstPage:firstPageNumber,lastPage:lastPageNumber,currentPage:clickedElement,js:this.data.js,attrs:this.data.attrs})));this.firstPage=firstPageNumber;this.lastPage=lastPageNumber;this.Y.one(this.baseSelector+" .rn_ImagePaginator .rn_CurrentPages").get('children').each(function(child){if(parseInt(child.getAttribute('data-rel'),10)===clickedElement){child.addClass('rn_Selected');}},this);},onValidate:function(){var eo=this.createEventObject();eo.data.avatarSelectionType=this.avatarSelectionType;RightNow.Event.fire("evt_formFieldValidationPass",eo);return eo;},_onButtonClick:function(e){this.Y.all(this.baseSelector+" .rn_AvatarLibraryForm").removeClass('rn_Hidden');this.Y.all(this.baseSelector+" .rn_AvatarLibraryForm").setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.loadingIcon}).render()));var eo=new RightNow.Event.EventObject(this,{data:{w_id:this.data.info.w_id}});RightNow.Ajax.makeRequest(this.data.attrs.submit_avatar_library_action_ajax,eo.data,{data:eo,json:true,scope:this,successHandler:this._onSubmitSuccess});},_onSubmitSuccess:function(response){var bannerOptions={},message;if(response&&response.files&&!response.errors){this.imageFiles=response.files;this.numberOfPages=response.numberOfPages;this.Y.all(this.baseSelector+" .rn_AvatarLibraryForm").removeClass('rn_Hidden');this.currentPage=this.selectedPage?this.selectedPage:1;this.Y.all(this.baseSelector+" .rn_AvatarLibraryForm").setContent(this.Y.Node.create(new EJS({text:this.getStatic().templates.avatarImages}).render({files:this.imageFiles,numberOfPages:this.numberOfPages,firstPage:this.firstPage?this.firstPage:1,lastPage:this.lastPage||((this.numberOfPages<=5)?this.numberOfPages:5),currentPage:this.currentPage,js:this.data.js,attrs:this.data.attrs})));if(this.numberOfPages>1){this.paginatorElement=this.Y.one(this.baseSelector+" .rn_ImagePaginator .rn_CurrentPages");this.paginatorElement.get('children').each(function(child){if(this.currentPage===parseInt(child.getAttribute('data-rel'),10)){child.addClass('rn_Selected');}},this);if(this.numberOfPages>this.paginatorElement.get('children').size()){this.Y.one(".rn_ImagePaginator .rn_NextPage").removeClass('rn_Hidden');}}
if(this.selectedAvatar){this.Y.one(this.baseSelector+" .rn_ProfilePictures").get('children').each(function(child){if(this.selectedAvatar===child.get('children').item(0).getAttribute('data-name')){child.get('children').item(0).addClass('rn_Clicked');}},this);}}
else{message=RightNow.Interface.getMessage("ERROR_REQUEST_ACTION_COMPLETED_MSG");bannerOptions.type='ERROR';RightNow.UI.displayBanner(message,bannerOptions);}},getStatus:function(status){this._statuses||(this._statuses={loading:{icon:'rn_Loading',className:'rn_LoadingStatus',message:this.data.attrs.label_loading_icon_message},success:{icon:'rn_CheckSquare',className:'rn_Success',message:this.data.attrs.label_success_icon_message},error:{icon:'rn_ExclamationCircle',className:'rn_Error',message:this.data.attrs.label_error_icon_message}});return status?this._statuses[status]:this._statuses;},toggleSubmitButton:function(state){if(!this.submitButton)return;this.submitButton.set('disabled',state);},_addClickHandlers:function(){var services={'.rn_DefaultOption':this._updateImageForDefault,'.rn_Service':this._updateImageForService},div;this.Y.Object.each(services,function(fn,id){if(div=this.element.one(id)){div.delegate('click',fn,'button',this);}},this);},_addSocialUser:function(e){RightNow.Event.fire("evt_userInfoRequired");e.halt();},_updateImageForDefault:function(e){this.avatarSelectionType='default';this._closeAndClearSelectedAvatar();this._showPreviewImage(false);this._displayStatusForInput('loading',e.target);this._removeAllStatusIcons('rn_Success','rn_Error');this._replaceLoadingWithStatus('success');this._removeCurrent();},_updateImageForLibrary:function(e){this.currentAvatarType='avatar_library';this.Y.all(this.baseSelector+" .rn_AvatarOptions .rn_Clicked").removeClass('rn_Clicked');e.target.addClass('rn_Clicked');this.selectedAvatar=e.target.getAttribute('data-name');if(this.numberOfPages>1){this.Y.one(this.baseSelector+" .rn_ImagePaginator .rn_CurrentPages").get('children').each(function(child){if(child.hasClass('rn_Selected')){this.selectedPage=parseInt(child.getAttribute('data-rel'),10);}},this);}
this.toggleSubmitButton(true);this._displayStatusForInput('loading',this._chooseButton);this._refreshPreviewImage(this.data.attrs.avatar_library_image_location_display+e.target.getAttribute('data-name'));},_updateImageForService:function(e){this._closeAndClearSelectedAvatar();var serviceName=e.currentTarget.getAttribute('data-service-name');this.currentAvatarType=serviceName;this.toggleAllButtons(true);this._displayStatusForInput('loading',e.target);this._refreshPreviewImage(this._getImageUrlForService(serviceName,this.data.js.email.hash));},_closeAndClearSelectedAvatar:function(){this.Y.all(this.baseSelector+" .rn_AvatarLibraryForm").addClass('rn_Hidden');this.selectedAvatar=this.selectedPage=this.firstPage=this.lastPage=null;},_previewImageForSocialService:function(e){this._updateImageForInput(e.target.ancestor().one('input'),true);},_updateImageForInput:function(input,displayStatusIcon){var username=this.Y.Lang.trim(input.get('value')),service=input.getAttribute('data-service');if(!username){return this._displayStatusForInput('error',input);}
this.toggleSubmitButton(true);if(displayStatusIcon){this._displayStatusForInput('loading',input);}
this._refreshPreviewImage(this._getImageUrlForService(service,username));},_displayStatusForInput:function(status,forElement){var currentIcon=forElement.next('.rn_StatusIcon');if(currentIcon){currentIcon.remove();}
forElement.insert(this._renderStatusView(status),'after');},_replaceLoadingWithStatus:function(status){this.element.all('.rn_LoadingStatus').each(function(node){if(node.hasClass('rn_Permanent')){node.replaceClass('rn_LoadingStatus',this.getStatus(status).className);}
else{node.replace(this.Y.Node.create(this._renderStatusView(status)));}},this);},_replaceAllWithStatus:function(status){this._removeAllStatusIcons('rn_Success','rn_Error');this._replaceLoadingWithStatus(status);},_removeAllStatusIcons:function(){var classes=arguments.length?Array.prototype.slice.call(arguments):['rn_StatusIcon'],YArray=this.Y.Array;this.element.all('.'+classes.join(',.')).each(function(node){if(!node.hasClass('rn_Permanent')){node.remove();}
else{YArray.each(classes,node.removeClass,node);}});},_removeCurrent:function(){this.element.all('.rn_ChosenAvatar').each(function(node){RightNow.UI.hide(node.one('.rn_CurrentSocialAvatar'));RightNow.UI.show(node.one('.rn_NewSocialInput'));node.removeClass('rn_ChosenAvatar');});},_renderStatusView:function(forStatus){this._statusView||(this._statusView=new EJS({text:this.getStatic().templates.statusIcon}));return this._statusView.render(this.getStatus(forStatus));},_refreshPreviewImage:function(url){var altData='';if(url===this.img.getAttribute('src')){return this.Y.Lang.later(100,this,this._onPreviewImageLoaded,[{target:this.img},true]);}
this.img.setAttribute('src',url);if(url.includes('gravatar')){this.img.setAttribute('alt',this.data.js.socialUserDisplayName);}
else{altData=url.split('/').pop().split('.')[0]||'';this.img.setAttribute('alt',altData);}},_onPreviewImageLoaded:function(e,displaySuccess){this.toggleAllButtons(false);if(this._copyElementAttribute(e.target,'src','data-fallback')||displaySuccess){this._replaceAllWithStatus('success');this._showPreviewImage(true);this._removeCurrent();this.avatarSelectionType=this.currentAvatarType;}},_onPreviewImageError:function(e){this.toggleAllButtons(false);this._copyElementAttribute(e.target,'data-fallback','src');this._replaceLoadingWithStatus('error');if(!this.img.getAttribute('data-fallback')){this._showPreviewImage(false);}},_monitorPreviewImage:function(img){this._copyElementAttribute(img,'src','data-fallback');img.on('load',this._onPreviewImageLoaded,this);img.on('error',this._onPreviewImageError,this);},_showPreviewImage:function(turnOn){if(turnOn){RightNow.UI.show(this.img);RightNow.UI.hide(this.defaultImg);}
else{RightNow.UI.hide(this.img);RightNow.UI.show(this.defaultImg);}},_copyElementAttribute:function(el,from,to){var fromValue=el.getAttribute(from),toValue=el.getAttribute(to);if(fromValue===toValue)return false;return!!el.setAttribute(to,fromValue);},_getPreviewImage:function(){return this.element.one('.rn_PreviewImage img').get('src');},_getImageUrlForService:function(service,username){return this.data.js[service].url;},toggleAllButtons:function(state){if(!this.avatarForm)return;this.avatarForm.all('button').each(function(node){node.set('disabled',state);},this);}});