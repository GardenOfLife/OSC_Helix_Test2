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
