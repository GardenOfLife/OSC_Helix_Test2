<rn:meta title="#rn:msg:ASK_QUESTION_HDG#" template="standard.php" clickstream="incident_create"/>
<div class="rn_EmailUs">
           #rn:msg:SUBMIT_QUESTION_OUR_SUPPORT_TEAM_CMD#
</div>
<div class="rn_PageContent rn_AskQuestion rn_Container">
    <form id="rn_QuestionSubmit" method="post" action="/ci/ajaxRequest/sendForm">
        <div id="rn_ErrorLocation"></div>

	<rn:widget path="input/DynamicProductCategoryInput" name="Incident.Category"
                show_fields_for_ids="530:Incident.CustomFields.c.aer_prod_name,Incident.CustomFields.c.aer_lot_num,Incident.FileAttachments,Incident.CustomFields.c.purch_loc|531:Incident.CustomFields.c.org_ordnum|534:Incident.CustomFields.c.aer_prod_name,Incident.CustomFields.c.aer_lot_num,Incident.FileAttachments,Incident.CustomFields.c.purch_loc|535:Incident.CustomFields.c.aer_prod_name,Incident.CustomFields.c.aer_lot_num,Incident.FileAttachments,Incident.CustomFields.c.purch_loc|*:Contact.first_name,Contact.last_name,Contact.Emails.PRIMARY.Address,Incident.Subject,Incident.Threads"
                fields_required_for_ids="534:Contact.Phones.OFFICE.Number|535:Contact.Phones.OFFICE.Number"
                 data_type="Category" label_input="#rn:msg:CUSTOM_MSG_BEST_DESC_QUESTION#" required_lvl =1  />

				 <div>
					<div class="rn_TwoColumns rn_TwoColumnsRight">
						<rn:widget path="input/FormInput" name="Contact.first_name" required="true"  label_input="#rn:msg:FIRST_NAME_LBL#"/>
					</div>
					<div class="rn_TwoColumns">
						<rn:widget path="input/FormInput" name="Contact.last_name"   label_input="#rn:msg:LAST_NAME_LBL#"/>
					</div>
				</div>
				<div>
					<div class="rn_TwoColumns rn_TwoColumnsRight">
						<rn:widget path="input/FormInput" name="Contact.Emails.PRIMARY.Address"	required="true" label_input="#rn:msg:EMAIL_ADDR_LBL#"/>
					</div>
					<div class="rn_TwoColumns">
						<rn:widget path="input/FormInput" name="Contact.Phones.OFFICE.Number"	required="false" label_input="#rn:msg:PHONE_LBL#"/>
					</div>
				</div>

				<div>
					<div class="rn_TwoColumns rn_TwoColumnsRight">
						<rn:widget path="input/FormInput" name="Incident.CustomFields.c.aer_prod_name" hide_on_load="true" required="false" label_input="#rn:msg:PRODUCT_LBL#"/>
					</div>
					<div class="rn_TwoColumns">
						<rn:widget path="input/FormInput" name="Incident.CustomFields.c.aer_lot_num" hide_on_load="true" required="false" />
					</div>
				</div>
        <div>
          <rn:widget path="input/FormInput" name="Incident.CustomFields.c.purch_loc" label_input="Place of Purchase" hide_on_load="true" required="false" />
        </div>
				<rn:widget path="input/FormInput" name="Incident.CustomFields.c.org_ordnum" required="false" hide_on_load="true" label_input="#rn:msg:ORDER_NUMBER_CMD#"/>
				<rn:widget path="custom/input/FileAttachmentUploadWhite" name ="Incident.FileAttachments" hide_on_load="true" label_input="Attachments" />
				<div class="rn_Hidden">
					<rn:widget path="input/FormInput" name="Incident.Subject" required="true" label_input="#rn:msg:QUESTION_LBL#"/>
				</div>
		        <rn:widget path="input/FormInput" name="Incident.Threads" required="true" label_input="#rn:msg:QUESTION_LBL#"/>

				<rn:widget path="input/FormSubmit" label_button="#rn:msg:SUBMIT_YOUR_QUESTION_CMD#" on_success_url="/app/ask_confirm" error_location="rn_ErrorLocation"/>

				<? /*
				<rn:condition content_viewed="2" searches_done="1">
				<rn:condition_else/>
					<rn:widget path="input/SmartAssistantDialog" label_prompt="#rn:msg:OFFICIAL_SSS_MIGHT_L_IMMEDIATELY_MSG#"/>
				</rn:condition>
				*/ ?>
    </form>
</div>

<script>

	function rn_SetSubject(elemID) {
		setTimeout(function(){
			//elemID = elemID+'_Button_Visible_Text'
			//console.log(elemID);
			//mytext = document.getElementById('rn_DynamicProductCategoryInput_6_Button_Visible_Text').innerHTML;
			mytext = document.getElementById('rn_DynamicProductCategoryInput_6_Button_Visible_Text').innerHTML;
			//console.log(mytext);
			document.getElementById('rn_TextInput_25_Incident.Subject').value = mytext;
	    }
		, 1000 );

	}

</script>
