<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="#rn:language_code#" xml:lang="#rn:language_code#">
<head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KV34SM');</script>
    <!-- End Google Tag Manager -->

    <meta charset="utf-8"/>
    <title><rn:page_title/></title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <!--[if lt IE 9]><script src="/euf/core/static/html5.js"></script><![endif]-->
    <rn:widget path="search/BrowserSearchPlugin" pages="home, answers/list, answers/detail" />
    <rn:theme path="/euf/assets/themes/branding" css="site.css,
        {YUI}/widget-stack/assets/skins/sam/widget-stack.css,
        {YUI}/widget-modality/assets/skins/sam/widget-modality.css,
        {YUI}/overlay/assets/overlay-core.css,
        {YUI}/panel/assets/skins/sam/panel.css" />
    <!-- Engagement Engine Scripts needed --------------->
       	<script type="text/javascript" src="//static.atgsvcs.com/js/atgsvcs.js"></script>
		<script type='text/javascript'>
        ATGSvcs.setEEID("#rn:config:CUSTOM_CFG_ATG_ID#");
        (function() {
        var l = document.domain,d=document,ss='script',s=d.getElementsByTagName(ss)[0],rn=d.createElement(ss);rn.type='text/javascript';
        rn.defer=rn.async=!0;rn.src=('https:'==d.location.protocol?'https://':'http://')+l+'/rnt/rnw/javascript/vs/1/vsapi.js';s.parentNode.insertBefore(rn, s);
        })();
        </script>

		<!-- End of EE Scripts ------------------------------>

    <rn:head_content/>
    <link rel="icon" href="images/favicon.png" type="image/png"/>
</head>
<body class="yui-skin-sam yui3-skin-sam">
   <!-- Google Tag Manager (noscript) -->
   <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KV34SM"
   height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
   <!-- End Google Tag Manager (noscript) -->
<div id="rn_Container" >
    <div id="rn_Navigation">
    	<rn:condition hide_on_pages="utils/help_search">
        <div id="rn_NavigationBar" role="navigation">
            <ul>
                <li><rn:widget path="navigation/NavigationTab" label_tab="#rn:msg:SUPPORT_HOME_TAB_HDG#" link="/app/home" pages="home, "/></li>
                <li><rn:widget path="navigation/NavigationTab" label_tab="#rn:msg:ANSWERS_HDG#" link="/app/answers/list" pages="answers/list, answers/detail"/></li>
                <li><rn:widget path="navigation/NavigationTab" label_tab="#rn:msg:COMMUNITY_LBL#" link="#rn:php:getConfig(COMMUNITY_HOME_URL, 'RNW') . communitySsoToken('?')#"  external="true"/></li>
        	<li><rn:widget path="navigation/NavigationTab" label_tab="#rn:msg:ASK_QUESTION_HDG#" link="/app/ask" pages="ask, ask_confirm"/></li>
                <li><rn:widget path="navigation/NavigationTab" label_tab="#rn:msg:YOUR_ACCOUNT_LBL#" link="/app/account/overview" pages="utils/account_assistance, account/overview, account/profile, account/notif, account/change_password, account/questions/list, account/questions/detail, account/notif/list, utils/login_form, utils/create_account, utils/submit/password_changed, utils/submit/profile_updated"
                subpages="#rn:msg:ACCOUNT_OVERVIEW_LBL# > /app/account/overview, #rn:msg:SUPPORT_HISTORY_LBL# > /app/account/questions/list, #rn:msg:ACCOUNT_SETTINGS_LBL# > /app/account/profile, #rn:msg:NOTIFICATIONS_LBL# > /app/account/notif/list"/></li>
            </ul>
        </div>
    </rn:condition>
        <rn:condition is_spider="false">
            <div id="rn_LoginStatus">
            <rn:condition logged_in="true">
                 #rn:msg:WELCOME_BACK_LBL#
                <strong>
                    <rn:field name="contacts.full_name"/>
                </strong>
                <div>
                    <rn:field name="contacts.organization_name"/>
                </div>
                <rn:widget path="standard/login/LogoutLink2"/>
            <rn:condition_else />

                <rn:condition config_check="RNW_UI:PTA_EXTERNAL_LOGIN_URL != null">
                    <a href="javascript:void(0);" id="rn_LoginLink">#rn:msg:LOG_IN_LBL#</a>&nbsp;|&nbsp;<a href="javascript:void(0);">#rn:msg:SIGN_UP_LBL#</a>
                <rn:condition_else>
                    <a href="javascript:void(0);" id="rn_LoginLink">#rn:msg:LOG_IN_LBL#</a>&nbsp;|&nbsp;<a href="/app/utils/create_account#rn:session#">#rn:msg:SIGN_UP_LBL#</a>
                    <rn:condition hide_on_pages="utils/create_account, utils/login_form, utils/account_assistance">
                        <rn:widget path="login/LoginDialog" trigger_element="rn_LoginLink" open_login_url="/app/#rn:config:CP_LOGIN_URL#" label_open_login_link="#rn:msg:LOG_EXISTING_ACCOUNTS_LBL# <span class='rn_ScreenReaderOnly'>(Facebook, Twitter, Google, OpenID) #rn:msg:CONTINUE_FOLLOWING_FORM_LOG_CMD#</span>"/>
                    </rn:condition>
                    <rn:condition show_on_pages="utils/create_account, utils/login_form, utils/account_assistance">
                        <rn:widget path="login/LoginDialog" trigger_element="rn_LoginLink" redirect_url="/app/account/overview" open_login_url="/app/#rn:config:CP_LOGIN_URL#" label_open_login_link="#rn:msg:LOG_EXISTING_ACCOUNTS_LBL# <span class='rn_ScreenReaderOnly'>(Facebook, Twitter, Google, OpenID) #rn:msg:CONTINUE_FOLLOWING_FORM_LOG_CMD#</span>"/>
                    </rn:condition>
                </rn:condition>
            </rn:condition>
        </div>
        </rn:condition>
    </div>
    <div style="clear:both;"></div>
    <div id="rn_Body">
        <div id="rn_MainColumn" role="main">
            <a name="rn_MainContent" id="rn_MainContent"></a>
            <rn:page_content/>
        </div>
        <rn:condition is_spider="false">
            <div id="rn_SideBar" role="navigation">
                <div class="rn_Padding">
                    <rn:condition hide_on_pages="answers/list, home, account/questions/list">
                    <div class="rn_Module" role="search">
                        <h2>#rn:msg:FIND_ANS_HDG#</h2>
                        <rn:widget path="search/SimpleSearch"/>
                    </div>
                    </rn:condition>
                    <div class="rn_Module">
                        <h2>#rn:msg:CONTACT_US_LBL#</h2>
                        <div class="rn_HelpResources">
                            <div class="rn_Questions">
                                <a href="/app/ask#rn:session#">#rn:msg:ASK_QUESTION_LBL#</a>
                                <span>#rn:msg:SUBMIT_QUESTION_OUR_SUPPORT_TEAM_CMD#</span>
                            </div>
                            <div class="rn_Community">
                                <a href="javascript:void(0);">#rn:msg:ASK_THE_COMMUNITY_LBL#</a>
                                <span>#rn:msg:SUBMIT_QUESTION_OUR_COMMUNITY_CMD#</span>
                            </div>
                            <div class="rn_Chat">
                                <a href="/app/chat/chat_launch#rn:session#">#rn:msg:LIVE_CHAT_LBL#</a>
                                <span>#rn:msg:CHAT_DIRECTLY_SUPPORT_TEAM_MSG#</span>
                            </div>
                            <div class="rn_Contact">
                                <a href="javascript:void(0);">#rn:msg:CONTACT_US_LBL#</a>
                                <span>#rn:msg:CANT_YOURE_LOOKING_SITE_CALL_MSG#</span>
                            </div>
                            <div class="rn_Feedback">
                                <rn:widget path="standard/feedback/SiteFeedback2" />
                                <span>#rn:msg:SITE_USEFUL_MSG#</span>
                            </div>
                        </div>
                    </div>
                    <div class="rn_Module">
                    	<h3>Screen Sharing</h3>
                        <rn:widget path="standard/utils/CoBrowseLink" />
                    </div>
                    <div class="rn_Module">
            			<h3>Follow us on:</h3>
                		<a href="http://twitter.com/smartechnology" target="new"><img src="/euf/assets/images/icons/twitter2.jpg" width="40" height="50" /></a><a href="http://www.facebook.com/pages/Retail/134507063286772" target="new"><img src="/euf/assets/images/icons/facebook.jpg" width="40" height="50" /></a>
            		</div>
                </div>
            </div>
        </rn:condition>
    </div>
    <div id="rn_Footer" role="contentinfo">
        <div id="rn_RightNowCredit">
            <div class="rn_FloatRight">
                <rn:widget path="utils/RightNowLogo"/>
            </div>
        </div>
    </div>
</div>
<rn:widget path="chat/ProactiveChat" initiate_by_event="true" min_sessions_avail="1"/>
</body>
</html>
