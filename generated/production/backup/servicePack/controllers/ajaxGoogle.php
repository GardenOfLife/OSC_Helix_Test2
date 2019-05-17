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
// Files: ajaxGoogle.php
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
	
	
	
class ajaxGoogle extends ControllerBase
{
    //This is the constructor for the custom controller. Do not modify anything within
    //this function.
	function ajaxGoogle()
	{
	    parent::__construct();
      
	}
    
    
	
	  function googleSearch()
    {
         
		 $keywords = $this->input->post('keywords');
		 $version = $this->input->post('version');
		 $url = $this->input->post('url');
	
	    $this->load->model('custom/Google_model');
        
        $results = $this->Google_model->doSearch($keywords, $version, $url);
		
		 echo $results;
	}
	
	
	
	
	
	
}

