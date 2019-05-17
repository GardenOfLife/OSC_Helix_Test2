<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');
//report define for use in prodreg_model file. the report id set here
//will be compared by the pre_report_get hook. if the currently executed report
//is equal to this id, a filter will be added with the filter name define for the currently
//logged in contact (by contact profile)
define(ENDUSER_PRODREG_REPORT_ID, 100031);
define(ENDUSER_PRODREG_CONTACT_FILTER, "ps_prodreg.c_id");

/**
 * getExclusion
 *
 * This array returned contains the product ID's that should be excluded from the 
 * Product Heirmenu Widget. As the ID's are unique they are level
 * independant.
 *
 * The ID's can be obtained in RightNow CRM by hovering over the product
 * item in the Product editor.
 *
 * Default: return(array());
 * Example: return(array(6,7,20,32,33,34));
 */

function getExclusion()
{
    // return array(); // default
    return array(7,20,32,33,34,23,41,42,43,31,65,66,67,22,38,39,40);
}

/**
* Custom validation function executed by prodreg model for enduser product registration create
*
* @return Array  Single indicy array with array index being error value, and value being error string
* @param $prod Array Name/value pair set of the product to be registered. Used for creating a registered
		product as an enduser
* NOTE: Custom error id's should begin @ -100 and higher
*/
function customCreateEnduserValidate(&$prod)
{
	//example of error on a particular serial number prefix
	//if($prod['sn'] == "abc123")
	//if(substr($prod['sn'], 0, 3) == "abc")
	//{
	//	return(array(-100=>'ABC invalid serial number prefix'));
	//}
	//example of changing a serial number
	//if($prod['sn'] == 'abc-12345')
	//{
	//	$prod['sn'] = "abc12345";
	//	return(array(1=>''));
	//}
}

/**
* Custom validation function executed by prodreg model for admin product registration create
*
* @return Array  Single indicy array with array index being error value, and value being error string
* @param $prod Array Name/value pair set of the product to be registered. Used for creating a registered
		product as an agent
* NOTE: Custom error id's should begin @ -100 and higher
*/
function customCreateAdminValidate(&$prod)
{
	//example of error on a particular serial number
	//if($prod['sn'] == "abc123")
	//{
	//	return(array(-100=>'ABC123 invalid serial number'));
	//}
	//example of changing a serial number
	//if($prod['sn'] == 'abc-12345')
	//{
	//	$prod['sn'] = "abc12345";
	//	return(array(1=>''));
	//}
}
