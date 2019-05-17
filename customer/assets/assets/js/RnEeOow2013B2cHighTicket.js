jQuery( document ).ready(function() {
  posSpacContainerDiv = jQuery(".recommended_product_image").offset();
  jQuery("#C2CallContainerDiv").css({position:"absolute",left:posSpacContainerDiv.left,top:posSpacContainerDiv.top});

  posSpacContainerDiv2 = jQuery(".recommended_product_image").offset();
  posSpacContainerDiv2.left = posSpacContainerDiv.left;
  posSpacContainerDiv2.top = posSpacContainerDiv.top + 280;
    jQuery("#SpacContainerDiv").css({position:"absolute",left:posSpacContainerDiv2.left,top:posSpacContainerDiv2.top});

});