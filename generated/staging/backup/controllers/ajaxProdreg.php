<?php

class ajaxProdreg extends ControllerBase
{
    //This is the constructor for the custom controller. Do not modify anything within
    //this function.
	function ajaxProdreg()
	{
	    parent::__construct();
		//rnow should automatically be loaded. if this line is left in, seems to produce a 404
        //$this->load->library('rnow');
	}
    
	/**
     * Controller to add a product registration by/for an enduser
     * Requires form fields for c_id,sn,product_id,purchase_month,purchase_day,purchase_year
	 * also required form field for 'form', which includes product hierarchy info
     * @return Array with status id, if status != 1, error string to be displayed to user
     */
	function prodregAddEnduser()
	{
		$this->load->model('custom/Prodreg_model');
		logMessage($this->input->post('sn'));
		if($this->input->post('form'))
            $data = json_decode($this->input->post('form'));
        else
        {
            echo msg_get_rnw(JAVASCRIPT_ENABLED_FEATURE_MSG);
            exit;
        }
		$profile = $this->session->getProfile();
		//c_id should already be an int, and serial number a string
		$prod['c_id'] = $profile->c_id->value;
		$prod['sn'] = $this->input->post('sn');
		//get the last value in the array set, minus 1 for indicy
		$prod['product_id'] = intval($data[0]->value[count($data[0]->value) - 1]);
		$prod['purchase_month'] = intval($this->input->post('month'));
		$prod['purchase_day'] = intval($this->input->post('day'));
		$prod['purchase_year'] = intval($this->input->post('year'));
		$this->Prodreg_model->setFlow(intval($this->input->post('flow_id')),
										$this->input->post('entry_point'));
		logMessage($prod);
		if(!$this->Prodreg_model->prodregExists($prod))
		{			
			$result = $this->Prodreg_model->createEnduser($prod);
			$results['status'] = $result;
			//return a blank sessionparm so it doesn't add 'undefined' to url
			$results['sessionParm'] = '';
			if($result != 1)
				$results['message'] = $this->Prodreg_model->createError2String($result);
			logMessage("cid: " . $profile->c_id->value);
			logMessage($data);
			logMessage($results);
			echo(json_encode($results));
		}
	}
	
	/**
     * Controller to add a product registration by/for an agent
     * Requires form fields for c_id,sn,created_by,product_id,purchase_month,purchase_day,purchase_year
	 * also required form field for 'form', which includes product hierarchy info
     * @return Array with status id, if status != 1, error string to be displayed to user
     */
	function prodregAddAdmin()
	{

		$this->load->model('custom/Prodreg_model');
		logMessage($this->input->post('sn'));
		if($this->input->post('form'))
            $data = json_decode($this->input->post('form'));
        else
        {
            echo msg_get_rnw(JAVASCRIPT_ENABLED_FEATURE_MSG);
            exit;
        }
		
		$prod['c_id'] = intval($this->input->post('c_id'));
		$prod['sn'] = $this->input->post('sn');
		$prod['created_by'] = intval($this->input->post('acct_id'));
		//get the last value in the array set, minus 1 for indicy
		$prod['product_id'] = intval($data[0]->value[count($data[0]->value) - 1]);
		$prod['purchase_month'] = intval($this->input->post('month'));
		$prod['purchase_day'] = intval($this->input->post('day'));
		$prod['purchase_year'] = intval($this->input->post('year'));
		$this->Prodreg_model->setFlow(intval($this->input->post('flow_id')),
											$this->input->post('entry_point'));
		if(!$this->Prodreg_model->prodregExists($prod))
		{
			$result = $this->Prodreg_model->createAdmin($prod);
			logMessage("cid: " . $this->input->post('c_id'));
			logMessage($data);
			logMessage($prod);
			//return a sessionParm - if cookies are off this should produce a value, and if they are on, blank
			$results['sessionParm'] = sessionParm();
			$results['status'] = $result;
			if($result != 1)
				$results['message'] = $this->Prodreg_model->createError2String($result);
			logMessage($results);
			echo(json_encode($results));
		}
	}
	
	/**
     * Controller to destroy a product registration by pr_id
     * 
     * @return Array with status id, if status != 1, error string to be displayed to user
     */
	function prodregDestroyAdmin()
	{
		$this->load->model('custom/Prodreg_model');
		logMessage($this->input->post('pr_id'));
		$result = $this->Prodreg_model->destroy($this->input->post('pr_id'));
		$results['status'] = $result;
		//if result is 1, it's success...so don't bother getting a message
		if($result != 1)
			$results['message'] = $this->Prodreg_model->destroyError2String($result);
		echo(json_encode($results));
	}

    /**
     * Controller to grab next level of hier items and update list without doing a page turn
     * 
     * @return string The next level of hier items
     */    
    function getHierValues()
    {   
        $this->load->model('standard/Prodcat_model');
        $this->load->model('custom/Prodreg_model');
        $filter = $this->input->post('filter');
        $level = $this->input->post('lvl');
        $id = $this->input->post('id');
        $linking = $this->input->post('linking');
        $results = $this->Prodcat_model->hierMenuGet($filter, $level, $id, $linking);

        // RN - 2009.01.16 - remove any excluded items from the list
        $exclude = $this->input->post('exclude');
        if ($exclude == 1)
            $this->Prodreg_model->removeExcludedProducts($results);

        echo json_encode($results);
    }
}
