<?php

class ajaxRegistration extends ControllerBase
{
    //This is the constructor for the custom controller. Do not modify anything within
    //this function.
    function __construct()
    {
        parent::__construct();
    }

    /**
     * Sample function for ajaxCustom controller. This function can be called by sending
     * a request to /ci/ajaxCustom/ajaxFunctionHandler.
     */
    function ajaxFunctionHandler()
    {
        $postData = $this->input->post('post_data_name');
        //Perform logic on post data here
        echo $returnedInformation;
    }
	
    function createRegistration()
    {
        $postdata = json_decode($this->input->post('form'));

		unset($pairdata);
		foreach ($postdata as $pair)
		{
			$pairdata[$pair->name]=$pair->value;
		}
				
        $this->load->model('custom/Product_Registration_model');
        $response = $this->Product_Registration_model->createRegistration($pairdata);
		
		if ($response)
		{
			$results['status'] = -1;
			$results['message'] = $response;
			$results['sessionParm'] = sessionParm();
		}
		else		
		{
			$results['status'] = 1;			
			$results['sessionParm'] = sessionParm();
		}
		
        echo json_encode($results);
    }	
}

