<rn:meta title="#rn:msg:UPDATE_YOUR_PROFILE_PICTURE_LBL#" template="standard.php" login_required="true" force_https="true" />

<div class="rn_Hero">
    <div class="rn_Container">
        <h1>#rn:msg:ACCOUNT_SETTINGS_LBL#</h1>
    </div>
</div>

<div class="rn_PageContent rn_Profile rn_Container">
    <form id="rn_ProfilePicture" onsubmit="return false;">
        <div id="rn_ErrorLocation"></div>
        <rn:widget path="input/SocialUserAvatar"/>
        <br><br>
        <rn:condition is_active_social_user="true">
            <rn:widget path="input/FormSubmit" label_button="#rn:msg:SAVE_CHANGE_CMD#" on_success_url="/app/account/profile" error_location="rn_ErrorLocation" flash_message="#rn:msg:PROFILE_PICTURE_SUCCESSFULLY_UPDATED_MSG#" />
            <button class="yui3-button cancelButton" onclick="javascript:window.history.back();">#rn:msg:CANCEL_LBL#</button>
        </rn:condition>
    </form>
</div>
