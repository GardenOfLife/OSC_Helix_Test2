<?php

////////////////////////////////////////////////////////////////////////////////
// RightNow Customer Portal Sample Code
//
// RightNow Confidential
//
// Copyright 2006 - 2008 RightNow Technologies.  All Rights Reserved.
//
// Sample code for training only. This sample code is provided "as is" with no warranties 
// of any kind express or implied. Use of this sample code is pursuant to the applicable
// non-disclosure agreement and or end user agreement and or partner agreement between
// you and RightNow Technologies. You acknowledge RightNow Technologies is the exclusive
// owner of the object code, source code, results, findings, ideas and any works developed
// in using this sample code.
//
// Files: google_model.php
//
// Comments: Illustrates a sample for Customer Portal
//
// Notes:   
//			
//          
//
// Pre-Conditions: 
//          1. Customer Portal needs to be enabled on the site
//          2. WebDav connection to site needs to be setup.
////////////////////////////////////////////////////////////////////////////////

class Google_model extends Model 
{
    function Google_model()
    {
        parent::Model();
        //This model would be loaded by using $this->load->model('custom/Sample_model');
    }


	function doSearch($keywords, $version, $url) 
	{
		
	  if(!extension_loaded('curl'))
          dl('curl_nossl_php5.so');
	   
	   $port = 80;
	 
	   $keywords = urlencode($keywords);
	
	   $server = $url . "v=" . $version . "&q=" .$keywords;
	   
	   
	   $ch = curl_init($server);
        curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
		
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_TIMEOUT, 10);
		curl_setopt($ch, CURLOPT_PORT, $port);
	
        $response = curl_exec($ch);
		  
        curl_close($ch);
				
	    return $response;		
	}
}    
