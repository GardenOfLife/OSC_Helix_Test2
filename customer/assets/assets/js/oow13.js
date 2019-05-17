var pathArray = window.location.pathname.split( '/' );
var pageLink = pathArray[0] + "/" + pathArray[1];
if (pathArray[2]) {
    pageLink = pageLink + "/" + pathArray[2];
}
if (pathArray[3]) {
    pageLink = pageLink + "/" + pathArray[3];
}
switch (pageLink) {
    case "/":
        $('a[href="/"]').parent().addClass("active");
        $('a[href="/app"]').parent().addClass("active");
        $('a[href="/app/home"]').parent().addClass("active");
        break;
    case "/app":
        $('a[href="/"]').parent().addClass("active");
        $('a[href="/app"]').parent().addClass("active");
        $('a[href="/app/home"]').parent().addClass("active");
        break;
    case "/app/":
        $('a[href="/"]').parent().addClass("active");
        $('a[href="/app"]').parent().addClass("active");
        $('a[href="/app/home"]').parent().addClass("active");
        break;
    case "/app/home":
        $('a[href="/"]').parent().addClass("active");
        $('a[href="/app"]').parent().addClass("active");
        $('a[href="/app/home"]').parent().addClass("active");
        break;
    default:
        $('a[href="' + pageLink + '"]').parent().addClass("active");
        break;
}
function setCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "false";
}
$(document).ready(function() {
    var sideBarVisible = getCookie("RNDemo.Sidebar.Visible");
    if (sideBarVisible == "true") {
        $("#rn_SideBar").css({"right": "0px"});
        $("#rn_MainColumn").css({"margin-right": "300px"}).removeClass("sidebar-hidden").addClass("sidebar-visible");
        $("#rn_SideBarToggle").find("span").addClass("visible");
        $("#rn_SideBarToggle").find("i").fadeOut(); 
    } else if (sideBarVisible == "false") {
        $("#rn_SideBar").css({"right": "-280px"});
        $("#rn_MainColumn").css({"margin-right": "0px"}).addClass("sidebar-hidden").removeClass("sidebar-visible");
        $("#rn_SideBarToggle").find("span").removeClass("visible");
        $("#rn_SideBarToggle").find("i").delay(300).fadeIn();
    }

    $("#rn_SideBarToggle").on("click", "span", function(e) {
        if (sideBarVisible == "true") {
            $("#rn_SideBar").css({"right": "-280px"});
            $("#rn_MainColumn").css({"margin-right": "0px"}).addClass("sidebar-hidden").removeClass("sidebar-visible");
            $("#rn_SideBarToggle").find("span").removeClass("visible");
            $("#rn_SideBarToggle").find("i").delay(300).fadeIn();
            setCookie("RNDemo.Sidebar.Visible", "false", 90);
            sideBarVisible = "false";
        } else if (sideBarVisible == "false") {
            $("#rn_SideBar").css({"right": "0px"});
            $("#rn_MainColumn").css({"margin-right": "300px"}).removeClass("sidebar-hidden").addClass("sidebar-visible");
            $("#rn_SideBarToggle").find("span").addClass("visible");        
            $("#rn_SideBarToggle").find("i").fadeOut(); 
            setCookie("RNDemo.Sidebar.Visible", "true", 90);            
            sideBarVisible = "true";
        }
    });

    /*
    HeaderDropPanel.update('cart');
    HeaderDropPanel.update('list');
    HeaderDropPanel.update('login');
    */
});
function gototop() {
    $("body").animate({ scrollTop: 0 }, "slow");
}
