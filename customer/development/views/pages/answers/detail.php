<rn:meta title="#rn:php:\RightNow\Libraries\SEO::getDynamicTitle('answer', \RightNow\Utils\Url::getParameter('a_id'))#" template="standard.php" answer_details="true" clickstream="answer_view"/>
<style>
div.rn_PhoneLink, 
div.rn_FeedbackLink, 
div.rn_QuestionLink {
	margin-top: 30px !important;
}
</style>

<div class="rn_ContentDetailContainer">
<article itemscope itemtype="http://schema.org/Article" class="rn_Container">
    <div class="rn_ContentDetail">
        <div class="rn_PageTitle rn_RecordDetail">
            <rn:widget path="navigation/ProductCategoryBreadcrumb" display_first_item="false"/>
            <h1 class="rn_Summary" itemprop="name"><rn:field name="Answer.Summary" highlight="true"/></h1>
           
        </div>

        <div class="rn_PageContent rn_RecordDetail">
	        
            <div class="rn_RecordText rn_AnswerText" itemprop="articleBody">
                <rn:field name="Answer.Solution" highlight="true"/>
            </div>
            <rn:widget path="knowledgebase/GuidedAssistant"/>
            <div class="rn_FileAttach">
                <rn:widget path="output/DataDisplay" name="Answer.FileAttachments" label="#rn:msg:ATTACHMENTS_LBL#"/>
            </div>
            
            <rn:widget path="feedback/AnswerFeedback" label_title="#rn:msg:IS_THIS_ANSWER_HELPFUL_LBL#"/>
			<rn:widget path="knowledgebase/RelatedAnswers" label_title="#rn:msg:ANSWERS_OTHERS_FOUND_HELPFUL_LBL#" />
			<rn:widget path="custom/knowledgebase/PreviousAnswers" />
           
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
        callus_link="/app/callus" />
    </aside>
    
</article>
<div class="rn_DetailTools rn_HideInPrint">
        <div class="rn_Links">
            <rn:condition logged_in="true">
                <rn:widget path="notifications/AnswerNotificationIcon" />
            </rn:condition>
            <rn:widget path="utils/SocialBookmarkLink" />
            <rn:widget path="utils/PrintPageLink" />
            <rn:widget path="utils/EmailAnswerLink" />
        </div>
    </div>
</div>
