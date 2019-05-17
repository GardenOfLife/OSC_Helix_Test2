<?php

use RightNow\Connect\v1 as RNCPHP;
use RightNow\Connect\v1\ProdReg as RNCPHP_CO_PRODREG;

class Roql_model extends Model
{

	function __construct()
    {
        parent::__construct();
        //This model would be loaded by using $this->load->model('custom/Sample_model');
    }


    function roql_tabular_query($query)
    {        
		require_once( "Connect_init.php" );

	    try
    	{	
	        initConnectAPI( "co_user", "CO_password!" );
		
			$roql_result_set = RNCPHP\ROQL::query( $query );	
			
			while ($roql_result = $roql_result_set->next())
			{		
			    unset($dataset);
				$dataset['count'] = 0;

    			while ($row = $roql_result->next())
	    		{			
		    		foreach ($row as $key => $value)
			    	{
				    	if ($dataset['count'] == 0)
					    {
						    $dataset['fields'][]=$key;
					    }
				
					    $dataset['rows'][$dataset['count']][]=$value;
				    }

				    $dataset['count'] ++;
			    }
				
				$datasets[] = $dataset;				
			}
		
		} catch ( RNCPHP\ConnectAPIError $err )
	    {
    	    $datasets['exception'] = $err->getMessage();
	    };


		return($datasets);

  	}
	
    function roql_object_query($query, $name_space)
    {        
		require_once( "Connect_init.php" );

	    try
    	{	
        	initConnectAPI( "co_user", "CO_password!" );

 			if (stristr($name_space,"ProdReg"))
			$roql_result_set = RNCPHP_CO_PRODREG\ROQL::queryObject( $query );				
			else
			$roql_result_set = RNCPHP\ROQL::queryObject( $query );				
			
			while ($roql_result = $roql_result_set->next())
			{		
			    unset($dataset);
				$dataset['count'] = 0;

			    while ($row = $roql_result->next())
			    {
				    $dataset['output'].=$this->print_object($row,4);
					$dataset['count'] ++;			
			    }
				
				$datasets[] = $dataset;				
			}			
		} catch ( RNCPHP\ConnectAPIError $err )
	    {
    	    $datasets['exception'] = $err->getMessage();
	    };		
		
        return($datasets);
  	}


    function print_object($co,$lvl_limit,$lvl_start=0)
	{	
		if (isset($co))
		{	
			if (is_object($co)||is_array($co))
			{			
				if (is_object($co))
					$object_name = get_class( $co );
				else				
					$object_name = "Array";
			
				if ($object_name)
				{				
    				$lvl_next = $lvl_start + 1;
			
	    			if ($lvl_start > 0) $ret = " ==> $object_name\n";		
		    		else $ret = "\n$object_name\n";
			
			    	if ($lvl_start >= $lvl_limit) return $ret;
		
	   			    $ret.= str_pad("",4*$lvl_start," ",STR_PAD_LEFT)."{\n";
					
					if (is_object($co))
						$this_array_keys = array_keys( get_class_vars( get_class( $co ) ) );
					else				
						$this_array_keys = array_keys( $co );
						
				    foreach ( $this_array_keys as $pName )
    				{
						//Ignore special object properties, such as _metadata.
						//Also ignore LookupName, waiting for bug fix
        	        	if (substr( ($pName), 0, 1)!="_" && $pName != "LookupName")
						{
                            if (is_object($co))
                                $next_object = $co->$pName;
                            else
                                $next_object = $co[$pName];
								
					    	$ret .=  str_pad("",4*$lvl_next," ",STR_PAD_LEFT)."[".$pName."]";
							$ret .=  $this->print_object($next_object,$lvl_limit,$lvl_next);
					    }
					}
				}
			
	   			$ret.= str_pad("",4*$lvl_start," ",STR_PAD_LEFT)."}\n";
		    }
			else
			{
				$ret = " ==> $co\n";
			}		
		}
		else
		{
			$ret = " ==> \n";	
		}
		
		return $ret;
	}
	
}


