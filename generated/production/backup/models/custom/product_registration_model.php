<?php

use RightNow\Connect\v1 as RNCPHP;
use RightNow\Connect\v1\ProdReg as RNCPHP_CO;

class Product_Registration_model extends Model
{

	function __construct()
    {
        parent::__construct();
        //This model would be loaded by using $this->load->model('custom/Sample_model');
    }

    function get_registered_products_by_contact()
    {        	
        $profile = $this->session->getProfile();	
		//require_once( "Connect_init.php" );	
        require_once( get_cfg_var("doc_root")."/ConnectPHP/Connect_init.php" );		
		
        try
    	{	
        	initConnectAPI( "co_user", "CO_password!" );

            $query = "select product_id, serial_number, purchased_date, purchased_location from ProdReg.ProductRegistration where c_id = ".$profile->c_id->value;
			$roql_result_set = RNCPHP_CO\ROQL::query( $query );		
			
			$roql_result = $roql_result_set->next();
	
		    unset($dataset);
			$dataset['total_num'] = 0;

			$dataset['headers'][0]["heading"] = "product_name";
			$dataset['headers'][1]["heading"] = "serial_number";
			$dataset['headers'][2]["heading"] = "purchased_location";
			$dataset['headers'][3]["heading"] = "purchased_date";
						
		    while ($row = $roql_result->next())
		    {
    			$sp = RNCPHP\ServiceProduct::fetch( $row['product_id'], RNCPHP\RNObject::VALIDATE_KEYS_OFF );
				$row['product_name']=$sp->Name;
				
			    $dataset['data'][$dataset['total_num']][0]=$row['product_name'];
			    $dataset['data'][$dataset['total_num']][1]=$row['serial_number'];		
			    $dataset['data'][$dataset['total_num']][2]=$row['purchased_location'];
			    $dataset['data'][$dataset['total_num']][3]=date('Y-m-d',strtotime($row['purchased_date']));	
				
				$dataset['total_num'] ++;			
		    }				
		} catch ( RNCPHP_CO\ConnectAPIError $err )
	    {
    	    $datasets['exception'] = $err->getMessage();
	    };		
		
        return($dataset);		
  	}

    function createRegistration($pairdata)
    {        
//		require_once( "Connect_init.php" );	
        require_once( get_cfg_var("doc_root")."/ConnectPHP/Connect_init.php" );
		
        try
    	{	
        	initConnectAPI( "co_user", "CO_password!" );

            $profile = $this->session->getProfile();	
			$registration = new RNCPHP_CO\ProductRegistration();
			
			$prod_lvl = count($pairdata["prod"]);
			if ( $prod_lvl > 0)
			{
    			$contact = RNCPHP\Contact::fetch( $profile->c_id->value, RNCPHP\RNObject::VALIDATE_KEYS_OFF );
	    		$sp = RNCPHP\ServiceProduct::fetch( $pairdata["prod"][$prod_lvl-1], RNCPHP\RNObject::VALIDATE_KEYS_OFF );			
			
 		    	$registration->c_id = $contact;
 			    $registration->product_id = $sp;
     			$registration->serial_number = $pairdata["serial_number"];
 	    		if ($pairdata["purchased_location"]) $registration->purchased_location = $pairdata["purchased_location"];
		    	else $registration->purchased_location = "";
 			    $registration->purchased_date = strtotime($pairdata["purchased_date"]);
     			$registration->created = time();
 	    		$registration->updated = time();
		 				
		    	$registration->save(RNCPHP_CO\RNObject::SuppressAll);						
                RNCPHP\ConnectAPI::commit(); 						 
			}
    	} catch ( RNCPHP_CO\ConnectAPIError $err )
	    {
    	    $response .= $err->getMessage();
	    };		
		
        return($response);		
					
  	}	
}


