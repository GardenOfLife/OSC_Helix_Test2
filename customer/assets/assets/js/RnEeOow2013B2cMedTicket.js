jQuery( document ).ready(function() {
  posSpacContainerDiv = jQuery("#mapImageSjElement4_img").offset();
  jQuery("#SpacContainerDiv").css({position:"fixed",left:posSpacContainerDiv.left,top:posSpacContainerDiv.top});
});