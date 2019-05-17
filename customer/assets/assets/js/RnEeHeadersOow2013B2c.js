var ruleMatchName;
var rn_Multiline_Content;
var rn_KeywordText;
var rn_CategoryInput;
var rn_Search_Count;
var rn_SearchButton_Id;
var rn_AnswerFeedbackNo_Id;
var rn_AnsweeFeedbackNo_Hover = false;

(function() {
  var l=window.location.host,d=document,ss='script',s=d.getElementsByTagName(ss)[0],rn=d.createElement(ss),rn2=d.createElement(ss);rn.type=rn2.type='text/javascript';
  rn.defer=rn2.defer=rn.async=rn2.async=!0;
  rn.src=rn2.src=('https:'==d.location.protocol?'https://':'http://')+l;
  rn.src+='rnt/rnw/javascript/vs/1/vsapi.js';
  rn2.src+='vs/1/vsopts.js';
  s.parentNode.insertBefore(rn, s);
  s.parentNode.insertBefore(rn2,s);
})();

jQuery( document ).ready(function() {
  ruleMatchName = [];
  rn_Search_Count = 0;
  rn_Multiline_Content = document.getElementById(idFromRegEx(/rn_Multiline_\d+_Content/, "DIV")[0]);
  rn_KeywordText = document.getElementById(idFromRegEx(/rn_KeywordText_\d+_Text/, "INPUT")[0]);
  rn_CategoryInput = document.getElementById(idFromRegEx(/rn_ProductCategoryInput_\d+_Button_Visible_Text/,"SPAN")[1]);
  rn_SearchButton_Id = idFromRegEx(/rn_SearchButton_\d+_SubmitButton/,"INPUT")[0];
  rn_AnswerFeedbackNo_Id = idFromRegEx(/rn_AnswerFeedback_\d+_RatingNoButton/,"BUTTON")[0];
  if (rn_KeywordText !== null) {
    if (rn_KeywordText.value.length > 0) {
      rn_Search_Count++;
    }
  }
  if (rn_SearchButton_Id !== null) {
    jQuery("#"+rn_SearchButton_Id).click(function(){
      rn_Search_Count++;
    });
  }
});

function upSearchCount() {
  rn_Search_Count++;
}

function test_AnsweeFeedbackNo_Hover() {
  if (rn_AnsweeFeedbackNo_Hover == true) {
    return true;
  } else {
    return false;
  }
}

function testSearchCount() {
  if (rn_Search_Count >= 3) {
    return true;
  } else {
    return false;
  }
}

function addRuleMatchName(strName) {
  ruleMatchName.push(strName);
  alert2(strName);
}

function idFromRegEx(pattern, tag, root) {
  root = root || document;
  tag  = tag || "*";
  var arr = root.getElementsByTagName(tag);
  var len = arr.length;
  var ret = [];
  for ( var i = 0; i < len; i++ ) {
    if ( pattern.test(arr[i].id) === true )
      ret.push(arr[i].id);
  }
  return ret;
}

jQuery.fn.center = function () {
  if (parent) {
    parent = this.parent();
  } else {
    parent = window;
  }
  
  this.css({
    "position": "absolute",
    "top": (((jQuery(parent).height() - this.outerHeight()) / 2) + jQuery(parent).scrollTop() + "px"),
    "left": (((jQuery(parent).width() - this.outerWidth()) / 2) + jQuery(parent).scrollLeft() + "px")
    });
  
  return this;
}