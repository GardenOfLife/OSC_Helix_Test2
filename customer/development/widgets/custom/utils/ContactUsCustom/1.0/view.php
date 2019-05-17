
<rn:block id='ContactUs-top'>
<?  $channelcnt = 1 ?>

</rn:block>


<!--
<rn:block id='ContactUs-preLegend'>

</rn:block>
-->

<!--
<rn:block id='ContactUs-postLegend'>

</rn:block>
-->

<!--
<rn:block id='ContactUs-preChannel'>

</rn:block>
-->


<rn:block id='ContactUs-postChannel'>
<? if ($channelcnt == 1) { ?>
Our Support Team will respond as soon as possible
        <div class="rn_PhoneLink"><a  href="javascript:void(0);">Call Us</a><br> #rn:msg:CUSTOM_MSG_PHONE_HOURS_LBL# </div>
<? } else { ?>
How can we make this site more useful for you?
<? }	$channelcnt++;     ?>
</rn:block>

<!--
<rn:block id='ContactUs-bottom'>

</rn:block>
-->

