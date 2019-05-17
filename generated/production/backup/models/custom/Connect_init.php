<?
namespace RightNow\ConnectAPI
{

    require_once( "Connect_build_ver.php" );

    putenv( "CGI_ROOT=." );

    if ( !extension_loaded( "ConnectPHP" ) )
    {
        $dlfile = "libConnectPHP.so.".$CONNECT_BUILD_VER;
        $safe_mode = ini_get( "safe_mode" );
        if ( !function_exists( "dl" ) || $safe_mode )
        {
            $msg = "";
            if ( $safe_mode )
            {
                $msg .= "\n  safe_mode is enabled:";
                $msg .= "\n    Add \"extension = $dlfile\" to php.ini (best at this time)";
                if ( function_exists( "dl" ) )
                {
                    $msg .= "\n    Or set \"safe_mode = Off\" in php.ini";
                }
            } else
            if ( !function_exists( "dl" ) )
            {
                $msg .= "\n  dl() function is disabled:";
                $msg .= "\n    Add 'extension = \"$dlfile\"' to php.ini (best at this time)";
                $msg .= "\n    Or enable dl/additional_functions in sapi/cgi/cgi_main.c";
            }
?>
            <html><body>
            <b>ConnectPHP Module is not present!</b>
            <code><pre>
            <? echo $msg ?>
            </pre></code>
            </body></html>
<?
            die();
        }
        dl( $dlfile );
    }

    error_reporting(  E_ALL ^ (E_NOTICE | E_WARNING | E_DEPRECATED) );
}


namespace RightNow\Connect\v1
{

    /*
    // If needed, extend ConnectObject from the base definition to
    // add/model extra functionality before
    // folding into a C/C++ Zend API implementation.
    class ConnectObject extends _papi_base_ConnectObject
    {
    };
    // */

    /*
    // If needed, extend RNObject from the base definition to
    // add/model extra functionality before
    // folding into a C/C++ Zend API implementation.
    class RNObject extends _papi_base_RNObject
    {
    };
    // */

}


?>
