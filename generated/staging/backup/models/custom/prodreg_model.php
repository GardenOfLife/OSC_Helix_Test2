<?php
//Prodreg model
//For use with the product registration module
//To be placed within 'euf/models/custom/prodreg_model.php

require_once( get_cfg_var("doc_root")."/include/ConnectPHP/Connect_init.phph" );

class Prodreg_model extends Model 
{
	var $flowId;
	var $entry;
	var $cId;
	//-1 not used, as that is a known error to the standard AJAX response mechanism
	//-2 and beyond at this point (nov '08) is generic, and will display the custom message
	var $destroyErrors = array(-2 => 'Attempting destroy with invalid pr_id',
							   -3 => 'Error return from destroy execute');
	var $createErrors = array(-2 => 'The product you are attempting to register already exists. This product may not be registered twice',
							  -3 => 'Data incomplete or missing. All fields must contain a value.',
							  -4 => 'Registration create failure',
							  -5 => 'Purchase date must be in the past');
	
    function Prodreg_model()
    {
        parent::Model();
		$this->CI =& get_instance();
        initConnectAPI();
    }
	
	 /**
     * Function to determine if a registration already exists for this product. To be used before attempting create
     *
     * @param $prod Array  Must have indicies for 'sn' and 'product_id', types string and int respectively
     * @return Bool True if there already exists 1 or more registrations for this product with this serial number.
	 *		False otherwise.
     */
	private function prodregExists($prod)
	{
		$query = sprintf("SELECT count(1) FROM ps_prodreg WHERE serial_number = '%s' AND product_id = %d",
						addslashes($prod['sn']), $prod['product_id']);
		$exists = sql_get_int($query);
		logMessage("prodregExists query: " . $query . ";; result: " . $exists);
		return(($exists >= 1) ? true : false);
	}
	
	/**
     * Function to run flow_execute if enough information is contained internally. if not, don't execute.
	 *		generally this should not cause an error.
     *
     * @return Mixed If flow executes, the return value from 'flow_execute', otherwise false.
     */
	private function executeFlowAsNecessary()
	{
		$flow_pairs['c_id'] = $this->cId;
		$flow_pairs['flow_id'] = $this->flowId;
		$flow_pairs['shortcut'] = $this->entry;
		logMessage($flow_pairs);
		if(($this->cId > 0) && ($this->flowId > 0) && (strlen($this->entry) > 0))
		{			
			logMessage("Preparing to execute flow");
			return(flow_execute($flow_pairs));
		}
		else
		{
			logMessage("Did not execute flow - information was missing");
			return(false);
		}
	}
	
	/**
     * Function to set the flow related internal parameters. Will log a message if the 'id' <= 0 or the string
	 * 		length of 'entry' <= 0
     *
     * @param $id Int  The id of the flow to be executed if/when the product registration is successful
     * @param $entry String  A shortcut name of an entry point within the flow id specified within 'id'
     */ 
	function setFlow($id,$entry)
	{
		if((intval($id) > 0) && (strlen($entry) > 0)){
			$this->flowId = intval($id);
			$this->entry = strval($entry);
		}
		else
		{
			logMessage("Not enough info to set flow. id: " . $id . "; entry: " . $entry);
		}
	}

	/**
     * Function to return error string for a particular create error id
     *
     * @return String  Existing error message, or blank if non existant
     * @param $err_id Int  The error id for desired create description string (intended to be used in 'message' portion of a 	 *		response from a controller function)
     */ 
	function createError2String($err_id){ return($this->createErrors[$err_id]);	}
	
	/**
     * Function to set a particular error id to have a different string (create errors)
     *
     * @param $err_id Int  The error id we will set the string for
	 * @param $str String  The error string to be associated with the err_id
     */ 
	function setCreateErrorString($err_id, $str){ $this->createErrors[$err_id] = $str; }
	
	/**
     * Function to return error string for a particular destroy error id
     *
     * @return String  Existing error message, or blank if non existant
     * @param $err_id Int  The error id for desired destroy description string (intended to be used in 'message' portion of 
	 * 		response from a controller function)
     */ 
	function destroyError2String($err_id){ return($this->destroyErrors[$err_id]); }

	/**
     * Function to set a particular error id to have a different string (destroy errors)
     *
     * @param $err_id Int  The error id we will set the string for
	 * @param $str String  The error string to be associated with the err_id
     */ 
	function setDestroyErrorString($err_id, $str){ $this->destroyErrors[$err_id] = $str; }

	/**
     * Function to create a registered product entry
     *
     * @return Int  1 on success, negative numbers as different errors
     * @param $prod Array Name/value pair set of the product to be registered. Used for creating a registered
	 		product as an enduser
		Required pairs in prod array: c_id, purchase_month, purchase_day, purchase_year, product_id, sn
     */ 
	function createEnduser($prod)
	{
		$ret = 1;		
		
		//sn is currently the only text field, but we need to clean it (spaces/etc around it)
		$prod['sn'] = trim($prod['sn']);
		
		//custom validation/modify hook functionality
		$this->load->helper('prodreg');
		if(function_exists('customCreateEnduserValidate'))
		{
			logMessage('Custom validation function exists - executing with following product:');
			logMessage($prod);
			$custom_ret = customCreateEnduserValidate($prod);
			//if not an array, not correctly formated return...move on
			if(is_array($custom_ret))
			{
				logMessage("Custom validation returned array with value:");
				logMessage($custom_ret);
				list($err_id,$err_str) = each($custom_ret);
				if($err_id != 1)
				{
					$this->setCreateErrorString($err_id,$err_str);
					return($err_id);
				}				
			}
			else
			{
				logMessage("invalid return from custom validate. not using");
			}
		}
		
		//check to see if this already exists. if so, error/exit
		if($this->prodregExists($prod))
		{
			//need to exit here...our registration already exists
			$ret = -2;
			logMessage("Registration for this product already exists. Returning: " . print_r($results, true));
			return($ret);
		}
		
		if($prod['purchase_month'] == 0 || $prod['purchase_day'] == 0 || $prod['purchase_year'] == 0)
		{
			$ret = -3;
			logMessage("Invalid date");
			return($ret);
		}
		
		$purchase_date_epoch = mktime(0,0,0,$prod['purchase_month'],$prod['purchase_day'], $prod['purchase_year']);
		
		$today_epoch = mktime(0,0,0);
		logMessage("Purchase date epoch: " . $purchase_date_epoch . "; Today epoch: " . $today_epoch);
		if($purchase_date_epoch > $today_epoch)
		{
			$ret = -5;
			logMessage("Purchase date in the future");
			return($ret);
		}
		
		if(($prod['c_id'] > 0) && ($prod['product_id'] > 0) && (strlen($prod['sn']) > 0) && ($purchase_date_epoch > 0))
		{
			//setting for flow execution
			$this->cId = $prod['c_id'];
			$insert = sprintf("INSERT INTO ps_prodreg (c_id, product_id, serial_number, purchased) VALUES (%d,%d,'%s','%s')", $prod['c_id'], $prod['product_id'], addslashes($prod['sn']), date('Y-m-d', $purchase_date_epoch));
			logMessage("insert: " . $insert);
			$insertRet = sql_exec_direct($insert);
			if($insertRet == 1)
			{
				//success - execute the campaign if it exists
				//at this point no error if the flow doesn't execute
				$exec_flow_res = $this->executeFlowAsNecessary();
				logMessage("exec flow result: " . $exec_flow_res);
			}
			else
			{
				logMessage("Error on insert - flow not executed");
				//insert failed for unknown reason
				$ret = -4;
			}
			logMessage("insertRet: " . $insertRet);
		}
		else
		{
			logMessage("Data missing - product not registered");
			logMessage($prod);
			logMessage("Purchase date: " . $purchase_date_epoch);
			//we have some missing data
			$ret = -3;
		}

		return($ret);
	}
	
	/**
     * Function to create a registered product entry
     *
     * @return Int  1 on success, negative numbers as different errors
     * @param $prod Array Name/value pair set of the product to be registered. Used for creating a registered
	 		product as an agent. Requires created_by pair in addition to set agent who created registration
     */ 
	function createAdmin($prod)
	{
		$ret = 1;
		
		//sn is currently the only text field, but we need to clean it (spaces/etc around it)
		$prod['sn'] = trim($prod['sn']);
		
		//custom validation/modify hook functionality
		$this->load->helper('prodreg');
		if(function_exists('customCreateAdminValidate'))
		{
			logMessage('Custom validation function exists - executing with following product:');
			logMessage($prod);
			$custom_ret = customCreateAdminValidate($prod);
			//if not an array, not correctly formated return...move on
			if(is_array($custom_ret))
			{
				logMessage("Custom validation returned array with value:");
				logMessage($custom_ret);
				list($err_id,$err_str) = each($custom_ret);
				if($err_id != 1)
				{
					$this->setCreateErrorString($err_id,$err_str);
					return($err_id);
				}				
			}
			else
			{
				logMessage("invalid return from custom validate. not using");
			}
		}
		
		//check to see if this already exists. if so, error/exit
		if($this->prodregExists($prod))
		{
			//need to exit here...our registration already exists
			//use -2 so we can append a custom message
			$ret = -2;
			logMessage("Registration for this product already exists. Returning: " . print_r($results, true));
			return($ret);
		}
		
		if($prod['purchase_month'] == 0 || $prod['purchase_day'] == 0 || $prod['purchase_year'] == 0)
		{
			$ret = -3;
			logMessage("Invalid date");
			return($ret);
		}
		
		$purchase_date_epoch = mktime(0,0,0,$prod['purchase_month'],$prod['purchase_day'],$prod['purchase_year']);
		
		$today_epoch = mktime(0,0,0);
		logMessage("Purchase date epoch: " . $purchase_date_epoch . "; Today epoch: " . $today_epoch);
		if($purchase_date_epoch > $today_epoch)
		{
			$ret = -5;
			logMessage("Purchase date in the future");
			return($ret);
		}
		
		if(($prod['c_id'] > 0) && ($prod['product_id'] > 0) && ($prod['created_by'] > 0) && (strlen($prod['sn']) > 0) && ($purchase_date_epoch > 0))
		{
			//setting for flow execution
			$this->cId = $prod['c_id'];
			$insert = sprintf("INSERT INTO ps_prodreg (c_id, product_id, serial_number, created_by, purchased) VALUES (%d,%d,'%s',%d,'%s')", $prod['c_id'], $prod['product_id'], addslashes($prod['sn']), $prod['created_by'], date('Y-m-d', $purchase_date_epoch));
			logMessage("insert: " . $insert);
			$insertRet = sql_exec_direct($insert);
			if($insertRet == 1)
			{
				//success - execute the campaign if it exists
				$exec_flow_res = $this->executeFlowAsNecessary();
				logMessage("exec flow result: " . $exec_flow_res);
			}
			else
			{
				logMessage("Error on insert - flow not executed");
				$ret = -4;
			}
			logMessage("insertRet: " . $insertRet);
		}
		else
		{
			logMessage("Data missing - product not registered");
			logMessage($prod);
			logMessage("Purchase date: " . $purchase_date_epoch);
			$ret = -3;
		}

		return($ret);
	}
	
	/**
     * Function to destroy a registered product entry
     *
     * @return Int  1 on success, negative numbers as different errors
     * @param $pr_id Int  The id of the registered product to be destroyed
     */ 
	function destroy($pr_id)
	{
		$ret = 1;
		if($pr_id > 0)
		{
			$query = sprintf("DELETE FROM ps_prodreg WHERE pr_id = %d", $pr_id);
			logMessage("delete query: " . $query);
			$ret = sql_exec_direct($query);
			if($ret > 1)
				$ret = -3;			
		}
		else
		{
			logMessage("Attempting to delete with <= 0 pr_id");
			$ret = -2;
		}
		
		return($ret);
	}

    function removeExcludedProducts(&$res)
    {
		$this->load->helper('prodreg');
		$psProdRegExclusion = getExclusion();

        if (!is_array($psProdRegExclusion))
            return;

        $arr = array();
        for ($i = 0; $i < count($res[0]); ++$i) {
            if (!in_array($res[0][$i][0], $psProdRegExclusion)) {
                $arr[] = $res[0][$i];
            }
        }

        logMessage($arr);
        $res[0] = $arr;
    }
	
	/**
     * Function to be called by pre_report_get hook function. Additions must be made to development/config/hooks.php file
     *
     * @param $phd Array  The array of pre hook data passed to the function.
	 *				phd['data']['reportId'],phd['data']['filters'],phd['data']['format']
     */
	function filterRegistrations4Contact(&$phd)
	{
		logMessage(sprintf("Entered pre_report_get hook: %s", print_r($phd, true)));
		$this->load->helper('prodreg');
		logMessage(sprintf("Prodreg helper loaded. Current report id: %d; ENDUSER_PRODREG_REPORT_ID: %d; ENDUSER_PRODREG_CONTACT_FILTER: %s",
		$phd['data']['reportId'], ENDUSER_PRODREG_REPORT_ID, ENDUSER_PRODREG_CONTACT_FILTER));
		if($phd['data']['reportId'] == ENDUSER_PRODREG_REPORT_ID)
		{
			//add filter. if it is not the report we care about, no other activity			
			$profile = $this->session->getProfile();
			$phd['data']['filters'][ENDUSER_PRODREG_CONTACT_FILTER]->filters->fltr_id = ENDUSER_PRODREG_CONTACT_FILTER;
			$phd['data']['filters'][ENDUSER_PRODREG_CONTACT_FILTER]->filters->oper_id =  1;
			$phd['data']['filters'][ENDUSER_PRODREG_CONTACT_FILTER]->filters->data = $profile->c_id->value;
			$phd['data']['filters'][ENDUSER_PRODREG_CONTACT_FILTER]->filters->rnSearchType = 'filter';
		}
		else
		{
			logMessage("This is not the product registration report - no filter modifications made");
		}

		logMessage(sprintf("Returning phd array: %s", print_r($phd, true)));
	}
}    
