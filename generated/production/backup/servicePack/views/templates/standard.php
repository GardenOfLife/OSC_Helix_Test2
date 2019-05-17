<!DOCTYPE html>
<html lang="#rn:language_code#">
<rn:meta javascript_module="standard"/>
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
    <rn:theme path="/euf/assets/themes/standard" css="site.css"/>
    <rn:head_content/>
    <link rel="icon" href="/euf/assets/images/favicon.png" type="image/png"/>
    <rn:widget path="utils/ClickjackPrevention"/>
    <rn:widget path="utils/AdvancedSecurityHeaders"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body class="yui-skin-sam yui3-skin-sam" itemscope itemtype="http://schema.org/WebPage">
   <!-- Google Tag Manager (noscript) -->
   <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KV34SM"
   height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
   <!-- End Google Tag Manager (noscript) -->
<a href="#rn_MainContent" class="rn_SkipNav rn_ScreenReaderOnly">#rn:msg:SKIP_NAVIGATION_CMD#</a>

<header>
    <rn:widget path="utils/CapabilityDetector"/>
<nav>
        <div class="rn_NavigationBar">
            			<a href="https://www.gardenoflife.com/content/" rel="home">
							<img src="images/logo-2.png" alt="#rn:msg:CUSTOM_MSG_GARDENOFLIFE#">
						</a>
						<a class="rn_SelectedTab" href="/app/home" target="_self" aria-label="Support Home selected"><span class="header-center">#rn:msg:SUPPORT_CENTER_LBL#</span>  </a>

        </div>
    </nav>

</header>
<div class="rn_Hero">
    <div class="rn_HeroInner">
        <div class="rn_SearchControls">
            <h1 class="rn_ScreenReaderOnly">#rn:msg:SEARCH_CMD#</h1>
            <form method="get" action="/app/answers/list">
                <rn:container source_id="KFSearch">
                    <div class="rn_SearchInput">
                        <rn:widget path="searchsource/SourceSearchField" initial_focus="true" label_placeholder="#rn:msg:CUSTOM_MSG_SEARCH_TXT#"/>
                    </div>
                    <rn:widget path="searchsource/SourceSearchButton" search_results_url="/app/answers/list" label_button="#rn:msg:SEARCH_HDG#"/>
                </rn:container>
            </form>

		</div>
    </div>
</div>

<div class="rn_Body">
<rn:condition hide_on_pages="answers/detail, answers/list, results, account/questions/list">
       <div class="rn_Container rn_GOLHelp">
            <h1>#rn:msg:WERE_HERE_TO_HELP_LBL#</h1>
			<span>#rn:msg:CUSTOM_MSG_CONNECT_SUPPORT# </span>
 <br>
 <a class="Gray-Box" href="/app/ask"><img src="images/envelope.png"> <br><h2>#rn:msg:EMAIL_US_LBL#</h2> #rn:msg:CUSTOM_MSG_EMAIL_RESPONSE_TIME#</a>
	<a class="Gray-Box" href="/app/callus"><img src="images/phone.png"> <br><h2>#rn:msg:CALL_US_LBL#</h2> #rn:msg:CUSTOM_MSG_PHONE_SUPPORT_HOURS#</a>
</div>
</rn:condition>


 <div class="rn_Container">
    <div class="rn_MainColumn" role="main">
        <a id="rn_MainContent"></a>
        <rn:page_content/>
		<rn:condition hide_on_pages="answers/detail, answers/list, results, account/questions/list">
		<div class="rn_PopularKB">
	        <div class="rn_Center">
	            <div class="rn_FAQ_title">#rn:msg:POPULAR_PUBLISHED_ANSWERS_LBL#</div>
				<div class="rn_FAQ_label">#rn:msg:CUSTOM_MSG_FAQ_HELP_LBL#</div>
				<rn:widget path="reports/TopAnswers" show_excerpt="false" limit="8"/>
	    	</div>
	    </div>
	    </rn:condition>
	  </div>
</div>

<footer class="rn_Footer">
    <div class="rn_Container">

		<div class="rn_TwoColumns rn_fontsize22">
			#rn:msg:CUSTOM_MSG_CORP_ADDRESS_LBL#
		</div>
		<div class="rn_TwoColumns rn_fontsize22">
			<b>#rn:msg:CUSTOM_MSG_MAINPHONE_LBL# </b>#rn:msg:CUSTOM_MSG_MAINPHONE# <br>
			<b>#rn:msg:CUSTOM_MSG_FAX_LBL# </b> #rn:msg:CUSTOM_MSG_FAX# <br>
			<b>#rn:msg:CUSTOM_MSG_PRODUCT_INQUIRIES_LBL# </b> #rn:msg:CUSTOM_MSG_PRODUCT_INQUIRIES# <br>
			<b>#rn:msg:CUSTOM_MSG_RETAIL_PRACTITIONERS_LBL#</b>  #rn:msg:CUSTOM_MSG_RETAIL_PRACTITIONERS# <br>
		</div>
    </div>
</footer>
</body>
</html>
