
<!DOCTYPE html>
<html lang="#rn:language_code#"><head>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KV34SM');</script>
    <!-- End Google Tag Manager -->


        <meta name="viewport" content="width=768px, minimum-scale=1.0, maximum-scale=1.0" />
        <meta charset="utf-8"/>
        <title><rn:page_title/></title>

              <rn:theme path="/euf/assets/themes/tablet" css="site.css,
    	{YUI}/widget-stack/assets/skins/sam/widget-stack.css,
        {YUI}/widget-modality/assets/skins/sam/widget-modality.css,
        {YUI}/overlay/assets/overlay-core.css,
        {YUI}/panel/assets/skins/sam/panel.css" />
    <rn:head_content/>

        <link rel="icon" href="../../../../../euf/development/views/templates/images/favicon.png" type="image/png">

    </head>
   <body class="yui-skin-sam yui3-skin-sam">
      <!-- Google Tag Manager (noscript) -->
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KV34SM"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      <!-- End Google Tag Manager (noscript) -->

   <!--Start Custom Logo-->
    <div id="mobilelogo">
    <div id="imagepadding">
    <img src="http://oow2013b2b.rightnowdemo.com/euf/assets/images/logo.png" alt="logo" height="48">
    </div>
	</div>
   <!--End Custom Logo-->


   <!-- Start Home Button -->
	<div id="tablethome">
    <a href="/app/">Home</a>
    </div>
   <!-- End Home Button -->

   <!--Start Navigation Buttons -->


   <div id="tabletnav">
   <ul>
   <li><a href="/app/chat/chat_launch"><img src="/euf/assets/images/tablet/chat.png" height="160"></a></li>
     <li><a href="javascript:void(0);"><img src="/euf/assets/images/tablet/call.png" height="160"></a></li>
       <li><a href="javascript:void(0);"><img src="/euf/assets/images/tablet/community.png" height="160"></a></li>
         <li><a href="/app/ask"><img src="/euf/assets/images/tablet/email.png" height="160"></a></li>
           <li><a href="/app/answers/list"><img src="/euf/assets/images/tablet/search.png" height="160"></a></li>
            <li><a href="/app/account/profile"><img src="/euf/assets/images/tablet/account.png" height="160"></a></li>
   </ul>
   </div>

   <!-- End Navigation Buttons-->

   <!--Start Categories and Answers Buttons -->
   <!-- End Categories and Answers Buttons -->




    <section role="main">
            <rn:page_content/>
    </section>

    </body>
    </html>





































  <!--

      <noscript><h1>#rn:msg:SCRIPTING_ENABLED_SITE_MSG#</h1></noscript>
        <header role="banner">
            <rn:condition is_spider="false">
            <nav id="rn_Navigation" role="navigation"><span class="rn_FloatLeft">
                <rn:widget path="navigation/MobileNavigationMenu" submenu="rn_MenuList"/>
            </span>

                    </li>
                    <li>
                        <a href="javascript:void(0);" class="rn_ParentMenu">#rn:msg:YOUR_ACCOUNT_LBL#</a>
                        <ul class="rn_Submenu rn_Hidden">
                            <rn:condition logged_in="false">
                            <li><a href="/app/utils/create_account#rn:session#">#rn:msg:SIGN_UP_LBL#</a></li>
                            <li><a href="/app/utils/login_form#rn:session#">#rn:msg:LOG_IN_LBL#</a></li>
                            <li><a href="/app/utils/account_assistance#rn:session#">#rn:msg:ACCOUNT_ASSISTANCE_LBL#</a></li>
                            </rn:condition>
                            <li><a href="/app/account/questions/list#rn:session#">#rn:msg:VIEW_YOUR_SUPPORT_HISTORY_CMD#</a></li>
                            <li><a href="/app/account/profile#rn:session#">#rn:msg:CHANGE_YOUR_ACCOUNT_SETTINGS_CMD#</a></li>
                        </ul>
                    </li>
                </ul>
                <span class="rn_FloatRight rn_Search" role="search">
                    <rn:widget path="navigation/MobileNavigationMenu" label_button="#rn:msg:SEARCH_LBL#<img src='images/search.png' alt='#rn:msg:SEARCH_LBL#'/>" submenu="rn_SearchForm"/>
                </span>
                <div id="rn_SearchForm" class="rn_Hidden">
                    <rn:widget path="search/MobileSimpleSearch" report_page_url="/app/answers/list"/>
                </div>
            </nav>
            </rn:condition>
        </header>

        <section role="main">
            <rn:page_content/>
    </section>

        <footer role="contentinfo">
            <rn:condition is_spider="false">
                <div>
                    <rn:condition logged_in="true">
                    <rn:field name="contacts.email"/><rn:widget path="login/LogoutLink2"/>
                    <rn:condition_else />
                    <a href="/app/utils/login_form#rn:session#">#rn:msg:LOG_IN_LBL#</a>
                    </rn:condition>
                    <br/><br/>
                </div>
                <rn:condition hide_on_pages="utils/guided_assistant">
                    <rn:widget path="utils/PageSetSelector"/>
                </rn:condition>
                <div class="rn_FloatLeft"><a href="javascript:window.scrollTo(0, 0);">#rn:msg:ARR_BACK_TO_TOP_LBL#</a></div>
            </rn:condition>
            <div class="rn_FloatRight">Powered by <a href="http://www.rightnow.com">RightNow</a></div>
            <br/><br/>
        </footer>
    </body>
</html>

-->
