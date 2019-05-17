jQuery( document ).ready(function() {
  var posC2CallContainerDiv = jQuery("#rn_MainContent").offset();
  posC2CallContainerDiv.left = jQuery("#rn_MainContent").offset().left + jQuery("#rn_MainContent").width() - 305;
  posC2CallContainerDiv.top = jQuery("#"+idFromRegEx(/rn_ProductCategoryInput_\d+_Button_Visible_Text/,"SPAN")[1]).offset().top - 100;
  jQuery("#C2CallContainerDiv").css({position:"absolute",left:posC2CallContainerDiv.left,top:posC2CallContainerDiv.top});
  });