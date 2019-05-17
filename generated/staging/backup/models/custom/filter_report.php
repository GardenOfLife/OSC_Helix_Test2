<?php
namespace Custom\Models;

class filter_report extends \RightNow\Models\Base
{
    function __construct()
    {
        parent::__construct();
    }

    function report_run(&$hookData)
    {
		$c_id = $this->CI->session->getProfileData('contactID');
		if(!empty($c_id)){
			
			if($hookData['data']['reportId'] == '100335')  
			 {
				// echo 'hello';
				   $hookData['data']['filters']['custom1']->filters->fltr_id = 2;            
				   $hookData['data']['filters']['custom1']->filters->oper_id = 1;        
				   $hookData['data']['filters']['custom1']->filters->data = $c_id;       
				   $hookData['data']['filters']['custom1']->filters->rnSearchType = 'custom';
			 } 
		}
    }
}
