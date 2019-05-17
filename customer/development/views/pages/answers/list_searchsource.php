<rn:meta title="#rn:msg:FIND_ANS_HDG#" template="standard.php" clickstream="answer_list"/>

<div class="rn_AnswerListContainer">
<? /* <rn:condition url_parameter_check="kw != null">

    <div class="rn_Container">
        <div class="rn_PageContent rn_KBAnswerList">
            <div class="rn_HeaderContainer">
                <h2>#rn:msg:PUBLISHED_ANSWERS_LBL#:</h2>
            </div>

            <rn:condition flashdata_value_for="info">
                <div class="rn_MessageBox rn_InfoMessage">
                    #rn:flashdata:info#
                </div>
            </rn:condition>

            <rn:container source_id="KFSearch" per_page="10" history_source_id="KFSearch">
            <div>
                <rn:widget path="searchsource/SourceResultDetails"/>
					<rn:widget path="searchsource/SourceResultListing" more_link_url=""/>
                <rn:widget path="searchsource/SourcePagination"/>
            </div>
            </rn:container>
        </div>

        <aside class="rn_SideRail" role="complementary">
            <rn:widget path="custom/utils/ContactUsWithCall"  channels="question, callus, feedback" 
		        question_label="#rn:msg:EMAIL_US_LBL#" 
		        feedback_label="#rn:msg:FEEDBACK_LBL#"
		        callus_label="#rn:msg:CALL_US_LBL#"
		        question_description_label="#rn:msg:CUSTOM_MSG_RESPOND_ASAP#" 
		        callus_description_label="#rn:msg:CUSTOM_MSG_PHONE_SUPPORT_DESC#"
		        feedback_description_label="#rn:msg:CUSTOM_MSG_FEEDBACK_DESC#"
		        callus_link="/app/callus"  />
        </aside>
    </div>
<rn:condition_else/> */ ?>
    <rn:container report_id="101423">

    <div class="rn_Container">
        <div class="rn_PageContent rn_KBAnswerList">
            <div class="rn_HeaderContainer">
                <h2>#rn:msg:PUBLISHED_ANSWERS_LBL#</h2>
            </div>

 
            <div>
                <rn:widget path="reports/ResultInfo" show_no_results_msg_without_search_term="true"/>
                <rn:widget path="reports/Multiline" />
                <rn:widget path="reports/Paginator"/>
            </div>
        </div>

        <aside class="rn_SideRail" role="complementary">
	        <rn:widget path="custom/utils/ContactUsWithCall"  channels="question, callus, feedback" 
	        question_label="#rn:msg:EMAIL_US_LBL#" 
	        feedback_label="#rn:msg:FEEDBACK_LBL#"
	        callus_label="#rn:msg:CALL_US_LBL#"
	        question_description_label="#rn:msg:CUSTOM_MSG_RESPOND_ASAP#" 
	        callus_description_label="#rn:msg:CUSTOM_MSG_PHONE_SUPPORT_DESC#"
	        feedback_description_label="#rn:msg:CUSTOM_MSG_FEEDBACK_DESC#"
	        callus_link="/app/callus"  />
    	</aside>
    </div>
    </rn:container>
<? /* </rn:condition> */ ?>
</div>